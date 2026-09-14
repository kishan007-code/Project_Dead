/* =========================================================
   FWU NOTES - HOME PAGE
   ========================================================= */
import { getRecentResources, getTotalResources } from "../../utils/getRecentResources";
import { getRecentNotices } from "../../utils/getNotices";
import NoticeStrip from "../../components/NoticeStrip"; // update path as needed
import { useState, useEffect, useRef } from "react";
import "./Home.css";
import {
    ArrowLeftRight,
    Calculator,
    Wrench,
    BookOpen,
    ExternalLink,
    ArrowRight,
    X,
    FileText,
} from "lucide-react";

/* =========================================================
   DATA CONFIGURATIONS
   ========================================================= */

const RESOURCE_TYPES = [
    {
        id: "notes",
        label: "Lecture Notes",
        count: "Subject-wise study material",
        icon: "📝",
        href: "/semester",
        description: "Organized notes for your engineering subjects.",
    },
    {
        id: "past-papers",
        label: "Past Papers",
        count: "Previous examination papers",
        icon: "📑",
        href: "/semester",
        description: "Prepare with previous examination patterns.",
    },
    {
        id: "assignments",
        label: "Assignments",
        count: "Guides and solved work",
        icon: "✏️",
        href: "/semester",
        description: "Useful references for regular coursework.",
    },
    {
        id: "practicals",
        label: "Lab Manuals",
        count: "Practical reports and records",
        icon: "🧪",
        href: "/semester",
        description: "Keep your practical preparation organized.",
    },
    {
        id: "syllabus",
        label: "Course Syllabi",
        count: "Semester-wise curriculum",
        icon: "🗺️",
        href: "/semester",
        description: "Find the syllabus before starting your preparation.",
    },
    {
        id: "tools",
        label: "Engineering Tools",
        count: "Calculation utilities",
        icon: "⚙️",
        href: "/tools",
        description: "Useful engineering calculators and references.",
    },
];

const FEATURED_SEMESTERS = [
    {
        id: 2,
        code: "SEM II",
        title: "Second Semester",
        program: "CIVIL",
        programClass: "matrix-card__tag--civil",
        subjects: ["Fluid Mechanics", "Surveying I", "Engineering Math II", "Building Construction"],
        resourceCount: 34,
        link: "/semester/civil/2",
    },
    {
        id: 4,
        code: "SEM IV",
        title: "Fourth Semester",
        program: "COMPUTER",
        programClass: "matrix-card__tag--computer",
        subjects: ["Data Structures & Algorithms", "Microprocessors", "Discrete Math", "Numerical Methods"],
        resourceCount: 42,
        link: "/semester/computer/4",
    },
    {
        id: 6,
        code: "SEM VI",
        title: "Sixth Semester",
        program: "CIVIL",
        programClass: "matrix-card__tag--civil",
        subjects: ["Soil Mechanics", "Hydrology & Meteorology", "Design of Steel Structures"],
        resourceCount: 38,
        link: "/semester/civil/6",
    },
    {
        id: 8,
        code: "SEM VIII",
        title: "Eighth Semester",
        program: "ARCHITECTURE",
        programClass: "matrix-card__tag--archi",
        subjects: ["Urban Planning", "Construction Management", "Professional Practice", "Thesis Project"],
        resourceCount: 29,
        link: "/semester/architecture/8",
    },
];

const TICKER_ITEMS = [
    "Verified Field Notes",
    "Past Examination Question Papers",
    "Lab Practical Manuals",
    "Complete Course Syllabi",
    "Assignment Solutions & Guides",
    "Engineering Calculators & Tools",
    "FWU School of Engineering",
];

/* =========================================================
   ANIMATED NUMBER COMPONENT
   ========================================================= */

function AnimatedNumber({ target, suffix = "", start }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;

        let current = 0;
        const duration = 1400;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
            current += increment;

            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [start, target]);

    return (
        <>
            {count}
            {suffix}
        </>
    );
}

/* =========================================================
   MAIN HOME COMPONENT
   ========================================================= */

