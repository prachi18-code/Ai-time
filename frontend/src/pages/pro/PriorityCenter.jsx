import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { Target, CheckCircle2, Circle, Plus, Trash2, ShieldAlert, Award } from 'lucide-react';

const PriorityCenter = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

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

  const handleAdd = (e) => {
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

  const deletePriority = (id) => {
    setPriorities(priorities.filter(p => p.id !== id));
  };

  const categories = ['Urgent & Important', 'Important & Upcoming', 'Urgent & Delegated', 'Upcoming Tasks'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 font-sans text-slate-300 select-none pb-24">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Corporate execution</span>
          <h1 className="font-sora font-extrabold text-xl text-slate-100 mt-1 flex items-center gap-2">
            <Target size={20} style={{ color: accentColor }} />
            Priority Center
          </h1>
        </div>
      </div>

      {/* Quick Add Form */}
      <GlassCard className="p-5 border-white/5 bg-slate-950/10">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">Record High-Leverage Priority</h3>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="Describe the priority item or blocker..."
            value={newPriorityText}
            onChange={e => setNewPriorityText(e.target.value)}
            className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-slate-400"
          />
          <select
            value={newPriorityCategory}
            onChange={e => setNewPriorityCategory(e.target.value)}
            className="bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none md:w-56"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-slate-950 text-xs font-semibold"
            style={{ backgroundColor: accentColor }}
          >
            Add Focus
          </button>
        </form>
      </GlassCard>

      {/* Eisenhower Matrix Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const catItems = priorities.filter(p => p.category === cat);
          return (
            <GlassCard key={cat} className="p-5 border-white/5 bg-slate-950/10 flex flex-col justify-between min-h-[180px]">
              <div>
                <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                  <h3 className={`text-xs font-mono uppercase tracking-wider font-bold ${
                    cat === 'Urgent & Important' ? 'text-red-400' :
                    cat === 'Important & Upcoming' ? 'text-sky-400' :
                    cat === 'Urgent & Delegated' ? 'text-yellow-400' :
                    'text-slate-400'
                  }`}>
                    {cat}
                  </h3>
                  <span className="text-[9px] font-mono text-slate-500 uppercase">
                    {cat === 'Urgent & Important' ? 'Do First' :
                     cat === 'Important & Upcoming' ? 'Schedule' :
                     cat === 'Urgent & Delegated' ? 'Delegate' : 'Eliminate'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {catItems.map(item => (
                    <div 
                      key={item.id}
                      className="group flex justify-between items-center p-2.5 border border-white/5 bg-slate-950/30 hover:border-white/10 transition-colors rounded-xl"
                    >
                      <button 
                        onClick={() => togglePriority(item.id)}
                        className="flex items-center gap-2.5 text-left text-xs text-slate-200"
                      >
                        {item.done ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Circle size={13} className="text-slate-500" />}
                        <span className={item.done ? 'line-through text-slate-500' : ''}>{item.text}</span>
                      </button>

                      <button
                        onClick={() => deletePriority(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}

                  {catItems.length === 0 && (
                    <p className="text-xs text-slate-600 italic py-4 text-center">No tasks recorded in this quadrant.</p>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

    </div>
  );
};

export default PriorityCenter;
