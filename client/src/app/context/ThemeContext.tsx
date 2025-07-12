'use client'

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: any) => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const ct = localStorage.getItem("theme");
    if (ct) setDarkMode(ct === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const themeClasses = {
    text: darkMode ? 'text-white' : 'text-black',
    textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600',
    textMuted: darkMode ? 'text-white-500' : 'text-gray-700',
    bg: darkMode ? 'bg-[#0f0f0f]' : 'bg-white',
    cardBg: darkMode ? 'bg-slate-900/60' : 'bg-white/80',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    uploadBg: darkMode ? 'bg-slate-800' : 'bg-white',
    uploadBorder: darkMode ? 'border-slate-600' : 'border-gray-300',
    uploadBgActive: darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100',
    inputBg: darkMode ? 'bg-slate-800' : 'bg-white',
    inputBorder: darkMode ? 'border-slate-600' : 'border-gray-300',
    inputFocus: darkMode ? 'focus:ring-blue-500' : 'focus:ring-purple-500',
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, themeClasses }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
