//models/WasteRecord.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const WasteRecord = sequelize.define('WasteRecord', {
    id_catat: {
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
    id_jenis: {
        type: DataTypes.UUID,
        allowNull: false
    },
    tanggal: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    berat: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    total_nilai: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    foto_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('MENUNGGU_VALIDASI', 'TERVALIDASI', 'DIBATALKAN'),
        defaultValue: 'MENUNGGU_VALIDASI'
    }
}, {
    tableName: 'pencatatan_sampah',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default WasteRecord;
