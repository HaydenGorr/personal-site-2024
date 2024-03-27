import Chip from "./chip";
import Image from "next/image";

export default function ClosableChip({chip_text, remove_keywords, index=0 }) {
    return (
        <div className="flex cursor-pointer border-2 rounded-md border-black pr-1" onClick={() => {remove_keywords(chip_text)}}>
            <Chip chip_text={chip_text} index={index} disble_border={true}/>
            <div className="my-auto">
                <Image src="images/svgs/cancel.svg" width={24} height={24} ></Image>
            </div>
        </div>
    )
}