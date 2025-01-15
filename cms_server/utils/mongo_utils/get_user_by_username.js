const User = require('../../mongo_schemas/user_schema');
const { dbConnect } = require('../db_conn')
async function get_users_by_username(username) {
    const connection = await dbConnect(process.env.DB_PRIME_NAME)

    try {
      const users = await User(connection).find({username: username});
      return users
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error'
    }
}

module.exports = {
    get_users_by_username
};
