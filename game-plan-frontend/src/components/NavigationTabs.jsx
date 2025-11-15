// src/components/NavigationTabs.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavigationTabs() {
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  const tabs = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/play-editor", label: "Play Editor" },
  ];

  return (
    <div className="w-full flex items-center justify-between bg-[#020617]/90 backdrop-blur-md border-b border-white/10 px-6 py-3 fixed top-0 left-0 z-40">
      <div className="text-white font-bold text-xl">GamePlan</div>

      <div className="flex space-x-3">
        {tabs.map((tab) => {
          const active = location.pathname.startsWith(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <button
        onClick={logout}
        className="px-3 py-2 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white transition"
      >
        Logout
      </button>
    </div>
  );
}
