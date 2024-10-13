import { useEffect, useState } from "react";
import SuggestionTextBox from "./suggestion_text_box";
import AiResponseChatbox from "./ai_response_chatbox";
import { send_tag_query_to_ai, send_chat_message_to_ai } from "../utils/ai_talk";
const recommended_searches = require('../utils/suggested_searches.json')

export default function AiChat(  {
    show_suggestions,
    recursive_filtering,
    all_chips,
    landing_page_mode=false,
    set_filter_name,
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

    const handle_tag_request = async (overrideText=null) => {
        const result = await send_tag_query_to_ai(overrideText || user_input_text, set_currenty_querying_tags)
        if (result.error){
            // Handle error
            set_ai_response_error(true)
            set_ai_response_error_message(result.data)
        }
        else {
            console.log("check", result.data)
            recursive_filtering(result.data.logical_filter)
            set_filter_name(result.data.name)
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
        <div className={`flex flex-col w-full`}>

            {(landing_page_mode || ai_chat_response) && <div className={`mb-4 h-full`}>
                {ai_chat_response && <div className="flex justify-end space-x-1.5 translate-y-3">
                    <button disabled={ai_chat_response==""} className={`${minimise_ai_response_box ? 'bg-dg-200' : 'bg-dy-200'} rounded-md text-xs h-2`} onClick={() => {set_minimise_ai_response_box(!minimise_ai_response_box)}}>
                        <div className={`${minimise_ai_response_box ? 'bg-dg-800 h-1 w-0.5 ' : 'bg-dy-800 h-0.5 w-1'} mx-4`}/>
                    </button>
                    <button disabled={ai_chat_response==""} className='bg-dr-200 rounded-md text-xs h-2' onClick={() => {set_minimise_ai_response_box(false); set_ai_chat_response("")}}>
                        <div className='bg-dr-800 h-1 w-1 mx-4 rounded-full'/>
                    </button>
                </div>}
                <AiResponseChatbox ai_response_error={ai_response_error} largeBox={landing_page_mode} textToDisplay={ai_chat_response} minimiseResponseBox={minimise_ai_response_box} bottomAligned={show_suggestions}/>
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

            {!show_suggestions && <div className='w-full flex h-6 flex-nowrap space-x-4 overflow-x-auto mt-6' style={{
                maskImage: 'linear-gradient(to left, transparent 0%, black 10%)',
                WebkitMaskImage: 'linear-gradient(to left, transparent 0%, black 10%)'
            }}>
                {recommended_searches.map((item, index) =>(<button 
                    key={index}
                    className='bg-zinc-900 rounded-full text-sm text-zinc-400 px-4 overflow-visible relative flex-shrink-0'
                    onClick={() => {handle_tag_request(item); }}>
                        {item}
                </button>
                ))}
            </div>}

        </div>
    );
}