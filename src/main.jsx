/* =========================================================
   FWU NOTES - APPLICATION ENTRY POINT
   ---------------------------------------------------------
   This file is the starting point of the React application.
   It loads the global styles and renders the main App
   component into the HTML root element.
   ========================================================= */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./styles/global.css";


/* ---------------------------------------------------------
   APPLICATION RENDERING
   ---------------------------------------------------------
   React mounts the App component inside the HTML element
   with the ID "root".
   --------------------------------------------------------- */

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);