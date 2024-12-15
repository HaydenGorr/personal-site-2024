import dbConnect from '../db_conn.js';
import user_schema from "../../mongo_schemas/user_schema.js"
import { api_return_schema, user } from '../../interfaces/interfaces.js';
import { MongoServerError } from 'mongodb';
import { SQL_DB }from '../mysql_utils/connection.js'
import { User, dBO } from '../../interfaces/sql_interfaces.js';
import { RowDataPacket, FieldPacket } from 'mysql2';

export async function add_user(username:string, password:string): Promise<api_return_schema<string|null>> {

    const connection = await dbConnect(process.env.DB_USERS_NAME)
  
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
    const connection = await dbConnect(process.env.DB_USERS_NAME)

    try {
        const user: user|null = await user_schema(connection).findOne({username: username});
        return {data:user, error:{has_error: false, error_message:""}}
    } catch (error) {
        return {data:null, error:{has_error: true, error_message:"Internal server error"}}
    }
}

export async function add_user_SQL(username: string, password: string): Promise<api_return_schema<string | null>> {
    try {
      const [result]: any = await SQL_DB.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password]
      );
  
      return { data: result.insertId.toString(), error: { has_error: false, error_message: "" } };
    } catch (error: any) {
      // Check if this is a duplicate entry error (MySQL error code for duplicate key is 'ER_DUP_ENTRY')
      if (error.code === 'ER_DUP_ENTRY') {
        return { data: null, error: { has_error: true, error_message: "A user with this username already exists" } };
      } else {
        return { data: null, error: { has_error: true, error_message: "Internal server error" } };
      }
    }
  }

export async function get_user_by_username_SQL(username: string): Promise<api_return_schema<User|null>> {

    try {
        const [rows] = await SQL_DB.execute<dBO<user>[]>(
            'SELECT id, username, password, creation_date FROM users WHERE username = ? LIMIT 1',
            [username]
        );

        const user = rows.length > 0 ? rows[0] as User : null

        if (user == null) {
            return {data:null, error:{has_error: true, error_message:"No user found"}}
        }

        return {data:user, error:{has_error: false, error_message:""}}
    } catch (error) {
        return {data:null, error:{has_error: true, error_message:"Internal server error"}}
    }
}