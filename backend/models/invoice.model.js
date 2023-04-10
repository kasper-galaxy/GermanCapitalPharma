import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
        },
        counter: {
            type: Number,
            unique: true,
        },
        url: {
            type: String,
        },
        user: {
            type: String,
            ref: 'User'
        },
        editBy: {
            type: String
        },
        order: {
            type: String,
            ref: 'Order'
        },
        address: {
            type: String,
        },
        orderItems: [
            {
                name: { type: String, required: true },
                price: { type: Number, required: true },
                qty: { type: Number, required: true },
                vat: { type: Number, required: true },
                product: {
                    type: String,
                    required: true,
                    ref: 'Product',
                }
            }
        ],
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
    },
    {
        timestamps: true
    }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;