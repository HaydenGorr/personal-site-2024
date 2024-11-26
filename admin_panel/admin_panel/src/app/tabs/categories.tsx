'use client'
import { useState, useEffect } from "react";
import { get_all_categories, delete_category } from "../../../api/categories";
import { api_return_schema, category } from "../../../api/api_interfaces";
import CategoryContainer from "./components/categories/category_container";
import CategoryInProgress from "./components/categories/category_inprogress";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className: string;
}

export default function Categories({ className }: props) {

    const [loading, set_loading] = useState<Boolean>(true);
    const [categories, set_categories] = useState<category[]>([]);
    const [fetch_error, set_fetch_error] = useState<Boolean>(false);
    const [fetch_error_msg, set_fetch_error_msg] = useState<string>("");

    const [category_in_progress, set_category_in_progress] = useState<category | null>(null);

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
	<div className={`${className}`}>
        {!loading && !fetch_error && <div className="space-y-4 w-full flex flex-col items-center">

            <div className="w-full flex justify-around">
                <button 
                    className="bg-green-400 hover:bg-green-700 rounded-full p-2 w-fit"
                    onClick={()=>{set_category_in_progress({name:"default name"})}}>add</button>
                {category_in_progress && <button 
                    className="bg-red-400 hover:bg-red-700 rounded-full p-2 w-fit"
                    onClick={()=>{set_category_in_progress(null)}}>stop</button>}
            </div>

            {category_in_progress && <CategoryInProgress/>}

            {categories.map((cat_iter) => {
                return(
                    <div key={cat_iter._id} className="flex space-x-4 w-full">
                        <CategoryContainer name={cat_iter.name} _id={cat_iter._id as number}/>
                        <button className="bg-red-500 rounded-full p-2 hover:bg-red-700" onClick={() => go_delete_category(cat_iter)}>delete</button>
                    </div>
                )
            })}

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
