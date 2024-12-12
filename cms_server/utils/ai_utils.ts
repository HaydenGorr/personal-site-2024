import { AI_type_enum, api_return_schema, chip } from "../interfaces/interfaces.js";
import system_prompts from './system_prompts.json' assert { type: 'json' };

export const get_chat_bot_system_prompt = ( articles_for_consumption: string ):api_return_schema<string> => {
    try {
        return {data: system_prompts.base + " " +
            system_prompts.complex_querier.CQ_base  + " " +
            system_prompts.complex_querier.bridge + " " +
            system_prompts.complex_querier.writing.CV + " " +
            articles_for_consumption + " " +
            system_prompts.complex_querier.end, error: {has_error: false, error_message:""}}
    } catch {
        return { data: "", error: { has_error: true, error_message: "unable to generate chat_bot system prompt" }}
    }

}

export const get_tag_finder_system_prompt = ( tags: chip[] ):api_return_schema<string> => {
    try {
        return {data: system_prompts.base + " " +
                system_prompts.tag_finder.TF_base + " " +
                JSON.stringify(tags) + " " +
                system_prompts.tag_finder.end, error: {has_error: false, error_message:""}}
    } catch {
        return { data: "", error: { has_error: true, error_message: "unable to generate chat_bot system prompt" }}
    }

}
