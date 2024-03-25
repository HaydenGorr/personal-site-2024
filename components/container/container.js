import { useState, useEffect } from "react"
import Image from "next/image";

import chip_colour_lookup from '../../chip_colour_lookup.json'

export default function Container({ title="", image_src="", body_text="", btnAction = () => {}, colour="bg-transparent", button_type=false, chips }) {

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
        <div className={`${colour} flex flex-col btn-primary h-auto flex shadow-MB w-fit`}>
            <span className="my-auto leading-none font-medium mb-3 mt-1">{title}</span>
            <Image src={image_src} alt="" width={600} height={128} />
            <div className="flex mt-3">
                <p className="flex grow mr-10">{body_text}</p>
                <Image className='cursor-pointer' src='/images/svgs/uparrow.svg' width={24} height={24}></Image>
            </div>

            <div className="flex flex-wrap w-auto mt-2">
                {chips.map((chip_text, index) => (
                    <div key={index} className="flex my-1 mr-1 px-1 py-1 text-xs font cursor-pointer border-2 rounded-md border-black">
                        <Image className="mr-1" src={`/images/chip_icons/${chip_text.toLowerCase()}.svg`} width={20} height={20}></Image>
                        {chip_text}
                    </div>
                ))}
            </div>

        </div>
    )
}
