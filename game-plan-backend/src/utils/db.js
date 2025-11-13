// Import PostgreSQL pool from 'pg'
const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env

// Configure the database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // e.g., "postgres://user:pass@host:port/dbname"
});

// Export pool to be used in models
module.exports = pool;