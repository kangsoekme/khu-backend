const fs = require('fs');

const path = 'C:/Users/PC_24/Documents/sj/project/BACKEND/src/services/export-service.js';
let content = fs.readFileSync(path, 'utf8');

const buildKolektifSheetReplacement = `const buildKolektifSheet = (workbook, sheetName, dataSiswa, periode = "semester", bulan = "", sheetType = "ALL") => {
  const sheet = workbook.addWorksheet(sheetName);

  // === BARIS 1: TOP HEADER ===
  sheet.mergeCells("A1:A3"); // Nama Siswa (rowspan 3)
  sheet.getCell("A1").value = "NAMA SISWA";

  if (sheetType === "ALL" || sheetType === "TAHSIN") {
    sheet.mergeCells("B1:H1"); // UMMI (colspan 7)
    sheet.getCell("B1").value = "UMMI";
    // UMMI Headers
    sheet.mergeCells("B2:B3"); sheet.getCell("B2").value = "NAMA PENGAJAR";
    sheet.mergeCells("C2:D2"); sheet.getCell("C2").value = periode === "bulanan" ? "AWAL BULAN" : "AWAL PERIODE";
    sheet.mergeCells("E2:F2"); sheet.getCell("E2").value = periode === "bulanan" ? "AKHIR BULAN" : "CAPAIAN TERAKHIR";
    sheet.mergeCells("G2:G3"); sheet.getCell("G2").value = "NILAI";
    sheet.mergeCells("H2:H3"); sheet.getCell("H2").value = "DESKRIPSI";
    sheet.getCell("C3").value = "JILID"; sheet.getCell("D3").value = "HAL";
    sheet.getCell("E3").value = "JILID"; sheet.getCell("F3").value = "HAL";
  }

  if (sheetType === "ALL" || sheetType === "TAHFIDZ") {
    const startCol = sheetType === "TAHFIDZ" ? "B" : "I";
    const endCol = sheetType === "TAHFIDZ" ? "H" : "O";
    sheet.mergeCells(\`\${startCol}1:\${endCol}1\`); // TAHFIZH
    sheet.getCell(\`\${startCol}1\`).value = "TAHFIZH";
    // TAHFIZH Headers
    const colB = sheetType === "TAHFIDZ" ? "B" : "I";
    const colC = sheetType === "TAHFIDZ" ? "C" : "J";
    const colD = sheetType === "TAHFIDZ" ? "D" : "K";
    const colE = sheetType === "TAHFIDZ" ? "E" : "L";
    const colF = sheetType === "TAHFIDZ" ? "F" : "M";
    const colG = sheetType === "TAHFIDZ" ? "G" : "N";
    const colH = sheetType === "TAHFIDZ" ? "H" : "O";
    sheet.mergeCells(\`\${colB}2:\${colB}3\`); sheet.getCell(\`\${colB}2\`).value = "NAMA PENGAJAR";
    sheet.mergeCells(\`\${colC}2:\${colD}2\`); sheet.getCell(\`\${colC}2\`).value = periode === "bulanan" ? "AWAL BULAN" : "AWAL PERIODE";
    sheet.mergeCells(\`\${colE}2:\${colF}2\`); sheet.getCell(\`\${colE}2\`).value = periode === "bulanan" ? "AKHIR BULAN" : "CAPAIAN TERAKHIR";
    sheet.mergeCells(\`\${colG}2:\${colG}3\`); sheet.getCell(\`\${colG}2\`).value = "NILAI";
    sheet.mergeCells(\`\${colH}2:\${colH}3\`); sheet.getCell(\`\${colH}2\`).value = "DESKRIPSI";
    sheet.getCell(\`\${colC}3\`).value = "SURAT"; sheet.getCell(\`\${colD}3\`).value = "AYAT";
    sheet.getCell(\`\${colE}3\`).value = "SURAT"; sheet.getCell(\`\${colF}3\`).value = "AYAT";
  }

  // Styling Header
  const totalCols = sheetType === "ALL" ? 15 : 8;
  for (let r = 1; r <= 3; r++) {
    for (let c = 1; c <= totalCols; c++) {
      const cell = sheet.getRow(r).getCell(c);
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFF00" } };
    }
  }
  
  if (sheetType === "ALL" || sheetType === "TAHSIN") {
    sheet.getCell("B1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF92D050" } };
  }
  if (sheetType === "ALL" || sheetType === "TAHFIDZ") {
    const targetCell = sheetType === "TAHFIDZ" ? "B1" : "I1";
    sheet.getCell(targetCell).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF92D050" } };
  }

  // Data Siswa
  let currentRow = 4;
  dataSiswa.forEach((siswa) => {
    const c = computeCapaianSiswa(siswa, periode);
    sheet.getCell(\`A\${currentRow}\`).value = siswa.nama;

    if (sheetType === "ALL" || sheetType === "TAHSIN") {
      sheet.getCell(\`B\${currentRow}\`).value = siswa.halaqoh_tahsin?.user?.nama || "-";
      sheet.getCell(\`C\${currentRow}\`).value = c.awalJilidTahsin; 
      sheet.getCell(\`D\${currentRow}\`).value = c.awalHalTahsin; 
      sheet.getCell(\`E\${currentRow}\`).value = c.capaianJilidTahsin; 
      sheet.getCell(\`F\${currentRow}\`).value = c.capaianHalTahsin; 
      sheet.getCell(\`G\${currentRow}\`).value = c.nilaiTahsin; 
      sheet.getCell(\`H\${currentRow}\`).value = c.deskripsiTahsin; 
    }

    if (sheetType === "ALL" || sheetType === "TAHFIDZ") {
      const colB = sheetType === "TAHFIDZ" ? "B" : "I";
      const colC = sheetType === "TAHFIDZ" ? "C" : "J";
      const colD = sheetType === "TAHFIDZ" ? "D" : "K";
      const colE = sheetType === "TAHFIDZ" ? "E" : "L";
      const colF = sheetType === "TAHFIDZ" ? "F" : "M";
      const colG = sheetType === "TAHFIDZ" ? "G" : "N";
      const colH = sheetType === "TAHFIDZ" ? "H" : "O";

      sheet.getCell(\`\${colB}\${currentRow}\`).value = siswa.halaqoh_tahfidz?.user?.nama || "-";
      sheet.getCell(\`\${colC}\${currentRow}\`).value = c.awalSurahTahfidz; 
      sheet.getCell(\`\${colD}\${currentRow}\`).value = c.awalAyatTahfidz; 
      sheet.getCell(\`\${colE}\${currentRow}\`).value = c.capaianSurahTahfidz; 
      sheet.getCell(\`\${colF}\${currentRow}\`).value = c.capaianAyatTahfidz; 
      sheet.getCell(\`\${colG}\${currentRow}\`).value = c.nilaiTahfidz; 
      sheet.getCell(\`\${colH}\${currentRow}\`).value = c.deskripsiTahfidz; 
    }

    // Border & Alignment Data
    for (let col = 1; col <= totalCols; col++) {
      const cell = sheet.getRow(currentRow).getCell(col);
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      if (col !== 1 && col !== 8 && col !== 15)
        cell.alignment = { horizontal: "center", vertical: "middle" };
      else cell.alignment = { vertical: "middle" };
    }
    currentRow++;
  });

  // Lebar Kolom Presisi
  sheet.getColumn("A").width = 25; // Nama
  if (sheetType === "ALL" || sheetType === "TAHSIN") {
    sheet.getColumn("B").width = 18; sheet.getColumn("C").width = 8; sheet.getColumn("D").width = 8;
    sheet.getColumn("E").width = 8; sheet.getColumn("F").width = 8; sheet.getColumn("G").width = 8;
    sheet.getColumn("H").width = 25; 
  }
  if (sheetType === "ALL" || sheetType === "TAHFIDZ") {
    const cB = sheetType === "TAHFIDZ" ? "B" : "I";
    const cC = sheetType === "TAHFIDZ" ? "C" : "J";
    const cD = sheetType === "TAHFIDZ" ? "D" : "K";
    const cE = sheetType === "TAHFIDZ" ? "E" : "L";
    const cF = sheetType === "TAHFIDZ" ? "F" : "M";
    const cG = sheetType === "TAHFIDZ" ? "G" : "N";
    const cH = sheetType === "TAHFIDZ" ? "H" : "O";
    sheet.getColumn(cB).width = 18; sheet.getColumn(cC).width = 12; sheet.getColumn(cD).width = 8;
    sheet.getColumn(cE).width = 12; sheet.getColumn(cF).width = 8; sheet.getColumn(cG).width = 8;
    sheet.getColumn(cH).width = 25; 
  }
};`;

