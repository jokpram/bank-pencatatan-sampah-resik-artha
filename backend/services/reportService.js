//services/reportService.js
import PDFDocument from 'pdfkit';
import { WasteRecord } from '../models/index.js';

const generateWasteReport = async (res) => {
    const records = await WasteRecord.findAll({
        include: ['pengguna', 'jenis_sampah'],
        order: [['created_at', 'DESC']]
    });

    const doc = new PDFDocument({ margin: 50 });

    // Header
    doc.fontSize(20).text('Laporan Setoran Sampah - Resik Artha', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
    doc.moveDown();

    // Table Header
    const tableTop = 150;
    const itemX = 50;
    const dateX = 100;
    const userX = 200;
    const typeX = 300;
    const weightX = 380;
    const valueX = 450;
    const statusX = 520;

    doc.font('Helvetica-Bold');
    doc.text('No', itemX, tableTop);
    doc.text('Tanggal', dateX, tableTop);
    doc.text('Nasabah', userX, tableTop);
    doc.text('Jenis', typeX, tableTop);
    doc.text('Berat', weightX, tableTop);
    doc.text('Nilai (Rp)', valueX, tableTop);
    // doc.text('Status', statusX, tableTop); // Might run out of space

    doc.moveTo(itemX, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    let y = tableTop + 25;
    doc.font('Helvetica');

    records.forEach((record, i) => {
        if (y > 700) {
            doc.addPage();
            y = 50;
        }

        const date = new Date(record.created_at).toLocaleString('id-ID');
        const userName = record.pengguna ? record.pengguna.nama : 'Unknown';
        const typeName = record.jenis_sampah ? record.jenis_sampah.nama_jenis : '-';

        doc.text(i + 1, itemX, y);
        doc.text(date, dateX, y);
        doc.text(userName, userX, y, { width: 90, ellipsis: true });
        doc.text(typeName, typeX, y);
        doc.text(`${record.berat} kg`, weightX, y);
        doc.text(record.total_nilai, valueX, y);
        // doc.text(record.status, statusX, y);

        y += 20;
    });

    doc.pipe(res);
    doc.end();
};

const generateWithdrawalReport = async (res) => {
    const { Withdrawal } = await import('../models/index.js');
    const records = await Withdrawal.findAll({
        include: ['pengguna'],
        order: [['created_at', 'DESC']]
    });

    const doc = new PDFDocument({ margin: 50 });

    // Header
    doc.fontSize(20).text('Laporan Penarikan Saldo - Resik Artha', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
    doc.moveDown();

    // Table Header
    const tableTop = 150;
    const itemX = 50;
    const dateX = 100;
    const userX = 200;
    const amountX = 350;
    const statusX = 450;

    doc.font('Helvetica-Bold');
    doc.text('No', itemX, tableTop);
    doc.text('Tanggal', dateX, tableTop);
    doc.text('Nasabah', userX, tableTop);
    doc.text('Jumlah (Rp)', amountX, tableTop);
    doc.text('Status', statusX, tableTop);

    doc.moveTo(itemX, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    let y = tableTop + 25;
    doc.font('Helvetica');

    records.forEach((record, i) => {
        if (y > 700) {
            doc.addPage();
            y = 50;
        }

        const date = new Date(record.created_at).toLocaleString('id-ID');
        const userName = record.pengguna ? record.pengguna.nama : 'Unknown';

        doc.text(i + 1, itemX, y);
        doc.text(date, dateX, y);
        doc.text(userName, userX, y, { width: 140, ellipsis: true });
        doc.text(parseFloat(record.jumlah).toLocaleString('id-ID'), amountX, y);
        doc.text(record.status, statusX, y);

        y += 20;
    });

    doc.pipe(res);
    doc.end();
};

export default { generateWasteReport, generateWithdrawalReport };
