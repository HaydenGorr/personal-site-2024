require('dotenv').config({ path: process.env.ENV_FILE });
console.log(process.env.PORT);
const Anthropic = require('@anthropic-ai/sdk');
const express = require('express');
const cors = require('cors');
const app = express();
const prompt_data = require('./sys-prompt.json');
const viabletags = require('./viable_tags.json');

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const getSystemPrompt = (whichPrompt, articles_for_consumption="") => {
    if (whichPrompt === 'TF'){
        return prompt_data.base + " " + prompt_data.tag_finder.TF_base + " " + JSON.stringify(viabletags) + " " + prompt_data.tag_finder.end;
    }

    if (whichPrompt === 'CQ'){
        return prompt_data.base + " " + prompt_data.complex_querier.CQ_base  + " " +  + prompt_data.complex_querier.bridge + " " + prompt_data.complex_querier.writing.CV + " " + articles_for_consumption
    }
}

app.post('/api/CQ', async (req, res) => {

    var article_text_for_AI_consumption = [];

    // Fetch the list of articles from the CMS
    const response = await fetch(`${process.env.CMS_ROUTE}/meta_resources/home_posts`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const home_page_articles = await response.json(); // Assuming the response is JSON

    // Make sure to use 'let' or 'const' for variable declarations
    for (let article of home_page_articles) { // Assuming 'home_page_articles' is an iterable array
      // Fetch each article content based on the article source
      const articleResponse = await fetch(`${process.env.CMS_ROUTE}/CMS/articles/${article.source}/article.mdx`);
      if (!articleResponse.ok) {
        throw new Error(`HTTP error! status: ${articleResponse.status}`);
      }
      const articleText = await articleResponse.text(); // Assuming you want the raw text
      article_text_for_AI_consumption.push(articleText);
    }

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 500,
            temperature: 0,
            system: getSystemPrompt("CQ", article_text_for_AI_consumption.join(' ------ NEW ARTICLE -----')),
            messages: [
                {
                    role: "user",
                    content: req.body.content
                }
            ]
        });

        res.json(response); // Send the API response back to the frontend
    } catch (error) {
        console.error('Error proxying request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/TF', async (req, res) => {

    try {
        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 500,
            temperature: 0,
            system: getSystemPrompt("TF"),
            messages: [
                {
                    role: "user",
                    content: req.body.content
                }
            ]
        });

        res.json(response); // Send the API response back to the frontend
    } catch (error) {
        console.error('Error proxying request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});