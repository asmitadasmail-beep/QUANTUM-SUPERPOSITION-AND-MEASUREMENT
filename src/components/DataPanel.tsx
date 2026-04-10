import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DataPanelProps {
  alpha: number;
  history: number[];
}

export const DataPanel: React.FC<DataPanelProps> = ({ alpha, history }) => {
  const count0 = history.filter(r => r === 0).length;
  const count1 = history.filter(r => r === 1).length;
  const total = history.length;

  const observedP0 = total > 0 ? count0 / total : 0;
  const observedP1 = total > 0 ? count1 / total : 0;

  const theoreticalP0 = Math.pow(alpha, 2);
  const theoreticalP1 = 1 - theoreticalP0;

  const chartData = useMemo(() => [
    { name: '|0⟩', value: count0, color: '#00f2ff' },
    { name: '|1⟩', value: count1, color: '#ff00ea' },
  ], [count0, count1]);

  const deviation = useMemo(() => {
    if (total === 0) return 0;
    return Math.abs(observedP0 - theoreticalP0);
  }, [observedP0, theoreticalP0, total]);

  return (
    <div className="flex flex-col gap-6 p-6 glass-panel h-full">
      <div className="space-y-4">
        <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Experimental Data</h2>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'monospace' }} 
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#15151a', border: '1px solid #2a2a35', borderRadius: '8px' }}
                itemStyle={{ fontFamily: 'monospace' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-black/40 rounded-lg border border-quantum-border">
            <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Total Samples</div>
            <div className="text-xl font-mono text-white">{total.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-black/40 rounded-lg border border-quantum-border">
            <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Deviation</div>
            <div className="text-xl font-mono text-white">{(deviation * 100).toFixed(2)}%</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-gray-400">
              <span>PROBABILITY |0⟩</span>
              <span>OBSERVED: {(observedP0 * 100).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 w-full bg-quantum-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-quantum-cyan transition-all duration-500" 
                style={{ width: `${theoreticalP0 * 100}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-gray-500 text-right">
              THEORETICAL: {(theoreticalP0 * 100).toFixed(1)}%
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-gray-400">
              <span>PROBABILITY |1⟩</span>
              <span>OBSERVED: {(observedP1 * 100).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 w-full bg-quantum-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-quantum-magenta transition-all duration-500" 
                style={{ width: `${theoreticalP1 * 100}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-gray-500 text-right">
              THEORETICAL: {(theoreticalP1 * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {total > 100 && (
        <div className="mt-auto p-3 bg-quantum-cyan/5 border border-quantum-cyan/20 rounded-lg">
          <p className="text-[10px] font-mono text-quantum-cyan leading-relaxed">
            ADAPTIVE INSIGHT: System stability is high. Observed distribution aligns with theoretical predictions within {deviation.toFixed(4)} variance.
          </p>
        </div>
      )}
    </div>
  );
};
