// src/pages/Dashboard.jsx
import React from "react";
import { AuthContext } from "../context/AuthContext";
import { usePlayContext } from "../context/PlayContext"; // ✅ use the hook

export default function Dashboard() {
  const { user, logout } = React.useContext(AuthContext);
  const { plays } = usePlayContext(); // ✅ use hook instead of PlayContext

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a1a2f] to-black text-white p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Welcome, {user?.name}</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          Logout
        </button>
      </header>

      {/* Admin Section */}
      {user?.role === "ADMIN" && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Admin Controls</h2>
          <div className="flex space-x-4">
            <button className="glass-card px-4 py-2 rounded-lg hover:scale-105 transition-transform">
              Manage Users
            </button>
            <button className="glass-card px-4 py-2 rounded-lg hover:scale-105 transition-transform">
              Create Team
            </button>
          </div>
        </section>
      )}

      {/* Plays Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Plays</h2>
        {plays?.length === 0 ? (
          <p>No plays found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plays.map((play) => (
              <div
                key={play.id}
                className="glass-card p-4 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg shadow-blue-800/40 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-800/60 cursor-pointer"
              >
                <h3 className="text-xl font-semibold">{play.name}</h3>
                <p className="text-sm mt-2">{play.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
