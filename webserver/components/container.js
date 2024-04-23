import Image from "next/image";
import ClosableChip from "./closable_chip";
import { useRouter } from 'next/router'
import { getDaysAgo } from '../utils/date_utils'

export default function Container({ chips=null, home_post_obj, btnAction = () => {}, colour="bg-transparent", add_keywords_to_filter, selectedKeywords, remove_keyword_from_filer, override = false }) {
    const router = useRouter();

    const go_to_article = (title) => {
        if (title != "") router.push(`/article/${title}`)
        else {
            router.push(`/missingArticle`)
        }
    }

    return (
        <div className={`${override ? "" : colour + "flex flex-col Neo-Brutal-White px-3 pb-3 h-auto flex shadow-MB w-fit container-max-width"}`}>

            <div className="flex items-center my-6 font-medium text-xl leading-none justify-center">
                <div>
                    {home_post_obj.title}
                </div>
                
            </div>

            <Image className="rounded-md overflow-hidden cursor-pointer"
                src={`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/CMS/articles/${home_post_obj["source"]}/container.png`}
                unoptimized={true}
                alt=""
                width={600}
                height={128}
                onClick={() => {go_to_article(home_post_obj.source)}}
            />

            <div className="flex mt-3 w-full">
                <div className="flex mt-3 flex-col w-full">
                    <p className="flex grow mr-10 text-base font-medium	">{home_post_obj.desc}</p>
                    <div className="flex w-full">
                        {/* <p className="font-sm mt-3 text-gray-500 text-xs">{home_post_obj.infoText + " -"}</p> */}
                        <p className="font-sm mt-3 text-gray-500 text-xs">{"published " + getDaysAgo(home_post_obj.publishDate)}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-300 h-px mt-4"></div>


            <div className={`flex flex-wrap mt-2`}>
                {( chips ? chips : home_post_obj.chips).map((chip_text, index) => (
                    <div className={`mr-3 mt-3`}>
                        <ClosableChip
                            key={index}
                            chip_text={chip_text}
                            remove_keywords={selectedKeywords.includes(chip_text) ? remove_keyword_from_filer : add_keywords_to_filter}
                            svg_path={`images/svgs/${selectedKeywords.includes(chip_text) ? "star" : "add"}.svg`}
                        />
                    </div>
                ))}
            </div>
        </div>
    )

}
