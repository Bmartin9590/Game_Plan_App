import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load token & user on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Save login
  const login = (jwtToken, userData) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);

    // Route to dashboard after login
    window.location.href = "/dashboard";
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    window.location.href = "/auth";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ THE MISSING HOOK (this fixes your error)
export const useAuth = () => useContext(AuthContext);
