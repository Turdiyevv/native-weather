export const themes = {
  light: {
      name: "light",
      isDark: false,
      background: "#ECEDEF",
      card: "#FFFFFF",
      text: "#2C2C2E",
      placeholder: "rgba(120,120,125,0.6)",
      subText: "#6E6E73",
      primary: "#5E5CE6",
      success: "#30B158",
      danger: "#E5533D",
      border: "#D1D1D6",
      deleted: "#B8B8BD",
      overlay: "rgba(0,0,0,0.15)",
      description: "#7C7C80",
  },

  dark: {
      name: "dark",
      isDark: true,
      background: "#121212",      // soft dark (AMOLED emas)
      card: "#1C1C1E",            // iOS dark card
      text: "#E6E6E8",            // soft white
      placeholder: "rgba(150,150,155,0.55)",
      subText: "#9A9AA0",
      primary: "#7A7AFF",         // yumshoq indigo
      success: "#4ECB8F",
      danger: "#F28B82",
      border: "#2C2C2E",
      deleted: "#3A3A3C",
      overlay: "rgba(0,0,0,0.45)",
      description: "#8E8E93",
  },

  blue: {
      name: "blue",
      isDark: true,
      background: "#0B1220",
      card: "#151F32",
      text: "#E6E8EC",
      placeholder: "rgba(160,165,175,0.55)",
      subText: "#9AA4B2",
      primary: "#5DA9F6",
      success: "#4ECB8F",
      danger: "#F08A8A",
      border: "#22304A",
      deleted: "#2A3752",
      overlay: "rgba(10,15,30,0.45)",
      description: "#7F8AA3",
  },
  orange: {
      name: "orange",
      isDark: false,

      background: "#f4ece3",      // iliq och kulrang (oq emas)
      card: "#f6f4f1",
      text: "#2B2B2B",
      placeholder: "rgba(125,125,125,0.55)",
      subText: "#7A7A7A",

      primary: "#F2994A",         // soft orange (neon emas)
      success: "#6FCF97",
      danger: "#EB5757",

      border: "#E0D8D0",
      deleted: "#C9C0B8",

      overlay: "rgba(0,0,0,0.15)",
      description: "#8E857D",
  },


} as const;

export type ThemeName = keyof typeof themes;
export type Theme = (typeof themes)[ThemeName] & {
  isDark: boolean;
};
