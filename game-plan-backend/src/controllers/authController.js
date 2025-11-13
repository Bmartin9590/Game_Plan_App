const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createUser, getUserByUsername } = require('../models/userModel');

// Register a new user
const register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await createUser(username, password, role || 'coach'); // default role = coach
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login existing user
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Payload: user ID and role
      process.env.JWT_SECRET,           // Secret from environment
      { expiresIn: '8h' }               // Token valid for 8 hours
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };
