import Image from "next/image";

export default function Chip({chip_text, add_keywords_to_filter = () => {}, index=0 }) {

    return (
        <div key={index} className="flex my-1 mr-1 px-1 py-1 text-xs font cursor-pointer border-2 rounded-md border-black" onClick={() => add_keywords_to_filter(chip_text)}>
            <Image className="mr-1" src={`/images/chip_icons/${chip_text.toLowerCase()}.svg`} width={20} height={20}></Image>
            {chip_text}
        </div>
    )
}