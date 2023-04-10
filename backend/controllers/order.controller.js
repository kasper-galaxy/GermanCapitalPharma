import Order from "../models/order.model.js";
import asyncHandler from 'express-async-handler';
import { errorMessageGenerator, formatAddress, generateID } from "../utils/libs.js";
import { 
  DELIVERY_STATUS_DONE, 
  DELIVERY_STATUS_OPEN, 
  ERROR_INVALID_ORDERDATA, 
  ERROR_ORDER_NOT_EXIST, 
  ERROR_USER_NOT_EXIST, 
  ORDER_STATUS_DONE, 
  ORDER_STATUS_PENDING, 
  PAYMENT_STATUS_NOT_PAID, 
  PAYMENT_STATUS_PAID, 
  SOURCE_ADMIN, 
  SOURCE_FRONTEND, 
  MODEL_TYPE_ORDER, 
  ORDER_STATUS_CANCELLED, 
  ORDER_STATUS_OPEN,
  MODEL_NOTIFICATION } from "../config/constant.js";
import User from "../models/user.model.js";
import CreateInvoice from "../utils/zugferd.js";
import Notification from '../models/notification.model.js';
import { add_invoice } from '../controllers/invoice.controller.js';

Date.prototype.getWeekNumber = function(){
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
  };
  
/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Private/Admin
 */
 const get_order_list = asyncHandler(async (req, res) => {
    console.log('ra req: ', req.query);
    const { limit, skip } = req.query;
    const sort = req.query.sort ?  JSON.parse(req.query.sort) : {};
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    let query = {}, search = '', date_gte = '', date_lte = '';
    if (filter.q) { search =  new RegExp(filter.q,'i'); }
    if (filter.status) { query.status = filter.status; }
    if (filter.id) { query.id = filter.id; }
    if (filter.user) { query.user = filter.user; }
    if (filter.date_gte) { date_gte = filter.date_gte; }
    if (filter.date_lte) { date_lte = filter.date_lte; }
    
    
    const keyword = filter.q ? 
    {
        "$or": [ 
            // { "email" : { $regex: search }}, 
            // { "id" : { $regex: search }},
            { "companyName" : { $regex: search }},
            { "deliveryAddress" : { $regex: search }}]
    } : {};

    console.log('search ', search, keyword, query)
    const totalOrdersCount = await Order.find({ ...keyword,
                                    ...query, 
                                    ...(filter.date_gte || filter.date_lte) && { createdAt: { 
                                        ...(filter.date_gte) && { $gte : new Date( date_gte )},
                                        ...(filter.date_lte) && { $lte : new Date( date_lte )},
                                            }}
                                    }).count();
    const orders = await Order.find({ ...keyword,
                                    ...query, 
                                    ...(filter.date_gte || filter.date_lte) && { createdAt: { 
                                        ...(filter.date_gte) && { $gte : new Date( date_gte )},
                                        ...(filter.date_lte) && { $lte : new Date( date_lte )},
                                            }}
                                    })
                            .skip(skip).limit(limit).sort(sort);
    
    res.header('Content-Range', `orders ${skip}-${skip + limit - 1}/${totalOrdersCount}`)
        .header('X-Total-Count', `${totalOrdersCount}`)
        .json(orders);
});

/**
 * @desc    Get all orders for Revenue by Dates (Statistics)
 * @route   GET /api/orders/revenue-by-dates
 * @access  Private/Admin
 */
 const get_revenue_by_dates = asyncHandler(async (req, res) => {
    console.log('ra req: ', req.body);
    let {
        from, to, fromWeek, toWeek, isDate, status
    } = req.body;

    if (isDate) {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
        to  = to || tomorrow.toISOString().slice(0, 10)

        const result = await Order.aggregate([
            {
              $match: {
                "createdAt": {
                    ...from && { $gte: new Date(from) },
                    ...to && { $lte: new Date(to) },
                },
                "status": status
              }, 
            },
            {
              "$group": {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt"
                  }
                },
                "total": {
                  "$sum": "$netPrice"
                  // {                    
                    // "$subtract" : [
                    //   "$totalPrice",
                    //   "$taxPrice"
                    // ]
                  // }
                }
              }
            },
            {
              "$sort": {
                "_id": 1
              }
            }
          ]);
          res.json(result);
    } else {
        toWeek  = Number(toWeek) || new Date().getWeekNumber();

        const result = await Order.aggregate([
            {
            "$addFields": {
                "week": {
                "$week": "$createdAt"
                }
            }
            },
            {
            $match: {
                "week": {
                    ...fromWeek && { $gte: Number(fromWeek)-1 },
                    ...toWeek && { $lte: toWeek+1 },
                },
                "status": status
            },
            
            },
            {
            "$group": {
                "_id": {
                    "$week": "$createdAt"
                },
                "total": {
                    "$sum": "$netPrice"
                    // {
                      // "$subtract" : [
                      //   "$totalPrice",
                      //   "$taxPrice"
                      // ]
                    // }
                }
            }
            },
            {
            "$sort": {
                "_id": 1
            }
            }
        ]);
        console.log(result);
        res.json(result);
    }
});

