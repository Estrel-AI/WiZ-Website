"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function getPreferredTheme() {
  const savedTheme = window.localStorage.getItem("theme");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return savedTheme === "dark" || (!savedTheme && systemTheme);
}

function getThemeFromDom() {
  return document.documentElement.classList.contains("dark");
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const nextIsDark = window.localStorage.getItem("theme") ? getPreferredTheme() : getThemeFromDom();
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark, mounted]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleStorage(event: StorageEvent) {
      if (event.key === "theme") {
        setIsDark(getPreferredTheme());
      }
    }

    function handleSystemThemeChange() {
      if (!window.localStorage.getItem("theme")) {
        setIsDark(mediaQuery.matches);
      }
    }

    window.addEventListener("storage", handleStorage);
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [mounted]);

  return (
    <button
      onClick={() => setIsDark((value) => !value)}
      className="p-2 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm"
      aria-label="Toggle theme"
    >
      {mounted && isDark ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600" />
      )}
    </button>
  );
}
