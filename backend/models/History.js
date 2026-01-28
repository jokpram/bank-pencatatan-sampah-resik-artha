//models/History.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const History = sequelize.define('History', {
    id_riwayat: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    id_catat: {
        type: DataTypes.UUID,
        allowNull: false
    },
    keterangan: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    waktu: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'riwayat_pencatatan',
    timestamps: false
});

export default History;
