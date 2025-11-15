// src/components/NavigationTabs.jsx
import { Link, useLocation } from "react-router-dom";

export default function NavigationTabs() {
  const location = useLocation();

  const tabs = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/play-editor", label: "Play Editor" },
    { path: "/formations", label: "Formations" },
    { path: "/scripts", label: "Scripts" }
  ];

  return (
    <div className="w-full flex justify-around bg-gray-900 text-white py-3">
      {tabs.map((tab) => {
        const active = location.pathname === tab.path;

        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-4 py-2 rounded-md transition ${
              active ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
