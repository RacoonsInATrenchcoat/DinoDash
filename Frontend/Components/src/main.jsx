import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./Router.jsx";
import { AppContextProvider } from "./Context"; // Import Context Provider
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap setup
import "./index.css"; // Order matters, to overwrite Bootstrap styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppContextProvider> {/* Ensures game state persists across pages */}
      <AppRouter />
    </AppContextProvider>
  </React.StrictMode>
);
