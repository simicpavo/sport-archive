const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const DAYS_PER_WEEK = 7;

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();

  const minutes = Math.floor(diffMs / MS_PER_MINUTE);

  if (minutes < 1) {
    return 'Just now';
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(diffMs / MS_PER_HOUR);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(diffMs / MS_PER_DAY);

  if (days < DAYS_PER_WEEK) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString();
};
