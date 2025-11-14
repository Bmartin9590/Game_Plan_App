// src/pages/Dashboard.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      <p className="text-xl mb-4">
        Welcome, <span className="font-semibold">{user?.name}</span>!
      </p>

      <button
        onClick={logout}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
