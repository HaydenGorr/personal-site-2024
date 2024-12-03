'use client'
import { useEffect, useState, useRef } from "react";
import { article, image_type_enum } from "../../../../../api/api_interfaces";
import CategoryDropdown from "@/app/components/category_dropdown";
import ChipDropdown from "@/app/components/chips_dropdown";
import ImageUpload from "@/app/components/image_upload";
import MDXUpload from "@/app/components/mdx_upload";
import ImageDropdown from "@/app/components/image_dropdown";
import { submit_article_changes, submit_new_article } from "../../../../../api/articles";
import '@mdxeditor/editor/style.css'
import MDX_Editor from "@/app/components/mdx/MDX_Typer";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className?: string;
    on_close_click: ()=>void;
    newArticle: Boolean;
    given_article?: article;
}

const empty_article: article = {
    title: "",
    description: "",
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

export default function ArticleInProgress({ className, on_close_click, newArticle, given_article=empty_article }: props) {

const [image_url, set_image_url] = useState<string|null>(given_article.image ? given_article.image : null);
const [mdx_url, set_mdx_url] = useState<string|null>(given_article.article ? given_article.article : null);

const [submit_success_message, set_submit_success_message] = useState<string|null>(null);
const [error_msg, set_error_msg] = useState<string|null>(null);
const [article_under_edit, set_article_under_edit] = useState<article>(given_article);

const [has_been_edited, set_has_been_edited] = useState<Boolean>(false);


const handleArticleChange = (field: keyof article, value: any) => {

    // If the article is changing then the previous submit success message doesn't apply.
    set_submit_success_message(null)

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
        <label className="flex flex-col items-center space-x-2 cursor-pointer select-none w-full">
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
    if (article_under_edit.description.length == 0) return false

    return true
}

const submit_changes = () => {
    if (!isArticleReady()) return

    console.log("asd", newArticle)

    if (!newArticle) {
        submit_article_changes(
            article_under_edit,
            ()=>{ set_error_msg(null); set_submit_success_message("Sucessfully submitted!") },
            (a: string)=>{ set_error_msg(a); set_submit_success_message(null) }
        )
    }
    else{
        submit_new_article(
            article_under_edit,
            ()=>{ set_error_msg(null); set_submit_success_message("Sucessfully submitted!") },
            (a: string)=>{ set_error_msg(a); set_submit_success_message(null) }
        )
    }
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
                <div className={`${mdx_url != null ? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>mdx</div>
                <div className={`${image_url != null ? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>image</div>
                <div className={`${article_under_edit.ready? 'bg-green-400' : 'bg-yellow-400'} w-fit px-4 py-2 rounded-full font-bold`}>published</div>
                <div className={`${article_under_edit.description.length > 0 ? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>description</div>
                <div className={`${article_under_edit.infoText.length > 0 ? 'bg-green-400' : 'bg-yellow-400'} w-fit px-4 py-2 rounded-full font-bold`}>info</div>
            </div>
        </div>

        <p className="mt-8 font-bold text-green-400">{submit_success_message}</p>

        <button
            disabled={!isArticleReady()}
            className={`mt-4 ${isArticleReady() ? 'bg-green-200 hover:bg-green-300' : 'bg-neutral-600 opacity-70'} px-2 py-1 rounded-lg text-neutral-800 font-bold ${isArticleReady() ? 'cursor-pointer' : 'cursor-not-allowed select-none' }`}
            onClick={()=>{submit_changes()}}>Submit</button>

        { error_msg && <p className="text-red-500">{error_msg}</p>}

        <div className="w-full space-y-4 mt-8">
            {getCheckbox('go live', article_under_edit.ready, ()=>{handleArticleChange('ready', !article_under_edit.ready)})}

            {getInput("title", article_under_edit.title)}
            {getInput("description", article_under_edit.description)}
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

            <div className="border-red-500 border-2 rounded-lg p-2">  
                <ImageUpload
                    category={image_type_enum.container}
                    image_url={image_url}
                    onImageUpload={(inurl: string|null)=>{
                        handleArticleChange('image', inurl)
                        set_image_url(inurl as string)
                        }}/>

                <ImageDropdown className="mt-4" image_type={image_type_enum.container} on_select={(path_string: string) => {
                    set_image_url(path_string);
                    handleArticleChange('image', path_string)
                }} />
            </div>


            <MDXUpload
                mdx_url={mdx_url}
                onMDXUpload={(inurl: string|null)=>{
                    handleArticleChange('article', inurl)
                    set_mdx_url(inurl as string)
            }}/>
            
        </div>

	</div>
);
}
