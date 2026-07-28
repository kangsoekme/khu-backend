import tahunAkademikService from "../services/tahun-akademik-service.js";

const getAllTahunAkademik = async (req, res, next) => {
  try {
    const result = await tahunAkademikService.getAllTahunAkademik();
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getActiveTahunAkademik = async (req, res, next) => {
  try {
    const result = await tahunAkademikService.getActiveTahunAkademik();
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createTahunAkademik = async (req, res, next) => {
  try {
    const result = await tahunAkademikService.createTahunAkademik(req.body);
    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const transisiSemester = async (req, res, next) => {
  try {
    const result = await tahunAkademikService.transisiSemester(req.body);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllTahunAkademik,
  getActiveTahunAkademik,
  createTahunAkademik,
  transisiSemester,
};
