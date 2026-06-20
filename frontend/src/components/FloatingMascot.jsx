import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useExperience } from '../context/ExperienceContext';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, Brain, ChevronRight } from 'lucide-react';

// ── AI Memory helpers ─────────────────────────────────────────────────────────
const getAIMemory = () => {
  try {
    return JSON.parse(localStorage.getItem('nova_memory') || '{}');
  } catch { return {}; }
};
const saveAIMemory = (patch) => {
  const mem = getAIMemory();
  localStorage.setItem('nova_memory', JSON.stringify({ ...mem, ...patch }));
};

// ── Dynamic time-of-day greeting ──────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 5)  return { text: 'Still up?', icon: '🌙', desc: 'late night' };
  if (h < 12) return { text: 'Good morning', icon: '☀️', desc: 'morning' };
  if (h < 17) return { text: 'Good afternoon', icon: '🌤️', desc: 'afternoon' };
  if (h < 21) return { text: 'Good evening', icon: '🌇', desc: 'evening' };
  return { text: 'Winding down?', icon: '🌙', desc: 'night' };
};

// ── Context tips ──────────────────────────────────────────────────────────────
const ContextHelps = {
  student: {
    feed:      { explain: "Your Home Feed — daily XP, challenges, streaks and the social wall all live here.", suggest: "🎯 Spin the challenge wheel or log your energy vibe to lock in!", plan: "📅 Check off today's missions, claim your streak XP, then hit the Focus Room." },
    study:     { explain: "Study Zone holds your course decks, session logs and notes workspace.", suggest: "📚 Create a new course card and log 30 minutes to update your streak!", plan: "📅 Review active subjects, check syllabus progress, log study duration." },
    placement: { explain: "Track DSA Striver Sheet progress, mock interview checklists and LeetCode benchmarks.", suggest: "💻 Solve 1 new dynamic programming problem and check it off the DSA list.", plan: "📅 Review 2 DSA questions, update placement progress." },
    exam:      { explain: "Exam Zone tracks countdown days, syllabus targets and test score logs.", suggest: "🎓 Add an exam countdown for GATE or university midterms.", plan: "📅 Review exam syllabus, take a mock test, update target scores." },
    focus:     { explain: "Focus Room: Pomodoro timer + ambient tracks (Rain, Forest, Lo-fi) for deep flow.", suggest: "🎧 Start a 25-minute session with 'Lo-Fi beats' to lock in.", plan: "📅 Launch 2 Pomodoro sessions back-to-back with rain background." },
    habit:     { explain: "Habit Garden visualises daily consistency. Checking habits grows seedlings!", suggest: "🌱 Check off 'LeetCode 1 Problem' or 'Read 10 pages' to water your garden.", plan: "📅 Complete your top 3 habits to sprout new flowers." },
    aibuddy:   { explain: "AI Study Buddy — ask anything, get code reviews, or simplified topic summaries.", suggest: "🤖 Try: 'Explain dynamic programming in simple terms'", plan: "📅 Consult AI Buddy on weak topics, write system design summaries." },
    profile:   { explain: "Your XP level, badges achieved, and theme preferences live here.", suggest: "🌟 Customise your universe theme or check out earned badges.", plan: "📅 Review unlocked badges and adjust universe settings." },
  },
  professional: {
    office:      { explain: "Office Hub summarises your corporate day — meetings, tasks, and Raycast commands.", suggest: "🏢 Add at least one 'Urgent & Important' item to your priority matrix.", plan: "📅 Update priority items, check upcoming meetings, leverage task blocks." },
    clients:     { explain: "Client Hub manages portfolios, contract values, contacts and follow-up deadlines.", suggest: "👥 Record a contract value or schedule a kickoff reminder.", plan: "📅 Review client statuses, send follow-ups, update contract metrics." },
    projects:    { explain: "Project Hub: active boards, milestones, deadlines and backlog cards.", suggest: "📂 Move a backlog card to 'In Progress' on your Kanban board.", plan: "📅 Sync with team, update board items, review delivery timelines." },
    meetings:    { explain: "Meeting Center: calendar agendas, scheduler slots, and meeting minute templates.", suggest: "📅 Log a new client sync or draft notes for the standup.", plan: "📅 Align calendar schedule, review agenda blocks, compile notes." },
    finance:     { explain: "Finance Hub tracks MRR, software expenses, and net profit margins.", suggest: "💰 Record a transaction or check infrastructure cost logs.", plan: "📅 Balance today's transactions, calculate profit/loss, log invoices." },
    business:    { explain: "Business Hub: OKR prioritisation, career growth milestones and notes workspace.", suggest: "📊 Review your Q3 strategy document or competency map progress.", plan: "📅 Track OKR targets, check growth milestones, reply to client streams." },
    executiveai: { explain: "Executive AI assists with corporate analysis, email drafting and meeting minutes.", suggest: "🧠 Ask AI to 'Draft a weekly stakeholder briefing email'.", plan: "📅 Consult AI to write progress briefs or synthesise raw notes." },
    profile:     { explain: "Settings for currency, language, and workspace preferences.", suggest: "🌟 Switch universe theme (Zen, Sakura, Ocean) to adjust the environment.", plan: "📅 Configure corporate currency and set default universe theme." },
  }
};

