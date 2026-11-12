import React, { useState } from 'react';
import { Dumbbell, Activity, CheckCircle2, ChevronRight } from 'lucide-react';
import { WorkoutPlan, Student } from '../../../types';

interface TreinoDashboardProps {
  workouts?: WorkoutPlan[];
  students?: Student[];
  onNavigateToTab?: (tab: string) => void;
}

export const TreinoDashboard: React.FC<TreinoDashboardProps> = ({ workouts = [], students = [], onNavigateToTab }) => {
  const activeWorkouts = workouts.length;
  const totalStudents = students.length;

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Dumbbell className="h-5 w-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Dashboard de Treinos & Prescrição</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Adesão dos alunos às fichas e prescrições baseadas na base real</p>
        </div>

        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('treino')}
            className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3.5 py-1.5 transition-colors shadow-xs cursor-pointer"
          >
            Prescrever Treino <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {activeWorkouts === 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center text-xs text-blue-900">
          Nenhuma ficha de treino ativa cadastrada. Prescreva treinos na aba Treinos para acompanhar a adesão em tempo real.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Fichas de Treino Ativas</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{activeWorkouts}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Alunos Cadastrados</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{totalStudents}</div>
        </div>
      </div>
    </div>
  );
};
