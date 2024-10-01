import Chip from "./chip";
import Image from "next/image";

export default function NewClosableChip({chip_text, remove_keywords, index=0, svg_path="" }) {
    return (
        <div className="flex cursor-pointer overflow-hidden rounded-3xl shadow-inner" onClick={() => {remove_keywords(chip_text)}}>
            <Chip chip_text={chip_text} index={index} disble_border={true}/>
            {svg_path != "" && <div className="my-auto mr-1">
                <Image src={svg_path} width={15} height={15} ></Image>
            </div>}
        </div>
    )
}