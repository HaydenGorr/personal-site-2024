// lib/dbConnect.js
import mongoose from 'mongoose';
import { MONGODB_BASE } from './path_consts.js';
import Response from './response_obj.js'

const DB_ARTICLES = process.env.DB_ARTICLES_NAME;
const DB_CHIPS = process.env.DB_CHIPS_NAME;

if (!process.env.MONGO_PATH) {
  throw new Error('Please define the MONGO_PATH environment variable.');
}

if (!process.env.DB_ARTICLES_NAME) {
  throw new Error('Please define the DB_ARTICLES_NAME environment variable.');
}

if (!process.env.DB_CHIPS_NAME) {
  throw new Error('Please define the DB_CHIPS_NAME environment variable.');
}

if (!process.env.DB_USERS_NAME) {
  throw new Error('Please define the DB_USERS_NAME environment variable.');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connections = {};

export default async function dbConnect(dbName) {
  // console.log("getting connection")
  if (connections[dbName]) {
    // console.log("got pre-existing connection")
    return connections[dbName];
  }

  const opts = {
    bufferCommands: true,
    dbName: dbName,
    authSource: 'admin'
  };

  try {
    const conn = await mongoose.createConnection(MONGODB_BASE, opts);
    connections[dbName] = conn;
    // console.log("returning connection")
    return conn
  } catch (error) {
    return new Response("", 500, `Could not establish a connection to "${dbName}":`);
  }
}