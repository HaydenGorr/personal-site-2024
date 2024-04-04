require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const prompt_data = require('./sys-prompt.json');
const viabletags = require('./viable_tags.json');

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const getSystemPrompt = (whichPrompt) => {
    if (whichPrompt === 'TF'){
        return prompt_data.base + " " + prompt_data.tag_finder.TF_base + " " + JSON.stringify(viabletags) + " " + prompt_data.tag_finder.end;
    }

    if (whichPrompt === 'CQ'){
        return prompt_data.base + " " + prompt_data.complex_querier.CQ_base  + " " +  + prompt_data.complex_querier.bridge + " " + prompt_data.complex_querier.writing.CV + " " + prompt_data.complex_querier.writing['Sensor Story App']
    }

}

app.post('/api/CQ', async (req, res) => {
    try {
        const response = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 500,
            temperature: 0,
            system: getSystemPrompt("CQ"),
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
