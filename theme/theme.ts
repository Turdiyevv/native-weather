export const themes = {
  light: {
      name: "light",
      isDark: false,
      background: "#ECEDEF",
      card: "#FFFFFF",
      text: "#2C2C2E",
      placeholder: "rgba(194,194,195,0.6)",
      subText: "#6E6E73",
      primary: "#5E5CE6",
      success: "#30B158",
      danger: "#E5533D",
      border: "#D1D1D6",
      deleted: "#B8B8BD",
      bgsound: "#a8a8ac",
      overlay: "rgba(0,0,0,0.15)",
      description: "#7C7C80",
  },

  dark: {
      name: "dark",
      isDark: true,
      background: "#121212",
      card: "#1C1C1E",
      text: "#E6E6E8",
      placeholder: "rgba(150,150,155,0.55)",
      subText: "#9A9AA0",
      primary: "#7A7AFF",
      success: "#4ECB8F",
      danger: "#f16b5f",
      border: "#2C2C2E",
      deleted: "#3A3A3C",
      bgsound: "#272729",
      overlay: "rgba(0,0,0,0.45)",
      description: "#8E8E93",
  },

  blue: {
      name: "blue",
      isDark: true,
      background: "#0B1220",
      card: "#151F32",
      text: "#E6E8EC",
      placeholder: "rgba(194,194,195,0.6)",
      subText: "#9AA4B2",
      primary: "#5DA9F6",
      success: "#4ECB8F",
      danger: "#F08A8A",
      border: "#22304A",
      deleted: "#2A3752",
      bgsound: "#1a2232",
      overlay: "rgba(10,15,30,0.45)",
      description: "#7F8AA3",
  },
  orange: {
      name: "orange",
      isDark: false,
      background: "#f4ece3",
      card: "#f6f4f1",
      text: "#2B2B2B",
      placeholder: "rgba(194,194,195,0.6)",
      subText: "#7A7A7A",
      primary: "#F2994A",
      success: "#6FCF97",
      danger: "#EB5757",
      border: "#E0D8D0",
      deleted: "#C9C0B8",
      bgsound: "#a6a09a",
      overlay: "rgba(0,0,0,0.15)",
      description: "#8E857D",
  },


} as const;

export type ThemeName = keyof typeof themes;
export type Theme = (typeof themes)[ThemeName] & {
  isDark: boolean;
};
