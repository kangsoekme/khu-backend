import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  editSiswaValidation,
  siswaValidation,
} from "../validation/siswa-validation.js";
import { validate } from "../validation/validation.js";

const formatKelas = (kelasInput) => {
  if (!kelasInput) return kelasInput;

  const regex = /^([1-6]|I{1,3}|IV|V|VI)[\s-]*([a-zA-Z])$/i;

  const match = kelasInput.match(regex);

  if (match) {
    const angkaRomawi = {
      1: "I",
      2: "II",
      3: "III",
      4: "IV",
      5: "V",
      6: "VI",
    };
    const romawi = angkaRomawi[match[1]] || match[1].toUpperCase();

    const huruf = match[2].toUpperCase();

    return `${romawi}-${huruf}`;
  }

  return kelasInput.toUpperCase();
};

const addSiswa = async (request) => {
  if (request.kelas) {
    request.kelas = formatKelas(request.kelas);
  }

  const siswa = validate(siswaValidation, request);

  const countSiswa = await prismaClient.siswa.count({
    where: {
      nis: siswa.nis,
    },
  });

  if (countSiswa === 1) {
    throw new ResponseError(400, "Data siswa sudah terdaftar");
  }

  const tahunAkademik = await prismaClient.tahun_Akademik.findFirst({
    where: { is_active: true },
  });

  if (!tahunAkademik) {
    throw new ResponseError(400, "Tahun akademik belum diatur");
  }

  return prismaClient.siswa.create({
    data: {
      nis: request.nis,
      nama: request.nama,
      jenis_kelamin: request.jenis_kelamin,
      tanggal_lahir: request.tanggal_lahir,
      alamat: request.alamat,
      nama_wali: request.nama_wali,
      no_telp: request.no_telp,
      profile_photo: request.profile_photo,

      riwayatKelas: {
        create: {
          tahun_id: tahunAkademik.id,
          nama_kelas: request.kelas,
          status: "AKTIF",
        },
      },
    },
    select: {
      nis: true,
      nama: true,
      jenis_kelamin: true,
      tanggal_lahir: true,
      alamat: true,
      nama_wali: true,
      no_telp: true,

      riwayatKelas: {
        where: { status: "AKTIF" },
        select: { nama_kelas: true },
      },

      profile_photo: true,
      createdAt: true,
      updatedAt: true,

      halaqoh_tahfidz_id: true,
      halaqoh_tahsin_id: true,

      tahapan_tahsin: true,
    },
  });
};

const editSiswa = async (nis, request) => {
  if (request.kelas) {
    request.kelas = formatKelas(request.kelas);
  }

  const siswa = validate(editSiswaValidation, request);

  const countSiswa = await prismaClient.siswa.count({
    where: {
      nis: nis,
    },
  });

  if (countSiswa === 0) {
    throw new ResponseError(404, "Data siswa tidak ditemukan");
  }

  const tahunAkademik = await prismaClient.tahun_Akademik.findFirst({
    where: { is_active: true },
  });

  if (!tahunAkademik) {
    throw new ResponseError(400, "Tahun akademik belum diatur");
  }

  return prismaClient.siswa.update({
    where: { nis: nis },
    data: {
      nis: request.nis,
      nama: request.nama,
      jenis_kelamin: request.jenis_kelamin,
      tanggal_lahir: request.tanggal_lahir,
      alamat: request.alamat,
      nama_wali: request.nama_wali,
      no_telp: request.no_telp,
      profile_photo: request.profile_photo,

      riwayatKelas: {
        updateMany: {
          where: {
            status: "AKTIF",
          },
          data: {
            nama_kelas: request.kelas,
          },
        },
      },
    },
    select: {
      nis: true,
      nama: true,
      jenis_kelamin: true,
      tanggal_lahir: true,
      alamat: true,
      nama_wali: true,
      no_telp: true,

      riwayatKelas: {
        where: { status: "AKTIF" },
        select: { nama_kelas: true },
      },

      profile_photo: true,
      createdAt: true,
      updatedAt: true,

      halaqoh_tahfidz_id: true,
      halaqoh_tahsin_id: true,

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

      riwayatKelas: {
        where: { status: "AKTIF" },
        select: { nama_kelas: true },
      },

      profile_photo: true,
      createdAt: true,
      updatedAt: true,

      halaqoh_tahfidz_id: true,
      halaqoh_tahsin_id: true,

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

      riwayatKelas: {
        where: { status: "AKTIF" },
        select: { nama_kelas: true },
      },

      profile_photo: true,
      createdAt: true,
      updatedAt: true,

      halaqoh_tahfidz: {
        select: { id: true, nama: true },
      },
      halaqoh_tahsin: {
        select: { id: true, nama: true },
      },

      tahapan_tahsin: true,
    },
  });

  if (!siswa) {
    throw new ResponseError(404, "Data siswa sudah terdaftar");
  }

  return siswa;
};

const deleteSiswa = async (nis) => {
  const siswa = await prismaClient.siswa.findUnique({
    where: { nis: nis },
  });

  if (!siswa) {
    throw new ResponseError(404, "Data siswa tidak ditemukan");
  }

  await prismaClient.setoran_Hafalan.deleteMany({
    where: { nis_siswa: nis },
  });

  await prismaClient.setoran_Tahsin.deleteMany({
    where: { nis_siswa: nis },
  });

  await prismaClient.setoran_Murajaah.deleteMany({
    where: { nis_siswa: nis },
  });

  await prismaClient.ujian_Kenaikan.deleteMany({
    where: { nis_siswa: nis },
  });

  await prismaClient.ujian_Pretest.deleteMany({
    where: { nis_siswa: nis },
  });

  await prismaClient.riwayat_Kelas.deleteMany({
    where: { nis_siswa: nis },
  });

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
