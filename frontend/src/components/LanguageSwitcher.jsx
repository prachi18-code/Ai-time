import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const { theme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const langs = [
    { id: 'en', name: 'English 🇺🇸' },
    { id: 'hi', name: 'Hindi 🇮🇳' },
    { id: 'hinglish', name: 'Hinglish 💬' },
  ];

  const activeLang = langs.find((l) => l.id === language) || langs[0];
  const activeTheme = themes.find((t) => t.id === theme) || themes[0];

  return (
    <div className="relative">
      {/* Selector Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 p-2.5 px-4 rounded-full border backdrop-blur-md cursor-pointer select-none text-xs font-space font-medium tracking-wide shadow-lg transition-all"
        style={{
          backgroundColor: 'var(--theme-card, rgba(18,12,35,0.45))',
          borderColor: `${activeTheme.accent}30`,
          color: 'var(--theme-text-muted, #94a3b8)',
          boxShadow: `0 0 10px ${activeTheme.accent}15`,
        }}
      >
        <Globe size={14} style={{ color: activeTheme.accent }} />
        <span>{activeLang.name.split(' ')[0]}</span>
      </motion.button>


      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 z-20 w-40 p-2 rounded-2xl backdrop-blur-xl shadow-2xl flex flex-col gap-1 border"
              style={{
                backgroundColor: 'var(--theme-card, rgba(14,10,27,0.9))',
                borderColor: 'var(--theme-border, rgba(255,255,255,0.1))',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              }}
            >

              <div className="px-3 py-1.5 text-[9px] font-space text-slate-500 uppercase tracking-widest border-b border-white/5 mb-1">
                Select Lang
              </div>
              {langs.map((l) => {
                const isSelected = l.id === language;
                return (
                  <button
                    key={l.id}
                    onClick={() => {
                      setLanguage(l.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-sans transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-white/10 text-white font-semibold' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <span>{l.name}</span>
                    {isSelected && <Check size={12} style={{ color: activeTheme.accent }} />}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
