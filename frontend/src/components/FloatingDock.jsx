import React from 'react';
import { LayoutGrid, ListTodo, Sparkles, Clock, TrendingUp, User, Compass } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const FloatingDock = ({ activeTab, setActiveTab }) => {
  const { theme, themes } = useTheme();
  const { t } = useLanguage();
  
  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const tabs = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutGrid },
    { id: 'planner', label: t('planner'), icon: ListTodo },
    { id: 'coach', label: t('coach'), icon: Sparkles, highlight: true },
    { id: 'focus', label: t('focus'), icon: Clock },
    { id: 'analytics', label: t('stats'), icon: TrendingUp },
    { id: 'journey', label: 'Journey', icon: Compass },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  const containerClass = 
    theme === 'zen' ? 'zen-paper-card flex justify-around items-center py-2.5 px-4 border border-slate-200' :
    theme === 'sakura' ? 'sakura-organic-card flex justify-around items-center py-2.5 px-4' :
    theme === 'ocean' ? 'ocean-water-card flex justify-around items-center py-2.5 px-4' :
    theme === 'midnight' ? 'midnight-luxury-card flex justify-around items-center py-2 px-4 border border-white/10' :
    'floating-dock flex justify-around items-center py-3 px-4 relative';

  return (
    <div className="fixed bottom-22 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg">
      <div className={containerClass}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center relative py-1 px-3 group focus:outline-none transition-all duration-300"
            >
              {tab.highlight ? (
                <div 
                  className={`p-3 transition-all duration-300 ${
                    isActive 
                      ? 'universe-btn scale-110 text-white' 
                      : 'bg-slate-900/40 text-slate-400 border hover:scale-105'
                  }`}
                  style={{
                    borderRadius: theme === 'zen' ? '9999px' : theme === 'sakura' ? '12px 4px 12px 4px' : theme === 'ocean' ? '9999px' : theme === 'midnight' ? '0px' : '12px',
                    borderColor: 'var(--theme-border)'
                  }}
                >
                  <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
                </div>
              ) : (
                <div 
                  className={`transition-all duration-300 ${
                    isActive ? 'scale-110' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  style={isActive ? { color: accentColor } : {}}
                >
                  <Icon size={20} />
                </div>
              )}

              {/* Glowing active indicator dot under normal items */}
              {!tab.highlight && isActive && (
                <span 
                  className="absolute -bottom-1 w-1.5 h-1.5 rounded-full" 
                  style={{ 
                    backgroundColor: accentColor,
                    boxShadow: `0 0 8px ${accentColor}`
                  }}
                />
              )}
              
              {/* Tooltip label on desktop hover */}
              <span className="absolute bottom-12 bg-slate-950/90 text-slate-200 text-xs px-2 py-1 rounded border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingDock;
