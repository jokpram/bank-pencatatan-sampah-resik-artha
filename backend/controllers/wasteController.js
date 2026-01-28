//controllers/wasteController.js
import wasteService from '../services/wasteService.js';
import { createRecordSchema } from '../validators/wasteValidator.js';

const createRecord = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Photo is required' });
        }

        const { error } = createRecordSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        // Assuming User initiates, so id_petugas is unknown, id_pengguna is from token
        const id_pengguna = req.user.id;
        // We assume the user role is 'user'

        // id_petugas, we might need it if the officer is doing the recording for the user?
        // If validation is later, id_petugas is null.

        const record = await wasteService.createRecord({
            ...req.body,
            id_pengguna,
            id_petugas: null // Initially null
        }, req.file);

        res.status(201).json({ message: 'Waste recorded successfully', data: record });
    } catch (err) {
        next(err);
    }
};

const validateRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        const id_petugas = req.user.id; // Officer ID from token

        const record = await wasteService.validateRecord(id, id_petugas);
        res.json({ message: 'Record validated', data: record });
    } catch (err) {
        next(err);
    }
};

const getRecords = async (req, res, next) => {
    try {
        // If Officer, see all. If User, see own.
        if (req.user.role === 'officer') {
            const records = await wasteService.getAllRecords();
            res.json(records);
        } else {
            const records = await wasteService.getRecordsByUserId(req.user.id);
            res.json(records);
        }
    } catch (err) {
        next(err);
    }
};

const cancelRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Validate role is officer
        await wasteService.cancelRecord(id);
        res.json({ message: 'Record cancelled' });
    } catch (err) {
        next(err);
    }
};

const getWasteTypes = async (req, res, next) => {
    try {
        const types = await wasteService.getWasteTypes();
        res.json(types);
    } catch (err) {
        next(err);
    }
};

const getStats = async (req, res, next) => {
    try {
        // If user, get own stats. If officer, get global stats?
        // Prompt says "menampilkan statistik sampah apa saja yang di setor oleh user nasabah"
        // implying aggregation.
        const userId = req.user.role === 'user' ? req.user.id : null;
        const stats = await wasteService.getWasteStats(userId);
        res.json(stats);
    } catch (err) {
        next(err);
    }
};

const updateRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        // User check could be here
        const record = await wasteService.updateRecord(id, req.body, req.file);
        res.json({ message: 'Record updated', data: record });
    } catch (err) {
        next(err);
    }
};

export default {
    createRecord,
    updateRecord,
    validateRecord,
    getRecords,
    cancelRecord,
    getWasteTypes,
    getStats
};
