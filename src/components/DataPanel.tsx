import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity } from 'lucide-react';

interface DataPanelProps {
  alpha: number;
  beta: number;
  history: number[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#15151a] border border-[#2a2a35] p-3 rounded-lg shadow-xl space-y-2 min-w-[140px]">
        <div className="text-[10px] font-mono text-gray-400 border-b border-white/10 pb-1 mb-2">
          State {label}
        </div>
        <div className="space-y-2">
          {payload.map((item: any, index: number) => {
            const isTheoretical = item.name.includes("Theoretical");
            return (
              <div key={index} className="flex flex-col gap-0.5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[10px] font-bold" style={{ color: item.color }}>{item.name}:</span>
                  <span className="text-[11px] font-mono whitespace-nowrap" style={{ color: item.color }}>{item.value.toFixed(2)}%</span>
                </div>
                {isTheoretical && (
                  <div className="flex gap-2 text-[9px] text-gray-500 font-mono pl-2 border-l border-gray-800">
                    <span>α: {item.payload.alpha.toFixed(3)}</span>
                    <span>β: {item.payload.beta.toFixed(3)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export const DataPanel: React.FC<DataPanelProps> = ({ alpha, beta, history }) => {
  const count0 = history.filter(r => r === 0).length;
  const count1 = history.filter(r => r === 1).length;
  const total = history.length;

  const observedP0 = total > 0 ? count0 / total : 0;
  const observedP1 = total > 0 ? count1 / total : 0;

  const theoreticalP0 = Math.pow(alpha, 2);
  const theoreticalP1 = 1 - theoreticalP0;

  const chartData = useMemo(() => [
    { 
      name: '|0⟩', 
      observed: observedP0 * 100, 
      theoretical: theoreticalP0 * 100,
      alpha: alpha,
      beta: beta,
      color: '#00f2ff' 
    },
    { 
      name: '|1⟩', 
      observed: observedP1 * 100, 
      theoretical: theoreticalP1 * 100,
      alpha: alpha,
      beta: beta,
      color: '#ff00ea' 
    },
  ], [observedP0, observedP1, theoreticalP0, theoreticalP1, alpha, beta]);

  const deviation = useMemo(() => {
    if (total === 0) return 0;
    return Math.abs(observedP0 - theoreticalP0);
  }, [observedP0, theoreticalP0, total]);

  return (
    <div className="flex flex-col gap-6 p-6 glass-panel h-full">
      <div className="space-y-4">
        <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Experimental Data</h2>
        
        {total > 0 ? (
          <>
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
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    content={<CustomTooltip />}
                  />
                  <Bar dataKey="observed" name="Observed %" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-obs-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                  <Bar dataKey="theoretical" name="Theoretical %" radius={[4, 4, 0, 0]} opacity={0.3}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-theo-${index}`} fill={entry.color} />
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
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-12 text-center space-y-4 border-2 border-dashed border-quantum-border rounded-2xl">
             <div className="bg-black/20 p-4 rounded-full">
                <Activity className="text-gray-700" size={32} />
             </div>
             <div className="space-y-1 px-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-tight">System Ready</h4>
                <p className="text-[11px] text-gray-500">Wait for quantum collapse. Click 'Measure' to generate experimental data.</p>
             </div>
          </div>
        )}
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
