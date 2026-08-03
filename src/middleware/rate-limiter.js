/**
 * Rate limiter sederhana berbasis in-memory (tanpa dependensi eksternal).
 *
 * Bug yang diperbaiki: SEC-3 — tidak ada rate-limiting pada endpoint login,
 * sehingga brute-force password (terutama kata sandi wali = tanggal lahir)
 * dapat dilakukan tanpa hambatan.
 *
 * Implementasi ini menyimpan hitungan percobaan per IP+path di memory.
 * Cocok untuk single-instance deployment. Untuk multi-instance, gunakan
 * redis-based rate limiter (express-rate-limit + redis-store).
 *
 * Catatan: trust proxy WAJIB di-set di app Express (web.set("trust proxy", 1))
 * agar req.ip berisi IP client asli di belakang Docker/Nginx. Tanpa itu,
 * semua user berbagi satu IP proxy dan rate limit jadi tidak efektif.
 */

const store = new Map(); // key: `${ip}:${path}` → { count, resetAt }

/**
 * Ekstrak IP client asli. X-Forwarded-For diprioritaskan agar di belakang
 * reverse proxy, IP client asli (bukan IP proxy) yang dipakai sebagai key.
 */
function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string") {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
}

/**
 * Reset counter rate limit untuk key tertentu (dipakai saat login sukses).
 * @param {object} req  Express request (untuk membaca IP + path)
 */
function resetLimit(req) {
  const ip = getClientIp(req);
  const path = req.path || req.url;
  store.delete(`${ip}:${path}`);
}

/**
 * Buat middleware rate limiter.
 * @param {object} opts
 * @param {number} opts.windowMs  Jendela waktu dalam milidetik (default 15 menit)
 * @param {number} opts.max        Maksimum request per jendela (default 5)
 * @param {string} opts.message    Pesan error saat limit tercapai
 * @param {boolean} opts.skipSuccessfulRequests  Jika true, counter di-reset
 *   ketika request berikutnya berhasil (login sukses) — user sah tidak
 *   menguras kuota karena lupa password lalu berhasil login. Default: true.
 */
const rateLimit = (opts = {}) => {
  const windowMs = opts.windowMs || 15 * 60 * 1000; // 15 menit
  const max = opts.max || 5;
  const message =
    opts.message ||
    "Terlalu banyak percobaan. Silakan coba lagi nanti.";
  const skipSuccessfulRequests = opts.skipSuccessfulRequests !== false; // default true

  return (req, res, next) => {
    const ip = getClientIp(req);
    const path = req.path || req.url;
    const key = `${ip}:${path}`;
    const now = Date.now();

    let record = store.get(key);

    // Reset record jika jendela waktu sudah lewat
    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + windowMs };
      store.set(key, record);
    }

    record.count += 1;

    if (record.count > max) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({
        status: "error",
        message,
        retryAfter,
      });
    }

    // Jika diaktifkan, reset counter ketika request ini berakhir sukses (2xx).
    // Mencegah user sah terblokir hanya karena sebelumnya salah ketik password.
    if (skipSuccessfulRequests) {
      res.on("finish", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          store.delete(key);
        }
      });
    }

    next();
  };
};

export { resetLimit };
export default rateLimit;

// Pembersihan periodik untuk mencegah memory leak (setiap 10 menit)
if (!global._rateLimitCleanupStarted) {
  global._rateLimitCleanupStarted = true;
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetAt) store.delete(key);
    }
  }, 10 * 60 * 1000).unref?.();
}
