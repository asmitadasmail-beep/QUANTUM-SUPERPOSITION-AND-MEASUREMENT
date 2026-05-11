import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, BookOpen, Calculator, Terminal, Globe } from 'lucide-react';

export const TheoryPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-quantum-magenta/10 border border-quantum-magenta/20 rounded-full text-quantum-magenta text-xs font-mono uppercase tracking-widest">
           Advanced Engineering Module
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">Mathematical Foundations of Qubits</h2>
        <p className="text-gray-400">
          A rigorous overview of state representation, probability amplitudes, and the normalization constraints governing quantum systems.
        </p>
      </header>

      <section className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
            <Calculator className="text-quantum-cyan" size={24} /> 1. State Superposition
          </h3>
          <div className="glass-panel p-8 space-y-6">
            <p className="text-gray-300 leading-relaxed text-sm">
              In classical computing, a bit is either 0 or 1. In quantum computing, the fundamental unit of information is the **Qubit**. 
              A qubit state is a mathematical vector in a 2-dimensional complex Hilbert space.
            </p>
            <div className="bg-black/60 p-8 rounded-xl border border-quantum-border flex justify-center items-center font-serif italic text-2xl tracking-widest text-quantum-cyan">
              |ψ⟩ = α|0⟩ + β|1⟩
            </div>
            <p className="text-gray-400 text-sm">
              Where **|$\psi$⟩** is the state vector, and **$\alpha$, $\beta$** are complex coefficients known as **Probability Amplitudes**.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
            <ShieldAlert className="text-quantum-magenta" size={24} /> 2. Normalization Constraint
          </h3>
          <div className="glass-panel p-8 space-y-6">
            <p className="text-gray-300 leading-relaxed text-sm">
              Since the total probability of finding a system in some state must be exactly 100%, we enforce the **Normalization Condition**. 
              This is a hard geometric constraint: the state vector must be a unit vector on a sphere (Bloch Sphere).
            </p>
            <div className="bg-black/60 p-8 rounded-xl border border-quantum-border flex justify-center items-center font-serif italic text-2xl tracking-widest text-quantum-magenta">
              |α|² + |β|² = 1
            </div>
            <p className="text-gray-400 text-sm">
              If this condition is not met, the wavefunction does not represent a physical system. 
              Our simulator enforces this by projecting any user input onto the unit circle.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
            <Terminal className="text-gray-400" size={24} /> 3. Probability Amplitudes
          </h3>
          <div className="glass-panel p-8 space-y-6">
            <p className="text-gray-300 leading-relaxed text-sm">
              In quantum mechanics, a probability amplitude is a complex number used in describing the behavior of systems. 
              The square of the modulus of this amplitude represents a probability density.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-6 rounded-lg text-center space-y-2 border border-quantum-border">
                <div className="text-xs font-mono text-gray-500 uppercase">State |0⟩ Amplitude</div>
                <div className="text-xl font-bold text-quantum-cyan">|α|²</div>
              </div>
              <div className="bg-black/40 p-6 rounded-lg text-center space-y-2 border border-quantum-border">
                <div className="text-xs font-mono text-gray-500 uppercase">State |1⟩ Amplitude</div>
                <div className="text-xl font-bold text-quantum-magenta">|β|²</div>
              </div>
            </div>
            <p className="text-gray-400 text-xs italic">
              When we measure, we transition from these continuous amplitudes to a discrete realization, 
              defined by the Born Rule probability.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
            <Globe className="text-blue-400" size={24} /> 4. The Bloch Sphere
          </h3>
          <div className="glass-panel p-8 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed text-sm">
                The Bloch Sphere is a geometric representation of the pure state space of a two-level quantum mechanical system. 
                Any point on the surface of this unit sphere represents a specific state $|\psi\rangle$.
              </p>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-quantum-cyan mt-1" />
                   <span>North Pole: Computational basis state |0⟩</span>
                </li>
                <li className="flex gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-quantum-magenta mt-1" />
                   <span>South Pole: Computational basis state |1⟩</span>
                </li>
                <li className="flex gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1" />
                   <span>Equator: Superpositions with equal probability</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-square glass-panel flex items-center justify-center p-4 bg-black/40 overflow-hidden">
               <svg viewBox="0 0 100 100" className="w-full h-full opacity-80">
                  {/* Sphere Outline */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-700" />
                  <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-700" strokeDasharray="2 2" />
                  
                  {/* Axis */}
                  <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" className="text-gray-600" />
                  <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-gray-600" />
                  
                  {/* Poles */}
                  <circle cx="50" cy="10" r="2" className="fill-quantum-cyan" />
                  <text x="54" y="12" className="text-[6px] fill-quantum-cyan font-mono">|0⟩</text>
                  <circle cx="50" cy="90" r="2" className="fill-quantum-magenta" />
                  <text x="54" y="92" className="text-[6px] fill-quantum-magenta font-mono">|1⟩</text>

                  {/* State Vector */}
                  <motion.line 
                    initial={{ x2: 50, y2: 50 }}
                    animate={{ x2: 75, y2: 25 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    x1="50" y1="50" stroke="currentColor" strokeWidth="1" className="text-white" 
                  />
                  <motion.circle 
                    initial={{ cx: 50, cy: 50 }}
                    animate={{ cx: 75, cy: 25 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    r="2" className="fill-white" 
                  />
                  <text x="78" y="28" className="text-[6px] fill-white font-mono">|ψ⟩</text>
               </svg>
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-quantum-cyan)_0%,_transparent_100%)] opacity-5 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <section className="p-8 bg-quantum-cyan/5 border border-quantum-cyan/20 rounded-2xl space-y-4">
        <h4 className="text-lg font-bold text-quantum-cyan flex items-center gap-2">
           Engineering Tip: The Bloch Sphere
        </h4>
        <p className="text-sm text-gray-400 leading-relaxed">
           While we often use $\alpha$ and $\beta$ as real numbers in simple simulations, they are generally complex. 
           Any single qubit state can be represented as a point on the surface of a unit sphere in 3D space. 
           Rotations on this sphere correspond to logical operations (Gates) in quantum algorithms.
        </p>
      </section>
    </div>
  );
};
