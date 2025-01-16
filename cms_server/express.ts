import dotenv from 'dotenv';
dotenv.config({ path: process.env.ENV_FILE });

import express, { NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { DATA_DIR, images_dir, mdx_dir } from './utils/path_consts.js';
import { cors_middleware, JWTMiddleware } from './endpoint_logic/middleware.js';
import multer from 'multer';
import Anthropic from '@anthropic-ai/sdk';

export const app = express();

export const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
export const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

app.use(express.json());
app.use(cookieParser());
app.use(cors_middleware);

export const protectedRouter = express.Router();
protectedRouter.use(JWTMiddleware);

app.use('/secure', protectedRouter);

app.use(`/CMS/articles/`, express.static(path.join(DATA_DIR, 'CMS', 'articles')));
app.use('/TAG_SVGS/', express.static(path.join(DATA_DIR, 'TAG_SVGS')));
app.use('/images/', express.static(images_dir, {maxAge: '1d'}));
app.use('/mdx/', express.static(mdx_dir, {maxAge: '1d'}));
