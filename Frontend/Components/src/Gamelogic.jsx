import React, { useEffect, useState, useRef } from "react";
import { useScoreContext, useGameContext, useVolumeContext, useLevelContext } from "./Context"; // ✅ Using Combined Context
import { submitHighScore } from "./CRUD"; // Firebase interaction
import { useDinoRotation } from "./Animation"; // ✅ Import rotation logic
import Background from "./Background";
import MusicPlayer from "./MusicPlayer"; // ✅ Import music player
import "./Gamelogic.css";

const Gamelogic = () => {

  const dinoWidth = 150, dinoHeight = 150;
  const cactusWidth = 150, cactusHeight = 170;

  //Contexts
  const { score, setScore } = useScoreContext();
  const { isRunning, setIsRunning } = useGameContext(); // ✅ Game state context
  const { volume } = useVolumeContext();
  const { level } = useLevelContext();

  const JUMP_HEIGHT = 450;
  const JUMP_SPEED = level === 1 ? 8 : level === 2 ? 11 : 13; // If 1, then 8, if 2 then 11, otherwise set as 13
  const DINO_START_HEIGHT = 40;
  const CACTUS_START_HEIGHT = 40;
  const musicFile = "/static/jump_1.mp3";
  const initialCactusSpeed = level === 1 ? 10 : level === 2 ? 12 : 15;// If 1, then 10, if 2 then 12, otherwise set as 15
  const [cactusSpeed, setCactusSpeed] = useState(initialCactusSpeed);

  //States
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
    clearInterval(intervalRef.current);       // ✅ Stop any existing intervals before setting speed
    clearInterval(scoreIntervalRef.current);

    setIsGameOver(false);
    setIsRunning(true); // ✅ Resume game & background movement
    setIsPlaying(true); // ✅ Start music when game starts
    setCactusPosition(window.innerWidth);
    setDinoPosition(DINO_START_HEIGHT);
    setScore(0); // ✅ Ensures score resets properly
    setIsJumping(false);
    setPlayerName(""); // ✅ Clears input on restart
    setCactusSpeed(initialCactusSpeed);

    intervalRef.current = setInterval(() => {
      setCactusPosition((prev) => (prev <= -50 ? window.innerWidth : prev - cactusSpeed));
    }, 20);

    scoreIntervalRef.current = setInterval(() => {
      setScore((prev) => prev + 1);
    }, 100);
  };

  useEffect(() => { //Needed to have the next sound not play the old value but instantly get the new volume
    if (isRunning) {
      const audio = new Audio(musicFile);
      audio.volume = volume / 100;
      audio.play();
    }
  }, [isRunning, volume]);

  useEffect(() => {
    if (!isRunning || isGameOver) return;

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCactusPosition((prev) => (prev <= -50 ? window.innerWidth : prev - cactusSpeed));
    }, 20);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [setScore, cactusSpeed]);

  useEffect(() => {
    if (isGameOver || !isRunning) return;

    clearInterval(scoreIntervalRef.current);
    scoreIntervalRef.current = setInterval(() => {
        setScore((prev) => prev + 1);
    }, 100);

    return () => clearInterval(scoreIntervalRef.current);
}, [isRunning, isGameOver]); // ✅ No movement dependencies!


  useEffect(() => {
    const handleJump = (event) => {
      if (event.code === "Space" && !isJumping && isRunning) {
        setIsJumping(true);
        let position = dinoPosition;

        const audio = new Audio(musicFile);
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
    if (isGameOver) return; // ✅ Stop checking once the game is over

    clearInterval(intervalRef.current);
    clearInterval(scoreIntervalRef.current);

    intervalRef.current = setInterval(() => {
      setCactusPosition((prev) => (prev <= -50 ? window.innerWidth : prev - cactusSpeed));
      const dinoX = 100, dinoY = dinoPosition;
      const cactusX = cactusPosition, cactusY = CACTUS_START_HEIGHT;

      const xCollision = cactusX < dinoX + dinoWidth && cactusX + cactusWidth > dinoX;
      const yCollision = cactusY < dinoY + dinoHeight && cactusY + cactusHeight > dinoY;

      if (xCollision && yCollision) {
        setIsGameOver(true);
        setIsRunning(false); // ✅ Stops background movement
        setIsPlaying(false); // ✅ Stop music
        clearInterval(intervalRef.current);
        clearInterval(scoreIntervalRef.current); // ❌ Make sure the score interval stops
        scoreIntervalRef.current = null; // ✅ Ensure no duplicate intervals
        setHighScore((prev) => Math.max(prev, score));
      }
    }, 20);

    // ✅ Score update now runs inside the same effect
    scoreIntervalRef.current = setInterval(() => {
      setScore((prev) => prev + 1);
    }, 100);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(scoreIntervalRef.current);
    };
  }, [isRunning, isGameOver, cactusSpeed, dinoPosition, score]);

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
      <Background />
      <MusicPlayer isPlaying={isPlaying} volume={volume} />

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