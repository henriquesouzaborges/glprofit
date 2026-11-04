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
import { formatCurrency } from '../../../utils';

interface GerencialDashboardProps {
  onNavigateToTab?: (tab: string) => void;
}

export const GerencialDashboard: React.FC<GerencialDashboardProps> = ({ onNavigateToTab }) => {
  const [period, setPeriod] = useState<'mes' | 'trimestre' | 'ano'>('mes');

  // Executive Numbers
  const grossRevenue = 54890.00;
  const netRevenue = 53243.30;
  const fixedCosts = 21700.00;
  const variableCosts = 12100.00;
  const ebitda = 19443.30;
  const ebitdaMargin = ((ebitda / grossRevenue) * 100).toFixed(1);
  const cac = 42.50; // Cost of customer acquisition
  const ltv = 1840.00; // Customer lifetime value
  const activeStudents = 202;
  const breakEvenStudents = 124;

  const dreLines = [
    { label: '(+) Receita Bruta de Planos e Mensalidades', value: 49850.00, type: 'pos', percent: '90.8%' },
    { label: '(+) Receita de Lanchonete, Comandas e Produtos', value: 5040.00, type: 'pos', percent: '9.2%' },
    { label: '(=) RECEITA OPERACIONAL BRUTA', value: 54890.00, type: 'total', percent: '100.0%' },
    { label: '(-) Deduções, Impostos e Taxas GL Profit Pay (3%)', value: -1646.70, type: 'neg', percent: '-3.0%' },
    { label: '(=) RECEITA OPERACIONAL LÍQUIDA', value: 53243.30, type: 'subtotal', percent: '97.0%' },
    { label: '(-) Folha de Pagamento (Professores e Recepção)', value: -14500.00, type: 'neg', percent: '-26.4%' },
    { label: '(-) Aluguel do Imóvel e Condomínio', value: -7200.00, type: 'neg', percent: '-13.1%' },
    { label: '(-) Energia Elétrica, Água e Internet', value: -3800.00, type: 'neg', percent: '-6.9%' },
    { label: '(-) Manutenção Preventiva e Limpeza', value: -2400.00, type: 'neg', percent: '-4.4%' },
    { label: '(-) Marketing, Anúncios e Software VB SPORT', value: -1850.00, type: 'neg', percent: '-3.4%' },
    { label: '(-) CMV Produtos de Estoque', value: -4050.00, type: 'neg', percent: '-7.4%' },
    { label: '(=) RESULTADO LÍQUIDO OPERACIONAL (EBITDA)', value: 19443.30, type: 'final', percent: '35.4%' }
  ];

  const goals = [
    { name: 'Meta de Alunos Ativos', current: 202, target: 250, percent: 80.8, color: 'bg-blue-700' },
    { name: 'Faturamento Bruto Mensal', current: 54890, target: 65000, percent: 84.4, color: 'bg-emerald-600', isCurrency: true },
    { name: 'Adesão ao Plano Anual Recorrente', current: 128, target: 150, percent: 85.3, color: 'bg-red-600' },
    { name: 'Controle de Inadimplência (< 5%)', current: 3.0, target: 5.0, percent: 100, isInverse: true, color: 'bg-blue-600' }
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
            Demonstrativo de resultado, margem EBITDA, CAC/LTV e metas estratégicas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-600 focus:outline-hidden"
          >
            <option value="mes">Mês Atual (Setembro/2026)</option>
            <option value="trimestre">3º Trimestre 2026</option>
            <option value="ano">Ano Fiscal 2026</option>
          </select>

          <button
            onClick={() => alert("DRE Gerencial e Balanço exportados para PDF!")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Exportar DRE
          </button>
        </div>
      </div>

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
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="h-3 w-3" />
            +8.4% de crescimento vs mês anterior
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
            <span>Margem Saudável de {ebitdaMargin}%</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>CAC vs LTV (Retorno)</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            43.2x LTV/CAC
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>CAC: R$ 42,50 • LTV: R$ 1.840,00</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Ponto de Equilíbrio (Break-Even)</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {activeStudents} / {breakEvenStudents} alunos
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-red-600 font-semibold">
            <span>+78 alunos acima da margem de segurança</span>
          </div>
        </div>
      </div>

      {/* Grid: DRE on left (7 cols) and Strategic Goals on right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* DRE Table (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">DRE Gerencial Consolidado</h3>
              <p className="text-[11px] text-slate-500">Demonstração das receitas, custos operacionais e margens</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              Superavitário
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {dreLines.map((line, idx) => {
              const isFinal = line.type === 'final';
              const isTotal = line.type === 'total' || line.type === 'subtotal';
              const isNeg = line.type === 'neg';

              return (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between py-2 px-1 rounded-sm ${
                    isFinal ? 'bg-emerald-50/80 font-black text-emerald-900 text-sm mt-2 border border-emerald-200' :
                    isTotal ? 'bg-slate-50 font-bold text-slate-900' :
                    'text-slate-700'
                  }`}
                >
                  <span className={isFinal ? 'font-black' : isTotal ? 'font-bold' : ''}>
                    {line.label}
                  </span>
                  <div className="flex items-center gap-4 font-mono">
                    <span className="text-[10px] text-slate-400 w-12 text-right">{line.percent}</span>
                    <span className={`font-bold w-24 text-right ${
                      isFinal ? 'text-emerald-700 font-black' :
                      isNeg ? 'text-red-600' : 'text-slate-900'
                    }`}>
                      {formatCurrency(line.value)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-900 leading-relaxed">
            <strong>Análise da Controladoria:</strong> A estrutura de custos fixos representa 44.5% do faturamento, garantindo excelente alavancagem operacional para expansão da base de alunos.
          </div>
        </div>

        {/* Goals and Targets (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Metas Estratégicas 2026</h3>
              <p className="text-[11px] text-slate-500">Acompanhamento dos OKRs do VB SPORT ADM</p>
            </div>
          </div>

          <div className="space-y-4">
            {goals.map((g) => (
              <div key={g.name} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{g.name}</span>
                  <span className="font-mono font-bold text-slate-700">
                    {g.percent}%
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${g.color} transition-all duration-500`}
                    style={{ width: `${Math.min(g.percent, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Atual: <strong>{g.isCurrency ? formatCurrency(g.current) : g.current}</strong></span>
                  <span>Meta: <strong>{g.isCurrency ? formatCurrency(g.target) : g.target}</strong></span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-dashed border-red-200 bg-red-50/50 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-red-700 font-bold">
              <AlertCircle className="h-4 w-4" />
              <span>Ação Estratégica Recomendada</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Faltam apenas 48 novos alunos para atingir o teto de 250 alunos. O investimento em campanhas de WhatsApp e indicações de alunos ativos já cobre o custo marginal de aquisição.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
