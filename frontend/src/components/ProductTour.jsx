import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import GlassCard from './GlassCard';
import { ArrowLeft, ArrowRight, X, Sparkles } from 'lucide-react';

const ProductTour = ({ onComplete }) => {
  const { theme, themes } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightStyle, setHighlightStyle] = useState({ opacity: 0 });
  const [bubbleStyle, setBubbleStyle] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
  const bubbleRef = useRef(null);

  const activeTheme = themes.find((t) => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;

  const TOUR_STEPS = [
    {
      selector: '.top-controls-tour',
      title: "✨ Aether Control Panel",
      content: "Select your visual theme environment (5 worlds) and toggle language localization (English, Hindi, Hinglish) on-the-fly.",
      position: 'bottom',
    },
    {
      selector: '.nav-dock-tour',
      title: "✨ App Navigation Sidebar",
      content: "Access your dashboard widgets, smart tasks planners, stats analytics logs, and study settings profiles.",
      position: 'right',
    },
    {
      selector: '.mascot-tour',
      title: "✨ AI Companion Mascot",
      content: "Meet your interactive study companion. Click the floating avatar to get daily quotes and planning tips.",
      position: 'left',
    },
    {
      selector: '.plan-tour',
      title: "✨ Aaj Ka Plan (Timeline)",
      content: "Add tasks in the Planner, then sync here to generate structured hourly time blocks.",
      position: 'top',
    },
    {
      selector: '.stats-tour',
      title: "✨ Productivity Velocity Stats",
      content: "Track your active streaks, total focus minutes, and overall alignment score. Let's aim for 100%!",
      position: 'top',
    }
  ];

  const updatePosition = () => {
    const step = TOUR_STEPS[currentStep];
    const element = document.querySelector(step.selector);

    if (element) {
      const rect = element.getBoundingClientRect();
      
      // Calculate highlight dimensions (include padding)
      const pad = 8;
      setHighlightStyle({
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
        opacity: 1,
        borderRadius: '16px',
        boxShadow: `0 0 0 9999px rgba(3, 2, 8, 0.75), 0 0 15px ${accentColor}`,
        border: `1.5px solid ${accentColor}`,
        transition: 'all 0.4s ease-in-out',
      });

      // Calculate tooltip bubble position based on target element position
      const bubbleSpacing = 16;
      let top = 0;
      let left = 0;
      
      if (step.position === 'bottom') {
        top = rect.bottom + bubbleSpacing;
        left = rect.left + rect.width / 2;
      } else if (step.position === 'top') {
        top = rect.top - (bubbleRef.current?.offsetHeight || 130) - bubbleSpacing;
        left = rect.left + rect.width / 2;
      } else if (step.position === 'right') {
        top = rect.top + rect.height / 2 - (bubbleRef.current?.offsetHeight || 130) / 2;
        left = rect.right + bubbleSpacing;
      } else {
        // default left position
        top = rect.top + rect.height / 2 - (bubbleRef.current?.offsetHeight || 130) / 2;
        left = rect.left - (bubbleRef.current?.offsetWidth || 230) - bubbleSpacing;
      }

      // Safeguards to prevent tooltips overflowing off-screen
      left = Math.max(16, Math.min(left, window.innerWidth - (bubbleRef.current?.offsetWidth || 230) - 16));
      top = Math.max(80, Math.min(top, window.innerHeight - (bubbleRef.current?.offsetHeight || 130) - 16));

      setBubbleStyle({
        top: top,
        left: left,
        transition: 'all 0.4s ease-in-out',
        position: 'fixed',
      });
    } else {
      // If target element is not on active screen, show tour guide centrally
      setHighlightStyle({ opacity: 0 });
      setBubbleStyle({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed',
        boxShadow: `0 0 30px ${accentColor}15`,
      });
    }
  };

  useEffect(() => {
    // Small timeout to allow active transitions to finish rendering
    const timer = setTimeout(() => {
      updatePosition();
    }, 100);

    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      clearTimeout(timer);
    };
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = TOUR_STEPS[currentStep];

  return (
    <div className="fixed inset-0 w-full h-full z-50 pointer-events-none">
      
      {/* 1. Dark spotlight overlay highlighting target bounds */}
      <AnimatePresence>
        {highlightStyle.opacity > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none transition-all duration-300"
            style={highlightStyle}
          />
        )}
      </AnimatePresence>

      {/* Background full shadow mask if highlight is not visible */}
      {highlightStyle.opacity === 0 && (
        <div className="fixed inset-0 bg-slate-950/80 z-40 pointer-events-auto" />
      )}

      {/* 2. Tour Guide bubble card */}
      <div 
        ref={bubbleRef}
        style={bubbleStyle}
        className="w-full max-w-[280px] z-50 pointer-events-auto"
      >
        <GlassCard 
          glow="purple" 
          className="p-4 relative border"
          style={{ borderColor: `${accentColor}30` }}
        >
          {/* Close / Skip button */}
          <button 
            onClick={onComplete}
            className="absolute top-3 right-3 text-slate-500 hover:text-white cursor-pointer transition-colors"
          >
            <X size={14} />
          </button>

          <div className="flex items-center gap-2 mb-2 pr-4">
            <Sparkles size={14} style={{ color: accentColor }} />
            <h4 className="font-sora text-xs font-bold text-slate-200">
              {step.title}
            </h4>
          </div>

          <p className="text-[10px] leading-relaxed text-slate-400 font-sans mb-5">
            {step.content}
          </p>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center text-[10px] font-space">
            <span className="text-slate-500 font-bold">
              {currentStep + 1} / {TOUR_STEPS.length}
            </span>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
                >
                  <ArrowLeft size={10} />
                  Prev
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex items-center gap-1 py-1.5 px-3.5 rounded-lg text-white transition-all cursor-pointer font-bold btn-theme-gradient"
              >
                {currentStep === TOUR_STEPS.length - 1 ? 'Enter OS' : 'Next'}
                <ArrowRight size={10} />
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ProductTour;
