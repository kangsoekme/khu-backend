import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  userValidation,
  editUserValidation,
  loginValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { v4 as uuid } from "uuid";

const addUser = async (request) => {
  const user = validate(userValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      email: user.email,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Data guru sudah terdaftar");
  }

  user.password = await bcrypt.hash(user.password, 10);

  if (user.role === "SUPER_ADMIN" || user.role === "DIREKTUR") {
    const countRole = await prismaClient.user.count({
      where: {
        role: user.role,
      },
    });

    if (countRole > 0) {
      throw new ResponseError(
        400,
        `Hanya boleh ada 1 akun untuk role ${user.role}`,
      );
    }
  }

  //  tambah user
  return prismaClient.user.create({
    data: user,
    select: {
      id: true,
      nama: true,
      email: true,
      no_telp: true,
      role: true,
      jenis_kelamin: true,
      is_sertifikasi: true,
      profile_photo: true,
    },
  });
};

const editUser = async (userId, request) => {
  const user = validate(editUserValidation, request);

  // validasi user sudah ada apa belum
  const countUser = await prismaClient.user.count({
    where: {
      id: userId,
    },
  });

  if (countUser === 0) {
    throw new ResponseError(404, "Data guru tidak ditemukan");
  }

  if (user.email) {
    const emailExist = await prismaClient.user.count({
      where: {
        email: user.email,
        id: {
          not: userId,
        },
      },
    });

    if (emailExist > 0) {
      throw new ResponseError(400, "User email already exist");
    }
  }

  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  return prismaClient.user.update({
    where: {
      id: userId,
    },
    data: user,
    select: {
      id: true,
      nama: true,
      email: true,
      no_telp: true,
      role: true,
      jenis_kelamin: true,
      is_sertifikasi: true,
      profile_photo: true,
    },
  });
};

const getUsers = async (page = 1, limit = 10, search = "", role = "") => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  // FE-1: dukung filter role di sisi server agar konsisten dengan pagination
  const where = {};
  if (search) {
    where.OR = [
      { nama: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (role) {
    where.role = role;
  }

  const totalData = await prismaClient.user.count({ where });
  const totalPages = Math.ceil(totalData / parseInt(limit));

  const data = await prismaClient.user.findMany({
    where,
    skip,
    take: parseInt(limit),
    select: {
      id: true,
      nama: true,
      email: true,
      no_telp: true,
      role: true,
      jenis_kelamin: true,
      is_sertifikasi: true,
      profile_photo: true,
    },
    orderBy: {
      nama: "asc",
    },
  });

  return {
    data,
    totalData,
    totalPages,
    currentPage: parseInt(page),
  };
};

const getUser = async (userId) => {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nama: true,
      email: true,
      no_telp: true,
      role: true,
      jenis_kelamin: true,
      is_sertifikasi: true,
      profile_photo: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  return user;
};

const login = async (request) => {
  const loginRequest = validate(loginValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      email: loginRequest.email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      nama: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new ResponseError(401, "Email or password is wrong");
  }

  const token = uuid();
  // Multi-device: buat baris session BARU (tidak menimpa session device lain).
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 jam
  await prismaClient.session.create({
    data: {
      token: token,
      user_id: user.id,
      expires_at: expiresAt,
    },
  });

  return { token: token, role: user.role, nama: user.nama };
};

const logout = async (token) => {
  // Hapus SATU session (device ini saja). Session device lain tetap aktif.
  if (!token) return;
  await prismaClient.session.deleteMany({ where: { token: token } });
};

const deleteUser = async (userId) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  return prismaClient.user.delete({
    where: { id: userId },
  });
};

const loginWali = async (request) => {
  const { nis, password } = request;

  if (!nis || !password) {
    throw new ResponseError(400, "NIS dan password harus diisi");
  }

  const siswa = await prismaClient.siswa.findUnique({
    where: { nis: nis },
    select: { nis: true, nama: true, tanggal_lahir: true },
  });

  if (!siswa) {
    throw new ResponseError(401, "NIS atau Tanggal Lahir salah");
  }

  const d = new Date(siswa.tanggal_lahir);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const expectedPassword = `${day}${month}${year}`;

  if (password !== expectedPassword) {
    throw new ResponseError(401, "NIS atau Tanggal Lahir salah");
  }

  const token = uuid();
  // Multi-device: buat baris session BARU untuk wali.
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 jam
  await prismaClient.session.create({
    data: {
      token: token,
      nis_siswa: siswa.nis,
      expires_at: expiresAt,
    },
  });

  return {
    token: token,
    role: "WALI",
    nama: siswa.nama,
    nis: siswa.nis,
  };
};

const deleteBulkUsers = async (userIds) => {
  if (!userIds || userIds.length === 0) {
    throw new ResponseError(400, "Tidak ada user yang dipilih");
  }
  return prismaClient.user.deleteMany({
    where: { id: { in: userIds } },
  });
};

export default {
  addUser,
  editUser,
  login,
  loginWali,
  getUsers,
  getUser,
  logout,
  deleteUser,
  deleteBulkUsers,
};
