import { createContext, useContext, useState, useEffect } from "react";
import { getPlays } from "../services/playService";

// Create a global context for play data
const PlayContext = createContext();

export const PlayProvider = ({ children }) => {
  const [plays, setPlays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load plays from backend
  const loadPlays = async () => {
    try {
      setLoading(true);
      const data = await getPlays();
      setPlays(data);
    } catch (err) {
      console.error("Error loading plays:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load plays at startup
  useEffect(() => {
    loadPlays();
  }, []);

  return (
    <PlayContext.Provider value={{ plays, loading, loadPlays }}>
      {children}
    </PlayContext.Provider>
  );
};

export const usePlayContext = () => useContext(PlayContext);
