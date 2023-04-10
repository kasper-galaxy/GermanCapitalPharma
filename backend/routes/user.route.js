import express from 'express';
import { 
    get_user_list,
    add_user,
    get_user,
    update_user,
    delete_user,
    login,
    signup,
    get_user_profile,
    update_user_profile,
    set_user_password,
    forgot_password,
    send_mail,
    check_email,
    upload_license,
    update_user_verified,
    check_auth
} from '../controllers/user.controller.js';
import upload from '../utils/multer.js';
import {
    checkAdmin,
    protect
} from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', upload.fields([{name: 'businessLicense', maxCount: 1}, {name: 'officialDocument', maxCount: 1}, ]), signup);
router.post('/login', login);
router.post('/set-password', set_user_password);
router.post('/check-email', check_email);
router.post('/upload-license', upload.fields([{name: 'businessLicense', maxCount: 1}, {name: 'officialDocument', maxCount: 1}, ]), upload_license);
router.post('/:id/sendmail', protect, checkAdmin, send_mail);
router.post('/:id/user-verified', protect, checkAdmin, update_user_verified);
router.post('/forgot-password', forgot_password);
router.post('/check-auth', protect, check_auth);
router
    .route('/')
    .get(protect, checkAdmin, get_user_list)
    .post(protect, checkAdmin, upload.fields([{name: 'businessLicense', maxCount: 1}, {name: 'officialDocument', maxCount: 1}, {name: 'additionalDocument', maxCount: 3} ]), add_user);
router
    .route('/get-profile')
    .post(protect, get_user_profile);
router
    .route('/profile')
    .post(protect, update_user_profile);
router
    .route('/:id')
    .get(protect, checkAdmin, get_user)
    .put(protect, checkAdmin, upload.fields([{name: 'businessLicense', maxCount: 1}, {name: 'officialDocument', maxCount: 1}, {name: 'additionalDocument', maxCount: 3} ]), update_user)
    .delete(protect, checkAdmin, delete_user);

export default router;
