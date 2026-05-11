import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Zap, Search, Globe, Microscope } from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const apps = [
    {
      title: 'Quantum Computing',
      description: 'Using superposition to perform complex calculations in massive parallel streams, solving problems impossible for classical computers.',
      icon: Cpu,
      color: 'text-quantum-cyan'
    },
    {
      title: 'Quantum Cryptography',
      description: 'Quantum Key Distribution (QKD) uses measurement collapse to ensure that any eavesdropping immediately alerts the communicating parties.',
      icon: ShieldCheck,
      color: 'text-quantum-magenta'
    },
    {
      title: 'Quantum Sensing',
      description: 'Hyper-sensitive measurements of gravity, magnetism, and time using states that are extremely fragile but incredibly precise.',
      icon: Microscope,
      color: 'text-yellow-400'
    },
    {
      title: 'Drug Discovery',
      description: 'Simulating complex molecular interactions at the quantum level to design new medicines and materials.',
      icon: Zap,
      color: 'text-green-400'
    },
    {
      title: 'Quantum Internet',
      description: 'Building secure, global networks through entanglement and superposition for instant, tamper-proof communication.',
      icon: Globe,
      color: 'text-blue-400'
    },
    {
      title: 'Financial Modeling',
      description: 'Optimizing portfolios and risk management through quantum-accelerated Monte Carlo simulations.',
      icon: Search,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="space-y-12 pb-24">
       <header className="space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">Real-World Applications</h2>
        <p className="text-gray-400 leading-relaxed">
          How the principles of superposition and measurement are leaving the lab to revolutionize technology.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app, idx) => (
          <motion.div
            key={app.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-8 space-y-6 flex flex-col group hover:border-white/20 transition-all border border-transparent"
          >
            <div className={`p-4 bg-white/5 rounded-2xl w-fit ${app.color}`}>
               <app.icon size={24} />
            </div>
            <div className="space-y-2 flex-grow">
               <h3 className="text-xl font-bold text-white group-hover:text-quantum-cyan transition-colors">{app.title}</h3>
               <p className="text-sm text-gray-400 leading-relaxed italic group-hover:text-gray-300 transition-colors">
                  {app.description}
               </p>
            </div>
            <div className="pt-4 border-t border-quantum-border">
               <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Industry Standard: Emerging</span>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="p-8 lg:p-12 glass-panel relative overflow-hidden bg-gradient-to-r from-quantum-panel to-black">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Globe size={200} />
         </div>
         <div className="max-w-xl space-y-4">
            <h3 className="text-2xl font-bold text-white">The Future is Quantum</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
               As we move from theoretical research into the "Noisy Intermediate-Scale Quantum" (NISQ) era, the ability to control and maintain superposition (coherence) is the single biggest engineering challenge of our time.
            </p>
            <div className="pt-4">
               <div className="inline-block bg-quantum-cyan text-black px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wide">
                  Stay Informed
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
