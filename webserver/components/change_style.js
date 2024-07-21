import { useState, useEffect, useRef } from "react"
import Image from "next/image";
import MB_Button from "./MB_Button";

export default function ChangeStyle({useSerif}) {

    const [scrollAway, setScrollAway] = useState(false);
    const [showColourSelection, setShowColourSelection] = useState(false);
    const [buttonPressed, setButtonPressed] = useState(false);

    useEffect(() => {
        let lastScrollTop = 0;
        const handleScroll = () => {
          const st = window.pageYOffset || document.documentElement.scrollTop;
          if (st > lastScrollTop) {
            // Scroll down
            setScrollAway(true);
            setShowColourSelection(false)
          } else {
            // Scroll up
            setScrollAway(false);
          }
          lastScrollTop = st <= 0 ? 0 : st; // For mobile or negative scrolling
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getbackgoundStyle = (pos) => {
        let styles = "flex px-4 w-fit h-8 bg-blue-300 shadow items-center justify-center transition-all duration-300 font-medium"

        if (pos == "middle") null;
        else if (pos == "end") styles += " rounded-r-2xl"
        else if (pos == "start") styles += " rounded-l-2xl"

        if (showColourSelection) styles += " opacity-0 pointer-events-none"

        return styles;
    }

    return (
        <div className={`mr-3 overflow-scroll flex`}>

            <div className={getbackgoundStyle("start")}>
                <Image className='cursor-pointer ' src={'/images/svgs/colour_icon.svg'} width={25} height={25} onClick={() => {setButtonPressed(!buttonPressed); setShowColourSelection(!showColourSelection)}}></Image>
            </div>

            <div className={`${showColourSelection ? '' : 'opacity-0 pointer-events-none'}`}>
                <div className={`ml-2 flex space-x-3 ${getbackgoundStyle("middle")}`}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer WhiteBackgroundColour"></div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer CreamBackgroundColour"></div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer GreyBackgroundColour"></div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer DarkGreyBackgroundColour"></div>
                </div>

                <div className={`ml-2 flex space-x-3 ${getbackgoundStyle("end")}`}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer font-serif font-medium text-xl" onClick={() => {useSerif(true)}}>A</div>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer font-sans font-medium text-xl" onClick={() => {useSerif(false)}}>A</div>
                </div>
            </div>
                        
        </div>
    );

  }