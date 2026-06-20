import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Send, Mic, RefreshCw, Copy, ChevronRight, Clock, Briefcase, TrendingUp, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BRIEFING_STARTERS = [
  'Generate my executive briefing for today',
  'What should be my top 3 priorities this week?',
  'Summarize my pending goals and blockers',
  'Prepare talking points for my next team meeting',
  'What decisions require my attention?',
  'Create a focus plan for the next 90 minutes',
];

const INITIAL_BRIEFING = `Good morning. Here is your executive briefing for today.

**Strategic Overview**
Your week is 60% complete. 3 of 5 OKRs are on track. The Q3 milestone for team expansion requires attention — a decision is pending on the hiring budget approval.

**Priority Actions**
1. Review and sign off on the product roadmap v2 deck before 3 PM.
2. Respond to the pending client proposal from Vertex Labs (48h overdue).
3. Approve the engineering sprint planning doc — team is blocked.

**Focus Block Recommendation**
You have 2.5 hours of unscheduled time between 10 AM and 12:30 PM. Optimal for deep work on the Q4 strategy memo.

**Meetings Today**
- 9:00 AM — Stand-up (15 min)
- 2:00 PM — Investor check-in (1 hr)
- 4:30 PM — Product review (45 min)

**Insight**
Based on your productivity patterns, you perform best on strategic writing tasks before noon. Consider front-loading high-cognition work.`;

const ExecutiveAI = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: INITIAL_BRIEFING,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput('');

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: 'user',
        content: userMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setIsThinking(true);

    // Simulate AI thinking
    await new Promise((res) => setTimeout(res, 1400));

    const responses = {
      'generate my executive briefing for today': INITIAL_BRIEFING,
      default: `Understood. Here is my analysis on: **"${userMsg}"**\n\nBased on your current workload and strategic priorities, here are the key considerations:\n\n1. **Immediate Action** — Address any items that are time-sensitive or blocking team progress.\n2. **Strategic Alignment** — Ensure this aligns with your Q3 OKRs and longer-term roadmap.\n3. **Delegation Opportunity** — Consider which aspects can be delegated to free up your cognitive bandwidth for higher-leverage decisions.\n\nShall I draft a structured plan or prepare specific talking points?`,
    };

    const reply =
      responses[userMsg.toLowerCase()] || responses['default'];

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: 'assistant',
        content: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setIsThinking(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Render markdown-like bold
  const renderContent = (content) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-slate-100 font-semibold">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-2 pb-24 flex flex-col h-[calc(100vh-120px)] min-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Executive AI · Active</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-100 tracking-tight">
            Executive Briefing Assistant
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your intelligent command-center for strategic decisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([{
              id: 1,
              role: 'assistant',
              content: INITIAL_BRIEFING,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }])}
            className="p-2 rounded-xl border border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all cursor-pointer"
            title="Reset briefing"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { icon: Briefcase, label: 'OKRs On Track', value: '3/5', color: 'text-emerald-400' },
          { icon: Clock, label: 'Focus Time Left', value: '2.5h', color: 'text-blue-400' },
          { icon: TrendingUp, label: 'Productivity', value: '82%', color: 'text-purple-400' },
          { icon: FileText, label: 'Pending Reviews', value: '4', color: 'text-amber-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="bg-slate-950/30 border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-3"
          >
            <Icon size={14} className={`${color} shrink-0`} />
            <div>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">{label}</p>
              <p className={`text-sm font-bold ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-start gap-3 max-w-[85%]">
                  <div className="w-7 h-7 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={13} className="text-blue-400" />
                  </div>
                  <div className="group">
                    <div className="bg-slate-900/60 border border-white/5 rounded-2xl rounded-tl-sm px-5 py-4">
                      <p className="text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap font-mono">
                        {renderContent(msg.content)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] text-slate-600 font-mono">{msg.time}</span>
                      <button
                        onClick={() => copyToClipboard(msg.content)}
                        className="flex items-center gap-1 text-[9px] text-slate-600 hover:text-slate-400 cursor-pointer"
                      >
                        <Copy size={10} /> Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {msg.role === 'user' && (
                <div className="max-w-[70%]">
                  <div className="bg-slate-800/80 border border-white/10 rounded-2xl rounded-tr-sm px-5 py-3">
                    <p className="text-[11px] text-slate-200 font-medium">{msg.content}</p>
                  </div>
                  <p className="text-[9px] text-slate-600 font-mono mt-1 text-right">{msg.time}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Thinking indicator */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-7 h-7 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
              <Sparkles size={13} className="text-blue-400 animate-spin" />
            </div>
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl rounded-tl-sm px-5 py-4">
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-slate-500"
                  />
                ))}
                <span className="text-[10px] text-slate-600 ml-2 font-mono">Analyzing…</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompt starters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-none">
        {BRIEFING_STARTERS.map((s) => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/60 border border-white/5 hover:border-white/15 text-slate-400 hover:text-slate-200 rounded-xl text-[9px] font-medium whitespace-nowrap transition-all cursor-pointer shrink-0"
          >
            <ChevronRight size={10} />
            {s}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        <div className="flex-1 flex items-center gap-3 bg-slate-900/60 border border-white/10 focus-within:border-white/25 rounded-2xl px-4 py-3 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for a briefing, strategy, or decision framework…"
            className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
          />
          <button
            type="button"
            className="p-1 text-slate-600 hover:text-slate-300 transition-colors cursor-pointer"
            title="Voice input"
          >
            <Mic size={14} />
          </button>
        </div>
        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          className="p-3 rounded-2xl bg-slate-800 border border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};

export default ExecutiveAI;
