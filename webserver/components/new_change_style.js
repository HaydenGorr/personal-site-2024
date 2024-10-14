import { useState, useEffect, useRef } from "react"
import Image from "next/image";
import MB_Button from "./MB_Button";
import { getPrimaryColour, getSecondaryColour, getTextColour, updateThemeColor } from '../utils/colour';
import Cookies from 'js-cookie'

export default function NewChangeStyle({setFontUsed, setBackgroundColour}) {

    const [scrollAway, setScrollAway] = useState(false);
    const [hide, setHide] = useState(false);
    const [showColourSelection, setShowColourSelection] = useState(false);
    const [buttonPressed, setButtonPressed] = useState(false);

    const background_colour_array = ["WhiteBackgroundColour", "CreamBackgroundColour", "GreyBackgroundColour", "DarkGreyBackgroundColour"]

    useEffect(() => {
        let lastScrollTop = 0;
        const handleScroll = () => {
            setButtonPressed(false);
            const st = window.pageYOffset || document.documentElement.scrollTop;
            if (st > lastScrollTop) {
                // Scroll down
                setScrollAway(true)
                setHide(false)
            } else {
                // Scroll up
                setScrollAway(false)
            }
            lastScrollTop = st <= 0 ? 0 : st; // For mobile or negative scrolling
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleHide = () => {
        setTimeout(() => {
            setHide(!hide);
        }, 200);
    };

    const change_background_style_callback = (colour) => {
        Cookies.set('backgroundColour', colour)
            setBackgroundColour(colour)
            updateThemeColor(getPrimaryColour(colour))
    }

    const setFontCallback = (font) => {
        setFontUsed(font); 
        Cookies.set('user_font', font);
    }

    return (
        <div className={`mx-3 overflow-visible flex`}>

            {/** Button */}
            <div 
                className={
                    `z-10 rounded-md flex items-center px-2 bg-dg-400 transition-all ease-in-out relative
                    ${buttonPressed ? '' : 'cursor-pointer'} 
                    ${scrollAway ? 'h-2 opacity-30 duration-500 ' : 'duration-200 h-9 opacity-100'} 
                    ${buttonPressed ? 'w-full h-28' : 'w-[calc(8rem + 0.5rem + 1.5rem)]'}`
                }
                onClick={() => {
                        if (buttonPressed) return;
                        if (scrollAway) { setScrollAway(false) }
                        else { setButtonPressed(!buttonPressed); handleHide();}
                    }}>

                {!hide && <div className={`flex transition-opacity w-full ${scrollAway || buttonPressed ? 'opacity-0 duration-200' : 'opacity-100 duration-500'}`}>
                    <div className={`h-6 w-6 rounded-md transition-colors duration-500 mr-2 ${Cookies.get('backgroundColour') || "DarkGreyBackgroundColour"}`}/> 
                    <div className={`${Cookies.get('user_font') || "font-Josefin"}`}>typeface</div>
                </div>}

                {hide && <div className="identify w-full h-full p-4 flex flex-col justify-between">
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <div className={`h-5 font-Josefin font-medium text-xl cursor-pointer translate-y-0.5`} onClick={() => {setFontCallback("font-Josefin")}}>Sans-Serif</div>
                            <div className={`h-5 font-serif font-medium text-xl cursor-pointer`} onClick={() => {setFontCallback("font-serif")}}>Serif</div>
                            <div className={`h-5 font-dys font-medium text-xl cursor-pointer`} onClick={() => {setFontCallback("font-dys")}}>Dyslexic</div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            {background_colour_array.map((CSScolour, index) => {
                                return <div key={index} className={`h-5 w-12 rounded-md ${CSScolour} cursor-pointer`} onClick={() => {change_background_style_callback(CSScolour)}}/>
                            })}
                        </div>
                    </div>
                </div>}
                
            </div>
                        
        </div>
    );

  }