import React, { useState } from 'react';
import { 
  Share2, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  PhoneCall, 
  MessageCircle, 
  ChevronRight, 
  CheckCircle2, 
  Flame, 
  Sparkles,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Lead } from '../../../types';
import { formatCurrency } from '../../../utils';

interface CrmDashboardProps {
  leads: Lead[];
  onNavigateToTab?: (tab: string) => void;
}

export const CrmDashboard: React.FC<CrmDashboardProps> = ({ leads = [], onNavigateToTab }) => {
  const [period, setPeriod] = useState<'mes' | 'trimestre' | 'ano'>('mes');

  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.stage === 'matriculado').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0';
  const hotLeadsCount = leads.filter(l => l.stage === 'negociacao' || l.stage === 'compareceu').length;

  const funnelSteps = [
    { stage: '1. Novos Contatos', count: leads.filter(l => l.stage === 'novo').length, percent: totalLeads > 0 ? (leads.filter(l => l.stage === 'novo').length / totalLeads) * 100 : 0, color: 'bg-blue-600', description: 'Leads cadastrados' },
    { stage: '2. Agendados', count: leads.filter(l => l.stage === 'agendado').length, percent: totalLeads > 0 ? (leads.filter(l => l.stage === 'agendado').length / totalLeads) * 100 : 0, color: 'bg-blue-700', description: 'Aula experimental' },
    { stage: '3. Compareceram', count: leads.filter(l => l.stage === 'compareceu').length, percent: totalLeads > 0 ? (leads.filter(l => l.stage === 'compareceu').length / totalLeads) * 100 : 0, color: 'bg-amber-500', description: 'Visita realizada' },
    { stage: '4. Negociação', count: leads.filter(l => l.stage === 'negociacao').length, percent: totalLeads > 0 ? (leads.filter(l => l.stage === 'negociacao').length / totalLeads) * 100 : 0, color: 'bg-red-500', description: 'Proposta em aberto' },
    { stage: '5. Matriculados', count: convertedLeads, percent: totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0, color: 'bg-emerald-600', description: 'Alunos convertidos' }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Share2 className="h-5 w-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Dashboard de CRM & Funil Comercial</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Métricas de conversão de leads e taxa de fechamento baseadas na base real
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('crm')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3.5 py-1.5 transition-colors shadow-xs cursor-pointer"
            >
              Abrir Kanban CRM <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {totalLeads === 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center text-xs text-blue-900">
          Nenhum lead cadastrado no CRM. Cadastre leads na aba CRM para acompanhar o funil de conversão em tempo real.
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Leads Cadastrados</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {totalLeads}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Base total de contatos</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Taxa de Conversão</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Target className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {conversionRate}%
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Leads matriculados</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Leads Quentes</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Flame className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {hotLeadsCount}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Em negociação / visita</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Matrículas Concluídas</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {convertedLeads}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Convertidos com sucesso</span>
          </div>
        </div>
      </div>

      {/* Funnel Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Funil de Vendas & Conversão</h3>
        <div className="space-y-3">
          {funnelSteps.map((step, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{step.stage}</span>
                <span className="font-mono font-bold text-slate-900">{step.count} leads</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${step.color} transition-all duration-500`} style={{ width: `${Math.max(5, step.percent)}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
