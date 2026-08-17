import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";
import { addUjianKenaikanValidation } from "../validation/pengajuan-ujian-validation.js";
import { URUTAN_TAHAPAN } from "./tahsin-service.js";

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

    // K3: validasi kenaikan di sisi server — sebelumnya LULUS menimpa
    // tahapan siswa dengan apa pun yang dikirim (bisa mundur/nyasar tahap).
    if (status_kelulusan === "LULUS") {
      if (!targetTahapan) {
        throw new ResponseError(
          400,
          "Tahapan tujuan kenaikan tidak diketahui — kirim tahapan_baru atau proses pengajuan ujian dari guru terlebih dahulu",
        );
      }
      if (pengajuan && tahapan_baru && pengajuan.tahapan !== tahapan_baru) {
        throw new ResponseError(
          400,
          `tahapan_baru (${tahapan_baru}) tidak sesuai pengajuan guru (${pengajuan.tahapan}) — proses hasil ujian sesuai tahapan yang diajukan`,
        );
      }
      const idxSekarang = URUTAN_TAHAPAN.indexOf(siswa.tahapan_tahsin);
      const idxTujuan = URUTAN_TAHAPAN.indexOf(targetTahapan);
      if (idxSekarang !== -1 && idxTujuan <= idxSekarang) {
        throw new ResponseError(
          400,
          `Kenaikan tahapan hanya boleh maju: siswa sudah di ${siswa.tahapan_tahsin}, tidak bisa naik ke ${targetTahapan}`,
        );
      }
    }

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
        // Pertahankan invariant "maksimal satu baris placement per siswa"
        // (paritas addPretest): hapus placement tahap lama dulu agar
        // promosi berulang tidak menumpuk baris placement.
        await prisma.setoran_Tahsin.deleteMany({
          where: { nis_siswa, is_placement: true },
        });

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
