//models/Withdrawal.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Withdrawal = sequelize.define('Withdrawal', {
    id_penarikan: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    id_pengguna: {
        type: DataTypes.UUID,
        allowNull: false
    },
    id_petugas: {
        type: DataTypes.UUID,
        allowNull: true
    },
    jumlah: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('MENUNGGU_VALIDASI', 'BERHASIL', 'DIBATALKAN'),
        defaultValue: 'MENUNGGU_VALIDASI'
    },
    keterangan: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'penarikan_saldo',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Withdrawal;
