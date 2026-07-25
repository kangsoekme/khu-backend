import ExcelJS from "exceljs";
import { prismaClient } from "../application/database.js";

const buildKolektifSheet = (workbook, sheetName, dataSiswa) => {
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
  sheet.getCell("C2").value = "AWAL SEMESTER";
  sheet.mergeCells("E2:F2");
  sheet.getCell("E2").value = "AKHIR SEMESTER";
  sheet.mergeCells("G2:G3");
  sheet.getCell("G2").value = "NILAI";
  sheet.mergeCells("H2:H3");
  sheet.getCell("H2").value = "DESKRIPSI";

  // TAHFIZH
  sheet.mergeCells("I2:I3");
  sheet.getCell("I2").value = "NAMA PENGAJAR";
  sheet.mergeCells("J2:K2");
  sheet.getCell("J2").value = "AWAL SEMESTER";
  sheet.mergeCells("L2:M2");
  sheet.getCell("L2").value = "AKHIR SEMESTER";
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
    sheet.getCell(`A${currentRow}`).value = siswa.nama;

    // Data UMMI (B - H)
    sheet.getCell(`B${currentRow}`).value =
      siswa.halaqoh_tahsin?.user?.nama || "-";
    sheet.getCell(`C${currentRow}`).value = "1"; // Awal Jilid
    sheet.getCell(`D${currentRow}`).value = "1"; // Awal Hal
    sheet.getCell(`E${currentRow}`).value = "2"; // Akhir Jilid
    sheet.getCell(`F${currentRow}`).value = "15"; // Akhir Hal
    sheet.getCell(`G${currentRow}`).value = 85; // Nilai
    sheet.getCell(`H${currentRow}`).value = "Terampil membaca"; // Deskripsi

    // Data TAHFIZH (I - O)
    sheet.getCell(`I${currentRow}`).value =
      siswa.halaqoh_tahfidz?.user?.nama || "-";
    sheet.getCell(`J${currentRow}`).value = "An-Nas"; // Awal Surat
    sheet.getCell(`K${currentRow}`).value = "1"; // Awal Ayat
    sheet.getCell(`L${currentRow}`).value = "Al-Falaq"; // Akhir Surat
    sheet.getCell(`M${currentRow}`).value = "5"; // Akhir Ayat
    sheet.getCell(`N${currentRow}`).value = 90; // Nilai
    sheet.getCell(`O${currentRow}`).value = "Hafalan lancar"; // Deskripsi

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

    sheet.mergeCells(`A${r}:I${r}`);
    sheet.getCell(`A${r}`).value = "SEMESTER GENAP TAHUN AJARAN 2025/2026";
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
    sheet.getCell(`B${tahsinDataRow}`).value =
      siswa.halaqoh_tahsin?.user?.nama || "-";
    sheet.getCell(`C${tahsinDataRow}`).value = "-"; // Target
    sheet.getCell(`D${tahsinDataRow}`).value = "6"; // Awal Jilid
    sheet.getCell(`E${tahsinDataRow}`).value = "29"; // Awal Hal
    sheet.getCell(`F${tahsinDataRow}`).value = "Al Quran"; // Capaian Jilid
    sheet.getCell(`G${tahsinDataRow}`).value = "Qs 2:30"; // Capaian Hal
    sheet.getCell(`H${tahsinDataRow}`).value = 90; // Nilai
    sheet.getCell(`I${tahsinDataRow}`).value =
      "Ananda sangat terampil dalam belajar Al-Quran"; // Deskripsi

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
    sheet.getCell(`C${tahfidzDataRow}`).value = "Surah Al-Fajr"; // Target
    sheet.getCell(`D${tahfidzDataRow}`).value = "Abasa"; // Awal Surat
    sheet.getCell(`E${tahfidzDataRow}`).value = "24"; // Awal Ayat
    sheet.getCell(`F${tahfidzDataRow}`).value = "Al-Tatfif"; // Capaian Surat
    sheet.getCell(`G${tahfidzDataRow}`).value = "11"; // Capaian Ayat
    sheet.getCell(`H${tahfidzDataRow}`).value = 93; // Nilai
    sheet.getCell(`I${tahfidzDataRow}`).value =
      "Ananda sangat terampil dalam menghafal Al-Quran"; // Deskripsi

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

const generateJamaiReport = async (kategori) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sistem Tahsin Tahfidz";

  const allSiswa = await prismaClient.siswa.findMany({
    include: {
      riwayatKelas: true,
      halaqoh_tahsin: {
        include: { user: true },
      },
      halaqoh_tahfidz: {
        include: { user: true },
      },
    },
    orderBy: { nama: "asc" },
  });

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
      buildKolektifSheet(workbook, `Kelas ${validSheetName}`, siswaList);
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
      buildKolektifSheet(workbook, validSheetName, siswaList);
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
      riwayatKelas: true,
      halaqoh_tahsin: { include: { user: true } },
      halaqoh_tahfidz: { include: { user: true } },
    },
  });

  if (!siswa) {
    throw new Error("Siswa tidak ditemukan!");
  }

  buildIndividualSheet(workbook, [siswa]);

  return await workbook.xlsx.writeBuffer();
};

export default {
  buildKolektifSheet,
  buildIndividualSheet,
  generateJamaiReport,
  generateIndividualReport,
};
