import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  X,
  Layers
} from 'lucide-react';
import { Plan } from '../../../types';
import { formatCurrency } from '../../../utils';

interface PlanosViewProps {
  plans?: Plan[];
  onAddPlan?: (plan: Plan) => void;
  onUpdatePlan?: (plan: Plan) => void;
  onDeletePlan?: (id: string) => void;
}

export const PlanosView: React.FC<PlanosViewProps> = ({
  plans = [],
  onAddPlan,
  onUpdatePlan,
  onDeletePlan
}) => {
  const [localPlans, setLocalPlans] = useState<Plan[]>(plans);
  useEffect(() => {
    setLocalPlans(plans);
  }, [plans]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Plan form state
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planBilling, setPlanBilling] = useState<'mensal' | 'trimestral' | 'semestral' | 'anual' | 'diaria'>('mensal');
  const [planDesc, setPlanDesc] = useState('');
  const [planModalities, setPlanModalities] = useState('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenNewPlan = () => {
    setEditingPlan(null);
    setPlanName('');
    setPlanPrice('');
    setPlanBilling('mensal');
    setPlanDesc('');
    setPlanModalities('');
    setShowPlanModal(true);
  };

  const handleOpenEditPlan = (p: Plan) => {
    setEditingPlan(p);
    setPlanName(p.name);
    setPlanPrice(p.price.toString());
    setPlanBilling(p.billingCycle);
    setPlanDesc(p.description);
    setPlanModalities(p.modalities.join(', '));
    setShowPlanModal(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName) return;

    const modalitiesArr = planModalities.split(',').map(m => m.trim()).filter(Boolean);

    if (editingPlan) {
      const updated: Plan = {
        ...editingPlan,
        name: planName,
        price: Number(planPrice) || 0,
        billingCycle: planBilling,
        description: planDesc,
        modalities: modalitiesArr
      };
      setLocalPlans(localPlans.map(p => p.id === updated.id ? updated : p));
      onUpdatePlan?.(updated);
      showToast(`Plano "${updated.name}" atualizado com sucesso!`);
    } else {
      const newP: Plan = {
        id: `pln-${Date.now()}`,
        name: planName,
        price: Number(planPrice) || 0,
        billingCycle: planBilling,
        modalities: modalitiesArr,
        activeStudentsCount: 0,
        description: planDesc
      };
      setLocalPlans([newP, ...localPlans]);
      onAddPlan?.(newP);
      showToast(`Plano "${newP.name}" criado com sucesso!`);
    }
    setShowPlanModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    setLocalPlans(localPlans.filter(p => p.id !== id));
    onDeletePlan?.(id);
    setConfirmDeleteId(null);
    showToast(`Plano "${name}" excluído com sucesso!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-slate-900 text-white px-5 py-3 text-xs font-bold shadow-2xl border border-slate-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-700" />
            <span>Planos de Mensalidade</span>
          </h2>
          <p className="text-xs text-slate-500">
            Gerencie e configure os planos recorrentes oferecidos aos alunos da academia
          </p>
        </div>

        <button
          onClick={handleOpenNewPlan}
          className="flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Plano</span>
        </button>
      </div>

      {/* Grid of Plans or Empty State */}
      {localPlans.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Nenhum plano de mensalidade cadastrado</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Os planos cadastrados aqui são salvos diretamente no banco de dados e disponibilizados nas matrículas e vendas.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenNewPlan}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeiro Plano</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {localPlans.map((plan) => (
            <div key={plan.id} className="rounded-2xl bg-white border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Ciclo: {plan.billingCycle.toUpperCase()}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-2">{plan.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-600">{formatCurrency(plan.price)}</span>
                    <span className="block text-[10px] text-slate-400 font-medium">por {plan.billingCycle}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{plan.description}</p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase text-slate-400">Modalidades Inclusas:</span>
                  <div className="flex flex-wrap gap-1">
                    {plan.modalities.map((mod, i) => (
                      <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  <strong className="text-slate-900">{plan.activeStudentsCount}</strong> alunos ativos
                </span>

                <div className="flex items-center gap-1.5">
                  {confirmDeleteId === plan.id ? (
                    <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-xl px-2 py-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(plan.id, plan.name)}
                        className="text-[10px] font-bold text-rose-700 hover:underline cursor-pointer px-1"
                      >
                        Confirmar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer px-1"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenEditPlan(plan)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                        title="Editar Plano"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(plan.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer transition-colors"
                        title="Excluir Plano"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL PLANO */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingPlan ? 'Editar Plano de Mensalidade' : 'Criar Novo Plano de Mensalidade'}
              </h3>
              <button onClick={() => setShowPlanModal(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Plano *</label>
                <input
                  type="text"
                  required
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="Ex: Plano Trimestral Musculação"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={planPrice}
                    onChange={(e) => setPlanPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ciclo de Cobrança</label>
                  <select
                    value={planBilling}
                    onChange={(e) => setPlanBilling(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="mensal">Mensal</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="semestral">Semestral</option>
                    <option value="anual">Anual</option>
                    <option value="diaria">Diária</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Modalidades Inclusas (separadas por vírgula)</label>
                <input
                  type="text"
                  value={planModalities}
                  onChange={(e) => setPlanModalities(e.target.value)}
                  placeholder="Ex: Musculação, CrossFit, Pilates"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição / Benefícios</label>
                <textarea
                  rows={2}
                  value={planDesc}
                  onChange={(e) => setPlanDesc(e.target.value)}
                  placeholder="Resumo dos benefícios incluídos no plano..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-800 shadow-sm cursor-pointer"
                >
                  {editingPlan ? 'Salvar Alterações' : 'Criar Plano'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
