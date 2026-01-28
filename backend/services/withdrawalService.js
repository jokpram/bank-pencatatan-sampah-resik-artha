//services/withdrawalService.js
import { Withdrawal, User } from '../models/index.js';
import sequelize from '../config/database.js';

const createWithdrawal = async (id_pengguna, jumlah) => {
    const transaction = await sequelize.transaction();
    try {
        const user = await User.findByPk(id_pengguna, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (!user) throw new Error('User not found');

        if (parseFloat(user.saldo) < parseFloat(jumlah)) {
            throw new Error('Saldo tidak mencukupi');
        }

        // Deduct balance immediately
        user.saldo = parseFloat(user.saldo) - parseFloat(jumlah);
        await user.save({ transaction });

        const withdrawal = await Withdrawal.create({
            id_pengguna,
            jumlah,
            status: 'MENUNGGU_VALIDASI'
        }, { transaction });

        await transaction.commit();
        return withdrawal;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getWithdrawals = async (role, userId) => {
    if (role === 'officer') {
        return await Withdrawal.findAll({
            include: ['pengguna', 'petugas'],
            order: [['created_at', 'DESC']]
        });
    } else {
        return await Withdrawal.findAll({
            where: { id_pengguna: userId },
            order: [['created_at', 'DESC']]
        });
    }
};

const validateWithdrawal = async (id_penarikan, id_petugas) => {
    const withdrawal = await Withdrawal.findByPk(id_penarikan);
    if (!withdrawal) throw new Error('Withdrawal not found');

    if (withdrawal.status !== 'MENUNGGU_VALIDASI') {
        throw new Error('Withdrawal already processed');
    }

    withdrawal.status = 'BERHASIL';
    withdrawal.id_petugas = id_petugas;
    await withdrawal.save();

    return withdrawal;
};

const cancelWithdrawal = async (id_penarikan, id_petugas, keterangan) => {
    const transaction = await sequelize.transaction();
    try {
        const withdrawal = await Withdrawal.findByPk(id_penarikan, { transaction });
        if (!withdrawal) throw new Error('Withdrawal not found');

        if (withdrawal.status !== 'MENUNGGU_VALIDASI') {
            throw new Error('Can only cancel pending withdrawals');
        }

        withdrawal.status = 'DIBATALKAN';
        withdrawal.id_petugas = id_petugas;
        withdrawal.keterangan = keterangan;
        await withdrawal.save({ transaction });

        // Refund balance
        const user = await User.findByPk(withdrawal.id_pengguna, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (user) {
            user.saldo = parseFloat(user.saldo) + parseFloat(withdrawal.jumlah);
            await user.save({ transaction });
        }

        await transaction.commit();
        return withdrawal;
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

export default {
    createWithdrawal,
    getWithdrawals,
    validateWithdrawal,
    cancelWithdrawal
};
