import exportService from "../services/export-service.js";

const exportJamai = async (req, res, next) => {
  try {
    const kategori = req.query.kategori || "kelas";

    const excelBuffer = await exportService.generateJamaiReport(kategori);

    const tanggal = new Date().toISOString().split("T")[0];
    const fileName = `Laporan_Jamai_${kategori.toUpperCase()}_${tanggal}.xlsx`;

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

export default {
  exportJamai,
  exportIndividual,
};
