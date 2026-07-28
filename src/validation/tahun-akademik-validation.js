import Joi from "joi";
const createTahunAkademikValidation = Joi.object({
  nama_tahun: Joi.string().required(),
  is_active: Joi.boolean().default(false),
});
const transisiSemesterValidation = Joi.object({
  tahun_tujuan_id: Joi.string().uuid().required(),
});
export { createTahunAkademikValidation, transisiSemesterValidation };
