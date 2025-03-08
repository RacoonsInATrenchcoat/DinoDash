import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMobileContext } from "./MobileMode"; // Separated mobile context
import {
  useScoreContext,
  useGameContext,
  useVolumeContext,
  useLevelContext,
  useMusicContext,
} from "./Context";
import { submitHighScore } from "./CRUD"; // Firebase interaction
import { useDinoRotation } from "./Animation"; // Import rotation logic
import Background from "./Background";
import "./Gamelogic.css";

const Gamelogic = () => {
  // Contexts
  const isMobile = useMobileContext();
  const { score, setScore } = useScoreContext();
  const { isRunning, setIsRunning } = useGameContext();
  const { level } = useLevelContext();
  const { isPlaying, setIsPlaying } = useMusicContext();

  const dinoWidth = 140,
    dinoHeight = 140;
  const enemyWidth =
    level === 1 ? 85 : level === 2 ? 235 : 285; // adjust for better "feeling"
  const enemyHeight = 185; // Same for all levels
  const DINO_START_HEIGHT = 40;
  const enemy_Start_Height = 40;

  // Audio refs
  const audioJumpRef = useRef(null);
  const audioLoseRef = useRef(null);

  useEffect(() => {
    if (!audioJumpRef.current) {
      audioJumpRef.current = new Audio("/static/jump_1.mp3");
      audioJumpRef.current.preload = "auto";
    }
    if (!audioLoseRef.current) {
      audioLoseRef.current = new Audio("/static/lose.wav");
      audioLoseRef.current.preload = "auto";
    }
  }, []);

  const { volume } = useVolumeContext();
  const playAudioJump = () => {
    if (audioJumpRef.current) {
      audioJumpRef.current.volume = volume / 100;
      audioJumpRef.current.currentTime = 0;
      audioJumpRef.current.play();
    }
  };

  const playAudioLose = () => {
    if (audioLoseRef.current) {
      audioLoseRef.current.volume = Math.min(volume / 100 + 0.5, 1.0);
      audioLoseRef.current.currentTime = 0;
      audioLoseRef.current.play();
    }
  };

  const JUMP_HEIGHT = 500;
  const JUMP_SPEED = level === 1 ? 8 : level === 2 ? 9 : 11;
  const initialEnemySpeed = level === 1 ? 5 : level === 2 ? 7 : 10;
  const [enemySpeed, setenemySpeed] = useState(initialEnemySpeed);
  const enemyType =
    level === 1
      ? "cactus"
      : level === 2
        ? "camel"
        : level === 3
          ? "sabertooth_tiger"
          : "error";
  const scoreMultiplier = level === 1 ? 1 : level === 2 ? 2 : 3;

  // States
  const [enemyPosition, setEnemyPosition] = useState(window.innerWidth);
  const [dinoPosition, setDinoPosition] = useState(DINO_START_HEIGHT);
  const [isJumping, setIsJumping] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  // New state for the indicator
  const [showIndicator, setShowIndicator] = useState(false);
    //Mobile touch state
  const [isTouched, setIsTouched] = useState(false);

  const dinoAngle = useDinoRotation();
  const scoreIntervalRef = useRef(null);
  const enemyPositionRef = useRef(window.innerWidth);
  const enemyAnimationFrameRef = useRef(null);

  const startGame = () => {
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
  const handleGoToMenu = () => {
    navigate("/");
    window.location.reload();
  };

  // Optimized enemy movement effect using time-based delta calculation.
  useEffect(() => {
    if (!isRunning || isGameOver) return;
    let lastTime = performance.now();
    const TARGET_FRAME_TIME = 16.67;

    const moveEnemy = (currentTime) => {
      if (!isRunning || isGameOver) return;

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      const distance = enemySpeed * (deltaTime / TARGET_FRAME_TIME);
      let newPos = enemyPositionRef.current - distance;

      // When enemy moves off-screen:
      if (newPos <= -enemyWidth * 2) {
        // Only show the indicator if we're in mobile mode.
        if (isMobile) {
          setShowIndicator(true);
          cancelAnimationFrame(enemyAnimationFrameRef.current);
          setTimeout(() => {
            setShowIndicator(false);
            enemyPositionRef.current = window.innerWidth;
            setEnemyPosition(window.innerWidth);
            lastTime = performance.now();
            enemyAnimationFrameRef.current = requestAnimationFrame(moveEnemy);
          }, 1000);
          return; // Exit this cycle so the animation restarts after the timeout.
        } else {
          // For desktop, reset immediately.
          newPos = window.innerWidth;
        }
      }

      enemyPositionRef.current = newPos;
      setEnemyPosition(newPos);
      enemyAnimationFrameRef.current = requestAnimationFrame(moveEnemy);
    };

    enemyAnimationFrameRef.current = requestAnimationFrame(moveEnemy);

    return () => {
      if (enemyAnimationFrameRef.current) {
        cancelAnimationFrame(enemyAnimationFrameRef.current);
      }
    };
  }, [isRunning, isGameOver, enemySpeed, enemyWidth]);

  // Score update
  useEffect(() => {
    if (!isRunning || isGameOver) return;
    clearInterval(scoreIntervalRef.current);
    scoreIntervalRef.current = setInterval(() => {
      setScore((prev) => prev + scoreMultiplier);
    }, 100);
    return () => clearInterval(scoreIntervalRef.current);
  }, [isRunning, isGameOver, scoreMultiplier]);

 

  // Jumping logic effect
  const triggerJump = () => {
    setIsJumping(true);
    playAudioJump();

    const startPos = dinoPosition;
    const endPos = JUMP_HEIGHT;
    const jumpDistance = endPos - startPos;
    const intervalMs = 20;
    const steps = jumpDistance / JUMP_SPEED;
    const T_up = steps * intervalMs;
    let startTime = null;

    const animateUp = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      if (elapsed < T_up) {
        const newPos = startPos + jumpDistance * (elapsed / T_up);
        setDinoPosition(newPos);
        requestAnimationFrame(animateUp);
      } else {
        setDinoPosition(endPos);
        let downStartTime = null;
        const animateDown = (timestampDown) => {
          if (!downStartTime) downStartTime = timestampDown;
          const elapsedDown = timestampDown - downStartTime;
          if (elapsedDown < T_up) {
            const newPos = endPos - jumpDistance * (elapsedDown / T_up);
            setDinoPosition(newPos);
            requestAnimationFrame(animateDown);
          } else {
            setDinoPosition(DINO_START_HEIGHT);
            setIsJumping(false);
          }
        };
        requestAnimationFrame(animateDown);
      }
    };

    requestAnimationFrame(animateUp);
  };

  // Keyboard Jump Listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space" && !isJumping && isRunning) {
        triggerJump();
      }
    };

    if (isRunning) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isJumping, isRunning, dinoPosition]);

  // Mobile Touch Jump Listener
  useEffect(() => {
    const handleTouchStart = (event) => {
      if (event.touches.length === 1 && !isJumping && isRunning) {
        // Instead of setting a flag and waiting, we trigger jump immediately:
        triggerJump();
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    return () => document.removeEventListener("touchstart", handleTouchStart);
  }, [isJumping, isRunning, dinoPosition]);

  // Collision detection effect
  useEffect(() => {
    if (!isRunning || isGameOver) return;
    let animationFrameId;
    const checkCollision = () => {
      if (!isRunning || isGameOver) return;
      const dinoX = 100,
        dinoY = dinoPosition;
      const enemyX = enemyPositionRef.current;
      const enemyY = enemy_Start_Height;

      const xCollision =
        enemyX < dinoX + dinoWidth && enemyX + enemyWidth > dinoX;
      const yCollision =
        enemyY < dinoY + dinoHeight && enemyY + enemyHeight > dinoY;

      if (xCollision && yCollision) {
        setIsGameOver(true);
        setIsRunning(false);
        playAudioLose();
        setHighScore((prev) => Math.max(prev, score));
        return;
      }
      animationFrameId = requestAnimationFrame(checkCollision);
    };

    animationFrameId = requestAnimationFrame(checkCollision);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, isGameOver, dinoPosition, score]);

  const handleSubmitScore = () => {
    if (playerName.trim() !== "") {
      submitHighScore(playerName, score)
        .then(() => {
          window.alert("High score submitted! Click OK to continue.");
        })
        .catch((error) => {
          console.error("Error submitting high score:", error);
          window.alert(
            "There was an error submitting your score. Please try again."
          );
        });
    }
  };

  // Ensure first interaction enables music autoplay.
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
  }, [setIsPlaying]);

  return (
    <div className="game-container">
      <Background />

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
      <div className={isMobile == true ? 'mobile-game-entities' : `game-entities`}>
        <div
          className="dino"
          style={{
            bottom: `${dinoPosition}px`,
            left: "100px",
            transform: `rotate(${dinoAngle}deg)`,
            transition: "transform 1s ease-in-out",
          }}
        ></div>
        <div className={enemyType} style={{ left: `${enemyPosition}px` }}></div>
        {/* Conditionally render the indicator image */}
        <div className="indicator-container" style={{ position: "relative", width: "100%", height: "100%" }}>
          {isMobile && showIndicator && (
            <img
              className="Danger-Triangle"
              src="/static/triangle.png"
              alt="Danger Indicator"
              />
          )}
        </div>
      </div>
    </div>
  );
};

export default Gamelogic;
