// src/pages/IntroPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function IntroPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#020617] via-[#0a1a2f] to-black text-white">
      <div className="glass-card text-center max-w-xl p-10 rounded-3xl shadow-2xl backdrop-blur-lg bg-white/10 border border-white/20 transform transition-transform duration-300 hover:scale-105 hover:shadow-blue-800/50">
        <h1 className="text-5xl font-bold mb-4">Welcome to GamePlan</h1>
        <p className="text-gray-300 mb-6">
          Build, share, and manage your football plays with a sleek interface.
        </p>
        <button
          className="glass-btn bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-blue-500/20 transform hover:scale-105"
          onClick={() => navigate("/auth")}
        >
          Login / Sign Up
        </button>
      </div>
    </div>
  );
}
