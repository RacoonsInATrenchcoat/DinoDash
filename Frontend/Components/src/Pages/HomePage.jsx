import React, { useEffect, useState } from "react";
import Gamelogic from "../Gamelogic";
import MusicPlayer from "../MusicPlayer"; // Now rendered here
import { useScoreContext, useLevelContext } from "../Context";
import { useMobileContext } from "../MobileMode";
import "../Gamelogic.css";

const Homepage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const { setScore } = useScoreContext();
  const { level, nextLevel } = useLevelContext();
  const isMobile = useMobileContext();
  // Overlay state for orientation detection
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      setShowOverlay(isPortrait); // Show overlay in portrait, hide in landscape
    };
  
    checkOrientation(); // Run immediately on load
  
    window.addEventListener("resize", checkOrientation); // More reliable than 'orientationchange'?
  
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);
  

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
      {/*Overlay added to signal if it is portrait mode.*/}
      {showOverlay && (
        <div className="orientation-overlay">
          <img className="portait-dino-warning" src="/static/lizardwizard_150x150.png"></img>
          <p>The dino says:</p>
          <p>"Please rotate your device to landscape mode for a better experience."</p>
        </div>
      )}
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
              <div className={isMobile == true ? "mobile-text-Centered-In-Image" : "text-Centered-In-Image"}>Start</div>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center">
              <br className={isMobile == true ? "mobile-space" : ""} />
              <br className={isMobile == true ? "mobile-space" : ""} />
              <p className={isMobile == true ? "mobile-menu-text" : "me-3 mb-0"}>Select level:</p>
              <button className="btn btn-secondary" onClick={nextLevel}>
                Level {level}
              </button>
              <br className={isMobile == true ? "mobile-space" : ""} />
              <br className={isMobile == true ? "mobile-space" : ""} />
              <p className={isMobile == true ? "mobile-menu-text" : ""}>Different levels have different areas.</p>
              <p className={isMobile == true ? "mobile-menu-text" : ""}>Speed is increased, but so is the score!</p>
              <div className={isMobile == true ? "" : "mt-5"}>
                <p className={isMobile == true ? "mobile-menu-text" : ""}>Use SPACE to jump.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
