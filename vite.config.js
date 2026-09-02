/* =========================================================
   FWU NOTES - VITE CONFIGURATION
   ---------------------------------------------------------
   This file configures Vite for our React application.
   ========================================================= */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


/* ---------------------------------------------------------
   VITE CONFIGURATION
   ---------------------------------------------------------
   The React plugin allows Vite to understand and process
   React JSX files.
   --------------------------------------------------------- */

export default defineConfig({
    plugins: [react()],
});