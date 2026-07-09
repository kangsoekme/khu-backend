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
  // untuk uuid

  // validasi skema input
  const user = validate(userValidation, request);

  // validasi user sudah ada apa belum
  const countUser = await prismaClient.user.count({
    where: {
      email: user.email,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Data guru sudah terdaftar");
  }

  user.password = await bcrypt.hash(user.password, 10);

  //  tambah user
  return prismaClient.user.create({
    data: user,
    select: {
      id: true,
      nama: true,
      email: true,
      no_telp: true,
      role: true,
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
      profile_photo: true,
    },
  });
};

const getUsers = async () => {
  return await prismaClient.user.findMany({
    select: {
      id: true,
      nama: true,
      email: true,
      no_telp: true,
      role: true,
      profile_photo: true,
    },
    orderBy: {
      nama: "asc",
    },
  });
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
      email: true,
      password: true,
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

  return prismaClient.user.update({
    data: {
      token: token,
    },
    where: {
      email: user.email,
    },
    select: { token: true },
  });
};

const logout = async (email) => {
  const user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  return prismaClient.user.update({
    where: {
      email: email,
    },
    data: {
      token: null,
    },
    select: {
      email: true,
    },
  });
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

export default {
  addUser,
  editUser,
  login,
  getUsers,
  getUser,
  logout,
  deleteUser,
};
