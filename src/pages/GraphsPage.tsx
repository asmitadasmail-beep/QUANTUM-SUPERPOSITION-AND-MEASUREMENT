import React, { useMemo } from 'react';
import { useQuantum } from '../hooks/useQuantum';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, Legend 
} from 'recharts';
import { Activity, BarChart as BarChartIcon, Info } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#15151a] border border-[#2a2a35] p-3 rounded-lg shadow-xl space-y-2 min-w-[140px]">
        <div className="text-[10px] font-mono text-gray-400 border-b border-white/10 pb-1 mb-2">
          N = {label}
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

const DistributionTooltip = ({ active, payload, label }: any) => {
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

export const GraphsPage: React.FC = () => {
  const { history, alpha, beta } = useQuantum();

  // Convergence data
  const convergenceData = useMemo(() => {
    if (history.length === 0) return [];
    const theoretical0 = Math.pow(alpha, 2);
    const theoretical1 = 1 - theoretical0;
    let count0 = 0;
    let count1 = 0;
    
    // Sampling every N points if history is large
    const step = Math.max(1, Math.floor(history.length / 50));
    
    const data = [];
    for (let i = 0; i < history.length; i++) {
       if (history[i] === 0) count0++;
       else count1++;

       if ((i + 1) % step === 0 || i === history.length - 1) {
          data.push({
             index: i + 1,
             observed0: (count0 / (i + 1)) * 100,
             theoretical0: theoretical0 * 100,
             observed1: (count1 / (i + 1)) * 100,
             theoretical1: theoretical1 * 100,
             alpha,
             beta
          });
       }
    }
    return data;
  }, [history, alpha, beta]);

  const stats = useMemo(() => {
    const total = history.length;
    const count0 = history.filter(r => r === 0).length;
    const count1 = history.filter(r => r === 1).length;
    return { total, count0, count1 };
  }, [history]);

  return (
    <div className="space-y-12 pb-24">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Statistical Analysis</h2>
        <p className="text-gray-400">Visualization of experimental outcomes and their convergence to mathematical theory.</p>
      </header>

      {/* State Coefficients Overview */}
      <section className="grid md:grid-cols-2 gap-4">
         <div className="glass-panel p-6 border-l-4 border-quantum-cyan">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Alpha Coefficient (α)</h4>
                  <p className="text-2xl font-bold text-white">{alpha.toFixed(3)}</p>
               </div>
               <div className="text-right">
                  <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Probability (|α|²)</h4>
                  <p className="text-lg font-bold text-quantum-cyan">{(Math.pow(alpha, 2) * 100).toFixed(1)}%</p>
               </div>
            </div>
            <div className="h-2 w-full bg-quantum-border rounded-full overflow-hidden">
               <div className="h-full bg-quantum-cyan" style={{ width: `${Math.pow(alpha, 2) * 100}%` }} />
            </div>
         </div>
         <div className="glass-panel p-6 border-l-4 border-quantum-magenta">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Beta Coefficient (β)</h4>
                  <p className="text-2xl font-bold text-white">{Math.sqrt(1 - alpha*alpha).toFixed(3)}</p>
               </div>
               <div className="text-right">
                  <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Probability (|β|²)</h4>
                  <p className="text-lg font-bold text-quantum-magenta">{( (1 - alpha*alpha) * 100).toFixed(1)}%</p>
               </div>
            </div>
            <div className="h-2 w-full bg-quantum-border rounded-full overflow-hidden">
               <div className="h-full bg-quantum-magenta" style={{ width: `${(1 - alpha*alpha) * 100}%` }} />
            </div>
         </div>
      </section>

      {stats.total > 0 ? (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Convergence Chart */}
          <section className="glass-panel p-8 space-y-6">
             <div className="flex items-center gap-3">
                <Activity className="text-quantum-cyan" size={20} />
                <h3 className="text-lg font-bold text-white">Probability Convergence</h3>
             </div>
             <div className="h-64 w-full bg-black/20 rounded-xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={convergenceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
                      <XAxis 
                         dataKey="index" 
                         stroke="#6b7280" 
                         fontSize={10} 
                         tickLine={false} 
                         axisLine={false}
                         label={{ value: 'Number of Experiments (N)', position: 'insideBottom', offset: -10, fill: '#6b7280', fontSize: 10 }}
                      />
                      <YAxis 
                         domain={[0, 100]} 
                         stroke="#6b7280" 
                         fontSize={10} 
                         tickLine={false} 
                         axisLine={false}
                         label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 10 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                         iconType="rect" 
                         verticalAlign="bottom" 
                         align="center"
                         wrapperStyle={{ fontSize: '11px', paddingTop: '30px', fontWeight: 'bold', textTransform: 'uppercase' }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="observed0" 
                        stroke="#00f2ff" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2, fill: '#0b0b0f' }} 
                        activeDot={{ r: 6, stroke: '#00f2ff', strokeWidth: 2 }}
                        name="Observed P₀" 
                      />
                      <Line 
                        type="step" 
                        dataKey="theoretical0" 
                        stroke="#00f2ff" 
                        strokeWidth={1} 
                        strokeDasharray="8 4" 
                        opacity={0.4} 
                        dot={false} 
                        name="Theoretical P₀" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="observed1" 
                        stroke="#ff00ea" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2, fill: '#0b0b0f' }} 
                        activeDot={{ r: 6, stroke: '#ff00ea', strokeWidth: 2 }}
                        name="Observed P₁" 
                      />
                      <Line 
                        type="step" 
                        dataKey="theoretical1" 
                        stroke="#ff00ea" 
                        strokeWidth={1} 
                        strokeDasharray="8 4" 
                        opacity={0.4} 
                        dot={false} 
                        name="Theoretical P₁" 
                      />
                   </LineChart>
                </ResponsiveContainer>
             </div>
             <div className="flex gap-4 p-4 bg-quantum-cyan/5 border border-quantum-cyan/20 rounded-lg">
                <Info size={16} className="text-quantum-cyan shrink-0 mt-0.5" />
                <div className="space-y-1">
                   <div className="text-xs font-bold text-quantum-cyan uppercase tracking-wider">Representation</div>
                   <p className="text-[11px] text-gray-400">
                      **X-Axis**: Represents the cumulative count of independent measurements performed. <br/>
                      **Y-Axis**: Represents the calculated probability of obtaining state |0⟩ (cyan) and |1⟩ (magenta). As N increases, the observed solid lines should converge to their respective theoretical dashed lines.
                   </p>
                </div>
             </div>
          </section>
 
          {/* Outcome Distribution */}
          <section className="glass-panel p-8 space-y-6">
             <div className="flex items-center gap-3">
                <BarChartIcon className="text-quantum-magenta" size={20} />
                <h3 className="text-lg font-bold text-white">Outcome Distribution</h3>
             </div>
             <div className="h-64 w-full bg-black/20 rounded-xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { 
                        name: "|0⟩", 
                        observed: stats.total > 0 ? (stats.count0 / stats.total) * 100 : 0, 
                        theoretical: Math.pow(alpha, 2) * 100,
                        alpha,
                        beta
                      },
                      { 
                        name: "|1⟩", 
                        observed: stats.total > 0 ? (stats.count1 / stats.total) * 100 : 0, 
                        theoretical: (1 - Math.pow(alpha, 2)) * 100,
                        alpha,
                        beta
                      }
                   ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 10 }} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                        content={<DistributionTooltip />}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                      <Bar dataKey="observed" name="Observed %" radius={[4, 4, 0, 0]}>
                         <Cell fill="#00f2ff" />
                         <Cell fill="#ff00ea" />
                      </Bar>
                      <Bar dataKey="theoretical" name="Theoretical %" opacity={0.3} radius={[4, 4, 0, 0]}>
                         <Cell fill="#00f2ff" />
                         <Cell fill="#ff00ea" />
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
             <div className="flex gap-4 p-4 bg-quantum-magenta/5 border border-quantum-magenta/20 rounded-lg">
                <Info size={16} className="text-quantum-magenta shrink-0 mt-0.5" />
                <div className="space-y-1">
                   <div className="text-xs font-bold text-quantum-magenta uppercase tracking-wider">Representation</div>
                   <p className="text-[11px] text-gray-400">
                      **X-Axis**: The basis states of the computational basis (|0⟩ and |1⟩). <br/>
                      **Y-Axis**: The probability percentage observed in experiment vs theoretical expectation.
                   </p>
                </div>
             </div>
          </section>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 border-2 border-dashed border-quantum-border rounded-3xl">
           <div className="bg-quantum-panel p-4 rounded-full">
              <Activity className="text-gray-600" size={32} />
           </div>
           <div className="space-y-1">
              <h4 className="text-lg font-bold text-gray-300">No Experimental Data Yet</h4>
              <p className="text-sm text-gray-500">Go to the Simulator page and run measurements to see live charts here.</p>
           </div>
        </div>
      )}
    </div>
  );
};
