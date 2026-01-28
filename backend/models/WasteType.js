//models/WasteType.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const WasteType = sequelize.define('WasteType', {
    id_jenis: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    nama_jenis: {
        type: DataTypes.STRING,
        allowNull: false
    },
    satuan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nilai_per_unit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'jenis_sampah',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default WasteType;
