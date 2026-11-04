import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Clock, 
  MapPin, 
  Users, 
  Calendar, 
  Plus, 
  Search, 
  Award, 
  Share2, 
  Phone,
  FileCheck
} from 'lucide-react';
import { CalendarEvent } from '../../../types';
import { sendWhatsAppMessage } from '../../../utils';

interface AgendaEventosViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onUpdateEventStatus: (eventId: string, newStatus: CalendarEvent['status']) => void;
  onOpenAddModalWithCategory?: (category: 'evento_diverso') => void;
}

export const AgendaEventosView: React.FC<AgendaEventosViewProps> = ({
  events,
  onAddEvent,
  onUpdateEventStatus,
  onOpenAddModalWithCategory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');

  // Filter category 'evento_diverso'
  const diversosEvents = useMemo(() => {
    return events.filter(e => e.category === 'evento_diverso');
  }, [events]);

  const filteredEventos = useMemo(() => {
    return diversosEvents.filter(evt => {
      const matchSearch = 
        evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (evt.description && evt.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (evt.instructorOrHost && evt.instructorOrHost.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchType = typeFilter === 'todos' || (evt.extraDetails?.eventType && evt.extraDetails.eventType === typeFilter);

      return matchSearch && matchType;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [diversosEvents, searchTerm, typeFilter]);

  return (
    <div className="space-y-5">
      {/* Top Banner / Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Workshops & Aulões</span>
            <Sparkles className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{diversosEvents.length}</div>
          <span className="text-2xs text-slate-500">Eventos culturais, técnicos e sociais</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Vagas Confirmadas</span>
            <Users className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {diversosEvents.reduce((acc, curr) => acc + (curr.enrolledOrConfirmedCount || 0), 0)} alunos
          </div>
          <span className="text-2xs text-slate-500">Participação da comunidade VB</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Certificados Emitidos</span>
            <FileCheck className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">2 eventos</div>
          <span className="text-2xs text-purple-700 font-medium">Com horas complementares</span>
        </div>
      </div>

      {/* Action and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[220px] flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por workshop, palestrante..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 focus:border-blue-500 focus:outline-hidden"
          >
            <option value="todos">Todos os Tipos de Eventos</option>
            <option value="workshop">Workshops & Palestras</option>
            <option value="aulao_especial">Aulões Especiais</option>
            <option value="confraternizacao">Festas & Confraternizações</option>
            <option value="clinica">Clínicas Técnicas</option>
          </select>
        </div>

        {onOpenAddModalWithCategory && (
          <button
            onClick={() => onOpenAddModalWithCategory('evento_diverso')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            Novo Evento Diverso / Workshop
          </button>
        )}
      </div>

      {/* Grid of Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEventos.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            Nenhum evento encontrado com os filtros selecionados.
          </div>
        ) : (
          filteredEventos.map((evt) => (
            <div
              key={evt.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-blue-400 transition-all space-y-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-2xs font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {evt.tag || 'Evento Especial'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {evt.title}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 shrink-0">
                  {evt.enrolledOrConfirmedCount || 0} / {evt.capacity || 50} vagas
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {evt.date.split('-').reverse().join('/')}
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {evt.startTime} às {evt.endTime}
                </div>
                <div className="col-span-2 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{evt.location}</span>
                </div>
                {evt.instructorOrHost && (
                  <div className="col-span-2 flex items-center gap-1.5 font-medium text-slate-700">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>Convidado / Resp: <strong>{evt.instructorOrHost}</strong></span>
                  </div>
                )}
              </div>

              {evt.description && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {evt.description}
                </p>
              )}

              {evt.extraDetails?.certificate && (
                <div className="flex items-center gap-2 text-xs bg-purple-50 text-purple-800 p-2.5 rounded-lg border border-purple-100">
                  <Award className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Inclui <strong>Certificado Digital de Participação</strong> para os presentes.</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-2xs text-slate-400 uppercase font-medium block">Entrada / Inscrição</span>
                  <span className="text-sm font-bold text-slate-900">
                    {evt.price ? `R$ ${evt.price.toFixed(2)}` : 'Gratuito / Alimento Solidário'}
                  </span>
                </div>

                {evt.contactPhone && (
                  <button
                    onClick={() => {
                      sendWhatsAppMessage(
                        evt.contactPhone!,
                        `Olá! Gostaria de saber mais sobre o evento "${evt.title}" na VB SPORT.`
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    WhatsApp
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
