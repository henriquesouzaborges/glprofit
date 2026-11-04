import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  MessageCircle,
  Kanban,
  HelpCircle,
  X,
  Palette,
  Hash,
  Filter
} from 'lucide-react';
import { WhatsappEtiqueta, WhatsappChat } from '../../../types';

interface WhatsappEtiquetaViewProps {
  etiquetas: WhatsappEtiqueta[];
  chats: WhatsappChat[];
  onAddEtiqueta: (etiqueta: Omit<WhatsappEtiqueta, 'id' | 'createdAt'>) => void;
  onUpdateEtiqueta: (id: string, etiqueta: Partial<WhatsappEtiqueta>) => void;
  onDeleteEtiqueta: (id: string) => void;
  onNavigateToAtendimentoWithEtiqueta?: (etiquetaName: string) => void;
  onNavigateToKanbanWithEtiqueta?: (etiquetaName: string) => void;
}

const PRESET_COLORS = [
  { hex: '#EF4444', label: 'Vermelho Intenso', bg: '#FEE2E2', text: '#991B1B' },
  { hex: '#F97316', label: 'Laranja Quente', bg: '#FFEDD5', text: '#9A3412' },
  { hex: '#F59E0B', label: 'Âmbar Alerta', bg: '#FEF3C7', text: '#92400E' },
  { hex: '#10B981', label: 'Esmeralda Sucesso', bg: '#D1FAE5', text: '#065F46' },
  { hex: '#06B6D4', label: 'Ciano Foco', bg: '#CFFAFE', text: '#155E75' },
  { hex: '#3B82F6', label: 'Azul Comercial', bg: '#DBEAFE', text: '#1E40AF' },
  { hex: '#6366F1', label: 'Índigo Corporativo', bg: '#E0E7FF', text: '#3730A3' },
  { hex: '#8B5CF6', label: 'Roxo VIP', bg: '#EDE9FE', text: '#5B21B6' },
  { hex: '#EC4899', label: 'Rosa Atenção', bg: '#FCE7F3', text: '#9D174D' },
  { hex: '#64748B', label: 'Slate Suporte', bg: '#F1F5F9', text: '#334155' },
  { hex: '#14B8A6', label: 'Teal Saúde', bg: '#CCFBF1', text: '#115E59' },
  { hex: '#84CC16', label: 'Lima Ativo', bg: '#ECFCCB', text: '#3F6212' },
];

