import { useState, useEffect, useRef } from "react"
import Image from "next/image";
import MB_Button from "./MB_Button";

export default function ChangeStyle({}) {

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
      

    const getButtonStyle = () => {
        let styles = "flex px-4 w-fit h-8 bg-blue-300 shadow items-center justify-center cursor-pointer hover:bg-red-400 transition-all duration-300 font-medium"

        if (scrollAway) styles += " translate-y-40"

        if (showColourSelection) styles += " rounded-b-2xl rounded-r-2xl"
        else styles += " rounded-2xl"

        return styles;
    }

    return (
        <div className={``}>

            <div onClick={() => {setButtonPressed(!buttonPressed); setShowColourSelection(!showColourSelection)}} className={getButtonStyle()}>
                <Image className='' src={'/images/svgs/colour_icon.svg'} width={25} height={25}></Image>
            </div>
                        
        </div>
    );

  }