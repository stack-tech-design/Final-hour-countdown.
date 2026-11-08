import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Settings, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Lock, 
  Smartphone, 
  Maximize2, 
  Minimize2, 
  Wifi, 
  Battery, 
  Sun, 
  Moon, 
  Zap, 
  ChevronRight, 
  Target, 
  Award, 
  Edit3, 
  X,
  Check,
  Share2,
  Info
} from 'lucide-react';

// Default Demo Settings
const DEFAULT_EVENT = {
  title: "PRODUCT LAUNCH & KEYNOTE 2026",
  startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // 15 days ago
  targetDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000 + 14 * 3600 * 1000 + 32 * 60 * 1000).toISOString().slice(0, 16), // 27d 14h 32m away
  tagline: "YOUR GOAL. YOUR TIME. YOUR MOMENT."
};

const DEFAULT_MILESTONES = [
  { id: '1', title: '30 Days Left — Strategic Planning Phase', completed: true, dateOffset: 30 },
  { id: '2', title: '21 Days Left — System Architecture & MVP', completed: true, dateOffset: 21 },
  { id: '3', title: '14 Days Left — Final System Preparation & Polish', completed: false, dateOffset: 14 },
  { id: '4', title: '7 Days Left — QA Testing & Final Review', completed: false, dateOffset: 7 },
  { id: '5', title: 'Deadline Day — THE MOMENT OF TRUTH', completed: false, dateOffset: 0 }
];

const MOTIVATIONAL_QUOTES = [
  "Don't count the days. Make the days count.",
  "Your goal. Your time. Your moment.",
  "Focus on the execution, not just the ticking clock.",
  "Great things are done by a series of small steps brought together.",
  "The future depends on what you do today.",
  "Every second is a fresh second to create your impact."
];

