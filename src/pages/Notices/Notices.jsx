import { useState } from "react";
import notices from "../../data/notices";
import NoticeCard from "../../components/notices/NoticeCard";
import "./Notices.css";

export default function Notices() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Assignment", "Exam", "General"];

    const filteredNotices = selectedCategory === "All"
        ? notices
        : notices.filter((n) => n.category === selectedCategory);

    return (
        <div className="notices-page">
            <header className="notices-page__header">
                <h1>Academic Notices & Announcements</h1>
                <p>Stay updated with exam schedules, assignment deadlines, and official university notices.</p>
            </header>

            <div className="notices-page__filters">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`notices-page__filter-btn ${selectedCategory === cat ? "active" : ""}`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="notices-page__grid">
                {filteredNotices.map((notice) => (
                    <NoticeCard key={notice.id} notice={notice} />
                ))}
            </div>
        </div>
    );
}