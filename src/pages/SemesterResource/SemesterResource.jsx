import { useState, useMemo, useEffect, useRef } from "react";

import {
    ArrowLeft,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Download,
    ExternalLink,
    FileText,
    FlaskConical,
    GraduationCap,
    HelpCircle,
    Layers,
    Search,
    Users,
} from "lucide-react";

import semesterData from "../../data/semesterData";
import semesterResources from "../../data/semesterResources";

import "./SemesterResource.css";

const filterTabs = [
    { key: "all", label: "All Resources" },
    { key: "syllabus", label: "Syllabus" },
    { key: "notes", label: "Lecture Notes" },
    { key: "papers", label: "Exam Papers" },
    { key: "assignments", label: "Assignments" },
    { key: "labs", label: "Lab Reports" },
    { key: "tutorials", label: "Tutorials" },
];

function SemesterResource() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedSubjects, setExpandedSubjects] = useState({});
    const [visitCount, setVisitCount] = useState(0);

    const hasIncremented = useRef(false);

    const pathParts = window.location.pathname
        .split("/")
        .filter(Boolean);

    const facultyKey = pathParts[1] || "civil";
    const semesterNumber = Number(pathParts[2]) || 2;

    const faculty = semesterData[facultyKey];

    const semester = useMemo(() => {
        return faculty?.semesters?.find(
            (item) => item.number === semesterNumber
        );
    }, [faculty, semesterNumber]);

    const resources =
        semesterResources[facultyKey]?.[semesterNumber];

    /*
     * Visitor tracking
     * One visit is counted per page load.
     * Counter resets after six months.
     */
    useEffect(() => {
        if (hasIncremented.current) return;

        hasIncremented.current = true;

        const storageKey = `visits_${facultyKey}_sem${semesterNumber}`;
        const timestampKey = `visits_ts_${facultyKey}_sem${semesterNumber}`;

        const now = Date.now();
        const SIX_MONTHS_MS =
            180 * 24 * 60 * 60 * 1000;

        const lastReset = Number(
            localStorage.getItem(timestampKey) || 0
        );

        let currentVisits = Number(
            localStorage.getItem(storageKey) || 0
        );

        if (
            !lastReset ||
            now - lastReset > SIX_MONTHS_MS
        ) {
            currentVisits = 1;

            localStorage.setItem(
                timestampKey,
                now.toString()
            );
        } else {
            currentVisits += 1;
        }

        localStorage.setItem(
            storageKey,
            currentVisits.toString()
        );

        setVisitCount(currentVisits);
    }, [facultyKey, semesterNumber]);

    const toggleSubject = (index) => {
        setExpandedSubjects((previous) => ({
            ...previous,
            [index]: !previous[index],
        }));
    };

    const expandAll = () => {
        if (!resources?.notes) return;

        const allExpanded = {};

        resources.notes.forEach((_, index) => {
            allExpanded[index] = true;
        });

        setExpandedSubjects(allExpanded);
    };

    const collapseAll = () => {
        setExpandedSubjects({});
    };

    const matchesSearch = (text = "") => {
        return text
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
    };

    /*
     * Real statistics calculated from the resource data.
     */
    const statistics = useMemo(() => {
        if (!resources) {
            return {
                subjects: 0,
                documents: 0,
                sections: 0,
            };
        }

        const noteFiles =
            resources.notes?.reduce(
                (total, subject) =>
                    total + (subject.files?.length || 0),
                0
            ) || 0;

        const syllabusCount =
            resources.syllabus?.length || 0;

        const paperCount =
            resources.papers?.length || 0;

        const assignmentCount =
            resources.assignments?.length || 0;

        const practicalCount =
            resources.practicals?.length || 0;

        const tutorialCount =
            resources.tutorials?.length || 0;

        return {
            subjects: resources.notes?.length || 0,

            documents:
                noteFiles +
                syllabusCount +
                paperCount +
                assignmentCount +
                practicalCount +
                tutorialCount,

            sections: [
                syllabusCount,
                noteFiles,
                paperCount,
                assignmentCount,
                practicalCount,
                tutorialCount,
            ].filter((count) => count > 0).length,
        };
    }, [resources]);

    if (!resources) {
        return (
            <main className="resource-page">
                <div className="resource-empty">
                    <h1>Semester Resources Not Found</h1>

                    <p>
                        Please check back later or select another
                        semester.
                    </p>

                    <a href="/semester">
                        <ArrowLeft size={16} />
                        Back to Semesters
                    </a>
                </div>
            </main>
        );
    }

    return (
        <main className="resource-page">
            {/* HEADER */}

            <header className="resource-header">
                <div className="resource-container">
                    <nav className="resource-breadcrumbs">
                        <a href="/semester">
                            All Semesters
                        </a>

                        <span>/</span>

                        <a href={`/semester/${facultyKey}`}>
                            {faculty?.code ||
                                facultyKey.toUpperCase()}
                        </a>

                        <span>/</span>

                        <strong>
                            Semester {semesterNumber}
                        </strong>
                    </nav>

                    <div className="resource-heading">
                        <div>
                            <p className="resource-kicker">
                                {faculty?.name}
                            </p>

                            <h1>{resources.title}</h1>

                            <p className="resource-subtitle">
                                {resources.subtitle}
                            </p>
                        </div>

                        <a
                            href="/semester"
                            className="resource-back-link"
                        >
                            <ArrowLeft size={15} />
                            All Semesters
                        </a>
                    </div>

                    <div className="resource-stats-bar">
                        <div className="stat-item">
                            <span className="stat-label">
                                SUBJECTS
                            </span>

                            <strong className="stat-value">
                                {statistics.subjects}
                            </strong>
                        </div>

                        <div className="stat-item">
                            <span className="stat-label">
                                DOCUMENTS
                            </span>

                            <strong className="stat-value">
                                {statistics.documents}
                            </strong>
                        </div>

                        <div className="stat-item">
                            <span className="stat-label">
                                RESOURCE TYPES
                            </span>

                            <strong className="stat-value">
                                {statistics.sections}
                            </strong>
                        </div>

                        <div className="stat-item">
                            <span className="stat-label">
                                TOTAL VISITS
                            </span>

                            <strong className="stat-value stat-blue">
                                <Users size={19} />
                                {visitCount.toLocaleString()}
                            </strong>
                        </div>
                    </div>
                </div>
            </header>

            {/* STICKY FILTER BAR */}

            <section className="resource-controls-bar">
                <div className="resource-container controls-inner">
                    <div className="filter-tabs">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                className={`tab-btn ${
                                    activeTab === tab.key
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveTab(tab.key)
                                }
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <label className="search-box">
                        <Search size={19} />

                        <input
                            type="search"
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(
                                    event.target.value
                                )
                            }
                        />
                    </label>
                </div>
            </section>

            {/* RESOURCE CONTENT */}

            <section className="resource-container resource-body">
                {/* SYLLABUS */}

                {(activeTab === "all" ||
                    activeTab === "syllabus") && (
                    <ResourceSection
                        icon={<GraduationCap size={19} />}
                        title="Syllabus"
                        count={resources.syllabus?.length}
                    >
                        <div className="grid-cards">
                            {resources.syllabus
                                ?.filter((item) =>
                                    matchesSearch(
                                        `${item.title} ${item.credit}`
                                    )
                                )
                                .map((item, index) => (
                                    <DocCard
                                        key={`syllabus-${index}`}
                                        item={item}
                                        tag="SYLLABUS"
                                    />
                                ))}
                        </div>
                    </ResourceSection>
                )}

                {/* LECTURE NOTES */}

                {(activeTab === "all" ||
                    activeTab === "notes") && (
                    <ResourceSection
                        icon={<BookOpen size={19} />}
                        title="Lecture Notes"
                        count={statistics.documents}
                  
                    >
                        <div className="subject-accordion-list">
                            {resources.notes?.map(
                                (subject, subjectIndex) => {
                                    const isExpanded =
                                        expandedSubjects[
                                            subjectIndex
                                        ] ?? true;

                                    const filteredFiles =
                                        subject.files?.filter(
                                            (file) =>
                                                matchesSearch(
                                                    `${file.title} ${file.credit} ${subject.subject}`
                                                )
                                        );

                                    if (
                                        searchQuery &&
                                        filteredFiles.length === 0
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <div
                                            className="subject-card"
                                            key={subjectIndex}
                                        >
                                            <button
                                                type="button"
                                                className="subject-header"
                                                onClick={() =>
                                                    toggleSubject(
                                                        subjectIndex
                                                    )
                                                }
                                            >
                                                <div className="subject-info">
                                                    <span className="subject-code">
                                                        {subject.code}
                                                    </span>

                                                    <div>
                                                        <h3>
                                                            {
                                                                subject.subject
                                                            }
                                                        </h3>

                                                        <p>
                                                            {
                                                                subject.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="subject-meta">
                                                    <span>
                                                        {
                                                            subject.files
                                                                ?.length
                                                        }{" "}
                                                        files
                                                    </span>

                                                    {isExpanded ? (
                                                        <ChevronUp
                                                            size={17}
                                                        />
                                                    ) : (
                                                        <ChevronDown
                                                            size={17}
                                                        />
                                                    )}
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className="subject-files-list">
                                                    {filteredFiles?.map(
                                                        (
                                                            file,
                                                            fileIndex
                                                        ) => (
                                                            <FileRow
                                                                key={
                                                                    fileIndex
                                                                }
                                                                file={
                                                                    file
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </ResourceSection>
                )}

            {/* EXAMINATION PAPERS */}

{(activeTab === "all" || activeTab === "papers") && (
    <ResourceSection
        icon={<HelpCircle size={19} />}
        title="Examination Papers"
        count={
            (resources.papers?.length || 0) +
            (resources.paperAnalysis?.length || 0)
        }
    >
        <div className="resource-subsection">
            <div className="resource-subsection-heading">
                <div>
                    <h3>Examination Papers</h3>
                    <p>
                        Complete examination papers collected from
                        different academic years.
                    </p>
                </div>

                <span className="resource-subsection-tag">
                    PAPERS
                </span>
            </div>

            <div className="grid-cards">
                {resources.papers
                    ?.filter((item) =>
                        matchesSearch(
                            `${item.title} ${item.credit} ${item.subject} ${item.code}`
                        )
                    )
                    .map((item, index) => (
                        <DocCard
                            key={`paper-${index}`}
                            item={item}
                            tag="PAPERS"
                        />
                    ))}
            </div>
        </div>

        <div className="resource-subsection">
            <div className="resource-subsection-heading">
                <div>
                    <h3>Solo Analysis</h3>
                    <p>
                        Subject-wise analysis, important topics,
                        numerical distribution, and examination trends.
                    </p>
                </div>

                <span className="resource-subsection-tag">
                    SOLO-ANALYSIS
                </span>
            </div>

            <div className="grid-cards">
                {resources.paperAnalysis
                    ?.filter((item) =>
                        matchesSearch(
                            `${item.title} ${item.credit} ${item.subject} ${item.code}`
                        )
                    )
                    .map((item, index) => (
                        <DocCard
                            key={`analysis-${index}`}
                            item={item}
                            tag="SOLO-ANALYSIS"
                        />
                    ))}
            </div>
        </div>
    </ResourceSection>
)}
               {/* ASSIGNMENTS AND TUTORIALS */}

{(activeTab === "all" || activeTab === "assignments") && (
    <ResourceSection
        icon={<Layers size={19} />}
        title="Assignments and Tutorials"
        count={resources.assignmentsTutorials?.length || 0}
    >
        <div className="grid-cards">
            {resources.assignmentsTutorials
                ?.filter((item) =>
                    matchesSearch(
                        `${item.title} ${item.credit} ${item.subject} ${item.code} ${item.tag}`
                    )
                )
                .map((item, index) => (
                    <DocCard
                        key={`assignment-tutorial-${index}`}
                        item={item}
                        tag={
                            item.tag === "TUTORIAL"
                                ? "TUTORIAL"
                                : "ASSIGNMENT"
                        }
                    />
                ))}
        </div>
    </ResourceSection>
)}

                {/* PRACTICALS */}

                {(activeTab === "all" ||
                    activeTab === "labs") && (
                    <ResourceSection
                        icon={<FlaskConical size={19} />}
                        title="Laboratory Reports"
                        count={resources.practicals?.length}
                    >
                        <div className="grid-cards">
                            {resources.practicals
                                ?.filter((item) =>
                                    matchesSearch(
                                        `${item.title} ${item.credit}`
                                    )
                                )
                                .map((item, index) => (
                                    <DocCard
                                        key={`practical-${index}`}
                                        item={item}
                                        tag="LAB REPORT"
                                    />
                                ))}
                        </div>
                    </ResourceSection>
                )}

                
            </section>
        </main>
    );
}

function ResourceSection({
    icon,
    title,
    count,
    controls,
    children,
}) {
    return (
        <section className="resource-section">
            <div className="section-title">
                <div className="section-title-main">
                    {icon}

                    <h2>{title}</h2>

                    {typeof count === "number" && (
                        <span className="section-count">
                            {count}
                        </span>
                    )}
                </div>

                {controls}
            </div>

            {children}
        </section>
    );
}

function FileRow({ file }) {
    return (
        <div className="file-row">
            <div className="file-info">
                <FileText
                    size={18}
                    className="file-icon"
                />

                <div>
                    <h4>{file.title}</h4>

                    <div className="file-meta">
                        <span>
                            {file.credit || "FWU Notes"}
                        </span>

                        <span>·</span>

                        <span>
                            {file.size || "PDF"}
                        </span>

                        <span>·</span>

                        <span>
                            {file.uploadedDate || "Recently added"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="file-actions">
                <a
                    href={file.file}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-action btn-view"
                >
                    <ExternalLink size={14} />
                    View
                </a>

                <a
                    href={file.file}
                    download
                    className="btn-action btn-download"
                >
                    <Download size={14} />
                    Download
                </a>
            </div>
        </div>
    );
}

function DocCard({ item, tag }) {
    return (
        <article className="doc-card">
            <div className="doc-card-top">
                <span className="doc-tag">{tag}</span>

                <FileText
                    size={17}
                    className="doc-card-icon"
                />
            </div>

            <h3>{item.title}</h3>

            <div className="doc-meta">
                <span>
                    <strong>Credit:</strong>{" "}
                    {item.credit || "FWU Notes"}
                </span>

                <span>
                    <strong>Size:</strong>{" "}
                    {item.size || "PDF"}
                </span>

                <span>
                    <strong>Added:</strong>{" "}
                    {item.uploadedDate || "Recently"}
                </span>
            </div>

            <div className="doc-actions">
                <a
                    href={item.file}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-action btn-view"
                >
                    <ExternalLink size={14} />
                    View
                </a>

                <a
                    href={item.file}
                    download
                    className="btn-action btn-download"
                >
                    <Download size={14} />
                    Download
                </a>
            </div>
        </article>
    );
}

export default SemesterResource;