// src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PlayProvider } from "./context/PlayContext";
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <PlayProvider>
      <App />
    </PlayProvider>
  </AuthProvider>
);