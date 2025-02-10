import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { ScoreContext } from "../Context";

const Navbar = () => {

    const { score } = useContext(ScoreContext);

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
            </div>
        </nav>
    );
};

export default Navbar;
