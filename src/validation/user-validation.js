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
  nama: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 1,
      tlds: { allow: ["com"] },
    })
    .required(),
  password: Joi.string().required(),
  no_telp: Joi.string().max(15).required(),
  role: Joi.string()
    .valid("SUPER_ADMIN", "DIREKTUR", "MUHASSIN", "MUHAFFIDZ")
    .required(),
  profile_photo: Joi.string(),
});

const editUserValidation = Joi.object({
  nama: Joi.string(),
  email: Joi.string().email({
    minDomainSegments: 1,
    tlds: { allow: ["com"] },
  }),
  password: Joi.string(),
  no_telp: Joi.string().max(15),
  role: Joi.string().valid("SUPER_ADMIN", "DIREKTUR", "MUHASSIN", "MUHAFFIDZ"),
  profile_photo: Joi.string(),
});

export { userValidation, editUserValidation, loginValidation };
