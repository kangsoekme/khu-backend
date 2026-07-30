import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { hafalanValidation } from "../validation/hafalan-validation.js";
import { validate } from "../validation/validation.js";

const addHafalan = async (request) => {
  const hafalan = validate(hafalanValidation, request);

  const siswa = await prismaClient.siswa.findUnique({
    where: { nis: hafalan.nis_siswa },
  });

  const halaqoh = await prismaClient.halaqoh.findUnique({
    where: { id: hafalan.halaqohId },
  });

  if (!siswa) {
    throw new ResponseError(404, "Data siswa tidak ditemukan");
  }

  if (!halaqoh) {
    throw new ResponseError(404, "Halaqoh tidak ditemukan");
  }

  const surah = await prismaClient.surah.findUnique({
    where: { no_surah: hafalan.no_surah },
  });

  if (!surah) {
    throw new ResponseError(404, "Surah tidak ditemukan");
  }

  if (hafalan.jumlah_salah > 3) {
    throw new ResponseError(400, "Setoran ditolak!, kesalahan maksimal 3");
  }

  let nilaiHafalan = 95 - hafalan.jumlah_salah * 10;
  if (nilaiHafalan < 60) nilaiHafalan = 60;

  const nilaiRataRata = Math.round((nilaiHafalan + hafalan.nilai_bacaan) / 2);

  let predikatSiswa = "DHAIF";

  if (nilaiRataRata >= 86) predikatSiswa = "MUMTAZ";
  else if (nilaiRataRata >= 76) predikatSiswa = "JAYYID_JIDDAN";
  else if (nilaiRataRata >= 66) predikatSiswa = "JAYYID";
  return prismaClient.setoran_Hafalan.create({
    data: {
      nis_siswa: hafalan.nis_siswa,
      halaqohId: hafalan.halaqohId,
      no_surah: hafalan.no_surah,
      ayat_awal: hafalan.ayat_awal,
      ayat_akhir: hafalan.ayat_akhir,
      jumlah_pengulangan: hafalan.jumlah_pengulangan,
      toggle_tarjamah: hafalan.toggle_tarjamah,
      jumlah_salah: hafalan.jumlah_salah,
      nilai_bacaan: hafalan.nilai_bacaan,
      nilai_hafalan: nilaiHafalan,
      rata_rata: nilaiRataRata,
      predikat: predikatSiswa,
      status_kelanjutan: "LANJUT",
    },
    include: {
      siswa: { select: { nama: true, nis: true } },
      halaqoh: { select: { nama: true } },
      surah: { select: { nama_surah: true } },
    },
  });
};

const getRiwayatHafalan = async (nis) => {
  const siswa = await prismaClient.siswa.findUnique({
    where: { nis: nis },
    include: {
      setoranHafalan: {
        orderBy: {
          timestamp: "desc",
        },
        include: {
          surah: {
            select: {
              nama_surah: true,
              jumlah_ayat: true,
            },
          },
        },
      },
    },
  });

  if (!siswa) {
    throw new ResponseError(404, "Data siswa tidak ditemukkan");
  }
  const totalSetoran = siswa.setoranHafalan.length;
  
  const completedSurahs = new Set();
  siswa.setoranHafalan.forEach((item) => {
    if (item.surah && item.ayat_akhir >= item.surah.jumlah_ayat) {
      completedSurahs.add(item.no_surah);
    }
  });
  const totalHafalan = completedSurahs.size;

  const totalKelancaran = siswa.setoranHafalan.reduce(
    (sum, item) => sum + item.nilai_hafalan,
    0,
  );

  const rataRataKelancaran =
    totalSetoran > 0 ? Math.round(totalKelancaran / totalSetoran) : 0;

  return {
    nis: siswa.nis,
    nama: siswa.nama,
    history: {
      hafalan_baru: siswa.setoranHafalan,
      summary: {
        total_hafalan: totalHafalan,
        rata_rata_kelancaran: rataRataKelancaran,
      },
    },
  };
};

const editHafalan = async (id, request) => {
  const setoran = await prismaClient.setoran_Hafalan.findUnique({
    where: { id },
  });
  if (!setoran) throw new ResponseError(404, "Data hafalan tidak ditemukan");

  return await prismaClient.setoran_Hafalan.update({
    where: { id },
    data: request,
  });
};

const deleteHafalan = async (id) => {
  const setoran = await prismaClient.setoran_Hafalan.findUnique({
    where: { id },
  });
  if (!setoran) throw new ResponseError(404, "Data hafalan tidak ditemukan");

  return await prismaClient.setoran_Hafalan.delete({ where: { id } });
};

export default { addHafalan, getRiwayatHafalan, editHafalan, deleteHafalan };
