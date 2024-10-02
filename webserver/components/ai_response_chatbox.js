import ChatBubble from "../components/chat_bubble";
import Layout from "../components/layout";
import { useEffect, useState, useRef } from "react";
import Special_Button from "../components/special_button";
import { get_response } from "../utils/ai_talk";
import ChangeStyle from "../components/change_style";

export default function AiResponseChatbox( { textToDisplay } ) {

    const [responseText, setResponseText] = useState("");

    useEffect(() => {

    }, []); 

    return (
        <div className='w-full max-w-prose'>
            <p className='font-normal text-xs mb-1'>response from Claude 3 Haiju</p>
            <div className='rounded-md bg-dg-100 p-4'>
                <p className='font-semibold text-dg-900'>{textToDisplay}</p>
            </div>
        </div>
    );
}