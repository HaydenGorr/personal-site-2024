import Chip from "./chip";
import Image from "next/image";

export default function NewClosableChip({chip_text, remove_keywords, index=0, svg_path="", children }) {
    return (
        <div
        key={index} 
        className={`bg-gray-200 px-4 py-2 rounded-3xl font-medium text-xs max-h-8 h-8 flex`}
        onClick={() => add_keywords_to_filter(chip_text)}>
            <div className="flex self-center items-center">
                <Image 
                className="mr-2"
                src={svg_path}
                width={20}
                height={20}/>

                <p className="flex text-center leading-none m-0 mt-0.5">{chip_text}</p>
            </div>

            {children}
            
        </div>
    )
}