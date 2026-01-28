import wasteService from './services/wasteService.js';
import sequelize from './config/database.js';

const check = async () => {
    try {
        await sequelize.authenticate();
        console.log("Checking getWasteStats...");
        const stats = await wasteService.getWasteStats(null);
        console.log("Stats:", JSON.stringify(stats, null, 2));
    } catch (e) {
        console.error("Error in getWasteStats:", e);
    } finally {
        process.exit();
    }
};

check();
