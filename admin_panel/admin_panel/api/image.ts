import { api_return_schema, file_on_drive, image, image_type_enum } from "./api_interfaces";
import path from "path";

export async function upload_image(
    image:File,
    on_pass: (a: string) => void,
    on_fail: (a: string) => void,
    category: image_type_enum) {
    try {

        var path_construction = `${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/upload_image?category=${category}`

        const formData = new FormData()
        formData.append('image', image)

        const response = await fetch(path_construction, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        const json_result: api_return_schema<file_on_drive|null> = await response.json();
        
        if (json_result.error.has_error) {
            on_fail(json_result.error.error_message)
            return
        }

        // If it passes the error check above but still has no data then throw an error
        if (json_result.data == null) {
            throw Error()
        }

        if(response.ok) {
            on_pass(json_result.data.full_url)
            return
        }

    } catch (error) {
        on_fail (`${error}`)
    }
}

export async function get_all_images(on_pass: (a: image[]) => void, on_fail: (a: string) => void, category?: image_type_enum) {
    try {

        var path_construction = `${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/get_all_images`

        if (category) path_construction = `${path_construction}?category=${category}`

        const response = await fetch(path_construction, {
            method: 'GET',
            credentials: 'include',
        });

        const json_result: api_return_schema<image[]> = await response.json();
        
        if(response.ok) {
            on_pass(json_result.data)
        }
        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail ("could not establish connection to CMS")
    }
}

export async function delete_image(
    inImage: image,
    on_pass:()=>void,
    on_fail:(e: string)=>void) {
    
    if (!inImage._id) {
        on_fail("Aborted. Missing category ID.")
        return
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/delete_image`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image_stringified: inImage }),
        });

        const json_result: api_return_schema<Boolean> = await response.json();
        
        if (json_result.error.has_error){
            on_fail(json_result.error.error_message)
            return
        }

        on_pass()
        return

    } catch (error) {
        on_fail("Could not connect to CMS")
    }
}