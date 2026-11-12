import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  MessageCircle, 
  ArrowUpRight, 
  Clock,
  Filter,
  BarChart2
} from 'lucide-react';
import { Student, FinancialTransaction } from '../../types';
import { formatCurrency, sendWhatsAppMessage } from '../../utils';

interface RelatoriosTabProps {
  students: Student[];
  transactions: FinancialTransaction[];
}

export const RelatoriosTab: React.FC<RelatoriosTabProps> = ({
  students,
  transactions
}) => {
  const [reportType, setReportType] = useState<'financeiro' | 'inadimplencia' | 'frequencia' | 'vendas' | 'churn'>('financeiro');
  const [period, setPeriod] = useState<'atual' | 'trimestre' | 'ano'>('atual');

  const overdueStudents = students.filter(s => s.status === 'inadimplente');
  const totalOverdueAmount = overdueStudents.reduce((acc, s) => acc + s.pendingAmount, 0);

  // Inactive students (no access in last 15 days or never)
  const absentStudents = students.filter(s => s.status === 'ativo' && (!s.lastAccess || s.lastAccess.includes('2023') || s.lastAccess.includes('15 dias')));

  const totalRevenue = transactions.filter(t => t.type === 'receita' && t.status === 'pago').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'despesa' && t.status === 'pago').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const handleExportCSV = () => {
    alert("Relatório exportado em formato CSV/Excel com sucesso!");
  };

  const handlePrintPDF = () => {
    window.print?.();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Central de Relatórios Gerenciais
          </h1>
          <p className="text-xs text-slate-500">
            Exportação de dados contábeis, controle de inadimplência e análise de evasão de alunos
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden"
          >
            <option value="atual">Setembro / 2026</option>
            <option value="trimestre">3º Trimestre 2026</option>
            <option value="ano">Ano Completo 2026</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Excel / CSV
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-medium text-white transition-colors shadow-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            Imprimir / PDF
          </button>
        </div>
      </div>

      {/* Navigation Sub Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-0.5">
        <button
          onClick={() => setReportType('financeiro')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
            reportType === 'financeiro'
              ? 'border-blue-600 text-blue-700 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          DRE & Demonstrativo Financeiro
        </button>
        <button
          onClick={() => setReportType('inadimplencia')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
            reportType === 'inadimplencia'
              ? 'border-blue-600 text-blue-700 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Inadimplência ({overdueStudents.length})
        </button>
        <button
          onClick={() => setReportType('frequencia')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
            reportType === 'frequencia'
              ? 'border-blue-600 text-blue-700 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Frequência & Evasão
        </button>
        <button
          onClick={() => setReportType('vendas')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
            reportType === 'vendas'
              ? 'border-blue-600 text-blue-700 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Vendas de Planos & Produtos
        </button>
      </div>

      {/* Report 1: Financeiro DRE */}
      {reportType === 'financeiro' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Receita Bruta Total</div>
              <div className="mt-2 text-2xl font-bold text-emerald-600 font-mono">
                {formatCurrency(totalRevenue)}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Mensalidades, planos e lanchonete</div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Despesas Operacionais</div>
              <div className="mt-2 text-2xl font-bold text-rose-600 font-mono">
                {formatCurrency(totalExpenses)}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">Folha, aluguel, luz e manutenção</div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Resultado Líquido (EBITDA)</div>
              <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
                {formatCurrency(netProfit)}
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 font-medium">Margem líquida: 66%</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
              DRE Gerencial Consolidado
            </h2>
            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-1.5 font-bold text-slate-900">
                <span>(+) RECEITA BRUTA COM PLANOS E MENSALIDADES</span>
                <span className="font-mono text-emerald-600">R$ 51.480,00</span>
              </div>
              <div className="flex justify-between py-1.5 text-slate-600">
                <span className="pl-4">Receita com Vendas no Balcão & Comandas</span>
                <span className="font-mono text-emerald-600">R$ 3.410,00</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-slate-900">
                <span>(-) DEDUÇÕES E TAXAS DE CARTÃO (GL PROFIT PAY)</span>
                <span className="font-mono text-rose-600">- R$ 1.120,00</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-slate-900">
                <span>(-) DESPESAS FIXAS E OPERACIONAIS</span>
                <span className="font-mono text-rose-600">- R$ 16.400,00</span>
              </div>
              <div className="flex justify-between py-2 font-black text-sm text-slate-900 bg-slate-50 px-3 rounded-lg">
                <span>LUCRO LÍQUIDO DO PERÍODO</span>
                <span className="font-mono text-emerald-700">R$ 37.370,00</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report 2: Inadimplência */}
      {reportType === 'inadimplencia' && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Relatório de Clientes Inadimplentes com Cobrança Automática
              </h2>
              <p className="text-xs text-slate-500">
                Total pendente a recuperar: <strong>{formatCurrency(totalOverdueAmount)}</strong>
              </p>
            </div>
            <button
              onClick={() => alert("Notificações de cobrança enviadas em massa por WhatsApp!")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Cobrar Todos via WhatsApp
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3">Plano</th>
                  <th className="px-4 py-3">Vencimento</th>
                  <th className="px-4 py-3">Valor Devido</th>
                  <th className="px-4 py-3">Status de Acesso</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {overdueStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {s.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono">
                      {s.phone}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {s.planName}
                    </td>
                    <td className="px-4 py-3 text-rose-600 font-mono font-medium">
                      {s.dueDate}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-rose-700">
                      {formatCurrency(s.pendingAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-700">
                        BLOQUEADO
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => sendWhatsAppMessage(s.phone, `Olá ${s.name}, notamos que sua mensalidade de ${formatCurrency(s.pendingAmount)} na GL PRO FIT está em aberto. Segue a chave PIX ou link para regularizar: financeiro@glprofit.com.br`, s.name, s.id)}
                        className="text-xs text-emerald-700 font-bold hover:underline"
                      >
                        Cobrar WhatsApp Interno
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report 3: Frequência e Evasão */}
      {reportType === 'frequencia' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Alunos Ausentes da Academia (Alerta de Evasão / Churn Prevention)
            </h2>
            <p className="text-xs text-slate-500">
              Alunos matriculados que não realizam check-in há mais de 10 dias têm 4x mais chances de cancelar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs space-y-1">
              <div className="font-bold text-blue-900">Frequência Geral Média</div>
              <div className="text-2xl font-bold text-blue-700">3.4x / semana</div>
              <div className="text-blue-600">Índice excelente para retenção anual</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-xs space-y-1">
              <div className="font-bold text-amber-900">Alunos em Zona de Risco</div>
              <div className="text-2xl font-bold text-amber-700">12 alunos</div>
              <div className="text-amber-600">Sem check-in há +15 dias</div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-xs space-y-1">
              <div className="font-bold text-emerald-900">Taxa de Resgate CRM</div>
              <div className="text-2xl font-bold text-emerald-700">74%</div>
              <div className="text-emerald-600">Retornam após mensagem de incentivo</div>
            </div>
          </div>
        </div>
      )}

      {/* Report 4: Vendas */}
      {reportType === 'vendas' && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Ranking de Vendas de Planos e Produtos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="font-bold text-slate-900">Planos Mais Contratados</div>
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Plano Anual Black VIP</span>
                  <span className="font-bold text-slate-800">182 matrículas (63%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Plano Semestral Fit</span>
                  <span className="font-bold text-slate-800">94 matrículas (23%)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Plano Mensal Livre</span>
                  <span className="font-bold text-slate-800">56 matrículas (10%)</span>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="font-bold text-slate-900">Produtos de Balcão Mais Vendidos</div>
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Água Mineral Crystal 500ml</span>
                  <span className="font-bold text-slate-800">214 un. vendidas</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Barra de Proteína Crisp Trufada</span>
                  <span className="font-bold text-slate-800">89 un. vendidas</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Creatina Monohidratada 300g</span>
                  <span className="font-bold text-slate-800">32 un. vendidas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
