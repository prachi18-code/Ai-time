import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { Calendar, Clock, Award, HelpCircle, CheckCircle2, ChevronRight, BarChart2 } from 'lucide-react';

const ExamZone = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  // Timers countdown calculation (Static calculations for 2026 dates)
  const calculateDaysLeft = (targetDateStr) => {
    const diff = new Date(targetDateStr) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const [exams, setExams] = useState([
    { name: 'GATE 2027 ⚙️', date: '2027-02-06', daysLeft: 0, code: 'gate' },
    { name: 'AFCAT 2026 ✈️', date: '2026-08-25', daysLeft: 0, code: 'afcat' },
    { name: 'CDS 2026 🎖️', date: '2026-09-06', daysLeft: 0, code: 'cds' },
  ]);

  useEffect(() => {
    setExams(prev => prev.map(e => ({ ...e, daysLeft: calculateDaysLeft(e.date) })));
  }, []);

  const [blueprints] = useState([
    { id: 'bp1', exam: 'gate', task: 'Revise Discrete Math & Linear Algebra', done: true },
    { id: 'bp2', exam: 'gate', task: 'Solve 10 years mock GATE CS papers', done: false },
    { id: 'bp3', exam: 'afcat', task: 'Practice English vocabulary + spatial reasoning', done: false },
    { id: 'bp4', exam: 'cds', task: 'Revise modern history and general science notes', done: true },
  ]);

  const [mockStats] = useState([
    { test: 'GATE Mock Test #4', score: '62/100', percentile: '92.4%', date: 'Jun 19' },
    { test: 'AFCAT Full Mock #2', score: '210/300', percentile: '89.5%', date: 'Jun 12' },
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 font-sans select-none pb-24 text-slate-200">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <span className="sticker-badge sticker-gold mb-1">COMPETITIVE EXAMS</span>
          <h1 className="font-sora font-black text-2xl text-slate-100 mt-1 flex items-center gap-2">
            <Calendar size={24} style={{ color: accentColor }} />
            Competitive Exam Zone
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Countdown Timers */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-sm font-sora font-extrabold text-slate-100 mb-4 flex items-center gap-2">
              <Clock size={16} style={{ color: accentColor }} />
              Live Countdown Timers
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exams.map((ex, idx) => (
                <div 
                  key={idx} 
                  className="bg-black/20 p-5 rounded-[24px] border border-white/5 text-center flex flex-col justify-between space-y-4"
                >
                  <div>
                    <span className="text-[10px] font-space text-slate-500 uppercase font-black tracking-widest block">Exam Target</span>
                    <h3 className="text-xs font-black text-slate-200 mt-1">{ex.name}</h3>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-slate-100 block">{ex.daysLeft}</span>
                    <span className="text-[9px] font-space text-slate-500 uppercase tracking-widest block mt-0.5">Days Remaining</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 italic block">Date: {ex.date}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Mock Test Results */}
          <GlassCard className="p-6">
            <h2 className="text-sm font-sora font-extrabold text-slate-100 mb-4 flex items-center gap-2">
              <BarChart2 size={16} style={{ color: accentColor }} />
              Mock Exam Analytics
            </h2>

            <div className="space-y-2.5">
              {mockStats.map((mock, idx) => (
                <div key={idx} className="p-4 bg-white/2 border border-white/5 rounded-2xl flex justify-between items-center hover:border-white/10 transition-colors">
                  <div>
                    <h4 className="text-xs font-black text-slate-200">{mock.test}</h4>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block mt-0.5">
                      Submitted on {mock.date}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-100 block">{mock.score}</span>
                    <span className="text-[9px] font-space text-yellow-400 font-extrabold block">
                      Percentile: {mock.percentile}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Blueprint checklist */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-sm font-sora font-extrabold text-slate-100 mb-4">⚙️ Syllabus blueprints</h2>
            <div className="space-y-2.5">
              {blueprints.map(bp => (
                <div key={bp.id} className="p-3.5 bg-slate-950/40 border border-white/5 rounded-2xl flex items-start gap-3">
                  <span className="mt-0.5 text-xs">
                    {bp.done ? '💚' : '⚪'}
                  </span>
                  <div>
                    <span className="text-[8px] font-space font-black px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5 uppercase">
                      {bp.exam} target
                    </span>
                    <p className={`text-xs mt-1 leading-relaxed ${bp.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {bp.task}
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

export default ExamZone;
