import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useScoreContext, useGameContext, useVolumeContext, useLevelContext } from "./Context"; // ✅ Using Combined Context
import { submitHighScore } from "./CRUD"; // Firebase interaction
import { useDinoRotation } from "./Animation"; // ✅ Import rotation logic
import Background from "./Background";
import MusicPlayer from "./MusicPlayer"; // ✅ Import music player
import "./Gamelogic.css";

const Gamelogic = () => {

  //Contexts
  const { score, setScore } = useScoreContext();
  const { isRunning, setIsRunning } = useGameContext(); // ✅ Game state context
  const { volume } = useVolumeContext();
  const { level } = useLevelContext();

  const dinoWidth = 150, dinoHeight = 150;
  const enemyWidth = level === 1 ? 85  //added -15 for better "feeling", even if incorrect
    : level === 2 ? 235
      : 285;
  const enemyHeight = level === 1 ? 185
    : level === 2 ? 185
      : 185;

  const DINO_START_HEIGHT = 40;
  const enemy_Start_Height = 40;
  //Preload audio
  const audioJump = new Audio("/static/jump_1.mp3");
  const audioLose = new Audio("/static/lose.wav");
  audioJump.preload = "auto";
  audioLose.preload = "auto";

  const playAudioJump = () => {
    audioJump.volume = volume / 100; //Needed to conver to 0.0 (mute) and 1.0 (full volume)
    audioJump.play();
  };

  const playAudioLose = () => {
    audioLose.volume = Math.min(volume / 100 + 0.5, 1.0); //Adding a bit extra volume to be audible
    audioLose.play();
  };

  const JUMP_HEIGHT = 500;
  const JUMP_SPEED = level === 1 ? 7 : level === 2 ? 9 : 11; // If 1, then 7, if 2 then 10, otherwise set as 12

  const initialEnemySpeed = level === 1 ? 5 : level === 2 ? 7 : 10;
  const [enemySpeed, setenemySpeed] = useState(initialEnemySpeed);
  const enemyType = level === 1 ? "cactus" : level === 2 ? "camel" : level === 3 ? "sabertooth_tiger" : "error";
  const scoreMultiplier = level === 1 ? 1 : level === 2 ? 2 : 3;  //Higher score based on lvl


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
  const enemyPositionRef = useRef(window.innerWidth);
  const enemyAnimationFrameRef = useRef(null);  // ✅ Initialize enemy animation frame ref


  const startGame = () => {
    clearInterval(intervalRef.current);
    clearInterval(scoreIntervalRef.current);

    setIsGameOver(false);
    setIsRunning(false);
    setIsPlaying(true);
    setEnemyPosition(window.innerWidth);
    setDinoPosition(DINO_START_HEIGHT);
    setScore(0);
    setIsJumping(false);
    setPlayerName("");
    setenemySpeed(initialEnemySpeed);

    // ✅ Cancel any existing enemy movement frames before restarting
    if (enemyAnimationFrameRef.current) {
      cancelAnimationFrame(enemyAnimationFrameRef.current);
    }

    enemyPositionRef.current = window.innerWidth;
    setEnemyPosition(window.innerWidth);

    setTimeout(() => {
      setIsRunning(true);
    }, 50);
  };

  const navigate = useNavigate();

  const handleGoToMenu = () => { //separated from above due to moving ontop of reset
    navigate("/");
    window.location.reload(); //force reload everything
  };



  //Separated Effect for enemy movement.
  //NOTE! Chrome had issues with setInterval and switched to "requestanimationframe". It matches the Screen Refresh Rate (60 FPS), which is bad, but works now.

  useEffect(() => {
    if (!isRunning || isGameOver) return;

    let lastTime = performance.now();
    const TARGET_FRAME_TIME = 16.67;
    let accumulatedTime = 0;

    const moveEnemy = (currentTime) => {
      if (!isRunning || isGameOver) return;

      let deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      accumulatedTime += deltaTime;

      while (accumulatedTime >= TARGET_FRAME_TIME) {
        enemyPositionRef.current = enemyPositionRef.current <= -enemyWidth * 2
          ? window.innerWidth
          : enemyPositionRef.current - enemySpeed;
        accumulatedTime -= TARGET_FRAME_TIME;
      }

      setEnemyPosition(enemyPositionRef.current);
      enemyAnimationFrameRef.current = requestAnimationFrame(moveEnemy); // ✅ Store ID
    };

    enemyAnimationFrameRef.current = requestAnimationFrame(moveEnemy);

    return () => {
      if (enemyAnimationFrameRef.current) {
        cancelAnimationFrame(enemyAnimationFrameRef.current); // ✅ Ensure it cancels properly
      }
    };
  }, [isRunning, isGameOver, enemySpeed]);

  useEffect(() => { //Separated effect for the Score Update
    if (!isRunning || isGameOver) return;

    clearInterval(scoreIntervalRef.current);

    scoreIntervalRef.current = setInterval(() => {
      setScore((prev) => prev + scoreMultiplier);
    }, 100);

    return () => clearInterval(scoreIntervalRef.current);
  }, [isRunning, isGameOver]);

  //Jumping logic
  useEffect(() => {
    const handleJump = (event) => {
      if (event.code === "Space" && !isJumping && isRunning) {
        setIsJumping(true);
        let position = dinoPosition;

        playAudioJump(); //Call the previous preloaded sound

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

  //Collision Detection
  useEffect(() => {
    if (!isRunning || isGameOver) return; // ✅ Stop checking if game is paused or over

    let animationFrameId;

    const checkCollision = () => {
      if (!isRunning || isGameOver) return; // ✅ Ensure it stops when paused

      const dinoX = 100, dinoY = dinoPosition;
      const enemyX = enemyPositionRef.current; // ✅ Use real-time position
      const enemyY = enemy_Start_Height;

      const xCollision = enemyX < dinoX + dinoWidth && enemyX + enemyWidth > dinoX;
      const yCollision = enemyY < dinoY + dinoHeight && enemyY + enemyHeight > dinoY;

      if (xCollision && yCollision) {
        setIsGameOver(true);
        setIsRunning(false);
        playAudioLose();
        setHighScore((prev) => Math.max(prev, score));

        return; // ✅ Stop rechecking after collision
      }

      animationFrameId = requestAnimationFrame(checkCollision);
    };

    animationFrameId = requestAnimationFrame(checkCollision);

    return () => {
      cancelAnimationFrame(animationFrameId); // ✅ Stops loop when effect exits
    };
  }, [isRunning, isGameOver, dinoPosition, score]);


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