import React, { useState } from 'react';
import { 
  Building2, Users, Calendar, FolderOpen, DollarSign, BarChart3, 
  Sparkles, User, LogOut, PanelLeftClose, PanelLeft 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const ProNavigation = ({ activeTab, setActiveTab, logout }) => {
  const { theme, themes } = useTheme();
  const { t } = useLanguage();
  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'office', label: '🏢 Office Hub', icon: Building2 },
    { id: 'clients', label: '👥 Client Hub', icon: Users },
    { id: 'projects', label: '📂 Project Hub', icon: FolderOpen },
    { id: 'meetings', label: '📅 Meeting Center', icon: Calendar },
    { id: 'finance', label: '💰 Finance Hub', icon: DollarSign },
    { id: 'business', label: '📊 Business Hub', icon: BarChart3 },
    { id: 'executiveai', label: 'Executive AI', icon: Sparkles },
    { id: 'profile', label: '🌟 Space', icon: User },
  ];

  // Desktop Sidebar
  const renderSidebar = () => {
    return (
      <aside className="hidden md:flex flex-col h-screen sticky top-0 p-3 shrink-0 overflow-hidden z-40">
        <motion.div 
          animate={{ width: collapsed ? 68 : 220 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-slate-950/20 border border-white/5 h-full flex flex-col justify-between py-6 px-3 rounded-3xl backdrop-blur-md"
        >
          <div className="space-y-6">
            {/* Header / Collapse Toggle */}
            <div className="flex items-center justify-between px-2">
              {!collapsed && (
                <span className="font-sora font-extrabold text-[9px] uppercase tracking-widest text-slate-500">
                  Business OS Pro
                </span>
              )}
              {collapsed && (
                <span className="font-sora font-black text-xs text-slate-400">BP</span>
              )}
              <button 
                onClick={() => setCollapsed(!collapsed)}
                className="p-1 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-200 cursor-pointer transition-colors"
              >
                {collapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
              </button>
            </div>

            {/* Nav Items */}
            <nav className="space-y-2.5">
              {/* Office Hub (Home) */}
              <div>
                {(() => {
                  const officeItem = navItems.find(i => i.id === 'office');
                  if (!officeItem) return null;
                  const Icon = officeItem.icon;
                  const isActive = activeTab === officeItem.id;
                  return (
                    <button
                      onClick={() => setActiveTab(officeItem.id)}
                      className={`w-full flex items-center ${
                        collapsed ? 'justify-center p-1.5' : 'gap-2 px-3 py-1.5'
                      } rounded-xl text-left text-xs font-semibold transition-all cursor-pointer relative group ${
                        isActive 
                          ? 'text-slate-100 bg-white/5 border border-white/10' 
                          : 'text-slate-500 border border-transparent hover:text-slate-300 hover:bg-white/2'
                      }`}
                    >
                      <Icon 
                        size={14} 
                        style={isActive ? { color: accentColor } : {}}
                        className="shrink-0"
                      />
                      {!collapsed && <span className="truncate ml-0.5">{officeItem.label}</span>}
                    </button>
                  );
                })()}
              </div>

              {/* Categories */}
              {[
                {
                  title: '💻 Career',
                  items: navItems.filter(i => i.id === 'clients' || i.id === 'projects' || i.id === 'finance' || i.id === 'business')
                },
                {
                  title: '🎯 Focus',
                  items: navItems.filter(i => i.id === 'meetings')
                },
                {
                  title: '🌱 Lifestyle',
                  items: navItems.filter(i => i.id === 'profile')
                },
                {
                  title: '🤖 AI',
                  items: navItems.filter(i => i.id === 'executiveai')
                }
              ].map((cat) => (
                <div key={cat.title} className="space-y-0.5">
                  {!collapsed && (
                    <div className="text-[8px] font-mono uppercase tracking-widest text-slate-500 px-3 pb-0.5 pt-1 select-none">
                      {cat.title}
                    </div>
                  )}
                  {cat.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center ${
                          collapsed ? 'justify-center p-1.5' : 'gap-2 px-3 py-1.5'
                        } rounded-xl text-left text-xs font-semibold transition-all cursor-pointer relative group ${
                          isActive 
                            ? 'text-slate-100 bg-white/5 border border-white/10' 
                            : 'text-slate-500 border border-transparent hover:text-slate-300 hover:bg-white/2'
                        }`}
                      >
                        <Icon 
                          size={14} 
                          style={isActive ? { color: accentColor } : {}}
                          className="shrink-0"
                        />
                        {!collapsed && <span className="truncate ml-0.5">{item.label}</span>}
                        {collapsed && (
                          <div className="absolute left-14 bg-slate-950/90 border border-white/10 rounded-lg p-2 text-[10px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                            {item.label}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className={`w-full flex items-center ${
              collapsed ? 'justify-center p-2.5' : 'gap-3 p-2.5 px-3.5'
            } rounded-xl text-left text-xs font-semibold text-red-400/80 hover:bg-red-950/20 hover:text-red-300 transition-all cursor-pointer`}
          >
            <LogOut size={14} />
            {!collapsed && <span>{t('logout')}</span>}
          </button>
        </motion.div>
      </aside>
    );
  };

  // Mobile Bottom bar
  const renderMobileBar = () => {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 border-t border-white/5 backdrop-blur-md py-1.5 px-2 flex justify-around items-center">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon 
                size={16} 
                style={isActive ? { color: accentColor } : {}}
              />
              <span className="text-[8px] mt-0.5 tracking-tight font-medium opacity-80">{item.label.split(' ')[1]}</span>
            </button>
          );
        })}
        
        {/* Profile tab */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'profile' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <User size={16} style={activeTab === 'profile' ? { color: accentColor } : {}} />
          <span className="text-[8px] mt-0.5 tracking-tight font-medium opacity-80">🌟 Space</span>
        </button>
      </div>
    );
  };

  return (
    <>
      {renderSidebar()}
      {renderMobileBar()}
    </>
  );
};

export default ProNavigation;
