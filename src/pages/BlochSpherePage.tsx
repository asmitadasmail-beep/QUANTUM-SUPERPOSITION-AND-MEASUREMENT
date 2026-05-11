import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Text, Float, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuantum } from '../hooks/useQuantum';
import { 
  RotateCw, 
  Settings2, 
  Play, 
  Pause, 
  RefreshCcw, 
  Dices, 
  Target, 
  Info,
  Maximize2,
  ChevronRight,
  TrendingUp,
  History,
  Orbit,
  Network,
  Box
} from 'lucide-react';

// --- Types ---
interface QubitState {
  theta: number; // polar angle [0, PI]
  phi: number;   // azimuthal angle [0, 2PI]
}

// --- Components ---

const BlochSphereDiagram = ({ theta, phi }: { theta: number, phi: number }) => {
  const proj = (x: number, y: number, z: number) => {
    // sx: 260 + 160*(x - y*0.45), sy: 260 - 160*(z - y*0.28)
    return {
      sx: 260 + 165 * (x - y * 0.45),
      sy: 260 - 165 * (z - y * 0.28)
    };
  };

  const getPointsOnSphere = (t: number, p: number) => {
    return {
      x: Math.sin(t) * Math.cos(p),
      y: Math.sin(t) * Math.sin(p),
      z: Math.cos(t)
    };
  };

  const tip = getPointsOnSphere(theta, phi);
  const tipProj = proj(tip.x, tip.y, tip.z);
  const origin = proj(0, 0, 0);

  // ... (rest of projection logic)
  const tipEquatorProj = proj(tip.x, tip.y, 0);

  const equatorPoints = [];
  for (let i = 0; i <= 60; i++) {
    const p = (i / 60) * Math.PI * 2;
    equatorPoints.push(proj(Math.cos(p), Math.sin(p), 0));
  }
  const equatorPath = `M ${equatorPoints.map(p => `${p.sx},${p.sy}`).join(' L ')}`;

  const meridianPoints = [];
  for (let i = 0; i <= 60; i++) {
    const t = (i / 60) * Math.PI * 2;
    meridianPoints.push(proj(0, Math.sin(t), Math.cos(t)));
  }
  const meridianPath = `M ${meridianPoints.map(p => `${p.sx},${p.sy}`).join(' L ')}`;

  // Theta arc (in phi plane)
  const thetaArcPoints = [];
  for (let i = 0; i <= 20; i++) {
    const t = (i / 20) * theta;
    const pt = getPointsOnSphere(t, phi);
    thetaArcPoints.push(proj(pt.x, pt.y, pt.z));
  }
  const thetaArcPath = `M ${thetaArcPoints.map(p => `${p.sx},${p.sy}`).join(' L ')}`;

  // Phi arc (at equator)
  const phiArcPoints = [];
  for (let i = 0; i <= 20; i++) {
    const p = (i / 20) * phi;
    phiArcPoints.push(proj(Math.cos(p) * 0.4, Math.sin(p) * 0.4, 0));
  }
  const phiArcPath = `M ${phiArcPoints.map(p => `${p.sx},${p.sy}`).join(' L ')}`;

  const top = proj(0, 0, 1);
  const bottom = proj(0, 0, -1);
  const right = proj(1, 0, 0);
  const left = proj(-1, 0, 0);
  const front = proj(0, 1, 0);
  const back = proj(0, -1, 0);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <svg viewBox="0 0 520 520" className="w-full h-full max-w-[500px]">
        <defs>
          <radialGradient id="sphereGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="#1a1a24" />
            <stop offset="100%" stopColor="#0a0a0f" />
          </radialGradient>
          <filter id="glow">
             <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
             <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>

        {/* Sphere Background */}
        <circle cx="260" cy="260" r="165" fill="url(#sphereGradient)" stroke="#2a2a35" strokeWidth="1" />

        {/* Axes */}
        {/* Negative Axes */}
        <line x1={origin.sx} y1={origin.sy} x2={proj(-1.5, 0, 0).sx} y2={proj(-1.5, 0, 0).sy} stroke="#666" strokeDasharray="3 3" />
        <line x1={origin.sx} y1={origin.sy} x2={proj(0, -1.5, 0).sx} y2={proj(0, -1.5, 0).sy} stroke="#666" strokeDasharray="3 3" />
        <line x1={origin.sx} y1={origin.sy} x2={proj(0, 0, -1.5).sx} y2={proj(0, 0, -1.5).sy} stroke="#666" strokeDasharray="3 3" />

        {/* Equator & Meridian */}
        <path d={equatorPath} fill="none" stroke="#00f2ff" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.5" />
        <path d={meridianPath} fill="none" stroke="#ccc" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.4" />

        {/* Positive Axes */}
        <line x1={origin.sx} y1={origin.sy} x2={proj(1.5, 0, 0).sx} y2={proj(1.5, 0, 0).sy} stroke="#aaa" strokeWidth="2" />
        <line x1={origin.sx} y1={origin.sy} x2={proj(0, 1.5, 0).sx} y2={proj(0, 1.5, 0).sy} stroke="#aaa" strokeWidth="2" />
        <line x1={origin.sx} y1={origin.sy} x2={proj(0, 0, 1.5).sx} y2={proj(0, 0, 1.5).sy} stroke="#fff" strokeWidth="2.5" opacity="1" filter="url(#glow)" />

        {/* Labels & Nodes */}
        <circle cx={top.sx} cy={top.sy} r="4" fill="#00f2ff" />
        <text x={top.sx} y={top.sy - 15} textAnchor="middle" className="text-[14px] font-bold fill-quantum-cyan">|0⟩</text>

        <circle cx={bottom.sx} cy={bottom.sy} r="4" fill="#ff00ea" />
        <text x={bottom.sx} y={bottom.sy + 25} textAnchor="middle" className="text-[14px] font-bold fill-quantum-magenta">|1⟩</text>

        <circle cx={right.sx} cy={right.sy} r="3" fill="#a855f7" />
        <text x={right.sx + 15} y={right.sy + 5} className="text-[10px] font-mono fill-purple-400">|+⟩</text>

        <circle cx={left.sx} cy={left.sy} r="3" fill="#a855f7" />
        <text x={left.sx - 25} y={left.sy + 5} className="text-[10px] font-mono fill-purple-400">|−⟩</text>

        <circle cx={front.sx} cy={front.sy} r="3" fill="#22c55e" />
        <text x={front.sx - 10} y={front.sy + 20} className="text-[10px] font-mono fill-green-400">|i⟩</text>

        <circle cx={back.sx} cy={back.sy} r="3" fill="#22c55e" />
        <text x={back.sx + 10} y={back.sy - 10} className="text-[10px] font-mono fill-green-400">|−i⟩</text>

        {/* Projection Lines */}
        <line x1={tipProj.sx} y1={tipProj.sy} x2={tipEquatorProj.sx} y2={tipEquatorProj.sy} stroke="#666" strokeDasharray="2 2" strokeWidth="0.5" />
        <line x1={origin.sx} y1={origin.sy} x2={tipEquatorProj.sx} y2={tipEquatorProj.sy} stroke="#666" strokeDasharray="2 2" strokeWidth="0.5" />

        {/* Arcs */}
        <path d={thetaArcPath} fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
        <text x={proj(Math.sin(theta/2)*Math.cos(phi), Math.sin(theta/2)*Math.sin(phi), Math.cos(theta/2)).sx + 10} 
              y={proj(Math.sin(theta/2)*Math.cos(phi), Math.sin(theta/2)*Math.sin(phi), Math.cos(theta/2)).sy} 
              className="italic fill-gray-400 text-[12px]">θ</text>

        <path d={phiArcPath} fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
        <text x={proj(0.5*Math.cos(phi/2), 0.5*Math.sin(phi/2), 0).sx} 
              y={proj(0.5*Math.cos(phi/2), 0.5*Math.sin(phi/2), 0).sy + 15} 
              className="italic fill-gray-400 text-[12px]">φ</text>

        <line x1={origin.sx} y1={origin.sy} x2={tipProj.sx} y2={tipProj.sy} stroke="#00f2ff" strokeWidth="3" filter="url(#glow)" />
        <circle cx={tipProj.sx} cy={tipProj.sy} r="5" fill="#00f2ff" filter="url(#glow)" />

        {/* Global Label */}
        <text x="260" y="500" textAnchor="middle" className="text-[12px] font-serif italic fill-gray-500">
          |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩
        </text>
      </svg>
    </div>
  );
};

