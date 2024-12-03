'use client'
import { useState, useEffect } from "react";
import { get_all_chips } from "../../../api/chips";
import { api_return_schema, category, chip } from "../../../api/api_interfaces";
import YesNoPopup from "../components/yesno_popup";
import { delete_chip } from "../../../api/chips";
import ChipInProgress from "./components/chips/chip_in_progress";
import { get_formatted_date } from "../../../utils/date_utils";

interface props {
    className: string;
}

export default function Chips({ className }: props) {

    const [item_to_delete, set_item_to_delete] = useState<chip|null>(null);

    const [loading, set_loading] = useState<Boolean>(true);
    const [chips, set_chips] = useState<chip[]>([]);
    const [fetch_error, set_fetch_error] = useState<Boolean>(false);
    const [fetch_error_msg, set_fetch_error_msg] = useState<string>("");
    const [error_message, set_error_message] = useState<string>("");

    const fetch_page_data = async () => {
        set_loading(true)

        await get_all_chips(
            (res: api_return_schema<chip[]>) => {
                set_chips(res.data as chip[])
                set_fetch_error(false)
                set_fetch_error_msg("")
            },
            (res: api_return_schema<chip[]>) => {
                set_chips([])
                set_fetch_error(res.error.has_error)
                set_fetch_error_msg(res.error.error_message)
            }
        )
        
        set_loading(false)
    }

    const go_delete_chip = async (chosen_chip: chip) => {

        if (!chosen_chip._id) {console.log("cannot delete. No ID"); return;}

        await delete_chip(
            chosen_chip,
            () => {
                fetch_page_data()
            },
            () => {
                // On fail
            }
        )
    }

    useEffect(()=>{
        fetch_page_data()
    }, [])

return (
	<div className={`${className} w-full`}>

        {item_to_delete && <YesNoPopup 
            isOpen={item_to_delete!=null}
            setIsOpen={()=>{set_item_to_delete(null)}}
            onConfirm={() => go_delete_chip(item_to_delete)}
            styled_item={item_to_delete.name}
            message={`Are you sure you want to delete`}/>}

        {!loading && !fetch_error && <div className="space-y-4 w-full flex flex-col items-center">

            {error_message && <p className="text-red-600">{error_message}</p>}

            <ChipInProgress refresh={()=>{fetch_page_data()}} set_error={(e:string)=> {set_error_message(e)}}/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

            {chips.map((cat_iter: chip) => {
                return(
                    <div key={cat_iter._id} className="flex space-x-4 bg-neutral-800 px-2 py-1 rounded-lg items-center w-full justify-between">
						<div>
							<p className="text-lg">{cat_iter.name}</p>
                        	<p className="text-base text-white/70">{cat_iter.description}</p>
							<p className="text-white/50 text-xs mt-2">{get_formatted_date(cat_iter.submit_date as string)}</p>
						</div>
                        <button className="bg-red-300 text-black rounded-lg p-2 hover:bg-red-500 text-xs w-6 h-6 flex items-center justify-center"
                        onClick={() => set_item_to_delete(cat_iter)}>X</button>
                    </div>
                )
            })}
            </div>

        </div>}
        {loading && 
        <div>
            Fetching categories
        </div>
        }

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
