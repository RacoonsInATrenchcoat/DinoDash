import React, { useEffect, useState, useRef, useContext } from "react";
import { ScoreContext } from "./Context";
import { submitHighScore } from "./CRUD"; // Import Firebase CRUD function
import "./Gamelogic.css";

const Gamelogic = () => {
  const { score, setScore } = useContext(ScoreContext);
  const [cactusPosition, setCactusPosition] = useState(window.innerWidth);
  const [dinoPosition, setDinoPosition] = useState(60);
  const [isJumping, setIsJumping] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [playerName, setPlayerName] = useState(""); // Stores user input for name

  const intervalRef = useRef(null);
  const scoreIntervalRef = useRef(null);

  const dinoWidth = 50, dinoHeight = 50;
  const cactusWidth = 30, cactusHeight = 50;

  const startGame = () => {
    setIsGameOver(false);
    setCactusPosition(window.innerWidth);
    setDinoPosition(60);
    setScore(0);
    setIsJumping(false);
  
    intervalRef.current = setInterval(() => {
      setCactusPosition((prev) => (prev <= -50 ? window.innerWidth : prev - 5));
    }, 20);
  
    scoreIntervalRef.current = setInterval(() => {
      setScore((prev) => prev + 1);
    }, 100);
  };

  useEffect(() => {
    if (!isGameOver) {
      intervalRef.current = setInterval(() => {
        setCactusPosition((prev) => (prev <= -50 ? window.innerWidth : prev - 5));
      }, 20);
  
      scoreIntervalRef.current = setInterval(() => {
        setScore((prev) => prev + 1);
      }, 100);
    }
  
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(scoreIntervalRef.current);
    };
  }, [isGameOver, setScore]);

  useEffect(() => {
    const handleJump = (event) => {
      if (event.code === "Space" && !isJumping && !isGameOver) {
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
  
    document.addEventListener("keydown", handleJump);
    return () => document.removeEventListener("keydown", handleJump);
  }, [isJumping, isGameOver]);

  useEffect(() => {
    const checkCollision = () => {
      const dinoX = 100, dinoY = dinoPosition;
      const cactusX = cactusPosition, cactusY = 60;
  
      const xCollision = cactusX < dinoX + dinoWidth && cactusX + cactusWidth > dinoX;
      const yCollision = cactusY < dinoY + dinoHeight && cactusY + cactusHeight > dinoY;
  
      if (xCollision && yCollision) {
        setIsGameOver(true);
        clearInterval(intervalRef.current);
        clearInterval(scoreIntervalRef.current);
        setHighScore((prev) => Math.max(prev, score));
      }
    };
  
    if (!isGameOver) {
      const collisionInterval = setInterval(checkCollision, 20);
      return () => clearInterval(collisionInterval);
    }
  }, [cactusPosition, dinoPosition, isGameOver, score]);

  // Handle high score submission
  const handleSubmitScore = () => {
    if (playerName.trim() !== "") {
      submitHighScore(playerName, score);
    }
  };

  return (
    <div className="game-container">
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
      <div className="game-area">
        <div className="dino" style={{ bottom: `${dinoPosition}px` }}></div>
        <div className="cactus" style={{ left: `${cactusPosition}px` }}></div>
      </div>
    </div>
  );
};

export default Gamelogic;
