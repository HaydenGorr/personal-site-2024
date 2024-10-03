import ChatBubble from "../components/chat_bubble";
import Layout from "../components/layout";
import { useEffect, useState, useRef } from "react";
import Special_Button from "../components/special_button";
import { get_response } from "../utils/ai_talk";
import ChangeStyle from "../components/change_style";

export default function AiResponseChatbox( { textToDisplay, loading } ) {

    useEffect(() => {

    }, []); 

    return (
        <div className={`w-full max-w-prose transition-all ease-in-out duration-300`}>
            <p className={`font-normal text-xs mb-1 ${textToDisplay ? 'opacity-100' : 'opacity-15'}`}>response from Claude 3 Haiju</p>
            <div className={`rounded-md bg-dg-100 p-4 ${textToDisplay ? 'h-fit opacity-100' : 'h-10 opacity-15'} over`}>
                <p className={`font-semibold text-dg-900`}>{textToDisplay}</p>
            </div>
        </div>
    );
}