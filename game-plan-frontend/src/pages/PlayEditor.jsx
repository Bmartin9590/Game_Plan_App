import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlayById, savePlay, updatePlay } from "../services/playService";

/**
 * PlayEditor: edit a single play
 */
export default function PlayEditor() {
  const { id } = useParams();
  const [play, setPlay] = useState(null);

  useEffect(() => {
    async function fetchPlay() {
      const data = await getPlayById(id);
      setPlay(data);
    }
    fetchPlay();
  }, [id]);

  if (!play) return <p className="text-center mt-10 text-white">Loading...</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#020617] via-[#0a1a2f] to-black">
      <h1 className="text-3xl font-bold text-white mb-4">{play.name}</h1>

      <div className="play-field glass-modal mb-4">
        <p className="text-gray-300">Edit your play here...</p>
      </div>

      <div className="flex gap-3">
        <button onClick={() => savePlay(play)} className="glass-btn">
          Save
        </button>
        <button onClick={() => updatePlay(play)} className="glass-btn">
          Update
        </button>
      </div>
    </div>
  );
}
