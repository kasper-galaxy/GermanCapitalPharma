import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import colors from 'colors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import config from './config/index.js';
import i18n from './config/i18n.js';
import cors from 'cors';
import { Server } from 'socket.io';

import { errorHandler, notFound } from './middlewares/error.middleware.js';

import userRoutes from './routes/user.route.js';
import productRoutes from './routes/product.route.js';
import orderRoutes from './routes/order.route.js';
import invoiceRoutes from './routes/invoice.route.js';
import notificationRoutes from './routes/notification.route.js';

// console.log(i18n.getLocales()); // ['en', 'uk']
// console.log(i18n.getLocale()); // 'en'
// console.log(i18n.__('Hello')); // 'Hello'
// console.log(i18n.__n('You have %s message', 5)); // 'You have 5 messages'
// i18n.setLocale('de');

// Settings
dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
const app = express();
const env = process.env;
const myLogger = (req, res, next) => {
    console.log(` `);
    console.log(`>>>>>>> ${req.method} ${req.url}`);
    // console.log(`>> query: `, req.query);
    // console.log(`>> params: `, req.params);
    // console.log(`>> body: `, req.body);
    // console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
    console.log(` `);
    next();
};

// Middleware
app.set("trust proxy", 1);
app.use(express.json());
app.use(cors({ credentials: true, origin: '*', exposedHeaders: ["set-cookie"] }));
app.use(cookieParser());
app.use('/api', myLogger);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/notifications', notificationRoutes);

// Static
const __dirname = path.resolve();
app.use('/upload', express.static(path.join(__dirname, '/upload')));
app.use('/public', express.static(path.join(__dirname, '/public')));

if (env['NODE_ENV'] === 'production') {
    app.use(express.static(path.join(__dirname, '/client/build')));
    app.use('/admin', express.static(path.join(__dirname, '/admin/build')));

    app.get('/admin/*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'admin', 'build', 'index.html'))
    );
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    );
}

// Error Handler
app.use(notFound);
app.use(errorHandler);

// Listen
const server = app.listen(
    PORT,
    console.log(
        `Server running in ${env['NODE_ENV']} mode on port ${PORT}`.yellow.bold
    )
);

const socketIo = new Server(server, { cors: { origin : '*' }});
global.io = socketIo;
socketIo.on("connection", async(socket) => {    
    console.log("New Client connected: " + socket.id);
    socket.emit("message", socket.id);
    socket.on("disconnected", () => {
        console.log("disconnect client");
        socket.disconnect(true);
    });
});