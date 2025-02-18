import React, { createContext, useState, useContext } from "react";

// 🎯 Context for score tracking
export const ScoreContext = createContext();
export const ScoreProvider = ({ children }) => {
  const [score, setScore] = useState(0);

  return (
    <ScoreContext.Provider value={{ score, setScore }}>
      {children}
    </ScoreContext.Provider>
  );
};

// 🎯 Context for game state (to pause parallax)
export const GameContext = createContext();
export const GameProvider = ({ children }) => {
  const [isRunning, setIsRunning] = useState(true); // Tracks if game is active

  return (
    <GameContext.Provider value={{ isRunning, setIsRunning }}>
      {children}
    </GameContext.Provider>
  );
};

// 🎯 Context for volume control
export const VolumeContext = createContext();
export const VolumeProvider = ({ children }) => {
  const [volume, setVolume] = useState(50); // Default volume 50%

  return (
    <VolumeContext.Provider value={{ volume, setVolume }}>
      {children}
    </VolumeContext.Provider>
  );
};

// 🎯 Custom hooks for easier access
export const useGameContext = () => useContext(GameContext);
export const useScoreContext = () => useContext(ScoreContext);
export const useVolumeContext = () => useContext(VolumeContext);

// ✅ Combined Provider (for structured management)
export const AppContextProvider = ({ children }) => {
  return (
    <GameProvider>
      <ScoreProvider>
        <VolumeProvider> {/* ✅ Wraps everything in VolumeProvider */}
          {children}
        </VolumeProvider>
      </ScoreProvider>
    </GameProvider>
  );
};
