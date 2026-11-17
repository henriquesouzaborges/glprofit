import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  CheckCircle2, 
  Tag, 
  Edit3, 
  Trash2, 
  X,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { Plan } from '../../../types';
import { formatCurrency } from '../../../utils';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  subscribeToFirestoreCollection,
  saveDocToFirestore,
  deleteDocFromFirestore
} from '../../../services/firebaseDbService';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

interface PlanosServicosViewProps {
  plans?: Plan[];
  onAddPlan?: (plan: Plan) => void;
  onUpdatePlan?: (plan: Plan) => void;
  onDeletePlan?: (id: string) => void;
}

const SERVICES_STORAGE_KEY = 'glprofit_additional_services';

export const PlanosServicosView: React.FC<PlanosServicosViewProps> = ({
  plans = [],
  onAddPlan,
  onUpdatePlan,
  onDeletePlan
}) => {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [confirmDeletePlanId, setConfirmDeletePlanId] = useState<string | null>(null);

  // Services state — strictly loaded from Firestore / localStorage (Zero-Mock)
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(SERVICES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });
  const [servicesSyncError, setServicesSyncError] = useState<string | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [confirmDeleteServiceId, setConfirmDeleteServiceId] = useState<string | null>(null);

  // Plan form state
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planBilling, setPlanBilling] = useState<'mensal' | 'trimestral' | 'semestral' | 'anual' | 'diaria'>('mensal');
  const [planDesc, setPlanDesc] = useState('');
  const [planModalities, setPlanModalities] = useState('');

  // Service form state
  const [srvName, setSrvName] = useState('');
  const [srvPrice, setSrvPrice] = useState('');
  const [srvCategory, setSrvCategory] = useState('');
  const [srvDesc, setSrvDesc] = useState('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    let unsubCol: (() => void) | null = null;
    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (unsubCol) {
        unsubCol();
        unsubCol = null;
      }
      if (!fbUser) return;
      unsubCol = subscribeToFirestoreCollection<ServiceItem>(
        'additional_services',
        (data) => {
          setServices(data);
          setServicesSyncError(null);
          try {
            localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(data));
          } catch {
            // ignore storage errors
          }
        },
        undefined,
        (err) => {
          const msg = err instanceof Error ? err.message : String(err);
          setServicesSyncError(`Erro ao sincronizar serviços no Firestore: ${msg}`);
        }
      );
    });
    return () => {
      unsubAuth();
      if (unsubCol) unsubCol();
    };
  }, []);

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
    if (!planName.trim()) return;

    const modalitiesArr = planModalities.split(',').map(m => m.trim()).filter(Boolean);

    if (editingPlan && onUpdatePlan) {
      const updated: Plan = {
        ...editingPlan,
        name: planName.trim(),
        price: Number(planPrice) || 0,
        billingCycle: planBilling,
        description: planDesc.trim(),
        modalities: modalitiesArr
      };
      onUpdatePlan(updated);
      showToast(`Plano "${updated.name}" atualizado com sucesso!`);
    } else if (onAddPlan) {
      const newP: Plan = {
        id: `pln-${Date.now()}`,
        name: planName.trim(),
        price: Number(planPrice) || 0,
        billingCycle: planBilling,
        modalities: modalitiesArr,
        activeStudentsCount: 0,
        description: planDesc.trim()
      };
      onAddPlan(newP);
      showToast(`Plano "${newP.name}" criado com sucesso!`);
    }
    setShowPlanModal(false);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName.trim()) return;

    if (editingService) {
      const updated: ServiceItem = {
        ...editingService,
        name: srvName.trim(),
        price: Number(srvPrice) || 0,
        category: srvCategory.trim() || 'Serviços Especiais',
        description: srvDesc.trim()
      };
      const next = services.map(s => s.id === editingService.id ? updated : s);
      setServices(next);
      try {
        localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(next));
        await saveDocToFirestore('additional_services', updated);
        showToast(`Serviço "${updated.name}" atualizado no Firestore!`);
      } catch {
        setServicesSyncError('Falha ao salvar alterações do serviço no Firestore.');
      }
    } else {
      const newS: ServiceItem = {
        id: `srv-${Date.now()}`,
        name: srvName.trim(),
        price: Number(srvPrice) || 0,
        category: srvCategory.trim() || 'Serviços Especiais',
        description: srvDesc.trim()
      };
      const next = [newS, ...services];
      setServices(next);
      try {
        localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(next));
        await saveDocToFirestore('additional_services', newS);
        showToast(`Serviço "${newS.name}" cadastrado no Firestore!`);
      } catch {
        setServicesSyncError('Falha ao salvar novo serviço no Firestore.');
      }
    }
    setShowServiceModal(false);
    setEditingService(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-slate-900 text-white px-5 py-3 text-xs font-bold shadow-2xl border border-slate-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {servicesSyncError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{servicesSyncError}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-700" />
            <span>Planos de Mensalidade & Serviços Adicionais</span>
          </h2>
          <p className="text-xs text-slate-500">
            Configure os planos recorrentes oferecidos aos alunos e pacotes de serviços avulsos (Personal, Nutrição, Locação)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenNewPlan}
            className="flex items-center gap-1.5 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Plano</span>
          </button>
          <button
            onClick={() => {
              setEditingService(null);
              setSrvName('');
              setSrvPrice('');
              setSrvCategory('');
              setSrvDesc('');
              setShowServiceModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-blue-700" />
            <span>Cadastrar Novo Serviço</span>
          </button>
        </div>
      </div>

      {/* PLANOS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-600" />
            <span>Planos de Mensalidade ({plans.length})</span>
          </h3>
        </div>

        {plans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
            <p className="text-sm font-semibold text-slate-700">Nenhum plano de mensalidade cadastrado</p>
            <p className="text-xs text-slate-500 mt-1">Clique em "Criar Novo Plano" para cadastrar seu primeiro plano.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {plans.map((plan) => (
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
                    {confirmDeletePlanId === plan.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            onDeletePlan?.(plan.id);
                            setConfirmDeletePlanId(null);
                            showToast(`Plano "${plan.name}" excluído.`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 cursor-pointer transition-colors"
                        >
                          Confirmar
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeletePlanId(null)}
                          className="px-2 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold hover:bg-slate-200 cursor-pointer transition-colors"
                        >
                          Cancelar
                        </button>
                      </>
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
                          onClick={() => setConfirmDeletePlanId(plan.id)}
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
      </section>

      {/* SERVIÇOS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Serviços Adicionais & Pacotes ({services.length})</span>
          </h3>
        </div>

        {services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
            <p className="text-sm font-semibold text-slate-700">Nenhum serviço adicional cadastrado</p>
            <p className="text-xs text-slate-500 mt-1">Clique em "Cadastrar Novo Serviço" para adicionar um pacote avulso.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((srv) => (
              <div key={srv.id} className="rounded-2xl bg-white border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {srv.category}
                    </span>
                    <span className="text-base font-black text-emerald-600">{formatCurrency(srv.price)}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{srv.name}</h3>
                  <p className="text-xs text-slate-600">{srv.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-1.5">
                  {confirmDeleteServiceId === srv.id ? (
                    <>
                      <button
                        type="button"
                        onClick={async () => {
                          const next = services.filter(s => s.id !== srv.id);
                          setServices(next);
                          setConfirmDeleteServiceId(null);
                          try {
                            localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(next));
                            await deleteDocFromFirestore('additional_services', srv.id);
                            showToast(`Serviço "${srv.name}" excluído.`);
                          } catch {
                            setServicesSyncError('Falha ao excluir serviço no Firestore.');
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 cursor-pointer transition-colors"
                      >
                        Confirmar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteServiceId(null)}
                        className="px-2 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold hover:bg-slate-200 cursor-pointer transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingService(srv);
                          setSrvName(srv.name);
                          setSrvPrice(srv.price.toString());
                          setSrvCategory(srv.category);
                          setSrvDesc(srv.description);
                          setShowServiceModal(true);
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                        title="Editar Serviço"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteServiceId(srv.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer transition-colors"
                        title="Excluir Serviço"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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

      {/* MODAL SERVIÇO */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingService ? 'Editar Serviço Adicional' : 'Cadastrar Novo Serviço Adicional'}
              </h3>
              <button onClick={() => setShowServiceModal(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Serviço *</label>
                <input
                  type="text"
                  required
                  value={srvName}
                  onChange={(e) => setSrvName(e.target.value)}
                  placeholder="Ex: Consultoria Nutricional"
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
                    value={srvPrice}
                    onChange={(e) => setSrvPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                  <input
                    type="text"
                    value={srvCategory}
                    onChange={(e) => setSrvCategory(e.target.value)}
                    placeholder="Ex: Treinamento"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={srvDesc}
                  onChange={(e) => setSrvDesc(e.target.value)}
                  placeholder="Detalhes do serviço avulso..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-800 shadow-sm cursor-pointer"
                >
                  {editingService ? 'Salvar Alterações' : 'Cadastrar Serviço'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
