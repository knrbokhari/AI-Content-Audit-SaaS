"use client";

import { useState, useEffect } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState(
    typeof window !== "undefined" && localStorage.theme
      ? localStorage.theme
      : process.env.themeMode
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme: string) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
};
