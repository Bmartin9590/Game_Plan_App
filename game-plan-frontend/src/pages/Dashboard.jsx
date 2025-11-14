// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Dashboard:
 * Displays all plays from backend.
 * Clicking a play navigates to PlayEditor for that play.
 */
export default function Dashboard() {
  const [plays, setPlays] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_BASE = "http://localhost:5001/api/plays";

  useEffect(() => {
    const fetchPlays = async () => {
      try {
        const res = await axios.get(API_BASE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlays(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load plays. Make sure you are logged in.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlays();
  }, [token]);

  if (loading) return <p className="text-white p-8">Loading plays...</p>;

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      {/* New Play button */}
      <button
        onClick={() => navigate("/editor")}
        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        + Create New Play
      </button>

      {/* Plays list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plays.map((play) => (
          <div
            key={play.id}
            className="p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition"
            onClick={() => navigate(`/editor/${play.id}`)} // Navigate to PlayEditor
          >
            <h2 className="text-xl font-semibold">{play.name}</h2>
            <p className="text-gray-300">
              Players: {play.players ? play.players.length : 0}
            </p>
            <p className="text-gray-400 text-sm">
              Last updated: {new Date(play.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
