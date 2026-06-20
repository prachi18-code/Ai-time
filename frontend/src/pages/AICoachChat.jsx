import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import GlassCard from '../components/GlassCard';
import { Send, RefreshCw, Sparkles, Mic, MicOff, ChevronDown, Star, Copy, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Universe Mascots ─────────────────────────────────────────────────────── */
const MASCOTS = {
  galaxy:   { emoji: '🦊', name: 'Nova',  color: '#a855f7', greeting: "Greetings, Cosmic Seeker! I'm Nova, your AI guide through the galaxy of knowledge. Placement prep, DSA practice, GATE strategies — name it! ⚡" },
  zen:      { emoji: '🐼', name: 'Sato',  color: '#B58263', greeting: "Namaste 🙏 I'm Sato, your mindful study companion. Let's find clarity and calm focus. What shall we work on today?" },
  sakura:   { emoji: '🦋', name: 'Hana',  color: '#f472b6', greeting: "Hey bestie! 🌸 I'm Hana, your study bestie! Whether it's placement prep or just needing motivation — I got you! What's up?" },
  ocean:    { emoji: '🐙', name: 'Aqua',  color: '#06b6d4', greeting: "Dive in, Seeker! 🌊 I'm Aqua. The ocean of knowledge awaits. Tell me — what subject are we conquering today?" },
  midnight: { emoji: '🦉', name: 'Orion', color: '#94a3b8', greeting: "Good evening, Seeker. I am Orion. The midnight hours belong to those who dare to study. What wisdom do you seek tonight?" },
};

/* ─── Quick Suggestion Chips ─────────────────────────────────────────────── */
const SUGGESTION_CATEGORIES = [
  {
    category: '📚 Study',
    chips: ['Plan today\'s study session', 'Make a 7-day DSA revision plan', 'Explain Dynamic Programming simply'],
  },
  {
    category: '🎯 Placement',
    chips: ['Placement preparation roadmap', 'Top 10 HR interview questions', 'How to crack system design?'],
  },
  {
    category: '⚡ Motivation',
    chips: ['I\'m feeling demotivated', 'How to build a study habit?', 'Pomodoro technique tips'],
  },
  {
    category: '🧠 Concepts',
    chips: ['Explain OS concepts for GATE', 'Database normalization help', 'Quick CN revision notes'],
  },
];

/* ─── Typing Dots Indicator ─────────────────────────────────────────────── */
const TypingDots = ({ accentColor }) => (
  <div className="flex items-center gap-1.5 px-4 py-3">
    {[0, 1, 2].map(i => (
      <motion.span
        key={i}
        animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: accentColor }}
      />
    ))}
  </div>
);

/* ─── Message Bubble ──────────────────────────────────────────────────────── */
const MessageBubble = ({ msg, accentColor, mascot, onCopy, onLike }) => {
  const isBot = msg.sender === 'bot';
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    onCopy?.();
  };

  const handleLike = () => {
    setLiked(p => !p);
    onLike?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} items-end gap-2`}
    >
      {/* Bot avatar */}
      {isBot && (
        <div className="w-8 h-8 rounded-2xl flex items-center justify-center text-lg shrink-0 mb-0.5"
          style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}25` }}>
          {mascot.emoji}
        </div>
      )}

      <div className={`max-w-[80%] group relative ${isBot ? '' : ''}`}>
        {/* Timestamp */}
        <p className={`text-[8px] font-space text-slate-600 mb-1 ${isBot ? '' : 'text-right'}`}>
          {msg.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-xs leading-relaxed font-sans relative ${
            isBot
              ? 'liquid-glass text-slate-200 rounded-bl-sm'
              : 'text-white rounded-br-sm shadow-lg'
          }`}
          style={!isBot ? {
            background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}99 100%)`,
            boxShadow: `0 4px 20px ${accentColor}30`,
          } : {}}
        >
          {/* Bot name badge */}
          {isBot && (
            <span className="block text-[8px] font-space font-black uppercase mb-1.5" style={{ color: accentColor }}>
              {mascot.name}
            </span>
          )}
          <p className="whitespace-pre-wrap">{msg.content}</p>

          {/* Reaction bar (bot messages only) */}
          {isBot && (
            <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleLike}
                className={`text-[9px] flex items-center gap-1 cursor-pointer transition-all ${liked ? 'text-yellow-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Star size={10} fill={liked ? 'currentColor' : 'none'} /> {liked ? 'Liked!' : 'Like'}
              </button>
              <span className="text-slate-700">·</span>
              <button
                onClick={handleCopy}
                className="text-[9px] flex items-center gap-1 cursor-pointer text-slate-500 hover:text-slate-300 transition-colors"
              >
                <Copy size={10} /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User avatar placeholder */}
      {!isBot && (
        <div className="w-8 h-8 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 mb-0.5 text-white"
          style={{ background: `linear-gradient(135deg, ${accentColor}, #f472b6)` }}>
          ✨
        </div>
      )}
    </motion.div>
  );
};

