import { useMemo } from "react";
import {
    ArrowLeft,
    Construction,
    HardHat,
    Wrench,
} from "lucide-react";

import "./UnderConstruction.css";

const messages = [
    {
        title: "The foundation is still curing.",
        text: "This section is under construction. Please check back after the concrete gains sufficient strength.",
    },
    {
        title: "Survey work is still in progress.",
        text: "Our engineers are currently trying to figure out where this page is supposed to go.",
    },
    {
        title: "Structural analysis pending.",
        text: "The page exists in the drawing, but the actual structure has not been constructed yet.",
    },
    {
        title: "Under construction. Literally.",
        text: "The site engineers have been notified. They responded with a hard hat and a coffee.",
    },
    {
        title: "Work order received.",
        text: "Construction has started, but unfortunately the contractor has not submitted the page yet.",
    },
    {
        title: "Please stand clear of the construction zone.",
        text: "This section is being developed. No unauthorized entry beyond this point.",
    },
];

const pageNames = {
    "/tools": "Engineering Tools",
    "/about": "About FWU Notes",
    "/disclaimer": "Disclaimer",
    "/privacy": "Privacy Policy",
    "/terms": "Terms",
    "/Tools":"GPA/SGPA Calculator",
    "/Tools":"Formula Sheets",
};

function UnderConstruction() {
    const message = useMemo(() => {
        return messages[
            Math.floor(Math.random() * messages.length)
        ];
    }, []);

    const path = window.location.pathname;

    const pageName =
        pageNames[path] ||
        "This section";

    return (
        <main className="construction-page">

            <section className="construction-card">

                <div className="construction-icon">
                    <Construction size={32} />
                </div>

                <span className="construction-eyebrow">
                    SITE DEVELOPMENT · WORK IN PROGRESS
                </span>

                <h1>
                    {message.title}
                </h1>

                <p className="construction-page-name">
                    You were looking for{" "}
                    <strong>{pageName}</strong>.
                </p>

                <p className="construction-description">
                    {message.text}
                </p>

                <div className="construction-status">
                    <span className="construction-status__dot" />
                    CONSTRUCTION STATUS: ACTIVE
                </div>

                <div className="construction-actions">

                    <a
                        href="/"
                        className="construction-button construction-button--primary"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </a>

                    <a
                        href="/semester"
                        className="construction-button construction-button--secondary"
                    >
                        <HardHat size={16} />
                        Explore Semesters
                    </a>

                </div>

                <div className="construction-footer">
                    <Wrench size={15} />
                    FWU Notes Engineering Department
                </div>

            </section>

        </main>
    );
}

export default UnderConstruction;