import React from "react";

export default function GlassLayout({ children }) {
  return (
    <div className="min-h-screen w-full p-6
      bg-gradient-to-br from-[#020617] via-[#0a1a2f] to-black
      text-white">

      {/* Centered container */}
      <div className="
        max-w-7xl mx-auto 
        backdrop-blur-xl bg-white/5
        border border-white/10 rounded-3xl
        shadow-xl shadow-black/40
        p-8
      ">
        {children}
      </div>
    </div>
  );
}
