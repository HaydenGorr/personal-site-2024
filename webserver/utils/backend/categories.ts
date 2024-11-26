import { category, api_return_schema } from '../../../cms_server/interfaces/interfaces'

export async function get_all_categories():Promise<api_return_schema> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/get_all_categories`, {
            method: 'GET',
            credentials: 'include'
        });
    
        const json_result: api_return_schema = await response.json();
        console.log("develop", json_result)
        return json_result

    } catch (error) {
        console.error('Error uploading chip', error);
        return {data: [], error: { has_error: true, error_message: "could not establish connection to CMS" } }
    }
}