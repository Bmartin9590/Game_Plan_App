// src/services/authService.js
import axios from "axios";

const API_BASE = "http://localhost:5001/api/auth";

export const login = (email, password) =>
  axios.post(`${API_BASE}/login`, { email, password });

export const register = (name, email, password) =>
  axios.post(`${API_BASE}/signup`, { name, email, password });

export const getCurrentUser = (token) =>
  axios.get(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } });

export const logout = () => localStorage.removeItem("token");
