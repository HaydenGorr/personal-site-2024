import { app, protectedRouter } from "../express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { get_users_by_username } from '../utils/mongo_utils/admin_user';
import { api_return_schema, user } from "../interfaces/interfaces"
import { Request, Response } from 'express';
import { add_user } from "../utils/mongo_utils/admin_user";

app.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
  
    console.log("logging in: ", username, password)
  
    const users: api_return_schema<user[]> = await get_users_by_username(username)
  
    console.log("got users: ", users)
  
    if (users.data.length === 0) {
      console.log("no users found.")
      res.status(401).json({ error: 'Invalid credentials' });
      return
    }
  
    const user: user = users.data[0] as user;
  
    try {
      console.log("validate password")
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("validated")
  
      if (!isPasswordValid) {
        console.log("Password invalid")
        res.status(401).json({ error: 'Invalid credentials' });
        return 
      }
  
      console.log("creating token")
      const token = await jwt.sign({ userId: user._id }, process.env.SECRETKEY as string, { expiresIn: '1h' });
      console.log("created token")
  
      res.json({ token });
      return 
    } catch(error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
      return 
    }
  });

  app.get('/loggedIn', protectedRouter, async (req: Request, res: Response) => {
    console.log("user checking if logged in");
  
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.SECRETKEY as string);
      console.log(decoded)
      console.log("success");
      res.json({
        data: true,
        error: {
          has_error: false,
          error_message: "",
        }
      })
      return
  
    } catch (e) {
      console.log("fail");
      res.status(401).json({
        data: false,
        error: {
          has_error: true,
          error_message: "Token has expired",
        }
      })
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