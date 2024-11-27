import { api_return_schema } from "./api_interfaces";


export async function upload_image(image:File, on_pass: (a: api_return_schema<string>) => void, on_fail: (a: api_return_schema<string>) => void) {
    try {
        const formData = new FormData()
        formData.append('image', image)

        console.log("calling", `${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/upload_image`)

        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/upload_image`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        const json_result: api_return_schema<string> = await response.json();
        
        if(response.ok) {
            on_pass(json_result)
        }
        else on_fail({data: "", error: { has_error: true, error_message: response.statusText } })

    } catch (error) {
        on_fail ({data: "", error: { has_error: true, error_message: "could not establish connection to CMS" } })
    }
}