// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * Dashboard:
 * Shows a list of plays and allows navigation to the PlayEditor.
 * Assumes user is already authenticated and token is stored in localStorage.
 */
export default function Dashboard() {
  const [plays, setPlays] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const API_BASE = "http://localhost:5001/api/plays";

  useEffect(() => {
    // Fetch all plays for the current user
    const fetchPlays = async () => {
      try {
        const res = await axios.get(API_BASE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlays(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load plays. Please make sure you're logged in.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlays();
  }, [token]);

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {loading ? (
        <p>Loading plays...</p>
      ) : plays.length === 0 ? (
        <p>No plays found. Create a new one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plays.map((play) => (
            <div
              key={play.id}
              className="p-4 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition cursor-pointer"
              onClick={() => (window.location.href = `/editor/${play.id}`)}
            >
              <h2 className="font-semibold text-xl">{play.name}</h2>
              <p className="text-gray-300">{play.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
