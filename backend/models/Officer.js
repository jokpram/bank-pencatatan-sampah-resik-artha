//models/Officer.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Officer = sequelize.define('Officer', {
    id_petugas: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    nama_petugas: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    no_hp: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'petugas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default Officer;
