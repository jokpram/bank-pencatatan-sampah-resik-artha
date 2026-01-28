//services/wasteService.js
import { WasteRecord, WasteType, User, History } from '../models/index.js';
import sequelize from '../config/database.js';

const createRecord = async (data, file) => {
    const transaction = await sequelize.transaction();
    try {
        const { id_pengguna, id_petugas, items, id_jenis, berat } = data;
        const foto_url = file.filename;
        const createdRecords = [];

        // Handle new multi-item format
        if (items) {
            const itemsList = typeof items === 'string' ? JSON.parse(items) : items;

            for (const item of itemsList) {
                const wasteType = await WasteType.findByPk(item.id_jenis);
                if (!wasteType) throw new Error(`Jenis sampah untuk ID ${item.id_jenis} tidak ditemukan`);

                const total_nilai = item.berat * wasteType.nilai_per_unit;

                const record = await WasteRecord.create({
                    id_pengguna,
                    id_petugas,
                    id_jenis: item.id_jenis,
                    berat: item.berat,
                    total_nilai,
                    foto_url,
                    status: 'MENUNGGU_VALIDASI'
                }, { transaction });

                createdRecords.push(record);
            }
        } else {
            // Backward compatibility for single item logic
            const wasteType = await WasteType.findByPk(id_jenis);
            if (!wasteType) throw new Error('Jenis sampah tidak ditemukan');

            const total_nilai = berat * wasteType.nilai_per_unit;

            const record = await WasteRecord.create({
                id_pengguna,
                id_petugas,
                id_jenis,
                berat,
                total_nilai,
                foto_url,
                status: 'MENUNGGU_VALIDASI'
            }, { transaction });

            createdRecords.push(record);
        }

        await transaction.commit();
        return createdRecords;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const updateRecord = async (id, data, file) => {
    const record = await WasteRecord.findByPk(id);
    if (!record) throw new Error('Record not found');

    if (record.status !== 'MENUNGGU_VALIDASI') {
        throw new Error('Hanya catatan yang menunggu validasi yang dapat diubah.');
    }

    const { berat, id_jenis } = data;

    // Logic to recalculate total_nilai if type or weight changes
    if (id_jenis || berat) {
        const typeId = id_jenis || record.id_jenis;
        const weightVal = berat || record.berat;

        const wasteType = await WasteType.findByPk(typeId);
        if (!wasteType) throw new Error('Jenis sampah tidak ditemukan');

        record.id_jenis = typeId;
        record.berat = weightVal;
        record.total_nilai = weightVal * wasteType.nilai_per_unit;
    }

    if (file) {
        record.foto_url = file.filename;
    }

    await record.save();
    return record;
};

const getAllRecords = async () => {
    return await WasteRecord.findAll({
        include: ['pengguna', 'petugas', 'jenis_sampah'],
        order: [['created_at', 'DESC']]
    });
};

const getRecordsByUserId = async (id_pengguna) => {
    return await WasteRecord.findAll({
        where: { id_pengguna },
        include: ['jenis_sampah'],
        order: [['created_at', 'DESC']]
    });
};

const cancelRecord = async (id_catat, keterangan) => {
    const record = await WasteRecord.findByPk(id_catat);
    if (!record) throw new Error('Record not found');

    if (record.status === 'TERVALIDASI') {
        throw new Error('Cannot cancel validated record');
    }

    record.status = 'DIBATALKAN';
    await record.save();

    // Add to history
    await History.create({
        id_catat: record.id_catat,
        keterangan: keterangan || 'Dibatalkan oleh petugas'
    });

    return record;
};

const validateRecord = async (id_catat, id_petugas) => {
    const transaction = await sequelize.transaction();
    try {
        const record = await WasteRecord.findByPk(id_catat);
        if (!record) throw new Error('Record not found');

        if (record.status === 'TERVALIDASI') throw new Error('Record already validated');
        if (record.status === 'DIBATALKAN') throw new Error('Record was cancelled');

        record.id_petugas = id_petugas;
        record.status = 'TERVALIDASI';
        await record.save({ transaction });

        const user = await User.findByPk(record.id_pengguna, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (user) {
            user.total_berat = parseFloat(user.total_berat) + parseFloat(record.berat);
            user.total_nilai = parseFloat(user.total_nilai) + parseFloat(record.total_nilai);
            user.saldo = parseFloat(user.saldo) + parseFloat(record.total_nilai);

            await user.save({ transaction });
        }

        await transaction.commit();
        return record;
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

const getWasteStats = async (id_pengguna = null) => {
    const whereClause = { status: 'TERVALIDASI' };
    if (id_pengguna) {
        whereClause.id_pengguna = id_pengguna;
    }

    return await WasteRecord.findAll({
        where: whereClause,
        attributes: [
            'id_jenis',
            [sequelize.fn('SUM', sequelize.col('berat')), 'total_berat'],
            [sequelize.fn('SUM', sequelize.col('total_nilai')), 'total_nilai']
        ],
        include: [{
            model: WasteType,
            as: 'jenis_sampah',
            attributes: ['nama_jenis', 'satuan']
        }],
        group: ['WasteRecord.id_jenis', 'jenis_sampah.id_jenis', 'jenis_sampah.nama_jenis', 'jenis_sampah.satuan']
    });
};

const getWasteTypes = async () => {
    return await WasteType.findAll();
};

export default {
    createRecord,
    updateRecord,
    getAllRecords,
    getRecordsByUserId,
    cancelRecord,
    validateRecord,
    getWasteStats,
    getWasteTypes
};
