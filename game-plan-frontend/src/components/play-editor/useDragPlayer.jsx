// src/components/play-editor/useDragPlayer.js
import { useState, useRef } from "react";

export function useDragPlayer(initialPlayers) {
  const [players, setPlayers] = useState(initialPlayers);
  const dragIndex = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  function startDrag(e, index) {
    dragIndex.current = index;
    offset.current = {
      x: e.clientX - players[index].x,
      y: e.clientY - players[index].y,
    };
  }

  function handleMove(e) {
    if (dragIndex.current === null) return;

    const i = dragIndex.current;

    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === i
          ? { ...p, x: e.clientX - offset.current.x, y: e.clientY - offset.current.y }
          : p
      )
    );
  }

  function endDrag() {
    dragIndex.current = null;
  }

  return { players, startDrag, handleMove, endDrag, setPlayers };
}
