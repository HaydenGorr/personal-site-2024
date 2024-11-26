'use client'
import { useState, useEffect } from "react";
import { get_all_articles } from "../../../api/articles";
import { api_return_schema, article } from "../../../api/api_interfaces";
import ArticleContainer from "./components/articles/article_container"
import CategoryInProgress from "./components/categories/category_inprogress";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className: string;
}

export default function Articles({ className }: props) {

    const [loading, set_loading] = useState<Boolean>(true);
    const [articles, set_articles] = useState<article[]>([]);
    const [fetch_error, set_fetch_error] = useState<Boolean>(false);
    const [fetch_error_msg, set_fetch_error_msg] = useState<string>("");

    const [article_in_progress, set_article_in_progress] = useState<article | null>(null);

    const fetch_page_data = async () => {
        set_loading(true)

        await get_all_articles(
            (res: api_return_schema<article[]>) => {
                set_articles(res.data as article[])
                set_fetch_error(false)
                set_fetch_error_msg("")
            },
            (res: api_return_schema<article[]>) => {
                set_articles([])
                set_fetch_error(res.error.has_error)
                set_fetch_error_msg(res.error.error_message)
            }
        )
        
        set_loading(false)
    }

    useEffect(()=>{
        fetch_page_data()
    }, [])

return (
	<div className={`${className}`}>
        {!loading && !fetch_error && <div className="space-y-4 w-full flex flex-col items-center">

            <div className="w-full flex justify-around">
                <button 
                    className="bg-green-400 hover:bg-green-700 rounded-full p-2 w-fit"
                    onClick={()=>{set_article_in_progress(null)}}>add</button>
                {article_in_progress && <button 
                    className="bg-red-400 hover:bg-red-700 rounded-full p-2 w-fit"
                    onClick={()=>{set_article_in_progress(null)}}>stop</button>}
            </div>

            {article_in_progress && <CategoryInProgress refresh={()=>fetch_page_data()}/>}

            {articles.map((art_iter) => {
                return(
                    <div key={art_iter._id} className="flex space-x-4 w-full max-w-prose">
                        <ArticleContainer art={art_iter}/>
                        <button className="bg-red-500 rounded-full p-2 hover:bg-red-700" onClick={() => {}}>delete</button>
                    </div>
                )
            })}

        </div>}
        {loading && 
        <div>
            Fetching categories
        </div>
        }

        {!loading && fetch_error &&
        <div>
            <p>{`error: ${fetch_error_msg}`}</p>
            <button 
            className="bg-green-400 hover:bg-green-700 rounded-full p-2 w-fit"
            onClick={() => {fetch_page_data()}}>try again</button>
        </div>
        }
	</div>
);
}