// ── Surprise messages (shown randomly) ───────────────────────────────────────
const SURPRISE_STUDENT = [
  "🎲 Fun fact: The Pomodoro was named after a tomato-shaped timer. Very low-fi!",
  "💡 You've been at it — remember to blink and breathe!",
  "🌱 Every problem you solve compounds into expertise. Keep stacking!",
  "☕ Hydration check: when did you last drink water?",
  "🔥 Consistency > intensity. Show up every day.",
];
const SURPRISE_PRO = [
  "📊 Reminder: calendar week ends Friday. Any unbilled hours to log?",
  "☕ The best meetings start with a clear agenda. Set one before your next call.",
  "💼 High performers review their priorities mid-day. Quick 2-min check in.",
  "🧠 Burnout is real — block 15 min of white space on your calendar.",
  "🚀 Small wins compound. Celebrate a closed task today.",
];

// ── Daily challenge bank ──────────────────────────────────────────────────────
const DAILY_CHALLENGES_STUDENT = [
  { text: "Solve 1 LeetCode Medium problem", xp: 60, icon: "💻" },
  { text: "Do a 25-minute no-distraction focus block", xp: 40, icon: "⏱️" },
  { text: "Write 3 flashcards on your weakest topic", xp: 35, icon: "📝" },
  { text: "Drink 2 glasses of water in the next hour", xp: 20, icon: "💧" },
  { text: "Read one article related to your placement prep", xp: 30, icon: "📖" },
];
const DAILY_CHALLENGES_PRO = [
  { text: "Block 90 min of deep work before lunch", xp: 0, icon: "🧱" },
  { text: "Send one relationship-building follow-up email", xp: 0, icon: "📧" },
  { text: "Review and trim your task list to max 5 items", xp: 0, icon: "✂️" },
  { text: "Prep your agenda for tomorrow's first meeting", xp: 0, icon: "📋" },
  { text: "Take a 10-minute walk to reset focus", xp: 0, icon: "🚶" },
];

// ── Personalised recommendation pools ────────────────────────────────────────
const RECS_STUDENT = [
  { icon: "🎯", title: "Striver's SDE Sheet", hint: "Top 191 interview problems" },
  { icon: "📚", title: "GATE PYQs", hint: "Last 10 years in 30 days" },
  { icon: "🧠", title: "System Design Primer", hint: "For FAANG-level prep" },
  { icon: "🌱", title: "Habit Streak", hint: "You're 1 day away from a week!" },
];
const RECS_PRO = [
  { icon: "📈", title: "Q3 OKR Review", hint: "Two weeks left in the quarter" },
  { icon: "🤝", title: "Client Follow-up", hint: "3 contacts due this week" },
  { icon: "🔒", title: "Deep Work Block", hint: "Schedule before 10 AM for peak output" },
  { icon: "📊", title: "Monthly MRR Report", hint: "Finance Hub ready" },
];

