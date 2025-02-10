import React, { useEffect, useState, useRef, useContext } from "react";
import { ScoreContext, useGameContext } from "./Context"; // ✅ Using Combined Context
import { submitHighScore } from "./CRUD"; // Firebase interaction
import Background from "./Background";
import "./Gamelogic.css";

const Gamelogic = () => {
  const { score, setScore } = useContext(ScoreContext);
  const { isRunning, setIsRunning } = useGameContext(); // ✅ Game state context
  const [cactusPosition, setCactusPosition] = useState(window.innerWidth);
  const [dinoPosition, setDinoPosition] = useState(60);
  const [isJumping, setIsJumping] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [playerName, setPlayerName] = useState("");

  const intervalRef = useRef(null);
  const scoreIntervalRef = useRef(null);

  const dinoWidth = 150, dinoHeight = 150;
  const cactusWidth = 30, cactusHeight = 50;

  const startGame = () => {
    setIsGameOver(false);
    setIsRunning(true); // ✅ Resume game & background movement
    setCactusPosition(window.innerWidth);
    setDinoPosition(60);
    setScore(0); // ✅ Ensures score resets properly
    setIsJumping(false);
    setPlayerName(""); // ✅ Clears input on restart

    intervalRef.current = setInterval(() => {
      setCactusPosition((prev) => (prev <= -50 ? window.innerWidth : prev - 5));
    }, 20);

    scoreIntervalRef.current = setInterval(() => {
      setScore((prev) => prev + 1);
    }, 100);
  };

  useEffect(() => {
    if (!isRunning) return; // ✅ Stops movement when game is paused

    intervalRef.current = setInterval(() => {
      setCactusPosition((prev) => (prev <= -50 ? window.innerWidth : prev - 5));
    }, 20);

    scoreIntervalRef.current = setInterval(() => {
      setScore((prev) => prev + 1);
    }, 100);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(scoreIntervalRef.current);
    };
  }, [isRunning, setScore]);

  useEffect(() => {
    const handleJump = (event) => {
      if (event.code === "Space" && !isJumping && isRunning) {
        setIsJumping(true);
        let position = dinoPosition;

        const upInterval = setInterval(() => {
          if (position >= 250) {
            clearInterval(upInterval);
            const downInterval = setInterval(() => {
              if (position <= 60) {
                clearInterval(downInterval);
                setDinoPosition(60);
                setIsJumping(false);
              } else {
                position -= 5;
                setDinoPosition(position);
              }
            }, 20);
          } else {
            position += 5;
            setDinoPosition(position);
          }
        }, 20);
      }
    };

    if (isRunning) {
      document.addEventListener("keydown", handleJump);
    }

    return () => document.removeEventListener("keydown", handleJump);
  }, [isJumping, isRunning]);

  useEffect(() => {
    const checkCollision = () => {
      if (isGameOver) return; // ✅ Stop checking once the game is over

      const dinoX = 100, dinoY = dinoPosition;
      const cactusX = cactusPosition, cactusY = 60;

      const xCollision = cactusX < dinoX + dinoWidth && cactusX + cactusWidth > dinoX;
      const yCollision = cactusY < dinoY + dinoHeight && cactusY + cactusHeight > dinoY;

      if (xCollision && yCollision) {
        setIsGameOver(true);
        setIsRunning(false); // ✅ Stops background movement
        clearInterval(intervalRef.current);
        clearInterval(scoreIntervalRef.current);
        setHighScore((prev) => Math.max(prev, score));
      }
    };

    // ✅ Collision should still run even if isRunning is false
    const collisionInterval = setInterval(checkCollision, 20);

    return () => clearInterval(collisionInterval);
  }, [cactusPosition, dinoPosition, isGameOver, score]);

  // ✅ Submit high score to Firebase
  const handleSubmitScore = () => {
    if (playerName.trim() !== "") {
      submitHighScore(playerName, score);
    }
  };

  return (
    <div className="game-container">
      <Background /> {/* ✅ Background with parallax scrolling */}

      {isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-menu">
            <p>Seems you have hugged a cactus. Ouch.</p>
            <p>High Score: {highScore}</p>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button onClick={handleSubmitScore}>Submit Score</button>
            <button onClick={startGame}>Restart</button>
          </div>
        </div>
      )}

      {/* Gameplay elements */}
      <div className="game-entities">
        <div className="dino" style={{ bottom: `${dinoPosition}px`, left: "100px" }}></div>
        <div className="cactus" style={{ left: `${cactusPosition}px` }}></div>
      </div>
    </div>
  );
};

export default Gamelogic;
