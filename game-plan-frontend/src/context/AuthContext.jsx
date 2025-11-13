// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser as apiGetCurrentUser, logout as apiLogout } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const u = await apiGetCurrentUser();
        if (u) setUser(u);
      } catch (err) {
        // token invalid
        apiLogout();
        setUser(null);
      }
    };
    fetch();
  }, []);

  const login = (userObj) => {
    setUser(userObj);
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
