import React, { useCallback } from 'react';
import { WaveVisualizer } from '../components/WaveVisualizer';
import { ControlPanel } from '../components/ControlPanel';
import { DataPanel } from '../components/DataPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useQuantum } from '../hooks/useQuantum';

export const SimulatorPage: React.FC = () => {
  const { 
    alpha, beta, phi, history, isMeasuring, lastResult,
    setAlpha, setBeta, setPhi, addMeasurement, addBatch, reset, setIsMeasuring, setLastResult 
  } = useQuantum();

  const measure = useCallback(() => {
    setIsMeasuring(true);
    setLastResult(null);

    // Dramatic delay for "collapse"
    setTimeout(() => {
      const p0 = Math.pow(alpha, 2);
      const result = Math.random() < p0 ? 0 : 1;
      
      setLastResult(result);
      addMeasurement(result);
      setIsMeasuring(false);

      // Reset result after a short display
      setTimeout(() => {
        setLastResult(null);
      }, 2000);
    }, 800);
  }, [alpha, setIsMeasuring, setLastResult, addMeasurement]);

  const runBatch = useCallback(() => {
    setIsMeasuring(true);
    
    let count = 0;
    const batchSize = 1000;
    const p0 = Math.pow(alpha, 2);
    
    const interval = setInterval(() => {
      const batchResults: number[] = [];
      const step = 50;
      for (let i = 0; i < step; i++) {
        batchResults.push(Math.random() < p0 ? 0 : 1);
      }
      
      addBatch(batchResults);
      count += step;
      
      if (count >= batchSize) {
        clearInterval(interval);
        setIsMeasuring(false);
      }
    }, 50);
  }, [alpha, setIsMeasuring, addBatch]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[calc(100vh-160px)]">
      {/* Left Panel: Controls */}
      <div className="lg:col-span-3 h-full">
        <ControlPanel
          alpha={alpha}
          beta={beta}
          phi={phi}
          setAlpha={setAlpha}
          setBeta={setBeta}
          setPhi={setPhi}
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
          <div className="text-[10px] font-mono text-gray-400 flex items-center gap-2">
            <Activity size={12} className="animate-pulse text-green-500" />
            LIVE FEED
          </div>
        </div>
      </div>

      {/* Right Panel: Data */}
      <div className="lg:col-span-3 h-full">
        <DataPanel
          alpha={alpha}
          beta={beta}
          history={history}
        />
      </div>
    </div>
  );
};
