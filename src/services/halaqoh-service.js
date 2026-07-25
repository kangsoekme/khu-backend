import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  editHalaqohValidation,
  halaqohValidation,
} from "../validation/halaqoh-validation.js";
import { validate } from "../validation/validation.js";

const addHalaqoh = async (request) => {
  const halaqoh = validate(halaqohValidation, request);

  const guru = await prismaClient.user.findUnique({
    where: { id: halaqoh.userId },
  });

  if (!guru) {
    throw new ResponseError(404, "Data user tidak ditemukan");
  }

  if (guru.role !== "GURU") {
    throw new ResponseError(400, "User bukan Muhassin / Muhaffidz");
  }

  return prismaClient.halaqoh.create({
    data: {
      nama: halaqoh.nama,
      kategori: halaqoh.kategori,
      user: { connect: { id: halaqoh.userId } },
      ...(halaqoh.kategori === "TAHSIN"
        ? {
            siswaTahsin: {
              connect: halaqoh.nis_siswa.map((nis) => ({ nis: nis })),
            },
          }
        : {
            siswaTahfidz: {
              connect: halaqoh.nis_siswa.map((nis) => ({ nis: nis })),
            },
          }),
    },
    include: {
      user: {
        select: {
          id: true,
          nama: true,
          no_telp: true,
        },
      },
      siswaTahsin:
        halaqoh.kategori === "TAHSIN"
          ? {
              select: {
                nis: true,
                nama: true,

                riwayatKelas: {
                  where: { status: "AKTIF" },
                  select: { nama_kelas: true },
                },

                alamat: true,
                no_telp: true,
              },
            }
          : false,
      siswaTahfidz:
        halaqoh.kategori === "TAHFIDZ"
          ? {
              select: {
                nis: true,
                nama: true,

                riwayatKelas: {
                  where: { status: "AKTIF" },
                  select: { nama_kelas: true },
                },

                alamat: true,
                no_telp: true,
              },
            }
          : false,
    },
  });
};

const getAllHalaqoh = async () => {
  return prismaClient.halaqoh.findMany({
    include: {
      user: {
        select: { id: true, nama: true, no_telp: true },
      },
      siswaTahsin: {
        select: {
          nis: true,
          nama: true,

          riwayatKelas: {
            where: { status: "AKTIF" },
            select: { nama_kelas: true },
          },

          alamat: true,
          no_telp: true,
        },
      },
      siswaTahfidz: {
        select: {
          nis: true,
          nama: true,

          riwayatKelas: {
            where: { status: "AKTIF" },
            select: { nama_kelas: true },
          },

          alamat: true,
          no_telp: true,
        },
      },
    },
  });
};

const getHalaqoh = async (halaqohId) => {
  const halaqoh = await prismaClient.halaqoh.findUnique({
    where: { id: halaqohId },
    include: {
      user: {
        select: { id: true, nama: true, no_telp: true },
      },
      siswaTahsin: {
        select: {
          nis: true,
          nama: true,

          riwayatKelas: {
            where: { status: "AKTIF" },
            select: { nama_kelas: true },
          },

          alamat: true,
          no_telp: true,
        },
      },
      siswaTahfidz: {
        select: {
          nis: true,
          nama: true,

          riwayatKelas: {
            where: { status: "AKTIF" },
            select: { nama_kelas: true },
          },

          alamat: true,
          no_telp: true,
        },
      },
    },
  });

  if (!halaqoh) {
    throw new ResponseError(404, "Halaqoh tidak ditemukan");
  }

  return halaqoh;
};

const editHalaqoh = async (halaqohId, request) => {
  const halaqoh = validate(editHalaqohValidation, request);

  const exitingHalaqoh = await prismaClient.halaqoh.findUnique({
    where: {
      id: halaqohId,
    },
  });

  if (!exitingHalaqoh) {
    throw new ResponseError(404, "Halaqoh not found");
  }

  const guru = await prismaClient.user.findUnique({
    where: { id: halaqoh.userId },
  });

  if (!guru) {
    throw new ResponseError(404, "Data user tidak ditemukan");
  }

  if (guru.role !== "GURU") {
    throw new ResponseError(400, "User bukan Muhassin / Muhaffidz");
  }

  return prismaClient.halaqoh.update({
    where: { id: halaqohId },
    data: {
      nama: halaqoh.nama,
      kategori: halaqoh.kategori,
      user: { connect: { id: halaqoh.userId } },
      siswaTahsin: {
        set:
          halaqoh.kategori === "TAHSIN"
            ? halaqoh.nis_siswa.map((nis) => ({ nis: nis }))
            : [],
      },
      siswaTahfidz: {
        set:
          halaqoh.kategori === "TAHFIDZ"
            ? halaqoh.nis_siswa.map((nis) => ({ nis: nis }))
            : [],
      },
    },
    include: {
      user: {
        select: { id: true, nama: true, no_telp: true },
      },
      siswaTahsin: {
        select: {
          nis: true,
          nama: true,

          riwayatKelas: {
            where: { status: "AKTIF" },
            select: { nama_kelas: true },
          },

          alamat: true,
          no_telp: true,
        },
      },
      siswaTahfidz: {
        select: {
          nis: true,
          nama: true,

          riwayatKelas: {
            where: { status: "AKTIF" },
            select: { nama_kelas: true },
          },

          alamat: true,
          no_telp: true,
        },
      },
    },
  });
};

const deleteHalaqoh = async (halaqohId) => {
  const halaqoh = await prismaClient.halaqoh.findUnique({
    where: {
      id: halaqohId,
    },
  });

  if (!halaqoh) {
    throw new ResponseError(404, "Halaqoh not found");
  }

  await prismaClient.setoran_Hafalan.deleteMany({
    where: { halaqohId: halaqohId },
  });

  await prismaClient.setoran_Tahsin.deleteMany({
    where: { id_kelompok: halaqohId },
  });

  await prismaClient.setoran_Murajaah.deleteMany({
    where: { halaqohId: halaqohId },
  });

  await prismaClient.ujian_Kenaikan.deleteMany({
    where: { id_kelompok: halaqohId },
  });

  return prismaClient.halaqoh.delete({
    where: {
      id: halaqohId,
    },
  });
};

export default {
  addHalaqoh,
  getAllHalaqoh,
  getHalaqoh,
  editHalaqoh,
  deleteHalaqoh,
};
