import React, { useState } from 'react';
import { 
  CircleDollarSign, 
  ArrowDownRight, 
  ArrowUpRight, 
  Plus, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Receipt, 
  Send,
  MessageSquare,
  FileSpreadsheet
} from 'lucide-react';
import { 
  FinancialTransaction, 
  PaymentMethod, 
  Student, 
  FinanceiroSubTab,
  PayRecurringCharge,
  PaymentLink 
} from '../../types';
import { formatCurrency, formatDate, sendWhatsAppMessage } from '../../utils';
import { GlProfitPayTab } from './VbSportPayTab';

interface FinanceiroTabProps {
  transactions: FinancialTransaction[];
  students: Student[];
  onAddTransaction: (tx: FinancialTransaction) => void;
  onSettlePayment: (transactionId: string) => void;
  activeSubTab?: FinanceiroSubTab;
  onNavigateSubTab?: (subTab: FinanceiroSubTab) => void;
  recurringCharges?: PayRecurringCharge[];
  paymentLinks?: PaymentLink[];
  onAddPaymentLink?: (link: PaymentLink) => void;
  onAddRecurringCharge?: (charge: PayRecurringCharge) => void;
  onCancelRecurring?: (id: string) => void;
  onRetryRecurring?: (id: string) => void;
  onCreatePaymentLink?: (link: PaymentLink) => void;
}

