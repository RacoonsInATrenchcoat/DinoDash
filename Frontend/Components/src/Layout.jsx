import React from "react";
import Navbar from "./Pages/Navbar";
import { Outlet } from "react-router-dom";
import { ScoreProvider } from "./Context"; // Import the Score Context Provider

const Layout = () => {
    return (
        <ScoreProvider> {/* Wrap everything inside ScoreProvider */}
            <div>
                <Navbar />
                <div className="container-fluid">
                    <Outlet /> {/* Page content will be loaded here */}
                </div>
            </div>
        </ScoreProvider>
    );
};

export default Layout;
