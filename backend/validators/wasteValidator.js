//validators/wasteValidator.js
import Joi from 'joi';

const createRecordSchema = Joi.object({
    id_jenis: Joi.string().uuid().optional(),
    berat: Joi.number().min(0.1).optional(),
    items: Joi.string().optional() // JSON string
}).or('id_jenis', 'items');

// Validator for status update or cancellation if needed
const updateStatusSchema = Joi.object({
    status: Joi.string().valid('DICATAT', 'DIBATALKAN').required()
});

export { createRecordSchema, updateStatusSchema };
