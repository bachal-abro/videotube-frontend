import { formatDistanceToNow } from "date-fns";

export function timeAgo(inputDate) {
    if (!inputDate) return "";
    try {
        return formatDistanceToNow(new Date(inputDate), { addSuffix: true });
    } catch (error) {
        console.error("Invalid date passed to timeAgo:", inputDate);
        return "";
    }
}

export function secondsToDuration(seconds) {
    // Extract hours, minutes, seconds, and milliseconds
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.round((seconds % 1) * 1000); // keep 3 decimal digits

    // Pad with leading zeros
    const h = String(hrs).padStart(2, "0");
    const m = String(mins).padStart(2, "0");
    const s = String(secs).padStart(2, "0");
    const ms = String(millis).padStart(3, "0");

    return `${h}:${m}:${s}`;
}
