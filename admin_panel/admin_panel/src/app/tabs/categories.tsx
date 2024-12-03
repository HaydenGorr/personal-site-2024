'use client'
import { useState, useEffect } from "react";
import { get_all_categories, delete_category, submit_category } from "../../../api/categories";
import { api_return_schema, category } from "../../../api/api_interfaces";
import CategoryInProgress from "./components/categories/category_inprogress";
import YesNoPopup from "../components/yesno_popup";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className: string;
}

export default function Categories({ className }: props) {

    const [item_to_delete, set_item_to_delete] = useState<category|null>(null);

    const [loading, set_loading] = useState<Boolean>(true);
    const [categories, set_categories] = useState<category[]>([]);
    const [fetch_error, set_fetch_error] = useState<Boolean>(false);
    const [fetch_error_msg, set_fetch_error_msg] = useState<string>("");
    const [error_message, set_error_message] = useState<string>("");


    const fetch_page_data = async () => {
        set_loading(true)

        await get_all_categories(
            (res: api_return_schema<category[]>) => {
                set_categories(res.data as category[])
                set_fetch_error(false)
                set_fetch_error_msg("")
            },
            (res: api_return_schema<category[]>) => {
                set_categories([])
                set_fetch_error(res.error.has_error)
                set_fetch_error_msg(res.error.error_message)
            }
        )
        
        set_loading(false)
    }

    const go_submit_category = async (inCategory: category) => {
        if (!inCategory) {
            set_error_message("No category provided. Code issue. Fix it")
            return
        }
        
        if (inCategory.name.length == 0) {
            set_error_message("Enter a category")
            return
        }

        if (categories.find((val, index)=>{
            val.name.toLocaleLowerCase() == inCategory.name.toLocaleLowerCase()
        })) {
            set_error_message("you've already added this category")
            return
        }

        set_error_message("")

        await submit_category(
            inCategory,
            ()=>{fetch_page_data()},
            (e:string)=>{set_error_message(e)}
        )
    }

    const go_delete_category = async (chosen_category: category) => {

        if (!chosen_category._id) {console.log("cannot delete. No ID"); return;}

        await delete_category(
            chosen_category,
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
            onConfirm={() => go_delete_category(item_to_delete)}
            styled_item={item_to_delete.name}
            message={`Are you sure you want to delete`}/>}

        {!loading && !fetch_error && <div className="space-y-4 w-full flex flex-col items-center">

            {error_message && <p className="text-red-600">{error_message}</p>}

            <CategoryInProgress 
                set_error={(e:string)=> {set_error_message(e)}}
                submit_category={(in_cat: category)=>go_submit_category(in_cat)}/>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {categories.map((cat_iter) => {
                return(
                    <div key={cat_iter._id} className="flex space-x-4 bg-neutral-800 px-2 py-1 rounded-lg w-full items-center justify-between">
                        <p className="text-lg">{cat_iter.name}</p>
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
