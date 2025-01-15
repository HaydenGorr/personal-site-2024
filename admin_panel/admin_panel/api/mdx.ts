import { api_return_schema } from "./interfaces/misc_interfaces";
import { db_mdx } from "./interfaces/mdx_interfaces";

export async function upload_mdx(
    mdx_string: string,
    title: string,
    on_pass:(e: db_mdx)=>void,
    on_fail:(e: string)=>void) {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/upload_mdx`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mdx_string: mdx_string, title: title }),
        });

        const json_result: api_return_schema<db_mdx> = await response.json();

        if(response.ok) {
            on_pass(json_result.data)
            return
        }

        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail ("could not connect to CMS")
    }
}

export async function update_mdx(
    _id: string, mdx_string: string, title: string,
    on_pass:(e: db_mdx)=>void,
    on_fail:(e: string)=>void) {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/update_mdx`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mdx_string: mdx_string, title: title, _id: _id }),
        });

        const json_result: api_return_schema<db_mdx> = await response.json();

        if(response.ok) {
            on_pass(json_result.data)
            return
        }

        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail ("could not connect to CMS")
    }
}

export async function get_all_mdx(on_pass: (a: db_mdx[]) => void, on_fail: (a: string) => void) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/get_all_mdx`, {
            method: 'GET',
            credentials: 'include'
        });

        const json_result: api_return_schema<db_mdx[]> = await response.json();
        
        if(response.ok) {
            on_pass(json_result.data)
        }
        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail ("could not establish connection to CMS")
    }
}

export async function select_mdx(on_pass: (a: db_mdx[]) => void, on_fail: (a: string) => void, filter:Partial<db_mdx>, ) {
    try {
        // var path_construction = `${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/select_images`
        const params = new URLSearchParams(filter as Record<string, string>).toString();
        const path_construction = `${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/select_mdx?${params}`;

        if (!filter) {
            on_fail("No filter recieved")
            return
        }

        console.log("ukra", filter)

        const response = await fetch(path_construction, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const json_result: api_return_schema<db_mdx[]> = await response.json();
        
        if(response.ok) {
            on_pass(json_result.data)
        }
        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail ("could not establish connection to CMS")
    }
}

export async function delete_mdx(
    on_pass:()=>void,
    on_fail:(e: string)=>void,
    mdx_id: string) {

    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/delete_mdx`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: mdx_id }),
        });

        const json_result: api_return_schema<Boolean> = await response.json();
        
        if(response.ok) {
            if (json_result.error.has_error) on_fail(json_result.error.error_message)
            else on_pass()
        }
        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail("Could not connect to CMS")
    }
}