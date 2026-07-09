import Joi from "joi";

const siswaValidation = Joi.object({
  nis: Joi.string().required(),
  nama: Joi.string().required(),
  jenis_kelamin: Joi.string().valid("LAKI_LAKI", "PEREMPUAN").required(),
  alamat: Joi.string().required(),
  nama_wali: Joi.string().required(),
  no_telp: Joi.string().required(),
  kelas: Joi.string().required(),
  profile_photo: Joi.string(),
  halaqoh_tahsin_id: Joi.string(),
  halaqoh_tahfidz_id: Joi.string(),
  tahapan_tahsin: Joi.string()
    .valid("JILID_DASAR", "TAJWID", "GHORIB", "ALQURAN")
    .required(),
});

const editSiswaValidation = Joi.object({
  nis: Joi.string(),
  nama: Joi.string(),
  jenis_kelamin: Joi.string().valid("LAKI_LAKI", "PEREMPUAN"),
  alamat: Joi.string(),
  nama_wali: Joi.string(),
  no_telp: Joi.string(),
  kelas: Joi.string(),
  profile_photo: Joi.string(),
  halaqoh_tahsin_id: Joi.string(),
  halaqoh_tahfidz_id: Joi.string(),
  tahapan_tahsin: Joi.string().valid(
    "JILID_DASAR",
    "TAJWID",
    "GHORIB",
    "ALQURAN",
  ),
});

export { siswaValidation, editSiswaValidation };
