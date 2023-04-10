import User from "../models/user.model.js";
import Notification from '../models/notification.model.js';
import asyncHandler from 'express-async-handler';
import 'isomorphic-fetch';
import 'es6-promise';
import { ADMIN_ACTION_SEND_MAIL_CHECK_EMAIL, 
    ADMIN_ACTION_SEND_MAIL_PROXY_PASSWORD, 
    ERROR_DB_CONNECTION_ERROR, 
    ERROR_INVALID_PASSWORD, 
    ERROR_INVALID_USERDATA, 
    ERROR_NO_UPLOAD_BUSINESS_LICENSE, 
    ERROR_TOKEN_EXPIRED, 
    ERROR_USER_ALREADY_EXIST, 
    ERROR_USER_FREEZED, 
    ERROR_USER_NOT_EXIST, 
    ERROR_VERIFY_EMAIL, 
    ERROR_YOU_ARE_NOT_A_HUMAN, 
    TOKEN_CHECK_EMAIL, 
    TOKEN_FORGOT_PASSWORD, 
    TOKEN_PROXY_PASSWORD, 
    USER_SET_PASSWORD_SUCCESS, 
    USER_SIGNUP_CHECK_EMAIL_SUCCESS,
    ERROR_USER_EDITION_BLOCKED, 
    LICENSE_DOCUMENTUPLOADED,
    LICENSE_DOCUMENTNOTUPLOADED,
    LICENSE_DOCUMENTAPPROVED, 
    LICENSE_DOCUMENTREJECTED,
    ERROR_TOKEN_NOT_AUTH,
    MODEL_USER,
    SOURCE_FRONTEND,
    SOURCE_ADMIN,
    MODEL_NOTIFICATION } from "../config/constant.js";

import { sendCheckEmailOneTimeLink, sendForgotPasswordOneTimeLink, sendLicenseApproveMail, sendLicenseRejectMail, sendProxyUserOneTimeLink } from "../utils/sendmail_sendgrid.js";
import { checkToken, generateAuthToken, generateProxyPasswordToken } from "../utils/generateToken.js";
import { isObject, errorMessageGenerator, genRand, generateID } from "../utils/libs.js";

const env = process.env;
/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin only
 */
const get_user_list = asyncHandler(async (req, res) => {
    console.log('ra req: ', req.query);
    const { limit, skip } = req.query;
    const sort = req.query.sort ?  JSON.parse(req.query.sort) : {};
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    let query = {}, search = '', last_seen_gte = '', last_seen_lte = '';
    if ('userVerified' in filter) { query.userVerified = filter.userVerified; }
    if ('userFreezed' in filter) { query.userFreezed = filter.userFreezed; }
    if (filter.id) { query.id = filter.id; }
    if (filter.q) { search =  new RegExp(filter.q,'i'); };
    if (filter.last_seen_gte) { last_seen_gte = filter.last_seen_gte; }
    if (filter.last_seen_lte) { last_seen_lte = filter.last_seen_lte; }

    // const keyword = filter.q
    //   ? {
    //         email: {
    //             $regex: search,
    //             $options: 'i',
    //         },
    //         addressZipCode: {
    //             $regex: search,
    //             $options: 'i',
    //         },
    //         companyName: {
    //             $regex: search,
    //             $options: 'i',
    //         },
    //     }
    //   : {};

    console.log('query ', query);
    const keyword = filter.q ? 
    {
        "$or": [ 
            // { "email" : { $regex: search }}, 
            // { "id" : { $regex: search }},
            { "addressZipCode" : { $regex: search }}, 
            { "companyName" : { $regex: search }}]
    } : {};
    
    console.log('search ', search, keyword)
    const totalUsersCount = await User.find({ ...keyword,
                                    ...query, 
                                    isAdmin: false, 
                                    // ...(filter.q) && { $text: { $search: search } },
                                    ...(filter.last_seen_gte || filter.last_seen_lte) && { lastSeen: { 
                                        ...(filter.last_seen_gte) && { $gte : new Date( last_seen_gte )},
                                        ...(filter.last_seen_lte) && { $lte : new Date( last_seen_lte )},
                                            }
                                    } }).count();
    const users = await User.find({ ...keyword,
                                    ...query, 
                                    isAdmin: false, 
                                    // ...(filter.q) && { $text: { $search: search } },
                                    ...(filter.last_seen_gte || filter.last_seen_lte) && { lastSeen: { 
                                        ...(filter.last_seen_gte) && { $gte : new Date( last_seen_gte )},
                                        ...(filter.last_seen_lte) && { $lte : new Date( last_seen_lte )},
                                            }
                                     } })
                            .skip(skip).limit(limit).sort(sort);
    
    res.header('Content-Range', `users ${skip}-${skip + limit - 1}/${totalUsersCount}`)
        .header('X-Total-Count', `${totalUsersCount}`)
        .json(users);
});

