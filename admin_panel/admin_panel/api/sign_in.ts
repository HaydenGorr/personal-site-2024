import Cookies from 'js-cookie'
import { api_return_schema } from './interfaces/misc_interfaces';

export const send_login_request = async (username: string, password: string, on_pass:()=>void, on_fail:(error:string)=>void) =>{
    console.log("nod", process.env.NEXT_PUBLIC_USER_ACCESS_CMS)
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const res: api_return_schema<string> = await response.json();
            on_pass()
        } else {
            console.log("failed")
            on_fail(`Sign in error: ${response.statusText}`)
        }
    } catch (e: any) {
        on_fail("Unable to connect to CMS")
    }

    return
}

export const send_sign_up_request = async (username: string, password: string, regkey: string, on_pass:()=>void, on_fail:(error:string)=>void) =>{
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/signup`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, regkey }),
        });

        const json_result: api_return_schema<string|null> = await response.json();

        if (json_result.error.has_error) {
            on_fail(`Signup error: ${json_result.error.error_message}`)
        }

        if (response.status == 201) {
            const token = json_result.data!
            await Cookies.set('token', token);
            on_pass()
        } else {
            on_fail(`Signup error: ${response.statusText}`)
        }
    } catch (e: any) {
        on_fail("Unable to connect to CMS")
    }
}

export const log_out = async (on_pass:()=>void, on_fail:()=>void) =>{
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/logout`, {
          method: 'POST',
          credentials: 'include'
        });

        if (response.ok) {
            on_pass();
        } else {
            on_fail();
        }
      } catch (e) {
        on_fail();
      }
}