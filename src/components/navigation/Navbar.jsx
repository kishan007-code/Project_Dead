/* =========================================================
   FWU NOTES - NAVIGATION BAR
   ---------------------------------------------------------
   Responsive application navigation.

   Desktop:
   Brand + navigation + search + theme

   Mobile:
   Brand + search + theme + hamburger
   Navigation opens inside the mobile menu.
   ========================================================= */

import { useEffect, useState } from "react";
import semesterData from "../../data/semesterData";
import "./Navbar.css";


const facultyOrder = ["civil", "computer", "architecture"];

const getSemesterPath = (facultyKey, semesterNumber) => {
    return `/semester/${facultyKey}/${semesterNumber}`;
};

function SemesterLink({ facultyKey, semester }) {
    const isAvailable = semester.status === "available";

    if (!isAvailable) {
        return (
            <span
                className="navbar__semester-link navbar__semester-link--disabled"
                title="This semester is currently under construction"
                aria-disabled="true"
            >
                {semester.name}
                <span className="navbar__semester-status">Soon</span>
            </span>
        );
    }

    return (
        <a
            href={getSemesterPath(facultyKey, semester.number)}
            className="navbar__semester-link"
        >
            {semester.name}
            <span className="navbar__semester-status">Open</span>
        </a>
    );
}

const searchIndex = [
    {
        title: "Home",
        description: "FWU Notes homepage",
        path: "/",
    },
    {
        title: "Notices",
        description: "Latest academic announcements and updates",
        path: "/notices",
    },
    {
        title: "Academic Directory",
        description: "Browse all faculties and semesters",
        path: "/semester",
    },
    {
        title: "Engineering Tools",
        description: "Engineering calculators and utilities",
        path: "/tools",
    },
    {
        title: "Unit Converter",
        description: "Convert common engineering units",
        path: "/tools/unit-converter",
    },
    {
        title: "Calculators",
        description: "Engineering calculation tools",
        path: "/tools/calculators",
    },
    {
        title: "About FWU Notes",
        description: "Information about the FWU Notes project",
        path: "/about",
    },
];


function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
const [theme, setTheme] = useState(() => {
    return localStorage.getItem("fwu_notes_theme") || "light";
});

useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("fwu_notes_theme", theme);
}, [theme]);

const semesterSearchItems = facultyOrder.flatMap((facultyKey) => {
    const faculty = semesterData[facultyKey];

    return faculty.semesters.map((semester) => ({
        title: `${faculty.name} — ${semester.name}`,
        description:
            semester.status === "available"
                ? "Open semester resources"
                : "Semester under construction",
        path:
            semester.status === "available"
                ? getSemesterPath(facultyKey, semester.number)
                : null,
        disabled: semester.status !== "available",
    }));
});

const searchableItems = [
    ...searchIndex,
    ...semesterSearchItems,
];

