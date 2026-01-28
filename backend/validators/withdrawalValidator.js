import Joi from 'joi';

const createWithdrawalSchema = Joi.object({
    jumlah: Joi.number().required()
});

export { createWithdrawalSchema };
