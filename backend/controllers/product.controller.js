import Product from '../models/product.model.js';
import asyncHandler from 'express-async-handler';
import User from "../models/user.model.js";
import { ERROR_INVALID_PRODUCTDATA, ERROR_PRODUCT_ALREADY_EXIST, ERROR_PRODUCT_NOT_EXIST, MODEL_PRODUCT, SOURCE_ADMIN } from '../config/constant.js';
import { isObject, errorMessageGenerator, generateID } from "../utils/libs.js";

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const get_product_list = asyncHandler(async (req, res) => {
    console.log('ra req: ', req.query);
    const { limit, skip } = req.query;
    const sort = req.query.sort ?  JSON.parse(req.query.sort) : {};
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    let query = {}, search = '', date_gte = '', date_lte = '';
    if (filter.q) { search =  new RegExp(filter.q,'i'); }
    if (filter.id) { query.id = filter.id; }
    if (filter.date_gte) { date_gte = filter.date_gte; }
    if (filter.date_lte) { date_lte = filter.date_lte; }

    const keyword = filter.q ? 
    {
        "$or": [ 
            // { "id" : { $regex: search }}, 
            { "name" : { $regex: search }},]
    } : {};

    console.log('search ', search, keyword, query)
    const totalProductsCount = await Product.find({ ...keyword,
                                    ...query, 
                                    ...(filter.date_gte || filter.date_lte) && { createdAt: { 
                                        ...(filter.date_gte) && { $gte : new Date( date_gte )},
                                        ...(filter.date_lte) && { $lte : new Date( date_lte )},
                                            }}
                                    // ...(filter.q) && { $text: { $search: search } },
                                    }).count();
    const products = await Product.find({ ...keyword,
                                    ...query,
                                    ...(filter.date_gte || filter.date_lte) && { createdAt: { 
                                        ...(filter.date_gte) && { $gte : new Date( date_gte )},
                                        ...(filter.date_lte) && { $lte : new Date( date_lte )},
                                            }} 
                                    // ...(filter.q) && { $text: { $search: search } },
                                    })
                            .skip(skip).limit(limit).sort(sort);
    
    res.header('Content-Range', `products ${skip}-${skip + limit - 1}/${totalProductsCount}`)
        .header('X-Total-Count', `${totalProductsCount}`)
        .json(products);
});

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const add_product = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.user_id });
    const url = `${req.protocol}://${req.get('host')}:8080`;
    const {
        name,
        price,
        vat,
        description,
        ingredients,
        consumption,
        itemNumber,
    } = req.body;

    console.log('add product');
    console.log('add product ', req.files);

    // Check Duplication
    const productExist = await Product.findOne({ name });
    if (productExist) {
        res.status(400);
        throw new Error( errorMessageGenerator(ERROR_PRODUCT_ALREADY_EXIST) );
    }

    // Images Check
    const images = req.files['images'] && req.files['images'].length > 0 ? req.files['images'] : [];
    
    let imageFilePath = [];
    images.map(file => {
        let tmpPath = url + '/upload/' + file.filename;
        let tmpFile = {
            url: tmpPath,
            title: file.filename
        };
        imageFilePath.push(tmpFile);
    });

    const productId = await Product.find().sort({"counter":-1}).limit(1);
    const newCounter = productId.length > 0 ? parseInt(productId[0]['counter']) + 1 : 1;

    // Save Product
    const product = await Product.create({
        id: generateID(MODEL_PRODUCT, SOURCE_ADMIN, newCounter),
        counter: newCounter,
        name,
        price,
        vat,
        images: imageFilePath,
        description,
        itemNumber,
        ingredients: ingredients ? JSON.parse(ingredients) : product.ingredients,
        consumption,
        editBy: `${user.nameFirst} ${user.nameLast}`
    });

    const newProduct = await product.save();

    if (newProduct) {
        res.status(201).json(newProduct);
    } else {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_INVALID_PRODUCTDATA));
    }
});

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Private/Admin
 */
const get_product = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ id: req.params.id });
    
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error(errorMessageGenerator(ERROR_PRODUCT_NOT_EXIST));
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const update_product = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.user_id });
    const product = await Product.findOne({ id: req.params.id });
    
    if (!product) {
        res.status(404);
        throw new Error(errorMessageGenerator(ERROR_PRODUCT_NOT_EXIST));
    }
    
    const url = `${req.protocol}://${req.get('host')}:8080`;
    console.log(req.body);
    console.log(product);
    console.log(req.files);
    const {
        name,
        price,
        vat,
        description,
        ingredients,
        consumption,
        oldImages,
        itemNumber
    } = req.body;

    // Check Duplication
    if (product.name !== name) {
        const productExist = await Product.findOne({ name });
        if (productExist) {
            res.status(400);
            throw new Error(errorMessageGenerator(ERROR_PRODUCT_ALREADY_EXIST));
        }
    }

    // Image Check
    let images = [];
    let files = req.files['images'] ? req.files['images'] : [];
    console.log("Images uploading ")
    files.map(file => {
        let tmpFile = {
            url: url + '/upload/' + file.filename,
            title: file.filename
        };
        images.push(tmpFile);
    });
    let oldFiles = oldImages ? oldImages : [];

    if (!Array.isArray(oldFiles) && isObject(JSON.parse(oldFiles))) {
        oldFiles = [oldFiles];
    }
    oldFiles.map(file => {
        images.push(JSON.parse(file));
    });

    const { columns, data} = JSON.parse(ingredients)
    console.log('before change ', typeof data, data);

    product.name = name || product.name;
    product.price = price || product.price;
    product.vat = vat || product.vat;
    product.description = description || product.description;
    product.ingredients = ingredients ? JSON.parse(ingredients) : product.ingredients;
    product.consumption = consumption || product.consumption;
    product.itemNumber = itemNumber || product.itemNumber;
    product.images = images;
    product.editBy = `${user.nameFirst} ${user.nameLast}`;

    const updatedProduct = await product.save();

    if (!updatedProduct) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_INVALID_PRODUCTDATA));
    }

    console.log('after change ', updatedProduct.ingredients);
    res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const delete_product = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ id: req.params.id });

    if (product) {
        await product.remove();
        res.json({ message: 'success' });
    } else {
        res.status(404);
        throw new Error(errorMessageGenerator(ERROR_PRODUCT_NOT_EXIST));
    }
});

/**
 * @desc    Get all products
 * @route   GET /api/products/shop
 * @access  Public
 */
const get_shop_product_list = asyncHandler(async (req, res) => {
    if (req.query.option === 'all') {
        const products = await Product.find({});
        res.json({ products });
    } else {
        const perPage = req.query.itemsPerPage || 8;
        const page = parseInt(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                name: {
                $regex: req.query.keyword,
                $options: 'i',
                },
            }
            : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword })
            .limit(perPage)
            .skip(perPage * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / perPage), count });
    }
});

export {
    get_product_list,
    add_product,
    get_product,
    update_product,
    delete_product,
    get_shop_product_list
};