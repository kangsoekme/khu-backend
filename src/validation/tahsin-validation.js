import Joi from "joi";

const tahsinValidation = Joi.object({
  nis_siswa: Joi.string().required(),
  halaqohId: Joi.string().uuid().required(),

  tahapan: Joi.string()
    .valid(
      "JILID_1",
      "JILID_2",
      "JILID_3",
      "JILID_4",
      "JILID_5",
      "JILID_6",
      "TILAWAH_JUZ_1_5",
      "GHARIB",
      "TAJWID",
      "ALQURAN",
      "MUNAQOSYAH",
    )
    .required(),

  // Field untuk bacaan Al-Quran (Gharib, Tajwid, AlQuran, dst)
  no_surah: Joi.number().min(1).max(114).allow(null).optional(),
  ayat_awal: Joi.number().min(0).optional(),
  ayat_akhir: Joi.number().max(286).optional(),
  materi: Joi.string().optional(),

  // Field untuk hafalan surah
  hafalan_surah: Joi.number().min(0).max(114).allow(null).optional(),
  hafalan_ayat_awal: Joi.number().allow(null).optional(),
  hafalan_ayat_akhir: Joi.number().allow(null).optional(),

  // Field untuk Jilid/Buku
  jilid: Joi.number().min(0).allow(null).optional(),
  bab: Joi.number().min(0).allow(null).optional(),

  nilai: Joi.string()
    .valid("A+", "A", "B+", "B", "B-", "C+", "C", "C-", "D")
    .required(),
  keterangan: Joi.string().allow("", null).optional(),
  status_kelanjutan: Joi.string().valid("LANJUT", "MENGULANG").optional(),
});

const pretestValidation = Joi.object({
  nis_siswa: Joi.string().required(),
  keterangan: Joi.string().allow("", null).optional(),
  nilai: Joi.string().allow("", null).optional(),
  tahapan: Joi.string()
    .valid(
      "JILID_1",
      "JILID_2",
      "JILID_3",
      "JILID_4",
      "JILID_5",
      "JILID_6",
      "TILAWAH_JUZ_1_5",
      "GHARIB",
      "TAJWID",
      "ALQURAN",
      "MUNAQOSYAH",
    )
    .required(),
  jilid: Joi.number().allow(null).optional(),
  halaman: Joi.number().allow(null).optional(),
  no_surah: Joi.number().allow(null).optional(),
  ayat_awal: Joi.number().allow(null).optional(),
  ayat_akhir: Joi.number().allow(null).optional(),
  materi: Joi.string().allow("", null).optional(),
}).unknown(true);

export { tahsinValidation, pretestValidation };
