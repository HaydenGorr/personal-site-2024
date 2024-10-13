import { useEffect } from "react";
import ReactMarkdown from 'react-markdown';

export default function AiResponseChatbox( { textToDisplay, largeBox=true, minimiseResponseBox, ai_response_error, bottomAligned } ) {

    useEffect(() => {

    }, []); 

    return (
        <div className={`ai-response-chatbox h-full w-full max-w-prose transition-all ease-in-out duration-300`}>
            <p className={`font-normal text-xs w-fit mb-1 z-40 ${textToDisplay && !minimiseResponseBox ? 'opacity-100' : 'opacity-15'}`}>response from Claude 3 Haiku</p>
            <div className={` ${bottomAligned ? 'max-h-36' : 'h-full'} ai-response-box prose px-4 rounded-md overflow-scroll min-h-12 md:max-h-[calc(100vh-33rem)] max-h-[calc(100vh-29rem)] ${ai_response_error ? 'bg-dr-100': 'bg-dg-100'} ${textToDisplay && !minimiseResponseBox ? 'h-fit opacity-100' : 'h-10 opacity-15'}`}>
                <ReactMarkdown className={`font-semibold ${ai_response_error ? 'text-dr-900': 'text-dg-900'} ${minimiseResponseBox ? 'line-clamp-1 overflow-ellipsis -translate-y-2': ''}`} children={textToDisplay} />
            </div>
        </div>
    );
}