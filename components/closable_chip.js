import Chip from "./chip";
import Image from "next/image";

export default function ClosableChip({chip_text, remove_keywords, index=0 }) {
    return (
        <div className="flex mr-3 cursor-pointer">
            <Chip chip_text={chip_text} index={index}/>
            <div className="my-auto">
                <Image src="images/svgs/cancel.svg" width={24} height={24} onClick={() => {remove_keywords(chip_text)}}></Image>
            </div>
        </div>
    )
}