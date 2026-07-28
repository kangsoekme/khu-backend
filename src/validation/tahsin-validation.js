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

  no_surah: Joi.number().min(0).max(114).positive().required(),
  hafalan_surah: Joi.number().min(0).max(114).positive().required(),
  hafalan_ayat_awal: Joi.number().required(),
  hafalan_ayat_akhir: Joi.number().required(),
  jilid: Joi.number().min(0).allow(null),
  bab: Joi.number().min(0).allow(null),
  no_surah: Joi.number().min(0).max(114).positive().allow(null),
  ayat_awal: Joi.number().min(0),
  ayat_akhir: Joi.number().max(286),
  materi: Joi.string(),

  nilai: Joi.string()
    .valid("A+", "A", "B+", "B", "B-", "C+", "C", "C-", "D")
    .required(),
  keterangan: Joi.string(),
  status_kelanjutan: Joi.string().valid("LANJUT", "MENGULANG"),
});

const pretestValidation = Joi.object({
  nis_siswa: Joi.string().required(),
  keterangan: Joi.string().allow("").optional(),
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
});

export { tahsinValidation, pretestValidation };
