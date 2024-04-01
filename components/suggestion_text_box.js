import InputBox from "./inputBox"
import { useState, useEffect, useRef } from "react"
import Image from "next/image";
import { get_response } from "../utils/ai_talk";

export default function SuggestionTextBox({filter_keywords, add_to_keywords, chipsText, selectedChips_text, defaultText}) {

    const containerRef = useRef(null); // Ref for the container
    const [filteredChips, setFilteredChips] = useState(chipsText);
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [userText, setUserText] = useState("")

    const onChange = (e) => {
        const usermsg = e.target.value
        
        setUserText(usermsg);

        const newFilter = chipsText.filter( chipText => chipText.toLowerCase().includes(usermsg.toLowerCase()))
        setFilteredChips(newFilter)
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            filter_keywords(userText);
        }
    };

    const shouldGreyout = (text) => {
        return selectedChips_text.includes(text)
    }

    // Listen for clicks outside of the component to close suggestions
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
        <div className="flex flex-col" ref={containerRef}>
            <div className="h-9">
            <InputBox 
                onKeyDown={handleKeyPress}  // Call handleKeyPress directly
                onChange={onChange} 
                valueStorage={userText} 
                onFocus={() => setShowSuggestions(true)} 
                defaultText={defaultText}
            />
            </div>
            {showSuggestions && (
                <div className="Neo-Brutal-White z-10 mt-1 max-h-96 overflow-y-auto h-auto overflow-x-hidden shadow-MB border-2 rounded-md">
                    <ul>
                        {filteredChips.map((text, index) => (
                            <div className={`flex pl-3 py-1.5 cursor-pointer hover:bg-neutral-200 ${shouldGreyout(text) ? "cursor-default text-neutral-300" : ''}`} onClick={() => {add_to_keywords(text)}}>
                                <div className={`${shouldGreyout(text) ? "opacity-25" : ""} flex`}> {/* Adjust the opacity value as needed */}
                                    <Image className="mr-3" src={`/images/chip_icons/${text.toLowerCase()}.svg`} width={25} height={25}/>
                                </div>
                                <li key={index}>{text}</li>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}





