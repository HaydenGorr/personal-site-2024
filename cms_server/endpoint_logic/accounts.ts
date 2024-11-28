import { app, protectedRouter } from "../express";
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken';
import { get_user_by_username } from '../utils/mongo_utils/admin_user';
import { api_return_schema, user, userId_JWTPayload } from "../interfaces/interfaces"
import { Request, Response } from 'express';
import { add_user } from "../utils/mongo_utils/admin_user";
import { create_jwt_token } from "../utils/create_jwt_token";

app.post('/login', async (req: Request, res: Response) => {
	const { username, password } = req.body;

	if (username.length < 1 || password.length < 1) {
	res.status(401).json({data:"", error: {has_error: true, error_message: `Missing username or password`} });
	return
	}

	const mongo_response: api_return_schema<user|null> = await get_user_by_username(username)
	
	if (mongo_response.error.has_error) {
	res.status(500).json(mongo_response);
	return
	}

	if (mongo_response.data == null) {
		res.status(401).json({data:"", error: {has_error: true, error_message: `No matching user`} });
		return
	}

	if (!("_id" in mongo_response.data)) {
		throw Error(`missing user ID in user ${username}`)
		return
	}

	const user = mongo_response.data

	// Validate password
	try {
	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) {
		res.status(401).json({data:"", error: {has_error: true, error_message: `Invalid password`} });
		return 
	}

	// Create Token
	const token = await create_jwt_token(user._id as number) 

	res.status(200).json({data:token, error: {has_error: false, error_message: ``} });

	return 

	} catch(error) {

	res.status(500).json({data:"", error: {has_error: true, error_message: `Internal Server Error`} });

	return 
	}
});

app.get('/loggedIn', protectedRouter, async (req: Request, res: Response) => {

	try {

		const token = req.cookies.token;

		if (!token) {
			res.status(401).json({ data: {new_token: null, logged_in:false },  error: {  has_error: true,  error_message: "No token provided" } });
			return;
		}

		try {
			const decoded = jwt.verify(token, process.env.SECRETKEY as string) as userId_JWTPayload;

			res.status(200).json({ data: { new_token: null, logged_in:true }, error: {has_error: false, error_message: ""}})
			return
		}
		catch (e) {
			if (e instanceof jwt.TokenExpiredError) {
				const decoded_expired_token = jwt.decode(token) as userId_JWTPayload

				if (decoded_expired_token && decoded_expired_token.userId) {
					const newToken = await create_jwt_token(parseInt(decoded_expired_token.userId))
					res.status(200).json({ data: {new_token: newToken, logged_in: true },  error: {  has_error: false,  error_message: "" } })
					return
				}

				res.status(401).json({ data: {new_token: null, logged_in:false }, error: {has_error: true, error_message: "Invalid token"}})
				return
			}
		}

	} catch (e) {
		res.status(500).json({ data: {new_token: null, logged_in:false }, error: { has_error: true, error_message: "Internal Server Error",}})
		return
	}

});


app.post('/signup', async (req: Request, res: Response) => {
	const { username, password } = req.body;

	console.log(username, password)

	try {
	// Hash the password using bcrypt
	const hashedPassword = await bcrypt.hash(password, 10);

	if (!await add_user(username, hashedPassword)) {
		console.log("Failed to add user")
		return
	}

	res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
	console.error('Registration error:', error);
	res.status(500).json({ error: 'Internal server error' });
	}
})