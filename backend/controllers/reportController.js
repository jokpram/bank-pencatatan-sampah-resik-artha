//controllers/reportController.js
import reportService from '../services/reportService.js';

const downloadReport = async (req, res, next) => {
    try {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=laporan_setoran.pdf');
        await reportService.generateWasteReport(res);
    } catch (err) {
        next(err);
    }
};

const downloadWithdrawalReport = async (req, res, next) => {
    try {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=laporan_penarikan.pdf');
        await reportService.generateWithdrawalReport(res);
    } catch (err) {
        next(err);
    }
};

export default { downloadReport, downloadWithdrawalReport };
