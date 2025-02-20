import { Link } from "react-router-dom";
import React from "react";
import { useScoreContext, useVolumeContext } from "../Context";
import MusicPlayer from "../MusicPlayer";

console.log("✅ Navbar is mounting!");

const Navbar = () => {
  console.log("🔍 Navbar: Checking Contexts...");

  try {
    const { score } = useScoreContext();
    const { volume, setVolume } = useVolumeContext();

    console.log("✅ Navbar: Contexts loaded correctly.");
    return (
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Dino Dash</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex align-items-center">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/highscorespage">High Scores</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/adminpage">Admin</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/OptionsPage">Options</Link>
              </li>
              <div className="nav-score">Score: {score}</div>
            </ul>
          </div>
          <div className="volume-control">
            <label htmlFor="volume">Volume:</label>
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
        <MusicPlayer volume={volume} />
      </nav>
    );
  } catch (error) {
    console.error("❌ Navbar failed to load context:", error);
    return <h1>Navbar Error</h1>;
  }
};

export default Navbar;