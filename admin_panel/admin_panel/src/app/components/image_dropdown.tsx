'use client'
import { useEffect, useState } from "react";
import { db_image } from "../../../api/interfaces/image_interfaces";
import { image_type_enum } from "../../../api/interfaces/enums";
import { get_all_images } from "../../../api/image";
import Image from "next/image";
import path from "path";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className?: string;
    on_select: (a:db_image)=>void;
    image_type: image_type_enum;
    selected?: string;
}

export default function ImageDropdown({ className, on_select, image_type, selected }: props) {

const [all_images, set_all_images] = useState<db_image[]>([]);
const [loading, set_loading] = useState<Boolean>(false);
const [error_message, set_error_message] = useState<string|null>(null);
const [open, set_open] = useState<Boolean>(false);

useEffect(()=>{
    const fetch_images = async () => {
        set_loading(true)
        get_all_images(
            (res: db_image[])=>{
                set_error_message(null)
                set_all_images(res)
                set_loading(false)
            },
            (res: string)=>{
                set_all_images([])
                set_loading(false)
                set_error_message(res)
            },
            image_type
        )
        
    }

    fetch_images()

}, [open])

const get_dropdown_contents = () => {
    if (!loading) {
        return(
            <div className="max-h-96 overflow-y-scroll grid grid-cols-3 mt-2 scrollbar-none">
                {all_images.map((val, index)=> {
                    return(<div key={val._id} className={`${selected==val._id ? "opacity-30 border-2 border-dashed border-green-500" : ""} ${index%2==0 ? 'bg-neutral-600': 'bg-neutral-500'} p-2 hover:bg-neutral-700 cursor-pointer flex rounded-lg justify-center items-center`}
                        onClick={()=>{on_select(val); set_open(false)}}>
                            <img
                                className={"h-fit w-auto rounded-lg"}
                                width={150} height={150}
                                alt=""
                                src={val.full_url}/>
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
        <span className="text-xs text-gray-400">{"Select an image from the dropdown"}</span>
        {error_message && <p>{error_message}</p>}
        <div className={`bg-neutral-800 px-4 py-2 cursor-pointer flex space-x-4 rounded-lg justify-center w-full`}
            onClick={()=>{set_open(!open)}}>{open? "close": "open"}
        </div>
        
        {open && get_dropdown_contents()}

	</div>
);
}
