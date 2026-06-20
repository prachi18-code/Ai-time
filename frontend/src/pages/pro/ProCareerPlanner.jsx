import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { Compass, Briefcase, Award, ArrowUpRight, Plus, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const ProCareerPlanner = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

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
    { id: 3, company: 'Vercel', role: 'Solutions Engineer', status: 'Offer', location: 'Remote' },
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

  const updateStatus = (id, status) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 font-sans text-slate-300">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Career pathing</span>
          <h1 className="font-sora font-extrabold text-xl text-slate-100 mt-1 flex items-center gap-2">
            <Briefcase size={20} style={{ color: accentColor }} />
            Career Planner
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Roadmap & Skill Matrix */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Milestone Milestones */}
          <GlassCard className="p-6 border-white/5 bg-slate-950/10">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-4">Milestone Roadmap</h3>
            
            <div className="space-y-4">
              {milestones.map((ms, idx) => (
                <div key={ms.id} className="relative flex gap-4 pl-6 py-0.5">
                  {/* Timeline connectors */}
                  {idx < milestones.length - 1 && (
                    <span className="absolute left-[7px] top-6 bottom-[-24px] w-0.5 bg-white/5" />
                  )}
                  <span 
                    className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      ms.done ? 'bg-emerald-400 border-emerald-400' : 'bg-slate-950 border-white/20'
                    }`}
                  >
                    {ms.done && <span className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-bold ${ms.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {ms.title}
                      </h4>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-500 border border-white/5">
                        {ms.targetDate}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      {ms.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Skill Matrix */}
          <GlassCard className="p-6 border-white/5 bg-slate-950/10">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-4">Skill Matrix</h3>
            
            <div className="space-y-4">
              {skills.map((skill, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-300">{skill.name}</span>
                    <span className="font-mono text-[10px] text-slate-500">{skill.level}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-950/80 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${skill.level}%`, backgroundColor: accentColor }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>

        {/* Right Column: Applications Tracker */}
        <div className="space-y-6">
          <GlassCard className="p-6 border-white/5 bg-slate-950/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">Pipeline Tracker</h3>
              <span className="text-[10px] font-mono text-slate-500">{applications.length} Active</span>
            </div>

            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="p-3 bg-slate-950/40 border border-white/5 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{app.company}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{app.role}</p>
                    </div>
                    <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded-full ${
                      app.status === 'Offer' ? 'bg-emerald-500/10 text-emerald-400' :
                      app.status === 'Interviewing' ? 'bg-sky-500/10 text-sky-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-[9px] font-mono text-slate-500 flex items-center gap-0.5">
                      <MapPin size={8} /> {app.location}
                    </span>
                    
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => updateStatus(app.id, 'Interviewing')}
                        className="text-[8px] font-mono text-sky-400 hover:text-sky-300 bg-white/5 px-1.5 py-0.5 rounded"
                      >
                        Interview
                      </button>
                      <button 
                        onClick={() => updateStatus(app.id, 'Offer')}
                        className="text-[8px] font-mono text-emerald-400 hover:text-emerald-300 bg-white/5 px-1.5 py-0.5 rounded"
                      >
                        Offer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick add application */}
            <form onSubmit={handleAddApp} className="border-t border-white/5 pt-4 mt-4 space-y-2">
              <input
                type="text"
                required
                placeholder="Company Name..."
                value={newCompany}
                onChange={e => setNewCompany(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-slate-400 transition-colors"
              />
              <input
                type="text"
                required
                placeholder="Role Title..."
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-slate-400 transition-colors"
              />
              <button
                type="submit"
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-semibold text-slate-200 transition-all cursor-pointer"
              >
                Add Application
              </button>
            </form>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};

export default ProCareerPlanner;