/**
 * @desc    Create a new user
 * @route   POST /api/users
 * @access  Private/Admin only
 */
 const add_user = asyncHandler(async (req, res) => {
    const editor = await User.findOne({ _id: req.user_id });
    const url = `${req.protocol}://${req.get('host')}:8080`;
    const {
        companyName,
        corporationForm,
        email,
        invoiceEmail,
        nameSirCode,
        nameSirTitle,
        nameFirst,
        nameLast,
        addressStreet,
        addressHouse,
        addressZipCode,
        addressCity,
        phoneNumber,
        faxNumber,
        vatIdCode,
        taxIdCode,
        companyIdCode
    } = req.body;

    console.log('add user');
    console.log('add user ', req.body);
    console.log('add user ', req.files);
    
    // Check Duplication
    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400);
        throw new Error( errorMessageGenerator(ERROR_USER_ALREADY_EXIST) );
    }

    if (!req.files['businessLicense'] || req.files['businessLicense'].length == 0) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_NO_UPLOAD_BUSINESS_LICENSE));
    }

    // License Check
    const businessLicenseFile = req.files['businessLicense'] && req.files['businessLicense'].length > 0 ? req.files['businessLicense'][0] : null;
    const officialDocumentFile = req.files['officialDocument'] && req.files['officialDocument'].length > 0 ? req.files['officialDocument'][0] : null;
    const additionalDocumentFile = req.files['additionalDocument'] && req.files['additionalDocument'].length > 0 ? req.files['additionalDocument'] : [];
    
    // Check License
    let businessLicenseFilePath = '';
    let businessLicenseReplace = {};
    if (businessLicenseFile) {
        businessLicenseFilePath = url + '/upload/' + businessLicenseFile.filename;
        businessLicenseReplace = {
            url: businessLicenseFilePath,
            title: businessLicenseFile.filename
        };
    }
    
    let officialDocumentFilePath = '';
    let officialDocumentReplace = {};
    if (officialDocumentFile) {
        officialDocumentFilePath = url + '/upload/' + officialDocumentFile.filename;
        officialDocumentReplace = {
            url: officialDocumentFilePath,
            title: officialDocumentFile.filename
        };
    }
    let additionalDocumentFilePath = []
    additionalDocumentFile.map(file => {
        let tmpPath = url + '/upload/' + file.filename;
        let tmpFile = {
            url: tmpPath,
            title: file.filename
        };
        additionalDocumentFilePath.push(tmpFile);
    });

    // Generate Randome Password
    const password = genRand(10);
    const userId = await User.find().sort({"counter":-1}).limit(1);
    const newCounter = userId.length > 0 ? parseInt(userId[0]['counter']) + 1 : 1;
    // Save user
    const user = await User.create({
        id: generateID(MODEL_USER, SOURCE_ADMIN, newCounter),
        counter: newCounter,
        companyName,
        corporationForm,
        email,
        invoiceEmail,
        password,
        proxyPassword: password,
        nameSirCode,
        nameSirTitle,
        nameFirst,
        nameLast,
        addressStreet,
        addressHouse,
        addressZipCode,
        addressCity,
        phoneNumber,
        faxNumber,
        vatIdCode,
        taxIdCode,
        companyIdCode,
        businessLicense: businessLicenseReplace,
        officialDocument: officialDocumentReplace,
        additionalDocument: additionalDocumentFilePath,
        userProxy: true,
        userVerified: false,
        emailConfirmed: false,
        businessLicenseState: businessLicenseFile ? LICENSE_DOCUMENTAPPROVED : LICENSE_DOCUMENTNOTUPLOADED,
        officialDocumentState: officialDocumentFile ? LICENSE_DOCUMENTAPPROVED : LICENSE_DOCUMENTNOTUPLOADED,
        editBy: `${editor.nameFirst} ${editor.nameLast}`
    });

    const newUser = await user.save();

    if (newUser) {
        sendProxyUserOneTimeLink({ 
            email: newUser.email,
            password: password,
            origin: req.get('origin')
        });
        res.status(201).json(newUser);
    } else {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_INVALID_USERDATA));
    }
});

