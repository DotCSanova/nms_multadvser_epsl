
/**
 * Formats a date string to a localized date and time
 * @param dateString - ISO date string to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};
