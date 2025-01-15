import { stringify } from "querystring";
import { api_return_schema } from "./interfaces/misc_interfaces";
import { db_chip } from "./interfaces/chip_interfaces";

export async function get_all_chips(on_pass: (a: api_return_schema<db_chip[]>) => void, on_fail: (a: api_return_schema<db_chip[]>) => void) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/get_all_chips`, {
            method: 'GET',
        });

        const json_result: api_return_schema<db_chip[]> = await response.json();
        
        if(response.ok) {
            on_pass(json_result)
        }
        else on_fail({data: [], error: { has_error: true, error_message: response.statusText } })

    } catch (error) {
        on_fail ({data: [], error: { has_error: true, error_message: "could not establish connection to CMS" } })
    }
}

export async function delete_chip(
    chip: db_chip,
    on_pass:()=>void,
    on_fail:(e: string)=>void) {
    
    if (!chip._id) {
        on_fail("Aborted. Missing chip ID.")
        return
    }

    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/delete_chip`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chip_stringified: chip }),
        });

        const json_result: api_return_schema<Boolean> = await response.json();
        
        if(response.ok) {
            if (json_result.error.has_error) on_fail(json_result.error.error_message)
            else on_pass()
        }
        else on_fail("Could not connect to CMS")

    } catch (error) {
        on_fail("Could not connect to CMS")
    }
}


export async function submit_chip(
    chip: db_chip,
    on_pass:()=>void,
    on_fail:(e: string)=>void) {

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/secure/add_chip`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chip_stringified: chip }),
        });

        const json_result: api_return_schema<Boolean> = await response.json();
        
        if(response.ok) {
            if (json_result.error.has_error) on_fail(json_result.error.error_message)
            else on_pass()
        }
        else on_fail(json_result.error.error_message)

    } catch (error) {
        on_fail ("could not connect to CMS")
    }
}