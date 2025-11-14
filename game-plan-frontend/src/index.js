import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PlayProvider } from "./context/PlayContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <PlayProvider>
    <App />
  </PlayProvider>
);

