import mongoose from "mongoose";
import { DELIVERY_STATUS_DONE, DELIVERY_STATUS_OPEN, ORDER_SOURCE_MANUAL, ORDER_SOURCE_ONLINE, ORDER_STATUS_DONE, ORDER_STATUS_PENDING, ORDER_STATUS_CANCELLED, PAYMENT_STATUS_NOT_PAID, PAYMENT_STATUS_PAID, ORDER_STATUS_OPEN } from "../config/constant.js";

const orderSchema = mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
        },
        counter: {
            type: Number,
            unique: true,
        },
        user: {
            type: String,
            required: true
        },
        editBy: {
            type: String, 
        },
        orderItems: [
            {
                name: { type: String, required: true },
                price: { type: Number, required: true },
                qty: { type: Number, required: true },
                vat: { type: Number, required: true },
                images: { type: Array },
                product: {
                    type: String,
                    required: true,
                    ref: 'Product',
                }
            }
        ],
        companyName: {
            type: String,
            required: true,
        },
        deliveryAddress: {
            type: String,
            required: true,
        },
        totalPrice: {
            type: Number,
            default: 0,
        },
        taxPrice: {
            type: Number,
            default: 0,
        },
        netPrice: {
            type: Number,
            default: 0,
        },
        cancelled: {
            type: Boolean,
            default: false,
        },
        source: {
            type: String,
            enum: [ ORDER_SOURCE_ONLINE, ORDER_SOURCE_MANUAL ],
            default: ORDER_SOURCE_ONLINE
        },
        status: {
            type: String,
            enum: [ ORDER_STATUS_OPEN, ORDER_STATUS_PENDING, ORDER_STATUS_DONE, ORDER_STATUS_CANCELLED ],
            default: ORDER_STATUS_OPEN
        },
        deliveryStatus: {
            type: String,
            enum: [ DELIVERY_STATUS_OPEN, DELIVERY_STATUS_DONE ],
            default: DELIVERY_STATUS_OPEN
        },
        paymentStatus: {
            type: String,
            enum: [ PAYMENT_STATUS_NOT_PAID, PAYMENT_STATUS_PAID ],
            default: PAYMENT_STATUS_NOT_PAID
        },
        receivedPaymentAt: {
            type: Date,
        },
        expectedPaymentAt: {
            type: Date,
        },
        invoice: {
            type: String,
        },
        invoiceID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoice'
        }
    }, {
    timestamps: true,        
});

const Order = mongoose.model('Order', orderSchema);

export default Order;