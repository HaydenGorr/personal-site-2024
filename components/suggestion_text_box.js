import InputBox from "./inputBox"
import { useState, useEffect, useRef } from "react"
import Image from "next/image";

export default function SuggestionTextBox({add_to_keywords, chipsText, selectedChips_text}) {

    const containerRef = useRef(null); // Ref for the container
    const [filteredChips, setFilteredChips] = useState(chipsText);
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [userText, setUserText] = useState("")
    const onChange = (e) => {
        setUserText(e.target.value);

        const newFilter = chipsText.filter( chipText => chipText.toLowerCase().includes(e.target.value.toLowerCase()))
        setFilteredChips(newFilter)
    }

    const shouldGreyout = (text) => {
        // Is clickable
        const styling =  selectedChips_text.includes(text) ? "cursor-default bg-neutral-700 text-neutral-500" : ""

        return styling
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
                <InputBox onChange={onChange} valueStorage={userText} onFocus={() => setShowSuggestions(true)}/>
            </div>
            {showSuggestions && (
                <div className="bg-black text-white z-10 mt-1 h-96 overflow-scroll">
                    <ul>
                        {filteredChips.map((text, index) => (
                            <div className={`flex ${index % 2 == 0 ? "bg-black " : "bg-white text-black "} pl-3 py-1.5 cursor-pointer ${shouldGreyout(text)}`} onClick={() => {add_to_keywords(text)}}>
                                <Image className="mr-3" src={`/images/chip_icons/${text.toLowerCase()}.svg`} width={20} height={20}/>
                                <li key={index}>{text}</li>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}





