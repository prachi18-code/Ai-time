import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const THEMES = [
  { id: 'galaxy', name: 'Cosmic Galaxy 🌌', accent: '#a855f7' },
  { id: 'zen', name: 'Minimal White Zen 🤍', accent: '#B58263' },
  { id: 'sakura', name: 'Sakura Garden 🌸', accent: '#f472b6' },
  { id: 'ocean', name: 'Ocean World 🌊', accent: '#06b6d4' },
  { id: 'midnight', name: 'Midnight Universe 🌙', accent: '#94a3b8' },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(localStorage.getItem('aether_theme') || 'galaxy');

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('aether_theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    THEMES.forEach((t) => {
      root.classList.remove(`theme-${t.id}`);
    });
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
