// src/components/NoticeStrip.jsx
import React, { useState, useEffect } from "react";
import { getRecentNotices } from "../utils/getNotices";

export function NoticeStrip({ onSelectNotice }) {
  const [notices, setNotices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const data = getRecentNotices();
    setNotices(data);
  }, []);

  useEffect(() => {
    if (notices.length <= 1) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % notices.length);
        setIsFading(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [notices]);

  if (!notices.length) return null;

  const currentNotice = notices[currentIndex];

  return (
    <section className="notice-strip" aria-live="polite">
      <div className="notice-strip__container">
        <div className={`notice-strip__content ${isFading ? "is-fading" : ""}`}>
          <span className={`notice-strip__badge ${currentNotice.badgeClass}`}>
            {currentNotice.badgeLabel}
          </span>
          
          <p className="notice-strip__text">
            {currentNotice.title}
          </p>

          {onSelectNotice ? (
            <button
              type="button"
              className="notice-strip__link-btn"
              onClick={() => onSelectNotice(currentNotice.rawNotice)}
            >
              View details →
            </button>
          ) : (
            <a href={currentNotice.href} className="notice-strip__link">
              View details →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default NoticeStrip;