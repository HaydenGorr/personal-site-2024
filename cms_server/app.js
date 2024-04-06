require('dotenv').config({ path: process.env.ENV_FILE });
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT;
const { getDatetimeJsonPath, deleteUniqueChips, deleteHomePosts, articlesDir, metasDir } = require('./utils/get_file_paths')

app.use(cors());
app.use(express.json());

app.use('/CMS/articles/', express.static(path.join(__dirname, 'CMS', 'articles')));
app.use('/TAG_SVGS/', express.static(path.join(__dirname, 'TAG_SVGS')));

app.get('/meta_resources/home_posts', async (req, res) => {
    try {
        const jsonPath = await getDatetimeJsonPath('home_posts');

        if (!jsonPath) {
            return res.status(404).json({ message: 'Home posts JSON file not found' });
        }

        const jsonData = require(jsonPath);
        res.json(jsonData);
    } catch (error) {
        console.error('Error proxying request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/meta_resources/unique_chips', async (req, res) => {
    try {
        const jsonPath = await getDatetimeJsonPath('unique_chips');

        if (!jsonPath) {
            return res.status(404).json({ message: 'Home posts JSON file not found' });
        }

        const jsonData = require(jsonPath);
        res.json(jsonData);
    } catch (error) {
        console.error('Error proxying request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});