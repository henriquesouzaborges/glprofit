import React, { useState } from 'react';
import {
  Plus,
  MessageCircle,
  Phone,
  Tag,
  ArrowRight,
  ArrowLeft,
  User,
  Calendar,
  CreditCard,
  Search,
  Filter
} from 'lucide-react';
import { WhatsappChat, WhatsappEtiqueta } from '../../../types';
import { sendWhatsAppMessage } from '../../../utils';

interface WhatsappKanbanViewProps {
  chats: WhatsappChat[];
  etiquetas?: WhatsappEtiqueta[];
  onOpenChat: (chatId: string) => void;
  onUpdateChatStage: (chatId: string, stage: 'novos' | 'experimental' | 'proposta' | 'fechamento' | 'posvenda') => void;
  onAddNewContact: (newContact: Partial<WhatsappChat>) => void;
}

export const WhatsappKanbanView: React.FC<WhatsappKanbanViewProps> = ({
  chats,
  etiquetas,
  onOpenChat,
  onUpdateChatStage,
  onAddNewContact
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEtiqueta, setSelectedEtiqueta] = useState<string>('todas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPlan, setNewPlan] = useState('Plano Anual Black VIP');
  const [newStage, setNewStage] = useState<'novos' | 'experimental' | 'proposta' | 'fechamento' | 'posvenda'>('novos');
  const [newEtiqueta, setNewEtiqueta] = useState<string>('Lead Quente');

  const columns: {
    id: 'novos' | 'experimental' | 'proposta' | 'fechamento' | 'posvenda';
    title: string;
    badgeColor: string;
    borderColor: string;
  }[] = [
    { id: 'novos', title: '1. Novos Contatos', badgeColor: 'bg-blue-100 text-blue-800', borderColor: 'border-t-blue-500' },
    { id: 'experimental', title: '2. Aula Experimental', badgeColor: 'bg-indigo-100 text-indigo-800', borderColor: 'border-t-indigo-500' },
    { id: 'proposta', title: '3. Proposta / Negociação', badgeColor: 'bg-amber-100 text-amber-800', borderColor: 'border-t-amber-500' },
    { id: 'fechamento', title: '4. Matrícula Efetuada', badgeColor: 'bg-emerald-100 text-emerald-800', borderColor: 'border-t-emerald-500' },
    { id: 'posvenda', title: '5. Pós-Venda & Retenção', badgeColor: 'bg-purple-100 text-purple-800', borderColor: 'border-t-purple-500' },
  ];

  const filteredChats = chats.filter(chat => {
    if (selectedEtiqueta !== 'todas' && !chat.tags.includes(selectedEtiqueta)) {
      return false;
    }
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      chat.contactName.toLowerCase().includes(q) ||
      chat.contactPhone.toLowerCase().includes(q) ||
      chat.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const getChatsForStage = (stageId: 'novos' | 'experimental' | 'proposta' | 'fechamento' | 'posvenda') => {
    return filteredChats.filter(chat => {
      const current = chat.pipelineStage || 'novos';
      return current === stageId;
    });
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    onAddNewContact({
      id: `chat-${Date.now()}`,
      contactName: newName.trim(),
      contactPhone: newPhone.trim(),
      unreadCount: 0,
      lastMessage: 'Contato iniciado no funil WhatsApp.',
      lastMessageTime: 'Agora',
      status: 'aguardando',
      queue: 'comercial',
      assignedTo: 'carlos',
      tags: newEtiqueta ? [newEtiqueta] : ['Novo Lead'],
      pipelineStage: newStage,
      studentPlan: newPlan
    });

    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
  };

  const moveStage = (
    chatId: string,
    currentStage: 'novos' | 'experimental' | 'proposta' | 'fechamento' | 'posvenda',
    direction: 'prev' | 'next'
  ) => {
    const order: ('novos' | 'experimental' | 'proposta' | 'fechamento' | 'posvenda')[] = [
      'novos', 'experimental', 'proposta', 'fechamento', 'posvenda'
    ];
    const currentIndex = order.indexOf(currentStage);
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < order.length) {
      onUpdateChatStage(chatId, order[nextIndex]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>CRM Funil WhatsApp (Pipeline de Vendas)</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Sincronizado
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Acompanhe a evolução de leads do WhatsApp até o fechamento da matrícula na VB SPORT
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por nome ou etiqueta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs focus:border-blue-500 focus:outline-hidden w-48 sm:w-60"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            Novo Lead WhatsApp
          </button>
        </div>
      </div>

      {/* Filtro Dinâmico por Etiquetas */}
      {etiquetas && etiquetas.length > 0 && (
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2.5 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 shrink-0">
            <Tag className="h-3.5 w-3.5 text-slate-500" />
            <span>Filtrar por Etiqueta:</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => setSelectedEtiqueta('todas')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedEtiqueta === 'todas'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas ({chats.length})
            </button>
            {etiquetas.map(et => {
              const count = chats.filter(c => c.tags.includes(et.name)).length;
              const isSelected = selectedEtiqueta === et.name;
              return (
                <button
                  key={et.id}
                  onClick={() => setSelectedEtiqueta(isSelected ? 'todas' : et.name)}
                  style={{
                    backgroundColor: isSelected ? et.color : (et.bgColor || `${et.color}15`),
                    color: isSelected ? '#ffffff' : (et.textColor || et.color),
                    borderColor: `${et.color}40`
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                    isSelected ? 'ring-2 ring-offset-1 ring-slate-900' : 'hover:opacity-90'
                  }`}
                >
                  <span
                    style={{ backgroundColor: isSelected ? '#ffffff' : et.color }}
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                  />
                  <span>{et.name}</span>
                  <span className={`text-[10px] px-1 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-black/5 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 overflow-x-auto pb-2">
        {columns.map((col, colIdx) => {
          const stageChats = getChatsForStage(col.id);

          return (
            <div
              key={col.id}
              className={`rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col min-h-[500px] border-t-4 ${col.borderColor}`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {col.title}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                  {stageChats.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="p-2 space-y-2.5 flex-1 overflow-y-auto max-h-[620px]">
                {stageChats.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Nenhum lead nesta etapa.
                  </div>
                ) : (
                  stageChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs hover:shadow-md transition-all space-y-2 group"
                    >
                      {/* Card Top: Avatar, Name & Chat opener */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {chat.contactPhoto ? (
                            <img
                              src={chat.contactPhoto}
                              alt={chat.contactName}
                              className="h-7 w-7 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700 shrink-0">
                              {chat.contactName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {chat.contactName}
                            </h4>
                            <span className="text-[10px] font-mono text-slate-400 block truncate">
                              {chat.contactPhone}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => onOpenChat(chat.id)}
                          className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors shrink-0"
                          title="Abrir no Atendimento ao Vivo"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Snippet message */}
                      <div className="text-[11px] text-slate-500 line-clamp-2 bg-slate-50 p-1.5 rounded border border-slate-100 italic">
                        "{chat.lastMessage}"
                      </div>

                      {/* Plan / Value */}
                      {chat.studentPlan && (
                        <div className="text-[10px] font-semibold text-blue-700 truncate">
                          🎯 {chat.studentPlan}
                        </div>
                      )}

                      {/* Etiquetas */}
                      <div className="flex flex-wrap gap-1">
                        {chat.tags.map((tag, i) => {
                          const et = etiquetas?.find(e => e.name === tag);
                          return (
                            <span
                              key={i}
                              style={et ? {
                                backgroundColor: et.bgColor || `${et.color}15`,
                                color: et.textColor || et.color,
                                borderColor: `${et.color}35`
                              } : undefined}
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border inline-flex items-center gap-1 ${
                                !et ? 'bg-slate-100 text-slate-600 border-slate-200' : ''
                              }`}
                            >
                              {et && <span style={{ backgroundColor: et.color }} className="h-1.5 w-1.5 rounded-full" />}
                              {tag}
                            </span>
                          );
                        })}
                      </div>

                      {/* Stage Move Controls */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <button
                          disabled={colIdx === 0}
                          onClick={() => moveStage(chat.id, col.id, 'prev')}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                          title="Voltar etapa"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenChat(chat.id)}
                          className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <MessageCircle className="h-3 w-3" />
                          Abrir Conversa
                        </button>

                        <button
                          disabled={colIdx === columns.length - 1}
                          onClick={() => moveStage(chat.id, col.id, 'next')}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none"
                          title="Avançar etapa"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Lead to Funnel */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Adicionar Lead ao Funil WhatsApp</h3>
            <form onSubmit={handleCreateContact} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nome do Contato *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gabriela Ribeiro"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">WhatsApp / Telefone *</label>
                <input
                  type="text"
                  required
                  placeholder="+55 (11) 98888-7777"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Plano ou Modalidade de Interesse</label>
                <input
                  type="text"
                  placeholder="Ex: Plano Anual Black VIP ou Beach Tennis"
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Etiqueta do WhatsApp</label>
                <select
                  value={newEtiqueta}
                  onChange={(e) => setNewEtiqueta(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-blue-500 focus:outline-hidden"
                >
                  {etiquetas && etiquetas.length > 0 ? (
                    etiquetas.map(et => (
                      <option key={et.id} value={et.name}>
                        {et.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Lead Quente">Lead Quente</option>
                      <option value="Aluno VIP">Aluno VIP</option>
                      <option value="Aula Experimental">Aula Experimental</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Etapa Inicial</label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="novos">1. Novos Contatos</option>
                  <option value="experimental">2. Aula Experimental</option>
                  <option value="proposta">3. Proposta / Negociação</option>
                  <option value="fechamento">4. Matrícula Efetuada</option>
                  <option value="posvenda">5. Pós-Venda & Retenção</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-600"
                >
                  Criar Contato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
