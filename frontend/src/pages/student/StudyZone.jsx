import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { BookOpen, Plus, FileText, Clock, ChevronRight, Award, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudyZone = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Operating Systems 💻', hours: 14, color: '#f472b6' },
    { id: 2, name: 'Data Structures & Algorithms 🧠', hours: 32, color: '#a855f7' },
    { id: 3, name: 'Computer Networks 🌐', hours: 8, color: '#06b6d4' },
  ]);

  const [notes, setNotes] = useState([
    { id: 1, title: 'Process Synchronization', subject: 'Operating Systems', content: 'Semaphores are integer variables used for solving critical section problems. Wait() decrements, signal() increments.' },
    { id: 2, title: 'Dijkstra Shortest Path', subject: 'Data Structures & Algorithms', content: 'Greedy algorithm to find shortest path from single source. Time complexity with binary heap is O((V+E) log V).' },
  ]);

  const [studySessions] = useState([
    { id: 1, date: 'Today', duration: '45 mins', subject: 'Data Structures & Algorithms' },
    { id: 2, date: 'Yesterday', duration: '90 mins', subject: 'Operating Systems' },
    { id: 3, date: 'Jun 18', duration: '60 mins', subject: 'Computer Networks' },
  ]);

  const [newSubName, setNewSubName] = useState('');
  const [showAddSub, setShowAddSub] = useState(false);

  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteSub, setNewNoteSub] = useState('Operating Systems 💻');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubName) return;
    const newSub = {
      id: Date.now(),
      name: newSubName,
      hours: 0,
      color: ['#ec4899', '#a855f7', '#06b6d4', '#eab308'][Math.floor(Math.random() * 4)]
    };
    setSubjects([...subjects, newSub]);
    setNewSubName('');
    setShowAddSub(false);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteTitle || !newNoteContent) return;
    const n = {
      id: Date.now(),
      title: newNoteTitle,
      subject: newNoteSub.split(' ')[0],
      content: newNoteContent
    };
    setNotes([n, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setShowAddNote(false);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 font-sans select-none pb-24 text-slate-200">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <span className="sticker-badge sticker-purple mb-1">Study Dashboard</span>
          <h1 className="font-sora font-black text-2xl text-slate-100 mt-1 flex items-center gap-2">
            <BookOpen size={24} style={{ color: accentColor }} />
            Study Zone
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Subjects & Session Logs */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Subjects Card list */}
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-sora font-extrabold text-slate-100">📚 Active Subjects</h2>
              <button 
                onClick={() => setShowAddSub(!showAddSub)}
                className="text-[10px] font-space font-black uppercase text-purple-400 hover:text-purple-300 cursor-pointer"
              >
                {showAddSub ? 'Cancel' : '+ Add Subject'}
              </button>
            </div>

            <AnimatePresence>
              {showAddSub && (
                <motion.form 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleAddSubject}
                  className="mb-4 bg-black/20 p-4 rounded-2xl border border-white/5 space-y-3 overflow-hidden"
                >
                  <input
                    type="text"
                    required
                    placeholder="Subject title (e.g. Database Systems 🛢️)..."
                    value={newSubName}
                    onChange={e => setNewSubName(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                  <button type="submit" className="w-full py-2 bg-purple-500 text-white font-space font-black text-[10px] uppercase rounded-xl">
                    Create Subject
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {subjects.map(sub => (
                <div 
                  key={sub.id} 
                  className="p-4 rounded-2xl border border-white/5 bg-slate-950/20 text-left space-y-3 hover:border-white/10 transition-colors"
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                  <div>
                    <h3 className="text-xs font-black text-slate-200">{sub.name}</h3>
                    <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">
                      {sub.hours} Study Hours
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Notes Workspace */}
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-sora font-extrabold text-slate-100">📝 Lecture Notes Deck</h2>
              <button 
                onClick={() => setShowAddNote(!showAddNote)}
                className="text-[10px] font-space font-black uppercase text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                {showAddNote ? 'Cancel' : '+ New Note'}
              </button>
            </div>

            <AnimatePresence>
              {showAddNote && (
                <motion.form 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleAddNote}
                  className="mb-4 bg-black/20 p-4 rounded-2xl border border-white/5 space-y-3 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Note Title..."
                      value={newNoteTitle}
                      onChange={e => setNewNoteTitle(e.target.value)}
                      className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                    <select
                      value={newNoteSub}
                      onChange={e => setNewNoteSub(e.target.value)}
                      className="bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                    >
                      {subjects.map(sub => (
                        <option key={sub.id} value={sub.name}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    required
                    placeholder="Note description / formula details..."
                    value={newNoteContent}
                    onChange={e => setNewNoteContent(e.target.value)}
                    className="w-full h-24 bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-400 resize-none"
                  />
                  <button type="submit" className="w-full py-2 bg-cyan-500 text-slate-950 font-space font-black text-[10px] uppercase rounded-xl">
                    Save Lecture Note
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map(note => (
                <div key={note.id} className="p-4 bg-white/2 border border-white/5 rounded-[22px] flex flex-col justify-between space-y-3 hover:border-white/10 transition-colors">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-space px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-extrabold uppercase">
                        {note.subject}
                      </span>
                      <button onClick={() => handleDeleteNote(note.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                        <Trash size={12} />
                      </button>
                    </div>
                    <h4 className="text-xs font-black text-slate-200 mt-2">{note.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-1 font-medium">{note.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>

        {/* Right Side: Session logs */}
        <div className="space-y-6">
          <GlassCard className="p-6 relative overflow-hidden bg-slate-950/40">
            <h2 className="font-sora font-extrabold text-sm text-slate-100 mb-4 flex items-center gap-2">
              <Clock size={16} style={{ color: accentColor }} />
              Study Session Logs
            </h2>

            <div className="space-y-3">
              {studySessions.map(session => (
                <div key={session.id} className="p-3 bg-slate-950/40 border border-white/5 rounded-2xl text-left flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    ⏱️
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-200">{session.subject}</p>
                    <p className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">
                      Duration: {session.duration} • {session.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};

export default StudyZone;
