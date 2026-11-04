import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Award, 
  ChevronRight, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Flame
} from 'lucide-react';

interface AgendaDashboardProps {
  onNavigateToTab?: (tab: string) => void;
}

export const AgendaDashboard: React.FC<AgendaDashboardProps> = ({ onNavigateToTab }) => {
  const [period, setPeriod] = useState<'mes' | 'semana'>('mes');

  const totalClasses = 86;
  const avgOccupancy = 84.5;
  const noShowRate = 6.2;
  const totalBookings = 1420;

  const modalities = [
    { name: 'Spinning Indoor Extreme', classes: 24, capacity: 15, avgStudents: 14.8, occupancy: 98.6, instructor: 'Prof. Carlos Silva', isMax: true },
    { name: 'Pilates Solo & Postura', classes: 18, capacity: 12, avgStudents: 10.8, occupancy: 90.0, instructor: 'Profa. Mariana Souza' },
    { name: 'Cross Training & LPO', classes: 20, capacity: 16, avgStudents: 13.6, occupancy: 85.0, instructor: 'Prof. Carlos Silva' },
    { name: 'Funcional Cardio Hiit', classes: 16, capacity: 20, avgStudents: 15.2, occupancy: 76.0, instructor: 'Prof. Lucas Mendes' },
    { name: 'Yoga Matinal & Respiração', classes: 8, capacity: 14, avgStudents: 10.1, occupancy: 72.1, instructor: 'Profa. Mariana Souza' }
  ];

  const instructors = [
    { name: 'Prof. Carlos Silva', classes: 44, checkins: 620, occupancy: '92.4%', rating: '4.9 ★' },
    { name: 'Profa. Mariana Souza', classes: 26, checkins: 380, occupancy: '84.5%', rating: '4.9 ★' },
    { name: 'Prof. Lucas Mendes', classes: 16, checkins: 420, occupancy: '78.2%', rating: '4.8 ★' }
  ];

  const crowdedTimeslots = [
    { time: '18:30 às 19:30', class: 'Spinning Indoor Extreme', status: 'Esgotado', waitingList: 4 },
    { time: '19:30 às 20:30', class: 'Cross Training & LPO', status: 'Esgotado', waitingList: 2 },
    { time: '07:00 às 08:00', class: 'Funcional Cardio Hiit', status: '95% Ocupado', waitingList: 0 },
    { time: '18:00 às 19:00', class: 'Pilates Solo', status: '92% Ocupado', waitingList: 1 }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Calendar className="h-5 w-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Dashboard de Agenda & Aulas Coletivas</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ocupação das salas de aula, no-show (ausências), instrutores e turmas mais concorridas
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('agenda')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3.5 py-1.5 transition-colors shadow-xs"
            >
              Ver Grade Semanal <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Aulas Realizadas no Mês</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Calendar className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {totalClasses} aulas
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>100% cumpridas sem cancelamento</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Taxa Média de Ocupação</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {avgOccupancy}%
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <span>Alta adesão dos alunos matriculados</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Taxa de No-Show (Faltas)</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <AlertCircle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {noShowRate}%
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Alunos que agendam e não comparecem</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Check-ins em Aulas no Mês</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {totalBookings} presenças
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-700 font-medium">
            <span>+12.4% vs mês anterior</span>
          </div>
        </div>
      </div>

      {/* Grid: Modalities & Instructors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Modalities Ocupancy (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Ocupação por Modalidade Coletiva</h3>
              <p className="text-[11px] text-slate-500">Média de vagas preenchidas por aula</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {modalities.map((mod) => (
              <div key={mod.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-2">
                    {mod.name}
                    {mod.isMax && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold flex items-center gap-0.5">
                        <Flame className="h-2.5 w-2.5" /> Campeão
                      </span>
                    )}
                  </span>
                  <span className="font-mono font-bold text-slate-900">{mod.occupancy}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      mod.occupancy > 90 ? 'bg-red-600' : 'bg-blue-700'
                    }`}
                    style={{ width: `${mod.occupancy}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Instrutor: {mod.instructor}</span>
                  <span>{mod.classes} aulas / mês • Cap. {mod.capacity} alunos</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-xs text-red-900">
            <strong>Oportunidade Comercial:</strong> A aula de Spinning das 18:30 está com lista de espera recorrente de 4 a 6 alunos. Abrir mais um horário às 20:30 geraria novas adesões imediatas.
          </div>
        </div>

        {/* Instructors & Waiting List (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Desempenho dos Professores</h3>
              <p className="text-[11px] text-slate-500">Média de ocupação e avaliações dos alunos</p>
            </div>
            <Award className="h-4 w-4 text-amber-500" />
          </div>

          <div className="space-y-2.5">
            {instructors.map((ins) => (
              <div key={ins.name} className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{ins.name}</span>
                  <span className="text-amber-600 font-mono font-bold">{ins.rating}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{ins.classes} aulas ministradas</span>
                  <span className="font-mono font-bold text-blue-800">{ins.checkins} alunos atendidos</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Turmas em Horários Críticos Hoje</h4>
            <div className="space-y-1.5 text-xs">
              {crowdedTimeslots.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                  <div>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">{c.time}</span>
                    <div className="text-[11px] text-slate-600 truncate max-w-[140px]">{c.class}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.status === 'Esgotado' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
