// src/pages/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getPlays, sharePlayToTeam, sharePlayToPositionGroup, sharePlayToSideOfBall } from "../services/playService";
import { AuthContext } from "../context/AuthContext";
import ShareModal from "../components/ShareModal";

const Dashboard = () => {
  const [plays, setPlays] = useState([]);
  const [canEdit, setCanEdit] = useState(false);
  const [selectedPlay, setSelectedPlay] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPlays();
        setPlays(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleShare = async (playId) => {
    // For demo, assume teamId 1. In real app, choose team from UI
    const teamId = 1;
    try {
      if (user.role === "HEAD_COACH") {
        await sharePlayToTeam(playId, teamId, canEdit);
        alert("Shared with team");
      } else if (user.role === "COORDINATOR") {
        await sharePlayToSideOfBall(playId, teamId, "OFFENSE", canEdit);
        alert("Shared with side-of-ball");
      } else if (user.role === "POSITION_COACH") {
        await sharePlayToPositionGroup(playId, teamId, canEdit);
        alert("Shared with position group");
      } else {
        alert("You do not have permission to share this play");
      }
    } catch (err) {
      console.error(err);
      alert("Error sharing play");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm">Role: <span className="font-medium">{user?.role}</span></div>
        </div>
      </div>

      <div className="mb-4">
        <label className="mr-2">Can Edit:</label>
        <input type="checkbox" checked={canEdit} onChange={(e) => setCanEdit(e.target.checked)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plays.map(play => (
          <div key={play.id} className="p-4 bg-white/5 rounded cursor-pointer">
            <div onClick={() => navigate(`/editor/${play.id}`)}>
              <h3 className="font-bold">{play.name}</h3>
              <p className="text-sm text-gray-300">Players: {play.players?.length || 0} | Routes: {play.routes?.length || 0}</p>
            </div>
            <div className="mt-3 flex justify-between">
              <button onClick={() => handleShare(play.id)} className="px-3 py-1 bg-green-600 rounded text-white">Share</button>
              <button onClick={() => { setSelectedPlay(play); setShowShareModal(true); }} className="px-3 py-1 bg-gray-700 rounded text-white">Manage</button>
            </div>
          </div>
        ))}
      </div>

      {showShareModal && selectedPlay && <ShareModal play={selectedPlay} onClose={() => setShowShareModal(false)} />}
    </div>
  );
};

export default Dashboard;
