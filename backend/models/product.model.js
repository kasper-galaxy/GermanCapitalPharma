import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
        },
        counter: {
            type: Number,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        editBy: {
            type: String
        },
        images: [{
            url: String,
        }],
        description: {
            type: String,
        },
        price: {
            type: Number,
            default: 0
        },
        vat: {
            type: Number,
            default: 0.07
        },
        ingredients: {
            columns: {
                type: Array,
                default: [{"id":"name","label":"Composition","accessor":"name","minWidth":60,"dataType":"text","options":[]},{"id":"calories","label":"Pro Tablette - per Tablet","accessor":"calories","minWidth":60,"dataType":"text","options":[]},{"id":"unit","label":"Einheit - Unit","accessor":"unit","width":60,"dataType":"text","options":[]},{"id":"nrv","label":"%NRV*","accessor":"nrv","width":60,"dataType":"text","options":[]},{"id":999999,"width":20,"label":"+","disableResizing":true,"dataType":"null"}]
            },
            data: {
                type: Array,
                default: []
            }
        },
        consumption: {
            type: String,
        },
        itemNumber: {
            type: String,
            default: ''
        },
        totalSold: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
    }
);

productSchema.index({'$**': 'text'});

const Product = mongoose.model('Product', productSchema);

export default Product;