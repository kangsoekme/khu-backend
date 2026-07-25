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
    const result = await tahsinService.getRiwayatTahsin(nis);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { addTahsin, getRiwayatTahsin, addPretest };
