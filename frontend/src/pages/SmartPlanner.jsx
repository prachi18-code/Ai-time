import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import GlassCard from '../components/GlassCard';
import { CalendarDays, Plus, Trash2, CheckCircle2, Circle, Sparkles, RefreshCw, LayoutList, LayoutGrid, Zap, Clock, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SmartPlanner = () => {
  const { token } = useAuth();
  const { t } = useLanguage();
  const { theme, themes } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'board'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'completed'

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('General');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');
  const [difficulty, setDifficulty] = useState('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [coachingTip, setCoachingTip] = useState('');
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const loadTasks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getTasks(token);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [token]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title || !deadline) {
      alert('Bhai, Title aur Deadline daalna compulsory hai!');
      return;
    }

    try {
      const newTask = await api.createTask({
        title,
        subject,
        deadline,
        priority,
        difficulty,
        estimatedMinutes: Number(estimatedMinutes),
      }, token);

      setTasks(prev => [...prev, newTask]);
      
      // Reset form
      setTitle('');
      setSubject('General');
      setDeadline('');
      setPriority('medium');
      setDifficulty('medium');
      setEstimatedMinutes(45);
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Task add nahi ho paya.');
    }
  };

  const handleToggleTaskStatus = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const updated = await api.updateTask(task._id, { status: nextStatus }, token);
      setTasks(prev => prev.map(t => t._id === task._id ? updated : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Kya aap sach me ye task delete karna chahte hain?')) return;
    try {
      await api.deleteTask(taskId, token);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateAISchedule = async () => {
    if (tasks.filter(t => t.status !== 'completed').length === 0) {
      alert('Add some pending tasks first!');
      return;
    }
    setIsGenerating(true);
    setCoachingTip('');
    setScheduleSuccess(false);
    try {
      const res = await api.generateSchedule(token);
      setCoachingTip(res.coachingTip);
      setScheduleSuccess(true);
      setTimeout(() => setScheduleSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'AI Scheduler failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const pending = tasks.filter(t => t.status !== 'completed');
  const completed = tasks.filter(t => t.status === 'completed');
  const filteredTasks = filterStatus === 'pending' ? pending : filterStatus === 'completed' ? completed : tasks;

  const priorityConfig = {
    high:   { color: '#f43f5e', bg: 'bg-red-500/10',    border: 'border-red-500/20',    label: '🔴 High' },
    medium: { color: '#f59e0b', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: '🟡 Medium' },
    low:    { color: '#22d3ee', bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   label: '🔵 Low' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pb-32 pt-4 px-2 max-w-2xl mx-auto font-sans"
    >
      {/* ── Header ── */}
      <div className="flex justify-between items-start mb-5 px-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-space tracking-widest uppercase px-2.5 py-0.5 rounded-full border bg-white/5"
              style={{ borderColor: `${accentColor}30`, color: accentColor }}>
              📋 Smart Planner
            </span>
          </div>
          <h1 className="font-sora text-3xl font-extrabold text-transparent bg-clip-text"
            style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, #f472b6)` }}>
            Quest Board
          </h1>
          <p className="text-[10px] text-slate-400 font-space mt-1 uppercase tracking-wider">
            {t('planner_desc')}
          </p>
        </div>
        <motion.button
          onClick={() => setShowAddForm(!showAddForm)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="flex items-center gap-2 py-2.5 px-4 rounded-2xl text-white text-xs font-sora font-bold cursor-pointer shadow-lg transition-all btn-theme-gradient"
          style={{ boxShadow: `0 4px 20px ${accentColor}35` }}
        >
          <Plus size={16} /> Add Quest
        </motion.button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { icon: '📋', label: 'Total', value: tasks.length, color: accentColor },
          { icon: '⏳', label: 'Pending', value: pending.length, color: '#f59e0b' },
          { icon: '✅', label: 'Done', value: completed.length, color: '#22d3ee' },
        ].map((stat, i) => (
          <GlassCard key={i} className="p-3 text-center hover:scale-[1.02] transition-transform">
            <span className="text-lg">{stat.icon}</span>
            <p className="font-sora font-black text-lg mt-1" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[8px] font-space text-slate-500 uppercase">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* AI Schedule Prompt Coaching Area */}
      <AnimatePresence>
        {coachingTip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <GlassCard className="mb-6 font-sans text-xs text-cyan-200 bg-cyan-950/20 border-cyan-500/20">
              ✨ {coachingTip}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Task Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="overflow-hidden"
          >
            <GlassCard className="mb-6">
              <h2 className="font-sora text-sm font-bold mb-4 text-slate-200">{t('new_task_add')}</h2>
              
              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-space text-slate-400 uppercase tracking-wider mb-1">
                    {t('task_title')}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Study Transformers layers"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/5 text-slate-200 placeholder:text-slate-600 text-sm focus:border-purple-500 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-space text-slate-400 uppercase tracking-wider mb-1">
                      {t('subject_area')}
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Machine Learning"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/5 text-slate-200 placeholder:text-slate-600 text-sm focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-space text-slate-400 uppercase tracking-wider mb-1">
                      {t('estimated_minutes')}
                    </label>
                    <input
                      type="number"
                      value={estimatedMinutes}
                      onChange={(e) => setEstimatedMinutes(e.target.value)}
                      placeholder="e.g. 45"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/5 text-slate-200 text-sm focus:border-purple-500 focus:outline-none transition-all"
                      min="5"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-space text-slate-400 uppercase tracking-wider mb-1">
                    {t('deadline')}
                  </label>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/5 text-slate-200 text-sm focus:border-purple-500 focus:outline-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-space text-slate-400 uppercase tracking-wider mb-1">
                      {t('priority')}
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-sm focus:border-purple-500 focus:outline-none transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-space text-slate-400 uppercase tracking-wider mb-1">
                      {t('difficulty')}
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/5 text-slate-300 text-sm focus:border-purple-500 focus:outline-none transition-all"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 py-2.5 rounded-xl text-white font-sora font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer btn-theme-gradient"
                  >
                    Task Add Karo
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs hover:bg-white/10 transition-all cursor-pointer"
                  >
                    {t('cancel')}
                  </motion.button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AI Schedule CTA ── */}
      <AnimatePresence>
        {scheduleSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-3 rounded-2xl border text-xs font-sans flex items-center gap-2"
            style={{ borderColor: `${accentColor}30`, color: accentColor, backgroundColor: `${accentColor}10` }}
          >
            <Sparkles size={14} /> Schedule created! Check Dashboard → Today's Plan ✨
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleGenerateAISchedule}
        disabled={isGenerating || pending.length === 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mb-5 py-3.5 rounded-2xl text-white font-sora font-bold text-sm transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer btn-theme-gradient"
        style={{ boxShadow: `0 6px 25px ${accentColor}30` }}
      >
        {isGenerating ? (
          <><RefreshCw className="animate-spin" size={16} /> Generating your day...</>
        ) : (
          <><Sparkles size={16} /> Generate AI Schedule ⚡</>
        )}
      </motion.button>

      {/* ── Filter + View Controls ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 bg-black/20 p-1 rounded-2xl">
          {['all', 'pending', 'completed'].map(f => (
            <button key={f} onClick={() => setFilterStatus(f)}
              className={`px-3 py-1 rounded-xl text-[9px] font-space font-bold uppercase cursor-pointer transition-all ${
                filterStatus === f ? 'text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              style={filterStatus === f ? { backgroundColor: accentColor } : {}}>
              {f === 'all' ? `All (${tasks.length})` : f === 'pending' ? `Active (${pending.length})` : `Done (${completed.length})`}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {[{ id: 'list', Icon: LayoutList }, { id: 'board', Icon: LayoutGrid }].map(({ id, Icon }) => (
            <button key={id} onClick={() => setViewMode(id)}
              className={`p-2 rounded-xl cursor-pointer transition-all ${
                viewMode === id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              style={viewMode === id ? { backgroundColor: `${accentColor}20` } : {}}>
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 rounded-full border-2 border-t-transparent"
            style={{ borderColor: `${accentColor}20`, borderTopColor: accentColor }} />
          <p className="text-[9px] font-space text-slate-500 uppercase tracking-widest animate-pulse">Loading quests...</p>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className={viewMode === 'board' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-3'}>
          <AnimatePresence>
            {filteredTasks.map((task, index) => {
              const isCompleted = task.status === 'completed';
              const pc = priorityConfig[task.priority] || priorityConfig.medium;

              return (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <GlassCard className={`relative group transition-all ${isCompleted ? 'opacity-55' : 'hover:scale-[1.01]'}`}>
                    {/* Priority accent strip */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl"
                      style={{ backgroundColor: pc.color, opacity: isCompleted ? 0.3 : 0.7 }} />

                    <div className="flex items-start gap-3 pl-2">
                      <button
                        onClick={() => handleToggleTaskStatus(task)}
                        className="mt-0.5 shrink-0 cursor-pointer transition-all hover:scale-110"
                        style={{ color: isCompleted ? '#22d3ee' : accentColor }}
                      >
                        {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h3 className={`font-sora text-xs font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                          {task.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-[8px] font-space px-2 py-0.5 rounded-full border"
                            style={{ borderColor: `${accentColor}25`, color: accentColor, backgroundColor: `${accentColor}10` }}>
                            {task.subject}
                          </span>
                          <span className={`text-[8px] font-space px-2 py-0.5 rounded-full border ${pc.bg} ${pc.border}`}
                            style={{ color: pc.color }}>
                            {pc.label}
                          </span>
                          <span className="text-[8px] font-space text-slate-500 flex items-center gap-0.5">
                            <Clock size={9} /> {task.estimatedMinutes}m
                          </span>
                          <span className="text-[8px] font-space text-slate-500">
                            📅 {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        {/* Difficulty bar */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[7px] font-space text-slate-600 uppercase">Difficulty</span>
                          <div className="flex gap-0.5">
                            {['easy', 'medium', 'hard'].map((d, i) => (
                              <span key={d} className="w-4 h-1 rounded-full"
                                style={{
                                  backgroundColor: ['easy', 'medium', 'hard'].indexOf(task.difficulty) >= i
                                    ? pc.color : 'rgba(255,255,255,0.1)'
                                }} />
                            ))}
                          </div>
                          <span className="text-[7px] font-space text-slate-600">{task.difficulty}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-slate-700 hover:text-red-400 p-1 rounded transition-colors shrink-0 cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">📋</span>
          <p className="text-slate-400 text-sm font-sora font-semibold mb-1">
            {filterStatus === 'completed' ? 'No completed tasks yet!' : 'No quests added yet!'}
          </p>
          <p className="text-[10px] font-space text-slate-600 mb-4">Add tasks to start your journey</p>
          <button onClick={() => setShowAddForm(true)}
            className="px-5 py-2.5 rounded-2xl text-xs font-sora font-bold text-white cursor-pointer btn-theme-gradient">
            + Add First Quest
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default SmartPlanner;
