import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import GlassCard from '../components/GlassCard';
import { Play, Pause, RotateCcw, CheckCircle, Sparkles, Coffee, Zap, Wind, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';

/* ─── Session Mode Config ─────────────────────────────────────────────────── */
const SESSION_MODES = [
  { id: 'pomodoro', label: 'Pomodoro', emoji: '🍅', mins: 25, desc: '25m deep work + 5m break', color: '#f472b6' },
  { id: 'deep',     label: 'Deep Work', emoji: '⚡', mins: 50, desc: '50m flow state session',   color: '#a855f7' },
  { id: 'short',    label: 'Quick Win', emoji: '☕', mins: 15, desc: '15m focused sprint',        color: '#f59e0b' },
  { id: 'ultra',    label: 'Ultra Flow', emoji: '🌊', mins: 90, desc: '90m marathon session',     color: '#06b6d4' },
];

/* ─── Universe Mascots ──────────────────────────────────────────────────────── */
const MASCOTS = {
  galaxy:   { emoji: '🦊', name: 'Nova',  tagline: 'Cosmic focus energy engaged!' },
  zen:      { emoji: '🐼', name: 'Sato',  tagline: 'Breathe. Focus. Be present.' },
  sakura:   { emoji: '🦋', name: 'Hana',  tagline: 'Bloom with every minute.' },
  ocean:    { emoji: '🐙', name: 'Aqua',  tagline: 'Dive deep into your work.' },
  midnight: { emoji: '🦉', name: 'Orion', tagline: 'The night is yours, Seeker.' },
};

/* ─── Focus Quotes ─────────────────────────────────────────────────────────── */
const QUOTES = {
  active: [
    "Phone silent. Screen locked. Full power mode. ⚡",
    "One task. Complete focus. No exceptions. 🎯",
    "30 mins of deep work > 3 hours of fake study. 🚀",
    "Placement dreams don't work unless you do. 💻",
    "You're in the zone. Don't break it. 🔥",
  ],
  paused: [
    "Take a breath. You're doing great. 🌿",
    "Rest is part of the process. 🌙",
    "5-minute break? Drink water first. 💧",
    "Reset. Recharge. Return. ⚡",
  ],
  completed: [
    "Shabash! Session complete. Tea break deserved! ☕",
    "Another session locked in. You're unstoppable! 🏆",
    "Boom! Focus block logged. Keep the streak alive! 🔥",
    "That's what I'm talking about! +XP earned! ✨",
  ],
};

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ─── Breathing Ring Component ──────────────────────────────────────────────── */
const BreathingRing = ({ isActive, accentColor, progress, timeLeft, sessionMins }) => {
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (progress / 100) * circumference;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="relative w-72 h-72 flex items-center justify-center mx-auto">
      {/* Outer ambient glow */}
      <motion.div
        animate={isActive ? {
          scale: [1, 1.08, 1],
          opacity: [0.12, 0.22, 0.12],
        } : { scale: 1, opacity: 0.08 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      {/* Secondary breathing ring */}
      <motion.div
        animate={isActive ? {
          scale: [0.85, 0.95, 0.85],
          opacity: [0.06, 0.15, 0.06],
        } : { scale: 0.9, opacity: 0.04 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute inset-6 rounded-full border pointer-events-none"
        style={{ borderColor: accentColor }}
      />

      {/* SVG Progress Ring */}
      <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Track */}
        <circle cx="50" cy="50" r="44" fill="none"
          stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
        {/* Glow ring (slightly wider, blurred effect via filter) */}
        <circle cx="50" cy="50" r="44" fill="none"
          stroke={accentColor} strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${accentColor}90)`, opacity: 0.25 }}
        />
        {/* Main progress ring */}
        <motion.circle
          cx="50" cy="50" r="44" fill="none"
          stroke={accentColor} strokeWidth="3.5"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'linear' }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${accentColor})` }}
        />
      </svg>

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-1 z-10">
        <motion.span
          key={display}
          className="font-space text-5xl font-black text-slate-100 tabular-nums tracking-tight"
          style={{ textShadow: `0 0 20px ${accentColor}40` }}
        >
          {display}
        </motion.span>
        <motion.span
          animate={isActive ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.5 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] font-space uppercase tracking-widest"
          style={{ color: accentColor }}
        >
          {isActive ? '● FLOW ACTIVE' : progress > 0 ? '⏸ PAUSED' : '○ READY'}
        </motion.span>
        <span className="text-[9px] font-space text-slate-500 mt-1">
          {Math.round(progress)}% complete
        </span>
      </div>

      {/* Orbiting dot when active */}
      {isActive && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
          />
        </motion.div>
      )}
    </div>
  );
};

