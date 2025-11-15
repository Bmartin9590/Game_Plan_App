// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/" className="hover:text-yellow-300">Dashboard</Link>

        <Link to="/play-editor" className="hover:text-yellow-300">
          Play Editor
        </Link>
      </div>

      {/* Right Side */}
      <div>
        {!user ? (
          <Link
            to="/auth"
            className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
