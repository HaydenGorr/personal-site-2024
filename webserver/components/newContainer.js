import Image from "next/image";
import { useRouter } from 'next/router'
import { getDaysAgo } from '../utils/date_utils'
import { useState, useEffect, useRef } from "react";
import PrecacheImages from "./pre_cache_images";

export default function NewContainer({ home_post_obj, preload=true, colour="bg-transparent", selectedKeywords}) {
    const router = useRouter();

    const [hasImage, setHasImage] = useState(false);
    const [randomColor, setRandomColor] = useState('');
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef(null);

    const go_to_article = (id) => {
      // console.log("dualsense", url)
      // const filename = url.split('/').pop();
      if (id != "") router.push(`/article/${id}`)
      else {
          router.push(`/missingArticle`)
      }
    }

  /**
   * Detect if the component is in view
   * So we can preload the images inside the article
   */
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          console.log("in view ", home_post_obj.title)
        } else {
          // setIsInView(false);
          // console.log("asdasdas ", home_post_obj.title)
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Cleanup the observer on unmount
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

  useEffect(() => {

    const checkImage = async () => {
      const url = home_post_obj.image;

      try {
        const response = await fetch(url);
        setHasImage(response.status === 200);
      } catch (error) {
        setHasImage(true); // If the request errors then assume the image is there just in case it is
      }
    };

    checkImage();
  }, [home_post_obj, selectedKeywords]);

  useEffect(() => {

    const determined_index = parseInt(new Date(home_post_obj.publishDate).getMilliseconds()) % colourClasses.length

    setRandomColor(colourClasses[determined_index])

  }, []);


    return (
        <div ref={containerRef} className={`relative font-Josefin ${randomColor.textColor200}`}>

          {preload && isInView && <PrecacheImages array_of_images={[home_post_obj.mdx.images[0].full_url]}/>}

            <div className="relative rounded-2xl overflow-hidden w-80 h-128">
              <img
                src={home_post_obj.image.full_url}
                className="w-full h-full object-cover cursor-pointer"
                alt="Descriptive alt text"
              />
              {/** Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-t to-transparent opacity-95 ${randomColor.fromColor700}`} />
              <div className={`absolute inset-0 bg-gradient-to-t to-transparent opacity-30 from-black`} />
              <div className={`absolute inset-0 ${randomColor.bgRadialGradient} opacity-75`}/>
            </div>

            <div className="absolute inset-0 flex-col flex space-y-4 justify-center my-8 px-4">
                <span className={`text-3xl font-semibold`}>
                    {home_post_obj.title}
                </span>
            </div>

            <div className="absolute inset-0 flex-col flex space-y-4 justify-end my-4 px-4">
                <span className="text-sm font-medium line-clamp-4">
                    {home_post_obj.description}
                </span>

                <button
                    className={`z-50 self-center rounded-xl w-fit px-6 text-center ${randomColor.textColor700} text-sm font-medium ${randomColor.bgColor200}`}
                    onClick={() => {go_to_article(home_post_obj._id)}}>
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

const colourClasses = [
    {
      textColor200: 'text-dg-200',
      fromColor700: 'from-dg-700',
      bgRadialGradient: 'bg-dg-radial-gradient',
      textColor700: 'text-dg-700',
      bgColor200: 'bg-dg-200',
      bgColor400: 'bg-dg-400',
      bgColor100: 'bg-dg-100',
    },
    {
      textColor200: 'text-dy-200',
      fromColor700: 'from-dy-700',
      bgRadialGradient: 'bg-dy-radial-gradient',
      textColor700: 'text-dy-700',
      bgColor200: 'bg-dy-200',
      bgColor400: 'bg-dy-400',
      bgColor100: 'bg-dy-100',
    },
    {
      textColor200: 'text-dr-200',
      fromColor700: 'from-dr-700',
      bgRadialGradient: 'bg-dr-radial-gradient',
      textColor700: 'text-dr-700',
      bgColor200: 'bg-dr-200',
      bgColor400: 'bg-dr-400',
      bgColor100: 'bg-dr-100',
    },
    {
      textColor200: 'text-dpu-200',
      fromColor700: 'from-dpu-700',
      bgRadialGradient: 'bg-dpu-radial-gradient',
      textColor700: 'text-dpu-700',
      bgColor200: 'bg-dpu-200',
      bgColor400: 'bg-dpu-400',
      bgColor100: 'bg-dpu-100',
    },
    {
      textColor200: 'text-dpi-200',
      fromColor700: 'from-dpi-700',
      bgRadialGradient: 'bg-dpi-radial-gradient',
      textColor700: 'text-dpi-700',
      bgColor200: 'bg-dpi-200',
      bgColor400: 'bg-dpi-700', // Made this 700, because 400 was too light for the text in my testing
      bgColor100: 'bg-dpi-100',
    },
  ];
  