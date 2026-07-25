import Joi from "joi";

const siswaValidation = Joi.object({
  nis: Joi.string().alphanum().max(50).required(),
  nama: Joi.string().max(50).required(),
  jenis_kelamin: Joi.string().valid("LAKI_LAKI", "PEREMPUAN").required(),
  tanggal_lahir: Joi.date().iso().required(),
  alamat: Joi.string().max(100).required(),
  nama_wali: Joi.string().max(100).required(),
  no_telp: Joi.string().max(50).required(),
  kelas: Joi.string().max(10).required(),
  profile_photo: Joi.string(),
  halaqoh_tahsin_id: Joi.string().uuid(),
  halaqoh_tahfidz_id: Joi.string().uuid(),
  tahapan_tahsin: Joi.string().valid(
    "JILID_DASAR",
    "TAJWID",
    "GHORIB",
    "ALQURAN",
  ),
});

const editSiswaValidation = Joi.object({
  nis: Joi.string().alphanum().max(50),
  nama: Joi.string().max(50),
  jenis_kelamin: Joi.string().valid("LAKI_LAKI", "PEREMPUAN"),
  tanggal_lahir: Joi.date().iso(),
  alamat: Joi.string().max(100),
  nama_wali: Joi.string().max(100),
  no_telp: Joi.string().max(50),
  kelas: Joi.string().max(10),
  profile_photo: Joi.string(),
  halaqoh_tahsin_id: Joi.string().uuid(),
  halaqoh_tahfidz_id: Joi.string().uuid(),
  tahapan_tahsin: Joi.string().valid(
    "JILID_DASAR",
    "TAJWID",
    "GHORIB",
    "ALQURAN",
  ),
});

export { siswaValidation, editSiswaValidation };
