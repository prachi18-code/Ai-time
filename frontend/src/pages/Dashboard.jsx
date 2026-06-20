import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { spotify } from '../services/spotify';
import GlassCard from '../components/GlassCard';
import { Sparkles, Play, Pause, Award, Zap, Calendar, Clock, Send, Volume2, CheckCircle2, ChevronRight, Music, Link2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_HABITS = [
  { id: 1, text: 'Drink 3L Water 💧', done: false },
  { id: 2, text: 'Solve 1 DSA Problem 💻', done: false },
  { id: 3, text: 'Deep Breathing 🧠', done: false },
  { id: 4, text: 'Read 5 Pages 📚', done: false },
];

const Dashboard = ({ setActiveTab }) => {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const { theme, themes } = useTheme();
  
  // Core API states
  const [schedule, setSchedule] = useState(null);
  const [coachingTip, setCoachingTip] = useState('Aaj ka plan banao aur study flow coordinate karo!');
  const [analytics, setAnalytics] = useState({
    totalFocusMinutes: 0,
    streak: 1,
    completedTasks: 0,
    pendingTasks: 0,
    productivityScore: 75,
  });
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  // Universe Vibe States
  const [energy, setEnergy] = useState(() => localStorage.getItem('aether_energy') || 'optimal');
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('aether_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  // Spotify Auth & Data States
  const [spotifyToken, setSpotifyToken] = useState(() => spotify.getAccessToken());
  const [nowPlaying, setNowPlaying] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [activePlaylistId, setActivePlaylistId] = useState('37i9dQZF1DWZeKFB6u1Z4J'); // default deep focus playlist
  const [selectedMood, setSelectedMood] = useState('focus'); // 'focus' | 'night' | 'morning' | 'exams'

  // Social Feed States
  const [circleFeed, setCircleFeed] = useState([
    { id: 1, name: 'Ayush', activity: 'solving LeetCode medium 💻', time: '2m ago', avatar: '🐼' },
    { id: 2, name: 'Tanya', activity: 'in 50m Focus: GATE Prep 🚀', time: '5m ago', avatar: '🦊' },
    { id: 3, name: 'Karan', activity: 'listening to Ghibli Lofi 🎵', time: '12m ago', avatar: '🦉' },
    { id: 4, name: 'Neha', activity: 'logged 3 hours focus today! 🌟', time: '25m ago', avatar: '🐧' }
  ]);
  const [statusText, setStatusText] = useState('');
  
  // Floating reactions animations
  const [reactions, setReactions] = useState([]);

  // Load Aether Core Data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!token) return;
      try {
        const stats = await api.getWeeklyAnalytics(token);
        setAnalytics(stats);

        setLoadingSchedule(true);
        const scheduleData = await api.generateSchedule(token);
        setSchedule(scheduleData.schedule);
        if (scheduleData.coachingTip) {
          setCoachingTip(scheduleData.coachingTip);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err.message);
      } finally {
        setLoadingSchedule(false);
      }
    };

    loadDashboardData();
  }, [token]);

  // Parse Spotify OAuth Token redirect
  useEffect(() => {
    const parsedToken = spotify.parseTokenFromHash();
    if (parsedToken) {
      setSpotifyToken(parsedToken);
    }
  }, []);

  // Poll Spotify API data if connected
  useEffect(() => {
    if (!spotifyToken) return;

    const loadSpotifyData = async () => {
      const track = await spotify.fetchCurrentlyPlaying(spotifyToken);
      if (track) {
        setNowPlaying(track);
      }
      const lists = await spotify.fetchPlaylists(spotifyToken);
      if (lists && lists.length > 0) {
        setUserPlaylists(lists);
      }
    };

    loadSpotifyData();
    const interval = setInterval(loadSpotifyData, 10000); // refresh every 10 seconds
    return () => clearInterval(interval);
  }, [spotifyToken]);

  // Sync Habits to localStorage
  useEffect(() => {
    localStorage.setItem('aether_habits', JSON.stringify(habits));
  }, [habits]);

  // Handle Spotify Connect Redirection
  const handleConnectSpotify = () => {
    window.location.href = spotify.getAuthUrl();
  };

  const handleDisconnectSpotify = () => {
    spotify.disconnect();
    setSpotifyToken(null);
    setNowPlaying(null);
    setUserPlaylists([]);
  };

  const handleGenerateSchedule = async () => {
    setLoadingSchedule(true);
    try {
      const scheduleData = await api.generateSchedule(token);
      setSchedule(scheduleData.schedule);
      if (scheduleData.coachingTip) {
        setCoachingTip(scheduleData.coachingTip);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Schedule generate nahi ho paya. Smart Planner me tasks check karo!');
    } finally {
      setLoadingSchedule(false);
    }
  };

  const handleToggleHabit = (id, e) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextDone = !h.done;
        if (nextDone) {
          spawnReactions('🌱', e);
          spawnReactions('✨', e);
        }
        return { ...h, done: nextDone };
      }
      return h;
    }));
  };

  const energyConfigs = {
    hyperfocus: {
      label: 'Hyperfocus 🔋',
      start: '#c084fc',
      end: '#f472b6',
      duration: '4s',
      tip: 'Full power mode active! Bhai, let\'s lock in and clear those high priority placement tasks now. ⚡'
    },
    optimal: {
      label: 'Optimal ⚡',
      start: '#818cf8',
      end: '#c084fc',
      duration: '9s',
      tip: 'Stable energy flow. Standard deep focus blocks will yield high output today. Let\'s maintain it!'
    },
    chillin: {
      label: 'Chillin 🍃',
      start: '#22d3ee',
      end: '#34d399',
      duration: '16s',
      tip: 'Peaceful vibes only. Good day to clear routine assignments, read, and cross off habits.'
    },
    exhausted: {
      label: 'Exhausted 🪫',
      start: '#fb923c',
      end: '#f43f5e',
      duration: '22s',
      tip: 'Low battery alert! Take a tea break, listen to some chill Lofi, and study only in short intervals.'
    }
  };

  const handleEnergyChange = (type) => {
    setEnergy(type);
    localStorage.setItem('aether_energy', type);
    setCoachingTip(energyConfigs[type].tip);
  };

  const handlePostStatus = (e) => {
    e.preventDefault();
    if (!statusText.trim()) return;
    const newPost = {
      id: Date.now(),
      name: user?.name || 'Me',
      activity: statusText.trim(),
      time: 'Just now',
      avatar: '✨'
    };
    setCircleFeed(prev => [newPost, ...prev]);
    setStatusText('');
  };

  const spawnReactions = (emoji, e) => {
    let clientX = e?.clientX || window.innerWidth / 2;
    let clientY = e?.clientY || window.innerHeight / 2;

    const newReactions = Array.from({ length: 5 }).map((_, i) => ({
      id: Math.random() + i,
      emoji,
      x: clientX + (Math.random() * 60 - 30),
      y: clientY - 10 + (Math.random() * 20 - 10),
      delay: i * 0.08
    }));

    setReactions(prev => [...prev, ...newReactions]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => !newReactions.find(nr => nr.id === r.id)));
    }, 1300);
  };

  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;
  const currentEnergyConfig = energyConfigs[energy] || energyConfigs.optimal;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24 pt-4 px-2 max-w-5xl mx-auto text-slate-200"
    >
      {/* Floating Reactions overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {reactions.map(r => (
          <span
            key={r.id}
            className="float-emoji text-lg"
            style={{ left: r.x, top: r.y, animationDelay: `${r.delay}s` }}
          >
            {r.emoji}
          </span>
        ))}
      </div>

      {/* Modern Universe header widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-space tracking-widest uppercase px-2.5 py-0.5 rounded-full border bg-white/5" style={{ borderColor: `${accentColor}30`, color: accentColor }}>
              AETHER {theme.toUpperCase()} WORLD
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 active-glow-dot animate-pulse" />
          </div>
          <h1 className="font-sora text-3xl font-extrabold tracking-tight mt-1 text-slate-100">
            {t('welcome_greeting').replace('{name}', user?.name || 'Seeker')}
          </h1>
        </div>

        {/* Focus stats metrics */}
        <div className="flex items-center gap-3">
          <GlassCard className="p-3 px-4 py-2 flex items-center gap-3 shadow-md hover:scale-105 transition-transform" glow={false}>
            <div className="relative text-orange-500">🔥</div>
            <div>
              <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest leading-none">Streak</p>
              <h4 className="font-sora text-xs font-black text-slate-100 mt-0.5">{analytics.streak} {t('days')}</h4>
            </div>
          </GlassCard>

          <GlassCard className="p-3 px-4 py-2 flex items-center gap-3 shadow-md hover:scale-105 transition-transform" glow={false}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-900 border text-purple-400" style={{ borderColor: `${accentColor}30`, color: accentColor }}>
              <Zap size={14} />
            </div>
            <div>
              <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest leading-none">Focus Flow</p>
              <h4 className="font-sora text-xs font-black text-slate-100 mt-0.5">{analytics.totalFocusMinutes} m</h4>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Asymmetric Staggered Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: Quests & Social Circles */}
        <div className="md:col-span-7 space-y-5">
          
          {/* AI Insights Companion card */}
          {/* 🧠 AI Insight companion card */}
          <GlassCard className="relative overflow-hidden group">
            <span className="sticker-badge sticker-purple absolute top-3 right-3">COACH ADVICE</span>
            <div className="absolute top-0 right-0 w-28 h-28 rounded-full filter blur-2xl pointer-events-none opacity-20" style={{ backgroundColor: accentColor }} />
            <div className="flex items-start gap-4">
              <div 
                className="w-10 h-10 rounded-2xl bg-slate-950 border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform text-lg"
                style={{ borderColor: `${accentColor}30` }}
              >
                {theme === 'zen' ? '🐼' : theme === 'galaxy' ? '🦊' : theme === 'sakura' ? '🐧' : theme === 'ocean' ? '🐙' : '🦉'}
              </div>
              <div className="pr-16">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-sora font-semibold text-[10px] uppercase tracking-widest" style={{ color: accentColor }}>🧠 AI Insight</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium italic">
                  &ldquo;{coachingTip}&rdquo;
                </p>
              </div>
            </div>
          </GlassCard>

          {/* 🎯 Today's Mission board widget */}
          <GlassCard className="plan-tour relative">
            <span className="sticker-badge sticker-gold absolute top-3 right-3">MISSIONS ACTIVE</span>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[9px] font-space text-slate-400 uppercase tracking-widest">AETHER SYSTEM AGENDA</span>
                <h2 className="font-sora font-extrabold text-slate-100 text-sm flex items-center gap-2 mt-0.5">
                  <Calendar size={15} style={{ color: accentColor }} />
                  🎯 Today's Mission
                </h2>
              </div>
              <motion.button
                onClick={handleGenerateSchedule}
                disabled={loadingSchedule}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="text-[9px] font-space font-bold uppercase tracking-wider py-1.5 px-3 rounded-full bg-slate-950 border hover:bg-white/5 text-slate-300 transition-all disabled:opacity-50 cursor-pointer mr-24 md:mr-28"
                style={{ borderColor: `${accentColor}30` }}
              >
                {loadingSchedule ? 'Generating...' : 'Sync Board ⚡'}
              </motion.button>
            </div>

            {loadingSchedule ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mb-3" style={{ borderColor: `${accentColor}10`, borderTopColor: accentColor }} />
                <p className="text-[10px] text-slate-400 font-space uppercase tracking-wider animate-pulse">{t('calculating')}</p>
              </div>
            ) : schedule && schedule.timeBlocks && schedule.timeBlocks.length > 0 ? (
              <div className="space-y-4 pl-2 border-l-2 border-white/5 relative">
                {schedule.timeBlocks.map((block, index) => {
                  const isStudy = block.activityType === 'study';
                  const isBreak = block.activityType === 'break';
                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative pl-6 group"
                    >
                      <span 
                        className="absolute left-[-22px] top-1.5 w-3 h-3 rounded-full border bg-slate-950 transition-all group-hover:scale-125" 
                        style={{ 
                          borderColor: isStudy ? accentColor : isBreak ? '#06b6d4' : '#64748b',
                          boxShadow: isStudy ? `0 0 8px ${accentColor}` : 'none'
                        }}
                      />
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h4 className="font-sora text-xs font-bold text-slate-100 group-hover:text-white transition-colors flex items-center gap-2">
                            {block.taskTitle}
                            <span className="text-[7px] font-space px-1.5 py-0.5 rounded bg-white/5 border border-white/5 uppercase text-slate-400">
                              {isStudy ? '⚡ Main Quest' : '🌿 Side Quest'}
                            </span>
                          </h4>
                          <p className="text-[10px] text-slate-400 font-space mt-0.5">
                            {block.startTime} - {block.endTime} | {isStudy ? 'Focus Session' : 'Leisure/Break'}
                          </p>
                        </div>
                        {isStudy && (
                          <motion.button
                            onClick={() => setActiveTab('focus')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1 px-3 rounded-full text-white text-[9px] font-space font-bold uppercase transition-all flex items-center gap-1 cursor-pointer btn-theme-gradient"
                          >
                            <Play size={8} fill="currentColor" /> {t('focus_button')}
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs font-sans">
                {t('no_tasks_dashboard')}
              </div>
            )}
          </GlassCard>

          {/* Social Feed Lounge (40% social) */}
          <GlassCard>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[9px] font-space text-slate-400 uppercase tracking-widest">Co-working lounge</span>
                <h2 className="font-sora font-extrabold text-sm text-slate-100 flex items-center gap-2 mt-0.5">
                  🌐 Aether Circle
                </h2>
              </div>
              <span className="text-[9px] font-space text-slate-400">🟢 5.4k active users</span>
            </div>

            <form onSubmit={handlePostStatus} className="flex gap-2 mb-4">
              <input
                type="text"
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
                placeholder="What are you prepping right now, Seeker?"
                className="flex-1 pl-3 pr-3 py-2 rounded-full bg-slate-900 border border-white/5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/40"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 px-4 rounded-full text-white text-[10px] font-space font-bold uppercase flex items-center gap-1 cursor-pointer btn-theme-gradient shrink-0"
              >
                <Send size={10} /> Share
              </motion.button>
            </form>

            <div className="space-y-3.5 max-h-60 overflow-y-auto scrollbar-none pr-1">
              {circleFeed.map((post) => (
                <div key={post.id} className="p-3 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors flex items-start gap-3 relative">
                  <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center border border-white/10 shrink-0 text-sm">
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-sora text-xs font-bold text-slate-100">{post.name}</h4>
                      <span className="text-[9px] font-space text-slate-500">{post.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans mt-0.5">{post.activity}</p>
                    <div className="flex gap-2.5 mt-2">
                      <button type="button" onClick={(e) => spawnReactions('🔥', e)} className="text-[10px] font-space text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer">
                        🔥 <span>3</span>
                      </button>
                      <button type="button" onClick={(e) => spawnReactions('👏', e)} className="text-[10px] font-space text-slate-400 hover:text-yellow-400 transition-colors flex items-center gap-1 cursor-pointer">
                        👏 <span>5</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>

        {/* RIGHT COLUMN: Interactive Music & Vibe check widgets */}
        <div className="md:col-span-5 space-y-5">
          
          {/* ☀️ Today's Energy level selector (Pulsing SVG blob) */}
          <GlassCard className="flex flex-col items-center p-5 text-center relative overflow-hidden">
            <span className="sticker-badge sticker-cyan absolute top-3 right-3">VIBE STATUS</span>
            <span className="text-[9px] font-space text-slate-400 uppercase tracking-widest">✨ Daily Vibe</span>
            <h2 className="font-sora font-extrabold text-slate-100 text-sm mt-0.5">☀️ Today's Energy</h2>
            
            <div className="my-4 relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full filter drop-shadow-md" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="energyBlobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={currentEnergyConfig.start} />
                    <stop offset="100%" stopColor={currentEnergyConfig.end} />
                  </linearGradient>
                </defs>
                <path
                  d="M25,-22.3C31.5,-16.1,35.4,-6.2,35.9,4C36.4,14.3,33.5,25,26.1,31.7C18.8,38.3,7,41,0.5,40.3C-6,39.6,-13.3,35.6,-22,30C-30.8,24.3,-41.1,17.1,-43.5,7.6C-45.8,-1.9,-40.3,-13.6,-32.8,-20.3C-25.2,-27.1,-15.7,-28.9,-4.8,-27.8C6.1,-26.6,18.5,-28.5,25,-22.3Z"
                  transform="translate(50 50)"
                  fill="url(#energyBlobGrad)"
                  className="blob-morph"
                  style={{ animationDuration: currentEnergyConfig.duration }}
                />
              </svg>
              <div className="absolute text-[10px] font-space font-black uppercase text-white drop-shadow">
                {energy === 'hyperfocus' ? 'MAX' : energy === 'optimal' ? 'OK' : energy === 'chillin' ? 'CHILL' : 'LOW'}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 w-full bg-slate-950/40 p-1.5 rounded-full border border-white/5">
              {Object.keys(energyConfigs).map(type => (
                <button
                  key={type}
                  onClick={() => handleEnergyChange(type)}
                  className={`py-1 px-1 rounded-full text-[8px] font-space font-bold uppercase transition-all cursor-pointer ${
                    energy === type ? 'bg-white text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Habits checklist */}
          {/* 🌱 Habit Garden */}
          <GlassCard className="relative overflow-hidden">
            <span className="sticker-badge sticker-pink absolute top-3 right-3">BLOOM GARDEN</span>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[9px] font-space text-slate-400 uppercase tracking-widest">Daily Routines</span>
                <h2 className="font-sora font-extrabold text-sm text-slate-100 mt-0.5">🌱 Habit Garden</h2>
              </div>
              <span className="text-[9px] font-space px-2 py-0.5 rounded-full bg-white/5 text-slate-400 mr-24">
                {habits.filter(h => h.done).length}/{habits.length} Bloom
              </span>
            </div>

            <div className="space-y-2">
              {habits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={(e) => handleToggleHabit(habit.id, e)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all hover:scale-[1.01] cursor-pointer ${
                    habit.done 
                      ? 'bg-emerald-950/15 border-emerald-500/25 text-emerald-400' 
                      : 'bg-white/2 border-white/5 hover:border-white/10 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm select-none">{habit.done ? '🌸' : '🌱'}</span>
                    <span className="text-xs font-semibold">{habit.text}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-space uppercase tracking-widest text-slate-500">
                      {habit.done ? 'blossomed' : 'sprout'}
                    </span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      habit.done ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-white/20'
                    }`}>
                      {habit.done && <CheckCircle2 size={12} />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* 🎵 Focus Mood (Spotify integration) */}
          <GlassCard className="overflow-hidden relative group">
            <span className="sticker-badge sticker-cyan absolute top-3 right-3">STUDY BEATS</span>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-space text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
                  🎵 Focus Mood
                </span>
                
                {spotifyToken && (
                  <button 
                    onClick={handleDisconnectSpotify}
                    className="text-[8px] font-space uppercase px-2 py-0.5 rounded border border-red-500/20 text-red-400 hover:bg-red-950/20 transition-all mr-24"
                  >
                    Disconnect
                  </button>
                )}
              </div>

              {!spotifyToken ? (
                // Connect Spotify trigger card
                <div className="py-6 text-center space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Connect your real Spotify account to stream study playlists and sync your active playback status!
                  </p>
                  <button
                    onClick={handleConnectSpotify}
                    className="p-2 px-6 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-slate-950 text-xs font-sora font-extrabold transition-all shadow-md flex items-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <Music size={14} /> Connect Spotify
                  </button>
                </div>
              ) : (
                // Spotify Active details
                <div className="space-y-4">
                  {/* 🎧 Now Playing */}
                  <div className="p-3 rounded-2xl bg-slate-950/50 border border-white/5 flex items-center gap-3">
                    {nowPlaying && nowPlaying.item ? (
                      <>
                        <div className="relative shrink-0 w-12 h-12 flex items-center justify-center rounded-full overflow-hidden border border-black bg-neutral-900 shadow-lg vinyl-playing">
                          <img 
                            src={nowPlaying.item.album?.images?.[0]?.url || 'https://via.placeholder.com/60'} 
                            alt="Cover" 
                            className="w-8 h-8 rounded-full object-cover z-10 vinyl-disc" 
                            style={{ animationPlayState: nowPlaying.is_playing ? 'running' : 'paused' }}
                          />
                          {/* center spindle hole */}
                          <div className="absolute w-2 h-2 rounded-full bg-slate-950 border border-neutral-700 z-20" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[8px] font-space text-[#1DB954] uppercase tracking-wider">Now Playing</span>
                          <h4 className="font-sora text-xs font-black text-slate-100 truncate mt-0.5">{nowPlaying.item.name}</h4>
                          <p className="text-[10px] text-slate-400 font-space truncate">{nowPlaying.item.artists?.[0]?.name}</p>
                        </div>
                        {/* Waveform indicator */}
                        <div className="h-6 flex items-end gap-1 px-1 shrink-0">
                          <span className={`w-1 h-3 bg-[#1DB954] rounded-full ${nowPlaying.is_playing ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.1s' }} />
                          <span className={`w-1 h-5 bg-[#1DB954] rounded-full ${nowPlaying.is_playing ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.3s' }} />
                          <span className={`w-1 h-2 bg-[#1DB954] rounded-full ${nowPlaying.is_playing ? 'animate-bounce' : ''}`} style={{ animationDelay: '0.2s' }} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative shrink-0 w-12 h-12 flex items-center justify-center rounded-full overflow-hidden border border-black bg-neutral-950 shadow-lg">
                          <div className="w-8 h-8 rounded-full bg-[#1DB954]/10 flex items-center justify-center text-sm z-10">
                            🎵
                          </div>
                          <div className="absolute w-2 h-2 rounded-full bg-slate-950 border border-neutral-700 z-20" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[8px] font-space text-slate-400 uppercase tracking-wider">Playback Standby</span>
                          <h4 className="font-sora text-xs font-black text-slate-300 truncate mt-0.5">No music active</h4>
                          <p className="text-[9px] text-slate-500 font-space">Play a track in Spotify app to sync!</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Mood Playlists Selector tabs (Duolingo pills) */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-space text-slate-400 uppercase tracking-widest">Study Rooms</span>
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
                      {[
                        { id: 'focus', label: '🎯 Deep Focus' },
                        { id: 'night', label: '🌙 Night Study' },
                        { id: 'morning', label: '☕ Morning Flow' },
                        { id: 'exams', label: '📚 Exam Zone' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setSelectedMood(tab.id);
                            // Set default active playlist from mood
                            const recs = spotify.getRecommendations(tab.id);
                            if (recs && recs[0]) setActivePlaylistId(recs[0].playlistId);
                          }}
                          className={`py-1.5 px-3 rounded-full text-[10px] font-space font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                            selectedMood === tab.id 
                              ? 'bg-white text-slate-950' 
                              : 'bg-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Playlists lists */}
                    <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto scrollbar-none">
                      {spotify.getRecommendations(selectedMood).map(p => (
                        <button
                          key={p.id}
                          onClick={() => setActivePlaylistId(p.playlistId)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                            activePlaylistId === p.playlistId 
                              ? 'bg-[#1DB954]/10 border-[#1DB954]/20 text-[#1DB954] font-semibold' 
                              : 'bg-white/2 border-white/5 hover:border-white/10 text-slate-300'
                          }`}
                        >
                          <div>
                            <h4 className="text-xs font-sora">{p.title}</h4>
                            <p className="text-[9px] text-slate-500 font-space mt-0.5">{p.tracksCount} tracks | {p.duration}</p>
                          </div>
                          <span className="text-[10px]">▶</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Real Spotify Embed Player Iframe */}
                  {activePlaylistId && (
                    <div className="rounded-2xl overflow-hidden border border-white/5 shadow-inner">
                      <iframe 
                        src={`https://open.spotify.com/embed/playlist/${activePlaylistId}`} 
                        width="100%" 
                        height="80" 
                        frameBorder="0" 
                        allowFullScreen="" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                        className="bg-transparent"
                      />
                    </div>
                  )}

                  {/* User personal playlists */}
                  {userPlaylists.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <span className="text-[9px] font-space text-slate-400 uppercase tracking-widest block">Your Playlists</span>
                      <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
                        {userPlaylists.map(list => (
                          <button
                            key={list.id}
                            onClick={() => setActivePlaylistId(list.id)}
                            className="p-2 rounded-xl bg-slate-950/40 border border-white/5 hover:border-white/10 shrink-0 text-left w-24 cursor-pointer"
                          >
                            <img src={list.images?.[0]?.url || 'https://via.placeholder.com/80'} alt="Playlist" className="w-full h-16 rounded object-cover border border-white/10" />
                            <h5 className="font-sora text-[9px] font-bold text-slate-200 mt-1.5 truncate">{list.name}</h5>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </GlassCard>

          {/* 🔥 Daily Streak Card */}
          <GlassCard className="p-4 relative overflow-hidden group">
            <span className="sticker-badge sticker-gold absolute top-3 right-3">Streak Active</span>
            <div className="flex items-center gap-4">
              <motion.div 
                animate={{ scale: [1, 1.12, 1], rotate: [0, -3, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-3xl filter drop-shadow-md select-none"
              >
                🔥
              </motion.div>
              <div>
                <span className="text-[9px] font-space text-slate-400 uppercase tracking-widest block font-bold">LOCKED IN</span>
                <h3 className="font-sora text-sm font-black text-slate-100 mt-0.5">{analytics.streak} Days Streak</h3>
                <p className="text-[9px] text-slate-400 font-sans mt-0.5">Complete missions to keep the flame alive!</p>
              </div>
            </div>
          </GlassCard>

          {/* ✨ For You Recommendation Card */}
          <GlassCard className="p-5 relative overflow-hidden group">
            <span className="sticker-badge sticker-purple absolute top-3 right-3">For You</span>
            <div className="space-y-3 mt-2">
              <div>
                <span className="text-[9px] font-space text-slate-400 uppercase tracking-widest block font-bold">DAILY INSIGHT</span>
                <h3 className="font-sora text-xs font-black text-slate-100 mt-1">Recommended study sprint</h3>
              </div>
              
              <div className="p-3 rounded-2xl bg-white/2 border border-white/5 space-y-1.5 text-left">
                <span className="text-[10px] text-slate-300 font-semibold font-sans block">💡 Placement Quest Suggestion</span>
                <p className="text-[9px] text-slate-400 leading-relaxed font-sans font-medium">
                  Try starting a 25-minute focus sprint to block out distractions and clear your study goals. Let's build your future!
                </p>
              </div>
              
              <button 
                onClick={() => setActiveTab('focus')} 
                className="w-full py-2.5 rounded-full border border-white/5 hover:bg-white/5 text-[9px] font-space font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all cursor-pointer text-center"
              >
                Start Focus Sprint ⚡
              </button>
            </div>
          </GlassCard>

        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
