import { api_return_schema } from "./api_interfaces";


export async function upload_image(image:File, on_pass: (a: string) => void, on_fail: (a: api_return_schema<string|null>) => void) {
    try {

        const formData = new FormData()
        formData.append('image', image)

        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/upload_image`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        const json_result: api_return_schema<string|null> = await response.json();
        console.log("json_result", json_result)
        
        if (json_result.error.has_error) {
            on_fail(json_result)
            return
        }

        // If it passes the error check above but still has no data then throw an error
        if (json_result.data == null) {
            throw Error()
        }

        if(response.ok) {
            on_pass(json_result.data)
            return
        }

    } catch (error) {
        on_fail ({data: "", error: { has_error: true, error_message: "could not establish connection to CMS" } })
    }
}