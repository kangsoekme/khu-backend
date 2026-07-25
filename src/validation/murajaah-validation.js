import Joi from "joi";

const murajaahValidation = Joi.object({
  nis_siswa: Joi.string().max(20).alphanum().required(),
  halaqohId: Joi.string().uuid().required(),
  no_surah: Joi.number().min(0).max(114).positive().required(),
  ayat_awal: Joi.number().required(),
  ayat_akhir: Joi.number().max(286).required(),
  jumlah_salah: Joi.number().max(20).required(),

  nilai_bacaan: Joi.number().min(0).max(100).required(),
});

export { murajaahValidation };
