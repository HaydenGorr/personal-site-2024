import Chip from "./chip";
import Image from "next/image";
import { useState } from "react";

export default function ClosableChip({chip_text, remove_keywords, index=0, svg_path="" }) {
    const [mouseOverX, setMouseOverX] = useState(false);

    const handleMouseOver = (e) => {
        setMouseOverX
    };

    return (
        <div className="flex cursor-pointer Neo-Brutal-White-Small pr-1" onClick={() => {remove_keywords(chip_text)}}>
            <Chip chip_text={chip_text} index={index} disble_border={true}/>
            {svg_path != "" && <div className={`my-auto mr-1 transition-all duration-150 ${mouseOverX ? "size-4": "size-3"}`} onMouseOver={() => setMouseOverX(true)} onMouseLeave={() => setMouseOverX(false)}>
                <Image src={svg_path} width={25} height={25} alt="close button image"></Image>
            </div>}
        </div>
    )
}