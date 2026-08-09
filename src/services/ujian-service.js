import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import { addUjianKenaikanValidation } from "../validation/pengajuan-ujian-validation.js";

const addUjianKenaikanTahsin = async (request) => {
  // BE-3: validasi enum sebelum kontak Prisma
  const data = validate(addUjianKenaikanValidation, request);
  const {
    nis_siswa,
    id_kelompok,
    tahapan_baru,
    nilai,
    keterangan,
    status_kelulusan,
  } = data;

  const siswa = await prismaClient.siswa.findUnique({
    where: { nis: nis_siswa },
  });

  if (!siswa) throw new ResponseError(404, "Siswa tidak ditemukkan");

  return await prismaClient.$transaction(async (prisma) => {
    const pengajuan = await prisma.pengajuan_Ujian.findFirst({
      where: { nis_siswa: nis_siswa, kategori: "TAHSIN" },
    });

    const targetTahapan =
      tahapan_baru || pengajuan?.tahapan || siswa.tahapan_tahsin;

    const idGuru = pengajuan?.id_guru || null;

    await prisma.pengajuan_Ujian.deleteMany({
      where: { nis_siswa: nis_siswa, kategori: "TAHSIN" },
    });

    const ujian = await prisma.ujian_Kenaikan.create({
      data: {
        nis_siswa,
        id_kelompok,
        tahapan: targetTahapan,
        nilai,
        keterangan,
        status_kelulusan,
      },
    });

    if (status_kelulusan === "LULUS") {
      await prisma.siswa.update({
        where: { nis: nis_siswa },
        data: { tahapan_tahsin: targetTahapan },
      });

      // BUG-02 part C: Seed placement setoran sebagai titik awal tahap baru.
      // Mencegah status capaian pasca-promosi membaca record tahap LAMA.
      // Mengikuti pola addPretest (tahsin-service.js L103-120).
      // Pengecualian: Munaqosyah adalah tahap ujian final tanpa setoran,
      // jadi tidak perlu seed placement.
      if (targetTahapan !== "MUNAQOSYAH") {
        await prisma.setoran_Tahsin.create({
          data: {
            nis_siswa,
            id_kelompok: siswa.halaqoh_tahsin_id || null,
            tahapan: targetTahapan,
            jilid: null,
            bab: null,
            no_surah: null,
            ayat_awal: null,
            ayat_akhir: null,
            materi: null,
            nilai: "A+",
            keterangan: "Titik awal placement pasca-ujian kenaikan",
            status_kelanjutan: "LANJUT",
            is_placement: true,
          },
        });
      }
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