function Home() {
    const [noticeIndex, setNoticeIndex] = useState(0);
    const [noticeFading, setNoticeFading] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
    const [totalVisits, setTotalVisits] = useState(null);
    const [selectedNotice, setSelectedNotice] = useState(null);

    
    const statsRef = useRef(null);
    const recentArchive = getRecentResources(4);
    const totalResources = getTotalResources();
    const dynamicNotices = getRecentNotices(5);

    /*
     * TEMPORARY VISIT VALUE
     */
    useEffect(() => {
        const storedVisits = Number(localStorage.getItem("fwu_notes_total_visits") || 0);
        const nextVisits = storedVisits + 1;
        localStorage.setItem("fwu_notes_total_visits", String(nextVisits));
        setTotalVisits(nextVisits);
    }, []);

    /* ---------------------------------------------------------
       HERO MOUSE TRACKER
       --------------------------------------------------------- */
    const handlePointerMove = (event) => {
        const hero = event.currentTarget;
        const rect = hero.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        hero.style.setProperty("--mouse-x", `${x}px`);
        hero.style.setProperty("--mouse-y", `${y}px`);
    };

    /* ---------------------------------------------------------
       STATS INTERSECTION OBSERVER
       --------------------------------------------------------- */
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStatsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, []);

    /* ---------------------------------------------------------
       DYNAMIC NOTICE STRIP TIMER (6 SECONDS)
       --------------------------------------------------------- */
    useEffect(() => {
        if (!dynamicNotices || dynamicNotices.length === 0) return;

        const interval = setInterval(() => {
            setNoticeFading(true);
            setTimeout(() => {
                setNoticeIndex((prev) => (prev + 1) % dynamicNotices.length);
                setNoticeFading(false);
            }, 300);
        }, 6000);

        return () => clearInterval(interval);
    }, [dynamicNotices]);

    const activeNotice = dynamicNotices[noticeIndex] || null;

    const getBadgeClass = (category) => {
        switch (category?.toLowerCase()) {
            case "urgent":
            case "exam":
                return "notice-strip__badge--urgent";
            case "new":
            case "resource":
                return "notice-strip__badge--new";
            case "update":
            case "syllabus":
                return "notice-strip__badge--update";
            default:
                return "notice-strip__badge--info";
        }
    };

    const getBadgeLabel = (item) => {
        if (item.badge) return item.badge;
        const cat = item.category || item.type || "NOTICE";
        if (cat.toLowerCase() === "urgent") return "🔴 URGENT NOTICE";
        if (cat.toLowerCase() === "new") return "🔵 NEW RESOURCE";
        if (cat.toLowerCase() === "update") return "🟢 SYLLABUS UPDATE";
        return `ℹ️ ${cat.toUpperCase()}`;
    };

    return (
        <main className="home">
            {/* =================================================
                1. HERO SECTION
                ================================================= */}
            <section className="hero" onPointerMove={handlePointerMove}>
                <div className="hero__halftone" aria-hidden="true" />

                <div className="hero__container">
                    <div className="hero__content">
                        <div className="hero__eyebrow">
                            <span className="hero__eyebrow-dot" />
                            FAR WESTERN UNIVERSITY · SCHOOL OF ENGINEERING
                        </div>

                        <h1 className="hero__title">
                            Your engineering semester,
                            <span>organized without the chaos.</span>
                        </h1>

                        <p className="hero__description">
                            Verified notes, examination papers, syllabi, assignments and practical resources — organized for engineering students at FWU.
                        </p>

                        <div className="hero__actions">
                            <a
                                href="/semester"
                                className="hero__button hero__button--primary"
                            >
                                <span>Explore Semesters</span>
                                <ArrowRight size={17} strokeWidth={2} />
                            </a>

                            <a
                                href="/about"
                                className="hero__button hero__button--secondary"
                            >
                                <span>About the Project</span>
                            </a>
                        </div>

                        <div className="hero__stats" ref={statsRef}>
                            <div className="hero__stat">
                                <strong>
                                    <AnimatedNumber target={8} start={statsVisible} />
                                </strong>
                                <span>Semesters</span>
                            </div>

                            <div className="hero__stat">
                                <strong>
                                    <AnimatedNumber target={10} suffix="+" start={statsVisible} />
                                </strong>
                                <span>Contributors</span>
                            </div>

                            <div className="hero__stat">
                                <strong>
                                    <AnimatedNumber target={100} suffix="+" start={statsVisible} />
                                </strong>
                                <span>Planned resources</span>
                            </div>

                            <div className="hero__stat hero__stat--visits">
                                <strong>
                                    {totalVisits === null ? "—" : totalVisits.toLocaleString()}
                                </strong>
                                <span>Total visits</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero__visual">
                        <div className="hero__artwork">
                            <div className="hero__badge-behind" aria-hidden="true">
                                <span className="badge-primary">Teej</span>
                                <span className="badge-secondary">Special</span>
                            </div>
                            <div
                                className="hero__orbit hero__orbit--one"
                                aria-hidden="true"
                            />

                            <div
                                className="hero__orbit hero__orbit--two"
                                aria-hidden="true"
                            />

                            <div className="hero__figure">
                                <img
                                    src="/assets/images/visual_bg.png"
                                    alt="Engineering student illustration"
                                    className="hero__real-image"
                                />
                            </div>

                            <div className="hero__floating-card">
                                <span>FIELD NOTES</span>
                                <strong>READY TO LEARN?</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================
                2. RESOURCE TYPES DIRECTORY ("NECK" SECTION)
                ================================================= */}
            <section className="directory">
                <div className="directory__container">
                    <header className="directory__header">
                        <span className="directory__label">WHAT'S INSIDE</span>
                        <h2 className="directory__title">
                            Everything you need, <span>in one place.</span>
                        </h2>
                    </header>

                    <div className="directory__grid">
                        {RESOURCE_TYPES.map((type) => (
                            <a key={type.id} href={type.href} className="directory__card">
                                <div className="directory__card-left">
                                    <span className="directory__icon">{type.icon}</span>
                                    <div className="directory__meta">
                                        <h3 className="directory__name">{type.label}</h3>
                                        <span className="directory__count">{type.count}</span>
                                    </div>
                                </div>
                                <span className="directory__arrow">→</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* =================================================
                3. AUTOMATED DYNAMIC NOTICE STRIP
                ================================================= */}
           
          {/* =================================================
    3. AUTOMATED DYNAMIC NOTICE STRIP
    ================================================= */}
<NoticeStrip onSelectNotice={setSelectedNotice} />

            {/* =================================================
                4. CURRICULUM MATRIX
                ================================================= */}
            <section className="matrix">
                <div className="matrix__container">
                    <header className="section-header">
                        <div>
                            <span className="section-header__tag">ACADEMIC MATRIX</span>
                            <h2 className="section-header__title">Curriculum by Semester</h2>
                        </div>
                        <a href="/semester" className="section-header__action">
                            View all 8 semesters <span>→</span>
                        </a>
                    </header>

                    <div className="matrix__scroll-wrapper">
                        <div className="matrix__grid">
                            {FEATURED_SEMESTERS.map((sem) => (
                                <article key={sem.id} className="matrix-card">
                                    <div className="matrix-card__top">
                                        <span className="matrix-card__code">{sem.code}</span>
                                        <span className={`matrix-card__tag ${sem.programClass}`}>
                                            {sem.program}
                                        </span>
                                    </div>

                                    <h3 className="matrix-card__title">{sem.title}</h3>

                                    <ul className="matrix-card__subjects">
                                        {sem.subjects.map((subj, i) => (
                                            <li key={i}>{subj}</li>
                                        ))}
                                    </ul>

                                    <div className="matrix-card__footer">
                                        <span className="matrix-card__count">
                                            {sem.resourceCount} verified resources
                                        </span>
                                        <a href={sem.link} className="matrix-card__button">
                                            Enter {sem.code} →
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================
                5. LIVE ACADEMIC ARCHIVE
                ================================================= */}
            <section className="archive">
                <div className="archive__container">
                    <header className="section-header">
                        <div>
                            <span className="section-header__tag">LIVE ACADEMIC ARCHIVE</span>
                            <h2 className="section-header__title">Recent Academic Resources</h2>
                        </div>
                        <a href="/semester" className="section-header__action">
                            View complete index <span>→</span>
                        </a>
                    </header>

                    {/* Desktop Table View */}
                    <div className="archive__table-wrapper">
                        <table className="archive__table">
                            <thead>
                                <tr>
                                    <th>Subject &amp; Code</th>
                                    <th>Category</th>
                                    <th>Program</th>
                                    <th>Sem.</th>
                                    <th>Format</th>
                                    <th>Uploaded</th>
                                    <th className="archive__th-actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentArchive.map((item) => (
                                    <tr key={item.id}>
                                        <td className="archive__td-subject">
                                            <strong>{item.subject}</strong>
                                            <small>{item.code}</small>
                                        </td>
                                        <td>
                                            <span className="archive__badge">{item.category}</span>
                                        </td>
                                        <td>{item.program}</td>
                                        <td>{item.sem}</td>
                                        <td>
                                            <span className="archive__fmt">{item.format}</span>
                                        </td>
                                        <td className="archive__td-muted">{item.uploaded}</td>
                                        <td className="archive__td-actions">
                                            <a
                                                className="archive__icon-btn"
                                                href={item.file}
                                                target="_blank"
                                                rel="noreferrer"
                                                title="Quick View"
                                                aria-label={`View ${item.subject}`}
                                            >
                                                <img src="/assets/logos/view.svg" alt="" width="16" height="16" />
                                            </a>

                                            <a
                                                className="archive__icon-btn"
                                                href={item.file}
                                                download
                                                title="Download"
                                                aria-label={`Download ${item.subject}`}
                                            >
                                                <img src="/assets/logos/download.svg" alt="" width="16" height="16" />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="archive__mobile-cards">
                        {recentArchive.map((item) => (
                            <div key={item.id} className="archive-card">
                                <div className="archive-card__header">
                                    <h4>{item.subject}</h4>
                                    <span className="archive__badge">{item.category}</span>
                                </div>
                                <div className="archive-card__sub">
                                    {item.program} · Sem {item.sem} · {item.code}
                                </div>
                                <div className="archive-card__footer">
                                    <span className="archive-card__meta">
                                        {item.format} · {item.uploaded}
                                    </span>
                                    <div className="archive__td-actions">
                                        <a
                                            className="archive__icon-btn"
                                            href={item.file}
                                            target="_blank"
                                            rel="noreferrer"
                                            title="Quick View"
                                            aria-label={`View ${item.subject}`}
                                        >
                                            <img src="/assets/logos/view.svg" alt="view pdf" width="16" height="16" title="View PDF" />
                                        </a>

                                        <a
                                            className="archive__icon-btn"
                                            href={item.file}
                                            download
                                            title="Download"
                                            aria-label={`Download ${item.subject}`}
                                        >
                                            <img src="/assets/logos/download.svg" alt="download" width="16" height="16" title="Download File" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="archive__footer">
                        <span>
                            {recentArchive.length} of {totalResources} verified academic documents
                        </span>
                        <a href="/semester" className="archive__search-link">
                            Search the complete technical index →
                        </a>
                    </div>
                </div>
            </section>

            {/* =================================================
                6. CONTINUOUS ACADEMIC TICKER (MARQUEE)
                ================================================= */}
            <section className="marquee-section">
                <div className="marquee">
                    <div className="marquee__track">
                        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
                            <div key={idx} className="marquee__item">
                                <span className="marquee__dot">•</span>
                                <span className="marquee__text">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =================================================
                7. ENGINEERING COMPUTATION TOOLS
                ================================================= */}
            <section className="tools-section">
                <div className="tools-container">
                    <div className="tools-header">
                        <div>
                            <span className="tools-label">INTERACTIVE UTILITIES</span>
                            <h2 className="tools-title">Engineering Computation Tools</h2>
                        </div>
                        <p className="tools-subtitle">
                            Built specifically according to FWU grading schemes and engineering design standards.
                        </p>
                    </div>

                    <div className="tools-grid">
                        <div className="tool-card">
                            <div className="tool-card-body">
                                <div className="tool-icon-wrapper">
                                    <ArrowLeftRight size={20} className="tool-icon-blue" />
                                </div>
                                <h3 className="tool-card-title">Unit Converter</h3>
                                <p className="tool-card-desc">Deterministic conversion for Stress (MPa to psi), Discharge (m³/s to cusec), Kinematic Viscosity, and Force.</p>
                            </div>
                            <div className="tool-card-footer">
                                <span className="tool-tag">SI / US Customary</span>
                                <a href="/tools" className="tool-action">Launch Tool <ExternalLink size={14} /></a>
                            </div>
                        </div>

                        <div className="tool-card">
                            <div className="tool-card-body">
                                <div className="tool-icon-wrapper">
                                    <Calculator size={20} className="tool-icon-blue" />
                                </div>
                                <h3 className="tool-card-title">SGPA / CGPA Engine</h3>
                                <p className="tool-card-desc">Preset with Far Western University course credit weights. Calculate semester standing and estimate required finals marks.</p>
                            </div>
                            <div className="tool-card-footer">
                                <span className="tool-tag">FWU 4.0 Scale</span>
                                <a href="/tools" className="tool-action">Calculate <ExternalLink size={14} /></a>
                            </div>
                        </div>

                        <div className="tool-card">
                            <div className="tool-card-body">
                                <div className="tool-icon-wrapper">
                                    <Wrench size={20} className="tool-icon-blue" />
                                </div>
                                <h3 className="tool-card-title">Concrete &amp; Steel Estimator</h3>
                                <p className="tool-card-desc">Quickly compute nominal concrete mixes (M15, M20, M25) and calculate unit rebar weights (d²/162) in seconds.</p>
                            </div>
                            <div className="tool-card-footer">
                                <span className="tool-tag">IS 456 Standard</span>
                                <a href="/tools" className="tool-action">Estimate <ExternalLink size={14} /></a>
                            </div>
                        </div>

                        <div className="tool-card">
                            <div className="tool-card-body">
                                <div className="tool-icon-wrapper">
                                    <BookOpen size={20} className="tool-icon-blue" />
                                </div>
                                <h3 className="tool-card-title">Beam Bending Formulae</h3>
                                <p className="tool-card-desc">Interactive shear force, bending moment, and deflection equations for simply supported, cantilever, and fixed spans.</p>
                            </div>
                            <div className="tool-card-footer">
                                <span className="tool-tag">Structural Ref</span>
                                <a href="/tools" className="tool-action">View Sheet <ExternalLink size={14} /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================
                8. NOTICE POPUP MODAL
                ================================================= */}
            {selectedNotice && (
                <div
                    className="notice-modal-overlay"
                    onClick={() => setSelectedNotice(null)}
                >
                    <div
                        className="notice-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="notice-modal__close"
                            onClick={() => setSelectedNotice(null)}
                            aria-label="Close Notice Modal"
                        >
                            <X size={18} />
                        </button>

                        <span className={`notice-strip__badge ${getBadgeClass(selectedNotice.category || selectedNotice.type)}`}>
                            {getBadgeLabel(selectedNotice)}
                        </span>

                        <h3 className="notice-modal__title">
                            {selectedNotice.title || selectedNotice.text}
                        </h3>

                        {selectedNotice.date && (
                            <span className="notice-modal__date">Published: {selectedNotice.date}</span>
                        )}

                        <p className="notice-modal__description">
                            {selectedNotice.description || selectedNotice.text}
                        </p>

                        <div className="notice-modal__actions">
                            {selectedNotice.file && (
                                <a
                                    href={selectedNotice.file}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hero__button hero__button--primary"
                                >
                                    <FileText size={16} />
                                    <span>Download Attachment</span>
                                </a>
                            )}
                            <a
                                href="/notices"
                                className="hero__button hero__button--secondary"
                            >
                                <span>Go to Notices Page</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Home;