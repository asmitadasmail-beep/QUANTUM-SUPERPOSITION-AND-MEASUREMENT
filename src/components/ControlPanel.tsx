import React from 'react';
import { Play, RotateCcw, Zap, Layers } from 'lucide-react';

interface ControlPanelProps {
  alpha: number;
  setAlpha: (val: number) => void;
  onMeasure: () => void;
  onBatchRun: () => void;
  onReset: () => void;
  isMeasuring: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  alpha,
  setAlpha,
  onMeasure,
  onBatchRun,
  onReset,
  isMeasuring,
}) => {
  const beta = Math.sqrt(1 - Math.pow(alpha, 2));

  return (
    <div className="flex flex-col gap-6 p-6 glass-panel h-full">
      <div className="space-y-4">
        <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">State Configuration</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-quantum-cyan">α (Alpha): {alpha.toFixed(3)}</span>
              <span className="text-quantum-magenta">β (Beta): {beta.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              disabled={isMeasuring}
              className="w-full h-1.5 bg-quantum-border rounded-lg appearance-none cursor-pointer accent-quantum-cyan"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>|0⟩ DOMINANT</span>
              <span>|1⟩ DOMINANT</span>
            </div>
          </div>

          <div className="p-4 bg-black/40 rounded-lg border border-quantum-border space-y-2">
            <div className="text-[10px] font-mono text-gray-500 uppercase">Current Superposition</div>
            <div className="text-sm font-mono truncate">
              |ψ⟩ = <span className="text-quantum-cyan">{alpha.toFixed(2)}</span>|0⟩ + <span className="text-quantum-magenta">{beta.toFixed(2)}</span>|1⟩
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <button
          onClick={onMeasure}
          disabled={isMeasuring}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
        >
          <Zap size={18} fill="currentColor" />
          MEASURE
        </button>

        <button
          onClick={onBatchRun}
          disabled={isMeasuring}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-quantum-panel border border-quantum-cyan text-quantum-cyan font-bold rounded-lg hover:bg-quantum-cyan/10 transition-all active:scale-95 disabled:opacity-50"
        >
          <Layers size={18} />
          RUN 1000 EXP
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setAlpha(0.707)}
            disabled={isMeasuring}
            className="flex items-center justify-center gap-2 py-2 px-3 bg-quantum-panel border border-quantum-border text-gray-400 text-xs font-mono rounded-lg hover:border-gray-500 transition-all"
          >
            <Play size={14} />
            H-GATE
          </button>
          <button
            onClick={onReset}
            disabled={isMeasuring}
            className="flex items-center justify-center gap-2 py-2 px-3 bg-quantum-panel border border-quantum-border text-gray-400 text-xs font-mono rounded-lg hover:border-red-900/50 hover:text-red-400 transition-all"
          >
            <RotateCcw size={14} />
            RESET
          </button>
        </div>
      </div>
    </div>
  );
};
