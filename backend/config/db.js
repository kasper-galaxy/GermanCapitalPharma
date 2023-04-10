import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_LOCAL_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });

        console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
    } catch (err) {
        console.log(`Error: ${err.message}`.red.underline.bold);
        process.exit(1);
    }
};

export default connectDB;