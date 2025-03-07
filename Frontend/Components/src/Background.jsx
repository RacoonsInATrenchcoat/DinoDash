import React, { useState, useEffect } from "react";
import { useGameContext, useLevelContext } from "./Context";
import "./Gamelogic.css";

const Background = () => {
  const { isRunning } = useGameContext();
  const { level } = useLevelContext();
  // Store the raw offset (total pixels traveled)
  const [rawOffset, setRawOffset] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    let animationFrameId;
    let startTime = null;
    const speedFactor = 1; // pixels per 20ms

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      // Calculate raw offset without any modulo (we’ll apply modulo per layer)
      const newOffset = (elapsed / 20) * speedFactor;
      setRawOffset(newOffset);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning]);

  // For layers 3 & 4, the cycle is the viewport width.
  const baseCycle = window.innerWidth; // e.g., 1080px
  // For the foreground, the effective cycle is multiplied by 5.
  const foregroundCycle = window.innerWidth * 5;

  // Compute positions using modulo arithmetic:
  const desertDecorPos = -(rawOffset % baseCycle); // for layers 3 and 4
  const foregroundPos = -( (rawOffset * 5) % foregroundCycle );

  return (
    <div className="background-container">
      {/* Layer 1: Sky (static) */}
      <div className={`background-layer Background-lvl${level}-sky-1`}></div>
      {/* Layer 2: Outline-2 (static) */}
      <div className={`background-layer Background-lvl${level}-outline-2`}></div>
      {/* Layer 3: Desert-3 (scrolls over 45s equivalent) */}
      <div
        className={`background-layer Background-lvl${level}-desert-3`}
        style={{ backgroundPositionX: `${desertDecorPos}px` }}
      ></div>
      {/* Layer 4: Decor-4 (scrolls together with desert-3) */}
      <div
        className={`background-layer Background-lvl${level}-decor-4`}
        style={{ backgroundPositionX: `${desertDecorPos}px` }}
      ></div>
      {/* Layer 5: Foreground-5 (scrolls faster with multiplier, effective cycle = window.innerWidth * 5) */}
      <div
        className={`background-layer Background-lvl${level}-foreground-5`}
        style={{ backgroundPositionX: `${foregroundPos}px` }}
      ></div>
    </div>
  );
};

export default Background;
