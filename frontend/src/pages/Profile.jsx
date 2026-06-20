import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useExperience } from '../context/ExperienceContext';
import GlassCard from '../components/GlassCard';
import { User, LogOut, Save, Settings, Edit3, Shield, Bell, Palette, ChevronRight, RotateCcw, Star, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


/* ─── XP System ─────────────────────────────────────────────────────────────── */
const XP_LEVELS = [
  { level: 1, title: 'Seedling', emoji: '🌱', min: 0, max: 100 },
  { level: 2, title: 'Explorer', emoji: '🧭', min: 100, max: 300 },
  { level: 3, title: 'Scholar', emoji: '📚', min: 300, max: 600 },
  { level: 4, title: 'Achiever', emoji: '🏆', min: 600, max: 1000 },
  { level: 5, title: 'Legend', emoji: '⚡', min: 1000, max: 2000 },
  { level: 6, title: 'Cosmic', emoji: '🌌', min: 2000, max: 5000 },
];
const getCurrentLevel = (xp) => XP_LEVELS.find(l => xp >= l.min && xp < l.max) || XP_LEVELS[XP_LEVELS.length - 1];

/* ─── Avatar options ─────────────────────────────────────────────────────────── */
const AVATARS = ['🦊', '🐼', '🦋', '🐙', '🦉', '🐧', '🦁', '🐉', '🦄', '🌊', '⚡', '🌸'];

/* ─── Main Profile Component ─────────────────────────────────────────────────── */
const Profile = () => {
  const { user, logout, updatePreferences } = useAuth();
  const { t } = useLanguage();
  const { theme, themes, setTheme } = useTheme();
  const { experience, setExperience } = useExperience();

  const [activeSection, setActiveSection] = useState('identity');
  const [name, setName] = useState(user?.name || '');
  const [preferredHours, setPreferredHours] = useState(user?.preferredStudyHours || '09:00-18:00');
  const [dailyTime, setDailyTime] = useState(user?.dailyAvailableTime || 240);
  const [notification, setNotification] = useState(user?.notificationPreference !== false);
  const [selectedAvatar, setSelectedAvatar] = useState(() => localStorage.getItem('aether_avatar') || '🦊');
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const xp = Number(localStorage.getItem('aether_xp')) || 120;
  const level = getCurrentLevel(xp);
  const progress = ((xp - level.min) / (level.max - level.min)) * 100;
  const streak = 3;

  const activeTheme = themes.find(th => th.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMsg('');
    try {
      await updatePreferences({
        name,
        preferredStudyHours: preferredHours,
        dailyAvailableTime: Number(dailyTime),
        notificationPreference: notification,
      });
      localStorage.setItem('aether_avatar', selectedAvatar);
      setMsg('Profile updated! ✨');
      setTimeout(() => setMsg(''), 3500);
    } catch (err) {
      console.error(err);
      setMsg('Oops! Could not save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'identity', label: 'Identity', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'universe', label: 'Universe', icon: Palette },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-32 pt-4 px-2 max-w-lg mx-auto"
    >
      {/* ── Identity Card (Always Visible) ── */}
      <GlassCard className="relative overflow-hidden mb-5">
        {/* Background accent */}
        <div className="absolute top-0 left-0 right-0 h-24 rounded-t-3xl opacity-20 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${accentColor}, #f472b6)` }} />

        {/* Avatar + Name Row */}
        <div className="relative flex items-end gap-4 pt-6 pb-2">
          {/* Avatar */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="w-20 h-20 rounded-3xl border-4 border-slate-950 flex items-center justify-center text-4xl cursor-pointer shadow-xl relative"
              style={{ backgroundColor: `${accentColor}20`, borderColor: accentColor }}
            >
              {selectedAvatar}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center">
                <Edit3 size={10} className="text-slate-400" />
              </div>
            </motion.button>

            {/* Avatar Picker */}
            <AnimatePresence>
              {showAvatarPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 8 }}
                  className="absolute top-full mt-2 left-0 z-50 p-3 rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-xl"
                >
                  <div className="grid grid-cols-6 gap-1.5">
                    {AVATARS.map(av => (
                      <button
                        key={av}
                        onClick={() => { setSelectedAvatar(av); setShowAvatarPicker(false); }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg cursor-pointer transition-all hover:scale-110 ${
                          selectedAvatar === av ? 'bg-white/15 ring-1 ring-white/30' : 'hover:bg-white/5'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1">
            <h2 className="font-sora text-xl font-black text-slate-100">{user?.name || 'Seeker'}</h2>
            <p className="text-xs text-slate-400 font-sans">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[9px] font-space font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                {level.emoji} {level.title}
              </span>
              <span className="text-[9px] font-space text-slate-500">•</span>
              <span className="text-[9px] font-space text-orange-400 font-bold">🔥 {streak} day streak</span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-[9px] font-space">
            <span className="text-slate-400">Level {level.level} · {xp} XP</span>
            <span style={{ color: accentColor }}>{Math.round(progress)}% to Level {level.level + 1}</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${accentColor}, #f472b6)`, boxShadow: `0 0 8px ${accentColor}60` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
          {[
            { label: 'XP Total', value: xp, icon: '⚡' },
            { label: 'Level', value: level.level, icon: level.emoji },
            { label: 'Streak', value: `${streak}d`, icon: '🔥' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-sora font-black text-base text-slate-100">{s.icon} {s.value}</p>
              <p className="text-[8px] font-space text-slate-500 uppercase mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ── Section Tabs ── */}
      <div className="flex gap-1.5 bg-black/20 p-1 rounded-2xl mb-5">
        {sections.map(sec => {
          const Icon = sec.icon;
          return (
            <button key={sec.id} onClick={() => setActiveSection(sec.id)}
              className={`flex-1 py-2 rounded-xl text-[10px] font-space font-bold uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeSection === sec.id ? 'text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              style={activeSection === sec.id ? { backgroundColor: accentColor } : {}}>
              <Icon size={11} /> {sec.label}
            </button>
          );
        })}
      </div>

      {/* ── Section Content ── */}
      <AnimatePresence mode="wait">
        <motion.div key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* IDENTITY SECTION */}
          {activeSection === 'identity' && (
            <div className="space-y-4">
              {msg && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-2xl border text-xs font-sans text-center"
                  style={{ borderColor: `${accentColor}30`, color: accentColor, backgroundColor: `${accentColor}10` }}>
                  {msg}
                </motion.div>
              )}

              <GlassCard>
                <h3 className="font-sora text-xs font-black text-slate-100 mb-4 flex items-center gap-2">
                  <User size={14} style={{ color: accentColor }} /> Profile Info
                </h3>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-space text-slate-400 uppercase tracking-wider mb-1.5">
                      Display Name
                    </label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-2xl bg-black/20 border border-white/5 text-slate-200 text-xs focus:border-white/20 focus:outline-none transition-all"
                      required />
                  </div>
                  <div>
                    <label className="block text-[9px] font-space text-slate-400 uppercase tracking-wider mb-1.5">
                      Study Hours
                    </label>
                    <input type="text" value={preferredHours} onChange={e => setPreferredHours(e.target.value)}
                      placeholder="e.g. 09:00-18:00"
                      className="w-full px-3 py-2.5 rounded-2xl bg-black/20 border border-white/5 text-slate-200 text-xs focus:border-white/20 focus:outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-space text-slate-400 uppercase tracking-wider mb-1.5">
                      Daily Study Minutes
                    </label>
                    <input type="number" value={dailyTime} onChange={e => setDailyTime(e.target.value)}
                      min="30" max="1440"
                      className="w-full px-3 py-2.5 rounded-2xl bg-black/20 border border-white/5 text-slate-200 text-xs focus:border-white/20 focus:outline-none transition-all" />
                    <p className="text-[8px] font-space text-slate-500 mt-1">{Math.floor(dailyTime / 60)}h {dailyTime % 60}m per day</p>
                  </div>
                  <motion.button type="submit" disabled={isSaving}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-2xl text-sm font-sora font-bold flex items-center justify-center gap-2 cursor-pointer btn-theme-gradient disabled:opacity-50">
                    <Save size={14} /> {isSaving ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </form>
              </GlassCard>
            </div>
          )}

          {/* SETTINGS SECTION */}
          {activeSection === 'settings' && (
            <div className="space-y-3">
              <GlassCard>
                <h3 className="font-sora text-xs font-black text-slate-100 mb-4 flex items-center gap-2">
                  <Bell size={14} style={{ color: accentColor }} /> Notifications
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Focus reminders', desc: 'Get nudged to start focus sessions', checked: notification, toggle: () => setNotification(p => !p) },
                    { label: 'Streak alerts', desc: 'Never lose your streak', checked: true, toggle: () => {} },
                    { label: 'AI Coach tips', desc: 'Daily coaching insights', checked: true, toggle: () => {} },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div>
                        <p className="text-xs font-sora font-semibold text-slate-200">{item.label}</p>
                        <p className="text-[9px] font-space text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <button onClick={item.toggle}
                        className={`w-11 h-6 rounded-full relative transition-all cursor-pointer ${item.checked ? '' : 'bg-white/10'}`}
                        style={item.checked ? { backgroundColor: accentColor } : {}}>
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${item.checked ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-sora text-xs font-black text-slate-100 mb-4 flex items-center gap-2">
                  <Settings size={14} style={{ color: accentColor }} /> Choose Active Space
                </h3>
                <p className="text-[9px] font-space text-slate-400 uppercase mb-4">Choose your workspace layout</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setExperience('student')}
                    className={`py-3 rounded-2xl text-xs font-sora font-extrabold border transition-all cursor-pointer ${
                      experience === 'student'
                        ? 'bg-purple-950/20 text-white border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                        : 'bg-slate-950/20 border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🎓 Student Space
                  </button>
                  <button
                    onClick={() => setExperience('professional')}
                    className={`py-3 rounded-2xl text-xs font-sora font-extrabold border transition-all cursor-pointer ${
                      experience === 'professional'
                        ? 'bg-slate-900/30 text-white border-slate-400/40 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                        : 'bg-slate-950/20 border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    💼 Professional Space
                  </button>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-sora text-xs font-black text-slate-100 mb-4 flex items-center gap-2">
                  <Shield size={14} style={{ color: accentColor }} /> Account Actions
                </h3>
                <div className="space-y-2">
                  <motion.button
                    onClick={() => { sessionStorage.removeItem('aether_onboarded'); window.location.reload(); }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-between text-left cursor-pointer hover:bg-white/8 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <RotateCcw size={15} className="text-purple-400" />
                      <div>
                        <p className="text-xs font-sora font-semibold text-slate-200">Reboot Onboarding</p>
                        <p className="text-[9px] font-space text-slate-500">Restart the welcome experience</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-500" />
                  </motion.button>

                  <motion.button
                    onClick={logout}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 rounded-2xl border border-red-500/15 bg-red-950/10 hover:bg-red-950/20 flex items-center justify-between text-left cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut size={15} className="text-red-400" />
                      <div>
                        <p className="text-xs font-sora font-semibold text-red-400">Sign Out</p>
                        <p className="text-[9px] font-space text-slate-500">Logout of your Aether account</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-500" />
                  </motion.button>
                </div>
              </GlassCard>
            </div>
          )}

          {/* UNIVERSE SECTION */}
          {activeSection === 'universe' && (
            <div className="space-y-3">
              <GlassCard>
                <h3 className="font-sora text-xs font-black text-slate-100 mb-1 flex items-center gap-2">
                  <Palette size={14} style={{ color: accentColor }} /> Active Universe
                </h3>
                <p className="text-[9px] font-space text-slate-400 uppercase mb-4">Your current visual environment</p>

                <div className="space-y-2">
                  {themes.map(th => (
                    <motion.button
                      key={th.id}
                      onClick={() => setTheme(th.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        theme === th.id ? 'border-white/20' : 'border-white/5 hover:border-white/10'
                      }`}
                      style={theme === th.id ? { backgroundColor: `${th.accent}10`, borderColor: `${th.accent}30` } : {}}
                    >
                      <span className="text-2xl">{th.emoji || '🌌'}</span>
                      <div className="flex-1">
                        <p className="text-xs font-sora font-bold text-slate-100">{th.name}</p>
                        <p className="text-[9px] font-space text-slate-500 mt-0.5">{th.description || 'A unique visual universe'}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: th.accent }} />
                        {theme === th.id && (
                          <span className="text-[8px] font-space font-bold text-emerald-400">ACTIVE</span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </GlassCard>

              {/* Universe Stats */}
              <GlassCard>
                <h3 className="font-sora text-xs font-black text-slate-100 mb-3">🌌 Universe Stats</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Time in Aether', value: '12h 30m', icon: '⏱️' },
                    { label: 'Universes explored', value: '3 / 5', icon: '🌍' },
                    { label: 'Favorite universe', value: theme.charAt(0).toUpperCase() + theme.slice(1), icon: '⭐' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                      <p className="text-[10px] font-space text-slate-400">{stat.icon} {stat.label}</p>
                      <p className="text-[10px] font-sora font-bold text-slate-100">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;
