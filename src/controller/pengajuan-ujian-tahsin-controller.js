import pengajuanUjianTahsinService from "../services/pengajuan-ujian-tahsin-service.js";

const addPengajuan = async (req, res, next) => {
  try {
    const request = req.body;
    request.nis_siswa = req.params.nis;
    request.id_guru = req.user.id;

    const result = await pengajuanUjianTahsinService.addPengajuan(request);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const getDaftarPengajuan = async (req, res, next) => {
  try {
    const kategori = req.query.kategori || "TAHSIN";
    const data = await pengajuanUjianTahsinService.getDaftarPengajuan(kategori);
    res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
};

export default { addPengajuan, getDaftarPengajuan };
