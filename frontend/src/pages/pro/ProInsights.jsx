import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { 
  BarChart2, Target, Briefcase, MessageSquare, FileText, 
  TrendingUp, CheckCircle2, Circle, Eye, Edit3, Trash2, Plus, 
  Search, MapPin, Send, Save, ArrowUpRight, ArrowDownRight, Award 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProInsights = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const [activeSubTab, setActiveSubTab] = useState('analytics');

  // SUB-TAB 1: ANALYTICS & REPORTS
  const weeklyStats = [
    { day: 'Mon', hours: 4.5 },
    { day: 'Tue', hours: 6.2 },
    { day: 'Wed', hours: 5.0 },
    { day: 'Thu', hours: 7.5 },
    { day: 'Fri', hours: 4.0 },
  ];
  const logs = [
    { id: 1, action: 'Focus Session Completed', detail: '75 mins Deep Work Block (System design)', time: 'Today' },
    { id: 2, action: 'Jira Issue Resolved', detail: 'Completed navigation bar refactoring', time: 'Yesterday' },
    { id: 3, action: 'Meeting Summary Compiled', detail: 'Strategic roadmap align checklist notes', time: 'Yesterday' },
  ];

  // SUB-TAB 2: PRIORITIES (Eisenhower Matrix)
  const [priorities, setPriorities] = useState([
    { id: 1, text: 'Resolve memory leak in React lifecycle cleanup', category: 'Urgent & Important', done: true },
    { id: 2, text: 'Review quarterly architecture design document', category: 'Urgent & Important', done: false },
    { id: 3, text: 'Sync with product marketing on launch timeline', category: 'Important & Upcoming', done: false },
    { id: 4, text: 'Complete AWS certification mock exam reviews', category: 'Important & Upcoming', done: false },
    { id: 5, text: 'Generate weekly staging build performance logs', category: 'Urgent & Delegated', done: true },
    { id: 6, text: 'Schedule design system audit review blocks', category: 'Upcoming Tasks', done: false },
  ]);
  const [newPriorityText, setNewPriorityText] = useState('');
  const [newPriorityCategory, setNewPriorityCategory] = useState('Urgent & Important');

  const handleAddPriority = (e) => {
    e.preventDefault();
    if (!newPriorityText.trim()) return;
    const item = {
      id: Date.now(),
      text: newPriorityText.trim(),
      category: newPriorityCategory,
      done: false
    };
    setPriorities([...priorities, item]);
    setNewPriorityText('');
  };

  const togglePriority = (id) => {
    setPriorities(priorities.map(p => p.id === id ? { ...p, done: !p.done } : p));
  };

  // SUB-TAB 3: CAREER GROWTH
  const [milestones] = useState([
    { id: 1, title: 'Senior Software Engineer Promotion', targetDate: 'Q4 2026', done: false, desc: 'Deliver core features, mentor 2 junior engineers, establish design system standards.' },
    { id: 2, title: 'AWS Solutions Architect Certification', targetDate: 'Aug 2026', done: true, desc: 'Study core services, pass mock exams, schedule certification.' },
    { id: 3, title: 'Lead System Architecture overhaul', targetDate: 'Q2 2027', done: false, desc: 'Redesign databases, migrate legacy services, optimize latency metrics.' },
  ]);
  const [skills] = useState([
    { name: 'React & Next.js Architecture', level: 90 },
    { name: 'Node.js Microservices', level: 85 },
    { name: 'System Design & Scalability', level: 70 },
    { name: 'Cloud Infrastructure (AWS)', level: 60 },
  ]);
  const [applications, setApplications] = useState([
    { id: 1, company: 'Stripe', role: 'Staff Engineer', status: 'Interviewing', location: 'Remote / NYC' },
    { id: 2, company: 'Linear', role: 'Senior Product Engineer', status: 'Applied', location: 'Remote / Europe' },
  ]);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleAddApp = (e) => {
    e.preventDefault();
    if (!newCompany || !newRole) return;
    const newApp = {
      id: Date.now(),
      company: newCompany,
      role: newRole,
      status: 'Applied',
      location: 'Remote'
    };
    setApplications([...applications, newApp]);
    setNewCompany('');
    setNewRole('');
  };

  // SUB-TAB 4: COMMUNICATIONS & FOLLOW-UPS
  const [channels] = useState([
    { id: 'acme', name: 'Acme Corp (#general)', lastMsg: 'Sarah: Please review the roadmap deck' },
    { id: 'vertex', name: 'Vertex Labs (#tech-sync)', lastMsg: 'John: API schemas are approved!' }
  ]);
  const [activeChannelId, setActiveChannelId] = useState('acme');
  const [messages, setMessages] = useState({
    acme: [
      { id: 1, sender: 'Sarah Jenkins', role: 'Client Lead', text: 'Hi team, checking on the dashboard redesign timeline. Do we have v2 wireframes?', time: '09:15 AM' },
      { id: 2, sender: 'Prachi', role: 'You', text: 'Good morning Sarah, they are being finalized.', time: '09:22 AM' }
    ],
    vertex: [
      { id: 1, sender: 'John Doe', role: 'CTO', text: 'Are the Docker containers deployed to staging?', time: 'Yesterday' }
    ]
  });
  const [comInput, setComInput] = useState('');
  const handleSendCom = (e) => {
    e.preventDefault();
    if (!comInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'Prachi',
      role: 'You',
      text: comInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => ({
      ...prev,
      [activeChannelId]: [...prev[activeChannelId], newMsg]
    }));
    setComInput('');
  };

  // SUB-TAB 5: NOTES WORKSPACE
  const [notes, setNotes] = useState([
    { id: 1, title: 'Q3 Product Strategy Sync', date: 'June 20, 2026', content: 'Agenda:\n1. Recap of Q2 performance and metrics.\n2. Review target deliverables for core dashboard revamp.\n3. Decide on Spotify OAuth integration strategies.\n\nNext Steps:\n- Developer to start ExperienceContext integration (Priority: High).' },
    { id: 2, title: 'Database Migration Checklist', date: 'June 18, 2026', content: 'Database updates:\n- Verify backups before modifying collections.\n- Add index key constraints to workspace items.' }
  ]);
  const [selectedNoteId, setSelectedNoteId] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const activeNote = notes.find(n => n.id === selectedNoteId) || notes[0];

  const handleStartEdit = () => {
    setEditTitle(activeNote.title);
    setEditContent(activeNote.content);
    setIsEditing(true);
  };
  const handleSaveNote = () => {
    setNotes(prev => prev.map(n => n.id === selectedNoteId ? { ...n, title: editTitle, content: editContent } : n));
    setIsEditing(false);
  };
  const handleAddNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      content: 'Start writing your meeting notes here...'
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 font-sans text-slate-300 select-none pb-24">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Corporate intelligence</span>
          <h1 className="font-sora font-extrabold text-xl text-slate-100 mt-1 flex items-center gap-2">
            <BarChart2 size={20} style={{ color: accentColor }} />
            Business Control Center
          </h1>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex gap-1.5 border-b border-white/5 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'analytics', label: '📊 Insights & Reports', icon: BarChart2 },
          { id: 'priorities', label: '🎯 Priority quadrants', icon: Target },
          { id: 'career', label: '💼 Growth Roadmap', icon: Briefcase },
          { id: 'communications', label: '📞 Client Communications', icon: MessageSquare },
          { id: 'notes', label: '📝 Notes Workspace', icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id);
              setIsEditing(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === tab.id
                ? 'bg-white/5 text-white border-white/10'
                : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Sub-Tab Rendering */}
      <AnimatePresence mode="wait">
        
        {/* 1. ANALYTICS */}
        {activeSubTab === 'analytics' && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-6 border-white/5 bg-slate-950/10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">Daily Focus Hours (This Week)</h3>
                  <span className="text-xs font-semibold text-slate-100 flex items-center gap-1">
                    <TrendingUp size={12} className="text-emerald-400" />
                    +12.4% vs last week
                  </span>
                </div>
                <div className="h-48 w-full flex items-end justify-between px-4 pb-2 border-b border-white/5 relative">
                  {weeklyStats.map((stat, idx) => {
                    const heightPercentage = (stat.hours / 8) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center flex-1 space-y-2">
                        <span className="text-[10px] font-mono text-slate-400">{stat.hours}h</span>
                        <div className="w-8 bg-slate-800 rounded-t-md relative overflow-hidden" style={{ height: `${heightPercentage}%` }}>
                          <div className="absolute inset-0" style={{ backgroundColor: accentColor, opacity: 0.85 }} />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{stat.day}</span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>
            <GlassCard className="p-6 border-white/5 bg-slate-950/10">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-4">Telemetry Logs</h3>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-950/40 border border-white/5 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-200">{log.action}</span>
                      <span className="text-[9px] font-mono text-slate-500">{log.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{log.detail}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* 2. PRIORITIES */}
        {activeSubTab === 'priorities' && (
          <motion.div key="priorities" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <GlassCard className="p-5 border-white/5 bg-slate-950/10">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">Add Priority Task</h3>
              <form onSubmit={handleAddPriority} className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="Describe priority item..."
                  value={newPriorityText}
                  onChange={e => setNewPriorityText(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
                <select
                  value={newPriorityCategory}
                  onChange={e => setNewPriorityCategory(e.target.value)}
                  className="bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none md:w-56"
                >
                  <option value="Urgent & Important">Urgent & Important</option>
                  <option value="Important & Upcoming">Important & Upcoming</option>
                  <option value="Urgent & Delegated">Urgent & Delegated</option>
                  <option value="Upcoming Tasks">Upcoming Tasks</option>
                </select>
                <button type="submit" className="px-5 py-2 rounded-xl text-slate-950 text-xs font-semibold" style={{ backgroundColor: accentColor }}>
                  Add Task
                </button>
              </form>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Urgent & Important', 'Important & Upcoming', 'Urgent & Delegated', 'Upcoming Tasks'].map(cat => {
                const catItems = priorities.filter(p => p.category === cat);
                return (
                  <GlassCard key={cat} className="p-5 border-white/5 bg-slate-950/10 min-h-[160px]">
                    <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">{cat}</h4>
                    </div>
                    <div className="space-y-1.5">
                      {catItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-2.5 border border-white/5 bg-slate-950/30 rounded-xl">
                          <button onClick={() => togglePriority(item.id)} className="flex items-center gap-2.5 text-xs text-slate-200">
                            {item.done ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Circle size={13} className="text-slate-500" />}
                            <span className={item.done ? 'line-through text-slate-500' : ''}>{item.text}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 3. CAREER GROWTH */}
        {activeSubTab === 'career' && (
          <motion.div key="career" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-6 border-white/5 bg-slate-950/10">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-4">Strategic Milestones</h3>
                <div className="space-y-4">
                  {milestones.map((ms, idx) => (
                    <div key={ms.id} className="relative flex gap-4 pl-6 py-0.5">
                      {idx < milestones.length - 1 && <span className="absolute left-[7px] top-6 bottom-[-24px] w-0.5 bg-white/5" />}
                      <span className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${ms.done ? 'bg-emerald-400 border-emerald-400' : 'bg-slate-950 border-white/20'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-200">{ms.title}</h4>
                          <span className="text-[9px] font-mono px-2 py-0.5 bg-white/5 rounded border border-white/5 text-slate-500">{ms.targetDate}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{ms.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6 border-white/5 bg-slate-950/10">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-4">Competency Map</h3>
                <div className="space-y-4">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-slate-300">{skill.name}</span>
                        <span className="font-mono text-[10px] text-slate-500">{skill.level}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-950/85 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${skill.level}%`, backgroundColor: accentColor }} />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <GlassCard className="p-6 border-white/5 bg-slate-950/10">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-4">Pipeline Metrics</h3>
              <div className="space-y-3">
                {applications.map(app => (
                  <div key={app.id} className="p-3 bg-slate-950/40 border border-white/5 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-200">{app.company}</h4>
                      <span className="text-[8px] font-mono bg-white/5 px-2 py-0.5 rounded-full">{app.status}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">{app.role}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* 4. COMMUNICATIONS */}
        {activeSubTab === 'communications' && (
          <motion.div key="communications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="space-y-3 col-span-1 bg-slate-950/20 border border-white/5 p-4 rounded-3xl">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">Streams</h3>
              {channels.map(chan => (
                <button
                  key={chan.id}
                  onClick={() => setActiveChannelId(chan.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer text-xs font-semibold ${activeChannelId === chan.id ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {chan.name}
                </button>
              ))}
            </div>

            <div className="lg:col-span-3">
              <GlassCard className="p-4 border-white/5 bg-slate-950/10 h-80 flex flex-col justify-between">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-none">
                  {messages[activeChannelId]?.map(msg => (
                    <div key={msg.id} className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'Prachi' ? 'ml-auto flex-row-reverse' : ''}`}>
                      <div className="p-3 rounded-2xl text-[11px] bg-slate-950/40 border border-white/5">
                        <p className="font-semibold text-slate-200">{msg.text}</p>
                        <span className="text-[8px] text-slate-600 block mt-1 font-mono">{msg.sender} • {msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendCom} className="border-t border-white/5 pt-3 flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Reply..."
                    value={comInput}
                    onChange={e => setComInput(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                  <button type="submit" className="px-3 bg-white text-slate-950 rounded-xl text-xs font-bold hover:bg-slate-200">Send</button>
                </form>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* 5. NOTES WORKSPACE */}
        {activeSubTab === 'notes' && (
          <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">Document Stack</h3>
                <button onClick={handleAddNote} className="text-[10px] font-bold text-slate-300 hover:text-white cursor-pointer">+ New Note</button>
              </div>
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {notes.map(note => (
                  <button
                    key={note.id}
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      setIsEditing(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${selectedNoteId === note.id ? 'bg-white/5 border-white/10' : 'bg-slate-950/20 border-white/5 hover:bg-slate-950/40'}`}
                  >
                    <h4 className="text-xs font-bold text-slate-200 truncate">{note.title}</h4>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">{note.date}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <GlassCard className="p-5 border-white/5 bg-slate-950/10 min-h-[300px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    ) : (
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{activeNote.title}</h4>
                        <span className="text-[8px] font-mono text-slate-500 block mt-0.5">{activeNote.date}</span>
                      </div>
                    )}

                    <div>
                      {isEditing ? (
                        <button onClick={handleSaveNote} className="px-2.5 py-1 bg-white text-slate-950 text-[10px] font-bold rounded-lg hover:bg-slate-200 transition-colors">Save</button>
                      ) : (
                        <button onClick={handleStartEdit} className="p-1.5 border border-white/5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"><Edit3 size={11} /></button>
                      )}
                    </div>
                  </div>

                  <div className="mt-2">
                    {isEditing ? (
                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        className="w-full h-40 bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-slate-200 focus:outline-none resize-none"
                      />
                    ) : (
                      <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap select-text h-40 overflow-y-auto">{activeNote.content}</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 mt-3 flex justify-between items-center text-[8px] font-mono text-slate-500">
                  <span>Markdown format supported</span>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default ProInsights;
