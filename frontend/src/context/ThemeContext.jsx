import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const THEMES = [
  {
    id: 'galaxy',
    name: 'Cosmic Galaxy',
    emoji: '🌌',
    accent: '#a855f7',
    description: 'Deep space vibes — planets, nebulae & shooting stars',
  },
  {
    id: 'zen',
    name: 'Minimal Zen',
    emoji: '🤍',
    accent: '#B58263',
    description: 'Apple + Pinterest + Japanese cafe — pure clarity',
  },
  {
    id: 'sakura',
    name: 'Sakura Garden',
    emoji: '🌸',
    accent: '#f472b6',
    description: 'Dreamy pink petals & soft anime aesthetic',
  },
  {
    id: 'ocean',
    name: 'Ocean World',
    emoji: '🌊',
    accent: '#06b6d4',
    description: 'Deep sea tranquility — bioluminescent & fluid',
  },
  {
    id: 'midnight',
    name: 'Midnight Universe',
    emoji: '🌙',
    accent: '#94a3b8',
    description: 'Luxury monochrome — editorial dark minimalism',
  },
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
