import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import GlassCard from '../components/GlassCard';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = () => {
  const { token } = useAuth();
  const { t } = useLanguage();
  const { theme, themes } = useTheme();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalFocusMinutes: 0,
    streak: 1,
    completedTasks: 0,
    pendingTasks: 0,
    productivityScore: 75,
    studyVelocity: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) return;
      try {
        const res = await api.getWeeklyAnalytics(token);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);

  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pb-24 pt-4 px-2 max-w-lg mx-auto font-sans text-slate-200"
    >
      {/* Header */}
      <div className="mb-6 px-1">
        <span className="text-[9px] font-space tracking-widest uppercase px-2 py-0.5 rounded-full border bg-white/5" style={{ borderColor: `${accentColor}30`, color: accentColor }}>
          Metrics & Insights
        </span>
        <h1 
          className="font-sora text-2xl font-extrabold text-transparent bg-clip-text mt-2"
          style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, #f472b6)` }}
        >
          {t('weekly_stats')}
        </h1>
        <p className="text-[10px] text-slate-400 font-space mt-0.5 uppercase tracking-wider">
          {t('astral_perf')}
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${accentColor}10`, borderTopColor: accentColor }} />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Main Study Velocity Chart */}
          <GlassCard className="relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-sora font-semibold text-[9px] uppercase tracking-wider text-slate-400">
                  {t('study_velocity')}
                </h3>
                <h4 className="font-sora text-sm font-extrabold text-slate-100 flex items-center gap-1.5 mt-0.5">
                  <TrendingUp size={14} style={{ color: accentColor }} />
                  {t('performance_vs_last')}
                </h4>
              </div>
              <div>
                <span 
                  className="text-[9px] font-space px-2.5 py-1 rounded-full bg-slate-950/40 border"
                  style={{ borderColor: `${accentColor}30`, color: accentColor }}
                >
                  Weekly Trend
                </span>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-40 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.studyVelocity}
                  margin={{ top: 5, right: 5, left: -30, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={accentColor} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    stroke="rgba(255,255,255,0.12)"
                    fontSize={9}
                    fontFamily="Space Grotesk"
                    tickLine={false}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.12)"
                    fontSize={9}
                    fontFamily="Space Grotesk"
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c0818',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px',
                      fontFamily: 'Plus Jakarta Sans',
                      fontSize: '10px',
                      color: '#f8fafc'
                    }}
                    labelStyle={{ color: accentColor, fontWeight: 'bold' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="minutes"
                    stroke={accentColor}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorMinutes)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Staggered Asymmetrical Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <GlassCard className="py-4 px-4 hover:scale-[1.02] transition-transform">
              <div 
                className="p-2 rounded-xl bg-slate-950 border w-fit mb-3"
                style={{ borderColor: `${accentColor}30`, color: accentColor }}
              >
                <Clock size={15} />
              </div>
              <span className="text-[9px] font-space text-slate-400 uppercase tracking-widest block">Total Focus</span>
              <h3 className="font-sora text-base font-extrabold text-slate-100 mt-1">{data.totalFocusMinutes} {t('mins')}</h3>
            </GlassCard>

            <GlassCard className="py-4 px-4 hover:scale-[1.02] transition-transform">
              <div 
                className="p-2 rounded-xl bg-slate-950 border w-fit mb-3"
                style={{ borderColor: `${accentColor}30`, color: accentColor }}
              >
                <Zap size={15} />
              </div>
              <span className="text-[9px] font-space text-slate-400 uppercase tracking-widest block">Streak</span>
              <h3 className="font-sora text-base font-extrabold text-slate-100 mt-1">{data.streak} {t('days')} 🔥</h3>
            </GlassCard>
          </div>

          {/* Tasks Completion Card */}
          <GlassCard className="flex items-center justify-between p-4 py-3 hover:scale-[1.01] transition-transform">
            <div className="flex items-center gap-3">
              <div 
                className="p-2.5 rounded-xl bg-slate-950 border"
                style={{ borderColor: `${accentColor}30`, color: accentColor }}
              >
                <Target size={16} />
              </div>
              <div>
                <h4 className="font-sora text-xs font-bold text-slate-200">{t('tasks_complete')}</h4>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                  {t('completed')}: {data.completedTasks} | {t('pending')}: {data.pendingTasks}
                </p>
              </div>
            </div>
            <div className="font-sora text-xl font-extrabold text-slate-100">
              {data.completedTasks}
            </div>
          </GlassCard>

          {/* Productivity Level */}
          <GlassCard className="p-5">
            <span className="text-[9px] font-space uppercase tracking-widest block mb-1" style={{ color: accentColor }}>
              Productivity Alignment
            </span>
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="font-sora text-base font-extrabold text-slate-100">{t('astral_alignment')}</h3>
              <span className="font-sora text-base font-extrabold" style={{ color: accentColor }}>{data.productivityScore}%</span>
            </div>
            
            {/* Custom Pill Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-white/5 p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.productivityScore}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full glow-theme"
                style={{ 
                  background: `linear-gradient(to right, ${accentColor}, #f472b6)`,
                  boxShadow: `0 0 10px ${accentColor}`
                }}
              />
            </div>
          </GlassCard>
        </div>
      )}
    </motion.div>
  );
};

export default Analytics;
