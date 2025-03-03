import React, { useState } from "react";
import Gamelogic from "../Gamelogic";
import { useScoreContext, useLevelContext } from "../Context"; // ✅ Imported Level Context
import "../Gamelogic.css";

const Homepage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const { setScore } = useScoreContext(); // ✅ Correctly using useScoreContext
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
          <div className="main-menu-container d-flex flex-column align-items-center justify-content-center">

            <div className="menu-container d-flex justify-content-center" onClick={startGame}>
              <img src="/static/Elements/Wooden_Button_1.svg" alt="Wooden Button" />
              <div className="text-Centered-In-Image">Start game</div>
            </div>
            {/*<button onClick={startGame} className="start-btn">Start Game</button>*/}

            <div className="d-flex flex-column align-items-center justify-content-center">
              <p className="me-3 mb-0">Select level:</p>
              <button className="btn btn-secondary" onClick={nextLevel}>
                Level {level}
              </button>
              <p>Different levels have different areas!</p>
              <p>Enemies and their speed also changes.</p>
              <div className="mt-5">
                <p>Use SPACE to jump.</p>
                <p>Beware! Your score only increases while you are not jumping!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;