export const WhatsappEtiquetasView: React.FC<WhatsappEtiquetaViewProps> = ({
  etiquetas,
  chats,
  onAddEtiqueta,
  onUpdateEtiqueta,
  onDeleteEtiqueta,
  onNavigateToAtendimentoWithEtiqueta,
  onNavigateToKanbanWithEtiqueta
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEtiqueta, setEditingEtiqueta] = useState<WhatsappEtiqueta | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [description, setDescription] = useState('');

  const openCreateModal = () => {
    setEditingEtiqueta(null);
    setName('');
    setColor('#3B82F6');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (etiqueta: WhatsappEtiqueta) => {
    setEditingEtiqueta(etiqueta);
    setName(etiqueta.name);
    setColor(etiqueta.color);
    setDescription(etiqueta.description || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Resolve matching preset or generate gentle background/text
    const matchedPreset = PRESET_COLORS.find(p => p.hex.toLowerCase() === color.toLowerCase());
    const bgColor = matchedPreset ? matchedPreset.bg : `${color}18`;
    const textColor = matchedPreset ? matchedPreset.text : color;

    if (editingEtiqueta) {
      onUpdateEtiqueta(editingEtiqueta.id, {
        name: name.trim(),
        color,
        bgColor,
        textColor,
        description: description.trim() || undefined
      });
    } else {
      onAddEtiqueta({
        name: name.trim(),
        color,
        bgColor,
        textColor,
        description: description.trim() || undefined
      });
    }

    setIsModalOpen(false);
    setEditingEtiqueta(null);
    setName('');
    setDescription('');
  };

  const handleDelete = (id: string, name: string) => {
    const usageCount = chats.filter(c => c.tags.includes(name)).length;
    let message = `Deseja realmente excluir a etiqueta "${name}"?`;
    if (usageCount > 0) {
      message = `A etiqueta "${name}" está associada a ${usageCount} conversa(s). Ao excluí-la, ela será desvinculada. Confirmar exclusão?`;
    }
    if (window.confirm(message)) {
      onDeleteEtiqueta(id);
    }
  };

  // Filter etiquetas by search term
  const filteredEtiquetas = etiquetas.filter(et => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      et.name.toLowerCase().includes(term) ||
      (et.description && et.description.toLowerCase().includes(term))
    );
  });

  // Calculate usage count for an etiqueta
  const getUsageCount = (etiquetaName: string) => {
    return chats.filter(c => c.tags.includes(etiquetaName)).length;
  };

  const totalTaggedChats = chats.filter(c => c.tags.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Gestão de Etiquetas de Atendimento</h2>
              <p className="text-xs text-slate-500">
                Configure cores, nomes e descrições para padronizar a identificação de clientes, funil Kanban e fluxos do WhatsApp.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            Nova Etiqueta
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total de Etiquetas</span>
            <Tag className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{etiquetas.length}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Prontas para uso nos atendimentos</span>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Conversas Marcadas</span>
            <MessageCircle className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">{totalTaggedChats}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">De {chats.length} contatos registrados</span>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Integrado ao Kanban</span>
            <Kanban className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 mt-2">100%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Filtros dinâmicos no funil</span>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Mais Utilizada</span>
            <Palette className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-sm font-bold text-slate-800 mt-2 truncate">
            {etiquetas.length > 0 ? (
              [...etiquetas].sort((a, b) => getUsageCount(b.name) - getUsageCount(a.name))[0]?.name || 'N/A'
            ) : 'Nenhuma'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Destaque operacional</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
          />
        </div>
        <div className="text-xs text-slate-500 w-full sm:w-auto text-right">
          Exibindo <span className="font-bold text-slate-800">{filteredEtiquetas.length}</span> de <span className="font-bold text-slate-800">{etiquetas.length}</span> etiquetas
        </div>
      </div>

      {/* Grid of Etiquetas */}
      {filteredEtiquetas.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-2xs">
          <Tag className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Nenhuma etiqueta encontrada</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm ? 'Tente buscar com outro termo ou limpe a busca.' : 'Crie sua primeira etiqueta para categorizar conversas e leads no WhatsApp.'}
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-700 text-white px-3 py-1.5 text-xs font-semibold hover:bg-blue-800"
          >
            <Plus className="h-4 w-4" />
            Criar Etiqueta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEtiquetas.map((et) => {
            const usage = getUsageCount(et.name);
            return (
              <div
                key={et.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Badge & Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      style={{
                        backgroundColor: et.bgColor || `${et.color}15`,
                        color: et.textColor || et.color,
                        borderColor: `${et.color}40`
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border shadow-2xs"
                    >
                      <span
                        style={{ backgroundColor: et.color }}
                        className="h-2 w-2 rounded-full shrink-0"
                      />
                      {et.name}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(et)}
                        className="p-1 rounded text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Editar etiqueta"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(et.id, et.name)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Excluir etiqueta"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-3">
                    <p className="text-xs text-slate-600 leading-relaxed min-h-10">
                      {et.description || (
                        <span className="text-slate-400 italic">Sem descrição definida.</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Footer Info & Shortcuts */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MessageCircle className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      <strong className="text-slate-800">{usage}</strong> {usage === 1 ? 'conversa' : 'conversas'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onNavigateToKanbanWithEtiqueta && (
                      <button
                        onClick={() => onNavigateToKanbanWithEtiqueta(et.name)}
                        className="text-[11px] font-semibold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                        title="Filtrar no Kanban"
                      >
                        <Kanban className="h-3 w-3" />
                        Kanban
                      </button>
                    )}
                    {onNavigateToAtendimentoWithEtiqueta && (
                      <button
                        onClick={() => onNavigateToAtendimentoWithEtiqueta(et.name)}
                        className="text-[11px] font-semibold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                        title="Filtrar no Atendimento"
                      >
                        <MessageCircle className="h-3 w-3" />
                        Atendimento
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Criar / Editar Etiqueta */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingEtiqueta ? 'Editar Etiqueta' : 'Nova Etiqueta de Atendimento'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome da Etiqueta <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lead Quente, Aluno VIP, Aguardando Pagamento..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Cor de Destaque</span>
                  <span className="font-mono text-[10px] text-slate-400">{color}</span>
                </label>

                {/* Preset circles */}
                <div className="grid grid-cols-6 gap-2 mb-2.5">
                  {PRESET_COLORS.map((preset) => {
                    const isSelected = color.toLowerCase() === preset.hex.toLowerCase();
                    return (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setColor(preset.hex)}
                        style={{ backgroundColor: preset.hex }}
                        className={`h-7 w-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-2xs ${
                          isSelected ? 'ring-2 ring-offset-2 ring-slate-900 scale-105' : ''
                        }`}
                        title={preset.label}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 text-white stroke-3" />}
                      </button>
                    );
                  })}
                </div>

                {/* Free color picker */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-8 w-10 rounded border border-slate-200 p-0.5 cursor-pointer bg-white"
                  />
                  <span className="text-[11px] text-slate-500">Selecione uma cor livre ou insira o código hexadecimal acima.</span>
                </div>
              </div>

              {/* Description (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Descrição / Diretrizes de Uso</span>
                  <span className="text-[10px] font-normal text-slate-400">Opcional</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Oriente a equipe sobre quando aplicar esta etiqueta (ex: aplicar quando o lead solicitar proposta de plano anual)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              {/* Live Preview */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Prévia da Etiqueta
                </span>
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      backgroundColor: `${color}18`,
                      color: color,
                      borderColor: `${color}40`
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border shadow-2xs"
                  >
                    <span
                      style={{ backgroundColor: color }}
                      className="h-2 w-2 rounded-full"
                    />
                    {name.trim() || 'Nome da Etiqueta'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Aparecerá assim nos cards do WhatsApp e no Kanban
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-700 hover:bg-blue-800 px-4 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer"
                >
                  {editingEtiqueta ? 'Salvar Alterações' : 'Criar Etiqueta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
