import { api_return_schema, mdx } from "./api_interfaces";

export async function upload_mdx(
    mdx_string: string,
    on_pass:(e: mdx)=>void,
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

        const json_result: api_return_schema<mdx> = await response.json();

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
    mdx_string: string,
    filename: string,
    on_pass:(e: mdx)=>void,
    on_fail:(e: string)=>void) {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/update_mdx`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mdx_string: mdx_string, filename: filename }),
        });

        const json_result: api_return_schema<mdx> = await response.json();

        if(response.ok) {
            on_pass(json_result.data)
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

export async function get_mdx(file_name:string, on_pass: (a: mdx) => void, on_fail: (a: string) => void) {
    try {
        const formData = new FormData()
        formData.append('file_name', file_name)

        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/get_image`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: formData,
        });

        const json_result: api_return_schema<mdx> = await response.json();
        
        if(response.ok) {
            on_pass(json_result.data)
        }
        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail ("could not establish connection to CMS")
    }
}