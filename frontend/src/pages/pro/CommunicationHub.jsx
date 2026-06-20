import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { MessageSquare, Users, Send, Search, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CommunicationHub = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const [channels] = useState([
    { id: 'acme', name: 'Acme Corp (#general)', unread: true, lastMsg: 'Sarah: Please review the roadmap deck' },
    { id: 'vertex', name: 'Vertex Labs (#tech-sync)', unread: false, lastMsg: 'John: API schemas are approved!' },
    { id: 'starlight', name: 'Starlight Inc (#branding)', unread: false, lastMsg: 'Emily: The logo drafts look clean' },
  ]);

  const [activeChannelId, setActiveChannelId] = useState('acme');

  const [messages, setMessages] = useState({
    acme: [
      { id: 1, sender: 'Sarah Jenkins', role: 'Client Lead', text: 'Hi team, checking on the dashboard redesign timeline. Do we have v2 wireframes?', time: '09:15 AM' },
      { id: 2, sender: 'Prachi', role: 'You', text: 'Good morning Sarah, they are being finalized. I will submit the PDF export shortly.', time: '09:22 AM' },
      { id: 3, sender: 'Sarah Jenkins', role: 'Client Lead', text: 'Perfect. Please review the roadmap deck as well, we want to align with marketing.', time: '09:30 AM' },
    ],
    vertex: [
      { id: 1, sender: 'John Doe', role: 'CTO', text: 'Are the Docker containers deployed to staging?', time: 'Yesterday' },
      { id: 2, sender: 'Prachi', role: 'You', text: 'Yes, cluster v1 is up and verified. Checking logs now.', time: 'Yesterday' },
      { id: 3, sender: 'John Doe', role: 'CTO', text: 'API schemas are approved! Thanks for the quick rollout.', time: 'Yesterday' },
    ],
    starlight: [
      { id: 1, sender: 'Emily Rose', role: 'VP Design', text: 'How is the brand strategy document coming along?', time: '2 days ago' },
      { id: 2, sender: 'Prachi', role: 'You', text: 'Draft is 80% complete. I am wrapping up market competitor studies.', time: '2 days ago' },
      { id: 3, sender: 'Emily Rose', role: 'VP Design', text: 'The logo drafts look clean. I will compile internal feedback and ping you.', time: '1 day ago' },
    ]
  });

  const [inputText, setInputText] = useState('');

  const [followups, setFollowups] = useState([
    { id: 1, client: 'Acme Corp', text: 'Send PDF design export to Sarah', done: false },
    { id: 2, client: 'Vertex Labs', text: 'Verify staging container uptime logs', done: true },
    { id: 3, client: 'Starlight Inc', text: 'Confirm schedule for brand review call', done: false }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'Prachi',
      role: 'You',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [activeChannelId]: [...prev[activeChannelId], newMsg]
    }));

    setInputText('');
  };

  const toggleFollowup = (id) => {
    setFollowups(prev => prev.map(f => f.id === id ? { ...f, done: !f.done } : f));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 font-sans text-slate-300 select-none pb-24">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Secure message matrix</span>
          <h1 className="font-sora font-extrabold text-xl text-slate-100 mt-1 flex items-center gap-2">
            <MessageSquare size={20} style={{ color: accentColor }} />
            Communication Hub
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Channel Selection Sidebar */}
        <div className="space-y-4 col-span-1">
          <div className="bg-slate-950/20 border border-white/5 p-4 rounded-3xl space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">Corporate Streams</h3>
            
            <div className="space-y-1">
              {channels.map((chan) => (
                <button
                  key={chan.id}
                  onClick={() => setActiveChannelId(chan.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex justify-between items-center cursor-pointer ${
                    activeChannelId === chan.id
                      ? 'bg-white/5 border border-white/10 text-white'
                      : 'bg-transparent border border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className="truncate">
                    <p className={`text-xs font-semibold truncate ${chan.unread && activeChannelId !== chan.id ? 'text-white' : ''}`}>
                      {chan.name}
                    </p>
                    <p className="text-[9px] text-slate-600 truncate mt-0.5">{chan.lastMsg}</p>
                  </div>
                  {chan.unread && activeChannelId !== chan.id && (
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Follow-ups lists */}
          <GlassCard className="p-4 border-white/5 bg-slate-950/10">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <CheckCircle2 size={12} style={{ color: accentColor }} /> Follow-ups
            </h3>
            
            <div className="space-y-2">
              {followups.map(f => (
                <button
                  key={f.id}
                  onClick={() => toggleFollowup(f.id)}
                  className={`w-full text-left p-2.5 bg-slate-950/40 border border-white/5 rounded-xl flex items-start gap-2.5 transition-all ${
                    f.done ? 'opacity-40' : 'hover:border-white/10'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {f.done ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Circle size={12} className="text-slate-500" />}
                  </span>
                  
                  <div>
                    <span className="text-[8px] font-mono text-slate-500 uppercase">{f.client}</span>
                    <p className={`text-[10px] mt-0.5 leading-normal font-semibold ${f.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {f.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Messaging Box */}
        <div className="lg:col-span-3">
          <GlassCard className="p-4 md:p-6 border-white/5 bg-slate-950/10 h-[500px] flex flex-col justify-between">
            
            {/* Messages Stack */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4 scrollbar-none">
              {messages[activeChannelId]?.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${msg.sender === 'Prachi' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold shrink-0 text-slate-400">
                    {msg.sender.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'Prachi'
                        ? 'bg-slate-800 text-white rounded-tr-none border border-white/5'
                        : 'bg-slate-950/40 border border-white/5 text-slate-200 rounded-tl-none'
                    }`}>
                      <p className="font-semibold select-text">{msg.text}</p>
                    </div>
                    
                    <div className="flex gap-2 items-center mt-1 px-1 text-[8px] font-mono text-slate-500">
                      <span className="font-bold">{msg.sender} ({msg.role})</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input field */}
            <form onSubmit={handleSend} className="border-t border-white/5 pt-4 flex gap-2">
              <input
                type="text"
                required
                placeholder="Type a corporate message reply..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-slate-400"
              />
              <button
                type="submit"
                className="p-3 bg-white text-slate-950 hover:bg-slate-200 rounded-xl transition-all"
              >
                <Send size={12} />
              </button>
            </form>

          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default CommunicationHub;
