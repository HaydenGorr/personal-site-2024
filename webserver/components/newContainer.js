import Image from "next/image";
import ClosableChip from "./closable_chip";
import { useRouter } from 'next/router'
import { getDaysAgo } from '../utils/date_utils'
import { useState, useEffect } from "react";

const selectMainColour = () => {
    const colourList = ['dg', 'dy', 'dr', 'dpu', 'dpi']
    const randomIndex = Math.floor(Math.random() * colourList.length);
    return colourList[randomIndex]
}

export default function NewContainer({ chips=null, home_post_obj, btnAction = () => {}, colour="bg-transparent", add_keywords_to_filter, selectedKeywords, remove_keyword_from_filer, override = false }) {
    const router = useRouter();

    const [hasImage, setHasImage] = useState(false);
    const [mainColour, setMainColour] = useState(selectMainColour() || 'dpi');

    const go_to_article = (title) => {
        if (title != "") router.push(`/article/${title}`)
        else {
            router.push(`/missingArticle`)
        }
    }
const classes = colourClasses[mainColour] || {};
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

        
    
        checkImage();
      }, [home_post_obj]);


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
                <div className={`absolute inset-0 ${classes.bgRadialGradient} opacity-25`}/>
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

                <button className={`self-center rounded-xl w-fit px-6 py-1 text-center ${classes.textColor700} text-sm font-medium ${classes.bgColor200}`}>READ</button>
            </div>

            <div className={`absolute inset-3 flex space-x-2`}>
                {home_post_obj.chips.map((chip_text, index) => (
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center ${ selectedKeywords.includes(chip_text) ? classes.bgColor400 : classes.bgColor100 }`}>
                          <Image  src={`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/TAG_SVGS/${chip_text.toLowerCase()}.svg`} width={20} height={20} ></Image>

                        {/* <div className={`font-Josefin text-sm flex rounded-3xl ${selectedKeywords.includes(chip_text) ? 'shadow-strong-drop bg-secondary2 text-secondary' : 'shadow-inner-strong bg-secondary'}`}>
                          <Image className='mr-2 self-center' src={`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/TAG_SVGS/${chip_text.toLowerCase()}.svg`} fill ></Image> */}
                          {/* <div className=''>{chip_text}</div> */}
                        {/* </div> */}
                    </div>
                ))}
                </div>
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
      bgColor400: 'bg-dpi-400',
      bgColor100: 'bg-dpi-100',

    },
  };
  