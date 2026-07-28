import murajaahService from "../services/murajaah-service.js";

const addMurajaah = async (req, res, next) => {
  try {
    req.body.nis_siswa = req.params.nis;
    const result = await murajaahService.addMurajaah(req.body);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getRiwayatMurajaah = async (req, res, next) => {
  try {
    const nis = req.params.nis;
    
    if (req.user.role === "WALI" && req.user.nis !== nis) {
      return res.status(403).json({
        status: "error",
        message: "Akses ditolak, Anda hanya dapat melihat data anak Anda sendiri.",
      });
    }

    const result = await murajaahService.getRiwayatMurajaah(nis);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const editMurajaah = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.nis;
    const result = await murajaahService.editMurajaah(id, req.body);
    res.status(200).json({
      status: "success",
      data: result,
      message: "Murajaah berhasil diperbarui",
    });
  } catch (error) {
    next(error);
  }
};
const deleteMurajaah = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.nis;
    await murajaahService.deleteMurajaah(id);
    res
      .status(200)
      .json({ status: "success", message: "Murajaah berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

export default {
  addMurajaah,
  getRiwayatMurajaah,
  editMurajaah,
  deleteMurajaah,
};
