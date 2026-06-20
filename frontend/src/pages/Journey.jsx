import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lock, Star, Trophy, Zap, Flame, Award, Compass } from 'lucide-react';
import { api } from '../services/api';

/* ─── XP Level System ──────────────────────────────────────────────────────── */
const XP_LEVELS = [
  { level: 1, title: 'Seedling', emoji: '🌱', min: 0, max: 100 },
  { level: 2, title: 'Explorer', emoji: '🧭', min: 100, max: 300 },
  { level: 3, title: 'Scholar', emoji: '📚', min: 300, max: 600 },
  { level: 4, title: 'Achiever', emoji: '🏆', min: 600, max: 1000 },
  { level: 5, title: 'Legend', emoji: '⚡', min: 1000, max: 2000 },
  { level: 6, title: 'Cosmic', emoji: '🌌', min: 2000, max: 5000 },
];

const getCurrentLevel = (xp) => XP_LEVELS.find(l => xp >= l.min && xp < l.max) || XP_LEVELS[XP_LEVELS.length - 1];

/* ─── Achievements Data ─────────────────────────────────────────────────────── */
const ACHIEVEMENTS = [
  { id: 'a1', emoji: '🚀', title: 'Aether Activated', desc: 'Joined the Aether OS universe', condition: 'Default unlock', unlocked: true, xp: 100, rarity: 'common' },
  { id: 'a2', emoji: '🎧', title: 'First Focus Block', desc: 'Completed your first focus session', condition: '1+ focus minute logged', unlocked: false, xp: 250, rarity: 'rare', requires: 'Focus' },
  { id: 'a3', emoji: '🌸', title: 'Habit Sprout', desc: 'Checked off all daily habits', condition: 'Complete all habits once', unlocked: false, xp: 300, rarity: 'rare', requires: 'All habits' },
  { id: 'a4', emoji: '⚡', title: 'Astral Alignment', desc: 'Hit 80%+ productivity score', condition: '80% productivity index', unlocked: false, xp: 500, rarity: 'epic', requires: '80% score' },
  { id: 'a5', emoji: '🔥', title: '7-Day Inferno', desc: 'Maintained a 7-day streak', condition: '7 consecutive days', unlocked: false, xp: 700, rarity: 'epic', requires: '7-day streak' },
  { id: 'a6', emoji: '🌌', title: 'Cosmic Scholar', desc: 'Reached Level 6: Cosmic rank', condition: 'Reach 2000 XP', unlocked: false, xp: 1000, rarity: 'legendary', requires: '2000 XP' },
  { id: 'a7', emoji: '🎵', title: 'Study Soundscape', desc: 'Connected Spotify and studied with music', condition: 'Spotify connected', unlocked: false, xp: 150, rarity: 'common', requires: 'Spotify' },
  { id: 'a8', emoji: '🧠', title: 'AI Whisperer', desc: 'Chatted with your AI coach 5 times', condition: '5 AI coach sessions', unlocked: false, xp: 200, rarity: 'rare', requires: '5 AI chats' },
];

