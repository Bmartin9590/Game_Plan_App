import React, { useEffect, useState } from "react";
import { Stage, Layer, Circle, Text } from "react-konva";
import { useParams } from "react-router-dom";
import { getPlayById } from "../services/playService";

const PlayEditor = () => {
  const { id } = useParams();
  const [play, setPlay] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPlayById(id);
      setPlay(data);
      setPlayers(data.players);
    };
    fetchData();
  }, [id]);

  const handleDragEnd = (e, playerId) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId ? { ...p, x: e.target.x(), y: e.target.y() } : p
      )
    );
  };

  if (!play) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">{play.name}</h1>
      <Stage width={800} height={500} className="play-field">
        <Layer>
          {players.map((p) => (
            <React.Fragment key={p.id}>
              <Circle
                x={p.x}
                y={p.y}
                radius={20}
                fill={p.type === "offense" ? "#2563EB" : "#DC2626"}
                draggable
                onDragEnd={(e) => handleDragEnd(e, p.id)}
              />
              <Text
                text={p.number.toString()}
                x={p.x - 6}
                y={p.y - 8}
                fontSize={14}
                fill="white"
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default PlayEditor;
