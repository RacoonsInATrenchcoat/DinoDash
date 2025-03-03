import React, { createContext, useContext, useState } from "react";

const ScoreContext = createContext();
const GameContext = createContext();
const VolumeContext = createContext();
const LevelContext = createContext();

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

// ✅ Hooks for context usage with debugging logs
export const useScoreContext = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    console.trace("❌ useScoreContext() was used outside of ScoreProvider!");
    throw new Error("❌ useScoreContext() was used outside of ScoreProvider!");
  }
  return context;
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    console.error("❌ useGameContext() was used outside of GameProvider!");
  }
  return context;
};

export const useVolumeContext = () => {
  const context = useContext(VolumeContext);
  if (!context) {
    console.error("❌ useVolumeContext() was used outside of VolumeProvider!");
  }
  return context;
};

export const useLevelContext = () => {
  const context = useContext(LevelContext);
  if (!context) {
    console.trace("❌ useLevelContext() was used outside of LevelProvider!");
    throw new Error("❌ useLevelContext() was used outside of LevelProvider!");
  }
  return context;
};