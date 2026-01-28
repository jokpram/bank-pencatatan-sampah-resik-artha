import { createWithdrawalSchema } from '../validators/withdrawalValidator.js';
import withdrawalService from '../services/withdrawalService.js';

const createWithdrawal = async (req, res, next) => {
    try {
        const { error } = createWithdrawalSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { jumlah } = req.body;
        const id_pengguna = req.user.id;

        const withdrawal = await withdrawalService.createWithdrawal(id_pengguna, jumlah);
        res.status(201).json({ message: 'Withdrawal requested', data: withdrawal });
    } catch (err) {
        next(err);
    }
};

const getWithdrawals = async (req, res, next) => {
    try {
        const records = await withdrawalService.getWithdrawals(req.user.role, req.user.id);
        res.json(records);
    } catch (err) {
        next(err);
    }
};

const validateWithdrawal = async (req, res, next) => {
    try {
        const { id } = req.params;
        const id_petugas = req.user.id;
        const record = await withdrawalService.validateWithdrawal(id, id_petugas);
        res.json({ message: 'Withdrawal validated', data: record });
    } catch (err) {
        next(err);
    }
};

const cancelWithdrawal = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { keterangan } = req.body;
        const id_petugas = req.user.id;
        const record = await withdrawalService.cancelWithdrawal(id, id_petugas, keterangan);
        res.json({ message: 'Withdrawal cancelled and refunded', data: record });
    } catch (err) {
        next(err);
    }
};

export default {
    createWithdrawal,
    getWithdrawals,
    validateWithdrawal,
    cancelWithdrawal
};
