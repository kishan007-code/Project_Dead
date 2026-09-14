// src/components/notices/NoticeCard.jsx
import React from "react";

export default function NoticeCard({ notice }) {
  const {
    id,
    title,
    category,
    type = "info",
    date,
    deadline,
    description,
    image,
    downloadLink,
    targetLink,
    actionText
  } = notice;

  return (
    <article className="notice-card" id={id}>
      {/* Full Image Display Container */}
      {image && (
        <div className="notice-card__image-wrap">
          <img src={image} alt={title} className="notice-card__image" />
        </div>
      )}

      {/* Notice Content Below Image */}
      <div className="notice-card__body">
        <div className="notice-card__meta">
          <span className={`notice-card__badge notice-card__badge--${type}`}>
            {category || type}
          </span>
          <span className="notice-card__date">{date}</span>
        </div>

        <h3 className="notice-card__title">{title}</h3>

        {/* Conditional Deadline Section */}
        {deadline && (
          <div className="notice-card__deadline">
            <span className="notice-card__deadline-label">Deadline:</span> {deadline}
          </div>
        )}

        <p className="notice-card__description">{description}</p>

        {/* Action Buttons: Only renders target link if targetLink is defined */}
        {(targetLink || downloadLink) && (
          <div className="notice-card__actions">
            {targetLink && (
              <a href={targetLink} className="notice-card__btn notice-card__btn--primary">
                {actionText || "View Assignment →"}
              </a>
            )}

            
          </div>
        )}
      </div>
    </article>
  );
}