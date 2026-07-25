import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const addUjianKenaikanTahsin = async (request) => {
  const {
    nis_siswa,
    id_kelompok,
    tahapan_baru,
    nilai,
    keterangan,
    status_kelulusan,
  } = request;

  const siswa = await prismaClient.siswa.findUnique({
    where: { nis: nis_siswa },
  });

  if (!siswa) throw new ResponseError(404, "Siswa tidak ditemukkan");

  return await prismaClient.$transaction(async (prisma) => {
    await prisma.pengajuan_Ujian.deleteMany({
      where: { nis_siswa: nis_siswa, kategori: "TAHSIN" },
    });

    const ujian = await prisma.ujian_Kenaikan.create({
      data: {
        nis_siswa,
        id_kelompok,
        tahapan: tahapan_baru,
        nilai,
        keterangan,
        status_kelulusan,
      },
    });

    if (status_kelulusan === "LULUS") {
      await prisma.siswa.update({
        where: { nis: nis_siswa },
        data: { tahapan_tahsin: tahapan_baru },
      });
    }

    return ujian;
  });
};

const getRiwayatUjianSiswa = async (nis) => {
  return await prismaClient.ujian_Kenaikan.findMany({
    where: { nis_siswa: nis },
    orderBy: { id: "desc" },
  });
};

export default { addUjianKenaikanTahsin, getRiwayatUjianSiswa };