/**
 * @desc    Get user by Id
 * @route   GET /api/users/:id
 * @access  Private/Admin only
 */
 const get_user = asyncHandler(async (req, res) => {
    const user = await User.findOne({ id: req.params.id }).select('-password');
    console.log(user);
    
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error(errorMessageGenerator(ERROR_USER_NOT_EXIST));
    }
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin only
 */
 const update_user = asyncHandler(async (req, res) => {
    const editor = await User.findOne({ _id: req.user_id });
    const user = await User.findOne({ id: req.params.id });
    
    if (!user) {
        res.status(404);
        throw new Error(errorMessageGenerator(ERROR_USER_NOT_EXIST));
    }

    const url = `${req.protocol}://${req.get('host')}:8080`;
    console.log(req.body);
    console.log(req.files);
    const {
        companyName,
        corporationForm,
        email,
        invoiceEmail,
        nameSirCode,
        nameSirTitle,
        nameFirst,
        nameLast,
        addressStreet,
        addressHouse,
        addressZipCode,
        addressCity,
        phoneNumber,
        faxNumber,
        vatIdCode,
        taxIdCode,
        password,
        companyIdCode,
        editionBlocked,
        userFreezed,
        userVerified,
        emailConfirmed,
        businessLicenseState,
        officialDocumentState,
        businessLicenseStatus,
        officialDocumentStatus,
        oldAdditionalDocument
    } = req.body;

    // Check Duplication
    if (user.email !== email) {
        const userExist = await User.findOne({ email });
        if (userExist) {
            res.status(400);
            throw new Error(errorMessageGenerator(ERROR_USER_ALREADY_EXIST));
        }
    }

    const businessLicenseStateChanged = user.businessLicenseState !== businessLicenseState;
    const officialDocumentStateChanged = user.officialDocumentState !== officialDocumentState;

    // Validation
    // License Check
    let businessLicense, officialDocument, additionalDocument = [];
    let businessLicenseStateTmp = user.businessLicenseState;
    let officialDocumentStateTmp = user.officialDocumentState;

    console.log(businessLicenseStateChanged);

    switch (businessLicenseStatus) {
        case 'UPDATE':
            businessLicenseStateTmp = businessLicenseState;
            let file = req.files['businessLicense'][0];
            businessLicense = {
                url: url + '/upload/' + file.filename,
                title: file.filename
            };
            break;
        case 'REMOVE':
            businessLicenseStateTmp = LICENSE_DOCUMENTNOTUPLOADED;
            businessLicense = null;
            break;
        case 'OLD':
            businessLicenseStateTmp = businessLicenseState;
            businessLicense = user.businessLicense;
            break;
        default:
            break;
    }
    switch (officialDocumentStatus) {
        case 'UPDATE':
            officialDocumentStateTmp = officialDocumentState;
            let file = req.files['officialDocument'][0];
            officialDocument = {
                url: url + '/upload/' + file.filename,
                title: file.filename
            };
            break;
        case 'REMOVE':
            officialDocumentStateTmp = LICENSE_DOCUMENTNOTUPLOADED;
            officialDocument = null;
            break;
        case 'OLD':
            officialDocumentStateTmp = officialDocumentState;
            officialDocument = user.officialDocument;
            break;
        default:
            break;
    }
    let files = req.files['additionalDocument'] ? req.files['additionalDocument'] : [];
    files.map(file => {
        let tmpFile = {
            url: url + '/upload/' + file.filename,
            title: file.filename
        };
        additionalDocument.push(tmpFile);
    });
    let oldFiles = oldAdditionalDocument ? oldAdditionalDocument : [];

    if (!Array.isArray(oldFiles) && isObject(JSON.parse(oldFiles))) {
        oldFiles = [oldFiles];
    }
    oldFiles.map(file => {
        additionalDocument.push(JSON.parse(file));
    });

    const oldUserVerified = user.userVerified;
    console.log('businessLicenseStateTmp ', businessLicenseStateTmp)
    console.log('officialLicenseStateTmp ', officialDocumentStateTmp)
    if (businessLicenseStateTmp === LICENSE_DOCUMENTAPPROVED) {
        if (user.emailConfirmed) {
            if (officialDocument) {
                if (officialDocumentStateTmp === LICENSE_DOCUMENTAPPROVED) {
                    user.userVerified = true;
                } else {
                    user.userVerified = false;
                }
            } else {
                user.userVerified = true;
            }
        }
    } else {
        user.userVerified = false;
    }
    // UPDATE
    user.companyName = companyName || user.companyName;
    user.corporationForm = corporationForm || user.corporationForm;
    user.email = email || user.email;
    user.invoiceEmail = invoiceEmail;
    user.password = password || user.password;
    user.nameSirCode = nameSirCode || user.nameSirCode;
    user.nameSirTitle = nameSirTitle || user.nameSirTitle;
    user.nameFirst = nameFirst || user.nameFirst;
    user.nameLast = nameLast || user.nameLast;
    user.addressStreet = addressStreet || user.addressStreet;
    user.addressHouse = addressHouse || user.addressHouse;
    user.addressZipCode = addressZipCode || user.addressZipCode;
    user.addressCity = addressCity || user.addressCity;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.faxNumber = faxNumber || user.faxNumber;
    user.vatIdCode = vatIdCode || user.vatIdCode;
    user.taxIdCode = taxIdCode || user.taxIdCode;
    user.companyIdCode = companyIdCode || user.companyIdCode;
    user.businessLicense = businessLicense;
    user.officialDocument = officialDocument;
    user.additionalDocument = additionalDocument;
    user.password = password || user.password;
    user.editionBlocked = editionBlocked || user.editionBlocked;
    user.userFreezed = userFreezed || user.userFreezed;
    // user.userVerified = userVerified || user.userVerified;
    user.emailConfirmed = emailConfirmed || user.emailConfirmed;
    user.businessLicenseState = businessLicenseStateTmp || user.businessLicenseState;
    user.officialDocumentState = officialDocumentStateTmp || user.officialDocumentState;
    user.editBy = `${editor.nameFirst} ${editor.nameLast}`;

    const updatedUser = await user.save();
    
    if (!updatedUser) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_INVALID_USERDATA));
    }

    console.log('updated user ', updatedUser, businessLicenseStateChanged, officialDocumentStateChanged);
    // If user verified 
    if (updatedUser.userVerified !== oldUserVerified) {
        if (updatedUser.userVerified) { // verified
            if (businessLicenseStateChanged) {
                sendLicenseApproveMail({ 
                    email: updatedUser.email,
                    origin: req.get('origin')
                });
            }
        }
    }
    if (updatedUser.businessLicenseState === LICENSE_DOCUMENTREJECTED && businessLicenseStateChanged) {
        sendLicenseRejectMail({ 
            email: updatedUser.email,
            origin: req.get('origin'),
            isBusiness: true
        });
    }
    if (updatedUser.officialDocumentState === LICENSE_DOCUMENTREJECTED && officialDocumentStateChanged) {
        sendLicenseRejectMail({ 
            email: updatedUser.email,
            origin: req.get('origin'),
            isBusiness: false
        });
    }
    res.json(updatedUser);
});


