import Image from "next/image";
import { getPrimaryColour, getSecondaryColour, getTirtaryColour, getTextColour } from '../utils/colour';

export default function Chip({chip_text, add_keywords_to_filter = () => {}, index=0, disble_border=false, backgroundColour=null }) {

    const hasFunctionality = add_keywords_to_filter !== (() => {});

    const getChipBackgroundColour = () => {
        if (backgroundColour === 'WhiteBackgroundColour') return "rgb(255, 255, 255)"
        else if (backgroundColour === 'CreamBackgroundColour')  return "rgb(255, 251, 238)"
        else if (backgroundColour === 'GreyBackgroundColour')  return "rgb(110, 109, 115)"
        else if (backgroundColour === 'DarkGreyBackgroundColour') return "rgb(56, 56, 56)"
    }

    return (
        <div
        key={index} 
        className={`transition-colors duration-500 flex pl-1 pr-2 py-1 text-xs font ${hasFunctionality ? "cursor-pointer" : 'cursor-default'} ${disble_border ? '' : 'Neo-Brutal-White-Small'}`}
        style={{
            backgroundColor: getPrimaryColour(backgroundColour),
            color: getTextColour(backgroundColour)}}
        onClick={() => add_keywords_to_filter(chip_text)}>
            <div className="flex">
                <Image 
                className="mr-2"
                src={`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/TAG_SVGS/${chip_text.toLowerCase()}.svg`}
                width={20}
                height={20}
                alt={`${chip_text} icon`}/>

                <p>{chip_text}</p>
            </div>
            
        </div>
    )
}