import setoranHafalanService from "../services/hafalan-service.js";
import ownershipCheck from "../middleware/ownership-check.js";

const addHafalan = async (req, res, next) => {
  try {
    req.body.nis_siswa = req.params.nis;
    // GURU-1: verifikasi kepemilikan siswa & halaqoh sebelum menambah setoran
    await ownershipCheck.assertGuruOwnsSiswa(req.user, req.body.nis_siswa);
    await ownershipCheck.assertGuruOwnsHalaqoh(req.user, req.body.halaqohId);
    const result = await setoranHafalanService.addHafalan(req.body);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getRiwayatHafalan = async (req, res, next) => {
  try {
    const nis = req.params.nis;
    
    if (req.user.role === "WALI" && req.user.nis !== nis) {
      return res.status(403).json({
        status: "error",
        message: "Akses ditolak, Anda hanya dapat melihat data anak Anda sendiri.",
      });
    }

    const result = await setoranHafalanService.getRiwayatHafalan(nis);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const editHafalan = async (req, res, next) => {
  try {
    const id = req.params.id;
    // GURU-1: verifikasi kepemilikan setoran sebelum mengubah
    await ownershipCheck.assertGuruOwnsSetoran(
      req.user, id, "setoran_Hafalan", "halaqohId",
    );
    const result = await setoranHafalanService.editHafalan(id, req.body);
    res.status(200).json({
      status: "success",
      data: result,
      message: "Hafalan berhasil diperbarui",
    });
  } catch (error) {
    next(error);
  }
};
const deleteHafalan = async (req, res, next) => {
  try {
    const id = req.params.id;
    // GURU-1: verifikasi kepemilikan setoran sebelum menghapus
    await ownershipCheck.assertGuruOwnsSetoran(
      req.user, id, "setoran_Hafalan", "halaqohId",
    );
    await setoranHafalanService.deleteHafalan(id);
    res
      .status(200)
      .json({ status: "success", message: "Hafalan berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};

export default { addHafalan, getRiwayatHafalan, editHafalan, deleteHafalan };
