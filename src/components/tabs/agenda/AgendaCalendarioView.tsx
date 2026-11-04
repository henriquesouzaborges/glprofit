import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Trophy, 
  Sparkles, 
  Dumbbell, 
  Share2, 
  Phone, 
  X, 
  Eye, 
  CalendarDays,
  ListFilter,
  Check
} from 'lucide-react';
import { CalendarEvent, CalendarEventCategory } from '../../../types';
import { sendWhatsAppMessage } from '../../../utils';

interface AgendaCalendarioViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onUpdateEventStatus: (eventId: string, newStatus: CalendarEvent['status']) => void;
  onDeleteEvent: (eventId: string) => void;
}

const CATEGORY_CONFIG: Record<CalendarEventCategory, {
  label: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderCol: string;
  dotColor: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  grade_turma: {
    label: 'Grade de Horário / Turmas',
    color: 'bg-purple-500',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    borderCol: 'border-purple-200',
    dotColor: 'bg-purple-500',
    icon: Dumbbell
  },
  locacao: {
    label: 'Locações',
    color: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    borderCol: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
    icon: DollarSign
  },
  evento_jogo: {
    label: 'Eventos de Jogos',
    color: 'bg-amber-500',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    borderCol: 'border-amber-200',
    dotColor: 'bg-amber-500',
    icon: Trophy
  },
  evento_diverso: {
    label: 'Eventos Diversos',
    color: 'bg-blue-500',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    borderCol: 'border-blue-200',
    dotColor: 'bg-blue-500',
    icon: Sparkles
  }
};

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const AgendaCalendarioView: React.FC<AgendaCalendarioViewProps> = ({
  events,
  onAddEvent,
  onUpdateEventStatus,
  onDeleteEvent
}) => {
  // Current calendar state: default to September 2026 (local context date)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 is September (0-indexed)
  const [selectedDayDate, setSelectedDayDate] = useState<string>('2026-09-03'); // 'YYYY-MM-DD'
  const [viewMode, setViewMode] = useState<'mes' | 'semana' | 'lista'>('mes');

  // Filter categories: multiple selection or all
  const [activeCategories, setActiveCategories] = useState<Record<CalendarEventCategory, boolean>>({
    grade_turma: true,
    locacao: true,
    evento_jogo: true,
    evento_diverso: true
  });

  // Modal State for New Event
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<CalendarEvent | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<CalendarEventCategory>('locacao');
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('2026-09-03');
  const [formStartTime, setFormStartTime] = useState('18:00');
  const [formEndTime, setFormEndTime] = useState('19:00');
  const [formLocation, setFormLocation] = useState('Campo Society 1 (Grama Sintética)');
  const [formHost, setFormHost] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formPaymentStatus, setFormPaymentStatus] = useState<'pago' | 'pendente' | 'cortesia' | 'incluso'>('pago');
  const [formCapacity, setFormCapacity] = useState('20');
  const [formDescription, setFormDescription] = useState('');
  const [formExtraSport, setFormExtraSport] = useState('Beach Tennis');
  const [formExtraType, setFormExtraType] = useState('workshop');

  // Navigate Months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(8);
    setSelectedDayDate('2026-09-03');
  };

  // Toggle category filter
  const toggleCategory = (cat: CalendarEventCategory) => {
    setActiveCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const handleSelectAllCategories = () => {
    const allActive = Object.values(activeCategories).every(Boolean);
    setActiveCategories({
      grade_turma: !allActive,
      locacao: !allActive,
      evento_jogo: !allActive,
      evento_diverso: !allActive
    });
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(evt => activeCategories[evt.category]);
  }, [events, activeCategories]);

  // Metrics for Current Month
  const currentMonthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const monthEvents = useMemo(() => {
    return events.filter(e => e.date.startsWith(currentMonthKey));
  }, [events, currentMonthKey]);

  const stats = useMemo(() => {
    const totalMonth = monthEvents.length;
    const turmasCount = monthEvents.filter(e => e.category === 'grade_turma').length;
    const locacoes = monthEvents.filter(e => e.category === 'locacao');
    const locacoesCount = locacoes.length;
    const locacoesRevenue = locacoes.reduce((acc, curr) => acc + (curr.price || 0), 0);
    const jogosCount = monthEvents.filter(e => e.category === 'evento_jogo').length;
    const diversosCount = monthEvents.filter(e => e.category === 'evento_diverso').length;

    return { totalMonth, turmasCount, locacoesCount, locacoesRevenue, jogosCount, diversosCount };
  }, [monthEvents]);

  // Calendar Grid Generation
  const calendarGrid = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Previous month filler days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum,
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: true
      });
    }

    // Next month filler days to complete grid (multiples of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: false
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Events of Selected Day
  const selectedDayEvents = useMemo(() => {
    return filteredEvents.filter(e => e.date === selectedDayDate).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [filteredEvents, selectedDayDate]);

  // Format Selected Day Display
  const formattedSelectedDay = useMemo(() => {
    if (!selectedDayDate) return '';
    const parts = selectedDayDate.split('-');
    if (parts.length !== 3) return selectedDayDate;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const dateObj = new Date(y, m, d);
    const dayName = WEEK_DAYS[dateObj.getDay()];
    return `${dayName}, ${d} de ${MONTH_NAMES[m]} de ${y}`;
  }, [selectedDayDate]);

  // Handle New Event Submit
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDate || !formStartTime || !formEndTime) return;

    const newEvt: CalendarEvent = {
      id: `cal-evt-${Date.now()}`,
      title: formTitle,
      category: formCategory,
      date: formDate,
      startTime: formStartTime,
      endTime: formEndTime,
      location: formLocation,
      instructorOrHost: formHost || undefined,
      contactPhone: formPhone || undefined,
      price: formPrice ? parseFloat(formPrice) : undefined,
      paymentStatus: formPrice ? formPaymentStatus : undefined,
      capacity: formCapacity ? parseInt(formCapacity, 10) : undefined,
      enrolledOrConfirmedCount: 0,
      description: formDescription || undefined,
      status: 'confirmado',
      tag: formCategory === 'locacao' ? 'Locação Privada' : formCategory === 'evento_jogo' ? formExtraSport : 'Evento',
      extraDetails: {
        sport: formCategory === 'evento_jogo' ? formExtraSport : undefined,
        eventType: formCategory === 'evento_diverso' ? formExtraType : undefined,
        renterName: formCategory === 'locacao' ? formHost : undefined
      }
    };

    onAddEvent(newEvt);
    setShowAddModal(false);

    // Reset Form
    setFormTitle('');
    setFormHost('');
    setFormPhone('');
    setFormPrice('');
    setFormDescription('');
  };

  return (
    <div className="space-y-5">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Turmas da Grade</span>
            <Dumbbell className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-purple-700">{stats.turmasCount} aulas</div>
          <span className="text-2xs text-slate-500">Cross, Spinning, Muay Thai & Pilates</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Locações de Espaços</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-600">{stats.locacoesCount} reservas</div>
          <span className="text-2xs text-emerald-700 font-medium">
            R$ {stats.locacoesRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} faturado
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Eventos de Jogos</span>
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600">{stats.jogosCount} torneios</div>
          <span className="text-2xs text-slate-500">Copa Society, Beach Tennis & Cross</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Eventos Diversos</span>
            <Sparkles className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-blue-600">{stats.diversosCount} eventos</div>
          <span className="text-2xs text-slate-500">Workshops, Aulões & Confras</span>
        </div>
      </div>

      {/* Control Bar: Categories Filter & New Event Button */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              Calendário Geral de Atividades & Espaços
            </h3>
            <p className="text-xs text-slate-500">
              Visualize e filtre a programação de turmas, locações de quadras, campeonatos e eventos
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors"
            >
              <Plus className="h-4 w-4" />
              Novo Agendamento / Evento
            </button>
          </div>
        </div>

        {/* Category Filters Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" />
            Filtros:
          </span>

          {(['grade_turma', 'locacao', 'evento_jogo', 'evento_diverso'] as CalendarEventCategory[]).map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const Icon = config.icon;
            const isActive = activeCategories[cat];
            const count = events.filter(e => e.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isActive
                    ? `${config.badgeBg} ${config.badgeText} ${config.borderCol} shadow-2xs`
                    : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isActive ? config.color : 'bg-slate-300'}`} />
                <Icon className="h-3.5 w-3.5" />
                <span>{config.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-2xs ${isActive ? 'bg-white/70 font-bold' : 'bg-slate-200 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}

          <button
            onClick={handleSelectAllCategories}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-auto px-2 py-1 rounded hover:bg-blue-50 transition-colors"
          >
            {Object.values(activeCategories).every(Boolean) ? 'Desmarcar Todos' : 'Marcar Todos'}
          </button>
        </div>
      </div>

      {/* Main Calendar View: Month Grid + Day Inspector Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Calendar Grid (8 cols on lg) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
          {/* Calendar Header Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={handleGoToday}
                className="px-2.5 py-1 rounded-md text-2xs font-bold uppercase bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                Hoje
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                  title="Mês anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                  title="Próximo mês"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* View Switcher */}
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium">
                <button
                  onClick={() => setViewMode('mes')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    viewMode === 'mes' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mês
                </button>
                <button
                  onClick={() => setViewMode('lista')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    viewMode === 'lista' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lista
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'mes' ? (
            <div className="space-y-1">
              {/* Day names header */}
              <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-slate-500 pb-1">
                {WEEK_DAYS.map(day => (
                  <div key={day} className="py-1">{day}</div>
                ))}
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {calendarGrid.map((day, idx) => {
                  const dayEvents = filteredEvents.filter(e => e.date === day.dateStr);
                  const isSelected = selectedDayDate === day.dateStr;
                  const isToday = day.dateStr === '2026-09-03';

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDayDate(day.dateStr)}
                      className={`min-h-[85px] sm:min-h-[96px] rounded-lg border p-1.5 flex flex-col justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/20 shadow-xs'
                          : day.isCurrentMonth
                          ? 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                          : 'border-slate-100 bg-slate-50/50 text-slate-300 opacity-60'
                      }`}
                    >
                      {/* Day number & indicators */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold inline-flex items-center justify-center h-5 w-5 rounded-full ${
                            isToday
                              ? 'bg-blue-600 text-white'
                              : isSelected
                              ? 'text-blue-600 font-black'
                              : day.isCurrentMonth
                              ? 'text-slate-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {day.dayNum}
                        </span>

                        {dayEvents.length > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      {/* Mini Events List inside cell */}
                      <div className="space-y-1 mt-1 overflow-hidden">
                        {dayEvents.slice(0, 2).map((evt) => {
                          const config = CATEGORY_CONFIG[evt.category];
                          return (
                            <div
                              key={evt.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDayDate(evt.date);
                                setSelectedEventForDetails(evt);
                              }}
                              className={`truncate rounded px-1 py-0.5 text-[10px] font-medium border ${config.badgeBg} ${config.badgeText} ${config.borderCol} flex items-center gap-1 hover:brightness-95`}
                              title={`${evt.startTime} - ${evt.title} (${config.label})`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.color}`} />
                              <span className="font-semibold shrink-0">{evt.startTime}</span>
                              <span className="truncate">{evt.title}</span>
                            </div>
                          );
                        })}

                        {dayEvents.length > 2 && (
                          <div className="text-[9px] font-bold text-slate-500 text-center bg-slate-100 rounded py-0.2">
                            +{dayEvents.length - 2} outros
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Lista view */
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {monthEvents.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Nenhum evento agendado para este mês com os filtros selecionados.
                </div>
              ) : (
                monthEvents
                  .filter(e => activeCategories[e.category])
                  .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
                  .map((evt) => {
                    const config = CATEGORY_CONFIG[evt.category];
                    const Icon = config.icon;
                    return (
                      <div
                        key={evt.id}
                        onClick={() => {
                          setSelectedDayDate(evt.date);
                          setSelectedEventForDetails(evt);
                        }}
                        className="rounded-lg border border-slate-200 p-3 hover:border-blue-400 transition-all cursor-pointer flex items-center justify-between gap-3 bg-white"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${config.badgeBg} ${config.badgeText} border ${config.borderCol}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-2xs font-bold uppercase px-1.5 py-0.5 rounded ${config.badgeBg} ${config.badgeText}`}>
                                {config.label}
                              </span>
                              <span className="text-xs font-bold text-slate-900">{evt.title}</span>
                            </div>
                            <div className="flex items-center gap-3 text-2xs text-slate-500 mt-1">
                              <span className="flex items-center gap-1 font-semibold text-slate-700">
                                <Clock className="h-3 w-3 text-slate-400" />
                                {evt.date.split('-').reverse().join('/')} • {evt.startTime} - {evt.endTime}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-slate-400" />
                                {evt.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {evt.price !== undefined && (
                            <span className="text-xs font-bold text-emerald-700 block">
                              {evt.price > 0 ? `R$ ${evt.price.toFixed(2)}` : 'Gratuito'}
                            </span>
                          )}
                          <span className={`text-2xs font-medium ${
                            evt.paymentStatus === 'pago' ? 'text-emerald-600' : evt.paymentStatus === 'pendente' ? 'text-amber-600' : 'text-slate-500'
                          }`}>
                            {evt.paymentStatus ? evt.paymentStatus.toUpperCase() : evt.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          )}

          {/* Color legend footer */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-2xs text-slate-500">
            <span className="font-semibold">Legenda:</span>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                Grade / Turmas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Locações
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Jogos & Torneios
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Eventos Diversos
              </span>
            </div>
          </div>
        </div>

        {/* Day Inspector & Events for Selected Date (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
                  Programação do Dia
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {formattedSelectedDay}
                </h3>
              </div>

              <button
                onClick={() => {
                  setFormDate(selectedDayDate);
                  setShowAddModal(true);
                }}
                className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                title="Adicionar evento nesta data"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* List of events for selected day */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-0.5">
              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <CalendarIcon className="h-8 w-8 mx-auto text-slate-300 stroke-1" />
                  <p className="text-xs">Nenhuma atividade agendada para este dia.</p>
                  <button
                    onClick={() => {
                      setFormDate(selectedDayDate);
                      setShowAddModal(true);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Agendar atividade
                  </button>
                </div>
              ) : (
                selectedDayEvents.map((evt) => {
                  const config = CATEGORY_CONFIG[evt.category];
                  const Icon = config.icon;

                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEventForDetails(evt)}
                      className={`rounded-xl border p-3.5 space-y-2 cursor-pointer transition-all bg-white hover:shadow-xs ${config.borderCol} hover:border-blue-400`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md ${config.badgeBg} ${config.badgeText}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${config?.badgeBg || 'bg-slate-100'} ${config?.badgeText || 'text-slate-700'}`}>
                            {config?.label ? config.label.split(' / ')[0] : 'Evento'}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {evt.startTime} - {evt.endTime}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                        {evt.title}
                      </h4>

                      <div className="text-2xs text-slate-500 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>

                        {evt.instructorOrHost && (
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3 w-3 text-slate-400 shrink-0" />
                            <span>Resp: <strong>{evt.instructorOrHost}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Footer pills */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-2xs">
                        {evt.price !== undefined ? (
                          <span className="font-bold text-emerald-700">
                            {evt.price > 0 ? `R$ ${evt.price.toFixed(2)}` : 'Incluso no Plano'}
                          </span>
                        ) : (
                          <span className="text-slate-500">
                            {evt.enrolledOrConfirmedCount || 0} / {evt.capacity || 20} vagas
                          </span>
                        )}

                        <span className="text-blue-600 font-semibold flex items-center gap-0.5 hover:underline">
                          <Eye className="h-3 w-3" />
                          Detalhes
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Detalhes do Evento */}
      {selectedEventForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${CATEGORY_CONFIG[selectedEventForDetails.category].badgeBg} ${CATEGORY_CONFIG[selectedEventForDetails.category].badgeText}`}>
                  {React.createElement(CATEGORY_CONFIG[selectedEventForDetails.category].icon, { className: 'h-5 w-5' })}
                </div>
                <div>
                  <span className={`text-2xs font-bold uppercase px-2 py-0.5 rounded-full ${CATEGORY_CONFIG[selectedEventForDetails.category].badgeBg} ${CATEGORY_CONFIG[selectedEventForDetails.category].badgeText}`}>
                    {CATEGORY_CONFIG[selectedEventForDetails.category].label}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {selectedEventForDetails.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedEventForDetails(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 space-y-1">
                <span className="text-2xs font-semibold text-slate-400 uppercase">Data & Horário</span>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                  {selectedEventForDetails.date.split('-').reverse().join('/')} ({selectedEventForDetails.startTime} às {selectedEventForDetails.endTime})
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 space-y-1">
                <span className="text-2xs font-semibold text-slate-400 uppercase">Espaço / Local</span>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  {selectedEventForDetails.location}
                </p>
              </div>

              {selectedEventForDetails.instructorOrHost && (
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 space-y-1">
                  <span className="text-2xs font-semibold text-slate-400 uppercase">Responsável / Locatário</span>
                  <p className="font-bold text-slate-800">
                    {selectedEventForDetails.instructorOrHost}
                  </p>
                </div>
              )}

              {selectedEventForDetails.price !== undefined && (
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 space-y-1">
                  <span className="text-2xs font-semibold text-slate-400 uppercase">Valor da Reserva</span>
                  <p className="font-bold text-emerald-700 flex items-center justify-between">
                    <span>R$ {selectedEventForDetails.price.toFixed(2)}</span>
                    <span className={`text-2xs px-2 py-0.5 rounded uppercase ${
                      selectedEventForDetails.paymentStatus === 'pago' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedEventForDetails.paymentStatus || 'PAGO'}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            {selectedEventForDetails.description && (
              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700 border border-slate-100 space-y-1">
                <span className="text-2xs font-semibold text-slate-500 uppercase">Descrição & Observações:</span>
                <p className="leading-relaxed">{selectedEventForDetails.description}</p>
              </div>
            )}

            {/* Extra Details Specific to Category */}
            {selectedEventForDetails.extraDetails && (
              <div className="rounded-lg bg-blue-50/50 p-3 text-xs border border-blue-100 text-slate-700 space-y-1">
                <span className="text-2xs font-bold text-blue-700 uppercase">Detalhes Adicionais:</span>
                <div className="grid grid-cols-2 gap-2 text-2xs mt-1">
                  {selectedEventForDetails.extraDetails.sport && (
                    <div>Esporte: <strong>{selectedEventForDetails.extraDetails.sport}</strong></div>
                  )}
                  {selectedEventForDetails.extraDetails.teamsCount && (
                    <div>Equipes/Duplas: <strong>{selectedEventForDetails.extraDetails.teamsCount}</strong></div>
                  )}
                  {selectedEventForDetails.extraDetails.speaker && (
                    <div>Palestrante: <strong>{selectedEventForDetails.extraDetails.speaker}</strong></div>
                  )}
                  {selectedEventForDetails.extraDetails.prizes && (
                    <div className="col-span-2">Premiação: <strong>{selectedEventForDetails.extraDetails.prizes}</strong></div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {selectedEventForDetails.contactPhone && (
                  <button
                    onClick={() => {
                      sendWhatsAppMessage(
                        selectedEventForDetails.contactPhone!,
                        `Olá ${selectedEventForDetails.instructorOrHost || ''}! Mensagem da VB SPORT referente ao agendamento: "${selectedEventForDetails.title}" no dia ${selectedEventForDetails.date.split('-').reverse().join('/')}.`
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    WhatsApp
                  </button>
                )}

                <button
                  onClick={() => {
                    onDeleteEvent(selectedEventForDetails.id);
                    setSelectedEventForDetails(null);
                  }}
                  className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                >
                  Excluir
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEventForDetails(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    onUpdateEventStatus(selectedEventForDetails.id, 'finalizado');
                    setSelectedEventForDetails(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                  Confirmar Realização
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Agendamento / Evento */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
                Novo Agendamento no Calendário
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tipo de Agendamento (Categoria)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'grade_turma' as CalendarEventCategory, label: 'Turma Regular', icon: Dumbbell, color: 'text-purple-600' },
                    { id: 'locacao' as CalendarEventCategory, label: 'Locação', icon: DollarSign, color: 'text-emerald-600' },
                    { id: 'evento_jogo' as CalendarEventCategory, label: 'Evento de Jogo', icon: Trophy, color: 'text-amber-600' },
                    { id: 'evento_diverso' as CalendarEventCategory, label: 'Evento Diverso', icon: Sparkles, color: 'text-blue-600' }
                  ].map(cat => {
                    const Icon = cat.icon;
                    const isSelected = formCategory === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setFormCategory(cat.id)}
                        className={`p-2.5 rounded-lg border text-center flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600 shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${cat.color}`} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Título do Agendamento / Evento *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={
                    formCategory === 'grade_turma'
                      ? 'Ex: Spinning Extreme Ride'
                      : formCategory === 'locacao'
                      ? 'Ex: Locação Campo Society - Pelada da Firma'
                      : formCategory === 'evento_jogo'
                      ? 'Ex: 2º Torneio VB Open de Beach Tennis'
                      : 'Ex: Workshop de Nutrição Esportiva'
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Início *
                  </label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Término *
                  </label>
                  <input
                    type="time"
                    required
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Espaço / Local da Academia *
                </label>
                <select
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="Campo Society 1 (Grama Sintética)">Campo Society 1 (Grama Sintética)</option>
                  <option value="Quadra de Beach Tennis 1 (Areia)">Quadra de Beach Tennis 1 (Areia)</option>
                  <option value="Quadra de Areia 2 (Futevôlei)">Quadra de Areia 2 (Futevôlei)</option>
                  <option value="Box CrossFit Arena">Box CrossFit Arena</option>
                  <option value="Sala de Ciclismo Indoor (Spinning)">Sala de Ciclismo Indoor (Spinning)</option>
                  <option value="Studio Pilates">Studio Pilates</option>
                  <option value="Tatame Arena Lutas">Tatame Arena Lutas</option>
                  <option value="Sala Multiuso / Espelhos (Dança & Ritmos)">Sala Multiuso / Espelhos (Dança & Ritmos)</option>
                  <option value="Auditório / Sala de Cursos">Auditório / Sala de Cursos</option>
                  <option value="Área Gourmet & Lounge Externo">Área Gourmet & Lounge Externo</option>
                </select>
              </div>

              {/* Host / Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {formCategory === 'grade_turma'
                      ? 'Professor / Instrutor'
                      : formCategory === 'locacao'
                      ? 'Nome do Locatário / Responsável'
                      : formCategory === 'evento_jogo'
                      ? 'Organizador / Coordenador'
                      : 'Palestrante / Facilitador'}
                  </label>
                  <input
                    type="text"
                    value={formHost}
                    onChange={(e) => setFormHost(e.target.value)}
                    placeholder="Ex: Carlos Roberto..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Pricing for Rentals & Tournaments */}
              {formCategory !== 'grade_turma' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Valor (R$) {formCategory === 'locacao' ? 'do Aluguel' : 'da Inscrição / Ingresso'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Status do Pagamento
                    </label>
                    <select
                      value={formPaymentStatus}
                      onChange={(e) => setFormPaymentStatus(e.target.value as any)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                    >
                      <option value="pago">Pago (Quitado)</option>
                      <option value="pendente">Pendente (Acerto no Balcão)</option>
                      <option value="cortesia">Cortesia</option>
                      <option value="incluso">Incluso / Gratuito</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Observações / Detalhes
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Informações sobre material, bolas, arbitragem, coletes ou equipamentos inclusos..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Buttons */}
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
                  Salvar no Calendário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
