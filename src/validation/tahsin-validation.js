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
      "MUNAQOSYAH",
    )
    .required(),

  // Field untuk bacaan Al-Quran (Gharib, Tajwid, dst)
  no_surah: Joi.number().min(1).max(114).allow(null).optional(),
  // 286 = jumlah ayat terbanyak (QS Al-Baqarah); batas per-surah dicek di service
  ayat_awal: Joi.number().min(0).max(286).optional(),
  ayat_akhir: Joi.number().min(0).max(286).optional(),
  materi: Joi.string().optional(),

  // Field untuk hafalan surah
  hafalan_surah: Joi.number().min(0).max(114).allow(null).optional(),
  hafalan_ayat_awal: Joi.number().min(0).max(286).allow(null).optional(),
  hafalan_ayat_akhir: Joi.number().min(0).max(286).allow(null).optional(),

  // Field untuk Jilid/Buku
  jilid: Joi.number().min(0).allow(null).optional(),
  // Batas halaman buku sesuai kurikulum: Jilid 1-6 & Tajwid = 40, Gharib = 45
  bab: Joi.when("tahapan", {
    is: "GHARIB",
    then: Joi.number()
      .integer()
      .min(1)
      .max(45)
      .allow(null)
      .optional()
      .messages({
        "number.base": "Halaman buku harus berupa angka",
        "number.integer": "Halaman buku harus berupa angka bulat",
        "number.min": "Halaman buku minimal 1",
        "number.max":
          "Halaman maksimal buku Gharib adalah 45. Jika santri sudah melewati halaman 45, naikkan tahapan melalui Ujian Kenaikan",
      }),
    otherwise: Joi.number()
      .integer()
      .min(1)
      .max(40)
      .allow(null)
      .optional()
      .messages({
        "number.base": "Halaman buku harus berupa angka",
        "number.integer": "Halaman buku harus berupa angka bulat",
        "number.min": "Halaman buku minimal 1",
        "number.max":
          "Halaman maksimal jilid/buku adalah 40. Jika santri sudah melewati halaman 40, naikkan tahapan melalui Ujian Kenaikan",
      }),
  }),

  nilai: Joi.string()
    .valid("A+", "A", "B+", "B", "B-", "C+", "C", "C-", "D")
    .required(),
  keterangan: Joi.string().allow("", null).optional(),
  status_kelanjutan: Joi.string().valid("LANJUT", "MENGULANG").optional(),
});

// Skema EDIT setoran: hanya field yang boleh berubah. Identitas baris
// (nis_siswa, halaqohId/id_kelompok, tahapan, is_placement) bersifat immutable —
// validate() memakai allowUnknown:false sehingga field tersebut otomatis
// ditolak bila dikirim (menutup injeksi semisal is_placement:false).
const editTahsinValidation = Joi.object({
  nilai: Joi.string()
    .valid("A+", "A", "B+", "B", "B-", "C+", "C", "C-", "D")
    .optional(),
  keterangan: Joi.string().allow("", null).optional(),
  status_kelanjutan: Joi.string().valid("LANJUT", "MENGULANG").optional(),
  jilid: Joi.number().min(0).allow(null).optional(),
  // Batas gabungan buku tebal (Gharib 45); batas per-tahapan ditegakkan form
  bab: Joi.number()
    .integer()
    .min(1)
    .max(45)
    .allow(null)
    .optional()
    .messages({
      "number.base": "Halaman buku harus berupa angka",
      "number.integer": "Halaman buku harus berupa angka bulat",
      "number.min": "Halaman minimal 1",
      "number.max":
        "Halaman maksimal buku adalah 45 (Gharib) / 40 (jilid & Tajwid)",
    }),
  no_surah: Joi.number().min(1).max(114).allow(null).optional(),
  ayat_awal: Joi.number().min(0).max(286).optional(),
  ayat_akhir: Joi.number().min(0).max(286).optional(),
  materi: Joi.string().allow("", null).optional(),
  hafalan_surah: Joi.number().min(0).max(114).allow(null).optional(),
  hafalan_ayat_awal: Joi.number().min(0).max(286).allow(null).optional(),
  hafalan_ayat_akhir: Joi.number().min(0).max(286).allow(null).optional(),
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
      "MUNAQOSYAH",
    )
    .required(),
  jilid: Joi.number().allow(null).optional(),
  // Batas "Halaman Terakhir Dibaca" sesuai kurikulum: Jilid 1-6 & Tajwid = 40, Gharib = 45
  halaman: Joi.when("tahapan", {
    is: "GHARIB",
    then: Joi.number()
      .integer()
      .min(1)
      .max(45)
      .allow(null)
      .optional()
      .messages({
        "number.base": "Halaman harus berupa angka",
        "number.integer": "Halaman harus berupa angka bulat",
        "number.min": "Halaman minimal 1",
        "number.max":
          "Halaman maksimal buku Gharib adalah 45. Jika santri sudah melewati halaman 45, tempatkan di tahapan berikutnya",
      }),
    otherwise: Joi.number()
      .integer()
      .min(1)
      .max(40)
      .allow(null)
      .optional()
      .messages({
        "number.base": "Halaman harus berupa angka",
        "number.integer": "Halaman harus berupa angka bulat",
        "number.min": "Halaman minimal 1",
        "number.max":
          "Halaman maksimal jilid/buku adalah 40. Jika santri sudah melewati halaman 40, tempatkan di tahapan berikutnya",
      }),
  }),
  no_surah: Joi.number().allow(null).optional(),
  // 286 = jumlah ayat terbanyak (QS Al-Baqarah); batas per-surah dicek di service
  ayat_awal: Joi.number().min(1).max(286).allow(null).optional(),
  ayat_akhir: Joi.number().min(1).max(286).allow(null).optional(),
  materi: Joi.string().allow("", null).optional(),
}).unknown(true);

export { tahsinValidation, pretestValidation, editTahsinValidation };
