import { stringify } from "querystring";
import { api_return_schema, category, chip } from "./api_interfaces"

export async function get_all_chips(on_pass: (a: api_return_schema<chip[]>) => void, on_fail: (a: api_return_schema<chip[]>) => void) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/get_all_chips`, {
            method: 'GET',
        });

        const json_result: api_return_schema<chip[]> = await response.json();
        
        if(response.ok) {
            on_pass(json_result)
        }
        else on_fail({data: [], error: { has_error: true, error_message: response.statusText } })

    } catch (error) {
        on_fail ({data: [], error: { has_error: true, error_message: "could not establish connection to CMS" } })
    }
}

export async function delete_chip(
    inCategory: category,
    on_pass:()=>void,
    on_fail:(e: string)=>void) {
    
    // if (!inCategory._id) {
    //     on_fail("Aborted. Missing category ID.")
    //     return
    // }

    // try {
    //     // const formData = new FormData();
    //     // formData.append('category_stringified', inCategory);

    //     const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/delete_category`, {
    //         method: 'POST',
    //         credentials: 'include',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ category_stringified: inCategory }),
    //     });

    //     const json_result: api_return_schema<Boolean> = await response.json();
        
    //     if(response.ok) {
    //         if (json_result.error.has_error) on_fail(json_result.error.error_message)
    //         else on_pass()
    //     }
    //     else on_fail("Could not connect to CMS")

    // } catch (error) {
    //     on_fail("Could not connect to CMS")
    // }
}


export async function submit_chip(
    category_name: string,
    on_pass:()=>void,
    on_fail:(e: string)=>void) {

    // const formData = new FormData();
    // formData.append('category_name', category_name);

    // try {
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/add_category`, {
    //         method: 'POST',
    //         credentials: 'include',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ category_name: category_name }),
    //     });

    //     const json_result: api_return_schema<Boolean> = await response.json();
        
    //     if(response.ok) {
    //         if (json_result.error.has_error) on_fail(json_result.error.error_message)
    //         else on_pass()
    //     }
    //     else on_fail(json_result.error.error_message)

    // } catch (error) {
    //     on_fail ("could not connect to CMS")
    // }
}