/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin only
 */
 const delete_user = asyncHandler(async (req, res) => {
    const user = await User.findOne({ id: req.params.id });

    if (user) {
        user.isDeleted = true;
        await user.save();
        res.json({ message: 'success' });
    } else {
        res.status(404);
        throw new ERROR_USER_NOT_EXIST;
    }
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
 const login = asyncHandler(async (req, res) => {
    const { email, password, captchaValue } = req.body;

    // Check CAPTCHA
    const isHuman = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        },
        body: `secret=${env['RECAPTCHA_SECRET_KEY']}&response=${captchaValue}`
    })
        .then(res => res.json())
        .then(json => json.success)
        .catch(err => {
          throw new Error(`${err.message}`)
        });
      
    if (captchaValue === null || !isHuman) {
        console.log('You are not a human');
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_YOU_ARE_NOT_A_HUMAN));
    }
    
    // Check Exist
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_USER_NOT_EXIST));
    }
    
    // Check if email is confirmed
    if (!user.userProxy && !user.isAdmin && !user.emailConfirmed) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_VERIFY_EMAIL));
    }

    // Check freezed
    if (user.userFreezed) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_USER_FREEZED));
    }

    // Check Password
    if (user && ( await user.matchPassword(password) )) {
        if (!user.userProxy && !user.isAdmin && !user.emailConfirmed) {
            res.status(400);
            throw new Error(errorMessageGenerator(ERROR_VERIFY_EMAIL));
        }

        // Success
        if (user.userVerified) {
            user.newBee += 1;
        }
        if (user.newBee > 2) {
            user.newBee = 2;
        }
        user.lastSeen = Date.now();
        const updatedUser = await user.save();
        
        if (!updatedUser) {
            res.status(400);
            throw new Error(errorMessageGenerator(ERROR_DB_CONNECTION_ERROR));
        }

        const jwtToken = updatedUser.generateAuthToken({ id: updatedUser._id });
        if (user.isAdmin) {
            console.log('admin ', req.get('origin'));
            res
            .cookie("token", jwtToken, { 
                path: '/',
                sameSite: true,
                httpOnly: true, 
                // secure: true
                domain: env['DOMAIN']
            })
            .status(301)
            .redirect(req.get('origin') + 'admin');
        }
        else {

            res
            .cookie("token", jwtToken, { 
                sameSite: true,
                httpOnly: true, 
                // secure: true
                domain: env['DOMAIN']
            })
            .status(200)
            .json({
                email: user.email,
                isAdmin: user.isAdmin,
                userVerified: user.userVerified,
                newBee: user.newBee,
                address: {
                    street: user.addressStreet,
                    house: user.addressHouse,
                    zipcode: user.addressZipCode,
                    city: user.addressCity
                },
                proxyToken: user.userProxy ? generateProxyPasswordToken({ email }) : undefined
            });    
        }
    } else {
        user.wrongPasswordCount = user.wrongPasswordCount + 1;
        
        if (user.wrongPasswordCount > 5) {  // FREEZE Account
            user.userFreezed = true;
            // Send Freezed Email
        }

        await user.save();
        
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_INVALID_PASSWORD));
    }
});

