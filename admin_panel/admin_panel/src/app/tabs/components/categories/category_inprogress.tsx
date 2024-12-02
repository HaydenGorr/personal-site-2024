'use client'
import { useState } from "react";
import { category } from "../../../../../api/api_interfaces";
import { submit_category } from "../../../../../api/categories";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className?: string;
    refresh: ()=>void
}

export default function CategoryInProgress({ className, refresh }: props) {

const [error_msg, set_error_msg] = useState<string|null>(null);
const [name, set_name] = useState<string>("");

const submit_new_category = async () => {
    if (name.length == 0) {
        set_error_msg("enter a category")
        return
    }

    await submit_category(
        name,
        ()=>{refresh()},
        (e:string)=>{set_error_msg(e)})

}

return (
	<div className={`${className} flex flex-col items-center w-full`}>

        { error_msg && <p className="text-red-500">{error_msg}</p>}

        <input 
            className="text-black rounded-lg px-2 py-2 mb-2 max-w-prose w-full"
            placeholder={name}
            onChange={(e) => set_name(e.target.value)}
        />
        
        <button className="bg-blue-400 px-2 py-1 rounded-lg w-fit" onClick={()=>submit_new_category()}>submit</button>


	</div>
);
}
