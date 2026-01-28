//middlewares/uploadMiddleware.js
import multer from 'multer';
import { storage, fileFilter } from '../utils/fileHelper.js';

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

export default upload;
