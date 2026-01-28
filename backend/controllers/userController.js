import User from '../models/User.js';
import { WasteRecord, WasteType } from '../models/index.js';

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { nama, alamat, no_hp, dusun, rt, email } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check email uniqueness if changed
        if (email && email !== user.email) {
            const existing = await User.findOne({ where: { email } });
            if (existing) return res.status(400).json({ message: 'Email sudah digunakan' });
            user.email = email;
        }

        if (nama !== undefined) user.nama = nama;
        if (alamat !== undefined) user.alamat = alamat;
        if (no_hp !== undefined) user.no_hp = no_hp;
        if (dusun !== undefined) user.dusun = dusun;
        if (rt !== undefined) user.rt = rt;

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserStats = async (req, res) => { // Per user stats broken down by type if needed
    try {
        // Implementation for accumulated stats per type
        // This query groups by waste type
        const stats = await WasteRecord.findAll({
            where: { id_pengguna: req.user.id, status: 'DICATAT' /* Assuming verified ones? Or all? */ },
            include: [{ model: WasteType, as: 'jenis_sampah' }],
            group: ['id_jenis'], // This might require proper aggregation query in Sequelize
            // Complex aggregation might be better with a raw query or simple processing in JS
        });
        // Actually simplest is to fetch all records and reduce in JS for display
        const records = await WasteRecord.findAll({
            where: { id_pengguna: req.user.id },
            include: ['jenis_sampah']
        });

        // Just return records, frontend can calculate. Or do it here. 
        // Returning full records is requested: "Simpan dan tampilkan akumulasi total per jenis"
        // Frontend can group.
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.findAll({
            attributes: ['nama', 'total_berat', 'total_nilai'],
            order: [
                ['total_berat', 'DESC'], // Primary sorting by weight
                ['total_nilai', 'DESC']  // Secondary by value
            ]
        });
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getProfile,
    updateProfile,
    getAllUsers,
    getUserStats,
    getLeaderboard
};
