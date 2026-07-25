import laporanService from "../services/laporan-service.js";

const getLaporanTahfidz = async (req, res, next) => {
  try {
    const data = await laporanService.getLaporanTahfidz();
    res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
};

const getLaporanTahsin = async (req, res, next) => {
  try {
    const data = await laporanService.getLaporanTahsin();
    res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
};

const getLaporanGuruTahfidz = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await laporanService.getLaporanGuruTahfidz(userId);
    res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
};

const getLaporanGuruTahsin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await laporanService.getLaporanGuruTahsin(userId);
    res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
};

export default {
  getLaporanTahfidz,
  getLaporanTahsin,
  getLaporanGuruTahfidz,
  getLaporanGuruTahsin,
};
