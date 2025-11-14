import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth context provider
import { AuthProvider } from "./context/AuthContext";

// Pages
import AuthPage from "./pages/AuthPage";       // Combined Login + Signup page
import Dashboard from "./pages/Dashboard";     // Main dashboard (protected route)

// Components
import ProtectedRoute from "./components/ProtectedRoute"; // Protect dashboard route

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route: Login / Signup */}
          <Route path="/" element={<AuthPage />} />

          {/* Protected route: Must be logged in */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
