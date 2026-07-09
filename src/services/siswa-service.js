import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  editSiswaValidation,
  siswaValidation,
} from "../validation/siswa-validation.js";
import { validate } from "../validation/validation.js";

const addSiswa = async (request) => {
  const siswa = validate(siswaValidation, request);

  const countSiswa = await prismaClient.siswa.count({
    where: {
      nis: siswa.nis,
    },
  });

  if (countSiswa === 1) {
    throw new ResponseError(400, "Data siswa sudah terdaftar");
  }

  return prismaClient.siswa.create({
    data: siswa,
    select: {
      nis: true,
      nama: true,
      jenis_kelamin: true,
      tanggal_lahir: true,
      alamat: true,
      nama_wali: true,
      no_telp: true,
      kelas: true,
      profile_photo: true,
      createdAt: true,
      updatedAt: true,

      halaqoh_tahfidz_id: true,
      halaqoh_tahfidz_id: true,

      tahapan_tahsin: true,
    },
  });
};

const editSiswa = async (nis, request) => {
  const siswa = validate(editSiswaValidation, request);

  const countSiswa = await prismaClient.siswa.count({
    where: {
      nis: nis,
    },
  });

  if (countSiswa === 0) {
    throw new ResponseError(400, "Data siswa sudah terdaftar");
  }

  return prismaClient.siswa.update({
    where: { nis: nis },
    data: siswa,
    select: {
      nis: true,
      nama: true,
      jenis_kelamin: true,
      tanggal_lahir: true,
      alamat: true,
      nama_wali: true,
      no_telp: true,
      kelas: true,
      profile_photo: true,
      createdAt: true,
      updatedAt: true,

      halaqoh_tahfidz_id: true,
      halaqoh_tahfidz_id: true,

      tahapan_tahsin: true,
    },
  });
};

const getAllSiswa = async () => {
  return await prismaClient.siswa.findMany({
    select: {
      nis: true,
      nama: true,
      jenis_kelamin: true,
      tanggal_lahir: true,
      alamat: true,
      nama_wali: true,
      no_telp: true,
      kelas: true,
      profile_photo: true,
      createdAt: true,
      updatedAt: true,

      halaqoh_tahfidz_id: true,
      halaqoh_tahfidz_id: true,

      tahapan_tahsin: true,
    },
    orderBy: {
      nama: "asc",
    },
  });
};

const getSiswa = async (nis) => {
  const siswa = await prismaClient.siswa.findUnique({
    where: {
      nis: nis,
    },
    select: {
      nis: true,
      nama: true,
      jenis_kelamin: true,
      tanggal_lahir: true,
      alamat: true,
      nama_wali: true,
      no_telp: true,
      kelas: true,
      profile_photo: true,
      createdAt: true,
      updatedAt: true,

      halaqoh_tahfidz_id: true,
      halaqoh_tahfidz_id: true,

      tahapan_tahsin: true,
    },
  });

  if (!siswa) {
    throw new ResponseError(400, "Data siswa sudah terdaftar");
  }

  return siswa;
};

const deleteSiswa = async (nis) => {
  const siswa = await prismaClient.siswa.findUnique({
    where: { nis: nis },
  });

  if (!siswa) {
    throw new ResponseError(400, "Data siswa sudah terdaftar");
  }

  return prismaClient.siswa.delete({
    where: { nis: nis },
  });
};

export default {
  addSiswa,
  editSiswa,
  getAllSiswa,
  getSiswa,
  deleteSiswa,
};
