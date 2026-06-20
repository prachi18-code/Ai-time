import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { Users, Plus, CheckCircle2, AlertCircle, Calendar, MessageSquare, Briefcase, Search, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const ClientHub = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const [clients, setClients] = useState([
    { id: 1, name: 'Acme Corp', contact: 'Sarah Jenkins', email: 'sarah@acme.com', status: 'Active', value: '$8,500/mo', rating: 5, project: 'SaaS Dashboard Redesign' },
    { id: 2, name: 'Vertex Labs', contact: 'John Doe', email: 'john@vertex.io', status: 'Onboarding', value: '$12,000/mo', rating: 4, project: 'Cloud Integration API' },
    { id: 3, name: 'Starlight Inc', contact: 'Emily Rose', email: 'emily@starlight.com', status: 'Proposal', value: '$4,200/mo', rating: 3, project: 'Brand Identity Strategy' },
    { id: 4, name: 'Nexus Ltd', contact: 'Alex Rivera', email: 'alex@nexus.co', status: 'Inactive', value: '$6,000/mo', rating: 4, project: 'Systems Architecture Audit' },
  ]);

  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', contact: '', email: '', status: 'Active', value: '', project: '' });

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.name) return;
    const client = {
      id: Date.now(),
      name: newClient.name,
      contact: newClient.contact,
      email: newClient.email,
      status: newClient.status,
      value: newClient.value || 'N/A',
      rating: 5,
      project: newClient.project || 'General Advisory'
    };
    setClients([...clients, client]);
    setNewClient({ name: '', contact: '', email: '', status: 'Active', value: '', project: '' });
    setShowAddForm(false);
  };

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.project.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 font-sans text-slate-300 select-none pb-24">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Corporate partners</span>
          <h1 className="font-sora font-extrabold text-xl text-slate-100 mt-1 flex items-center gap-2">
            <Users size={20} style={{ color: accentColor }} />
            Client Hub
          </h1>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 transition-colors"
          style={{ backgroundColor: accentColor }}
        >
          <Plus size={14} /> Add Client
        </button>
      </div>

      {/* Add Client Form */}
      {showAddForm && (
        <GlassCard className="p-5 border-white/5 bg-slate-950/10">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-4">Onboard New Client</h3>
          <form onSubmit={handleAddClient} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              required
              placeholder="Company / Client Name"
              value={newClient.name}
              onChange={e => setNewClient({...newClient, name: e.target.value})}
              className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-400"
            />
            <input
              type="text"
              placeholder="Key Contact Person"
              value={newClient.contact}
              onChange={e => setNewClient({...newClient, contact: e.target.value})}
              className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-400"
            />
            <input
              type="email"
              placeholder="Contact Email Address"
              value={newClient.email}
              onChange={e => setNewClient({...newClient, email: e.target.value})}
              className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-400"
            />
            <input
              type="text"
              placeholder="Contract / Monthly Value (e.g. $5,000/mo)"
              value={newClient.value}
              onChange={e => setNewClient({...newClient, value: e.target.value})}
              className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-400"
            />
            <input
              type="text"
              placeholder="Active Project Scope"
              value={newClient.project}
              onChange={e => setNewClient({...newClient, project: e.target.value})}
              className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-400"
            />
            <select
              value={newClient.status}
              onChange={e => setNewClient({...newClient, status: e.target.value})}
              className="bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
            >
              <option value="Active">Active</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Proposal">Proposal</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="col-span-1 md:col-span-3 flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-transparent text-slate-500 hover:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 rounded-xl text-slate-950 text-xs font-semibold"
                style={{ backgroundColor: accentColor }}
              >
                Save Partner
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Controls */}
        <div className="space-y-4">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filter clients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-950/40 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-slate-400"
            />
          </div>

          <GlassCard className="p-4 border-white/5 bg-slate-950/10">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">Reminders</h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-white/2 border border-white/5 rounded-lg">
                <p className="font-semibold text-slate-200">Send proposal revision</p>
                <p className="text-[10px] text-slate-500 mt-0.5">To Emily at Starlight Inc (Due today)</p>
              </div>
              <div className="p-2.5 bg-white/2 border border-white/5 rounded-lg">
                <p className="font-semibold text-slate-200">Kickoff Call</p>
                <p className="text-[10px] text-slate-500 mt-0.5">With Vertex Labs onboarding (Tomorrow)</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Client List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-950/20 border border-white/5 px-4 py-3 rounded-2xl flex justify-between items-center text-xs font-mono text-slate-500">
            <span>Portfolio Partners ({filteredClients.length})</span>
            <span>Monthly Value</span>
          </div>

          <div className="space-y-3">
            {filteredClients.map(client => (
              <div 
                key={client.id}
                className="p-5 bg-slate-950/20 border border-white/5 rounded-3xl flex flex-col md:flex-row justify-between gap-4 hover:border-white/10 transition-all group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-slate-100">{client.name}</h3>
                    <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded-md ${
                      client.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' :
                      client.status === 'Onboarding' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/10' :
                      client.status === 'Proposal' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/10' :
                      'bg-slate-500/10 text-slate-500 border border-slate-500/10'
                    }`}>
                      {client.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Contact</span>
                      <span className="text-slate-300">{client.contact}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Project Scope</span>
                      <span className="text-slate-300">{client.project}</span>
                    </div>
                    <div className="hidden md:block">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Email Address</span>
                      <span className="text-slate-300">{client.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-between items-end shrink-0 md:border-l border-white/5 md:pl-5">
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Contract Value</span>
                    <span className="text-sm font-bold text-slate-200">{client.value}</span>
                  </div>

                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        size={10} 
                        fill={s <= client.rating ? 'currentColor' : 'none'} 
                        className={s <= client.rating ? 'text-amber-400' : 'text-slate-700'} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {filteredClients.length === 0 && (
              <p className="text-xs text-slate-500 italic py-6 text-center">No portfolio client partners found matching filter.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClientHub;
