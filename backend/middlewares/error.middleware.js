import i18n from "../config/i18n.js";
import dotenv from 'dotenv';

dotenv.config();
const notFound = (req, res, next) => {
    const err = new Error(`${i18n.__('NotFoundURL')}${req.originalUrl}`);
    res.status(404);
    next(err);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export {
    notFound,
    errorHandler
};