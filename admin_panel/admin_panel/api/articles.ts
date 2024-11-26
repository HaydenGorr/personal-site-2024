import { stringify } from "querystring";
import { api_return_schema, article } from "./api_interfaces"

export async function get_all_articles(on_pass: (a: api_return_schema<article[]>) => void, on_fail: (a: api_return_schema<article[]>) => void) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/get_all_articles`, {
            method: 'GET',
            credentials: 'include'
        });

        const json_result: api_return_schema<article[]> = await response.json();
        
        if(response.ok) {
            if (json_result.error.has_error) on_fail({data: [], error: json_result.error })
            else on_pass(json_result)
        }
        else on_fail({data: [], error: { has_error: true, error_message: json_result.error.error_message } })

    } catch (error) {
        on_fail ({data: [], error: { has_error: true, error_message: "could not establish connection to CMS" } })
    }
}
