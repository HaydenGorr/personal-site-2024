import dbConnect from '../db_conn';
import user_schema from "../../mongo_schemas/user_schema"

export async function add_user(username:string, password:string){

    console.log("creating user")

    const connection = await dbConnect(process.env.DB_USERS_NAME)
  
    try {
        // Obtain the Chip model for the specific database connection
        const UserModel = user_schema(connection);

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

export async function get_users_by_username(username: string) {
    const connection = await dbConnect(process.env.DB_USERS_NAME)

    try {
      const users = await user_schema(connection).find({username: username});
      return users
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error'
    }
}