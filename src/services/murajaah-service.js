import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { murajaahValidation } from "../validation/murajaah-validation.js";
import { validate } from "../validation/validation.js";

const addMurajaah = async (request) => {
  const murajaah = validate(murajaahValidation, request);

  const siswa = await prismaClient.siswa.findUnique({
    where: {
      nis: murajaah.nis_siswa,
    },
  });

  const halaqoh = await prismaClient.halaqoh.findUnique({
    where: { id: murajaah.halaqohId },
  });

  if (!siswa) {
    throw new ResponseError(404, "Data siswa tidak ditemukkan");
  }

  if (!halaqoh) {
    throw new ResponseError(404, "Halaqoh tidak ditemukkan");
  }

  let nilaiHafalan = 95 - murajaah.jumlah_salah * 10;
  if (nilaiHafalan < 60) nilaiHafalan = 60;

  const nilaiRataRata = Math.round((nilaiHafalan + murajaah.nilai_bacaan) / 2);

  let predikatSiswa = "DHAIF";

  if (nilaiRataRata >= 86) predikatSiswa = "MUMTAZ";
  else if (nilaiRataRata >= 76) predikatSiswa = "JAYYID_JIDDAN";
  else if (nilaiRataRata >= 66) predikatSiswa = "JAYYID";
  else predikatSiswa = "DHAIF";

  return prismaClient.setoran_Murajaah.create({
    data: {
      nis_siswa: murajaah.nis_siswa,
      halaqohId: murajaah.halaqohId,
      no_surah: murajaah.no_surah,
      ayat_awal: murajaah.ayat_awal,
      ayat_akhir: murajaah.ayat_akhir,
      jumlah_salah: murajaah.jumlah_salah,

      nilai_bacaan: murajaah.nilai_bacaan,
      nilai_hafalan: nilaiHafalan,

      rata_rata: nilaiRataRata,
      predikat: predikatSiswa,
    },
    include: {
      siswa: { select: { nama: true, nis: true } },
      halaqoh: { select: { nama: true } },
      surah: { select: { nama_surah: true } },
    },
  });
};

const getRiwayatMurajaah = async (nis) => {
  const siswa = await prismaClient.siswa.findUnique({
    where: { nis: nis },
    include: {
      murajaah: {
        orderBy: {
          timestamp: "desc",
        },
        include: {
          surah: {
            select: {
              nama_surah: true,
            },
          },
        },
      },
    },
  });

  if (!siswa) {
    throw new ResponseError(404, "Data siswa tidak ditemukkan");
  }

  const totalMurajaah = siswa.murajaah.length;

  const totalKelancaran = siswa.murajaah.reduce(
    (sum, item) => sum + item.nilai_hafalan,
    0,
  );

  const rataRataHafalan =
    totalMurajaah > 0 ? Math.round(totalKelancaran / totalMurajaah) : 0;

  return {
    nis: siswa.nis,
    nama: siswa.nama,
    history: {
      murajaah_baru: siswa.murajaah,
      summary: {
        total_murajaah: totalMurajaah,
        rata_rata_kelancaran: rataRataHafalan,
      },
    },
  };
};

const editMurajaah = async (id, request) => {
  const setoran = await prismaClient.setoran_Murajaah.findUnique({
    where: { id },
  });
  if (!setoran) throw new ResponseError(404, "Data murajaah tidak ditemukan");

  const { nis_siswa, halaqohId, no_surah, ayat_awal, ayat_akhir, jumlah_salah, nilai_bacaan } = request;

  let nilaiHafalan = 95 - jumlah_salah * 10;
  if (nilaiHafalan < 60) nilaiHafalan = 60;

  const nilaiRataRata = Math.round((nilaiHafalan + nilai_bacaan) / 2);

  let predikatSiswa = "DHAIF";
  if (nilaiRataRata >= 86) predikatSiswa = "MUMTAZ";
  else if (nilaiRataRata >= 76) predikatSiswa = "JAYYID_JIDDAN";
  else if (nilaiRataRata >= 66) predikatSiswa = "JAYYID";
  else predikatSiswa = "DHAIF";

  return await prismaClient.setoran_Murajaah.update({
    where: { id },
    data: {
      nis_siswa,
      halaqohId,
      no_surah,
      ayat_awal,
      ayat_akhir,
      jumlah_salah,
      nilai_bacaan,
      nilai_hafalan: nilaiHafalan,
      rata_rata: nilaiRataRata,
      predikat: predikatSiswa,
    },
  });
};

const deleteMurajaah = async (id) => {
  const setoran = await prismaClient.setoran_Murajaah.findUnique({
    where: { id },
  });
  if (!setoran) throw new ResponseError(404, "Data murajaah tidak ditemukan");

  return await prismaClient.setoran_Murajaah.delete({ where: { id } });
};

export default {
  addMurajaah,
  getRiwayatMurajaah,
  editMurajaah,
  deleteMurajaah,
};