const filteredResults =
    searchQuery.trim().length === 0
        ? []
        : searchableItems
              .filter((item) => {
                  const searchableText =
                      `${item.title} ${item.description}`.toLowerCase();

                  return searchableText.includes(
                      searchQuery.trim().toLowerCase()
                  );
              })
              .slice(0, 8);

    const toggleMenu = () => {
        setMenuOpen((current) => !current);
    };

    const toggleSearch = () => {
        setSearchOpen((current) => !current);
    };

    const toggleTheme = () => {
    setTheme((currentTheme) =>
        currentTheme === "light" ? "dark" : "light"
    );
};

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className="navbar">

            {/* =================================================
                MAIN NAVBAR
                ================================================= */}

            <div className="navbar__container">

                {/* -------------------------------------------------
                    BRAND
                   ------------------------------------------------- */}

                <a
                    href="/"
                    className="navbar__brand"
                    onClick={closeMenu}
                >
                    <span className="navbar__brand-mark">
                        FW
                    </span>

                    <span className="navbar__brand-name">
                        FWU Notes
                    </span>
                </a>


                {/* -------------------------------------------------
                    DESKTOP NAVIGATION
                   ------------------------------------------------- */}

                <nav
                    className="navbar__links"
                    aria-label="Primary navigation"
                >

                    <a
                        href="/"
                        className="navbar__link navbar__link--active"
                    >
                        Home
                    </a>

                    <a
                        href="/notices"
                        className="navbar__link"
                    >
                        Notices
                    </a>

                    <div className="navbar__dropdown">
    <button
        className="navbar__link navbar__dropdown-trigger"
        type="button"
    >
        Semesters
        <img src="/assets/logos/dropdown.svg" alt="" width="16" height="16" />
    </button>

    <div className="navbar__dropdown-menu">
        <a
            href="/semester"
            className="navbar__dropdown-overview"
        >
            <span className="navbar__dropdown-overview-label">
                Academic Directory
            </span>

            <strong>All Semesters</strong>

            <span>
                Choose your faculty and semester →
            </span>
        </a>

        <div className="navbar__dropdown-divider" />

        {facultyOrder.map((facultyKey) => {
            const faculty = semesterData[facultyKey];

            return (
                <div
                    className="navbar__dropdown-group"
                    key={facultyKey}
                >
                    <div className="navbar__dropdown-group-heading">
                        <span className="navbar__dropdown-group-title">
                            {faculty.name}
                        </span>

                        {facultyKey !== "civil" && (
                            <span className="navbar__dropdown-construction">
                                Under construction
                            </span>
                        )}
                    </div>

                    <div className="navbar__semester-list">
                        {faculty.semesters.map((semester) => (
                            <SemesterLink
                                key={`${facultyKey}-${semester.number}`}
                                facultyKey={facultyKey}
                                semester={semester}
                            />
                        ))}
                    </div>
                </div>
            );
        })}
    </div>
</div>


                    <div className="navbar__dropdown">
                        <button
                            className="navbar__link navbar__dropdown-trigger"
                            type="button"
                        >
                            Tools
                                    <img src="/assets/logos/dropdown.svg" alt="" width="16" height="16" />
                        </button>

                        <div className="navbar__dropdown-menu">
                            <a href="/tools">
                                Engineering Tools
                            </a>

                            <a href="/tools/unit-converter">
                                Unit Converter
                            </a>

                            <a href="/tools/calculators">
                                Calculators
                            </a>
                        </div>
                    </div>

                    <a
                        href="/about"
                        className="navbar__link"
                    >
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
                        type="button"
                        aria-label={
                            searchOpen
                                ? "Close search"
                                : "Open search"
                        }
                        aria-expanded={searchOpen}
                        onClick={toggleSearch}
                    >
                                <img src="/assets/logos/search.svg" alt="" width="20" height="20" />
                    </button>


                    {/* Theme */}

                   <button
    className="navbar__icon-button"
    type="button"
    aria-label={
        theme === "light"
            ? "Switch to dark theme"
            : "Switch to light theme"
    }
    onClick={toggleTheme}
>
    <span aria-hidden="true">
        {theme === "light" ? (
            <img
                src="/assets/logos/light.svg"
                alt=""
                width="22"
                height="22"
            />
        ) : (
            <img
                src="/assets/logos/dark.svg"
                alt=""
                width="22"
                height="22"
            />
        )}
    </span>
