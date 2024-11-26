import { api_return_schema } from "../api/api_interfaces";

export const are_we_logged_in = async (if_logged_in: (response:api_return_schema<Boolean>) => void = () => {}, if_not_logged_in: (error:string) => void = () => {}) =>{
    console.log("disrespect")
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/loggedIn`, {
            method:'GET',
            credentials: 'include'
        });
        if (response.ok) {
            const resJson: api_return_schema<Boolean> = await response.json()
            console.log("where at", resJson)
            if (resJson.error.has_error) if_not_logged_in(resJson.error.error_message)
            else if_logged_in(resJson)
        } else {
            if_not_logged_in("unauthorised")
        }
    }
    catch(e){
        if_not_logged_in("error connecting to CMS for authentication")
    }
}