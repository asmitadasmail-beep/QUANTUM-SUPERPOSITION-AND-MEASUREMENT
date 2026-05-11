import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Waves, 
  CircleDot, 
  Eye, 
  EyeOff,
  Play, 
  Pause, 
  RefreshCcw, 
  Info,
  ChevronRight,
  TrendingUp,
  BarChart3,
  BookOpen,
  FlaskConical,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// --- Constants & Types ---
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 520;
const SCREEN_X = 850;
const BARRIER_X = 200;

type Mode = 'wave' | 'particle' | 'particle+pattern';
type Tab = 'simulation' | 'theory' | 'results';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  color: string;
}

// --- Page Component ---

export const DoubleSlitPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('simulation');
  const [mode, setMode] = useState<Mode>('wave');
  const [observerOn, setObserverOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Physics Parameters
  const [wavelength, setWavelength] = useState(60); // λ
  const [slitSeparation, setSlitSeparation] = useState(100); // d
  const [slitWidth, setSlitWidth] = useState(20); // a
  const [particleRate, setParticleRate] = useState(3);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particleCount, setParticleCount] = useState(0);
  const [impacts, setImpacts] = useState<{y: number, color: string}[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const nextParticleId = useRef(0);
  const animationFrame = useRef<number>(0);
  const time = useRef(0);

  // Derived Values
  const L = SCREEN_X - BARRIER_X; // Distance to screen
  const fringeSpacing = (wavelength * L) / slitSeparation;
  
  // Simulation Loop
  useEffect(() => {
    if (!isPlaying || activeTab !== 'simulation') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw Background
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      const centerY = CANVAS_HEIGHT / 2;
      const s1y = centerY - slitSeparation / 2;
      const s2y = centerY + slitSeparation / 2;

      time.current += mode === 'particle+pattern' ? 0.6 : mode === 'wave' ? 0.5 : 0.2;
      const k = (2 * Math.PI) / wavelength;
      const omega = 0.5;

      if (mode === 'wave' || mode === 'particle+pattern') {
        // Draw Waves
        const step = mode === 'wave' ? 4 : 6; // Balance performance in mixed mode
        
        // Incoming plane waves
        for (let x = 0; x < BARRIER_X; x += 4) {
          const amp = Math.cos(k * x - omega * time.current);
          ctx.fillStyle = amp > 0 ? `rgba(60, 60, 80, ${amp * 0.2})` : 'transparent';
          ctx.fillRect(x, 0, 4, CANVAS_HEIGHT);
        }

        // Outgoing interference pattern
        // Render as subtle circular waves to match image vibe
        for (let x = BARRIER_X + 2; x < CANVAS_WIDTH; x += step) {
          for (let y = 0; y < CANVAS_HEIGHT; y += step) {
             const d1 = Math.sqrt(Math.pow(x - BARRIER_X, 2) + Math.pow(y - s1y, 2));
             const d2 = Math.sqrt(Math.pow(x - BARRIER_X, 2) + Math.pow(y - s2y, 2));
             
             let amp = 0;
             if (observerOn) {
               const amp1 = Math.cos(k * d1 - omega * time.current);
               const amp2 = Math.cos(k * d2 - omega * time.current);
               amp = (amp1 + amp2) * 0.5;
             } else {
               amp = Math.cos(k * d1 - omega * time.current) + Math.cos(k * d2 - omega * time.current);
             }
             
             // Cyan wave fronts with non-destructive interference aesthetics
             if (amp > 0.1) {
               ctx.fillStyle = `rgba(0, 150, 255, ${amp * (mode === 'wave' ? 0.25 : 0.15)})`;
               ctx.fillRect(x, y, step, step);
             } else if (amp < -0.1) {
               ctx.fillStyle = `rgba(139, 139, 255, ${Math.abs(amp) * 0.05})`;
               ctx.fillRect(x, y, step, step);
             }
          }
        }
      } 
      
      if (mode === 'particle' || mode === 'particle+pattern') {
        // Particle Mode (Orange Particles)
        if (Math.random() < particleRate * (mode === 'particle+pattern' ? 0.35 : 0.2)) {
          particlesRef.current.push({
            id: nextParticleId.current++,
            x: 0,
            y: centerY + (Math.random() - 0.5) * 200,
            vx: mode === 'particle+pattern' ? 14 + Math.random() * 4 : 5 + Math.random() * 1.5,
            vy: (Math.random() - 0.5) * (mode === 'particle+pattern' ? 2.5 : 1.0),
            active: true,
            color: '#ff9900' // Orange particles
          });
        }

        particlesRef.current.forEach(p => {
          if (!p.active) return;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x >= BARRIER_X && p.x <= BARRIER_X + 8) {
            const inSlit1 = Math.abs(p.y - s1y) < slitWidth / 2;
            const inSlit2 = Math.abs(p.y - s2y) < slitWidth / 2;
            if (!inSlit1 && !inSlit2) p.active = false;
          }

          if (p.x >= SCREEN_X) {
            p.active = false;
            // Screen logic...
            const getIntensity = (yOffset: number) => {
              const thetaVal = Math.atan2(yOffset, L);
              const st = Math.sin(thetaVal);
              const delta = (Math.PI * slitSeparation * 20 * st) / (wavelength * 25);
              const beta = (Math.PI * slitWidth * 15 * st) / (wavelength * 25);
              const diffTerm = Math.abs(beta) < 1e-9 ? 1 : Math.pow(Math.sin(beta) / beta, 2);
              return observerOn ? 0.5 : Math.pow(Math.cos(delta), 2) * diffTerm;
            };

            let sampleY = 0;
            let found = false;
            for (let i=0; i<30; i++) {
              const testY = (Math.random() - 0.5) * 400;
              if (Math.random() < getIntensity(testY)) {
                sampleY = centerY + testY;
                found = true;
                break;
              }
            }
            if (!found) sampleY = p.y;
            setImpacts(prev => [...prev.slice(-800), { y: sampleY, color: '#ff9900' }]);
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 4;
          ctx.shadowColor = p.color;
          ctx.fill();
        });
        particlesRef.current = particlesRef.current.filter(p => p.active || p.x < SCREEN_X + 10);
      }

      // Draw Barrier (Grey high-contrast)
      ctx.fillStyle = '#444c5a';
      ctx.fillRect(BARRIER_X, 0, 8, s1y - slitWidth / 2);
      ctx.fillRect(BARRIER_X, s1y + slitWidth / 2, 8, s2y - s1y - slitWidth);
      ctx.fillRect(BARRIER_X, s2y + slitWidth / 2, 8, CANVAS_HEIGHT - (s2y + slitWidth / 2));
      
      // Slit Label
      ctx.fillStyle = '#888';
      ctx.font = '12px "JetBrains Mono"';
      ctx.fillText('d', BARRIER_X + 15, centerY + 5);

      // Detection Screen
      ctx.fillStyle = '#1e1e24';
      ctx.fillRect(SCREEN_X, 0, 10, CANVAS_HEIGHT);

      // Impacts (Orange thin lines on screen)
      impacts.forEach(hit => {
        ctx.fillStyle = '#ff9900';
        ctx.globalAlpha = 0.4;
        ctx.fillRect(SCREEN_X + 2, hit.y - 0.5, 6, 1);
        ctx.globalAlpha = 1.0;
      });

      animationFrame.current = requestAnimationFrame(render);
    };

    animationFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame.current);
  }, [isPlaying, wavelength, slitSeparation, slitWidth, mode, observerOn, particleRate, impacts, activeTab]);

  const theoreticalData = useMemo(() => {
    const data = [];
    for (let y = -250; y <= 250; y += 2) {
      const thetaVal = Math.atan2(y, L);
      const st = Math.sin(thetaVal);
      const delta = (Math.PI * slitSeparation * st) / wavelength;
      const beta = (Math.PI * slitWidth * st) / wavelength;
      const diffTerm = Math.abs(beta) < 1e-9 ? 1 : Math.pow(Math.sin(beta) / beta, 2);
      
      const unobserved = Math.pow(Math.cos(delta), 2) * diffTerm;
      
      const b1 = (Math.PI * slitWidth * Math.sin(Math.atan2(y - (slitSeparation/2), L))) / wavelength;
      const b2 = (Math.PI * slitWidth * Math.sin(Math.atan2(y + (slitSeparation/2), L))) / wavelength;
      const observed = ((Math.abs(b1) < 1e-9 ? 1 : Math.pow(Math.sin(b1)/b1, 2)) + 
                        (Math.abs(b2) < 1e-9 ? 1 : Math.pow(Math.sin(b2)/b2, 2))) * 0.5;

      data.push({
        y,
        intensity: observerOn ? observed : unobserved,
        unobserved,
        observed
      });
    }
    return data;
  }, [wavelength, slitSeparation, slitWidth, observerOn]);

  const stats = [
    { label: 'Total IMPACTS', value: impacts.length, unit: 'pts', color: 'text-quantum-cyan' },
    { label: 'COHERENCE', value: observerOn ? 'Decohered' : 'Coherent', unit: '', color: observerOn ? 'text-yellow-400' : 'text-green-400' },
    { label: 'PATTERN', value: observerOn ? 'Envelope' : 'Interference', unit: '', color: 'text-white' },
    { label: 'FRINGE Δy', value: fringeSpacing.toFixed(1), unit: 'px', color: 'text-quantum-magenta' },
  ];

  const resetSim = () => {
    setImpacts([]);
    setParticleCount(0);
    particlesRef.current = [];
  };

  return (
    <div className="flex flex-col gap-6 h-full min-h-[calc(100vh-180px)]">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FlaskConical className="text-quantum-cyan" size={24} />
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Double-slit experiment</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
              — {mode === 'particle' ? 'Particle accumulation mode' : mode === 'wave' ? 'Wave interference mode' : 'Particle + interference pattern'}
            </p>
          </div>
        </div>
        
        {/* Navigation Tabs (Simulation, Theory, Results) */}
        <nav className="flex gap-1 bg-black/40 p-1 rounded-xl border border-quantum-border">
          {(['simulation', 'theory', 'results'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-quantum-cyan text-black shadow-[0_0_10px_rgba(0,242,255,0.3)]' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'simulation' && (
          <motion.div 
            key="sim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col xl:flex-row gap-6 h-full"
          >
            {/* Main Canvas Area */}
            <div className="flex-grow flex flex-col gap-6">
              <div className="relative glass-panel bg-[#0a0a0f] overflow-hidden flex items-center justify-center min-h-[520px] border border-[#2a2a35] rounded-2xl shadow-2xl">
                <canvas 
                  ref={canvasRef} 
                  width={CANVAS_WIDTH} 
                  height={CANVAS_HEIGHT}
                  className="w-full h-full object-contain"
                />
                
                {/* Detection Screen Glow (Image Style) */}
                <div className="absolute right-0 h-full w-2 bg-quantum-cyan/10 blur-sm" style={{ right: `${CANVAS_WIDTH - SCREEN_X}px` }} />

                <AnimatePresence>
                  {observerOn && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 20 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 px-6 py-2 bg-yellow-500 text-black text-[10px] font-bold uppercase rounded-full shadow-[0_0_20px_rgba(234,179,8,0.5)] z-10"
                    >
                      Wavefunction Collapse Active
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Control Bar (Image Style) */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex bg-black/40 p-1 rounded-xl border border-quantum-border">
                  <button 
                    onClick={() => { setMode('wave'); resetSim(); }}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${mode === 'wave' ? 'bg-quantum-cyan text-black border-quantum-cyan' : 'text-gray-400 border-transparent hover:text-white'}`}
                  >
                    Wave
                  </button>
                  <button 
                    onClick={() => { setMode('particle'); resetSim(); }}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${mode === 'particle' ? 'bg-[#ff9900]/20 text-[#ff9900] border-[#ff9900]/50 shadow-[0_0_15px_rgba(255,153,0,0.2)]' : 'text-gray-400 border-transparent hover:text-white'}`}
                  >
                    Particle
                  </button>
                  <button 
                    onClick={() => { setMode('particle+pattern'); resetSim(); }}
                    className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${mode === 'particle+pattern' ? 'bg-[#5b5b9b]/20 text-[#8b8bff] border-[#8b8bff]/50 shadow-[0_0_15px_rgba(139,139,255,0.2)]' : 'text-gray-400 border-transparent hover:text-white'}`}
                  >
                    Particle + Pattern
                  </button>
                </div>

                <button 
                  onClick={resetSim}
                  className="flex items-center gap-2 px-6 py-2.5 bg-black/40 hover:bg-black/60 text-gray-400 hover:text-white rounded-xl border border-quantum-border transition-all text-xs font-bold uppercase tracking-wider"
                >
                  <RefreshCcw size={14} /> Reset
                </button>
              </div>
            </div>

            {/* Sidebar Controls (Image Style) */}
            <aside className="xl:w-80 flex flex-col gap-6">
              <section className="glass-panel p-6 space-y-8 bg-[#0a0a0f]/80 border-[#2a2a35]">
                {/* Slit Separation d */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-widest text-gray-400">
                    <span>Slit separation</span>
                    <span className="text-white text-sm">{(slitSeparation / 20).toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" min="40" max="180" value={slitSeparation} 
                    onChange={e => setSlitSeparation(Number(e.target.value))} 
                    className="slider-quantum" 
                  />
                </div>

                {/* Wavelength lambda */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-widest text-gray-400">
                    <span>Wavelength</span>
                    <span className="text-white text-sm">{(wavelength / 20).toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="20" max="120" value={wavelength} 
                    onChange={e => setWavelength(Number(e.target.value))} 
                    className="slider-quantum" 
                  />
                </div>

                {/* Slit width a */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-widest text-gray-400">
                    <span>Slit width</span>
                    <span className="text-white text-sm">{(slitWidth / 15).toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" min="8" max="50" value={slitWidth} 
                    onChange={e => setSlitWidth(Number(e.target.value))} 
                    className="slider-quantum" 
                  />
                </div>

                {/* Intensity Pattern Preview (Image Inspired) */}
                <div className="pt-4 space-y-3">
                  <div className="relative h-64 w-full bg-black rounded-xl overflow-hidden border border-[#2a2a35] shadow-2xl">
                    <div className="absolute inset-0 flex flex-col">
                      {Array.from({ length: 250 }).map((_, i) => {
                        const y = (i / 250) * 500 - 250;
                        const thetaVal = Math.atan2(y, L);
                        const st = Math.sin(thetaVal);
                        
                        // Physics-based scaling for visual impact
                        const scaleD = slitSeparation * 1.5;
                        const scaleA = slitWidth * 0.8;
                        const scaleL = wavelength * 0.4;
                        
                        const delta = (Math.PI * scaleD * st) / scaleL;
                        const beta = (Math.PI * scaleA * st) / scaleL;
                        const diffTerm = Math.abs(beta) < 1e-9 ? 1 : Math.pow(Math.sin(beta) / beta, 2);
                        
                        let intensity = 0;
                        if (observerOn) {
                          const b1 = (Math.PI * scaleA * Math.sin(Math.atan2(y - (scaleD/2), L))) / scaleL;
                          const b2 = (Math.PI * scaleA * Math.sin(Math.atan2(y + (scaleD/2), L))) / scaleL;
                          intensity = ((Math.abs(b1) < 1e-9 ? 1 : Math.pow(Math.sin(b1)/b1, 2)) + 
                                       (Math.abs(b2) < 1e-9 ? 1 : Math.pow(Math.sin(b2)/b2, 2))) * 0.5;
                        } else {
                          intensity = Math.pow(Math.cos(delta), 2) * diffTerm;
                        }
                        
                        // Non-linear response for "visual clarity" like film exposure
                        const visualIntensity = Math.pow(intensity, 0.8);
                        
                        return (
                          <div 
                            key={i} 
                            className="w-full flex-grow" 
                            style={{ 
                              background: observerOn 
                                ? `rgba(251, 191, 36, ${visualIntensity * 0.9})` 
                                : `linear-gradient(90deg, transparent 0%, rgba(0, 242, 255, ${visualIntensity}) 50%, transparent 100%)`,
                              boxShadow: !observerOn && visualIntensity > 0.6 ? `0 0 10px rgba(0, 242, 255, ${visualIntensity * 0.2})` : 'none'
                            }} 
                          />
                        );
                      })}
                    </div>
                    {/* Scan-line effect for technical look */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
                  </div>
                  <div className="text-center text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] animate-pulse">Live interference monitoring</div>
                </div>

                <div className="pt-2">
                   <button 
                    onClick={() => setObserverOn(!observerOn)}
                    className={`w-full py-3 rounded-xl flex items-center justify-center gap-3 border transition-all ${observerOn ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400' : 'bg-black/40 border-quantum-border text-gray-600 hover:text-gray-400'}`}
                  >
                    {observerOn ? <Eye size={16} /> : <EyeOff size={16} />}
                    <span className="text-[10px] font-bold uppercase tracking-widest">{observerOn ? 'Observer Active' : 'Passive Observer'}</span>
                  </button>
                </div>
              </section>
            </aside>
          </motion.div>
        )}

        {activeTab === 'theory' && (
          <motion.div 
            key="theory"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              {
                title: "Wave-Particle Duality",
                desc: "The dual nature of light and matter. Quantum objects exhibit both wave-like characteristics (interference) and particle-like characteristics (impacts).",
                formula: "λ = h / p",
                label: "de Broglie Wavelength"
              },
              {
                title: "Double-Slit Interference",
                desc: "The diffraction pattern arises from the phase difference between paths. Constructive interference leads to bright fringes, destructive to dark.",
                formula: "I(θ) = I₀ [sin(β)/β]² cos²(δ)",
                label: "Intensity Profile"
              },
              {
                title: "The Measurement Problem",
                desc: "Observing which path a particle takes collapses its wavefunction. Knowing 'which-path' info destroys the possibility of interference.",
                formula: "Δx Δp ≥ ħ / 2",
                label: "Uncertainty Relation"
              },
              {
                title: "Quantum Superposition",
                desc: "A particle is in a state of 'both-paths-at-once' before measurement. Its state is a vector sum of individual probability amplitudes.",
                formula: "ψ = (ψ₁ + ψ₂) / √2",
                label: "State Vector"
              }
            ].map((card, i) => (
              <div key={i} className="glass-panel p-8 space-y-6 group hover:border-quantum-cyan/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-white/5 rounded-xl border border-quantum-border group-hover:border-quantum-cyan/30">
                    <Zap className="text-quantum-cyan" size={24} />
                  </div>
                  <div className="px-3 py-1 bg-black/40 rounded-full border border-quantum-border text-[9px] font-mono text-gray-500 uppercase tracking-widest">Module 0{i+1}</div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">{card.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{card.desc}</p>
                </div>
                <div className="pt-6 border-t border-quantum-border">
                  <div className="text-[10px] text-gray-500 font-mono uppercase mb-2">{card.label}</div>
                  <div className="text-2xl font-serif italic text-quantum-cyan bg-black/40 p-4 rounded-xl border border-quantum-border/50 text-center">
                    {card.formula}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'results' && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="glass-panel p-6 border-b-2 border-quantum-border hover:border-quantum-cyan transition-all">
                   <div className="text-[10px] font-mono text-gray-500 uppercase mb-2 tracking-widest">{stat.label}</div>
                   <div className="flex items-baseline gap-2">
                      <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                      <span className="text-[10px] font-mono text-gray-600">{stat.unit}</span>
                   </div>
                </div>
              ))}
            </div>

            {/* Comparison Chart */}
            <div className="glass-panel p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Coherence Comparison</h3>
                    <p className="text-sm text-gray-500 font-mono">Quantum Interference vs Classical Summation</p>
                 </div>
                 <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded bg-quantum-cyan" />
                       <span className="text-xs font-bold text-gray-400">PURE (Interference)</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded bg-yellow-400" />
                       <span className="text-xs font-bold text-gray-400">MIXED (Decohered)</span>
                    </div>
                 </div>
              </div>
              <div className="h-80 w-full pt-10">
                <ResponsiveContainer>
                  <LineChart data={theoreticalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a24" />
                    <XAxis dataKey="y" hide />
                    <YAxis stroke="#444" fontSize={10} fontFamily="JetBrains Mono" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #2a2a35' }}
                      itemStyle={{ color: '#fff', fontSize: '10px' }}
                    />
                    <Line type="monotone" dataKey="unobserved" stroke="#00f2ff" strokeWidth={3} dot={false} name="Unobserved" animationDuration={1000} />
                    <Line type="monotone" dataKey="observed" stroke="#facc15" strokeWidth={3} strokeDasharray="5 5" dot={false} name="Observed" animationDuration={1000} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Parameter Table */}
            <div className="glass-panel overflow-hidden border border-quantum-border">
               <div className="px-8 py-6 border-b border-quantum-border">
                  <h3 className="text-lg font-bold text-white">System Config Log</h3>
                  <p className="text-xs text-gray-500 uppercase font-mono mt-1">Snapshot of physical constants</p>
               </div>
               <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-[10px] uppercase font-mono text-gray-500">
                     <tr>
                        <th className="px-8 py-4">Parameter</th>
                        <th className="px-8 py-4">Current Value</th>
                        <th className="px-8 py-4">Domain/Units</th>
                        <th className="px-8 py-4">Impact Layer</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-quantum-border">
                     {[
                       { p: 'Wavelength (λ)', v: `${wavelength}nm`, u: 'E = hf', i: 'Fringe Spacing' },
                       { p: 'Slit Separation (d)', v: `${slitSeparation}µm`, u: 'Spatial Frequency', i: 'Interference Finesse' },
                       { p: 'Slit Width (a)', v: `${slitWidth}µm`, u: 'Diffraction Limit', i: 'Pattern Envelope' },
                       { p: 'Distance (L)', v: `${L}px`, u: 'Projection Geometry', i: 'Scaling Factor' },
                       { p: 'Observation State', v: observerOn ? 'Active' : 'Passive', u: 'Boolean', i: 'Wave-function Stability' },
                     ].map((row, i) => (
                       <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-8 py-4 font-bold text-white">{row.p}</td>
                          <td className="px-8 py-4 font-mono text-quantum-cyan">{row.v}</td>
                          <td className="px-8 py-4 text-gray-500 italic">{row.u}</td>
                          <td className="px-8 py-4 text-[10px] text-gray-400 font-mono uppercase">{row.i}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
