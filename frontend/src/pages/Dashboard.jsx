import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { spotify } from '../services/spotify';
import GlassCard from '../components/GlassCard';
import {
  Sparkles, Play, Pause, Award, Zap, Calendar, Clock, Send, Volume2,
  CheckCircle2, ChevronRight, Music, Link2, RotateCcw, Flame, Star,
  TrendingUp, Brain, Target, Coffee, Moon, Sunrise, BookOpen, Headphones,
  Wind, Leaf, Heart, Trophy, ChevronUp, ChevronDown, Activity
} from 'lucide-react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

/* ─── Static Data ──────────────────────────────────────────────────────────── */

const INITIAL_HABITS = [
  { id: 1, text: 'Drink 3L Water 💧', done: false, xp: 10 },
  { id: 2, text: 'Solve 1 DSA Problem 💻', done: false, xp: 25 },
  { id: 3, text: 'Deep Breathing 🧠', done: false, xp: 15 },
  { id: 4, text: 'Read 5 Pages 📚', done: false, xp: 20 },
  { id: 5, text: 'No phone first 30min ✊', done: false, xp: 30 },
];

const MISSIONS = [
  { id: 'm1', title: 'Complete 2 Pomodoros', type: 'focus', xp: 50, icon: '🍅', done: false },
  { id: 'm2', title: 'Study 1 new topic', type: 'study', xp: 75, icon: '📖', done: false },
  { id: 'm3', title: 'Review yesterday notes', type: 'review', xp: 40, icon: '🗒️', done: false },
];

const AI_INSIGHTS = [
  "Your focus peaks between 9-11 AM — schedule your hardest topics there! 🧠",
  "You've been 23% more productive on days you started with habits. Keep that streak! 🔥",
  "Based on your pattern, a 5-min break now will boost the next 45 min by 30%. Take it! 🌿",
  "You're on a 3-day streak! Consistency beats intensity — you're building something real. ⚡",
  "Try the Feynman Technique today: explain one concept out loud. Your brain will thank you! 💡",
  "Late night study sessions? Your recall drops 40% after 11PM. Sleep is a superpower! 🌙",
];

const FOR_YOU_CARDS = [
  { icon: '🎯', title: 'Start a Focus Sprint', desc: '25min deep work → 5min reward', action: 'focus' },
  { icon: '🧩', title: 'Learn Something New', desc: 'Your coach curated 3 new topics', action: 'coach' },
  { icon: '📊', title: 'Review Your Progress', desc: 'This week was your best yet!', action: 'analytics' },
];

