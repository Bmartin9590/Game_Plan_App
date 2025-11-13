// src/pages/PlayEditor.jsx
import React, { useEffect, useState } from "react";
import { Stage, Layer, Circle, Line, Text } from "react-konva";
import { useParams } from "react-router-dom";
import axios from "axios";

/**
 * PlayEditor:
 * Fully interactive visual play editor using react-konva.
 * Features:
 * - Draggable player icons
 * - Draw routes with mouse
 * - Save play via API
 */

export default function PlayEditor() {
  const { id } = useParams(); // Play ID from URL (if editing an existing play)
  const [playName, setPlayName] = useState("");
  const [players, setPlayers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drawingRoute, setDrawingRoute] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const API_BASE = "http://localhost:5001/api/plays";

  // Load play from backend if editing
  useEffect(() => {
    const fetchPlay = async () => {
      if (!id) {
        // New play default setup
        setPlayers([
          { id: 1, x: 100, y: 300, type: "offense", number: 1 },
          { id: 2, x: 200, y: 300, type: "offense", number: 2 },
          { id: 3, x: 300, y: 300, type: "offense", number: 3 },
          { id: 4, x: 500, y: 200, type: "defense", number: "D" },
          { id: 5, x: 600, y: 200, type: "defense", number: "D" },
        ]);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setPlayName(data.name);
        setPlayers(data.players || []);
        setRoutes(data.routes || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load play.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlay();
  }, [id, token]);

  // Update player position after drag
  const handleDragEnd = (e, playerId) => {
    const updated = players.map((p) =>
      p.id === playerId ? { ...p, x: e.target.x(), y: e.target.y() } : p
    );
    setPlayers(updated);
  };

  // Begin drawing a route
  const handleStageMouseDown = (e) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setDrawingRoute([pos.x, pos.y]);
  };

  // Continue drawing while dragging
  const handleStageMouseMove = (e) => {
    if (drawingRoute.length === 0) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setDrawingRoute([...drawingRoute, pos.x, pos.y]);
  };

  // Finish route
  const handleStageMouseUp = () => {
    if (drawingRoute.length > 0) {
      setRoutes([...routes, drawingRoute]);
      setDrawingRoute([]);
    }
  };

  // Save play to backend
  const handleSavePlay = async () => {
    if (!playName) return alert("Please enter a play name.");

    const playData = { name: playName, players, routes };
    try {
      if (id) {
        await axios.put(`${API_BASE}/${id}`, playData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(`Play "${playName}" updated!`);
      } else {
        const res = await axios.post(API_BASE, playData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(`Play saved! ID: ${res.data.id}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving play.");
    }
  };

  if (loading) return <p className="text-white p-8">Loading play...</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white flex flex-col items-center">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Play Name"
          value={playName}
          onChange={(e) => setPlayName(e.target.value)}
          className="px-2 py-1 rounded border border-white/30 bg-white/10 text-white"
        />
        <button
          onClick={handleSavePlay}
          className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
        >
          Save Play
        </button>
        <button
          onClick={() => setRoutes([])}
          className="px-3 py-1 bg-gray-500 rounded hover:bg-gray-600"
        >
          Clear Routes
        </button>
      </div>

      {/* Play field */}
      <Stage
        width={800}
        height={500}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        className="border border-white/20 bg-green-800 rounded-lg"
      >
        <Layer>
          {/* Players */}
          {players.map((player) => (
            <React.Fragment key={player.id}>
              <Circle
                x={player.x}
                y={player.y}
                radius={15}
                fill={player.type === "offense" ? "#2563EB" : "#DC2626"}
                draggable
                onDragEnd={(e) => handleDragEnd(e, player.id)}
              />
              <Text
                x={player.x - 6}
                y={player.y - 8}
                text={player.number.toString()}
                fontSize={14}
                fill="white"
              />
            </React.Fragment>
          ))}

          {/* Existing routes */}
          {routes.map((route, idx) => (
            <Line
              key={idx}
              points={route}
              stroke="yellow"
              strokeWidth={3}
              lineCap="round"
              lineJoin="round"
            />
          ))}

          {/* Current drawing */}
          {drawingRoute.length > 0 && (
            <Line
              points={drawingRoute}
              stroke="yellow"
              strokeWidth={3}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
