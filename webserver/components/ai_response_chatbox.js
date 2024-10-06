import ChatBubble from "../components/chat_bubble";
import Layout from "../components/layout";
import { useEffect, useState, useRef } from "react";
import Special_Button from "../components/special_button";
import { get_response } from "../utils/ai_talk";
import ChangeStyle from "../components/change_style";
import ReactMarkdown from 'react-markdown';

export default function AiResponseChatbox( { textToDisplay, largeBox=true, minimiseResponseBox, ai_response_error } ) {

    useEffect(() => {

    }, []); 

    return (
        <div className={`w-full max-w-prose transition-all ease-in-out duration-300`}>
            <p className={`font-normal text-xs mb-1 ${textToDisplay && !minimiseResponseBox ? 'opacity-100' : 'opacity-15'}`}>response from Claude 3 Haiku</p>
            <div className={`rounded-md ${ai_response_error ? 'bg-dr-100': 'bg-dg-100'} p-4 py-0 ${textToDisplay && !minimiseResponseBox ? 'h-fit opacity-100' : 'h-10 opacity-15'} overflow-scroll ${largeBox ? 'max-h-64' : 'max-h-40'} prose`}>
                {!minimiseResponseBox && <ReactMarkdown className={`font-semibold ${ai_response_error ? 'text-dr-900': 'text-dg-900'}`} children={textToDisplay} />}
                {minimiseResponseBox && <p className={`font-semibold ${ai_response_error ? 'text-dr-900': 'text-dg-900'} line-clamp-1 overflow-ellipsis mt-2`}children={textToDisplay} />}
            </div>
        </div>
    );
}