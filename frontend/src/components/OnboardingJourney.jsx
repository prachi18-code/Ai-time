import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useExperience } from '../context/ExperienceContext';
import { spotify } from '../services/spotify';
import GlassCard from './GlassCard';
import { Sparkles, ArrowRight, Brain, Cpu, Music } from 'lucide-react';

const OnboardingJourney = ({ onComplete }) => {
  const { user } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const { setExperience } = useExperience();

  const [step, setStep] = useState(() => {
    const savedStep = sessionStorage.getItem('aether_onboarding_step');
    return savedStep ? parseInt(savedStep, 10) : 1;
  });
  const [welcomeText, setWelcomeText] = useState('welcome');

  // AI Briefing typewriter text
  const [briefingText, setBriefingText] = useState('');
  const fullBriefing = `Hello ${user?.name || 'Partner'}.\n\nWelcome to your Aether Space workspace.\n\nI am Nova, your intelligent assistant. I'll help you organize your daily goals, sync your focus schedule, and track milestones.\n\nDepending on your needs, choose either Student Space (Gen Z Life OS) or Professional Space (Business OS).\n\nLet's get started.`;

  // Parse Spotify callback token on mount
  useEffect(() => {
    const token = spotify.parseTokenFromHash();
    if (token) {
      setStep(5);
    }
  }, []);

  // Sync step to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('aether_onboarding_step', step.toString());
  }, [step]);

  // Step 1 Welcome Timer: automatically move to Step 2
  useEffect(() => {
    if (step === 1) {
      const textTimer = setTimeout(() => {
        setWelcomeText('loading');
      }, 1500);

      const stepTimer = setTimeout(() => {
        setStep(2);
      }, 3000);

      return () => {
        clearTimeout(textTimer);
        clearTimeout(stepTimer);
      };
    }
  }, [step]);

  // Step 2 Typewriter text trigger
  useEffect(() => {
    if (step === 2) {
      let index = 0;
      setBriefingText('');
      const typingInterval = setInterval(() => {
        if (index < fullBriefing.length) {
          setBriefingText((prev) => prev + fullBriefing.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval);
        }
      }, 12);
      return () => clearInterval(typingInterval);
    }
  }, [step, fullBriefing]);

  // Step 6 progress bar load (1.5 seconds)
  const [generationProgress, setGenerationProgress] = useState(0);
  const [genDone, setGenDone] = useState(false);
  
  useEffect(() => {
    if (step === 6) {
      setGenerationProgress(0);
      setGenDone(false);
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setGenDone(true);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step]);

  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const handleConnectSpotify = () => {
    window.location.href = spotify.getAuthUrl();
  };

  const handleFinish = () => {
    sessionStorage.removeItem('aether_onboarding_step');
    onComplete();
  };

  return (
    <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center bg-[#06030c]/98 backdrop-blur-xl p-4 font-sans select-none overflow-y-auto">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: WELCOME SCREEN (Fullscreen animation) */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl text-center space-y-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center mx-auto text-slate-400 bg-white/2"
            >
              <Cpu size={20} />
            </motion.div>

            <AnimatePresence mode="wait">
              {welcomeText === 'welcome' ? (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <h1 className="font-sora text-2xl font-black text-white tracking-tight">
                    ✨ Welcome, {user?.name || 'Seeker'}
                  </h1>
                  <p className="font-mono text-slate-600 text-[9px] uppercase tracking-widest">
                    Initializing coordinates...
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <h1 className="font-sora text-xl font-bold text-slate-300">
                    Preparing Aether Workspace
                  </h1>
                  <p className="font-mono text-slate-600 text-[8px] uppercase tracking-wider">
                    Configuring interface parameters...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* STEP 2: AI BRIEFING (Typing animation) */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md space-y-5"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-white/2 border border-white/5 flex items-center justify-center text-lg shadow-sm">
                🤖
              </div>
              <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500 mt-2">
                Nova AI Briefing
              </span>
            </div>

            <GlassCard className="p-4 text-left font-mono text-[11px] leading-relaxed min-h-[170px] whitespace-pre-line text-slate-400 border-white/5 bg-slate-950/20">
              {briefingText}
            </GlassCard>

            <div className="flex justify-end max-w-xs mx-auto">
              <button
                onClick={() => setStep(3)}
                className="w-full py-2 rounded-xl text-slate-950 font-sora font-extrabold text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white hover:bg-slate-200"
              >
                Continue to Experience Select
                <ArrowRight size={10} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: CHOOSE EXPERIENCE */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-2xl"
          >
            <GlassCard className="p-6 md:p-8 space-y-6 border-white/5 bg-slate-950/20">
              <div className="text-center max-w-md mx-auto space-y-2">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-950/40 border border-white/5">
                  Step 3 of 6
                </span>
                <h2 className="font-sora text-lg font-extrabold text-slate-100">Choose Your Experience</h2>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  Select your primary workspace mode. You can toggle this later inside your profile.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student Space Card */}
                <div
                  onClick={() => {
                    setExperience('student');
                    setStep(4);
                  }}
                  className="p-5 rounded-2xl border transition-all cursor-pointer text-left hover:border-purple-500/20 hover:bg-purple-950/5 bg-slate-950/40 border-white/5"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">🎓</span>
                    <span className="text-[8px] font-space font-black px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 uppercase tracking-wider">
                      Student OS
                    </span>
                  </div>
                  <h3 className="font-sora text-xs font-bold text-slate-100 mb-1">Student Space</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    Playful, social life planner for college preparation, placements tracking, habits and AI chat buddy.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {['Study Logs', 'DSA Tracker', 'Habit Garden', 'Countdowns'].map((tag) => (
                      <span key={tag} className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Professional Space Card */}
                <div
                  onClick={() => {
                    setExperience('professional');
                    setStep(4);
                  }}
                  className="p-5 rounded-2xl border transition-all cursor-pointer text-left hover:border-slate-400/20 hover:bg-slate-900/10 bg-slate-950/40 border-white/5"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">💼</span>
                    <span className="text-[8px] font-space font-black px-2 py-0.5 rounded-full bg-slate-100/5 text-slate-300 uppercase tracking-wider">
                      Business OS
                    </span>
                  </div>
                  <h3 className="font-sora text-xs font-bold text-slate-100 mb-1">Professional Space</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    Premium corporate environment for office employees, freelancers, and engineers managing clients.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {['Client Ledger', 'Kanban Board', 'Meetings', 'Finance'].map((tag) => (
                      <span key={tag} className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* STEP 4: CONNECT SPOTIFY */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="w-full max-w-sm"
          >
            <GlassCard className="text-center p-5 space-y-4 border-white/5 bg-slate-950/20">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center text-[#1DB954] shadow-sm mb-2">
                  <Music size={18} />
                </div>
                <h2 className="font-sora text-base font-black text-slate-100">🎵 Connect Spotify</h2>
                <p className="text-[8px] font-space text-slate-500 uppercase tracking-wider mt-0.5">Link real-time soundtracks</p>
              </div>

              <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5 space-y-1.5 text-left text-[11px] text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-[#1DB954]">✔</span>
                  <span>Ambient sound loops integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#1DB954]">✔</span>
                  <span>Integrated play panel controls</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(5)}
                  className="flex-1 py-2 rounded-xl border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-xs font-semibold cursor-pointer"
                >
                  Skip
                </button>
                <button
                  onClick={handleConnectSpotify}
                  className="flex-1 py-2 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-slate-950 text-xs font-bold transition-all cursor-pointer"
                >
                  Connect Spotify
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* STEP 5: SELECT UNIVERSE */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="w-full max-w-sm"
          >
            <GlassCard className="p-5 border-white/5 bg-slate-950/20 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                  Choose Universe
                </span>
                <span className="text-[10px] font-bold text-slate-300">Theme Select</span>
              </div>

              <div className="space-y-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`w-full py-2.5 px-3.5 rounded-xl text-xs text-left border transition-all cursor-pointer ${
                      theme === t.id 
                        ? 'bg-white/10 text-white font-semibold' 
                        : 'bg-slate-950/20 text-slate-400 border-white/5 hover:bg-white/5'
                    }`}
                    style={theme === t.id ? { borderColor: t.accent } : {}}
                  >
                    <span className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.accent }} />
                        {t.name}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setStep(6)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-slate-950 bg-white hover:bg-slate-200 transition-all cursor-pointer text-xs font-semibold"
                >
                  Confirm Universe <ArrowRight size={12} />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* STEP 6: ENTER DASHBOARD */}
        {step === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="w-full max-w-sm text-center space-y-5"
          >
            <motion.div
              animate={{
                scale: [1, 1.03, 1],
                boxShadow: [`0 0 10px ${accentColor}05`, `0 0 20px ${accentColor}15`, `0 0 10px ${accentColor}05`],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-12 h-12 rounded-full border flex items-center justify-center mx-auto text-slate-300 bg-slate-950/40"
              style={{ borderColor: `${accentColor}20`, color: accentColor }}
            >
              <Brain size={24} />
            </motion.div>

            <div className="space-y-1">
              <h2 className="font-sora text-sm font-extrabold text-slate-200">
                {genDone ? '✨ System synchronized.' : '🧠 Constructing workspace...'}
              </h2>
              <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                saving local preferences
              </p>
            </div>

            {!genDone ? (
              <div className="w-full h-1 rounded-full bg-slate-950/80 overflow-hidden border border-white/5 p-0.5">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${generationProgress}%`,
                    background: `linear-gradient(to right, ${accentColor}, #94a3b8)`,
                  }}
                />
              </div>
            ) : (
              <motion.button
                onClick={handleFinish}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="py-2.5 px-6 rounded-xl text-slate-950 bg-white hover:bg-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                🚀 Enter Dashboard
              </motion.button>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default OnboardingJourney;
