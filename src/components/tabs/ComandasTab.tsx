import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  User, 
  Coffee, 
  DollarSign, 
  ShoppingBag, 
  Trash2, 
  CreditCard, 
  QrCode, 
  Banknote, 
  ArrowRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import { Comanda, ComandaItem, Product, Student, PaymentMethod, FinancialTransaction } from '../../types';
import { formatCurrency } from '../../utils';

interface ComandasTabProps {
  comandas?: Comanda[];
  products?: Product[];
  students?: Student[];
  onOpenComanda: (comanda: Comanda) => void;
  onAddItemToComanda: (comandaId: string, item: ComandaItem) => void;
  onCloseComanda: (comandaId: string, paymentMethod: PaymentMethod, sendToInvoice?: boolean) => void;
  onCompleteSaleTransaction?: (tx: FinancialTransaction) => void;
}

export const ComandasTab: React.FC<ComandasTabProps> = ({
  comandas = [],
  products = [],
  students = [],
  onOpenComanda,
  onAddItemToComanda,
  onCloseComanda
}) => {
  const [activeFilter, setActiveFilter] = useState<'abertas' | 'todas' | 'fechadas'>('abertas');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected comanda for detailed view or adding items
  const [selectedComanda, setSelectedComanda] = useState<Comanda | null>(comandas?.[0] || null);

  // Modals
  const [showNewComandaModal, setShowNewComandaModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  // Form states
  const [newComandaNumber, setNewComandaNumber] = useState(((comandas?.length || 0) + 101).toString());
  const [newComandaStudentId, setNewComandaStudentId] = useState('');
  const [newComandaGuestName, setNewComandaGuestName] = useState('');

  const [selectedProductId, setSelectedProductId] = useState(products?.[0]?.id || '');
  const [selectedProductQty, setSelectedProductQty] = useState('1');

  const [closePaymentMethod, setClosePaymentMethod] = useState<PaymentMethod>('pix');
  const [closeSendToInvoice, setCloseSendToInvoice] = useState(false);

  const openComandas = comandas.filter(c => c.status === 'aberta');
  const closedComandas = comandas.filter(c => c.status === 'fechada');

  const totalOpenAmount = openComandas.reduce((acc, c) => acc + c.total, 0);
  const totalClosedToday = closedComandas.reduce((acc, c) => acc + c.total, 0);

  const filteredComandas = comandas.filter(c => {
    const matchesSearch = c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || c.number.toString().includes(searchQuery);
    if (activeFilter === 'abertas') return matchesSearch && c.status === 'aberta';
    if (activeFilter === 'fechadas') return matchesSearch && c.status === 'fechada';
    return matchesSearch;
  });

  const handleCreateComanda = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === newComandaStudentId);
    const newC: Comanda = {
      id: `cmd-${Date.now()}`,
      number: Number(newComandaNumber) || (comandas.length + 1),
      studentId: student?.id,
      studentName: student ? student.name : (newComandaGuestName || 'Cliente Balcão'),
      studentCode: student?.code,
      status: 'aberta',
      openedAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      items: [],
      total: 0
    };
    onOpenComanda(newC);
    setSelectedComanda(newC);
    setShowNewComandaModal(false);
    setNewComandaGuestName('');
    setNewComandaStudentId('');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComanda) return;
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;
    const qty = Number(selectedProductQty) || 1;
    const item: ComandaItem = {
      id: `ci-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      quantity: qty,
      unitPrice: prod.price,
      totalPrice: prod.price * qty,
      addedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    onAddItemToComanda(selectedComanda.id, item);
    setSelectedComanda(prev => prev ? {
      ...prev,
      items: [...prev.items, item],
      total: prev.total + item.totalPrice
    } : null);
    setShowAddItemModal(false);
  };

  const handleConfirmClose = () => {
    if (!selectedComanda) return;
    onCloseComanda(selectedComanda.id, closePaymentMethod, closeSendToInvoice);
    setSelectedComanda(prev => prev ? {
      ...prev,
      status: 'fechada',
      closedAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: closePaymentMethod
    } : null);
    setShowCloseModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Coffee className="h-5 w-5 text-amber-600" />
            Lanchonete da Empresa & Comandas
          </h1>
          <p className="text-xs text-slate-500">
            Controle da lanchonete, consumos em aberto por aluno, pedidos de shakes, lanches e bebidas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setNewComandaNumber((comandas.length + 101).toString());
              setShowNewComandaModal(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Abrir Comanda / Pedido
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Comandas Abertas</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Receipt className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {openComandas.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            <span>Consumo em andamento na academia</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total a Receber em Comandas</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalOpenAmount)}
          </div>
          <div className="mt-1 text-[11px] text-amber-600 font-medium">
            <span>Aguardando fechamento</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Comandas Pagas Hoje</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalClosedToday)}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">
            <span>{closedComandas.length} fechadas com sucesso</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Itens Mais Consumidos</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Coffee className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-sm font-bold text-slate-900 truncate">
            {comandas.some(c => c.items && c.items.length > 0) ? 'Água & Suplementos' : 'Nenhum consumo registrado'}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            <span>{comandas.length > 0 ? 'Baseado nas comandas ativas' : 'Aguardando novas comandas'}</span>
          </div>
        </div>
      </div>

      {/* Main Content: Left List & Right Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Comandas List (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveFilter('abertas')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeFilter === 'abertas' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Abertas ({openComandas.length})
              </button>
              <button
                onClick={() => setActiveFilter('fechadas')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeFilter === 'fechadas' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Fechadas ({closedComandas.length})
              </button>
              <button
                onClick={() => setActiveFilter('todas')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeFilter === 'todas' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Todas
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar comanda ou cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredComandas.map((c) => {
              const isSelected = selectedComanda?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedComanda(c)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50/50 shadow-xs' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        #{c.number}
                      </span>
                      <span className="font-semibold text-slate-900 truncate">
                        {c.studentName}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      {formatCurrency(c.total)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{c.items.length} item(ns) consumido(s)</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      c.status === 'aberta' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comanda Detail Pane (7 cols) */}
        <div className="lg:col-span-7">
          {selectedComanda ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
                      COMANDA #{selectedComanda.number}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      selectedComanda.status === 'aberta' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedComanda.status}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-1">
                    {selectedComanda.studentName}
                  </h2>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Aberta em: {selectedComanda.openedAt}
                  </div>
                </div>

                {selectedComanda.status === 'aberta' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAddItemModal(true)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Lançar Item
                    </button>
                    <button
                      onClick={() => setShowCloseModal(true)}
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Fechar & Cobrar
                    </button>
                  </div>
                )}
              </div>

              {/* Items in comanda */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Itens Consumidos ({selectedComanda.items.length})
                </div>

                {selectedComanda.items.length > 0 ? (
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                    {selectedComanda.items.map((item) => (
                      <div key={item.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50/50">
                        <div>
                          <div className="font-semibold text-slate-800">{item.productName}</div>
                          <div className="text-[11px] text-slate-400">
                            {item.quantity}x de {formatCurrency(item.unitPrice)} • {item.addedAt}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-slate-900">
                          {formatCurrency(item.totalPrice)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                    Nenhum item lançado ainda nesta comanda.
                    <div className="mt-2">
                      <button
                        onClick={() => setShowAddItemModal(true)}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        + Adicionar primeiro item
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Total footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Total da Comanda:</span>
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {formatCurrency(selectedComanda.total)}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400 text-xs">
              Selecione uma comanda na lista para visualizar o consumo.
            </div>
          )}
        </div>
      </div>

      {/* Modal Nova Comanda */}
      {showNewComandaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Abrir Nova Comanda de Consumo
              </h2>
              <button onClick={() => setShowNewComandaModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateComanda} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Número do Cartão / Comanda *</label>
                <input
                  type="number"
                  required
                  value={newComandaNumber}
                  onChange={(e) => setNewComandaNumber(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono font-bold focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Vincular a um Aluno Cadastrado</label>
                <select
                  value={newComandaStudentId}
                  onChange={(e) => setNewComandaStudentId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 font-medium focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="">-- Cliente Avulso / Não cadastrado --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              {!newComandaStudentId && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nome do Cliente Avulso</label>
                  <input
                    type="text"
                    placeholder="Ex: Visitante João"
                    value={newComandaGuestName}
                    onChange={(e) => setNewComandaGuestName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewComandaModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-xs"
                >
                  Abrir Comanda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Lançar Item */}
      {showAddItemModal && selectedComanda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Lançar Item na Comanda #{selectedComanda.number}
              </h2>
              <button onClick={() => setShowAddItemModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Selecionar Produto *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 font-medium focus:border-blue-600 focus:outline-hidden"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {formatCurrency(p.price)} (Estoque: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Quantidade *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={selectedProductQty}
                  onChange={(e) => setSelectedProductQty(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-xs"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Fechar Comanda */}
      {showCloseModal && selectedComanda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Fechamento da Comanda #{selectedComanda.number}
              </h2>
              <button onClick={() => setShowCloseModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs text-slate-500">Valor Total a Pagar</div>
              <div className="text-3xl font-extrabold font-mono text-slate-900 mt-1">
                {formatCurrency(selectedComanda.total)}
              </div>
              <div className="text-xs text-slate-600 mt-1">{selectedComanda.studentName}</div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-700 font-medium">Forma de Pagamento</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'pix' as PaymentMethod, label: 'PIX Instantâneo', icon: QrCode },
                  { id: 'cartao_credito' as PaymentMethod, label: 'Cartão de Crédito', icon: CreditCard },
                  { id: 'cartao_debito' as PaymentMethod, label: 'Cartão de Débito', icon: CreditCard },
                  { id: 'dinheiro' as PaymentMethod, label: 'Dinheiro', icon: Banknote },
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = closePaymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setClosePaymentMethod(item.id)}
                      className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                        isSelected ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-slate-500" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {selectedComanda.studentId && (
                <label className="flex items-center gap-2 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={closeSendToInvoice}
                    onChange={(e) => setCloseSendToInvoice(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-600">Lançar na próxima fatura da mensalidade</span>
                </label>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCloseModal(false)}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-xs"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmClose}
                className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-xs text-xs"
              >
                Confirmar Recebimento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
