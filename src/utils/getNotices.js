// src/utils/getNotices.js
import notices from "../data/notices"; // Adjust path if notices.js is located elsewhere

/**
 * Extracts and formats notice data specifically for NoticeStrip.
 * @param {number} limit - Max number of notices to return
 * @returns {Array} Formatted notice objects
 */
export function getRecentNotices(limit = 5) {
  return notices
    .slice(0, limit)
    .map((notice) => {
      // Determine badge modifier fallback if type is missing
      let badgeType = notice.type;
      if (!badgeType) {
        badgeType = notice.isUrgent ? "urgent" : "update";
      }

      return {
        id: notice.id,
        rawNotice: notice, // Keeps complete reference for modal handling
        title: notice.title,
        badgeLabel: (notice.category || badgeType).toUpperCase(),
        badgeClass: `notice-strip__badge--${badgeType.toLowerCase()}`,
        // Direct link to the notice ID section on the notices page
        href: `/notices#${notice.id}`, 
        date: notice.date
      };
    });
}