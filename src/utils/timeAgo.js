import { formatDistanceToNow } from "date-fns";

/**
 * Converts a date string or Date object to a "time ago" format.
 *
 * @param {Date | string} inputDate - The date to format.
 * @returns {string} - Human-readable time ago string (e.g., "3 minutes ago").
 */
export function timeAgo(inputDate) {
    if (!inputDate) return "";
    try {
        return formatDistanceToNow(new Date(inputDate), { addSuffix: true });
    } catch (error) {
        console.error("Invalid date passed to timeAgo:", inputDate);
        return "";
    }
}
