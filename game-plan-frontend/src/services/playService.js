// src/services/playService.js
import api from "./api";

export const getPlays = async () => {
  const res = await api.get("/api/plays");
  return res.data;
};

export const getPlayById = async (id) => {
  const res = await api.get(`/api/plays/${id}`);
  return res.data;
};

export const savePlay = async (playData) => {
  const res = await api.post("/api/plays", playData);
  return res.data;
};

export const updatePlay = async (id, playData) => {
  const res = await api.put(`/api/plays/${id}`, playData);
  return res.data;
};

/* Share endpoints */
export const sharePlayToTeam = async (playId, teamId, canEdit) => {
  const res = await api.post(`/api/plays/${playId}/share/team`, { teamId, canEdit });
  return res.data;
};
export const sharePlayToPositionGroup = async (playId, teamId, canEdit) => {
  const res = await api.post(`/api/plays/${playId}/share/position-group`, { teamId, canEdit });
  return res.data;
};
export const sharePlayToSideOfBall = async (playId, teamId, side, canEdit) => {
  const res = await api.post(`/api/plays/${playId}/share/side-of-ball`, { teamId, side, canEdit });
  return res.data;
};

export const getSharedUsers = async (playId) => {
  const res = await api.get(`/api/plays/${playId}/shared-users`);
  return res.data;
};

export const toggleSharedCanEdit = async (sharedPlayId) => {
  const res = await api.patch(`/api/plays/shared/${sharedPlayId}/toggle-edit`);
  return res.data;
};
