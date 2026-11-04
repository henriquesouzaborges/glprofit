import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  Search,
  MessageSquare
} from 'lucide-react';
import { WhatsappQuickReply } from '../../../types';
import { INITIAL_WHATSAPP_QUICK_REPLIES } from '../../../mockWhatsappData';

interface WhatsappRespostasRapidasViewProps {
  onSelectQuickReply?: (text: string) => void;
}

export const WhatsappRespostasRapidasView: React.FC<WhatsappRespostasRapidasViewProps> = ({
  onSelectQuickReply
}) => {
  const [replies, setReplies] = useState<WhatsappQuickReply[]>(INITIAL_WHATSAPP_QUICK_REPLIES);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form
  const [newShortcut, setNewShortcut] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Vendas');
  const [newMessage, setNewMessage] = useState('');

  const filtered = replies.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.shortcut.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.message.toLowerCase().includes(q)
    );
  });

  const handleCopy = (r: WhatsappQuickReply) => {
    navigator.clipboard.writeText(r.message);
    setCopiedId(r.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setReplies(prev => prev.filter(r => r.id !== id));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShortcut.trim() || !newTitle.trim() || !newMessage.trim()) return;

    const formattedShortcut = newShortcut.startsWith('/') ? newShortcut.trim() : `/${newShortcut.trim()}`;
    const newQR: WhatsappQuickReply = {
      id: `qr-${Date.now()}`,
      shortcut: formattedShortcut,
      title: newTitle.trim(),
      category: newCategory,
      message: newMessage.trim()
    };

    setReplies(prev => [newQR, ...prev]);
    setShowAddModal(false);
    setNewShortcut('');
    setNewTitle('');
    setNewMessage('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-700" />
            <span>Modelos de Mensagem & Respostas Rápidas (/)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Mensagens pré-cadastradas que seus atendentes podem acionar digitando a barra / no chat
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar atalho ou texto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs focus:border-blue-500 focus:outline-hidden w-52"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo Atalho
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((qr) => (
          <div
            key={qr.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {qr.shortcut}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {qr.category}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">{qr.title}</h4>
              <div className="text-xs text-slate-600 whitespace-pre-line bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed max-h-36 overflow-y-auto">
                {qr.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => handleCopy(qr)}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
              >
                {copiedId === qr.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copiar texto</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDelete(qr.id)}
                className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                title="Excluir resposta rápida"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Nova Resposta Rápida</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Atalho (Começa com /) *</label>
                  <input
                    type="text"
                    required
                    placeholder="/promocao"
                    value={newShortcut}
                    onChange={(e) => setNewShortcut(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 focus:border-blue-500 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="Vendas">Vendas</option>
                    <option value="Atendimento">Atendimento</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Suporte">Suporte</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Título Resumido *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tabela de Preços e Benefícios"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Texto da Mensagem *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Digite a mensagem que será enviada no WhatsApp..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-blue-500 focus:outline-hidden"
                />
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
                  Salvar Resposta Rápida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
