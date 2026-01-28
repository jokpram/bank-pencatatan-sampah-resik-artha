//models/index.js
import User from './User.js';
import Officer from './Officer.js';
import WasteType from './WasteType.js';
import WasteRecord from './WasteRecord.js';
import History from './History.js';
import Withdrawal from './Withdrawal.js';

// Associations
WasteRecord.belongsTo(User, { foreignKey: 'id_pengguna', as: 'pengguna' });
User.hasMany(WasteRecord, { foreignKey: 'id_pengguna', as: 'records' });

WasteRecord.belongsTo(Officer, { foreignKey: 'id_petugas', as: 'petugas' });
Officer.hasMany(WasteRecord, { foreignKey: 'id_petugas', as: 'records' });

WasteRecord.belongsTo(WasteType, { foreignKey: 'id_jenis', as: 'jenis_sampah' });
WasteType.hasMany(WasteRecord, { foreignKey: 'id_jenis', as: 'records' });

History.belongsTo(WasteRecord, { foreignKey: 'id_catat', as: 'pencatatan' });
WasteRecord.hasMany(History, { foreignKey: 'id_catat', as: 'riwayat' });

Withdrawal.belongsTo(User, { foreignKey: 'id_pengguna', as: 'pengguna' });
User.hasMany(Withdrawal, { foreignKey: 'id_pengguna', as: 'withdrawals' });

Withdrawal.belongsTo(Officer, { foreignKey: 'id_petugas', as: 'petugas' });
Officer.hasMany(Withdrawal, { foreignKey: 'id_petugas', as: 'withdrawals' });

export {
    User,
    Officer,
    WasteType,
    WasteRecord,
    History,
    Withdrawal
};
