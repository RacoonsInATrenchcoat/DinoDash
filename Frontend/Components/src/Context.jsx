import React, { createContext, useContext, useState } from "react";

const ScoreContext = createContext();
const GameContext = createContext();
const VolumeContext = createContext();
const LevelContext = createContext(); // ✅ Added Level Context

export const ScoreProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  return <ScoreContext.Provider value={{ score, setScore }}>{children}</ScoreContext.Provider>;
};

export const GameProvider = ({ children }) => {
  const [isRunning, setIsRunning] = useState(true);
  return <GameContext.Provider value={{ isRunning, setIsRunning }}>{children}</GameContext.Provider>;
};

export const VolumeProvider = ({ children }) => {
  const [volume, setVolume] = useState(50);
  return <VolumeContext.Provider value={{ volume, setVolume }}>{children}</VolumeContext.Provider>;
};

export const LevelProvider = ({ children }) => {
  const [level, setLevel] = useState(1);

  const nextLevel = () => {
    setLevel((prevLevel) => (prevLevel % 3) + 1);
  };

  return <LevelContext.Provider value={{ level, nextLevel }}>{children}</LevelContext.Provider>;
};

// Hooks for context usage
export const useScoreContext = () => useContext(ScoreContext);
export const useGameContext = () => useContext(GameContext);
export const useVolumeContext = () => useContext(VolumeContext);
export const useLevelContext = () => useContext(LevelContext);
