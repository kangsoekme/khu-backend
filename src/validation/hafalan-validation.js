import Joi from "joi";

const hafalanValidation = Joi.object({
  nis_siswa: Joi.string().max(100).alphanum().required(),
  halaqohId: Joi.string().uuid().required(),
  // BE-7: min(0).positive() kontradiktif (positive() menuntut >0).
  // Surah bernomor 1-114, jadi gunakan min(1).max(114).
  no_surah: Joi.number().min(1).max(114).required(),
  ayat_awal: Joi.number().min(1).required(),
  ayat_akhir: Joi.number().max(286).required(),
  jumlah_pengulangan: Joi.number().min(0).max(60).required(),
  toggle_tarjamah: Joi.boolean().required(),
  jumlah_salah: Joi.number().max(20).required(),
  nilai_bacaan: Joi.number().min(0).max(100).required(),
});

export { hafalanValidation };
