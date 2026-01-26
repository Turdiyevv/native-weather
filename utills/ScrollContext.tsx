// context/ScrollContext.tsx
import { createContext, useContext } from "react";

interface ScrollContextType {
  handleScroll: (event: any) => void;
}

export const ScrollContext = createContext<ScrollContextType | null>(null);

export const useScrollHandler = () => {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    throw new Error("useScrollHandler must be used inside ScrollContext.Provider");
  }
  return ctx;
};
