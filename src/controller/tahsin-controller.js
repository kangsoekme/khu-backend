import tahsinService from "../services/tahsin-service.js";

const addTahsin = async (req, res, next) => {
  try {
    req.body.nis_siswa = req.params.nis;
    const result = await tahsinService.addTahsin(req.body);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const addPretest = async (req, res, next) => {
  try {
    req.body.nis_siswa = req.params.nis;
    const result = await tahsinService.addPretest(req.body);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getRiwayatTahsin = async (req, res, next) => {
  try {
    const nis = req.params.nis;
    
    if (req.user.role === "WALI" && req.user.nis !== nis) {
      return res.status(403).json({
        status: "error",
        message: "Akses ditolak, Anda hanya dapat melihat data anak Anda sendiri.",
      });
    }

    const result = await tahsinService.getRiwayatTahsin(nis);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const editTahsin = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.nis;
    const result = await tahsinService.editTahsin(id, req.body);
    res.status(200).json({
      status: "success",
      data: result,
      message: "Setoran berhasil diperbarui",
    });
  } catch (error) {
    next(error);
  }
};
const deleteTahsin = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.nis;
    await tahsinService.deleteTahsin(id);
    res
      .status(200)
      .json({ status: "success", message: "Setoran berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

export default {
  addTahsin,
  getRiwayatTahsin,
  addPretest,
  editTahsin,
  deleteTahsin,
};
