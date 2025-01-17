'use client'
import { useEffect, useState, useRef } from "react";
import { image_type_enum, edit_states} from "../../../../../api/interfaces/enums";
import { db_article } from "../../../../../api/interfaces/article_interfaces";

import { article_WID } from "../../../../../api/interfaces/article_interfaces";
import { db_mdx } from "../../../../../api/interfaces/mdx_interfaces";

import CategoryDropdown from "@/app/components/category_dropdown";
import ChipDropdown from "@/app/components/chips_dropdown";
import ImageDropdown from "@/app/components/image_dropdown";
import MDXDropdown from "@/app/components/mdx_dropdown";
import { submit_article_changes, submit_new_article } from "../../../../../api/articles";
import { select_images } from "../../../../../api/image";
import { select_mdx } from "../../../../../api/mdx";
import { db_image } from "../../../../../api/interfaces/image_interfaces";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className?: string;
    on_close_click: ()=>void;
    given_article?: article_WID;
    edit_state: edit_states;
}

const empty_article: article_WID = {
    _id: "",
    title: "",
    description: "",
    mdx: "", // mdx db id
    infoText: "",
    chips: [],
    category: "",
    views: 0,
    publishDate: new Date(),
    ready: false,
    portfolioReady: false,
    image: "", // image db id
    type: "misc."
}

export default function ArticleInProgress({ className, on_close_click, edit_state, given_article=empty_article }: props) {
const [submit_success_message, set_submit_success_message] = useState<string|null>(null);
const [error_msg, set_error_msg] = useState<string|null>(null);
const [article_under_edit, set_article_under_edit] = useState<article_WID>(given_article);
const [is_new_article, set_is_new_article] = useState<edit_states>(edit_state);
const [image_preview, set_image_preview] = useState<db_image | null>(null);
const [mdx_preview, set_mdx_preview] = useState<db_mdx | null>(null);

/**
 * Make changes to the article_under_edit object
 */
const handleArticleChange = (field: keyof article_WID, value: any) => {

    // If the article is changing then the previous submit success message doesn't apply.
    set_submit_success_message(null)

    set_article_under_edit((aue: article_WID) => {

        const news = {...aue,
            [field]: value}

        console.log(news)

        return news
    });
};

useEffect(()=>{

    if (given_article === empty_article) return 

    /**
     * Since we only have an article_WID, we only have the image and mdx IDs,
     * not their content. So here we take those IDs and grab the content
     * to display it in the ui
     */
    select_images(
        (img: db_image[])=>{
            if (img.length == 0){
                set_error_msg(`could not find image with id ${given_article.image}`)
            }
            set_error_msg("")
            set_image_preview(img[0])
        },
        (error: string)=>{
            set_error_msg(error)
        },
        {_id:given_article.image})

        select_mdx(
        (mdx: db_mdx[])=>{
            if (mdx.length == 0){
                set_error_msg(`could not find image with id ${given_article.image}`)
            }
            set_error_msg("")
            set_mdx_preview(mdx[0])
        },
        (error: string)=>{
            set_error_msg(error)
        },
        {_id:given_article.mdx})
}, [given_article])

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
                        onChange={(e) => handleArticleChange(label as keyof article_WID, e.target.value)}
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
    if (article_under_edit.image == "") return false
    if (article_under_edit.description.length == 0) return false
    if (!article_under_edit.mdx || article_under_edit.mdx.length == 0) return false
    if (!article_under_edit.image || article_under_edit.image.length == 0) return false
    if (is_new_article == edit_states.edit_existing && !article_under_edit._id) return false

    return true
}

const submit_changes = () => {
    if (!isArticleReady()) return

    if (edit_state == edit_states.edit_existing) {
        submit_article_changes(
            article_under_edit,
            ()=>{ set_error_msg(null); set_submit_success_message("Sucessfully submitted!") },
            (a: string)=>{ set_error_msg(a); set_submit_success_message(null) }
        )
    }
    else{
        submit_new_article(
            article_under_edit,
            (db_article: db_article)=>{ 
                set_error_msg(null); set_submit_success_message("Sucessfully submitted!")
                set_is_new_article(edit_states.edit_existing)
                set_article_under_edit({...db_article, mdx: db_article.mdx._id, image: db_article.image._id} as article_WID)
            },
            (a: string)=>{ set_error_msg(a); set_submit_success_message(null) }
        )
    }
}

