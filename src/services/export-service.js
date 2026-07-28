import ExcelJS from "exceljs";
import { prismaClient } from "../application/database.js";

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";

const getTargetQuran = (kelasStr = "", semesterStr = "") => {
  const k = String(kelasStr).toUpperCase();
  const isGenap =
    String(semesterStr).toUpperCase().includes("GENAP") ||
    String(semesterStr).includes("2");

  let tTahsin = "-";
  let tTahfidz = "-";

  if (
    (k.includes("I") &&
      !k.includes("II") &&
      !k.includes("IV") &&
      !k.includes("VI")) ||
    k.startsWith("1")
  ) {
    tTahsin = isGenap
      ? "Jilid 2 (20-40) & Jilid 3 (1-40)"
      : "Jilid 1 (1-40) & Jilid 2 (1-20)";
    tTahfidz = isGenap
      ? "1/4 Juz 30 - II (Al-Humazah - Al-A'la)"
      : "1/4 Juz 30 - I (An-Naba' - Al-Infithor)";
  } else if (
    (k.includes("II") && !k.includes("III") && !k.includes("VII")) ||
    k.startsWith("2")
  ) {
    tTahsin = isGenap
      ? "Jilid 5 (20-40) & Jilid 6 (1-40)"
      : "Jilid 4 (1-40) & Jilid 5 (1-20)";
    tTahfidz = isGenap
      ? "1/4 Juz 29 - I (Al-Qadr - Adh-Dhuha)"
      : "1/4 Juz 30 - III (Al-Fajr - Al-Lail)";
  } else if ((k.includes("III") && !k.includes("VIII")) || k.startsWith("3")) {
    tTahsin = isGenap ? "Al-Qur'an (Ghorib) Juz 6-15" : "Al-Qur'an Juz 1-5";
    tTahfidz = isGenap
      ? "1/4 Juz 29 - III (Al-Haqqah 9 - Al-Mudatstsir 47)"
      : "1/4 Juz 29 - II (Al-Mulk - At-Takatsur)";
  } else if ((k.includes("IV") && !k.includes("XIV")) || k.startsWith("4")) {
    tTahsin = isGenap
      ? "Persiapan Munaqosyah Juz 26-30"
      : "Al-Qur'an (Tajwid) Juz 16-25";
    tTahfidz = isGenap
      ? "1/4 Juz 28 - I (Al-Mudatstsir 48 - Al-Insan)"
      : "1/4 Juz 29 - IV (Tasmi' Juz 29)";
  } else if (
    (k.includes("V") && !k.includes("VI") && !k.includes("IV")) ||
    k.startsWith("5")
  ) {
    tTahsin = isGenap
      ? "Pendalaman Tartil Juz 26-30"
      : "Munaqosyah Tartil Juz 21-25";
    tTahfidz = isGenap
      ? "1/4 Juz 28 - III (As-Shaff 6 - At-Taghabun 9)"
      : "1/4 Juz 28 - II (Al-Hasyr 10 - As-Shaff 5)";
  } else if (k.includes("VI") || k.startsWith("6")) {
    tTahsin = "Pendalaman Tartil";
    tTahfidz = isGenap
      ? "Persiapan UN (At-Taghabun 10 - At-Tahrim)"
      : "1/4 Juz 28 - IV (Tasmi' Juz 28)";
  }

  return { targetTahsin: tTahsin, targetTahfidz: tTahfidz };
};

const gradeMap = {
  "A+": 98, A: 90, "B+": 85, B: 80, "B-": 75, "C+": 70, C: 65, "C-": 60, D: 50,
};

const formatTahapan = (val) => {
  if (!val || val === "-") return "-";
  const map = {
    JILID_1: "Jilid 1",
    JILID_2: "Jilid 2",
    JILID_3: "Jilid 3",
    JILID_4: "Jilid 4",
    JILID_5: "Jilid 5",
    JILID_6: "Jilid 6",
    AL_QURAN: "Al-Qur'an",
    GHORIB: "Ghorib",
    TAJWID: "Tajwid",
    TAHFIDZ: "Tahfidz",
    MUNAQOSYAH: "Munaqosyah",
  };
  return map[val] || val.replace(/_/g, " ");
};
const filterSetoranByAcademicYear = (siswa, list = []) => {
  if (!list || list.length === 0) return [];
  let startYear = new Date().getFullYear();
  if (new Date().getMonth() + 1 < 7) {
    startYear -= 1;
  }
  const namaTahun = siswa?.riwayatKelas?.[0]?.tahun_akademik?.nama_tahun || "";
  const match = namaTahun.match(/(\d{4})/);
  if (match && !isNaN(parseInt(match[1]))) {
    startYear = parseInt(match[1]);
  }
  const academicStartDate = new Date(`${startYear}-07-01T00:00:00.000Z`);
  return list.filter(item => {
    if (!item.timestamp) return false;
    return new Date(item.timestamp) >= academicStartDate;
  });
};

