'use client'
import { useEffect, useState, useRef } from "react";
import { api_return_schema, article, category, chip } from "../../../../../api/api_interfaces";
import { submit_category } from "../../../../../api/categories";
import CategoryDropdown from "@/app/components/category_dropdown";
import ChipDropdown from "@/app/components/chips_dropdown";
import Image from "next/image";
import ImageUpload from "@/app/components/image_upload";
import MDXUpload from "@/app/components/mdx_upload";
import { upload_image } from "../../../../../api/image";
import ImageDropdown from "@/app/components/image_dropdown";
import { full_image_path_from_filename } from "../../../../../utils/path_utils";
import { submit_article_changes } from "../../../../../api/articles";

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
    article: "",
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

const [image_url, set_image_url] = useState<string|null>(given_article.image ? given_article.image : null);

const [article_set_from_db, set_article_set_from_db] = useState<Boolean>(given_article.article != "");
const [article_file, set_article_file] = useState<File|null>(null);

const [submit_success_message, set_submit_success_message] = useState<string|null>(null);
const [error_msg, set_error_msg] = useState<string|null>(null);
const [article_under_edit, set_article_under_edit] = useState<article>(given_article);
const is_brand_new_article = useRef(!("_id" in given_article))

const set_article_preview = async (url: string) => {
    try{
        const urlObject = new URL(url);
        let fileName = urlObject.pathname.split('/').pop();

        if (!fileName) return

        fileName = decodeURIComponent(fileName)

        const response = await fetch(url, {
            headers: {
                'Accept': 'text/markdown, text/plain, text/mdx, text/md',
            },
            mode: 'cors',  // Explicitly enable CORS
            cache: 'no-cache'  // Bypass cache to ensure fresh content
        });

        if (!response.ok) return

        const text = await response.text();

        const file = new File([text], fileName, { type: 'text/md' });

        set_article_file(file)
    }
    catch {
        return
    }
}

useEffect(()=>{

    handleArticleChange("article", "placeholder_path")

    if (article_set_from_db) set_article_preview(given_article.article)

    // if (image_set_from_db) set_preview(given_article.image)
},[])

const handleArticleChange = (field: keyof article, value: any) => {
    set_article_under_edit({
        ...article_under_edit,
        [field]: value
    });
};

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

const isArticleReady = (): boolean => {
    if (article_under_edit.title.length == 0) return false
    if (!article_under_edit.category) return false
    if (article_under_edit.chips.length == 0) return false
    if (image_url === null) return false
    if (article_under_edit.desc.length == 0) return false

    return true
}

const submit_changes = () => {
    if (!isArticleReady()) return

    submit_article_changes(
        article_under_edit,
        ()=>{ set_error_msg(null); set_submit_success_message("Sucessfully submitted!") },
        (a: string)=>{ set_error_msg(a); set_submit_success_message(null) }
    )
}

return (
	<div className={`${className} min-h-screen w-full p-8 relative flex flex-col items-center`}>

        <button className="bg-zinc-900 text-zinc-600 px-2 py-1 rounded-full top-0 right-4 absolute" onClick={()=>{on_close_click()}}>close</button>

        <h1 className="text-3xl font-bold self-center mb-8">Editing Article</h1>

        <div className="w-full max-w-52 flex flex-col space-y-4 items-center text-black">
            <div className="flex space-x-2">
                <div className={`${article_under_edit.title.length > 0 ? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>title</div>
                <div className={`${article_under_edit.category? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>category</div>
                <div className={`${article_under_edit.chips.length > 0 ? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>chips</div>
            </div>

            <div className="flex space-x-2">
                <div className={`${image_url != null ? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>image</div>
                <div className={`${article_under_edit.ready? 'bg-green-400' : 'bg-yellow-400'} w-fit px-4 py-2 rounded-full font-bold`}>published</div>
                <div className={`${article_under_edit.desc.length > 0 ? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>description</div>
                <div className={`${article_under_edit.infoText.length > 0 ? 'bg-green-400' : 'bg-yellow-400'} w-fit px-4 py-2 rounded-full font-bold`}>info</div>
            </div>
        </div>

        <p className="mt-8 font-bold text-green-400">{submit_success_message}</p>

        <button
            disabled={!isArticleReady()}
            className={`mt-4 ${isArticleReady() ? 'bg-green-200 hover:bg-green-300' : 'bg-neutral-600 opacity-70'} px-2 py-1 rounded-lg text-neutral-800 font-bold ${isArticleReady() ? 'cursor-pointer' : 'cursor-not-allowed select-none' }`}
            onClick={()=>{submit_changes()}}>Submit</button>

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

            <ImageUpload 
                image_url={image_url}
                onImageUpload={(inurl: string|null)=>{
                    handleArticleChange('image', inurl)
                    set_image_url(inurl as string)
                    }}/>

            <ImageDropdown on_select={(path_string: string) => {
                set_image_url(full_image_path_from_filename(path_string));
                handleArticleChange('image', full_image_path_from_filename(path_string))
            }} />

            {/* <MDXUpload
                on_file_change={(a: File|null)=>{set_article_file(a); set_article_set_from_db(false)}}
                article_file={article_file}
                onImageUpload={(inFile: File)=>{start_upload_article()}}/> */}
        </div>

	</div>
);
}
