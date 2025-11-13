// src/services/authService.js
import api from "./api";

export const login = async ({ email, password }) => {
  const res = await api.post("/api/auth/login", { email, password });
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res.data.user;
};

export const signup = async ({ name, email, password, role, teamId }) => {
  const res = await api.post("/api/auth/signup", { name, email, password, role, teamId });
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  return res.data.user;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const res = await api.get("/api/auth/me");
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
