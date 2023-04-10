import express from 'express';
import { add_order, delete_order, get_order, get_order_list, get_revenue_by_dates, get_revenue_by_products, list_order, place_order, update_order } from '../controllers/order.controller.js';
import { checkAdmin, protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router
    .route('/')
    .get(protect, checkAdmin, get_order_list)
    .post(protect, checkAdmin, add_order);
router.post('/place', protect, place_order);
router.post('/list', protect, list_order);
router.post('/revenue-date', protect, get_revenue_by_dates);
router.post('/revenue-product', protect, get_revenue_by_products);
router
    .route('/:id')
    .get(get_order)
    .put(protect, checkAdmin, update_order)
    .delete(protect, checkAdmin, delete_order);

export default router;