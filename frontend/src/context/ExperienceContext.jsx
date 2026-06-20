import React, { createContext, useContext, useState, useEffect } from 'react';

const ExperienceContext = createContext(null);

export const ExperienceProvider = ({ children }) => {
  const [experience, setExperienceState] = useState(() => {
    return localStorage.getItem('aether_experience') || 'student';
  });

  const setExperience = (newExp) => {
    if (newExp === 'student' || newExp === 'professional') {
      setExperienceState(newExp);
      localStorage.setItem('aether_experience', newExp);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('exp-student', 'exp-professional');
    root.classList.add(`exp-${experience}`);
  }, [experience]);

  return (
    <ExperienceContext.Provider value={{ experience, setExperience }}>
      {children}
    </ExperienceContext.Provider>
  );
};

export const useExperience = () => {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }
  return context;
};
