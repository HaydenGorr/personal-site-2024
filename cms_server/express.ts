import dotenv from 'dotenv';
dotenv.config({ path: process.env.ENV_FILE });

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { DATA_DIR } from './utils/path_consts';
import { cors_middleware, JWTMiddleware } from './endpoint_logic/middleware';
import multer from 'multer';

export const app = express();

export const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

app.use(express.json());
app.use(cookieParser());
app.use(cors_middleware);

export const protectedRouter = express.Router();
protectedRouter.use(JWTMiddleware);

app.use('/secure', protectedRouter);

app.use(`/CMS/articles/`, express.static(path.join(DATA_DIR, 'CMS', 'articles')));
app.use('/TAG_SVGS/', express.static(path.join(DATA_DIR, 'TAG_SVGS')));
app.use('/image/', express.static(path.join(DATA_DIR, 'image')));