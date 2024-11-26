import { stringify } from "querystring";
import { api_return_schema, category } from "./api_interfaces"

export async function get_all_categories(on_pass: (a: api_return_schema<category[]>) => void, on_fail: (a: api_return_schema<category[]>) => void) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/get_all_categories`, {
            method: 'GET',
            credentials: 'include'
        });

        const json_result: api_return_schema<category[]> = await response.json();
        
        if(response.ok) {
            if (json_result.error.has_error) on_fail({data: [], error: json_result.error })
            else on_pass(json_result)
        }
        else on_fail({data: [], error: { has_error: true, error_message: response.statusText } })

    } catch (error) {
        on_fail ({data: [], error: { has_error: true, error_message: "could not establish connection to CMS" } })
    }
}

export async function delete_category(
    inCategory: category,
    on_pass:()=>void,
    on_fail:(e: string)=>void) {
    
    if (!inCategory._id) {
        on_fail("Aborted. Missing category ID.")
        return
    }

    try {
        // const formData = new FormData();
        // formData.append('category_stringified', inCategory);

        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/delete_category`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category_stringified: inCategory }),
        });

        const json_result: api_return_schema<Boolean> = await response.json();
        
        if(response.ok) {
            if (json_result.error.has_error) on_fail(json_result.error.error_message)
            else on_pass()
        }
        else on_fail("Could not connect to CMS")

    } catch (error) {
        on_fail("Could not connect to CMS")
    }
}


export async function submit_category(category_name: string) {
    // try {
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/get_all_categories`, {
    //         method: 'POST',
    //         credentials: 'include'
    //     });

    //     const json_result: api_return_schema<Boolean> = await response.json();
        
    //     if(response.ok) {
    //         if (json_result.error.has_error) on_fail()
    //         else on_pass()
    //     }
    //     else on_fail()

    // } catch (error) {
    //     on_fail ()
    // }
}