/* ─── Session Complete Overlay ────────────────────────────────────────────── */
const CompletionOverlay = ({ message, onClose, accentColor, mascot }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.8, y: 40 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.8, y: 40 }}
      transition={{ type: 'spring', damping: 18 }}
      className="text-center px-8 py-10 max-w-xs mx-4"
      onClick={e => e.stopPropagation()}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.5, repeat: 2 }}
        className="text-7xl mb-4"
      >
        {mascot.emoji}
      </motion.div>

      {/* Floating particles */}
      {['🎉', '⭐', '✨', '🔥', '🏆'].map((emoji, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: -80 + Math.random() * 40, x: (Math.random() - 0.5) * 80 }}
          transition={{ duration: 1.5, delay: i * 0.15, ease: 'easeOut' }}
          className="absolute text-2xl pointer-events-none"
          style={{ left: `${30 + i * 10}%`, top: '30%' }}
        >
          {emoji}
        </motion.span>
      ))}

      <h2 className="font-sora text-2xl font-black text-white mb-2">Session Complete!</h2>
      <p className="text-sm text-slate-300 font-sans leading-relaxed mb-6">"{message}"</p>
      <button
        onClick={onClose}
        className="px-8 py-3 rounded-2xl font-sora font-bold text-sm text-white cursor-pointer btn-theme-gradient"
      >
        Keep Going 🚀
      </button>
    </motion.div>
  </motion.div>
);

