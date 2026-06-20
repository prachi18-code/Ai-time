import React, { createContext, useContext, useState } from 'react';
import { translations } from '../services/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(localStorage.getItem('aether_lang') || 'hinglish');

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('aether_lang', lang);
  };

  const t = (key) => {
    if (!translations[key]) {
      return key;
    }
    return translations[key][language] || translations[key]['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
