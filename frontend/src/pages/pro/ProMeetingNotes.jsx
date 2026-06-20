import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { FileText, Plus, Search, Tag, ArrowRight, Eye, Edit3, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProMeetingNotes = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const [notes, setNotes] = useState([
    { 
      id: 1, 
      title: 'Q3 Product Strategy Sync', 
      date: 'June 20, 2026', 
      category: 'Strategy', 
      content: 'Agenda:\n1. Recap of Q2 performance and metrics.\n2. Review target deliverables for core dashboard revamp.\n3. Decide on Spotify OAuth integration strategies.\n\nNext Steps:\n- Developer to start ExperienceContext integration (Priority: High).\n- Setup production build configurations before Friday.' 
    },
    { 
      id: 2, 
      title: 'Database Migration Checklist', 
      date: 'June 18, 2026', 
      category: 'Tech Spec', 
      content: 'Database updates:\n- Verify backups before modifying collections.\n- Add index key constraints to workspace items.\n- Confirm schema matches backend v2 API specs.' 
    },
    { 
      id: 3, 
      title: 'Sprint Retrospective Notes', 
      date: 'June 15, 2026', 
      category: 'Agile', 
      content: 'What went well:\n- Re-architected Theme engine cleanly.\n- Replaced legacy color values with dynamic variables.\n\nWhat can improve:\n- Onboarding flow needs clearer step transitions (Done in v2).' 
    },
  ]);

  const [selectedNoteId, setSelectedNoteId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const activeNote = notes.find(n => n.id === selectedNoteId) || notes[0];

  const handleSelectNote = (id) => {
    setSelectedNoteId(id);
    setIsEditing(false);
  };

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
      category: 'General',
      content: 'Start writing your meeting notes here...'
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setIsEditing(true);
  };

  const handleDeleteNote = (id) => {
    const filtered = notes.filter(n => n.id !== id);
    setNotes(filtered);
    if (filtered.length > 0) {
      setSelectedNoteId(filtered[0].id);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Strategy', 'Tech Spec', 'Agile', 'General'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 font-sans text-slate-300">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Corporate documents</span>
          <h1 className="font-sora font-extrabold text-xl text-slate-100 mt-1 flex items-center gap-2">
            <FileText size={20} style={{ color: accentColor }} />
            Meeting Notes
          </h1>
        </div>

        <button
          onClick={handleAddNote}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 transition-colors"
          style={{ backgroundColor: accentColor }}
        >
          <Plus size={14} /> New Note
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Note List & Filters */}
        <div className="space-y-4">
          
          {/* Search & Category Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/40 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-slate-400 transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-transparent border-white/5 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Stack */}
          <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <p className="text-xs text-slate-600 italic text-center py-4">No notes found.</p>
            ) : (
              filteredNotes.map(note => (
                <button
                  key={note.id}
                  onClick={() => handleSelectNote(note.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedNoteId === note.id
                      ? 'bg-white/5 border-white/10'
                      : 'bg-slate-950/20 border-white/5 hover:bg-slate-950/40 hover:border-white/10'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-semibold text-slate-200 truncate">{note.title}</h4>
                      <span className="text-[9px] font-mono text-slate-500 shrink-0">{note.date}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-400">
                      {note.category}
                    </span>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="text-[9px] font-mono text-red-500 hover:text-red-400 px-1 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </button>
              ))
            )}
          </div>

        </div>

        {/* Right Side: Note Editor/Viewer */}
        <div className="lg:col-span-2">
          {activeNote ? (
            <GlassCard className="p-6 border-white/5 bg-slate-950/10 h-full flex flex-col justify-between min-h-[400px]">
              
              {/* Note Header */}
              <div className="border-b border-white/5 pb-4 mb-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 text-sm text-white font-semibold focus:outline-none focus:border-slate-400 transition-colors"
                      placeholder="Note Title"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-500">{activeNote.date}</span>
                      <button 
                        onClick={handleSaveNote}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] text-slate-900 font-bold transition-colors cursor-pointer"
                        style={{ backgroundColor: accentColor }}
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-100 font-sora">{activeNote.title}</h2>
                      <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                        {activeNote.date} • {activeNote.category}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={handleStartEdit}
                        className="p-2 border border-white/5 hover:bg-white/5 text-slate-400 hover:text-slate-200 rounded-xl transition-all"
                        title="Edit Note"
                      >
                        <Edit3 size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Note Content Editor / Viewer */}
              <div className="flex-1">
                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="w-full h-64 bg-white/5 border border-white/5 rounded-xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-slate-400 transition-colors resize-none"
                    placeholder="Write content here..."
                  />
                ) : (
                  <div className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap select-text h-64 overflow-y-auto">
                    {activeNote.content}
                  </div>
                )}
              </div>

              {/* Note Footer */}
              {!isEditing && (
                <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>Markdown formatting supported</span>
                  <span className="flex items-center gap-1"><Eye size={10} /> Reading mode</span>
                </div>
              )}

            </GlassCard>
          ) : (
            <div className="h-full flex items-center justify-center p-8 border border-dashed border-white/5 rounded-3xl text-slate-500 italic text-xs">
              Select or create a note to begin.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ProMeetingNotes;