const computeCapaianSiswa = (siswa, periode = "semester") => {
  const tahsinList = filterSetoranByAcademicYear(siswa, siswa.setoranTahsin || []);
  let awalJilidTahsin = "-";
  let awalHalTahsin = "-";
  let capaianJilidTahsin = "-";
  let capaianHalTahsin = "-";
  let nilaiTahsin = "-";
  let deskripsiTahsin = "-";

  if (tahsinList.length > 0) {
    const firstT = tahsinList[0];
    const lastT = tahsinList[tahsinList.length - 1];
    awalJilidTahsin = formatTahapan(firstT.tahapan || siswa.tahapan_tahsin || "-");
    awalHalTahsin = firstT.halaman || firstT.bab || "1";
    capaianJilidTahsin = formatTahapan(lastT.tahapan || siswa.tahapan_tahsin || "-");
    capaianHalTahsin = lastT.halaman || lastT.bab || "-";

    const validNilai = tahsinList
      .map((t) => gradeMap[t.nilai] || parseFloat(t.nilai))
      .filter((n) => !isNaN(n));
    if (validNilai.length > 0) {
      const avg = validNilai.reduce((a, b) => a + b, 0) / validNilai.length;
      nilaiTahsin = Math.round(avg);
    } else {
      nilaiTahsin = lastT.nilai || "-";
    }
    deskripsiTahsin = lastT.keterangan && lastT.keterangan !== "-" 
      ? lastT.keterangan 
      : `Terampil membaca (Capaian: ${capaianJilidTahsin} Hal. ${capaianHalTahsin})`;
  } else {
    deskripsiTahsin = periode === "bulanan" ? `Belum ada setoran tilawah bulan ini` : `Belum ada setoran tilawah semester ini`;
  }

  const tahfidzList = filterSetoranByAcademicYear(siswa, siswa.setoranHafalan || []);
  let awalSurahTahfidz = "-";
  let awalAyatTahfidz = "-";
  let capaianSurahTahfidz = "-";
  let capaianAyatTahfidz = "-";
  let nilaiTahfidz = "-";
  let deskripsiTahfidz = "-";

  if (tahfidzList.length > 0) {
    const firstH = tahfidzList[0];
    const lastH = tahfidzList[tahfidzList.length - 1];
    awalSurahTahfidz = firstH.surah?.nama_surah || "-";
    awalAyatTahfidz = firstH.ayat_awal || "1";
    capaianSurahTahfidz = lastH.surah?.nama_surah || "-";
    capaianAyatTahfidz = lastH.ayat_akhir || "-";

    const validNilai = tahfidzList
      .map((h) => h.rata_rata || h.nilai_hafalan)
      .filter((n) => typeof n === "number" && !isNaN(n));
    if (validNilai.length > 0) {
      const avg = validNilai.reduce((a, b) => a + b, 0) / validNilai.length;
      nilaiTahfidz = Math.round(avg);
    } else {
      nilaiTahfidz = lastH.predikat || "-";
    }
    deskripsiTahfidz = lastH.keterangan && lastH.keterangan !== "-" 
      ? lastH.keterangan 
      : `Hafalan lancar (Surah ${capaianSurahTahfidz} Ayat ${capaianAyatTahfidz})`;
  } else {
    deskripsiTahfidz = periode === "bulanan" ? `Belum ada setoran hafalan bulan ini` : `Belum ada setoran hafalan semester ini`;
  }

  return {
    awalJilidTahsin,
    awalHalTahsin,
    capaianJilidTahsin,
    capaianHalTahsin,
    nilaiTahsin,
    deskripsiTahsin,
    awalSurahTahfidz,
    awalAyatTahfidz,
    capaianSurahTahfidz,
    capaianAyatTahfidz,
    nilaiTahfidz,
    deskripsiTahfidz,
  };
};

const buildKolektifSheet = (workbook, sheetName, dataSiswa, periode = "semester", bulan = "") => {
  const sheet = workbook.addWorksheet(sheetName);

  // === BARIS 1: TOP HEADER ===
  sheet.mergeCells("A1:A3"); // Nama Siswa (rowspan 3)
  sheet.getCell("A1").value = "NAMA SISWA";

  sheet.mergeCells("B1:H1"); // UMMI (colspan 7)
  sheet.getCell("B1").value = "UMMI";

  sheet.mergeCells("I1:O1"); // TAHFIZH (colspan 7)
  sheet.getCell("I1").value = "TAHFIZH";

  // === BARIS 2: SUB-HEADER 1 ===
  // UMMI
  sheet.mergeCells("B2:B3");
  sheet.getCell("B2").value = "NAMA PENGAJAR";
  sheet.mergeCells("C2:D2");
  sheet.getCell("C2").value = periode === "bulanan" ? "AWAL BULAN" : "AWAL PERIODE";
  sheet.mergeCells("E2:F2");
  sheet.getCell("E2").value = periode === "bulanan" ? "AKHIR BULAN" : "CAPAIAN TERAKHIR";
  sheet.mergeCells("G2:G3");
  sheet.getCell("G2").value = "NILAI";
  sheet.mergeCells("H2:H3");
  sheet.getCell("H2").value = "DESKRIPSI";

  // TAHFIZH
  sheet.mergeCells("I2:I3");
  sheet.getCell("I2").value = "NAMA PENGAJAR";
  sheet.mergeCells("J2:K2");
  sheet.getCell("J2").value = periode === "bulanan" ? "AWAL BULAN" : "AWAL PERIODE";
  sheet.mergeCells("L2:M2");
  sheet.getCell("L2").value = periode === "bulanan" ? "AKHIR BULAN" : "CAPAIAN TERAKHIR";
  sheet.mergeCells("N2:N3");
  sheet.getCell("N2").value = "NILAI";
  sheet.mergeCells("O2:O3");
  sheet.getCell("O2").value = "DESKRIPSI";

  // === BARIS 3: SUB-HEADER 2 (Detail Jilid/Hal & Surat/Ayat) ===
  sheet.getCell("C3").value = "JILID";
  sheet.getCell("D3").value = "HAL";
  sheet.getCell("E3").value = "JILID";
  sheet.getCell("F3").value = "HAL";

  sheet.getCell("J3").value = "SURAT";
  sheet.getCell("K3").value = "AYAT";
  sheet.getCell("L3").value = "SURAT";
  sheet.getCell("M3").value = "AYAT";

  // === STYLING HEADER (Warna & Border) ===
  for (let r = 1; r <= 3; r++) {
    for (let c = 1; c <= 15; c++) {
      const cell = sheet.getRow(r).getCell(c);
      cell.font = { bold: true };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      // Beri warna Kuning ke semua header
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
      };
    }
  }
  // Beri warna Hijau khusus untuk Header Utama UMMI & TAHFIZH (sesuai gambar)
  sheet.getCell("B1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF92D050" },
  };
  sheet.getCell("I1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF92D050" },
  };

  // === DATA SISWA (Mulai dari Baris 4) ===
  let currentRow = 4;
  dataSiswa.forEach((siswa) => {
    const c = computeCapaianSiswa(siswa, periode);
    sheet.getCell(`A${currentRow}`).value = siswa.nama;

    // Data UMMI (B - H)
    sheet.getCell(`B${currentRow}`).value =
      siswa.halaqoh_tahsin?.user?.nama || "-";
    sheet.getCell(`C${currentRow}`).value = c.awalJilidTahsin; // Awal Jilid
    sheet.getCell(`D${currentRow}`).value = c.awalHalTahsin; // Awal Hal
    sheet.getCell(`E${currentRow}`).value = c.capaianJilidTahsin; // Akhir Jilid
    sheet.getCell(`F${currentRow}`).value = c.capaianHalTahsin; // Akhir Hal
    sheet.getCell(`G${currentRow}`).value = c.nilaiTahsin; // Nilai
    sheet.getCell(`H${currentRow}`).value = c.deskripsiTahsin; // Deskripsi

    // Data TAHFIZH (I - O)
    sheet.getCell(`I${currentRow}`).value =
      siswa.halaqoh_tahfidz?.user?.nama || "-";
    sheet.getCell(`J${currentRow}`).value = c.awalSurahTahfidz; // Awal Surat
    sheet.getCell(`K${currentRow}`).value = c.awalAyatTahfidz; // Awal Ayat
    sheet.getCell(`L${currentRow}`).value = c.capaianSurahTahfidz; // Akhir Surat
    sheet.getCell(`M${currentRow}`).value = c.capaianAyatTahfidz; // Akhir Ayat
    sheet.getCell(`N${currentRow}`).value = c.nilaiTahfidz; // Nilai
    sheet.getCell(`O${currentRow}`).value = c.deskripsiTahfidz; // Deskripsi

    // Border & Alignment Data
    for (let c = 1; c <= 15; c++) {
      const cell = sheet.getRow(currentRow).getCell(c);
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      if (c !== 1 && c !== 8 && c !== 15)
        cell.alignment = { horizontal: "center", vertical: "middle" };
      else cell.alignment = { vertical: "middle" };
    }
    currentRow++;
  });

  // Lebar Kolom Presisi
  sheet.getColumn("A").width = 25; // Nama
  sheet.getColumn("B").width = 18; // Pengajar
  sheet.getColumn("C").width = 8; // Jilid
  sheet.getColumn("D").width = 8; // Hal
  sheet.getColumn("E").width = 8; // Jilid
  sheet.getColumn("F").width = 8; // Hal
  sheet.getColumn("G").width = 8; // Nilai
  sheet.getColumn("H").width = 25; // Deskripsi
  sheet.getColumn("I").width = 18; // Pengajar
  sheet.getColumn("J").width = 12; // Surat
  sheet.getColumn("K").width = 8; // Ayat
  sheet.getColumn("L").width = 12; // Surat
  sheet.getColumn("M").width = 8; // Ayat
  sheet.getColumn("N").width = 8; // Nilai
  sheet.getColumn("O").width = 25; // Deskripsi
};