/**
 * @desc    Get all orders for Revenue by Dates (Statistics)
 * @route   GET /api/orders/revenue-by-products
 * @access  Private/Admin
 */
 const get_revenue_by_products = asyncHandler(async (req, res) => {
    console.log('ra req: ', req.body);
    let {
        from, to, status
    } = req.body;

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    to  = to || tomorrow.toISOString().slice(0, 10)

    const result = await Order.aggregate([
        {
          "$unwind": {
            "path": "$orderItems"
          }
        },
        {
          $match: {
            "createdAt": {
              ...from && { $gte: new Date(from) },
              ...to && { $lte: new Date(to) },
            },
            "status": status
          },
        },
        {
          "$group": {
            "_id": "$orderItems.product",
            "name": {
              "$first": "$orderItems.name"
            },
            "cost": {
              "$sum": {
                "$multiply": [
                  "$orderItems.price",
                  "$orderItems.qty",
                  // {
                  //   "$multiply": [
                  //     "$orderItems.qty",
                  //     {
                  //       "$add": [
                  //         1,
                  //         "$orderItems.vat"
                  //       ]
                  //     }
                  //   ]
                  // }
                ]
              }
            }
          }
        },
        {
          "$sort": {
            "cost": -1
          }
        },
        {
          "$limit": 5
        }
      ]);
    res.json(result);
});

/**
 * @desc    Create new orders (manually)
 * @route   POST /api/orders
 * @access  Private/Admin
 */
const add_order = asyncHandler(async (req, res) => {
    const url = `${req.protocol}://${req.get('host')}:8080`;
    console.log('add order ', req.body, url);
    const {
        companyName,
        deliveryAddress,
        source,
        status,
        deliveryStatus,
        paymentStatus,
        user,
        orderItems,
        receivedPaymentAt,
        expectedPaymentAt
    } = req.body;

    const orderUser = await User.findOne({ id: user });
    const orderId = await Order.find().sort({"counter":-1}).limit(1);
    const newCounter = orderId.length > 0 ? parseInt(orderId[0]['counter']) + 1 : 1;
    let totalPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty * (1 + item.vat), 0);
    let netPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    let taxPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty * item.vat, 0);

    const order = await Order.create({
        id: generateID(MODEL_TYPE_ORDER, SOURCE_ADMIN, newCounter),
        counter: newCounter,
        user,
        source,
        companyName: companyName,
        deliveryAddress: deliveryAddress,
        deliveryStatus,
        totalPrice,
        taxPrice,
        netPrice,
        orderItems: orderItems,
        receivedPaymentAt,
        expectedPaymentAt
    });

    console.log('Setting status: ', receivedPaymentAt, expectedPaymentAt);
    if (!receivedPaymentAt && !expectedPaymentAt) {
        order.status = ORDER_STATUS_OPEN;
        order.paymentStatus = PAYMENT_STATUS_NOT_PAID;
    } else {
        order.paymentStatus = PAYMENT_STATUS_PAID;
        if (deliveryStatus === DELIVERY_STATUS_OPEN) {
            order.status = ORDER_STATUS_PENDING;
        } else {
            order.status = ORDER_STATUS_DONE;
        }
    }
    order.receivedPaymentAt = receivedPaymentAt || order.receivedPaymentAt;
    order.expectedPaymentAt = expectedPaymentAt || order.expectedPaymentAt;
    console.log(order);

    const invoiceFile = await CreateInvoice(orderUser, order);
    const invoice = await add_invoice(order, url + '/' + invoiceFile);
    const editor = await User.findOne({ _id: req.user_id });

    console.log(invoice);
    order.invoice = invoice.id;
    order.invoiceID = invoice._id;
    order.editBy = `${editor.nameFirst} ${editor.nameLast}`;

    const newOrder = await order.save();

    if (newOrder) {
        res.status(201).json(newOrder);
    } else {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_INVALID_ORDERDATA));
    }
});


