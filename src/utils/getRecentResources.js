import semesterResources from "../data/semesterResources";

const CATEGORY_LABELS = {
    syllabus: "Syllabus",
    papers: "Past Paper",
    assignments: "Assignment",
    practicals: "Lab Manual",
    tutorials: "Tutorial",
};

function getFileExtension(file = "") {
    const match = file.match(/\.([a-z0-9]+)$/i);
    return match ? match[1].toUpperCase() : "FILE";
}

function flattenResources() {
    const flattened = [];

    Object.entries(semesterResources).forEach(
        ([programKey, semesters]) => {
            Object.entries(semesters).forEach(
                ([semesterNumber, semester]) => {
                    const sem = Number(semesterNumber);

                    // -----------------------------------------
                    // 1. Syllabus
                    // -----------------------------------------
                    semester.syllabus?.forEach((resource) => {
                        flattened.push({
                            ...resource,
                            program: programKey,
                            sem,
                            category: CATEGORY_LABELS.syllabus,
                            format: getFileExtension(resource.file),
                        });
                    });

                    // -----------------------------------------
                    // 2. Past Papers
                    // -----------------------------------------
                    semester.papers?.forEach((resource) => {
                        flattened.push({
                            ...resource,
                            program: programKey,
                            sem,
                            category: CATEGORY_LABELS.papers,
                            format: getFileExtension(resource.file),
                        });
                    });

                    // -----------------------------------------
                    // 3. Notes
                    // Notes are nested:
                    // notes[] -> files[]
                    // -----------------------------------------
                    semester.notes?.forEach((subjectGroup) => {
                        subjectGroup.files?.forEach((resource) => {
                            flattened.push({
                                ...resource,

                                subject:
                                    resource.subject ||
                                    subjectGroup.subject,

                                code:
                                    resource.code ||
                                    subjectGroup.code,

                                program: programKey,
                                sem,

                                category: "Notes",
                                format: getFileExtension(resource.file),
                            });
                        });
                    });

                    // -----------------------------------------
                    // 4. Assignments
                    // -----------------------------------------
                    semester.assignments?.forEach((resource) => {
                        flattened.push({
                            ...resource,
                            program: programKey,
                            sem,
                            category: CATEGORY_LABELS.assignments,
                            format: getFileExtension(resource.file),
                        });
                    });

                    // -----------------------------------------
                    // 5. Practicals
                    // -----------------------------------------
                    semester.practicals?.forEach((resource) => {
                        flattened.push({
                            ...resource,
                            program: programKey,
                            sem,
                            category: CATEGORY_LABELS.practicals,
                            format: getFileExtension(resource.file),
                        });
                    });

                    // -----------------------------------------
                    // 6. Tutorials
                    // -----------------------------------------
                    semester.tutorials?.forEach((resource) => {
                        flattened.push({
                            ...resource,
                            program: programKey,
                            sem,
                            category: CATEGORY_LABELS.tutorials,
                            format: getFileExtension(resource.file),
                        });
                    });
                }
            );
        }
    );

    return flattened;
}

export function getRecentResources(limit = 4) {
        return flattenResources()
        .sort(
            (a, b) =>
                new Date(b.uploadedDate) -
                new Date(a.uploadedDate)
        )
        .slice(0, limit)
        .map((resource) => ({
            ...resource,

            program: resource.program
                ? resource.program.charAt(0).toUpperCase() +
                  resource.program.slice(1)
                : "—",

            uploaded: formatRelativeDate(resource.uploadedDate),
        }));
}

export function getTotalResources() {
    return flattenResources().length;
}

function formatRelativeDate(dateString) {
    if (!dateString) return "—";

    const date = new Date(dateString);
    const now = new Date();

    const difference =
        now.getTime() - date.getTime();

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    if (days <= 0) {
        return "Today";
    }

    if (days === 1) {
        return "1 day ago";
    }

    if (days < 7) {
        return `${days} days ago`;
    }

    if (days < 30) {
        const weeks = Math.floor(days / 7);
        return weeks === 1
            ? "1 week ago"
            : `${weeks} weeks ago`;
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}