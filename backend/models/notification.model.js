import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
        },
        counter: {
            type: Number,
            unique: true,
        },
        description: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true
        },
        visited : {
            type: Boolean,
            required: true
        },
        type : {
            type : Number,
            required: true
        },
        ref_id : {
            type : String,
            required: true
        }
    }, {
    timestamps: true,        
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;