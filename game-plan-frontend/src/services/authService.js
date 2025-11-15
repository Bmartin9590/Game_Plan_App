// src/services/authService.js
import axios from "axios";

const API_BASE = "http://localhost:5001/api/auth";

/**
 * Login to the application.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @return {Promise<Object>} - The response of the login request.
 */
export const login = async (email, password) => {
  const response = await axios.post(`${API_BASE}/login`, {
    email,
    password,
  });

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data;
};

/**
 * Register a new user.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @return {Promise<Object>} - The response of the register request.
 */
export const register = async (name, email, password) => {
  const response = await axios.post(`${API_BASE}/signup`, {
    name,
    email,
    password,
  });

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data;
};

/**
 * Get the current user.
 * @param {string} token - The token of the user.
 * @return {Promise<Object>} - The response of the get current user request.
 */
export const getCurrentUser = async (token) => {
  const response = await axios.get(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  return response.data;
};

/**
 * Logout of the application.
 */
export const logout = () => localStorage.removeItem("token");
