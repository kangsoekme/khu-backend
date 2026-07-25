import ujianService from "../services/ujian-service.js";

const addUjianKenaikanTahsin = async (req, res, next) => {
  try {
    const request = req.body;
    request.nis_siswa = req.params.nis;
    const result = await ujianService.addUjianKenaikanTahsin(request);
    res.status(200).json({
      status: "success",
      message: "Hasil ujian berhasil disimpan",
      data: "result",
    });
  } catch (error) {
    next(error);
  }
};

const getRiwayatUjianSiswa = async (req, res, next) => {
  try {
    const nis = req.params.nis;
    const data = await ujianService.getRiwayatUjianSiswa(nis);
    res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
};

export default { addUjianKenaikanTahsin, getRiwayatUjianSiswa };
