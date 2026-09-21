// src/components/NoticeStrip.jsx
import React, { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { getRecentNotices } from "../utils/getNotices";

export function NoticeStrip({ onSelectNotice }) {
  const [notices, setNotices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setNotices(getRecentNotices());
  }, []);

  useEffect(() => {
    if (notices.length <= 1) return;
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % notices.length);
        setIsFading(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [notices]);

  if (!notices.length || dismissed) return null;

  const currentNotice = notices[currentIndex];

  const handleVisit = () => {
    // fallback fixes the case where the data layer never attached `rawNotice`
    const payload = currentNotice.rawNotice ?? currentNotice;
    onSelectNotice?.(payload);
  };

  return (
    <section className="notice-strip" aria-live="polite">
      <div className="notice-strip__container">
        <div className={`notice-strip__content ${isFading ? "is-fading" : ""}`}>
          <span className={`notice-strip__badge ${currentNotice.badgeClass}`}>
            {currentNotice.badgeLabel}
          </span>

          <p className="notice-strip__text">{currentNotice.title}</p>

          <div className="notice-strip__actions">
            {onSelectNotice ? (
              <button type="button" className="notice-strip__cta" onClick={handleVisit}>
                View Notice <ArrowRight size={13} strokeWidth={2.5} />
              </button>
            ) : (
              <a href="/notices" className="notice-strip__cta">
                View Notice <ArrowRight size={13} strokeWidth={2.5} />
              </a>
            )}

            <button
              type="button"
              className="notice-strip__dismiss"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss notice"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NoticeStrip;