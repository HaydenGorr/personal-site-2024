'use client'
import { useState } from "react";
import { article } from "../../../../../api/api_interfaces";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className?: string;
	on_click_edit: () => void;
	art: article;
}

export default function ArticleContainer({ art, on_click_edit, className }: props) {

const [expand, set_expand] = useState<Boolean>(false);

return (
	<div className="flex">
		<button className="bg-purple-300 rounded-full text-black px-2 h-fit my-auto mr-2" onClick={()=>set_expand(!expand)}>expand</button>
		<button className="bg-purple-300 rounded-full text-black px-2 h-fit my-auto mr-2" onClick={()=>{on_click_edit()}}>edit</button>
		<div className={`${className} bg-neutral-700 px-4 py-2 rounded-full`}>
			<p>{`${art.title}`}</p>
			<p>{`${art.source}`}</p>
			{expand && <div>
				{art.hasImage ? "yes" : "no"}
			</div>}
		</div>
	</div>

);
}
