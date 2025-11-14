import React, { createContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister, getCurrentUser } from "../services/authService";

// Create the authentication context
export const AuthContext = createContext();

// Provider that wraps the app
export const AuthProvider = ({ children }) => {
  // Store the logged-in user in state
  const [user, setUser] = useState(null);

  // Load the current user on first page load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.log("No user logged in.");
      }
    };

    loadUser();
  }, []);

  // Handle login
  const login = async (email, password) => {
    const userData = await apiLogin(email, password);
    setUser(userData);
    return userData;
  };

  // Handle signup
  const register = async (name, email, password) => {
    const userData = await apiRegister(name, email, password);
    setUser(userData);
    return userData;
  };

  // Handle logout (clear token and user)
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
