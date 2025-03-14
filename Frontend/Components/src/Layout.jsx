import React from "react";
import Navbar from "./Pages/Navbar";
import { Outlet } from "react-router-dom";



const Layout = () => {
    return (
        <>
            <Navbar /> {/* ✅ No double wrapping */}
            <div className="outlet">
                <Outlet />
            </div>
        </>
    );
};

export default Layout;
