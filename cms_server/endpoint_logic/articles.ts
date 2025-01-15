import { app, upload } from "../express.js";
import { Request, Response } from 'express';
import { get_all_ready_articles, create_article, get_all_articles, delete_article } from "../utils/mongo_utils/article.js";
import { update_article, get_article, create_new_article } from "../utils/mongo_utils/article.js";
import { get_selected_mdx } from "../utils/mongo_utils/mdx.js";
import { article_WID } from "../interfaces/article_interfaces.js";
import { db_article } from "../interfaces/article_interfaces.js";
import { api_return_schema } from "../interfaces/misc_interfaces.js";
import { db_mdx } from "../interfaces/mdx_interfaces.js";

app.get('/get_all_ready_articles', async (req: Request, res: Response) => {

	const response = await get_all_ready_articles()

	if (response.error.has_error) {
		res.status(500).json(response)
		return
	}

	console.log(response.data)

	res.status(200).json(response);

});

app.get('/get_article', async (req: Request, res: Response) => {

	const { article_id } = req.query;

	if (!article_id){
		res.status(500).json({data:null, error:{hasError: true, error_message: "Did not provide an article id"}})
		return
	}

	const response: api_return_schema<db_article|null> = await get_article(article_id.toString())

	if (response.error.has_error) {
		res.status(500).json(response)
		return
	}

	res.status(200).json(response);
	return

});

app.get('/secure/create_article', async (req: Request, res: Response) => {

	console.log("called: create_article")

	await create_article(req.query)

	await res.status(res.statusCode).json({ error: "" });

})

app.get('/secure/get_all_articles', async (req: Request, res: Response) => {

	// Grab and return the articles
	var articles: api_return_schema<db_article[]> = await get_all_articles()

	if (articles.error.has_error) {res.status(500).json(articles); return}

	// articles.data = articles.data.map((article_obj: any) => {
	//   return { ...article_obj.toObject(), hasImage: hasContainerPng(article_obj.source) };
	// });

	res.status(200).json(articles);

})

app.post('/secure/update_article', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mdx', maxCount: 1 }, { name: 'best_mdx', maxCount: 1 }]), async (req: Request, res: Response) => {
	const edited_article: article_WID = req.body.edited_article as article_WID;

	console.log(edited_article)
	
	const updated_result = await update_article(edited_article)

	if (updated_result.error.has_error) {
	res.status(500).json(updated_result)
	return
	}

	res.status(200).json(updated_result)
	return
})

app.post('/secure/create_new_article', upload.fields([{ name: 'new_article', maxCount: 1 }]), async (req: Request, res: Response) => {
	const new_article: article_WID = req.body.new_article as article_WID;

	try {
		if (!("full_url" in new_article)) return

		// Make sure the mdx file exists
		const mdx_entry: api_return_schema<db_mdx[]> = await get_selected_mdx({_id: new_article.mdx})

		if (mdx_entry.error.has_error || mdx_entry.data.length == 0) {
			res.status(500).json(mdx_entry)
			return
		}

		const updated_result:api_return_schema<db_article> = await create_new_article(new_article) as api_return_schema<db_article>

		if (updated_result.error.has_error) {
			res.status(500).json(updated_result)
			return
		}
	
		res.status(200).json(updated_result)
		return
	}
	catch(e) {
		res.status(500).json({ message: "Internal server error", e });
		return
	}
})

app.post('/secure/delete_article', async (req: Request, res: Response) => {
	try {
		const article_id: number = req.body.article_id;

		const updated_result: api_return_schema<Boolean> = await delete_article(article_id)

		if (updated_result.error.has_error){
			res.status(500).json(updated_result);
			return
		}

		res.status(200).json({ message: 'Chip uploaded successfully' });
		return
	}
	catch{
		res.status(500).json({ message: 'article id NaN or not present' });
		return
	}
	
	

})