import halaqohService from "../services/halaqoh-service.js";

const addHalaqoh = async (req, res, next) => {
  try {
    const result = await halaqohService.addHalaqoh(req.body);
    const formattedData = {
      id: result.id,
      nama_halaqoh: result.nama,
      kategori: result.kategori,
      guru: result.user,
      siswa:
        result.kategori === "TAHSIN" ? result.siswaTahsin : result.siswaTahfidz,
    };

    res.status(200).json({
      status: "success",
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};

const getAllHalaqoh = async (req, res, next) => {
  try {
    const result = await halaqohService.getAllHalaqoh();
    const formattedData = result.map((halaqoh) => ({
      id: halaqoh.id,
      nama_halaqoh: halaqoh.nama,
      kategori: halaqoh.kategori,
      guru: halaqoh.user,
      siswa:
        halaqoh.kategori === "TAHSIN"
          ? halaqoh.siswaTahsin
          : halaqoh.siswaTahfidz,
    }));

    res.status(200).json({
      status: "success",
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};

const getHalaqoh = async (req, res, next) => {
  try {
    const halaqohId = req.params.id;
    const result = await halaqohService.getHalaqoh(halaqohId);

    const formattedData = {
      id: result.id,
      nama_halaqoh: result.nama,
      kategori: result.kategori,
      guru: result.user,
      siswa:
        result.kategori === "TAHSIN" ? result.siswaTahsin : result.siswaTahfidz,
    };

    res.status(200).json({
      status: "success",
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};

const updateHalaqoh = async (req, res, next) => {
  try {
    const halaqohId = req.params.id;
    const result = await halaqohService.editHalaqoh(halaqohId, req.body);

    const formattedData = {
      id: result.id,
      nama_halaqoh: result.nama,
      kategori: result.kategori,
      guru: result.user,
      siswa:
        result.kategori === "TAHSIN" ? result.siswaTahsin : result.siswaTahfidz,
    };

    res.status(200).json({
      status: "success",
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};

const deleteHalaqoh = async (req, res, next) => {
  try {
    const halaqohId = req.params.id;

    await halaqohService.deleteHalaqoh(halaqohId);

    res.status(200).json({
      status: "success",
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  addHalaqoh,
  getAllHalaqoh,
  getHalaqoh,
  updateHalaqoh,
  deleteHalaqoh,
};
