//middlewares/errorHandler.js
import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);

    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        success: false,
        message: message,
        // stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

export default errorHandler;
