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

export const CrmDashboard: React.FC<CrmDashboardProps> = ({ leads, onNavigateToTab }) => {
  const [period, setPeriod] = useState<'mes' | 'trimestre' | 'ano'>('mes');

  const totalLeads = 48;
  const convertedLeads = 18;
  const conversionRate = ((convertedLeads / totalLeads) * 100).toFixed(1);
  const hotLeadsCount = 12;

  const funnelSteps = [
    { stage: '1. Novos Contatos', count: 128, percent: 100, color: 'bg-blue-600', description: 'Leads captados via site, Insta e balcão' },
    { stage: '2. Visita / Exp. Agendada', count: 82, percent: 64, color: 'bg-blue-700', description: 'Agendou aula experimental gratuita' },
    { stage: '3. Compareceram à Academia', count: 64, percent: 50, color: 'bg-amber-500', description: 'Realizou o treino e conheceu o espaço' },
    { stage: '4. Em Negociação / Proposta', count: 48, percent: 37.5, color: 'bg-red-500', description: 'Apresentação de valores e planos' },
    { stage: '5. Matrículas Fechadas', count: 32, percent: 25, color: 'bg-emerald-600', description: 'Aluno ativo matriculado no sistema' }
  ];

  const leadSources = [
    { source: 'Instagram / Meta Ads', count: 58, percent: 45, conversion: '36%', roi: '5.8x' },
    { source: 'Indicação de Alunos (MGM)', count: 32, percent: 25, conversion: '52%', roi: '12.4x' },
    { source: 'Fachada & Balcão (Passantes)', count: 23, percent: 18, conversion: '40%', roi: 'Inf.' },
    { source: 'Google Maps / Busca Local', count: 15, percent: 12, conversion: '33%', roi: '4.2x' }
  ];

  const salesTeam = [
    { name: 'Gian Luca Marinho', role: 'Gerente Comercial', leads: 46, sales: 21, rate: '45.6%', revenue: 26400 },
    { name: 'Camila Santos', role: 'Consultora de Vendas', leads: 42, sales: 16, rate: '38.0%', revenue: 19800 },
    { name: 'Rafael Lima', role: 'Recepção & Vendas', leads: 40, sales: 11, rate: '27.5%', revenue: 12600 }
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
            Métricas de conversão de leads, taxa de fechamento por consultor e origens de captação
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-600 focus:outline-hidden"
          >
            <option value="mes">Setembro / 2026</option>
            <option value="trimestre">3º Trimestre 2026</option>
            <option value="ano">Ano Completo 2026</option>
          </select>

          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('crm')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3.5 py-1.5 transition-colors shadow-xs"
            >
              Abrir Kanban CRM <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Leads Captados no Mês</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {totalLeads}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="h-3 w-3" />
            +18.5% em relação a Agosto
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Taxa Geral de Conversão</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Target className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {conversionRate}%
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-700 font-medium">
            <span>Meta da Academia: 35.0% (Superada)</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Tempo Médio até Fechar</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            2.8 dias
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Do 1º contato à assinatura do plano</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Leads Quentes em Negociação</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <Flame className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {hotLeadsCount}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-red-600 font-semibold">
            <span>Potencial de R$ 14.200 em novos contratos</span>
          </div>
        </div>
      </div>

      {/* Main Funnel and Lead Sources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Visual Sales Funnel (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Funil de Vendas de Matrículas</h3>
              <p className="text-[11px] text-slate-500">Fluxo de passagem dos contatos da entrada até a matrícula</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              128 Oportunidades
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            {funnelSteps.map((step, idx) => (
              <div key={step.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-2">
                    {step.stage}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-slate-900">{step.count}</span>
                    <span className="text-slate-400 text-[11px]">({step.percent}%)</span>
                  </div>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${step.color} transition-all duration-500`}
                    style={{ width: `${step.percent}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400">
                  {step.description}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span><strong>Principal Gargalo:</strong> 22% dos agendados não comparecem à aula experimental.</span>
            <span className="text-blue-700 font-semibold">Ativar lembrete WhatsApp</span>
          </div>
        </div>

        {/* Lead Sources & ROI (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Origens de Captação</h3>
              <p className="text-[11px] text-slate-500">De onde chegam os novos alunos da academia</p>
            </div>
          </div>

          <div className="space-y-3">
            {leadSources.map((src) => (
              <div key={src.source} className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{src.source}</span>
                  <span className="font-mono font-bold text-blue-700">{src.count} leads ({src.percent}%)</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Conversão: <strong className="text-slate-800">{src.conversion}</strong></span>
                  <span>Retorno: <strong className="text-emerald-700">{src.roi}</strong></span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-blue-700 rounded-full" style={{ width: `${src.percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-red-50 p-3 border border-red-100 text-xs text-red-900">
            <strong>Destaque Comercial:</strong> A Indicação de Alunos possui a maior taxa de conversão (52%). O programa "Indique e Ganhe" é o mais eficiente.
          </div>
        </div>
      </div>

      {/* Performance by Salesperson */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Desempenho da Equipe Comercial</h3>
            <p className="text-[11px] text-slate-500">Atendimento a leads, matrículas fechadas e faturamento gerado no mês</p>
          </div>
          <span className="text-xs text-slate-500 font-medium">Total: R$ 58.800 em novos contratos</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Consultor</th>
                <th className="px-4 py-2.5">Cargo</th>
                <th className="px-4 py-2.5 text-center">Leads Atendidos</th>
                <th className="px-4 py-2.5 text-center">Vendas Fechadas</th>
                <th className="px-4 py-2.5 text-center">Taxa de Conversão</th>
                <th className="px-4 py-2.5 text-right">Faturamento Gerado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {salesTeam.map((member) => (
                <tr key={member.name} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-[10px]">
                      {(member.name || 'User').split(' ').filter(Boolean).map(n => n?.[0] || '').slice(0, 2).join('')}
                    </div>
                    {member.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{member.role}</td>
                  <td className="px-4 py-3 text-center font-mono font-medium text-slate-700">{member.leads}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-emerald-600">{member.sales}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold font-mono">
                      {member.rate}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(member.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
