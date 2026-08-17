import {
  pretestValidation,
  tahsinValidation,
  editTahsinValidation,
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

// Target penyelesaian tahapan berbasis BUKU (syarat ujian kenaikan).
// Harus tetap sinkron dengan frontend: khu-frontend/src/utils/tahsinCompletion.js (TARGET_BUKU).
const TARGET_BUKU_TAHAPAN = {
  JILID_1: 40,
  JILID_2: 40,
  JILID_3: 40,
  JILID_4: 40,
  JILID_5: 40,
  JILID_6: 40,
  GHARIB: 45,
  TAJWID: 40,
};

// Titik selesai Tilawah Juz 1-5 (akhir Juz 5): Surah 4 (An-Nisa) ayat 147.
// Ayat 148+ An-Nisa sudah masuk wilayah Juz 6 (bahan tahap Gharib).
const TARGET_TILAWAH_JUZ_1_5 = { no_surah: 4, ayat: 147 };

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

  // Placement adalah TITIK AWAL bacaan -> tolak jika titiknya sudah setara
  // syarat selesai tahapan, karena itu membuat siswa instan "selesai tahapan"
  // tanpa satu setoran riil pun dan langsung bisa mengajukan ujian kenaikan.
  if (pretest.tahapan === "MUNAQOSYAH") {
    throw new ResponseError(
      400,
      "Munaqosyah adalah tahap ujian akhir — dimasuki melalui ujian kenaikan, bukan placement pretest",
    );
  }

  const targetBuku = TARGET_BUKU_TAHAPAN[pretest.tahapan];
  if (
    targetBuku &&
    pretest.halaman != null &&
    Number(pretest.halaman) >= targetBuku
  ) {
    throw new ResponseError(
      400,
      `Placement adalah titik awal bacaan — halaman ${pretest.halaman} sudah setara titik selesai tahapan (halaman ${targetBuku}). Tempatkan santri langsung di tahapan berikutnya`,
    );
  }

  if (pretest.tahapan === "TILAWAH_JUZ_1_5" && pretest.no_surah) {
    const noSurah = Number(pretest.no_surah);
    const ayatAkhir = Number(pretest.ayat_akhir) || 0;
    if (
      noSurah > TARGET_TILAWAH_JUZ_1_5.no_surah ||
      (noSurah === TARGET_TILAWAH_JUZ_1_5.no_surah &&
        ayatAkhir >= TARGET_TILAWAH_JUZ_1_5.ayat)
    ) {
      throw new ResponseError(
        400,
        `Placement adalah titik awal bacaan — Surah 4 ayat ${TARGET_TILAWAH_JUZ_1_5.ayat} adalah titik selesai Tilawah Juz 1-5. Tempatkan santri langsung di tahapan berikutnya (Gharib)`,
      );
    }
  }

  const [hasilPretest] = await prismaClient.$transaction([
    // Placement bersifat KOREKSI: hapus placement lama siswa agar re-pretest
    // tidak menumpuk baris "Titik awal placement pretest" di riwayat
    // (selalu maksimal satu baris placement aktif per siswa).
    prismaClient.setoran_Tahsin.deleteMany({
      where: {
        nis_siswa: pretest.nis_siswa,
        is_placement: true,
      },
    }),

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

  // Baris placement adalah penanda titik awal sintetis, bukan setoran riil —
  // tidak boleh diedit. Koreksinya lewat hapus placement + input ulang pretest.
  if (setoran.is_placement) {
    throw new ResponseError(
      400,
      "Baris placement pretest tidak dapat diedit — hapus dan input ulang pretest untuk koreksi",
    );
  }

  // Payload divalidasi dengan skema ketat: hanya field yang boleh berubah.
  // Identitas baris (halaqoh, tahapan, is_placement) ditolak skema,
  // bukan lagi body mentah seperti sebelumnya.
  const data = validate(editTahsinValidation, request);

  // Cross-check ayat bacaan & hafalan terhadap jumlah ayat surah (paritas addTahsin)
  if (data.no_surah) {
    await validasiAyatSurah(
      data.no_surah,
      data.ayat_awal ?? setoran.ayat_awal,
      data.ayat_akhir ?? setoran.ayat_akhir,
      "bacaan",
    );
  }
  if (data.hafalan_surah) {
    await validasiAyatSurah(
      data.hafalan_surah,
      data.hafalan_ayat_awal ?? setoran.hafalan_ayat_awal,
      data.hafalan_ayat_akhir ?? setoran.hafalan_ayat_akhir,
      "hafalan",
    );
  }

  // Cross-check halaman buku terhadap target tahapan baris (paritas addTahsin).
  // Skema edit hanya tahu batas tebal buku (45); batas per-tahapan (Jilid/Tajwid
  // 40, Gharib 45) dicek di sini karena tahapan baris hanya ada di DB.
  const targetBuku = TARGET_BUKU_TAHAPAN[setoran.tahapan];
  if (targetBuku && data.bab != null && data.bab > targetBuku) {
    throw new ResponseError(
      400,
      `Halaman maksimal tahapan ${setoran.tahapan} adalah ${targetBuku}. Jika santri sudah melewati halaman ${targetBuku}, naikkan tahapan melalui Ujian Kenaikan`,
    );
  }

  // Nilai diubah tanpa status eksplisit -> hitung ulang status kelanjutan
  // (paritas addTahsin; sebelumnya edit tidak pernah menghitung ulang).
  if (data.nilai && !data.status_kelanjutan) {
    data.status_kelanjutan = ["A+", "A", "B+", "B"].includes(data.nilai)
      ? "LANJUT"
      : "MENGULANG";
  }

  return await prismaClient.setoran_Tahsin.update({
    where: { id },
    data,
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
