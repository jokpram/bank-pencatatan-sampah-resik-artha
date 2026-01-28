import { WasteRecord, User } from './models/index.js';
import sequelize from './config/database.js';
import fs from 'fs';

const check = async () => {
    try {
        await sequelize.authenticate();
        let output = "DB Status:\n";

        const users = await User.findAll();
        output += `Users (${users.length}):\n`;
        users.forEach(u => output += `- ${u.nama}: Saldo=${u.saldo}, Berat=${u.total_berat}\n`);

        const records = await WasteRecord.findAll({ order: [['created_at', 'DESC']] });
        output += `Records (${records.length}):\n`;
        records.forEach(r => output += `- Status: ${r.status}, Berat: ${r.berat}, Nilai: ${r.total_nilai}\n`);

        fs.writeFileSync('db_status.txt', output);
        console.log("Done");

    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
};

check();
