import dbConnect from '../db_conn';
import user_schema from "../../mongo_schemas/user_schema"
import { api_return_schema, user } from '../../interfaces/interfaces';

export async function add_user(username:string, password:string){

    console.log("creating user")

    const connection = await dbConnect(process.env.DB_USERS_NAME)
  
    try {
        const UserModel = user_schema(connection);

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

export async function get_user_by_username(username: string): Promise<api_return_schema<user|null>> {
    const connection = await dbConnect(process.env.DB_USERS_NAME)

    try {
        const user: user|null = await user_schema(connection).findOne({username: username});
        return {data:user, error:{has_error: false, error_message:""}}
    } catch (error) {
        return {data:null, error:{has_error: true, error_message:"Internal server error"}}
    }
}