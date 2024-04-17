const { MONOGDB_USERS } = require('../path_consts')
const mongoose = require('mongoose');
const { User } = require('../../mongo_schemas/user_schema');

async function get_users_by_username(username) {
  
    try {
      await mongoose.connect(MONOGDB_USERS);
      const users = await User.find({username: username});
      return users
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error'
    } finally {
        await mongoose.connection.close();
    }
}

module.exports = {
    get_users_by_username
};
