import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { Url } from 'next/dist/shared/lib/router/router';
import { upload_mdx } from '../../../api/mdx';
import { api_return_schema, mdx } from '../../../api/api_interfaces';
import { MDXEditor, UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin, headingsPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import path from 'path';

interface props {
    className?: string;
    mdx_url: string|null;
    onMDXUpload: (new_url: string|null) => void;
}

export default function MDXUpload({ className, mdx_url, onMDXUpload }:props) {
const acceptedTypes = ['text/mdx', 'text/markdown', 'text/plain'];
const [error, setError] = useState<string | null>(null);
const fileInputRef = useRef<HTMLInputElement>(null);
const maxSizeBytes = 50;
const maxSizeBits = maxSizeBytes*8e+6;
const [MDXText, set_MDXText] = useState<string | null>(null);

const parent_mdx_backup = useRef<string|null>(null)

const start_upload_mdx = () => {
    if (MDXText == null) {
        setError("You have not loaded an image")
        return
    }

    console.log("LOKO", MDXText)

    upload_mdx(
        MDXText as string,
        (newMDX: mdx)=>{
            setError(null)
            onMDXUpload(newMDX.full_url)
        },
        (error_message: string)=>{
            setError(error_message)
        }
    )
}

useEffect(() => {

    const initialise_from_given_url = async (inurl: string) => {

        try {

            console.log("wtf", inurl)
            const response = await fetch(inurl)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const blob = await response.blob()
            const text = await new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsText(blob)
            })
    
            const content = text as string

            set_MDXText(content)

            parent_mdx_backup.current = content
        }
        catch(error){
            setError(`${error}`)
        }
    }

    if (mdx_url != null) {
        initialise_from_given_url(mdx_url);
    }
}, [mdx_url]);

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
        const result = await read_MDX(file)
        if (result.error.has_error){
            setError(result.error.error_message)
            return
        }

        set_MDXText(result.data)

        onMDXUpload(null) // Reset the MDX url in the parent

        // console.log("validated")
        // onMDXUpload(null) // Reset the MDX url in the parent
        // const local_url: string = URL.createObjectURL(file)
        // set_previewURL(local_url)
        // set_imagePreview(file)
    }
};

const read_MDX = async (file: File): Promise<api_return_schema<string>> => {
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

const removeMDX = () => {
    console.log("vic", parent_mdx_backup.current)
    set_MDXText(parent_mdx_backup.current);
    setError(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    onMDXUpload(parent_mdx_backup.current)
};


return (
    <div className={`w-full ${className}`}>
        <span className="text-base text-gray-400">{"MDX"}</span>
        
        {MDXText==null && <div
            className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
            ${error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'}`}
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
        </div>}

        {error && (
            <div className="mt-2 text-sm text-red-500">{error}</div>
        )}

        {MDXText!=null && <div>
            <button className='bg-blue-300 px-2 py-1 rounded-lg text-black mt-1' 
                    onClick={()=>{start_upload_mdx()}}>upload</button>

            <button className='bg-blue-300 px-2 py-1 rounded-lg text-black mt-1' 
                    onClick={()=>{removeMDX()}}>clear</button>
        </div>}


        <MDXEditor
            className="max-h-96 dark-theme dark-editor"
            markdown={MDXText || ""}
            onChange={(e: string)=>{set_MDXText(e)}}
            plugins={[
            toolbarPlugin({
                toolbarClassName: 'my-classname',
                toolbarContents: () => (
                <>
                    {' '}
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                </>
                )
            })
            ]}
        />

    </div>
);
};