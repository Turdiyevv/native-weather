import React, { createContext, useContext, useState } from "react";

interface MenuStateContextType {
  hamburgerMenuOpen: boolean;
  setHamburgerMenuOpen: (open: boolean) => void;
  taskMenuOpen: boolean;
  setTaskMenuOpen: (open: boolean) => void;
}

const MenuStateContext = createContext<MenuStateContextType | undefined>(undefined);

export function MenuStateProvider({ children }: { children: React.ReactNode }) {
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const [taskMenuOpen, setTaskMenuOpen] = useState(false);

  return (
    <MenuStateContext.Provider
      value={{
        hamburgerMenuOpen,
        setHamburgerMenuOpen,
        taskMenuOpen,
        setTaskMenuOpen,
      }}
    >
      {children}
    </MenuStateContext.Provider>
  );
}

export function useMenuState() {
  const context = useContext(MenuStateContext);
  if (!context) {
    throw new Error("useMenuState must be used inside MenuStateProvider");
  }
  return context;
}

