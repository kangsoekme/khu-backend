import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";

const userRouter = new express.Router();
import siswaController from "../controller/siswa-controller.js";
import userController from "../controller/user-controller.js";
import halaqohController from "../controller/halaqoh-controller.js";
import setoranHafalanController from "../controller/hafalan-controller.js";
import hafalanController from "../controller/hafalan-controller.js";
import murajaahController from "../controller/murajaah-controller.js";
import tahsinController from "../controller/tahsin-controller.js";
import { uploadExcel } from "../middleware/upload-middleware.js";
import surahController from "../controller/surah-controller.js";
import dashboardController from "../controller/dashboard-controller.js";
import laporanController from "../controller/laporan-controller.js";
import ujianController from "../controller/ujian-controller.js";
import pengajuanUjianTahsinController from "../controller/pengajuan-ujian-tahsin-controller.js";
import backupController from "../controller/backup-controller.js";
import exportController from "../controller/export-controller.js";

// manajemen user

userRouter.post(
  "/api/user",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN"]),
  userController.addUser,
); // tambah user

userRouter.put(
  "/api/user/:id",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN"]),
  userController.editUser,
); // edit user

userRouter.get(
  "/api/users",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN", "DIREKTUR"]),
  userController.getUsers,
); // dapatkan semua user

userRouter.get(
  "/api/user/:id",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN", "DIREKTUR"]),
  userController.getUser,
); // dapatkan user tertentu

userRouter.delete(
  "/api/auth/logout",
  authMiddleware.verifyToken,
  userController.logout,
); // logout

userRouter.delete(
  "/api/user/:id",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN"]),
  userController.deleteUser,
); // delete user

// siswa

userRouter.post(
  "/api/student",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN"]),
  siswaController.addSiswa,
);

userRouter.get(
  "/api/students",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN", "DIREKTUR"]),
  siswaController.getAllSiswa,
);

userRouter.get(
  "/api/student/:nis",
  authMiddleware.verifyToken,
  siswaController.getSiswa,
);

userRouter.put(
  "/api/student/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN"]),
  siswaController.editSiswa,
);

userRouter.delete(
  "/api/student/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN"]),
  siswaController.deleteSiswa,
);

// halaqoh
userRouter.post(
  "/api/halaqoh",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN", "DIREKTUR"]),
  halaqohController.addHalaqoh,
);

userRouter.get(
  "/api/halaqoh",
  authMiddleware.verifyToken,
  halaqohController.getAllHalaqoh,
);

userRouter.get(
  "/api/halaqoh/:id",
  authMiddleware.verifyToken,
  halaqohController.getHalaqoh,
);

userRouter.put(
  "/api/halaqoh/:id",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN", "DIREKTUR"]),
  halaqohController.updateHalaqoh,
);

userRouter.delete(
  "/api/halaqoh/:id",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN", "DIREKTUR"]),
  halaqohController.deleteHalaqoh,
);

// hafalan
userRouter.post(
  "/api/assessment/tahfidz/hafalan/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["GURU"]),
  hafalanController.addHafalan,
);

userRouter.get(
  "/api/assessment/tahfidz/hafalan/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN", "DIREKTUR", "GURU"]),
  hafalanController.getRiwayatHafalan,
);

// murajaah
userRouter.post(
  "/api/assessment/tahfidz/murajaah/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["GURU"]),
  murajaahController.addMurajaah,
);

userRouter.get(
  "/api/assessment/tahfidz/murajaah/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN", "DIREKTUR", "GURU"]),
  murajaahController.getRiwayatMurajaah,
);

// tahsin

userRouter.post(
  "/api/assessment/tahsin/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["GURU"]),
  tahsinController.addTahsin,
);

userRouter.get(
  "/api/assessment/tahsin/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN", "DIREKTUR", "GURU"]),
  tahsinController.getRiwayatTahsin,
);

userRouter.post(
  "/api/student/import",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN"]),
  uploadExcel.single("file"),
  siswaController.importSiswaExcel,
);

// pretest

userRouter.post(
  "/api/assessment/pretest/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["DIREKTUR"]),
  tahsinController.addPretest,
);

// database Al-Quran

userRouter.get("/api/all-surah", surahController.getAllSurah);

// dashboard

userRouter.get(
  "/api/dashboard/super-admin",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN"]),
  dashboardController.getSuperAdminDashboard,
);

userRouter.get(
  "/api/dashboard/direktur",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["DIREKTUR"]),
  dashboardController.getDirekturDashboard,
);

userRouter.get(
  "/api/dashboard/guru",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["GURU"]),
  dashboardController.getGuruDashboard,
);

// laporan

userRouter.get(
  "/api/laporan/tahfidz",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["DIREKTUR"]),
  laporanController.getLaporanTahfidz,
);

userRouter.get(
  "/api/laporan/tahsin",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["DIREKTUR"]),
  laporanController.getLaporanTahsin,
);

userRouter.get(
  "/api/laporan/guru/tahfidz",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["GURU"]),
  laporanController.getLaporanGuruTahfidz,
);

userRouter.get(
  "/api/laporan/guru/tahsin",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["GURU"]),
  laporanController.getLaporanGuruTahsin,
);

// ujian kenaikan

userRouter.post(
  "/api/ujian/tahsin/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["DIREKTUR"]),
  ujianController.addUjianKenaikanTahsin,
);

userRouter.get(
  "/api/ujian/tahsin/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["DIREKTUR"]),
  ujianController.getRiwayatUjianSiswa,
);

// pengajuan ujian

userRouter.post(
  "/api/pengajuan/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["GURU"]),
  pengajuanUjianTahsinController.addPengajuan,
);

userRouter.get(
  "/api/pengajuan/",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["DIREKTUR"]),
  pengajuanUjianTahsinController.getDaftarPengajuan,
);

// backup

userRouter.get(
  "/api/backup",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN"]),
  backupController.backupDatabase,
);

// export

userRouter.get(
  "/api/export/jamai",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN", "DIREKTUR", "GURU"]),
  exportController.exportJamai,
);

userRouter.get(
  "/api/export/individual/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN", "DIREKTUR", "GURU"]),
  exportController.exportIndividual,
);

export { userRouter };
