import dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_FILE });

const PORT: number = parseInt(process.env.PORT!, 10);
import { app  } from './express';

import './endpoint_logic/accounts'
import './endpoint_logic/articles'
import './endpoint_logic/categories'
import './endpoint_logic/chips'
import './endpoint_logic/misc'
import './endpoint_logic/images'
import './endpoint_logic/mdx'

app.listen(PORT, '::', () => {
    console.log(`Server running on port ${PORT}`);
});
