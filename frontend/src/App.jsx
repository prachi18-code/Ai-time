import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

// Import Core UI Components
import FloatingDock from './components/FloatingDock';
import ProtectedRoute from './components/ProtectedRoute';
import AuroraBackground from './components/AuroraBackground';
import FloatingParticles from './components/FloatingParticles';
import CustomCursor from './components/CustomCursor';
import ThemeSwitcher from './components/ThemeSwitcher';
import LanguageSwitcher from './components/LanguageSwitcher';
import FloatingMascot from './components/FloatingMascot';
import OnboardingJourney from './components/OnboardingJourney';
import ProductTour from './components/ProductTour';

// Import Lucide Icons for Sidebar
import { LayoutGrid, ListTodo, Sparkles, Clock, TrendingUp, User, LogOut, PanelLeftClose, PanelLeft, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SmartPlanner from './pages/SmartPlanner';
import Focus from './pages/Focus';
import AICoachChat from './pages/AICoachChat';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

// 5 Separate World Navigation Drawer Component
const NavigationManager = ({ theme, activeTab, setActiveTab, sidebarCollapsed, setSidebarCollapsed, logout, t, accentColor }) => {
  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutGrid },
    { id: 'planner', label: t('planner'), icon: ListTodo },
    { id: 'coach', label: t('coach'), icon: Sparkles, highlight: true },
    { id: 'focus', label: t('focus'), icon: Clock },
    { id: 'analytics', label: t('stats'), icon: TrendingUp },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  if (theme === 'zen') {
    // 1. ZEN: Centered Top Navigation Header
    return (
      <header className="w-[95%] max-w-4xl mx-auto my-4 px-6 py-2 rounded-full liquid-glass flex justify-between items-center sticky top-4 z-40 backdrop-blur-md">
        <span className="font-sora font-black text-xs tracking-wider" style={{ color: accentColor }}>AETHER ZEN</span>
        <nav className="flex items-center gap-1.5 md:gap-3">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-space font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  isActive ? 'text-slate-900 bg-slate-950/5' : 'text-slate-500 hover:text-slate-800'
                }`}
                style={isActive ? { backgroundColor: `${accentColor}15`, color: accentColor } : {}}
              >
                <Icon size={12} />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <button onClick={logout} className="text-red-500 hover:text-red-700 text-[10px] font-space font-bold cursor-pointer">
            {t('logout')}
          </button>
        </div>
      </header>
    );
  }

  if (theme === 'galaxy') {
    // 2. GALAXY: Bottom Floating Dock (Centered at bottom of screen)
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl">
        <div className="floating-dock flex justify-around items-center py-2.5 px-4 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center py-1.5 px-3 group focus:outline-none transition-all duration-300 cursor-pointer"
              >
                {item.highlight ? (
                  <div 
                    className={`p-3 rounded-full -mt-6 transition-all duration-300 ${
                      isActive ? 'text-white scale-110 shadow-lg' : 'bg-indigo-950/90 text-slate-400 border'
                    }`}
                    style={isActive ? {
                      background: `linear-gradient(135deg, ${accentColor} 0%, #312e81 100%)`,
                      boxShadow: `0 0 15px ${accentColor}`,
                      borderColor: `${accentColor}40`
                    } : { borderColor: `${accentColor}20` }}
                  >
                    <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                  </div>
                ) : (
                  <div 
                    className={`transition-all duration-300 ${isActive ? 'scale-110' : 'text-slate-400 hover:text-slate-200'}`}
                    style={isActive ? { color: accentColor } : {}}
                  >
                    <Icon size={18} />
                  </div>
                )}
                {!item.highlight && isActive && (
                  <span className="absolute bottom-[-1px] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
                )}
                <span className="absolute bottom-12 bg-slate-950/90 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
          <button onClick={logout} className="p-2 text-red-400 hover:text-red-300 cursor-pointer" title={t('logout')}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (theme === 'sakura') {
    // 3. SAKURA: Right-Aligned Vertical Nav Panel (Organic blossom shape cards)
    return (
      <aside className="hidden md:flex flex-col h-screen sticky top-0 p-3 shrink-0 overflow-hidden right-0 order-last z-40">
        <div className="liquid-glass h-full flex flex-col justify-between py-6 px-3" style={{ borderRadius: '12px 36px 12px 36px' }}>
          <div>
            <div className="font-sora font-black text-center text-xs tracking-wider mb-6 text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, #fb7185)` }}>
              SAKURA
            </div>
            <nav className="space-y-3">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-center p-3 rounded-full transition-all cursor-pointer relative group ${
                      isActive ? 'text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                    style={isActive ? {
                      background: `linear-gradient(135deg, ${accentColor}25 0%, rgba(255,255,255,0.01) 100%)`,
                      borderColor: accentColor,
                      borderWidth: '1.5px'
                    } : {}}
                  >
                    <Icon size={16} style={isActive ? { color: accentColor } : {}} />
                    <div className="absolute right-14 bg-slate-950/90 border border-white/10 rounded-lg p-2 text-[10px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
          <button onClick={logout} className="p-3 rounded-full text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all flex justify-center cursor-pointer">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    );
  }

  if (theme === 'ocean') {
    // 4. OCEAN: Left-Aligned Curved Wavy sidebar
    return (
      <aside className="hidden md:flex flex-col h-screen sticky top-0 p-3 shrink-0 overflow-hidden z-40">
        <div className="liquid-glass h-full flex flex-col justify-between py-6 px-3" style={{ borderRadius: '24px' }}>
          <div>
            <div className="font-sora font-black text-center text-xs tracking-wider mb-6" style={{ color: accentColor }}>
              OCEAN
            </div>
            <nav className="space-y-2.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left text-xs font-space font-bold transition-all cursor-pointer relative group ${
                      isActive ? 'text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                    style={isActive ? {
                      background: `linear-gradient(135deg, ${accentColor}20 0%, rgba(255,255,255,0.01) 100%)`,
                      borderLeft: `4px solid ${accentColor}`,
                    } : {}}
                  >
                    <Icon size={16} style={isActive ? { color: accentColor } : {}} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 p-3 rounded-2xl text-left text-xs font-space text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all cursor-pointer">
            <LogOut size={16} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>
    );
  }

  // 5. MIDNIGHT (Default): Arc-style collapsible left sidebar
  return (
    <aside className="hidden md:flex flex-col h-screen sticky top-0 p-3 shrink-0 overflow-hidden z-40">
      <motion.div 
        animate={{ width: sidebarCollapsed ? 68 : 205 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="liquid-glass h-full flex flex-col justify-between py-6 px-3"
      >
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            {!sidebarCollapsed && (
              <span className="font-sora font-extrabold text-[11px] tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
                AETHER OS
              </span>
            )}
            {sidebarCollapsed && (
              <span className="font-sora font-black text-xs" style={{ color: accentColor }}>AE</span>
            )}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              {sidebarCollapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
            </button>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 p-2.5 px-4'} rounded-none text-left text-xs font-space font-semibold tracking-wide transition-all cursor-pointer relative group ${
                    isActive ? 'text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                  style={isActive ? {
                    borderLeft: `2.5px solid ${accentColor}`,
                    background: 'rgba(255,255,255,0.03)'
                  } : {}}
                >
                  <Icon size={15} style={isActive ? { color: accentColor } : {}} />
                  {!sidebarCollapsed && <span className="text-[11px]">{item.label}</span>}
                  {sidebarCollapsed && (
                    <div className="absolute left-14 bg-slate-950/90 border border-white/10 rounded-lg p-2 text-[10px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={logout}
          className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 p-2.5 px-4'} rounded-none text-left text-xs font-space text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all cursor-pointer`}
        >
          <LogOut size={15} />
          {!sidebarCollapsed && <span className="text-[11px]">{t('logout')}</span>}
        </button>
      </motion.div>
    </aside>
  );
};

const AppContent = () => {
  const { user, logout } = useAuth();
  const { theme, themes } = useTheme();
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authTab, setAuthTab] = useState('login');
  
  // Onboarding & Tour State managers
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Trigger Onboarding on successful login/signup
  useEffect(() => {
    if (user) {
      const completedOnboarding = sessionStorage.getItem('aether_onboarded');
      if (!completedOnboarding) {
        setShowOnboarding(true);
      }
    } else {
      setShowOnboarding(false);
      setShowTour(false);
    }
  }, [user]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    sessionStorage.setItem('aether_onboarded', 'true');
    setShowTour(true); // Launch Spotlight Tour
  };

  const handleTourComplete = () => {
    setShowTour(false);
  };

  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Immersive background & cursor */}
      <AuroraBackground />
      <FloatingParticles />
      <CustomCursor />

      {/* ONBOARDING INTERCEPTOR OVERLAY */}
      {showOnboarding && (
        <OnboardingJourney onComplete={handleOnboardingComplete} />
      )}

      {/* SPOTLIGHT TUTORIAL PRODUCT TOUR */}
      {showTour && (
        <ProductTour onComplete={handleTourComplete} />
      )}

      {/* Main Container */}
      <div className={`flex flex-col ${theme === 'zen' ? 'flex-col' : 'md:flex-row'} relative z-10 min-h-screen`}>
        
        {/* MULTI-LAYOUT NAVIGATION SYSTEM */}
        {user && !showOnboarding && (
          <NavigationManager
            theme={theme}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            logout={logout}
            t={t}
            accentColor={accentColor}
          />
        )}

        {/* CONTENT VIEWPORT */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* TOP NAVBAR (Rendered for non-Zen worlds) */}
          {user && !showOnboarding && theme !== 'zen' && theme !== 'galaxy' && (
            <header className="h-16 px-6 flex justify-between items-center sticky top-0 backdrop-blur-md z-30">
              <div className="md:hidden flex items-center gap-2">
                <span className="font-sora font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  AETHER OS
                </span>
              </div>
              <div className="flex items-center gap-3 top-controls-tour">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>
            </header>
          )}

          {/* PAGE INNER VIEWPORT */}
          <div className={`flex-1 overflow-y-auto px-4 pb-24 ${theme === 'galaxy' ? 'pt-4 pb-32 md:pb-32' : 'md:pb-8'}`}>
            {!user ? (
              authTab === 'register' ? (
                <div className="py-6">
                  <Register
                    onSwitchToLogin={() => setAuthTab('login')}
                    onRegisterSuccess={() => setActiveTab('dashboard')}
                  />
                </div>
              ) : (
                <div className="py-6">
                  <Login
                    onSwitchToRegister={() => setAuthTab('register')}
                    onLoginSuccess={() => setActiveTab('dashboard')}
                  />
                </div>
              )
            ) : (
              <>
                {/* Floating Mascot companion */}
                {!showOnboarding && (
                  <div className="mascot-tour">
                    <FloatingMascot />
                  </div>
                )}

                {/* Main Views */}
                {activeTab === 'dashboard' && (
                  <ProtectedRoute onNavigateToLogin={() => setAuthTab('login')}>
                    <Dashboard setActiveTab={setActiveTab} />
                  </ProtectedRoute>
                )}
                {activeTab === 'planner' && (
                  <ProtectedRoute onNavigateToLogin={() => setAuthTab('login')}>
                    <SmartPlanner />
                  </ProtectedRoute>
                )}
                {activeTab === 'coach' && (
                  <ProtectedRoute onNavigateToLogin={() => setAuthTab('login')}>
                    <AICoachChat />
                  </ProtectedRoute>
                )}
                {activeTab === 'focus' && (
                  <ProtectedRoute onNavigateToLogin={() => setAuthTab('login')}>
                    <Focus />
                  </ProtectedRoute>
                )}
                {activeTab === 'analytics' && (
                  <ProtectedRoute onNavigateToLogin={() => setAuthTab('login')}>
                    <Analytics />
                  </ProtectedRoute>
                )}
                {activeTab === 'profile' && (
                  <ProtectedRoute onNavigateToLogin={() => setAuthTab('login')}>
                    <Profile />
                  </ProtectedRoute>
                )}

                {/* MOBILE / TABLET FLOATING DOCK (Rendered if not galaxy, since galaxy uses bottom dock for both desktop/mobile) */}
                {!showOnboarding && theme !== 'galaxy' && theme !== 'zen' && (
                  <div className="md:hidden nav-dock-tour">
                    <FloatingDock activeTab={activeTab} setActiveTab={setActiveTab} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