return (
	<div className={`${className} min-h-screen w-full py-8 relative flex flex-col items-center`}>

        <button className="bg-zinc-900 text-zinc-600 px-2 py-1 rounded-full top-0 right-4 absolute" onClick={()=>{on_close_click()}}>close</button>

        <h1 className="text-3xl font-bold self-center mb-8">{`${is_new_article ? 'Creating new article' : 'Editing article' }`}</h1>

        <div className="w-full max-w-52 flex flex-col space-y-4 items-center text-black">
            <div className="flex space-x-2">
                <div className={`${article_under_edit._id ? 'bg-green-400' : ' stroke-red-500 stroke-2  border-dashed border-blue-400 border-2 text-blue-400'} w-fit px-4 py-2 rounded-full font-bold`}>id</div>
                <div className={`${article_under_edit.title.length > 0 ? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>title</div>
                <div className={`${article_under_edit.category? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>category</div>
                <div className={`${article_under_edit.chips.length > 0 ? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>chips</div>
            </div>

            <div className="flex space-x-2">
                <div className={`${article_under_edit.mdx != "" ? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>mdx</div>
                <div className={`${article_under_edit.image != "" ? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>image</div>
                <div className={`${article_under_edit.ready? 'bg-green-400' : 'bg-yellow-400'} w-fit px-4 py-2 rounded-full font-bold`}>published</div>
                <div className={`${article_under_edit.description.length > 0 ? 'bg-green-400' : 'bg-red-400'} w-fit px-4 py-2 rounded-full font-bold`}>description</div>
                <div className={`${article_under_edit.infoText.length > 0 ? 'bg-green-400' : 'bg-yellow-400'} w-fit px-4 py-2 rounded-full font-bold`}>info</div>
            </div>
        </div>

        <p className="mt-8 font-bold text-green-400">{submit_success_message}</p>

        <button
            disabled={!isArticleReady()}
            className={`mt-4 ${isArticleReady() ? 'bg-green-200 hover:bg-green-300' : 'bg-neutral-600 opacity-70'} px-2 py-1 rounded-lg text-neutral-800 font-bold ${isArticleReady() ? 'cursor-pointer' : 'cursor-not-allowed select-none' }`}
            onClick={()=>{submit_changes()}}>{`${is_new_article ? 'Submit' : 'Update'}`}</button>

        { error_msg && <p className="text-red-500">{error_msg}</p>}

        <div className="w-full space-y-4 mt-8">
            {getCheckbox('go live', article_under_edit.ready, ()=>{handleArticleChange('ready', !article_under_edit.ready)})}

            {getInput("title", article_under_edit.title)}
            {getInput("description", article_under_edit.description)}
            {getInput("infoText", article_under_edit.infoText)}

            <CategoryDropdown
                display_value={article_under_edit.category} on_select={ (in_string: string) => { handleArticleChange("category" as keyof article_WID, in_string) } }/>

            <ChipDropdown
                display_values={article_under_edit.chips}
                on_select={ (in_string: string) => { 
                    if(article_under_edit.chips.includes(in_string)) return
                    handleArticleChange("chips" as keyof article_WID, [...article_under_edit.chips, in_string])
                }}
                on_remove_chip={ (in_string: string) => {
                    handleArticleChange("chips" as keyof article_WID, article_under_edit.chips.filter((val)=>val!=in_string))
                }}/>

            <div className="flex w-full space-x-4">
                <div className="border-neutral-500 h-fit border-2 rounded-lg p-2 w-full">
                    <div className="flex justify-center relative">
                        {image_preview && <img src={image_preview.full_url} className="max-h-32 w-auto"></img>}
                        {!image_preview && <div className="h-12 w-full items-center justify-center flex opacity-40 border-dashed border-2">{"no container image chosen"}</div>}
                        {article_under_edit.image && <div 
                            className="bg-red-500 hover:bg-red-800 rounded-full absolute top-0 right-0 h-6 w-6 text-center" 
                            onClick={()=>{set_image_preview(null); handleArticleChange('image', '')}}>{"x"}</div>}
                    </div>
                    <ImageDropdown className="mt-4" selected={image_preview?._id} image_type={image_type_enum.container} on_select={(image: db_image) => {
                        // Set the preview so that we can see which image we've selected in the UI
                        set_image_preview(image);
                        // Add the ID to the object
                        handleArticleChange('image', image._id)
                    }} />
                </div>
                <div className="border-neutral-500 h-fit border-2 rounded-lg p-2 w-full relative">
                    {mdx_preview && <div className="max-h-32 w-auto">
                        <div className="font-extrabold">{mdx_preview.title}</div>
                        <div className="w-auto text-sm opacity-60 pr-6 line-clamp-3">{mdx_preview.snippet}</div>
                        <div className="w-auto text-xs opacity-30 pr-6 line-clamp-3 mt-1">{mdx_preview.upload_date}</div>
                        <div className="h-10 flex space-x-1 mt-2">
                                {mdx_preview.images.map((val)=>{
                                    return(
                                        <img key={val._id} className="rounded-lg" src={val.full_url}/>
                                    )
                                })}
                            </div>
                        </div>}
                    {!mdx_preview && <div className="h-12 w-full items-center justify-center flex opacity-40 border-dashed border-2">{"no mdx chosen"}</div>}
                    {article_under_edit.mdx && <div 
                            className="bg-red-500 hover:bg-red-800 rounded-full absolute top-0 right-0 h-6 w-6 text-center" 
                            onClick={()=>{set_mdx_preview(null); handleArticleChange('mdx', '')}}>{"x"}</div>}

                    <MDXDropdown className="max-h-[30rem]" selected={mdx_preview?._id} on_select={(mdx: db_mdx) => {
                        set_mdx_preview(mdx);
                        handleArticleChange('mdx', mdx._id)
                    }} />
                </div>
            </div>


            
        </div>

	</div>
);
}
