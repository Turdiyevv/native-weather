export const maskPassword = (password: string): string => {
  if (!password) return "";
  const len = password.length;
  if (len <= 2) return "*".repeat(len);
  return password[0] + "*".repeat(len - 2) + password[len - 1];
};
