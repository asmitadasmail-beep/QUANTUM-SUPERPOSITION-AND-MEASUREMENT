/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { TheoryPage } from './pages/TheoryPage';
import { BlochSpherePage } from './pages/BlochSpherePage';
import { SimulatorPage } from './pages/SimulatorPage';
import { ExplanationPage } from './pages/ExplanationPage';
import { GraphsPage } from './pages/GraphsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { DoubleSlitPage } from './pages/DoubleSlitPage';
import { QuantumProvider } from './hooks/useQuantum';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <QuantumProvider>
      <Router>
        <div className="min-h-screen bg-quantum-bg text-gray-100 flex font-sans antialiased selection:bg-quantum-cyan/30">
          <Navigation />
          
          <main className="flex-grow flex flex-col min-h-screen">
            <div className="flex-grow px-10 py-12">
              <PageTransition>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/theory" element={<TheoryPage />} />
                  <Route path="/bloch-sphere" element={<BlochSpherePage />} />
                  <Route path="/simulator" element={<SimulatorPage />} />
                  <Route path="/how-it-works" element={<ExplanationPage />} />
                  <Route path="/graphs" element={<GraphsPage />} />
                  <Route path="/applications" element={<ApplicationsPage />} />
                  <Route path="/double-slit" element={<DoubleSlitPage />} />
                </Routes>
              </PageTransition>
            </div>
            <footer className="border-t border-quantum-border py-8 px-10 bg-quantum-panel/30 mt-auto">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                     <div className="w-6 h-6 bg-quantum-cyan rounded flex items-center justify-center text-black font-bold text-[10px]">Q</div>
                     <h4 className="text-white font-bold uppercase tracking-widest text-[10px]">Quantum Wave Lab</h4>
                  </div>
                  <p className="text-gray-500 text-[10px] leading-relaxed">
                    Experiential learning of applied physics through simulation.
                  </p>
                </div>
                <div className="flex gap-8">
                  <div className="space-y-1">
                     <h4 className="text-[9px] uppercase font-mono text-gray-400 tracking-[0.3em]">Course</h4>
                     <p className="text-[10px] text-gray-600">B.Tech CSE (AI & ML)</p>
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-[9px] uppercase font-mono text-gray-400 tracking-[0.3em]">Status</h4>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        <span className="text-[10px] text-gray-500">Systems Operational</span>
                     </div>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </Router>
    </QuantumProvider>
  );
}
