import Image from "next/image";
import ClosableChip from "./closable_chip";
import { useRouter } from 'next/router'
import { getDaysAgo } from '../utils/date_utils'
import { useState, useEffect } from "react";
import hash_colour_picker from "../utils/hash_colour_picker";

const selectMainColour = (hashable_string) => {
    const colourList = ['dg', 'dy', 'dr', 'dpu', 'dpi']
    const randomIndex = Math.floor(hash_colour_picker(hashable_string));
    // const randomIndex = Math.floor(Math.random() * colourList.length);
    return colourList[randomIndex]
}

export default function NewContainer({ chips=null, home_post_obj, btnAction = () => {}, colour="bg-transparent", add_keywords_to_filter, selectedKeywords, remove_keyword_from_filer, override = false }) {
    const router = useRouter();

    const [hasImage, setHasImage] = useState(false);

    const [matchedChips, setMatchedChips] = useState([]);
    const [unmatchedChips, setUnatchedChips] = useState([]);

    const classes = colourClasses[selectMainColour(home_post_obj.desc)] || {};

    const go_to_article = (title) => {
        if (title != "") router.push(`/article/${title}`)
        else {
            router.push(`/missingArticle`)
        }
    }

    useEffect(() => {



        const checkImage = async () => {
          const url = `${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/CMS/articles/${home_post_obj["source"]}/container.png`;
    
          try {
            const response = await fetch(url);
            setHasImage(response.status === 200);
          } catch (error) {
            setHasImage(true); // If the request errors then assume the image is there just in case it is
          }
        };

        setMatchedChips(home_post_obj.chips.filter(chip_text => selectedKeywords.includes(chip_text)))
        setUnatchedChips(home_post_obj.chips.filter(chip_text => !selectedKeywords.includes(chip_text)))
    
        checkImage();
      }, [home_post_obj, selectedKeywords]);


    return (
        <div className={`relative font-Josefin ${classes.textColor200}`}>
            <div className="relative rounded-2xl overflow-hidden w-80 h-128">
                {hasImage && (<Image
                    src={`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/CMS/articles/${home_post_obj["source"]}/container.png`}
                    alt="Description of image"
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => { go_to_article(home_post_obj.source) }}
                />)}
                {/** Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t to-transparent opacity-95 ${classes.fromColor700}`} />
                <div className={`absolute inset-0 bg-gradient-to-t to-transparent opacity-30 from-black`} />
                <div className={`absolute inset-0 ${classes.bgRadialGradient} opacity-75`}/>
            </div>

            <div className="absolute inset-0 flex-col flex space-y-4 justify-center my-8 px-4">
                <span className={`text-3xl font-semibold`}>
                    {home_post_obj.title}
                </span>
            </div>

            <div className="absolute inset-0 flex-col flex space-y-4 justify-end my-4 px-4">
                <span className="text-sm font-medium line-clamp-4">
                    {home_post_obj.desc}
                </span>

                <button
                    className={`z-50 self-center rounded-xl w-fit px-6 text-center ${classes.textColor700} text-sm font-medium ${classes.bgColor200}`}
                    onClick={() => {go_to_article(home_post_obj.source)}}>
                      <div className="my-1 mt-2">READ</div>
                </button>
            </div>

            <p className="absolute left-0 top-4 ml-4 text-xs">{getDaysAgo(home_post_obj.publishDate)}</p>
            
            {/* <div className={`absolute inset-3 flex space-x-2 overflow-hidden w-full h-fit`}
              style={{maskImage: 'linear-gradient(to right, black, transparent)', WebkitMaskImage: 'linear-gradient(to right, black, transparent)'}}>
                {matchedChips.map((chip_text, index) => (
                    <div>
                        {<div className={`h-6 w-6 rounded-full flex items-center justify-center shadow-strong-drop ${ classes.bgColor400 }`}>
                            <Image src={`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/TAG_SVGS/${chip_text.toLowerCase()}.svg`} width={15} height={15} ></Image>
                        </div>}
                    </div>
                ))}
                
                {unmatchedChips.map((chip_text, index) => (
                    <div>
                        <div className={`h-4 w-4 rounded-full flex items-center justify-center shadow-inner-strong ${ classes.bgColor100 }`}>
                            <Image src={`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/TAG_SVGS/${chip_text.toLowerCase()}.svg`} width={10} height={10} ></Image>
                        </div>
                    </div>
                ))}
            </div> */}
        </div>
    )

}

const colourClasses = {
    dg: {
      textColor200: 'text-dg-200',
      fromColor700: 'from-dg-700',
      bgRadialGradient: 'bg-dg-radial-gradient',
      textColor700: 'text-dg-700',
      bgColor200: 'bg-dg-200',
      bgColor400: 'bg-dg-400',
      bgColor100: 'bg-dg-100',
    },
    dy: {
      textColor200: 'text-dy-200',
      fromColor700: 'from-dy-700',
      bgRadialGradient: 'bg-dy-radial-gradient',
      textColor700: 'text-dy-700',
      bgColor200: 'bg-dy-200',
      bgColor400: 'bg-dy-400',
      bgColor100: 'bg-dy-100',
    },
    dr: {
      textColor200: 'text-dr-200',
      fromColor700: 'from-dr-700',
      bgRadialGradient: 'bg-dr-radial-gradient',
      textColor700: 'text-dr-700',
      bgColor200: 'bg-dr-200',
      bgColor400: 'bg-dr-400',
      bgColor100: 'bg-dr-100',
    },
    dpu: {
      textColor200: 'text-dpu-200',
      fromColor700: 'from-dpu-700',
      bgRadialGradient: 'bg-dpu-radial-gradient',
      textColor700: 'text-dpu-700',
      bgColor200: 'bg-dpu-200',
      bgColor400: 'bg-dpu-400',
      bgColor100: 'bg-dpu-100',
    },
    dpi: {
      textColor200: 'text-dpi-200',
      fromColor700: 'from-dpi-700',
      bgRadialGradient: 'bg-dpi-radial-gradient',
      textColor700: 'text-dpi-700',
      bgColor200: 'bg-dpi-200',
      bgColor400: 'bg-dpi-700', // Made this 700, because 400 was too light for the text in my testing
      bgColor100: 'bg-dpi-100',
    },
  };
  