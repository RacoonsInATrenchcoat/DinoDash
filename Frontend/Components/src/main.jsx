import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./Router.jsx";
import "bootstrap/dist/css/bootstrap.min.css";  //added after "npm install react-bootstrap bootstrap"
import './index.css'        //order matters, to overwrite the too eager bootstrap


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
