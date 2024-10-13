import InputBox from "./inputBox"
import { useState, useEffect, useRef } from "react"
import Image from "next/image";
import MB_Button from "./MB_Button";
import { ThreeDots  } from 'react-loading-icons'

export default function SuggestionTextBox({messageQueryingAI, tagSearchingAI, getTagsFromAI, chipsText, setUserText, userText, SendMessageToAI, topChildren, bottomChildren}) {

    const containerRef = useRef(null); // Ref for the container

    const onChange = (e) => {
        const usermsg = e.target.value

        setUserText(usermsg);

        // const newFilter = chipsText.filter( chipText => chipText.toLowerCase().includes(usermsg.toLowerCase()))
        // setFilteredChips(newFilter)
    }

    return (
        <div className="flex flex-col" ref={containerRef}>
            {topChildren}
            <div className="h-9 flex space-x-3">
                <input
                    className={`bg-dg-600 text-dg-50 h-full w-full px-3 focus:outline-none rounded-md shadow-strong-drop placeholder-dg-300 placeholder-italic placeholder-opacity-75`}
                    type="text"
                    value={userText} // Bind the input value to the component's state
                    onChange={onChange} // Update the state every time the input changes
                    placeholder={"Type here"}
                />    
                <button
                    className={`px-2 rounded-md w-9 ${ tagSearchingAI ? 'bg-dy-200' : 'bg-dg-200'}`}
                    lowercase={true}
                    onClick = {() => {getTagsFromAI(userText)}}>
                    {!tagSearchingAI && <Image 
                        className=""
                        src={`/images/search_icon.png`}
                        width={25}
                        height={25}/>}
                    { tagSearchingAI && <ThreeDots style={{width:"1rem"}} fill="#C07F1F" speed={.75}/>}

                </button>

                <button
                    className={`px-2 rounded-md w-9 ${ messageQueryingAI ? 'bg-dy-200' : 'bg-dg-200'}`}
                    lowercase={true}
                    onClick = {() => {SendMessageToAI(userText)}}>
                    { !messageQueryingAI && <Image 
                        className="mt-0.5"
                        src={`/images/chat_icon.png`}
                        width={25}
                        height={25}/>}

                    { messageQueryingAI && <ThreeDots style={{width:"1rem"}} fill="#C07F1F" speed={.75}/>}
                </button>
            </div>

            <div className="font-normal text-xs mt-2">
                <span className="font-bold text-xs">Describe</span> what you want or <span className="font-bold text-xs">ask</span> a question. This feature uses generative AI to find content.
            </div>

            {bottomChildren}
        </div>
    )
}





