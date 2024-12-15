import mysql from 'mysql2'

const pool = mysql.createPool({
    host: process.env.MYSQL_PATH,
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10 // adjust based on your needs
  });

// Get the promise-based version of the pool
export const SQL_DB = pool.promise();
