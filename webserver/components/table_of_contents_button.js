import { useState, useEffect, useRef } from "react"
import Image from "next/image";
import MB_Button from "./MB_Button";

export default function TableOfContentsButton({headers, scrollToText}) {

    const [scrollAway, setScrollAway] = useState(false);
    const [showTOC, setShowTOC] = useState(true);
    const [buttonPressed, setButtonPressed] = useState(false);

    useEffect(() => {
        let lastScrollTop = 0;
        const handleScroll = () => {
          const st = window.pageYOffset || document.documentElement.scrollTop;
          if (st > lastScrollTop) {
            // Scroll down
            setScrollAway(true);
            setShowTOC(false)
          } else {
            // Scroll up
            setScrollAway(false);
          }
          lastScrollTop = st <= 0 ? 0 : st; // For mobile or negative scrolling
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
      
    const displayTableOfContents = (headers) => {
        let lastLevel = headers[0].level;
        let nestedContent = [];
        let lastMod = ''
        
        console.log(headers)
    
        headers.map((header, index) => {
          const level = header.level;
          const text = header.text;
    
          console.log(level)
    
          if (level > lastLevel){ // then nest it
            lastMod = `ml-${6 * (level - 2)}`
          }
          else if (level < lastLevel){ // then push it back / unnest it
            lastMod = ''
          }
          
          nestedContent.push(
            <div className={`${lastMod} px-3 flex`}>
                {level > 2 && <Image src={'/images/svgs/nested_arrow.svg'} width={15} height={15} className="mr-3"/>}
                <MB_Button text={text} btnAction={() => { scrollToText(text); setShowTOC(false) }} additional_styles="text-left" ></MB_Button>
            </div>
        )
          
    
          lastLevel = level;
        });
    
        return (
            nestedContent
        );
    };

    const getButtonStyle = () => {
        let styles = "flex px-4 w-fit h-8 bg-red-300 shadow items-center justify-center cursor-pointer hover:bg-red-400 transition-all duration-300 font-medium"

        if (scrollAway) styles += " translate-y-40"

        if (showTOC) styles += " rounded-b-2xl rounded-r-2xl"
        else styles += " rounded-2xl"

        return styles;
    }
    
    const getTOCStyle = () => {
        let styles = "bg-red-300 p-3 py-4 mb-2 transition-all duration-300 space-y-2 mr-4"

        if (showTOC) styles += " rounded-t-2xl rounded-r-2xl"
        else styles += " opacity-0 pointer-events-none rounded-2xl"

        return styles;
    }

    return (
        <div className={`fixed bottom-4 left-4 lg:left-1/2 lg:transform lg:-translate-x-96 overflow-visible text`}>
            <div className={getTOCStyle()}>
                {displayTableOfContents(headers)}
            </div>

            <div onClick={() => {setButtonPressed(!buttonPressed); setShowTOC(!showTOC)}} className={getButtonStyle()}>
                <Image className='' src={'/images/svgs/toc.svg'} width={25} height={25}></Image>
                {/* Table of Contents */}
            </div>
                        
        </div>
    );

  }