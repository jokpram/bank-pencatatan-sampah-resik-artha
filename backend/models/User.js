//models/User.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    id_pengguna: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    no_hp: {
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
    total_berat: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    total_nilai: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    },
    saldo: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    },
    dusun: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rt: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'pengguna',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default User;
