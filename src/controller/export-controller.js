import exportService from "../services/export-service.js";

const exportJamai = async (req, res, next) => {
  try {
    const kategori = req.query.kategori || "kelas";
    const periode = req.query.periode || "semester";
    const bulan = req.query.bulan || "";

    const excelBuffer = await exportService.generateJamaiReport(
      kategori,
      periode,
      bulan
    );

    const tanggal = new Date().toISOString().split("T")[0];
    const infoPeriode =
      periode === "bulanan" && bulan ? `_BULANAN_${bulan}` : `_SEMESTERAN`;
    const fileName = `Laporan_Jamai_${kategori.toUpperCase()}${infoPeriode}_${tanggal}.xlsx`;

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

    const fileName = `Rapor_Individual_${nis}.xlsx`;

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
    const excelBuffer = await exportService.exportHalaqohDistribution(kategori);
    const fileName = `Pembagian_Kelompok_${kategori}_2024_2025.xlsx`;
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

const exportLaporanUmmiWord = async (req, res, next) => {
  try {
    const wordBuffer = await exportService.generateWordLaporanUmmi();
    const tanggal = new Date().toISOString().split("T")[0];
    const fileName = `Laporan_Perkembangan_Ummi_${tanggal}.docx`;
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
    const fileName = `Rapor_Individual_${nis}.docx`;
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
    const tanggal = new Date().toISOString().split("T")[0];
    const fileName = `Data_Pengajuan_Munaqosyah_${tanggal}.xlsx`;

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
