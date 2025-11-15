import React, { useState } from "react";
import { login, signup } from "../services/authService";

const AuthModal = ({ type = "login", onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = type === "login"
        ? await login({ email, password })
        : await signup({ name, email, password, role: "PLAYER" });

      onSuccess(user);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-8 w-96 flex flex-col"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">{type === "login" ? "Login" : "Sign Up"}</h2>

        {type === "signup" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-3 p-2 rounded bg-white/30 text-white placeholder-white"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 p-2 rounded bg-white/30 text-white placeholder-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 p-2 rounded bg-white/30 text-white placeholder-white"
          required
        />

        {error && <p className="text-red-400 mb-2">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          {type === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default AuthModal;
