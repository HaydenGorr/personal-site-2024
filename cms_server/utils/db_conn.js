// lib/dbConnect.js
const mongoose = require('mongoose');
const { MONGODB_BASE } = require('./path_consts');

const DB_ARTICLES = process.env.DB_ARTICLES_NAME;
const DB_CHIPS = process.env.DB_CHIPS_NAME;

if (!process.env.MONGO_PORT) {
  throw new Error('Please define the MONGO_PORT environment variable.');
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

async function dbConnect(dbName) {
  if (connections[dbName]) {
    return connections[dbName];
  }

  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: true,
    dbName: dbName,
  };

  try {
    const conn = await mongoose.createConnection(MONGODB_BASE, opts);
    connections[dbName] = conn;
    return conn;
  } catch (error) {
    console.error(`Error connecting to database "${dbName}":`, error);
    throw error;
  }
}

module.exports = {
  dbConnect
};
