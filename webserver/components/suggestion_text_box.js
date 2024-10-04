import InputBox from "./inputBox"
import { useState, useEffect, useRef } from "react"
import Image from "next/image";
import MB_Button from "./MB_Button";
import { ThreeDots  } from 'react-loading-icons'

export default function SuggestionTextBox({messageQueryingAI, tagSearchingAI, getTagsFromAI, add_to_keywords, chipsText, selectedChips_text, setUserText, userText, page_title_callback, SendMessageToAI, topChildren, bottomChildren}) {

    const containerRef = useRef(null); // Ref for the container
    const [filteredChips, setFilteredChips] = useState(chipsText);
    const [showSuggestions, setShowSuggestions] = useState(false)
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
            {topChildren}
            <div className="h-9 flex space-x-3">
                <input
                    className={`bg-dg-600 text-dg-50 h-full w-full px-3 focus:outline-none rounded-md shadow-strong-drop placeholder-dg-300 placeholder-italic placeholder-opacity-75`}
                    type="text"
                    value={userText} // Bind the input value to the component's state
                    onChange={onChange} // Update the state every time the input changes
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={"Type here"}
                    onKeyPress={handleKeyPress}
                />    
                <button
                    className={`px-2 rounded-md w-9 ${ tagSearchingAI ? 'bg-dy-100' : 'bg-dg-100'}`}
                    lowercase={true}
                    onClick = {() => {getTagsFromAI(userText)}}>
                    {!tagSearchingAI && <Image 
                        className=""
                        src={`/images/search_icon.png`}
                        width={25}
                        height={25}/>}
                    { tagSearchingAI && <ThreeDots style={{width:"1rem"}} fill="#D9A227" speed={.75}/>}

                </button>

                <button
                    className={`px-2 rounded-md w-9 ${ tagSearchingAI ? 'bg-dy-100' : 'bg-dg-100'}`}
                    lowercase={true}
                    onClick = {() => {SendMessageToAI(userText)}}>
                    { !messageQueryingAI && <Image 
                        className="mt-0.5"
                        src={`/images/chat_icon.png`}
                        width={25}
                        height={25}/>}

                    { messageQueryingAI && <ThreeDots style={{width:"1rem"}} fill="#D9A227" speed={.75}/>}
                </button>
            </div>

            <div className="font-normal text-xs mt-1">
                Describe what you want. This feature uses <span className="font-bold text-xs"> generative AI </span> to find content.
            </div>

            {bottomChildren}
        </div>
    )
}





