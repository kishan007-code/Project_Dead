// src/utils/dateUtils.js

/**
 * Calculates human-readable relative deadlines automatically.
 * @param {string} dateString - ISO date format (e.g. "2026-03-16T17:00:00")
 */
export function getRelativeDeadline(dateString) {
  if (!dateString) return null;

  const targetDate = new Date(dateString);
  const now = new Date();

  if (isNaN(targetDate.getTime())) return null;

  // Zero out time components to compare calendar days accurately
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  const diffInMs = targetDay - today;
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  const timeString = targetDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (diffInDays < 0) return "Expired";
  if (diffInDays === 0) return `Today, ${timeString}`;
  if (diffInDays === 1) return `Tomorrow, ${timeString}`;
  if (diffInDays > 1) return `${diffInDays} days left (${timeString})`;
}