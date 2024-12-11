import { app, anthropic } from "../express.js";


app.post('/api/CQ', async (req, res) => {

    var article_text_for_AI_consumption = [];

    // Fetch the list of articles from the CMS
    const response = await fetch(`${process.env.CMS_ROUTE}/get_all_ready_articles`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const home_page_articles_JSON = await response.json(); // Assuming the response is JSON
    const home_page_articles = home_page_articles_JSON.data

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
            model: env.process.ANTHROPIC_MODE_LIGHT,
            max_tokens: 500,
            temperature: 0,
            system: getSystemPrompt({whichPrompt:"CQ", articles_for_consumption:article_text_for_AI_consumption.join('------ NEW ARTICLE -----')}),
            messages: [
                {
                    role: "user",
                    content: req.body.content
                }
            ]
        });

        res.status(200).json(response); // Send the API response back to the frontend
    } catch (error) {
        console.error('Error proxying request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});