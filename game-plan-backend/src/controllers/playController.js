const { createPlay, getPlays, getPlayById, updatePlay, deletePlay } = require('../models/playModel');

// Create a new play
const createPlayHandler = async (req, res) => {
  try {
    const { name, formation, description, data } = req.body;
    const play = await createPlay(req.user.id, name, formation, description, data);
    res.status(201).json(play);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all plays
const getPlaysHandler = async (req, res) => {
  try {
    const plays = await getPlays();
    res.json(plays);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a play by ID
const getPlayByIdHandler = async (req, res) => {
  try {
    const play = await getPlayById(req.params.id);
    if (!play) return res.status(404).json({ message: 'Play not found' });
    res.json(play);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a play (only owner or admin)
const updatePlayHandler = async (req, res) => {
  try {
    const play = await getPlayById(req.params.id);
    if (!play) return res.status(404).json({ message: 'Play not found' });

    if (req.user.id !== play.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, formation, description, data } = req.body;
    const updatedPlay = await updatePlay(req.params.id, name, formation, description, data);
    res.json(updatedPlay);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a play (only owner or admin)
const deletePlayHandler = async (req, res) => {
  try {
    const play = await getPlayById(req.params.id);
    if (!play) return res.status(404).json({ message: 'Play not found' });

    if (req.user.id !== play.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await deletePlay(req.params.id);
    res.json({ message: 'Play deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPlayHandler,
  getPlaysHandler,
  getPlayByIdHandler,
  updatePlayHandler,
  deletePlayHandler
};
