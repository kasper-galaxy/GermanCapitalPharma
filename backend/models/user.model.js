import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken'
import { TOKEN_AUTH } from '../config/constant.js';
import {
    CORPORATIONFORM_OHG,
    CORPORATIONFORM_EK,
    LICENSE_DOCUMENTUPLOADED,
    LICENSE_DOCUMENTREJECTED,
    LICENSE_DOCUMENTAPPROVED,
    LICENSE_DOCUMENTNOTUPLOADED
} from '../config/constant.js';

const userSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true,
    },
    counter: {
        type: Number,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    invoiceEmail: {
        type: String,
    },
    password: {
        type: String,
    },
    proxyPassword: {
        type: String,
    },
    nameSirCode: {
        type: String,
        // required: true,
    },
    nameSirTitle: {
        type: String,
    },
    nameFirst: {
        type: String,
        required: true,
    },
    nameLast: {
        type: String,
        required: true,
    },
    addressStreet: {
        type: String,
        // required: true,
    },
    addressHouse: {
        type: String,
        // required: true,
    },
    addressZipCode: {
        type: String,
        // required: true,
    },
    addressCity: {
        type: String,
        // required: true,
    },
    companyName: {
        type: String,
        // required: true,
    },
    corporationForm: {
        type: String,
        enum: [ CORPORATIONFORM_OHG, CORPORATIONFORM_EK ],
        default: CORPORATIONFORM_OHG
    },
    companyIdCode: {
        type: String,
        // required: true,
    },
    phoneNumber: {
        type: String,
        // required: true,
    },
    faxNumber: {
        type: String,
        // required: true,
    },
    vatIdCode: {
        type: String,
    },
    taxIdCode: {
        type: String,
    },
    businessLicense: {
        url: {
            type: String,
        },
        title: {
            type: String,
        }
    },
    officialDocument: {
        url: {
            type: String,
        },
        title: {
            type: String,
        }
    },
    additionalDocument: {
        type: [{
            url: {
                type: String,
            },
            title: {
                type: String
            }
        }],
        default: []
    },
    businessLicenseState: {
        type: String,
        enum: [ LICENSE_DOCUMENTNOTUPLOADED, LICENSE_DOCUMENTUPLOADED, LICENSE_DOCUMENTREJECTED, LICENSE_DOCUMENTAPPROVED ],
        default: LICENSE_DOCUMENTNOTUPLOADED
    },
    officialDocumentState: {
        type: String,
        enum: [ LICENSE_DOCUMENTNOTUPLOADED, LICENSE_DOCUMENTUPLOADED, LICENSE_DOCUMENTREJECTED, LICENSE_DOCUMENTAPPROVED ],
        default: LICENSE_DOCUMENTNOTUPLOADED
    },
    emailConfirmed: {
        type: Boolean,
        default: false
    },
    userProxy: {
        type: Boolean,
        default: false
    },
    userVerified: {
        type: Boolean,
        default: false
    },
    editionBlocked: {
        type: Boolean,
        default: false
    },
    userFreezed: {
        type: Boolean,
        default: false
    },
    wrongPasswordCount: {
        type: Number,
        default: 0,
    },
    editionCount: {
        type: Number,
        default: 0
    },
    editBy: {
        type: String
    },
    lastSeen: {
        type: Date
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    newBee: {
        type: Number,
        default: 0
    }
    // twitterOAuthToken: {type: String, get: decrypt, set: encrypt}
}, {
    timestamps: true,
});

// userSchema.index({'$**': 'text'});
userSchema.index({email: 'text',addressZipCode: 'text', companyName: 'text'});
// User.createIndexes().createIndex({ "name": "text", "description": "text" });

// Check enteredPassword and userPassword match
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Generate Auth Token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            type: TOKEN_AUTH,
        },
        process.env.JWT_SECRET,
        !this.isAdmin && { expiresIn: "30m" }
      );
      return token;
}

// Soft Delete
userSchema.methods.softDelete = function (id) {

}

// Encrypt password before save it to database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    // Generate number of rounds
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Only lookup the users with isDeleted: false
userSchema.pre('find', function() {
    this.where({ isDeleted: false });
});

userSchema.pre('findOne', function() {
    this.where({ isDeleted: false });
});

// Encrypt / Decrypt Module Integration Functions
function encrypt(text){
    var cipher = crypto.createCipher('aes-256-cbc', process.env.SERVER_SECRET);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
} 
  
function decrypt(text){
    if (text === null || typeof text === 'undefined') {
        return text;
    };
    var decipher = crypto.createDecipher('aes-256-cbc', process.env.SERVER_SECRET);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}

const User = mongoose.model('User', userSchema);

export default User;