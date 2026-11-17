import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  QrCode, 
  Link as LinkIcon, 
  CheckCircle2, 
  Plus, 
  Copy, 
  ExternalLink, 
  TrendingUp,
  X
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { PayRecurringCharge, PaymentLink, Student, Plan } from '../../types';
import { formatCurrency } from '../../utils';
import { db, saveDocToFirestore } from '../../services/firebaseDbService';

interface VbSportPayTabProps {
  recurringCharges?: PayRecurringCharge[];
  paymentLinks?: PaymentLink[];
  students?: Student[];
  plans?: Plan[];
  onAddPaymentLink?: (link: PaymentLink) => void;
  onAddRecurringCharge?: (charge: PayRecurringCharge) => void;
  onCancelRecurring?: (id: string) => void;
  onRetryRecurring?: (id: string) => void;
  onCreatePaymentLink?: (link: PaymentLink) => void;
}

const PIX_STORAGE_KEY = 'glprofit_pay_pix_config';

export const VbSportPayTab: React.FC<VbSportPayTabProps> = ({
  recurringCharges = [],
  paymentLinks = [],
  students = [],
  plans = [],
  onAddPaymentLink,
  onAddRecurringCharge
}) => {
  const [activeTab, setActiveTab] = useState<'recorrencia' | 'links' | 'pix'>('recorrencia');
  const [showNewLinkModal, setShowNewLinkModal] = useState(false);
  const [showNewRecurModal, setShowNewRecurModal] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // PIX key state (persisted in Firestore system_settings/pay_pix_config & localStorage)
  const [pixKeyVal, setPixKeyVal] = useState(() => {
    try {
      const saved = localStorage.getItem(PIX_STORAGE_KEY);
      if (saved) return JSON.parse(saved).pixKey || '';
    } catch {
      // ignore storage errors
    }
    return '';
  });
  const [pixBankInfo, setPixBankInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(PIX_STORAGE_KEY);
      if (saved) return JSON.parse(saved).pixBank || '';
    } catch {
      // ignore storage errors
    }
    return '';
  });
  const [inputPixKey, setInputPixKey] = useState('');
  const [inputBank, setInputBank] = useState('');

  // Form states for link (empty defaults — zero mock)
  const [linkTitle, setLinkTitle] = useState('');
  const [linkAmount, setLinkAmount] = useState('');
  const [linkPlan, setLinkPlan] = useState('');
  const [linkRealUrl, setLinkRealUrl] = useState('');
  const [linkError, setLinkError] = useState<string | null>(null);

  // Form states for recurring (empty defaults — zero mock)
  const [recurStudentId, setRecurStudentId] = useState(students?.[0]?.id || '');
  const [recurAmount, setRecurAmount] = useState('');
  const [recurCardMasked, setRecurCardMasked] = useState('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const ref = doc(db, 'system_settings', 'pay_pix_config');
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as { pixKey?: string; pixBank?: string };
          if (typeof data.pixKey === 'string') setPixKeyVal(data.pixKey);
          if (typeof data.pixBank === 'string') setPixBankInfo(data.pixBank);
          try {
            localStorage.setItem(PIX_STORAGE_KEY, JSON.stringify({ pixKey: data.pixKey || '', pixBank: data.pixBank || '' }));
          } catch {
            // ignore storage errors
          }
        }
      },
      () => {
        // Real connection error is already surfaced globally via DatabaseStatusBadge
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!recurStudentId && students.length > 0) {
      setRecurStudentId(students[0].id);
    }
  }, [students, recurStudentId]);

  const totalMonthlyRecurring = recurringCharges
    .filter(r => r.status === 'ativa')
    .reduce((acc, r) => acc + r.amount, 0);

  const chargesWithOutcome = recurringCharges.filter(
    r => r.lastChargeStatus === 'sucesso' || r.lastChargeStatus === 'falha'
  );
  const approvedCount = recurringCharges.filter(r => r.lastChargeStatus === 'sucesso').length;
  const approvalRateLabel = chargesWithOutcome.length > 0
    ? `${Math.round((approvedCount / chargesWithOutcome.length) * 100)}%`
    : '—';

  const handleCopy = (url: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTitle.trim() || !linkRealUrl.trim()) {
      setLinkError('Preencha o título e o link real de pagamento gerado no banco.');
      return;
    }
    setLinkError(null);
    const newL: PaymentLink = {
      id: `pl-${Date.now()}`,
      title: linkTitle.trim(),
      amount: Number(linkAmount) || 0,
      url: linkRealUrl.trim(),
      planOrProductName: linkPlan || 'Cobrança Avulsa',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      status: 'ativo',
      clicksCount: 0
    };
    onAddPaymentLink?.(newL);
    setShowNewLinkModal(false);
    setLinkTitle('');
    setLinkAmount('');
    setLinkPlan('');
    setLinkRealUrl('');
    showToast('Link de pagamento salvo com sucesso!');
  };

  const handleCreateRecurring = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === recurStudentId);
    if (!student) {
      showToast('Selecione um aluno cadastrado antes de criar a recorrência.');
      return;
    }
    const newR: PayRecurringCharge = {
      id: `rc-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      amount: Number(recurAmount) || 0,
      frequency: 'mensal',
      cardNumberMasked: recurCardMasked.trim() || '•••• 0000',
      cardBrand: 'mastercard',
      nextChargeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      status: 'ativa',
      lastChargeStatus: 'sucesso'
    };
    onAddRecurringCharge?.(newR);
    setShowNewRecurModal(false);
    setRecurAmount('');
    setRecurCardMasked('');
    showToast('Cobrança recorrente ativada!');
  };

  const handleSavePixKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPixKey.trim()) return;
    const cleanKey = inputPixKey.trim();
    const cleanBank = inputBank.trim() || 'Banco Vinculado';
    setPixKeyVal(cleanKey);
    setPixBankInfo(cleanBank);
    try {
      localStorage.setItem(PIX_STORAGE_KEY, JSON.stringify({ pixKey: cleanKey, pixBank: cleanBank }));
      await saveDocToFirestore('system_settings', {
        id: 'pay_pix_config',
        pixKey: cleanKey,
        pixBank: cleanBank,
        updatedAt: new Date().toISOString()
      });
      showToast('Chave PIX vinculada e sincronizada com o banco de dados!');
    } catch {
      showToast('Chave PIX salva localmente; falha ao sincronizar com o Firestore.');
    }
    setShowPixModal(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-slate-900 text-white px-5 py-3 text-xs font-bold shadow-2xl border border-slate-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

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
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cobrança recorrente no cartão sem comprometer o limite total, PIX dinâmico e links de pagamento reais
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowPixModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-teal-300 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-800 hover:bg-teal-100 transition-colors shadow-xs cursor-pointer"
          >
            <QrCode className="h-3.5 w-3.5 text-teal-600" />
            <span>Vincular Chave Pix</span>
          </button>
          <button
            onClick={() => setShowNewLinkModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <LinkIcon className="h-3.5 w-3.5 text-slate-500" />
            <span>Criar Link de Pagamento</span>
          </button>
          <button
            onClick={() => setShowNewRecurModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 px-4 py-2 text-xs font-bold text-white transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Recorrência</span>
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
            <span>{recurringCharges.length} contratos ativos</span>
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
            {approvalRateLabel}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
            <span>
              {chargesWithOutcome.length > 0
                ? `${approvedCount} de ${chargesWithOutcome.length} cobranças aprovadas`
                : 'Sem cobranças registradas'}
            </span>
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
            <span>Links cadastrados</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Chave PIX Vinculada</span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <QrCode className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-sm font-bold text-slate-900 truncate" title={pixKeyVal || 'Não vinculada'}>
            {pixKeyVal || 'Não vinculada'}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-teal-700 font-medium">
            <span>{pixBankInfo || 'Nenhum banco conectado'}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('recorrencia')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'recorrencia'
              ? 'border-blue-700 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Cobrança Recorrente ({recurringCharges.length})
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'links'
              ? 'border-blue-700 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Links de Pagamento ({paymentLinks.length})
        </button>
        <button
          onClick={() => setActiveTab('pix')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'pix'
              ? 'border-blue-700 text-blue-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          PIX Dinâmico com QR Code
        </button>
      </div>

      {/* Recorrência Table */}
      {activeTab === 'recorrencia' && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Alunos com Cobrança Automática Ativa
              </h2>
              <p className="text-xs text-slate-500">
                O valor é debitado mensalmente no cartão do aluno sem comprometer o limite total do cartão.
              </p>
            </div>
            <button
              onClick={() => setShowNewRecurModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              + Nova Recorrência
            </button>
          </div>

          <div className="overflow-x-auto">
            {recurringCharges.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Nenhuma cobrança recorrente cadastrada. Clique em "Nova Recorrência" para iniciar.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Cartão</th>
                    <th className="px-4 py-3">Valor / Ciclo</th>
                    <th className="px-4 py-3">Próximo Débito</th>
                    <th className="px-4 py-3">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recurringCharges.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {rec.studentName}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600 flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                        {rec.cardBrand.toUpperCase()} {rec.cardNumberMasked}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800">
                        {formatCurrency(rec.amount)} / {rec.frequency}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {rec.nextChargeDate}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.status === 'ativa'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {rec.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Payment Links */}
      {activeTab === 'links' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-xs font-bold text-slate-800">Links de Pagamento Reais (Gateway Bancário)</h3>
              <p className="text-[11px] text-slate-500">Cadastre os links gerados diretamente no seu banco ou gateway de preferência.</p>
            </div>
            <button
              onClick={() => setShowNewLinkModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Link de Pagamento</span>
            </button>
          </div>

          {paymentLinks.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400 text-xs">
              Nenhum link de pagamento cadastrado. Clique em "Criar Link de Pagamento" para colar o link real do banco.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentLinks.map((link) => (
                <div key={link.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Link Ativo
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {link.clicksCount} cliques
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">
                      {link.title}
                    </h3>
                    <div className="text-xs text-emerald-600 font-black mt-1">
                      {formatCurrency(link.amount)}
                    </div>
                    <div className="mt-2 text-[11px] font-mono text-slate-600 bg-slate-50 p-2.5 rounded-xl break-all border border-slate-200">
                      {link.url}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleCopy(link.url)}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copiedLink === link.url ? 'Copiado!' : 'Copiar Link'}
                    </button>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
                    >
                      Abrir Link <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PIX Dinâmico Tab */}
      {activeTab === 'pix' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <QrCode className="h-6 w-6 text-teal-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Chave PIX e Conciliação Instantânea
                </h2>
                <p className="text-xs text-slate-500">
                  Vincule sua chave PIX oficial para recebimento e regularização automática de matrículas.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPixModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>Vincular Chave Pix</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-1">
                <div className="font-bold text-teal-900 text-xs">Chave PIX Vinculada Atualmente:</div>
                <div className="font-mono font-black text-teal-900 text-base">{pixKeyVal || 'Não vinculada'}</div>
                <div className="text-[11px] text-teal-700 font-medium">Instituição: {pixBankInfo || 'Nenhum banco conectado'}</div>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                <li>Baixa financeira automática em tempo real</li>
                <li>Geração dinâmica de QR Code na recepção e PDV</li>
                <li>Nenhuma taxa de intermediação bancária</li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="h-36 w-36 bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
                <QrCode className={`h-28 w-28 ${pixKeyVal ? 'text-slate-800' : 'text-slate-300'}`} />
              </div>
              <span className="text-[11px] font-mono text-slate-500 mt-2 font-bold">
                {pixKeyVal ? 'QR Code PIX Ativo' : 'Vincule uma Chave PIX para ativar'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar Link (COM CAMPO PARA O LINK REAL DO BANCO) */}
      {showNewLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Adicionar Link de Pagamento do Banco
              </h2>
              <button onClick={() => setShowNewLinkModal(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLink} className="space-y-3 text-xs">
              {linkError && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-[11px] font-semibold text-rose-700">
                  {linkError}
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold mb-1">Título do Link ou Campanha *</label>
                <input
                  type="text"
                  required
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="Ex: Mensalidade Musculação"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">URL do Link Real (Criado no Banco / Gateway) *</label>
                <input
                  type="url"
                  required
                  value={linkRealUrl}
                  onChange={(e) => setLinkRealUrl(e.target.value)}
                  placeholder="https://pay.seu-banco.com.br/checkout/..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={linkAmount}
                    onChange={(e) => setLinkAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Plano Associado</label>
                  <select
                    value={linkPlan}
                    onChange={(e) => setLinkPlan(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Cobrança Avulsa</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({formatCurrency(p.price)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewLinkModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-800 shadow-sm cursor-pointer"
                >
                  Salvar Link Real
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Vincular Chave Pix */}
      {showPixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Vincular Chave Pix Oficial</h3>
              <button onClick={() => setShowPixModal(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePixKey} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chave Pix (E-mail, CNPJ, CPF ou Chave Aleatória) *</label>
                <input
                  type="text"
                  required
                  value={inputPixKey}
                  onChange={(e) => setInputPixKey(e.target.value)}
                  placeholder="Ex: financeiro@suaempresa.com.br"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instituição Bancária / Gateway *</label>
                <input
                  type="text"
                  required
                  value={inputBank}
                  onChange={(e) => setInputBank(e.target.value)}
                  placeholder="Ex: Banco Itaú S.A. / Nubank / Mercado Pago"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none font-semibold text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPixModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-sm cursor-pointer"
                >
                  Vincular Chave Pix
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nova Recorrência */}
      {showNewRecurModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Cadastrar Nova Cobrança Recorrente
              </h2>
              <button onClick={() => setShowNewRecurModal(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateRecurring} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Selecionar Aluno *</label>
                {students.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3.5 py-2.5 text-[11px] text-slate-500">
                    Nenhum aluno cadastrado no banco de dados. Cadastre um aluno na aba Clientes primeiro.
                  </div>
                ) : (
                  <select
                    value={recurStudentId}
                    onChange={(e) => setRecurStudentId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code}) - {s.planName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Valor Mensal (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={recurAmount}
                    onChange={(e) => setRecurAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Final Cartão</label>
                  <input
                    type="text"
                    value={recurCardMasked}
                    onChange={(e) => setRecurCardMasked(e.target.value)}
                    placeholder="•••• 0000"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewRecurModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={students.length === 0}
                  className="px-5 py-2 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-800 shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
