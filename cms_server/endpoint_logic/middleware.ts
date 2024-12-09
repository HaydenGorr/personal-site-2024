import { RequestHandler } from 'express';
import cors from 'cors';
import { validate_JWT } from '../utils/validate_JWT.js';
import { Request, Response } from 'express';

const allowedOrigins = [
    'http://localhost:3000',
    'https://www.haydengorringe.com',
    'http://localhost:3004',
    'https://admin.haydengorringe.com',
    'http://admin_panel:3004'];

export const JWTMiddleware: RequestHandler = (req: Request, res: Response, next) => {
    const token = req.cookies.token;

    if (!token) {
    console.log("User did not provide a token");
    res.status(401).json({
        data: false,
        error: {
        has_error: true,
        error_message: "User did not provide a token",
        }
    });
    return; // Exit the function without returning a value
    }

    // Handle the asynchronous operation
    validate_JWT(token)
    .then(() => {
        next();
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    });
};

export const cors_middleware = cors({
    origin: function(origin: any, callback: any) {
        console.log('Incoming request from origin:', origin);
        const normalizedOrigin = origin?.replace(/\/$/, '');
        if (!origin || allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS: ' + origin));
        }
    },
    credentials: true
})