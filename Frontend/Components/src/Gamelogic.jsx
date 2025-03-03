import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useScoreContext, useGameContext, useVolumeContext, useLevelContext } from "./Context"; // ✅ Using Combined Context
import { submitHighScore } from "./CRUD"; // Firebase interaction
import { useDinoRotation } from "./Animation"; // ✅ Import rotation logic
import Background from "./Background";
import MusicPlayer from "./MusicPlayer"; // ✅ Import music player
import "./Gamelogic.css";

const Gamelogic = () => {

  const dinoWidth = 150, dinoHeight = 150;
  const enemyWidth = 150, enemyHeight = 170;

  //Contexts
  const { score, setScore } = useScoreContext();
  const { isRunning, setIsRunning } = useGameContext(); // ✅ Game state context
  const { volume } = useVolumeContext();
  const { level } = useLevelContext();

  const DINO_START_HEIGHT = 40;
  const enemy_Start_Height = 40;
  const musicFile = "/static/jump_1.mp3";

  const JUMP_HEIGHT = 450;
  const JUMP_SPEED = level === 1 ? 8 : level === 2 ? 11 : 13; // If 1, then 8, if 2 then 11, otherwise set as 13

  const initialEnemySpeed = level === 1 ? 5 : level === 2 ? 6 : 7;// If 1, then 10, if 2 then 12, otherwise set as 15
  const [enemySpeed, setenemySpeed] = useState(initialEnemySpeed);
  const enemyType = level === 1 ? "cactus" : level === 2 ? "camel" : level === 3 ? "sabertooth_tiger" :"error";


  //States
  const [enemyPosition, setEnemyPosition] = useState(window.innerWidth);
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
    setEnemyPosition(window.innerWidth);
    setDinoPosition(DINO_START_HEIGHT);
    setScore(0); // ✅ Ensures score resets properly
    setIsJumping(false);
    setPlayerName(""); // ✅ Clears input on restart
    setenemySpeed(initialEnemySpeed);

    intervalRef.current = setInterval(() => {
      setEnemyPosition((prev) => (prev <= -enemyWidth ? window.innerWidth : prev - enemySpeed));
    }, 20);

    scoreIntervalRef.current = setInterval(() => {
      setScore((prev) => prev + 1);
    }, 100);
  };

  const navigate = useNavigate();

  const handleGoToMenu = () => { //separated from above due to moving ontop of reset
    navigate("/");
    window.location.reload(); //force reload everything
  };
  

  useEffect(() => { //Needed to have the next sound not play the old value but instantly get the new volume
    if (isRunning) {
      const audio = new Audio(musicFile);
      audio.volume = volume / 100;
      audio.play();
    }
  }, [isRunning, volume]);

//Separated Effect for enemy movement.
 //NOTE! Chrome had issues with setInterval and switched to "requestanimationframe". It matches the Screen Refresh Rate (60 FPS), which is bad, but works now.
 
 useEffect(() => { 
  if (!isRunning || isGameOver) return;

  let lastTime = performance.now();
  const baseFrameTime = 1000 / 60; // 16.67ms per frame (60 FPS)

  let animationFrameId; // ✅ Store requestAnimationFrame ID

  const moveEnemy = (currentTime) => {
    if (!isRunning || isGameOver) return;

    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    deltaTime = Math.min(deltaTime, 30); // Prevents huge movement jumps

    const normalizedDelta = deltaTime / baseFrameTime; // Normalize to 60 FPS

    setEnemyPosition((prev) => (prev <= -enemyWidth ? window.innerWidth : prev - enemySpeed * normalizedDelta));

    animationFrameId = requestAnimationFrame(moveEnemy); // ✅ Store ID
  };

  animationFrameId = requestAnimationFrame(moveEnemy); // ✅ Start animation

  return () => cancelAnimationFrame(animationFrameId); // ✅ Correctly cancels frame
}, [isRunning, isGameOver, enemySpeed]);



  useEffect(() => { //Separated effect for the Score Update
    if (!isRunning || isGameOver) return;
  
    clearInterval(scoreIntervalRef.current);
    
    scoreIntervalRef.current = setInterval(() => {
      setScore((prev) => prev + 1);
    }, 100);
  
    return () => clearInterval(scoreIntervalRef.current);
  }, [isRunning, isGameOver]);

  //Jumping logic
  useEffect(() => {
    const handleJump = (event) => {
      if (event.code === "Space" && !isJumping && isRunning) {
        setIsJumping(true);
        let position = dinoPosition;
  
        const audio = new Audio(musicFile);
        audio.volume = volume / 100;
        audio.play();
  
        // Jump Up
        const upInterval = setInterval(() => {
          if (position >= JUMP_HEIGHT) {
            clearInterval(upInterval);
            
            // Fall Down
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
      setEnemyPosition((prev) => (prev <= -enemyWidth ? window.innerWidth : prev - enemySpeed));
      const dinoX = 100, dinoY = dinoPosition;
      const enemyX = enemyPosition, enemyY = enemy_Start_Height;

      const xCollision = enemyX < dinoX + dinoWidth && enemyX + enemyWidth > dinoX;
      const yCollision = enemyY < dinoY + dinoHeight && enemyY + enemyHeight > dinoY;

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
  }, [isRunning, isGameOver, enemySpeed, dinoPosition, score]);

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
          <p>Seems you have hugged a {enemyType}. Ouch!</p>
            <p>High Score: {highScore}</p>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button onClick={handleSubmitScore}>Submit Score</button>
            <button onClick={startGame}>Restart</button>
            <button onClick={handleGoToMenu}>Go back to menu</button>
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
        <div
          className={enemyType}

          style={{ left: `${enemyPosition}px` }}></div>
      </div>
    </div>
  );
};

export default Gamelogic;