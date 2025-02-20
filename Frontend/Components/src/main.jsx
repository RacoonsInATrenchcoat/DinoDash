import { StrictMode } from "react";
import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./Router.jsx";
import { ScoreProvider, GameProvider, VolumeProvider, LevelProvider } from "./Context"; // ✅ Use direct providers
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap setup
import "./index.css"; // Order matters, to overwrite Bootstrap styles

console.log("✅ Main.jsx is running!");

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ScoreProvider>
      <GameProvider>
        <VolumeProvider>
          <LevelProvider>
            <AppRouter /> {/* ✅ Everything wrapped correctly */}
          </LevelProvider>
        </VolumeProvider>
      </GameProvider>
    </ScoreProvider>
  </StrictMode>
);
