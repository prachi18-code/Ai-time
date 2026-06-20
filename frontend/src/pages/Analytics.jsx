import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import GlassCard from '../components/GlassCard';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, Cell
} from 'recharts';
import { TrendingUp, Clock, Zap, Target, Flame, Brain, Star, Trophy, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Mock enriched data ────────────────────────────────────────────────────── */
const SAMPLE_VELOCITY = [
  { day: 'Mon', minutes: 45, tasks: 3 },
  { day: 'Tue', minutes: 90, tasks: 6 },
  { day: 'Wed', minutes: 60, tasks: 4 },
  { day: 'Thu', minutes: 120, tasks: 8 },
  { day: 'Fri', minutes: 75, tasks: 5 },
  { day: 'Sat', minutes: 30, tasks: 2 },
  { day: 'Sun', minutes: 95, tasks: 7 },
];

const RADAR_DATA = [
  { subject: 'Focus', A: 82 },
  { subject: 'Habits', A: 65 },
  { subject: 'Tasks', A: 78 },
  { subject: 'Streak', A: 90 },
  { subject: 'Speed', A: 55 },
  { subject: 'XP', A: 72 },
];

const SUBJECT_BREAKDOWN = [
  { name: 'DSA', mins: 120, color: '#a855f7' },
  { name: 'DBMS', mins: 75, color: '#22d3ee' },
  { name: 'OS', mins: 50, color: '#f59e0b' },
  { name: 'CN', mins: 85, color: '#f472b6' },
  { name: 'Maths', mins: 40, color: '#34d399' },
];

const HEATMAP_DATA = (() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks = 4;
  const result = [];
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      result.push({
        week: w,
        day: d,
        label: days[d],
        value: Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0,
      });
    }
  }
  return result;
})();

