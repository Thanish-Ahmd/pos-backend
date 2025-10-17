require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test connection when app starts
async function connectDB() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL Database Connected Successfully!");
    connection.release();
  } catch (err) {
    console.error("Database Connection Failed:", err.message);
    process.exit(1); // Stop the app if DB fails to connect
  }
}

module.exports = { pool, connectDB };
