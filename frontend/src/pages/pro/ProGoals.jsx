import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { TrendingUp, Plus, Target, CheckCircle2, Award, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProGoals = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const [okrs, setOkrs] = useState([
    { id: 1, objective: 'Optimize system scalability', progress: 75, target: '99.9% uptime', owner: 'Engineering Team' },
    { id: 2, objective: 'Deliver core features for Version 2', progress: 90, target: '100% complete', owner: 'Product' },
    { id: 3, objective: 'Improve frontend load performance', progress: 45, target: 'Sub-2s page loads', owner: 'Web Team' },
    { id: 4, objective: 'Establish automated CI/CD pipeline tests', progress: 20, target: '80% code coverage', owner: 'DevOps' },
  ]);

  const [showAddOkrModal, setShowAddOkrModal] = useState(false);
  const [newOkr, setNewOkr] = useState({ objective: '', target: '', progress: 0, owner: 'Self' });

  const addOkr = (e) => {
    e.preventDefault();
    if (!newOkr.objective) return;
    setOkrs([...okrs, { id: Date.now(), ...newOkr, progress: parseInt(newOkr.progress || '0') }]);
    setShowAddOkrModal(false);
    setNewOkr({ objective: '', target: '', progress: 0, owner: 'Self' });
  };

  const updateProgress = (id, newProgress) => {
    setOkrs(prev => prev.map(o => o.id === id ? { ...o, progress: Math.min(Math.max(newProgress, 0), 100) } : o));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 font-sans text-slate-300">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Corporate alignment</span>
          <h1 className="font-sora font-extrabold text-xl text-slate-100 mt-1 flex items-center gap-2">
            <Target size={20} style={{ color: accentColor }} />
            OKR Objectives
          </h1>
        </div>

        <button
          onClick={() => setShowAddOkrModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 transition-colors"
          style={{ backgroundColor: accentColor }}
        >
          <Plus size={14} /> New Objective
        </button>
      </div>

      {/* Analytics Summary Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-5 border-white/5 bg-slate-950/10 text-left">
          <span className="text-[9px] font-mono text-slate-500 uppercase block">Sprint Goal Completion</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-100">84.2%</span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">+4.5% vs last sprint</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Delivered 16/19 key task achievements.</p>
        </GlassCard>

        <GlassCard className="p-5 border-white/5 bg-slate-950/10 text-left">
          <span className="text-[9px] font-mono text-slate-500 uppercase block">Active OKR Metrics</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-100">4 / 4</span>
            <span className="text-[10px] font-mono text-slate-400">Objectives tracked</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Average overall progress is 57.5%.</p>
        </GlassCard>

        <GlassCard className="p-5 border-white/5 bg-slate-950/10 text-left">
          <span className="text-[9px] font-mono text-slate-500 uppercase block">Productivity Velocity</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-100">Excellent</span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">120 story pts</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Telemetry shows consistent weekly output.</p>
        </GlassCard>
      </div>

      {/* Main List */}
      <div className="grid grid-cols-1 gap-4">
        {okrs.map((okr) => (
          <GlassCard key={okr.id} className="p-6 border-white/5 bg-slate-950/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 md:max-w-md">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5 uppercase">
                  {okr.owner}
                </span>
                <h3 className="font-sora text-sm font-bold text-slate-200 mt-1">{okr.objective}</h3>
                <p className="text-xs text-slate-400">Target Result: {okr.target}</p>
              </div>

              <div className="flex-1 md:max-w-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-mono">Progress</span>
                  <span className="font-semibold text-slate-200 font-mono">{okr.progress}%</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => updateProgress(okr.id, okr.progress - 5)}
                    className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors shrink-0"
                  >
                    -
                  </button>
                  
                  <div className="flex-1 h-1.5 bg-slate-950/80 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${okr.progress}%`, backgroundColor: accentColor }}
                    />
                  </div>

                  <button 
                    onClick={() => updateProgress(okr.id, okr.progress + 5)}
                    className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add OKR Modal */}
      <AnimatePresence>
        {showAddOkrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-slate-950 border border-white/10 p-6 rounded-3xl space-y-4"
            >
              <h3 className="font-sora font-extrabold text-sm text-slate-100">Add Key Objective (OKR)</h3>
              
              <form onSubmit={addOkr} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Objective Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Optimize CI pipeline"
                    value={newOkr.objective}
                    onChange={e => setNewOkr({...newOkr, objective: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-400 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Key Result Target</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Achieve <5min build completion"
                    value={newOkr.target}
                    onChange={e => setNewOkr({...newOkr, target: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Initial Progress %</label>
                    <input
                      type="number"
                      max="100"
                      min="0"
                      value={newOkr.progress}
                      onChange={e => setNewOkr({...newOkr, progress: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Team / Owner</label>
                    <input
                      type="text"
                      placeholder="e.g. Engineering"
                      value={newOkr.owner}
                      onChange={e => setNewOkr({...newOkr, owner: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddOkrModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/5 text-slate-400 hover:text-slate-200 text-xs font-semibold hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-slate-950 text-xs font-semibold transition-colors"
                    style={{ backgroundColor: accentColor }}
                  >
                    Add OKR
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

export default ProGoals;
