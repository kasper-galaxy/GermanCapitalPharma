import Invoice from "../models/invoice.model.js";
import asyncHandler from 'express-async-handler';
import { ERROR_INVOICE_NOT_EXIST, MODEL_INVOICE, SOURCE_ADMIN, SOURCE_FRONTEND } from "../config/constant.js";
import { generateID } from "../utils/libs.js";
import User from "../models/user.model.js";

const add_invoice = asyncHandler(async (order, path) => {
    console.log('add invoice ', order);
    const {
        id,
        user,
        deliveryAddress,
        totalPrice,
        taxPrice,
        netPrice,
        orderItems,
    } = order;

    const invoiceId = await Invoice.find().sort({"counter":-1}).limit(1);
    const newCounter = invoiceId.length > 0 ? parseInt(invoiceId[0]['counter']) + 1 : 1;

    const invoice = await Invoice.create({
        id: generateID(MODEL_INVOICE, SOURCE_ADMIN, newCounter),
        counter: newCounter,
        user,
        order: id,
        address: deliveryAddress,
        orderItems,
        totalPrice,
        taxPrice,
        netPrice,
        url: path
    });

    const newInvoice = await invoice.save();

    if (!newInvoice) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_INVALID_ORDERDATA));
    }

    return newInvoice;
});

/**
 * @desc    Get single invoice
 * @route   GET /api/invoices/:id
 * @access  Private/Admin
 */
 const get_invoice = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findOne({ id: req.params.id });
    
    if (invoice) {
        res.json(invoice);
    } else {
        res.status(404);
        throw new Error(errorMessageGenerator(ERROR_INVOICE_NOT_EXIST));
    }
});

/**
 * @desc    Get all invoices
 * @route   GET /api/invoices
 * @access  Private/Admin
 */
 const get_invoice_list = asyncHandler(async (req, res) => {
    console.log('ra req: ', req.query);
    const { limit, skip } = req.query;
    const sort = req.query.sort ?  JSON.parse(req.query.sort) : {};
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    let query = {}, search = '',date_gte = '', date_lte = '';
    if (filter.q) { search =  new RegExp(filter.q,'i'); }
    if (filter.id) { query.id = filter.id; }
    if (filter.user) { query.user = filter.user; }
    if (filter.order) { query.order = filter.order; }
    if (filter.date_gte) { date_gte = filter.date_gte; }
    if (filter.date_lte) { date_lte = filter.date_lte; }
    
    
    const keyword = filter.q ? 
    {
        "$or": [ 
            // { "email" : { $regex: search }}, 
            // { "id" : { $regex: search }},
            { "id" : { $regex: search }},
            { "address" : { $regex: search }}]
    } : {};

    console.log('search ', search, keyword, query)
    const totalInvoicesCount = await Invoice.find({ ...keyword,
                                    ...query, 
                                    ...(filter.date_gte || filter.date_lte) && { createdAt: { 
                                        ...(filter.date_gte) && { $gte : new Date( date_gte )},
                                        ...(filter.date_lte) && { $lte : new Date( date_lte )},
                                            }}
                                    }).count();
    const invoices = await Invoice.find({ ...keyword,
                                    ...query, 
                                    ...(filter.date_gte || filter.date_lte) && { createdAt: { 
                                        ...(filter.date_gte) && { $gte : new Date( date_gte )},
                                        ...(filter.date_lte) && { $lte : new Date( date_lte )},
                                            }}
                                    })
                            .skip(skip).limit(limit).sort(sort);
    
    res.header('Content-Range', `invoices ${skip}-${skip + limit - 1}/${totalInvoicesCount}`)
        .header('X-Total-Count', `${totalInvoicesCount}`)
        .json(invoices);   
});


export {
    add_invoice,
    get_invoice,
    get_invoice_list
};