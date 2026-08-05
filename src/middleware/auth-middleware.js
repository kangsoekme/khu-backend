import { prismaClient } from "../application/database.js";

// Multi-device auth: token disimpan di tabel Session (1 user → banyak session).
// verifyToken mencari session berdasarkan token, lalu rekonstruksi req.user
// dengan bentuk yang SAMA PERSIS seperti implementasi lama agar semua controller
// yang membaca req.user.{id, email, nis, role} tidak perlu diubah:
//   - session milik User  → req.user = user  (dapat id, email, role enum asli)
//   - session milik Siswa → req.user = {...siswa, role: "WALI"} (dapat nis)
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: "error",
        message: "Access denied, token not found",
      });
    }

    const token = authHeader.split(" ")[1] || authHeader;

    const session = await prismaClient.session.findUnique({
      where: { token: token },
      include: { user: true, siswa: true },
    });

    if (!session) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    // Cek kedaluwarsa sesi. Jika lewat, hapus baris session & tolak.
    if (session.expires_at && new Date() > new Date(session.expires_at)) {
      await prismaClient.session.delete({ where: { id: session.id } });
      return res.status(401).json({
        status: "error",
        message: "Sesi berakhir, silakan login kembali",
      });
    }

    // Rekonstruksi req.user dengan bentuk yang kompatibel dengan implementasi lama.
    if (session.user) {
      // Session milik User (admin/guru/direktur). req.user = full User row.
      req.user = session.user;
    } else if (session.siswa) {
      // Session milik wali. Inject role "WALI" seperti implementasi lama.
      req.user = { ...session.siswa, role: "WALI" };
    } else {
      // Session tanpa relasi (data inkonsisten) — hapus & tolak.
      await prismaClient.session.delete({ where: { id: session.id } });
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    // Simpan raw token agar controller logout bisa hapus session ini persis.
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!req.user || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied, role prohibited",
      });
    }
    next();
  };
};

export default { verifyToken, requireRole };
