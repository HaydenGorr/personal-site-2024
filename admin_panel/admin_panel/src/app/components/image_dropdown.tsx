'use client'
import { useEffect, useState, useRef } from "react";
import { article, category, image, chip, api_return_schema, image_type_enum } from "../../../api/api_interfaces";
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
    on_select: (a:string)=>void;
}

export default function ImageDropdown({ className, on_select }: props) {

const [all_images, set_all_images] = useState<image[]>([]);
const [loading, set_loading] = useState<Boolean>(false);
const [error_message, set_error_message] = useState<string|null>(null);
const [open, set_open] = useState<Boolean>(false);

useEffect(()=>{
    const fetch_images = async () => {
        set_loading(true)
        get_all_images(
            (res: image[])=>{
                set_error_message(null)
                set_all_images(res)
                set_loading(false)
            },
            (res: string)=>{
                set_all_images([])
                set_loading(false)
                set_error_message(res)
            },
            image_type_enum.container
        )
        
    }

    fetch_images()

}, [open])

const get_dropdown_contents = () => {
    if (!loading) {
        return(
            <div className="max-h-96 overflow-y-scroll grid grid-cols-3 rounded-lg mt-2">
                {all_images.map((val, index)=> {
                    return(
                        <div key={index} className={`${index%2==0 ? 'bg-neutral-600': 'bg-neutral-500'} p-2 hover:bg-neutral-700 cursor-pointer flex justify-center items-center`}
                        onClick={()=>{on_select(val.full_url); set_open(false)}}>
                            <Image
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
        <span className="text-base text-gray-400">{"Select an image from the dropdown"}</span>
        {error_message && <p>{error_message}</p>}
        <div className={`bg-neutral-800 px-4 py-2 cursor-pointer flex space-x-4 rounded-lg justify-center w-full`}
            onClick={()=>{set_open(!open)}}>{open? "close": "open"}
        </div>
        
        {open && get_dropdown_contents()}

	</div>
);
}
