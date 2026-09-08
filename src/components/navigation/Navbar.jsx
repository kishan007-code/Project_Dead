/* =========================================================
   FWU NOTES - NAVIGATION BAR
   ---------------------------------------------------------
   The Navbar provides the primary navigation and application
   utilities.

   Primary navigation:
   - Home
   - Semesters
   - Tools
   - About

   Utilities:
   - Search
   - Theme toggle
   ========================================================= */

import { useState } from "react";
import "./Navbar.css";


function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <header className="navbar">

            <div className="navbar__container">

                {/* -------------------------------------------------
                   BRAND
                   ------------------------------------------------- */}

                <a href="/" className="navbar__brand">
                    <span className="navbar__brand-mark">FW</span>

                    <span className="navbar__brand-name">
                        FWU Notes
                    </span>
                </a>


                {/* -------------------------------------------------
                   DESKTOP NAVIGATION
                   ------------------------------------------------- */}

                <nav className="navbar__links">

                    <a href="/" className="navbar__link">
                        Home
                    </a>

                    <button className="navbar__link navbar__dropdown-trigger">
                        Semesters
                        <span className="navbar__arrow">⌄</span>
                    </button>

                    <button className="navbar__link navbar__dropdown-trigger">
                        Tools
                        <span className="navbar__arrow">⌄</span>
                    </button>

                    <a href="/about" className="navbar__link">
                        About
                    </a>

                </nav>


                {/* -------------------------------------------------
                   NAVBAR ACTIONS
                   ------------------------------------------------- */}

                <div className="navbar__actions">

                    {/* Search */}

                    <button
                        className="navbar__icon-button"
                        aria-label="Open search"
                        onClick={() => setSearchOpen(!searchOpen)}
                    >
                        🔍
                    </button>


                    {/* Theme */}

                    <button
                        className="navbar__icon-button"
                        aria-label="Toggle theme"
                    >
                        ☾
                    </button>


                    {/* Mobile menu */}

                    <button
                        className="navbar__menu-button"
                        aria-label="Open navigation menu"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? "×" : "☰"}
                    </button>

                </div>

            </div>


            {/* -----------------------------------------------------
               SEARCH PANEL
               ----------------------------------------------------- */}

            {searchOpen && (
                <div className="navbar__search-panel">

                    <div className="navbar__search">

                        <span className="navbar__search-icon">
                            🔍
                        </span>

                        <input
                            type="search"
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.target.value)
                            }
                        />

                        {searchQuery && (
                            <button
                                className="navbar__search-clear"
                                aria-label="Clear search"
                                onClick={() => setSearchQuery("")}
                            >
                                ×
                            </button>
                        )}

                    </div>

                </div>
            )}


            {/* -----------------------------------------------------
               MOBILE NAVIGATION
               ----------------------------------------------------- */}

            {menuOpen && (
                <div className="navbar__mobile-menu">

                    <a href="/" className="navbar__mobile-link">
                        Home
                    </a>

                    <button className="navbar__mobile-link">
                        Semesters
                        <span>›</span>
                    </button>

                    <button className="navbar__mobile-link">
                        Tools
                        <span>›</span>
                    </button>

                    <a href="/about" className="navbar__mobile-link">
                        About
                    </a>

                </div>
            )}

        </header>
    );
}


export default Navbar;