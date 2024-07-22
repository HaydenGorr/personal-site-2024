import { useState, useEffect, useRef } from "react"
import Image from "next/image";
import MB_Button from "./MB_Button";
import { getPrimaryColour, getSecondaryColour, getTextColour, updateThemeColor } from '../utils/colour';

export default function ChangeStyle({setFontUsed, setBackgroundColour}) {

    const [scrollAway, setScrollAway] = useState(false);
    const [showColourSelection, setShowColourSelection] = useState(false);
    const [buttonPressed, setButtonPressed] = useState(false);

    useEffect(() => {
        let lastScrollTop = 0;
        const handleScroll = () => {
            setButtonPressed(false);
            const st = window.pageYOffset || document.documentElement.scrollTop;
            if (st > lastScrollTop) {
                // Scroll down
            } else {
                // Scroll up
            }
            lastScrollTop = st <= 0 ? 0 : st; // For mobile or negative scrolling
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getbackgoundStyle = (pos) => {
        let styles = "flex px-4 w-fit h-8 shadow items-center justify-center transition-all duration-300 font-medium"

        if (pos == "middle") null;
        else if (pos == "end") styles += " rounded-r-2xl"
        else if (pos == "start" && buttonPressed) styles += " rounded-l-2xl rounded-r-sm"
        else if (pos == "start" && !buttonPressed) styles += " rounded-2xl"

        return styles;
    }

    return (
        <div className={`mr-3 overflow-hidden flex`}>

            <div className={"cursor-pointer z-10 bg-blue-300 " + getbackgoundStyle("start")} onClick={() => {setButtonPressed(!buttonPressed);}}>
                <Image className='' src={'/images/svgs/colour_icon.svg'} width={25} height={25}></Image>
            </div>

            <div className={`${buttonPressed ? '' : 'z-9 opacity-0 pointer-events-none'} flex transition-all duration-300 overflow-hidden`}>
                <div className={`ml-2 flex space-x-3 ${getbackgoundStyle("middle")} ${!buttonPressed ? ' -translate-x-40' : ''} bg-blue-400 rounded-sm`}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer WhiteBackgroundColour"
                        onClick={() => {
                            setBackgroundColour("WhiteBackgroundColour")
                            updateThemeColor(getPrimaryColour("WhiteBackgroundColour"))
                            }}></div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer CreamBackgroundColour"
                    onClick={() => {
                        setBackgroundColour("CreamBackgroundColour")
                        updateThemeColor(getPrimaryColour("CreamBackgroundColour"))
                    }}></div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer GreyBackgroundColour"
                    onClick={() => {
                        setBackgroundColour("GreyBackgroundColour")
                        updateThemeColor(getPrimaryColour("GreyBackgroundColour"))
                    }}></div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer DarkGreyBackgroundColour"
                    onClick={() => {
                        setBackgroundColour("DarkGreyBackgroundColour")
                        updateThemeColor(getPrimaryColour("DarkGreyBackgroundColour"))
                    }}></div>
                </div>

                <div className={`ml-2 flex space-x-3 ${getbackgoundStyle("end")} ${!buttonPressed ? ' -translate-x-40' : ''} bg-blue-500 rounded-sm`}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer font-serif font-medium text-xl" onClick={() => {setFontUsed("font-serif")}}>A</div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer font-sans font-medium text-xl" onClick={() => {setFontUsed("font-sans")}}>A</div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer font-dys font-medium text-xl" onClick={() => {setFontUsed("font-dys")}}>D</div>
                </div>
            </div>
                        
        </div>
    );

  }