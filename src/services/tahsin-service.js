import {
  pretestValidation,
  tahsinValidation,
} from "../validation/tahsin-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";

// Validasi rentang ayat terhadap jumlah ayat surah sebenarnya (tabel surah).
// Mengikuti pola hafalan-service agar tahsin & tahfidz konsisten:
// ayat tidak boleh melebihi jumlah_ayat surah yang dipilih.
const validasiAyatSurah = async (noSurah, ayatAwal, ayatAkhir, label) => {
  const surah = await prismaClient.surah.findUnique({
    where: { no_surah: Number(noSurah) },
  });

  if (!surah) {
    throw new ResponseError(400, `Surah nomor ${noSurah} tidak ditemukan`);
  }

  const awal = Number(ayatAwal) || 0;
  const akhir = Number(ayatAkhir) || 0;

  // Tidak ada ayat yang diisi -> tidak ada yang perlu divalidasi
  if (awal <= 0 && akhir <= 0) return;

  if (awal > 0 && akhir > 0 && awal > akhir) {
    throw new ResponseError(
      400,
      `Ayat awal ${label} tidak boleh lebih besar dari ayat akhir`,
    );
  }

  if (
    (awal > 0 && awal > surah.jumlah_ayat) ||
    (akhir > 0 && akhir > surah.jumlah_ayat)
  ) {
    throw new ResponseError(
      400,
      `Ayat ${label} melebihi jumlah ayat QS ${surah.nama_surah} (${surah.jumlah_ayat} ayat)`,
    );
  }
};

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

  // Cross-check ayat bacaan & hafalan terhadap jumlah ayat surah
  if (tahsin.no_surah) {
    await validasiAyatSurah(
      tahsin.no_surah,
      tahsin.ayat_awal,
      tahsin.ayat_akhir,
      "bacaan",
    );
  }
  if (tahsin.hafalan_surah) {
    await validasiAyatSurah(
      tahsin.hafalan_surah,
      tahsin.hafalan_ayat_awal,
      tahsin.hafalan_ayat_akhir,
      "hafalan",
    );
  }

  const daftarNilaiLanjut = ["A+", "A", "B+", "B"];

  const statusKelanjutan = daftarNilaiLanjut.includes(tahsin.nilai)
    ? "LANJUT"
    : "MENGULANG";

  const [setoran] = await prismaClient.$transaction([
    prismaClient.setoran_Tahsin.create({
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
        keterangan: tahsin.keterangan ?? "",
        status_kelanjutan: statusKelanjutan,
      },
      include: {
        siswa: { select: { nama: true, nis: true } },
        halaqoh: { select: { nama: true } },
      },
    }),
    prismaClient.siswa.update({
      where: { nis: tahsin.nis_siswa },
      data: { tahapan_tahsin: tahsin.tahapan },
    }),
  ]);

  return setoran;
};

