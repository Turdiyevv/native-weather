export const themes = {
  light: {
    name: "light",
    isDark: false,
    background: "#f5f5f5",
    card: "#ffffff",
    text: "#1c1c1e",
    placeholder: "rgba(132,132,140,0.58)",
    subText: "#8e8e93",
    primary: "#007AFF",
    success: "#34C759",
    danger: "#FF3B30",
    border: "#e5e5ea",
    deleted: "#cacacd",
    overlay: "rgba(0,0,0,0.2)",
    description: "#d3d1d1"
  },

  dark: {
    name: "dark",
    isDark: true,
    background: "#101010",
    card: "#202023",
    text: "#e8e7e7",
    placeholder: "rgba(159,158,158,0.58)",
    subText: "#8e8e93",
    primary: "#0A84FF",
    success: "#30D158",
    danger: "#FF453A",
    border: "#2c2c2e",
    deleted: "#565659",
    overlay: "rgba(0,0,0,0.2)",
    description: "#535252"
  },

  blue: {
    name: "blue",
    isDark: true,
    background: "#0e1827",
    card: "#1a263d",
    text: "#E5E7EB",
    placeholder: "rgba(143,144,147,0.58)",
    subText: "#94A3B8",
    primary: "#38BDF8",
    success: "#4ADE80",
    danger: "#FB7185",
    border: "#334155",
    deleted: "#263140",
    overlay: "rgba(15,23,42,0.2)",
    description: "#516681"
  },
} as const;

export type ThemeName = keyof typeof themes;
export type Theme = (typeof themes)[ThemeName] & {
  isDark: boolean;
};