export const FinanceiroTab: React.FC<FinanceiroTabProps> = ({
  transactions,
  students,
  onAddTransaction,
  onSettlePayment,
  activeSubTab: propActiveSubTab = 'receber',
  onNavigateSubTab,
  recurringCharges = [],
  paymentLinks = [],
  onAddPaymentLink,
  onAddRecurringCharge,
  onCancelRecurring,
  onRetryRecurring,
  onCreatePaymentLink
}) => {
  const [internalSubTab, setInternalSubTab] = useState<FinanceiroSubTab>('receber');
  const activeSubTab = propActiveSubTab || internalSubTab;

  const setActiveSubTab = (tab: FinanceiroSubTab) => {
    setInternalSubTab(tab);
    onNavigateSubTab?.(tab);
  };
  const [showNewTxModal, setShowNewTxModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('todos');

  // Modal State
  const [newType, setNewType] = useState<'receita' | 'despesa'>('receita');
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Mensalidade');
  const [newMethod, setNewMethod] = useState<PaymentMethod>('pix');

  const totalReceitas = transactions
    .filter(t => t.type === 'receita' && t.status === 'pago')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDespesas = transactions
    .filter(t => t.type === 'despesa' && t.status === 'pago')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPendenteReceber = transactions
    .filter(t => t.type === 'receita' && (t.status === 'pendente' || t.status === 'vencido'))
    .reduce((sum, t) => sum + t.amount, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;

    const tx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      type: newType,
      category: newCategory,
      description: newDesc,
      amount: parseFloat(newAmount),
      paymentMethod: newMethod,
      date: new Date().toISOString().slice(0, 10),
      status: 'pago'
    };

    onAddTransaction(tx);
    setShowNewTxModal(false);
    setNewDesc('');
    setNewAmount('');
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.studentName && t.studentName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMethod = filterMethod === 'todos' || t.paymentMethod === filterMethod;

    if (activeSubTab === 'extrato') return matchesSearch && matchesMethod;
    if (activeSubTab === 'receber') return matchesSearch && matchesMethod && t.type === 'receita';
    if (activeSubTab === 'pagar') return matchesSearch && matchesMethod && t.type === 'despesa';
    return true;
  });

  const subTabButtons: { id: FinanceiroSubTab; label: string; icon: any; badge?: string }[] = [
    { id: 'receber', label: 'Contas a Receber & Inadimplência', icon: ArrowDownRight },
    { id: 'pagar', label: 'Contas a Pagar', icon: ArrowUpRight },
    { id: 'dre', label: 'DRE Gerencial', icon: FileSpreadsheet },
    { id: 'extrato', label: 'Extrato Completo', icon: Receipt },
    { id: 'gl_profit_pay', label: 'GL Profit Pay (Recorrência)', icon: CreditCard, badge: 'Recorrente' },
  ];

  return (
    <div className="space-y-6">
      {/* Subtab Selector */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <div className="flex items-center gap-2">
        {subTabButtons.map((sub) => {
          const SubIcon = sub.icon;
          const isActive = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <SubIcon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{sub.label}</span>
              {sub.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {sub.badge}
                </span>
              )}
            </button>
          );
        })}
        </div>

        {activeSubTab !== 'gl_profit_pay' && (
          <button
            onClick={() => setShowNewTxModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs shrink-0 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nova Movimentação</span>
          </button>
        )}
      </div>

      {activeSubTab === 'gl_profit_pay' ? (
        <div key="gl_profit_pay" className="animate-subtab-fade-in">
          <GlProfitPayTab
            recurringCharges={recurringCharges}
            paymentLinks={paymentLinks}
            students={students}
            onCancelRecurring={onCancelRecurring}
            onRetryRecurring={onRetryRecurring}
            onCreatePaymentLink={onCreatePaymentLink}
            onAddPaymentLink={onAddPaymentLink}
            onAddRecurringCharge={onAddRecurringCharge}
          />
        </div>
      ) : (
        <>
          {/* Summary Financial Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Entradas / Receitas */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Receitas Realizadas
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalReceitas)}
          </div>
          <div className="mt-1 text-xs text-slate-400">Mensalidades + PDV Loja</div>
        </div>

        {/* Saídas / Despesas */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Despesas Pagas
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalDespesas)}
          </div>
          <div className="mt-1 text-xs text-slate-400">Manutenções, Energia e Custos</div>
        </div>

        {/* Saldo Líquido Operacional */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Saldo Líquido
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <CircleDollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className={`mt-2 text-2xl font-bold ${saldoLiquido >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
            {formatCurrency(saldoLiquido)}
          </div>
          <div className="mt-1 text-xs text-slate-400">Disponível em contas e caixa</div>
        </div>

        {/* Inadimplência / A Receber */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              A Receber / Vencidos
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700">
            {formatCurrency(totalPendenteReceber)}
          </div>
          <div className="mt-1 text-xs text-slate-400">Faturas aguardando liquidação</div>
        </div>
      </div>

      {/* Sub-tab Content with Smooth Transition */}
      <div key={activeSubTab} className="animate-subtab-fade-in space-y-6">
        {/* DRE View */}
        {activeSubTab === 'dre' ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-semibold text-slate-900">
              Demonstrativo de Resultado do Exercício (DRE)
            </h2>
            <p className="text-xs text-slate-500">Mês de Referência: Setembro / 2024</p>
          </div>

          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100 font-sans font-semibold text-slate-900">
              <span>(+) RECEITA BRUTA OPERACIONAL</span>
              <span className="text-slate-900 font-mono">{formatCurrency(totalReceitas + 48200)}</span>
            </div>
            <div className="pl-4 flex justify-between text-slate-600 text-xs font-sans">
              <span>• Mensalidades e Planos Recorrentes</span>
              <span className="font-mono">{formatCurrency(46500)}</span>
            </div>
            <div className="pl-4 flex justify-between text-slate-600 text-xs font-sans">
              <span>• Vendas PDV (Suplementos, Água, Bebidas)</span>
              <span className="font-mono">{formatCurrency(totalReceitas + 1700)}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100 font-sans font-semibold text-rose-600">
              <span>(-) CUSTOS DAS MERCADORIAS & TAXAS CARTÃO</span>
              <span className="font-mono">({formatCurrency(3850)})</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100 font-sans font-semibold text-slate-900 bg-slate-50 px-3 rounded-lg">
              <span>(=) LUCRO BRUTO</span>
              <span className="text-slate-900 font-mono">{formatCurrency(totalReceitas + 48200 - 3850)}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100 font-sans font-semibold text-rose-600">
              <span>(-) DESPESAS OPERACIONAIS FIXAS</span>
              <span className="font-mono">({formatCurrency(totalDespesas + 14500)})</span>
            </div>
            <div className="pl-4 flex justify-between text-slate-600 text-xs font-sans">
              <span>• Aluguel do Imóvel & Condomínio</span>
              <span className="font-mono">R$ 8.500,00</span>
            </div>
            <div className="pl-4 flex justify-between text-slate-600 text-xs font-sans">
              <span>• Energia Elétrica, Água & Internet</span>
              <span className="font-mono">R$ 2.450,00</span>
            </div>
            <div className="pl-4 flex justify-between text-slate-600 text-xs font-sans">
              <span>• Manutenção Preventiva dos Aparelhos</span>
              <span className="font-mono">R$ 1.200,00</span>
            </div>
            <div className="pl-4 flex justify-between text-slate-600 text-xs font-sans">
              <span>• Softwares & Sistema GL PRO FIT ADM</span>
              <span className="font-mono">R$ 389,00</span>
            </div>

            <div className="flex justify-between py-3 border-t-2 border-slate-900 font-sans font-bold text-base text-slate-900 bg-slate-50 px-3 rounded-lg border border-slate-200">
              <span>(=) RESULTADO LÍQUIDO OPERACIONAL</span>
              <span className="text-blue-600 font-mono">{formatCurrency((totalReceitas + 48200) - 3850 - (totalDespesas + 14500))}</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar lançamentos..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs focus:outline-hidden"
              >
                <option value="todos">Todos os Métodos</option>
                <option value="pix">PIX</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="boleto">Boleto Bancário</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4">Descrição / Categoria</th>
                    <th className="py-3 px-4">Forma de Pagto</th>
                    <th className="py-3 px-4">Situação</th>
                    <th className="py-3 px-4 text-right">Valor</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-xs font-medium text-slate-500">
                          {formatDate(tx.date)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 text-xs">
                            {tx.description}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Categoria: {tx.category} {tx.studentName && `• Aluno: ${tx.studentName}`}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">
                            {tx.paymentMethod === 'pix' && <QrCode className="h-3 w-3 text-emerald-600" />}
                            {tx.paymentMethod.includes('cartao') && <CreditCard className="h-3 w-3 text-blue-600" />}
                            {tx.paymentMethod === 'dinheiro' && <Banknote className="h-3 w-3 text-slate-700" />}
                            {tx.paymentMethod === 'boleto' && <Receipt className="h-3 w-3 text-amber-600" />}
                            {tx.paymentMethod.toUpperCase().replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {tx.status === 'pago' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              Liquidado
                            </span>
                          ) : tx.status === 'vencido' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700">
                              <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                              Vencido
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                              <Clock className="h-3.5 w-3.5 text-amber-600" />
                              Pendente
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-semibold text-sm ${
                            tx.type === 'receita' ? 'text-emerald-700' : 'text-rose-600'
                          }`}>
                            {tx.type === 'receita' ? '+' : '-'} {formatCurrency(tx.amount)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {tx.status !== 'pago' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onSettlePayment(tx.id)}
                                className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                              >
                                Dar Baixa
                              </button>
                              {tx.studentName && (
                                <button
                                  onClick={() => {
                                    sendWhatsAppMessage(
                                      '(11) 97345-6789', 
                                      `Olá ${tx.studentName}! Consta uma fatura em aberto de ${formatCurrency(tx.amount)} na VB SPORT. Chave PIX: financeiro@vbsport.com.br`
                                    );
                                  }}
                                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
                                  title="Enviar Cobrança WhatsApp"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">Sem ações</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        Nenhum registro financeiro encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      </div>
      </>
      )}

      {/* Modal Nova Movimentação */}
      {showNewTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Lançar Movimentação Financeira
            </h2>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              {/* Type Switcher */}
              <div className="flex rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => { setNewType('receita'); setNewCategory('Mensalidade'); }}
                  className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                    newType === 'receita'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Receita (+)
                </button>
                <button
                  type="button"
                  onClick={() => { setNewType('despesa'); setNewCategory('Manutenção'); }}
                  className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                    newType === 'despesa'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Despesa (-)
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ex: Pagamento Mensalidade, Compra de Álcool 70%..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-hidden transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-hidden font-bold text-slate-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as PaymentMethod)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="pix">PIX</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="boleto">Boleto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Categoria
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-hidden"
                >
                  {newType === 'receita' ? (
                    <>
                      <option value="Mensalidade">Mensalidade / Plano</option>
                      <option value="Venda PDV">Venda PDV Loja</option>
                      <option value="Taxa de Matrícula">Taxa de Matrícula</option>
                      <option value="Outros Recebimentos">Outros Recebimentos</option>
                    </>
                  ) : (
                    <>
                      <option value="Manutenção">Manutenção de Equipamentos</option>
                      <option value="Utilidades">Energia, Água, Internet</option>
                      <option value="Aluguel">Aluguel do Espaço</option>
                      <option value="Suprimentos">Limpeza e Suprimentos</option>
                      <option value="Folha de Pagamento">Salários / Instrutores</option>
                    </>
                  )}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewTxModal(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
