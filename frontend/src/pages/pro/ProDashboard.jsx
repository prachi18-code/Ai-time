import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { 
  Calendar, CheckCircle2, Circle, TrendingUp, Clock, 
  ChevronRight, Play, Pause, Music, Search, Command, ArrowRight, Save, Trash, Coffee, Compass, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Dynamic greeting ─────────────────────────────────────────────────────────
const getTimeGreeting = () => {
  const h = new Date().getHours();
  if (h < 5)  return { salutation: 'Still burning midnight oil', icon: '🌙', sub: 'Late night grind detected. Take a break when you can.' };
  if (h < 9)  return { salutation: 'Good morning', icon: '☀️', sub: 'Early start — your best leverage window is right now.' };
  if (h < 12) return { salutation: 'Good morning', icon: '🌤️', sub: 'Peak cognitive hours. Tackle your hardest task first.' };
  if (h < 14) return { salutation: 'Good afternoon', icon: '☀️', sub: 'Post-lunch — protect your focus block from meetings.' };
  if (h < 18) return { salutation: 'Good afternoon', icon: '🌤️', sub: 'Strong finish window. Clear the priority matrix.' };
  if (h < 21) return { salutation: 'Good evening', icon: '🌇', sub: 'Wind-down mode. Review tomorrow\'s agenda now.' };
  return { salutation: 'Late night', icon: '🌙', sub: 'Rest is a productivity strategy. Wrap up soon.' };
};

// ── Personalized insights ─────────────────────────────────────────────────────
const PRO_INSIGHTS = [
  { icon: '📈', label: 'Revenue Trend', value: '+12% MoM', color: '#34d399', hint: 'Above target' },
  { icon: '🤝', label: 'Client Health', value: '4 Active', color: '#60a5fa', hint: '1 follow-up due' },
  { icon: '📋', label: 'Open Tasks', value: '7 items', color: '#f59e0b', hint: '2 urgent today' },
  { icon: '🎯', label: 'OKR Progress', value: '68%', color: '#a78bfa', hint: 'Q3 on track' },
];

const ProDashboard = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { theme, themes } = useTheme();
  
  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  // Command Bar Simulator State
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  
  const commands = [
    { name: 'Start Deep Work Block', desc: 'Trigger focus session telemetry', action: () => setActiveTab('focus') },
    { name: 'Schedule New Calendar Event', desc: 'Open calendar planner scheduler', action: () => setActiveTab('calendar') },
    { name: 'Draft Meeting Note', desc: 'Create a new editor notes document', action: () => setActiveTab('notes') },
    { name: 'Review Active OKRs', desc: 'Check goals objectives status', action: () => setActiveTab('goals') },
  ];

  const filteredCommands = commands.filter(c => c.name.toLowerCase().includes(commandQuery.toLowerCase()));

  // Eisenhower Matrix State
  const [matrix, setMatrix] = useState({
    urgentImportant: [
      { id: 'ui1', text: 'Resolve memory leak in React lifecycle cleanup', done: true },
      { id: 'ui2', text: 'Review quarterly architecture design document', done: false }
    ],
    importantUpcoming: [
      { id: 'iu1', text: 'Sync with product marketing on launch timeline', done: false },
      { id: 'iu2', text: 'Complete AWS certification mock exam reviews', done: false }
    ],
    urgentDelegated: [
      { id: 'ud1', text: 'Generate weekly staging build performance logs', done: true }
    ],
    upcomingTasks: [
      { id: 'ut1', text: 'Schedule design system audit review blocks', done: false }
    ]
  });

  const toggleTask = (category, id) => {
    setMatrix(prev => {
      const updated = { ...prev };
      updated[category] = updated[category].map(t => t.id === id ? { ...t, done: !t.done } : t);
      return updated;
    });
  };

  // Agenda Events
  const [calendarEvents] = useState([
    { time: '09:30 AM', title: 'Daily Standup Sync', duration: '15m' },
    { time: '11:00 AM', title: 'Code Architecture Review', duration: '60m' },
    { time: '02:00 PM', title: '1-on-1 with Engineering Manager', duration: '30m' },
  ]);

  // Deep Work Mode Dashboard Timer
  const [focusTime, setFocusTime] = useState(45 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setFocusTime(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 45 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const toggleFocusTimer = () => setTimerRunning(!timerRunning);
  const resetFocusTimer = () => {
    setTimerRunning(false);
    setFocusTime(45 * 60);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Quick Notes State
  const [quickNotes, setQuickNotes] = useState(() => {
    return JSON.parse(localStorage.getItem('aether_quick_notes')) || [
      { id: 1, text: 'Discuss cache strategy with engineering lead' },
      { id: 2, text: 'Remember to verify staging endpoints' }
    ];
  });
  const [noteInput, setNoteInput] = useState('');

  const saveQuickNote = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    const newNotes = [{ id: Date.now(), text: noteInput.trim() }, ...quickNotes];
    setQuickNotes(newNotes);
    localStorage.setItem('aether_quick_notes', JSON.stringify(newNotes));
    setNoteInput('');
  };

  const deleteQuickNote = (id) => {
    const nextNotes = quickNotes.filter(n => n.id !== id);
    setQuickNotes(nextNotes);
    localStorage.setItem('aether_quick_notes', JSON.stringify(nextNotes));
  };

  const greeting = useMemo(() => getTimeGreeting(), []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 font-sans text-slate-300 select-none pb-24">
      
      {/* Dynamic Greeting Header + Command Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[9px] font-mono uppercase tracking-widest text-slate-500"
          >
            {greeting.icon} {greeting.sub}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-sora font-extrabold text-xl text-slate-100 tracking-tight mt-1"
          >
            {greeting.salutation}, {user?.name?.split(' ')[0] || 'Partner'}.
          </motion.h1>
        </div>

        {/* Command bar input */}
        <div 
          onClick={() => setCommandOpen(true)}
          className="w-full md:w-80 bg-slate-950/40 border border-white/5 hover:border-white/10 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs text-slate-500 cursor-pointer transition-colors group"
        >
          <span className="flex items-center gap-2">
            <Search size={12} />
            <span>Type a command or search...</span>
          </span>
          <kbd className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono group-hover:bg-white/8 transition-colors">⌘K</kbd>
        </div>
      </div>

      {/* Personalized Insights Strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {PRO_INSIGHTS.map((ins, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            whileHover={{ scale: 1.02, y: -1 }}
            className="bg-slate-950/30 border border-white/5 rounded-2xl p-3.5 hover:border-white/10 transition-all cursor-default"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-base">{ins.icon}</span>
              <span className="text-[8px] font-mono text-slate-600 uppercase">{ins.hint}</span>
            </div>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{ins.label}</p>
            <p className="text-sm font-extrabold mt-0.5" style={{ color: ins.color }}>{ins.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Contextual Briefing Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-5 border-white/5 bg-gradient-to-br from-slate-950/50 via-slate-900/15 to-slate-950/50">
          <div className="flex items-start gap-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 6, duration: 0.6 }}
              className="p-2.5 bg-white/5 border border-white/8 rounded-xl text-slate-400 shrink-0"
            >
              <Coffee size={20} />
            </motion.div>
            <div className="space-y-2.5 flex-1">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Nova Executive Briefing</span>
                <h2 className="text-sm font-extrabold text-slate-100 mt-0.5">
                  Here's your leverage framework for today.
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white/2 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">High Leverage Target</span>
                  <p className="text-xs font-semibold text-slate-200 mt-1">Architecture signoff before 2:00 PM</p>
                </div>
                <div className="bg-white/2 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Daily Agenda</span>
                  <p className="text-xs font-semibold text-slate-200 mt-1">3 scheduled sync blocks on deck</p>
                </div>
                <div className="bg-white/2 border border-white/5 p-3 rounded-xl flex items-center justify-between hover:border-white/10 transition-colors">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Executive AI</span>
                    <p className="text-xs font-semibold text-slate-200 mt-1">Ready for consultation</p>
                  </div>
                  <motion.button 
                    onClick={() => setActiveTab('executiveai')}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1.5 rounded-lg bg-white/5 text-white hover:bg-white/12 transition-colors cursor-pointer"
                  >
                    <ArrowRight size={12} />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Main Eisenhower Priority Matrix (2x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Box 1: Urgent & Important */}
        <GlassCard className="p-5 border-white/5 bg-slate-950/10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
              🔴 Urgent & Important
            </h3>
            <span className="text-[9px] font-mono text-slate-500">Do First</span>
          </div>
          <div className="space-y-1.5">
            {matrix.urgentImportant.map(t => (
              <button 
                key={t.id} 
                onClick={() => toggleTask('urgentImportant', t.id)}
                className={`w-full flex items-center gap-2.5 p-2.5 border rounded-lg text-left text-xs ${
                  t.done ? 'opacity-40 bg-slate-950/20 border-white/5' : 'bg-white/2 border-white/5 hover:bg-white/4'
                }`}
              >
                {t.done ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Circle size={13} className="text-slate-500" />}
                <span className={t.done ? 'line-through text-slate-500' : 'text-slate-200'}>{t.text}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Box 2: Important & Upcoming */}
        <GlassCard className="p-5 border-white/5 bg-slate-950/10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold">
              🔵 Important & Upcoming
            </h3>
            <span className="text-[9px] font-mono text-slate-500">Schedule</span>
          </div>
          <div className="space-y-1.5">
            {matrix.importantUpcoming.map(t => (
              <button 
                key={t.id} 
                onClick={() => toggleTask('importantUpcoming', t.id)}
                className={`w-full flex items-center gap-2.5 p-2.5 border rounded-lg text-left text-xs ${
                  t.done ? 'opacity-40 bg-slate-950/20 border-white/5' : 'bg-white/2 border-white/5 hover:bg-white/4'
                }`}
              >
                {t.done ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Circle size={13} className="text-slate-500" />}
                <span className={t.done ? 'line-through text-slate-500' : 'text-slate-200'}>{t.text}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Box 3: Urgent & Delegate */}
        <GlassCard className="p-5 border-white/5 bg-slate-950/10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-yellow-400 font-bold">
              🟡 Urgent & Delegated
            </h3>
            <span className="text-[9px] font-mono text-slate-500">Delegate</span>
          </div>
          <div className="space-y-1.5">
            {matrix.urgentDelegated.map(t => (
              <button 
                key={t.id} 
                onClick={() => toggleTask('urgentDelegated', t.id)}
                className={`w-full flex items-center gap-2.5 p-2.5 border rounded-lg text-left text-xs ${
                  t.done ? 'opacity-40 bg-slate-950/20 border-white/5' : 'bg-white/2 border-white/5 hover:bg-white/4'
                }`}
              >
                {t.done ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Circle size={13} className="text-slate-500" />}
                <span className={t.done ? 'line-through text-slate-500' : 'text-slate-200'}>{t.text}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Box 4: Upcoming Tasks */}
        <GlassCard className="p-5 border-white/5 bg-slate-950/10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              ⚫ Upcoming Tasks
            </h3>
            <span className="text-[9px] font-mono text-slate-500">Eliminate</span>
          </div>
          <div className="space-y-1.5">
            {matrix.upcomingTasks.map(t => (
              <button 
                key={t.id} 
                onClick={() => toggleTask('upcomingTasks', t.id)}
                className={`w-full flex items-center gap-2.5 p-2.5 border rounded-lg text-left text-xs ${
                  t.done ? 'opacity-40 bg-slate-950/20 border-white/5' : 'bg-white/2 border-white/5 hover:bg-white/4'
                }`}
              >
                {t.done ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Circle size={13} className="text-slate-500" />}
                <span className={t.done ? 'line-through text-slate-500' : 'text-slate-200'}>{t.text}</span>
              </button>
            ))}
          </div>
        </GlassCard>

      </div>

      {/* Grid: Schedule and Focus session indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar brief */}
        <GlassCard className="p-6 border-white/5 bg-slate-950/10 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Calendar size={16} style={{ color: accentColor }} />
              Schedule Agenda
            </h2>
            <button 
              onClick={() => setActiveTab('calendar')}
              className="text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-0.5"
            >
              Calendar Planner <ChevronRight size={10} />
            </button>
          </div>

          <div className="space-y-3">
            {calendarEvents.map((evt, idx) => (
              <div key={idx} className="flex gap-3 items-start border-l border-white/5 pl-3.5 py-0.5">
                <span className="text-[10px] font-mono text-slate-500 shrink-0 w-16">{evt.time}</span>
                <div>
                  <p className="text-xs font-semibold text-slate-200">{evt.title}</p>
                  <p className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">
                    Duration: {evt.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Dashboard Deep Work timer */}
        <GlassCard className="p-6 border-white/5 bg-slate-950/10 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-2">
              <Clock size={16} style={{ color: accentColor }} />
              Deep Work Timer
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4 font-medium">
              Synchronize focused intervals with active tasks and block distractions.
            </p>

            <div className="py-4 flex flex-col items-center">
              <span className="text-3xl font-mono text-slate-100 font-extrabold">{formatTime(focusTime)}</span>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={toggleFocusTimer}
                  className="px-4 py-1.5 rounded-full bg-white text-slate-950 text-[10px] font-semibold flex items-center gap-1 hover:bg-slate-200 transition-colors"
                >
                  {timerRunning ? <Pause size={10} /> : <Play size={10} />}
                  {timerRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={resetFocusTimer}
                  className="px-3 py-1.5 rounded-full border border-white/10 text-slate-400 text-[10px] hover:text-white transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('focus')}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 mt-2"
          >
            Launch Deep Work Space <Compass size={12} />
          </button>
        </GlassCard>

      </div>

      {/* Quick Notes Widget */}
      <GlassCard className="p-6 border-white/5 bg-slate-950/10">
        <h3 className="text-sm font-semibold text-slate-100 mb-3 flex items-center gap-2">
          📝 Quick Notes Scratchpad
        </h3>

        <form onSubmit={saveQuickNote} className="flex gap-2 mb-4">
          <input
            type="text"
            required
            placeholder="Jot down a quick thought or action item..."
            value={noteInput}
            onChange={e => setNoteInput(e.target.value)}
            className="flex-1 bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/20"
          />
          <button
            type="submit"
            className="p-2.5 bg-white text-slate-950 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center"
          >
            <Save size={14} />
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickNotes.map((note) => (
            <div key={note.id} className="p-3 bg-white/2 border border-white/5 rounded-xl flex justify-between items-center group">
              <span className="text-xs text-slate-300 leading-normal font-medium">{note.text}</span>
              <button
                onClick={() => deleteQuickNote(note.id)}
                className="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-2"
              >
                <Trash size={12} />
              </button>
            </div>
          ))}
          {quickNotes.length === 0 && (
            <p className="text-xs text-slate-500 italic py-2 text-center col-span-2">No quick notes saved yet.</p>
          )}
        </div>
      </GlassCard>

      {/* Raycast Command Bar Modal */}
      <AnimatePresence>
        {commandOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 backdrop-blur-sm p-4 pt-20">
            {/* Click outer to close */}
            <div className="absolute inset-0" onClick={() => setCommandOpen(false)} />
            
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-lg bg-slate-950 border border-white/10 p-4 rounded-2xl space-y-3 z-10 shadow-2xl relative"
            >
              <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                <Command size={14} className="text-slate-500" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search actions, dashboards, folders..."
                  value={commandQuery}
                  onChange={e => setCommandQuery(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder-slate-500"
                />
              </div>

              <div className="space-y-1 max-h-60 overflow-y-auto">
                <span className="text-[9px] font-mono text-slate-500 uppercase px-1.5 py-0.5 block">Actions</span>
                {filteredCommands.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      cmd.action();
                      setCommandOpen(false);
                    }}
                    className="w-full text-left p-2.5 hover:bg-white/5 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer group"
                  >
                    <div>
                      <span className="font-semibold text-slate-200 group-hover:text-white">{cmd.name}</span>
                      <p className="text-[9px] text-slate-500 mt-0.5">{cmd.desc}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Run Action</span>
                  </button>
                ))}
                {filteredCommands.length === 0 && (
                  <p className="text-xs text-slate-500 italic p-3 text-center">No commands found matching "{commandQuery}"</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProDashboard;
