// src/pages/AuthPage.jsx
import React, { useState } from "react";
import axios from "axios";

/**
 * AuthPage:
 * Handles both Login and Signup modals in a glassmorphism style.
 * Uses local state to toggle between the two modals.
 */
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // toggle between login/signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🌐 Adjust this to match your backend port
  const API_BASE = "http://localhost:5001/api/auth";

  /**
   * validateEmail:
   * Ensures proper email formatting before sending to server.
   */
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  /**
   * handleSubmit:
   * Handles both login and signup based on `isLogin` toggle.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🧠 Basic client-side validation
    if (!validateEmail(email)) {
      return setError("Please enter a valid email address.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    try {
      setLoading(true);
      if (isLogin) {
        // 🔐 Login call
        const res = await axios.post(`${API_BASE}/login`, { email, password });
        localStorage.setItem("token", res.data.token);
        alert("✅ Login successful!");
        window.location.href = "/dashboard"; // redirect after login
      } else {
        // 🧾 Signup call
        const res = await axios.post(`${API_BASE}/signup`, {
          name,
          email,
          password,
        });
        alert("✅ Signup successful! You can now log in.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Glassmorphism modal */}
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-md text-white">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Coach Brandon"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        {/* Switch between login/signup */}
        <div className="text-center mt-6">
          {isLogin ? (
            <p className="text-sm text-gray-300">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-blue-400 hover:underline"
              >
                Sign up here
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-300">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-blue-400 hover:underline"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
