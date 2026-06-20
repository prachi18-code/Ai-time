import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import GlassCard from '../components/GlassCard';
import { CalendarDays, Plus, Trash2, CheckCircle2, Circle, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SmartPlanner = () => {
  const { token } = useAuth();
  const { t } = useLanguage();
  const { theme, themes } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('General');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');
  const [difficulty, setDifficulty] = useState('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [coachingTip, setCoachingTip] = useState('');

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
    if (tasks.length === 0) {
      alert('Schedules tabhi bange jab list me pending tasks honge!');
      return;
    }
    setIsGenerating(true);
    setCoachingTip('');
    try {
      const res = await api.generateSchedule(token);
      setCoachingTip(res.coachingTip);
      alert('AI schedule created successfully! Go to Dashboard to check "Aaj ka Plan".');
    } catch (err) {
      console.error(err);
      alert(err.message || 'AI Scheduler failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pb-32 pt-6 px-4 max-w-lg mx-auto font-sans text-slate-200"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 
            className="font-sora text-2xl font-extrabold text-transparent bg-clip-text"
            style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, #f472b6)` }}
          >
            Smart Planner
          </h1>
          <p className="text-xs text-slate-400 font-space mt-0.5">
            {t('planner_desc')}
          </p>
        </div>
        <motion.button
          onClick={() => setShowAddForm(!showAddForm)}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full text-white cursor-pointer shadow-lg hover:glow-theme transition-all"
          style={{ backgroundColor: accentColor, boxShadow: `0 4px 15px ${accentColor}40` }}
        >
          <Plus size={20} />
        </motion.button>
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

      {/* Generate AI Schedule button CTA */}
      <motion.button
        onClick={handleGenerateAISchedule}
        disabled={isGenerating || tasks.length === 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mb-6 py-3.5 rounded-2xl text-white font-sora font-bold text-sm hover:opacity-95 transition-all glow-theme disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer btn-theme-gradient"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="animate-spin" size={16} />
            {t('planning_day')}
          </>
        ) : (
          <>
            <Sparkles size={16} />
            {t('generate_ai_schedule')}
          </>
        )}
      </motion.button>

      {/* Task List */}
      <h2 className="font-sora text-sm font-bold text-slate-300 mb-3 px-1 uppercase tracking-wider">
        {t('your_tasks')} ({tasks.length})
      </h2>

      {loading ? (
        <div className="py-16 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${accentColor}10`, borderTopColor: accentColor }} />
        </div>
      ) : tasks.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {tasks.map((task, index) => {
              const isCompleted = task.status === 'completed';
              const priorityColors = {
                high: 'bg-red-500/10 border-red-500/20 text-red-400',
                medium: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
                low: 'bg-slate-500/10 border-slate-500/20 text-slate-400'
              };

              return (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard
                    className={`flex items-start justify-between p-4 py-3 transition-opacity ${
                      isCompleted ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleTaskStatus(task)}
                        className="mt-1 text-purple-400 hover:text-purple-300 focus:outline-none shrink-0 cursor-pointer"
                        style={{ color: accentColor }}
                      >
                        {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      </button>

                      <div>
                        <h3 className={`font-sora text-xs font-semibold text-slate-100 ${
                          isCompleted ? 'line-through text-slate-500' : ''
                        }`}>
                          {task.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span 
                            className="text-[9px] font-space px-2 py-0.5 rounded-full bg-slate-950/40 border"
                            style={{ borderColor: `${accentColor}25`, color: accentColor }}
                          >
                            {task.subject}
                          </span>
                          <span className="text-[9px] font-space px-2 py-0.5 rounded-full bg-slate-500/10 border border-white/5 text-slate-300">
                            ⏱️ {task.estimatedMinutes} mins
                          </span>
                          <span className={`text-[9px] font-space px-2 py-0.5 rounded-full border ${
                            priorityColors[task.priority] || priorityColors.medium
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-[9px] font-space text-slate-500">
                            📅 {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-slate-600 hover:text-red-400 p-1 rounded focus:outline-none transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500 text-xs">
          {t('no_tasks_planner')}
        </div>
      )}
    </motion.div>
  );
};

export default SmartPlanner;
