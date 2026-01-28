import { WasteRecord, User } from './models/index.js';
import sequelize from './config/database.js';

const check = async () => {
    try {
        await sequelize.authenticate();
        console.log("Checking Data Integrity...");

        const users = await User.findAll();
        for (const u of users) {
            console.log(`User: ${u.nama} (${u.email})`);
            console.log(`  Current Stats in DB -> Saldo: ${u.saldo}, Berat: ${u.total_berat}`);

            // Calculate from Records
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
            console.log(`  Calculated from Validated Records -> Saldo: ${calcSaldo}, Berat: ${calcBerat}`);

            if (Math.abs(calcSaldo - parseFloat(u.saldo)) > 1 || Math.abs(calcBerat - u.total_berat) > 0.1) {
                console.log("  [MISMATCH DETECTED]");
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
};

check();
