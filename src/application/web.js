import express from "express";
import cors from "cors";

import { publicRouter } from "../routes/public-api.js";
import { userRouter } from "../routes/api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

export const web = express();

// Percayai reverse proxy (Docker/Nginx) agar req.ip berisi IP client asli,
// bukan IP proxy internal. Tanpa ini, rate limiter & logging akan
// mengelompokkan semua user ke satu IP proxy yang sama.
// '1' = percayai satu hop proxy paling dekat (cukup untuk 1 lapis Nginx/Docker).
web.set("trust proxy", 1);

// SEC-4: batasi CORS ke origin yang dikenal, bukan wildcard '*'.
// Izinkan origin frontend lokal (dev & preview) serta origin produksi.
// FRONTEND_URL WAJIB diset di production (lihat docker-compose.yaml / .env).
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:5174", // Vite dev server (port cadangan)
  "http://localhost:5000", // backend serve frontend (jika ada)
  "http://127.0.0.1:5173",
  // Frontend produksi (Vercel). Selain ini, semua *.vercel.app juga
  // diizinkan via allowedOriginPatterns di bawah (untuk preview deployment).
  "https://khu-frontend.vercel.app",
  process.env.FRONTEND_URL, // origin produksi via env (WAJIB di production)
  // dukung beberapa origin produksi dipisah koma: FRONTEND_URL="https://a.com,https://b.com"
  ...(process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((o) => o.trim()).filter(Boolean)
    : []),
].filter((v, i, arr) => v && arr.indexOf(v) === i); // dedupe + hapus falsy

// Pattern origin yang diizinkan (regex). Dipakai untuk platform yang generate
// banyak subdomain dinamis seperti Vercel (preview deployment).
// Vercel format: https://<project>.vercel.app, https://<project>-<hash>-<scope>.vercel.app
const allowedOriginPatterns = [
  /^https:\/\/[\w-]+\.vercel\.app$/, // semua subdomain *.vercel.app
];

const isOriginAllowed = (origin) => {
  if (!origin) return true; // request non-browser (curl, Postman, server-to-server)
  if (allowedOrigins.includes(origin)) return true; // exact match
  return allowedOriginPatterns.some((pattern) => pattern.test(origin)); // regex
};

web.use(
  cors({
    origin(origin, callback) {
      // FIX: jangan throw Error (menyebabkan 500 + crash pada preflight OPTIONS).
      // Cukup kembalikan false — cors akan mengirim response tanpa header
      // Access-Control-Allow-Origin, sehingga browser memblokirnya dengan pesan
      // CORS yang jelas (bukan 500 server error yang membingungkan).
      callback(null, isOriginAllowed(origin));
    },
    credentials: true,
    // Expose Content-Disposition agar frontend bisa membaca nama file resmi
    // yang ditetapkan server saat mengunduh laporan (fetch + blob download).
    exposedHeaders: ["Content-Disposition"],
  }),
);
web.use(express.json());
web.use(publicRouter);
web.use(userRouter);
web.use(errorMiddleware);
