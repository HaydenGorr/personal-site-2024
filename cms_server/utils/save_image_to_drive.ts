import { images_dir } from './path_consts';
import { randomBytes } from 'crypto';
import { mkdir, writeFile, access } from 'fs/promises';
import path from 'path';
import { api_return_schema } from '../interfaces/interfaces';

interface SaveFileOptions {
    allowedTypes?: string[];
    maxSizeBytes?: number;
    baseDir?: string;
}

export async function SaveFileToRandomDir(
    file: Express.Multer.File, 
    options: SaveFileOptions = {}
): Promise<api_return_schema<string|null>> {
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

        // Generate random directory name
        let randomDirName: string;
        let dirPath: string;
        let attempts = 0;
        const maxAttempts = 10;

        // Keep trying until we find a unique directory name
        do {
            randomDirName = randomBytes(4).toString('hex');
            dirPath = path.join(baseDir, randomDirName);
            attempts++;

            try {
                await access(dirPath);
                // If we get here, the directory exists
            } catch {
                // Directory doesn't exist, we can use this name
                break;
            }
        } while (attempts < maxAttempts);

        if (attempts >= maxAttempts) {
            throw new Error('Failed to create unique directory');
        }

        // Create the directory
        await mkdir(dirPath, { recursive: true });

        // Get file extension and create filename
        const fileExt = path.extname(file.originalname) || 
                       `.${file.mimetype.split('/')[1]}`;
        const fileName = `${randomBytes(4).toString('hex')}${fileExt}`;
        const filePath = path.join(dirPath, fileName);

        // Write the file
        await writeFile(filePath, file.buffer);

        // Construct and return the URL
        const fileUrl = `${process.env.ADMIN_ROUTE}/cms/images/${randomDirName}/${fileName}${fileExt}`;
        return {data: fileUrl, error: {has_error: false, error_message: ""}};

    } catch (error) {
        return {data: null, error: {has_error: true, error_message: 'Error saving file:'}};
    }
}

// Usage example:
/*
const baseUrl = 'https://yourdomain.com/';
try {
    const fileUrl = await saveFileToRandomDir(uploadedFile, baseUrl, {
        allowedTypes: ['image/jpeg', 'image/png'],
        maxSizeBytes: 2 * 1024 * 1024, // 2MB
        baseDir: '/custom/path/to/uploads'
    });
    console.log('File saved at:', fileUrl);
} catch (error) {
    console.error('Failed to save file:', error);
}
*/
