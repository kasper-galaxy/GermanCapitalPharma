import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { TOKEN_AUTH, TOKEN_CHECK_EMAIL, TOKEN_FORGOT_PASSWORD, TOKEN_PROXY_PASSWORD } from '../config/constant.js';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

const generateCheckEmailToken = ({ email }) => {
    return jwt.sign({ email, type: TOKEN_CHECK_EMAIL }, jwtSecret, {
        expiresIn: '1d',
    });
}

const generateForgotPasswordToken = ({ email }) => {
    return jwt.sign({ email, type: TOKEN_FORGOT_PASSWORD }, jwtSecret, {
        expiresIn: '1d',
    });
}

const generateProxyPasswordToken = ({ email }) => {
    return jwt.sign({ email, type: TOKEN_PROXY_PASSWORD }, jwtSecret, {
        expiresIn: '1800s',
    });
}

const generateAuthToken = ({ id }) => {
    return jwt.sign({ id, type: TOKEN_AUTH }, jwtSecret, {
        expiresIn: '1800s',
        // expiresIn: '1800s',
    });
}

const checkToken = (token) => {
    const { exp, email, type } = jwt.decode(token);
    if (Date.now() >= exp * 1000) {
        return {
            valid: false
        };
    }
    return {
        valid: true,
        email,
        type
    };
}

export {
    generateCheckEmailToken,
    generateForgotPasswordToken,
    generateProxyPasswordToken,
    generateAuthToken,
    checkToken
};