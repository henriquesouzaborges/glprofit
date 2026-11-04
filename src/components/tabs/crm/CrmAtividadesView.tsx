import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Calendar, 
  Clock, 
  Plus, 
  Phone, 
  MessageSquare, 
  UserCheck, 
  AlertCircle, 
  Search, 
  Filter, 
  Trash2,
  CheckCircle2,
  FileText,
  Users
} from 'lucide-react';
import { CrmActivity, Lead } from '../../../types';
import { sendWhatsAppMessage } from '../../../utils';

interface CrmAtividadesViewProps {
  activities: CrmActivity[];
  leads: Lead[];
  onToggleActivityStatus: (activityId: string) => void;
  onAddActivity: (activity: CrmActivity) => void;
  onDeleteActivity: (activityId: string) => void;
}

export const CrmAtividadesView: React.FC<CrmAtividadesViewProps> = ({
  activities,
  leads,
  onToggleActivityStatus,
  onAddActivity,
  onDeleteActivity
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'concluida' | 'atrasada'>('todos');
  const [typeFilter, setTypeFilter] = useState<string>('todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [type, setType] = useState<CrmActivity['type']>('whatsapp');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('Hoje');
  const [dueTime, setDueTime] = useState('15:00');
  const [assignedTo, setAssignedTo] = useState('Ana Beatriz');

  // Stats
  const stats = useMemo(() => {
    const total = activities.length;
    const pendentes = activities.filter(a => a.status === 'pendente').length;
    const concluidas = activities.filter(a => a.status === 'concluida').length;
    const atrasadas = activities.filter(a => a.status === 'atrasada').length;
    const taxaCumprimento = total > 0 ? Math.round((concluidas / total) * 100) : 0;

    return { total, pendentes, concluidas, atrasadas, taxaCumprimento };
  }, [activities]);

  // Filtered
  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const matchSearch = 
        act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'todos' || act.status === statusFilter;
      const matchType = typeFilter === 'todos' || act.type === typeFilter;

      return matchSearch && matchStatus && matchType;
    });
  }, [activities, searchTerm, statusFilter, typeFilter]);

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newActivity: CrmActivity = {
      id: `act-${Date.now()}`,
      leadName: leadName || 'Oportunidade Geral',
      leadPhone: leadPhone,
      type,
      title,
      description,
      dueDate,
      dueTime,
      status: 'pendente',
      assignedTo,
      createdAt: 'Hoje'
    };

    onAddActivity(newActivity);
    setShowAddModal(false);
    // Reset
    setTitle('');
    setDescription('');
    setLeadName('');
    setLeadPhone('');
  };

  const getTypeBadge = (type: CrmActivity['type']) => {
    switch (type) {
      case 'ligacao':
        return (
          <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
            <Phone className="h-3 w-3" />
            Ligação
          </span>
        );
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
            <MessageSquare className="h-3 w-3" />
            WhatsApp
          </span>
        );
      case 'aula_experimental':
        return (
          <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-medium">
            <Calendar className="h-3 w-3" />
            Aula Experimental
          </span>
        );
      case 'visita':
        return (
          <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium">
            <Users className="h-3 w-3" />
            Visita Presencial
          </span>
        );
      case 'proposta':
        return (
          <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
            <FileText className="h-3 w-3" />
            Proposta Comercial
          </span>
        );
      case 'followup':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-medium">
            <Clock className="h-3 w-3" />
            Follow-up
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Tarefas Pendentes</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-blue-600">{stats.pendentes}</div>
          <span className="text-2xs text-slate-500">A fazer pela equipe</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Atrasadas</span>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-xl font-bold text-red-600">{stats.atrasadas}</div>
          <span className="text-2xs font-semibold text-red-600">Requerem atenção imediata</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Concluídas</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-600">{stats.concluidas}</div>
          <span className="text-2xs text-slate-500">Finalizadas com sucesso</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Taxa de Conclusão</span>
            <CheckSquare className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{stats.taxaCumprimento}%</div>
          <span className="text-2xs text-slate-500">Eficiência de follow-up</span>
        </div>
      </div>

      {/* Action Bar & Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por tarefa, lead ou consultor..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-hidden bg-slate-50/50"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Nova Atividade Comercial
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100 flex-wrap text-xs">
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">Status:</span>
            <div className="flex items-center gap-1">
              {(['todos', 'pendente', 'atrasada', 'concluida'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-2xs font-medium transition-colors ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'todos' ? 'Todas' : st === 'pendente' ? 'Pendentes' : st === 'atrasada' ? 'Atrasadas' : 'Concluídas'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-slate-500 font-medium">Tipo:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-hidden"
            >
              <option value="todos">Todos os tipos</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="ligacao">Ligação</option>
              <option value="aula_experimental">Aula Experimental</option>
              <option value="visita">Visita</option>
              <option value="followup">Follow-up</option>
              <option value="proposta">Proposta</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-2.5">
        {filteredActivities.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-2xs">
            <CheckSquare className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-800">Nenhuma atividade encontrada</p>
            <p className="text-xs text-slate-400 mt-1">Todas as tarefas foram concluídas ou nenhum filtro coincidiu.</p>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const isCompleted = activity.status === 'concluida';
            const isOverdue = activity.status === 'atrasada';

            return (
              <div
                key={activity.id}
                className={`rounded-xl border p-4 shadow-2xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isCompleted 
                    ? 'bg-slate-50/70 border-slate-200 opacity-75' 
                    : isOverdue 
                    ? 'bg-red-50/30 border-red-200' 
                    : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Checkbox and Main details */}
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => onToggleActivityStatus(activity.id)}
                    className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                      isCompleted 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'border-slate-300 hover:border-blue-500 bg-white'
                    }`}
                    title={isCompleted ? 'Marcar como pendente' : 'Marcar como concluída'}
                  >
                    {isCompleted && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-xs sm:text-sm font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {activity.title}
                      </h4>
                      {getTypeBadge(activity.type)}
                      {isOverdue && (
                        <span className="inline-flex items-center gap-0.5 text-2xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">
                          <AlertCircle className="h-3 w-3" />
                          Atrasada
                        </span>
                      )}
                    </div>

                    <p className={`text-xs ${isCompleted ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                      {activity.description}
                    </p>

                    <div className="flex items-center gap-3 text-2xs text-slate-500 pt-1 flex-wrap">
                      <span>Lead: <strong className="text-slate-700">{activity.leadName}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        Prazo: <strong className={isOverdue ? 'text-red-600 font-bold' : 'text-slate-700'}>{activity.dueDate} às {activity.dueTime}</strong>
                      </span>
                      <span>•</span>
                      <span>Responsável: <strong className="text-slate-700">{activity.assignedTo}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Quick actions for activity */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {activity.leadPhone && (
                    <>
                      <button
                        onClick={() => sendWhatsAppMessage(activity.leadPhone!, `Olá ${activity.leadName}! Sou da GL PRO FIT referente a: ${activity.title}`, activity.leadName)}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        title="Abrir no WhatsApp Interno"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>

                      <a
                        href={`tel:${activity.leadPhone.replace(/\D/g, '')}`}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        title="Ligar para o lead"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    </>
                  )}

                  <button
                    onClick={() => onDeleteActivity(activity.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Excluir tarefa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Nova Atividade */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-blue-600" />
              Agendar Nova Atividade Comercial
            </h3>

            <form onSubmit={handleCreateActivity} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Vincular ao Lead
                </label>
                <select
                  value={leadName}
                  onChange={(e) => {
                    const sel = leads.find(l => l.name === e.target.value);
                    setLeadName(e.target.value);
                    if (sel) setLeadPhone(sel.phone);
                  }}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="">Selecione um Lead existente ou digite...</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.name}>{l.name} - ({l.interest})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tipo de Atividade
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="whatsapp">Mensagem WhatsApp</option>
                  <option value="ligacao">Ligação Telefônica</option>
                  <option value="aula_experimental">Acompanhamento Aula Experimental</option>
                  <option value="visita">Visita Presencial / Tour</option>
                  <option value="followup">Follow-up Comercial</option>
                  <option value="proposta">Envio / Fechamento de Proposta</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Título da Tarefa
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Ligar para confirmar presença na aula das 18h..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Instruções / Descrição
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhes para o consultor ou recepção..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Data Limite
                  </label>
                  <select
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="Hoje">Hoje</option>
                    <option value="Amanhã">Amanhã</option>
                    <option value="Em 2 dias">Em 2 dias</option>
                    <option value="Próxima Segunda">Próxima Segunda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Responsável
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="Ana Beatriz">Ana Beatriz (Consultora Comercial)</option>
                  <option value="Gianluca M.">Gianluca Marinho (Gerente Geral)</option>
                  <option value="Recepção VB">Recepção Geral</option>
                </select>
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
                  Salvar Atividade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
