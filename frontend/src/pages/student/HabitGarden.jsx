import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { CheckCircle2, Circle, Sprout, Plus, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HabitGarden = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const [habits, setHabits] = useState([
    { id: 1, text: 'Drink 3L water 💧', done: false, type: 'grass', xp: 10 },
    { id: 2, text: 'Solve 1 DSA problem 💻', done: false, type: 'flower', xp: 25 },
    { id: 3, text: 'Deep breathing for 5 mins 🧠', done: false, type: 'tree', xp: 15 },
    { id: 4, text: 'Read 5 pages of a book 📚', done: true, type: 'flower', xp: 20 },
  ]);

  const [newHabitText, setNewHabitText] = useState('');
  const [newHabitType, setNewHabitType] = useState('flower');

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitText) return;
    const h = {
      id: Date.now(),
      text: newHabitText,
      done: false,
      type: newHabitType,
      xp: 15
    };
    setHabits([...habits, h]);
    setNewHabitText('');
  };

  // Particle celebrations
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const triggerCelebration = (emoji) => {
    const id = Date.now();
    const newEmoji = {
      id,
      emoji,
      left: Math.random() * 80 + 10,
      top: Math.random() * 50 + 20,
    };
    setFloatingEmojis(prev => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(item => item.id !== id));
    }, 1200);
  };

  const toggleHabit = (id) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextDone = !h.done;
        let xpChange = h.xp || 15;
        let currentXP = parseInt(localStorage.getItem('aether_xp') || '250', 10);
        
        if (nextDone) {
          currentXP += xpChange;
          triggerCelebration(h.type === 'flower' ? '🌸' : h.type === 'tree' ? '🌲' : '🌿');
          setTimeout(() => triggerCelebration('✨'), 200);
        } else {
          currentXP = Math.max(0, currentXP - xpChange);
        }
        
        localStorage.setItem('aether_xp', currentXP.toString());
        return { ...h, done: nextDone };
      }
      return h;
    }));
  };

  const completedHabits = habits.filter(h => h.done);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 font-sans select-none pb-24 text-slate-200 relative">
      
      {/* Floating particles celebration effect */}
      <AnimatePresence>
        {floatingEmojis.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 2.5, y: -160, rotate: 30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute pointer-events-none text-4xl z-50 font-bold"
            style={{ left: `${item.left}%`, top: `${item.top}%` }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <span className="sticker-badge sticker-cyan mb-1">INTERACTIVE HABITS</span>
          <h1 className="font-sora font-black text-2xl text-slate-100 mt-1 flex items-center gap-2">
            <Sprout size={24} style={{ color: accentColor }} />
            Habit Garden
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Habit Checklist Panel */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-sora font-extrabold text-slate-100">🌿 Daily Habit Checklist</h2>
              <span className="text-[10px] font-space text-slate-500 uppercase font-black">
                {completedHabits.length}/{habits.length} Complete
              </span>
            </div>

            <div className="space-y-2">
              {habits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-full flex items-center justify-between p-3.5 border rounded-2xl text-left transition-all cursor-pointer ${
                    habit.done 
                      ? 'bg-emerald-950/15 border-emerald-500/20' 
                      : 'bg-white/2 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 transition-colors">
                      {habit.done ? (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      ) : (
                        <Circle size={16} className="text-slate-500" />
                      )}
                    </span>
                    <span className={`text-xs font-semibold ${habit.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {habit.text}
                    </span>
                  </div>
                  
                  <span className="text-[8px] font-space font-black px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 shrink-0">
                    +{habit.xp} XP
                  </span>
                </button>
              ))}
            </div>

            {/* Quick add form */}
            <form onSubmit={handleAddHabit} className="border-t border-white/5 pt-4 mt-4 flex gap-2">
              <input
                type="text"
                required
                placeholder="Sprout a new habit..."
                value={newHabitText}
                onChange={e => setNewHabitText(e.target.value)}
                className="flex-1 bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 transition-colors"
              />
              <select
                value={newHabitType}
                onChange={e => setNewHabitType(e.target.value)}
                className="bg-slate-900 border border-white/5 rounded-xl px-2 py-1 text-xs text-slate-300 focus:outline-none"
              >
                <option value="flower">🌸 Flower</option>
                <option value="grass">🌿 Grass</option>
                <option value="tree">🌲 Tree</option>
              </select>
              <button
                type="submit"
                className="px-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs transition-all text-slate-200 cursor-pointer"
              >
                Sprout
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Visual Garden Canvas */}
        <div className="space-y-6">
          <GlassCard className="p-6 flex flex-col justify-between min-h-[300px]">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-4">Garden Plot</h3>
              
              {/* SVG Garden Canvas */}
              <div className="w-full h-48 bg-slate-950/40 border border-white/5 rounded-2xl relative overflow-hidden flex items-end justify-center py-4">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/10 to-transparent pointer-events-none" />
                
                {/* Seed plot soil base */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-amber-950/40 border-t border-white/5" />

                {/* Grow plants based on completed habits */}
                <div className="flex gap-4 items-end z-10">
                  {habits.map((habit, idx) => {
                    if (!habit.done) return null;
                    return (
                      <motion.div
                        key={habit.id}
                        initial={{ scale: 0, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="flex flex-col items-center"
                      >
                        <span className="text-3xl animate-bounce" style={{ animationDelay: `${idx * 0.1}s` }}>
                          {habit.type === 'flower' ? '🌸' : habit.type === 'tree' ? '🌲' : '🌿'}
                        </span>
                        <span className="text-[7px] font-mono text-slate-500 mt-0.5 truncate max-w-[40px]">
                          {habit.text.split(' ')[0]}
                        </span>
                      </motion.div>
                    );
                  })}
                  {completedHabits.length === 0 && (
                    <p className="text-[10px] text-slate-600 italic pb-8">Check off habits to grow plants! 🌱</p>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                Completed habits unlock garden achievements. Connect today's checkmarks!
              </p>
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};

export default HabitGarden;
