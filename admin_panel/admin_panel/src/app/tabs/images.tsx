'use client'
import { useState, useEffect } from "react";
import { get_all_categories, delete_category } from "../../../api/categories";
import { api_return_schema, category } from "../../../api/api_interfaces";
import CategoryContainer from "./components/categories/category_container";
import CategoryInProgress from "./components/categories/category_inprogress";
import Image from "next/image";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className: string;
}

export default function Images({ className }: props) {

    const [images, set_images] = useState<any>(["qwe", "asd", "zxc"]);
    const [loading, set_loading] = useState<Boolean>(false);

    const fetch_page_data = async () => {
        set_loading(true)

        await get_all_categories(
            (res: api_return_schema<category[]>) => {
                // set_categories(res.data as category[])
                // set_fetch_error(false)
                // set_fetch_error_msg("")
            },
            (res: api_return_schema<category[]>) => {
                // set_categories([])
                // set_fetch_error(res.error.has_error)
                // set_fetch_error_msg(res.error.error_message)
            }
        )
        
        set_loading(false)
    }

return (
	<div className={`${className} flex flex-col items-center max-w-prose w-full`}>
        <div className="space-y-4 w-full">
            {images.map((val: string, index: number) => {
                return(
                    <div key={index} className="bg-neutral-900 rounded-full px-4 py-2">
                        <p>{val}</p>
                        <img src=""></img>
                    </div>
                )
            })}
        </div>

	</div>
);
}
