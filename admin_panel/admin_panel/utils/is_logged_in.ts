import { api_return_schema, jwt_api } from "../api/api_interfaces";
import Cookies from "js-cookie";

export const are_we_logged_in = async (if_logged_in: () => void = () => {}, if_not_logged_in: (error:string) => void = () => {}) =>{

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/loggedIn`, {
            method:'GET',
            credentials: 'include'
        });

        const resJson: api_return_schema<jwt_api> = await response.json()

        if (response.ok) {
            if_logged_in()
        } else {
            if_not_logged_in(resJson.error.error_message)
        }
    }
    catch(e){
        if_not_logged_in("error connecting to CMS for authentication")
    }

}