import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  Plus, 
  Calendar, 
  Search, 
  CheckCircle2, 
  Phone,
  ShieldAlert
} from 'lucide-react';
import { CalendarEvent } from '../../../types';
import { sendWhatsAppMessage } from '../../../utils';

interface AgendaJogosViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onUpdateEventStatus: (eventId: string, newStatus: CalendarEvent['status']) => void;
  onOpenAddModalWithCategory?: (category: 'evento_jogo') => void;
}

export const AgendaJogosView: React.FC<AgendaJogosViewProps> = ({
  events,
  onAddEvent,
  onUpdateEventStatus,
  onOpenAddModalWithCategory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('todos');

  // Filter category 'evento_jogo'
  const jogosEvents = useMemo(() => {
    return events.filter(e => e.category === 'evento_jogo');
  }, [events]);

  const filteredJogos = useMemo(() => {
    return jogosEvents.filter(j => {
      const matchSearch = 
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (j.description && j.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        j.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSport = sportFilter === 'todos' || (j.extraDetails?.sport && j.extraDetails.sport.includes(sportFilter));

      return matchSearch && matchSport;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [jogosEvents, searchTerm, sportFilter]);

  return (
    <div className="space-y-5">
      {/* Top Banner / Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Torneios & Campeonatos</span>
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{jogosEvents.length}</div>
          <span className="text-2xs text-slate-500">Eventos esportivos e copas internas</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Atletas & Duplas Inscritas</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {jogosEvents.reduce((acc, curr) => acc + (curr.enrolledOrConfirmedCount || 0), 0)}
          </div>
          <span className="text-2xs text-slate-500">Participação total estimada</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Premiações e Troféus</span>
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">R$ 6.500+</div>
          <span className="text-2xs text-emerald-700 font-medium">Kits, suplementos e prêmios em dinheiro</span>
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
              placeholder="Buscar campeonato, torneio..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="todos">Todas as Modalidades</option>
            <option value="Society">Futebol Society</option>
            <option value="Beach Tennis">Beach Tennis</option>
            <option value="CrossFit">CrossFit & LPO</option>
            <option value="Futevôlei">Futevôlei</option>
          </select>
        </div>

        {onOpenAddModalWithCategory && (
          <button
            onClick={() => onOpenAddModalWithCategory('evento_jogo')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 shadow-xs transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            Novo Evento de Jogo / Torneio
          </button>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJogos.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            Nenhum evento de jogo ou torneio encontrado.
          </div>
        ) : (
          filteredJogos.map((jogo) => (
            <div
              key={jogo.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-amber-400 transition-all space-y-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                    <Trophy className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="text-2xs font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {jogo.extraDetails?.sport || 'Competição Esportiva'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {jogo.title}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shrink-0">
                  {jogo.enrolledOrConfirmedCount || 0} inscritos
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {jogo.date.split('-').reverse().join('/')}
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {jogo.startTime} às {jogo.endTime}
                </div>
                <div className="col-span-2 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{jogo.location}</span>
                </div>
              </div>

              {jogo.description && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {jogo.description}
                </p>
              )}

              {jogo.extraDetails?.prizes && (
                <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-100">
                  <Award className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Premiação: <strong>{jogo.extraDetails.prizes}</strong></span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-2xs text-slate-400 uppercase font-medium block">Inscrição / Taxa</span>
                  <span className="text-sm font-bold text-slate-900">
                    {jogo.price ? `R$ ${jogo.price.toFixed(2)} por atleta/dupla` : 'Inscrição Gratuita'}
                  </span>
                </div>

                {jogo.contactPhone && (
                  <button
                    onClick={() => {
                      sendWhatsAppMessage(
                        jogo.contactPhone!,
                        `Olá! Dúvida sobre o torneio "${jogo.title}" na VB SPORT.`
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Contato Coordenação
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
