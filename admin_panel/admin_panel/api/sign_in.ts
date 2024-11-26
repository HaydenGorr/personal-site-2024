import Cookies from 'js-cookie'

export const send_login_request = async (username: string, password: string, on_pass:()=>void, on_fail:(error:string)=>void) =>{
    console.log("nod", process.env.NEXT_PUBLIC_USER_ACCESS_CMS)
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/login`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const { token } = await response.json();
            await Cookies.set('token', token);
            on_pass()
        } else {
            on_fail(`Sign in error: ${response.statusText}`)
        }
    } catch (e: any) {
        on_fail("Unable to connect to CMS")
    }

    return
}

export const send_sign_up_request = async (username: string, password: string, on_pass:()=>void, on_fail:(error:string)=>void) =>{
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/signup`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const { token } = await response.json();
            on_pass()
        } else {
            on_fail(`Signup error: ${response.statusText}`)
        }
    } catch (e: any) {
        on_fail("Unable to connect to CMS")
    }
  }