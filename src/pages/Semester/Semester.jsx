import { useState } from "react";
import {
    BookOpen,
    ChevronRight,
    Clock3,
    FileText,
    GraduationCap,
} from "lucide-react";

import semesterData from "../../data/semesterData";
import "./Semester.css";

const faculties = Object.entries(semesterData);

const happenings = [
    {
        type: "RESOURCE",
        title: "New examination papers added",
        description:
            "Past papers and academic resources are being organized semester by semester.",
    },
    {
        type: "NOTICE",
        title: "Semester resources are expanding",
        description:
            "More notes, practicals and assignments will be added as the archive grows.",
    },
    {
        type: "UPDATE",
        title: "FWU Notes is under active development",
        description:
            "The academic archive is being built gradually for easier student access.",
    },
];

function Semester() {
    const [activeFaculty, setActiveFaculty] =
        useState("civil");

    const faculty =
        semesterData[activeFaculty];

    return (
        <main className="semester-page">

            {/* =========================================
                PAGE INTRO
            ========================================= */}

            <section className="semester-hero">
                <div className="semester-hero__inner">

                    <div className="semester-hero__eyebrow">
                        <span />
                        ACADEMIC ARCHIVE
                    </div>

                    <h1>
                        Find your
                        <span> semester.</span>
                    </h1>

                        <p>
            Select a faculty and access its available semester resources.
                         </p>

                </div>
            </section>


            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <section className="semester-layout">

                <div className="semester-main">

                    {/* FACULTY SELECTOR */}

                    <div className="faculty-selector">

                        {faculties.map(
                            ([key, item]) => (
                                <button
    key={key}
    className={
        activeFaculty === key
            ? "faculty-button faculty-button--active"
            : "faculty-button"
    }
    onClick={() =>
        setActiveFaculty(key)
    }
>
    <span className="faculty-button__code">
        {item.code}
    </span>

    <span>
        {item.shortName}
    </span>

    {key !== "civil" && (
        <span className="faculty-button__ribbon">
            UNDER CONSTRUCTION
        </span>
    )}
</button>
                            )
                        )}

                    </div>


                    {/* FACULTY INFORMATION */}

                                <div className="faculty-intro">
                    <div className="faculty-intro__icon">
                        <GraduationCap size={20} />
                    </div>

                    <div className="faculty-intro__content">
                        <p className="faculty-intro__label">
                            SELECTED FACULTY
                        </p>

                        <h2>{faculty.name}</h2>

                        <p>{faculty.description}</p>
                    </div>
                </div>


                    {/* SEMESTER GRID */}

                    <div className="semester-section-heading">
    <div>
        <span>ACADEMIC STRUCTURE</span>
        <h2>Semesters</h2>
    </div>

    <p>{faculty.semesters.length} total</p>
</div>


                    <div className="semester-grid">

                        {faculty.semesters.map(
                            (semester) => {

                                const available =
                                    semester.status ===
                                    "available";

                                return (
                                    <a
                                        key={semester.number}
                                        href={
                                            available
                                                ? `/semester/${activeFaculty}/${semester.number}`
                                                : "#"
                                        }
                                        className={
                                            available
                                                ? "semester-card"
                                                : "semester-card semester-card--disabled"
                                        }
                                        onClick={(event) => {
                                            if (!available) {
                                                event.preventDefault();
                                            }
                                        }}
                                    >

                                        <div className="semester-card__number">
                                            {String(
                                                semester.number
                                            ).padStart(2, "0")}
                                        </div>

                                        <div className="semester-card__content">

                                            <span>
                                                {available
                                                    ? "AVAILABLE"
                                                    : "COMING SOON"}
                                            </span>

                                            <h3>
                                                {semester.name}
                                            </h3>

                                            {available && (
                                                <p>
                                                    <BookOpen
                                                        size={14}
                                                    />
                                                    {semester.subjects}
                                                    {" "}
                                                    subjects
                                                </p>
                                            )}

                                        </div>

                                        <ChevronRight
                                            className="semester-card__arrow"
                                            size={20}
                                        />

                                    </a>
                                );
                            }
                        )}

                    </div>

                </div>


                {/* =====================================
                    LATEST HAPPENINGS
                ===================================== */}

                <aside className="semester-sidebar">

                    <div className="sidebar-heading">
                        <div>
                            <span>
                                LIVE FEED
                            </span>

                            <h2>
                                Latest happenings
                            </h2>
                        </div>

                        <Clock3 size={18} />
                    </div>


                    <div className="happenings-list">

                        {happenings.map(
                            (item, index) => (
                                <article
                                    key={index}
                                    className="happening"
                                >
                                    <div className="happening__line">
                                        <span />
                                    </div>

                                    <div className="happening__content">

                                        <span>
                                            {item.type}
                                        </span>

                                        <h3>
                                            {item.title}
                                        </h3>

                                        <p>
                                            {item.description}
                                        </p>

                                    </div>
                                </article>
                            )
                        )}

                    </div>


                    <div className="sidebar-archive">
                        <FileText size={18} />

                        <div>
                            <strong>
                                Academic archive
                            </strong>

                            <span>
                                Notes · Papers · Practicals
                            </span>
                        </div>
                    </div>

                </aside>

            </section>

        </main>
    );
}

export default Semester;