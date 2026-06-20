import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { Send, Sparkles, Smile, Flame, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIBuddy = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'buddy', 
      text: "Yo! Nova here, your AI buddy. Let's cook some productivity today, no cap! 🦊🔥 What are we crushing today? Study, DSA sheets, or exams?", 
      time: '10:00 AM' 
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const slangResponses = [
    "That is highly lowkey fire! Let's lock in! ⚡",
    "No cap, your study velocity is straight up bussin' today! 🚀",
    "Slay! You checked off that habit, absolute W! 🌸",
    "Let's cook! 50 XP is yours, let's maintain that streak! 🔥",
    "We are so back. Time to smash that LeetCode array problem. 💻",
    "Period. Rest up a bit if you are low batt, then we crush it again. 💤"
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText) return;
    
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Buddy response after a short delay
    setTimeout(() => {
      const randomSlang = slangResponses[Math.floor(Math.random() * slangResponses.length)];
      const buddyMsg = {
        id: Date.now() + 1,
        sender: 'buddy',
        text: `Yo, for real: "${userMsg.text}"? ${randomSlang}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, buddyMsg]);
    }, 1000);
  };

  const handleSuggestion = (text) => {
    setInputText(text);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 font-sans select-none pb-24 text-slate-200">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <span className="sticker-badge sticker-purple mb-1">AI COMPANION</span>
          <h1 className="font-sora font-black text-2xl text-slate-100 mt-1 flex items-center gap-2">
            <Sparkles size={24} style={{ color: accentColor }} />
            AI Buddy Chat
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <GlassCard className="p-4 md:p-6 border-white/5 bg-slate-950/10 h-[500px] flex flex-col justify-between">
            
            {/* Messages Stack */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4 scrollbar-none">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-base shrink-0">
                      {msg.sender === 'user' ? '⭐' : '🦊'}
                    </div>
                    
                    {/* Bubble */}
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-purple-600/90 text-white rounded-tr-none'
                        : 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-none'
                    }`}>
                      <p className="font-semibold select-text">{msg.text}</p>
                      <span className="text-[8px] text-slate-500 font-mono mt-1 block text-right">{msg.time}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="border-t border-white/5 pt-4 flex gap-2">
              <input
                type="text"
                required
                placeholder="Talk to your AI buddy..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-400 transition-colors"
              />
              <button
                type="submit"
                className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl transition-transform hover:scale-105 cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>

          </GlassCard>
        </div>

        {/* Right Side: Suggestions & Prompt templates */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-sm font-sora font-extrabold text-slate-100 mb-3 flex items-center gap-1.5">
              <Smile size={16} style={{ color: accentColor }} />
              Vibe Suggestions
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Click a suggest prompt block to talk with Nova about study hacks, code review, or just check-in.
            </p>

            <div className="space-y-2">
              {[
                "Give me a quick pep talk, I'm stuck on arrays 😴",
                "Review my process sync notes no cap 💻",
                "Tell me a daily study joke to boost dopamine ⚡",
                "Explain short-term schedulers in OS in simple terms"
              ].map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestion(sug)}
                  className="w-full text-left p-3 bg-white/2 hover:bg-white/5 border border-white/5 rounded-xl text-[10px] font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};

export default AIBuddy;
