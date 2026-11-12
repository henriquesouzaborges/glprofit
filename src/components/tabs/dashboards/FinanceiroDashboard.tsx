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

export const FinanceiroDashboard: React.FC<FinanceiroDashboardProps> = ({ transactions = [], onNavigateToTab }) => {
  const [period, setPeriod] = useState<'mes' | 'trimestre' | 'ano'>('mes');

  const paidTransactions = transactions.filter(t => t.type === 'receita' && t.status === 'pago');
  const pendingTransactions = transactions.filter(t => t.type === 'receita' && t.status === 'pendente');
  const overdueTransactions = transactions.filter(t => t.type === 'receita' && t.status === 'vencido');

  const totalBilling = paidTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const toReceive = pendingTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const overdueAmount = overdueTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const avgTicket = paidTransactions.length > 0 ? totalBilling / paidTransactions.length : 0;

  const pixTotal = paidTransactions.filter(t => t.paymentMethod === 'pix').reduce((acc, t) => acc + t.amount, 0);
  const cardTotal = paidTransactions.filter(t => t.paymentMethod?.includes('cartao') || t.paymentMethod === 'boleto').reduce((acc, t) => acc + t.amount, 0);
  const cashTotal = paidTransactions.filter(t => t.paymentMethod === 'dinheiro').reduce((acc, t) => acc + t.amount, 0);

  const paymentMethods = [
    { method: 'Cartão / Recorrência', percent: totalBilling > 0 ? Math.round((cardTotal / totalBilling) * 100) : 0, amount: cardTotal, icon: CreditCard, color: 'bg-blue-700' },
    { method: 'PIX Instantâneo', percent: totalBilling > 0 ? Math.round((pixTotal / totalBilling) * 100) : 0, amount: pixTotal, icon: QrCode, color: 'bg-emerald-600' },
    { method: 'Dinheiro em Espécie', percent: totalBilling > 0 ? Math.round((cashTotal / totalBilling) * 100) : 0, amount: cashTotal, icon: DollarSign, color: 'bg-amber-500' }
  ];

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
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3.5 py-1.5 transition-colors shadow-xs cursor-pointer"
            >
              Lançamentos & Contas <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {transactions.length === 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center text-xs text-blue-900">
          Nenhuma transação financeira registrada no sistema. Cadastre receitas ou despesas na aba Financeiro para preencher o dashboard e o fluxo de caixa.
        </div>
      )}

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
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Receitas pagas no período</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>A Receber</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Calendar className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {formatCurrency(toReceive)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Contas pendentes</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Inadimplência</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <AlertCircle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-red-600">
            {formatCurrency(overdueAmount)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Títulos vencidos</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Ticket Médio</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <CreditCard className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {formatCurrency(avgTicket)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Por recebimento</span>
          </div>
        </div>
      </div>
    </div>
  );
};
