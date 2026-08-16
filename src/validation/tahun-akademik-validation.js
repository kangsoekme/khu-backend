import Joi from "joi";
const createTahunAkademikValidation = Joi.object({
  nama_tahun: Joi.string()
    .pattern(/^\d{4}\/\d{4} (GANJIL|GENAP)$/)
    .required()
    .messages({
      "string.pattern.base":
        "Format tahun ajaran tidak valid. Gunakan format 'YYYY/YYYY SEMESTER', contoh: 2025/2026 GANJIL",
    }),
  is_active: Joi.boolean().default(false),
});
const transisiSemesterValidation = Joi.object({
  tahun_tujuan_id: Joi.string().uuid().required(),
});
export { createTahunAkademikValidation, transisiSemesterValidation };
