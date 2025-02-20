import React, { useState, useContext } from "react";
import Gamelogic from "../Gamelogic";
import { ScoreContext, useLevelContext } from "../Context"; // ✅ Imported Level Context
import "../Gamelogic.css";

const Homepage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const { setScore } = useContext(ScoreContext);
  const { level, nextLevel } = useLevelContext(); // ✅ Using level from context

  const startGame = () => {
    setGameStarted(true);
    setIsRunning(true);
    setScore(0);
  };

  const pauseGame = () => {
    setIsRunning(false);
  };

  const resumeGame = () => {
    setIsRunning(true);
  };

  return (
    <div className="homepage-container">
      {gameStarted ? (
        <>
          <Gamelogic isRunning={isRunning} onPause={pauseGame} />
          {!isRunning && (
            <div className="pause-overlay">
              <div className="pause-menu">
                <h2>Game Paused</h2>
                <button onClick={resumeGame} className="resume-btn">Resume Game</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="container text-center mt-5">
          {/* Start Game Button */}
          <button onClick={startGame} className="start-btn">Start Game</button>

          {/* Level Selector */}
          <div className="d-flex align-items-center justify-content-center">
            <p className="me-3 mb-0">Select level:</p>
            <button className="btn btn-secondary" onClick={nextLevel}>
              Level {level}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
