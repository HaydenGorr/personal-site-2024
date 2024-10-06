import { useEffect, useState } from "react";
import SuggestionTextBox from "./suggestion_text_box";
import AiResponseChatbox from "./ai_response_chatbox";
import { send_tag_query_to_ai, send_chat_message_to_ai } from "../utils/ai_talk";

export default function AiChat(  {
    topChild,
    bottomChild,
    callback_add_chips_to_filter,
    all_chips,
    landing_page_mode=false
} ) {
    
    const [user_input_text_backup, set_user_input_text_backup] = useState("") // what the user types into the text input
    const [user_input_text, set_user_input_text] = useState("") // what the user types into the text input
    const [ai_chat_response, set_ai_chat_response] = useState("")

    const [minimise_ai_response_box, set_minimise_ai_response_box] = useState(false)

    const [currenty_querying_tags, set_currenty_querying_tags] = useState(false)
    const [currenty_querying_chat, set_currenty_querying_chat] = useState(false)

    const [ai_response_error, set_ai_response_error] = useState(false)
    const [ai_response_error_message, set_ai_response_error_message] = useState("")

    useEffect(() => {

        const thinking = currenty_querying_chat || currenty_querying_tags

        if (thinking){
            if (ai_response_error){
                set_ai_response_error(false)
                set_ai_response_error_message("")
            }
            set_user_input_text_backup(user_input_text)
            set_user_input_text("")
        }
        else if (ai_response_error) {
            set_ai_chat_response(ai_response_error_message)
            set_user_input_text(user_input_text_backup)
        }
        else {
            set_user_input_text("")
            set_user_input_text_backup("")
        }
        
    }, [currenty_querying_tags, currenty_querying_chat]); 

    const handle_tag_request = async () => {
        const result = await send_tag_query_to_ai(user_input_text, set_currenty_querying_tags)
        if (result.error){
            // Handle error
            set_ai_response_error(true)
            set_ai_response_error_message(result.data)
        }
        else {
            callback_add_chips_to_filter(result.data)
        }
    }

    const handle_message_request = async () => {
        const result = await send_chat_message_to_ai(user_input_text, set_currenty_querying_chat)
        if (result.error == true){
            // Handle error
            set_ai_response_error(true)
            set_ai_response_error_message(result.data)
        }
        else {
            // Handle good data
            set_ai_chat_response(result.data)
            console.log("result " + result)
        }
    }

    return (
        <div className={`w-full h-full flex justify-end flex-col`}>

            {topChild}

            {(landing_page_mode || ai_chat_response) &&
            <div className='mb-4 mt-4 h-full flex justify-end flex-col'>
                {ai_chat_response && <div className={`flex justify-end space-x-2 translate-y-3 z-50 ${(landing_page_mode || ai_chat_response) ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                    <button disabled={ai_chat_response==""} className={`${minimise_ai_response_box ? 'bg-dg-200' : 'bg-dy-200'} rounded-md text-xs h-2`} onClick={() => {set_minimise_ai_response_box(!minimise_ai_response_box)}}><div className={`${minimise_ai_response_box ? 'bg-dg-800 h-1 w-0.5 ' : 'bg-dy-800 h-0.5 w-1'} mx-4`}/></button>
                    <button disabled={ai_chat_response==""} className='bg-dr-200 rounded-md text-xs h-2' onClick={() => {set_minimise_ai_response_box(false); set_ai_chat_response("")}}><div className='bg-dr-800 h-1 w-1 mx-4 rounded-full'/></button>
                </div>}
                <AiResponseChatbox ai_response_error={ai_response_error} largeBox={landing_page_mode} textToDisplay={ai_chat_response} minimiseResponseBox={minimise_ai_response_box}/>
            </div>}

            <SuggestionTextBox 
                messageQueryingAI={currenty_querying_chat}
                tagSearchingAI={currenty_querying_tags}

                getTagsFromAI={handle_tag_request}
                chipsText={all_chips}
                defaultText={""}
                SendMessageToAI={handle_message_request}
                userText={user_input_text}
                setUserText={set_user_input_text}/>

            {bottomChild}

        </div>
    );
}