import React, { useState } from 'react';
import { 
  CreditCard, 
  QrCode, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  ArrowUpRight, 
  ShieldCheck, 
  Smartphone, 
  HelpCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Percent
} from 'lucide-react';
import { PayRecurringCharge, PaymentLink, Student } from '../../types';
import { formatCurrency } from '../../utils';

interface VbSportPayTabProps {
  recurringCharges?: PayRecurringCharge[];
  paymentLinks?: PaymentLink[];
  students?: Student[];
  onAddPaymentLink?: (link: PaymentLink) => void;
  onAddRecurringCharge?: (charge: PayRecurringCharge) => void;
  onCancelRecurring?: (id: string) => void;
  onRetryRecurring?: (id: string) => void;
  onCreatePaymentLink?: (link: PaymentLink) => void;
}

export const VbSportPayTab: React.FC<VbSportPayTabProps> = ({
  recurringCharges = [],
  paymentLinks = [],
  students = [],
  onAddPaymentLink,
  onAddRecurringCharge,
  onCancelRecurring,
  onRetryRecurring,
  onCreatePaymentLink
}) => {
  const [activeTab, setActiveTab] = useState<'recorrencia' | 'links' | 'pix' | 'maquininha'>('recorrencia');
  const [showNewLinkModal, setShowNewLinkModal] = useState(false);
  const [showNewRecurModal, setShowNewRecurModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Form states for link
  const [linkTitle, setLinkTitle] = useState('');
  const [linkAmount, setLinkAmount] = useState('119.90');
  const [linkPlan, setLinkPlan] = useState('Plano Anual Black VIP');

  // Form states for recurring
  const [recurStudentId, setRecurStudentId] = useState(students?.[0]?.id || '');
  const [recurAmount, setRecurAmount] = useState('119.90');
  const [recurCardMasked, setRecurCardMasked] = useState('•••• 5521');

  const totalMonthlyRecurring = recurringCharges
    .filter(r => r.status === 'ativa')
    .reduce((acc, r) => acc + r.amount, 0) + 21450.00;

  const handleCopy = (url: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTitle) return;
    const newL: PaymentLink = {
      id: `pl-${Date.now()}`,
      title: linkTitle,
      amount: Number(linkAmount),
      url: `https://pay.glprofit.com.br/${linkTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      planOrProductName: linkPlan,
      expiresAt: '30/09/2026',
      status: 'ativo',
      clicksCount: 0
    };
    onAddPaymentLink(newL);
    setShowNewLinkModal(false);
    setLinkTitle('');
  };

  const handleCreateRecurring = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === recurStudentId);
    if (!student) return;
    const newR: PayRecurringCharge = {
      id: `rc-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      amount: Number(recurAmount),
      frequency: 'mensal',
      cardNumberMasked: recurCardMasked,
      cardBrand: 'mastercard',
      nextChargeDate: '10/10/2026',
      status: 'ativa',
      lastChargeStatus: 'sucesso'
    };
    onAddRecurringCharge(newR);
    setShowNewRecurModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-800 text-white font-black text-xs shadow-xs border border-blue-900">
                GL
              </span>
              GL Profit Pay
            </h1>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              Gateway Recorrente Oficial
            </span>
            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
              Simulado — ambiente de testes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cobrança recorrente sem comprometer o limite do cartão do aluno, PIX dinâmico e links de pagamento
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowNewLinkModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <LinkIcon className="h-3.5 w-3.5 text-slate-500" />
            Criar Link de Pagamento
          </button>
          <button
            onClick={() => setShowNewRecurModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 px-4 py-2 text-xs font-medium text-white transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Nova Recorrência
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Faturamento Recorrente</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <CreditCard className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalMonthlyRecurring)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>182 contratos no débito automático</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Taxa de Aprovação</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            98.4%
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
            <span>Retentativas automáticas inteligentes</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Links Ativos</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <LinkIcon className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {paymentLinks.length}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-600 font-medium">
            <span>111 cliques acumulados</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>PIX Instantâneo</span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <QrCode className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            Taxa Zero
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-teal-700 font-medium">
            <span>Regularização imediata de acesso</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('recorrencia')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'recorrencia'
              ? 'border-blue-700 text-blue-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Cobrança Recorrente ({recurringCharges.length})
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'links'
              ? 'border-blue-700 text-blue-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Links de Pagamento ({paymentLinks.length})
        </button>
        <button
          onClick={() => setActiveTab('pix')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'pix'
              ? 'border-blue-700 text-blue-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          PIX Dinâmico com QR Code
        </button>
        <button
          onClick={() => setActiveTab('maquininha')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'maquininha'
              ? 'border-blue-700 text-blue-800 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Maquininha Smart POS
        </button>
      </div>

      {/* Recorrência Table */}
      {activeTab === 'recorrencia' && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Alunos com Cobrança Automática Ativa
              </h2>
              <p className="text-xs text-slate-500">
                O valor é debitado mensalmente no cartão do aluno sem comprometer o limite do ano inteiro.
              </p>
            </div>
            <span className="rounded-full bg-blue-50 text-blue-800 text-[11px] font-medium px-2.5 py-1 border border-blue-200">
              Total de Contratos Recorrentes: 182
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Cartão</th>
                  <th className="px-4 py-3">Valor / Ciclo</th>
                  <th className="px-4 py-3">Próximo Débito</th>
                  <th className="px-4 py-3">Situação</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recurringCharges.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {rec.studentName}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                      {rec.cardBrand.toUpperCase()} {rec.cardNumberMasked}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {formatCurrency(rec.amount)} / {rec.frequency}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {rec.nextChargeDate}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        rec.status === 'ativa'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                      }`}>
                        {rec.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => alert(`Cobrança de teste simulada para ${rec.studentName}. Sucesso!`)}
                        className="text-xs text-blue-700 font-medium hover:underline cursor-pointer"
                      >
                        Cobrar agora
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Links */}
      {activeTab === 'links' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentLinks.map((link) => (
              <div key={link.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                      Link Ativo
                    </span>
                    <span className="text-xs text-slate-400">
                      {link.clicksCount} cliques
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2">
                    {link.title}
                  </h3>
                  <div className="text-xs text-blue-700 font-semibold mt-1">
                    {formatCurrency(link.amount)}
                  </div>
                  <div className="mt-2 text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg truncate border border-slate-100">
                    {link.url}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleCopy(link.url)}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copiedLink === link.url ? 'Copiado!' : 'Copiar Link'}
                  </button>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Testar <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PIX Dinâmico Tab */}
      {activeTab === 'pix' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <QrCode className="h-6 w-6 text-teal-600" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Chave PIX e Conciliação Instantânea
              </h2>
              <p className="text-xs text-slate-500">
                Quando o aluno paga pelo QR Code gerado pelo GL Profit Pay, a regularização do plano ocorre em menos de 3 segundos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
                <div className="font-semibold text-teal-900">Chave PIX Oficial Registrada:</div>
                <div className="font-mono font-bold text-teal-800 text-sm mt-1">financeiro@glprofit.com.br</div>
                <div className="text-[11px] text-teal-700 mt-1">Banco Santander • Ag 0341 • Conta 10928-2</div>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                <li>Baixa imediata no caixa financeiro</li>
                <li>Envio automático de comprovante por WhatsApp</li>
                <li>Sem taxa de TED ou emissão de boleto</li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="h-36 w-36 bg-white p-2 rounded-lg border border-slate-200 shadow-xs flex items-center justify-center">
                <QrCode className="h-28 w-28 text-slate-800" />
              </div>
              <span className="text-[11px] font-mono text-slate-500 mt-2">QR Code Estático Recepção</span>
            </div>
          </div>
        </div>
      )}

      {/* Maquininha POS Tab */}
      {activeTab === 'maquininha' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <Smartphone className="h-6 w-6 text-blue-700" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Maquininha Smart POS Integrada ao Sistema
              </h2>
              <p className="text-xs text-slate-500">
                O valor da venda no balcão vai direto para a maquininha sem necessidade de digitar o valor manualmente.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900">Terminal Balcão 01</div>
              <div className="text-slate-500 font-mono text-[11px]">Serial: GL-POS-98124</div>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700 text-[10px] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Conectada
              </span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900">Terminal Lanchonete / Comandas</div>
              <div className="text-slate-500 font-mono text-[11px]">Serial: GL-POS-44012</div>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700 text-[10px] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Conectada
              </span>
            </div>
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-white p-4 flex flex-col items-center justify-center text-center">
              <button
                onClick={() => alert("Solicitação de novo terminal Smart POS enviada ao consultor GL PRO FIT.")}
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                + Solicitar Nova Maquininha
              </button>
              <span className="text-[10px] text-slate-400 mt-1">Taxas reduzidas para academias</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar Link */}
      {showNewLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Criar Novo Link de Pagamento
              </h2>
              <button onClick={() => setShowNewLinkModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateLink} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Título do Link ou Campanha *</label>
                <input
                  type="text"
                  required
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="Ex: Matrícula Black Friday Anual"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={linkAmount}
                    onChange={(e) => setLinkAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Plano Associado</label>
                  <select
                    value={linkPlan}
                    onChange={(e) => setLinkPlan(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="Plano Anual Black VIP">Plano Anual Black VIP</option>
                    <option value="Plano Semestral Fit">Plano Semestral Fit</option>
                    <option value="Plano Mensal Livre">Plano Mensal Livre</option>
                    <option value="Passaporte Diária">Passaporte Diária</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewLinkModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 shadow-xs"
                >
                  Gerar Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nova Recorrência */}
      {showNewRecurModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Cadastrar Nova Cobrança Recorrente
              </h2>
              <button onClick={() => setShowNewRecurModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateRecurring} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Selecionar Aluno *</label>
                <select
                  value={recurStudentId}
                  onChange={(e) => setRecurStudentId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 font-medium focus:border-blue-600 focus:outline-hidden"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code}) - {s.planName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Valor Mensal (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={recurAmount}
                    onChange={(e) => setRecurAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Final Cartão</label>
                  <input
                    type="text"
                    value={recurCardMasked}
                    onChange={(e) => setRecurCardMasked(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewRecurModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 shadow-xs"
                >
                  Ativar Recorrência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const GlProfitPayTab = VbSportPayTab;
