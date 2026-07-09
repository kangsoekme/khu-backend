import Joi from "joi";

const halaqohValidation = Joi.object({
  nama: Joi.string().required(),
  kategori: Joi.string().valid("TAHSIN", "TAHFIDZ").required(),
  userId: Joi.string().required(),
  nis_siswa: Joi.array().items(Joi.string()).min(1).required(),
});

const editHalaqohValidation = Joi.object({
  nama: Joi.string(),
  kategori: Joi.string().valid("TAHSIN", "TAHFIDZ"),
  userId: Joi.string(),
  nis_siswa: Joi.array().items(Joi.string()).min(1),
});

export { halaqohValidation, editHalaqohValidation };
