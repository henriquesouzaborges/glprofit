import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  ArrowDownRight, 
  ArrowUpRight, 
  AlertTriangle, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2, 
  History, 
  Layers,
  Edit2
} from 'lucide-react';
import { Product, StockMovement, Supplier } from '../../types';
import { formatCurrency, sendWhatsAppMessage } from '../../utils';

interface EstoqueTabProps {
  products?: Product[];
  stockMovements?: StockMovement[];
  suppliers?: Supplier[];
  onAddProduct: (prod: Product) => void;
  onAddStockMovement: (mov: StockMovement) => void;
  onUpdateProductStock: (productId: string, newStock: number) => void;
}

export const EstoqueTab: React.FC<EstoqueTabProps> = ({
  products = [],
  stockMovements = [],
  suppliers = [],
  onAddProduct,
  onAddStockMovement,
  onUpdateProductStock
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'produtos' | 'movimentacoes' | 'fornecedores'>('produtos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Modals
  const [showNewProdModal, setShowNewProdModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Form states
  const [entryProductId, setEntryProductId] = useState(products?.[0]?.id || '');
  const [entryQty, setEntryQty] = useState('10');
  const [entryReason, setEntryReason] = useState('Compra Fornecedor NF');
  const [entryCost, setEntryCost] = useState('0.00');

  const [exitProductId, setExitProductId] = useState(products?.[0]?.id || '');
  const [exitQty, setExitQty] = useState('1');
  const [exitReason, setExitReason] = useState('Avaria / Uso Interno');

  // New product state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Suplementos');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCost, setNewProdCost] = useState('');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdSku, setNewProdSku] = useState('');

  const categories = ['todos', 'Suplementos', 'Bebidas', 'Alimentos', 'Acessórios'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'todos' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const lowStockCount = products.filter(p => p.stock <= (p.minStock || 15)).length;
  const totalStockItems = products.reduce((acc, p) => acc + p.stock, 0);
  const totalStockValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
  const totalStockCost = products.reduce((acc, p) => acc + (p.stock * p.costPrice), 0);

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === entryProductId);
    if (!prod) return;
    const qty = Number(entryQty);
    onUpdateProductStock(prod.id, prod.stock + qty);

    const mov: StockMovement = {
      id: `sm-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      type: 'entrada',
      quantity: qty,
      date: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      reason: entryReason,
      responsible: 'Gianluca Marinho',
      costUnit: Number(entryCost) || prod.costPrice
    };
    onAddStockMovement(mov);
    setShowEntryModal(false);
  };

  const handleExitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === exitProductId);
    if (!prod) return;
    const qty = Number(exitQty);
    const newStock = Math.max(0, prod.stock - qty);
    onUpdateProductStock(prod.id, newStock);

    const mov: StockMovement = {
      id: `sm-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      type: 'saida',
      quantity: qty,
      date: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      reason: exitReason,
      responsible: 'Gianluca Marinho'
    };
    onAddStockMovement(mov);
    setShowExitModal(false);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;
    const newP: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice) || 10,
      costPrice: Number(newProdCost) || 5,
      stock: Number(newProdStock) || 0,
      minStock: 10,
      sku: newProdSku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`
    };
    onAddProduct(newP);
    setShowNewProdModal(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdCost('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Controle de Estoque & Produtos
          </h1>
          <p className="text-xs text-slate-500">
            Inventário de suplementos, bebidas, vestuário da academia e registro de fornecedores
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowEntryModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors shadow-xs"
          >
            <ArrowDownRight className="h-4 w-4 text-emerald-600" />
            Entrada de Mercadoria
          </button>
          <button
            onClick={() => setShowExitModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors shadow-xs"
          >
            <ArrowUpRight className="h-4 w-4 text-rose-600" />
            Baixa / Avaria
          </button>
          <button
            onClick={() => setShowNewProdModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Novo Produto
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total em Produtos</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Layers className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {totalStockItems} un.
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            <span>{products.length} itens cadastrados no catálogo</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Valor em Estoque (Venda)</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalStockValue)}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">
            <span>Preço de custo: {formatCurrency(totalStockCost)}</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Alerta Estoque Mínimo</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {lowStockCount}
          </div>
          <div className="mt-1 text-[11px] text-amber-600 font-medium">
            <span>Necessitam de reposição imediata</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Fornecedores Ativos</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Truck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {suppliers.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            <span>Suplementos, bebidas e vestuário</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveSubTab('produtos')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
            activeSubTab === 'produtos'
              ? 'border-blue-600 text-blue-700 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Produtos & Saldo ({products.length})
        </button>
        <button
          onClick={() => setActiveSubTab('movimentacoes')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
            activeSubTab === 'movimentacoes'
              ? 'border-blue-600 text-blue-700 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Histórico de Movimentações ({stockMovements.length})
        </button>
        <button
          onClick={() => setActiveSubTab('fornecedores')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
            activeSubTab === 'fornecedores'
              ? 'border-blue-600 text-blue-700 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Fornecedores ({suppliers.length})
        </button>
      </div>

      {/* Tab: Produtos Table */}
      {activeSubTab === 'produtos' && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs space-y-3 p-4">
          {/* Filter / Search bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar produto por nome ou SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors capitalize ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white font-medium' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Custo</th>
                  <th className="px-4 py-3">Venda</th>
                  <th className="px-4 py-3">Margem</th>
                  <th className="px-4 py-3">Saldo Atual</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const marginPercent = p.costPrice > 0 ? (((p.price - p.costPrice) / p.costPrice) * 100).toFixed(0) : '0';
                  const isLow = p.stock <= (p.minStock || 15);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {p.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {p.category}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500">
                        {p.sku}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {formatCurrency(p.costPrice)}
                      </td>
                      <td className="px-4 py-3 font-semibold font-mono text-slate-900">
                        {formatCurrency(p.price)}
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-600">
                        +{marginPercent}%
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold font-mono ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>
                          {p.stock} un.
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          isLow
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {isLow ? 'Estoque Baixo' : 'Disponível'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Movimentações */}
      {activeSubTab === 'movimentacoes' && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Registro de Entradas, Saídas e Ajustes de Estoque
            </h2>
            <span className="text-xs text-slate-500">{stockMovements.length} lançamentos</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Data / Hora</th>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Quantidade</th>
                  <th className="px-4 py-3">Motivo / Documento</th>
                  <th className="px-4 py-3">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 text-slate-500 font-mono">
                      {mov.date}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {mov.productName}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 w-fit ${
                        mov.type === 'entrada'
                          ? 'bg-emerald-50 text-emerald-700'
                          : mov.type === 'saida'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                      }`}>
                        {mov.type === 'entrada' && <ArrowDownRight className="h-3 w-3" />}
                        {mov.type === 'saida' && <ArrowUpRight className="h-3 w-3" />}
                        {mov.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">
                      {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity} un.
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {mov.reason}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {mov.responsible}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Fornecedores */}
      {activeSubTab === 'fornecedores' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suppliers.map((sup) => (
            <div key={sup.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                  {sup.category}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {sup.name}
              </h3>
              <div className="space-y-1 text-xs text-slate-600 font-mono">
                <div>CNPJ: {sup.cnpj}</div>
                <div>Contato: {sup.contactPerson}</div>
                <div>Tel: {sup.phone}</div>
                <div className="truncate">Email: {sup.email}</div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => sendWhatsAppMessage(sup.phone, `Olá ${sup.contactPerson}! Sou da equipe GL PRO FIT e gostaria de solicitar um pedido de reposição de estoque com a ${sup.name}.`, sup.name)}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  Fazer Pedido no WhatsApp Interno →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Entrada Mercadoria */}
      {showEntryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Registrar Entrada de Mercadoria (Compra)
              </h2>
              <button onClick={() => setShowEntryModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleEntrySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Produto *</label>
                <select
                  value={entryProductId}
                  onChange={(e) => setEntryProductId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 font-medium focus:border-blue-600 focus:outline-hidden"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Atual: {p.stock} un.)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Quantidade Entrada *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={entryQty}
                    onChange={(e) => setEntryQty(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={entryCost}
                    onChange={(e) => setEntryCost(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Motivo / Nº Nota Fiscal *</label>
                <input
                  type="text"
                  required
                  value={entryReason}
                  onChange={(e) => setEntryReason(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEntryModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-xs"
                >
                  Confirmar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Baixa */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Registrar Baixa Manual / Avaria
              </h2>
              <button onClick={() => setShowExitModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleExitSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Produto *</label>
                <select
                  value={exitProductId}
                  onChange={(e) => setExitProductId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 font-medium focus:border-rose-600 focus:outline-hidden"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Atual: {p.stock} un.)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Quantidade a Baixar *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={exitQty}
                  onChange={(e) => setExitQty(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono focus:border-rose-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Motivo da Baixa *</label>
                <select
                  value={exitReason}
                  onChange={(e) => setExitReason(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-rose-600 focus:outline-hidden"
                >
                  <option value="Avaria / Produto Danificado">Avaria / Produto Danificado</option>
                  <option value="Vencimento / Validade Expirada">Vencimento / Validade Expirada</option>
                  <option value="Consumo Interno Academia / Equipe">Consumo Interno Academia / Equipe</option>
                  <option value="Ajuste de Inventário / Contagem">Ajuste de Inventário / Contagem</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowExitModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-700 shadow-xs"
                >
                  Dar Baixa no Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Novo Produto */}
      {showNewProdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Cadastrar Novo Produto
              </h2>
              <button onClick={() => setShowNewProdModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ex: Creatina Creapure 250g"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Categoria *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="Suplementos">Suplementos</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Alimentos">Alimentos</option>
                    <option value="Acessórios">Acessórios</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Código SKU</label>
                  <input
                    type="text"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    placeholder="SUP-CREA-01"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(e.target.value)}
                    placeholder="40.00"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Venda (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="79.90"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Estoque Inicial</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewProdModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-xs"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