const StateVector = ({ theta, phi }: QubitState) => {
  const vectorRef = useRef<THREE.Group>(null);

  // Convert spherical to cartesian for conventional Bloch sphere:
  // |0> is at (0, 1, 0) - North Pole
  // |1> is at (0, -1, 0) - South Pole
  // X-axis: sin(theta)*cos(phi)
  // Y-axis: cos(theta)
  // Z-axis: sin(theta)*sin(phi)
  
  const targetX = Math.sin(theta) * Math.cos(phi);
  const targetY = Math.cos(theta); // Up is |0>
  const targetZ = Math.sin(theta) * Math.sin(phi);

  useFrame((state, delta) => {
    if (vectorRef.current) {
      // Rotation to align the vector
      const targetPos = new THREE.Vector3(targetX, targetY, targetZ).multiplyScalar(2.5);
      vectorRef.current.lookAt(targetPos);
    }
  });

  return (
    <group ref={vectorRef}>
      {/* Main Staff - Note: lookAt points Z axis, so we rotate staff to align with Z */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2.5, 12]} />
        <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={2} transparent opacity={0.9} />
      </mesh>
      
      {/* Arrow Head */}
      <mesh position={[0, 0, 1.25]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.06, 0.2, 12]} />
        <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={3} />
      </mesh>

      {/* Point on surface */}
      <Sphere args={[0.04, 16, 16]} position={[0, 0, 1.25]}>
        <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={4} />
      </Sphere>

      {/* Glow */}
      <pointLight position={[0, 0, 1.25]} color="#00f2ff" intensity={1} distance={3} />
    </group>
  );
};

