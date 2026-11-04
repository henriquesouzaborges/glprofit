import React, { useState } from 'react';
import { 
  CircleDollarSign, 
  TrendingUp, 
  CreditCard, 
  QrCode, 
  DollarSign, 
  ChevronRight, 
  Calendar, 
  ArrowDownRight, 
  ArrowUpRight,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { FinancialTransaction } from '../../../types';
import { formatCurrency } from '../../../utils';

interface FinanceiroDashboardProps {
  transactions: FinancialTransaction[];
  onNavigateToTab?: (tab: string) => void;
}

export const FinanceiroDashboard: React.FC<FinanceiroDashboardProps> = ({ transactions, onNavigateToTab }) => {
  const [period, setPeriod] = useState<'mes' | 'trimestre' | 'ano'>('mes');

  const totalBilling = 54890.00;
  const toReceive = 8920.00;
  const overdueAmount = 2450.00;
  const avgTicket = 271.73;

  const paymentMethods = [
    { method: 'Cartão Recorrente (GL Profit Pay)', percent: 68, amount: 37325.20, icon: CreditCard, color: 'bg-blue-700' },
    { method: 'PIX Instantâneo', percent: 18, amount: 9880.20, icon: QrCode, color: 'bg-emerald-600' },
    { method: 'Cartão Balcão / Maquininha Smart POS', percent: 11, amount: 6037.90, icon: CreditCard, color: 'bg-red-600' },
    { method: 'Dinheiro em Espécie', percent: 3, amount: 1646.70, icon: DollarSign, color: 'bg-amber-500' }
  ];

  const monthlyHistory = [
    { month: 'Abril', revenue: 42300, expenses: 26800 },
    { month: 'Maio', revenue: 45800, expenses: 28400 },
    { month: 'Junho', revenue: 48900, expenses: 30100 },
    { month: 'Julho', revenue: 51200, expenses: 31200 },
    { month: 'Agosto', revenue: 53100, expenses: 32600 },
    { month: 'Setembro', revenue: 54890, expenses: 33800, isCurrent: true }
  ];

  const maxRevenue = 60000;

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CircleDollarSign className="h-5 w-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Dashboard Financeiro & Fluxo de Caixa</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Receitas de planos, conciliação por método de pagamento, ticket médio e contas a receber
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('financeiro')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3.5 py-1.5 transition-colors shadow-xs"
            >
              Lançamentos & Contas <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Faturamento Realizado</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {formatCurrency(totalBilling)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="h-3 w-3" />
            +8.4% vs mês passado
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>A Receber até o Fim do Mês</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Calendar className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {formatCurrency(toReceive)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-700 font-medium">
            <span>Programado no cartão recorrente</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Inadimplência Acumulada</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <AlertCircle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-red-600">
            {formatCurrency(overdueAmount)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-red-600 font-semibold">
            <span>4.1% da receita (Sob controle)</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Ticket Médio por Aluno</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <CreditCard className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {formatCurrency(avgTicket)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Impulsionado por vendas do bar e suplementos</span>
          </div>
        </div>
      </div>

      {/* Grid: Payment channels & Monthly Evolution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Payment Channels (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Receita por Método de Pagamento</h3>
              <p className="text-[11px] text-slate-500">Divisão do volume transacionado no mês</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {paymentMethods.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.method} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5 text-slate-500" />
                      {m.method}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{m.percent}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full ${m.color}`} style={{ width: `${m.percent}%` }} />
                  </div>
                  <div className="text-right text-[10px] font-mono text-slate-400">
                    {formatCurrency(m.amount)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-900 leading-relaxed">
            <strong>Vantagem Operacional:</strong> Com o GL Profit Pay cobrando 68% no cartão de crédito recorrente, a inadimplência involuntária reduziu em 82%.
          </div>
        </div>

        {/* 6 Months Revenue Evolution (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Evolução de Faturamento (Últimos 6 Meses)</h3>
              <p className="text-[11px] text-slate-500">Comparativo entre faturamento bruto e despesas operacionais</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-blue-700 inline-block"></span> Receita</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block"></span> Despesas</span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 text-center pt-3 items-end h-56 pb-2">
            {monthlyHistory.map((m) => {
              const revHeight = (m.revenue / maxRevenue) * 100;
              const expHeight = (m.expenses / maxRevenue) * 100;

              return (
                <div key={m.month} className="flex flex-col items-center justify-end h-full gap-1">
                  <div className="w-full flex items-end justify-center gap-1 h-44">
                    {/* Revenue bar */}
                    <div 
                      className={`w-4 rounded-t-md transition-all ${
                        m.isCurrent ? 'bg-blue-700 shadow-xs' : 'bg-blue-600/80'
                      }`}
                      style={{ height: `${revHeight}%` }}
                      title={`Receita: ${formatCurrency(m.revenue)}`}
                    />
                    {/* Expense bar */}
                    <div 
                      className="w-4 rounded-t-md bg-red-400/80 transition-all"
                      style={{ height: `${expHeight}%` }}
                      title={`Despesas: ${formatCurrency(m.expenses)}`}
                    />
                  </div>
                  <div className={`text-[10px] font-bold mt-1 ${m.isCurrent ? 'text-blue-900' : 'text-slate-500'}`}>
                    {m.month.slice(0, 3)}
                  </div>
                  <div className="text-[9px] font-mono font-bold text-slate-700">
                    {(m.revenue / 1000).toFixed(0)}k
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>Margem de contribuição média: <strong>38.6%</strong></span>
            <span className="text-emerald-700 font-bold">+29.7% de receita acumulada no semestre</span>
          </div>
        </div>
      </div>
    </div>
  );
};
