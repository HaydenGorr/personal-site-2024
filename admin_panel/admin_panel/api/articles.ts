import { stringify } from "querystring";
import { api_return_schema, article, article_local, db_article } from "./api_interfaces"
import { article_WID } from "./interfaces/article_interfaces";

export async function get_all_articles(on_pass: (a: db_article[]) => void, on_fail: (a: string) => void) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/get_all_articles`, {
            method: 'GET',
            credentials: 'include'
        });

        const json_result: api_return_schema<db_article[]> = await response.json();
        
        if(response.ok || !json_result.error.has_error) {
            on_pass(json_result.data)
        }
        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail ("could not establish connection to CMS")
    }
}

export async function submit_article_changes(edited_article: article_WID, on_pass: () => void, on_fail: (a: string) => void) {

    if (edited_article._id.length == 0 || edited_article.mdx.length == 0 || edited_article.image.length == 0) {
        on_fail("Aborted. Missing either _id, mdx, or image props")
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

        const json_result: api_return_schema<number> = await response.json();
        
        if(response.ok) {
            on_pass()
        }
        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail ("could not establish connection to CMS" )
    }
}


export async function submit_new_article(new_article: article_local, on_pass: (db_article: db_article) => void, on_fail: (a: string) => void) {

    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/create_new_article`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ new_article: new_article }),
        });

        const json_result: api_return_schema<db_article> = await response.json();
        
        if(response.ok) {
            on_pass(json_result.data)
        }
        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail ("could not establish connection to CMS" )
    }
}

export async function delete_article(article_id: number|string, on_pass: () => void, on_fail: (a: string) => void) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/delete_article`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ article_id: article_id }),
        });

        const json_result: api_return_schema<boolean> = await response.json();
        
        if(response.ok) {
            if (json_result.error.has_error) on_fail(json_result.error.error_message)
            else on_pass()
        }
        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail ("could not establish connection to CMS")
    }
}