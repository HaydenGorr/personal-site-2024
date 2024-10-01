import Image from "next/image";
import ClosableChip from "./closable_chip";
import { useRouter } from 'next/router'
import { getDaysAgo } from '../utils/date_utils'
import { useState, useEffect } from "react";

export default function NewContainer({ chips=null, home_post_obj, btnAction = () => {}, colour="bg-transparent", add_keywords_to_filter, selectedKeywords, remove_keyword_from_filer, override = false }) {
    const router = useRouter();

    const [hasImage, setHasImage] = useState(false);

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
    
        checkImage();
      }, [home_post_obj]);


    return (
        <div className={`relative cursor-pointer w-fit`}>
            {hasImage && (
                <div className="relative rounded-2xl overflow-hidden border-primary-blue border-2 w-96 h-72">
                    <Image
                        className=""
                        src={`${process.env.NEXT_PUBLIC_USER_ACCESS_CMS}/CMS/articles/${home_post_obj["source"]}/container.png`}
                        unoptimized={true}
                        alt=""
                        width={2000}
                        height={128}
                        onClick={() => { go_to_article(home_post_obj.source) }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-blue via-primary-blue/40 to-transparent opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black opacity-30 via-primary-blue/40 to-transparent" />

                </div>
            )}

            <div className="absolute inset-0 flex-col flex space-y-4 justify-end my-8 px-4 font-Josefin">
                <span className="text-white text-3xl font-semibold">
                    {home_post_obj.title}
                </span>

                <span className="text-white text-base font-semibold">
                    {home_post_obj.desc}
                </span>
            </div>
        </div>
    )

}
