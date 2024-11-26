'use client'
import { useState } from "react";
import { category } from "../../../../../api/api_interfaces";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className?: string;
	name: string;
	_id: number;
}

export default function CategoryContainer({ name, _id, className }: props) {

const [selected_tab, set_selected_tab] = useState<tabs>(tabs.categories);

return (
	<div className={`${className} bg-neutral-700 px-4 py-2 rounded-full`}>
		{name}
	</div>
);
}