const addPretest = async (request) => {
  const pretest = validate(pretestValidation, request);
  const siswa = await prismaClient.siswa.findUnique({
    where: { nis: pretest.nis_siswa },
  });

  if (!siswa) {
    throw new ResponseError(404, "Data siswa tidak ditemukkan");
  }

  // Cross-check ayat placement terhadap jumlah ayat surah
  if (pretest.no_surah) {
    await validasiAyatSurah(
      pretest.no_surah,
      pretest.ayat_awal,
      pretest.ayat_akhir,
      "bacaan",
    );
  }

  const [hasilPretest] = await prismaClient.$transaction([
    prismaClient.ujian_Pretest.create({
      data: {
        nis_siswa: pretest.nis_siswa,
        keterangan: pretest.keterangan || "",
        tahapan: pretest.tahapan,
        jilid: pretest.jilid ? Number(pretest.jilid) : null,
        halaman: pretest.halaman ? Number(pretest.halaman) : null,
        no_surah: pretest.no_surah ? Number(pretest.no_surah) : null,
        ayat_awal: pretest.ayat_awal ? Number(pretest.ayat_awal) : null,
        ayat_akhir: pretest.ayat_akhir ? Number(pretest.ayat_akhir) : null,
        materi: pretest.materi || null,
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

    // Auto-buat setoran pertama bertag is_placement=true sebagai titik awal bacaan
    prismaClient.setoran_Tahsin.create({
      data: {
        nis_siswa: pretest.nis_siswa,
        id_kelompok: siswa.halaqoh_tahsin_id || null,
        tahapan: pretest.tahapan,
        jilid: pretest.jilid ? Number(pretest.jilid) : null,
        bab: pretest.halaman ? Number(pretest.halaman) : null,
        no_surah: pretest.no_surah ? Number(pretest.no_surah) : null,
        ayat_awal: pretest.ayat_awal ? Number(pretest.ayat_awal) : null,
        ayat_akhir: pretest.ayat_akhir ? Number(pretest.ayat_akhir) : null,
        materi: pretest.materi || null,
        nilai: "A+",
        keterangan: "Titik awal placement pretest",
        status_kelanjutan: "LANJUT",
        is_placement: true,
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
      ujianPretest: {
        orderBy: { id: "desc" },
        take: 1,
        select: {
          tahapan: true,
          keterangan: true,
          jilid: true,
          halaman: true,
          no_surah: true,
          ayat_awal: true,
          ayat_akhir: true,
          materi: true,
        },
      },
    },
  });

  if (!siswa) {
    throw new ResponseError(404, "Data siswa tidak ditemukan");
  }

  // Pisahkan setoran aktual (bukan placement) untuk statistik
  const setoranAktual = siswa.setoranTahsin.filter((s) => !s.is_placement);

  const totalPertemuan = setoranAktual.length;
  const nilaiAkhir = totalPertemuan > 0 ? setoranAktual[0].nilai : "-";

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
  setoranAktual.forEach(
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

  // History mencakup semua setoran (termasuk placement) agar urutan +1 bekerja
  const historyMapping = siswa.setoranTahsin.map((setoran) => ({
    id: setoran.id,
    timestamp: setoran.timestamp,
    tahapan: setoran.tahapan,
    is_placement: setoran.is_placement,
    hafalan_surah: {
      surah: setoran.hafalahSurah ? setoran.hafalahSurah.nama_surah : null,
      ayat_awal: setoran.hafalan_ayat_awal,
      ayat_akhir: setoran.hafalan_ayat_akhir,
    },
    laporan_bacaan: {
      jilid_surah: setoran.surah ? setoran.surah.nama_surah : setoran.jilid,
      ayat: setoran.ayat_akhir || setoran.bab,
      materi: setoran.materi,
      jilid: setoran.jilid,
      bab: setoran.bab,
      surah: setoran.surah ? setoran.surah.nama_surah : null,
      ayat_awal: setoran.ayat_awal,
      ayat_akhir: setoran.ayat_akhir,
      no_surah: setoran.no_surah,
    },

    nilai_tahsin: setoran.nilai,
    status_kelanjutan: setoran.status_kelanjutan,
    keterangan: setoran.keterangan,
  }));

  return {
    nis: siswa.nis,
    nama: siswa.nama,
    history: historyMapping,
    pretest: siswa.ujianPretest?.[0] || null,
    summary: {
      total_pertemuan: totalPertemuan,
      nilai_terakhir: nilaiAkhir,
      rata_rata: rataRataHuruf,
    },
  };
};

const editTahsin = async (id, request) => {
  const setoran = await prismaClient.setoran_Tahsin.findUnique({
    where: { id },
  });
  if (!setoran) throw new ResponseError(404, "Data setoran tidak ditemukan");

  return await prismaClient.setoran_Tahsin.update({
    where: { id },
    data: request,
  });
};

const deleteTahsin = async (id) => {
  const setoran = await prismaClient.setoran_Tahsin.findUnique({
    where: { id },
  });
  if (!setoran) throw new ResponseError(404, "Data setoran tidak ditemukan");

  return await prismaClient.setoran_Tahsin.delete({ where: { id } });
};

export default {
  addPretest,
  addTahsin,
  getRiwayatTahsin,
  editTahsin,
  deleteTahsin,
};
