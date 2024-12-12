import { error } from "console";
import { app, anthropic } from "../express.js";
import { get_all_ready_articles } from "../utils/mongo_utils/article.js";
import { api_return_schema, article, chip } from "../interfaces/interfaces.js";
import { get_chat_bot_system_prompt, get_tag_finder_system_prompt } from '../utils/ai_utils.js'
import { get_unique_chips } from "../utils/mongo_utils/chips.js";
import Anthropic, { AnthropicError } from "@anthropic-ai/sdk";


app.post('/ai/chat_bot', async (req, res) => {

    const user_text = req.body.content

    // Fetch the list of articles from the CMS
    const response: api_return_schema<article[]> = await get_all_ready_articles()

	if (response.error.has_error) {
		res.status(500).json(response)
		return
	}

    var article_text_for_AI_consumption = [];

    for (let article of response.data) { 
        const articleResponse = await fetch(article.article);
        try {
            if (articleResponse.ok) {
                const articleText = await articleResponse.text(); 
                article_text_for_AI_consumption.push(articleText);
            }else{
                throw new Error("Could not fetch article in /ai/chat_bot")
            }
        }
        catch(e){
            console.log(e)
        }
    }

    const prompt_obj: api_return_schema<string> = get_chat_bot_system_prompt( article_text_for_AI_consumption.join('------ NEW ARTICLE -----') )
    const prompt: string = prompt_obj.data

    if( prompt_obj.error.has_error ){
        res.status(500).json(prompt_obj)
        return
    }

    try {
        const response = await anthropic.messages.create({
            model: process.env.ANTHROPIC_MODE_LIGHT!,
            max_tokens: 1024,
            temperature: 70,
            system: prompt,
            messages: [
                {
                    role: "user",
                    content: user_text
                }
            ]
        });

        res.status(200).json(response); // Send the API response back to the frontend
    } catch (error: any) {

        console.log(error.error)
        if (error?.error?.error?.message && error?.status) {
            res.status(error.status).json({ data:"", error:{has_error: true, error_message: error.error.error.message} });
            return
        }
        else  {
            res.status(500).json({ message: 'Internal server error' });
        }

    }
});

app.post('/ai/tag_finder', async (req, res) => {

    const user_text = req.body.content

    const response: api_return_schema<chip[]> = await get_unique_chips()

    if (response.error.has_error) {res.status(500).json(response); return}

    const prompt_obj: api_return_schema<string> = get_tag_finder_system_prompt( response.data )
    const prompt: string = prompt_obj.data

    if( prompt_obj.error.has_error ){
        res.status(500).json(prompt_obj)
        return
    }

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 500,
            temperature: 0,
            system: prompt,
            messages: [
                {
                    role: "user",
                    content: user_text
                }
            ]
        });

        res.json(response); // Send the API response back to the frontend
    } catch (error: any) {

        console.log(error.error)

        if (error?.error?.error?.message && error?.status) {
            res.status(error.status).json({ data:"", error:{has_error: true, error_message: error.error.error.message} });
            return
        }
        else  {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});