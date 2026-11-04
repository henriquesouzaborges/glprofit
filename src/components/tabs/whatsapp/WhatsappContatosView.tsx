import React, { useState } from 'react';
import {
  Search,
  Plus,
  MessageCircle,
  Phone,
  Tag,
  Download,
  Upload,
  User,
  ExternalLink,
  Filter
} from 'lucide-react';
import { WhatsappChat, Student, Lead } from '../../../types';
import { sendWhatsAppMessage } from '../../../utils';

interface WhatsappContatosViewProps {
  chats: WhatsappChat[];
  students?: Student[];
  leads?: Lead[];
  onOpenChat: (chatId: string) => void;
  onAddNewContact: (newContact: Partial<WhatsappChat>) => void;
}

export const WhatsappContatosView: React.FC<WhatsappContatosViewProps> = ({
  chats,
  students = [],
  leads = [],
  onOpenChat,
  onAddNewContact
}) => {
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('todas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tag, setTag] = useState('Aluno');

  // Collect all unique tags
  const allTags = Array.from(new Set(chats.flatMap(c => c.tags)));

  const filteredChats = chats.filter(c => {
    if (tagFilter !== 'todas' && !c.tags.includes(tagFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.contactName.toLowerCase().includes(q) ||
        c.contactPhone.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onAddNewContact({
      id: `chat-${Date.now()}`,
      contactName: name.trim(),
      contactPhone: phone.trim(),
      unreadCount: 0,
      lastMessage: 'Contato adicionado na agenda WhatsApp.',
      lastMessageTime: 'Agora',
      status: 'atendimento',
      queue: 'geral',
      assignedTo: 'juliana',
      tags: [tag, 'Agenda WhatsApp'],
      pipelineStage: 'novos'
    });

    setShowAddModal(false);
    setName('');
    setPhone('');
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Agenda de Contatos WhatsApp ({chats.length})
          </h3>
          <p className="text-xs text-slate-500">
            Base integrada de alunos matriculados e leads com WhatsApp sincronizado
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, número..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs focus:border-blue-500 focus:outline-hidden w-52"
            />
          </div>

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-hidden bg-white text-slate-700"
          >
            <option value="todas">Todas as Tags</option>
            {allTags.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo Contato
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                <th className="p-3">Contato</th>
                <th className="p-3">Telefone / WhatsApp</th>
                <th className="p-3">Plano / Interesse</th>
                <th className="p-3">Etiquetas (Tags)</th>
                <th className="p-3">Fila & Atendente</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChats.map((chat) => (
                <tr key={chat.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-semibold text-slate-900 flex items-center gap-2.5">
                    {chat.contactPhoto ? (
                      <img
                        src={chat.contactPhoto}
                        alt={chat.contactName}
                        className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                        {chat.contactName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-slate-900">{chat.contactName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        Última msg: {chat.lastMessageTime}
                      </div>
                    </div>
                  </td>

                  <td className="p-3 font-mono text-slate-600">
                    {chat.contactPhone}
                  </td>

                  <td className="p-3 text-slate-700">
                    {chat.studentPlan || 'Aluno VB SPORT'}
                  </td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {chat.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-slate-100 text-slate-600 px-1.5 py-0.5 text-[10px] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-3 text-slate-600 capitalize">
                    <span className="font-semibold text-slate-800">{chat.queue}</span>
                    <span className="text-[10px] text-slate-400 block">
                      Resp: {chat.assignedTo || 'Geral'}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenChat(chat.id)}
                        className="rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1 text-xs font-bold transition-colors flex items-center gap-1.5"
                        title="Abrir no atendimento interno"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Abrir Atendimento
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Novo Contato WhatsApp</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Amanda Albuquerque"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Número WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="+55 (11) 98888-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Etiqueta Principal</label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="Aluno Ativo">Aluno Ativo</option>
                  <option value="Lead Quente">Lead Quente</option>
                  <option value="Inadimplente">Inadimplente</option>
                  <option value="Ex-Aluno">Ex-Aluno</option>
                  <option value="Visitante">Visitante</option>
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
                  Salvar Contato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
