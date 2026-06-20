import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';
import { Sparkles, User, Mail, Lock, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const { register, demoLogin } = useAuth();
  const { t } = useLanguage();
  const { theme, themes } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Bhai, sabhi details fill karo!');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password kam-se-kam 6 characters ka hona chahiye!');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      onRegisterSuccess();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Registration failed. Kuch issue aa gaya!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-[85vh] px-4 font-sans"
    >
      <div className="w-full max-w-md">
        {/* Logo and Greeting */}
        <div className="text-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex p-3 rounded-full bg-slate-950/40 border mb-3 text-purple-400 cursor-pointer"
            style={{ borderColor: `${accentColor}25`, color: accentColor }}
          >
            <Sparkles size={28} />
          </motion.div>
          
          <h1 className="font-sora text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            AETHER AI
          </h1>
          <p className="font-space text-xs text-slate-400 tracking-wider uppercase mt-1">
            Cosmic AI Operating System
          </p>
        </div>

        <GlassCard className="relative">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full filter blur-2xl pointer-events-none opacity-20" style={{ backgroundColor: accentColor }} />
          
          <h2 className="font-sora text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
            <UserPlus size={20} style={{ color: accentColor }} />
            {t('register')}
          </h2>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/20 text-red-200 text-xs font-sans">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-space text-slate-400 uppercase tracking-wider mb-1">
                {t('name')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Kumar"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-200 placeholder:text-slate-600 text-sm focus:border-purple-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-space text-slate-400 uppercase tracking-wider mb-1">
                {t('email')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-200 placeholder:text-slate-600 text-sm focus:border-purple-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-space text-slate-400 uppercase tracking-wider mb-1">
                {t('password')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (Min 6 chars)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-slate-200 placeholder:text-slate-600 text-sm focus:border-purple-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 mt-4 rounded-xl text-white font-sora font-semibold text-sm transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer btn-theme-gradient"
            >
              {isSubmitting ? 'Core initializing...' : t('register')}
            </motion.button>
          </form>

          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-transparent text-[10px] text-slate-500 font-space uppercase tracking-widest">or</span>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={() => { demoLogin(); onRegisterSuccess(); }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 rounded-xl font-space font-bold text-xs uppercase tracking-widest transition-all cursor-pointer border flex items-center justify-center gap-2"
            style={{ borderColor: `${accentColor}30`, color: accentColor, background: `${accentColor}08` }}
          >
            ✨ Try Demo — No Sign-up Needed
          </motion.button>

          <div className="mt-4 text-center text-xs text-slate-400 font-sans">
            Pehle se account hai?{' '}
            <button
              onClick={onSwitchToLogin}
              className="hover:text-slate-200 font-semibold focus:outline-none transition-colors ml-1 cursor-pointer"
              style={{ color: accentColor }}
            >
              Login karo
            </button>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default Register;