const generateJamaiReportHalaqohBlockOld = `  } else {
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
        .replace(/[*?:\\/\\[\\]]/g, "_");
      buildKolektifSheet(workbook, validSheetName, siswaList, periode, bulan);
    }
  }`;

const generateJamaiReportHalaqohBlockNew = `  } else {
    const groupedByTahsin = {};
    const groupedByTahfidz = {};
    allSiswa.forEach((siswa) => {
      if (siswa.halaqoh_tahsin?.nama) {
        if (!groupedByTahsin[siswa.halaqoh_tahsin.nama]) groupedByTahsin[siswa.halaqoh_tahsin.nama] = [];
        groupedByTahsin[siswa.halaqoh_tahsin.nama].push(siswa);
      }
      if (siswa.halaqoh_tahfidz?.nama) {
        if (!groupedByTahfidz[siswa.halaqoh_tahfidz.nama]) groupedByTahfidz[siswa.halaqoh_tahfidz.nama] = [];
        groupedByTahfidz[siswa.halaqoh_tahfidz.nama].push(siswa);
      }
    });

    for (const [nama, list] of Object.entries(groupedByTahsin)) {
      let validSheetName = nama.substring(0, 30).replace(/[*?:\\/\\[\\]]/g, "_");
      if (workbook.worksheets.find(s => s.name === validSheetName)) {
        validSheetName = validSheetName.substring(0, 20) + " (Tahsin)";
      }
      buildKolektifSheet(workbook, validSheetName, list, periode, bulan, "TAHSIN");
    }
    for (const [nama, list] of Object.entries(groupedByTahfidz)) {
      let validSheetName = nama.substring(0, 30).replace(/[*?:\\/\\[\\]]/g, "_");
      if (workbook.worksheets.find(s => s.name === validSheetName)) {
        validSheetName = validSheetName.substring(0, 20) + " (Tahfidz)";
      }
      buildKolektifSheet(workbook, validSheetName, list, periode, bulan, "TAHFIDZ");
    }
  }`;

const regexBuildKolektif = /const buildKolektifSheet = [\s\S]*?const buildIndividualSheet = \(workbook, dataSiswa\) => {/g;
content = content.replace(regexBuildKolektif, buildKolektifSheetReplacement + '\n\nconst buildIndividualSheet = (workbook, dataSiswa) => {');

content = content.replace(generateJamaiReportHalaqohBlockOld, generateJamaiReportHalaqohBlockNew);

// update generateWordLaporanUmmi timestamp logic
const oldTimestampCode = 'tempat_tanggal: `Surabaya, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`,';
const newTimestampCode = 'tempat_tanggal: `Surabaya, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} ${new Date().toLocaleTimeString("id-ID")}`,';
content = content.replace(oldTimestampCode, newTimestampCode);

fs.writeFileSync(path, content, 'utf8');
console.log('Update successful');
