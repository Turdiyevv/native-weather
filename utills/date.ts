export const formatDateTime = (date: string | Date, locale = "uz-UZ"): string => {
  const d = new Date(date);

  if (isNaN(d.getTime())) return "";

  return d.toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};