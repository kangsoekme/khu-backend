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

export default { addHalaqoh };
