const User = require('../../mongo_schemas/user_schema')
const { dbConnect } = require('../db_conn')
async function add_user(username, password){

    console.log("creating user")
  
    await dbConnect(process.env.DB_USERS_NAME)
    .then(() => {
        
        // Create a new document
        const newUser = new User(connection)({
            username: username,
            password: password
        });
        
        // Save the document
        return newUser.save();
    })
    .then(() => {
        console.log('Document inserted successfully');
    })
    .catch((err) => {
        console.error('Error:', err);
    });
}


module.exports = {
    add_user
};
