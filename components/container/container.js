import { useState, useEffect } from "react"
import Image from "next/image";
import Chip from "../chip";
import chip_colour_lookup from '../../chip_colour_lookup.json'

export default function Container({ title="", image_src="", body_text="", btnAction = () => {}, colour="bg-transparent", chips, add_keywords_to_filter }) {

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
        <div class={`${colour} flex flex-col btn-primary h-auto flex shadow-MB w-fit`}>
            <span class="my-auto leading-none font-medium mb-3 mt-1">{title}</span>
            <Image src={image_src} alt="" width={600} height={128} />
            <div className="flex mt-3">
                <p className="flex grow mr-10">{body_text}</p>
                <Image className='cursor-pointer' src='/images/svgs/uparrow.svg' width={24} height={24}></Image>
            </div>

            <div className="flex flex-wrap w-auto mt-2">
                {chips.map((chip_text, index) => (
                    <Chip chip_text={chip_text} add_keywords_to_filter={add_keywords_to_filter} index={index}></Chip>
                ))}
            </div>

        </div>
    )
}
