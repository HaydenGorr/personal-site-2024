'use client'
import { useState } from "react";
import { db_article } from "../../../../../api/interfaces/article_interfaces";
import { db_image } from "../../../../../api/interfaces/image_interfaces";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className?: string;
	art: db_article;
}

export default function ArticleContainer({ art, className }: props) {
	
return (
	<div className="flex w-full">
		<div className={`${className} relative bg-neutral-700 px-4 py-2 rounded-t-lg w-full overflow-hidden`}>
			<div className={`${art.ready ? "bg-green-200" : "bg-red-500"} absolute top-2 right-2 rounded-full h-4 w-4 text-center text-xs text-neutral-900 font-extrabold`}></div>
			<p>{`${art.title}`}</p>
			<p className="text-neutral-500 line-clamp-3">{`${art.description}`}</p>
			<p className="mt-4 text-xs opacity-40 mb-1">image previews</p>
			<div className="max-h-14 h-full flex space-x-4 overflow-x-auto scrollbar-none">
				{/** Container image */}
				<img className={"h-14 w-auto rounded-lg"} src={art.image.full_url}></img>
				{/** Separator */}
				<div className="w-[3px] rounded-full bg-white h-full opacity-10"></div>
				{/** article images */}
				{art.mdx.images.map((val: db_image) =>{
					return(
						<img key={val._id} className={"h-14 w-auto rounded-lg"} src={val.full_url}></img>
					)
				})}
			</div>
		</div>
	</div>

);
}
