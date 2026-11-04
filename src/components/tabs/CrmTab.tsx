import React, { useState } from 'react';
import { 
  Users, 
  Kanban as KanbanIcon, 
  CheckSquare, 
  Zap, 
  HeartHandshake, 
  Plus, 
  Share2
} from 'lucide-react';
import { Lead, LeadStage, CrmSubTab, CrmActivity, CrmAutomation, SatisfactionSurveyResponse } from '../../types';
import { CrmLeadsView } from './crm/CrmLeadsView';
import { CrmKanbanView } from './crm/CrmKanbanView';
import { CrmAtividadesView } from './crm/CrmAtividadesView';
import { CrmAutomacoesView } from './crm/CrmAutomacoesView';
import { CrmPesquisasView } from './crm/CrmPesquisasView';

interface CrmTabProps {
  leads: Lead[];
  onUpdateLeadStage: (leadId: string, newStage: LeadStage) => void;
  onAddLead: (lead: Lead) => void;
  onConvertLeadToStudent: (lead: Lead) => void;
  subTab?: CrmSubTab;
  onSubTabChange?: (sub: CrmSubTab) => void;
  activities?: CrmActivity[];
  onToggleActivityStatus?: (id: string) => void;
  onAddActivity?: (activity: CrmActivity) => void;
  onDeleteActivity?: (id: string) => void;
  automations?: CrmAutomation[];
  onToggleAutomation?: (id: string) => void;
  onTestAutomation?: (auto: CrmAutomation) => void;
  onAddAutomation?: (auto: CrmAutomation) => void;
  surveys?: SatisfactionSurveyResponse[];
  onAddSurveyResponse?: (resp: SatisfactionSurveyResponse) => void;
  onResolveSurvey?: (id: string) => void;
}

