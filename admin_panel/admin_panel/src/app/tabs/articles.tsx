'use client'
import { useState, useEffect } from "react";
import { get_all_categories } from "../../../api/categories";
import { api_return_schema, category } from "../../../api/api_interfaces"

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className: string;
}

export default function Articles({ className }: props) {

const [loading, set_loading] = useState<Boolean>(true);
const [categories, set_categories] = useState<category[]>([]);
const [fetch_error, set_fetch_error] = useState<Boolean>(false);
const [fetch_error_msg, set_fetch_error_msg] = useState<string>("");

useEffect(()=>{
    set_loading(true)

    const fetch_page_data = async () => {
        get_all_categories(
            (res: api_return_schema) => {
                console.log("product", res)
                set_categories(res.data as category[])
                set_fetch_error(false)
                set_fetch_error_msg("")
            },
            (res: api_return_schema) => {
                set_categories([])
                set_fetch_error(res.error.has_error)
                set_fetch_error_msg(res.error.error_message)
            }
        )
    }

    fetch_page_data()

    set_loading(false)

}, [])

return (
	<div className={`${className} `}>
		categories
	</div>
);
}
