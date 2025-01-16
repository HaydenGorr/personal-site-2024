import React, { useRef, ChangeEvent, useState } from 'react';
import { Upload } from 'lucide-react';
import { api_return_schema } from '../../../../api/interfaces/misc_interfaces';

const acceptedTypes = ['text/mdx', 'text/markdown', 'text/plain'];

interface props {
    className?: string;
    mdx_text: string;
    set_text: (s: string) => void;
}

export default function MDX_File_Uploader({ className, mdx_text, set_text }:props) {

    const [error_message, set_error_message] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const maxSizeBytes = 50;
    const maxSizeBits = maxSizeBytes*8e+6;

    const validateFile = (file: File): boolean => {
        set_error_message("");
    
        if (!acceptedTypes.includes(file.type)) {
            set_error_message(`Invalid file type. Please upload ${acceptedTypes.join(', ')}`);
            return false;
        }
    
        if (file.size > maxSizeBits) {
            set_error_message(`File size must be less than 50MB`);
            return false;
        }
    
        return true;
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };
    
    const handleFile = async (file: File) => {
        if (validateFile(file)) {
            const result = await read_MDX_file(file)

            if (result.error.has_error){
                set_error_message(result.error.error_message)
                return
            }
    
            set_text(result.data)
        }
    };

    const read_MDX_file = async (file: File): Promise<api_return_schema<string>> => {
        const readFileContent = (): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                
                reader.onload = (event) => {
                    const content = event.target?.result
                    if (typeof content === 'string') {
                        resolve(content)
                    } else {
                        reject(new Error('Failed to read file as string'))
                    }
                }
                
                reader.onerror = () => {
                    reject(new Error('Error reading file'))
                }
                
                reader.readAsText(file)
            })
        }
    
        try {
            const mdxContent = await readFileContent()
            console.log('MDX content:', mdxContent)
            return {data: mdxContent, error: {has_error:false, error_message:""}}
        } catch (error) {
            console.error('Error reading MDX file:', error)
            return {data: "", error: {has_error:false, error_message:`Error reading MDX file: ${error}`}}
        }
    }

return (
    <div>
        <p className='text-red-600 text-sm'>{error_message}</p>

        <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}>

        <input type="file" ref={fileInputRef} className="hidden" accept={acceptedTypes.join(',')} onChange={handleChange}/>

        <div className="space-y-2">
            <Upload className="mx-auto text-gray-400" size={32} />
            <div className="text-sm text-gray-500">
                Drop your image here or click to browse
            </div>
            <div className="text-xs text-gray-400">
                Accepted types: {acceptedTypes.join(', ')}
                <br />
                Max size: 50MB
            </div>
        </div>
    </div>
    
    </div>
    
);
};