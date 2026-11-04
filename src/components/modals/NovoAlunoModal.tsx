import React, { useState } from 'react';
import { X, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';
import { Student, Plan, PaymentMethod, FinancialTransaction } from '../../types';
import { generateAccessCode } from '../../utils';

interface NovoAlunoModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans?: Plan[];
  onAddStudent: (student: Student, firstTx?: FinancialTransaction) => void;
}

export const NovoAlunoModal: React.FC<NovoAlunoModalProps> = ({
  isOpen,
  onClose,
  plans = [],
  onAddStudent
}) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [selectedPlanId, setSelectedPlanId] = useState(plans?.[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [paymentNow, setPaymentNow] = useState(true);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cpf || !phone) return;

    const plan = plans?.find(p => p.id === selectedPlanId) || plans?.[0] || {
      id: 'plan-default',
      name: 'Plano Padrão',
      price: 119.90,
      durationMonths: 1,
      billingCycle: 'mensal',
      active: true,
      category: 'musculacao'
    };
    const newCode = `00${generateAccessCode().slice(0, 3)}`;

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      code: newCode,
      name,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone,
      cpf,
      birthDate,
      status: 'ativo',
      planId: plan.id,
      planName: plan.name,
      planPrice: plan.price,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      pendingAmount: 0,
      notes
    };

    let firstTx: FinancialTransaction | undefined = undefined;
    if (paymentNow) {
      firstTx = {
        id: `tx-matr-${Date.now()}`,
        type: 'receita',
        category: 'Taxa de Matrícula / Mensalidade',
        description: `Matrícula & 1ª Mensalidade (${plan.name}) - ${name}`,
        amount: plan.price,
        paymentMethod,
        date: new Date().toISOString().slice(0, 10),
        status: 'pago',
        studentId: newStudent.id,
        studentName: newStudent.name
      };
    }

    onAddStudent(newStudent, firstTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-900">
              Cadastrar Novo Aluno
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nome Completo do Aluno *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Gabriel Alves Ferreira"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                CPF *
              </label>
              <input
                type="text"
                required
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                WhatsApp / Celular *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 9...."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aluno@email.com"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Plano de Treino / Matrícula
            </label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-hidden"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — R$ {p.price.toFixed(2)} ({p.billingCycle})
                </option>
              ))}
            </select>
          </div>

          {/* Payment upon registration */}
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={paymentNow}
                onChange={(e) => setPaymentNow(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-slate-900">
                Receber primeira mensalidade / adesão agora
              </span>
            </label>

            {paymentNow && (
              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="pix">PIX</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="dinheiro">Dinheiro</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="text-[11px] text-slate-500">Valor a liquidar:</div>
                  <div className="text-sm font-semibold text-blue-700">
                    R$ {(plans.find(p => p.id === selectedPlanId)?.price || 119.90).toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Observações Médicas ou Objetivos
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Lesão anterior no ombro, objetivo perda de peso..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-medium text-white hover:bg-blue-700 shadow-xs transition-colors"
            >
              Concluir Matrícula
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
