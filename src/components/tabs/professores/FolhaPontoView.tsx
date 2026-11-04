import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Users, 
  Star, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Send, 
  Bell, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  AlertCircle, 
  FileText, 
  Printer, 
  Download,
  Shield, 
  UserCheck, 
  LayoutGrid, 
  Calculator,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  TeacherProfile, 
  ProfTurma, 
  ProfEventAvulso, 
  ProfClassRecord, 
  getFolhaTeachers, 
  saveFolhaTeachers,
  getFolhaTurmas, 
  saveFolhaTurmas,
  getFolhaEventos, 
  saveFolhaEventos,
  getFolhaRecords, 
  saveFolhaRecords,
  calculateDurationHours,
  calculateProjectedHours,
  MONTH_NAMES_PT,
  DAYS_NAMES_SHORT,
  DAYS_NAMES_FULL
} from '../../../services/folhaPontoService';
import { formatCurrency } from '../../../utils';
import { SystemUser } from '../../../types';
import { dispatchPushNotification } from '../../../services/notificationService';

type FolhaPontoSubSection = 'registro' | 'dashboard' | 'calendario' | 'turmas' | 'taxas';

interface FolhaPontoViewProps {
  currentUser?: SystemUser | null;
}

export const FolhaPontoView: React.FC<FolhaPontoViewProps> = ({ currentUser }) => {
  // Navigation State
  const [activeSection, setActiveSection] = useState<FolhaPontoSubSection>('registro');

  // Persistence State
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => getFolhaTeachers());
  const [turmas, setTurmas] = useState<ProfTurma[]>(() => getFolhaTurmas());
  const [eventos, setEventos] = useState<ProfEventAvulso[]>(() => getFolhaEventos());
  const [records, setRecords] = useState<ProfClassRecord[]>(() => getFolhaRecords());

  // Date Selection for Daily Attendance Registration
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  // Selected Teacher for Registration view
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(() => {
    // If current user is a teacher, preselect him
    const found = teachers.find(t => t.email.toLowerCase() === currentUser?.email?.toLowerCase());
    return found ? found.id : teachers[0]?.id || 'prof-1';
  });

  // Month Selection for Dashboard and Calendar (0-indexed month)
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth());

  // Selected Day in Calendar
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<string>(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });

  // Turmas view tab (turmas fixas vs eventos avulsos)
  const [turmasSubTab, setTurmasSubTab] = useState<'turmas' | 'eventos'>('turmas');

  // Dashboard role view (coordenador vs professor)
  const isCoordinator = useMemo(() => {
    if (!currentUser) return true;
    if (currentUser.role === 'admin' || currentUser.role === 'gerente') return true;
    const prof = teachers.find(t => t.email.toLowerCase() === currentUser.email.toLowerCase());
    return prof?.role === 'coordinator';
  }, [currentUser, teachers]);

  const [dashboardViewMode, setDashboardViewMode] = useState<'coordenador' | 'professor'>(() => 
    isCoordinator ? 'coordenador' : 'professor'
  );

  // Modals state
  const [isTurmaModalOpen, setIsTurmaModalOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<ProfTurma | null>(null);
  const [turmaFormData, setTurmaFormData] = useState({
    name: '',
    teacherId: '',
    daysOfWeek: [1, 3, 5] as number[],
    startTime: '08:00',
    endTime: '09:30',
    category: 'Futebol Infantil',
    location: 'Campo Society 1',
    active: true
  });

  const [isEventoModalOpen, setIsEventoModalOpen] = useState(false);
  const [editingEvento, setEditingEvento] = useState<ProfEventAvulso | null>(null);
  const [eventoFormData, setEventoFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '12:00',
    teacherId: '',
    location: 'Campo Society 1 & 2',
    description: ''
  });

  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [selectedTeacherForRate, setSelectedTeacherForRate] = useState<TeacherProfile | null>(null);
  const [newHourlyRate, setNewHourlyRate] = useState<number>(60);

  // Email Reminders Simulation State
  const [isSendingReminders, setIsSendingReminders] = useState(false);
  const [reminderStatus, setReminderStatus] = useState<{ total: number; sent: number; done: boolean } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Day of week for selectedDate (0 = Domingo ... 6 = Sábado)
  const selectedDateDayOfWeek = useMemo(() => {
    if (!selectedDate) return 0;
    const [y, m, d] = selectedDate.split('-').map(Number);
    return new Date(y, m - 1, d).getDay();
  }, [selectedDate]);

  // Available scheduled classes for selectedDate
  const availableClassesForDay = useMemo(() => {
    // 1. Regular turmas matching day of week
    const matchingTurmas = turmas.filter(t => t.active && t.daysOfWeek.includes(selectedDateDayOfWeek));

    // 2. Events matching the exact date
    const matchingEventos = eventos.filter(e => e.date === selectedDate);

    return {
      turmas: matchingTurmas,
      eventos: matchingEventos
    };
  }, [turmas, eventos, selectedDateDayOfWeek, selectedDate]);

  // Records for selectedDate and selectedTeacher
  const recordsForSelectedDate = useMemo(() => {
    return records.filter(r => r.date === selectedDate && (selectedTeacherId ? r.teacherId === selectedTeacherId : true));
  }, [records, selectedDate, selectedTeacherId]);

  // Toggle Attendance / Class Record
  const handleToggleRecord = (item: { id: string; name: string; startTime: string; endTime: string; durationHours?: number; isEvent?: boolean; teacherId?: string }) => {
    const isEvent = !!item.isEvent;
    const teacherIdToUse = item.teacherId || selectedTeacherId;
    const teacherObj = teachers.find(t => t.id === teacherIdToUse);
    const hourlyRate = teacherObj?.hourlyRate || 60;
    const duration = item.durationHours || calculateDurationHours(item.startTime, item.endTime);

    // Check if record exists
    const existing = records.find(r => 
      r.date === selectedDate && 
      r.teacherId === teacherIdToUse && 
      (isEvent ? r.eventId === item.id : r.turmaId === item.id)
    );

    if (existing) {
      // Remove record
      const nextRecords = records.filter(r => r.id !== existing.id);
      setRecords(nextRecords);
      saveFolhaRecords(nextRecords);
      showToast(`Registro de "${item.name}" desmarcado.`);
    } else {
      // Add record
      const newRec: ProfClassRecord = {
        id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        teacherId: teacherIdToUse,
        turmaId: !isEvent ? item.id : null,
        eventId: isEvent ? item.id : null,
        turmaName: item.name,
        date: selectedDate,
        hours: duration,
        hourlyRateApplied: hourlyRate,
        totalValue: parseFloat((duration * hourlyRate).toFixed(2)),
        timestamp: new Date().toISOString()
      };

      const nextRecords = [newRec, ...records];
      setRecords(nextRecords);
      saveFolhaRecords(nextRecords);
      showToast(`Presença e aula registrada: ${item.name} (${duration}h) - R$ ${newRec.totalValue.toFixed(2)}`);
      dispatchPushNotification({
        title: 'Presença Confirmada na Folha',
        message: `${item.name} (${duration}h) registrada para ${teacherObj?.name || 'professor'} - R$ ${newRec.totalValue.toFixed(2)}.`,
        type: 'success',
        module: 'professores',
        eventType: 'folha_ponto_presenca',
        linkTab: 'professores',
        actionLabel: 'Ver Folha'
      });
    }
  };

  const isItemRecorded = (id: string, isEvent = false, teacherId?: string) => {
    const tid = teacherId || selectedTeacherId;
    return records.some(r => 
      r.date === selectedDate && 
      r.teacherId === tid && 
      (isEvent ? r.eventId === id : r.turmaId === id)
    );
  };

  // Month Statistics Calculations
  const monthStats = useMemo(() => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const prefix = `${currentYear}-${monthStr}`;

    const monthRecords = records.filter(r => r.date.startsWith(prefix));

    // Today's day of month
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth;
    const fromDayForProjection = isCurrentMonth ? today.getDate() + 1 : (new Date(currentYear, currentMonth, 1) > today ? 1 : 999);

    const summaries = teachers.map(teacher => {
      const teacherRecords = monthRecords.filter(r => r.teacherId === teacher.id);
      const realizedHours = teacherRecords.reduce((sum, r) => sum + r.hours, 0);
      const realizedValue = teacherRecords.reduce((sum, r) => sum + r.totalValue, 0);

      // Turmas allocated to this teacher
      const teacherTurmas = turmas.filter(t => t.teacherId === teacher.id && t.active);
      const projectedHours = calculateProjectedHours(teacherTurmas, currentYear, currentMonth, fromDayForProjection);
      const projectedValue = parseFloat((projectedHours * teacher.hourlyRate).toFixed(2));

      return {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        hourlyRate: teacher.hourlyRate,
        realizedHours: parseFloat(realizedHours.toFixed(1)),
        projectedHours,
        totalHours: parseFloat((realizedHours + projectedHours).toFixed(1)),
        realizedValue,
        projectedValue: parseFloat((realizedValue + projectedValue).toFixed(2))
      };
    });

    const totalRealizedValue = summaries.reduce((acc, s) => acc + s.realizedValue, 0);
    const totalProjectedValue = summaries.reduce((acc, s) => acc + s.projectedValue, 0);
    const totalRealizedHours = summaries.reduce((acc, s) => acc + s.realizedHours, 0);
    const totalProjectedHours = summaries.reduce((acc, s) => acc + s.projectedHours, 0);

    return {
      year: currentYear,
      month: currentMonth,
      monthName: `${MONTH_NAMES_PT[currentMonth]} ${currentYear}`,
      totalRealizedValue,
      totalProjectedValue,
      totalRealizedHours: parseFloat(totalRealizedHours.toFixed(1)),
      totalProjectedHours: parseFloat(totalProjectedHours.toFixed(1)),
      summaries
    };
  }, [records, teachers, turmas, currentYear, currentMonth]);

  // Selected teacher stats for individual view
  const activeTeacherSummary = useMemo(() => {
    return monthStats.summaries.find(s => s.id === selectedTeacherId) || monthStats.summaries[0];
  }, [monthStats, selectedTeacherId]);

  // Reminder trigger simulation
  const handleTriggerReminders = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(r => r.date === today);
    const recordedTeacherIds = new Set(todayRecords.map(r => r.teacherId));

    const missing = teachers.filter(t => !recordedTeacherIds.has(t.id));
    if (missing.length === 0) {
      showToast('Todos os professores já preencheram as atividades de hoje!');
      return;
    }

    setIsSendingReminders(true);
    setReminderStatus({ total: missing.length, sent: 0, done: false });

    let sent = 0;
    const interval = setInterval(() => {
      sent += 1;
      setReminderStatus({ total: missing.length, sent, done: sent >= missing.length });
      if (sent >= missing.length) {
        clearInterval(interval);
        setIsSendingReminders(false);
        showToast(`${missing.length} lembretes enviados com sucesso para os professores!`);
        dispatchPushNotification({
          title: 'Lembretes de Ponto Enviados',
          message: `${missing.length} professores notificados para preenchimento das atividades de hoje.`,
          type: 'info',
          module: 'professores',
          eventType: 'folha_ponto_lembrete',
          linkTab: 'professores',
          actionLabel: 'Ver Folha'
        });
      }
    }, 600);
  };

  // Month navigation helpers
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

  const handleReturnToCurrentMonth = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
  };

  // Calendar days grid computation
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

    const days = [];
    // Padding for days before start of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ day: 0, dateStr: '', isCurrentMonth: false });
    }

    // Days of current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, dateStr, isCurrentMonth: true });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Turma CRUD
  const handleSaveTurma = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = calculateDurationHours(turmaFormData.startTime, turmaFormData.endTime);
    const teacherObj = teachers.find(t => t.id === turmaFormData.teacherId);

    if (editingTurma) {
      const nextTurmas = turmas.map(t => t.id === editingTurma.id ? {
        ...t,
        ...turmaFormData,
        teacherName: teacherObj?.name || 'Não atribuído',
        durationHours: duration
      } : t);
      setTurmas(nextTurmas);
      saveFolhaTurmas(nextTurmas);
      showToast('Turma atualizada com sucesso!');
    } else {
      const newTurma: ProfTurma = {
        id: `turma-${Date.now()}`,
        ...turmaFormData,
        teacherName: teacherObj?.name || 'Não atribuído',
        durationHours: duration
      };
      const nextTurmas = [...turmas, newTurma];
      setTurmas(nextTurmas);
      saveFolhaTurmas(nextTurmas);
      showToast(`Turma "${newTurma.name}" criada com sucesso!`);
    }

    setIsTurmaModalOpen(false);
    setEditingTurma(null);
  };

  const handleDeleteTurma = (id: string, name: string) => {
    if (confirm(`Deseja realmente excluir a turma "${name}"?`)) {
      const nextTurmas = turmas.filter(t => t.id !== id);
      setTurmas(nextTurmas);
      saveFolhaTurmas(nextTurmas);
      showToast(`Turma "${name}" excluída.`);
    }
  };

  // Evento CRUD
  const handleSaveEvento = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = calculateDurationHours(eventoFormData.startTime, eventoFormData.endTime);
    const teacherObj = teachers.find(t => t.id === eventoFormData.teacherId);

    if (editingEvento) {
      const nextEventos = eventos.map(ev => ev.id === editingEvento.id ? {
        ...ev,
        ...eventoFormData,
        teacherName: teacherObj?.name || 'Não atribuído',
        durationHours: duration
      } : ev);
      setEventos(nextEventos);
      saveFolhaEventos(nextEventos);
      showToast('Evento atualizado com sucesso!');
    } else {
      const newEv: ProfEventAvulso = {
        id: `event-${Date.now()}`,
        ...eventoFormData,
        teacherName: teacherObj?.name || 'Qualquer Professor',
        durationHours: duration
      };
      const nextEventos = [...eventos, newEv];
      setEventos(nextEventos);
      saveFolhaEventos(nextEventos);
      showToast(`Evento "${newEv.name}" cadastrado com sucesso!`);
    }

    setIsEventoModalOpen(false);
    setEditingEvento(null);
  };

  const handleDeleteEvento = (id: string, name: string) => {
    if (confirm(`Deseja realmente remover o evento "${name}"?`)) {
      const nextEventos = eventos.filter(e => e.id !== id);
      setEventos(nextEventos);
      saveFolhaEventos(nextEventos);
      showToast(`Evento "${name}" removido.`);
    }
  };

  // Hourly Rate update
  const handleSaveTeacherRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherForRate) return;
    const nextTeachers = teachers.map(t => t.id === selectedTeacherForRate.id ? { ...t, hourlyRate: Number(newHourlyRate) } : t);
    setTeachers(nextTeachers);
    saveFolhaTeachers(nextTeachers);
    showToast(`Taxa de ${selectedTeacherForRate.name} atualizada para R$ ${newHourlyRate}/h!`);
    setIsRateModalOpen(false);
    setSelectedTeacherForRate(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* SUB-SECTIONS NAVIGATION BAR */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          {[
            { id: 'registro' as FolhaPontoSubSection, label: 'Diário & Registro de Presença', icon: Clock },
            { id: 'dashboard' as FolhaPontoSubSection, label: 'Dashboard & Fechamento', icon: TrendingUp },
            { id: 'calendario' as FolhaPontoSubSection, label: 'Histórico & Calendário', icon: CalendarIcon },
            { id: 'turmas' as FolhaPontoSubSection, label: 'Turmas & Horários', icon: LayoutGrid },
            { id: 'taxas' as FolhaPontoSubSection, label: 'Valores por Hora', icon: DollarSign }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Brand Badge */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 hidden sm:inline">
            Sistema de Horas
          </span>
          <span className="text-xs font-black bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full">
            VB SPORT
          </span>
        </div>
      </div>

      {/* 1. SEÇÃO: DIÁRIO DE CLASSE & REGISTRO DE PRESENÇA (Baseado em RegisterActivity.tsx) */}
      {activeSection === 'registro' && (
        <div className="space-y-6">
          {/* Header Controls: Teacher & Date Selector */}
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                <Clock className="w-3 h-3 text-blue-600" />
                <span>Registro de Atividade Diária</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {selectedDate === new Date().toISOString().split('T')[0] ? 'O que temos para hoje?' : 'Registros do Dia Selecionado'}
              </h2>
              <p className="text-xs text-slate-500">
                Marque com um clique as turmas que foram ministradas para computar as horas na folha de pagamento
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Teacher Selector */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-slate-500 text-[11px] font-semibold">Professor:</span>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 text-xs focus:outline-hidden cursor-pointer max-w-[170px] truncate"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} (R$ {t.hourlyRate}/h)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Input */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-hidden cursor-pointer shadow-2xs"
                  />
                </div>
                {selectedDate !== new Date().toISOString().split('T')[0] && (
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      setSelectedDate(today);
                    }}
                    className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-all"
                  >
                    Hoje
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Counter Summary for Date */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dia da Semana</div>
              <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                {DAYS_NAMES_FULL[selectedDateDayOfWeek]}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aulas Agendadas</div>
              <div className="text-base sm:text-lg font-black text-blue-600 mt-0.5">
                {availableClassesForDay.turmas.length + availableClassesForDay.eventos.length} turmas
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aulas Ministradas</div>
              <div className="text-base sm:text-lg font-black text-emerald-600 mt-0.5">
                {recordsForSelectedDate.length} concluídas
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Valor Gerado no Dia</div>
              <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                {formatCurrency(recordsForSelectedDate.reduce((sum, r) => sum + r.totalValue, 0))}
              </div>
            </div>
          </div>

          {/* Available classes for the date */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Grade de Horários do Dia ({availableClassesForDay.turmas.length + availableClassesForDay.eventos.length})
              </h3>
              <span className="text-[11px] text-slate-400">
                Clique no card para confirmar a realização da aula
              </span>
            </div>

            {availableClassesForDay.turmas.length === 0 && availableClassesForDay.eventos.length === 0 ? (
              <div className="p-10 rounded-2xl bg-white border border-dashed border-slate-200 text-center space-y-2">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">Nenhuma turma ou evento agendado para este dia</p>
                <p className="text-xs text-slate-400">
                  Cadastre turmas fixas na aba "Turmas & Horários" ou adicione um evento avulso.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 1. Turmas Fixas */}
                {availableClassesForDay.turmas.map((turma) => {
                  const recorded = isItemRecorded(turma.id, false, turma.teacherId || selectedTeacherId);
                  const isAssignedToSelected = turma.teacherId === selectedTeacherId;

                  return (
                    <div
                      key={turma.id}
                      onClick={() => handleToggleRecord({
                        id: turma.id,
                        name: turma.name,
                        startTime: turma.startTime,
                        endTime: turma.endTime,
                        durationHours: turma.durationHours,
                        isEvent: false,
                        teacherId: turma.teacherId || selectedTeacherId
                      })}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-4 ${
                        recorded
                          ? 'bg-blue-50/70 border-blue-400 shadow-sm ring-1 ring-blue-400/40'
                          : 'bg-white border-slate-200 hover:border-blue-300 shadow-2xs hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 transition-colors ${
                          recorded ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <Users className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <h4 className={`text-sm font-bold truncate ${recorded ? 'text-blue-900' : 'text-slate-900'}`}>
                            {turma.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                            <span className="font-semibold text-slate-500">
                              {turma.startTime} - {turma.endTime} ({turma.durationHours}h)
                            </span>
                            {turma.location && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                {turma.location}
                              </span>
                            )}
                            <span className="text-[10px] text-blue-700 font-bold">
                              • {turma.teacherName || 'Instrutor'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right hidden sm:block">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md block ${
                            recorded ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {recorded ? 'Concluído' : 'Pendente'}
                          </span>
                          <span className="text-xs font-bold text-slate-600 mt-0.5 block">
                            R$ {(turma.durationHours * (teachers.find(t => t.id === (turma.teacherId || selectedTeacherId))?.hourlyRate || 60)).toFixed(2)}
                          </span>
                        </div>

                        <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                          recorded
                            ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/30'
                            : 'border-slate-200 bg-slate-50 text-slate-300'
                        }`}>
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* 2. Eventos Avulsos do Dia */}
                {availableClassesForDay.eventos.map((evento) => {
                  const recorded = isItemRecorded(evento.id, true, evento.teacherId || selectedTeacherId);

                  return (
                    <div
                      key={evento.id}
                      onClick={() => handleToggleRecord({
                        id: evento.id,
                        name: evento.name,
                        startTime: evento.startTime,
                        endTime: evento.endTime,
                        durationHours: evento.durationHours,
                        isEvent: true,
                        teacherId: evento.teacherId || selectedTeacherId
                      })}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-4 ${
                        recorded
                          ? 'bg-rose-50/80 border-rose-400 shadow-sm ring-1 ring-rose-400/40'
                          : 'bg-white border-slate-200 hover:border-rose-300 shadow-2xs hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 transition-colors ${
                          recorded ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-600'
                        }`}>
                          <Star className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className={`text-sm font-bold truncate ${recorded ? 'text-rose-900' : 'text-slate-900'}`}>
                              {evento.name}
                            </h4>
                            <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-extrabold uppercase shrink-0">
                              Evento
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                            <span className="font-semibold text-slate-500">
                              {evento.startTime} - {evento.endTime} ({evento.durationHours}h)
                            </span>
                            {evento.location && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                {evento.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right hidden sm:block">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md block ${
                            recorded ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {recorded ? 'Concluído' : 'Pendente'}
                          </span>
                          <span className="text-xs font-bold text-slate-600 mt-0.5 block">
                            R$ {(evento.durationHours * (teachers.find(t => t.id === (evento.teacherId || selectedTeacherId))?.hourlyRate || 60)).toFixed(2)}
                          </span>
                        </div>

                        <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                          recorded
                            ? 'border-rose-600 bg-rose-600 text-white shadow-md shadow-rose-500/30'
                            : 'border-slate-200 bg-slate-50 text-slate-300'
                        }`}>
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Attention Banner (Preserving original UX guideline from zip) */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-100">
                  Atenção Professor • Controle de Presença
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ao registrar sua presença, você confirma que a aula foi ministrada no horário previsto. O fechamento e holerite mensal baseiam-se nestes dados.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSection('dashboard')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Ver Meu Fechamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SEÇÃO: DASHBOARD & FECHAMENTO FINANCEIRO (Baseado em Dashboard.tsx) */}
      {activeSection === 'dashboard' && (
        <div className="space-y-6">
          {/* Month Selector Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center justify-between flex-1 gap-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
                title="Mês Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Período da Folha
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900 capitalize">
                  {monthStats.monthName}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
                title="Próximo Mês"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Return to current month */}
              <button
                type="button"
                onClick={handleReturnToCurrentMonth}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-bold transition-all"
              >
                Mês Atual
              </button>

              {/* View Switcher: Coordenador / Professor */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setDashboardViewMode('coordenador')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    dashboardViewMode === 'coordenador' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Visão Geral (Equipe)
                </button>
                <button
                  type="button"
                  onClick={() => setDashboardViewMode('professor')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    dashboardViewMode === 'professor' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Individual
                </button>
              </div>
            </div>
          </div>

          {/* VIEW: COORDENADOR (GERAL DE TODA A EQUIPE) */}
          {dashboardViewMode === 'coordenador' && (
            <div className="space-y-6">
              {/* Main Financial Overview Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-5 rotate-12 pointer-events-none">
                  <DollarSign size={200} />
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-blue-200 text-xs font-bold uppercase tracking-wider">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Custo Total de Escala • {monthStats.monthName}</span>
                  </div>

                  <div>
                    <span className="text-white/60 text-xs font-black uppercase tracking-wider block mb-1">
                      Total Acumulado Realizado
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                      {formatCurrency(monthStats.totalRealizedValue)}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                      <span className="text-white/60 text-[10px] font-black uppercase tracking-wider block mb-1">
                        Projeção de Fechamento do Mês
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-emerald-300">
                        {formatCurrency(monthStats.totalRealizedValue + monthStats.totalProjectedValue)}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-red-600/90 backdrop-blur-sm border border-red-500/50 shadow-md">
                      <span className="text-white/70 text-[10px] font-black uppercase tracking-wider block mb-1">
                        Carga Horária Total Prevista
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-white">
                        {monthStats.totalRealizedHours + monthStats.totalProjectedHours}h Totais
                        <span className="text-xs font-normal opacity-80 ml-2">({monthStats.totalRealizedHours}h feitas)</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email / Notification Reminder Card (from zip) */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white relative overflow-hidden shadow-lg">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2 text-rose-500">
                      <Bell className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-wider">Controle de Avisos & Diário de Classe</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      Lembrete Automático para Professores
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Dispara um alerta imediato por e-mail e notificação para todos os professores que ainda não registraram as aulas de hoje.
                    </p>

                    {reminderStatus && (
                      <div className="pt-2">
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full transition-all duration-300"
                            style={{ width: `${(reminderStatus.sent / reminderStatus.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-emerald-400 font-bold mt-1 block">
                          Enviado: {reminderStatus.sent} de {reminderStatus.total} professores
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleTriggerReminders}
                    disabled={isSendingReminders}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-98 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSendingReminders ? 'Disparando...' : 'Disparar Alertas Hoje'}</span>
                  </button>
                </div>
              </div>

              {/* Ranking & Summaries of Teachers */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Ranking de Folha por Professor ({monthStats.summaries.length})
                  </h3>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {monthStats.totalRealizedHours} horas apuradas
                  </span>
                </div>

                <div className="grid gap-3">
                  {monthStats.summaries.map((s) => (
                    <div
                      key={s.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-blue-600 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 font-black text-lg flex items-center justify-center border border-blue-200 shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                              R$ {s.hourlyRate}/h
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {s.realizedHours}h realizadas • {s.totalHours}h planejadas no mês
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-base font-black text-blue-900 block leading-tight">
                            {formatCurrency(s.realizedValue)}
                          </span>
                          <span className="text-[11px] text-slate-400 font-bold block">
                            Proj: {formatCurrency(s.projectedValue)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTeacherId(s.id);
                            setDashboardViewMode('professor');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: PROFESSOR (INDIVIDUAL) */}
          {dashboardViewMode === 'professor' && (
            <div className="space-y-6">
              {/* Individual Teacher Selector */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Visualizando Folha de:</span>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="font-black text-sm text-slate-900 bg-transparent border-b border-slate-300 pb-0.5 focus:outline-hidden cursor-pointer"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.department || 'Professor'})
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-xs font-black bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  R$ {activeTeacherSummary?.hourlyRate}/hora
                </span>
              </div>

              {/* Main Financial Card (from zip Dashboard.tsx) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-blue-900 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-5 rotate-12 pointer-events-none">
                  <DollarSign size={200} />
                </div>

                <div className="relative z-10 space-y-4">
                  <span className="text-white/60 text-[10px] font-black uppercase tracking-wider block">
                    Ganhos Acumulados no Mês
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                    {formatCurrency(activeTeacherSummary?.realizedValue || 0)}
                  </h3>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                      <span className="text-white/50 text-[10px] font-black uppercase tracking-wider block mb-1">
                        Projeção Final do Mês
                      </span>
                      <span className="text-lg sm:text-xl font-black text-white">
                        {formatCurrency(activeTeacherSummary?.projectedValue || 0)}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-red-600 text-white shadow-lg">
                      <span className="text-white/70 text-[10px] font-black uppercase tracking-wider block mb-1">
                        Carga Mensal
                      </span>
                      <span className="text-lg sm:text-xl font-black text-white">
                        {activeTeacherSummary?.totalHours || 0}h Totais
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-2">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Horas Ministradas</span>
                  <span className="text-2xl font-black text-slate-900 block">{activeTeacherSummary?.realizedHours || 0}h</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-2">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Taxa Contratada</span>
                  <span className="text-2xl font-black text-slate-900 block">R$ {activeTeacherSummary?.hourlyRate || 0}/h</span>
                </div>
              </div>

              {/* Recent Records list */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Histórico Recente de Aulas Registradas
                  </h4>
                  <span className="text-xs text-slate-400">
                    {records.filter(r => r.teacherId === selectedTeacherId).length} aulas registradas
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {records
                    .filter(r => r.teacherId === selectedTeacherId)
                    .slice(0, 6)
                    .map((rec) => (
                      <div key={rec.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="font-bold text-slate-800 block">{rec.turmaName}</span>
                          <span className="text-slate-400 text-[11px]">{rec.date} • {rec.hours}h</span>
                        </div>
                        <span className="font-black text-blue-800">
                          {formatCurrency(rec.totalValue)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. SEÇÃO: HISTÓRICO & CALENDÁRIO VISUAL (Baseado em Calendar.tsx) */}
      {activeSection === 'calendario' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Histórico Visual
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 capitalize">
                {monthStats.monthName}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {DAYS_NAMES_SHORT.map((dayName) => (
                <div key={dayName} className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  {dayName}
                </div>
              ))}
            </div>

            {/* Days tiles */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {calendarDays.map((item, idx) => {
                if (!item.isCurrentMonth) {
                  return <div key={idx} className="min-h-[60px] sm:min-h-[75px] rounded-xl bg-slate-50/40 opacity-20" />;
                }

                const isSelected = item.dateStr === calendarSelectedDate;
                const isToday = item.dateStr === new Date().toISOString().split('T')[0];
                const dayRecords = records.filter(r => r.date === item.dateStr);

                // Scheduled classes on this day
                const dObj = new Date(currentYear, currentMonth, item.day);
                const dow = dObj.getDay();
                const scheduledTurmas = turmas.filter(t => t.active && t.daysOfWeek.includes(dow));
                const scheduledEventos = eventos.filter(e => e.date === item.dateStr);
                const hasScheduled = scheduledTurmas.length > 0 || scheduledEventos.length > 0;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCalendarSelectedDate(item.dateStr);
                      setSelectedDate(item.dateStr);
                    }}
                    className={`min-h-[60px] sm:min-h-[75px] p-2 rounded-2xl border flex flex-col items-center justify-between transition-all cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30'
                        : isToday
                        ? 'border-red-500 bg-red-50/30 font-black'
                        : 'border-slate-100 bg-slate-50/30 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-xs font-black ${isSelected ? 'text-blue-900' : isToday ? 'text-red-600' : 'text-slate-700'}`}>
                      {item.day}
                    </span>

                    <div className="flex items-center gap-1 mt-auto">
                      {dayRecords.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" title={`${dayRecords.length} aulas realizadas`} />
                      )}
                      {hasScheduled && dayRecords.length === 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" title="Atividades agendadas" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details of Calendar Selected Day */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Atividades em: {calendarSelectedDate}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(calendarSelectedDate);
                  setActiveSection('registro');
                }}
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                Abrir no Diário de Presença &rarr;
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {records.filter(r => r.date === calendarSelectedDate).length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  Nenhum registro de presença realizado nesta data.
                </div>
              ) : (
                records
                  .filter(r => r.date === calendarSelectedDate)
                  .map((rec) => {
                    const prof = teachers.find(t => t.id === rec.teacherId);
                    return (
                      <div key={rec.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-900 block">{rec.turmaName}</span>
                            <span className="text-slate-400 text-[11px]">Professor: {prof?.name || 'Não identificado'}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-slate-700 block">{rec.hours}h</span>
                          <span className="font-black text-blue-900">{formatCurrency(rec.totalValue)}</span>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. SEÇÃO: TURMAS & HORÁRIOS (Baseado em ManageTurmas.tsx) */}
      {activeSection === 'turmas' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            {/* Sub-tabs: Turmas Fixas vs Eventos */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setTurmasSubTab('turmas')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  turmasSubTab === 'turmas' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Turmas Fixas ({turmas.length})
              </button>
              <button
                type="button"
                onClick={() => setTurmasSubTab('eventos')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  turmasSubTab === 'eventos' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Eventos Avulsos ({eventos.length})
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (turmasSubTab === 'turmas') {
                  setEditingTurma(null);
                  setTurmaFormData({
                    name: '',
                    teacherId: teachers[0]?.id || '',
                    daysOfWeek: [1, 3, 5],
                    startTime: '08:00',
                    endTime: '09:30',
                    category: 'Futebol',
                    location: 'Campo Society 1',
                    active: true
                  });
                  setIsTurmaModalOpen(true);
                } else {
                  setEditingEvento(null);
                  setEventoFormData({
                    name: '',
                    date: new Date().toISOString().split('T')[0],
                    startTime: '08:00',
                    endTime: '12:00',
                    teacherId: teachers[0]?.id || '',
                    location: 'Campo Society 1',
                    description: ''
                  });
                  setIsEventoModalOpen(true);
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all active:scale-98 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{turmasSubTab === 'turmas' ? 'Nova Turma Fixa' : 'Novo Evento Avulso'}</span>
            </button>
          </div>

          {/* List of Turmas Fixas */}
          {turmasSubTab === 'turmas' && (
            <div className="grid gap-3">
              {turmas.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-blue-600 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        {DAYS_NAMES_SHORT.map((dName, dIdx) => (
                          <span
                            key={dIdx}
                            className={`w-5 h-5 rounded-md text-[9px] font-black flex items-center justify-center border ${
                              t.daysOfWeek.includes(dIdx)
                                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                : 'bg-slate-50 text-slate-300 border-slate-200'
                            }`}
                          >
                            {dName[0]}
                          </span>
                        ))}
                        <span className="text-xs text-slate-500 font-semibold ml-2">
                          {t.startTime} - {t.endTime} ({t.durationHours}h)
                        </span>
                      </div>
                      <span className="text-[11px] text-blue-700 font-bold block mt-0.5">
                        Professor: {t.teacherName || 'Não atribuído'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTurma(t);
                        setTurmaFormData({
                          name: t.name,
                          teacherId: t.teacherId,
                          daysOfWeek: t.daysOfWeek,
                          startTime: t.startTime,
                          endTime: t.endTime,
                          category: t.category || 'Futebol',
                          location: t.location || 'Campo Society 1',
                          active: t.active
                        });
                        setIsTurmaModalOpen(true);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                      title="Editar Turma"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteTurma(t.id, t.name)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                      title="Excluir Turma"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List of Eventos Avulsos */}
          {turmasSubTab === 'eventos' && (
            <div className="grid gap-3">
              {eventos.map((ev) => (
                <div
                  key={ev.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-rose-600 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
                      <Star className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{ev.name}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        Data: {ev.date} • {ev.startTime} - {ev.endTime} ({ev.durationHours}h)
                      </p>
                      <span className="text-[11px] text-rose-700 font-bold block mt-0.5">
                        Responsável: {ev.teacherName || 'Qualquer professor'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEvento(ev);
                        setEventoFormData({
                          name: ev.name,
                          date: ev.date,
                          startTime: ev.startTime,
                          endTime: ev.endTime,
                          teacherId: ev.teacherId || '',
                          location: ev.location || '',
                          description: ev.description || ''
                        });
                        setIsEventoModalOpen(true);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                      title="Editar Evento"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvento(ev.id, ev.name)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                      title="Excluir Evento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. SEÇÃO: VALORES POR HORA DA EQUIPE (Baseado em ManageProfiles.tsx) */}
      {activeSection === 'taxas' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Taxas Horárias da Equipe Técnica
                </h3>
                <p className="text-xs text-slate-500">
                  Configuração do valor da hora/aula de cada professor para a projeção e cálculo da folha
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {teachers.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block">{t.name}</span>
                      <span className="text-[11px] text-slate-400 block">{t.email} • {t.department || 'Professor'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-blue-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
                      R$ {t.hourlyRate},00/h
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTeacherForRate(t);
                        setNewHourlyRate(t.hourlyRate);
                        setIsRateModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all cursor-pointer"
                    >
                      Alterar Taxa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOVA / EDITAR TURMA FIXA */}
      {isTurmaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingTurma ? 'Editar Turma Fixa' : 'Nova Turma Fixa'}
              </h3>
              <button
                type="button"
                onClick={() => setIsTurmaModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTurma} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome da Turma</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Futebol Sub-9 • Turma Manhã"
                  value={turmaFormData.name}
                  onChange={(e) => setTurmaFormData({ ...turmaFormData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-bold text-slate-800 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dias da Semana</label>
                <div className="flex justify-between gap-1 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  {DAYS_NAMES_SHORT.map((dName, dIdx) => (
                    <button
                      key={dIdx}
                      type="button"
                      onClick={() => {
                        const cur = turmaFormData.daysOfWeek;
                        const next = cur.includes(dIdx) ? cur.filter(x => x !== dIdx) : [...cur, dIdx].sort();
                        setTurmaFormData({ ...turmaFormData, daysOfWeek: next });
                      }}
                      className={`w-8 h-8 rounded-lg font-black transition-all ${
                        turmaFormData.daysOfWeek.includes(dIdx)
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white text-slate-400 border border-slate-200'
                      }`}
                    >
                      {dName[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Horário Início</label>
                  <input
                    type="time"
                    required
                    value={turmaFormData.startTime}
                    onChange={(e) => setTurmaFormData({ ...turmaFormData, startTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Horário Fim</label>
                  <input
                    type="time"
                    required
                    value={turmaFormData.endTime}
                    onChange={(e) => setTurmaFormData({ ...turmaFormData, endTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Professor Responsável</label>
                <select
                  value={turmaFormData.teacherId}
                  onChange={(e) => setTurmaFormData({ ...turmaFormData, teacherId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-bold text-slate-800 bg-white"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md active:scale-98 cursor-pointer mt-2"
              >
                {editingTurma ? 'Salvar Alterações' : 'Criar Turma'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVO / EDITAR EVENTO AVULSO */}
      {isEventoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingEvento ? 'Editar Evento Avulso' : 'Novo Evento Avulso'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEventoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvento} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Evento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Torneio Inter-Turmas"
                  value={eventoFormData.name}
                  onChange={(e) => setEventoFormData({ ...eventoFormData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Data do Evento</label>
                <input
                  type="date"
                  required
                  value={eventoFormData.date}
                  onChange={(e) => setEventoFormData({ ...eventoFormData, date: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Início</label>
                  <input
                    type="time"
                    required
                    value={eventoFormData.startTime}
                    onChange={(e) => setEventoFormData({ ...eventoFormData, startTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fim</label>
                  <input
                    type="time"
                    required
                    value={eventoFormData.endTime}
                    onChange={(e) => setEventoFormData({ ...eventoFormData, endTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Professor Responsável</label>
                <select
                  value={eventoFormData.teacherId}
                  onChange={(e) => setEventoFormData({ ...eventoFormData, teacherId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-bold text-slate-800 bg-white"
                >
                  <option value="">Qualquer Professor</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md active:scale-98 cursor-pointer mt-2"
              >
                {editingEvento ? 'Salvar Alterações' : 'Cadastrar Evento'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR TAXA HORÁRIA */}
      {isRateModalOpen && selectedTeacherForRate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Taxa Horária • {selectedTeacherForRate.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsRateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacherRate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Valor por Hora/Aula (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  required
                  value={newHourlyRate}
                  onChange={(e) => setNewHourlyRate(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-black text-lg text-blue-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md active:scale-98 cursor-pointer mt-2"
              >
                Atualizar Taxa
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
