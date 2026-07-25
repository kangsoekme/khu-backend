import Joi from "joi";

const halaqohValidation = Joi.object({
  nama: Joi.string().max(100).required(),
  kategori: Joi.string().valid("TAHSIN", "TAHFIDZ").required(),
  userId: Joi.string().uuid().required(),
  nis_siswa: Joi.array()
    .items(Joi.string().alphanum().max(20))
    .min(1)
    .required(),
});

const editHalaqohValidation = Joi.object({
  nama: Joi.string().max(100),
  kategori: Joi.string().valid("TAHSIN", "TAHFIDZ"),
  userId: Joi.string().uuid(),
  nis_siswa: Joi.array().items(Joi.string().alphanum().max(20)).min(1),
});

export { halaqohValidation, editHalaqohValidation };
