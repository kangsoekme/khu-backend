import express from "express";

import userController from "../controller/user-controller.js";
import rateLimit from "../middleware/rate-limiter.js";

const publicRouter = new express.Router();

// SEC-3: batasi percobaan login untuk mencegah brute-force
// (khususnya kata sandi wali = tanggal lahir yang mudah ditebak).
//
// max: 20 per 15 menit per IP-asli (via trust proxy + x-forwarded-for).
// skipSuccessfulRequests aktif (default): login yang BERHASIL mereset counter,
// jadi user sah yang typo beberapa kali lalu sukses tidak menguras kuota.
// 20 cukup longgar untuk traffic login normal (banyak user pagi hari / di
// belakang NAT sekolah) namun tetap membatasi brute-force.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 20, // 20 percobaan per 15 menit per IP-asli
  message: "Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.",
});

publicRouter.post("/api/auth/login", loginLimiter, userController.login);
publicRouter.post(
  "/api/auth/wali/login",
  loginLimiter,
  userController.loginWali,
);

// Health check untuk platform deploy (Render/Railway/Docker).
// Dipanggil berkala oleh Render untuk memastikan service "hidup".
// Tidak butuh auth, tidak akses DB supaya ringan & cepat.
publicRouter.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "khu-backend",
    timestamp: new Date().toISOString(),
  });
});

export { publicRouter };
