import React, { useState } from 'react';
import { 
  Zap, 
  Plus, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Send, 
  Edit3, 
  TrendingUp, 
  Layers, 
  Play, 
  Pause
} from 'lucide-react';
import { CrmAutomation, LeadStage } from '../../../types';

interface CrmAutomacoesViewProps {
  automations: CrmAutomation[];
  onToggleAutomation: (automationId: string) => void;
  onTestAutomation: (automation: CrmAutomation) => void;
  onAddAutomation: (automation: CrmAutomation) => void;
}

export const CrmAutomacoesView: React.FC<CrmAutomacoesViewProps> = ({
  automations,
  onToggleAutomation,
  onTestAutomation,
  onAddAutomation
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<CrmAutomation | null>(null);

  // New form state
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('Lead cadastrado no sistema');
  const [channel, setChannel] = useState<'whatsapp' | 'email' | 'tarefa'>('whatsapp');
  const [delay, setDelay] = useState('Imediato (1 min)');
  const [targetStage, setTargetStage] = useState<LeadStage>('novo');
  const [messageTemplate, setMessageTemplate] = useState('');

  const activeCount = automations.filter(a => a.active).length;
  const totalDispatches = automations.reduce((acc, a) => acc + a.dispatchedCount, 0);

  const handleCreateAutomation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !messageTemplate) return;

    const newAuto: CrmAutomation = {
      id: `auto-${Date.now()}`,
      name,
      trigger,
      channel,
      delay,
      active: true,
      dispatchedCount: 0,
      openRate: '100%',
      conversionRate: '0%',
      targetStage,
      messageTemplate
    };

    onAddAutomation(newAuto);
    setShowAddModal(false);
    setName('');
    setMessageTemplate('');
  };

  return (
    <div className="space-y-5">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Automações Ativas</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">{activeCount} / {automations.length}</div>
          <span className="text-2xs text-emerald-600 font-medium">Piloto automático 24/7</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Disparos no Mês</span>
            <Send className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-blue-600">{totalDispatches}</div>
          <span className="text-2xs text-slate-500">WhatsApp & tarefas geradas</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Taxa Média de Abertura</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-600">97.8%</div>
          <span className="text-2xs text-slate-500">API Oficial Meta Cloud</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Conversão Atribuída</span>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-purple-600">46.2%</div>
          <span className="text-2xs text-slate-500">Leads convertidos após gatilho</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Fluxos Automáticos de Atendimento & Conversão
          </h3>
          <p className="text-xs text-slate-500">
            Mensagens instantâneas e lembretes automáticos para não deixar nenhum lead esfriar no funil
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          Criar Nova Automação
        </button>
      </div>

      {/* Automations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automations.map((auto) => (
          <div
            key={auto.id}
            className={`rounded-xl border p-4 shadow-2xs transition-all space-y-3 bg-white ${
              auto.active ? 'border-slate-200 hover:border-blue-400' : 'border-slate-200 bg-slate-50/50 opacity-70'
            }`}
          >
            {/* Header: Title & Switch */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${auto.active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {auto.name}
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-2xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3 w-3 text-slate-400" />
                    Etapa: <strong className="text-slate-700 uppercase">{auto.targetStage}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    Delay: <strong className="text-slate-700">{auto.delay}</strong>
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => onToggleAutomation(auto.id)}
                className={`flex items-center gap-1 text-2xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                  auto.active 
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
                title={auto.active ? 'Pausar automação' : 'Ativar automação'}
              >
                {auto.active ? (
                  <>
                    <Pause className="h-3 w-3" />
                    Ativa
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3" />
                    Pausada
                  </>
                )}
              </button>
            </div>

            {/* Trigger detail */}
            <div className="rounded-lg bg-slate-50 p-2 text-2xs text-slate-600 border border-slate-100">
              <span className="font-semibold text-slate-700">Gatilho: </span>
              {auto.trigger}
            </div>

            {/* Message Template Box */}
            <div className="space-y-1">
              <span className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">
                Modelo de Mensagem (WhatsApp):
              </span>
              <div className="rounded-lg bg-emerald-50/40 border border-emerald-100 p-2.5 text-xs text-slate-700 leading-relaxed font-mono text-2xs">
                {auto.messageTemplate}
              </div>
            </div>

            {/* Metrics Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-2xs">
              <div className="flex items-center gap-3 text-slate-500">
                <span>Disparos: <strong className="text-slate-800">{auto.dispatchedCount}</strong></span>
                <span>Abertura: <strong className="text-emerald-700">{auto.openRate}</strong></span>
                <span>Conversão: <strong className="text-blue-700">{auto.conversionRate}</strong></span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onTestAutomation(auto)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-medium"
                  title="Simular teste de envio"
                >
                  <Send className="h-3 w-3 text-slate-500" />
                  Testar
                </button>
                <button
                  onClick={() => setEditingAutomation(auto)}
                  className="p-1 rounded text-slate-400 hover:text-blue-600 transition-colors"
                  title="Editar modelo"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nova Automação */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Criar Nova Regra de Automação
            </h3>

            <form onSubmit={handleCreateAutomation} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nome da Automação
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Lembrete de Renovaçāo após 3 meses..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Canal de Disparo
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="whatsapp">WhatsApp Business</option>
                    <option value="tarefa">Gerar Tarefa Interna</option>
                    <option value="email">E-mail Transacional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Etapa Alvo
                  </label>
                  <select
                    value={targetStage}
                    onChange={(e) => setTargetStage(e.target.value as LeadStage)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="novo">Novo Lead</option>
                    <option value="agendado">Aula Agendada</option>
                    <option value="compareceu">Compareceu</option>
                    <option value="negociacao">Em Negociação</option>
                    <option value="matriculado">Matriculado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tempo de Espera (Delay)
                </label>
                <select
                  value={delay}
                  onChange={(e) => setDelay(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="Imediato (1 min)">Imediato (1 minuto após gatilho)</option>
                  <option value="2 horas antes">2 horas antes da aula</option>
                  <option value="3 horas após">3 horas após comparecer</option>
                  <option value="24 horas">24 horas depois</option>
                  <option value="48 horas">48 horas sem resposta</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Modelo da Mensagem (Suporta variáveis: {'{{nome}}'}, {'{{interesse}}'}, {'{{horario}}'})
                </label>
                <textarea
                  rows={4}
                  required
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  placeholder="Olá {{nome}}! Aqui é da academia VB SPORT..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Ativar Automação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
