// src/components/ShareModal.jsx
import React, { useEffect, useState } from "react";
import { getSharedUsers, toggleSharedCanEdit } from "../services/playService";

const ShareModal = ({ play, onClose }) => {
  const [sharedUsers, setSharedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!play) return;
    const load = async () => {
      setLoading(true);
      try {
        const users = await getSharedUsers(play.id);
        setSharedUsers(users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [play]);

  const toggleEdit = async (sharedId) => {
    try {
      const updated = await toggleSharedCanEdit(sharedId);
      setSharedUsers((s) => s.map(u => (u.id === updated.id ? { ...u, canEdit: updated.canEdit } : u)));
    } catch (err) {
      console.error(err);
      alert("Failed to update permission");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Manage Sharing — {play?.name}</h3>
          <button onClick={onClose} className="text-white/70">Close</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sharedUsers.length === 0 ? <p className="text-sm text-gray-400">Not shared with anyone yet.</p> : null}
            {sharedUsers.map(u => (
              <div key={u.id} className="flex justify-between items-center p-2 bg-white/5 rounded">
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-gray-300">{u.email || ""}</div>
                </div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={u.canEdit} onChange={() => toggleEdit(u.id)} />
                  <span className="text-sm">Can edit</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
