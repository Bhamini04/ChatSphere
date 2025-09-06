import React from "react";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded border mt-2"
    >
      {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}

export default ThemeToggle;