/**
 * @desc    Create new orders (online)
 * @route   POST /api/orders/place
 * @access  Private/Admin
 */
 const place_order = asyncHandler(async (req, res) => {
    const { cartData } = req.body;
    const url = `${req.protocol}://${req.get('host')}:8080`;
    const { 
        cartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        netPrice,
        paymentMethod,
        itemsAmount,
     } = cartData;
    const user = await User.findOne({ _id: req.user_id });
    const orderId = await Order.find().sort({"counter":-1}).limit(1);
    const newCounter = orderId.length > 0 ? parseInt(orderId[0]['counter']) + 1 : 1;
    console.log('place order', cartData, req.user_id, user);

    const order = await Order.create({
        id: generateID(MODEL_TYPE_ORDER, SOURCE_FRONTEND, newCounter),
        counter: newCounter,
        user: user.id,
        companyName: user.companyName,
        deliveryAddress: formatAddress({
            street: user.addressStreet,
            house: user.addressHouse,
            zipcode: user.addressZipCode,
            city: user.addressCity,
        }),
        totalPrice,
        taxPrice,
        netPrice: itemsPrice,
        orderItems: cartItems
    });

    console.log('user id', user.id, order);

    const invoiceFile = await CreateInvoice(user, order);
    const invoice = await add_invoice(order, url + '/' + invoiceFile);
    console.log(invoice);
    order.invoice = invoice.id;
    order.invoiceID = invoice._id;

    console.log('new order ', order)
    const newOrder = await order.save();

    if (newOrder) {
      // Notification
      const notificationId = await Notification.find().sort({"counter":-1}).limit(1);
      const new_notification_counter = notificationId.length > 0 ? parseInt(notificationId[0]['counter']) + 1 : 1;
  
      const notification = await Notification.create({
        counter : new_notification_counter,
        id : generateID(MODEL_NOTIFICATION, SOURCE_FRONTEND, new_notification_counter),
        description: `${user.email}`,
        user : `${user.email}`,
        visited : 0,
        type : 1,
        ref_id : newOrder.id
      });
      
      await notification.save();
      
      global.io.emit('new_order_created', user);
      global.io.emit('notification_updated');

      // Response
      res.status(201).json({
          id: newOrder.id
      });
    } else {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_INVALID_ORDERDATA));
    }
});

/**
 * @desc    Retrieve new orders (for user)
 * @route   POST /api/orders/list
 * @access  Private/Admin
 */
 const list_order = asyncHandler(async (req, res) => {
    const url = `${req.protocol}://${req.get('host')}:8080`;
    const user = await User.findOne({ _id: req.user_id });

    const orders = await Order.find({ user: user.id }).populate('invoiceID');
    console.log('list order: ', orders.length);
    res.json(orders);
});

/**
 * @desc    Get single order
 * @route   GET /api/orders/:id
 * @access  Private/Admin
 */
const get_order = asyncHandler(async (req, res) => {
    const order = await Order.findOne({ id: req.params.id });
    
    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error(errorMessageGenerator(ERROR_ORDER_NOT_EXIST));
    }
});

/**
 * @desc    Update a order
 * @route   PUT /api/orders/:id
 * @access  Private/Admin
 */
const update_order = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.user_id });
    const order = await Order.findOne({ id: req.params.id });
    console.log(order.user);
    if (!order) {
        res.status(404);
        throw new Error(errorMessageGenerator(ERROR_ORDER_NOT_EXIST));
    }
    
    const url = `${req.protocol}://${req.get('host')}:8080`;
    const {
        receivedPaymentAt,
        expectedPaymentAt,
        deliveryStatus,
        cancelled
    } = req.body;

    if (!receivedPaymentAt && !expectedPaymentAt) {
        order.status = ORDER_STATUS_OPEN;
        order.paymentStatus = PAYMENT_STATUS_NOT_PAID;
    } else {
        order.paymentStatus = PAYMENT_STATUS_PAID;
        if (deliveryStatus === DELIVERY_STATUS_OPEN) {
            order.status = ORDER_STATUS_PENDING;
        } else {
            order.status = ORDER_STATUS_DONE;
        }
    }
    order.cancelled = typeof cancelled === undefined ? order.cancelled : cancelled;

    if (order.cancelled) {
        order.status = ORDER_STATUS_CANCELLED;
    } else {
      if (order.status === ORDER_STATUS_CANCELLED) {
        order.status = ORDER_STATUS_PENDING;
      }
    }
    order.receivedPaymentAt = receivedPaymentAt || order.receivedPaymentAt;
    order.expectedPaymentAt = expectedPaymentAt || order.expectedPaymentAt;
    order.deliveryStatus = deliveryStatus;
    order.editBy = `${user.nameFirst} ${user.nameLast}`;

    console.log(order);
    const updatedOrder = await order.save();

    if (!updatedOrder) {
        res.status(400);
        throw new Error(errorMessageGenerator(ERROR_INVALID_ORDERDATA));
    }

    res.json(updatedOrder);
});

/**
 * @desc    Delete a order
 * @route   DELETE /api/orders/:id
 * @access  Private/Admin
 */
const delete_order = asyncHandler(async (req, res) => {
    const order = await Order.findOne({ id: req.params.id });

    if (order) {
        await order.remove();
        res.json({ message: 'success' });
    } else {
        res.status(404);
        throw new Error(errorMessageGenerator(ERROR_ORDER_NOT_EXIST));
    }
});

export {
    get_order_list,
    list_order,
    add_order,
    get_order,
    update_order,
    delete_order,
    place_order,
    get_revenue_by_dates,
    get_revenue_by_products
};