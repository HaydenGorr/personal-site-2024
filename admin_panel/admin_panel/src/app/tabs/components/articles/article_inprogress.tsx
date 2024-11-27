'use client'
import { useEffect, useState, useRef } from "react";
import { article, category, chip } from "../../../../../api/api_interfaces";
import { submit_category } from "../../../../../api/categories";
import CategoryDropdown from "@/app/components/category_dropdown";
import ChipDropdown from "@/app/components/chips_dropdown";
import Image from "next/image";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className?: string;
    on_close_click: ()=>void;
    given_article?: article;
}

const empty_article: article = {
    title: "",
    desc: "",
    infoText: "",
    chips: [],
    category: "",
    source: "",
    views: 0,
    publishDate: new Date(),
    ready: false,
    portfolioReady: false,
    image: ""
}

export default function ArticleInProgress({ className, on_close_click, given_article=empty_article }: props) {

const [error_msg, set_error_msg] = useState<string|null>(null);
const [article_under_edit, set_article_under_edit] = useState<article>(given_article);
const is_brand_new_article = useRef(!("_id" in given_article))

const handleArticleChange = (field: keyof article, value: any) => {
    set_article_under_edit({
        ...article_under_edit,
        [field]: value
    });
};

const is_ready_to_push = () => {
    if (!is_brand_new_article && !("_id" in article_under_edit)) return false
    if (article_under_edit.title.length == 0) return false
    if (article_under_edit.desc.length == 0) return false
    // if ()
}

const getInput = (label: string, value:string)=> {
    return (
        <div className={`flex h-fit`}>
            <div className="flex flex-col w-full">
                <label>
                    <span className="text-base text-gray-400">{label}</span>

                    <input 
                        className="text-black px-1 rounded-lg w-full py-2"
                        placeholder="Enter title"
                        value={value ?? ""}
                        onChange={(e) => handleArticleChange(label as keyof article, e.target.value)}
                    />
                
                </label>
            </div>
        </div>
    )
}

const getCheckbox = (label: string, isChecked:Boolean, onChange:()=>void) => {
    return(
        <label className="flex flex-col items-start space-x-2 cursor-pointer select-none">
            <span className="text-base text-gray-400">{label}</span>

            <div 
                className={`w-7 h-7 border-2 rounded-lg flex items-center justify-center
                ${isChecked 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-300 hover:border-blue-500'
                }`}
                onClick={onChange}
            >
            </div>
        </label>
    )
}

const getImageUpload = () => {
    return(
        <label className="flex flex-col items-start cursor-pointer select-none">
            <span className="text-base text-gray-400">{"image"}</span>

            <div className={`w-full h-32 bg-neutral-900 rounded-lg flex justify-center items-center`}>
                {article_under_edit.image == "" && <p>{"no image"}</p>}
                {article_under_edit.image != "" && 
                <Image width={100} height={100} src={article_under_edit.image} alt="Container Image">
                    {"no image"}
                </Image>}
            </div>
            
        </label>
    )
}

return (
	<div className={`${className} h-screen w-screen p-8 relative flex flex-col items-center`}>

        <button className="bg-zinc-900 text-zinc-600 px-2 py-1 rounded-full top-0 right-4 absolute" onClick={()=>{on_close_click()}}>close</button>

        <h1 className="text-3xl font-bold self-center mb-8">Editing Article</h1>

        <div className="w-full max-w-52 flex flex-col space-y-4 items-center text-black">
            <div className="flex space-x-2">
                <div className={`${article_under_edit.ready? 'bg-green-400' : 'bg-yellow-400'} w-fit px-4 py-2 rounded-full font-bold`}>published</div>
                <div className={`${article_under_edit.title.length > 0 ? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>title</div>
                <div className={`${article_under_edit.desc.length > 0 ? 'bg-green-400' : 'bg-yellow-400'} w-fit px-4 py-2 rounded-full font-bold`}>description</div>
            </div>

            <div className="flex space-x-2">
                <div className={`${article_under_edit.infoText.length > 0 ? 'bg-green-400' : 'bg-yellow-400'} w-fit px-4 py-2 rounded-full font-bold`}>info</div>
                <div className={`${article_under_edit.category? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>category</div>
                <div className={`${article_under_edit.chips.length > 0 ? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>chips</div>
            </div>
        </div>

        { error_msg && <p className="text-red-500">{error_msg}</p>}

        <div className="max-w-prose w-full space-y-4 mt-8">
            {getCheckbox('publish', article_under_edit.ready, ()=>{handleArticleChange('ready', !article_under_edit.ready)})}

            {getInput("title", article_under_edit.title)}
            {getInput("desc", article_under_edit.desc)}
            {getInput("infoText", article_under_edit.infoText)}
            <CategoryDropdown
                display_value={article_under_edit.category} on_select={ (in_string: string) => { handleArticleChange("category" as keyof article, in_string) } }/>
            <ChipDropdown
                display_values={article_under_edit.chips}
                on_select={ (in_string: string) => { 
                    if(article_under_edit.chips.includes(in_string)) return
                    handleArticleChange("chips" as keyof article, [...article_under_edit.chips, in_string])
                }}
                on_remove_chip={ (in_string: string) => {
                    handleArticleChange("chips" as keyof article, article_under_edit.chips.filter((val)=>val!=in_string))
                }}/>

            {getImageUpload()}
        </div>

	</div>
);
}
