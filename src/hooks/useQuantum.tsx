import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuantumState {
  theta: number; // polar angle [0, PI]
  phi: number;   // azimuthal angle [0, 2PI]
  history: number[];
  isMeasuring: boolean;
  lastResult: number | null;
}

interface QuantumContextType extends QuantumState {
  alpha: number; // derived
  beta: number;  // derived
  setTheta: (val: number) => void;
  setPhi: (val: number) => void;
  setAlpha: (val: number) => void; // helper
  setBeta: (val: number) => void; // helper
  addMeasurement: (result: number) => void;
  addBatch: (results: number[]) => void;
  reset: () => void;
  setIsMeasuring: (val: boolean) => void;
  setLastResult: (val: number | null) => void;
}

const QuantumContext = createContext<QuantumContextType | undefined>(undefined);

export const QuantumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theta, setThetaVal] = useState(Math.PI / 2); // Init at Hadamard state theta=PI/2
  const [phi, setPhiVal] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [lastResult, setLastResult] = useState<number | null>(null);

  // Derived amplitudes
  const alpha = Math.cos(theta / 2);
  const beta = Math.sin(theta / 2);

  const setTheta = (val: number) => {
    setThetaVal(val);
    setHistory([]);
  };

  const setPhi = (val: number) => {
    setPhiVal(val);
    setHistory([]);
  };

  const setAlpha = (val: number) => {
    // alpha = cos(theta/2) => theta = 2 * acos(alpha)
    const newTheta = 2 * Math.acos(Math.min(1, Math.max(0, val)));
    setThetaVal(newTheta);
    setHistory([]);
  };

  const setBeta = (val: number) => {
    // beta = sin(theta/2) => theta = 2 * asin(beta)
    const newTheta = 2 * Math.asin(Math.min(1, Math.max(0, val)));
    setThetaVal(newTheta);
    setHistory([]);
  };

  const addMeasurement = (result: number) => setHistory((prev) => [...prev, result]);
  const addBatch = (results: number[]) => setHistory((prev) => [...prev, ...results]);
  
  const reset = () => {
    setThetaVal(Math.PI / 2);
    setPhiVal(0);
    setHistory([]);
    setLastResult(null);
  };

  return (
    <QuantumContext.Provider 
      value={{ 
        theta, phi, alpha, beta, history, isMeasuring, lastResult,
        setTheta, setPhi, setAlpha, setBeta, addMeasurement, addBatch, reset, setIsMeasuring, setLastResult 
      }}
    >
      {children}
    </QuantumContext.Provider>
  );
};

export const useQuantum = () => {
  const context = useContext(QuantumContext);
  if (!context) throw new Error('useQuantum must be used within a QuantumProvider');
  return context;
};
