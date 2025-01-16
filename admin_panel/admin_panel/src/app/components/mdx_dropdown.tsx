'use client'
import { useEffect, useState } from "react";
import { db_mdx } from "../../../api/interfaces/mdx_interfaces";
import { get_all_mdx } from "../../../api/mdx";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className?: string;
    selected?: string;
    on_select: (a:db_mdx)=>void;
}

export default function MDXDropdown({ className, on_select, selected="" }: props) {

const [all_mdx, set_all_mdx] = useState<db_mdx[]>([]);
const [loading, set_loading] = useState<Boolean>(false);
const [error_message, set_error_message] = useState<string|null>(null);
const [open, set_open] = useState<Boolean>(false);

useEffect(()=>{
    const fetch_images = async () => {
        set_loading(true)
        get_all_mdx(
            (res: db_mdx[])=>{
                set_error_message(null)
                set_all_mdx(res)
                set_loading(false)
            },
            (res: string)=>{
                set_all_mdx([])
                set_loading(false)
                set_error_message(res)
            }
        )
        
    }

    fetch_images()

}, [open])

const get_dropdown_contents = () => {
    if (!loading) {
        return(
            <div className="overflow-y-scroll mt-2 space-y-2 min-h-80 max-h-full scrollbar-none">
                {all_mdx.map((val, index)=> {
                    return(
                        <div 
                        key={val._id}
                        className={`bg-neutral-700 p-2 rounded-lg ${selected==val._id ? "opacity-30 border-2 border-dashed border-green-500" : ""}`}
                        onClick={()=>{
                            on_select(val)
                            set_open(false)
                            }}>
                            <p className="font-bold"><span className="text-sm">{index+1}</span>. {`${val.title}`}</p>
                            <p className="line-clamp-3 text-sm opacity-60">{val.snippet}</p>
                            <div className="h-10 flex space-x-1 mt-2">
                                {val.images.map((val)=>{
                                    return(
                                        <img key={val._id} className="rounded-lg" src={val.full_url}/>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
    if (loading) {
        return(
            <div className="">
                loading
            </div>
        )
    }
}

return (
	<div className={`${className}`}>
        <span className="text-gray-400 text-xs">{"Select an MDX from the dropdown"}</span>
        {error_message && <p>{error_message}</p>}
        <div className={`bg-neutral-800 px-4 py-2 cursor-pointer flex space-x-4 rounded-lg justify-center w-full`}
            onClick={()=>{set_open(!open)}}>{open ? "close": "open"}
        </div>
        
        {open && get_dropdown_contents()}

	</div>
);
}
