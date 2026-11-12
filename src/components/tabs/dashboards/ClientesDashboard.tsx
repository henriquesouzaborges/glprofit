import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  AlertTriangle, 
  TrendingUp, 
  MessageCircle, 
  Cake, 
  PieChart, 
  ChevronRight,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { Student } from '../../../types';
import { formatCurrency } from '../../../utils';

interface ClientesDashboardProps {
  students?: Student[];
  onNavigateToTab?: (tab: string) => void;
}

export const ClientesDashboard: React.FC<ClientesDashboardProps> = ({ students = [], onNavigateToTab }) => {
  const [filterPlan, setFilterPlan] = useState<string>('todos');

  const totalRegistered = students.length;
  const activeCount = students.filter(s => s.status === 'ativo').length;
  const overdueCount = students.filter(s => s.status === 'inadimplente').length;
  const frozenCount = students.filter(s => s.status === 'trancado').length;
  const churnRate = totalRegistered > 0 ? ((students.filter(s => s.status === 'cancelado').length / totalRegistered) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Users className="h-5 w-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Dashboard de Clientes & Alunos</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Retenção de alunos, risco de evasão (churn) e engajamento baseados na base real
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('clientes')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3.5 py-1.5 transition-colors shadow-xs cursor-pointer"
            >
              Ver Lista de Alunos <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {totalRegistered === 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center text-xs text-blue-900">
          Nenhum aluno cadastrado no sistema. Cadastre alunos na aba Clientes para visualizar as métricas de retenção e status em tempo real.
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Alunos Ativos</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <UserCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {activeCount}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>De {totalRegistered} alunos totais</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Alunos Inadimplentes</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {overdueCount}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Pagamentos pendentes</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Alunos Trancados</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <UserX className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {frozenCount}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Contratos congelados</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Taxa de Churn (Evasão)</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {churnRate}%
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Cancelamentos no período</span>
          </div>
        </div>
      </div>

      {/* Students Table or Empty State */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Alunos Recentes Cadastrados</h3>
        {students.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">Nenhum aluno encontrado na base de dados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Nome</th>
                  <th className="pb-3">Plano</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Vencimento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.slice(0, 5).map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-3 font-semibold text-slate-900">{s.name}</td>
                    <td className="py-3 text-slate-600">{s.planName}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'ativo' ? 'bg-emerald-50 text-emerald-700' :
                        s.status === 'inadimplente' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {s.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-600">{s.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
