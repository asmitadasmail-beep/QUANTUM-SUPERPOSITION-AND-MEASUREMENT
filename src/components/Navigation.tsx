import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  BookOpen, 
  FlaskConical, 
  HelpCircle, 
  BarChart3, 
  Briefcase, 
  Sun, 
  Moon,
  ChevronLeft,
  ChevronRight,
  Orbit,
  SplitSquareHorizontal
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  const links = [
    { to: '/', icon: LayoutGrid, label: 'Overview' },
    { to: '/theory', icon: BookOpen, label: 'Fundamentals' },
    { to: '/bloch-sphere', icon: Orbit, label: 'Bloch Sphere' },
    { to: '/simulator', icon: FlaskConical, label: 'Quantum Simulation' },
    { to: '/double-slit', icon: SplitSquareHorizontal, label: 'Double Slit' },
    { to: '/how-it-works', icon: HelpCircle, label: 'Model Architecture' },
    { to: '/graphs', icon: BarChart3, label: 'Visual Representation' },
    { to: '/applications', icon: Briefcase, label: 'Applications' },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-72'} border-r border-quantum-border bg-quantum-panel/50 backdrop-blur-md h-screen sticky top-0 flex flex-col pt-8 pb-4 transition-all duration-300 shrink-0 overflow-y-auto no-scrollbar`}>
      <div className="px-6 mb-12 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-quantum-cyan/10 rounded-lg border border-quantum-cyan/30">
              <FlaskConical className="text-quantum-cyan" size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight uppercase leading-none text-white">Quantum Lab</h1>
              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.2em] mt-1">Experimental Suite</p>
            </div>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-grow flex flex-col gap-1 px-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            title={isCollapsed ? link.label : ''}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium border border-transparent ${
                isActive
                  ? 'bg-quantum-cyan/10 text-quantum-cyan border-quantum-cyan/30 shadow-[0_4px_20px_-5px_rgba(0,242,255,0.4)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              } ${isCollapsed ? 'justify-center' : ''}`
            }
          >
            <link.icon size={18} className="shrink-0" />
            {!isCollapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 mt-8">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl bg-black/40 border border-quantum-border text-gray-400 hover:text-white transition-all group ${isCollapsed ? 'justify-center p-0 h-12' : ''}`}
        >
          <div className="flex items-center gap-3 text-sm font-medium">
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
            {!isCollapsed && <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>}
          </div>
          {!isCollapsed && (
            <div className={`w-8 h-4 rounded-full bg-quantum-border relative transition-colors ${!isDark ? 'bg-quantum-cyan/20' : ''}`}>
               <div className={`absolute top-1 w-2 h-2 rounded-full transition-all ${!isDark ? 'left-5 bg-quantum-cyan' : 'left-1 bg-gray-600'}`} />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
