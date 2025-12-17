import React, { createContext, useContext, useEffect, useState } from "react";
import { Theme, ThemeName, themes } from "./theme";
import { loadTheme, saveTheme } from "../service/storage";

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>("light");
  const [ready, setReady] = useState(false);

  // 🔹 app ochilganda theme ni oqib olish
  useEffect(() => {
    (async () => {
      const savedTheme = await loadTheme();
      if (savedTheme && themes[savedTheme]) {
        setThemeName(savedTheme);
      }
      setReady(true);
    })();
  }, []);

  const changeTheme = async (name: ThemeName) => {
    setThemeName(name);
    await saveTheme(name);
  };

  if (!ready) return null; // splash yoki bo‘sh ekran

  return (
    <ThemeContext.Provider
      value={{
        theme: themes[themeName],
        themeName,
        setTheme: changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
