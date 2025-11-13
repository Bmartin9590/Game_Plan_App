// src/services/playService.js
import axios from "axios";

const API_BASE = "http://localhost:5001/api/plays";

// ✅ Get all plays
export const getPlays = async () => {
  const res = await axios.get(`${API_BASE}`);
  return res.data;
};

// ✅ Get a play by ID
export const getPlayById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

// ✅ Save a new play
export const savePlay = async (playData) => {
  const res = await axios.post(`${API_BASE}`, playData);
  return res.data;
};

// ✅ Update an existing play
export const updatePlay = async (id, playData) => {
  const res = await axios.put(`${API_BASE}/${id}`, playData);
  return res.data;
};

// ✅ Get users a play is shared with
export const getSharedUsers = async (playId) => {
  const res = await axios.get(`${API_BASE}/${playId}/shared`);
  return res.data;
};

// ✅ Toggle canEdit for a shared user
export const toggleSharedCanEdit = async (playId, userId, canEdit) => {
  const res = await axios.put(`${API_BASE}/${playId}/shared/${userId}`, { canEdit });
  return res.data;
};

// ✅ Share play to entire team
export const sharePlayToTeam = async (playId, teamId, canEdit) => {
  const res = await axios.post(`${API_BASE}/${playId}/share/team`, { teamId, canEdit });
  return res.data;
};

// ✅ Share play to position group
export const sharePlayToPositionGroup = async (playId, teamId, canEdit) => {
  const res = await axios.post(`${API_BASE}/${playId}/share/position-group`, { teamId, canEdit });
  return res.data;
};

// ✅ Share play to side of ball
export const sharePlayToSideOfBall = async (playId, teamId, sideOfBall, canEdit) => {
  const res = await axios.post(`${API_BASE}/${playId}/share/side-of-ball`, { teamId, sideOfBall, canEdit });
  return res.data;
};
