import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Search, 
  Calendar,
  Building,
  Filter
} from 'lucide-react';
import { CalendarEvent } from '../../../types';
import { sendWhatsAppMessage } from '../../../utils';

interface AgendaLocacoesViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onUpdateEventStatus: (eventId: string, newStatus: CalendarEvent['status']) => void;
  onOpenAddModalWithCategory?: (category: 'locacao') => void;
}

export const AgendaLocacoesView: React.FC<AgendaLocacoesViewProps> = ({
  events,
  onAddEvent,
  onUpdateEventStatus,
  onOpenAddModalWithCategory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<string>('todos');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('todos');

  // Filter only 'locacao'
  const locacoes = useMemo(() => {
    return events.filter(e => e.category === 'locacao');
  }, [events]);

  const filteredLocacoes = useMemo(() => {
    return locacoes.filter(loc => {
      const matchSearch = 
        loc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (loc.instructorOrHost && loc.instructorOrHost.toLowerCase().includes(searchTerm.toLowerCase())) ||
        loc.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSpace = selectedSpace === 'todos' || loc.location.includes(selectedSpace);
      const matchPayment = selectedPaymentStatus === 'todos' || loc.paymentStatus === selectedPaymentStatus;

      return matchSearch && matchSpace && matchPayment;
    }).sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  }, [locacoes, searchTerm, selectedSpace, selectedPaymentStatus]);

  // Metrics
  const totalRevenue = useMemo(() => {
    return locacoes.reduce((sum, item) => sum + (item.price || 0), 0);
  }, [locacoes]);

  const totalPaidRevenue = useMemo(() => {
    return locacoes
      .filter(l => l.paymentStatus === 'pago')
      .reduce((sum, item) => sum + (item.price || 0), 0);
  }, [locacoes]);

  const totalPendingRevenue = useMemo(() => {
    return locacoes
      .filter(l => l.paymentStatus === 'pendente')
      .reduce((sum, item) => sum + (item.price || 0), 0);
  }, [locacoes]);

  return (
    <div className="space-y-5">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total de Locações</span>
            <Building className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{locacoes.length}</div>
          <span className="text-2xs text-slate-500">Quadras, campos e salas</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Faturamento Estimado</span>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-2xs text-slate-500">Receita total de aluguéis</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Quitado / Recebido</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            R$ {totalPaidRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-2xs text-emerald-700 font-medium">Sinal e valor integral</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Pendente de Acerto</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            R$ {totalPendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-2xs text-amber-700 font-medium">Acerto no balcão / recepção</span>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[220px] flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por locatário, quadra..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Space filter */}
          <select
            value={selectedSpace}
            onChange={(e) => setSelectedSpace(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 focus:border-emerald-500 focus:outline-hidden"
          >
            <option value="todos">Todos os Espaços</option>
            <option value="Campo Society">Campo Society</option>
            <option value="Beach Tennis">Quadra Beach Tennis</option>
            <option value="Areia">Quadra Areia (Futevôlei)</option>
            <option value="Sala Multiuso">Sala Multiuso / Dança</option>
            <option value="Box CrossFit">Box CrossFit</option>
          </select>

          {/* Payment filter */}
          <select
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 focus:border-emerald-500 focus:outline-hidden"
          >
            <option value="todos">Todos os Pagamentos</option>
            <option value="pago">Quitados / Pagos</option>
            <option value="pendente">Pendentes</option>
          </select>
        </div>

        {onOpenAddModalWithCategory && (
          <button
            onClick={() => onOpenAddModalWithCategory('locacao')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            Nova Reserva de Espaço
          </button>
        )}
      </div>

      {/* Grid of Rentals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocacoes.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            Nenhuma locação encontrada com os filtros selecionados.
          </div>
        ) : (
          filteredLocacoes.map((loc) => {
            const isPaid = loc.paymentStatus === 'pago';
            return (
              <div
                key={loc.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-emerald-400 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {loc.tag || 'Locação'}
                    </span>

                    <span className={`text-2xs font-bold uppercase px-2 py-0.5 rounded-full ${
                      isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isPaid ? 'PAGO' : 'PENDENTE'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {loc.title}
                  </h4>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800">
                        {loc.date.split('-').reverse().join('/')}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium text-emerald-700">
                        <Clock className="h-3.5 w-3.5" />
                        {loc.startTime} às {loc.endTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{loc.location}</span>
                    </div>

                    {loc.instructorOrHost && (
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Locatário: <strong>{loc.instructorOrHost}</strong></span>
                      </div>
                    )}
                  </div>

                  {loc.description && (
                    <p className="text-2xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2">
                      {loc.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-2xs text-slate-400 uppercase font-medium block">Valor da Locação</span>
                    <span className="text-base font-bold text-emerald-700">
                      R$ {(loc.price || 0).toFixed(2)}
                    </span>
                  </div>

                  {loc.contactPhone && (
                    <button
                      onClick={() => {
                        sendWhatsAppMessage(
                          loc.contactPhone!,
                          `Olá ${loc.instructorOrHost || ''}! Informações da VB SPORT sobre sua locação no dia ${loc.date.split('-').reverse().join('/')} (${loc.startTime} - ${loc.endTime}).`
                        );
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                    >
                      <Phone className="h-3 w-3" />
                      WhatsApp
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
