const User = require('../../mongo_schemas/user_schema')
const { dbConnect } = require('../db_conn')
async function add_user(username, password){

    console.log("creating user")

    const connection = await dbConnect(process.env.DB_USERS_NAME)
  
    try {
        // Obtain the Chip model for the specific database connection
        const UserModel = User(connection);

        // Now create a new chip instance using the ChipModel
        const newUser = new UserModel({
            username: username,
            password: password
        });

        const asd = await newUser.save();

        console.log("SENATORS ", asd)

        return asd;
    } catch (error) {
        console.error('Error:', error);
    }
}


module.exports = {
    add_user
};
