import React, { useEffect, useState, useRef, useContext } from "react";
import { ScoreContext, useGameContext, useVolumeContext } from "./Context"; // ✅ Using Combined Context
import { submitHighScore } from "./CRUD"; // Firebase interaction
import { useDinoRotation } from "./Animation"; // ✅ Import rotation logic
import Background from "./Background";
import MusicPlayer from "./MusicPlayer"; // ✅ Import music player
import "./Gamelogic.css";

const Gamelogic = () => {

  const dinoWidth = 150, dinoHeight = 150;
  const cactusWidth = 150, cactusHeight = 170;

  const JUMP_HEIGHT = 450;
  const JUMP_SPEED = 6;
  const DINO_START_HEIGHT = 40;
  const CACTUS_START_HEIGHT = 40;
  const CACTUS_SPEED = 5;

  const { score, setScore } = useContext(ScoreContext);
  const { isRunning, setIsRunning } = useGameContext(); // ✅ Game state context
  const { volume } = useVolumeContext();
  const [cactusPosition, setCactusPosition] = useState(window.innerWidth);
  const [dinoPosition, setDinoPosition] = useState(DINO_START_HEIGHT);
  const [isJumping, setIsJumping] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [isPlaying, setIsPlaying] = useState(false); // ✅ Manages music state

  const dinoAngle = useDinoRotation(); // ✅ Get rotation from Animation.jsx
  const intervalRef = useRef(null);
  const scoreIntervalRef = useRef(null);

  const startGame = () => {
    setIsGameOver(false);
    setIsRunning(true); // ✅ Resume game & background movement
    setIsPlaying(true); // ✅ Start music when game starts
    setCactusPosition(window.innerWidth);
    setDinoPosition(DINO_START_HEIGHT);
    setScore(0); // ✅ Ensures score resets properly
    setIsJumping(false);
    setPlayerName(""); // ✅ Clears input on restart

    intervalRef.current = setInterval(() => {
      setCactusPosition((prev) => (prev <= -50 ? window.innerWidth : prev - CACTUS_SPEED));
    }, 20);

    scoreIntervalRef.current = setInterval(() => {
      setScore((prev) => prev + 1);
    }, 100);
  };

  useEffect(() => {
    if (!isRunning) return; // ✅ Stops movement when game is paused

    intervalRef.current = setInterval(() => {
      setCactusPosition((prev) => (prev <= -50 ? window.innerWidth : prev - CACTUS_SPEED));
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

        const audio = new Audio("/jump_1.mp3");
        audio.volume = volume / 100;
        audio.play();


        const upInterval = setInterval(() => {
          if (position >= JUMP_HEIGHT) {
            clearInterval(upInterval);
            const downInterval = setInterval(() => {
              if (position <= DINO_START_HEIGHT) {
                clearInterval(downInterval);
                setDinoPosition(DINO_START_HEIGHT);
                setIsJumping(false);
              } else {
                position -= JUMP_SPEED;
                setDinoPosition(position);
              }
            }, 20);
          } else {
            position += JUMP_SPEED;
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
      const cactusX = cactusPosition, cactusY = CACTUS_START_HEIGHT;
      
      const xCollision = cactusX < dinoX + dinoWidth && cactusX + cactusWidth > dinoX;
      const yCollision = cactusY < dinoY + dinoHeight && cactusY + cactusHeight > dinoY;

      if (xCollision && yCollision) {
        setIsGameOver(true);
        setIsRunning(false); // ✅ Stops background movement
        setIsPlaying(false); // ✅ Stop music
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

  // ✅ Ensures first interaction enables music autoplay
  useEffect(() => {
    const handleUserInteraction = () => {
      setIsPlaying(true);
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  return (
    <div className="game-container">
      <Background /> {/* ✅ Background with parallax scrolling */}
      <MusicPlayer isPlaying={isPlaying} volume={volume} /> {/* ✅ Inject MusicPlayer */}

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
        <div
          className="dino"
          style={{
            bottom: `${dinoPosition}px`,
            left: "100px",
            transform: `rotate(${dinoAngle}deg)`, // ✅ Uses external rotation logic
            transition: "transform 1s ease-in-out", // ✅ Smooth transition
          }}
        ></div>
        <div className="cactus" style={{ left: `${cactusPosition}px` }}></div>
      </div>
    </div>
  );
};

export default Gamelogic;