/* ─── Main Focus Component ─────────────────────────────────────────────────── */
const Focus = () => {
  const { token } = useAuth();
  const { t } = useLanguage();
  const { theme, themes } = useTheme();

  const [selectedMode, setSelectedMode] = useState(SESSION_MODES[0]);
  const [timeLeft, setTimeLeft] = useState(SESSION_MODES[0].mins * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsDone, setSessionsDone] = useState(0);
  const [totalMinutesToday, setTotalMinutesToday] = useState(
    () => parseInt(localStorage.getItem('aether_focus_today') || '0')
  );
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [quote, setQuote] = useState(randomFrom(QUOTES.paused));
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionMsg, setCompletionMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const timerRef = useRef(null);
  const audioCtxRef = useRef(null);

  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;
  const mascot = MASCOTS[theme] || MASCOTS.galaxy;

  const progress = ((selectedMode.mins * 60 - timeLeft) / (selectedMode.mins * 60)) * 100;

  /* ─── Load tasks ──────────────────────────────────── */
  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) return;
      try {
        const data = await api.getTasks(token);
        const active = data.filter(t => t.status !== 'completed');
        setTasks(active);
        if (active.length > 0) setSelectedTaskId(active[0]._id);
      } catch (err) { console.error(err); }
    };
    fetchTasks();
  }, [token]);

  /* ─── Mode switch resets timer ───────────────────── */
  useEffect(() => {
    setTimeLeft(selectedMode.mins * 60);
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [selectedMode]);

  /* ─── Countdown ──────────────────────────────────── */
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      clearInterval(timerRef.current);
      handleComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  /* ─── Complete handler ───────────────────────────── */
  const handleComplete = useCallback(async () => {
    const msg = randomFrom(QUOTES.completed);
    setCompletionMsg(msg);
    setShowCompletion(true);

    // Play completion chime
    if (!isMuted) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [523, 659, 784].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.4);
          osc.start(ctx.currentTime + i * 0.2);
          osc.stop(ctx.currentTime + i * 0.2 + 0.4);
        });
      } catch (e) { /* audio blocked */ }
    }

    // Log session
    const newTotal = totalMinutesToday + selectedMode.mins;
    setTotalMinutesToday(newTotal);
    localStorage.setItem('aether_focus_today', newTotal);
    setSessionsDone(prev => prev + 1);

    // Award XP
    const xpGain = selectedMode.mins * 2;
    const currentXP = parseInt(localStorage.getItem('aether_xp') || '0');
    localStorage.setItem('aether_xp', currentXP + xpGain);

    setIsSaving(true);
    try {
      await api.logFocusSession(selectedMode.mins, selectedTaskId || null, token);
    } catch (err) { /* offline mode */ }
    finally { setIsSaving(false); }
  }, [isMuted, selectedMode, selectedTaskId, token, totalMinutesToday]);

  /* ─── Toggle ─────────────────────────────────────── */
  const toggle = () => {
    if (!isActive) {
      setQuote(randomFrom(QUOTES.active));
    } else {
      setQuote(randomFrom(QUOTES.paused));
    }
    setIsActive(prev => !prev);
  };

  const reset = () => {
    setIsActive(false);
    setTimeLeft(selectedMode.mins * 60);
    setQuote(randomFrom(QUOTES.paused));
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-32 pt-4 px-2 max-w-lg mx-auto"
    >
      {/* ── Completion Overlay ── */}
      <AnimatePresence>
        {showCompletion && (
          <CompletionOverlay
            message={completionMsg}
            onClose={() => { setShowCompletion(false); setTimeLeft(selectedMode.mins * 60); }}
            accentColor={accentColor}
            mascot={mascot}
          />
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="text-center mb-6 px-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[9px] font-space tracking-widest uppercase px-2.5 py-0.5 rounded-full border bg-white/5"
            style={{ borderColor: `${accentColor}30`, color: accentColor }}>
            🎧 Focus Room
          </span>
          {totalMinutesToday > 0 && (
            <span className="text-[9px] font-space px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 font-bold">
              {totalMinutesToday}m today ↑
            </span>
          )}
        </div>
        <h1 className="font-sora text-3xl font-extrabold text-transparent bg-clip-text"
          style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, #f472b6)` }}>
          {t('focus_title')}
        </h1>
      </div>

      {/* ── Session Mode Selector ── */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {SESSION_MODES.map(mode => (
          <motion.button
            key={mode.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { if (!isActive) setSelectedMode(mode); }}
            disabled={isActive}
            className={`flex flex-col items-center p-3 rounded-2xl border text-center cursor-pointer transition-all disabled:opacity-50 ${
              selectedMode.id === mode.id
                ? 'border-white/25'
                : 'border-white/5 hover:border-white/12'
            }`}
            style={selectedMode.id === mode.id
              ? { backgroundColor: `${mode.color}15`, borderColor: `${mode.color}40` }
              : {}}
          >
            <span className="text-xl mb-1">{mode.emoji}</span>
            <span className="text-[9px] font-space font-black uppercase" style={{ color: selectedMode.id === mode.id ? mode.color : '#94a3b8' }}>
              {mode.label}
            </span>
            <span className="text-[7px] font-space text-slate-600 mt-0.5">{mode.mins}m</span>
          </motion.button>
        ))}
      </div>

      {/* ── Timer Ring ── */}
      <BreathingRing
        isActive={isActive}
        accentColor={accentColor}
        progress={progress}
        timeLeft={timeLeft}
        sessionMins={selectedMode.mins}
      />

      {/* ── Controls ── */}
      <div className="flex justify-center items-center gap-5 my-7">
        {/* Mute */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMuted(p => !p)}
          className="p-3 rounded-full border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer bg-white/3"
        >
          {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </motion.button>

        {/* Reset */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={reset}
          className="p-3 rounded-full border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer bg-white/3"
        >
          <RotateCcw size={18} />
        </motion.button>

        {/* Play / Pause — main CTA */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={toggle}
          className="py-4 px-10 rounded-full font-sora font-black text-sm text-white flex items-center gap-2.5 cursor-pointer shadow-xl btn-theme-gradient"
          style={{ boxShadow: `0 8px 30px ${accentColor}40` }}
        >
          <AnimatePresence mode="wait">
            {isActive ? (
              <motion.span key="pause" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Pause size={18} /> Pause Flow
              </motion.span>
            ) : (
              <motion.span key="play" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Play size={18} fill="currentColor" /> Start Flow
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Sessions done */}
        <div className="flex flex-col items-center p-2.5 rounded-full border border-white/10 bg-white/3 cursor-default">
          <span className="font-sora text-sm font-black text-slate-100">{sessionsDone}</span>
          <span className="text-[7px] font-space text-slate-500 uppercase">done</span>
        </div>
      </div>

      {/* ── Task Association ── */}
      <GlassCard className="mb-4">
        <label className="block text-[9px] font-space text-slate-400 uppercase tracking-widest mb-2">
          📌 Focus Target
        </label>
        {tasks.length > 0 ? (
          <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-none">
            <button
              onClick={() => setSelectedTaskId('')}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs cursor-pointer transition-all ${
                !selectedTaskId ? 'border-white/20 bg-white/5 text-slate-200' : 'border-white/5 text-slate-400 hover:border-white/10'
              }`}
            >
              <Wind size={12} /> General Study (No specific task)
            </button>
            {tasks.map(task => (
              <button
                key={task._id}
                onClick={() => !isActive && setSelectedTaskId(task._id)}
                disabled={isActive}
                className={`w-full flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs cursor-pointer transition-all disabled:opacity-40 ${
                  selectedTaskId === task._id
                    ? 'border-white/20 bg-white/5 text-slate-200'
                    : 'border-white/5 text-slate-400 hover:border-white/10'
                }`}
              >
                <span className="shrink-0 w-3 h-3 rounded-full border border-current" style={selectedTaskId === task._id ? { backgroundColor: accentColor, borderColor: accentColor } : {}} />
                <span className="truncate">[{task.subject}] {task.title}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No active tasks — add some in Smart Planner!</p>
        )}
      </GlassCard>

      {/* ── Mascot Quote Card ── */}
      <GlassCard className="flex items-start gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: accentColor }} />

        <motion.div
          animate={isActive ? { y: [0, -4, 0] } : { y: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 text-2xl"
          style={{ borderColor: `${accentColor}25`, backgroundColor: `${accentColor}08` }}
        >
          {mascot.emoji}
        </motion.div>

        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[9px] font-space font-black uppercase tracking-widest" style={{ color: accentColor }}>
              {mascot.name}
            </span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={quote}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-xs text-slate-300 font-sans leading-relaxed italic"
            >
              &ldquo;{quote}&rdquo;
            </motion.p>
          </AnimatePresence>
          <p className="text-[9px] font-space text-slate-600 mt-1">{mascot.tagline}</p>
        </div>
      </GlassCard>

      {/* ── Today's Stats ── */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: 'Today', value: `${totalMinutesToday}m`, icon: '⏱️', color: accentColor },
          { label: 'Sessions', value: sessionsDone, icon: '🎯', color: '#22d3ee' },
          { label: 'XP Earned', value: `+${sessionsDone * selectedMode.mins * 2}`, icon: '⚡', color: '#f59e0b' },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-3 text-center hover:scale-[1.02] transition-transform">
            <span className="text-lg">{stat.icon}</span>
            <p className="font-sora font-black text-base mt-1" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[8px] font-space text-slate-500 uppercase">{stat.label}</p>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
};

export default Focus;
