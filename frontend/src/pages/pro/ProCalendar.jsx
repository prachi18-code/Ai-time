import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { Calendar, Plus, Clock, Video, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProCalendar = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const [activeWeekOffset, setActiveWeekOffset] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '2026-06-22', time: '10:00', duration: '60', category: 'General' });

  const [events, setEvents] = useState([
    { id: 1, title: 'Sync with frontend team', date: '2026-06-22', time: '10:00', duration: '30m', category: 'Team', type: 'meeting' },
    { id: 2, title: 'Refactor database models', date: '2026-06-22', time: '13:00', duration: '90m', category: 'Deep Work', type: 'focus' },
    { id: 3, title: 'One-on-one check-in', date: '2026-06-23', time: '14:00', duration: '30m', category: '1:1', type: 'meeting' },
    { id: 4, title: 'Release build verification', date: '2026-06-24', time: '16:00', duration: '60m', category: 'QA', type: 'deployment' },
    { id: 5, title: 'Product backlog grooming', date: '2026-06-25', time: '11:00', duration: '45m', category: 'Strategy', type: 'meeting' },
  ]);

  const addEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title) return;
    const formatted = {
      id: Date.now(),
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      duration: `${newEvent.duration}m`,
      category: newEvent.category,
      type: 'focus'
    };
    setEvents([...events, formatted]);
    setShowAddModal(false);
    setNewEvent({ title: '', date: '2026-06-22', time: '10:00', duration: '60', category: 'General' });
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const daysOfWeek = [
    { label: 'Mon', num: '22', dateStr: '2026-06-22' },
    { label: 'Tue', num: '23', dateStr: '2026-06-23' },
    { label: 'Wed', num: '24', dateStr: '2026-06-24' },
    { label: 'Thu', num: '25', dateStr: '2026-06-25' },
    { label: 'Fri', num: '26', dateStr: '2026-06-26' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 font-sans text-slate-300">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Workspace agenda</span>
          <h1 className="font-sora font-extrabold text-xl text-slate-100 mt-1 flex items-center gap-2">
            <Calendar size={20} style={{ color: accentColor }} />
            Calendar Briefing
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 transition-colors"
          style={{ backgroundColor: accentColor }}
        >
          <Plus size={14} /> Add Event
        </button>
      </div>

      {/* Week Navigation bar */}
      <div className="flex items-center justify-between bg-slate-950/20 border border-white/5 p-2 rounded-2xl">
        <div className="flex items-center gap-1">
          <button onClick={() => setActiveWeekOffset(prev => prev - 1)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-semibold text-slate-200">June 2026</span>
          <button onClick={() => setActiveWeekOffset(prev => prev + 1)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="flex gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg">Week View</span>
          <span className="text-[10px] font-mono text-slate-500 px-2.5 py-1 rounded-lg">Month</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Weekly Columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-5 gap-2 text-center">
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className="bg-slate-950/30 border border-white/5 p-3 rounded-2xl">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">{day.label}</span>
                <span className="text-base font-extrabold text-slate-200 mt-1 block">{day.num}</span>
              </div>
            ))}
          </div>

          <GlassCard className="p-6 border-white/5 bg-slate-950/10">
            <div className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500">Timeline Scheduler</h2>
              <div className="divide-y divide-white/5">
                {daysOfWeek.map((day, dayIdx) => {
                  const dayEvents = events.filter(e => e.date === day.dateStr);
                  return (
                    <div key={dayIdx} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start gap-4">
                      <div className="md:w-32 shrink-0">
                        <p className="text-xs font-semibold text-slate-200">{day.label}, June {day.num}</p>
                        <p className="text-[9px] font-mono text-slate-500 mt-0.5">{dayEvents.length} Tasks Scheduled</p>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        {dayEvents.length === 0 ? (
                          <p className="text-xs text-slate-600 italic">No events scheduled.</p>
                        ) : (
                          dayEvents.map(evt => (
                            <div 
                              key={evt.id} 
                              className="group flex justify-between items-center p-3 rounded-xl border border-white/5 bg-slate-950/30 hover:border-white/10 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-1.5 h-10 rounded-full" 
                                  style={{ backgroundColor: evt.type === 'meeting' ? '#38bdf8' : evt.type === 'deployment' ? '#f472b6' : accentColor }} 
                                />
                                <div>
                                  <h4 className="text-xs font-semibold text-slate-200">{evt.title}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] font-mono text-slate-500 uppercase flex items-center gap-0.5">
                                      <Clock size={8} /> {evt.time} ({evt.duration})
                                    </span>
                                    <span className="text-[9px] font-mono text-slate-500 uppercase">
                                      • {evt.category}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={() => deleteEvent(evt.id)}
                                className="opacity-0 group-hover:opacity-100 text-[10px] text-red-400 hover:text-red-300 font-mono transition-opacity cursor-pointer px-2"
                              >
                                Delete
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Event list / Stats */}
        <div className="space-y-6">
          <GlassCard className="p-6 border-white/5 bg-slate-950/10">
            <h3 className="text-sm font-semibold text-slate-100 mb-3 flex items-center gap-1.5">
              <Clock size={16} style={{ color: accentColor }} />
              Meeting Integrations
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Your calendars are synchronized via OAuth with Outlook and Google Workspace.
            </p>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Linked Accounts</span>
                  <span className="text-xs font-semibold text-slate-200">Google Calendar</span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Active</span>
              </div>
              <div className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Linked Accounts</span>
                  <span className="text-xs font-semibold text-slate-200">Outlook Calendar</span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400">Not Linked</span>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-slate-950 border border-white/10 p-6 rounded-3xl space-y-4"
            >
              <h3 className="font-sora font-extrabold text-sm text-slate-100">Schedule Workspace Event</h3>
              
              <form onSubmit={addEvent} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Event Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Design review session"
                    value={newEvent.title}
                    onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Date</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Time</label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Duration (mins)</label>
                    <input
                      type="number"
                      value={newEvent.duration}
                      onChange={e => setNewEvent({...newEvent, duration: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Category</label>
                    <select
                      value={newEvent.category}
                      onChange={e => setNewEvent({...newEvent, category: e.target.value})}
                      className="w-full bg-slate-900 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
                    >
                      <option value="Team">Team</option>
                      <option value="Deep Work">Deep Work</option>
                      <option value="1:1">1:1</option>
                      <option value="Strategy">Strategy</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/5 text-slate-400 hover:text-slate-200 text-xs font-semibold hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-slate-950 text-xs font-semibold transition-colors"
                    style={{ backgroundColor: accentColor }}
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProCalendar;
