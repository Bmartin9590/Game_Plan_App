import React, { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import AuthModal from "./components/AuthModal";
import { getCurrentUser, logout } from "./services/authService";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) setShowLogin(true);
      else setUser(currentUser);
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowLogin(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {!user && showLogin && (
        <AuthModal type="login" onSuccess={(u) => { setUser(u); setShowLogin(false); }} />
      )}
      {user && (
        <>
          <header className="p-4 bg-gray-800 flex justify-between">
            <h1>Game Plan</h1>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </header>
          <Dashboard user={user} />
        </>
      )}
    </div>
  );
}

export default App;
