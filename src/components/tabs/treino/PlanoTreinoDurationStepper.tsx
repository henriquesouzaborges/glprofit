import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface PlanoTreinoDurationStepperProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
}

export const PlanoTreinoDurationStepper: React.FC<PlanoTreinoDurationStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = 120,
  label = 'TEMPO:',
  className = ''
}) => {
  const handleDecrease = () => {
    const nextVal = Math.max(min, (value || 0) - 5);
    onChange(nextVal);
  };

  const handleIncrease = () => {
    const nextVal = Math.min(max, (value || 0) + 5);
    onChange(nextVal);
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {label && <span className="text-xs font-bold text-slate-700">{label}</span>}
      
      {/* Botão lateral esquerdo para diminuir 5 minutos */}
      <button
        type="button"
        onClick={handleDecrease}
        disabled={value <= min}
        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-extrabold text-xs transition-colors flex items-center justify-center cursor-pointer shadow-2xs border border-slate-300"
        title="Diminuir 5 minutos"
      >
        <span className="text-[11px]">-5m</span>
      </button>

      {/* Input numérico direto */}
      <div className="relative">
        <input
          type="number"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-14 sm:w-16 px-1.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-black text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <span className="text-xs text-slate-500 font-semibold hidden sm:inline">min</span>

      {/* Botão lateral direito para aumentar 5 minutos */}
      <button
        type="button"
        onClick={handleIncrease}
        disabled={value >= max}
        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-extrabold text-xs transition-colors flex items-center justify-center cursor-pointer shadow-2xs border border-slate-300"
        title="Aumentar 5 minutos"
      >
        <span className="text-[11px]">+5m</span>
      </button>
    </div>
  );
};
