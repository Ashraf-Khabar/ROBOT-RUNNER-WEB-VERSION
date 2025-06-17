import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "green";

const THEME_STORAGE_KEY = "robot-framework-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from cookie or localStorage
    const savedTheme =
      getCookie(THEME_STORAGE_KEY) || localStorage.getItem(THEME_STORAGE_KEY);
    return (savedTheme as Theme) || "light";
  });

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove("light", "dark", "green");
    root.classList.add(theme);

    // Save to both cookie and localStorage for persistence
    setCookie(THEME_STORAGE_KEY, theme, 365);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => {
      switch (current) {
        case "light":
          return "dark";
        case "dark":
          return "green";
        case "green":
          return "light";
        default:
          return "light";
      }
    });
  };

  const setSpecificTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme,
    isLight: theme === "light",
    isDark: theme === "dark",
    isGreen: theme === "green",
  };
}

// Enhanced cookie utility functions with better error handling
function setCookie(name: string, value: string, days: number) {
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  } catch (error) {
    console.error("Error setting cookie:", error);
  }
}

function getCookie(name: string): string | null {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting cookie:", error);
    return null;
  }
}

// Export cookie functions for use in other components
export { setCookie, getCookie };
