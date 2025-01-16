'use client'
import { useState, useEffect } from "react";
import { get_all_mdx } from "../../../api/mdx";
import { db_chip } from "../../../api/interfaces/chip_interfaces";
import { db_mdx } from "../../../api/interfaces/mdx_interfaces";
import { edit_states } from "../../../api/interfaces/enums";
import YesNoPopup from "../components/yesno_popup";
import { delete_mdx } from "../../../api/mdx";
import { useRouter } from 'next/navigation';

interface props {
    className: string;
}

export default function MDX({ className }: props) {
    const router = useRouter();

    const [item_to_delete, set_item_to_delete] = useState<db_mdx|null>(null);

    const [loading, set_loading] = useState<Boolean>(true);
    const [fetched_mdx, set_fetched_mdx] = useState<db_mdx[]>([]);
    const [fetch_error, set_fetch_error] = useState<Boolean>(false);
    const [fetch_error_msg, set_fetch_error_msg] = useState<string>("");
    const [error_message, set_error_message] = useState<string>("");
    const [mdx_edit_index, set_mdx_edit_index] = useState<number>(-1)
    const [edit_mdx, set_edit_mdx] = useState<edit_states>(edit_states.edit_none)

    const fetch_page_data = async () => {
        set_loading(true)

        await get_all_mdx(
            (res: db_mdx[]) => {
                set_fetched_mdx(res)
                set_fetch_error(false)
                set_fetch_error_msg("")
            },
            (error_message: string) => {
                set_fetched_mdx([])
                set_fetch_error(true)
                set_fetch_error_msg(error_message)
            }
        )
        
        set_loading(false)
    }

    const go_delete_mdx = async (chosen_mdx: db_mdx) => {

        if (!chosen_mdx._id) {console.log("cannot delete. No ID"); return;}

        await delete_mdx(
            () => {
                fetch_page_data()
            },
            (err: string) => {
                set_error_message(err)
            },
            chosen_mdx._id
        )
    }

    useEffect(()=>{
        fetch_page_data()
    }, [])

    const open_editor = async (url: string | null, _id: string | null, title: string | null) => {
        const editorUrl = url && _id && title
            ? `/mdx_editor?url=${encodeURIComponent(url)}&id=${_id}&title=${encodeURIComponent(title)}`
            : '/mdx_editor';
        await router.push(editorUrl);
    };

return (
	<div className={`${className} w-full`}>
        
        {/** THIS ISN'T FUNCTIONAL */}
        {item_to_delete && <YesNoPopup 
            isOpen={item_to_delete!=null}
            setIsOpen={()=>{set_item_to_delete(null)}}
            onConfirm={() => go_delete_mdx(item_to_delete)}
            styled_item={item_to_delete.title}
            message={`Are you sure you want to delete`}/>}

        {!loading && !fetch_error && <div className="space-y-4 w-full flex flex-col items-center">

            {error_message && <p className="text-red-600">{error_message}</p>}

            <div className="w-full flex justify-around">
                <button
                    className="bg-green-400 hover:bg-green-700 rounded-lg p-2 w-full"
                    onClick={()=>{ open_editor(null, null, null) }}>Create New MDX</button>
            </div>

            <div className="w-full space-y-4">

            {fetched_mdx.map((mdx_file: db_mdx) => {
                return(
                    <div key={mdx_file._id} className="flex space-x-4 w-full">
                        <button className="bg-purple-300 hover:bg-purple-400 rounded-lg px-2 text-neutral-900" onClick={()=>{open_editor(mdx_file.full_url, mdx_file._id, mdx_file.title)}}>edit</button>
                        <div className="flex w-full">
                            <div className={`relative bg-neutral-700 px-4 py-2 rounded-lg w-full overflow-hidden h-full`}>
                                <div className="flex justify-between">
                                    <p className="text-lg font-bold">{mdx_file.title}</p>
                                    <p className="text-sm opacity-60">{mdx_file.upload_date}</p>
                                </div>
                                <p className="mt-2">{mdx_file.snippet}</p>
                                <div className="flex h-16 space-x-2 mt-4">
                                    {mdx_file.images.map((image) => {
                                        return (
                                            <img key={image._id} className={"rounded-lg"} src={image.full_url}></img>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <button className="bg-red-500 hover:bg-red-700 rounded-lg px-2" onClick={() => {set_item_to_delete(mdx_file)}}>delete</button>

                    </div>
                )
            })}
            </div>

        </div>}

        {!loading && fetch_error &&
        <div>
            <p>{`error: ${fetch_error_msg}`}</p>
            <button 
            className="bg-green-400 hover:bg-green-700 rounded-full p-2 w-fit"
            onClick={() => {fetch_page_data()}}>try again</button>
        </div>
        }
	</div>
);
}
