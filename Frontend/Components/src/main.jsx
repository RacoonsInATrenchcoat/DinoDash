import { StrictMode } from "react";
import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./Router.jsx";
import {ScoreProvider, GameProvider, VolumeProvider, LevelProvider, MusicProvider } from "./Context"; // ✅ Use direct providers
import Preloader from "./Preloader";
import { MobileProvider } from './MobileMode';
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap setup
import "./index.css"; // Order matters, to overwrite Bootstrap styles


ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Preloader />           {/*Running it once, does not need to be wrapped*/}
    <MobileProvider>
      <ScoreProvider>
        <GameProvider>
          <VolumeProvider>
            <LevelProvider>
              <MusicProvider>
                <AppRouter />
              </MusicProvider>
            </LevelProvider>
          </VolumeProvider>
        </GameProvider>
      </ScoreProvider>
    </MobileProvider>
  </StrictMode>
);