export const CrmTab: React.FC<CrmTabProps> = ({
  leads,
  onUpdateLeadStage,
  onAddLead,
  onConvertLeadToStudent,
  subTab: externalSubTab,
  onSubTabChange,
  activities = [],
  onToggleActivityStatus = () => {},
  onAddActivity = () => {},
  onDeleteActivity = () => {},
  automations = [],
  onToggleAutomation = () => {},
  onTestAutomation = () => {},
  onAddAutomation = () => {},
  surveys = [],
  onAddSurveyResponse = () => {},
  onResolveSurvey = () => {}
}) => {
  const [internalSubTab, setInternalSubTab] = useState<CrmSubTab>('leads');
  const activeSubTab = externalSubTab || internalSubTab;

  const handleSubTabSelect = (tab: CrmSubTab) => {
    if (onSubTabChange) {
      onSubTabChange(tab);
    } else {
      setInternalSubTab(tab);
    }
  };

  // New Lead Modal State
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('Musculação e Hipertrofia');
  const [source, setSource] = useState('Instagram Ads');
  const [assignedTo, setAssignedTo] = useState('Ana Beatriz');
  const [valueExpected, setValueExpected] = useState('119.90');
  const [notes, setNotes] = useState('');

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name,
      phone,
      email,
      interest,
      stage: 'novo',
      notes,
      source,
      assignedTo,
      valueExpected: parseFloat(valueExpected) || 119.90,
      createdAt: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastContact: 'Agora mesmo'
    };

    onAddLead(newLead);
    setShowAddLeadModal(false);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
  };

  const pendingActivitiesCount = activities.filter(a => a.status === 'pendente' || a.status === 'atrasada').length;
  const activeAutomationsCount = automations.filter(a => a.active).length;

  const subTabsConfig: {
    id: CrmSubTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number | null;
  }[] = [
    {
      id: 'leads',
      label: 'Leads',
      icon: Users,
      badge: leads.length
    },
    {
      id: 'kambam',
      label: 'Kambam',
      icon: KanbanIcon,
      badge: leads.filter(l => l.stage !== 'matriculado').length
    },
    {
      id: 'atividades',
      label: 'Atividades',
      icon: CheckSquare,
      badge: pendingActivitiesCount > 0 ? pendingActivitiesCount : null
    },
    {
      id: 'automacoes',
      label: 'Automações',
      icon: Zap,
      badge: `${activeAutomationsCount} ativas`
    },
    {
      id: 'pesquisas',
      label: 'Pesquisas de Satisfação',
      icon: HeartHandshake,
      badge: 'NPS +88'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Share2 className="h-5 w-5 text-blue-600" />
            CRM Comercial & Gestão de Vendas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Funil de captação, relacionamento com leads, tarefas comerciais, automações e métricas de satisfação
          </p>
        </div>

        <button
          onClick={() => setShowAddLeadModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Cadastrar Novo Lead
        </button>
      </div>

      {/* Active Sub-tab Content */}
      <div key={activeSubTab} className="animate-subtab-fade-in">
        {activeSubTab === 'leads' && (
          <CrmLeadsView
            leads={leads}
            onUpdateLeadStage={onUpdateLeadStage}
            onAddLead={onAddLead}
            onConvertLeadToStudent={onConvertLeadToStudent}
            onOpenNewLeadModal={() => setShowAddLeadModal(true)}
          />
        )}

        {activeSubTab === 'kambam' && (
          <CrmKanbanView
            leads={leads}
            onUpdateLeadStage={onUpdateLeadStage}
            onConvertLeadToStudent={onConvertLeadToStudent}
            onOpenNewLeadModal={() => setShowAddLeadModal(true)}
          />
        )}

        {activeSubTab === 'atividades' && (
          <CrmAtividadesView
            activities={activities}
            leads={leads}
            onToggleActivityStatus={onToggleActivityStatus}
            onAddActivity={onAddActivity}
            onDeleteActivity={onDeleteActivity}
          />
        )}

        {activeSubTab === 'automacoes' && (
          <CrmAutomacoesView
            automations={automations}
            onToggleAutomation={onToggleAutomation}
            onTestAutomation={onTestAutomation}
            onAddAutomation={onAddAutomation}
          />
        )}

        {activeSubTab === 'pesquisas' && (
          <CrmPesquisasView
            surveys={surveys}
            leads={leads}
            onAddSurveyResponse={onAddSurveyResponse}
            onResolveSurvey={onResolveSurvey}
          />
        )}
      </div>

      {/* Modal Novo Lead */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Cadastrar Novo Lead / Oportunidade
            </h3>

            <form onSubmit={handleCreateLead} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do interessado..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Origem / Canal
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="Instagram Ads">Instagram Ads</option>
                    <option value="Facebook Ads">Facebook Ads</option>
                    <option value="Google Pesquisa">Google Pesquisa</option>
                    <option value="Indicação de Aluno">Indicação de Aluno</option>
                    <option value="Fachada / Passante">Fachada / Passante</option>
                    <option value="WhatsApp Direto">WhatsApp Direto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Consultor Responsável
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="Ana Beatriz">Ana Beatriz (Comercial)</option>
                    <option value="Gianluca M.">Gianluca Marinho (Gerência)</option>
                    <option value="Recepção VB">Recepção Geral</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Interesse Principal
                  </label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="Musculação e Hipertrofia">Musculação e Hipertrofia</option>
                    <option value="CrossFit e Perda de Peso">CrossFit e Perda de Peso</option>
                    <option value="Spinning e Pilates">Spinning e Pilates</option>
                    <option value="Plano Anual Black VIP">Plano Anual Black VIP</option>
                    <option value="Muay Thai / Lutas">Muay Thai / Lutas</option>
                    <option value="Emagrecimento & Saúde">Emagrecimento & Saúde</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Valor Estimado (R$)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={valueExpected}
                    onChange={(e) => setValueExpected(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Anotações da Recepção
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Como conheceu a academia, melhor horário para ligar..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Salvar Oportunidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