const RARITY_STYLES = {
  common: { badge: 'bg-slate-500/20 text-slate-300 border-slate-500/20', glow: 'rgba(148,163,184,0.15)' },
  rare: { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/20', glow: 'rgba(99,102,241,0.2)' },
  epic: { badge: 'bg-purple-500/20 text-purple-300 border-purple-500/20', glow: 'rgba(168,85,247,0.25)' },
  legendary: { badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20', glow: 'rgba(251,191,36,0.3)' },
};

/* ─── Roadmap Steps ─────────────────────────────────────────────────────────── */
const ROADMAP = [
  { week: 'Week 1', title: 'Foundation Layer', tasks: ['Set up Aether profile', 'Complete first focus session', 'Add 5 tasks to planner'], done: [true, false, false] },
  { week: 'Week 2', title: 'Momentum Build', tasks: ['3-day streak achieved', 'Chat with AI Coach', 'Study 5+ hours total'], done: [false, false, false] },
  { week: 'Week 3', title: 'Deep Flow', tasks: ['Complete all daily habits', 'Hit 80% productivity', 'Unlock Rare achievement'], done: [false, false, false] },
  { week: 'Week 4', title: 'Scholar Mode', tasks: ['7-day streak achieved', '20 tasks completed', 'Reach Level 3'], done: [false, false, false] },
];

/* ─── Main Journey Component ─────────────────────────────────────────────────── */
const Journey = () => {
  const { token, user } = useAuth();
  const { theme, themes } = useTheme();

  const [stats, setStats] = useState({ totalFocusMinutes: 0, streak: 3, completedTasks: 5, productivityScore: 72 });
  const [activeTab, setActiveTab] = useState('map');
  const [expandedAchiev, setExpandedAchiev] = useState(null);

  const xp = Number(localStorage.getItem('aether_xp')) || 120;
  const level = getCurrentLevel(xp);
  const nextLevel = XP_LEVELS[level.level] || XP_LEVELS[XP_LEVELS.length - 1];
  const progress = ((xp - level.min) / (level.max - level.min)) * 100;

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await api.getWeeklyAnalytics(token);
        setStats(res);
      } catch (err) { console.error(err); }
    };
    load();
  }, [token]);

  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const tabs = [
    { id: 'map', label: '🗺️ Roadmap' },
    { id: 'achievements', label: '🏆 Achievements' },
    { id: 'levels', label: '⚡ Levels' },
  ];

  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-32 pt-4 px-2 max-w-xl mx-auto"
    >
      {/* ── Header ── */}
      <div className="mb-6 px-1 relative">
        <span className="sticker-badge sticker-purple absolute top-0 right-2">COLLEGIATE ROADMAP</span>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] font-space tracking-widest uppercase px-2.5 py-0.5 rounded-full border bg-white/5"
            style={{ borderColor: `${accentColor}30`, color: accentColor }}>
            🗺️ Journey Map
          </span>
        </div>
        <h1 className="font-sora text-3xl font-extrabold text-transparent bg-clip-text"
          style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, #fb7185)` }}>
          My Seeker Journey
        </h1>
        <p className="text-[10px] font-space text-slate-400 mt-1 uppercase tracking-wider">
          Level up your college placement game ⚡
        </p>
      </div>

      {/* ── XP Card ── */}
      <GlassCard className="mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: accentColor }} />

        <div className="flex items-center gap-4 mb-5">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-4xl"
          >
            {level.emoji}
          </motion.div>
          <div className="flex-1">
            <p className="text-[8px] font-space text-slate-400 uppercase tracking-widest">Current Rank</p>
            <h3 className="font-sora text-lg font-black text-slate-100">Level {level.level}: {level.title}</h3>
            <p className="text-[10px] font-space mt-0.5" style={{ color: accentColor }}>{xp} XP accumulated</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-space text-slate-500 uppercase">Achievements</p>
            <p className="font-sora text-xl font-black text-slate-100">{unlockedCount}<span className="text-sm text-slate-500">/{ACHIEVEMENTS.length}</span></p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-space text-slate-400">
            <span>{xp} / {level.max} XP</span>
            <span>Next: {nextLevel.title} {nextLevel.emoji}</span>
          </div>
          <div className="h-3 rounded-full bg-black/30 overflow-hidden p-0.5 border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full relative"
              style={{ background: `linear-gradient(90deg, ${accentColor}, #fb7185)`, boxShadow: `0 0 12px ${accentColor}80` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-sm" />
            </motion.div>
          </div>
          <p className="text-[9px] font-space text-slate-500">{level.max - xp} XP until Level {level.level + 1}</p>
        </div>
      </GlassCard>

      {/* ── Tab Switcher ── */}
      <div className="flex gap-1.5 bg-black/20 p-1 rounded-2xl mb-5">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 rounded-xl text-[10px] font-space font-bold uppercase transition-all cursor-pointer ${
              activeTab === tab.id ? 'text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            style={activeTab === tab.id ? { backgroundColor: accentColor } : {}}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {/* 🗺️ ROADMAP TAB */}
          {activeTab === 'map' && (
            <div className="relative pl-6 ml-2 border-l-2 border-dashed border-white/10 space-y-5">
              {ROADMAP.map((phase, pi) => {
                const doneCount = phase.done.filter(Boolean).length;
                const isComplete = doneCount === phase.tasks.length;
                return (
                  <motion.div key={pi}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: pi * 0.1 }}
                    className="relative"
                  >
                    {/* Timeline node */}
                    <div className={`absolute -left-[30px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-bold transition-all ${
                      isComplete ? 'border-emerald-400 text-emerald-400' : doneCount > 0 ? 'border-yellow-400 text-yellow-400' : 'border-white/20 text-slate-600'
                    }`}
                      style={isComplete ? { boxShadow: '0 0 12px rgba(52,211,153,0.4)' } : {}}>
                      {isComplete ? '✓' : pi + 1}
                    </div>

                    <GlassCard className={`${!doneCount && 'opacity-65'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-[8px] font-space text-slate-500 uppercase">{phase.week}</span>
                          <h4 className="font-sora text-xs font-black text-slate-100 mt-0.5">{phase.title}</h4>
                        </div>
                        <span className={`text-[8px] font-space px-2 py-0.5 rounded-full border ${
                          isComplete ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : doneCount > 0 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            : 'bg-white/5 text-slate-500 border-white/5'
                        }`}>
                          {doneCount}/{phase.tasks.length} done
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {phase.tasks.map((task, ti) => (
                          <div key={ti} className={`flex items-center gap-2 text-[11px] font-sans ${
                            phase.done[ti] ? 'text-emerald-400 line-through opacity-70' : 'text-slate-300'
                          }`}>
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              phase.done[ti] ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-white/15'
                            }`}>
                              {phase.done[ti] && <CheckCircle2 size={10} />}
                            </span>
                            {task}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${(doneCount / phase.tasks.length) * 100}%`, backgroundColor: accentColor }} />
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* 🏆 ACHIEVEMENTS TAB */}
          {activeTab === 'achievements' && (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2 mb-4">
                {['common', 'rare', 'epic', 'legendary'].map(r => {
                  const cnt = ACHIEVEMENTS.filter(a => a.rarity === r).length;
                  const unlocked = ACHIEVEMENTS.filter(a => a.rarity === r && a.unlocked).length;
                  return (
                    <div key={r} className="text-center p-2 rounded-2xl bg-white/3 border border-white/5">
                      <p className="font-sora text-sm font-black text-slate-100">{unlocked}/{cnt}</p>
                      <p className={`text-[8px] font-space uppercase ${RARITY_STYLES[r].badge.split(' ')[1]}`}>{r}</p>
                    </div>
                  );
                })}
              </div>

              {ACHIEVEMENTS.map((achiev, i) => {
                const style = RARITY_STYLES[achiev.rarity];
                const isExpanded = expandedAchiev === achiev.id;
                return (
                  <motion.button
                    key={achiev.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setExpandedAchiev(isExpanded ? null : achiev.id)}
                    className={`w-full text-left transition-all cursor-pointer ${!achiev.unlocked && 'opacity-55'}`}
                  >
                    <GlassCard className="relative overflow-hidden" style={achiev.unlocked ? { boxShadow: `0 8px 30px ${style.glow}` } : {}}>
                      {achiev.unlocked && (
                        <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-20 pointer-events-none"
                          style={{ backgroundColor: accentColor }} />
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          achiev.unlocked ? 'bg-white/5 shadow-sm' : 'bg-white/3 grayscale opacity-60'
                        }`}>
                          {achiev.unlocked ? achiev.emoji : '🔒'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-sora text-xs font-black text-slate-100">{achiev.title}</h4>
                            <span className={`text-[7px] font-space px-1.5 py-0.5 rounded-full border uppercase ${style.badge}`}>
                              {achiev.rarity}
                            </span>
                            {achiev.unlocked && <span className="text-[7px] font-space px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">UNLOCKED</span>}
                          </div>
                          <p className="text-[10px] text-slate-400 font-sans mt-0.5 truncate">{achiev.desc}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[9px] font-space font-black" style={{ color: accentColor }}>+{achiev.xp}</p>
                          <p className="text-[8px] font-space text-slate-600">XP</p>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t border-white/5">
                              <p className="text-[9px] font-space text-slate-400 uppercase">Requirement</p>
                              <p className="text-[10px] font-sans text-slate-300 mt-1">🎯 {achiev.condition}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </GlassCard>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* ⚡ LEVELS TAB */}
          {activeTab === 'levels' && (
            <div className="space-y-3">
              {XP_LEVELS.map((lvl, i) => {
                const isCurrentLevel = lvl.level === level.level;
                const isUnlocked = xp >= lvl.min;
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <GlassCard className={`relative overflow-hidden transition-all ${!isUnlocked && 'opacity-45'}`}
                      style={isCurrentLevel ? { boxShadow: `0 0 20px ${accentColor}30`, borderColor: `${accentColor}40` } : {}}>
                      {isCurrentLevel && (
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-15"
                          style={{ backgroundColor: accentColor }} />
                      )}
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={isCurrentLevel ? { scale: [1, 1.1, 1], rotate: [0, 10, 0] } : {}}
                          transition={{ duration: 2.5, repeat: Infinity }}
                          className="text-3xl"
                        >
                          {isUnlocked ? lvl.emoji : '🔒'}
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-sora text-sm font-black text-slate-100">Level {lvl.level}: {lvl.title}</h4>
                            {isCurrentLevel && (
                              <span className="text-[7px] font-space px-1.5 py-0.5 rounded-full bg-white text-slate-950 font-black uppercase">YOU</span>
                            )}
                          </div>
                          <p className="text-[9px] font-space text-slate-400 mt-0.5">{lvl.min} – {lvl.max} XP required</p>
                          {isCurrentLevel && (
                            <div className="mt-1.5 h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full rounded-full"
                                style={{ background: `linear-gradient(90deg, ${accentColor}, #fb7185)` }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          {isUnlocked ? (
                            <CheckCircle2 size={18} className="text-emerald-400" style={{ filter: 'drop-shadow(0 0 4px rgba(52,211,153,0.5))' }} />
                          ) : (
                            <Lock size={16} className="text-slate-600" />
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Journey;
