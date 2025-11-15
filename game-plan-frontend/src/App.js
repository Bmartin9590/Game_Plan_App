// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import PlayEditor from "./pages/PlayEditor";

import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          {/* Login Page */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Play Editor */}
          <Route path="/play-editor" element={<PlayEditor />} />

          {/* Optional: Fallback */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