/**
 * @desc    Get User Profile
 * @route   GET /api/users/profile
 * @access  Token Verify
 */
 const get_user_profile = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        User.findOne({ email }).select('-password').lean().exec((err, doc) => {
            doc.businessLicenseNeedUpload = user.businessLicenseState === LICENSE_DOCUMENTNOTUPLOADED || user.businessLicenseState === LICENSE_DOCUMENTREJECTED ? true : false;
            doc.officialDocumentNeedUpload = user.officialDocumentState === LICENSE_DOCUMENTNOTUPLOADED || user.officialDocumentState === LICENSE_DOCUMENTREJECTED ? true : false;
            res.json(doc);
        });
    } else {
        res.status(404);
        throw new Error(errorMessageGenerator(ERROR_USER_NOT_EXIST));
    }
});

/**
 * @desc    Update User Profile
 * @route   POST /api/users/profile
 * @access  Token Verify
 */
 const update_user_profile = asyncHandler(async (req, res) => {
    console.log(req.body);
    const {
        companyName,
        corporationForm,
        email,
        invoiceEmail,
        nameSirCode,
        nameSirTitle,
        nameFirst,
        nameLast,
        addressStreet,
        addressHouse,
        addressZipCode,
        addressCity,
        phoneNumber,
        faxNumber,
        vatIdCode,
        taxIdCode,
        companyIdCode
    } = req.body;

    // Check Exist
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_USER_NOT_EXIST));
    }

    if (user.editionBlocked) {
        res.status(404);
        throw new Error(errorMessageGenerator(ERROR_USER_EDITION_BLOCKED));
    }

    user.invoiceEmail = invoiceEmail;
    user.companyName = companyName || user.companyName;
    user.corporationForm = corporationForm || user.corporationForm;
    // user.email = email || user.email;
    user.nameSirCode = nameSirCode || user.nameSirCode;
    user.nameSirTitle = nameSirTitle || user.nameSirTitle;
    user.nameFirst = nameFirst || user.nameFirst;
    user.nameLast = nameLast || user.nameLast;
    user.addressStreet = addressStreet || user.addressStreet;
    user.addressHouse = addressHouse || user.addressHouse;
    user.addressZipCode = addressZipCode || user.addressZipCode;
    user.addressCity = addressCity || user.addressCity;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.faxNumber = faxNumber || user.faxNumber;
    user.vatIdCode = vatIdCode || user.vatIdCode;
    user.taxIdCode = taxIdCode || user.taxIdCode;
    user.companyIdCode = companyIdCode || user.companyIdCode;
    user.editionCount = user.editionCount + 1;

    if (user.editionCount > 2) {
        user.editionBlocked = true;
    }

    const updatedUser = await user.save();

    if (updatedUser) {
        // Notification
        const notificationId = await Notification.find().sort({"counter":-1}).limit(1);
        const new_notification_counter = notificationId.length > 0 ? parseInt(notificationId[0]['counter']) + 1 : 1;
        const notification = await Notification.create({
            counter : new_notification_counter,
            id : generateID(MODEL_NOTIFICATION, SOURCE_FRONTEND, new_notification_counter),
            description: `${updatedUser.email}`,
            user : `${updatedUser.email}`,
            visited : 0,
            type : 2, // User Updated
            ref_id : updatedUser.id
        });
        const newNotification = await notification.save();
        global.io.emit("user_updated", updatedUser);
        global.io.emit('notification_updated');

        // Response
        res.status(201).json({
            email: updatedUser.email
        });
    } else {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_INVALID_USERDATA));
    }
});

