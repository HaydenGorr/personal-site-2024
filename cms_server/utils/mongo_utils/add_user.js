const mongoose = require('mongoose');
const { MONOGDB_USERS } = require('../path_consts')
const { User } = require('../../mongo_schemas/user_schema')

async function add_user(username, password){

    console.log("creating user")
  
    await mongoose.connect(MONOGDB_USERS)
    .then(() => {
        
        // Create a new document
        const newUser = new User({
            username: username,
            password: password
        });
        
        // Save the document
        return newUser.save();
    })
    .then(() => {
        console.log('Document inserted successfully');
        // Close the connection
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error('Error:', err);
    });
}


module.exports = {
    add_user
};
