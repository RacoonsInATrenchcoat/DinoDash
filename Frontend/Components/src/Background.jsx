import React, { useState, useEffect } from "react";
import { useGameContext, useLevelContext } from "./Context";
import "./Gamelogic.css";

const Background = () => {
  const { isRunning } = useGameContext();
  const { level } = useLevelContext();
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    let animationFrameId;
    let startTime = null;
    const cycle = window.innerWidth; // adjust if your repeat cycle is different
    const speedFactor = 1; // pixels per 20ms (adjust to taste)

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      // Calculate how many pixels to move: if you want 1 pixel every 20ms, then:
      const offset = (elapsed / 20) * speedFactor;
      // Use a continuous modulo that returns a value in [0, cycle)
      const newPos = -((offset % cycle));
      setPosition(newPos);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning]);

  return (
    <div className="background-container">
      <div className={`background-layer Background-lvl${level}-sky-1`}></div>
      <div className={`background-layer Background-lvl${level}-outline-2`}></div>
      <div
        className={`background-layer Background-lvl${level}-desert-3`}
        style={{ backgroundPositionX: `${position}px` }}
      ></div>
      <div
        className={`background-layer Background-lvl${level}-decor-4`}
        style={{ backgroundPositionX: `${position}px` }}
      ></div>
      <div
        className={`background-layer Background-lvl${level}-foreground-5`}
        style={{ backgroundPositionX: `${position * 4.5}px` }}
      ></div>
    </div>
  );
};

export default Background;
