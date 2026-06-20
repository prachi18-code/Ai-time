import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const MascotSVGs = {
  panda: (color) => (
    <svg viewBox="0 0 100 100" className="w-14 h-14">
      {/* Ears */}
      <circle cx="28" cy="28" r="12" fill="#1e293b" stroke={color} strokeWidth="1.5" />
      <circle cx="72" cy="28" r="12" fill="#1e293b" stroke={color} strokeWidth="1.5" />
      {/* Face */}
      <circle cx="50" cy="55" r="32" fill="#ffffff" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
      {/* Eye patches */}
      <ellipse cx="38" cy="52" rx="9" ry="11" fill="#1e293b" transform="rotate(-12 38 52)" />
      <ellipse cx="62" cy="52" rx="9" ry="11" fill="#1e293b" transform="rotate(12 62 52)" />
      {/* Eyes */}
      <circle cx="38" cy="52" r="3" fill="#ffffff" />
      <circle cx="62" cy="52" r="3" fill="#ffffff" />
      {/* Nose */}
      <polygon points="46,62 54,62 50,66" fill="#1e293b" />
      {/* Cheeks */}
      <circle cx="30" cy="62" r="4" fill="#fb7185" opacity="0.5" />
      <circle cx="70" cy="62" r="4" fill="#fb7185" opacity="0.5" />
    </svg>
  ),
  fox: (color) => (
    <svg viewBox="0 0 100 100" className="w-14 h-14">
      {/* Ears */}
      <polygon points="18,38 30,12 40,34" fill="#ea580c" stroke={color} strokeWidth="1.5" />
      <polygon points="82,38 70,12 60,34" fill="#ea580c" stroke={color} strokeWidth="1.5" />
      <polygon points="22,36 30,20 37,34" fill="#ffedd5" />
      <polygon points="78,36 70,20 63,34" fill="#ffedd5" />
      {/* Face main */}
      <polygon points="18,42 82,42 50,82" fill="#f97316" />
      {/* Cheeks */}
      <path d="M 18 42 Q 34 60 50 82 Q 32 72 18 42" fill="#ffffff" />
      <path d="M 82 42 Q 66 60 50 82 Q 68 72 82 42" fill="#ffffff" />
      {/* Eyes */}
      <circle cx="36" cy="47" r="3.5" fill="#1e293b" />
      <circle cx="64" cy="47" r="3.5" fill="#1e293b" />
      <circle cx="37" cy="46" r="1.2" fill="#ffffff" />
      <circle cx="65" cy="46" r="1.2" fill="#ffffff" />
      {/* Nose */}
      <circle cx="50" cy="80" r="3.2" fill="#1e293b" />
    </svg>
  ),
  owl: (color) => (
    <svg viewBox="0 0 100 100" className="w-14 h-14">
      {/* Tufts */}
      <polygon points="26,28 35,14 44,28" fill="#475569" stroke={color} strokeWidth="1.5" />
      <polygon points="74,28 65,14 56,28" fill="#475569" stroke={color} strokeWidth="1.5" />
      {/* Body */}
      <circle cx="50" cy="54" r="30" fill="#64748b" />
      {/* Eye patches */}
      <circle cx="38" cy="47" r="11" fill="#ffffff" stroke={color} strokeWidth="1" />
      <circle cx="62" cy="47" r="11" fill="#ffffff" stroke={color} strokeWidth="1" />
      {/* Pupil */}
      <circle cx="38" cy="47" r="5" fill="#1e293b" />
      <circle cx="62" cy="47" r="5" fill="#1e293b" />
      <circle cx="39" cy="45" r="1.5" fill="#ffffff" />
      <circle cx="63" cy="45" r="1.5" fill="#ffffff" />
      {/* Beak */}
      <polygon points="46,53 54,53 50,61" fill="#f59e0b" />
    </svg>
  ),
  penguin: (color) => (
    <svg viewBox="0 0 100 100" className="w-14 h-14">
      {/* Body */}
      <ellipse cx="50" cy="54" rx="28" ry="33" fill="#0f172a" />
      {/* Belly */}
      <ellipse cx="50" cy="61" rx="18" ry="23" fill="#ffffff" />
      {/* Eye circles */}
      <circle cx="41" cy="38" r="6" fill="#ffffff" />
      <circle cx="59" cy="38" r="6" fill="#ffffff" />
      {/* Pupils */}
      <circle cx="41" cy="38" r="2.5" fill="#0f172a" />
      <circle cx="59" cy="38" r="2.5" fill="#0f172a" />
      {/* Beak */}
      <polygon points="46,43 54,43 50,49" fill="#f59e0b" />
      {/* Blush */}
      <circle cx="33" cy="45" r="2.5" fill="#fb7185" opacity="0.5" />
      <circle cx="67" cy="45" r="2.5" fill="#fb7185" opacity="0.5" />
    </svg>
  ),
  octopus: (color) => (
    <svg viewBox="0 0 100 100" className="w-14 h-14">
      {/* Head */}
      <ellipse cx="50" cy="46" rx="24" ry="22" fill="#06b6d4" />
      {/* Eye circles */}
      <circle cx="40" cy="42" r="5.5" fill="#ffffff" />
      <circle cx="60" cy="42" r="5.5" fill="#ffffff" />
      <circle cx="40" cy="42" r="2.5" fill="#0f172a" />
      <circle cx="60" cy="42" r="2.5" fill="#0f172a" />
      {/* Mouth */}
      <circle cx="50" cy="50" r="2" fill="#ffffff" />
      {/* Tentacles */}
      <path d="M 33 62 Q 26 76 34 81" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 44 65 Q 43 78 48 83" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 56 65 Q 57 78 52 83" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 67 62 Q 74 76 66 81" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
};

const MascotTips = {
  panda: {
    en: "Plan your session, Seeker! Focus on high-priority targets first.",
    hi: "सत्र की योजना बनाएं, साधक! पहले उच्च प्राथमिकता वाले कार्यों पर ध्यान दें।",
    hinglish: "Quiet zen vibe... Session plan karo, Seeker! High-priority tasks par pehle focus karo. 🐼"
  },
  fox: {
    en: "Phone silent check? Deep study mode active. Let's do this!",
    hi: "क्या फोन साइलेंट है? गहरी एकाग्रता मोड सक्रिय। चलिए शुरू करते हैं!",
    hinglish: "Entering cosmic orbit. Phone silent kiya? Deep study active. 🦊"
  },
  owl: {
    en: "Night owl focus is active. Don't forget water and posture breaks!",
    hi: "रात्रि एकाग्रता सक्रिय है। पानी पीना और ब्रेक लेना न भूलें!",
    hinglish: "Midnight oil burning. regular water breaks lena mat bhoolna. 🦉"
  },
  penguin: {
    en: "Consistency is key. Tap tasks complete to grow your streak!",
    hi: "निरंतरता ही कुंजी है। स्ट्रीक बढ़ाने के लिए कार्य पूरे करें!",
    hinglish: "Sakura garden harmony! Task complete karke streak badhao! 🐧"
  },
  octopus: {
    en: "Flow like water. Take dynamic focus cycles and stay hydrated!",
    hi: "पानी की तरह बहें। काम के दौरान पानी पीते रहें!",
    hinglish: "Ocean flow active! Hydrated raho aur focus intervals split karo. 🐙"
  }
};

const FloatingMascot = () => {
  const { theme, themes } = useTheme();
  const { language } = useLanguage();
  const [mascotMode, setMascotMode] = useState('penguin');
  const [showSpeech, setShowSpeech] = useState(false);
  const [tipText, setTipText] = useState('');

  // Set Mascot animal based on active universe
  useEffect(() => {
    if (theme === 'zen') {
      setMascotMode('panda');
    } else if (theme === 'galaxy') {
      setMascotMode('fox');
    } else if (theme === 'sakura') {
      setMascotMode('penguin');
    } else if (theme === 'ocean') {
      setMascotMode('octopus');
    } else if (theme === 'midnight') {
      setMascotMode('owl');
    }
  }, [theme]);

  useEffect(() => {
    const tips = MascotTips[mascotMode] || MascotTips.penguin;
    setTipText(tips[language] || tips['hinglish']);
  }, [mascotMode, language]);

  const handleMascotClick = () => {
    setShowSpeech(!showSpeech);
    const tips = MascotTips[mascotMode] || MascotTips.penguin;
    setTipText(tips[language] || tips['hinglish']);
  };

  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end">
      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeech && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="mb-3 max-w-[200px] p-3 rounded-2xl bg-slate-900/90 border border-white/10 text-[11px] leading-relaxed text-slate-300 font-sans shadow-xl backdrop-blur-md relative"
            style={{ borderColor: `${accentColor}30` }}
          >
            <p>{tipText}</p>
            {/* Bubble arrow */}
            <div 
              className="absolute bottom-[-6px] right-6 w-3 h-3 rotate-45 border-r border-b bg-slate-900/90 border-white/10" 
              style={{ borderColor: `${accentColor}30` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Mascot Avatar */}
      <motion.div
        onClick={handleMascotClick}
        whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          },
          default: { duration: 0.3 }
        }}
        className="cursor-pointer bg-slate-950/30 rounded-full p-2 border backdrop-blur-md relative group flex items-center justify-center shadow-2xl"
        style={{
          borderColor: `${accentColor}30`,
          boxShadow: `0 8px 30px ${accentColor}10`,
        }}
      >
        {/* Glow halo behind */}
        <div 
          className="absolute inset-0 rounded-full opacity-10 filter blur-md scale-110 pointer-events-none group-hover:opacity-20 transition-opacity" 
          style={{ backgroundColor: accentColor }}
        />
        
        {MascotSVGs[mascotMode](accentColor)}

        {/* Small badge signifying mode */}
        <span 
          className="absolute -top-1 -right-1 text-[8px] bg-slate-900 px-1.5 py-0.5 rounded-full border text-[7px] font-space tracking-wide uppercase font-black"
          style={{ borderColor: `${accentColor}30`, color: accentColor }}
        >
          {mascotMode}
        </span>
      </motion.div>
    </div>
  );
};

export default FloatingMascot;
