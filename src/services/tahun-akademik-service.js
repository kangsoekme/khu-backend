import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import {
  createTahunAkademikValidation,
  transisiSemesterValidation,
} from "../validation/tahun-akademik-validation.js";

const getAllTahunAkademik = async () => {
  return await prismaClient.tahun_Akademik.findMany({
    orderBy: { nama_tahun: "desc" },
  });
};

const getActiveTahunAkademik = async () => {
  const active = await prismaClient.tahun_Akademik.findFirst({
    where: { is_active: true },
  });
  if (!active) {
    throw new ResponseError(404, "Tidak ada tahun akademik yang aktif");
  }
  return active;
};

const createTahunAkademik = async (request) => {
  const data = validate(createTahunAkademikValidation, request);

  const existing = await prismaClient.tahun_Akademik.findFirst({
    where: { nama_tahun: data.nama_tahun },
  });

  if (existing) {
    throw new ResponseError(
      400,
      "Tahun akademik dengan nama tersebut sudah ada",
    );
  }

  return await prismaClient.tahun_Akademik.create({
    data: {
      nama_tahun: data.nama_tahun,
      is_active: data.is_active || false,
    },
  });
};

const transisiSemester = async (request) => {
  const { tahun_tujuan_id } = validate(transisiSemesterValidation, request);

  const tahunTujuan = await prismaClient.tahun_Akademik.findUnique({
    where: { id: tahun_tujuan_id },
  });

  if (!tahunTujuan) {
    throw new ResponseError(404, "Tahun akademik tujuan tidak ditemukan");
  }

  // Lakukan seluruh transisi secara aman dalam Prisma Transaction
  return await prismaClient.$transaction(async (tx) => {
    // 1. Nonaktifkan semua tahun akademik, lalu aktifkan tahun tujuan
    await tx.tahun_Akademik.updateMany({
      data: { is_active: false },
    });
    const updatedTahun = await tx.tahun_Akademik.update({
      where: { id: tahun_tujuan_id },
      data: { is_active: true },
    });

    // 2. Ambil seluruh riwayat kelas siswa yang saat ini berstatus "AKTIF"
    const riwayatAktif = await tx.riwayat_Kelas.findMany({
      where: { status: "AKTIF" },
    });

    // 3. Ubah status riwayat lama menjadi "SELESAI"
    await tx.riwayat_Kelas.updateMany({
      where: { status: "AKTIF" },
      data: { status: "SELESAI" },
    });

    // 4. Buatkan riwayat kelas baru untuk semester/tahun baru (tetap di kelas yang sama, nanti admin/guru bisa sesuaikan)
    if (riwayatAktif.length > 0) {
      const dataRiwayatBaru = riwayatAktif.map((r) => ({
        nis_siswa: r.nis_siswa,
        tahun_id: tahun_tujuan_id,
        nama_kelas: r.nama_kelas,
        status: "AKTIF",
      }));
      await tx.riwayat_Kelas.createMany({
        data: dataRiwayatBaru,
        skipDuplicates: true,
      });
    }

    // 5. Reset halaqoh siswa menjadi null agar siap di-plotting ulang oleh guru berdasarkan similar progress
    await tx.siswa.updateMany({
      data: {
        halaqoh_tahsin_id: null,
        halaqoh_tahfidz_id: null,
      },
    });

    await tx.halaqoh.deleteMany();

    return {
      message: "Transisi semester berhasil dilakukan",
      tahun_aktif_baru: updatedTahun.nama_tahun,
      total_siswa_ditransisikan: riwayatAktif.length,
    };
  });
};

export default {
  getAllTahunAkademik,
  getActiveTahunAkademik,
  createTahunAkademik,
  transisiSemester,
};