/* ─── Main AICoachChat Component ─────────────────────────────────────────── */
const AICoachChat = () => {
  const { token } = useAuth();
  const { t } = useLanguage();
  const { theme, themes } = useTheme();

  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;
  const mascot = MASCOTS[theme] || MASCOTS.galaxy;

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      content: mascot.greeting,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeSugCategory, setActiveSugCategory] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [totalMessages, setTotalMessages] = useState(0);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Update greeting when theme changes
  useEffect(() => {
    setMessages([{
      sender: 'bot',
      content: MASCOTS[theme]?.greeting || mascot.greeting,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }]);
  }, [theme]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    const userMsg = {
      sender: 'user',
      content: trimmed,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);
    setShowSuggestions(false);
    setTotalMessages(p => p + 1);

    // Award XP for using AI coach
    if (totalMessages === 4) {
      const xp = parseInt(localStorage.getItem('aether_xp') || '0');
      localStorage.setItem('aether_xp', xp + 50);
    }

    try {
      const payload = [...messages, userMsg].map(m => ({ sender: m.sender, content: m.content }));
      const data = await api.chatWithCoach(payload, token);
      setMessages(prev => [...prev, {
        sender: 'bot',
        content: data.reply,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        content: `Aether core is briefly offline. But here's a quick tip: Break your study into 25-minute focused sprints and take 5-minute breaks. That Pomodoro rhythm is real! ⚡`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const handleClear = () => {
    setMessages([{
      sender: 'bot',
      content: `Chat cleared! I'm ${mascot.name} — refreshed and ready. What's on your mind, Seeker? 🌟`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setShowSuggestions(true);
    setTotalMessages(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-32 pt-0 px-2 max-w-lg mx-auto flex flex-col"
      style={{ height: 'calc(100vh - 140px)', minHeight: '500px' }}
    >
      {/* ── Chat Header ── */}
      <div className="flex items-center justify-between py-3 px-1 border-b border-white/5 shrink-0 mb-3">
        <div className="flex items-center gap-3">
          {/* Mascot avatar */}
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
            >
              {mascot.emoji}
            </motion.div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-sora text-sm font-black text-slate-100">{mascot.name}</h2>
              <span className="text-[7px] font-space px-1.5 py-0.5 rounded-full font-bold uppercase"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                AI Coach
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              />
              <p className="text-[9px] font-space text-slate-400 uppercase tracking-wide">
                {isThinking ? 'Thinking...' : 'Online · Ready to help'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {totalMessages >= 5 && (
            <span className="text-[8px] font-space px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/15 font-bold">
              +50 XP 🏆
            </span>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClear}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/8 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1"
          >
            <RefreshCw size={12} />
            <span className="text-[9px] font-space font-bold uppercase hidden sm:block">Clear</span>
          </motion.button>
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            msg={msg}
            accentColor={accentColor}
            mascot={mascot}
          />
        ))}

        {/* Thinking indicator */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-end gap-2"
            >
              <div className="w-8 h-8 rounded-2xl flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}25` }}>
                {mascot.emoji}
              </div>
              <div className="liquid-glass rounded-2xl rounded-bl-sm">
                <TypingDots accentColor={accentColor} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={chatEndRef} />
      </div>

      {/* ── Suggestions Panel ── */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden shrink-0 mt-3"
          >
            {/* Category tabs */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1.5 mb-2">
              {SUGGESTION_CATEGORIES.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSugCategory(i)}
                  className={`text-[9px] font-space font-bold px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer transition-all ${
                    activeSugCategory === i ? 'text-slate-950' : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                  style={activeSugCategory === i ? { backgroundColor: accentColor } : {}}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Chips */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {SUGGESTION_CATEGORIES[activeSugCategory].chips.map((chip, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => sendMessage(chip)}
                  className="text-[10px] font-sans py-2 px-3.5 rounded-full border whitespace-nowrap cursor-pointer transition-all shrink-0"
                  style={{ borderColor: `${accentColor}25`, color: accentColor, backgroundColor: `${accentColor}08` }}
                >
                  {chip}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input Bar ── */}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-3 shrink-0">
        {/* Expand suggestions toggle */}
        <button
          type="button"
          onClick={() => setShowSuggestions(p => !p)}
          className="p-2.5 rounded-2xl border border-white/8 bg-white/3 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
        >
          <motion.div animate={{ rotate: showSuggestions ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={16} />
          </motion.div>
        </button>

        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={`Ask ${mascot.name} anything...`}
            disabled={isThinking}
            className="w-full pl-4 pr-12 py-3 rounded-2xl bg-black/20 border border-white/8 text-slate-200 placeholder:text-slate-600 text-xs focus:outline-none focus:border-white/20 transition-all"
          />
          <motion.button
            type="submit"
            disabled={isThinking || !inputText.trim()}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="absolute right-2 top-1.5 p-2 rounded-xl text-white transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer btn-theme-gradient"
          >
            <Send size={14} />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AICoachChat;
