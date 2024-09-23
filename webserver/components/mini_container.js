import Image from "next/image";
import ClosableChip from "./closable_chip";
import { useRouter } from 'next/router'
import { getDaysAgo } from '../utils/date_utils'
import { useState, useEffect } from "react";

export default function MiniContainer({ chips=null, home_post_obj, btnAction = () => {}, colour="bg-transparent", add_keywords_to_filter, selectedKeywords, remove_keyword_from_filer, override = false }) {
    const router = useRouter();

    const [hasImage, setHasImage] = useState(false);

    const go_to_article = (title) => {
        if (title != "") router.push(`/article/${title}`)
        else {
            router.push(`/missingArticle`)
        }
    }

    function formatDate(dateString) {
        // Create a new Date object from the input date string
        const date = new Date(dateString);
      
        // Extract day, month, and year components
        const day = String(date.getDate()).padStart(2, '0');       // Ensure two digits
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = String(date.getFullYear()).slice(-2);          // Get last two digits
      
        // Format and return the date as dd/mm/yy
        return `${day}.${month}.${year}`;
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
        <div className="flex self-center h-fit">
            <div className="flex">
                <div className="flex min-w-20">
                    <div className="w-2 h-2 bg-black self-center mr-2"></div>
                    <p className="font-karla text-xs self-center">{formatDate(home_post_obj.publishDate)}</p>
                </div>
                <div className="w-screen max-w-prose my-1">
                    <p className="font-karla font-semibold text-xl line-clamp-1 overflow-ellipsis self-center">{home_post_obj.title}</p>
                    <p className="font-karla text-sm line-clamp-2 overflow-ellipsis">{home_post_obj.desc}</p>
                </div>
            </div>



            <div className={`flex flex-wrap space-x-1`}>
                {( chips ? chips : home_post_obj.chips).map((chip_text, index) => (
                    <div className={`border border-neutral-400 rounded-sm px-1 h-fit self-center font-jetbrains text-xs`}>
                        {chip_text}
                    </div>
                ))}
            </div>

        </div>
    )

}
