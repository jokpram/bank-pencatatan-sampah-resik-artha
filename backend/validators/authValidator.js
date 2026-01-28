//validators/authValidator.js
import Joi from 'joi';

const registerSchema = Joi.object({
    nama: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    no_hp: Joi.string().required(),
    alamat: Joi.string().optional(),
    dusun: Joi.string().optional(),
    rt: Joi.string().optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('user', 'petugas', 'officer').optional()
});

export { registerSchema, loginSchema };
