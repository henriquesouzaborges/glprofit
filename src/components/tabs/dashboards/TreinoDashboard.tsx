import React, { useState } from 'react';
import { 
  Dumbbell, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  TrendingUp, 
  Award, 
  Smartphone,
  UserCheck
} from 'lucide-react';

interface TreinoDashboardProps {
  onNavigateToTab?: (tab: string) => void;
}

export const TreinoDashboard: React.FC<TreinoDashboardProps> = ({ onNavigateToTab }) => {
  const [period, setPeriod] = useState<'mes' | 'ano'>('mes');

  const activeWorkouts = 198;
  const completedSessions = 3480;
  const physicalAssessments = 24;
  const outdatedWorkouts = 16; // > 60 days without revision

  const goals = [
    { name: 'Hipertrofia Muscular & Ganho de Massa', percent: 48, students: 97, color: 'bg-blue-700' },
    { name: 'Emagrecimento & Definição', percent: 32, students: 65, color: 'bg-red-600' },
    { name: 'Saúde, Postura & Condicionamento Geral', percent: 15, students: 30, color: 'bg-emerald-600' },
    { name: 'Reabilitação & Fortalecimento Articular', percent: 5, students: 10, color: 'bg-amber-500' }
  ];

  const routines = [
    { type: 'Divisão ABC (Peito/Tríceps, Costas/Bíceps, Pernas/Ombros)', percent: 56 },
    { type: 'Divisão ABCD / ABCDE (Treino Avançado com Isolados)', percent: 26 },
    { type: 'Treino Funcional & Circuito de Alta Intensidade', percent: 12 },
    { type: 'Treino de Adaptação / Iniciante (Full Body)', percent: 6 }
  ];

  const pendingAssessments = [
    { name: 'Gabriel Sampaio', daysSinceUpdate: 74, instructor: 'Prof. Carlos Silva', objective: 'Hipertrofia' },
    { name: 'Patricia Alcantara', daysSinceUpdate: 68, instructor: 'Profa. Mariana Souza', objective: 'Emagrecimento' },
    { name: 'Marcos Vinicius', daysSinceUpdate: 65, instructor: 'Prof. Lucas Mendes', objective: 'Condicionamento' },
    { name: 'Renata Fraga', daysSinceUpdate: 62, instructor: 'Prof. Carlos Silva', objective: 'Definição' }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Dumbbell className="h-5 w-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Dashboard de Treinos & Prescrição</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Adesão dos alunos às fichas, sessões concluídas no App, avaliações físicas e metas
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('treino')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3.5 py-1.5 transition-colors shadow-xs"
            >
              Prescrever Treino <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Fichas Ativas no App</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Smartphone className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {activeWorkouts}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="h-3 w-3" />
            98.0% dos alunos usam o App do Aluno
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Treinos Concluídos no Mês</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {completedSessions}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <span>Média de 3.8 treinos/semana por aluno</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Avaliações Físicas Realizadas</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Activity className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {physicalAssessments}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-700 font-medium">
            <span>Bioimpedância & Dobras Cutâneas</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Fichas Vencidas (&gt; 60 dias)</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <AlertCircle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-red-600">
            {outdatedWorkouts}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-red-600 font-semibold">
            <span>Precisam de troca de estímulo/periodização</span>
          </div>
        </div>
      </div>

      {/* Objectives & Routine Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Objectives (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Objetivos dos Alunos da VB SPORT</h3>
              <p className="text-[11px] text-slate-500">Mapeamento para direcionamento de campanhas e compras de anilhas/equipamentos</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {goals.map((g) => (
              <div key={g.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{g.name}</span>
                  <span className="font-mono font-bold text-slate-900">{g.students} alunos ({g.percent}%)</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${g.color}`} style={{ width: `${g.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-900 leading-relaxed">
            <strong>Insight dos Instrutores:</strong> 80% dos alunos têm como foco Hipertrofia e Emagrecimento, demandando programas de sobrecarga progressiva bem documentados no aplicativo.
          </div>
        </div>

        {/* Fichas Vencendo / Alunos Precisando de Troca (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Troca de Ficha Pendente</h3>
              <p className="text-[11px] text-slate-500">Alunos com mais de 60 dias sem novo treino</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              Urgente
            </span>
          </div>

          <div className="space-y-2.5">
            {pendingAssessments.map((p) => (
              <div key={p.name} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500">{p.instructor} • {p.objective}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-red-600 font-bold text-[11px]">{p.daysSinceUpdate} dias</span>
                  <button 
                    onClick={() => alert(`Notificação enviada ao ${p.instructor} para renovar o treino de ${p.name}.`)}
                    className="block text-[10px] text-blue-700 font-bold hover:underline mt-0.5"
                  >
                    Avisar Prof.
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              onClick={() => alert("Relatório de periodização enviado por e-mail para a equipe de musculação.")}
              className="text-xs font-bold text-blue-700 hover:underline"
            >
              Exportar Lista Completa de Periodização
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
