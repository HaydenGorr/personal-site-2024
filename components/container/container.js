import { useState, useEffect } from "react"
import Image from "next/image";
import Chip from "../chip";
import chip_colour_lookup from '../../chip_colour_lookup.json'
import ClosableChip from "../closable_chip";

export default function Container({ home_post_obj, btnAction = () => {}, colour="bg-transparent", add_keywords_to_filter, selectedKeywords, remove_keyword_from_filer}) {

    useEffect(() => {
        // setBtnText(lowercase ? text : text.toUpperCase())
    });

    const handleClick = (event) => {
        if (!given_href) {
            event.preventDefault(); // Prevent navigation if href is empty
        }
        btnAction(); // Call additional action if provided
    };

    return (
        <div className={`${colour} flex flex-col Neo-Brutal-White px-3 pb-3 h-auto flex shadow-MB w-fit`}>

            <div className="flex items-center my-6 font-medium text-xl leading-none justify-center">
                <div>
                    {home_post_obj.title}
                </div>
            </div>

            <Image className="rounded-md overflow-hidden" src={home_post_obj.image} alt="" width={600} height={128} />
            <div className="flex mt-3">
                <div className="flex mt-3 flex-col">
                    <p className="flex grow mr-10 text-base font-medium	">{home_post_obj.desc}</p>
                    <p className="font-sm mt-3 text-gray-500 text-sm">{home_post_obj.infoText}</p>
                </div>
                {/* <Image className='cursor-pointer' src='/images/svgs/uparrow.svg' width={24} height={24}></Image> */}
            </div>

            <div className="flex flex-wrap w-auto mt-2">
                {home_post_obj.chips.map((chip_text, index) => (
                    <div className={`mr-3 mt-3`}>
                    {/* <Chip chip_text={chip_text} add_keywords_to_filter={add_keywords_to_filter} index={index}/> */}
                    <ClosableChip key={index} chip_text={chip_text} remove_keywords={selectedKeywords.includes(chip_text) ? remove_keyword_from_filer : add_keywords_to_filter} svg_path={`images/svgs/${selectedKeywords.includes(chip_text) ? "star" : "add"}.svg`} />
                    </div>
                ))}
            </div>

        </div>
    )
}