// ─────────────────────────────────────────────────────────────────────────────

const FloatingMascot = ({ activeTab = 'dashboard' }) => {
  const { theme, themes } = useTheme();
  const { experience } = useExperience();
  const { user } = useAuth();

  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState('menu'); // 'menu' | 'tip' | 'challenge' | 'recs' | 'surprise'
  const [tipText, setTipText] = useState('');
  const [pulse, setPulse] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [challengeDone, setChallengeDone] = useState(false);

  // ── AI Memory: track visits and recall streak ──────────────────────────────
  useEffect(() => {
    const mem = getAIMemory();
    const today = new Date().toDateString();

    // Increment visit count
    const visits = (mem.visits || 0) + 1;
    const lastVisit = mem.lastVisit;
    const streak = lastVisit === new Date(Date.now() - 86400000).toDateString()
      ? (mem.streak || 0) + 1
      : lastVisit === today ? (mem.streak || 0) : 1;

    saveAIMemory({ visits, streak, lastVisit: today });
  }, []);

  // ── Assign daily challenge once per day ───────────────────────────────────
  useEffect(() => {
    const mem = getAIMemory();
    const today = new Date().toDateString();
    const pool = experience === 'student' ? DAILY_CHALLENGES_STUDENT : DAILY_CHALLENGES_PRO;

    if (mem.challengeDate !== today) {
      const idx = Math.floor(Math.random() * pool.length);
      const challenge = pool[idx];
      saveAIMemory({ challenge, challengeDate: today, challengeDone: false });
      setDailyChallenge(challenge);
      setChallengeDone(false);
    } else {
      setDailyChallenge(mem.challenge || pool[0]);
      setChallengeDone(!!mem.challengeDone);
    }
  }, [experience]);

  // ── Greeting with AI memory context ──────────────────────────────────────
  const buildGreeting = useCallback(() => {
    const { text, icon } = getGreeting();
    const mem = getAIMemory();
    const name = user?.name?.split(' ')[0] || (experience === 'student' ? 'Seeker' : 'Partner');
    const streak = mem.streak || 1;

    if (experience === 'student') {
      const lines = [
        `${icon} ${text}, ${name}! ${streak > 1 ? `${streak}-day streak 🔥 — keep it going!` : "Let's lock in today!"}`,
        `${icon} Hey ${name}! Your energy from yesterday is still here. Let's build on it.`,
        `${icon} ${text}! Nova's been tracking your progress — you're on a roll, ${name}!`,
      ];
      return lines[Math.floor(Math.random() * lines.length)];
    } else {
      const lines = [
        `${icon} ${text}, ${name}. Your workspace is optimised and ready.`,
        `${icon} ${text}. ${streak > 1 ? `${streak} days strong` : 'Fresh start'} — let's make today count.`,
        `${icon} Nova online. ${text}, ${name}. Priority matrix loaded.`,
      ];
      return lines[Math.floor(Math.random() * lines.length)];
    }
  }, [experience, user]);

  // ── Auto-expand on XP/notes change ───────────────────────────────────────
  useEffect(() => {
    let lastXP = localStorage.getItem('aether_xp') || '0';
    const interval = setInterval(() => {
      const currentXP = localStorage.getItem('aether_xp') || '0';
      if (currentXP !== lastXP) {
        lastXP = currentXP;
        const msg = experience === 'student'
          ? "🔥 XP gained! You're levelling up — keep the streak alive!"
          : "✅ Task cleared. Excellent execution.";
        setTipText(msg);
        setView('tip');
        setPulse(true);
        setExpanded(true);
        setTimeout(() => setPulse(false), 3000);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [experience]);

  // ── Random surprise every 5 minutes ──────────────────────────────────────
  useEffect(() => {
    const pool = experience === 'student' ? SURPRISE_STUDENT : SURPRISE_PRO;
    const interval = setInterval(() => {
      if (!expanded) {
        setPulse(true);
        setTimeout(() => setPulse(false), 2000);
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [experience, expanded]);

  const handleOpen = () => {
    setView('menu');
    setTipText(buildGreeting());
    setExpanded(true);
  };

  const handleAction = (action) => {
    const spaceHelps = ContextHelps[experience] || ContextHelps.student;
    const normalized = activeTab === 'dashboard' ? (experience === 'professional' ? 'office' : 'feed') : activeTab;
    const tabHelps = spaceHelps[normalized] || spaceHelps[Object.keys(spaceHelps)[0]];

    if (action === 'explain')   { setTipText(tabHelps.explain); setView('tip'); }
    if (action === 'suggest')   { setTipText(tabHelps.suggest); setView('tip'); }
    if (action === 'plan')      { setTipText(tabHelps.plan); setView('tip'); }
    if (action === 'surprise') {
      const pool = experience === 'student' ? SURPRISE_STUDENT : SURPRISE_PRO;
      setTipText(pool[Math.floor(Math.random() * pool.length)]);
      setView('tip');
    }
    if (action === 'challenge') { setView('challenge'); }
    if (action === 'recs')      { setView('recs'); }
  };

  const markChallengeDone = () => {
    setChallengeDone(true);
    saveAIMemory({ challengeDone: true });
    if (experience === 'student' && dailyChallenge?.xp) {
      const xp = parseInt(localStorage.getItem('aether_xp') || '0') + dailyChallenge.xp;
      localStorage.setItem('aether_xp', xp.toString());
    }
    setTipText(experience === 'student' ? "🔥 Challenge crushed! XP rewarded. You're the goat!" : "✅ Challenge complete. Excellent discipline.");
    setView('tip');
  };

  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const accentColor = activeTheme.accent;
  const isPro = experience === 'professional';
  const recs = experience === 'student' ? RECS_STUDENT : RECS_PRO;

  const isZen = theme === 'zen';

  const cardClass = isZen
    ? 'border text-[#2C2520] font-sans'
    : isPro
      ? 'bg-slate-950/92 border-white/8 text-slate-300 font-mono'
      : 'bg-[#0c0618]/90 border-purple-500/15 text-slate-200 font-sans';

  const cardStyle = isZen
    ? { backgroundColor: '#FEFEFE', borderColor: 'rgba(181,130,99,0.2)', boxShadow: '0 12px 40px rgba(100,90,80,0.12)' }
    : isPro
      ? { borderColor: 'rgba(255,255,255,0.07)' }
      : { borderColor: `${accentColor}20` };

  const btnClass = isZen
    ? `px-2 py-1.5 rounded-lg border text-[9px] font-semibold transition-all cursor-pointer text-left leading-tight text-[#5C5047] hover:text-[#2C2520]`
    : `px-2 py-1.5 rounded-lg bg-white/3 hover:bg-white/6 border border-white/5 text-[9px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer text-left leading-tight`;


  return (
    <div className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-2 select-none">
      <AnimatePresence mode="wait">

        {/* ── COLLAPSED PILL ─────────────────────────────────────────────── */}
        {!expanded && (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleOpen}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className={`px-3 py-1.5 rounded-full border backdrop-blur-md shadow-lg flex items-center gap-1.5 text-[10px] font-space font-black cursor-pointer transition-all ${
              isPro
                ? 'bg-slate-950/75 border-white/6 text-slate-300 hover:text-white hover:border-white/12'
                : 'bg-purple-950/55 border-purple-500/12 text-purple-200 hover:bg-purple-950/75'
            }`}
            style={isPro ? {} : { borderColor: `${accentColor}18` }}
          >
            {/* Pulse dot for attention */}
            {pulse && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: 3, duration: 0.4 }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
              />
            )}
            <motion.span
              animate={pulse ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ repeat: 2, duration: 0.3 }}
            >🤖</motion.span>
            <span>Nova</span>
          </motion.button>
        )}

        {/* ── EXPANDED CARD ──────────────────────────────────────────────── */}
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`w-[230px] p-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border relative flex flex-col gap-2.5 ${cardClass}`}
            style={cardStyle}
          >

            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <div className="flex items-center gap-1.5">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.5 }}
                >🤖</motion.span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Nova · AI Companion</span>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="text-slate-600 hover:text-slate-300 transition-colors cursor-pointer p-0.5 rounded"
              >
                <X size={11} />
              </button>
            </div>

            {/* ── VIEW: TIP ───────────────────────────────────────── */}
            <AnimatePresence mode="wait">
              {view === 'tip' && (
                <motion.div
                  key="tip"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-[10px] leading-relaxed font-medium text-slate-300 min-h-[38px]">
                    {tipText}
                  </p>
                  <button
                    onClick={() => setView('menu')}
                    className="mt-2 flex items-center gap-1 text-[9px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    ← Back to menu
                  </button>
                </motion.div>
              )}

              {/* ── VIEW: CHALLENGE ─────────────────────────────── */}
              {view === 'challenge' && (
                <motion.div
                  key="challenge"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-2"
                >
                  <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">🎲 Daily Challenge</span>
                  {dailyChallenge && (
                    <div className="p-2.5 rounded-xl bg-white/3 border border-white/5 space-y-1.5">
                      <span className="text-xl">{dailyChallenge.icon}</span>
                      <p className="text-[10px] font-semibold text-slate-200 leading-snug">{dailyChallenge.text}</p>
                      {dailyChallenge.xp > 0 && (
                        <span className="text-[8px] font-space text-yellow-400">+{dailyChallenge.xp} XP</span>
                      )}
                    </div>
                  )}
                  {!challengeDone ? (
                    <button
                      onClick={markChallengeDone}
                      className="w-full py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all hover:scale-105"
                      style={{ background: isPro ? '#fff' : accentColor, color: '#0a0a0a' }}
                    >
                      ✅ Mark as Done
                    </button>
                  ) : (
                    <div className="py-1.5 rounded-xl text-[9px] font-black uppercase text-center text-emerald-400 border border-emerald-500/20 bg-emerald-950/10">
                      ✅ Completed Today!
                    </div>
                  )}
                  <button
                    onClick={() => setView('menu')}
                    className="flex items-center gap-1 text-[9px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                </motion.div>
              )}

              {/* ── VIEW: RECOMMENDATIONS ───────────────────────── */}
              {view === 'recs' && (
                <motion.div
                  key="recs"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-1.5"
                >
                  <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">🎯 For You Today</span>
                  {recs.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white/2 border border-white/4 hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <span className="text-base shrink-0">{r.icon}</span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-slate-200 leading-none truncate">{r.title}</p>
                        <p className="text-[8px] text-slate-500 mt-0.5 leading-none truncate">{r.hint}</p>
                      </div>
                    </motion.div>
                  ))}
                  <button
                    onClick={() => setView('menu')}
                    className="flex items-center gap-1 text-[9px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer mt-1"
                  >
                    ← Back
                  </button>
                </motion.div>
              )}

              {/* ── VIEW: MAIN MENU ─────────────────────────────── */}
              {view === 'menu' && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-2"
                >
                  {/* Greeting bubble */}
                  <p className="text-[10px] leading-relaxed font-medium text-slate-300 min-h-[32px]">
                    {tipText || buildGreeting()}
                  </p>

                  {/* Action grid */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/5">
                    <button onClick={() => handleAction('explain')} className={btnClass}>🔍 Explain</button>
                    <button onClick={() => handleAction('suggest')} className={btnClass}>💡 Suggest</button>
                    <button onClick={() => handleAction('plan')} className={btnClass}>📅 Daily Plan</button>
                    <button onClick={() => handleAction('surprise')} className={btnClass}>🎁 Surprise Me</button>
                    <button onClick={() => handleAction('challenge')} className={btnClass}>🎲 Challenge</button>
                    <button onClick={() => handleAction('recs')} className={btnClass}>🎯 For You</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status indicator */}
            <div className="flex items-center gap-1.5 border-t border-white/4 pt-2 mt-0.5">
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              />
              <span className="text-[8px] font-mono text-slate-600">Nova online · AI memory active</span>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default FloatingMascot;
