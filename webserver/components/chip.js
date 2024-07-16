import Image from "next/image";

export default function Chip({chip_text, add_keywords_to_filter = () => {}, index=0, disble_border=false }) {

    const hasFunctionality = add_keywords_to_filter !== (() => {});

    return (
        <div
        key={index} 
        className={`flex pl-1 pr-2 py-1 text-xs font ${hasFunctionality ? "cursor-pointer" : 'cursor-default'} ${disble_border ? '' : 'Neo-Brutal-White-Small'}`}
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