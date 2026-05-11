import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Eye, Globe, Atom, FlaskConical, BarChart3, Briefcase, Orbit } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 space-y-6">
        <div className="space-y-2">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold tracking-tight text-white"
          >
            Quantum Superposition and Measurement
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-mono text-quantum-cyan uppercase tracking-[0.3em]"
          >
            A Simulation-Based Case Study
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto space-y-4"
        >
          <p className="text-gray-400 text-lg leading-relaxed">
            This project serves as an **experiential learning platform for Applied Physics**, bridging the gap between theoretical complex vector spaces and observable physical phenomena. Through high-fidelity wave simulation, students can analyze the probabilistic nature of the quantum world in a hands-on laboratory environment.
          </p>
          <div className="flex justify-center gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
            <span className="px-3 py-1 border border-quantum-border rounded">Vector Mechanics</span>
            <span className="px-3 py-1 border border-quantum-border rounded">Wave-Particle Duality</span>
            <span className="px-3 py-1 border border-quantum-border rounded">Born's Rule</span>
          </div>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Overview', description: 'Concepts of Superposition & Measurement', icon: Globe, to: '/', count: '01' },
          { title: 'Fundamentals', description: 'Advanced derivations for engineering students', icon: Atom, to: '/theory', count: '02' },
          { title: 'Bloch Sphere', description: 'Interactive 3D qubit state visualizer', icon: Orbit, to: '/bloch-sphere', count: '03' },
          { title: 'Quantum Simulation', description: 'Interactive qubit wave-function laboratory', icon: FlaskConical, to: '/simulator', count: '04' },
          { title: 'Model Architecture', description: 'The math & logic behind the simulation', icon: Zap, to: '/how-it-works', count: '05' },
          { title: 'Visual Representation', description: 'Visual data distribution & relationship plots', icon: BarChart3, to: '/graphs', count: '06' },
          { title: 'Applications', description: 'Quantum technology in the real world', icon: Briefcase, to: '/applications', count: '07' },
        ].map((item, idx) => (
          <Link key={item.to} to={item.to}>
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel p-8 group cursor-pointer hover:border-quantum-cyan/50 transition-colors relative h-full flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-quantum-cyan/10 rounded-xl text-quantum-cyan group-hover:bg-quantum-cyan/20 transition-colors">
                    <item.icon size={24} />
                  </div>
                  <span className="text-gray-600 font-mono text-sm">{item.count}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-quantum-cyan transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{item.description}</p>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <section className="glass-panel p-12 space-y-12 bg-gradient-to-br from-quantum-panel to-black">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white tracking-tight">What is Quantum Superposition?</h3>
            <p className="text-gray-400 leading-relaxed">
              Imagine a coin spinning on a table. Before it lands, it is neither just "Heads" nor just "Tails"—it is in a constant blur of both. 
              In quantum mechanics, particles can exist in multiple states simultaneously. This is **Superposition**.
            </p>
            <div className="p-6 bg-black/40 border-l-4 border-quantum-cyan rounded-r-xl">
              <p className="italic text-gray-300">
                "If you think you understand quantum mechanics, you don't understand quantum mechanics."
              </p>
              <p className="text-xs text-quantum-cyan font-mono mt-2">— Richard Feynman</p>
            </div>
          </div>
          <div className="relative aspect-square glass-panel flex items-center justify-center overflow-hidden bg-black">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--color-quantum-cyan)_0%,_transparent_70%)] blur-2xl" />
             <div className="text-center space-y-4 z-10">
                <div className="text-6xl animate-pulse">⚛️</div>
                <div className="font-mono text-quantum-cyan text-sm tracking-widest uppercase">Wave-Particle Duality</div>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative aspect-square glass-panel flex items-center justify-center overflow-hidden bg-black">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--color-quantum-magenta)_0%,_transparent_70%)] blur-2xl" />
             <div className="text-center space-y-4 z-10">
                <div className="text-6xl">👁️</div>
                <div className="font-mono text-quantum-magenta text-sm tracking-widest uppercase">The Observer Effect</div>
             </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h3 className="text-3xl font-bold text-white tracking-tight">The Mystery of Measurement</h3>
            <p className="text-gray-400 leading-relaxed">
              The moment we "look" at a quantum system (take a measurement), it is forced to choose. 
              The superposition "collapses" into a single definite state. This isn't just about human sight—it's any interaction with the environment.
            </p>
            <ul className="space-y-3">
              {[
                'Probabilistic outcomes based on state amplitudes.',
                'Instantaneous collapse to a defined state.',
                'Inherent uncertainty described by the Wavefunction.',
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-300">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-quantum-magenta shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
