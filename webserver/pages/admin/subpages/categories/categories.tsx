import { useEffect, useState } from "react";
import { get_all_categories } from "../../../../utils/backend/categories";
import { api_return_schema, category, error } from "../../../../../cms_server/interfaces/interfaces";
import CategoryItem from "./components/category_item";

export default function CategoriesSection() {

const [categories, set_categories] = useState<category[]>([]);
const [error, set_error] = useState<error>({has_error: false, error_message: ""});

useEffect(() => {
	const fetchCategories = async () => {

		const response: api_return_schema = await get_all_categories();

		console.log("cheap", response)

		if (!response.error.has_error) {
			set_categories(response.data as category[])
		}
		else { 
			set_error(response.error)
		}
	};
	
	fetchCategories();
}, []);


	return (
		<div className="flex flex-col">
			<button className="mb-8">Add Category</button>
			<div className="space-y-4">
				{categories.map((cat, index) => {
					return(
						<CategoryItem
						className=" p-4 rounded-xl w-fit"
						key={index}
						_id={cat._id as number}
						name={cat.name} />
					)
				})}
			</div>
		</div>
	);
}