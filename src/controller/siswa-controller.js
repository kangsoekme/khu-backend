import siswaService from "../services/siswa-service.js";

const addSiswa = async (req, res, next) => {
  try {
    const result = await siswaService.addSiswa(req.body);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const editSiswa = async (req, res, next) => {
  try {
    const nis = req.params.nis;
    const result = await siswaService.editSiswa(nis, req.body);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const getAllSiswa = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await siswaService.getAllSiswa(page, limit, search);
    res.status(200).json({ status: "success", data: result.data, meta: { totalData: result.totalData, totalPages: result.totalPages, currentPage: result.currentPage } });
  } catch (error) {
    next(error);
  }
};

const getSiswa = async (req, res, next) => {
  try {
    const nis = req.params.nis;

    if (req.user.role === "WALI" && req.user.nis !== nis) {
      return res.status(403).json({
        status: "error",
        message:
          "Akses ditolak, Anda hanya dapat melihat profil anak Anda sendiri.",
      });
    }

    const result = await siswaService.getSiswa(nis);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const deleteSiswa = async (req, res, next) => {
  try {
    const nis = req.params.nis;
    await siswaService.deleteSiswa(nis);
    res.status(200).json({
      status: "success",
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

const importSiswaExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File excel not found" });
    }

    const result = await siswaService.importSiswaExcelSync(req.file.path);

    res.status(200).json({
      status: "success",
      message: `Berhasil mengimpor ${result.total_imported} data siswa secara sinkronus`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBulkSiswa = async (req, res, next) => {
  try {
    const { nis_array } = req.body;
    await siswaService.deleteBulkSiswa(nis_array);
    res
      .status(200)
      .json({ status: "success", data: "Berhasil menghapus siswa terpilih" });
  } catch (error) {
    next(error);
  }
};

const getWaitingPretest = async (req, res, next) => {
  try {
    const result = await siswaService.getWaitingPretest();
    res.status(200).json({ status: "success", data: result.data });
  } catch (error) {
    next(error);
  }
};

const getWaitingHalaqoh = async (req, res, next) => {
  try {
    const { kategori } = req.query;
    const result = await siswaService.getWaitingHalaqoh(kategori);
    res.status(200).json({ status: "success", data: result.data });
  } catch (error) {
    next(error);
  }
};

export default {
  addSiswa,
  getAllSiswa,
  getSiswa,
  editSiswa,
  deleteSiswa,
  importSiswaExcel,
  deleteBulkSiswa,
  getWaitingPretest,
  getWaitingHalaqoh,
};