/**
 * @desc    Set User Password
 * @route   POST /api/users/set-password
 * @access  Token Verify
 */
 const set_user_password = asyncHandler(async (req, res) => {
    const { password, token } = req.body;
    const { valid, email, type } = checkToken(token);
    if (!valid) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_TOKEN_EXPIRED));
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_USER_NOT_EXIST));
    }

    switch (type) {
        case TOKEN_CHECK_EMAIL:
            user.emailConfirmed = true;
            break;
        case TOKEN_FORGOT_PASSWORD:
            break;
        case TOKEN_PROXY_PASSWORD:
            user.emailConfirmed = true;
            user.userProxy = false;
            user.userVerified = true;
            break;
        default:
            break;
    }

    user.password = password;

    const newUser = await user.save();
    if (newUser) {
        res.json({
            data: USER_SET_PASSWORD_SUCCESS,
            result: 'success'
        });
    } else {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_INVALID_PASSWORD));
    }
});

/**
 * @desc    Forgot Password
 * @route   POST /api/users/forgot-password
 * @access  Public
 */
 const forgot_password = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Check Exist
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_USER_NOT_EXIST));
    }

    // Check if email is confirmed
    if (!user.userProxy && !user.isAdmin && !user.emailConfirmed) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_VERIFY_EMAIL));
    }

    // Send Recover-Password Email
    sendForgotPasswordOneTimeLink({ 
        email: user.email,
        origin: req.get('origin')
    });

    res.status(201).json({
        email: user.email
    });
});

/**
 * @desc    Signup User Profile
 * @route   POST /api/users/signup
 * @access  Public
 */
