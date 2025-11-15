// src/pages/PlayEditor.jsx
import React, { useState, useRef } from "react";

const OFFENSIVE_POSITIONS = [
  "QB", "RB", "WR1", "WR2", "WR3", "TE", 
  "LT", "LG", "C", "RG", "RT"
];

const DEFENSIVE_POSITIONS = [
  "CB1", "CB2", "SS", "FS",
  "LB1", "LB2", "LB3",
  "DE1", "DT", "DE2"
];

export default function PlayEditor() {
  // -----------------------------
  // Hooks MUST be at the top level
  // -----------------------------
  const [players, setPlayers] = useState([]);
  const [selectedFormation, setSelectedFormation] = useState("offense");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const canvasRef = useRef(null);

  // -----------------------------
  // Add players based on formation
  // -----------------------------
  const handleFormationChange = (type) => {
    setSelectedFormation(type);

    const newPlayers =
      type === "offense"
        ? OFFENSIVE_POSITIONS.map((pos, idx) => ({
            id: pos + idx,
            label: pos,
            x: 100 + (idx % 5) * 80,
            y: 100 + Math.floor(idx / 5) * 80,
          }))
        : DEFENSIVE_POSITIONS.map((pos, idx) => ({
            id: pos + idx,
            label: pos,
            x: 100 + (idx % 5) * 80,
            y: 300 + Math.floor(idx / 5) * 80,
          }));

    setPlayers(newPlayers);
    setSelectedPlayer(null);
  };

  // -----------------------------
  // Drag player movement
  // -----------------------------
  const onMouseDown = (e, player) => {
    setSelectedPlayer(player.id);
  };

  const onMouseMove = (e) => {
    if (!selectedPlayer) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - 20;
    const newY = e.clientY - canvasRect.top - 20;

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === selectedPlayer ? { ...p, x: newX, y: newY } : p
      )
    );
  };

  const onMouseUp = () => {
    setSelectedPlayer(null);
  };

  // -----------------------------
  // Save Play (stub for now)
  // -----------------------------
  const savePlay = () => {
    console.log("Saved play:", players);
    alert("Play saved!");
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Play Editor</h1>

      {/* Formation Buttons */}
      <div className="mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded ${
            selectedFormation === "offense"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleFormationChange("offense")}
        >
          Offense
        </button>

        <button
          className={`px-4 py-2 rounded ${
            selectedFormation === "defense"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleFormationChange("defense")}
        >
          Defense
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full h-[500px] border bg-green-200"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {players.map((player) => (
          <div
            key={player.id}
            onMouseDown={(e) => onMouseDown(e, player)}
            className="absolute w-10 h-10 bg-white border rounded-full flex items-center justify-center cursor-pointer select-none"
            style={{
              left: player.x,
              top: player.y,
            }}
          >
            {player.label}
          </div>
        ))}
      </div>

      {/* Save button */}
      <button
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded"
        onClick={savePlay}
      >
        Save Play
      </button>
    </div>
  );
}
