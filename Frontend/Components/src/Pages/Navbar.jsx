import { Link } from "react-router-dom";
import React from "react";
import { useScoreContext, useVolumeContext } from "../Context";
import { useMobileContext } from "../MobileMode";
import MusicPlayer from "../MusicPlayer";
import "../Gamelogic.css";


const Navbar = () => {

  try {
    const isMobile = useMobileContext();
    const { score } = useScoreContext();
    const { volume, setVolume } = useVolumeContext();

    return (
      <nav className="navbar navbar-expand-lg d-flex justify-content-between">
        {/* Left Section */}
        <div className={isMobile == true ? 'mobile-navbar-left' : 'navbar-left d-flex align-items-center justify-content-start'}>
          <div className={isMobile == true ? "mobile-link-container" : "link-container"}>
            <Link
              className={isMobile == true ? 'mobile-nav-link' : `nav-link`}
              aria-current="page"
              to="/"
              onClick={() => window.location.href = "/"} >Home</Link>
          </div>
          <div className="navBarDivider"></div>
          <div className={isMobile == true ? "mobile-link-container" : "link-container"}>
            <Link className={isMobile == true ? 'mobile-nav-link' : `nav-link`} to="/highscorespage"> {isMobile == true ? 'Scores' : `High Scores`}</Link>
          </div>
        </div>

        {/* Center Section */}
        <div className={isMobile == true ? 'mobile-navbar-center' : 'navbar-center text-center flex-grow-1 justify-content-center'}>
          <p className="sigmar-regular displayfont-text">DINO DASH</p>
        </div>

        {/* Right Section */}
        <div className={isMobile == true ? 'mobile-navbar-right' : 'navbar-right d-flex align-items-center justify-content-end'}>
          <div className={isMobile == true ? "mobile-score-container" : "score-container d-flex align-items-center"}>
            <p className= {isMobile == true ? "mobile-game-score":"game-score"}>Score: {score}</p>
          </div>
          <div className={isMobile == true ? 'mobile-volume-control' : 'volume-control d-flex'}>
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
        </div>
        <div className={isMobile == true ? 'mobile-vine' : 'vine'}></div>

        <MusicPlayer volume={volume} />
      </nav>

    );
  } catch (error) {
    console.error("❌ Navbar failed to load context:", error);
    return <h1>Navbar Error</h1>;
  }
};

export default Navbar;