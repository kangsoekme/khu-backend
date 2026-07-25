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
    const result = await murajaahService.getRiwayatMurajaah(nis);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { addMurajaah, getRiwayatMurajaah };
