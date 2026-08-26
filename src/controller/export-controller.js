import exportService from "../services/export-service.js";

// Tanggal "hari ini" zona WIB (UTC+7) format YYYY-MM-DD untuk nama file.
// Sebelumnya memakai toISOString (UTC) sehingga nama file bisa mundur
// sehari dibanding tanggal lokal Indonesia.
const jakartaToday = () =>
  new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().split("T")[0];

const exportJamai = async (req, res, next) => {
  try {
    const kategori = req.query.kategori || "kelas";
    const periode = req.query.periode || "semester";
    const bulan = req.query.bulan || "";

    // GURU-2: teruskan user agar export di-scope ke halaqoh guru
    const excelBuffer = await exportService.generateJamaiReport(
      kategori,
      periode,
      bulan,
      req.user,
    );

    const infoPeriode =
      periode === "bulanan" && bulan ? `_BULANAN_${bulan}` : `_SEMESTERAN`;
    const fileName = `Laporan_Jamai_${kategori.toUpperCase()}${infoPeriode}_${jakartaToday()}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    res.status(200).send(excelBuffer);
  } catch (error) {
    next(error);
  }
};

const exportIndividual = async (req, res, next) => {
  try {
    const nis = req.params.nis;

    if (req.user.role === "WALI" && req.user.nis !== nis) {
      return res.status(403).json({
        status: "error",
        message: "Akses ditolak, Anda hanya dapat melihat data anak Anda sendiri.",
      });
    }

    const excelBuffer = await exportService.generateIndividualReport(nis);

    const fileName = `Rapor_Individual_${nis}_${jakartaToday()}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    res.status(200).send(excelBuffer);
  } catch (error) {
    next(error);
  }
};

const exportHalaqoh = async (req, res, next) => {
  try {
    const kategori = req.query.kategori || "TAHSIN";
    const { buffer, labelPeriode } =
      await exportService.exportHalaqohDistribution(kategori);
    // labelPeriode diambil dari tahun akademik AKTIF (cth. "GANJIL_2025-2026"),
    // bukan hardcode "2024_2025" seperti sebelumnya yang basi tiap tahun.
    const fileName = `Pembagian_Kelompok_${kategori.toUpperCase()}_${labelPeriode || jakartaToday()}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.status(200).send(buffer);
  } catch (error) {
    next(error);
  }
};

const exportLaporanUmmiWord = async (req, res, next) => {
  try {
    const wordBuffer = await exportService.generateWordLaporanUmmi();
    const fileName = `Laporan_Perkembangan_Ummi_${jakartaToday()}.docx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.status(200).send(wordBuffer);
  } catch (error) {
    next(error);
  }
};
// 💡 2. Controller Ekspor Rapor Individu Word (Poin 4)
const exportIndividualWord = async (req, res, next) => {
  try {
    const nis = req.params.nis;

    if (req.user.role === "WALI" && req.user.nis !== nis) {
      return res.status(403).json({
        status: "error",
        message: "Akses ditolak, Anda hanya dapat melihat data anak Anda sendiri.",
      });
    }

    const wordBuffer = await exportService.generateWordRapor(nis);
    const fileName = `Rapor_Individual_${nis}_${jakartaToday()}.docx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.status(200).send(wordBuffer);
  } catch (error) {
    next(error);
  }
};

const exportMunaqosyah = async (req, res, next) => {
  try {
    const excelBuffer = await exportService.exportMunaqosyah();
    const fileName = `Data_Pengajuan_Munaqosyah_${jakartaToday()}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    res.status(200).send(excelBuffer);
  } catch (error) {
    next(error);
  }
};

export default {
  exportJamai,
  exportIndividual,
  exportHalaqoh,
  exportLaporanUmmiWord,
  exportIndividualWord,
  exportMunaqosyah,
};
