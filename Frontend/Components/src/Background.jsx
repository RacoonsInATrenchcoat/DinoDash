import React, { useState, useEffect } from "react";
import { useGameContext, useLevelContext } from "./Context"; // ✅ Import level context
import "./Gamelogic.css";

const Background = () => {
  const { isRunning } = useGameContext();
  const { level } = useLevelContext(); // ✅ Access level
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setPosition((prev) => (prev - 1) % window.innerWidth);
    }, 20);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="background-container">
      <div className={`background-layer Background-lvl${level}-sky-1`}></div>
      <div className={`background-layer Background-lvl${level}-outline-2`}></div>
      <div className={`background-layer Background-lvl${level}-desert-3`} style={{ backgroundPositionX: `${position}px` }}></div>
      <div className={`background-layer Background-lvl${level}-decor-4`} style={{ backgroundPositionX: `${position}px` }}></div>
      <div className={`background-layer Background-lvl${level}-foreground-5`} style={{ backgroundPositionX: `${position * 4.5}px` }}></div>
    </div>
  );
};

export default Background;
