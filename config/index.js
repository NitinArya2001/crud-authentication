import dotenv from 'dotenv';

dotenv.config();

export const {
    APP_PORT,
    DEBUG_MODE,
    DB_URL,
    JWT_SECRET,
    REFRESH_SECRET,
    APP_URL,
    RAZORPAY_KEY,
    RAZORPAY_SECRET
}=process.env;