import Image from "next/image";

export default function Chip({chip_text, add_keywords_to_filter = () => {}, index=0, disble_border=false }) {

    return (
        <div key={index} className={`flex pl-1 pr-2 py-1 text-xs font cursor-pointer ${disble_border ? '' : 'Neo-Brutal-White-Small'}`} onClick={() => add_keywords_to_filter(chip_text)}>
            <Image className="mr-2" src={`/images/chip_icons/${chip_text.toLowerCase()}.svg`} width={20} height={20}></Image>
            {chip_text}
        </div>
    )
}