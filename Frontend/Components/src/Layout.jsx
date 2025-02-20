import React from "react";
import Navbar from "./Pages/Navbar";
import { Outlet } from "react-router-dom";

console.log("✅ Layout is mounting!"); // Debugging log

const Layout = () => {
    return (
        <>
            <Navbar /> {/* ✅ No double wrapping */}
            <div className="container-fluid">
                <Outlet />
            </div>
        </>
    );
};

export default Layout;
