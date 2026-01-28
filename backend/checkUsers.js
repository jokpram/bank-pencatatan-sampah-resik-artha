import { User } from './models/index.js';
import sequelize from './config/database.js';

const checkUsers = async () => {
    try {
        await sequelize.authenticate();
        const users = await User.findAll();
        users.forEach(u => {
            console.log(`User: ${u.nama}, Dusun: ${u.dusun}, RT: ${u.rt}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
};

checkUsers();
