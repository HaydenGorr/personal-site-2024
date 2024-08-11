import Image from "next/image";
import LineBreak from "../line_break";
import { useState, useEffect } from 'react'; // Import useState and useEffect if not already imported
import router from "next/router";

export default function CondensedArticle({ name, desc, type="", has_best_article, source }) {

    

    const getTypeColour = (type) => {
        let lower_type = type.toLowerCase().split(" ").join("_")

        if (lower_type === "short_story") {
            return "bg-blue-300"
        }
        else if (lower_type === "script") {
            return "bg-orange-300"

        }
        return "bg-gray-300"
    }

    const getTypeImage = (type) => {
        let lower_type = type.toLowerCase().split(" ").join("_")

        if (lower_type === "short_story") {
            return "/images/svgs/portfolio/short_story.svg"
        }
        else if (lower_type === "script") {
            return "/images/svgs/portfolio/script.svg"
        }
        return "bg-gray-300"
    }

    const getTypeTitle = (type) => {
        let lower_type = type.toLowerCase().split(" ").join("_")

        if (lower_type === "short_story") {
            return "Short Story"
        }
        else if (lower_type === "script") {
            return "Script"
        }
        return "Misc."
    }

    const go_to_article = (title) => {
        if (title != "") router.push(`/portfolio/${title}`)
        else {
            router.push(`/missingArticle`)
        }
    }
    
    return (

        <div className="Neo-Brutal-White p-3 max-w-prose">

            <div className="flex">
                <Image width={50} height={50} src={getTypeImage(type)}></Image>
                <div className="pl-3">
                    <div className="flex justify-between items-center">
                        <p className=" font-semibold text-xl my-2">{name}</p>
                        <div className={getTypeColour(type) + " text-xs p-1 px-2 rounded-2xl"}>{getTypeTitle(type)}</div>
                    </div>
                    <p className=" overflow-ellipsis line-clamp-4">{desc + desc + desc + desc + desc}</p>
                </div>
            </div>

            <LineBreak className={"my-5"}/>

            {has_best_article && 
            <div className="mt-3 mb-1 w-full flex flex-col items-center">
                <p className="text-sm">This piece may be a bit long, so you might want to read</p>
                <div className="flex space-x-3 pt-3">
                    <button className={getTypeColour(type) + " text-sm font-semibold px-3 py-1 rounded-2xl flex space-x-2"} onClick={() => {go_to_article(source+"_")}}>
                        <p>The best bit</p>
                        <Image width={20} height={20} src={"/images/svgs/star.svg"}></Image>
                    </button>

                    <p>or</p>

                    <button className={getTypeColour(type) + " text-sm font-semibold px-3 py-1 rounded-2xl flex space-x-2"} onClick={() => {go_to_article(source)}}>
                        <p>The whole thing</p>
                        <Image width={20} height={20} src={"/images/svgs/portfolio/short_story.svg"}></Image>
                    </button>

                </div>
            </div>}

            {!has_best_article &&
            <div className="mt-3 mb-1 w-full flex flex-col items-center">
                <button className={getTypeColour(type) + " text-sm font-semibold px-3 py-1 rounded-2xl flex space-x-2"} onClick={() => {go_to_article(source)}}>
                    <p>Click to read</p>
                    <Image width={20} height={20} src={"/images/svgs/portfolio/short_story.svg"}></Image>
                </button>
            </div>
            }



        </div>
    )
}