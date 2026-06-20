import React, { useState } from 'react';
import { Home, BookOpen, Laptop, Award, Headphones, Leaf, Bot, User, LogOut, PanelLeft, PanelLeftClose } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const StudentNavigation = ({ activeTab, setActiveTab, logout }) => {
  const { theme, themes } = useTheme();
  const { t } = useLanguage();
  const activeTheme = themes.find(th => th.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'feed', label: '✨ Home', icon: Home, emoji: '🏠' },
    { id: 'study', label: 'Study Zone', icon: BookOpen, emoji: '📚' },
    { id: 'placement', label: 'Placement', icon: Laptop, emoji: '💻' },
    { id: 'exam', label: 'Exam Zone', icon: Award, emoji: '🎓' },
    { id: 'focus', label: 'Focus Room', icon: Headphones, emoji: '🎧' },
    { id: 'habit', label: 'Habit Garden', icon: Leaf, emoji: '🌱' },
    { id: 'aibuddy', label: 'AI Buddy', icon: Bot, emoji: '🤖' },
    { id: 'profile', label: '🌟 Space', icon: User, emoji: '👤' },
  ];

  // Mobile bottom dock — 5 most-used tabs + AI buddy
  const mobileItems = [
    navItems[0], // feed
    navItems[1], // study
    navItems[2], // placement
    navItems[4], // focus
    navItems[6], // aibuddy
  ];

  return (
    <>
      {/* Desktop Sidebar — Playful / colorful */}
      <aside className="hidden md:flex flex-col h-screen sticky top-0 p-3 shrink-0 overflow-hidden z-40">
        <motion.div
          animate={{ width: collapsed ? 68 : 220 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="h-full flex flex-col justify-between py-6 px-3 rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, rgba(88,28,135,0.18) 0%, rgba(16,16,32,0.85) 60%)',
            border: '1px solid rgba(139,92,246,0.15)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between px-2">
              {!collapsed && (
                <div>
                  <span
                    className="font-sora font-black text-[11px] tracking-widest"
                    style={{
                      background: `linear-gradient(90deg, ${accentColor}, #ec4899)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    STUDENT SPACE
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[8px] text-slate-500 font-mono">Gen Z Life OS</span>
                    <span className="text-[8px]">✨</span>
                  </div>
                </div>
              )}
              {collapsed && (
                <span className="font-sora font-black text-xs" style={{ color: accentColor }}>
                  SS
                </span>
              )}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1 rounded-lg hover:bg-white/8 text-slate-500 hover:text-white cursor-pointer transition-colors ml-auto"
              >
                {collapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
              </button>
            </div>

            {/* Nav Items */}
            <nav className="space-y-2.5">
              {/* Home Feed */}
              <div>
                {(() => {
                  const homeItem = navItems.find(i => i.id === 'feed');
                  if (!homeItem) return null;
                  const isActive = activeTab === homeItem.id;
                  return (
                    <button
                      onClick={() => setActiveTab(homeItem.id)}
                      className={`w-full flex items-center ${
                        collapsed ? 'justify-center p-1.5' : 'gap-2 px-3 py-1.5'
                      } rounded-xl text-left text-xs font-semibold transition-all cursor-pointer relative group`}
                      style={
                        isActive
                          ? {
                              background: `linear-gradient(135deg, ${accentColor}22 0%, rgba(236,72,153,0.08) 100%)`,
                              border: `1px solid ${accentColor}30`,
                              color: '#fff',
                            }
                          : {
                              border: '1px solid transparent',
                              color: 'rgba(148,163,184,0.8)',
                            }
                      }
                    >
                      <span className="text-sm shrink-0">{homeItem.emoji}</span>
                      {!collapsed && <span className="text-[11px] font-bold">{homeItem.label}</span>}
                      {isActive && !collapsed && (
                        <span
                          className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
                        />
                      )}
                    </button>
                  );
                })()}
              </div>

              {/* Categories */}
              {[
                {
                  title: '📚 Learn',
                  items: navItems.filter(i => i.id === 'study' || i.id === 'exam')
                },
                {
                  title: '💻 Career',
                  items: navItems.filter(i => i.id === 'placement')
                },
                {
                  title: '🎯 Focus',
                  items: navItems.filter(i => i.id === 'focus')
                },
                {
                  title: '🌱 Lifestyle',
                  items: navItems.filter(i => i.id === 'habit' || i.id === 'profile')
                },
                {
                  title: '🤖 AI',
                  items: navItems.filter(i => i.id === 'aibuddy')
                }
              ].map((cat) => (
                <div key={cat.title} className="space-y-0.5">
                  {!collapsed && (
                    <div className="text-[8px] font-mono uppercase tracking-widest text-slate-500 px-3 pb-0.5 pt-1 select-none">
                      {cat.title}
                    </div>
                  )}
                  {cat.items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center ${
                          collapsed ? 'justify-center p-1.5' : 'gap-2 px-3 py-1.5'
                        } rounded-xl text-left text-xs font-semibold transition-all cursor-pointer relative group`}
                        style={
                          isActive
                            ? {
                                background: `linear-gradient(135deg, ${accentColor}22 0%, rgba(236,72,153,0.08) 100%)`,
                                border: `1px solid ${accentColor}30`,
                                color: '#fff',
                              }
                            : {
                                border: '1px solid transparent',
                                color: 'rgba(148,163,184,0.7)',
                              }
                        }
                      >
                        <span className="text-sm shrink-0">{item.emoji}</span>
                        {!collapsed && (
                          <span className={`text-[10px] truncate ${isActive ? 'text-slate-100 font-bold' : 'text-slate-400'}`}>
                            {item.label}
                          </span>
                        )}
                        {isActive && !collapsed && (
                          <span
                            className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
                          />
                        )}
                        {collapsed && (
                          <div className="absolute left-14 bg-slate-950/95 border border-purple-500/20 rounded-xl p-2 text-[10px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 text-slate-200">
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

          {/* Logout */}
          <button
            onClick={logout}
            className={`w-full flex items-center ${
              collapsed ? 'justify-center p-2.5' : 'gap-3 p-2.5 px-3'
            } rounded-2xl text-xs font-semibold text-red-400/70 hover:bg-red-950/20 hover:text-red-300 transition-all cursor-pointer border border-transparent`}
          >
            <LogOut size={14} />
            {!collapsed && <span>{t('logout')}</span>}
          </button>
        </motion.div>
      </aside>

      {/* Mobile Bottom Nav — Playful with emojis */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 py-2 px-3 flex justify-around items-center"
        style={{
          background: 'rgba(10,10,20,0.92)',
          borderTop: '1px solid rgba(139,92,246,0.2)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {mobileItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center px-3 py-1.5 rounded-2xl transition-all cursor-pointer relative"
              style={isActive ? { background: `${accentColor}18` } : {}}
            >
              <span className={`text-xl transition-transform ${isActive ? 'scale-110' : ''}`}>
                {item.emoji}
              </span>
              <span
                className="text-[8px] mt-0.5 font-space font-bold tracking-tight"
                style={isActive ? { color: accentColor } : { color: 'rgba(148,163,184,0.6)' }}
              >
                {item.label.split(' ')[0]}
              </span>
              {isActive && (
                <motion.span
                  layoutId="student-mobile-dot"
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full"
                  style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
                />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default StudentNavigation;
