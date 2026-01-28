import { User } from './models/index.js';
import sequelize from './config/database.js';

const fixJoko = async () => {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { email: 'joksul@gmail.com' } }); // Assuming this is the user from screenshot or typical seed
        if (user) {
            console.log("Updating Joko...");
            user.dusun = 'Dusun 1';
            user.rt = 'RT 001';
            await user.save();
            console.log("Updated Joko:", user.dusun, user.rt);
        } else {
            // Find any user
            const anyUser = await User.findOne();
            if (anyUser) {
                console.log(`Updating user ${anyUser.nama}...`);
                anyUser.dusun = 'Dusun 2';
                anyUser.rt = 'RT 002';
                await anyUser.save();
                console.log("Updated:", anyUser.dusun, anyUser.rt);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
};

fixJoko();