const XP_LEVELS = [
  { level: 1, title: 'Seedling', min: 0, max: 100, emoji: '🌱' },
  { level: 2, title: 'Explorer', min: 100, max: 300, emoji: '🧭' },
  { level: 3, title: 'Scholar', min: 300, max: 600, emoji: '📚' },
  { level: 4, title: 'Achiever', min: 600, max: 1000, emoji: '🏆' },
  { level: 5, title: 'Legend', min: 1000, max: 2000, emoji: '⚡' },
  { level: 6, title: 'Cosmic', min: 2000, max: 5000, emoji: '🌌' },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const getCurrentXPLevel = (xp) => {
  return XP_LEVELS.find(l => xp >= l.min && xp < l.max) || XP_LEVELS[XP_LEVELS.length - 1];
};

const getTimeOfDay = () => {
  const h = new Date().getHours();
  if (h < 6) return { label: 'Late Night 🌙', emoji: '🌙', sub: 'Rest, seeker.' };
  if (h < 12) return { label: 'Morning 🌅', emoji: '☀️', sub: 'Prime study time!' };
  if (h < 17) return { label: 'Afternoon ⚡', emoji: '⚡', sub: 'Keep the momentum!' };
  if (h < 21) return { label: 'Evening 🌆', emoji: '🌆', sub: 'Wrap up your day.' };
  return { label: 'Night Owl 🦉', emoji: '🌙', sub: 'Don\'t burn out!' };
};

/* ─── Sub-Widgets ─────────────────────────────────────────────────────────── */

// ☀️ Daily Energy Widget
const DailyEnergyWidget = ({ accentColor }) => {
  const [energy, setEnergy] = useState(() => localStorage.getItem('aether_energy') || 'optimal');
  const [showPulse, setShowPulse] = useState(false);

  const energyModes = {
    hyperfocus: { label: 'HYPERFOCUS', emoji: '⚡', color: '#a855f7', ring: '#c084fc', tip: 'MAX power! Lock in now — this is your peak state.', intensity: 1.0 },
    optimal: { label: 'OPTIMAL', emoji: '🔋', color: '#22d3ee', ring: '#38bdf8', tip: 'Balanced flow. Perfect for steady deep work.', intensity: 0.75 },
    chillin: { label: 'CHILLIN', emoji: '🍃', color: '#34d399', ring: '#6ee7b7', tip: 'Relaxed mode. Read, review, or do light tasks.', intensity: 0.45 },
    exhausted: { label: 'LOW BATT', emoji: '🪫', color: '#fb923c', ring: '#fca5a5', tip: 'Rest first. Even 10 mins recharges you. 💤', intensity: 0.2 },
  };

  const cfg = energyModes[energy];

  const handleChange = (type) => {
    setEnergy(type);
    localStorage.setItem('aether_energy', type);
    setShowPulse(true);
    setTimeout(() => setShowPulse(false), 800);
  };

  return (
    <GlassCard className="relative overflow-hidden flex flex-col items-center p-5 text-center">
      <span className="sticker-badge sticker-cyan absolute top-3 right-3">VIBE CHECK</span>
      <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest mb-1">☀️ Daily Energy</p>

      {/* Animated blob */}
      <div className="relative my-3 w-28 h-28 flex items-center justify-center">
        <motion.div
          animate={{ scale: showPulse ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{ backgroundColor: cfg.color }}
        />
        <svg className="w-full h-full drop-shadow-lg" viewBox="0 0 100 100" fill="none">
          <defs>
            <radialGradient id="egBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={cfg.ring} stopOpacity="0.8" />
              <stop offset="100%" stopColor={cfg.color} stopOpacity="0.4" />
            </radialGradient>
          </defs>
          <motion.circle
            cx="50" cy="50"
            animate={{ r: [38, 44, 38] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            fill="url(#egBg)"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl">{cfg.emoji}</span>
          <span className="text-[8px] font-space font-black text-white mt-0.5">{cfg.label}</span>
        </div>
      </div>

      {/* Selector tabs */}
      <div className="grid grid-cols-4 gap-1 w-full bg-black/20 p-1 rounded-2xl mb-3">
        {Object.entries(energyModes).map(([key, val]) => (
          <button
            key={key}
            onClick={() => handleChange(key)}
            className={`py-1.5 rounded-xl text-[8px] font-space font-black uppercase transition-all cursor-pointer ${
              energy === key ? 'text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            style={energy === key ? { backgroundColor: val.color } : {}}
          >
            {val.emoji}
          </button>
        ))}
      </div>

      <p className="text-[10px] text-slate-400 font-sans leading-relaxed italic">"{cfg.tip}"</p>
    </GlassCard>
  );
};

// 🎯 Today's Mission Board
const MissionBoardWidget = ({ setActiveTab, accentColor }) => {
  const [missions, setMissions] = useState(() => {
    const saved = localStorage.getItem('aether_missions');
    return saved ? JSON.parse(saved) : MISSIONS;
  });
  const [totalXP, setTotalXP] = useState(() => parseInt(localStorage.getItem('aether_xp') || '0'));
  const [justEarned, setJustEarned] = useState(null);

  const toggleMission = (id) => {
    setMissions(prev => {
      const updated = prev.map(m => {
        if (m.id === id && !m.done) {
          setJustEarned(m.xp);
          setTimeout(() => setJustEarned(null), 1500);
          const newXP = totalXP + m.xp;
          setTotalXP(newXP);
          localStorage.setItem('aether_xp', newXP);
          return { ...m, done: true };
        }
        return m;
      });
      localStorage.setItem('aether_missions', JSON.stringify(updated));
      return updated;
    });
  };

  const completedCount = missions.filter(m => m.done).length;

  return (
    <GlassCard className="relative">
      <span className="sticker-badge sticker-gold absolute top-3 right-3">MISSIONS</span>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest">Aether Quest Board</p>
          <h2 className="font-sora font-extrabold text-sm text-slate-100 flex items-center gap-2 mt-0.5">
            🎯 Today's Missions
          </h2>
        </div>
        <div className="text-right mr-20">
          <p className="text-[8px] font-space text-slate-500 uppercase">Completed</p>
          <p className="font-sora font-black text-lg" style={{ color: accentColor }}>{completedCount}/{missions.length}</p>
        </div>
      </div>

      <div className="space-y-2">
        {missions.map((mission, i) => (
          <motion.button
            key={mission.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => toggleMission(mission.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              mission.done
                ? 'opacity-60 bg-emerald-950/15 border-emerald-500/20'
                : 'bg-white/2 border-white/5 hover:border-white/15 hover:bg-white/4'
            }`}
          >
            <span className="text-xl shrink-0">{mission.icon}</span>
            <div className="flex-1">
              <p className={`text-xs font-sora font-bold ${mission.done ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                {mission.title}
              </p>
              <p className="text-[9px] font-space text-slate-500 mt-0.5 uppercase">{mission.type} mission</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[9px] font-space font-black px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400">
                +{mission.xp} XP
              </span>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                mission.done ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-white/20'
              }`}>
                {mission.done && <CheckCircle2 size={12} />}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* XP popup */}
      <AnimatePresence>
        {justEarned && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-sora font-black text-yellow-400 text-sm pointer-events-none z-50"
          >
            +{justEarned} XP! ✨
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setActiveTab('planner')}
        className="mt-4 w-full py-2.5 rounded-2xl text-[10px] font-space font-bold uppercase tracking-widest border border-white/5 hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all text-center cursor-pointer"
      >
        View All Quests →
      </button>
    </GlassCard>
  );
};

// 🧠 AI Insights Widget
const AIInsightsWidget = ({ theme, accentColor, coachingTip }) => {
  const [insightIdx, setInsightIdx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const mascots = {
    galaxy: { emoji: '🦊', name: 'Nova' },
    zen: { emoji: '🐼', name: 'Sato' },
    sakura: { emoji: '🦋', name: 'Hana' },
    ocean: { emoji: '🐙', name: 'Aqua' },
    midnight: { emoji: '🦉', name: 'Orion' },
  };

  const mascot = mascots[theme] || mascots.galaxy;
  const insights = [coachingTip, ...AI_INSIGHTS];

  const nextInsight = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setInsightIdx(prev => (prev + 1) % insights.length);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <GlassCard className="relative overflow-hidden group">
      <span className="sticker-badge sticker-purple absolute top-3 right-3">AI COACH</span>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ backgroundColor: accentColor }} />

      <div className="flex items-start gap-3">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-12 h-12 rounded-2xl bg-slate-950 border flex items-center justify-center shrink-0 text-2xl"
          style={{ borderColor: `${accentColor}30` }}
        >
          {mascot.emoji}
        </motion.div>

        <div className="flex-1 pr-16">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-space text-[9px] font-black uppercase tracking-widest" style={{ color: accentColor }}>
              {mascot.name} says
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={insightIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-xs text-slate-300 font-sans leading-relaxed italic"
            >
              &ldquo;{insights[insightIdx]}&rdquo;
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <div className="flex-1 flex gap-1">
          {insights.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setInsightIdx(i)}
              className={`h-1 rounded-full transition-all cursor-pointer ${
                i === insightIdx % 5 ? 'flex-1' : 'w-4'
              }`}
              style={{ backgroundColor: i === insightIdx % 5 ? accentColor : 'rgba(255,255,255,0.1)' }}
            />
          ))}
        </div>
        <button
          onClick={nextInsight}
          className="text-[9px] font-space font-bold uppercase px-3 py-1 rounded-full border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          Next tip →
        </button>
      </div>
    </GlassCard>
  );
};

// 🏆 XP Level System Widget
const XPLevelWidget = ({ accentColor }) => {
  const [xp] = useState(() => parseInt(localStorage.getItem('aether_xp') || '120'));
  const [streak] = useState(3);
  const level = getCurrentXPLevel(xp);
  const progress = ((xp - level.min) / (level.max - level.min)) * 100;

  return (
    <GlassCard className="relative overflow-hidden">
      <span className="sticker-badge sticker-gold absolute top-3 right-3">XP SYSTEM</span>
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-3xl"
        >
          {level.emoji}
        </motion.div>
        <div>
          <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest">Current Rank</p>
          <h3 className="font-sora font-black text-sm text-slate-100">Level {level.level}: {level.title}</h3>
          <p className="text-[9px] font-space mt-0.5" style={{ color: accentColor }}>{xp} XP total</p>
        </div>
      </div>

      {/* XP Progress bar */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-space text-slate-500 uppercase">Progress to Level {level.level + 1}</span>
          <span className="text-[9px] font-space font-bold" style={{ color: accentColor }}>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }}
          />
        </div>
        <p className="text-[9px] font-space text-slate-500">{level.max - xp} XP to next level</p>
      </div>

      {/* Streak stat */}
      <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/3 border border-white/5">
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-2xl"
        >🔥</motion.span>
        <div>
          <p className="text-[9px] font-space text-slate-400 uppercase">Daily Streak</p>
          <p className="font-sora font-black text-sm text-slate-100">{streak} days locked in</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-[8px] font-space text-slate-500">Best</p>
          <p className="font-sora font-black text-xs text-orange-400">7 🔥</p>
        </div>
      </div>
    </GlassCard>
  );
};

// 🌱 Habit Garden Widget
const HabitGardenWidget = ({ accentColor }) => {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('aether_habits_v2');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });
  const [lastToggled, setLastToggled] = useState(null);

  const toggleHabit = (id) => {
    setLastToggled(id);
    setTimeout(() => setLastToggled(null), 600);
    setHabits(prev => {
      const updated = prev.map(h => h.id === id ? { ...h, done: !h.done } : h);
      localStorage.setItem('aether_habits_v2', JSON.stringify(updated));
      const xpGain = updated.find(h => h.id === id)?.done ? updated.find(h => h.id === id)?.xp : 0;
      if (xpGain) {
        const currentXP = parseInt(localStorage.getItem('aether_xp') || '0');
        localStorage.setItem('aether_xp', currentXP + xpGain);
      }
      return updated;
    });
  };

  const bloom = habits.filter(h => h.done).length;

  return (
    <GlassCard className="relative overflow-hidden">
      <span className="sticker-badge sticker-pink absolute top-3 right-3">GARDEN</span>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest">Daily Routines</p>
          <h2 className="font-sora font-extrabold text-sm text-slate-100 flex items-center gap-1.5 mt-0.5">
            🌱 Habit Garden
          </h2>
        </div>
        <span className="text-[9px] font-space px-2 py-0.5 rounded-full bg-white/5 text-slate-400 mr-20">
          {bloom}/{habits.length} bloom
        </span>
      </div>

      <div className="space-y-2">
        {habits.map((habit) => (
          <motion.button
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            animate={lastToggled === habit.id ? { scale: [1, 1.04, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              habit.done
                ? 'bg-emerald-950/15 border-emerald-500/20 text-emerald-400'
                : 'bg-white/2 border-white/5 hover:border-white/10 text-slate-300 hover:bg-white/4'
            }`}
          >
            <div className="flex items-center gap-2">
              <motion.span
                animate={habit.done ? { rotate: [0, 20, 0] } : {}}
                className="text-sm select-none"
              >
                {habit.done ? '🌸' : '🌱'}
              </motion.span>
              <span className={`text-xs font-semibold ${habit.done ? 'line-through opacity-70' : ''}`}>
                {habit.text}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-space text-yellow-500/80 font-bold">+{habit.xp}xp</span>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                habit.done ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-white/20'
              }`}>
                {habit.done && <CheckCircle2 size={11} />}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </GlassCard>
  );
};

// 🎵 Spotify Focus Zone
const SpotifyZoneWidget = ({ accentColor }) => {
  const [spotifyToken, setSpotifyToken] = useState(() => spotify.getAccessToken());
  const [nowPlaying, setNowPlaying] = useState(null);
  const [selectedMood, setSelectedMood] = useState('focus');
  const [activePlaylistId, setActivePlaylistId] = useState('37i9dQZF1DWZeKFB6u1Z4J');

  useEffect(() => {
    const parsedToken = spotify.parseTokenFromHash();
    if (parsedToken) setSpotifyToken(parsedToken);
  }, []);

  useEffect(() => {
    if (!spotifyToken) return;
    const load = async () => {
      const track = await spotify.fetchCurrentlyPlaying(spotifyToken);
      if (track) setNowPlaying(track);
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [spotifyToken]);

  const moodTabs = [
    { id: 'focus', label: '🎯 Focus', color: '#a855f7' },
    { id: 'night', label: '🌙 Night', color: '#6366f1' },
    { id: 'morning', label: '☕ Morning', color: '#f59e0b' },
    { id: 'exams', label: '📚 Exams', color: '#22d3ee' },
  ];

  return (
    <GlassCard className="overflow-hidden relative group">
      <span className="sticker-badge sticker-cyan absolute top-3 right-3">BEATS</span>
      <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
              🎵 Spotify Zone
            </p>
          </div>
          {spotifyToken && (
            <button
              onClick={() => { spotify.disconnect(); setSpotifyToken(null); setNowPlaying(null); }}
              className="text-[8px] font-space uppercase px-2 py-0.5 rounded border border-red-500/20 text-red-400 hover:bg-red-950/20 transition-all mr-20 cursor-pointer"
            >
              Disconnect
            </button>
          )}
        </div>

        {!spotifyToken ? (
          <div className="py-5 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#1DB954]/10 flex items-center justify-center text-2xl mx-auto">🎧</div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Connect Spotify to sync your study playlists & track vibes!
            </p>
            <button
              onClick={() => window.location.href = spotify.getAuthUrl()}
              className="px-6 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-slate-950 text-xs font-sora font-extrabold transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <Music size={14} /> Connect Spotify
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Now Playing */}
            <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/5 flex items-center gap-3">
              {nowPlaying?.item ? (
                <>
                  <div className="relative shrink-0 w-11 h-11 rounded-full overflow-hidden border border-black bg-neutral-900 shadow-lg vinyl-playing">
                    <img src={nowPlaying.item.album?.images?.[0]?.url} alt="Cover" className="w-8 h-8 rounded-full object-cover absolute inset-1.5 vinyl-disc" style={{ animationPlayState: nowPlaying.is_playing ? 'running' : 'paused' }} />
                    <div className="absolute w-2 h-2 rounded-full bg-slate-950 border border-neutral-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] font-space text-[#1DB954] uppercase">Now Playing</p>
                    <h4 className="font-sora text-xs font-black text-slate-100 truncate">{nowPlaying.item.name}</h4>
                    <p className="text-[9px] text-slate-400 truncate">{nowPlaying.item.artists?.[0]?.name}</p>
                  </div>
                  <div className="flex items-end gap-0.5 h-6 shrink-0">
                    {[3, 5, 2, 4, 3].map((h, i) => (
                      <motion.span key={i} className="w-1 rounded-full bg-[#1DB954]"
                        animate={nowPlaying.is_playing ? { height: [`${h * 4}px`, `${h * 8}px`, `${h * 4}px`] } : { height: '4px' }}
                        transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="text-2xl">🎵</span>
                  <p className="text-xs font-space">No track playing — open Spotify!</p>
                </div>
              )}
            </div>

            {/* Mood tabs */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {moodTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedMood(tab.id);
                    const recs = spotify.getRecommendations(tab.id);
                    if (recs?.[0]) setActivePlaylistId(recs[0].playlistId);
                  }}
                  className="px-3 py-1.5 rounded-full text-[10px] font-space font-bold uppercase whitespace-nowrap cursor-pointer transition-all"
                  style={{
                    background: selectedMood === tab.id ? tab.color : 'rgba(255,255,255,0.05)',
                    color: selectedMood === tab.id ? '#fff' : '#94a3b8'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Playlists */}
            <div className="space-y-1 max-h-28 overflow-y-auto scrollbar-none">
              {spotify.getRecommendations(selectedMood).map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePlaylistId(p.playlistId)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activePlaylistId === p.playlistId
                      ? 'bg-[#1DB954]/10 border-[#1DB954]/30 text-[#1DB954]'
                      : 'bg-white/2 border-white/5 hover:border-white/10 text-slate-300'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-sora">{p.title}</h4>
                    <p className="text-[9px] text-slate-500 font-space">{p.tracksCount} tracks · {p.duration}</p>
                  </div>
                  <span className="text-xs">▶</span>
                </button>
              ))}
            </div>

            {activePlaylistId && (
              <div className="rounded-2xl overflow-hidden border border-white/5">
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${activePlaylistId}`}
                  width="100%" height="80" frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

// 🎧 Focus Room Widget
const FocusRoomWidget = ({ setActiveTab, accentColor, theme }) => {
  const [activeRoom, setActiveRoom] = useState(null);
  const rooms = [
    { id: 'deep', emoji: '⚡', label: 'Deep Work', desc: '50 min sprint', bg: 'from-purple-950/40' },
    { id: 'light', emoji: '☀️', label: 'Light Study', desc: '25 min sprint', bg: 'from-yellow-950/30' },
    { id: 'exam', emoji: '📚', label: 'Exam Prep', desc: '90 min marathon', bg: 'from-blue-950/40' },
    { id: 'review', emoji: '🔁', label: 'Review Mode', desc: '15 min flash', bg: 'from-emerald-950/40' },
  ];

  return (
    <GlassCard className="relative">
      <span className="sticker-badge sticker-purple absolute top-3 right-3">FOCUS</span>
      <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest mb-1">Choose Your Mode</p>
      <h2 className="font-sora font-extrabold text-sm text-slate-100 mb-4">🎧 Focus Room</h2>

      <div className="grid grid-cols-2 gap-2">
        {rooms.map(room => (
          <motion.button
            key={room.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setActiveRoom(room.id); setTimeout(() => setActiveTab('focus'), 400); }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer bg-gradient-to-br ${room.bg} to-transparent ${
              activeRoom === room.id ? 'border-white/20 scale-[1.02]' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <span className="text-xl block mb-1">{room.emoji}</span>
            <p className="text-[11px] font-sora font-bold text-slate-100">{room.label}</p>
            <p className="text-[9px] font-space text-slate-500">{room.desc}</p>
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveTab('focus')}
        className="mt-4 w-full py-2.5 rounded-2xl text-[10px] font-space font-bold uppercase tracking-widest text-white transition-all text-center cursor-pointer btn-theme-gradient"
      >
        Enter Focus Room ⚡
      </motion.button>
    </GlassCard>
  );
};

// ✨ For You Widget
const ForYouWidget = ({ setActiveTab, accentColor, theme }) => {
  const [liked, setLiked] = useState({});
  const timeInfo = getTimeOfDay();

  return (
    <GlassCard className="relative">
      <span className="sticker-badge sticker-pink absolute top-3 right-3">FOR YOU</span>
      <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest">Personalized</p>
      <h2 className="font-sora font-extrabold text-sm text-slate-100 mb-4 mt-0.5">✨ Just For You</h2>

      {/* Time of day banner */}
      <div className="p-3 rounded-2xl bg-white/3 border border-white/5 flex items-center gap-3 mb-3">
        <span className="text-2xl">{timeInfo.emoji}</span>
        <div>
          <p className="text-[10px] font-sora font-bold text-slate-100">{timeInfo.label}</p>
          <p className="text-[9px] font-space text-slate-500">{timeInfo.sub}</p>
        </div>
      </div>

      <div className="space-y-2">
        {FOR_YOU_CARDS.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-white/10 transition-all group"
          >
            <span className="text-xl">{card.icon}</span>
            <div className="flex-1">
              <p className="text-xs font-sora font-bold text-slate-100 group-hover:text-white transition-colors">{card.title}</p>
              <p className="text-[9px] font-space text-slate-500">{card.desc}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setLiked(prev => ({ ...prev, [i]: !prev[i] }))}
                className={`text-sm cursor-pointer transition-all ${liked[i] ? 'scale-110' : 'opacity-40 hover:opacity-100'}`}
              >
                {liked[i] ? '❤️' : '🤍'}
              </button>
              <button
                onClick={() => setActiveTab(card.action)}
                className="text-[9px] font-space text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

// 🌐 Aether Circle (Social Feed)
const AetherCircleWidget = ({ user, accentColor }) => {
  const [circleFeed, setCircleFeed] = useState([
    { id: 1, name: 'Ayush', activity: 'solving LeetCode medium 💻', time: '2m ago', avatar: '🐼', reactions: { fire: 3, clap: 2 } },
    { id: 2, name: 'Tanya', activity: 'in 50m Focus: GATE Prep 🚀', time: '5m ago', avatar: '🦊', reactions: { fire: 8, clap: 5 } },
    { id: 3, name: 'Karan', activity: 'listening to Ghibli Lofi 🎵', time: '12m ago', avatar: '🦉', reactions: { fire: 2, clap: 7 } },
    { id: 4, name: 'Neha', activity: 'logged 3 hours focus today! 🌟', time: '25m ago', avatar: '🐧', reactions: { fire: 12, clap: 9 } },
  ]);
  const [statusText, setStatusText] = useState('');
  const [reactions, setReactions] = useState([]);

  const spawnReactions = (emoji, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newReactions = Array.from({ length: 4 }).map((_, i) => ({
      id: Math.random() + i,
      emoji,
      x: rect.left + rect.width / 2 + (Math.random() * 40 - 20),
      y: rect.top - 10 + (Math.random() * 10 - 5),
      delay: i * 0.07,
    }));
    setReactions(prev => [...prev, ...newReactions]);
    setTimeout(() => setReactions(prev => prev.filter(r => !newReactions.find(nr => nr.id === r.id))), 1200);
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (!statusText.trim()) return;
    setCircleFeed(prev => [{
      id: Date.now(),
      name: user?.name || 'Me',
      activity: statusText.trim(),
      time: 'Just now',
      avatar: '✨',
      reactions: { fire: 0, clap: 0 }
    }, ...prev]);
    setStatusText('');
  };

  return (
    <GlassCard className="relative">
      {/* Floating reaction overlays */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {reactions.map(r => (
          <span key={r.id} className="float-emoji text-lg absolute" style={{ left: r.x, top: r.y, animationDelay: `${r.delay}s` }}>
            {r.emoji}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest">Co-working lounge</p>
          <h2 className="font-sora font-extrabold text-sm text-slate-100 mt-0.5">🌐 Aether Circle</h2>
        </div>
        <div className="flex items-center gap-1.5 mr-20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-space text-slate-400">5.4k online</span>
        </div>
      </div>

      <form onSubmit={handlePost} className="flex gap-2 mb-4">
        <input
          type="text"
          value={statusText}
          onChange={(e) => setStatusText(e.target.value)}
          placeholder="What are you working on?"
          className="flex-1 pl-3 py-2 rounded-full bg-slate-900 border border-white/5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/40"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 px-3 rounded-full text-white text-[10px] font-space font-bold flex items-center gap-1 cursor-pointer btn-theme-gradient shrink-0"
        >
          <Send size={10} /> Post
        </motion.button>
      </form>

      <div className="space-y-3 max-h-52 overflow-y-auto scrollbar-none pr-1">
        {circleFeed.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl bg-white/2 border border-white/5 hover:border-white/8 transition-colors flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center border border-white/10 shrink-0 text-sm">
              {post.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h4 className="font-sora text-xs font-bold text-slate-100">{post.name}</h4>
                <span className="text-[9px] font-space text-slate-500">{post.time}</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans mt-0.5 leading-relaxed">{post.activity}</p>
              <div className="flex gap-2.5 mt-1.5">
                <button onClick={(e) => { spawnReactions('🔥', e); }} className="text-[10px] font-space text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer">
                  🔥 {post.reactions.fire}
                </button>
                <button onClick={(e) => { spawnReactions('👏', e); }} className="text-[10px] font-space text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1 cursor-pointer">
                  👏 {post.reactions.clap}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

// 🗺️ Journey Map Widget
const JourneyMapWidget = ({ setActiveTab, accentColor }) => {
  const milestones = [
    { done: true, icon: '🌱', title: 'First Login', desc: 'Welcome to Aether!' },
    { done: true, icon: '🎯', title: 'First Mission', desc: 'Completed your first quest' },
    { done: true, icon: '🔥', title: '3-Day Streak', desc: 'On fire!' },
    { done: false, icon: '⚡', title: '10-Day Streak', desc: 'Keep pushing!' },
    { done: false, icon: '🏆', title: 'Scholar Rank', desc: 'Reach Level 3' },
    { done: false, icon: '🌌', title: 'Cosmic Rank', desc: 'The final frontier' },
  ];

  return (
    <GlassCard className="relative">
      <span className="sticker-badge sticker-cyan absolute top-3 right-3">JOURNEY</span>
      <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest">Your Path</p>
      <h2 className="font-sora font-extrabold text-sm text-slate-100 mb-4 mt-0.5">🗺️ Journey Map</h2>

      <div className="relative pl-4 border-l-2 border-white/5 space-y-3">
        {milestones.map((m, i) => (
          <div key={i} className={`flex items-center gap-3 relative ${m.done ? 'opacity-100' : 'opacity-40'}`}>
            <span className="absolute -left-[21px] w-4 h-4 rounded-full border bg-slate-950 flex items-center justify-center text-[8px]"
              style={{ borderColor: m.done ? accentColor : 'rgba(255,255,255,0.1)' }}>
              {m.done ? '✓' : ''}
            </span>
            <span className="text-base">{m.icon}</span>
            <div>
              <p className="text-[11px] font-sora font-bold text-slate-100">{m.title}</p>
              <p className="text-[9px] font-space text-slate-500">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setActiveTab('journey')}
        className="mt-4 w-full py-2 rounded-2xl text-[10px] font-space font-bold uppercase tracking-widest border border-white/5 hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all text-center cursor-pointer"
      >
        See Full Journey →
      </button>
    </GlassCard>
  );
};

// 📈 Quick Insights Widget
const QuickInsightsWidget = ({ analytics, accentColor }) => {
  const stats = [
    { icon: '⏱️', label: 'Focus Time', value: `${analytics.totalFocusMinutes}m`, sub: 'today', color: '#a855f7' },
    { icon: '✅', label: 'Tasks Done', value: analytics.completedTasks, sub: 'completed', color: '#22d3ee' },
    { icon: '📊', label: 'Score', value: `${analytics.productivityScore}%`, sub: 'productivity', color: '#f59e0b' },
    { icon: '⏳', label: 'Pending', value: analytics.pendingTasks, sub: 'remaining', color: '#f472b6' },
  ];

  return (
    <GlassCard className="relative">
      <span className="sticker-badge sticker-purple absolute top-3 right-3">STATS</span>
      <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest">This Week</p>
      <h2 className="font-sora font-extrabold text-sm text-slate-100 mb-4 mt-0.5">📈 Your Insights</h2>

      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className="p-3 rounded-2xl bg-white/3 border border-white/5 hover:border-white/10 transition-all"
          >
            <span className="text-xl block mb-1">{stat.icon}</span>
            <p className="font-sora font-black text-lg text-slate-100" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[9px] font-space text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 p-2.5 rounded-2xl bg-white/3 border border-white/5">
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-[9px] font-space text-slate-400 uppercase">Weekly Progress</p>
          <p className="text-[9px] font-space font-bold text-emerald-400">+12% ↑</p>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${analytics.productivityScore}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${accentColor}, #22d3ee)` }}
          />
        </div>
      </div>
    </GlassCard>
  );
};

/* ─── Main Dashboard ────────────────────────────────────────────────────────── */

const Dashboard = ({ setActiveTab }) => {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const { theme, themes } = useTheme();

  const [schedule, setSchedule] = useState(null);
  const [coachingTip, setCoachingTip] = useState(AI_INSIGHTS[0]);
  const [analytics, setAnalytics] = useState({
    totalFocusMinutes: 0,
    streak: 3,
    completedTasks: 0,
    pendingTasks: 0,
    productivityScore: 72,
  });
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  const activeTheme = themes.find(th => th.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!token) return;
      try {
        const stats = await api.getWeeklyAnalytics(token);
        setAnalytics(stats);
        setLoadingSchedule(true);
        const scheduleData = await api.generateSchedule(token);
        setSchedule(scheduleData.schedule);
        if (scheduleData.coachingTip) setCoachingTip(scheduleData.coachingTip);
      } catch (err) {
        console.error('Failed to load dashboard data:', err.message);
      } finally {
        setLoadingSchedule(false);
      }
    };
    loadDashboardData();
  }, [token]);

  const timeInfo = getTimeOfDay();
  const xp = parseInt(localStorage.getItem('aether_xp') || '120');
  const level = getCurrentXPLevel(xp);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-32 pt-4 px-2 max-w-5xl mx-auto"
    >
      {/* ── Universe Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[9px] font-space tracking-widest uppercase px-2.5 py-0.5 rounded-full border bg-white/5"
              style={{ borderColor: `${accentColor}30`, color: accentColor }}
            >
              AETHER {theme.toUpperCase()} WORLD
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 active-glow-dot animate-pulse" />
          </div>
          <h1 className="font-sora text-3xl font-extrabold tracking-tight text-slate-100">
            {timeInfo.emoji} Hey, {user?.name?.split(' ')[0] || 'Seeker'}!
          </h1>
          <p className="text-sm text-slate-400 font-sans mt-1">{timeInfo.sub} • {timeInfo.label}</p>
        </div>

        {/* Quick header stats */}
        <div className="flex items-center gap-2">
          <GlassCard className="px-4 py-2 flex items-center gap-2 hover:scale-105 transition-transform" glow={false}>
            <span className="text-lg">{level.emoji}</span>
            <div>
              <p className="text-[8px] font-space text-slate-400 uppercase">Level</p>
              <p className="font-sora text-xs font-black text-slate-100">{level.level} {level.title}</p>
            </div>
          </GlassCard>
          <GlassCard className="px-4 py-2 flex items-center gap-2 hover:scale-105 transition-transform" glow={false}>
            <span className="text-lg">🔥</span>
            <div>
              <p className="text-[8px] font-space text-slate-400 uppercase">Streak</p>
              <p className="font-sora text-xs font-black text-slate-100">{analytics.streak} days</p>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ── Main Grid Layout ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="md:col-span-7 space-y-5">

          {/* 🧠 AI Insights */}
          <AIInsightsWidget theme={theme} accentColor={accentColor} coachingTip={coachingTip} />

          {/* 🎯 Mission Board */}
          <MissionBoardWidget setActiveTab={setActiveTab} accentColor={accentColor} />

          {/* 📅 Today's Schedule */}
          <GlassCard className="plan-tour relative">
            <span className="sticker-badge sticker-gold absolute top-3 right-3">SCHEDULE</span>
            <div className="flex justify-between items-center mb-5">
              <div>
                <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest">AI Generated</p>
                <h2 className="font-sora font-extrabold text-slate-100 text-sm flex items-center gap-2 mt-0.5">
                  <Calendar size={14} style={{ color: accentColor }} /> Today's Plan
                </h2>
              </div>
              <motion.button
                onClick={async () => {
                  setLoadingSchedule(true);
                  try {
                    const d = await api.generateSchedule(token);
                    setSchedule(d.schedule);
                    if (d.coachingTip) setCoachingTip(d.coachingTip);
                  } catch (err) { alert(err.message); }
                  finally { setLoadingSchedule(false); }
                }}
                disabled={loadingSchedule}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="text-[9px] font-space font-bold uppercase tracking-wider py-1.5 px-3 rounded-full bg-slate-950 border hover:bg-white/5 text-slate-300 transition-all disabled:opacity-50 cursor-pointer mr-24"
                style={{ borderColor: `${accentColor}30` }}
              >
                {loadingSchedule ? 'Syncing...' : 'Sync ⚡'}
              </motion.button>
            </div>

            {loadingSchedule ? (
              <div className="py-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mb-3" style={{ borderColor: `${accentColor}20`, borderTopColor: accentColor }} />
                <p className="text-[10px] text-slate-400 font-space uppercase tracking-wider animate-pulse">Generating...</p>
              </div>
            ) : schedule?.timeBlocks?.length > 0 ? (
              <div className="space-y-3 pl-2 border-l-2 border-white/5">
                {schedule.timeBlocks.map((block, index) => {
                  const isStudy = block.activityType === 'study';
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className="relative pl-6 group"
                    >
                      <span className="absolute left-[-21px] top-1.5 w-3 h-3 rounded-full border bg-slate-950 transition-all group-hover:scale-125"
                        style={{
                          borderColor: isStudy ? accentColor : '#06b6d4',
                          boxShadow: isStudy ? `0 0 8px ${accentColor}` : 'none'
                        }}
                      />
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h4 className="font-sora text-xs font-bold text-slate-100 flex items-center gap-2">
                            {block.taskTitle}
                            <span className="text-[7px] font-space px-1.5 py-0.5 rounded bg-white/5 border border-white/5 uppercase text-slate-400">
                              {isStudy ? '⚡ Main Quest' : '🌿 Side Quest'}
                            </span>
                          </h4>
                          <p className="text-[10px] text-slate-400 font-space mt-0.5">
                            {block.startTime} - {block.endTime}
                          </p>
                        </div>
                        {isStudy && (
                          <motion.button
                            onClick={() => setActiveTab('focus')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1 px-3 rounded-full text-white text-[9px] font-space font-bold uppercase flex items-center gap-1 cursor-pointer btn-theme-gradient"
                          >
                            <Play size={8} fill="currentColor" /> Focus
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-slate-500 text-xs font-sans mb-3">No schedule yet — add tasks in Smart Planner!</p>
                <button onClick={() => setActiveTab('planner')} className="text-[10px] font-space font-bold uppercase px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer">
                  Go to Planner →
                </button>
              </div>
            )}
          </GlassCard>

          {/* 🌐 Aether Circle */}
          <AetherCircleWidget user={user} accentColor={accentColor} />
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="md:col-span-5 space-y-5">

          {/* ☀️ Daily Energy */}
          <DailyEnergyWidget accentColor={accentColor} />

          {/* 🏆 XP Level System */}
          <XPLevelWidget accentColor={accentColor} />

          {/* 🌱 Habit Garden */}
          <HabitGardenWidget accentColor={accentColor} />

          {/* 🎧 Focus Room */}
          <FocusRoomWidget setActiveTab={setActiveTab} accentColor={accentColor} theme={theme} />

          {/* 🎵 Spotify Zone */}
          <SpotifyZoneWidget accentColor={accentColor} />

          {/* ✨ For You */}
          <ForYouWidget setActiveTab={setActiveTab} accentColor={accentColor} theme={theme} />

          {/* 📈 Insights */}
          <QuickInsightsWidget analytics={analytics} accentColor={accentColor} />

          {/* 🗺️ Journey Map */}
          <JourneyMapWidget setActiveTab={setActiveTab} accentColor={accentColor} />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
