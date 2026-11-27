/**
 * Formats a date string (YYYY-MM-DD or ISO) into a human-friendly relative time string.
 * Examples: "updated today", "updated yesterday", "updated 2 days ago", "updated 3 weeks ago".
 */
export function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'updated today';
  if (diffDays === 1) return 'updated yesterday';
  if (diffDays < 7) return `updated ${diffDays} days ago`;
  const weeks = Math.floor(diffDays / 7);
  if (weeks === 1) return 'updated 1 week ago';
  if (weeks < 4) return `updated ${weeks} weeks ago`;
  const months = Math.floor(diffDays / 30);
  if (months === 1) return 'updated 1 month ago';
  return `updated ${months} months ago`;
}

/**
 * Formats a date string into a clean "as of <date>" format.
 * Example: "as of 25 Nov 2026".
 */
export function formatAsOfDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `as of ${day} ${month} ${year}`;
}
