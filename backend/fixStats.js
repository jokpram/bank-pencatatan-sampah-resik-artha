import { WasteRecord, User } from './models/index.js';
import sequelize from './config/database.js';

const fix = async () => {
    try {
        await sequelize.authenticate();
        console.log("Fixing User Stats...");

        const users = await User.findAll();
        for (const u of users) {
            const records = await WasteRecord.findAll({
                where: {
                    id_pengguna: u.id_pengguna,
                    status: 'TERVALIDASI'
                }
            });

            let calcSaldo = 0;
            let calcBerat = 0;
            records.forEach(r => {
                calcSaldo += parseFloat(r.total_nilai);
                calcBerat += parseFloat(r.berat);
            });

            if (Math.abs(calcSaldo - parseFloat(u.saldo)) > 1 || Math.abs(calcBerat - u.total_berat) > 0.1) {
                console.log(`Fixing ${u.nama}: Saldo ${u.saldo}->${calcSaldo}, Berat ${u.total_berat}->${calcBerat}`);
                // Only update if stats are 0 (never decrease manually to be safe, or just force update?)
                // Since this is a "fix", we should force update to match reality of valid records
                u.saldo = calcSaldo;
                u.total_berat = calcBerat;
                await u.save();
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
};

fix();
