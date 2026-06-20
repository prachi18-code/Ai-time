import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { FolderOpen, Plus, Tag, HelpCircle, Kanban, Layers, ListTodo, ExternalLink } from 'lucide-react';

const ProWorkspaces = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const [activeWorkspace, setActiveWorkspace] = useState('engineering');

  const workspaces = [
    { id: 'engineering', name: 'Engineering Core', emoji: '💻', count: 8 },
    { id: 'marketing', name: 'Marketing & Brand', emoji: '📣', count: 4 },
    { id: 'design', name: 'UI/UX Design Systems', emoji: '🎨', count: 6 },
  ];

  const [tasks, setTasks] = useState([
    { id: 1, text: 'Fix navigation component memory leak', status: 'todo', space: 'engineering', priority: 'high' },
    { id: 2, text: 'Design landing page mockup v2', status: 'in-progress', space: 'design', priority: 'medium' },
    { id: 3, text: 'Write release notes for v1.8.0', status: 'done', space: 'engineering', priority: 'low' },
    { id: 4, text: 'Set up Google Analytics tracking scripts', status: 'todo', space: 'marketing', priority: 'medium' },
    { id: 5, text: 'Review feedback from UX usability audits', status: 'in-progress', space: 'design', priority: 'high' },
    { id: 6, text: 'Implement tailwind utility configs', status: 'done', space: 'engineering', priority: 'low' },
  ]);

  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText) return;
    const newTask = {
      id: Date.now(),
      text: newTaskText,
      status: 'todo',
      space: activeWorkspace,
      priority: 'medium'
    };
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const moveTask = (id, newStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const activeWorkspaceName = workspaces.find(w => w.id === activeWorkspace)?.name || 'Workspace';

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 font-sans text-slate-300">
      
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">File organization</span>
          <h1 className="font-sora font-extrabold text-xl text-slate-100 mt-1 flex items-center gap-2">
            <Layers size={20} style={{ color: accentColor }} />
            Workspaces
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-3">
        {workspaces.map((space) => (
          <button
            key={space.id}
            onClick={() => setActiveWorkspace(space.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              activeWorkspace === space.id
                ? 'bg-white/5 text-white border-white/10'
                : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            <span>{space.emoji}</span>
            <span>{space.name}</span>
            <span className="text-[9px] font-mono opacity-50 bg-slate-900 px-1.5 py-0.5 rounded-md">
              {space.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Workspace Sidebar: Quick links/Resource libraries */}
        <div className="space-y-6">
          <GlassCard className="p-5 border-white/5 bg-slate-950/10">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">Resource Links</h3>
            <div className="space-y-2.5">
              <a href="#" className="flex justify-between items-center p-2 rounded-lg bg-slate-950/40 border border-white/5 text-xs text-slate-300 hover:text-white transition-colors">
                <span className="truncate">Product Specification Docs</span>
                <ExternalLink size={10} className="text-slate-500 shrink-0 ml-2" />
              </a>
              <a href="#" className="flex justify-between items-center p-2 rounded-lg bg-slate-950/40 border border-white/5 text-xs text-slate-300 hover:text-white transition-colors">
                <span className="truncate">Figma Design System File</span>
                <ExternalLink size={10} className="text-slate-500 shrink-0 ml-2" />
              </a>
              <a href="#" className="flex justify-between items-center p-2 rounded-lg bg-slate-950/40 border border-white/5 text-xs text-slate-300 hover:text-white transition-colors">
                <span className="truncate">GitHub Repository Settings</span>
                <ExternalLink size={10} className="text-slate-500 shrink-0 ml-2" />
              </a>
            </div>
          </GlassCard>

          <GlassCard className="p-5 border-white/5 bg-slate-950/10">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">Workspace Stats</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total backlog items:</span>
                <span className="font-mono text-slate-200">24</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Completed sprint tasks:</span>
                <span className="font-mono text-slate-200">12</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Active project members:</span>
                <span className="font-mono text-slate-200">5 devs</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Workspace Kanban Board */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center bg-slate-950/20 border border-white/5 px-4 py-3 rounded-2xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Sprint Board: {activeWorkspaceName}
            </h3>

            {/* Quick add form */}
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="New issue title..."
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                className="bg-slate-950 border border-white/5 rounded-xl px-3.5 py-1.5 text-xs text-white focus:outline-none focus:border-slate-400 transition-colors w-48 md:w-64"
              />
              <button
                type="submit"
                className="px-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs transition-all text-slate-200 cursor-pointer"
              >
                Add Issue
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Column: To Do */}
            <div className="bg-slate-950/20 border border-white/5 p-4 rounded-3xl space-y-3 min-h-[300px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">To Do</span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full">
                  {tasks.filter(t => t.space === activeWorkspace && t.status === 'todo').length}
                </span>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter(t => t.space === activeWorkspace && t.status === 'todo')
                  .map(task => (
                    <div key={task.id} className="p-3 bg-slate-950/40 border border-white/5 rounded-2xl space-y-2 hover:border-white/10 transition-colors">
                      <p className="text-xs text-slate-200 leading-normal font-medium">{task.text}</p>
                      <div className="flex justify-between items-center">
                        <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded-md ${
                          task.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/10' :
                          task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/10' :
                          'bg-slate-500/10 text-slate-400 border border-slate-500/10'
                        }`}>
                          {task.priority}
                        </span>
                        
                        <button 
                          onClick={() => moveTask(task.id, 'in-progress')}
                          className="text-[9px] font-mono text-slate-500 hover:text-slate-300 cursor-pointer"
                        >
                          Start →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column: In Progress */}
            <div className="bg-slate-950/20 border border-white/5 p-4 rounded-3xl space-y-3 min-h-[300px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">In Progress</span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full">
                  {tasks.filter(t => t.space === activeWorkspace && t.status === 'in-progress').length}
                </span>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter(t => t.space === activeWorkspace && t.status === 'in-progress')
                  .map(task => (
                    <div key={task.id} className="p-3 bg-slate-950/40 border border-white/5 rounded-2xl space-y-2 hover:border-white/10 transition-colors">
                      <p className="text-xs text-slate-200 leading-normal font-medium">{task.text}</p>
                      <div className="flex justify-between items-center">
                        <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded-md ${
                          task.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/10' :
                          task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/10' :
                          'bg-slate-500/10 text-slate-400 border border-slate-500/10'
                        }`}>
                          {task.priority}
                        </span>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => moveTask(task.id, 'todo')}
                            className="text-[9px] font-mono text-slate-600 hover:text-slate-400 cursor-pointer"
                          >
                            ← Back
                          </button>
                          <button 
                            onClick={() => moveTask(task.id, 'done')}
                            className="text-[9px] font-mono text-slate-300 hover:text-white cursor-pointer"
                          >
                            Done →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column: Done */}
            <div className="bg-slate-950/20 border border-white/5 p-4 rounded-3xl space-y-3 min-h-[300px]">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Done</span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full">
                  {tasks.filter(t => t.space === activeWorkspace && t.status === 'done').length}
                </span>
              </div>

              <div className="space-y-2">
                {tasks
                  .filter(t => t.space === activeWorkspace && t.status === 'done')
                  .map(task => (
                    <div key={task.id} className="p-3 bg-slate-950/40 border border-white/5 rounded-2xl space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                      <p className="text-xs text-slate-400 line-through leading-normal font-medium">{task.text}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-500">
                          Complete
                        </span>
                        
                        <button 
                          onClick={() => moveTask(task.id, 'in-progress')}
                          className="text-[9px] font-mono text-slate-600 hover:text-slate-400 cursor-pointer"
                        >
                          ← Reopen
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default ProWorkspaces;