const BlochSphereStructure = () => {
  const resolution = 64;
  
  return (
    <group>
      {/* Main Sphere Surface */}
      <Sphere args={[2.5, 64, 64]}>
        <meshPhongMaterial 
          color="#15151a" 
          transparent 
          opacity={0.3} 
          side={THREE.DoubleSide}
          shininess={100}
        />
      </Sphere>

      {/* Wireframe Outline */}
      <Sphere args={[2.505, 32, 32]}>
        <meshBasicMaterial color="#00f2ff" wireframe transparent opacity={0.1} />
      </Sphere>

      {/* X Axis */}
      <Line 
        points={[[-3, 0, 0], [3, 0, 0]]} 
        color="#888888" 
        lineWidth={1} 
        transparent 
        opacity={0.5} 
      />
      <Text position={[3.5, 0, 0]} fontSize={0.25} color="#ffffff" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2fyg.woff">X</Text>

      {/* Y Axis (AZIMUTHAL/Z in many conventions, but we use Three.js Z) */}
      <Line 
        points={[[0, 0, -3], [0, 0, 3]]} 
        color="#888888" 
        lineWidth={1} 
        transparent 
        opacity={0.5} 
      />
      <Text position={[0, 0, 3.5]} fontSize={0.25} color="#ffffff" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2fyg.woff">Y</Text>

      {/* Z Axis (COMPUTATIONAL - Three.js Y) */}
      <Line 
        points={[[0, -3, 0], [0, 3, 0]]} 
        color="#ffffff" 
        lineWidth={1} 
        transparent 
        opacity={0.5} 
      />
      <Text position={[0, 3.5, 0]} fontSize={0.4} color="#00f2ff" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2fyg.woff">|0⟩</Text>
      <Text position={[0, -3.5, 0]} fontSize={0.4} color="#ff00ea" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2fyg.woff">|1⟩</Text>

      {/* Basis Labels around Equator */}
      <Text position={[2.7, 0, 0]} fontSize={0.2} color="#ffffff" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2fyg.woff">|+⟩</Text>
      <Text position={[-2.7, 0, 0]} fontSize={0.2} color="#ffffff" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2fyg.woff">|-⟩</Text>
      <Text position={[0, 0, 2.7]} fontSize={0.2} color="#ffffff" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2fyg.woff">|i+⟩</Text>
      <Text position={[0, 0, -2.7]} fontSize={0.2} color="#ffffff" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2fyg.woff">|i-⟩</Text>

      {/* Equator Ring */}
      <Line
        points={useMemo(() => {
          const p = [];
          for (let i = 0; i <= resolution; i++) {
            const a = (i / resolution) * Math.PI * 2;
            p.push([Math.cos(a) * 2.5, 0, Math.sin(a) * 2.5]);
          }
          return p;
        }, []) as any}
        color="#00f2ff"
        lineWidth={2}
        transparent
        opacity={0.6}
      />
      
      {/* Longitudinal Rings */}
      <Line
        points={useMemo(() => {
          const p = [];
          for (let i = 0; i <= resolution; i++) {
            const a = (i / resolution) * Math.PI * 2;
            p.push([Math.cos(a) * 2.5, Math.sin(a) * 2.5, 0]);
          }
          return p;
        }, []) as any}
        color="#888888"
        lineWidth={2}
        transparent
        opacity={0.4}
      />
      <Line
        points={useMemo(() => {
          const p = [];
          for (let i = 0; i <= resolution; i++) {
            const a = (i / resolution) * Math.PI * 2;
            p.push([0, Math.sin(a) * 2.5, Math.cos(a) * 2.5]);
          }
          return p;
        }, []) as any}
        color="#888888"
        lineWidth={2}
        transparent
        opacity={0.4}
      />
    </group>
  );
};

