import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { Url } from 'next/dist/shared/lib/router/router';
import { upload_image } from '../../../api/image';
import { image_type_enum } from '../../../api/api_interfaces';

interface props {
    className?: string;
    onImageUpload: (new_url: string|null) => void;
    image_url: string|null;
    category: image_type_enum;
}

export default function ImageUpload({ className, onImageUpload, image_url, category }:props) {
const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'];
// const [preview, setPreview] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);
const fileInputRef = useRef<HTMLInputElement>(null);
const maxSizeBytes = 50;
const maxSizeBits = maxSizeBytes*8e+6;
const [imagePreview, set_imagePreview] = useState<File | null>(null);
const [previewURL, set_previewURL] = useState<string | null>(null);

const start_upload_image = () => {

    if (previewURL == null) {
        setError("You have not loaded an image")
        return
    }

    upload_image(
        imagePreview as File,
        (newpath: string)=>{
            setError(null)
            onImageUpload(newpath)
        },
        (error_message: string)=>{
            setError(error_message)
        },
        category
    )

}

useEffect(() => {
    if (image_url != null) {
        set_previewURL(image_url);
        set_imagePreview(null)
    }
}, [image_url]);

const validateFile = (file: File): boolean => {
    setError(null);

    if (!acceptedTypes.includes(file.type)) {
        setError(`Invalid file type. Please upload ${acceptedTypes.join(', ')}`);
        return false;
    }

    if (file.size > maxSizeBits) {
        setError(`File size must be less than 50MB`);
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
        console.log("validated")
        onImageUpload(null)
        const local_url: string = URL.createObjectURL(file)
        set_previewURL(local_url)
        set_imagePreview(file)
    }
};

const removeImage = () => {
    set_imagePreview(null);
    setError(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    onImageUpload(null)
    set_previewURL(null)
};

const get_saved_element = () => {
    const is_unsaved = image_url != previewURL
    const text = is_unsaved ? "unsaved" : "uploaded"

    return(<div className={`${is_unsaved ? "bg-yellow-200" : "bg-green-300"} text-neutral-800 px-2 py-1 rounded-lg text-xs w-fit`}>{text}</div>)
}

return (
    <div className={`w-full ${className}`}>
        <div className='flex justify-between items-center mb-1 h-7'>
            <span className="text-base text-gray-400">{"Image"}</span>
            {get_saved_element()}
        </div>
        
        <div
            className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
            ${error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'}`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
        >
        <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={acceptedTypes.join(',')}
            onChange={handleChange}
        />

        {previewURL ? (
        <div className="relative inline-block">
            <img
                src={new URL(previewURL).toString()}
                alt="Preview"
                className="max-w-full h-auto max-h-64 rounded"
            />
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-40"
                >
                <X size={16} />
            </button>
        </div>
        ) : (
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
        )}
    </div>

        { imagePreview && <button
            className='bg-blue-300 px-2 py-1 rounded-full text-black mt-1' 
            onClick={()=>{start_upload_image()}}>upload</button>}

        {error && (
            <div className="mt-2 text-sm text-red-500">{error}</div>
        )}

    </div>
);
};