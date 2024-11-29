import { images_dir, mdx_dir } from './path_consts';
import { randomBytes } from 'crypto';
import { mkdir, writeFile, access } from 'fs/promises';
import path from 'path';
import { api_return_schema, file_on_drive, mdx_on_drive } from '../interfaces/interfaces';

interface SaveFileOptions {
    allowedTypes?: string[];
    maxSizeBytes?: number;
    baseDir?: string;
}

export async function SaveFileToRandomDir(
    file: Express.Multer.File, 
    options: SaveFileOptions = {}
): Promise<api_return_schema<file_on_drive|null>> {
    const {
        allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'],
        maxSizeBytes = 50 * 1024 * 1024, // 5MB default
        baseDir = path.join(images_dir)
    } = options;

    try {
        // Validate file type
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('Invalid file type');
        }

        // Validate file size
        if (file.size > maxSizeBytes) {
            throw new Error('File too large');
        }

        await access(baseDir);

        // Get file extension and create filename
        const fileExt = path.extname(file.originalname) || 
                       `.${file.mimetype.split('/')[1]}`;
        const fileName = `${randomBytes(4).toString('hex')}${fileExt}`;
        const filePath = path.join(baseDir, fileName);

        // Write the file
        await writeFile(filePath, file.buffer);

        // Construct and return the URL
        // const fileUrl = `images/${randomDirName}/${fileName}${fileExt}`;
        const fileUrl:file_on_drive = {file_name:fileName, full_url: new URL(`images/${fileName}`, process.env.HOST_URL).toString()};
        
        return {data: fileUrl, error: {has_error: false, error_message: ""}};

    } catch (error) {
        return {data: null, error: {has_error: true, error_message: 'Error saving file:'}};
    }
}

export async function SaveStringToRandomDir(
    text: string, 
    options: SaveFileOptions = {}
): Promise<api_return_schema<file_on_drive|null>> {
    const {
        allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'],
        maxSizeBytes = 50 * 1024 * 1024, // 5MB default
        baseDir = path.join(mdx_dir)
    } = options;

    try {

        await access(baseDir);

        // Get file extension and create filename
        const fileExt = '.mdx';
        const fileName = `${randomBytes(4).toString('hex')}${fileExt}`;
        const filePath = path.join(baseDir, fileName);

        // Write the file
        await writeFile(filePath, text, 'utf8');

        // Construct and return the URL
        // const fileUrl = `images/${randomDirName}/${fileName}${fileExt}`;
        const fileUrl:file_on_drive = {file_name:fileName, full_url: new URL(`mdx/${fileName}`, process.env.HOST_URL).toString()};
        
        return {data: fileUrl, error: {has_error: false, error_message: ""}};

    } catch (error) {
        return {data: null, error: {has_error: true, error_message: 'Error saving file:'}};
    }
}