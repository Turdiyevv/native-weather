export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);

  if (isNaN(d.getTime())) return "";

  return d.toLocaleString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};