export default function App() {
  // App state
  const [eventData, setEventData] = useState(() => {
    const saved = localStorage.getItem('final_hour_event');
    return saved ? JSON.parse(saved) : DEFAULT_EVENT;
  });

  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem('final_hour_milestones');
    return saved ? JSON.parse(saved) : DEFAULT_MILESTONES;
  });

  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
  const [progressPercent, setProgressPercent] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [newMilestoneText, setNewMilestoneText] = useState("");
  const [editingMilestoneId, setEditingMilestoneId] = useState(null);
  const [editingMilestoneText, setEditingMilestoneText] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [currentClockTime, setCurrentClockTime] = useState("");
  const [currentDateString, setCurrentDateString] = useState("");

  const canvasRef = useRef(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('final_hour_event', JSON.stringify(eventData));
  }, [eventData]);

  useEffect(() => {
    localStorage.setItem('final_hour_milestones', JSON.stringify(milestones));
  }, [milestones]);

  // Real-time Clock & Countdown Loop
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Lock screen clock
      setCurrentClockTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDateString(now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }));

      const target = new Date(eventData.targetDate).getTime();
      const start = new Date(eventData.startDate).getTime();
      const currentMs = now.getTime();

      const diff = target - currentMs;

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
        setProgressPercent(100);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds, totalMs: diff });

        // Calculate visual progress percentage
        const totalDuration = target - start;
        const elapsed = currentMs - start;
        if (totalDuration > 0) {
          const pct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
          setProgressPercent(parseFloat(pct.toFixed(1)));
        } else {
          setProgressPercent(0);
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [eventData]);

  // Motivational quote rotator
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 8000);
    return () => clearInterval(quoteInterval);
  }, []);

  // Background Interactive Canvas Animation (Glowing ambient dust particles & streaks)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.2,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '#00F0FF' : '#8B5CF6'
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Milestone Actions
  const toggleMilestone = (id) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };

  const addMilestone = (e) => {
    e.preventDefault();
    if (!newMilestoneText.trim()) return;
    const newM = {
      id: Date.now().toString(),
      title: newMilestoneText.trim(),
      completed: false,
      dateOffset: 5
    };
    setMilestones([...milestones, newM]);
    setNewMilestoneText("");
  };

  const deleteMilestone = (id) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const startEditMilestone = (m) => {
    setEditingMilestoneId(m.id);
    setEditingMilestoneText(m.title);
  };

  const saveEditMilestone = (id) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, title: editingMilestoneText } : m));
    setEditingMilestoneId(null);
  };

  // Preset Handlers
  const applyPreset = (days, title) => {
    const now = new Date();
    const target = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    setEventData({
      title: title,
      startDate: now.toISOString().slice(0, 16),
      targetDate: target.toISOString().slice(0, 16),
      tagline: "YOUR GOAL. YOUR TIME. YOUR MOMENT."
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const resetToDefaults = () => {
    setEventData(DEFAULT_EVENT);
    setMilestones(DEFAULT_MILESTONES);
    localStorage.removeItem('final_hour_event');
    localStorage.removeItem('final_hour_milestones');
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-black flex flex-col items-center justify-between p-3 md:p-6 relative overflow-x-hidden">
      
      {/* Background Radial Lights */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Header / Brand Bar */}
      <header className="w-full max-w-6xl flex justify-between items-center py-3 px-4 mb-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60 z-20 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Clock className="w-5 h-5 text-black font-bold animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              FINAL HOUR
            </h1>
            <p className="text-[10px] text-cyan-400/80 font-mono tracking-widest uppercase -mt-0.5">
              EVERY MOMENT MATTERS
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsFullWidth(!isFullWidth)}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 transition-all border border-slate-700/50"
            title={isFullWidth ? "Smartphone Mockup View" : "Full Screen View"}
          >
            {isFullWidth ? <Smartphone className="w-3.5 h-3.5 text-cyan-400" /> : <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isFullWidth ? "Phone View" : "Expand View"}</span>
          </button>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all shadow-sm shadow-cyan-500/10"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>
        </div>
      </header>

      {/* Main Container: Mobile Mockup Frame vs Full Responsive View */}
      <main className={`w-full transition-all duration-500 flex justify-center z-10 ${isFullWidth ? 'max-w-5xl' : 'max-w-md'}`}>
        
        {/* Smartphone Shell Mockup */}
        <div className={`w-full relative transition-all duration-300 ${!isFullWidth ? 'rounded-[48px] border-[8px] border-slate-800/90 shadow-[0_0_50px_rgba(0,240,255,0.12)] p-4 md:p-6 bg-[#0B0F19]/90' : 'rounded-3xl border border-slate-800 p-6 bg-[#0B0F19]/90'} backdrop-blur-2xl overflow-hidden`}>
          
          {/* Dynamic Background Particle Canvas inside frame */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0" />

          {/* Smartphone Status Bar (Top) */}
          <div className="relative z-10 flex justify-between items-center text-xs font-mono text-slate-400 mb-6 px-2 pt-1 select-none">
            <span className="font-semibold text-slate-200">{currentClockTime || "09:41"}</span>
            {/* Notch / Speaker visual */}
            {!isFullWidth && (
              <div className="w-24 h-4 bg-slate-900 rounded-full border border-slate-800/80 flex items-center justify-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                <div className="w-8 h-1 rounded-full bg-slate-800"></div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Sun className="w-3.5 h-3.5 text-cyan-400" />
              <Wifi className="w-3.5 h-3.5 text-slate-400" />
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* Header 1: Date & Status */}
          <div className="relative z-10 text-center mb-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/60 border border-cyan-500/20 backdrop-blur-md mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[11px] font-medium text-cyan-300 uppercase tracking-wider">
                {currentDateString || "Lock Screen Active"}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight leading-snug uppercase px-2">
              {eventData.title}
            </h2>
            <p className="text-xs text-indigo-300/80 font-medium mt-1">
              TARGET: {new Date(eventData.targetDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>

          {/* Main Hero Countdown Digits (2x2 Grid or 4 column display) */}
          <div className="relative z-10 mb-6">
            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
              {[
                { label: 'DAYS', val: timeRemaining.days },
                { label: 'HOURS', val: timeRemaining.hours },
                { label: 'MINUTES', val: timeRemaining.minutes },
                { label: 'SECONDS', val: timeRemaining.seconds }
              ].map((unit, idx) => (
                <div key={idx} className="group relative flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 shadow-lg shadow-black/40">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-2xl sm:text-4xl font-black font-mono tracking-wider bg-gradient-to-b from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,240,255,0.3)]">
                    {String(unit.val).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-cyan-400/80 tracking-widest mt-1">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Progress Tracker: Circular Bar + Radial Stats */}
          <div className="relative z-10 mb-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                TIMELINE ELAPSED
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                {progressPercent}%
              </span>
            </div>

            {/* Glowing Linear Progress Bar */}
            <div className="w-full h-3 bg-slate-950 rounded-full p-0.5 overflow-hidden border border-slate-800 relative">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(0,240,255,0.6)] relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_#fff]"></div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-2 px-1">
              <span>Start: {new Date(eventData.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              <span>Finish: {new Date(eventData.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Interactive Milestone Timeline */}
          <div className="relative z-10 mb-6">
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-400" />
                MILESTONE ROADMAP
              </h3>
              <span className="text-[10px] text-slate-400">
                {milestones.filter(m => m.completed).length} / {milestones.length} Done
              </span>
            </div>

            <div className="space-y-2.5 relative">
              {/* Vertical connecting line */}
              <div className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-slate-800 z-0"></div>

              {milestones.map((milestone) => (
                <div 
                  key={milestone.id}
                  className={`relative z-10 flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                    milestone.completed 
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0 mr-2">
                    <button 
                      onClick={() => toggleMilestone(milestone.id)}
                      className="focus:outline-none transition-transform active:scale-95"
                    >
                      {milestone.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 hover:text-cyan-400" />
                      )}
                    </button>

                    {editingMilestoneId === milestone.id ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="text"
                          value={editingMilestoneText}
                          onChange={(e) => setEditingMilestoneText(e.target.value)}
                          className="flex-1 bg-slate-950 border border-cyan-500/50 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none"
                        />
                        <button 
                          onClick={() => saveEditMilestone(milestone.id)}
                          className="p-1 bg-emerald-500/20 text-emerald-300 rounded hover:bg-emerald-500/30"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className={`text-xs font-medium truncate ${milestone.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {milestone.title}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 opacity-70 hover:opacity-100 transition-opacity">
                    {editingMilestoneId !== milestone.id && (
                      <button 
                        onClick={() => startEditMilestone(milestone)}
                        className="p-1 text-slate-500 hover:text-cyan-400 rounded"
                        title="Edit milestone"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteMilestone(milestone.id)}
                      className="p-1 text-slate-500 hover:text-red-400 rounded"
                      title="Delete milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivational Rotator Section */}
          <div className="relative z-10 mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 via-slate-900/60 to-cyan-950/30 border border-purple-500/20 text-center">
            <Sparkles className="w-4 h-4 text-purple-400 mx-auto mb-1.5 animate-bounce" />
            <p className="text-xs italic font-serif text-slate-200 transition-all duration-500 px-2">
              "{MOTIVATIONAL_QUOTES[quoteIndex]}"
            </p>
            <p className="text-[10px] font-bold font-mono tracking-widest text-cyan-400 mt-2 uppercase">
              {eventData.tagline}
            </p>
          </div>

          {/* Smartphone Lock Screen Bottom Bar Visual */}
          {!isFullWidth && (
            <div className="relative z-10 flex flex-col items-center pt-2">
              <div className="w-32 h-1 bg-slate-700 rounded-full mb-1"></div>
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Swipe Up To Unlock</span>
            </div>
          )}
        </div>
      </main>

      {/* Embedded Project Showcase Footer Section */}
      <footer className="w-full max-w-4xl mt-8 mb-4 text-center z-20">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
          <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center justify-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            ABOUT FINAL HOUR
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto mb-4">
            FINAL HOUR is more than a countdown. It is a personal reminder that every second brings us closer to something meaningful. Designed to transform deadlines into achievable milestones, FINAL HOUR combines real-time countdown technology, elegant visual storytelling, and motivational progress tracking into one immersive lock-screen experience. Whether preparing for an examination, launching a project, reaching a personal goal, or counting down to a special occasion, FINAL HOUR keeps your destination visible and your motivation alive.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
            >
              <span>EXPLORE FINAL HOUR →</span>
            </button>
            <button 
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all border border-slate-700 flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{copiedLink ? "Link Copied!" : "Share Experience"}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Settings & Customization Drawer / Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-slate-100">Event Customization</h2>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Event / Project Title
                </label>
                <input 
                  type="text" 
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  placeholder="e.g., Exam Launch 2026"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Start Date & Time
                  </label>
                  <input 
                    type="datetime-local" 
                    value={eventData.startDate}
                    onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Target Deadline
                  </label>
                  <input 
                    type="datetime-local" 
                    value={eventData.targetDate}
                    onChange={(e) => setEventData({ ...eventData, targetDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Motivational Subtitle
                </label>
                <input 
                  type="text" 
                  value={eventData.tagline}
                  onChange={(e) => setEventData({ ...eventData, tagline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  placeholder="YOUR GOAL. YOUR TIME. YOUR MOMENT."
                />
              </div>
            </div>

            {/* Preset Buttons */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => applyPreset(30, "30-DAY GOAL CHALLENGE")}
                  className="px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 rounded-xl border border-slate-700 text-left transition-colors"
                >
                  🚀 30 Days Challenge
                </button>
                <button 
                  onClick={() => applyPreset(14, "FINAL EXAM PREPARATION")}
                  className="px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 rounded-xl border border-slate-700 text-left transition-colors"
                >
                  📚 Exam Prep (14 Days)
                </button>
                <button 
                  onClick={() => applyPreset(7, "PRODUCT SPRINT LAUNCH")}
                  className="px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 rounded-xl border border-slate-700 text-left transition-colors"
                >
                  🔥 Launch in 7 Days
                </button>
                <button 
                  onClick={() => applyPreset(365, "NEW YEAR 2027 COUNTDOWN")}
                  className="px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 rounded-xl border border-slate-700 text-left transition-colors"
                >
                  ✨ New Year Countdown
                </button>
              </div>
            </div>

            {/* Add Milestone Form */}
            <div className="mb-6 pt-4 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Add Custom Milestone
              </label>
              <form onSubmit={addMilestone} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMilestoneText}
                  onChange={(e) => setNewMilestoneText(e.target.value)}
                  placeholder="e.g. Complete Final Code Audit"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </form>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button 
                onClick={resetToDefaults}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo Defaults
              </button>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
