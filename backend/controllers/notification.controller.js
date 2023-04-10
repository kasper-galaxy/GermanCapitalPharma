import Invoice from "../models/invoice.model.js";
import Notification from "../models/notification.model.js";
import asyncHandler from 'express-async-handler';
import { ERROR_INVOICE_NOT_EXIST, MODEL_INVOICE, SOURCE_ADMIN, SOURCE_FRONTEND } from "../config/constant.js";
import { generateID } from "../utils/libs.js";

/**
 * @desc    Update visit property
 * @route   GET /api/notifications/update_visit
 * @access  Private/Admin
 */
const update_visit = asyncHandler(async (req, res) => {
    await Notification.findOneAndUpdate({ user: req.body.user }, { $set: { visited : 'true' }})
        .then(result => res.json(result))
        .catch(err => {
            res.status(404);
            throw new ERROR_USER_NOT_EXIST;
        });
    global.io.emit('notification_updated');
});

/**
 * @desc    Get 10 notifications for dropdown
 * @route   GET /api/notifications/get_notifications
 * @access  Private/Admin
 */
const get_dropdown_list = asyncHandler(async (req, res) => {
    const sort = { visited: 1, createdAt: -1 };
    const notifications = await Notification.find().limit(10).sort(sort);
    res.json(notifications);
});

/**
 * @desc    Get all notifications
 * @route   GET /api/notifications
 * @access  Public
 */
const get_notification_list = asyncHandler(async (req, res) => {
    // console.log('ra req: ', req.query);
    const { limit, skip } = req.query;
    const sort = req.query.sort ?  JSON.parse(req.query.sort) : {};
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};

    const totalNotificationsCount = await Notification.find().count();
    const notifications = await Notification.find()
                            .skip(skip).limit(limit).sort(sort);
    res.header('Content-Range', `notifications ${skip}-${skip + limit - 1}/${totalNotificationsCount}`)
        .header('X-Total-Count', `${totalNotificationsCount}`)
        .json(notifications);
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private/Admin only
 */
const delete_notification = asyncHandler(async(req, res) => {
    const notification = await Notification.findOne({ id: req.params.id });
    if (notification) {
        await notification.remove();
        res.json({ message: 'success' });
    } else {
        res.status(404);
        throw new ERROR_USER_NOT_EXIST;
    }
});

export {
    update_visit,
    get_notification_list,
    delete_notification,
    get_dropdown_list
};