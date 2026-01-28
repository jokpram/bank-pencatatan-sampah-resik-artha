//server.js
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

import sequelize from './config/database.js';
import { Officer, WasteType } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import wasteRoutes from './routes/wasteRoutes.js';
import userRoutes from './routes/userRoutes.js';
import withdrawalRoutes from './routes/withdrawalRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database Sync
sequelize.sync({ alter: true })
    .then(async () => {
        logger.info('Database synced');

        // Seeding Logic
        try {
            // Seed Officer
            const officerEmail = 'admin@resik.com';
            const officerExists = await Officer.findOne({ where: { email: officerEmail } });

            if (!officerExists) {
                const hashedPassword = await bcrypt.hash('admin123', 10);
                await Officer.create({
                    nama_petugas: 'Petugas Utama',
                    email: officerEmail,
                    password: hashedPassword,
                    no_hp: '088267006118'
                });
                logger.info('Default Officer created: admin@resik.com / admin123');
            } else {
                logger.info('Officer already exists');
            }

            // Seed Waste Types
            // Seed Waste Types (Expanded List)
            const wasteTypesData = [
                { nama_jenis: 'Plastik Botol PET', nilai_per_unit: 3500, satuan: 'kg' },
                { nama_jenis: 'Plastik Keras (HDPE)', nilai_per_unit: 2500, satuan: 'kg' },
                { nama_jenis: 'Plastik Kemasan', nilai_per_unit: 500, satuan: 'kg' },
                { nama_jenis: 'Plastik Kresek', nilai_per_unit: 300, satuan: 'kg' },
                { nama_jenis: 'Kertas HVS', nilai_per_unit: 2000, satuan: 'kg' },
                { nama_jenis: 'Kardus/Karton', nilai_per_unit: 1500, satuan: 'kg' },
                { nama_jenis: 'Koran/Majalah', nilai_per_unit: 1800, satuan: 'kg' },
                { nama_jenis: 'Kertas Duplex', nilai_per_unit: 500, satuan: 'kg' },
                { nama_jenis: 'Kaleng Aluminium', nilai_per_unit: 12000, satuan: 'kg' },
                { nama_jenis: 'Besi Tua', nilai_per_unit: 4500, satuan: 'kg' },
                { nama_jenis: 'Kaleng Besi', nilai_per_unit: 1500, satuan: 'kg' },
                { nama_jenis: 'Tembaga', nilai_per_unit: 65000, satuan: 'kg' },
                { nama_jenis: 'Botol Kaca Bening', nilai_per_unit: 500, satuan: 'kg' },
                { nama_jenis: 'Botol Kaca Berwarna', nilai_per_unit: 200, satuan: 'kg' },
                { nama_jenis: 'Pecahan Kaca', nilai_per_unit: 100, satuan: 'kg' },
                { nama_jenis: 'E-Waste (Elektronik)', nilai_per_unit: 15000, satuan: 'kg' },
                { nama_jenis: 'Baterai Bekas', nilai_per_unit: 2500, satuan: 'kg' },
                { nama_jenis: 'Sampah Organik', nilai_per_unit: 200, satuan: 'kg' }
            ];

            for (const item of wasteTypesData) {
                const existing = await WasteType.findOne({ where: { nama_jenis: item.nama_jenis } });
                if (!existing) {
                    await WasteType.create(item);
                } else {
                    // Update price if exists
                    existing.nilai_per_unit = item.nilai_per_unit;
                    existing.satuan = item.satuan;
                    await existing.save();
                }
            }
            logger.info('Waste Types seeded/updated');

            logger.info('Seeding completed');
        } catch (err) {
            logger.error('Seeding error:', err);
        }
    })
    .catch(err => logger.error('Database sync error:', err));

// Middlewares
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
}));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Prevent caching for API routes
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// Session Store
const PgSession = pgSession(session);
const sessionStore = new PgSession({
    pool: new pg.Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    }),
    createTableIfMissing: true
});

app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/reports', reportRoutes);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
