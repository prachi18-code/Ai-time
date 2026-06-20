import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { spotify } from '../services/spotify';
import GlassCard from './GlassCard';
import { Sparkles, ArrowRight, Brain, Cpu, Music } from 'lucide-react';

const OnboardingJourney = ({ onComplete }) => {
  const { user } = useAuth();
  const { theme, setTheme, themes } = useTheme();

  const [step, setStep] = useState(1);
  const [welcomeText, setWelcomeText] = useState('welcome'); // 'welcome' | 'loading'
  
  // Briefing typewriter text
  const [briefingText, setBriefingText] = useState('');
  const fullBriefing = `👋 Hi ${user?.name || 'Seeker'}.\n\nI am your AI companion.\n\nI'll help you build your future.\n\nTogether we'll manage:\n📚 Study\n💻 Placements\n🎯 Career\n🌱 Habits\n⏳ Focus\n🎵 Music`;

  // Step 1 Welcome Animation Duration (3.6s total: 1.8s welcome, 1.8s loading)
  useEffect(() => {
    if (step === 1) {
      const textTimer = setTimeout(() => {
        setWelcomeText('loading');
      }, 1800);

      const stepTimer = setTimeout(() => {
        setStep(2);
      }, 3600);

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
      }, 20);
      return () => clearInterval(typingInterval);
    }
  }, [step]);

  // Step 5 progress bar load (3 seconds)
  const [generationProgress, setGenerationProgress] = useState(0);
  const [genDone, setGenDone] = useState(false);
  useEffect(() => {
    if (step === 5) {
      setGenerationProgress(0);
      setGenDone(false);
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setGenDone(true);
            return 100;
          }
          return prev + 5; // reaches 100 in 2.0s
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step]);

  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const handleConnectSpotify = () => {
    // Redirect browser directly to real Spotify OAuth Authorize Endpoint
    window.location.href = spotify.getAuthUrl();
  };

  return (
    <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 font-sans select-none overflow-y-auto">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: CRAZY WELCOME ANIMATION (3-4 Seconds) */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md text-center space-y-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-full border flex items-center justify-center mx-auto text-purple-400 bg-slate-950/40"
              style={{ borderColor: `${accentColor}30`, color: accentColor }}
            >
              <Cpu size={34} />
            </motion.div>

            <AnimatePresence mode="wait">
              {welcomeText === 'welcome' ? (
                <motion.div
                  key="welcomeText"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <h1 className="font-sora text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                    ✨ Welcome back, {user?.name || 'Seeker'}
                  </h1>
                  <p className="font-space text-xs text-slate-400 uppercase tracking-widest">
                    Your AI universe is getting ready...
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="loadingText"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <h1 className="font-sora text-2xl font-extrabold text-slate-100">
                    Your AI universe is preparing...
                  </h1>
                  <p className="font-space text-[10px] text-slate-500 uppercase tracking-wider">
                    Configuring dimensional background and mascots
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* STEP 2: AI companion Typewriter Briefing with Skip */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md space-y-6 text-center"
          >
            <div className="flex flex-col items-center">
              <div 
                className="w-14 h-14 rounded-full bg-slate-950/40 border flex items-center justify-center animate-bounce text-2xl shadow-xl"
                style={{ borderColor: `${accentColor}30`, color: accentColor }}
              >
                🤖
              </div>
              <span className="font-space text-[9px] uppercase tracking-widest text-slate-400 mt-2">Aether Companion Core</span>
            </div>

            <GlassCard className="text-left font-sans text-xs leading-relaxed min-h-[220px] whitespace-pre-line text-slate-200">
              {briefingText}
            </GlassCard>

            <div className="flex justify-between items-center gap-4 max-w-xs mx-auto">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 rounded-full border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-xs font-space font-semibold cursor-pointer"
              >
                Skip
              </button>
              <motion.button
                onClick={() => setStep(3)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-2.5 rounded-full text-white font-sora font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer btn-theme-gradient"
              >
                Continue
                <ArrowRight size={12} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: REAL SPOTIFY CONNECTION OAUTH CARD */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md"
          >
            <GlassCard className="text-center p-6 space-y-5">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center text-[#1DB954] shadow-lg mb-2">
                  <Music size={26} />
                </div>
                <h2 className="font-sora text-lg font-black text-slate-100 mt-1">🎵 Connect Spotify Account</h2>
                <p className="text-[9px] font-space text-slate-400 uppercase tracking-wider mt-0.5">Link real-time soundtracks</p>
              </div>

              <div className="bg-slate-950/40 rounded-2xl p-4 border border-white/5 space-y-2 text-left text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-[#1DB954] font-black">✔</span>
                  <span>Study playlists</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#1DB954] font-black">✔</span>
                  <span>Focus playlists</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#1DB954] font-black">✔</span>
                  <span>Mood-based music</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#1DB954] font-black">✔</span>
                  <span>Personalized recommendations</span>
                </div>
              </div>

              <div className="flex justify-between items-center gap-4 pt-2">
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-3.5 rounded-full border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white transition-all text-xs font-space font-semibold cursor-pointer"
                >
                  Skip
                </button>
                <button
                  onClick={handleConnectSpotify}
                  className="flex-1 py-3.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-slate-950 text-xs font-sora font-extrabold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Connect Spotify
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* STEP 4: CHOOSE UNIVERSE */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md"
          >
            <GlassCard>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[9px] font-space text-slate-400 uppercase tracking-widest">
                  Choose Universe
                </span>
                <span className="text-xs font-black" style={{ color: accentColor }}>Select World</span>
              </div>

              <div className="space-y-4">
                <h3 className="font-sora text-sm font-bold text-slate-200">Select your destination world</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`w-full py-3.5 px-4 rounded-full text-xs font-space text-left border transition-all cursor-pointer ${
                        theme === t.id 
                          ? 'bg-white/10 text-white font-semibold' 
                          : 'bg-slate-950/20 text-slate-400 border-white/5 hover:bg-white/5'
                      }`}
                      style={theme === t.id ? { borderColor: t.accent } : {}}
                    >
                      <span className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.accent }} />
                          {t.name}
                        </span>
                        <span className="text-[9px] text-slate-500 italic">
                          {t.id === 'zen' ? 'Serif / waves' : t.id === 'galaxy' ? 'monospaced / space' : t.id === 'sakura' ? 'rounded / petals' : t.id === 'ocean' ? 'fluid / bubbles' : 'luxury / aurora'}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end items-center mt-8 pt-4 border-t border-white/5">
                <motion.button
                  onClick={() => setStep(5)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-white transition-all cursor-pointer text-xs font-sora font-semibold btn-theme-gradient"
                >
                  Enter World <ArrowRight size={14} />
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* STEP 5: AI UNIVERSE BUILDER LOADING */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-md text-center space-y-6"
          >
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                boxShadow: [`0 0 10px ${accentColor}20`, `0 0 30px ${accentColor}50`, `0 0 10px ${accentColor}20`],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-full border flex items-center justify-center mx-auto text-purple-400 bg-slate-950/40"
              style={{ borderColor: `${accentColor}40`, color: accentColor }}
            >
              <Brain size={34} />
            </motion.div>

            <div className="space-y-2">
              <h2 className="font-sora text-lg font-extrabold text-slate-200">
                {genDone ? '✨ Your universe is ready.' : '🧠 Building your AI universe...'}
              </h2>
              <p className="text-[9px] font-space text-slate-500 uppercase tracking-widest">
                customizing your dashboard parameters
              </p>
            </div>

            {/* Progress bar loader */}
            {!genDone ? (
              <div className="w-full h-1.5 rounded-full bg-slate-950/80 overflow-hidden border border-white/5 p-0.5">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${generationProgress}%`,
                    background: `linear-gradient(to right, ${accentColor}, #f472b6)`,
                    boxShadow: `0 0 10px ${accentColor}`,
                  }}
                />
              </div>
            ) : (
              <motion.button
                onClick={onComplete}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="py-3.5 px-8 rounded-full text-white font-sora font-extrabold text-xs transition-all flex items-center gap-2 mx-auto cursor-pointer shadow-lg hover:glow-theme btn-theme-gradient"
              >
                Enter Aether OS
                <Sparkles size={14} />
              </motion.button>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default OnboardingJourney;
