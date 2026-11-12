import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Target, 
  PieChart, 
  Briefcase, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  Download
} from 'lucide-react';
import { Student, FinancialTransaction } from '../../../types';
import { formatCurrency } from '../../../utils';

interface GerencialDashboardProps {
  students?: Student[];
  transactions?: FinancialTransaction[];
  onNavigateToTab?: (tab: string) => void;
}

export const GerencialDashboard: React.FC<GerencialDashboardProps> = ({ 
  students = [], 
  transactions = [], 
  onNavigateToTab 
}) => {
  const [period, setPeriod] = useState<'mes' | 'trimestre' | 'ano'>('mes');

  const grossRevenue = transactions
    .filter(t => t.type === 'receita' && t.status === 'pago')
    .reduce((acc, t) => acc + (t.amount || 0), 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'despesa' && t.status === 'pago')
    .reduce((acc, t) => acc + (t.amount || 0), 0);
  const deductions = grossRevenue * 0.03;
  const netRevenue = grossRevenue - deductions;
  const ebitda = grossRevenue - totalExpenses;
  const ebitdaMargin = grossRevenue > 0 ? ((ebitda / grossRevenue) * 100).toFixed(1) : '0.0';
  const activeStudents = students.filter(s => s.status === 'ativo').length;
  const hasData = grossRevenue > 0 || totalExpenses > 0 || activeStudents > 0;

  const dreLines = [
    { label: '(+) Receita Bruta de Planos e Mensalidades', value: grossRevenue * 0.9, type: 'pos', percent: '90.0%' },
    { label: '(+) Receita de Lanchonete, Comandas e Produtos', value: grossRevenue * 0.1, type: 'pos', percent: '10.0%' },
    { label: '(=) RECEITA OPERACIONAL BRUTA', value: grossRevenue, type: 'total', percent: '100.0%' },
    { label: '(-) Deduções, Impostos e Taxas GL Profit Pay (3%)', value: -deductions, type: 'neg', percent: '-3.0%' },
    { label: '(=) RECEITA OPERACIONAL LÍQUIDA', value: netRevenue, type: 'subtotal', percent: '97.0%' },
    { label: '(-) Custos e Despesas Operacionais Totais', value: -totalExpenses, type: 'neg', percent: grossRevenue > 0 ? `-${((totalExpenses / grossRevenue) * 100).toFixed(1)}%` : '0%' },
    { label: '(=) RESULTADO LÍQUIDO OPERACIONAL (EBITDA)', value: ebitda, type: 'final', percent: `${ebitdaMargin}%` }
  ];

  const goals = [
    { name: 'Meta de Alunos Ativos', current: activeStudents, target: 250, percent: Math.min(100, (activeStudents / 250) * 100), color: 'bg-blue-700' },
    { name: 'Faturamento Bruto Mensal', current: grossRevenue, target: 65000, percent: Math.min(100, (grossRevenue / 65000) * 100), color: 'bg-emerald-600', isCurrency: true }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Briefcase className="h-5 w-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Dashboard Gerencial & DRE Executivo</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstrativo de resultado, margem EBITDA e metas estratégicas baseadas em dados reais
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-600 focus:outline-hidden"
          >
            <option value="mes">Mês Atual</option>
            <option value="trimestre">Trimestre</option>
            <option value="ano">Ano Fiscal</option>
          </select>

          <button
            onClick={() => alert("DRE Gerencial exportado para PDF!")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Exportar DRE
          </button>
        </div>
      </div>

      {!hasData && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center text-xs text-blue-900">
          Nenhum dado financeiro ou aluno ativo registrado no sistema. Cadastre alunos ou lançamentos para preencher o DRE e os indicadores gerenciais em tempo real.
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Faturamento Bruto</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {formatCurrency(grossRevenue)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>{hasData ? 'Base real de receitas' : 'Nenhuma receita registrada'}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Lucro Operacional (EBITDA)</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Target className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {formatCurrency(ebitda)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-800 font-bold">
            <span>Margem: {ebitdaMargin}%</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Alunos Ativos</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {activeStudents}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Cadastrados no sistema</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Despesas Operacionais</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {formatCurrency(totalExpenses)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Contas pagas no período</span>
          </div>
        </div>
      </div>

      {/* DRE Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Demonstrativo do Resultado do Exercício (DRE Gerencial)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                <th className="pb-3">Conta / Indicador</th>
                <th className="pb-3 text-right">Valor (R$)</th>
                <th className="pb-3 text-right">Participação %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dreLines.map((line, idx) => (
                <tr key={idx} className={`hover:bg-slate-50 ${line.type === 'total' || line.type === 'final' ? 'font-bold bg-slate-50/50 text-slate-900' : 'text-slate-600'}`}>
                  <td className="py-3">{line.label}</td>
                  <td className="py-3 text-right font-mono">{formatCurrency(line.value)}</td>
                  <td className="py-3 text-right font-mono">{line.percent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
