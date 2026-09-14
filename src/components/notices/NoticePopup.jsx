// src/components/notices/NoticePopup.jsx
import React, { useEffect, useState } from "react";
import notices from "../../data/notices";
import "./NoticePopup.css";

export default function NoticePopup() {
  const [activePopupNotice, setActivePopupNotice] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const popupItem = notices.find((n) => n.showAsPopup && n.image);
    if (!popupItem) return;

    const isDismissed = sessionStorage.getItem("notice_popup_dismissed");
    if (isDismissed) return;

    setActivePopupNotice(popupItem);
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("notice_popup_dismissed", "true");
    setIsOpen(false);
  };

  if (!isOpen || !activePopupNotice) return null;

  // Determines dynamic destination URL
  const destinationUrl =
    activePopupNotice.targetLink || `/notices#${activePopupNotice.id}`;

  return (
    <div className="notice-popup__overlay" onClick={handleClose}>
      <div
        className="notice-popup__modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          className="notice-popup__close-btn"
          onClick={handleClose}
          aria-label="Close"
        >
          <img src="/assets/logos/close.svg" alt="Close" />
        </button>

        {/* Pure Image Container */}
        <div className="notice-popup__image-wrap">
          <img
            src={activePopupNotice.image}
            alt={activePopupNotice.title || "Notice Announcement"}
            className="notice-popup__image"
          />
        </div>

        {/* Actions Bar */}
        <div className="notice-popup__actions">
          <a
            href={destinationUrl}
            className="notice-popup__btn notice-popup__btn--primary"
            onClick={handleClose} /* Fixes persistence on navigation */
          >
            {activePopupNotice.actionText || "Go to Notice"}
          </a>
          <button
            type="button"
            className="notice-popup__btn notice-popup__btn--secondary"
            onClick={handleClose}
          >
            Continue to Site
          </button>
        </div>
      </div>
    </div>
  );
}