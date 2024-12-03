'use client'
import Image from "next/image";
import { useState } from "react";
import { send_login_request } from "../../../api/sign_in";
import { useRouter } from 'next/navigation';
import Categories from "../tabs/categories";
import MDX from "../tabs/MDX";
import Chips from "../tabs/chips";
import Images from "../tabs/images";
import Cookies from "js-cookie";
import Articles from "../tabs/articles";

const enum tabs{
	categories,
	articles,
	chips,
	images,
	mdx
}

export default function Login() {
const router = useRouter();

const [selected_tab, set_selected_tab] = useState<tabs>(tabs.categories);

return (
	<div className="p-4 w-full flex flex-col items-center relative max-w-[95ch]">
		<button 
		className="bg-neutral-900 text-neutral-500 px-2 py-1 rounded-full top-2 right-2 absolute"
		onClick={async ()=>{await Cookies.remove('token'); router.push('/')}}>log out</button>

		<h1 className="font-black text-4xl">Admin Panel</h1>

		<div className="mt-8 flex justify-between w-full overflow-x-scroll space-x-4 scrollbar-none">
			
		<button 
			className={` px-4 py-2 rounded-lg ${ selected_tab == tabs.articles ? "bg-blue-500" : "bg-gray-800"}`}
			onClick={()=>{set_selected_tab(tabs.articles)}}>Articles</button>

			{/* <button 
			className={` px-4 py-2 rounded-lg ${ selected_tab == tabs.mdx ? "bg-blue-500" : "bg-gray-800"}`}
			onClick={()=>{set_selected_tab(tabs.mdx)}}>MDX</button> */}

			<button className={` px-4 py-2 rounded-lg ${ selected_tab == tabs.images ? "bg-blue-500" : "bg-gray-800"}`}
			onClick={()=>{set_selected_tab(tabs.images)}}>Images</button>

			<button 
			className={` px-4 py-2 rounded-lg ${ selected_tab == tabs.categories ? "bg-blue-500" : "bg-gray-800"}`}
			onClick={()=>{set_selected_tab(tabs.categories)}}>Categories</button>

			<button className={` px-4 py-2 rounded-lg ${ selected_tab == tabs.chips ? "bg-blue-500" : "bg-gray-800"}`}
			onClick={()=>{set_selected_tab(tabs.chips)}}>Chips</button>

		</div>
		
		{selected_tab == tabs.categories && <Categories className="mt-8"/>}
		{selected_tab == tabs.articles && <Articles className="mt-8"/>}
		{selected_tab == tabs.chips && <Chips className="mt-8"/>}
		{selected_tab == tabs.images && <Images className="mt-8"/>}
		{selected_tab == tabs.mdx && <MDX className="mt-8"/>}
		
	</div>
);
}