</button>

                    {/* Mobile menu */}

                    <button
                        className="navbar__menu-button"
                        type="button"
                        aria-label={
                            menuOpen
                                ? "Close navigation menu"
                                : "Open navigation menu"
                        }
                        aria-expanded={menuOpen}
                        onClick={toggleMenu}
                    >
                        {menuOpen ? <img src="/assets/logos/close.svg" alt="" width="16" height="16" /> : "☰"}
                    </button>

                </div>

            </div>


            {/* =================================================
                SEARCH PANEL
                ================================================= */}

            {searchOpen && (
    <div className="navbar__search-panel">
        <div className="navbar__search">
            <span
                className="navbar__search-icon"
                aria-hidden="true"
            >
                <img src="/assets/logos/search.svg" alt="" width="16" height="16" />
            </span>

            <input
                type="text"
                placeholder="Search notes, subjects, papers..."
                value={searchQuery}
                onChange={(event) =>
                    setSearchQuery(event.target.value)
                }
                autoFocus
            />

            {searchQuery && (
                <button
                    className="navbar__search-clear"
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchQuery("")}
                >
                    <img src="/assets/logos/close.svg" alt="" width="16" height="16" />

                </button>
            )}
        </div>

        {searchQuery.trim() && (
            <div className="navbar__search-results">
                {filteredResults.length > 0 ? (
                    filteredResults.map((item) => {
                        if (item.disabled) {
                            return (
                                <div
                                    key={item.title}
                                    className="navbar__search-result navbar__search-result--disabled"
                                >
                                    <strong>{item.title}</strong>
                                    <span>{item.description}</span>
                                </div>
                            );
                        }

                        return (
                            <a
                                key={item.title}
                                href={item.path}
                                className="navbar__search-result"
                                onClick={() => {
                                    setSearchOpen(false);
                                    setSearchQuery("");
                                    closeMenu();
                                }}
                            >
                                <strong>{item.title}</strong>
                                <span>{item.description}</span>
                            </a>
                        );
                    })
                ) : (
                    <div className="navbar__search-empty">
                        No matching pages found.
                    </div>
                )}
            </div>
        )}
    </div>
)}


            {/* =================================================
                MOBILE NAVIGATION
                ================================================= */}

            {menuOpen && (
                <div className="navbar__mobile-menu">

                    <a
                        href="/"
                        className="navbar__mobile-link navbar__mobile-link--active"
                        onClick={closeMenu}
                    >
                        Home
                    </a>

                    <a
                        href="/notices"
                        className="navbar__mobile-link"
                        onClick={closeMenu}
                    >
                        Notices
                    </a>

                  <details className="navbar__mobile-group">
    <summary>
        <span>Semesters</span>
        <span className="navbar__mobile-summary-arrow"><img src="/assets/logos/dropdown.svg" alt="" width="16" height="16" />
</span>
    </summary>

    <div className="navbar__mobile-submenu">
        <a
            href="/semester"
            className="navbar__mobile-overview"
        >
            <span className="navbar__mobile-overview-title">
                All Semesters
            </span>

            <span>
                Choose faculty and semester →
            </span>
        </a>

        {facultyOrder.map((facultyKey) => {
            const faculty = semesterData[facultyKey];

            return (
                <details
                    className="navbar__mobile-subgroup"
                    key={facultyKey}
                >
                    <summary>
                        <span>{faculty.name}</span>

                        <span className="navbar__mobile-subgroup-arrow">
                            <img src="/assets/logos/dropdown.svg" alt="" width="16" height="16" />
                        </span>
                    </summary>

                    <div className="navbar__mobile-submenu-inner">
                        {faculty.semesters.map((semester) => {
                            const isAvailable =
                                semester.status === "available";

                            if (!isAvailable) {
                                return (
                                    <span
                                        key={`${facultyKey}-${semester.number}`}
                                        className="navbar__mobile-semester-link navbar__mobile-semester-link--disabled"
                                        aria-disabled="true"
                                    >
                                        <span>{semester.name}</span>
                                        <small>Coming soon</small>
                                    </span>
                                );
                            }

                            return (
                                <a
                                    key={`${facultyKey}-${semester.number}`}
                                    href={getSemesterPath(
                                        facultyKey,
                                        semester.number
                                    )}
                                    className="navbar__mobile-semester-link"
                                >
                                    <span>{semester.name}</span>
                                    <small>Open resources</small>
                                </a>
                            );
                        })}
                    </div>
                </details>
            );
        })}
    </div>
</details>

                    <details className="navbar__mobile-group">
                        <summary>
                            <span>Tools</span>
                            <span>                                    <img src="/assets/logos/dropdown.svg" alt="" width="16" height="16" />
</span>
                        </summary>

                        <div className="navbar__mobile-submenu">

                            <a href="/tools">
                                Engineering Tools
                            </a>

                            <a href="/tools">
                                Unit Converter
                            </a>

                            <a href="/tools">
                                Calculators
                            </a>

                        </div>
                    </details>


                    <a
                        href="/about"
                        className="navbar__mobile-link"
                        onClick={closeMenu}
                    >
                        About
                    </a>

                </div>
            )}

        </header>
    );
}

export default Navbar;