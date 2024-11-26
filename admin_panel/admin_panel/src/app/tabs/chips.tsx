'use client'
import { useState } from "react";

const enum tabs{
	categories,
	articles,
	chips
}

interface props {
    className: string;
}

export default function Chips({ className }: props) {

const [selected_tab, set_selected_tab] = useState<tabs>(tabs.categories);


return (
	<div className={`${className} `}>
		asd
	</div>
);
}