const signup = asyncHandler(async (req, res) => {
    const url = `${req.protocol}://${req.get('host')}:8080`;
    const {
        companyName,
        corporationForm,
        email,
        invoiceEmail,
        nameSirCode,
        nameSirTitle,
        nameFirst,
        nameLast,
        addressStreet,
        addressHouse,
        addressZipCode,
        addressCity,
        phoneNumber,
        faxNumber,
        vatIdCode,
        taxIdCode,
        companyIdCode
    } = req.body;
    
    // Check Duplication
    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_USER_ALREADY_EXIST));
    }
    
    const businessLicenseFile = req.files['businessLicense'] && req.files['businessLicense'].length > 0 ? req.files['businessLicense'][0] : null;
    const officialDocumentFile = req.files['officialDocument'] && req.files['officialDocument'].length > 0 ? req.files['officialDocument'][0] : null;
    
    console.log(businessLicenseFile);
    // Check License
    if (!businessLicenseFile) {
        // sendResponse({
        //     data: `NoBusinessLicense`,
        //     result: `error`
        // });
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_NO_UPLOAD_BUSINESS_LICENSE));
    }
    const businessLicenseFilePath = url + '/upload/' + businessLicenseFile.filename;
    let officialDocumentFilePath = '';
    if (officialDocumentFile) {
        officialDocumentFilePath = url + '/upload/' + officialDocumentFile.filename;
    }
    
    const userId = await User.find().sort({"counter":-1}).limit(1);
    const newCounter = userId.length > 0 ? parseInt(userId[0]['counter']) + 1 : 1;
    const notificationId = await Notification.find().sort({"counter":-1}).limit(1);
    const new_notification_counter = notificationId.length > 0 ? parseInt(notificationId[0]['counter']) + 1 : 1;
    
    // Save user
    const user = await User.create({
        id: generateID(MODEL_USER, SOURCE_FRONTEND, newCounter),
        counter: newCounter,
        companyName,
        corporationForm,
        email,
        invoiceEmail,
        nameSirCode,
        nameSirTitle,
        nameFirst,
        nameLast,
        addressStreet,
        addressHouse,
        addressZipCode,
        addressCity,
        phoneNumber,
        faxNumber,
        vatIdCode,
        taxIdCode,
        companyIdCode,
        businessLicense: { url: businessLicenseFilePath, title: businessLicenseFile.filename},
        officialDocument: officialDocumentFile ? { url: officialDocumentFilePath, title: officialDocumentFile.filename} : undefined,
        businessLicenseState: LICENSE_DOCUMENTUPLOADED,
        officialDocumentState: officialDocumentFile ? LICENSE_DOCUMENTUPLOADED : LICENSE_DOCUMENTNOTUPLOADED
    });

    const newUser = await user.save();

    if (newUser) {
        // Notification
        const notification = await Notification.create({
            counter : new_notification_counter,
            id : generateID(MODEL_NOTIFICATION, SOURCE_FRONTEND, new_notification_counter),
            description: `${newUser.email}`,
            user : `${newUser.email}`,
            visited : 0,
            type : 0, // User Created
            ref_id : newUser.id
        });
        const newNotification = await notification.save();
        global.io.emit("new_user_created", newUser);
        global.io.emit('notification_updated');

        // Send email
        sendCheckEmailOneTimeLink({ 
            email: newUser.email,
            origin: req.get('origin')
        });

        // Response
        res.status(201).json({
            email: newUser.email
        });
    } else {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_INVALID_USERDATA));
    }
});

/**
 * @desc    Send User Email
 * @route   POST /api/users/:id/sendmail
 * @access  Token Verify
 */
 const send_mail  = asyncHandler(async (req, res) => {
    const user = await User.findOne({ id: req.params.id });

    if (!user) {
        res.status(404);
        throw new Error(errorMessageGenerator(ERROR_USER_NOT_EXIST));
    }
    const { type } = req.body;

    switch (type) {
        case ADMIN_ACTION_SEND_MAIL_CHECK_EMAIL:
            sendCheckEmailOneTimeLink({ 
                email: user.email,
                origin: req.get('origin')
            });                
            break;
        case ADMIN_ACTION_SEND_MAIL_PROXY_PASSWORD:
            sendProxyUserOneTimeLink({ 
                email: user.email,
                password: user.proxyPassword,
                origin: req.get('origin')
            });                
            break;
        default:
            break;
    }
    
    res.json(user);
});

