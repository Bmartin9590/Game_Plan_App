// src/pages/PlayEditor.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

/**
 * PlayEditor:
 * Loads a single play by ID and displays basic info.
 * Later, you can integrate react-konva for full visual editing.
 */
export default function PlayEditor() {
  const { id } = useParams();
  const [play, setPlay] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const API_BASE = "http://localhost:5001/api/plays";

  useEffect(() => {
    const fetchPlay = async () => {
      try {
        const res = await axios.get(`${API_BASE}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlay(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load play. Make sure you are logged in.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlay();
  }, [id, token]);

  if (loading) return <p className="p-8 text-white">Loading play...</p>;
  if (!play) return <p className="p-8 text-white">Play not found</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">{play.name}</h1>
      <p className="mb-6">{play.description}</p>

      <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
        <p>This is where the visual play editor will go (react-konva).</p>
        {/* You can integrate player positions, draggable icons, and annotations here */}
      </div>
    </div>
  );
}
