import sequelize from '../config/database.js';
import { WasteType } from '../models/index.js';

const updatePrices = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Added 'satuan' because it is required by the model
        const prices = [
            { nama_jenis: 'Plastik Botol PET', nilai: 3500, satuan: 'kg' },
            { nama_jenis: 'Plastik Keras (HDPE)', nilai: 2500, satuan: 'kg' },
            { nama_jenis: 'Plastik Kemasan', nilai: 500, satuan: 'kg' },
            { nama_jenis: 'Plastik Kresek', nilai: 300, satuan: 'kg' },
            { nama_jenis: 'Kertas HVS', nilai: 2000, satuan: 'kg' },
            { nama_jenis: 'Kardus/Karton', nilai: 1500, satuan: 'kg' },
            { nama_jenis: 'Koran/Majalah', nilai: 1800, satuan: 'kg' },
            { nama_jenis: 'Kertas Duplex', nilai: 500, satuan: 'kg' },
            { nama_jenis: 'Kaleng Aluminium', nilai: 12000, satuan: 'kg' },
            { nama_jenis: 'Besi Tua', nilai: 4500, satuan: 'kg' },
            { nama_jenis: 'Kaleng Besi', nilai: 1500, satuan: 'kg' },
            { nama_jenis: 'Tembaga', nilai: 65000, satuan: 'kg' },
            { nama_jenis: 'Botol Kaca Bening', nilai: 500, satuan: 'kg' },
            { nama_jenis: 'Botol Kaca Berwarna', nilai: 200, satuan: 'kg' },
            { nama_jenis: 'Pecahan Kaca', nilai: 100, satuan: 'kg' },
            { nama_jenis: 'E-Waste (Elektronik)', nilai: 15000, satuan: 'kg' },
            { nama_jenis: 'Baterai Bekas', nilai: 2500, satuan: 'kg' },
            { nama_jenis: 'Sampah Organik', nilai: 200, satuan: 'kg' }
        ];

        for (const item of prices) {
            // Check if exists
            const existing = await WasteType.findOne({ where: { nama_jenis: item.nama_jenis } });

            if (existing) {
                // Update
                existing.nilai_per_unit = item.nilai;
                existing.satuan = item.satuan;
                await existing.save();
                console.log(`Updated: ${item.nama_jenis} -> Rp ${item.nilai}`);
            } else {
                // Create
                await WasteType.create({
                    nama_jenis: item.nama_jenis,
                    nilai_per_unit: item.nilai,
                    satuan: item.satuan
                });
                console.log(`Created: ${item.nama_jenis} -> Rp ${item.nilai}`);
            }
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding prices:', error);
        process.exit(1);
    }
};

updatePrices();
