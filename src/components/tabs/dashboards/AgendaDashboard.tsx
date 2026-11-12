import React, { useState } from 'react';
import { Calendar, Users, TrendingUp, ChevronRight } from 'lucide-react';
import { ClassSession } from '../../../types';

interface AgendaDashboardProps {
  classes?: ClassSession[];
  onNavigateToTab?: (tab: string) => void;
}

export const AgendaDashboard: React.FC<AgendaDashboardProps> = ({ classes = [], onNavigateToTab }) => {
  const totalClasses = classes.length;
  const totalEnrolled = classes.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0);
  const totalCapacity = classes.reduce((acc, c) => acc + (c.capacity || 0), 0);
  const occupancyRate = totalCapacity > 0 ? ((totalEnrolled / totalCapacity) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Calendar className="h-5 w-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Dashboard de Agenda & Aulas Coletivas</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Ocupação das salas de aula e turmas baseado na base real</p>
        </div>

        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('agenda')}
            className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3.5 py-1.5 transition-colors shadow-xs cursor-pointer"
          >
            Ver Grade <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {totalClasses === 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center text-xs text-blue-900">
          Nenhuma aula ou sessão cadastrada na agenda. Cadastre turmas na aba Agenda para acompanhar a ocupação em tempo real.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Turmas Cadastradas</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{totalClasses}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Alunos Inscritos</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{totalEnrolled}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Taxa de Ocupação</div>
          <div className="mt-2 text-2xl font-black text-slate-900">{occupancyRate}%</div>
        </div>
      </div>
    </div>
  );
};
