import React, { useEffect, useRef, useMemo } from 'react';

interface WaveVisualizerProps {
  alpha: number;
  beta: number;
  isMeasuring: boolean;
  lastResult: number | null;
  dataCount: number;
}

export const WaveVisualizer: React.FC<WaveVisualizerProps> = ({
  alpha,
  beta,
  isMeasuring,
  lastResult,
  dataCount,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  // Adaptive factor: wave becomes "stabler" or "smoother" as data accumulates
  const stability = useMemo(() => Math.min(1, dataCount / 1000), [dataCount]);

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    const time = timeRef.current;
    const centerY = height / 2;
    const amplitude = height * 0.3;
    
    // Draw grid
    ctx.strokeStyle = 'rgba(42, 42, 53, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < width; x += 50) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += 50) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Wave parameters
    const sigma = width * 0.15;
    const x0 = width * 0.3;
    const x1 = width * 0.7;
    
    // Determine target amplitudes based on state
    let targetAlpha = alpha;
    let targetBeta = beta;
    
    if (lastResult !== null) {
      targetAlpha = lastResult === 0 ? 1 : 0;
      targetBeta = lastResult === 1 ? 1 : 0;
    }

    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';

    // Draw the combined wave
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      // Gaussian envelopes
      const env0 = Math.exp(-Math.pow(x - x0, 2) / (2 * Math.pow(sigma, 2)));
      const env1 = Math.exp(-Math.pow(x - x1, 2) / (2 * Math.pow(sigma, 2)));
      
      // Oscillations
      const osc0 = Math.sin(x * 0.05 - time * 0.1);
      const osc1 = Math.sin(x * 0.05 - time * 0.15);
      
      // Combined wave
      // We use targetAlpha/Beta for the "collapsed" state or the "superposition" state
      const y = centerY + (targetAlpha * env0 * osc0 + targetBeta * env1 * osc1) * amplitude;
      
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    // Gradient for the wave
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0.3, '#00f2ff'); // Cyan for |0>
    gradient.addColorStop(0.7, '#ff00ea'); // Magenta for |1>
    
    ctx.strokeStyle = gradient;
    ctx.shadowBlur = 15;
    ctx.shadowColor = lastResult === 0 ? '#00f2ff' : lastResult === 1 ? '#ff00ea' : 'rgba(0, 242, 255, 0.5)';
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw probability density (faint background)
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    for (let x = 0; x < width; x++) {
      const env0 = Math.exp(-Math.pow(x - x0, 2) / (2 * Math.pow(sigma, 2)));
      const env1 = Math.exp(-Math.pow(x - x1, 2) / (2 * Math.pow(sigma, 2)));
      const density = (Math.pow(targetAlpha * env0, 2) + Math.pow(targetBeta * env1, 2)) * amplitude;
      
      if (x === 0) ctx.moveTo(x, centerY - density);
      else ctx.lineTo(x, centerY - density);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Measurement indicators
    if (lastResult !== null) {
      const targetX = lastResult === 0 ? x0 : x1;
      ctx.fillStyle = lastResult === 0 ? '#00f2ff' : '#ff00ea';
      ctx.beginPath();
      ctx.arc(targetX, centerY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 20;
      ctx.shadowColor = ctx.fillStyle as string;
      ctx.stroke();
    }

    timeRef.current += 1 + stability * 0.5; // Speed up slightly with more data
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx, canvas.width, canvas.height);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [alpha, beta, lastResult, stability]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement;
        if (parent) {
          canvasRef.current.width = parent.clientWidth;
          canvasRef.current.height = parent.clientHeight;
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] glass-panel overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
      <div className="absolute top-4 left-4 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-quantum-cyan neon-glow-cyan" />
          <span className="text-xs font-mono text-quantum-cyan">|0⟩ STATE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-quantum-magenta neon-glow-magenta" />
          <span className="text-xs font-mono text-quantum-magenta">|1⟩ STATE</span>
        </div>
      </div>
      
      {isMeasuring && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="text-2xl font-mono animate-pulse text-white tracking-widest">
            COLLAPSING WAVEFUNCTION...
          </div>
        </div>
      )}
    </div>
  );
};
