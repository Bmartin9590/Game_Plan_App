// src/pages/PlayEditor.jsx
import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Stage, Layer, Circle, Line } from "react-konva";
import { usePlayContext } from "../context/PlayContext";
import "../index.css";

export default function PlayEditorPage() {
  const { id: playId } = useParams(); // may be undefined for /play-editor
  const navigate = useNavigate();
  const { plays, updatePlay } = usePlayContext();

  const existingPlay = playId
    ? plays.find((p) => p.id === parseInt(playId))
    : null;

  // If no playId, this is a NEW play
  const isNew = !playId;

  const [drawingLines, setDrawingLines] = useState(existingPlay?.lines || []);
  const [isDrawing, setIsDrawing] = useState(false);
  const [playerPositions, setPlayerPositions] = useState(
    existingPlay?.players || [
      { id: 1, x: 100, y: 100, color: "red" },
      { id: 2, x: 200, y: 100, color: "blue" },
    ]
  );

  const stageRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setDrawingLines((prev) => [...prev, { points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    setDrawingLines((prev) => {
      const lastLine = prev[prev.length - 1];
      const updatedLine = {
        ...lastLine,
        points: [...lastLine.points, point.x, point.y],
      };
      return [...prev.slice(0, -1), updatedLine];
    });
  };

  const handleMouseUp = () => setIsDrawing(false);

  const handlePlayerDragEnd = (e, playerId) => {
    const { x, y } = e.target.position();
    setPlayerPositions((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, x, y } : p))
    );
  };

  const clearDrawingLines = () => setDrawingLines([]);

  const savePlay = () => {
    if (isNew) {
      // For now, just log — integration with backend/creation can be added later
      console.log("Saving new play with:", { playerPositions, drawingLines });
      alert("New play saved (stub). Hook this up to backend later.");
    } else {
      updatePlay(existingPlay.id, {
        ...existingPlay,
        players: playerPositions,
        lines: drawingLines,
      });
      alert("Play updated!");
    }
  };

  const title = isNew ? "New Play" : existingPlay?.name || "Play Editor";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#020617] via-[#0a1a2f] to-black text-white p-4">
      <div className="glass-card p-4 w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>

        <Stage
          width={800}
          height={600}
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="border-2 border-white rounded-lg bg-green-900"
        >
          <Layer>
            {/* Drawn lines */}
            {drawingLines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="white"
                strokeWidth={3}
                lineCap="round"
                lineJoin="round"
              />
            ))}

            {/* Players */}
            {playerPositions.map((player) => (
              <Circle
                key={player.id}
                x={player.x}
                y={player.y}
                radius={20}
                fill={player.color}
                draggable
                onDragEnd={(e) => handlePlayerDragEnd(e, player.id)}
              />
            ))}
          </Layer>
        </Stage>

        <div className="mt-4 flex justify-center gap-4">
          <button onClick={clearDrawingLines} className="glass-btn px-4 py-2">
            Clear Drawings
          </button>

          <button onClick={savePlay} className="glass-btn px-4 py-2">
            Save Play
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="glass-btn px-4 py-2"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
