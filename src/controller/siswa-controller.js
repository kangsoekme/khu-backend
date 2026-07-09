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
    const result = await siswaService.getAllSiswa();
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const getSiswa = async (req, res, next) => {
  try {
    const nis = req.params.nis;
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

export default {
  addSiswa,
  getAllSiswa,
  getSiswa,
  editSiswa,
  deleteSiswa,
};
