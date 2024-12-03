import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { get_all_images } from '../../../../api/image';
import { Upload, X } from 'lucide-react';
import { Url } from 'next/dist/shared/lib/router/router';
import { upload_mdx } from '../../../../api/mdx';
import { api_return_schema, mdx, image_type_enum, image } from '../../../../api/api_interfaces';
import {
    MDXEditor,
    imagePlugin,
    toolbarPlugin,
    InsertImage,
    UndoRedo,
    BoldItalicUnderlineToggles,
    BlockTypeSelect,
    markdownShortcutPlugin,
    directivesPlugin,
    headingsPlugin,
    listsPlugin,
    thematicBreakPlugin,
    tablePlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import MDXImageDropdown from './MDX_image_dropdown';
import ImageDropdown from '../image_dropdown';

interface props {
    className?: string;
    mdx_text?: string;
    set_text: (s: string) => void;
    append_text: (callback: (prevText: string) => string) => void;
    refresh: Boolean
}

export default function MDX_Typer({ className, mdx_text, set_text, append_text, refresh }:props) {
const [editorKey, setEditorKey] = useState<number>(0);
const [error_message, set_error_message] = useState<string>("");

/**
 * The MDX editor component isn't self refreshing. It doesn't
 * respond to changes in state vars so we need to force a refresh
 */
const refresh_MDX = () => setEditorKey((prevKey) => prevKey + 1);

const add_image_to_text = (selected_image_url: string) =>{
    append_text((prev:string) => {
        return `${prev}\n<img src="${selected_image_url}" />`
    })
    refresh_MDX()
}

const handleImageInsert = () => {
    return new Promise<string>((resolve, reject) => {
        const selectedImage = window.prompt('Enter image URL or select one from the list:');
        if (selectedImage) {
            resolve(selectedImage);
        } else {
            reject('No image selected');
        }
    });
}; 

useEffect(()=>{
    refresh_MDX()
}, [refresh])

return (
    <div className={`w-full ${className}`}>
        <p className='text-red-600'>{error_message}</p>
        <MDXEditor
            key={editorKey}
            className="h-[40rem] w-full overflow-auto dark-theme dark-editor"
            markdown={mdx_text}
            onChange={(e: string) => set_text(e)} // Ensure state updates are handled
            plugins={[
                markdownShortcutPlugin(),
                directivesPlugin(),
                headingsPlugin(),
                listsPlugin(),
                thematicBreakPlugin(),
                tablePlugin(),
                imagePlugin({
                    imageUploadHandler: handleImageInsert, // Use the custom image handler
                }),
                toolbarPlugin({
                    toolbarContents: () => (
                        <>
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                            <InsertImage />
                            <BlockTypeSelect />
                        </>
                    ),
                }),
            ]}
        />
        <ImageDropdown 
            className='mt-4'
            image_type={image_type_enum.in_article}
            on_select={(selected_image_url: string)=>{
                add_image_to_text(selected_image_url)
                // set_MDXText((prev) => `${prev}\n<img src="${selected_image_url}" />`);
                refresh_MDX()
            }}/>

    </div>
);
};