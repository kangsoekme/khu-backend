import murajaahService from "../services/murajaah-service.js";
import ownershipCheck from "../middleware/ownership-check.js";

const addMurajaah = async (req, res, next) => {
  try {
    req.body.nis_siswa = req.params.nis;
    // GURU-1: verifikasi kepemilikan siswa & halaqoh sebelum menambah setoran
    await ownershipCheck.assertGuruOwnsSiswa(req.user, req.body.nis_siswa);
    await ownershipCheck.assertGuruOwnsHalaqoh(req.user, req.body.halaqohId);
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
    const id = req.params.id;
    // GURU-1: verifikasi kepemilikan setoran sebelum mengubah
    await ownershipCheck.assertGuruOwnsSetoran(
      req.user, id, "setoran_Murajaah", "halaqohId",
    );
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
    const id = req.params.id;
    // GURU-1: verifikasi kepemilikan setoran sebelum menghapus
    await ownershipCheck.assertGuruOwnsSetoran(
      req.user, id, "setoran_Murajaah", "halaqohId",
    );
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
