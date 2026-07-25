import setoranHafalanService from "../services/hafalan-service.js";

const addHafalan = async (req, res, next) => {
  try {
    req.body.nis_siswa = req.params.nis;
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
    const result = await setoranHafalanService.getRiwayatHafalan(nis);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { addHafalan, getRiwayatHafalan };
