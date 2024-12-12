import dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_FILE });

const PORT: number = parseInt(process.env.PORT!, 10);
import { app } from './express.js';

import './endpoint_logic/accounts.js'
import './endpoint_logic/articles.js'
import './endpoint_logic/categories.js'
import './endpoint_logic/chips.js'
import './endpoint_logic/misc.js'
import './endpoint_logic/images.js'
import './endpoint_logic/mdx.js'
import './endpoint_logic/ai.js'

console.log(process.env)

app.listen(PORT, '::', () => {
    console.log(`Server running on port ${PORT}`);
});
