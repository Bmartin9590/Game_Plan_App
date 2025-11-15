const pool = require('../utils/db');

// Create a new play
const createPlay = async (userId, name, formation, description, data) => {
  const result = await pool.query(
    `INSERT INTO plays (user_id, name, formation, description, data)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, name, formation, description, JSON.stringify(data)]
  );
  return result.rows[0];
};

// Retrieve all plays
const getPlays = async () => {
  const result = await pool.query(`SELECT * FROM plays ORDER BY created_at DESC`);
  return result.rows;
};

// Retrieve a single play by ID
const getPlayById = async (id) => {
  const result = await pool.query(`SELECT * FROM plays WHERE id = $1`, [id]);
  return result.rows[0];
};

// Update an existing play
const updatePlay = async (id, name, formation, description, data) => {
  const result = await pool.query(
    `UPDATE plays SET name=$1, formation=$2, description=$3, data=$4, updated_at=NOW()
     WHERE id=$5 RETURNING *`,
    [name, formation, description, JSON.stringify(data), id]
  );
  return result.rows[0];
};

// Delete a play
const deletePlay = async (id) => {
  await pool.query(`DELETE FROM plays WHERE id=$1`, [id]);
};

module.exports = { createPlay, getPlays, getPlayById, updatePlay, deletePlay };
