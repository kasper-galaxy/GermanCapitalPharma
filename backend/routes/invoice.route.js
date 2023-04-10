import express from 'express';
import { get_invoice, get_invoice_list } from '../controllers/invoice.controller.js';
import { checkAdmin, protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router
    .route('/')
    .get(protect, checkAdmin, get_invoice_list);

router
    .route('/:id')
    .get(protect, checkAdmin, get_invoice);

export default router;