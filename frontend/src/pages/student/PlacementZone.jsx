import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { Award, CheckCircle2, Circle, TrendingUp, Sparkles, Terminal, Activity, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const PlacementZone = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  // LeetCode Stats
  const [leetcode] = useState({ easy: 45, medium: 72, hard: 14 });
  const totalSolved = leetcode.easy + leetcode.medium + leetcode.hard;

  // Striver DSA Sheet Progress
  const [dsaTopics, setDsaTopics] = useState([
    { id: 1, name: 'Arrays & Hashing 📊', solved: 18, total: 20 },
    { id: 2, name: 'Two Pointers & Slid Window ⏳', solved: 8, total: 12 },
    { id: 3, name: 'Trees & Binary Search Trees 🌲', solved: 12, total: 25 },
    { id: 4, name: 'Dynamic Programming (DP) 📈', solved: 6, total: 30 },
  ]);

  // Company prep guide checklist
  const [companyPrep, setCompanyPrep] = useState([
    { id: 'cp1', company: 'Amazon', task: 'System Design basics + Core CS Fundamentals', done: false },
    { id: 'cp2', company: 'Google', task: 'Graph algorithms & Advanced DP sheets', done: false },
    { id: 'cp3', company: 'Microsoft', task: 'Linked List and Tree traversals mock coding', done: true },
  ]);

  const toggleCompanyTask = (id) => {
    setCompanyPrep(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 font-sans select-none pb-24 text-slate-200">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <span className="sticker-badge sticker-cyan mb-1">PLACEMENT HUB</span>
          <h1 className="font-sora font-black text-2xl text-slate-100 mt-1 flex items-center gap-2">
            <Terminal size={24} style={{ color: accentColor }} />
            Placement Zone
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* DSA Tracker & Leetcode metrics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Striver DSA sheet tracker */}
          <GlassCard className="p-6">
            <h2 className="text-sm font-sora font-extrabold text-slate-100 mb-4 flex items-center gap-2">
              <Activity size={16} style={{ color: accentColor }} />
              Striver DSA Sheet Progress
            </h2>

            <div className="space-y-4">
              {dsaTopics.map(topic => {
                const percentage = Math.round((topic.solved / topic.total) * 100);
                return (
                  <div key={topic.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-300">{topic.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {topic.solved}/{topic.total} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden border border-white/5 p-0.5">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%`, backgroundColor: accentColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* LeetCode Metrics */}
          <GlassCard className="p-6">
            <h2 className="text-sm font-sora font-extrabold text-slate-100 mb-4">💻 LeetCode Tracker</h2>
            <div className="grid grid-cols-4 gap-2 text-center items-center">
              <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                <span className="text-2xl font-black text-slate-100 block">{totalSolved}</span>
                <span className="text-[8px] font-space text-slate-500 uppercase tracking-wider block mt-1">Total Solved</span>
              </div>
              <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/15">
                <span className="text-lg font-black text-emerald-400 block">{leetcode.easy}</span>
                <span className="text-[8px] font-space text-emerald-500 uppercase tracking-wider block mt-1">Easy</span>
              </div>
              <div className="bg-yellow-500/10 p-4 rounded-2xl border border-yellow-500/15">
                <span className="text-lg font-black text-yellow-400 block">{leetcode.medium}</span>
                <span className="text-[8px] font-space text-yellow-500 uppercase tracking-wider block mt-1">Medium</span>
              </div>
              <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/15">
                <span className="text-lg font-black text-red-400 block">{leetcode.hard}</span>
                <span className="text-[8px] font-space text-red-500 uppercase tracking-wider block mt-1">Hard</span>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Right Side: Company prep checklist */}
        <div className="space-y-6">
          
          {/* Company Prep Checklist */}
          <GlassCard className="p-6">
            <h2 className="text-sm font-sora font-extrabold text-slate-100 mb-4 flex items-center gap-2">
              <CheckSquare size={16} style={{ color: accentColor }} />
              Company Preparation
            </h2>

            <div className="space-y-2.5">
              {companyPrep.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCompanyTask(item.id)}
                  className={`w-full flex items-start gap-3 p-3.5 border rounded-2xl text-left transition-all ${
                    item.done 
                      ? 'bg-slate-950/20 border-white/5 opacity-50' 
                      : 'bg-white/2 border-white/5 hover:border-white/10'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {item.done ? (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    ) : (
                      <Circle size={14} className="text-slate-500" />
                    )}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-space font-black px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5 uppercase">
                      {item.company}
                    </span>
                    <p className={`text-xs mt-1 font-semibold leading-relaxed ${item.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {item.task}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};

export default PlacementZone;
