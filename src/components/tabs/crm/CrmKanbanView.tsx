import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Phone, 
  ArrowRight, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  Share2
} from 'lucide-react';
import { Lead, LeadStage } from '../../../types';
import { formatCurrency, sendWhatsAppMessage } from '../../../utils';

interface CrmKanbanViewProps {
  leads: Lead[];
  onUpdateLeadStage: (leadId: string, newStage: LeadStage) => void;
  onConvertLeadToStudent: (lead: Lead) => void;
  onOpenNewLeadModal: () => void;
}

export const CrmKanbanView: React.FC<CrmKanbanViewProps> = ({
  leads,
  onUpdateLeadStage,
  onConvertLeadToStudent,
  onOpenNewLeadModal
}) => {
  const [filterInterest, setFilterInterest] = useState('todos');

  const stages: { 
    id: LeadStage; 
    title: string; 
    colorHeader: string; 
    badgeColor: string; 
    dotColor: string;
    description: string;
  }[] = [
    { 
      id: 'novo', 
      title: 'Novo Lead', 
      colorHeader: 'border-t-blue-500', 
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200', 
      dotColor: 'bg-blue-500',
      description: 'Primeiro contato realizado' 
    },
    { 
      id: 'agendado', 
      title: 'Aula Agendada', 
      colorHeader: 'border-t-indigo-500', 
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200', 
      dotColor: 'bg-indigo-500',
      description: 'Experimental marcada' 
    },
    { 
      id: 'compareceu', 
      title: 'Compareceu', 
      colorHeader: 'border-t-amber-500', 
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200', 
      dotColor: 'bg-amber-500',
      description: 'Treinou na academia' 
    },
    { 
      id: 'negociacao', 
      title: 'Em Negociação', 
      colorHeader: 'border-t-cyan-500', 
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200', 
      dotColor: 'bg-cyan-500',
      description: 'Proposta enviada' 
    },
    { 
      id: 'matriculado', 
      title: 'Matriculado', 
      colorHeader: 'border-t-emerald-500', 
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
      dotColor: 'bg-emerald-500',
      description: 'Contrato fechado' 
    },
  ];

  const getNextStage = (current: LeadStage): LeadStage | null => {
    const order: LeadStage[] = ['novo', 'agendado', 'compareceu', 'negociacao', 'matriculado'];
    const idx = order.indexOf(current);
    if (idx !== -1 && idx < order.length - 1) {
      return order[idx + 1];
    }
    return null;
  };

  const filteredLeads = filterInterest === 'todos' 
    ? leads 
    : leads.filter(l => l.interest.toLowerCase().includes(filterInterest.toLowerCase()));

  return (
    <div className="space-y-4">
      {/* Sub-header inside Kanban view */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-700">Filtrar por Modalidade:</span>
          <select
            value={filterInterest}
            onChange={(e) => setFilterInterest(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-50 text-slate-700 focus:border-blue-500 focus:outline-hidden"
          >
            <option value="todos">Todas as modalidades</option>
            <option value="Musculação">Musculação</option>
            <option value="CrossFit">CrossFit</option>
            <option value="Spinning">Spinning</option>
            <option value="Pilates">Pilates</option>
            <option value="Muay Thai">Muay Thai / Lutas</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500">
            Total no Funil: <strong className="text-slate-800">{filteredLeads.length} oportunidades</strong>
          </div>
          <button
            onClick={onOpenNewLeadModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar ao Kanban
          </button>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 overflow-x-auto pb-4 items-start">
        {stages.map((stage) => {
          const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
          const columnTotal = stageLeads.reduce((sum, l) => sum + (l.valueExpected || 119.90), 0);

          return (
            <div
              key={stage.id}
              className={`flex flex-col rounded-xl border border-slate-200 bg-slate-50/70 p-3 min-w-[260px] border-t-4 ${stage.colorHeader}`}
            >
              {/* Column Header */}
              <div className="pb-2.5 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${stage.dotColor}`}></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      {stage.title}
                    </span>
                  </div>
                  <span className={`rounded-md border px-2 py-0.5 text-2xs font-bold ${stage.badgeColor}`}>
                    {stageLeads.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-2xs text-slate-500 mt-1">
                  <span>{stage.description}</span>
                  <span className="font-semibold text-slate-700">{formatCurrency(columnTotal)}</span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="mt-3 space-y-2.5 min-h-[420px]">
                {stageLeads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-slate-400 border border-dashed border-slate-200 rounded-lg p-3 text-center">
                    <p className="text-2xs font-medium">Nenhum lead nesta etapa</p>
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const next = getNextStage(lead.stage);

                    return (
                      <div
                        key={lead.id}
                        className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5 relative group"
                      >
                        {/* Header: Lead Name & Expected Value */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs hover:text-blue-600 transition-colors">
                              {lead.name}
                            </h4>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-2xs text-slate-500 font-medium">
                                {lead.phone}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-2xs font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                              {formatCurrency(lead.valueExpected || 119.90)}
                            </span>
                          </div>
                        </div>

                        {/* Modality Interest & Source */}
                        <div className="flex flex-wrap gap-1 items-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-2xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                            {lead.interest}
                          </span>
                          {lead.source && (
                            <span className="inline-flex items-center gap-0.5 text-2xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              <Share2 className="h-2.5 w-2.5 text-slate-400" />
                              {lead.source}
                            </span>
                          )}
                        </div>

                        {/* Scheduled Date badge if applicable */}
                        {lead.scheduledDate && (
                          <div className="flex items-center gap-1 text-2xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded">
                            <Calendar className="h-3 w-3" />
                            <span>Aula: <strong>{lead.scheduledDate}</strong></span>
                          </div>
                        )}

                        {/* Notes snippet */}
                        {lead.notes && (
                          <p className="text-2xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 leading-relaxed italic">
                            "{lead.notes}"
                          </p>
                        )}

                        {/* Footer: Dates & Quick Actions */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-2xs">
                          <div className="flex items-center gap-1 text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span>{lead.lastContact || lead.createdAt}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* WhatsApp Button */}
                            <button
                              onClick={() => sendWhatsAppMessage(lead.phone, `Olá ${lead.name}! Sou da GL PRO FIT. Como estão seus planos para treinar conosco?`, lead.name)}
                              className="p-1 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Abrir no WhatsApp Interno"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                            </button>

                            {/* Call Button */}
                            <a
                              href={`tel:${lead.phone.replace(/\D/g, '')}`}
                              className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Ligar"
                            >
                              <Phone className="h-3.5 w-3.5" />
                            </a>

                            {/* Advance Stage button */}
                            {next && (
                              <button
                                onClick={() => onUpdateLeadStage(lead.id, next)}
                                className="flex items-center gap-1 text-2xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                                title={`Avançar para ${next}`}
                              >
                                <span>Avançar</span>
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            )}

                            {/* Convert to student */}
                            {lead.stage !== 'matriculado' && (
                              <button
                                onClick={() => onConvertLeadToStudent(lead)}
                                className="p-1 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Converter em Aluno Matriculado"
                              >
                                <UserCheck className="h-3.5 w-3.5" />
                              </button>
                            )}

                            {lead.stage === 'matriculado' && (
                              <span className="flex items-center gap-0.5 text-2xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                <CheckCircle2 className="h-3 w-3" />
                                Aluno
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Move stage dropdown */}
                        <div className="pt-1 border-t border-slate-100/50 flex items-center justify-between text-2xs text-slate-400">
                          <span>Mover para:</span>
                          <select
                            value={lead.stage}
                            onChange={(e) => onUpdateLeadStage(lead.id, e.target.value as LeadStage)}
                            className="text-2xs border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50 text-slate-600 focus:outline-hidden"
                          >
                            <option value="novo">Novo Lead</option>
                            <option value="agendado">Aula Agendada</option>
                            <option value="compareceu">Compareceu</option>
                            <option value="negociacao">Em Negociação</option>
                            <option value="matriculado">Matriculado</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
