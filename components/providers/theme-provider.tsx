"use client";

import * as React from "react";

export type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "rpl-theme";

function getClientThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const val = localStorage.getItem(THEME_STORAGE_KEY);
    return val === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

function subscribeToTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("rpl-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("rpl-theme-change", callback);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore(
    subscribeToTheme,
    getClientThemeSnapshot,
    getServerThemeSnapshot
  );

  // Synchronize DOM class and color-scheme with current theme
  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    }
  }, [theme]);

  const setTheme = React.useCallback((nextTheme: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      window.dispatchEvent(new Event("rpl-theme-change"));
    } catch {}
  }, []);

  const toggleTheme = React.useCallback(() => {
    const current = getClientThemeSnapshot();
    const nextTheme = current === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
