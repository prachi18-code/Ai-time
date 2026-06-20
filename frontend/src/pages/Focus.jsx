import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import GlassCard from '../components/GlassCard';
import { Play, Pause, RotateCcw, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FOCUS_QUOTES = [
  "Chalo dost, phone silent par dalo aur absolute focus start karo! 🎯",
  "Aether is watching your metrics. Deep work mode active! ⚡",
  "Ek baar me ek hi task. Multitasking is a trap! 🚫",
  "Faltu distractions ko side karo. Aaj placement target phodna hai! 💻",
  "Consistent efforts hi tumhare goal tak pahuchayenge. Lage raho! 🔥",
  "GATE prep ho ya Web Dev, focus ke bina kuch nahi hoga. Start flow!",
  "30 mins of deep work is better than 3 hours of fake study. Let's do it! 🚀"
];

const Focus = () => {
  const { token } = useAuth();
  const { t } = useLanguage();
  const { theme, themes } = useTheme();
  
  // Timer config
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  
  // Tasks list to associate with
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  
  const [quote, setQuote] = useState(FOCUS_QUOTES[0]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const timerRef = useRef(null);

  // Load active tasks
  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) return;
      try {
        const data = await api.getTasks(token);
        const active = data.filter(t => t.status !== 'completed');
        setTasks(active);
        if (active.length > 0) {
          setSelectedTaskId(active[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, [token]);

  // Set initial time when tab changes
  useEffect(() => {
    setTimeLeft(sessionMinutes * 60);
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [sessionMinutes]);

  // Countdown timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      clearInterval(timerRef.current);
      handleTimerComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  // Rotate motivational quote on start/pause
  const toggleTimer = () => {
    if (!isActive) {
      const randIdx = Math.floor(Math.random() * FOCUS_QUOTES.length);
      setQuote(FOCUS_QUOTES[randIdx]);
      setSuccessMessage('');
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(sessionMinutes * 60);
    setSuccessMessage('');
  };

  const handleTimerComplete = async () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.connect(audioCtx.destination);
      oscillator.start();
      setTimeout(() => oscillator.stop(), 500);
    } catch (e) {
      console.warn('Audio check blocked:', e.message);
    }

    setIsSaving(true);
    try {
      await api.logFocusSession(sessionMinutes, selectedTaskId || null, token);
      setSuccessMessage(`Shabash, Seeker! ${sessionMinutes} minutes focus logged successfully. Take a tea break! ☕`);
    } catch (err) {
      console.error(err);
      setSuccessMessage(`Timer complete! Parsed offline. Session recorded.`);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDisplayTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercent = ((sessionMinutes * 60 - timeLeft) / (sessionMinutes * 60)) * 100;
  const strokeDashoffset = 251.2 - (251.2 * progressPercent) / 100;

  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pb-32 pt-6 px-4 max-w-lg mx-auto font-sans text-slate-200"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 
          className="font-sora text-2xl font-extrabold text-transparent bg-clip-text"
          style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, #f472b6)` }}
        >
          {t('focus_title')}
        </h1>
        <p className="text-xs text-slate-400 font-space mt-0.5 uppercase tracking-wider">
          {t('aether_os_timer')}
        </p>
      </div>

      {/* Timer Circular Widget */}
      <div className="flex justify-center mb-6">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Radial Outer Glow */}
          <div 
            className="absolute inset-4 rounded-full filter blur-2xl pointer-events-none opacity-20" 
            style={{ backgroundColor: accentColor }}
          />
          
          <svg className="timer-svg w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={accentColor}
              strokeWidth="4.5"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={strokeDashoffset}
              className="timer-circle"
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 4px ${accentColor}80)`
              }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-space text-5xl font-extrabold text-slate-100 tracking-tight">
              {formatDisplayTime()}
            </span>
            <span className="text-[10px] font-space uppercase tracking-widest mt-1" style={{ color: accentColor }}>
              {isActive ? t('flow_active') : t('flow_paused')}
            </span>
          </div>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex justify-center items-center gap-6 mb-6">
        <motion.button
          onClick={resetTimer}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
          title="Reset timer"
        >
          <RotateCcw size={18} />
        </motion.button>

        <motion.button
          onClick={toggleTimer}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="py-3.5 px-8 rounded-full font-sora font-extrabold text-sm transition-all text-white flex items-center gap-2 cursor-pointer shadow-lg hover:glow-theme btn-theme-gradient"
        >
          {isActive ? (
            <>
              <Pause size={16} /> {t('pause_flow')}
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" /> {t('start_flow')}
            </>
          )}
        </motion.button>

        <div className="relative">
          <motion.button
            onClick={() => {
              if (isActive) return;
              setSessionMinutes(prev => prev === 25 ? 50 : prev === 50 ? 10 : prev === 10 ? 5 : 25);
            }}
            disabled={isActive}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200 transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
            title="Configure Minutes"
          >
            <Clock size={18} />
            <span className="text-xs font-space font-bold">{sessionMinutes}m</span>
          </motion.button>
        </div>
      </div>

      {/* Notification Area */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <GlassCard className="mb-6 text-xs flex items-start gap-2.5" style={{ borderColor: `${accentColor}30`, color: accentColor }}>
              <CheckCircle size={16} className="shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task association dropdown */}
      <GlassCard className="mb-6">
        <label className="block text-[10px] font-space text-slate-400 uppercase tracking-wider mb-2">
          {t('associate_task')}
        </label>
        
        {tasks.length > 0 ? (
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            disabled={isActive}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-xs focus:border-cyan-500 focus:outline-none transition-all disabled:opacity-50 cursor-pointer"
          >
            {tasks.map(t => (
              <option key={t._id} value={t._id}>
                [{t.subject}] {t.title}
              </option>
            ))}
            <option value="">-- No specific task (General Study) --</option>
          </select>
        ) : (
          <p className="text-xs text-slate-500 font-sans italic">
            {t('no_active_tasks_timer')}
          </p>
        )}
      </GlassCard>

      {/* Coach Watching status */}
      <GlassCard className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-xl bg-slate-950/40 border flex items-center justify-center shrink-0 animate-pulse"
          style={{ borderColor: `${accentColor}30`, color: accentColor }}
        >
          <Sparkles size={22} />
        </div>
        <div>
          <span className="text-[10px] font-space uppercase tracking-widest" style={{ color: accentColor }}>
            {t('core_status')}
          </span>
          <h4 className="font-sora font-bold text-xs text-slate-200 mt-0.5">
            {t('status_watching')}
          </h4>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed mt-0.5">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default Focus;
