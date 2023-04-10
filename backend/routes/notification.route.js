import express from 'express';
import { get_dropdown_list, update_visit, get_notification_list, delete_notification } from '../controllers/notification.controller.js';
import { checkAdmin, protect } from '../middlewares/auth.middleware.js';

const router = express.Router();
router
    .route('/')
    .get(protect, checkAdmin, get_notification_list)
router.post("/update_visit", protect, checkAdmin, update_visit);
router.route('/:id')
    .delete(protect, checkAdmin, delete_notification);
router.post('/get_dropdown_list', protect, checkAdmin, get_dropdown_list);

export default router;