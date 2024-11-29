import { api_return_schema, file_in_cms_drive, mdx } from "./api_interfaces";


export async function upload_mdx(
    mdx_string: string,
    on_pass:(e: string)=>void,
    on_fail:(e: string)=>void) {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/upload_mdx`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mdx_string: mdx_string }),
        });

        const json_result: api_return_schema<file_in_cms_drive> = await response.json();
        
        if(response.ok) {
            on_pass(json_result.data.filename)
            return
        }

        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail ("could not connect to CMS")
    }
}

export async function get_all_mdx(on_pass: (a: mdx[]) => void, on_fail: (a: string) => void) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/get_all_images`, {
            method: 'GET',
            credentials: 'include'
        });

        const json_result: api_return_schema<mdx[]> = await response.json();
        
        if(response.ok) {
            on_pass(json_result.data)
        }
        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail ("could not establish connection to CMS")
    }
}