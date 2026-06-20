import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import { DollarSign, Plus, ArrowUpRight, ArrowDownRight, TrendingUp, Search, Calendar, Tag, Trash2 } from 'lucide-react';

const FinanceHub = () => {
  const { theme, themes } = useTheme();
  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const [transactions, setTransactions] = useState([
    { id: 1, type: 'revenue', desc: 'Acme Corp Milestone #2', amount: 4500, category: 'Consulting', date: '2026-06-20' },
    { id: 2, type: 'expense', desc: 'AWS Hosting Clusters', amount: 820, category: 'Infrastructure', date: '2026-06-19' },
    { id: 3, type: 'revenue', desc: 'Vertex Labs Onboarding retainer', amount: 12000, category: 'Development', date: '2026-06-15' },
    { id: 4, type: 'expense', desc: 'Co-working Office Desk lease', amount: 350, category: 'Office Rent', date: '2026-06-10' },
    { id: 5, type: 'expense', desc: 'GitHub Enterprise license subscription', amount: 120, category: 'SaaS Software', date: '2026-06-05' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTx, setNewTx] = useState({ type: 'revenue', desc: '', amount: '', category: 'Consulting', date: '2026-06-21' });

  const totalRevenue = transactions.filter(t => t.type === 'revenue').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netEarnings = totalRevenue - totalExpenses;

  const handleAddTx = (e) => {
    e.preventDefault();
    if (!newTx.desc || !newTx.amount) return;
    const tx = {
      id: Date.now(),
      type: newTx.type,
      desc: newTx.desc,
      amount: parseFloat(newTx.amount),
      category: newTx.category,
      date: newTx.date
    };
    setTransactions([tx, ...transactions]);
    setNewTx({ type: 'revenue', desc: '', amount: '', category: 'Consulting', date: '2026-06-21' });
    setShowAddForm(false);
  };

  const deleteTx = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 font-sans text-slate-300 select-none pb-24">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Corporate ledger</span>
          <h1 className="font-sora font-extrabold text-xl text-slate-100 mt-1 flex items-center gap-2">
            <DollarSign size={20} style={{ color: accentColor }} />
            Finance Hub
          </h1>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 transition-colors"
          style={{ backgroundColor: accentColor }}
        >
          <Plus size={14} /> Record Transaction
        </button>
      </div>

      {/* Finance Metrics Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-5 border-white/5 bg-slate-950/10 flex justify-between items-center">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block">Total Gross Revenue</span>
            <span className="text-xl font-extrabold text-slate-100 mt-1.5 block">${totalRevenue.toLocaleString()}</span>
          </div>
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
            <ArrowUpRight size={18} />
          </div>
        </GlassCard>

        <GlassCard className="p-5 border-white/5 bg-slate-950/10 flex justify-between items-center">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block">Operational Expenses</span>
            <span className="text-xl font-extrabold text-slate-100 mt-1.5 block">${totalExpenses.toLocaleString()}</span>
          </div>
          <div className="p-2.5 bg-red-500/10 rounded-xl text-red-400">
            <ArrowDownRight size={18} />
          </div>
        </GlassCard>

        <GlassCard className="p-5 border-white/5 bg-slate-950/10 flex justify-between items-center">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block">Net Operating Income</span>
            <span className="text-xl font-extrabold text-slate-100 mt-1.5 block" style={{ color: netEarnings >= 0 ? accentColor : '#f87171' }}>
              ${netEarnings.toLocaleString()}
            </span>
          </div>
          <div className="p-2.5 bg-white/5 rounded-xl text-slate-300">
            <TrendingUp size={18} />
          </div>
        </GlassCard>
      </div>

      {/* Record Transaction Form */}
      {showAddForm && (
        <GlassCard className="p-5 border-white/5 bg-slate-950/10">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-4">Record Transaction Ledger Entry</h3>
          <form onSubmit={handleAddTx} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-slate-500 uppercase">Entry Type</label>
              <select
                value={newTx.type}
                onChange={e => setNewTx({...newTx, type: e.target.value})}
                className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="revenue">🟢 Revenue (Income)</option>
                <option value="expense">🔴 Expense (Outgoing)</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-slate-500 uppercase">Description</label>
              <input
                type="text"
                required
                placeholder="e.g. AWS Invoicing"
                value={newTx.desc}
                onChange={e => setNewTx({...newTx, desc: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-slate-500 uppercase">Amount ($ USD)</label>
              <input
                type="number"
                required
                placeholder="e.g. 1500"
                value={newTx.amount}
                onChange={e => setNewTx({...newTx, amount: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-slate-500 uppercase">Category</label>
              <select
                value={newTx.category}
                onChange={e => setNewTx({...newTx, category: e.target.value})}
                className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="Consulting">Consulting</option>
                <option value="Development">Development</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Office Rent">Office Rent</option>
                <option value="SaaS Software">SaaS Software</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-slate-500 uppercase">Date</label>
              <input
                type="date"
                required
                value={newTx.date}
                onChange={e => setNewTx({...newTx, date: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

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
                Record Entry
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Main Ledger List */}
      <GlassCard className="p-6 border-white/5 bg-slate-950/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500">Corporate Transaction Ledger</h3>
          <span className="text-[10px] font-mono text-slate-500">Real-time balancing</span>
        </div>

        <div className="divide-y divide-white/5">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-3 flex justify-between items-center hover:bg-white/2 px-2 transition-colors rounded-lg group">
              <div className="flex items-center gap-3">
                <span className={`p-1.5 rounded-lg ${
                  tx.type === 'revenue' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {tx.type === 'revenue' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </span>
                
                <div>
                  <p className="text-xs font-bold text-slate-200">{tx.desc}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-slate-500">
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span>{tx.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold font-mono ${
                  tx.type === 'revenue' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {tx.type === 'revenue' ? '+' : '-'}${tx.amount.toLocaleString()}
                </span>
                
                <button
                  onClick={() => deleteTx(tx.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <p className="text-xs text-slate-500 italic py-6 text-center">No transaction records found.</p>
          )}
        </div>
      </GlassCard>

    </div>
  );
};

export default FinanceHub;
