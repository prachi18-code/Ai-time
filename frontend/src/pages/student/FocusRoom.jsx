import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { Play, Pause, RotateCcw, Headphones, Music, Volume2, CloudRain, TreePine, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SPOTIFY_PLAYLISTS = [
  { id: 'lofi',    label: 'Lo-Fi Beats',     icon: '🎧', color: '#f472b6', playlistId: '37i9dQZF1DWWQRwui0EXPn' },
  { id: 'rain',    label: 'Rainy Focus',      icon: '🌧️', color: '#06b6d4', playlistId: '37i9dQZF1DX8UebhpvMOhw' },
  { id: 'forest',  label: 'Forest Ambient',   icon: '🌲', color: '#22c55e', playlistId: '37i9dQZF1DX4sWSpwq3LiO' },
  { id: 'piano',   label: 'Classical Piano',  icon: '🎹', color: '#a78bfa', playlistId: '37i9dQZF1DWWEJl22ZqG0c' },
  { id: 'focus',   label: 'Deep Focus',       icon: '🧠', color: '#f59e0b', playlistId: '37i9dQZF1DWZeKFB6u1Z4J' },
];

// Waveform bars animation
const WaveformBars = ({ isActive, color }) => (
  <div className="flex gap-0.5 items-end h-4">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="w-0.5 rounded-full"
        style={{ backgroundColor: color || '#a855f7' }}
        animate={isActive ? {
          height: ['4px', `${8 + Math.random() * 8}px`, '4px'],
        } : { height: '3px' }}
        transition={{
          duration: 0.6 + i * 0.1,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
);

const FocusRoom = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  // Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('focus'); // 'focus' | 'break'
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            if (timerMode === 'focus') {
              setSessionsCompleted(s => s + 1);
              setTimerMode('break');
              return 5 * 60;
            } else {
              setTimerMode('focus');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timerMode]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timerMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Progress arc
  const totalTime = timerMode === 'focus' ? 25 * 60 : 5 * 60;
  const progress = (timeLeft / totalTime);

  // Spotify State
  const [spotifyPlaylist, setSpotifyPlaylist] = useState('lofi');
  const [spotifyExpanded, setSpotifyExpanded] = useState(true);
  const activePlaylist = SPOTIFY_PLAYLISTS.find(p => p.id === spotifyPlaylist) || SPOTIFY_PLAYLISTS[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 font-sans select-none pb-24 text-slate-200">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <span className="sticker-badge sticker-pink mb-1">Deep Work Room</span>
          <h1 className="font-sora font-black text-2xl text-slate-100 mt-1 flex items-center gap-2">
            <Headphones size={24} style={{ color: accentColor }} />
            Focus Room
          </h1>
        </div>
        {/* Sessions counter */}
        <div className="flex items-center gap-1.5 bg-white/3 border border-white/5 rounded-xl px-3 py-2">
          <Zap size={13} className="text-yellow-400" />
          <span className="text-[10px] font-space font-black text-slate-300">{sessionsCompleted} sessions done</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pomodoro Breathing Timer */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Background glow behind timer */}
            <motion.div
              animate={isRunning ? { opacity: [0.04, 0.12, 0.04], scale: [1, 1.1, 1] } : { opacity: 0.04 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
              style={{ backgroundColor: timerMode === 'focus' ? accentColor : '#34d399' }}
            />

            {/* Mode badges */}
            <div className="flex gap-2 mb-6">
              {['focus', 'break'].map(m => (
                <button
                  key={m}
                  onClick={() => { setTimerMode(m); setIsRunning(false); setTimeLeft(m === 'focus' ? 25 * 60 : 5 * 60); }}
                  className={`px-3 py-1 rounded-full text-[9px] font-space font-black uppercase transition-all cursor-pointer border ${
                    timerMode === m
                      ? 'text-slate-950 border-transparent'
                      : 'text-slate-500 border-white/5 hover:text-slate-300'
                  }`}
                  style={timerMode === m ? { backgroundColor: m === 'focus' ? accentColor : '#34d399' } : {}}
                >
                  {m === 'focus' ? '🧠 Focus' : '☕ Break'}
                </button>
              ))}
            </div>

            {/* Pulsing circle timer */}
            <div className="relative w-52 h-52 flex items-center justify-center mb-6">
              <motion.div 
                animate={isRunning ? {
                  scale: [1, 1.12, 1],
                  opacity: [0.1, 0.25, 0.1]
                } : { opacity: 0.1 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full blur-2xl"
                style={{ backgroundColor: timerMode === 'focus' ? accentColor : '#34d399' }}
              />
              <svg className="w-full h-full drop-shadow-xl" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                <motion.circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke={timerMode === 'focus' ? accentColor : '#34d399'}
                  strokeWidth="4"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * progress)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                  transform="rotate(-90 50 50)"
                />
              </svg>

              <div className="absolute flex flex-col items-center gap-1">
                <motion.span
                  key={timeLeft}
                  initial={{ scale: isRunning ? 1.03 : 1 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-black text-slate-100 font-mono tracking-tight"
                >
                  {formatTime(timeLeft)}
                </motion.span>
                <span className="text-[8px] font-space text-slate-500 font-extrabold uppercase tracking-widest">
                  {timerMode === 'focus' ? 'Deep Focus' : 'Rest Break'}
                </span>
                {isRunning && (
                  <WaveformBars isActive color={timerMode === 'focus' ? accentColor : '#34d399'} />
                )}
              </div>
            </div>

            {/* Timer controls */}
            <div className="flex gap-3">
              <motion.button
                onClick={toggleTimer}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="px-8 py-2.5 rounded-full text-xs font-space font-black uppercase text-slate-950 transition-all cursor-pointer flex items-center gap-1.5 shadow-lg"
                style={{ backgroundColor: timerMode === 'focus' ? accentColor : '#34d399' }}
              >
                {isRunning ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />} 
                {isRunning ? 'Pause' : 'Start'}
              </motion.button>
              <motion.button
                onClick={resetTimer}
                whileHover={{ scale: 1.06, rotate: -20 }}
                className="p-3 bg-white/5 border border-white/5 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Reset"
              >
                <RotateCcw size={14} />
              </motion.button>
            </div>

            {/* Progress dots for sessions */}
            <div className="flex gap-2 mt-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i < sessionsCompleted % 4
                      ? 'scale-110'
                      : 'bg-white/10'
                  }`}
                  style={i < sessionsCompleted % 4 ? { backgroundColor: accentColor } : {}}
                />
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Spotify + Ambient sounds */}
        <div className="space-y-6">
          
          {/* 🎵 Spotify Focus Player */}
          <GlassCard className="p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#1DB954]/15 flex items-center justify-center shrink-0">
                  <Music size={11} className="text-[#1DB954]" />
                </div>
                <h2 className="text-xs font-sora font-extrabold text-slate-100">🎵 Study Playlists</h2>
              </div>
              <motion.button
                onClick={() => setSpotifyExpanded(v => !v)}
                whileHover={{ scale: 1.1 }}
                className="text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {spotifyExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </motion.button>
            </div>

            {/* Playlist selector tabs */}
            <div className="grid grid-cols-5 gap-1 mb-3">
              {SPOTIFY_PLAYLISTS.map(p => (
                <motion.button
                  key={p.id}
                  onClick={() => setSpotifyPlaylist(p.id)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg border transition-all cursor-pointer text-center ${
                    spotifyPlaylist === p.id
                      ? 'border-transparent'
                      : 'bg-white/2 border-white/5 text-slate-500 hover:text-slate-300'
                  }`}
                  style={spotifyPlaylist === p.id ? { backgroundColor: `${p.color}18`, borderColor: `${p.color}35` } : {}}
                  title={p.label}
                >
                  <span className="text-base leading-none">{p.icon}</span>
                  {spotifyPlaylist === p.id && isRunning && (
                    <WaveformBars isActive color={p.color} />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Active playlist label */}
            <p className="text-[9px] font-mono uppercase text-slate-500 mb-2" style={{ color: activePlaylist.color }}>
              ▶ Now: {activePlaylist.label}
            </p>

            {/* Spotify embed */}
            <AnimatePresence mode="wait">
              {spotifyExpanded && (
                <motion.div
                  key={spotifyPlaylist}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-xl"
                >
                  <iframe
                    title={`Spotify: ${activePlaylist.label}`}
                    src={`https://open.spotify.com/embed/playlist/${activePlaylist.playlistId}?utm_source=generator&theme=0`}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-xl"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};

export default FocusRoom;
