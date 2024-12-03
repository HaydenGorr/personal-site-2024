'use client'
import { useState } from "react";
import { category } from "../../../../../api/api_interfaces";
import YesNoPopup from "@/app/components/yesno_popup";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className?: string;
    submit_category: (a: category) => void;
    set_error: (a: string) => void;
}

export default function CategoryInProgress({ className, submit_category, set_error }: props) {

const [category_in_progress, set_category_in_progress] = useState<category>({name: "" });
const [open_submit_popup, set_open_submit_popup] = useState<Boolean>(false);

return (
	<div className={`${className} flex justify-center w-full space-x-4`}>

        <YesNoPopup 
            isOpen={open_submit_popup}
            setIsOpen={()=>{set_open_submit_popup(false)}}
            onConfirm={() => submit_category(category_in_progress)}
            styled_item={category_in_progress?.name}
            message={`Submit to server: `}/>

        <input 
            className="text-black rounded-lg px-2 py-2 max-w-prose flex-grow"
            placeholder={"new category name"}
            onChange={(e) => set_category_in_progress({...category_in_progress, name: e.target.value})}
        />
        
        <button className="bg-green-300 px-2 py-2 rounded-lg w-fit" onClick={()=>{set_open_submit_popup(true)}}>submit</button>


	</div>
);
}
