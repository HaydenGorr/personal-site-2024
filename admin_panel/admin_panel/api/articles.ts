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

export async function submit_article_changes(edited_article: article, on_pass: () => void, on_fail: (a: string) => void) {

    if (!("_id" in edited_article)) {
        on_fail("Aborted. Missing category ID.")
        return
    }

    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/update_article`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ edited_article: edited_article }),
        });

        const json_result: api_return_schema<Boolean> = await response.json();
        
        if(response.ok) {
            on_pass()
        }
        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail ("could not establish connection to CMS" )
    }
}


export async function submit_new_article(new_article: article, on_pass: () => void, on_fail: (a: string) => void) {

    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/create_new_article`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ new_article: new_article }),
        });

        const json_result: api_return_schema<Boolean> = await response.json();
        
        if(response.ok) {
            on_pass()
        }
        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail ("could not establish connection to CMS" )
    }
}
