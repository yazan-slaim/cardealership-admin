"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9"></div>; // Placeholder space
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={clsx(
        "relative inline-flex items-center justify-center p-2 rounded-lg transition-colors overflow-hidden",
        "text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200",
        "dark:text-slate-400 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700",
        className
      )}
      aria-label="Toggle Dark Mode"
    >
      {/* Sun Icon (Visible in Light Mode, Hidden in Dark Mode) */}
      <Sun className="w-5 h-5 absolute transition-all transform dark:scale-0 dark:-rotate-90 scale-100 rotate-0" />
      
      {/* Moon Icon (Visible in Dark Mode, Hidden in Light Mode) */}
      <Moon className="w-5 h-5 absolute transition-all transform scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
      
      {/* Transparent placeholder to maintain button sizing */}
      <div className="w-5 h-5 opacity-0"></div>
    </button>
  );
}
