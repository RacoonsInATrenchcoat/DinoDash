import React, { createContext, useState, useContext } from "react";

// Context for score tracking
export const ScoreContext = createContext();
export const ScoreProvider = ({ children }) => {
  const [score, setScore] = useState(0);

  return (
    <ScoreContext.Provider value={{ score, setScore }}>
      {children}
    </ScoreContext.Provider>
  );
};

// Context for game state (to pause parallax)
export const GameContext = createContext();
export const GameProvider = ({ children }) => {
  const [isRunning, setIsRunning] = useState(true); // Tracks if game is active

  return (
    <GameContext.Provider value={{ isRunning, setIsRunning }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for easier access
export const useGameContext = () => useContext(GameContext);
export const useScoreContext = () => useContext(ScoreContext);

// Combined Provider (good practice?)
export const AppContextProvider = ({ children }) => {
  return (
    <GameProvider>
      <ScoreProvider>{children}</ScoreProvider>
    </GameProvider>
  );
};
