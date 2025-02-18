'use client'
import { useState, useEffect } from "react";
import { get_all_articles } from "../../../api/articles";
import { article_WID, db_article } from "../../../api/interfaces/article_interfaces";
import { edit_states } from "../../../api/interfaces/enums";
import ArticleContainer from "./components/articles/article_container"
import ArticleInProgress from "./components/articles/article_inprogress";
import { delete_article } from "../../../api/articles";

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
    const [articles, set_articles] = useState<db_article[]>([]);
    const [fetch_error, set_fetch_error] = useState<Boolean>(false);
    const [fetch_error_msg, set_fetch_error_msg] = useState<string>("");

    const [edit_article, set_edit_article] = useState<number>(-1);
    const [create_new_article, set_create_new_article] = useState<Boolean>(false);

    const fetch_page_data = async () => {
        set_loading(true)

        await get_all_articles(
            (res: db_article[]) => {
                set_articles(res)
                set_fetch_error(false)
                set_fetch_error_msg("")
            },
            (res: string) => {
                set_articles([])
                set_fetch_error(true)
                set_fetch_error_msg(res)
            }
        )
        
        set_loading(false)
    }

    useEffect(()=>{
        // We don't need to refresh this page if we're in edit mode
        if (edit_article != -1) return

        fetch_page_data()
    }, [create_new_article, edit_article])

    const send_delete_article_request = async (article_id: number|string) => {
        await delete_article(
            article_id,
            () => {
                console.log("successful")
                fetch_page_data()
            },
            (res: string) => {
                console.log(res)
                fetch_page_data()
            }
        )
    }

return (
	<div className={`${className} w-full`}>

        { edit_article>-1 && <ArticleInProgress 
            edit_state={edit_states.edit_existing} 
            given_article={ {...articles[edit_article], mdx:articles[edit_article].mdx?._id || "", image: articles[edit_article].image?._id || ""} as article_WID }
            on_close_click={()=>{set_edit_article(-1)}}/>}
        { create_new_article && <ArticleInProgress 
            edit_state={edit_states.create_new} 
            on_close_click={()=>{set_create_new_article(false)}}/>}

        {/** Create new article button */}
        {!(create_new_article || edit_article != -1) && <div className={"w-full flex justify-center"}>
        <button className="bg-green-400 hover:bg-green-700 rounded-lg p-2 w-72 mb-4"
                onClick={()=>{set_create_new_article(true)}}>Create New Article</button>
        </div>}


        {!(create_new_article || edit_article != -1) && !loading && !fetch_error && <div className="w-full grid grid-cols-2">

            {articles.map((art_iter, index) => {
                return(
                    <div key={art_iter._id} className="flex flex-col p-2">
                        <ArticleContainer art={art_iter}/>
                        <div className="bg-neutral-700 flex space-x-4 pl-4 rounded-b-lg py-2">
                            <button className="bg-purple-300 hover:bg-purple-400 rounded-lg px-2 text-neutral-900" onClick={()=>{set_edit_article(index)}}>edit</button>
                            <button className="bg-red-500 hover:bg-red-700 rounded-lg px-2" onClick={() => {send_delete_article_request(art_iter._id!)}}>delete</button>
                        </div>
                    </div>
                )
            })}
            

        </div>}
        {loading && 
        <div>
            Fetching Articles
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
