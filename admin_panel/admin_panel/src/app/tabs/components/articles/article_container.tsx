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
	art: article;
}

export default function ArticleContainer({ art, className }: props) {


return (
	<div className="flex w-full">
		<div className={`${className} relative bg-neutral-700 px-4 py-2 rounded-lg w-full overflow-hidden`}>
			<div className={`${art.ready ? "bg-green-200" : "bg-red-500"} absolute top-2 right-2 rounded-full h-4 w-4 text-center text-xs text-neutral-900 font-extrabold`}></div>
			<p>{`${art.title}`}</p>
			<p className="text-neutral-500 line-clamp-3">{`${art.desc}`}</p>
		</div>
	</div>

);
}
