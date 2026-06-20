import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import GlassCard from '../components/GlassCard';
import { Send, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTIONS = [
  "Plan my study session",
  "Placement ki preparation tips",
  "Motivation chahiye bhai",
  "Focus kaise improve karein?",
];

const AICoachChat = () => {
  const { token } = useAuth();
  const { t } = useLanguage();
  const { theme, themes } = useTheme();
  
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      content: 'Greetings, Seeker. Main aapka Aether AI productivity coach hoon. Ready to transcend the basics today? Aapki study planning, DSA focus ya exams prep me kya guidance chahiye, batao dost!'
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const newUserMsg = { sender: 'user', content: trimmed };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const payload = [...messages, newUserMsg].map(m => ({
        sender: m.sender,
        content: m.content,
      }));

      const data = await api.chatWithCoach(payload, token);
      setMessages(prev => [...prev, { sender: 'bot', content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          content: 'Aether core is offline for a bit. Par main simple advice deta hoon: Apne study targets clear rakho aur directly focus sessions start karo! ⚡'
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'bot',
        content: 'Chat history cleared. Aether core refreshed! Batao Seeker, aaj kya target unlock karna hai?'
      }
    ]);
  };

  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pb-32 pt-6 px-4 max-w-lg mx-auto font-sans text-slate-200 h-[92vh] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex justify-between items-center shrink-0 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div 
              className="w-10 h-10 rounded-full bg-slate-950/40 border flex items-center justify-center font-sora font-extrabold text-sm"
              style={{ borderColor: `${accentColor}30`, color: accentColor }}
            >
              AE
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-cosmic-bg active-glow-dot" />
          </div>
          <div>
            <h1 className="font-sora text-sm font-extrabold text-slate-100 flex items-center gap-1.5">
              Aether AI Coach
            </h1>
            <p className="text-[10px] font-space tracking-wider uppercase" style={{ color: accentColor }}>
              Aether AI is thinking...
            </p>
          </div>
        </div>
        <motion.button
          onClick={handleClearChat}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5 transition-all text-xs cursor-pointer flex items-center gap-1"
          title="Reset conversation"
        >
          <RefreshCw size={12} />
          <span className="text-[9px] font-space font-semibold uppercase">{t('clear_history')}</span>
        </motion.button>
      </div>

      {/* Messages Board */}
      <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1 scrollbar-none">
        {messages.map((msg, index) => {
          const isBot = msg.sender === 'bot';
          
          return (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed font-sans ${
                  isBot
                    ? 'liquid-glass text-slate-200 rounded-tl-sm'
                    : 'text-white rounded-tr-sm shadow-lg border'
                }`}
                style={!isBot ? {
                  background: `linear-gradient(135deg, ${accentColor} 0%, #312e81 100%)`,
                  borderColor: `${accentColor}30`
                } : {}}
              >
                {msg.content}
              </div>
            </motion.div>
          );
        })}

        {isThinking && (
          <div className="flex justify-start">
            <div className="liquid-glass text-slate-400 rounded-2xl rounded-tl-sm p-4 text-xs max-w-[85%] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms', backgroundColor: accentColor }} />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms', backgroundColor: accentColor }} />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms', backgroundColor: accentColor }} />
              <span className="text-[10px] font-space uppercase tracking-wider ml-1.5" style={{ color: accentColor }}>
                {t('thinking')}
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Bottom Area: chips and input bar */}
      <div className="shrink-0 space-y-3">
        {/* Suggestion Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SUGGESTIONS.map((sug, index) => (
            <motion.button
              key={index}
              onClick={() => handleSendMessage(sug)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-[10px] font-sans font-medium py-1.5 px-3 rounded-full bg-[#120D20]/60 border border-white/5 text-purple-300 hover:text-white transition-all whitespace-nowrap cursor-pointer"
              style={{ color: activeTheme.accent }}
            >
              {sug}
            </motion.button>
          ))}
        </div>

        {/* Input bar */}
        <form onSubmit={handleSubmit} className="flex gap-2 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('ask_anything')}
            className="flex-1 pl-4 pr-12 py-3 rounded-xl bg-slate-950/60 border border-white/5 text-slate-200 placeholder:text-slate-600 text-xs focus:outline-none transition-all"
            style={{ focusBorderColor: accentColor }}
            disabled={isThinking}
          />
          <motion.button
            type="submit"
            disabled={isThinking || !inputText.trim()}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="absolute right-2 top-1.5 p-2 rounded-lg text-white transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer btn-theme-gradient"
          >
            <Send size={14} />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default AICoachChat;
