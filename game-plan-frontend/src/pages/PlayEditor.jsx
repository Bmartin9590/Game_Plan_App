// src/pages/PlayEditor.jsx
import React, { useState, useEffect } from "react";
import { Stage, Layer, Circle, Line, Text } from "react-konva";
import { useParams, useNavigate } from "react-router-dom";
import { savePlay, getPlayById, updatePlay } from "../services/playService";

/**
 * PlayEditor:
 * Allows creating or editing a football play.
 * Supports dragging players and drawing routes.
 * Redirects to Dashboard after saving.
 */
const PlayEditor = () => {
  const { id } = useParams(); // Play ID if editing
  const navigate = useNavigate(); // For redirecting
  const [playName, setPlayName] = useState("");
  const [players, setPlayers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drawingRoute, setDrawingRoute] = useState([]);

  // Load play if editing
  useEffect(() => {
    if (id) {
      const fetchPlay = async () => {
        try {
          const data = await getPlayById(id);
          setPlayName(data.name);
          setPlayers(data.players || []);
          setRoutes(data.routes || []);
        } catch (error) {
          console.error("Error loading play:", error);
        }
      };
      fetchPlay();
    } else {
      // default setup for new play
      setPlayers([
        { id: 1, x: 100, y: 300, type: "offense", number: 1 },
        { id: 2, x: 200, y: 300, type: "offense", number: 2 },
        { id: 3, x: 300, y: 300, type: "offense", number: 3 },
        { id: 4, x: 500, y: 200, type: "defense", number: "D" },
        { id: 5, x: 600, y: 200, type: "defense", number: "D" },
      ]);
    }
  }, [id]);

  // Update player position after drag
  const handleDragEnd = (e, playerId) => {
    setPlayers(
      players.map((p) =>
        p.id === playerId ? { ...p, x: e.target.x(), y: e.target.y() } : p
      )
    );
  };

  // Start drawing a route
  const handleStageMouseDown = (e) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setDrawingRoute([pos.x, pos.y]);
  };

  // Continue drawing route
  const handleStageMouseMove = (e) => {
    if (drawingRoute.length === 0) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    setDrawingRoute([...drawingRoute, pos.x, pos.y]);
  };

  // Finish route drawing
  const handleStageMouseUp = () => {
    if (drawingRoute.length > 0) {
      setRoutes([...routes, drawingRoute]);
      setDrawingRoute([]);
    }
  };

  // Save play to backend
  const handleSavePlay = async () => {
    if (!playName) {
      alert("Please enter a play name");
      return;
    }

    const playData = { name: playName, players, routes };

    try {
      if (id) {
        // UPDATE existing play
        await updatePlay(id, playData);
        alert(`Play "${playName}" updated successfully!`);
      } else {
        // CREATE new play
        await savePlay(playData);
        alert(`Play "${playName}" saved successfully!`);
      }
      navigate("/"); // Redirect back to Dashboard after save
    } catch (error) {
      alert("Error saving play");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      {/* Toolbar */}
      <div className="play-toolbar mb-2 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Play Name"
          value={playName}
          onChange={(e) => setPlayName(e.target.value)}
          className="px-2 py-1 border rounded"
        />
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={handleSavePlay}
        >
          Save Play
        </button>
        <button
          className="px-3 py-1 bg-gray-300 rounded"
          onClick={() => setRoutes([])}
        >
          Clear Routes
        </button>
        <button
          className="px-3 py-1 bg-gray-400 text-white rounded"
          onClick={() => navigate("/")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Konva stage */}
      <Stage
        width={800}
        height={500}
        className="play-field"
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
      >
        <Layer>
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
                fontStyle="bold"
              />
            </React.Fragment>
          ))}

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
};

export default PlayEditor;
