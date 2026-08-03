import Joi from "joi";

// BE-4: Longgarkan validasi email agar menerima semua TLD valid
// (sebelumnya hanya .com, menolak .sch.id, .ac.id, .co.id, .org, dll.)
const emailRule = Joi.string().email({
  minDomainSegments: 1,
  tlds: { allow: false },
});

// user

const loginValidation = Joi.object({
  email: emailRule.required(),
  password: Joi.string().required(),
});

const userValidation = Joi.object({
  nama: Joi.string()
    .max(100)
    .pattern(/^[a-zA-Z0-9\s.,'-]+$/)
    .messages({ "string.pattern.base": "Input aneh tidak diizinkan" })
    .required(),
  email: emailRule.required(),
  password: Joi.string().required(),
  no_telp: Joi.string().max(15).required(),
  role: Joi.string().valid("SUPER_ADMIN", "DIREKTUR", "GURU").required(),
  profile_photo: Joi.string(),

  jenis_kelamin: Joi.string()
    .valid("LAKI_LAKI", "PEREMPUAN")
    .default("LAKI_LAKI"),
  is_sertifikasi: Joi.boolean().default(false),
});

const editUserValidation = Joi.object({
  nama: Joi.string()
    .max(100)
    .pattern(/^[a-zA-Z0-9\s.,'-]+$/)
    .messages({ "string.pattern.base": "Input aneh tidak diizinkan" }),
  email: emailRule,
  password: Joi.string(),
  no_telp: Joi.string().max(15),
  role: Joi.string().valid("SUPER_ADMIN", "DIREKTUR", "GURU"),
  profile_photo: Joi.string(),

  jenis_kelamin: Joi.string().valid("LAKI_LAKI", "PEREMPUAN"),
  is_sertifikasi: Joi.boolean(),
}).min(1);

export { userValidation, editUserValidation, loginValidation };
