'use client'
import { useState } from "react";
import { chip } from "../../../../../api/api_interfaces";
import YesNoPopup from "@/app/components/yesno_popup";
import { submit_chip } from "../../../../../api/chips";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className?: string;
    refresh: () => void;
    set_error: (a: string) => void;
}

export default function ChipInProgress({ className, refresh, set_error }: props) {

const [name, set_name] = useState<string>("");
const [open_submit_popup, set_open_submit_popup] = useState<Boolean>(false);
const [chip_in_edit, set_chip_in_edit] = useState<chip>({name: "", description: ""});

const go_submit_chip = async () => {
    if (chip_in_edit.name.length == 0) {
        set_error("enter a title")
        return
    }

    if (chip_in_edit.description.length == 0) {
        set_error("enter a description")
        return
    }

    submit_chip(
        chip_in_edit,
        ()=>{refresh()},
        (e)=>{set_error(e)}
    )

}

return (
	<div className={`${className} flex flex-col items-center w-full`}>

    {open_submit_popup && <YesNoPopup 
        isOpen={open_submit_popup}
        setIsOpen={()=>{set_open_submit_popup(false)}}
        onConfirm={() => go_submit_chip()}
        styled_item={`${chip_in_edit.name} - ${chip_in_edit.description}`}
        message={`Submit to server: `}/>}

        <input 
            className="text-black rounded-lg px-2 py-2 mb-2 max-w-prose w-full"
            placeholder={"name"}
            onChange={(e) => set_chip_in_edit({...chip_in_edit, name: e.target.value})}
        />
        <input 
            className="text-black rounded-lg px-2 py-2 mb-2 max-w-prose w-full"
            placeholder={"description"}
            onChange={(e) => set_chip_in_edit({...chip_in_edit, description: e.target.value})}
        />
        
        <button className="bg-green-300 px-2 py-1 rounded-lg w-fit" onClick={()=>{set_open_submit_popup(true)}}>submit</button>


	</div>
);
}