const buildIndividualSheet = (workbook, dataSiswa) => {
  const sheet = workbook.addWorksheet("Laporan Individual");
  let r = 1; // Variabel penunjuk baris (row)

  dataSiswa.forEach((siswa, index) => {
    // === 1. JUDUL RAPOR ===
    sheet.mergeCells(`A${r}:I${r}`);
    sheet.getCell(`A${r}`).value = "LAPORAN HASIL BELAJAR";
    sheet.getCell(`A${r}`).font = { bold: true, size: 14 };
    sheet.getCell(`A${r}`).alignment = { horizontal: "center" };
    r++;

    const namaTahun = siswa.riwayatKelas?.[0]?.tahun_akademik?.nama_tahun || "2026/2027";
    const semesterStr = namaTahun.toUpperCase().includes("GANJIL") ? "GANJIL" : (namaTahun.toUpperCase().includes("GENAP") ? "GENAP" : "");
    const tahunStr = namaTahun.replace(/ganjil|genap/gi, "").trim();
    
    sheet.mergeCells(`A${r}:I${r}`);
    sheet.getCell(`A${r}`).value = `SEMESTER ${semesterStr} TAHUN AJARAN ${tahunStr}`.trim();
    sheet.getCell(`A${r}`).font = { bold: true, size: 12 };
    sheet.getCell(`A${r}`).alignment = { horizontal: "center" };
    r += 2; // Lompat 1 baris kosong

    // === 2. BIODATA SISWA ===
    sheet.getCell(`A${r}`).value = "NAMA";
    sheet.getCell(`B${r}:C${r}`).value = `: ${siswa.nama}`;
    sheet.getCell(`E${r}:F${r}`).value = "NIS/NISN";
    sheet.getCell(`G${r}`).value = `: ${siswa.nis}`;
    r++;

    sheet.getCell(`A${r}`).value = "KELAS";
    sheet.getCell(`B${r}`).value =
      `: ${siswa.riwayatKelas?.[0]?.nama_kelas || "-"}`;
    sheet.getCell(`E${r}:F${r}`).value = "NO. PRESENSI";
    sheet.getCell(`G${r}`).value = `: ${index + 1}`;
    r += 2;

    sheet.mergeCells(`A${r}:I${r}`);
    sheet.getCell(`A${r}`).value =
      "I. KOMPETENSI AL QURAN (KURIKULUM UNGGULAN)";
    sheet.getCell(`A${r}`).font = { bold: true };
    sheet.getCell(`A${r}`).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    sheet.getCell(`A${r}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    };
    sheet.getCell(`A${r}`).border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
    r++;

    const tahsinStart = r;
    sheet.mergeCells(`A${tahsinStart}:A${tahsinStart + 2}`);
    sheet.getCell(`A${tahsinStart}`).value = "TAHSIN /\nUMMI";

    sheet.mergeCells(`B${tahsinStart}:B${tahsinStart + 1}`);
    sheet.getCell(`B${tahsinStart}`).value = "PENGAJAR";
    sheet.mergeCells(`C${tahsinStart}:C${tahsinStart + 1}`);
    sheet.getCell(`C${tahsinStart}`).value = "TARGET";
    sheet.mergeCells(`D${tahsinStart}:E${tahsinStart}`);
    sheet.getCell(`D${tahsinStart}`).value = "AWAL SEMESTER";
    sheet.mergeCells(`F${tahsinStart}:G${tahsinStart}`);
    sheet.getCell(`F${tahsinStart}`).value = "CAPAIAN";
    sheet.mergeCells(`H${tahsinStart}:H${tahsinStart + 1}`);
    sheet.getCell(`H${tahsinStart}`).value = "NILAI";
    sheet.mergeCells(`I${tahsinStart}:I${tahsinStart + 1}`);
    sheet.getCell(`I${tahsinStart}`).value = "DESKRIPSI";

    sheet.getCell(`D${tahsinStart + 1}`).value = "JILID";
    sheet.getCell(`E${tahsinStart + 1}`).value = "HAL.";
    sheet.getCell(`F${tahsinStart + 1}`).value = "JILID";
    sheet.getCell(`G${tahsinStart + 1}`).value = "HAL.";

    const tahsinDataRow = tahsinStart + 2;
    const c = computeCapaianSiswa(siswa);
    const kls = siswa.riwayatKelas?.[0]?.nama_kelas || "-";
    const thn = siswa.riwayatKelas?.[0]?.tahun_akademik?.nama_tahun || "";
    const target = getTargetQuran(kls, thn);

    sheet.getCell(`B${tahsinDataRow}`).value =
      siswa.halaqoh_tahsin?.user?.nama || "-";
    sheet.getCell(`C${tahsinDataRow}`).value = target.targetTahsin || "-"; // Target
    sheet.getCell(`D${tahsinDataRow}`).value = c.awalJilidTahsin; // Awal Jilid
    sheet.getCell(`E${tahsinDataRow}`).value = c.awalHalTahsin; // Awal Hal
    sheet.getCell(`F${tahsinDataRow}`).value = c.capaianJilidTahsin; // Capaian Jilid
    sheet.getCell(`G${tahsinDataRow}`).value = c.capaianHalTahsin; // Capaian Hal
    sheet.getCell(`H${tahsinDataRow}`).value = c.nilaiTahsin; // Nilai
    sheet.getCell(`I${tahsinDataRow}`).value = c.deskripsiTahsin; // Deskripsi

    const tahfidzStart = tahsinStart + 3;
    sheet.mergeCells(`A${tahfidzStart}:A${tahfidzStart + 2}`); // Memotong vertikal 3 baris!
    sheet.getCell(`A${tahfidzStart}`).value = "TAHFIZH";

    sheet.mergeCells(`B${tahfidzStart}:B${tahfidzStart + 1}`);
    sheet.getCell(`B${tahfidzStart}`).value = "PENGAJAR";
    sheet.mergeCells(`C${tahfidzStart}:C${tahfidzStart + 1}`);
    sheet.getCell(`C${tahfidzStart}`).value = "TARGET";
    sheet.mergeCells(`D${tahfidzStart}:E${tahfidzStart}`);
    sheet.getCell(`D${tahfidzStart}`).value = "AWAL SEMESTER";
    sheet.mergeCells(`F${tahfidzStart}:G${tahfidzStart}`);
    sheet.getCell(`F${tahfidzStart}`).value = "CAPAIAN";
    sheet.mergeCells(`H${tahfidzStart}:H${tahfidzStart + 1}`);
    sheet.getCell(`H${tahfidzStart}`).value = "NILAI";
    sheet.mergeCells(`I${tahfidzStart}:I${tahfidzStart + 1}`);
    sheet.getCell(`I${tahfidzStart}`).value = "DESKRIPSI";

    sheet.getCell(`D${tahfidzStart + 1}`).value = "SURAT";
    sheet.getCell(`E${tahfidzStart + 1}`).value = "AYAT";
    sheet.getCell(`F${tahfidzStart + 1}`).value = "SURAT";
    sheet.getCell(`G${tahfidzStart + 1}`).value = "AYAT";

    const tahfidzDataRow = tahfidzStart + 2;
    sheet.getCell(`B${tahfidzDataRow}`).value =
      siswa.halaqoh_tahfidz?.user?.nama || "-";
    sheet.getCell(`C${tahfidzDataRow}`).value = target.targetTahfidz || "-"; // Target
    sheet.getCell(`D${tahfidzDataRow}`).value = c.awalSurahTahfidz; // Awal Surat
    sheet.getCell(`E${tahfidzDataRow}`).value = c.awalAyatTahfidz; // Awal Ayat
    sheet.getCell(`F${tahfidzDataRow}`).value = c.capaianSurahTahfidz; // Capaian Surat
    sheet.getCell(`G${tahfidzDataRow}`).value = c.capaianAyatTahfidz; // Capaian Ayat
    sheet.getCell(`H${tahfidzDataRow}`).value = c.nilaiTahfidz; // Nilai
    sheet.getCell(`I${tahfidzDataRow}`).value = c.deskripsiTahfidz; // Deskripsi

    for (let rowIdx = tahsinStart; rowIdx <= tahfidzDataRow; rowIdx++) {
      for (let colIdx = 1; colIdx <= 9; colIdx++) {
        const cell = sheet.getRow(rowIdx).getCell(colIdx);
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };

        // Beri warna Abu-abu pada semua baris Header
        if (
          rowIdx === tahsinStart ||
          rowIdx === tahsinStart + 1 ||
          rowIdx === tahfidzStart ||
          rowIdx === tahfidzStart + 1
        ) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD9D9D9" },
          };
          cell.font = { bold: true };
        }
      }
    }
    // Warna Abu-abu khusus untuk kolom A (TAHSIN/UMMI & TAHFIZH)
    sheet.getCell(`A${tahsinStart}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    };
    sheet.getCell(`A${tahfidzStart}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9D9D9" },
    };
    sheet.getCell(`A${tahsinStart}`).font = { bold: true };
    sheet.getCell(`A${tahfidzStart}`).font = { bold: true };

    // Siapkan baris untuk siswa berikutnya (Beri jarak 4 baris kosong)
    r = tahfidzDataRow + 4;
  });

  // Lebar Kolom Individual
  sheet.getColumn("A").width = 16; // Kategori (Tahsin/Tahfidz)
  sheet.getColumn("B").width = 22; // Pengajar
  sheet.getColumn("C").width = 18; // Target
  sheet.getColumn("D").width = 12; // Awal 1
  sheet.getColumn("E").width = 10; // Awal 2
  sheet.getColumn("F").width = 12; // Capaian 1
  sheet.getColumn("G").width = 10; // Capaian 2
  sheet.getColumn("H").width = 8; // Nilai
  sheet.getColumn("I").width = 35; // Deskripsi
};

const generateJamaiReport = async (kategori, periode = "semester", bulan = "") => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sistem Tahsin Tahfidz";

  const allSiswa = await prismaClient.siswa.findMany({
    include: {
      riwayatKelas: {
        where: { status: "AKTIF" },
        include: { tahun_akademik: true },
      },
      halaqoh_tahsin: {
        include: { user: true },
      },
      halaqoh_tahfidz: {
        include: { user: true },
      },
      setoranTahsin: { orderBy: { timestamp: "asc" } },
      setoranHafalan: {
        orderBy: { timestamp: "asc" },
        include: { surah: true },
      },
      ujianPretest: { take: 1 },
    },
    orderBy: { nama: "asc" },
  });

  if (periode === "bulanan" && bulan) {
    allSiswa.forEach((siswa) => {
      siswa.setoranTahsin = (siswa.setoranTahsin || []).filter((s) => {
        if (!s.timestamp) return false;
        const d = new Date(s.timestamp);
        const yyyymm = d.toISOString().slice(0, 7);
        const mm = (d.getMonth() + 1).toString().padStart(2, "0");
        return yyyymm === bulan || mm === bulan.padStart(2, "0");
      });
      siswa.setoranHafalan = (siswa.setoranHafalan || []).filter((h) => {
        if (!h.timestamp) return false;
        const d = new Date(h.timestamp);
        const yyyymm = d.toISOString().slice(0, 7);
        const mm = (d.getMonth() + 1).toString().padStart(2, "0");
        return yyyymm === bulan || mm === bulan.padStart(2, "0");
      });
    });
  }

  if (kategori === "kelas") {
    const groupedByKelas = {};
    allSiswa.forEach((siswa) => {
      const namaKelas = siswa.riwayatKelas?.[0]?.nama_kelas || "Tanpa Kelas";
      if (!groupedByKelas[namaKelas]) groupedByKelas[namaKelas] = [];
      groupedByKelas[namaKelas].push(siswa);
    });

    for (const [namaKelas, siswaList] of Object.entries(groupedByKelas)) {
      const validSheetName = namaKelas
        .substring(0, 30)
        .replace(/[*?:\/\[\]]/g, "_");
      buildKolektifSheet(workbook, `Kelas ${validSheetName}`, siswaList, periode, bulan);
    }

    buildIndividualSheet(workbook, allSiswa);
  } else {
    const groupedByHalaqoh = {};
    allSiswa.forEach((siswa) => {
      const namaHalaqoh =
        siswa.halaqoh_tahsin?.nama ||
        siswa.halaqoh_tahfidz?.nama ||
        "Tanpa Halaqoh";
      if (!groupedByHalaqoh[namaHalaqoh]) groupedByHalaqoh[namaHalaqoh] = [];
      groupedByHalaqoh[namaHalaqoh].push(siswa);
    });

    for (const [namaHalaqoh, siswaList] of Object.entries(groupedByHalaqoh)) {
      const validSheetName = namaHalaqoh
        .substring(0, 30)
        .replace(/[*?:\/\[\]]/g, "_");
      buildKolektifSheet(workbook, validSheetName, siswaList, periode, bulan);
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

const generateIndividualReport = async (nis) => {
  const workbook = new ExcelJS.Workbook();

  const siswa = await prismaClient.siswa.findUnique({
    where: { nis: nis },
    include: {
      riwayatKelas: {
        where: { status: "AKTIF" },
        include: { tahun_akademik: true },
      },
      halaqoh_tahsin: { include: { user: true } },
      halaqoh_tahfidz: { include: { user: true } },
      setoranTahsin: { orderBy: { timestamp: "asc" } },
      setoranHafalan: {
        orderBy: { timestamp: "asc" },
        include: { surah: true },
      },
      ujianPretest: { take: 1 },
    },
  });

  if (!siswa) {
    throw new Error("Siswa tidak ditemukan!");
  }

  buildIndividualSheet(workbook, [siswa]);

  return await workbook.xlsx.writeBuffer();
};

// Di dalam BACKEND/src/services/export-service.js

const exportHalaqohDistribution = async (kategori = "TAHSIN") => {
  // 1. Ambil data halaqoh beserta guru dan siswa + riwayat setorannya
  const daftarHalaqoh = await prismaClient.halaqoh.findMany({
    where: { kategori: kategori },
    include: {
      user: { select: { nama: true } },
      [kategori === "TAHSIN" ? "siswaTahsin" : "siswaTahfidz"]: {
        include: {
          riwayatKelas: { where: { status: "AKTIF" }, take: 1 },
          setoranTahsin: { orderBy: { timestamp: "desc" }, take: 1 },
          setoranHafalan: {
            orderBy: { timestamp: "desc" },
            take: 1,
            include: { surah: true },
          },
        },
      },
    },
  });

  const workbook = new ExcelJS.Workbook();
  const sheetName =
    kategori === "TAHSIN" ? "Kelompok Ummi" : "Kelompok Tahfidz";
  const sheet = workbook.addWorksheet(sheetName);

  // 2. Judul Utama
  sheet.mergeCells("A1:F1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = `PEMBAGIAN KELOMPOK ${kategori === "TAHSIN" ? "UMMI" : "TAHFIDZ"} SMT GANJIL 2024-2025`;
  titleCell.font = { name: "Arial", size: 14, bold: true };
  titleCell.alignment = { horizontal: "center" };
  sheet.addRow([]); // Spasi baris 2

  // 3. Loop Setiap Kelompok Halaqoh
  daftarHalaqoh.forEach((halaqoh) => {
    const namaGuru = halaqoh.user?.nama || "Ust/Ustadzah";
    const namaRuang = halaqoh.nama || "-";
    const siswaList =
      halaqoh[kategori === "TAHSIN" ? "siswaTahsin" : "siswaTahfidz"] || [];

    // Header Kelompok & Ruang
    const rowHeader = sheet.addRow([
      `U. ${namaGuru}`,
      "",
      "",
      `Ruang : ${namaRuang}`,
    ]);
    rowHeader.font = { bold: true };

    // Header Tabel Bertingkat (Merge cell Kolom D & E untuk Tartil/Tahfidz)
    const startRowIdx = sheet.rowCount + 1;
    if (kategori === "TAHSIN") {
      sheet.addRow(["NO", "Nama", "KLS", "Tartil", "", "Ket"]);
      sheet.addRow(["", "", "", "Jilid", "Hal", ""]);
    } else {
      sheet.addRow(["NO", "Nama", "KLS", "Tahfidz", "", "Ket"]);
      sheet.addRow(["", "", "", "Surah", "Ayat", ""]);
    }

    // Terapkan Merge Cell Header Bertingkat
    sheet.mergeCells(`A${startRowIdx}:A${startRowIdx + 1}`); // NO
    sheet.mergeCells(`B${startRowIdx}:B${startRowIdx + 1}`); // Nama
    sheet.mergeCells(`C${startRowIdx}:C${startRowIdx + 1}`); // KLS
    sheet.mergeCells(`D${startRowIdx}:E${startRowIdx}`); // Tartil/Tahfidz
    sheet.mergeCells(`F${startRowIdx}:F${startRowIdx + 1}`); // Ket

    // Style Header (Background Hijau/Biru muda & Border)
    for (let r = startRowIdx; r <= startRowIdx + 1; r++) {
      sheet.getRow(r).eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "E2EFDA" },
        }; // Warna hijau lembut ala PDF
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }

    // 4. Isi Data Siswa 1 - 15 (Tetap cetak baris kosong jika kurang dari 15)
    for (let i = 1; i <= 15; i++) {
      const s = siswaList[i - 1];
      let rowData = [i, "", "", "", "", ""];

      if (s) {
        const kls = s.riwayatKelas?.[0]?.nama_kelas || "-";
        if (kategori === "TAHSIN") {
          const setoran = s.setoranTahsin?.[0];
          const jilid = formatTahapan(setoran?.tahapan || s.tahapan_tahsin || "-");
          const hal =
            setoran?.halaman || setoran?.bab
              ? `Hal ${setoran?.halaman || setoran?.bab}`
              : "-";
          rowData = [i, s.nama, kls, jilid, hal, ""];
        } else {
          const hafalan = s.setoranHafalan?.[0];
          const surah = hafalan?.surah?.nama_surah || hafalan?.no_surah
            ? (hafalan.surah?.nama_surah ? `Surah ${hafalan.surah.nama_surah}` : `Surah ke-${hafalan.no_surah}`)
            : "-";
          const ayat = hafalan?.ayat_akhir
            ? `Ayat ${hafalan.ayat_akhir}`
            : "-";
          rowData = [i, s.nama, kls, surah, ayat, ""];
        }
      }

      const addedRow = sheet.addRow(rowData);
      // Beri border pada setiap sel baris data (1-15) agar rapi diprint
      addedRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (colNumber <= 6) {
          cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          };
          if (colNumber === 1 || colNumber === 3)
            cell.alignment = { horizontal: "center" }; // NO dan KLS rata tengah
        }
      });
    }

    sheet.addRow([]); // 2 Baris kosong antar kelompok halaqoh
    sheet.addRow([]);
  });

  // Atur lebar kolom
  sheet.columns = [
    { width: 6 }, // NO
    { width: 35 }, // Nama Siswa
    { width: 10 }, // KLS
    { width: 20 }, // Jilid/Surah
    { width: 15 }, // Hal/Ayat
    { width: 12 }, // Ket
  ];

  return workbook.xlsx.writeBuffer();
};

const generateWordLaporanUmmi = async () => {
  // Ambil seluruh siswa aktif beserta pencapaian Tahsin terakhirnya
  const siswaList = await prismaClient.siswa.findMany({
    orderBy: { nama: "asc" },
    include: {
      riwayatKelas: { where: { status: "AKTIF" } },
      setoranTahsin: { orderBy: { timestamp: "desc" }, take: 1 },
    },
  });

  const totalGuru = await prismaClient.user.count({
    where: { role: "GURU" },
  });
  const koordUser = await prismaClient.user.findFirst({
    where: { role: { in: ["SUPER_ADMIN", "DIREKTUR"] } },
  });

  const prefixes = [
    "tpq",
    "kb",
    "tka",
    "tkb",
    "sd1",
    "sd2",
    "sd3",
    "sd4",
    "sd5",
    "sd6",
  ];
  const cols = [
    "jml",
    "dws",
    "pratk",
    "j1",
    "j2",
    "j3",
    "j4",
    "j5",
    "j6",
    "quran",
    "ghorib",
    "tajwid",
    "lain",
  ];
  const stats = {};
  prefixes.forEach((p) => {
    cols.forEach((c) => {
      stats[`${p}_${c}`] = 0;
    });
  });

  siswaList.forEach((s) => {
    const k = String(s.riwayatKelas?.[0]?.nama_kelas || "").toUpperCase();
    let prefix = "sd1";
    if (
      (k.includes("I") &&
        !k.includes("II") &&
        !k.includes("IV") &&
        !k.includes("VI")) ||
      k.startsWith("1")
    ) {
      prefix = "sd1";
    } else if (
      (k.includes("II") && !k.includes("III") && !k.includes("VII")) ||
      k.startsWith("2")
    ) {
      prefix = "sd2";
    } else if (
      (k.includes("III") && !k.includes("VIII")) ||
      k.startsWith("3")
    ) {
      prefix = "sd3";
    } else if ((k.includes("IV") && !k.includes("XIV")) || k.startsWith("4")) {
      prefix = "sd4";
    } else if (
      (k.includes("V") && !k.includes("VI") && !k.includes("IV")) ||
      k.startsWith("5")
    ) {
      prefix = "sd5";
    } else if (k.includes("VI") || k.startsWith("6")) {
      prefix = "sd6";
    } else if (k.includes("TPQ")) {
      prefix = "tpq";
    } else if (k.includes("KB")) {
      prefix = "kb";
    } else if (k.includes("TK A")) {
      prefix = "tka";
    } else if (k.includes("TK B")) {
      prefix = "tkb";
    }

    const jilidStr = String(
      s.setoranTahsin?.[0]?.tahapan || s.tahapan_tahsin || "",
    ).toLowerCase();
    let col = "lain";
    if (jilidStr.includes("dewasa") || jilidStr.includes("dws")) {
      col = "dws";
    } else if (jilidStr.includes("pra") || jilidStr.includes("tk")) {
      col = "pratk";
    } else if (jilidStr.includes("1") || jilidStr === "jilid 1") {
      col = "j1";
    } else if (jilidStr.includes("2") || jilidStr === "jilid 2") {
      col = "j2";
    } else if (jilidStr.includes("3") || jilidStr === "jilid 3") {
      col = "j3";
    } else if (jilidStr.includes("4") || jilidStr === "jilid 4") {
      col = "j4";
    } else if (jilidStr.includes("5") || jilidStr === "jilid 5") {
      col = "j5";
    } else if (jilidStr.includes("6") || jilidStr === "jilid 6") {
      col = "j6";
    } else if (jilidStr.includes("ghorib") || jilidStr.includes("gharib")) {
      col = "ghorib";
    } else if (jilidStr.includes("tajwid")) {
      col = "tajwid";
    } else if (
      jilidStr.includes("qur") ||
      jilidStr.includes("tartil") ||
      jilidStr.includes("juz") ||
      jilidStr.includes("tahfidz")
    ) {
      col = "quran";
    }

    stats[`${prefix}_jml`]++;
    stats[`${prefix}_${col}`]++;
  });

  const renderData = {
    nama_lembaga: "SDI KHOIRU UMMAH SURABAYA",
    alamat: "Gayungsari Barat X / 6 Surabaya",
    telp_lembaga: "031-8287786",
    fax_lembaga: "031-8287849",
    koordinator: koordUser?.nama || "Ah. Yusuf, S.Pd.I",
    telp_hp: "-",
    jml_guru: String(totalGuru || "-"),
    jml_sertifikat: String(totalGuru || "-"),
    jml_blm_sertifikat: "0",
    jml_santri: String(siswaList.length || "0"),
    tempat_tanggal: `Surabaya, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`,
    kepala_sekolah: "Kepala Sekolah SDI Khoiru Ummah",
  };

  prefixes.forEach((p) => {
    cols.forEach((c) => {
      const val = stats[`${p}_${c}`];
      renderData[`${p}_${c}`] = val > 0 ? String(val) : "-";
    });
  });

  const content = fs.readFileSync(
    path.resolve("templates/laporan_ummi_template.docx"),
    "binary",
  );
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  doc.render(renderData);
  return doc.getZip().generate({ type: "nodebuffer" });
};
// 💡 2. FUNGSI UNTUK POIN 4: Rapor Individual Siswa (Word)
const generateWordRapor = async (nis) => {
  const siswa = await prismaClient.siswa.findUnique({
    where: { nis },
    include: {
      riwayatKelas: {
        where: { status: "AKTIF" },
        include: { tahun_akademik: true },
      },
      halaqoh_tahsin: { include: { user: true } },
      halaqoh_tahfidz: { include: { user: true } },
      setoranTahsin: { orderBy: { timestamp: "asc" } },
      setoranHafalan: {
        orderBy: { timestamp: "asc" },
        include: { surah: true },
      },
      ujianPretest: { take: 1 },
    },
  });
  if (!siswa) throw new Error("Data siswa tidak ditemukan");

  // 1. Data Kelas, Semester, dan Target
  const kelasAktif = siswa.riwayatKelas?.[0];
  const namaKelas = kelasAktif?.nama_kelas || "-";
  const namaTahun = kelasAktif?.tahun_akademik?.nama_tahun || "2026/2027 GENAP";
  const semesterTahunAjaran = `SEMESTER ${namaTahun.toUpperCase().includes("GANJIL") ? "GANJIL" : "GENAP"} TAHUN AJARAN ${namaTahun.replace(/ganjil|genap/gi, "").trim()}`;

  const { targetTahsin, targetTahfidz } = getTargetQuran(namaKelas, namaTahun);

  // 2. Data Pengajar
  const pengajarTahsin = siswa.halaqoh_tahsin?.user?.nama || "-";
  const pengajarTahfidz = siswa.halaqoh_tahfidz?.user?.nama || "-";

  // 3. Awal Semester vs Capaian Akhir (Tahsin)
  const tahsinList = filterSetoranByAcademicYear(siswa, siswa.setoranTahsin || []);
  let awalJilidTahsin = "-";
  let awalHalTahsin = "-";
  let capaianJilidTahsin = "-";
  let capaianHalTahsin = "-";
  let nilaiTahsin = "-";
  let deskripsiTahsin = "-";

  if (tahsinList.length > 0) {
    const firstT = tahsinList[0];
    const lastT = tahsinList[tahsinList.length - 1];
    awalJilidTahsin = formatTahapan(firstT.tahapan || "-");
    awalHalTahsin =
      firstT.halaman || firstT.bab
        ? `Hal ${firstT.halaman || firstT.bab}`
        : "-";
    capaianJilidTahsin = formatTahapan(lastT.tahapan || "-");
    capaianHalTahsin =
      lastT.halaman || lastT.bab ? `Hal ${lastT.halaman || lastT.bab}` : "-";

    const validNilai = tahsinList
      .map((t) => parseFloat(t.nilai))
      .filter((n) => !isNaN(n));
    if (validNilai.length > 0) {
      const avg = validNilai.reduce((a, b) => a + b, 0) / validNilai.length;
      nilaiTahsin = Math.round(avg).toString();
    } else {
      nilaiTahsin = lastT.nilai || "A";
    }

    deskripsiTahsin = `Alhamdulillah ananda ${siswa.nama} telah mencapai ${capaianJilidTahsin} (${capaianHalTahsin}) dengan nilai rata-rata ${nilaiTahsin}. Pertahankan semangat tilawah dan tahsin.`;
  } else {
    deskripsiTahsin = `Belum ada catatan setoran tahsin pada semester ini.`;
  }

  // 4. Awal Semester vs Capaian Akhir (Tahfizh)
  const tahfidzList = filterSetoranByAcademicYear(siswa, siswa.setoranHafalan || []);
  let awalSurahTahfidz = "-";
  let awalAyatTahfidz = "-";
  let capaianSurahTahfidz = "-";
  let capaianAyatTahfidz = "-";
  let nilaiTahfidz = "-";
  let deskripsiTahfidz = "-";

  if (tahfidzList.length > 0) {
    const firstH = tahfidzList[0];
    const lastH = tahfidzList[tahfidzList.length - 1];
    awalSurahTahfidz = firstH.surah?.nama_surah || "-";
    awalAyatTahfidz = firstH.ayat_awal ? `Ayat ${firstH.ayat_awal}` : "-";
    capaianSurahTahfidz = lastH.surah?.nama_surah || "-";
    capaianAyatTahfidz = lastH.ayat_akhir ? `Ayat ${lastH.ayat_akhir}` : "-";

    const validNilai = tahfidzList
      .map((h) => h.rata_rata || h.nilai_hafalan)
      .filter((n) => typeof n === "number" && !isNaN(n));
    if (validNilai.length > 0) {
      const avg = validNilai.reduce((a, b) => a + b, 0) / validNilai.length;
      nilaiTahfidz = Math.round(avg).toString();
    } else {
      nilaiTahfidz = "90";
    }

    deskripsiTahfidz = `Alhamdulillah capaian hafalan ananda ${siswa.nama} mencapai Surah ${capaianSurahTahfidz} (${capaianAyatTahfidz}) dengan nilai akumulasi ${nilaiTahfidz}. Semangat murojaah di rumah.`;
  } else {
    deskripsiTahfidz = `Belum ada catatan setoran hafalan pada semester ini.`;
  }

  const content = fs.readFileSync(
    path.resolve("templates/rapor_template.docx"),
    "binary",
  );
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  doc.render({
    nama: siswa.nama,
    nis: siswa.nis,
    kelas: namaKelas,
    semester_tahun_ajaran: semesterTahunAjaran,
    pengajar_tahsin: pengajarTahsin,
    target_tahsin: targetTahsin,
    awal_jilid_tahsin: awalJilidTahsin,
    awal_hal_tahsin: awalHalTahsin,
    jilid_tahsin: capaianJilidTahsin,
    hal_tahsin: capaianHalTahsin,
    nilai_tahsin: nilaiTahsin,
    deskripsi_tahsin: deskripsiTahsin,
    pengajar_tahfidz: pengajarTahfidz,
    target_tahfidz: targetTahfidz,
    awal_surah_tahfidz: awalSurahTahfidz,
    awal_ayat_tahfidz: awalAyatTahfidz,
    surah_tahfidz: capaianSurahTahfidz,
    ayat_tahfidz: capaianAyatTahfidz,
    nilai_tahfidz: nilaiTahfidz,
    deskripsi_tahfidz: deskripsiTahfidz,
    catatan_perkembangan: deskripsiTahsin,
  });

  return doc.getZip().generate({ type: "nodebuffer" });
};

const exportMunaqosyah = async () => {
  const pengajuanList = await prismaClient.pengajuan_Ujian.findMany({
    where: { tahapan: "MUNAQOSYAH", kategori: "TAHSIN" },
    include: {
      siswa: {
        select: {
          nis: true,
          nama: true,
          tahapan_tahsin: true,
          riwayatKelas: { where: { status: "AKTIF" } },
          setoranTahsin: { orderBy: { timestamp: "desc" }, take: 1 },
        }
      },
      guru: { select: { nama: true } }
    },
    orderBy: { timestamp: "asc" }
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Pengajuan Munaqosyah");

  sheet.mergeCells("A1:G1");
  const title = sheet.getCell("A1");
  title.value = "DATA PENGAJUAN MUNAQOSYAH TAHSIN";
  title.font = { size: 14, bold: true };
  title.alignment = { horizontal: "center" };

  sheet.addRow([]);

  const headerRow = sheet.addRow(["NO", "NIS", "NAMA SISWA", "KELAS", "GURU PENGAJU", "TANGGAL PENGAJUAN", "POSISI BACAAN TERAKHIR"]);
  headerRow.font = { bold: true };
  headerRow.eachCell(cell => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "E2EFDA" } };
    cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
  });

  pengajuanList.forEach((p, idx) => {
    const s = p.siswa;
    const dateStr = p.timestamp ? new Date(p.timestamp).toLocaleDateString("id-ID") : "-";
    const kls = s?.riwayatKelas?.[0]?.nama_kelas || "-";
    const setoran = s?.setoranTahsin?.[0];
    let terakhir = s?.tahapan_tahsin ? formatTahapan(s.tahapan_tahsin) : "-";
    if (setoran) {
      terakhir = `${formatTahapan(setoran.tahapan)} Hal ${setoran.halaman || setoran.bab || "-"}`;
    }

    const row = sheet.addRow([
      idx + 1,
      s?.nis || "-",
      s?.nama || "-",
      kls,
      p.guru?.nama || "-",
      dateStr,
      terakhir
    ]);
    row.eachCell(cell => {
      cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    });
  });

  sheet.getColumn(1).width = 5;
  sheet.getColumn(2).width = 15;
  sheet.getColumn(3).width = 30;
  sheet.getColumn(4).width = 15;
  sheet.getColumn(5).width = 25;
  sheet.getColumn(6).width = 20;
  sheet.getColumn(7).width = 30;

  return await workbook.xlsx.writeBuffer();
};

export default {
  buildKolektifSheet,
  buildIndividualSheet,
  generateJamaiReport,
  generateIndividualReport,
  exportHalaqohDistribution,
  generateWordRapor,
  generateWordLaporanUmmi,
  exportMunaqosyah,
};