// --- Page Component ---

export const BlochSpherePage: React.FC = () => {
  const { 
    theta, phi, alpha, beta, 
    setTheta, setPhi, 
    addMeasurement: syncMeasurement 
  } = useQuantum();
  const [isRotating, setIsRotating] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [gateHistory, setGateHistory] = useState<string[]>([]);
  const [lastMeasurement, setLastMeasurement] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'diagram'>('3d');

  const prob0 = Math.pow(alpha, 2);
  const prob1 = Math.pow(beta, 2);

  // Animation Loop for state rotation
  useEffect(() => {
    let frame: number;
    if (isRotating) {
      const animate = () => {
        setPhi((phi + rotationSpeed) % (Math.PI * 2));
        frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(frame);
  }, [isRotating, rotationSpeed, phi, setPhi]);

  const applyGate = (gate: string) => {
    setGateHistory(prev => [gate, ...prev].slice(0, 10));
    switch(gate) {
      case 'X': // PI rotation around X
        setTheta(Math.PI - theta);
        setPhi(-phi);
        break;
      case 'Y': // PI rotation around Y
        setTheta(Math.PI - theta);
        setPhi(Math.PI - phi);
        break;
      case 'Z': // PI rotation around Z
        setPhi(phi + Math.PI);
        break;
      case 'H': // Hadamard
        if (Math.abs(theta) < 0.1) {
          setTheta(Math.PI / 2);
          setPhi(0);
        } else if (Math.abs(theta - Math.PI) < 0.1) {
          setTheta(Math.PI / 2);
          setPhi(Math.PI);
        } else {
          setTheta(0);
          setPhi(0);
        }
        break;
      case 'Reset':
        setTheta(0);
        setPhi(0);
        break;
      case 'Random':
        setTheta(Math.random() * Math.PI);
        setPhi(Math.random() * Math.PI * 2);
        break;
    }
  };

  const measure = () => {
    const result = Math.random() < prob0 ? 0 : 1;
    setLastMeasurement(result);
    // Sync with global history
    syncMeasurement(result);
    // Collapse state
    setTheta(result === 0 ? 0 : Math.PI);
    setPhi(0);
    setTimeout(() => setLastMeasurement(null), 3000);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full max-h-screen">
      {/* Main Visualizer Container */}
      <div className="flex-grow flex flex-col gap-6">
        <header className="flex justify-between items-center bg-quantum-panel/50 p-6 rounded-2xl border border-quantum-border">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
               <Orbit className="text-quantum-cyan" size={24} />
               Interactive Bloch Sphere
            </h2>
            <div className="flex items-center gap-6 mt-1">
              <p className="text-xs text-gray-400 font-mono">Bloch sphere representation</p>
            </div>
          </div>
          <div className="flex gap-2">
             <div className="px-4 py-2 bg-black/40 rounded-xl border border-quantum-border flex flex-col items-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Theta (θ)</span>
                <span className="text-sm font-mono text-quantum-cyan">{(theta * 180 / Math.PI).toFixed(1)}°</span>
             </div>
             <div className="px-4 py-2 bg-black/40 rounded-xl border border-quantum-border flex flex-col items-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Phi (φ)</span>
                <span className="text-sm font-mono text-quantum-magenta">{(phi * 180 / Math.PI).toFixed(1)}°</span>
             </div>
          </div>
        </header>

        {/* 3D Stage / Diagram */}
        <div className="flex-grow glass-panel relative overflow-hidden group min-h-[500px] bg-slate-950">
          {/* View Toggle Overlay */}
          <div className="absolute top-6 right-6 z-10 flex bg-black/60 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            <button 
              onClick={() => setViewMode('3d')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === '3d' ? 'bg-quantum-cyan text-black' : 'text-gray-400 hover:text-white'}`}
            >
              3D Sphere
            </button>
            <button 
              onClick={() => setViewMode('diagram')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'diagram' ? 'bg-quantum-cyan text-black' : 'text-gray-400 hover:text-white'}`}
            >
              2D Diagram
            </button>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === '3d' ? (
              <motion.div 
                key="3d" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <Canvas dpr={[1, 2]} camera={{ position: [5, 5, 8], fov: 40 }}>
                  <Suspense fallback={null}>
                    <OrbitControls enableDamping dampingFactor={0.05} minDistance={5} maxDistance={15} />
                    <ambientLight intensity={0.4} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ea" />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                      <BlochSphereStructure />
                      <StateVector theta={theta} phi={phi} />
                    </Float>
                    <gridHelper args={[20, 20, '#2a2a35', '#15151a']} position={[0, -4, 0]} rotation={[0, 0, 0]} />
                  </Suspense>
                </Canvas>
              </motion.div>
            ) : (
              <motion.div 
                key="diagram" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full"
              >
                <BlochSphereDiagram theta={theta} phi={phi} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* HUD Overlay */}
          <div className="absolute top-6 left-6 space-y-4 pointer-events-none z-10 w-full max-w-[280px]">
             <div className="glass-panel p-4 bg-black/60 border-l-4 border-quantum-cyan backdrop-blur-md">
                <div className="text-[10px] text-gray-500 font-bold uppercase mb-2">Current State Vector</div>
                <div className="text-lg font-serif italic text-white whitespace-nowrap overflow-hidden text-ellipsis">
                  |ψ⟩ = <span className="text-quantum-cyan">{alpha.toFixed(2)}</span>|0⟩ + 
                  <span className="text-quantum-magenta"> {beta.toFixed(2)}e<sup>i{phi.toFixed(2)}</sup></span>|1⟩
                </div>
             </div>
             
             <div className="flex gap-3">
                <div className="glass-panel p-2.5 bg-black/60 backdrop-blur-md flex-1">
                   <div className="text-[8px] text-gray-500 uppercase mb-0.5">P(0)</div>
                   <div className="text-sm font-mono text-quantum-cyan">{(prob0 * 100).toFixed(1)}%</div>
                </div>
                <div className="glass-panel p-2.5 bg-black/60 backdrop-blur-md flex-1">
                   <div className="text-[8px] text-gray-500 uppercase mb-0.5">P(1)</div>
                   <div className="text-sm font-mono text-quantum-magenta">{(prob1 * 100).toFixed(1)}%</div>
                </div>
             </div>
          </div>

          {/* Legend for Diagram View */}
          {viewMode === 'diagram' && (
            <div className="absolute bottom-6 right-6 glass-panel p-3 bg-black/60 border border-quantum-border pointer-events-none backdrop-blur-md z-10">
              <div className="text-[9px] text-gray-500 font-bold uppercase mb-2 tracking-widest border-b border-white/5 pb-1">Projection Legend</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-quantum-cyan" />
                  <span className="text-[9px] text-gray-400 font-mono">|0⟩ (Z+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-quantum-magenta" />
                  <span className="text-[9px] text-gray-400 font-mono">|1⟩ (Z-)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-[9px] text-gray-400 font-mono">|+⟩ / |-⟩ (X)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[9px] text-gray-400 font-mono">|i⟩ / |-i⟩ (Y)</span>
                </div>
              </div>
            </div>
          )}
        </div>

          <AnimatePresence>
            {lastMeasurement !== null && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="p-8 bg-black/80 backdrop-blur-xl border-2 border-white/20 rounded-full flex flex-col items-center gap-2">
                   <div className="text-xs uppercase font-mono text-gray-500">Collapsed To</div>
                   <div className={`text-6xl font-bold ${lastMeasurement === 0 ? 'text-quantum-cyan' : 'text-quantum-magenta'}`}>
                     |{lastMeasurement}⟩
                   </div>
                   <div className="text-[10px] font-mono text-gray-600">Measurement Successful</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      {/* Right Sidebar: Controls & Info */}
      <div className="xl:w-112 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-8">
        {/* Style Formula Display */}
        <section className="glass-panel p-6 bg-[#1a1a24]/50 border border-[#333] rounded-xl shadow-inner">
           <div className="flex items-center gap-2 text-white font-mono text-lg font-bold">
              <span>|ψ⟩ = </span>
              <span className="text-white">{alpha.toFixed(3)}|0⟩</span>
              <span className="text-white mx-1">+</span>
              <span className="text-white">
                ({(beta * Math.cos(phi)).toFixed(3)}
                {beta * Math.sin(phi) >= 0 ? '+' : ''}
                {(beta * Math.sin(phi)).toFixed(3)}i)|1⟩
              </span>
           </div>
        </section>

        {/* State Sliders */}
        <section className="space-y-8">
           <div className="space-y-4">
              <div className="flex justify-between text-sm font-mono text-gray-300">
                 <span>θ — polar angle</span>
                 <span>{(theta * 180 / Math.PI).toFixed(1)}°</span>
              </div>
              <input 
                 type="range" min="0" max={Math.PI} step="0.01" 
                 value={theta}
                 onChange={(e) => setTheta(parseFloat(e.target.value))}
                 className="slider-quantum" 
              />
           </div>

           <div className="space-y-4">
              <div className="flex justify-between text-sm font-mono text-gray-300">
                 <span>φ — azimuthal angle</span>
                 <span>{(phi * 180 / Math.PI).toFixed(1)}°</span>
              </div>
              <input 
                 type="range" min="0" max={Math.PI * 2} step="0.01" 
                 value={phi}
                 onChange={(e) => setPhi(parseFloat(e.target.value))}
                 className="slider-quantum" 
              />
           </div>

           {/* Probabilities with Progress Bars (Image Style) */}
           <div className="space-y-6">
              <div className="space-y-2">
                 <div className="flex justify-between text-sm font-mono text-gray-300">
                    <span>P(|0⟩)</span>
                    <span>{prob0.toFixed(3)}</span>
                 </div>
                 <div className="h-2.5 w-full bg-[#1a1a24] rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      key="prob0"
                      initial={{ width: 0 }}
                      animate={{ width: `${prob0 * 100}%` }}
                      className="h-full bg-quantum-cyan shadow-[0_0_15px_rgba(0,242,255,0.4)]"
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between text-sm font-mono text-gray-300">
                    <span>P(|1⟩)</span>
                    <span>{prob1.toFixed(3)}</span>
                 </div>
                 <div className="h-2.5 w-full bg-[#1a1a24] rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      key="prob1"
                      initial={{ width: 0 }}
                      animate={{ width: `${prob1 * 100}%` }}
                      className="h-full bg-quantum-magenta shadow-[0_0_15px_rgba(255,0,234,0.4)]"
                    />
                 </div>
              </div>
           </div>

           {/* Quick States Buttons (Image Style) */}
           <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em]">Quick states / Basis</div>
              <div className="grid grid-cols-3 gap-2">
                 {[
                   { label: '|0⟩', t: 0, p: 0 },
                   { label: '|1⟩', t: Math.PI, p: 0 },
                   { label: '|+⟩', t: Math.PI/2, p: 0 },
                   { label: '|−⟩', t: Math.PI/2, p: Math.PI },
                   { label: '|i⟩', t: Math.PI/2, p: Math.PI/2 },
                   { label: '|−i⟩', t: Math.PI/2, p: 3*Math.PI/2 },
                 ].map((state) => (
                   <button
                     key={state.label}
                     onClick={() => { setTheta(state.t); setPhi(state.p); }}
                     className="py-2.5 bg-black/40 border border-[#333] rounded-lg text-xs font-mono text-gray-300 hover:text-white hover:bg-[#222] hover:border-quantum-cyan/50 transition-all"
                   >
                     {state.label}
                   </button>
                 ))}
              </div>
           </div>
        </section>

        {/* Phase Rotation Controls */}
        <section className="glass-panel p-6 space-y-4 border-l-2 border-green-500/50">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest">
                 <TrendingUp size={14} className="text-green-400" />
                 Phase Drift
              </div>
              <button 
                onClick={() => setIsRotating(!isRotating)}
                className={`p-1.5 rounded-lg transition-all ${isRotating ? 'bg-red-500/20 text-red-400' : 'bg-green-500/10 text-green-400'}`}
              >
                {isRotating ? <Pause size={14} /> : <Play size={14} />}
              </button>
           </div>
           <input 
             type="range" min="0" max="0.1" step="0.001" 
             value={rotationSpeed}
             onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
             className="w-full h-1 bg-[#2a2a35] rounded-lg appearance-none cursor-pointer accent-green-400" 
           />
        </section>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
           <button 
             onClick={measure}
             className="py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-quantum-cyan transition-all uppercase text-[10px] tracking-[0.2em]"
           >
              <Target size={18} /> Measure
           </button>
           <button 
             onClick={() => applyGate('Reset')}
             className="py-4 bg-black/40 border border-[#333] text-gray-500 font-bold rounded-xl flex items-center justify-center gap-2 hover:text-white hover:bg-black/60 transition-all uppercase text-[10px] tracking-[0.2em]"
           >
             <RefreshCcw size={18} /> Reset
           </button>
        </div>
      </div>
    </div>
  );
};
