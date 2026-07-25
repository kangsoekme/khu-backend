import {
  pretestValidation,
  tahsinValidation,
} from "../validation/tahsin-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";

const addTahsin = async (request) => {
  const tahsin = validate(tahsinValidation, request);

  const siswa = await prismaClient.siswa.findUnique({
    where: { nis: tahsin.nis_siswa },
  });

  const halaqoh = await prismaClient.halaqoh.findUnique({
    where: { id: tahsin.halaqohId },
  });

  if (!siswa) {
    throw new ResponseError(404, "Data siswa tidak ditemukan");
  }

  if (!halaqoh) {
    throw new ResponseError(404, "Halaqoh tidak ditemukan");
  }

  const daftarNilaiLanjut = ["A+", "A", "B+", "B", "B-"];

  const statusKelanjutan = daftarNilaiLanjut.includes(tahsin.nilai)
    ? "LANJUT"
    : "MENGULANG";

  return prismaClient.setoran_Tahsin.create({
    data: {
      nis_siswa: tahsin.nis_siswa,
      id_kelompok: tahsin.halaqohId,
      hafalan_surah: tahsin.hafalan_surah,
      hafalan_ayat_awal: tahsin.hafalan_ayat_awal,
      hafalan_ayat_akhir: tahsin.hafalan_ayat_akhir,

      tahapan: tahsin.tahapan,
      jilid: tahsin.jilid,
      bab: tahsin.bab,

      no_surah: tahsin.no_surah,
      ayat_awal: tahsin.ayat_awal,
      ayat_akhir: tahsin.ayat_akhir,
      materi: tahsin.materi,

      nilai: tahsin.nilai,
      keterangan: tahsin.keterangan,
      status_kelanjutan: statusKelanjutan,
    },
    include: {
      siswa: { select: { nama: true, nis: true } },
      halaqoh: { select: { nama: true } },
    },
  });
};

const addPretest = async (request) => {
  const pretest = validate(pretestValidation, request);
  const siswa = await prismaClient.siswa.findUnique({
    where: { nis: pretest.nis_siswa },
  });

  if (!siswa) {
    throw new ResponseError(404, "Data siswa tidak ditemukkan");
  }

  const [hasilPretest, updateSiswa] = await prismaClient.$transaction([
    prismaClient.ujian_Pretest.create({
      data: {
        nis_siswa: pretest.nis_siswa,
        nilai: pretest.nilai,
        keterangan: pretest.keterangan,
        tahapan: pretest.tahapan,
      },
      include: {
        siswa: {
          select: {
            nis: true,
            nama: true,
          },
        },
      },
    }),

    prismaClient.siswa.update({
      where: { nis: pretest.nis_siswa },
      data: { tahapan_tahsin: pretest.tahapan },
    }),
  ]);

  return hasilPretest;
};

const getRiwayatTahsin = async (nis) => {
  const siswa = await prismaClient.siswa.findUnique({
    where: { nis: nis },
    include: {
      setoranTahsin: {
        orderBy: {
          timestamp: "desc",
        },
        include: {
          surah: {
            select: {
              nama_surah: true,
            },
          },
          hafalahSurah: {
            select: {
              nama_surah: true,
            },
          },
        },
      },
    },
  });

  if (!siswa) {
    throw new ResponseError(404, "Data siswa tidak ditemukan");
  }

  const totalPertemuan = siswa.setoranTahsin.length;

  const nilaiAkhir = totalPertemuan > 0 ? siswa.setoranTahsin[0].nilai : "-";

  const daftarNilai = {
    "A+": 95,
    A: 90,
    "B+": 85,
    B: 80,
    "B-": 75,
    "C+": 70,
    C: 65,
    "C-": 60,
    D: 55,
  };

  let totalAngka = 0;
  siswa.setoranTahsin.forEach(
    (setoran) => (totalAngka += daftarNilai[setoran.nilai] || 0),
  );

  const rataRataAngka = totalPertemuan > 0 ? totalAngka / totalPertemuan : 0;

  let rataRataHuruf = "-";

  if (rataRataAngka > 0) {
    if (rataRataAngka >= 93) rataRataHuruf = "A+";
    else if (rataRataAngka >= 88) rataRataHuruf = "A";
    else if (rataRataAngka >= 83) rataRataHuruf = "B+";
    else if (rataRataAngka >= 78) rataRataHuruf = "B";
    else if (rataRataAngka >= 73) rataRataHuruf = "B-";
    else if (rataRataAngka >= 68) rataRataHuruf = "C+";
    else if (rataRataAngka >= 63) rataRataHuruf = "C";
    else if (rataRataAngka >= 58) rataRataHuruf = "C-";
    else rataRataHuruf = "D";
  }

  const historyMapping = siswa.setoranTahsin.map((setoran) => ({
    id: setoran.id,
    timestamp: setoran.timestamp,
    hafalan_surah: {
      surah: setoran.hafalahSurah ? setoran.hafalahSurah.nama_surah : null,
      ayat_awal: setoran.hafalan_ayat_awal,
      ayat_akhir: setoran.hafalan_ayat_akhir,
    },
    laporan_bacaan: {
      jilid_surah: setoran.surah ? setoran.surah.nama_surah : setoran.jilid,
      ayat: setoran.ayat_akhir || setoran.bab,
      materi: setoran.materi,
    },

    nilai_tahsin: setoran.nilai,
    status_kelanjutan: setoran.status_kelanjutan,
    keterangan: setoran.keterangan,
  }));

  return {
    nis: siswa.nis,
    nama: siswa.nama,
    history: historyMapping,
    summary: {
      total_pertemuan: totalPertemuan,
      nilai_terakhir: nilaiAkhir,
      rata_rata: rataRataHuruf,
    },
  };
};

export default { addPretest, addTahsin, getRiwayatTahsin };
