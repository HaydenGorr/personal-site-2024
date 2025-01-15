'use client'
import { useEffect, useState, useRef } from "react";
import { image_type_enum, edit_states } from "../../../api/interfaces/enums";
import '@mdxeditor/editor/style.css'
import dynamic from 'next/dynamic'
import { type MDXEditorMethods } from "@mdxeditor/editor";
import { useRouter, useSearchParams } from 'next/navigation'
import MDXImageDropdown from "../components/mdx/MDX_image_dropdown";
import { update_mdx, upload_mdx, select_mdx } from "../../../api/mdx";
import { db_mdx } from "../../../api/interfaces/mdx_interfaces";

const Editor = dynamic(() => import('../tabs/components/mdx/InitialisedMDXEditor'), { ssr: false })

export default function MDX_In_Progress() {
    // Get props from search params
    const searchParams = useSearchParams();

    const [url, set_url] = useState<string>(searchParams.get('url') as string || "");
    const [_id, set__id] = useState<string>(searchParams.get('id') as string || "");
    const [title, set_title] = useState<string>(searchParams.get('title') as string || "") // This is what we edit in the text editor
    const [title_backup, set_title_backup] = useState<string>(searchParams.get('title') as string) // This is what we edit in the text editor

    const router = useRouter();

    const [show_message, set_show_message] = useState<{[key:number]: string}>({});

    const [mdx_text, set_mdx_text] = useState<string>("") // This is what we edit in the text editor
    const [mdx_text_backup, set_mdx_text_backup] = useState<string>("") // this is what we reset to if we cancel

    const [loading, set_loading] = useState<boolean>(true) // This is what we edit in the text editor
    const [error_message, set_error_message] = useState<string>("") // This is what we edit in the text editor
    const [mdx_differs, set_mdx_differs] = useState<boolean>(false) // This is what we edit in the text editor
    const [edit_state, set_edit_state] = useState<edit_states>(url ? edit_states.edit_existing : edit_states.create_new);  // Initialize state

    const editorRef = useRef<MDXEditorMethods | null>(null)

    // If we've got a url, we're editing an existing file
    // So we fetch it here
    useEffect(()=>{
        const fetch_mdx = async () => {

            select_mdx(
                (db_obj: db_mdx[])=>{
                    set_title(db_obj[0].title)
                    set_title_backup(db_obj[0].title)
                    set_error_message("")
                },
                (err: string)=>{
                    set_error_message(err)
                },
                {_id: _id})

            const text_result: string = await fetch_mdx_file_text(url)
            console.log("text_result", text_result)
            set_mdx_text(text_result);
            set_mdx_text_backup(text_result);
            set_loading(false)
        }
        
        set_loading(true)

        if (url) {
            fetch_mdx()
        }
        else {
            set_loading(false)
        }
        

    }, [url])

    /**
     * track if the text differs from the original we use this
     * to enable to disable the submit button
     */
    useEffect(()=>{
        if (mdx_text != mdx_text_backup || title != title_backup){
            set_mdx_differs(true)
        }
        else {
            set_mdx_differs(false)
        }

    }, [mdx_text, title])

    const go_back = () => {
        router.push('/admin')
    }

    // Runs this once on Mount
    const fetch_mdx_file_text = async (inurl: string): Promise<string> => {
        set_error_message("")
        
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

            return text as string
        }
        catch(error){
            set_error_message(`${error}`)
        }

        return ""
    }

    const submit_changes = () => {
        if (!mdx_differs) return

        if (edit_state == edit_states.create_new){
            upload_mdx(
                mdx_text,
                title,
                (newMDX: db_mdx)=>{
                    set_error_message("")
                    set_url(newMDX.full_url)
                    set__id(newMDX._id)
                    set_title_backup(newMDX.title)
                    set_title(newMDX.title)
                    set_edit_state(edit_states.edit_existing)
                },
                (error_message: string)=>{
                    set_error_message(error_message)
                }
            )
        }

        else if (edit_state == edit_states.edit_existing){
            update_mdx(
                _id,
                mdx_text,
                title,
                (newMDX: db_mdx)=>{
                    set_error_message("")
                    set_url(newMDX.full_url)
                    set__id(newMDX._id)
                    set_edit_state(edit_states.edit_existing)
                },
                (error_message: string)=>{
                    set_error_message(error_message)
                }
            )
        }

    }

    const get_title = () => {
        if (loading) return "Loading..."
        switch(edit_state){
            case edit_states.create_new:
                return "New MDX"
            case edit_states.edit_existing:
                return "Edit MDX"
            default:
                return "Error"
        }
    }

    const get_status_style = () => {
        if (mdx_differs){
            return "bg-blue-900 text-blue-200 hover:bg-blue-800"
        }
        else {
            return "bg-green-900 text-green-200 hover:bg-green"
        }
    }

return (
    <div className={`px-4 h-screen w-screen py-8 flex flex-col items-center`} >

        {/* The temporary messages */}
        <div className="fixed z-50 bottom-4 right-4 space-y-4">
        {Object.entries(show_message).map(([key, value]) => {
            return(
                <div className={" bg-green-300 py-2 px-4 rounded-xl text-green-950"} key={key}>
                    {value}
                </div>
            )
        })}
        </div>

        {/* 
            HEADER
            includes: title, status, close button
        */}
        <div className="flex justify-around w-full">
            <div className={`rounded-lg font-bold px-2 py-1 flex items-center ${get_status_style()}`}>{`${mdx_differs ? "edited" : "unedited"}`}</div>
            <h1 className="font-bold text-3xl">{get_title()}</h1>
            <button className="rounded-lg bg-neutral-900 text-white font-bold px-2 py-1 hover:bg-neutral-800" onClick={()=>{go_back()}}>{"close"}</button>
        </div>

        {/* Submit Button */}
        <button 
        className={`mt-8 px-2 py-1 rounded-xl ${mdx_differs ? 'bg-blue-500 hover:bg-blue-800' : 'bg-green-700 opacity-20'}`}
        disabled={!mdx_differs}
        onClick={()=>{submit_changes()}}>submit</button>

        {error_message != "" && <p className="bg-red-500 px-2 py-1 rounded-xl my-4">{`error: ${error_message}`}</p>}

        <div className="my-8 w-full max-w-3xl">
            <p>title</p>
            <input
                type="text"
                value={title}
                onChange={(e) => set_title(e.target.value)}
                className="border-2 border-gray-300 rounded-lg p-1 text-black w-full"
            />
        </div>

        {!loading && <Editor
            markdown={mdx_text_backup}
            unedited_original_text={mdx_text_backup}
            onChange={(string)=>{ set_mdx_text(string)}}
            editorRef={editorRef}
        />}

        {!loading && <MDXImageDropdown
        className={"mt-8 max-w-3xl w-full"}
        on_select={(src)=>{

            try {
                navigator.clipboard.writeText(src)

                const newkey = Object.values(show_message).length; 
                set_show_message((prev) => {
                  return { ...prev, [newkey]: "Url copied to clipboard" };
                });
                
                setTimeout(() => {
                    set_show_message((prev) => {
                      const { [newkey]: _, ...rest } = prev;
                      return rest;
                    });
                  }, 3000);
            }
            catch(error){
                const newkey = 3; 
                set_show_message((prev) => {
                  return { ...prev, [newkey]: "Failed to copy to clipboard" };
                });
                
                setTimeout(() => {
                    set_show_message((prev) => {
                      const { [newkey]: _, ...rest } = prev;
                      return rest;
                    });
                  }, 3000);
            }

        }}
        image_type={image_type_enum.in_article}/>}
            
    </div>
);
}
