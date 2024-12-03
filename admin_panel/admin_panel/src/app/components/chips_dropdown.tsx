'use client'
import { useEffect, useState, useRef } from "react";
import { article, category, chip, api_return_schema } from "../../../api/api_interfaces";
import { get_all_chips } from "../../../api/chips";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className?: string;
    on_select: (a:string)=>void;
    on_remove_chip: (a:string)=>void;
    display_values: string[];
}

// const empty_article: article = {
//     title: "",
//     desc: "",
//     infoText: "",
//     chips: [],
//     category: "",
//     source: "",
//     views: 0,
//     publishDate: new Date(),
//     ready: false,
//     portfolioReady: false,
// }

export default function CategoryDropdown({ className, on_select, on_remove_chip, display_values }: props) {

const [error_message, set_error_message] = useState<string|null>(null);
const [open, set_open] = useState<Boolean>(false);
const [selectable_values, set_selectable_values] = useState<chip[]>([]);
const [loading, set_loading] = useState<Boolean>(false);

useEffect(()=>{
    const fetch_categories = async () => {
        set_loading(true)
        get_all_chips(
            (res: api_return_schema<chip[]>)=>{
                set_error_message(null)
                set_selectable_values(res.data)
                set_loading(false)
            },
            (res: api_return_schema<chip[]>)=>{
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
        <span className="text-base text-gray-400">{"chips"}</span>
        {error_message && <p>{error_message}</p>}
        <div className={`bg-neutral-800 px-4 py-2 cursor-pointer flex space-x-4`}>
            <div onClick={()=>{set_open(!open)}}>open</div>
            {display_values.map((inchip, index)=>{
                return(
                    <div key={index+inchip} className="bg-blue-200 px-2 py-1 rounded-full text-black">
                        {inchip}
                        <button className="bg-blue-400 rounded-full ml-2 h-fit px-2"
                            onClick={()=>{on_remove_chip(inchip)}}>x</button>
                    </div>
                )
            })}
        </div>
        {open && get_dropdown_contents()}

	</div>
);
}
