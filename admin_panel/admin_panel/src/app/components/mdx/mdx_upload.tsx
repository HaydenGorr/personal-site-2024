import React, { useState, useRef, useEffect } from 'react';
import { upload_mdx, update_mdx } from '../../../../api/mdx';
import { mdx } from '../../../../api/api_interfaces';
import MDX_File_Uploader from './mdx_file_upload';
import MDX_Typer from './MDX_Typer';

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

const [force_mdx_editor_refresh, toggle_force_mdx_editor_refresh] = useState<Boolean>(false);
const force_mdx_refresh = () => toggle_force_mdx_editor_refresh(!force_mdx_editor_refresh)

const is_editing_existing_file = useRef<Boolean>(false); // A backup from what 

const get_coloured_note = () => {
    var colour: string;
    var text: string;

    switch(current_mdx_state){
        case mdx_state.editing:
            colour = "bg-yellow-500"
            text = "edited"
            break
        case mdx_state.uploaded:
            colour = "bg-green-300"
            text = "uploaded"
            break
        case mdx_state.empty:
            colour = "bg-white/70"
            text = "empty"
            break
        default:
            colour = "bg-blue-500"
            text = "empty"
    }

    return (<div className={`px-2 py-1 rounded-lg text-xs text-black ${colour}`}>{text}</div>)
}

const start_upload_new_mdx = () => {
    if (MDX_master_Text == "") {
        set_error_message("You have not loaded an image")
        return
    }

    set_error_message("")
    
    upload_mdx(
        MDX_master_Text as string,
        (newMDX: mdx)=>{
            set_error_message("")
            onMDXUpload(newMDX.full_url)
            force_mdx_refresh()
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

    set_error_message("")

    if (!mdx_url) return

    try {
        const filename = mdx_url.split('/').pop();
        
        update_mdx(
            MDX_master_Text as string,
            filename!,
            (newMDX: mdx)=>{
                set_error_message("")
                onMDXUpload(newMDX.full_url)
                initialise_from_given_url(mdx_url)
            },
            (error_message: string)=>{
                set_error_message(error_message)
            }
        )
    }
    catch {
        set_error_message("Error parsing the url")
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

        set_current_mdx_state(mdx_state.uploaded)
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

useEffect(() => {
    if (MDX_master_Text.length === 0) {
        set_current_mdx_state(mdx_state.empty)
        return
    }
    if (MDX_master_Text != mdx_content_backup.current) {
        set_current_mdx_state(mdx_state.editing)
        return
    }
    if (MDX_master_Text == mdx_content_backup.current) {
        console.log("original")
        set_current_mdx_state(mdx_state.uploaded)
        return
    }

}, [MDX_master_Text]);

return (
    <div className={`w-full ${className}`}>

        <div className='flex justify-between mb-2 items-center'>
            <span className="text-base text-neutral-400">{"MDX File"}</span>
            {get_coloured_note()}
        </div>
        
        <p className='text-red-600'>{error_message}</p>

        {!loading && <MDX_Typer
        className='mb-4'
        mdx_text={MDX_master_Text}
        set_text={(inStr: string)=>{set_MDX_master_Text(inStr)}}
        append_text={(append_callback)=>{ set_MDX_master_Text((prev) => {
            return append_callback(prev)
        }) }}
        refresh={force_mdx_editor_refresh}
        />}

        {MDX_master_Text != mdx_content_backup.current && <div className='w-full flex justify-between px-4 mb-4'>
            <button 
                className='px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg'
                onClick={()=>{
                    set_MDX_master_Text(mdx_content_backup.current)
                    force_mdx_refresh()
                    }}>reset</button>
            <button 
                className='px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg'
                onClick={()=>{
                    set_MDX_master_Text("")
                    force_mdx_refresh()
                    }}>clear</button>
            
            <button 
                className='px-2 py-1 bg-green-600 hover:bg-green-700 rounded-lg'
                onClick={()=>start_upload_new_mdx()}>New file</button>
            <button 
                className='px-2 py-1 bg-green-600 hover:bg-green-700 rounded-lg'
                onClick={()=>start_update_mdx()}>Update file</button>
        </div>}

        <MDX_File_Uploader
            mdx_text={MDX_master_Text}
            set_text={(inStr: string)=>{set_MDX_master_Text(inStr)}}/>

    </div>
);
};