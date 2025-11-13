const pool = require('../utils/db');
const bcrypt = require('bcryptjs');

// Create a new user in the database
const createUser = async (username, password, role) => {
  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
    [username, hashedPassword, role]
  );
  return result.rows[0]; // Return created user
};

// Retrieve a user by username
const getUserByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0]; // Return user object or undefined
};

module.exports = { createUser, getUserByUsername };
