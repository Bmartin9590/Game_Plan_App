// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import PlayEditor from "./pages/PlayEditor";

/**
 * PrivateRoute:
 * Redirects unauthenticated users to /auth
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <PrivateRoute>
              <PlayEditor />
            </PrivateRoute>
          }
        />
        {/* Redirect unknown routes to intro */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
