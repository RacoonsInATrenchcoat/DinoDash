import React, { useState } from "react";
import Gamelogic from "../Gamelogic";
import MusicPlayer from "../MusicPlayer"; // Now rendered here
import { useScoreContext, useLevelContext } from "../Context";
import "../Gamelogic.css";

const Homepage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const { setScore } = useScoreContext();
  const { level, nextLevel } = useLevelContext();

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
      {/* MusicPlayer is now rendered at the top without receiving isPlaying as a prop */}
      <MusicPlayer />

      {gameStarted ? (
        <>
          <Gamelogic isRunning={isRunning} onPause={pauseGame} />
          {!isRunning && (
            <div className="pause-overlay">
              <div className="pause-menu">
                <h2>Game Paused</h2>
                <button onClick={resumeGame} className="resume-btn">
                  Resume Game
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="container text-center mt-5">
          <div className="main-menu-container d-flex flex-column align-items-center justify-content-center">
            <div
              className="menu-container d-flex justify-content-center"
              onClick={startGame}
            >
              <img src="/static/Elements/Wooden_Button_1.svg" alt="Wooden Button" />
              <div className="text-Centered-In-Image">Start</div>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center">
              <br />
              <br />
              <p className="me-3 mb-0">Select level:</p>
              <button className="btn btn-secondary" onClick={nextLevel}>
                Level {level}
              </button>
              <br />
              <br />
              <p>Different levels have different areas.</p>
              <p>Speed is increased, but so is the score!.</p>
              <div className="mt-5">
                <p>Use SPACE to jump.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
