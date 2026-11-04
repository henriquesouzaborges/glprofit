import React, { useState } from 'react';
import { 
  X, 
  Dumbbell, 
  Calendar, 
  User, 
  Award, 
  Clock, 
  Layers, 
  Share2, 
  Printer, 
  Edit3, 
  Copy, 
  PlayCircle,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { WorkoutPlan, Student } from '../../../types';
import { formatDate } from '../../../utils';

interface WorkoutDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: WorkoutPlan;
  student?: Student;
  onEdit?: () => void;
  onShare?: () => void;
  onClone?: () => void;
  onRun?: () => void;
}

export const WorkoutDetailsModal: React.FC<WorkoutDetailsModalProps> = ({
  isOpen,
  onClose,
  workout,
  student,
  onEdit,
  onShare,
  onClone,
  onRun
}) => {
  const [activeSplitIndex, setActiveSplitIndex] = useState(0);

  if (!isOpen) return null;

  const currentSplit = workout.splits[activeSplitIndex] || workout.splits[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  {workout.title}
                </h2>
                <span className="text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2.5 py-0.5 rounded-full">
                  {workout.level}
                </span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  Ficha Completa
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Aluno(a): <strong className="text-white font-bold">{workout.studentName}</strong> • Objetivo: {workout.objective}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Fechar janela"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-600">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span>Treinador: <strong className="text-slate-800">{workout.instructor}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Vigência: <strong className="text-slate-800">{formatDate(workout.startDate)}</strong> até <strong className="text-slate-800">{formatDate(workout.validUntil)}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Divisões: <strong className="text-slate-800">{workout.splits.length} rotinas</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                <Share2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>WhatsApp / PDF</span>
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                <span>Editar Ficha</span>
              </button>
            )}
            {onClone && (
              <button
                type="button"
                onClick={onClone}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Clonar</span>
              </button>
            )}
            {onRun && (
              <button
                type="button"
                onClick={onRun}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-xs"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                <span>Executar no App</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Split Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            {workout.splits.map((split, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSplitIndex(idx)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2.5 ${
                  activeSplitIndex === idx
                    ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400/40'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{split.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeSplitIndex === idx ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {split.exercises.length} ex
                </span>
              </button>
            ))}
          </div>

          {/* Current Split Exercises Table */}
          {currentSplit && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    {currentSplit.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentSplit.exercises.length} exercícios programados com método, volume e intervalo de recuperação
                  </p>
                </div>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                  Rotina {activeSplitIndex + 1} de {workout.splits.length}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3 text-center w-12">#</th>
                      <th className="py-3 px-4 min-w-[200px]">Exercício</th>
                      <th className="py-3 px-3">Grupo Muscular</th>
                      <th className="py-3 px-3 text-center">Séries</th>
                      <th className="py-3 px-3 text-center">Repetições</th>
                      <th className="py-3 px-3 text-center">Carga (kg)</th>
                      <th className="py-3 px-3 text-center">Descanso</th>
                      <th className="py-3 px-3">Método Avançado</th>
                      <th className="py-3 px-4 min-w-[160px]">Observações Técnicas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {currentSplit.exercises.map((ex, exIdx) => (
                      <tr key={ex.id || exIdx} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-3 text-center font-bold text-slate-400">
                          {exIdx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {ex.name}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                            {ex.muscleGroup}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-900">
                          {ex.sets}
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-slate-800">
                          {ex.reps}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-blue-700">
                          {ex.weightKg ? `${ex.weightKg} kg` : '-'}
                        </td>
                        <td className="py-3 px-3 text-center text-slate-600 font-medium">
                          {ex.restSec}s
                        </td>
                        <td className="py-3 px-3">
                          <span className="rounded-lg bg-blue-50 text-blue-800 px-2.5 py-1 text-[10px] font-bold border border-blue-100">
                            {ex.method || 'Tradicional'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 italic text-[11px]">
                          {ex.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Coach Notes */}
          {workout.notes && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
              <strong className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Orientações do Treinador:
              </strong>
              <p className="leading-relaxed pl-5 text-slate-700">
                {workout.notes}
              </p>
            </div>
          )}

          {/* Summary of other splits */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Grade Geral de Divisões desta Ficha
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {workout.splits.map((s, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveSplitIndex(idx)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    activeSplitIndex === idx 
                      ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                    <span>{s.name}</span>
                    <span className="text-[10px] font-semibold text-blue-600">{s.exercises.length} ex</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-1">
                    {s.exercises.map(e => e.name).slice(0, 3).join(', ')}{s.exercises.length > 3 ? '...' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-white flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
