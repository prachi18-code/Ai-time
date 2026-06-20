import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';
import { User, LogOut, Save, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, logout, updatePreferences } = useAuth();
  const { t } = useLanguage();
  const { theme, themes } = useTheme();
  
  const [name, setName] = useState(user?.name || '');
  const [preferredHours, setPreferredHours] = useState(user?.preferredStudyHours || '09:00-18:00');
  const [dailyTime, setDailyTime] = useState(user?.dailyAvailableTime || 240);
  const [notification, setNotification] = useState(user?.notificationPreference !== false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
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
      setMsg('Preferences update ho gayi hain, Dost! 🌟');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setMsg('Oops! Updates save nahi ho payin.');
    } finally {
      setIsSaving(false);
    }
  };

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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 
            className="font-sora text-2xl font-extrabold text-transparent bg-clip-text"
            style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, #f472b6)` }}
          >
            {t('user_settings')}
          </h1>
          <p className="text-xs text-slate-400 font-space mt-0.5 uppercase tracking-wider">
            {t('profile_desc')}
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 45 }}
          className="p-2 rounded-xl bg-slate-950/40 border"
          style={{ borderColor: `${accentColor}30`, color: accentColor }}
        >
          <Settings size={18} className="animate-pulse" />
        </motion.div>
      </div>

      <div className="space-y-6">
        <GlassCard>
          <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
            <div 
              className="w-12 h-12 rounded-full bg-slate-950/40 border flex items-center justify-center font-sora font-extrabold text-sm"
              style={{ borderColor: `${accentColor}30`, color: accentColor }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-sora font-bold text-slate-200">{user?.name}</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">{user?.email}</p>
            </div>
          </div>

          {msg && (
            <div 
              className="mb-4 p-3 rounded-xl border text-xs font-sans bg-slate-950/40"
              style={{ borderColor: `${accentColor}30`, color: accentColor }}
            >
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-space text-slate-400 uppercase tracking-wider mb-1">
                {t('display_name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-200 text-xs focus:border-purple-500 focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-space text-slate-400 uppercase tracking-wider mb-1">
                {t('preferred_hours')}
              </label>
              <input
                type="text"
                value={preferredHours}
                onChange={(e) => setPreferredHours(e.target.value)}
                placeholder="e.g. 09:00-18:00"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-200 text-xs focus:border-purple-500 focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-space text-slate-400 uppercase tracking-wider mb-1">
                {t('daily_minutes')}
              </label>
              <input
                type="number"
                value={dailyTime}
                onChange={(e) => setDailyTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-200 text-xs focus:border-purple-500 focus:outline-none transition-all"
                min="30"
                max="1440"
                required
              />
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="notif"
                checked={notification}
                onChange={(e) => setNotification(e.target.checked)}
                className="rounded border-white/10 bg-slate-950/60 text-purple-600 focus:ring-purple-500/20"
              />
              <label htmlFor="notif" className="text-xs text-slate-300 font-sans cursor-pointer">
                {t('notif_checkbox')}
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={isSaving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 mt-2 rounded-xl text-white font-sora font-semibold text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer btn-theme-gradient"
            >
              <Save size={14} />
              {isSaving ? t('saving') : t('save_settings')}
            </motion.button>
          </form>
        </GlassCard>

        {/* Reboot Welcome Onboarding */}
        <motion.button
          onClick={() => {
            sessionStorage.removeItem('aether_onboarded');
            window.location.reload();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-purple-300 hover:bg-purple-950/20 hover:border-purple-500/20 font-sora font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Settings size={14} />
          Reboot Welcome Onboarding Journey
        </motion.button>

        {/* Logout area */}
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-red-400 hover:bg-red-950/20 hover:border-red-500/20 font-sora font-semibold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut size={14} />
          {t('logout')}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Profile;
