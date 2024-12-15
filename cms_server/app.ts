import dotenv from 'dotenv';
import { SQL_DB } from './utils/mysql_utils/connection.js';

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

async function testConnection() {

    try {
      // Simple query to test connection
      const [result] = await SQL_DB.query('SELECT 1 + 1 AS solution');
      console.log('Database connection successful!');
      return true;
    } catch (err) {
      console.error('Failed to connect to the database:', err);
      return false;
    }
}

testConnection()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  });

app.listen(PORT, '::', () => {
    console.log(`CMS server running on port ${PORT}`);
});
