// src/components/play-editor/PlayerIcon.jsx
import React from "react";

export default function PlayerIcon({ x, y, number, onMouseDown }) {
  return (
    <div
      className="absolute flex items-center justify-center w-10 h-10 
                 bg-blue-600 text-white rounded-full shadow-md 
                 cursor-grab active:cursor-grabbing select-none
                 transition-all duration-150"
      style={{ left: x, top: y }}
      onMouseDown={onMouseDown}
    >
      {number}
    </div>
  );
}
