import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  CreditCard, 
  QrCode, 
  Banknote, 
  CheckCircle2, 
  Printer, 
  User, 
  Package, 
  Sparkles, 
  Layers,
  Receipt
} from 'lucide-react';
import { Plan, Product, Student, PaymentMethod, FinancialTransaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils';

interface CartItem {
  id: string;
  name: string;
  type: 'plano' | 'produto';
  price: number;
  quantity: number;
}

interface VendasTabProps {
  plans: Plan[];
  products: Product[];
  students: Student[];
  onCompleteSale: (transaction: FinancialTransaction) => void;
}

export const VendasTab: React.FC<VendasTabProps> = ({
  plans,
  products,
  students,
  onCompleteSale
}) => {
  const [catalogType, setCatalogType] = useState<'todos' | 'planos' | 'produtos'>('todos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('balcao');
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [completedSale, setCompletedSale] = useState<{
    id: string;
    items: CartItem[];
    studentName: string;
    total: number;
    method: PaymentMethod;
    date: string;
  } | null>(null);

  const addToCart = (item: { id: string; name: string; price: number; type: 'plano' | 'produto' }) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discount);

  const handleFinishSale = () => {
    if (cart.length === 0) return;

    const studentObj = students.find(s => s.id === selectedStudentId);
    const studentName = studentObj ? studentObj.name : 'Venda Balcão (Não identificado)';

    const tx: FinancialTransaction = {
      id: `sale-${Date.now()}`,
      type: 'receita',
      category: cart.some(i => i.type === 'plano') ? 'Mensalidade' : 'Venda PDV',
      description: `Venda PDV: ${cart.map(c => `${c.quantity}x ${c.name}`).join(', ')}`,
      amount: total,
      paymentMethod,
      date: new Date().toISOString().slice(0, 10),
      status: 'pago',
      studentId: studentObj ? studentObj.id : undefined,
      studentName
    };

    onCompleteSale(tx);

    setCompletedSale({
      id: tx.id,
      items: [...cart],
      studentName,
      total,
      method: paymentMethod,
      date: new Date().toLocaleDateString('pt-BR')
    });

    setCart([]);
    setDiscount(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            Ponto de Venda (PDV & Vendas)
          </h1>
          <p className="text-sm text-slate-500">
            Venda ágil de planos de adesão, diárias, suplementação e vestuário esportivo
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product & Plan Catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tabs switch */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setCatalogType('todos')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                catalogType === 'todos'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos os Itens
            </button>
            <button
              onClick={() => setCatalogType('planos')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                catalogType === 'planos'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Planos & Mensalidades ({plans.length})
            </button>
            <button
              onClick={() => setCatalogType('produtos')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                catalogType === 'produtos'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Loja / Suplementos ({products.length})
            </button>
          </div>

          {/* Plans Grid */}
          {(catalogType === 'todos' || catalogType === 'planos') && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-blue-600" />
                Planos de Treino
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => addToCart({ id: plan.id, name: plan.name, price: plan.price, type: 'plano' })}
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-xs hover:border-blue-500 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {plan.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Ciclo: {plan.billingCycle.toUpperCase()}
                        </div>
                      </div>
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        {formatCurrency(plan.price)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                      {plan.description}
                    </p>
                    <button className="mt-3 w-full rounded-lg bg-slate-50 py-1.5 text-xs font-medium text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      + Adicionar ao Carrinho
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {(catalogType === 'todos' || catalogType === 'produtos') && (
            <div className="space-y-2 pt-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-blue-600" />
                Produtos da Loja & Suplementos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, type: 'produto' })}
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-xs hover:border-blue-500 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Estoque: {product.stock} un. • SKU: {product.sku}
                        </div>
                      </div>
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                    <button className="mt-3 w-full rounded-lg bg-slate-50 py-1.5 text-xs font-medium text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      + Adicionar ao Carrinho
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: POS Checkout (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-blue-600" />
                Carrinho de Compras
              </h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {cart.reduce((a, b) => a + b.quantity, 0)} itens
              </span>
            </div>

            {/* Select Student */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Identificar Aluno (Opcional)
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
              >
                <option value="balcao">👤 Venda Balcão / Não identificado</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code} - {s.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Items List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {formatCurrency(item.price)} un.
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-medium text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs font-semibold text-slate-800 w-16 text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-xs text-slate-400">
                  O carrinho está vazio. Selecione itens do catálogo ao lado.
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Forma de Pagamento
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'pix' as PaymentMethod, label: 'PIX Instantâneo', icon: QrCode },
                  { id: 'cartao_credito' as PaymentMethod, label: 'Cartão Crédito', icon: CreditCard },
                  { id: 'cartao_debito' as PaymentMethod, label: 'Cartão Débito', icon: CreditCard },
                  { id: 'dinheiro' as PaymentMethod, label: 'Dinheiro', icon: Banknote },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex items-center gap-1.5 rounded-lg border p-2 text-left text-xs font-medium transition-colors ${
                        paymentMethod === m.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                      <span className="truncate">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subtotals & Discounts */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Desconto (R$)</span>
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discount || ''}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  placeholder="0,00"
                  className="w-20 rounded-lg border border-slate-200 px-2 py-0.5 text-right text-xs font-medium"
                />
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-base pt-1 border-t border-slate-200">
                <span>Total a Pagar</span>
                <span className="text-slate-900">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Finish Sale Button */}
            <button
              onClick={handleFinishSale}
              disabled={cart.length === 0}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="h-4 w-4" />
              Finalizar Venda ({formatCurrency(total)})
            </button>
          </div>
        </div>
      </div>

      {/* Modal Recibo de Venda Concluída */}
      {completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mt-2 text-base font-semibold text-slate-900">
                Venda Concluída com Sucesso!
              </h3>
              <p className="text-xs text-slate-500">
                Comprovante fiscal / recibo gerado pelo sistema VB SPORT ADM
              </p>
            </div>

            {/* Printable Receipt Preview */}
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-xs font-mono space-y-2 text-slate-800">
              <div className="text-center pb-2 border-b border-dashed border-slate-200 font-sans font-semibold">
                VB SPORT ADM - FITNESS & GYM<br />
                <span className="text-[10px] font-normal text-slate-500">
                  CNPJ: 42.890.123/0001-95 • São Paulo - SP
                </span>
              </div>
              <div className="flex justify-between">
                <span>Data: {completedSale.date}</span>
                <span>Ref: #{completedSale.id.slice(-6)}</span>
              </div>
              <div>Cliente: {completedSale.studentName}</div>
              <div className="border-t border-dashed border-slate-200 pt-2 space-y-1">
                {completedSale.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.quantity}x {it.name.slice(0, 24)}</span>
                    <span>{formatCurrency(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-slate-200 pt-2 flex justify-between font-bold text-sm">
                <span>TOTAL PAGO:</span>
                <span>{formatCurrency(completedSale.total)}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Forma: {completedSale.method.toUpperCase().replace('_', ' ')}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Printer className="h-4 w-4" />
                Imprimir Recibo
              </button>
              <button
                onClick={() => setCompletedSale(null)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors shadow-xs"
              >
                Concluir & Próxima Venda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
