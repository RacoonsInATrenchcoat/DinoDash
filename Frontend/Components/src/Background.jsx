import React, { useState, useEffect } from "react";
import { useGameContext } from "./Context"; // ✅ Import game state
import "./Gamelogic.css";

const Background = () => {
  const { isRunning } = useGameContext(); // ✅ Controls movement
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (!isRunning) return; // ✅ Stop movement on game over

    const interval = setInterval(() => {
      setPosition((prev) => (prev - 1) % window.innerWidth); // ✅ Moves smoothly
    }, 20);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="background-container">
      {/* Static Backgrounds */}
      <div className="background-layer Background-sky-1"></div>
      <div className="background-layer Background-outline-2"></div>

      {/* Moving Backgrounds (Parallax) */}
      <div
        className="background-layer Background-desert-3"
        style={{ backgroundPositionX: `${position}px` }}
      ></div>
      <div
        className="background-layer Background-decor-4"
        style={{ backgroundPositionX: `${position}px` }}
      ></div>
      <div
        className="background-layer Background-foreground-5"
        style={{ backgroundPositionX: `${position * 4.5}px` }} // //Adjust the speed
      ></div>
    </div>
  );
};

export default Background;
