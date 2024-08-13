import Image from "next/image";
import LineBreak from "../line_break";
import { useState, useEffect } from 'react'; // Import useState and useEffect if not already imported
import router from "next/router";
import { getTypeColour, getTypeImage, getTypeTitle } from '../../utils/portfolio_utils';


export default function VeryCondensedArticle({ name, desc, type, has_best_article, source }) {

    const go_to_article = (title) => {
        if (title != "") router.push(`/portfolio/${title}`)
        else {
            router.push(`/missingArticle`)
        }
    }
    
    return (

    <div className="Neo-Brutal-White p-3 w-full">
        <div className="flex items-center space-x-3">
          <Image 
            className="flex-shrink-0" 
            width={25} 
            height={25} 
            src={getTypeImage(type)}
            alt={`${type} icon`}
          />
          <div className="flex-grow min-w-0 flex items-center">

            <div className="font-semibold text-lg mr-3 mb-1">
                <p className="font-semibold text-lg line-clamp-1">
                    {name}
                </p>
                <p className="font-normal text-xs line-clamp-2">
                    {desc}
                </p>
            </div>

            <div className="flex-shrink-0 flex ml-auto flex-col space-y-1">
                {/* {has_best_article && <p className="flex justify-center m-0 text-xs">Read the</p>} */}
                <button className={`${getTypeColour(type)} p-1 px-2 rounded-2xl whitespace-nowrap flex items-center justify-center`} onClick={() => go_to_article(source)}>
                    <Image className="mx-1" width={20} height={20} src={getTypeImage(type)}/>
                    <p className="mr-1 font-semibold text-xs">{has_best_article ? "Whole thing" : "Read"}</p>
                </button>
                {/* {has_best_article && <p className="flex justify-center m-0 text-xs">or the</p>} */}
                {has_best_article && <button onClick={() => go_to_article(source+"_")} className={`${getTypeColour(type)}  flex p-1 rounded-2xl whitespace-nowrap items-center justify-center`}>
                    <Image className="mx-1" width={20} height={20} src={"/images/svgs/star.svg"}/>
                    <p className="mr-2 font-semibold text-xs">Best bit</p>
                </button>}
            </div>
            
          </div>
        </div>
    </div>
    )
}