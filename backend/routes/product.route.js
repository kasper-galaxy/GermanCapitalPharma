import express from "express";
import { add_product, delete_product, get_product, get_product_list, get_shop_product_list, update_product } from '../controllers/product.controller.js';
import upload from '../utils/multer.js';
import {
    checkAdmin,
    protect
} from '../middlewares/auth.middleware.js';

const router = express.Router();

router
    .route('/')
    .get(protect, checkAdmin, get_product_list)
    .post(protect, checkAdmin, upload.fields([{name: 'images', maxCount: 4} ]), add_product);
router.get('/shop', get_shop_product_list);
router
    .route('/:id')
    .get(get_product)
    .put(protect, checkAdmin, upload.fields([{name: 'images', maxCount: 4} ]), update_product)
    .delete(protect, checkAdmin, delete_product);

export default router;