// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import IntroPage from "./pages/IntroPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import PlayEditorPage from "./pages/PlayEditor";

import NavigationTabs from "./components/NavigationTabs";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Checking session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Router>
      {/* Top nav (only when logged in) */}
      {user && <NavigationTabs />}

      {/* Offset for fixed nav */}
      <div className={user ? "pt-16" : ""}>
        <Routes>
          {/* Intro */}
          <Route path="/" element={<IntroPage />} />

          {/* Auth */}
          <Route
            path="/auth"
            element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />}
          />

          {/* Dashboard (protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Play Editor (protected) */}
          <Route
            path="/play-editor"
            element=
              {
                <ProtectedRoute>
                  <PlayEditorPage />
                </ProtectedRoute>
              }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <Navigate to={user ? "/dashboard" : "/auth"} replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
