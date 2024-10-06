import InputBox from "./inputBox"
import { useState, useEffect, useRef } from "react"
import Image from "next/image";
import MB_Button from "./MB_Button";

export default function OldSuggestionTextBox({aiSearching, filter_keywords, add_to_keywords, chipsText, selectedChips_text, defaultText, page_title_callback}) {

    const containerRef = useRef(null); // Ref for the container
    const [filteredChips, setFilteredChips] = useState(chipsText);
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [userText, setUserText] = useState("")
    const [showAISupportBox, setShowAISupportBox] = useState(false)

    const onChange = (e) => {
        const usermsg = e.target.value

        if (usermsg.startsWith("/")) {
            setShowAISupportBox(true)
        }
        else {
            setShowAISupportBox(false)
        }

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
            <div className="h-9 flex space-x-3">
                <InputBox 
                    onKeyPress={handleKeyPress}  // Call handleKeyPress directly
                    onChange={onChange} 
                    valueStorage={userText} 
                    onFocus={() => setShowSuggestions(true)} 
                    defaultText={defaultText}
                />

                {showAISupportBox && (
                    <MB_Button 
                        text="send"
                        lowercase={true}
                        btnAction = {() => {filter_keywords(userText)}}/>
                )}
            </div>
                <div className={`${showSuggestions  ? '' : 'invisible'} Neo-Brutal-White z-10 mt-1 max-h-96 overflow-y-auto h-auto overflow-x-hidden shadow-MB border-2 rounded-md`}>
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
                </div>

        </div>
    )
}





