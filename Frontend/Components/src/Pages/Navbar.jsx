import { Link } from "react-router-dom";
import React from "react";
import { useScoreContext, useVolumeContext } from "../Context";
import MusicPlayer from "../MusicPlayer";
import "../Gamelogic.css";


const Navbar = () => {

  try {
    const { score } = useScoreContext();
    const { volume, setVolume } = useVolumeContext();

    return (
      <nav className="navbar navbar-expand-lg d-flex justify-content-between">
        {/* Left Section */}
        <div className="navbar-left d-flex align-items-center justify-content-start">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex align-items-center">
            <li className="nav-item">
              <Link
                className="nav-link"
                aria-current="page"
                to="/"
                onClick={() => window.location.href = "/"} >Home</Link>
            </li>
            <div className="navBarDivider"></div>
            <li className="nav-item">
              <Link className="nav-link" to="/highscorespage">High Scores</Link>
            </li>
          </ul>
        </div>

        {/* Center Section */}
        <div className="navbar-center text-center flex-grow-1 justify-content-center">
          <p className="sigmar-regular displayfont-text">LIZARD WIZARD</p>
        </div>

        {/* Right Section */}
        <div className="navbar-right d-flex align-items-center justify-content-end">
          <div className="score-container">
            <p className="game-score">Score: {score}</p>
          </div>
          <div className="volume-control d-flex">
            <label htmlFor="volume align-items-center">Volume:</label>
            <div className="custom-slider">
              <input
                id="volume"
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
              />
            </div>
          </div>
          <div className="vine"></div>
        </div>

        <MusicPlayer volume={volume} />
      </nav>

    );
  } catch (error) {
    console.error("❌ Navbar failed to load context:", error);
    return <h1>Navbar Error</h1>;
  }
};

export default Navbar;