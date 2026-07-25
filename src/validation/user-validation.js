import Joi from "joi";

// user

const loginValidation = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 1,
      tlds: { allow: ["com"] },
    })
    .required(),
  password: Joi.string().required(),
});

const userValidation = Joi.object({
  nama: Joi.string().max(100).pattern(/^[a-zA-Z0-9\s.,'-]+$/).messages({"string.pattern.base" : "Input aneh tidak diizinkan"}).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 1,
      tlds: { allow: ["com"] },
    })
    .required(),
  password: Joi.string().required(),
  no_telp: Joi.string().max(15).required(),
  role: Joi.string().valid("SUPER_ADMIN", "DIREKTUR", "GURU").required(),
  profile_photo: Joi.string(),
});

const editUserValidation = Joi.object({
  nama: Joi.string().max(100).pattern(/^[a-zA-Z0-9\s.,'-]+$/).messages({"string.pattern.base" : "Input aneh tidak diizinkan"}),
  email: Joi.string().email({
    minDomainSegments: 1,
    tlds: { allow: ["com"] },
  }),
  password: Joi.string(),
  no_telp: Joi.string().max(15),
  role: Joi.string().valid("SUPER_ADMIN", "DIREKTUR", "GURU"),
  profile_photo: Joi.string(),
}).min(1);

export { userValidation, editUserValidation, loginValidation };
