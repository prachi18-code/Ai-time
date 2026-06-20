import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { Flame, Target, MessageSquare, Heart, Sparkles, Plus, Star, Smile, Coffee, Zap, RefreshCw, Dice5, Users, Trophy, Award, Music, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Dynamic greeting ─────────────────────────────────────────────────────────
const getTimeGreeting = () => {
  const h = new Date().getHours();
  if (h < 5)  return { prefix: 'Still grinding', icon: '🌙', vibe: 'Late night warrior mode — rest soon!' };
  if (h < 9)  return { prefix: 'Good morning', icon: '☀️', vibe: 'Early bird energy detected. Let\'s lock in!' };
  if (h < 12) return { prefix: 'Good morning', icon: '🌤️', vibe: 'Peak brain hours. Open your DSA sheet!' };
  if (h < 17) return { prefix: 'Good afternoon', icon: '🌞', vibe: 'Afternoon grind. No cap, let\'s go!' };
  if (h < 21) return { prefix: 'Good evening', icon: '🌇', vibe: 'Evening session. Lo-fi + focus = 🔥' };
  return { prefix: 'Night owl', icon: '🌙', vibe: 'Midnight grind hits different. Respect.' };
};

// ── Spotify playlist bank keyed by mood ─────────────────────────────────────
const SPOTIFY_MOODS = [
  { id: 'lofi',      label: 'Lo-Fi',    icon: '🎧', playlistId: '37i9dQZF1DWWQRwui0EXPn' },
  { id: 'focus',     label: 'Focus',    icon: '🧠', playlistId: '37i9dQZF1DWZeKFB6u1Z4J' },
  { id: 'night',     label: 'Night',    icon: '🌙', playlistId: '37i9dQZF1DX8UebhpvMOhw' },
  { id: 'classical', label: 'Piano',   icon: '🎹', playlistId: '37i9dQZF1DWWEJl22ZqG0c' },
  { id: 'beats',     label: 'Beats',    icon: '🔥', playlistId: '37i9dQZF1DX4sWSpwq3LiO' },
];

const MOTIVATIONAL_QUOTES = [
  "Bhai, coding starts with a single line. Let's write it now! 💻🔥",
  "Don't study to clear exams, study to build epic projects! 🚀✨",
  "Consistency is lowkey the best superpower you can have. Keep going! 🌱",
  "Your GATE preparation today is your future rank tomorrow. Lock in! 🎖️",
  "Take a deep breath. Focus Room is waiting for your next streak! 🎧☕",
  "Bussin' results require bussin' effort. No cap, let's crush it! 🙌"
];

const CHALLENGES_POOL = [
  "Solve 1 LeetCode Medium array problem right now 🎲",
  "Practice 5 general awareness MCQs for AFCAT ✈️",
  "Drink 1L water and stretch for 3 minutes 💧",
  "Summarize Dijkstra's algorithm in 2 sentences in AI Buddy 🧠",
  "Start a 25-minute pomodoro block in Focus Room ⏱️",
  "Do 10 pushups/squats to recharge daily energy 🔥"
];

const StudentFeed = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { theme, themes } = useTheme();
  const greeting = useMemo(() => getTimeGreeting(), []);
  
  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  // Energy State
  const [energy, setEnergy] = useState(() => localStorage.getItem('aether_student_energy') || 'Normal');
  const [spotifyMood, setSpotifyMood] = useState('lofi');
  const energyLevels = {
    Low: { emoji: '😴', msg: 'Sleepy vibe. Go grab some tea or coffee first! ☕', bg: '#f59e0b' },
    Normal: { emoji: '🙂', msg: 'Good baseline. Ready for some light study and habits! 🌿', bg: '#10b981' },
    High: { emoji: '🔥', msg: 'MAX POWER! Absolute beast mode. Lock in that DSA sheet! 💻', bg: '#ec4899' },
  };

  const handleSelectEnergy = (lvl) => {
    setEnergy(lvl);
    localStorage.setItem('aether_student_energy', lvl);
    triggerCelebration("☀️");
  };

  // Streak & XP State
  const [streakCount, setStreakCount] = useState(5);
  const [xp, setXP] = useState(() => parseInt(localStorage.getItem('aether_xp') || '250'));
  const [level, setLevel] = useState(() => Math.floor(xp / 100) + 1);

  // Quote State
  const [quoteIndex, setQuoteIndex] = useState(0);
  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  // Random Challenge Generator
  const [randomChallenge, setRandomChallenge] = useState(CHALLENGES_POOL[0]);
  const [rollingChallenge, setRollingChallenge] = useState(false);

  const rollChallenge = () => {
    setRollingChallenge(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * CHALLENGES_POOL.length);
      setRandomChallenge(CHALLENGES_POOL[idx]);
      setRollingChallenge(false);
      triggerCelebration("🎲");
    }, 600);
  };

  // Add random challenge to missions
  const addChallengeToMissions = () => {
    const newMission = {
      id: Date.now(),
      text: randomChallenge,
      xp: 30,
      done: false
    };
    setMissions(prev => [...prev, newMission]);
    triggerCelebration("💎");
  };

  // Mood Board selection
  const [currentMood, setCurrentMood] = useState('Locked in 💻');
  const moodStickers = [
    { emoji: '💻', text: 'Locked in' },
    { emoji: '🍹', text: 'Chilling' },
    { emoji: '😰', text: 'Stressed' },
    { emoji: '🔥', text: 'Crushing' },
    { emoji: '😴', text: 'Low Battery' },
  ];

  // Particle celebrations
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const triggerCelebration = (emoji) => {
    const id = Date.now();
    const newEmoji = {
      id,
      emoji,
      left: Math.random() * 80 + 10, // percentage
      top: Math.random() * 50 + 20, // percentage
    };
    setFloatingEmojis(prev => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(item => item.id !== id));
    }, 1200);
  };

  // Missions (Daily Challenges)
  const [missions, setMissions] = useState([
    { id: 1, text: 'Solve 2 LeetCode easy/mediums', xp: 50, done: false },
    { id: 2, text: 'Revise AFCAT general awareness notes', xp: 35, done: false },
    { id: 3, text: 'Water the habit garden (2 tasks done)', xp: 20, done: true },
  ]);

  const toggleMission = (id) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        const nextDone = !m.done;
        const rewardXP = m.xp;
        let nextXP = xp;
        if (nextDone) {
          nextXP += rewardXP;
          triggerCelebration("⭐");
        } else {
          nextXP = Math.max(0, nextXP - rewardXP);
        }
        setXP(nextXP);
        setLevel(Math.floor(nextXP / 100) + 1);
        localStorage.setItem('aether_xp', nextXP.toString());
        return { ...m, done: nextDone };
      }
      return m;
    }));
  };

  // Weekly Challenges
  const [weeklyChallenges, setWeeklyChallenges] = useState([
    { id: 'w1', text: 'Log 6 hours in Focus Room', progress: 4, total: 6, xp: 150, done: false },
    { id: 'w2', text: 'Maintain 5-day streak', progress: 5, total: 5, xp: 200, done: true },
    { id: 'w3', text: 'Complete 10 Syllabus blueprint checklists', progress: 7, total: 10, xp: 120, done: false }
  ]);

  const completeWeekly = (id) => {
    setWeeklyChallenges(prev => prev.map(w => {
      if (w.id === id && !w.done) {
        const nextXP = xp + w.xp;
        setXP(nextXP);
        setLevel(Math.floor(nextXP / 100) + 1);
        localStorage.setItem('aether_xp', nextXP.toString());
        triggerCelebration("🏆");
        return { ...w, done: true, progress: w.total };
      }
      return w;
    }));
  };

  // Study Lobbies Join Mock
  const [studyLobbies, setStudyLobbies] = useState([
    { id: 'l1', name: 'AFCAT General Study Lobby', members: 4, active: true },
    { id: 'l2', name: 'GATE CS Group Grind', members: 9, active: true },
    { id: 'l3', name: 'LeetCode 75 Daily sheet', members: 12, active: false }
  ]);

  const joinLobby = (id) => {
    setStudyLobbies(prev => prev.map(l => {
      if (l.id === id) {
        triggerCelebration("👥");
        return { ...l, members: l.members + 1, active: true };
      }
      return l;
    }));
  };

  // Social Feed Posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Nova (AI Companion)',
      avatar: '🦊',
      tag: 'AI INSIGHT',
      content: "Did you know GATE candidates who study in 45-minute focus intervals retain 25% more formulas? Let's start a Focus Room session! 🚀",
      likes: 12,
      liked: false,
      comments: [
        { author: 'Pranav', text: 'Bro so true, actually helps.' }
      ]
    },
    {
      id: 2,
      author: 'Rahul S.',
      avatar: '🎓',
      tag: 'PLACEMENT ZONE',
      content: 'Just cracked the Amazon internship interview! Striver sheet and LeetCode tracking on Aether absolutely saved me. Big thanks! 🎉🙌',
      likes: 45,
      liked: true,
      comments: []
    },
    {
      id: 3,
      author: 'Shruti K.',
      avatar: '🦋',
      tag: 'CDS PREP',
      content: 'AFCAT & CDS count downs are ticking down. Let\'s set up group focus rooms tonight. Who is in?',
      likes: 8,
      liked: false,
      comments: []
    }
  ]);

  const [newPostText, setNewPostText] = useState('');

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText) return;
    const newPost = {
      id: Date.now(),
      author: user?.name || 'Seeker',
      avatar: '⭐',
      tag: 'STUDENT TALK',
      content: newPostText,
      likes: 0,
      liked: false,
      comments: []
    };
    setPosts([newPost, ...posts]);
    setNewPostText('');
    triggerCelebration("🚀");
  };

  const handleLikePost = (id) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const likedState = !p.liked;
        if (likedState) triggerCelebration("❤️");
        return {
          ...p,
          liked: likedState,
          likes: likedState ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 font-sans select-none pb-24 text-slate-200 relative">
      
      {/* Floating particles celebration effect */}
      <AnimatePresence>
        {floatingEmojis.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 2.5, y: -160, rotate: 30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute pointer-events-none text-4xl z-50 font-bold"
            style={{ left: `${item.left}%`, top: `${item.top}%` }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticker-badge sticker-pink mb-2 inline-block"
          >
            {greeting.icon} {greeting.vibe}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-sora font-black text-3xl text-slate-100 tracking-tight mt-1"
          >
            {greeting.prefix}, {user?.name?.split(' ')[0] || 'Seeker'}! ✨
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.16 }}
            className="text-xs text-slate-400 mt-1"
          >
            What's the vibe today? Let's unlock achievements no cap!
          </motion.p>
        </div>

        {/* Level, XP & Streak row */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Level Display */}
          <div className="bg-slate-900/60 border border-purple-500/25 px-4 py-2 rounded-2xl flex flex-col justify-center">
            <span className="text-[8px] font-space font-black uppercase text-purple-400">XP level</span>
            <span className="font-sora font-extrabold text-white text-sm">Level {level} ({xp % 100}/100)</span>
          </div>

          {/* Animated Streak Card */}
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="relative bg-gradient-to-br from-amber-500/10 to-orange-500/20 border border-orange-500/30 p-3 rounded-2xl flex items-center gap-2.5 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500 animate-pulse text-xl">
              🔥
            </div>
            <div>
              <p className="text-[8px] font-space text-orange-400 uppercase tracking-widest font-black leading-none">Daily Streak</p>
              <h3 className="font-sora font-extrabold text-slate-100 text-xs mt-0.5">{streakCount} Days</h3>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Grid: Masonry/Pinterest layout style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Column 1: Energy, Quests & Challenges */}
        <div className="space-y-6">
          
          {/* Today's Energy Vibe Selector */}
          <GlassCard className="p-6 relative overflow-hidden group">
            <span className="sticker-badge sticker-purple absolute top-3 right-3">ENERGY</span>
            <h2 className="font-sora font-extrabold text-sm text-slate-100 mb-3 flex items-center gap-2">
              ☀️ Daily Vibe Check
            </h2>
            
            <div className="grid grid-cols-3 gap-2 bg-black/20 p-1.5 rounded-2xl">
              {Object.entries(energyLevels).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => handleSelectEnergy(key)}
                  className={`py-3 rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all ${
                    energy === key 
                      ? 'text-slate-950 scale-105 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  style={energy === key ? { backgroundColor: val.bg } : {}}
                >
                  <span className="text-lg">{val.emoji}</span>
                  <span className="text-[8px] font-space font-black uppercase tracking-wider">{key}</span>
                </button>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic mt-3 text-center">
              "{energyLevels[energy].msg}"
            </p>
          </GlassCard>

          {/* Quote of the Day */}
          <GlassCard className="p-5 relative overflow-hidden bg-gradient-to-r from-purple-900/10 to-indigo-900/10">
            <span className="sticker-badge sticker-latte absolute top-3 right-3">QUOTE</span>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-sora font-extrabold text-xs text-slate-100 flex items-center gap-1">
                ✨ Quote of the Day
              </h2>
              <button 
                onClick={handleNextQuote}
                className="text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <RefreshCw size={12} />
              </button>
            </div>
            <p className="text-xs text-purple-200 font-medium leading-relaxed italic">
              "{MOTIVATIONAL_QUOTES[quoteIndex]}"
            </p>
          </GlassCard>

          {/* Random Challenge Generator */}
          <GlassCard className="p-5 border-white/5 bg-slate-950/20">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-sora font-extrabold text-xs text-slate-100 flex items-center gap-1.5">
                <Dice5 size={14} className="text-pink-400" />
                Randomizer Challenge
              </h2>
            </div>
            
            <div className="p-3 bg-black/35 rounded-xl border border-white/5 text-xs text-slate-300 min-h-[50px] flex items-center">
              <span className={rollingChallenge ? "animate-pulse" : ""}>
                {rollingChallenge ? "Spinning dice... 🎲" : randomChallenge}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button 
                onClick={rollChallenge}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-space font-black text-[9px] uppercase rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                🎲 Spin New
              </button>
              <button 
                onClick={addChallengeToMissions}
                className="py-2 bg-pink-500 hover:bg-pink-600 text-white font-space font-black text-[9px] uppercase rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                ⚡ Accept Challenge
              </button>
            </div>
          </GlassCard>

          {/* Today's Missions */}
          <GlassCard className="p-6 relative">
            <span className="sticker-badge sticker-gold absolute top-3 right-3">MISSIONS</span>
            <h2 className="font-sora font-extrabold text-sm text-slate-100 mb-4 flex items-center gap-2">
              🎯 Today's Missions
            </h2>

            <div className="space-y-2">
              {missions.map((m) => (
                <button
                  key={m.id}
                  onClick={() => toggleMission(m.id)}
                  className={`w-full flex items-center gap-3 p-3 border rounded-2xl text-left transition-all cursor-pointer ${
                    m.done 
                      ? 'bg-emerald-950/10 border-emerald-500/20 opacity-60' 
                      : 'bg-white/2 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    m.done ? 'bg-emerald-400 border-emerald-400 text-slate-950' : 'border-white/20'
                  }`}>
                    {m.done && <span className="text-[8px] font-bold">✔</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-semibold truncate ${m.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {m.text}
                    </p>
                  </div>
                  <span className="text-[8px] font-space font-black px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 shrink-0">
                    +{m.xp} XP
                  </span>
                </button>
              ))}
            </div>
          </GlassCard>

        </div>

        {/* Column 2: Mood Board, Social Feed, Connect Spotify */}
        <div className="space-y-6">
          
          {/* Mood Board & Custom Stickers */}
          <GlassCard className="p-5 border-white/5 bg-slate-950/20">
            <h2 className="font-sora font-extrabold text-xs text-slate-100 mb-3 flex items-center gap-1.5">
              📸 Interactive Mood Board
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {moodStickers.map(stick => (
                <button
                  key={stick.text}
                  onClick={() => {
                    setCurrentMood(stick.text);
                    triggerCelebration(stick.emoji);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-space font-bold border transition-all cursor-pointer ${
                    currentMood === stick.text
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 scale-105'
                      : 'bg-slate-900/40 text-slate-400 border-white/5 hover:text-slate-300'
                  }`}
                >
                  {stick.emoji} {stick.text}
                </button>
              ))}
            </div>
            <div className="mt-3 p-3 bg-white/2 border border-dashed border-white/10 rounded-xl text-center text-[10px] text-slate-400 font-mono">
              Current Vibe Status: <span className="text-purple-400 font-bold">{currentMood}</span>
            </div>
          </GlassCard>

          {/* Enhanced Spotify Player */}
          <GlassCard className="p-5 border-white/5 bg-slate-950/20 overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#1DB954]/15 flex items-center justify-center shrink-0">
                <Music size={13} className="text-[#1DB954]" />
              </div>
              <h2 className="font-sora font-extrabold text-xs text-slate-100">🎵 Spotify Study Vibe</h2>
            </div>

            {/* Mood Tabs */}
            <div className="flex gap-1.5 flex-wrap mb-3">
              {SPOTIFY_MOODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSpotifyMood(m.id)}
                  className={`px-2.5 py-1 rounded-full text-[9px] font-space font-black border transition-all cursor-pointer ${
                    spotifyMood === m.id
                      ? 'bg-[#1DB954]/15 border-[#1DB954]/40 text-[#1DB954]'
                      : 'bg-white/3 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {/* Spotify Embed */}
            <AnimatePresence mode="wait">
              <motion.div
                key={spotifyMood}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl overflow-hidden"
              >
                <iframe
                  title="Spotify Playlist"
                  src={`https://open.spotify.com/embed/playlist/${SPOTIFY_MOODS.find(m => m.id === spotifyMood)?.playlistId}?utm_source=generator&theme=0`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-xl"
                />
              </motion.div>
            </AnimatePresence>
          </GlassCard>

          {/* Create Post Feed Card */}
          <GlassCard className="p-5 border-white/5 bg-slate-950/10">
            <form onSubmit={handleCreatePost} className="flex gap-2 items-center">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-lg shrink-0">
                ✨
              </div>
              <input
                type="text"
                required
                placeholder="What did you learn today? Post it..."
                value={newPostText}
                onChange={e => setNewPostText(e.target.value)}
                className="flex-1 bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 transition-colors"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl text-[10px] font-black shadow-md hover:scale-105 transition-transform cursor-pointer"
              >
                Post
              </button>
            </form>
          </GlassCard>

          {/* Social Posts lists */}
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="p-5 bg-slate-950/20 border border-white/5 rounded-3xl space-y-3 relative group"
                >
                  {/* Author Info */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                      {post.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-200">{post.author}</h4>
                      <span className="text-[8px] font-space px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-extrabold uppercase mt-0.5 inline-block">
                        {post.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {post.content}
                  </p>

                  {/* Interactions */}
                  <div className="flex items-center gap-4 pt-2.5 border-t border-white/5">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1 text-[9px] font-space font-black uppercase cursor-pointer ${
                        post.liked ? 'text-pink-500' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Heart size={12} fill={post.liked ? 'currentColor' : 'none'} /> {post.likes} Likes
                    </button>

                    <span className="text-slate-600 text-[9px] font-mono">
                      💬 {post.comments.length} Comments
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>

        {/* Column 3: Weekly challenges, Study Groups & Badges */}
        <div className="space-y-6">
          
          {/* Weekly Challenges */}
          <GlassCard className="p-6 relative">
            <span className="sticker-badge sticker-purple absolute top-3 right-3">WEEKLY</span>
            <h2 className="font-sora font-extrabold text-sm text-slate-100 mb-4 flex items-center gap-2">
              <Trophy size={16} className="text-yellow-400" />
              Weekly Challenges
            </h2>

            <div className="space-y-3">
              {weeklyChallenges.map((w) => {
                const percentage = Math.round((w.progress / w.total) * 100);
                return (
                  <div 
                    key={w.id} 
                    className={`p-3 border rounded-2xl space-y-2 transition-all ${
                      w.done ? 'bg-emerald-950/10 border-emerald-500/20 opacity-60' : 'bg-white/2 border-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className={`text-[11px] font-semibold ${w.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {w.text}
                      </p>
                      {!w.done && percentage >= 100 && (
                        <button
                          onClick={() => completeWeekly(w.id)}
                          className="px-2 py-0.5 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-space font-black text-[8px] uppercase rounded-lg transition-all"
                        >
                          Claim
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[8px] font-mono text-slate-500">
                      <span>Progress: {w.progress}/{w.total} ({percentage}%)</span>
                      <span className="text-yellow-500">+{w.xp} XP</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/25 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min(100, percentage)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Study Groups */}
          <GlassCard className="p-6 relative">
            <span className="sticker-badge sticker-cyan absolute top-3 right-3">GROUPS</span>
            <h2 className="font-sora font-extrabold text-sm text-slate-100 mb-4 flex items-center gap-2">
              <Users size={16} className="text-cyan-400" />
              👥 Study Lobbies
            </h2>

            <div className="space-y-2.5">
              {studyLobbies.map((lobby) => (
                <div key={lobby.id} className="p-3 bg-white/2 border border-white/5 rounded-2xl flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black text-slate-200">{lobby.name}</h4>
                    <span className="text-[8px] font-mono text-slate-500 uppercase block mt-0.5">
                      👥 {lobby.members} Online • {lobby.active ? '🔴 Live Study Room' : '💤 Idle'}
                    </span>
                  </div>
                  <button
                    onClick={() => joinLobby(lobby.id)}
                    className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-space font-black text-[9px] uppercase rounded-lg transition-transform hover:scale-105 cursor-pointer"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Achievement Badges */}
          <GlassCard className="p-6">
            <h2 className="font-sora font-extrabold text-sm text-slate-100 mb-4 flex items-center gap-2">
              <Award size={16} className="text-pink-400" />
              💎 Achievement Badges
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {[
                { emoji: '🔥', label: 'Streak Star', unlocked: true },
                { emoji: '🧠', label: 'OS Guru', unlocked: true },
                { emoji: '💻', label: 'LeetCode Beast', unlocked: false },
                { emoji: '⏱️', label: 'Focus Master', unlocked: true },
                { emoji: '🌱', label: 'Garden Sprouter', unlocked: false },
                { emoji: '🎓', label: 'Placement Ready', unlocked: false },
              ].map(badge => (
                <div 
                  key={badge.label} 
                  onClick={() => badge.unlocked && triggerCelebration(badge.emoji)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                    badge.unlocked 
                      ? 'bg-purple-950/10 border-purple-500/20 text-slate-200 hover:scale-105' 
                      : 'bg-black/30 border-white/5 opacity-30 cursor-not-allowed'
                  }`}
                >
                  <span className="text-xl">{badge.emoji}</span>
                  <span className="text-[7px] font-space font-bold mt-1 leading-tight tracking-wider truncate w-full">{badge.label}</span>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};

export default StudentFeed;
