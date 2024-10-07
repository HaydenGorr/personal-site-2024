import InputBox from "./inputBox"
import { useState, useEffect, useRef } from "react"
import Image from "next/image";
import MB_Button from "./MB_Button";

export default function AiResponseBox({aiSearching, add_to_keywords, chipsText, selectedChips_text, setUserText, userText, page_title_callback, SendMessageToAI}) {

    const containerRef = useRef(null); // Ref for the container
    const [filteredChips, setFilteredChips] = useState(chipsText);
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [showAISupportBox, setShowAISupportBox] = useState(false)

    const shouldGreyout = (text) => {
        return selectedChips_text.includes(text)
    }
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [containerRef]);

    return (
        <div className="">

            {<div className={`${showSuggestions  ? '' : 'invisible'} Neo-Brutal-White z-10 mt-1 max-h-96 overflow-y-auto h-auto overflow-x-hidden shadow-MB border-2 rounded-md`}>
                <ul>
                    {!showAISupportBox && filteredChips.map((text, index) => (
                        <div className={`flex pl-3 py-1.5 cursor-pointer hover:bg-neutral-200 ${shouldGreyout(text) ? "cursor-default text-neutral-300" : ''}`} onClick={() => {add_to_keywords(text); page_title_callback("Custom search")}}>
                            <div className={`${shouldGreyout(text) ? "opacity-25" : ""} flex`}> {/* Adjust the opacity value as needed */}
                                <Image className="mr-3" src={`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/TAG_SVGS/${text.toLowerCase()}.svg`} width={25} height={25}/>
                            </div>
                            <li key={index}>{text}</li>
                        </div>
                    ))}

                    {showAISupportBox && (
                        <div className={`text-center p-3 font-medium ${aiSearching ? 'animate-pulse' : ''}`}>
                            {aiSearching ? "searching" : `example: 'major ios projects'`}
                        </div>
                    )}

                </ul>
            </div>}

        </div>
    )
}





