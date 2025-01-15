import dbConnect from '../db_conn.js';
import user_schema from "../../mongo_schemas/user_schema.js"
import { api_return_schema, user } from '../../interfaces/interfaces.js';
import { MongoServerError } from 'mongodb';

export async function add_user(username:string, password:string): Promise<api_return_schema<string|null>> {

    const connection = await dbConnect(process.env.DB_PRIME_NAME)
  
    try {
        const UserModel = user_schema(connection);

        const newUser = new UserModel({
            username: username,
            password: password
        });

        const newuser = await newUser.save();

        return {data:newuser._id.toString(), error:{has_error: false, error_message: ""}};
    } catch (error) {
        // Check if the error is a duplicate key error
        if (error instanceof MongoServerError && error.code == 11000) {
            return {data:null, error:{has_error: true, error_message: "A user with this username already exists"}}
        }
        else {
            return {data:null, error:{has_error: true, error_message: "Internal server error"}}
        }
    }
}

export async function get_user_by_username(username: string): Promise<api_return_schema<user|null>> {
    const connection = await dbConnect(process.env.DB_PRIME_NAME)

    try {
        const user: user|null = await user_schema(connection).findOne({username: username});
        return {data:user, error:{has_error: false, error_message:""}}
    } catch (error) {
        return {data:null, error:{has_error: true, error_message:"Internal server error"}}
    }
}