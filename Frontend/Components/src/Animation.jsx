import { useState, useEffect } from "react";

// ✅ Custom Hook for Dino Rotation
export const useDinoRotation = () => {
  const [dinoAngle, setDinoAngle] = useState(0); // Start at 0°

  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setDinoAngle((prevAngle) => (prevAngle === -10 ? 10 : -10));
    }, 800); // ✅ Rotate every second

    return () => clearInterval(rotateInterval);
  }, []);

  return dinoAngle;
};
