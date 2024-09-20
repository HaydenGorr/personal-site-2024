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

    <div className="sm:flex space-x-3">

        <div className="Neo-Brutal-White py-3 px-5 w-full">
            <div className="flex items-center space-x-3">
            {/* <Image 
                className="flex-shrink-0" 
                width={25} 
                height={25} 
                src={getTypeImage(type)}
                alt={`${type} icon`}
            /> */}
            
            <div className="flex-grow min-w-0 flex items-center">

                <div className="font-semibold text-lg mr-3 mb-1">
                    <p className="font-semibold text-lg line-clamp-1">
                        {name}
                    </p>
                    <p className="font-normal text-xs line-clamp-2">
                        {desc}
                    </p>
                </div>
            </div>
            </div>
        </div>
        
        <div className="flex sm:flex-col justify-center sm:space-y-2 mt-3 sm:mt-0 space-x-3 sm:space-x-0">
            <div className={`flex items-center justify-center Neo-Brutal-White w-24 btn-primary active:MB_clicked active:shadow-MB_clicked active:bg-MB_clicked select-none cursor-pointers max-h-14 h-full`}
            onClick={() => go_to_article(source)}>
                <div className="flex">
                    <Image width={20} height={20} src={getTypeImage(type)}/>
                    <p className="ml-1 font-semibold text-xs text-center">{"Read"}</p>
                </div>
            </div>

            {has_best_article && <div className="flex items-center justify-center Neo-Brutal-White w-24 dark:bg-yellow-200 btn-primary active:MB_clicked active:shadow-MB_clicked active:bg-yellow-300 select-none cursor-pointer"
                onClick={() => go_to_article(source+"_")}>
                <div className="flex">
                    <Image width={20} height={20} src={"/images/svgs/star.svg"}/>
                    <p className="ml-1 font-semibold text-xs text-center">Best bit</p>
                </div>
            </div>}
        </div>



    </div>
    )
}