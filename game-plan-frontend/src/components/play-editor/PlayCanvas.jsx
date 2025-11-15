// src/components/play-editor/PlayCanvas.jsx
import React, { useRef, useState, useEffect } from "react";

/**
 * PlayCanvas:
 * Interactive canvas for drawing football plays.
 * Supports mouse, touch, and Apple Pencil input.
 */
export default function PlayCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);

  const [currentLine, setCurrentLine] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas full width
    canvas.width = canvas.offsetWidth;
    canvas.height = 500;

    // Draw all lines
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    lines.forEach(line => {
      ctx.beginPath();
      line.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });

    // Draw current line while drawing
    if (currentLine.length > 0) {
      ctx.beginPath();
      currentLine.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  }, [lines, currentLine]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = e.clientY ? e.clientY - rect.top : e.touches[0].clientY - rect.top;
    setCurrentLine([{ x, y }]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = e.clientY ? e.clientY - rect.top : e.touches[0].clientY - rect.top;
    setCurrentLine(prev => [...prev, { x, y }]);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setLines(prev => [...prev, currentLine]);
      setCurrentLine([]);
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    setLines([]);
    setCurrentLine([]);
  };

  return (
    <div className="w-full">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full bg-green-700 rounded-lg border-4 border-white touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {/* Controls */}
      <div className="mt-4 flex justify-end">
        <button
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold"
          onClick={clearCanvas}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
