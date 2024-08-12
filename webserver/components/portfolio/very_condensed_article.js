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
            <p className="font-semibold text-lg truncate mr-3">
                {name}
            </p>
            <div className="flex-shrink-0 flex space-x-2 ml-auto">
                <button className={`${getTypeColour(type)} text-xs p-1 px-2 rounded-2xl whitespace-nowrap flex`}>
                    <Image className="mr-1" width={20} height={20} src={getTypeImage("asd")}/>
                    Full
                </button>
                {has_best_article && <button onClick={() => go_to_article(type)} className={`${getTypeColour(type)} flex text-xs p-1 px-2 rounded-2xl whitespace-nowrap`}>
                    <Image className="mr-1" width={20} height={20} src={"/images/svgs/star.svg"}/>
                    Best Bit
                </button>}
            </div>
          </div>
        </div>
    </div>
    )
}