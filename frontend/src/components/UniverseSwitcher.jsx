import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const UniverseSwitcher = ({ mobile }) => {
  const { theme, setTheme, themes } = useTheme();

  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const universes = [
    { id: 'galaxy', name: 'Cosmic Galaxy', emoji: '🌌', desc: 'Galaxy' },
    { id: 'zen', name: 'Minimal Zen', emoji: '🤍', desc: 'Zen' },
    { id: 'sakura', name: 'Sakura Garden', emoji: '🌸', desc: 'Sakura' },
    { id: 'ocean', name: 'Ocean World', emoji: '🌊', desc: 'Ocean' },
    { id: 'midnight', name: 'Midnight Universe', emoji: '🌙', desc: 'Midnight' },
  ];

  if (mobile) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-md">
        <div 
          className="flex justify-around items-center py-2.5 px-3 rounded-full bg-slate-950/80 border backdrop-blur-lg shadow-2xl transition-all duration-300"
          style={{ borderColor: `${accentColor}30`, boxShadow: `0 8px 32px ${accentColor}15` }}
        >
          {universes.map((univ) => {
            const isSelected = theme === univ.id;
            return (
              <button
                key={univ.id}
                onClick={() => setTheme(univ.id)}
                className="flex flex-col items-center justify-center p-1 px-2 rounded-full transition-all duration-300 relative cursor-pointer"
              >
                <motion.span 
                  className="text-lg filter drop-shadow select-none"
                  animate={isSelected ? { scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {univ.emoji}
                </motion.span>
                <span 
                  className={`text-[8px] font-space font-bold mt-0.5 tracking-wider ${isSelected ? 'opacity-100 font-extrabold' : 'opacity-60'}`}
                  style={isSelected ? { color: accentColor } : { color: '#94a3b8' }}
                >
                  {univ.desc}
                </span>
                {isSelected && (
                  <motion.div 
                    layoutId="activeDotMobile"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop Top Navigation Bar
  return (
    <div className="w-full flex justify-center py-3 px-6 z-40 relative">
      <div 
        className="flex items-center gap-2 p-1.5 px-3 rounded-full bg-slate-950/70 border backdrop-blur-md shadow-xl transition-all duration-500"
        style={{ 
          borderColor: `${accentColor}25`, 
          boxShadow: `0 4px 20px ${accentColor}08`
        }}
      >
        <span className="text-[9px] font-space font-bold uppercase tracking-widest text-slate-500 px-3 border-r border-white/10 select-none">
          Universes
        </span>
        <div className="flex items-center gap-1">
          {universes.map((univ) => {
            const isSelected = theme === univ.id;
            return (
              <button
                key={univ.id}
                onClick={() => setTheme(univ.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-space font-bold transition-all duration-300 cursor-pointer relative group`}
                style={isSelected ? { 
                  backgroundColor: `${univ.id === 'zen' ? '#B5826315' : `${accentColor}18`}`,
                  color: univ.id === 'zen' ? '#B58263' : accentColor,
                  border: `1.5px solid ${univ.id === 'zen' ? '#B5826330' : `${accentColor}30`}`
                } : { 
                  color: 'rgba(255,255,255,0.5)',
                  border: '1.5px solid transparent'
                }}
              >
                <span className="group-hover:scale-125 transition-transform duration-300">{univ.emoji}</span>
                <span>{univ.name}</span>
                {isSelected && (
                  <motion.span 
                    layoutId="activeIndicator"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UniverseSwitcher;
