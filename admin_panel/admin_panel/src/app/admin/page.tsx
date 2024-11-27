'use client'
import Image from "next/image";
import { useState } from "react";
import { send_login_request } from "../../../api/sign_in";
import { useRouter } from 'next/navigation';
import Categories from "../tabs/categories";
import Articles from "../tabs/articles";
import Chips from "../tabs/chips";
import Images from "../tabs/images";

const enum tabs{
	categories,
	articles,
	chips,
	images
}

export default function Login() {
const router = useRouter();

const [selected_tab, set_selected_tab] = useState<tabs>(tabs.categories);


return (
	<div className="p-4 w-full flex flex-col items-center relative">

		<h1 className="font-black text-4xl">Admin Panel</h1>

		<div className="mt-8 flex justify-around w-full max-w-prose">
			<button 
			className={` px-4 py-2 rounded-full ${ selected_tab == tabs.categories ? "bg-gray-500" : "bg-gray-800"}`}
			onClick={()=>{set_selected_tab(tabs.categories)}}>Categories</button>

			<button 
			className={` px-4 py-2 rounded-full ${ selected_tab == tabs.articles ? "bg-gray-500" : "bg-gray-800"}`}
			onClick={()=>{set_selected_tab(tabs.articles)}}>Articles</button>

			<button className={` px-4 py-2 rounded-full ${ selected_tab == tabs.chips ? "bg-gray-500" : "bg-gray-800"}`}
			onClick={()=>{set_selected_tab(tabs.chips)}}>Chips</button>

			<button className={` px-4 py-2 rounded-full ${ selected_tab == tabs.images ? "bg-gray-500" : "bg-gray-800"}`}
			onClick={()=>{set_selected_tab(tabs.images)}}>Images</button>
		</div>
		
		{selected_tab == tabs.categories && <Categories className="mt-8"/>}
		{selected_tab == tabs.articles && <Articles className="mt-8"/>}
		{selected_tab == tabs.chips && <Chips className="mt-8"/>}
		{selected_tab == tabs.images && <Images className="mt-8"/>}
		
	</div>
);
}