/**
 * @desc    Send User Email
 * @route   POST /api/users/:id/user-verified
 * @access  Token Verify
 */
 const update_user_verified  = asyncHandler(async (req, res) => {
    const user = await User.findOne({ id: req.params.id });
    const editor = await User.findOne({ _id: req.user_id });

    if (!user) {
        res.status(404);
        throw new Error(errorMessageGenerator(ERROR_USER_NOT_EXIST));
    }
    const { userVerified } = req.body;

    if (userVerified) {
        user.emailConfirmed = true;
        user.businessLicenseState = LICENSE_DOCUMENTAPPROVED;
    } else {
        user.businessLicenseState = LICENSE_DOCUMENTREJECTED;
    }

    user.userVerified = userVerified;
    user.editBy = `${editor.nameFirst} ${editor.nameLast}`;
    const updatedUser = await user.save();
    
    if (!updatedUser) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_INVALID_USERDATA));
    }

    if (updatedUser.userVerified) {
        sendLicenseApproveMail({ 
            email: updatedUser.email,
            origin: req.get('origin')
        });
    } else {
        sendLicenseRejectMail({ 
            email: updatedUser.email,
            origin: req.get('origin'),
            isBusiness: true
        });
    }

    res.json(updatedUser);
});

/**
 * @desc    Check User Email Duplication
 * @route   POST /api/users/check-email
 * @access  Token Verify
 */
const check_email  = asyncHandler(async (req, res) => {
    const { email } = req.body;
    // Check Duplication
    console.log('email ', email)
    const userExist = await User.findOne({ email });
    console.log('user ', userExist);
    if (userExist) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_USER_ALREADY_EXIST));
    }
    res.json({
        data: USER_SIGNUP_CHECK_EMAIL_SUCCESS,
        result: 'success'
    });
});

/**
 * @desc    Upload User License
 * @route   POST /api/users/upload-license
 * @access  Public
 */
 const upload_license = asyncHandler(async (req, res) => {
    const url = `${req.protocol}://${req.get('host')}:8080`;
    const {
        email
    } = req.body;
    
    // Check Duplication
    const user = await User.findOne({ email });
    
    if (!user) {
        res.status(404);
        throw new Error(errorMessageGenerator(ERROR_USER_NOT_EXIST));
    }
    
    const businessLicenseFile = req.files['businessLicense'] && req.files['businessLicense'].length > 0 ? req.files['businessLicense'][0] : null;
    const officialDocumentFile = req.files['officialDocument'] && req.files['officialDocument'].length > 0 ? req.files['officialDocument'][0] : null;

    let businessLicenseFilePath = '';
    if (businessLicenseFile) {
        businessLicenseFilePath = url + '/upload/' + businessLicenseFile.filename;
    }
    let officialDocumentFilePath = '';
    if (officialDocumentFile) {
        officialDocumentFilePath = url + '/upload/' + officialDocumentFile.filename;
    }

    // Save user
    user.businessLicense = businessLicenseFile ? { url: businessLicenseFilePath, title: businessLicenseFile.filename} : user.businessLicense,
    user.officialDocument = officialDocumentFile ? { url: officialDocumentFilePath, title: officialDocumentFile.filename} : user.officialDocument,
    user.businessLicenseState = businessLicenseFile ? LICENSE_DOCUMENTUPLOADED : user.businessLicenseState,
    user.officialDocumentState = officialDocumentFile ? LICENSE_DOCUMENTUPLOADED : user.officialDocumentState
    
    const newUser = await user.save();

    if (newUser) {
        // Notification
        const notificationId = await Notification.find().sort({"counter":-1}).limit(1);
        const new_notification_counter = notificationId.length > 0 ? parseInt(notificationId[0]['counter']) + 1 : 1;

        const notification = await Notification.create({
            counter : new_notification_counter,
            id : generateID(MODEL_NOTIFICATION, SOURCE_FRONTEND, new_notification_counter),
            description: `${newUser.email}`,
            user : `${newUser.email}`,
            visited : 0,
            type : 2, // User Updated
            ref_id : newUser.id
        });
        const newNotification = await notification.save();
        global.io.emit("user_updated", newUser);
        global.io.emit('notification_updated');

        // Response
        res.status(201).json({
            email: newUser.email
        });
    } else {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_INVALID_USERDATA));
    }
});

/**
 * @desc    Check Authentication
 * @route   POST /api/users/check-auth
 * @access  Token Verify
 */
 const check_auth = asyncHandler(async (req, res) => {
    if (!req.user_id) {
        res.status(404);
        throw new Error(errorMessageGenerator(ERROR_TOKEN_NOT_AUTH));        
    }
    console.log('reach check auth : np');
    res.status(201).json({
        _id: req.user_id
    });
});

export {
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
};