/* ─── Custom Tooltip ─────────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label, accentColor }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-2xl border text-xs font-sans"
        style={{ background: 'rgba(10,6,25,0.95)', borderColor: `${accentColor}30`, color: '#f8fafc' }}>
        <p style={{ color: accentColor }} className="font-bold mb-0.5">{label}</p>
        {payload.map((p, i) => (
          <p key={i}>{p.name}: <strong>{p.value}{p.name === 'minutes' ? 'm' : ''}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

/* ─── Heatmap Component ─────────────────────────────────────────────────────── */
const ActivityHeatmap = ({ accentColor }) => {
  const weeks = [0, 1, 2, 3];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const intensityColors = ['rgba(255,255,255,0.05)', `${accentColor}40`, `${accentColor}70`, `${accentColor}A0`, accentColor];

  return (
    <div>
      <div className="flex gap-1 mb-1">
        {weeks.map(w => (
          <div key={w} className="flex flex-col gap-1 flex-1">
            {days.map((d, di) => {
              const cell = HEATMAP_DATA.find(c => c.week === w && c.day === di);
              return (
                <motion.div
                  key={di}
                  whileHover={{ scale: 1.3 }}
                  title={`${cell?.value || 0} sessions`}
                  className="h-4 rounded-sm cursor-default transition-all"
                  style={{ backgroundColor: intensityColors[cell?.value || 0] }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2 justify-end">
        <span className="text-[8px] font-space text-slate-500">Less</span>
        {intensityColors.map((c, i) => (
          <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span className="text-[8px] font-space text-slate-500">More</span>
      </div>
    </div>
  );
};

/* ─── Main Analytics Component ────────────────────────────────────────────────── */
const Analytics = () => {
  const { token } = useAuth();
  const { t } = useLanguage();
  const { theme, themes } = useTheme();

  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('velocity');
  const [data, setData] = useState({
    totalFocusMinutes: 515,
    streak: 3,
    completedTasks: 35,
    pendingTasks: 8,
    productivityScore: 78,
    studyVelocity: SAMPLE_VELOCITY,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) return;
      try {
        const res = await api.getWeeklyAnalytics(token);
        setData(prev => ({
          ...prev,
          ...res,
          studyVelocity: res.studyVelocity?.length ? res.studyVelocity : SAMPLE_VELOCITY,
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, [token]);

  const activeTheme = themes.find(th => th.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const stats = [
    { icon: '⏱️', label: 'Focus Time', value: `${data.totalFocusMinutes}m`, sub: 'this week', trend: '+23%', up: true },
    { icon: '🔥', label: 'Streak', value: `${data.streak}d`, sub: 'daily', trend: 'active', up: true },
    { icon: '✅', label: 'Completed', value: data.completedTasks, sub: 'tasks', trend: '+4 today', up: true },
    { icon: '📊', label: 'Score', value: `${data.productivityScore}%`, sub: 'productivity', trend: '+5%', up: true },
  ];

  const chartTabs = [
    { id: 'velocity', label: '📈 Velocity' },
    { id: 'radar', label: '🎯 Skills' },
    { id: 'subjects', label: '📚 Subjects' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-t-transparent"
          style={{ borderColor: `${accentColor}30`, borderTopColor: accentColor }}
        />
        <p className="text-[10px] font-space text-slate-400 uppercase tracking-widest animate-pulse">
          Analyzing your universe...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-32 pt-4 px-2 max-w-2xl mx-auto"
    >
      {/* ── Header ── */}
      <div className="mb-8 px-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] font-space tracking-widest uppercase px-2.5 py-0.5 rounded-full border bg-white/5"
            style={{ borderColor: `${accentColor}30`, color: accentColor }}>
            📊 Analytics Hub
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <h1 className="font-sora text-3xl font-extrabold text-transparent bg-clip-text"
          style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, #f472b6)` }}>
          Your Insights
        </h1>
        <p className="text-[10px] font-space text-slate-400 mt-1 uppercase tracking-wider">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="space-y-5">
        {/* ── Stat Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard className="p-4 hover:scale-[1.02] transition-transform relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10"
                  style={{ backgroundColor: accentColor }} />
                <span className="text-xl block mb-2">{stat.icon}</span>
                <p className="font-sora font-black text-xl" style={{ color: accentColor }}>{stat.value}</p>
                <p className="text-[9px] font-space text-slate-400 uppercase mt-0.5">{stat.label}</p>
                <span className={`text-[8px] font-space font-bold mt-1.5 block ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.up ? '↑' : '↓'} {stat.trend}
                </span>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* ── Charts Section ── */}
        <GlassCard className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest">Performance Data</p>
              <h3 className="font-sora text-sm font-bold text-slate-100 mt-0.5 flex items-center gap-2">
                <TrendingUp size={14} style={{ color: accentColor }} /> Study Analytics
              </h3>
            </div>
            <div className="flex gap-1 bg-black/20 p-1 rounded-2xl">
              {chartTabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveChart(tab.id)}
                  className={`text-[9px] font-space font-bold px-2.5 py-1 rounded-xl uppercase transition-all cursor-pointer ${
                    activeChart === tab.id ? 'text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                  style={activeChart === tab.id ? { backgroundColor: accentColor } : {}}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeChart}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {activeChart === 'velocity' && (
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.studyVelocity} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                      <defs>
                        <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={accentColor} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="rgba(255,255,255,0.1)" fontSize={9} fontFamily="Space Grotesk" tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.1)" fontSize={9} fontFamily="Space Grotesk" tickLine={false} />
                      <Tooltip content={<CustomTooltip accentColor={accentColor} />} />
                      <Area type="monotone" dataKey="minutes" name="minutes" stroke={accentColor} strokeWidth={2.5} fillOpacity={1} fill="url(#aGrad)" />
                      <Area type="monotone" dataKey="tasks" name="tasks" stroke="#f472b6" strokeWidth={1.5} fillOpacity={1} fill="url(#bGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-4 mt-2 px-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 rounded" style={{ backgroundColor: accentColor }} />
                      <span className="text-[9px] font-space text-slate-400">Focus minutes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 rounded bg-pink-400" />
                      <span className="text-[9px] font-space text-slate-400">Tasks done</span>
                    </div>
                  </div>
                </div>
              )}

              {activeChart === 'radar' && (
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={RADAR_DATA}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Space Grotesk' }} />
                      <Radar name="Skills" dataKey="A" stroke={accentColor} fill={accentColor} fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {activeChart === 'subjects' && (
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SUBJECT_BREAKDOWN} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" fontSize={9} fontFamily="Space Grotesk" tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.1)" fontSize={9} fontFamily="Space Grotesk" tickLine={false} />
                      <Tooltip content={<CustomTooltip accentColor={accentColor} />} />
                      <Bar dataKey="mins" name="minutes" radius={[6, 6, 0, 0]}>
                        {SUBJECT_BREAKDOWN.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </GlassCard>

        {/* ── Activity Heatmap ── */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest">Last 4 Weeks</p>
              <h3 className="font-sora text-sm font-bold text-slate-100 mt-0.5">🗓️ Activity Heatmap</h3>
            </div>
            <span className="text-[9px] font-space text-emerald-400 font-bold">21 active days</span>
          </div>
          <ActivityHeatmap accentColor={accentColor} />
        </GlassCard>

        {/* ── Productivity Score Ring ── */}
        <GlassCard>
          <div className="flex items-center gap-5">
            {/* SVG Ring */}
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <motion.circle
                  cx="40" cy="40" r="30" fill="none"
                  stroke={accentColor} strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 30}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - data.productivityScore / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                  style={{ filter: `drop-shadow(0 0 6px ${accentColor})` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-sora font-black text-lg text-slate-100">{data.productivityScore}%</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest">Productivity Score</p>
              <h3 className="font-sora text-sm font-bold text-slate-100 mt-0.5">Astral Alignment</h3>
              <p className="text-[10px] font-sans text-slate-400 mt-1 leading-relaxed">
                You're in the top 28% of Aether users this week. Keep the momentum going! 🚀
              </p>
              <div className="mt-2 flex gap-2">
                <span className="text-[8px] font-space px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ↑ 5% this week
                </span>
                <span className="text-[8px] font-space px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                  Best: 92%
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* ── Subject Time Breakdown list ── */}
        <GlassCard>
          <p className="text-[9px] font-space text-slate-400 uppercase tracking-widest mb-1">Time Spent</p>
          <h3 className="font-sora text-sm font-bold text-slate-100 mb-4">📚 Subject Breakdown</h3>
          <div className="space-y-3">
            {SUBJECT_BREAKDOWN.map((sub, i) => {
              const max = Math.max(...SUBJECT_BREAKDOWN.map(s => s.mins));
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[10px] font-space text-slate-400 w-10 shrink-0">{sub.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(sub.mins / max) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: sub.color, boxShadow: `0 0 8px ${sub.color}60` }}
                    />
                  </div>
                  <span className="text-[9px] font-space font-bold w-12 text-right shrink-0" style={{ color: sub.color }}>
                    {sub.mins}m
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default Analytics;
