import { useEffect, useState } from "react";

interface props {
    _id: number;
    name: string;
    className?: string;
}

export default function CategoryItem( { _id, name, className="" }: props ) {


    useEffect(() => {
        
    }, []);


	return (
		<div className={`${className} bg-gray-400`}>
			{name}
		</div>
	);
}