import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const addPengajuan = async (request) => {
  const { nis_siswa, id_guru, kategori, tahapan } = request;

  const exiting = await prismaClient.pengajuan_Ujian.findFirst({
    where: { nis_siswa, kategori },
  });

  if (exiting) {
    throw new ResponseError(
      400,
      "Siswa ini sudah dalam daftar pengajuan ujian",
    );
  }

  return await prismaClient.pengajuan_Ujian.create({
    data: { nis_siswa, id_guru, kategori, tahapan },
  });
};

const getDaftarPengajuan = async (kategori) => {
  return await prismaClient.pengajuan_Ujian.findMany({
    where: { kategori: kategori },
    include: {
      siswa: {
        select: {
          nis: true,
          nama: true,
          tahapan_tahsin: true,
          halaqoh_tahsin_id: true,
          riwayatKelas: { where: { status: "AKTIF" } },
        },
      },
      guru: {
        select: { nama: true },
      },
    },
    orderBy: { timestamp: "asc" },
  });
};

export default { addPengajuan, getDaftarPengajuan };
