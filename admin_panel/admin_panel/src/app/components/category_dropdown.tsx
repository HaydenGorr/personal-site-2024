'use client'
import { useEffect, useState, useRef } from "react";
import { db_category } from "../../../api/interfaces/category_interfaces";
import { api_return_schema } from "../../../api/interfaces/misc_interfaces";
import { get_all_categories } from "../../../api/categories";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className?: string;
    on_select: (a:string)=>void;
    display_value: string;
}

export default function CategoryDropdown({ className, on_select, display_value }: props) {

const [error_message, set_error_message] = useState<string|null>(null);
const [open, set_open] = useState<Boolean>(false);
const [selectable_values, set_selectable_values] = useState<db_category[]>([]);
const [loading, set_loading] = useState<Boolean>(false);

useEffect(()=>{
    const fetch_categories = async () => {
        set_loading(true)
        get_all_categories(
            (res: api_return_schema<db_category[]>)=>{
                set_error_message(null)
                set_selectable_values(res.data)
                set_loading(false)
            },
            (res: api_return_schema<db_category[]>)=>{
                set_selectable_values([])
                set_error_message(res.error.error_message)
                set_loading(false)
            }
        )
        
    }

    fetch_categories()

}, [open])

const get_dropdown_contents = () => {
    if (!loading) {
        return(
            <div className="">
                {selectable_values.map((val, index)=> {
                    return(
                        <div key={index} className={`${index%2==0 ? 'bg-neutral-600': 'bg-neutral-500'} px-4 py-2 hover:bg-neutral-700 cursor-pointer`}
                        onClick={()=>{on_select(val.name)}}>
                            {val.name}
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
        
        <span className="text-base text-gray-400">{"category"}</span>

        {error_message && <p>{error_message}</p>}

        <div className={`bg-neutral-800 px-4 py-2 cursor-pointer`} onClick={()=>{set_open(!open)}}>
            {display_value}
        </div>

        {open && get_dropdown_contents()}

	</div>
);
}
