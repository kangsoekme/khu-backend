import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";

const userRouter = new express.Router();
const siswaRouter = new express.Router();
const halaqohRouter = new express.Router();
import siswaController from "../controller/siswa-controller.js";
import userController from "../controller/user-controller.js";
import halaqohController from "../controller/halaqoh-controller.js";

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

siswaRouter.post(
  "/api/siswa",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN"]),
  siswaController.addSiswa,
);

siswaRouter.get(
  "/api/students",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN", "DIREKTUR"]),
  siswaController.getAllSiswa,
);

siswaRouter.get(
  "/api/student/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN", "DIREKTUR"]),
  siswaController.getSiswa,
);

siswaRouter.put(
  "/api/student/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN"]),
  siswaController.editSiswa,
);

siswaRouter.delete(
  "/api/student/:nis",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN"]),
  siswaController.deleteSiswa,
);

// halaqoh
halaqohRouter.post(
  "/api/halaqoh",
  authMiddleware.verifyToken,
  authMiddleware.requireRole(["SUPER_ADMIN", "DIREKTUR"]),
  halaqohController.addHalaqoh,
);

export { userRouter };
