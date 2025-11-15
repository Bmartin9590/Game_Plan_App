import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth"); // redirect to login
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a1a2f] to-black text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
      {/* Dashboard content here */}
    </div>
  );
}
