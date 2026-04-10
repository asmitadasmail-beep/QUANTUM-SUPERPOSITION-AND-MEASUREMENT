/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { WaveVisualizer } from './components/WaveVisualizer';
import { ControlPanel } from './components/ControlPanel';
import { DataPanel } from './components/DataPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, FlaskConical, Activity } from 'lucide-react';

export default function App() {
  const [alpha, setAlpha] = useState(0.707); // Initial state: 1/sqrt(2) approx
  const [history, setHistory] = useState<number[]>([]);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const beta = Math.sqrt(1 - Math.pow(alpha, 2));

  const measure = useCallback(() => {
    setIsMeasuring(true);
    setLastResult(null);

    // Dramatic delay for "collapse"
    setTimeout(() => {
      const p0 = Math.pow(alpha, 2);
      const result = Math.random() < p0 ? 0 : 1;
      
      setLastResult(result);
      setHistory(prev => [...prev, result]);
      setIsMeasuring(false);

      // Reset result after a short display
      setTimeout(() => {
        setLastResult(null);
      }, 2000);
    }, 800);
  }, [alpha]);

  const runBatch = useCallback(() => {
    setIsMeasuring(true);
    
    // Simulate batch run with a visual "loading" feel
    let count = 0;
    const batchSize = 1000;
    const p0 = Math.pow(alpha, 2);
    
    const interval = setInterval(() => {
      const batchResults: number[] = [];
      const step = 50;
      for (let i = 0; i < step; i++) {
        batchResults.push(Math.random() < p0 ? 0 : 1);
      }
      
      setHistory(prev => [...prev, ...batchResults]);
      count += step;
      
      if (count >= batchSize) {
        clearInterval(interval);
        setIsMeasuring(false);
      }
    }, 50);
  }, [alpha]);

  const reset = useCallback(() => {
    setHistory([]);
    setLastResult(null);
    setAlpha(0.707);
  }, []);

  return (
    <div className="min-h-screen bg-quantum-bg text-gray-100 selection:bg-quantum-cyan/30">
      {/* Header */}
      <header className="border-b border-quantum-border bg-quantum-panel/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-quantum-cyan/10 rounded-lg border border-quantum-cyan/30">
              <FlaskConical className="text-quantum-cyan" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">QUANTUM WAVE LAB</h1>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Live Adaptive Simulation v1.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-gray-400">
              <div className="flex items-center gap-2">
                <Activity size={12} className="text-green-500" />
                <span>ENGINE: STABLE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-quantum-cyan animate-pulse" />
                <span>REAL-TIME SYNC</span>
              </div>
            </div>
            <button 
              onClick={() => setShowIntro(!showIntro)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <Info size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[calc(100vh-88px)]">
        {/* Left Panel: Controls */}
        <div className="lg:col-span-3 h-full">
          <ControlPanel
            alpha={alpha}
            setAlpha={setAlpha}
            onMeasure={measure}
            onBatchRun={runBatch}
            onReset={reset}
            isMeasuring={isMeasuring}
          />
        </div>

        {/* Center Panel: Wave Visualizer */}
        <div className="lg:col-span-6 h-full flex flex-col gap-6">
          <div className="flex-1 min-h-[400px]">
            <WaveVisualizer
              alpha={alpha}
              beta={beta}
              isMeasuring={isMeasuring}
              lastResult={lastResult}
              dataCount={history.length}
            />
          </div>
          
          {/* Status Ticker */}
          <div className="glass-panel p-4 flex items-center justify-between overflow-hidden">
            <div className="flex items-center gap-4 whitespace-nowrap">
              <span className="text-[10px] font-mono text-gray-500 uppercase">System Logs:</span>
              <div className="flex gap-4 overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={history.length}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-[10px] font-mono text-quantum-cyan"
                  >
                    {history.length > 0 
                      ? `[${new Date().toLocaleTimeString()}] MEASUREMENT COMPLETED: RESULT |${history[history.length - 1]}⟩`
                      : "[SYSTEM] READY FOR EXPERIMENTATION"}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <div className="text-[10px] font-mono text-gray-500">
              FPS: 60.0
            </div>
          </div>
        </div>

        {/* Right Panel: Data */}
        <div className="lg:col-span-3 h-full">
          <DataPanel
            alpha={alpha}
            history={history}
          />
        </div>
      </main>

      {/* Intro Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full glass-panel p-8 space-y-6 relative"
            >
              <button 
                onClick={() => setShowIntro(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                ✕
              </button>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-quantum-cyan">Welcome to the Lab</h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Explore the nature of quantum superposition. Adjust the state amplitudes, observe the wave behavior, and perform measurements to see the wavefunction collapse in real-time.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded bg-quantum-cyan/20 flex items-center justify-center shrink-0">
                    <span className="text-quantum-cyan font-bold text-xs">1</span>
                  </div>
                  <p className="text-xs text-gray-300">Use the slider to change the probability of measuring |0⟩ vs |1⟩.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded bg-quantum-cyan/20 flex items-center justify-center shrink-0">
                    <span className="text-quantum-cyan font-bold text-xs">2</span>
                  </div>
                  <p className="text-xs text-gray-300">Click 'MEASURE' to observe a single outcome and watch the wave collapse.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded bg-quantum-cyan/20 flex items-center justify-center shrink-0">
                    <span className="text-quantum-cyan font-bold text-xs">3</span>
                  </div>
                  <p className="text-xs text-gray-300">Run batch experiments to see how observed data converges to theoretical probability.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIntro(false)}
                className="w-full py-3 bg-quantum-cyan text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors"
              >
                START EXPERIMENT
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
