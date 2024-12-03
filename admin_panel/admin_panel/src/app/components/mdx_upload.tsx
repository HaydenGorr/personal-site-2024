import React, { useState, useRef, useEffect } from 'react';
import { upload_mdx } from '../../../api/mdx';
import { mdx } from '../../../api/api_interfaces';
import MDX_File_Uploader from './mdx/mdx_file_upload';
import MDX_Typer from './mdx/MDX_Typer';

interface props {
    className?: string;
    mdx_url: string|null;
    onMDXUpload: (new_url: string|null) => void;
}

enum mdx_state {
    empty,
    editing,
    uploaded,
}

export default function MDXUpload({ className, mdx_url, onMDXUpload }:props) {
const mdx_content_backup = useRef<string>("")
const [MDX_master_Text, set_MDX_master_Text] = useState<string>("");

const [error_message, set_error_message] = useState<string>("");
const [current_mdx_state, set_current_mdx_state] = useState<mdx_state>(mdx_state.empty);
const [loading, set_loading] = useState<Boolean>(false);


const is_editing_existing_file = useRef<Boolean>(false); // A backup from what 



const start_upload_new_mdx = () => {
    if (MDX_master_Text == "") {
        set_error_message("You have not loaded an image")
        return
    }
    
    upload_mdx(
        MDX_master_Text as string,
        (newMDX: mdx)=>{
            set_error_message("")
            onMDXUpload(newMDX.full_url)
        },
        (error_message: string)=>{
            set_error_message(error_message)
        }
    )
}

const start_update_mdx = () => {
    if (MDX_master_Text == "") {
        set_error_message("You have not loaded an image")
        return
    }
}

const initialise_from_given_url = async (inurl: string) => {

    is_editing_existing_file.current = true

    try {
        const response = await fetch(inurl as string)
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

        set_MDX_master_Text(content)

        mdx_content_backup.current = content
    }
    catch(error){
        set_error_message(`${error}`)
    }
    finally{
        set_loading(false)
    }
}

useEffect(() => {
    if (mdx_url == null){
        return
    }
    
    set_loading(true)

    initialise_from_given_url(mdx_url);
}, [mdx_url]);

return (
    <div className={`w-full ${className}`}>

        <div className='flex justify-between'>
            <span className="text-base text-neutral-400">{"MDX File"}</span>
            <div>current_mdx_state</div>
        </div>
        
        <p className='text-red-600'>{error_message}</p>

        {!loading && <MDX_Typer
        className='mb-4'
        mdx_text={MDX_master_Text}
        set_text={(inStr: string)=>{set_MDX_master_Text(inStr)}}

        append_text={(append_callback)=>{ set_MDX_master_Text((prev) => {
            return append_callback(prev)
        }) }}
        
        />}

        {MDX_master_Text != mdx_content_backup.current && <div className='w-full flex justify-between px-4 mb-4'>
            <button 
                className='px-2 py-1 bg-green-600 hover:bg-green-700 rounded-lg'
                onClick={()=>start_upload_new_mdx()}>Upload as new article</button>
            { is_editing_existing_file && <button className='px-2 py-1 bg-green-600 hover:bg-green-700 rounded-lg'>Update current article</button>}
        </div>}

        <MDX_File_Uploader
        mdx_text={MDX_master_Text}
        set_text={(inStr: string)=>{set_MDX_master_Text(inStr)}}/>

    </div>
);
};