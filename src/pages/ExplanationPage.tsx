import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Wind, Code2, Layers } from 'lucide-react';

export const ExplanationPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
       <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-quantum-cyan/10 border border-quantum-cyan/20 rounded-full text-quantum-cyan text-xs font-mono uppercase tracking-widest">
           System Architecture
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">How the Wave Model Works</h2>
        <p className="text-gray-400">
          Deconstructing the real-time physics engine that drives our interactive environment.
        </p>
      </header>

      <div className="grid gap-8">
        <section className="glass-panel p-8 space-y-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-quantum-cyan/10 rounded-xl text-quantum-cyan">
                 <Wind size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">1. Gaussian Wave Packets</h3>
           </div>
           <p className="text-sm text-gray-400 leading-relaxed">
              To represent the states $| 0 \rangle$ and $| 1 \rangle$ visually, we use **Gaussian Envelopes**. 
              In physics, these envelopes localize the particle in space. 
              The simulator calculates two distinct packets:
           </p>
           <div className="bg-black/60 p-6 rounded-lg font-mono text-xs text-quantum-cyan border border-quantum-border">
              amplitude = env0 * osc0 + env1 * osc1
           </div>
           <p className="text-xs text-gray-500">
              Where **env0** is centered at 30% of the screen width, and **env1** at 70%.
           </p>
        </section>

        <section className="glass-panel p-8 space-y-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-quantum-magenta/10 rounded-xl text-quantum-magenta">
                 <Layers size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">2. Interference & Superposition</h3>
           </div>
           <p className="text-sm text-gray-400 leading-relaxed">
              The wave you see is a result of **Linear Superposition**. 
              The user-defined values of $\alpha$ and $\beta$ scale the height of these packets. 
              When both are non-zero, the waves overlap, creating internal phase interference.
           </p>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 rounded border border-quantum-border space-y-2">
                 <div className="text-[10px] uppercase text-gray-500 tracking-widest">Alpha influence</div>
                 <div className="text-sm text-quantum-cyan">Scales the left packet (|0⟩)</div>
              </div>
              <div className="p-4 bg-black/40 rounded border border-quantum-border space-y-2">
                 <div className="text-[10px] uppercase text-gray-500 tracking-widest">Beta influence</div>
                 <div className="text-sm text-quantum-magenta">Scales the right packet (|1⟩)</div>
              </div>
           </div>
        </section>

        <section className="glass-panel p-8 space-y-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-500/10 rounded-xl text-gray-400">
                 <Code2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">3. Collapse Logic</h3>
           </div>
           <p className="text-sm text-gray-400 leading-relaxed">
              When 'Measure' is clicked, the engine performs a **Weighted Random Sample**. 
              Once an outcome is decided, a 'transition' flag is set. 
              The animation loop then lerps (linearly interpolates) the amplitudes to zero for the losing state and 1 for the winning state, 
              simulating the sudden collapse of the wavefunction.
           </p>
        </section>

        <section className="glass-panel p-8 space-y-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
                 <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">4. Rendering Engine</h3>
           </div>
           <p className="text-sm text-gray-400 leading-relaxed">
              The simulation uses a high-performance **HTML5 Canvas** context. 
              Every wave point is calculated at runtime (approx. 1000 points per frame) at 60 frames per second. 
              Glow effects are achieved using the `shadowBlur` property in the 2D context, 
              providing that signature "quantum reactor" feel.
           </p>
        </section>
      </div>
    </div>
  );
};
