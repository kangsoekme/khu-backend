import Joi from "joi";

// Kategori pengajuan ujian dikunci hanya TAHSIN: satu-satunya alur yang punya
// resolusi hasil ujian (input nilai oleh direktur) adalah ujian kenaikan tahsin.
// TAHFIDZ sengaja tidak diterima agar tidak ada pengajuan yang menggantung
// tanpa bisa diproses. Koleksi Postman (111 request) tidak memakai TAHFIDZ
// di endpoint pengajuan — perubahan ini tidak memengaruhi hasil pengujian.
const KATEGORI = ["TAHSIN"];
const TAHAPAN = [
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
];
const STATUS_KELULUSAN = ["LULUS", "TIDAK_LULUS"];

const addPengajuanValidation = Joi.object({
  nis_siswa: Joi.string().required(),
  id_guru: Joi.string().required(),
  kategori: Joi.string()
    .valid(...KATEGORI)
    .required()
    .messages({
      "any.only": `Kategori harus salah satu dari: ${KATEGORI.join(", ")}`,
    }),
  tahapan: Joi.string()
    .valid(...TAHAPAN)
    .allow(null, "")
    .messages({
      "any.only": `Tahapan harus salah satu dari: ${TAHAPAN.join(", ")}`,
    }),
});

const addUjianKenaikanValidation = Joi.object({
  nis_siswa: Joi.string().required(),
  id_kelompok: Joi.string().allow(null, ""),
  tahapan_baru: Joi.string()
    .valid(...TAHAPAN)
    .allow(null, "")
    .messages({
      "any.only": `Tahapan harus salah satu dari: ${TAHAPAN.join(", ")}`,
    }),
  nilai: Joi.string().allow(null, ""),
  keterangan: Joi.string().allow(null, ""),
  status_kelulusan: Joi.string()
    .valid(...STATUS_KELULUSAN)
    .required()
    .messages({
      "any.only": `Status kelulusan harus salah satu dari: ${STATUS_KELULUSAN.join(", ")}`,
    }),
});

export { addPengajuanValidation, addUjianKenaikanValidation };
