import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Star, 
  Users, 
  CheckSquare, 
  AlertCircle, 
  MapPin, 
  X, 
  Filter, 
  Sparkles, 
  CalendarCheck, 
  UserCheck, 
  Layers, 
  Tag, 
  Info,
  CalendarDays,
  ListOrdered
} from 'lucide-react';
import { 
  getFolhaTeachers, 
  getFolhaTurmas, 
  getFolhaEventos, 
  TeacherProfile, 
  ProfTurma, 
  ProfEventAvulso,
  MONTH_NAMES_PT,
  DAYS_NAMES_SHORT,
  DAYS_NAMES_FULL,
  calculateDurationHours
} from '../../../services/folhaPontoService';
import { getStoredTasks, GoogleTask } from '../../../services/tasksService';
import { SystemUser } from '../../../types';
import { dispatchPushNotification } from '../../../services/notificationService';

export interface UserPersonalCommitment {
  id: string;
  teacherId: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: 'plantao' | 'avaliacao' | 'reuniao' | 'substituicao' | 'personal';
  location?: string;
  notes?: string;
  completed?: boolean;
}

const COMMITMENTS_STORAGE_KEY = 'vbsport_user_agenda_commitments';

const INITIAL_COMMITMENTS: UserPersonalCommitment[] = [
  {
    id: 'com-1',
    teacherId: 'prof-1', // Rodrigo
    title: 'Avaliação Biomecânica & Bioimpedância • Aluno Lucas Mendes',
    date: '2026-09-30',
    startTime: '11:00',
    endTime: '12:00',
    type: 'avaliacao',
    location: 'Sala de Fisiologia e Avaliação',
    notes: 'Avaliação postural 3D e teste de 1RM no supino reto.'
  },
  {
    id: 'com-2',
    teacherId: 'prof-2', // Carlos
    title: 'Reunião de Alinhamento com Pais • Categoria Sub-11',
    date: '2026-10-02',
    startTime: '17:00',
    endTime: '18:00',
    type: 'reuniao',
    location: 'Auditório Ville Blanche',
    notes: 'Apresentação do calendário de jogos do mês de Outubro.'
  },
  {
    id: 'com-3',
    teacherId: 'prof-3', // Juliana
    title: 'Plantão Técnico & Atendimento Box Funcional',
    date: '2026-09-30',
    startTime: '16:00',
    endTime: '18:00',
    type: 'plantao',
    location: 'Box CrossFit Arena',
    notes: 'Orientação de iniciantes e demonstração de técnicas de LPO.'
  },
  {
    id: 'com-4',
    teacherId: 'prof-4', // Gianluca
    title: 'Reunião Geral de Coordenação Pedagógica e Esportiva',
    date: '2026-10-01',
    startTime: '09:00',
    endTime: '10:30',
    type: 'reuniao',
    location: 'Sala da Diretoria',
    notes: 'Definição das escalas e eventos de final de ano.'
  }
];

function getStoredCommitments(): UserPersonalCommitment[] {
  try {
    const saved = localStorage.getItem(COMMITMENTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_COMMITMENTS;
  } catch {
    return INITIAL_COMMITMENTS;
  }
}

function saveStoredCommitments(items: UserPersonalCommitment[]): void {
  try {
    localStorage.setItem(COMMITMENTS_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving commitments:', e);
  }
}

interface AgendaProfessorViewProps {
  currentUser?: SystemUser | null;
}

export interface AgendaItem {
  id: string;
  sourceType: 'turma' | 'evento' | 'tarefa' | 'compromisso';
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationHours: number;
  location?: string;
  notes?: string;
  statusBadge?: string;
  colorClass: {
    bg: string;
    text: string;
    border: string;
    dot: string;
  };
  completed?: boolean;
}

export const AgendaProfessorView: React.FC<AgendaProfessorViewProps> = ({ currentUser }) => {
  // Teachers list
  const teachers = useMemo(() => getFolhaTeachers(), []);

  // Selected teacher
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(() => {
    if (currentUser?.email) {
      const match = teachers.find(t => t.email.toLowerCase() === currentUser.email.toLowerCase());
      if (match) return match.id;
    }
    return teachers[0]?.id || 'prof-1';
  });

  // Calendar Date Navigation (Year / Month)
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth());

  // Selected Day in Calendar
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  // View Mode: 'mes' (Calendário Mensal) | 'semana' (Semanal) | 'timeline' (Timeline do Dia)
  const [viewMode, setViewMode] = useState<'mes' | 'semana' | 'timeline'>('mes');

  // Type Filters
  const [filterType, setFilterType] = useState<'all' | 'turma' | 'evento' | 'tarefa' | 'compromisso'>('all');

  // Data Sources
  const [turmas] = useState<ProfTurma[]>(() => getFolhaTurmas());
  const [eventos] = useState<ProfEventAvulso[]>(() => getFolhaEventos());
  const [tasks] = useState<GoogleTask[]>(() => getStoredTasks());
  const [commitments, setCommitments] = useState<UserPersonalCommitment[]>(() => getStoredCommitments());

  // Modal State for New Commitment
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [modalFormData, setModalFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    type: 'plantao' as UserPersonalCommitment['type'],
    location: 'Salão Principal Musculação',
    notes: ''
  });

  // Selected Agenda Item for detail popup
  const [inspectingItem, setInspectingItem] = useState<AgendaItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedTeacher = useMemo(() => {
    return teachers.find(t => t.id === selectedTeacherId) || teachers[0];
  }, [teachers, selectedTeacherId]);

  // Aggregate all items linked to the selected teacher
  const allTeacherItems = useMemo(() => {
    const items: AgendaItem[] = [];
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // 1. Turmas Fixas: repeat on the matching days of the week throughout the month
    const teacherTurmas = turmas.filter(t => t.active && t.teacherId === selectedTeacherId);
    teacherTurmas.forEach(turma => {
      for (let day = 1; day <= daysInMonth; day++) {
        const dObj = new Date(currentYear, currentMonth, day);
        const dow = dObj.getDay();

        if (turma.daysOfWeek.includes(dow)) {
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          items.push({
            id: `turma-${turma.id}-${dateStr}`,
            sourceType: 'turma',
            title: turma.name,
            date: dateStr,
            startTime: turma.startTime,
            endTime: turma.endTime,
            durationHours: turma.durationHours || calculateDurationHours(turma.startTime, turma.endTime),
            location: turma.location || 'Espaço Esportivo',
            notes: `Turma regular da grade • ${turma.category || 'Atividade'}`,
            colorClass: {
              bg: 'bg-blue-50 hover:bg-blue-100',
              text: 'text-blue-900',
              border: 'border-blue-300',
              dot: 'bg-blue-600'
            }
          });
        }
      }
    });

    // 2. Eventos Avulsos & Competições
    const teacherEventos = eventos.filter(ev => {
      if (ev.teacherId && ev.teacherId !== selectedTeacherId) return false;
      return true; // if no specific teacher, available or shared
    });

    teacherEventos.forEach(ev => {
      items.push({
        id: `ev-${ev.id}`,
        sourceType: 'evento',
        title: ev.name,
        date: ev.date,
        startTime: ev.startTime,
        endTime: ev.endTime,
        durationHours: ev.durationHours,
        location: ev.location,
        notes: ev.description || 'Evento especial agendado',
        colorClass: {
          bg: 'bg-purple-50 hover:bg-purple-100',
          text: 'text-purple-900',
          border: 'border-purple-300',
          dot: 'bg-purple-600'
        }
      });
    });

    // 3. Tarefas do Google Tasks com Prazo
    const teacherTasks = tasks.filter(t => t.assignedUserId === selectedTeacherId && t.dueDate);
    teacherTasks.forEach(t => {
      items.push({
        id: `task-${t.id}`,
        sourceType: 'tarefa',
        title: `Tarefa: ${t.title}`,
        date: t.dueDate!,
        startTime: t.dueTime || '12:00',
        endTime: t.dueTime || '12:30',
        durationHours: 0.5,
        location: 'Operacional / Unidade',
        notes: t.notes || 'Tarefa atribuída no Google Tasks',
        completed: t.completed,
        colorClass: {
          bg: t.completed ? 'bg-slate-50 opacity-60' : 'bg-emerald-50 hover:bg-emerald-100',
          text: t.completed ? 'text-slate-500 line-through' : 'text-emerald-900',
          border: 'border-emerald-300',
          dot: 'bg-emerald-600'
        }
      });
    });

    // 4. Compromissos Pessoais & Plantões
    const teacherCommitments = commitments.filter(c => c.teacherId === selectedTeacherId);
    teacherCommitments.forEach(c => {
      items.push({
        id: `com-${c.id}`,
        sourceType: 'compromisso',
        title: c.title,
        date: c.date,
        startTime: c.startTime,
        endTime: c.endTime,
        durationHours: calculateDurationHours(c.startTime, c.endTime),
        location: c.location,
        notes: c.notes,
        completed: c.completed,
        colorClass: {
          bg: 'bg-amber-50 hover:bg-amber-100',
          text: 'text-amber-900',
          border: 'border-amber-300',
          dot: 'bg-amber-600'
        }
      });
    });

    // Sort by startTime
    return items.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [turmas, eventos, tasks, commitments, selectedTeacherId, currentYear, currentMonth]);

  // Filtered by selected type
  const filteredItems = useMemo(() => {
    if (filterType === 'all') return allTeacherItems;
    return allTeacherItems.filter(i => i.sourceType === filterType);
  }, [allTeacherItems, filterType]);

  // Items for the selected day
  const itemsForSelectedDate = useMemo(() => {
    return filteredItems.filter(i => i.date === selectedDate);
  }, [filteredItems, selectedDate]);

  // Overall Month Statistics for Selected Teacher
  const monthStats = useMemo(() => {
    const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const inMonth = allTeacherItems.filter(i => i.date.startsWith(monthStr));

    const totalTurmas = inMonth.filter(i => i.sourceType === 'turma').length;
    const totalEventos = inMonth.filter(i => i.sourceType === 'evento').length;
    const totalTarefas = inMonth.filter(i => i.sourceType === 'tarefa').length;
    const totalCompromissos = inMonth.filter(i => i.sourceType === 'compromisso').length;
    const totalHours = inMonth.reduce((acc, curr) => acc + curr.durationHours, 0);

    return {
      totalTurmas,
      totalEventos,
      totalTarefas,
      totalCompromissos,
      totalHours: parseFloat(totalHours.toFixed(1))
    };
  }, [allTeacherItems, currentYear, currentMonth]);

  // Calendar Grid Days
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ day: 0, dateStr: '', isCurrentMonth: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, dateStr, isCurrentMonth: true });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Week View Days (7 days around or containing selectedDate)
  const weekDays = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const curr = new Date(y, m - 1, d);
    const dayOfWeek = curr.getDay(); // 0 is Sunday

    const startOfWeek = new Date(curr);
    startOfWeek.setDate(curr.getDate() - dayOfWeek);

    const result = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      const dateStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;
      result.push({
        date: dayDate,
        dateStr,
        dayNumber: dayDate.getDate(),
        dayName: DAYS_NAMES_SHORT[i],
        dayFull: DAYS_NAMES_FULL[i]
      });
    }
    return result;
  }, [selectedDate]);

  // Handlers for Month Navigation
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
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  // Submit New Personal Commitment
  const handleCreateCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalFormData.title.trim()) return;

    const newCom: UserPersonalCommitment = {
      id: `com-${Date.now()}`,
      teacherId: selectedTeacherId,
      ...modalFormData
    };

    const next = [newCom, ...commitments];
    setCommitments(next);
    saveStoredCommitments(next);
    setIsNewModalOpen(false);
    showToast(`Compromisso agendado para ${selectedTeacher.name}!`);
    dispatchPushNotification({
      title: 'Novo Agendamento na Agenda',
      message: `"${newCom.title}" agendado para ${newCom.date} (${newCom.startTime} às ${newCom.endTime}).`,
      type: 'info',
      module: 'agenda',
      eventType: 'agenda_compromisso',
      linkTab: 'professores',
      actionLabel: 'Ver Agenda'
    });

    setModalFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '11:00',
      type: 'plantao',
      location: 'Salão Principal Musculação',
      notes: ''
    });
  };

  // Delete Commitment
  const handleDeleteCommitment = (id: string, title: string) => {
    if (confirm(`Deseja remover o agendamento "${title}"?`)) {
      const realId = id.replace('com-', '');
      const next = commitments.filter(c => c.id !== realId && c.id !== id);
      setCommitments(next);
      saveStoredCommitments(next);
      setInspectingItem(null);
      showToast('Compromisso cancelado da agenda.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR: Teacher Selector + User Profile Snapshot */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {selectedTeacher.avatar ? (
              <img
                src={selectedTeacher.avatar}
                alt={selectedTeacher.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-600 shadow-md shadow-blue-500/20 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                {selectedTeacher.name.charAt(0)}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Agenda de {selectedTeacher.name}
                </h2>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {selectedTeacher.role === 'coordinator' ? 'Coordenador Geral' : 'Professor VB Sport'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Calendário integrado com turmas da grade, eventos especiais, tarefas do Google Tasks e compromissos do usuário
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Teacher Switcher */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-400 font-semibold">Professor:</span>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.department || 'Treinador'})</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Agendamento</span>
            </button>
          </div>
        </div>

        {/* User Commitment Statistics Cards for Month */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">Aulas na Grade</span>
            <span className="text-lg font-black text-blue-950 block mt-0.5">{monthStats.totalTurmas} sessões</span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/70">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">Eventos / Jogos</span>
            <span className="text-lg font-black text-purple-950 block mt-0.5">{monthStats.totalEventos} eventos</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">Tarefas no Prazo</span>
            <span className="text-lg font-black text-emerald-950 block mt-0.5">{monthStats.totalTarefas} tarefas</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">Plantões & Extras</span>
            <span className="text-lg font-black text-amber-950 block mt-0.5">{monthStats.totalCompromissos} itens</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 text-white col-span-2 sm:col-span-1 shadow-md">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Horas Totais</span>
            <span className="text-lg font-black text-white block mt-0.5">{monthStats.totalHours}h no mês</span>
          </div>
        </div>
      </div>

      {/* VIEW CONTROLS & DATE NAVIGATION BAR */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Month Navigation */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
            title="Mês Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-base font-black text-slate-900 capitalize min-w-[150px] text-center">
            {MONTH_NAMES_PT[currentMonth]} {currentYear}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
            title="Próximo Mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleGoToday}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all ml-1"
          >
            Hoje
          </button>
        </div>

        {/* View Mode Switcher (Mês / Semana / Timeline) */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('mes')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'mes' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Mês</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('semana')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'semana' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Semana</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'timeline' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Timeline Diária</span>
            </button>
          </div>
        </div>

        {/* Filter by Category */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tudo ({allTeacherItems.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('turma')}
            className={`px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              filterType === 'turma' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800'
            }`}
          >
            Aulas ({allTeacherItems.filter(i => i.sourceType === 'turma').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('evento')}
            className={`px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              filterType === 'evento' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-800'
            }`}
          >
            Eventos ({allTeacherItems.filter(i => i.sourceType === 'evento').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('tarefa')}
            className={`px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              filterType === 'tarefa' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            Tarefas ({allTeacherItems.filter(i => i.sourceType === 'tarefa').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('compromisso')}
            className={`px-2.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              filterType === 'compromisso' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800'
            }`}
          >
            Plantões ({allTeacherItems.filter(i => i.sourceType === 'compromisso').length})
          </button>
        </div>
      </div>

      {/* 1. VISÃO MENSAL (Grid do Mês com marcações das atividades) */}
      {viewMode === 'mes' && (
        <div className="space-y-4">
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {DAYS_NAMES_SHORT.map((dayName) => (
                <div key={dayName} className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  {dayName}
                </div>
              ))}
            </div>

            {/* Days cells */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {calendarDays.map((item, idx) => {
                if (!item.isCurrentMonth) {
                  return <div key={idx} className="min-h-[85px] sm:min-h-[110px] rounded-2xl bg-slate-50/40 opacity-20" />;
                }

                const isSelected = item.dateStr === selectedDate;
                const isToday = item.dateStr === new Date().toISOString().split('T')[0];
                const dayItems = filteredItems.filter(i => i.date === item.dateStr);

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`min-h-[85px] sm:min-h-[110px] p-2 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-xs'
                        : isToday
                        ? 'border-red-400 bg-red-50/20'
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black ${
                        isSelected ? 'text-blue-900 font-extrabold' : isToday ? 'text-red-600 font-extrabold' : 'text-slate-700'
                      }`}>
                        {item.day}
                      </span>

                      {dayItems.length > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                          {dayItems.length}
                        </span>
                      )}
                    </div>

                    {/* Chips Preview of Activities */}
                    <div className="space-y-1 mt-1 overflow-hidden">
                      {dayItems.slice(0, 3).map((act) => (
                        <div
                          key={act.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingItem(act);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold truncate flex items-center gap-1 border ${act.colorClass.border} ${act.colorClass.bg} ${act.colorClass.text}`}
                          title={`${act.startTime} - ${act.title}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${act.colorClass.dot}`} />
                          <span className="truncate">{act.startTime} {act.title}</span>
                        </div>
                      ))}

                      {dayItems.length > 3 && (
                        <span className="text-[8px] text-slate-400 font-bold block pl-1">
                          +{dayItems.length - 3} mais...
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. VISÃO SEMANAL (Escala Horária de Segunda a Domingo) */}
      {viewMode === 'semana' && (
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4 overflow-x-auto">
          <div className="grid grid-cols-7 gap-2 min-w-[700px]">
            {weekDays.map((wDay) => {
              const isSelected = wDay.dateStr === selectedDate;
              const isToday = wDay.dateStr === new Date().toISOString().split('T')[0];
              const dayItems = filteredItems.filter(i => i.date === wDay.dateStr);

              return (
                <div
                  key={wDay.dateStr}
                  onClick={() => setSelectedDate(wDay.dateStr)}
                  className={`rounded-2xl border p-3 flex flex-col min-h-[350px] transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/20'
                      : isToday
                      ? 'border-red-300 bg-red-50/10'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-center pb-2 border-b border-slate-200/70 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      {wDay.dayName}
                    </span>
                    <span className={`text-base font-black ${isToday ? 'text-red-600' : 'text-slate-900'}`}>
                      {wDay.dayNumber}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                    {dayItems.length === 0 ? (
                      <span className="text-[10px] text-slate-300 font-medium text-center block pt-8">
                        Livre
                      </span>
                    ) : (
                      dayItems.map((act) => (
                        <div
                          key={act.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingItem(act);
                          }}
                          className={`p-2 rounded-xl border text-left space-y-1 transition-all shadow-2xs hover:shadow-xs ${act.colorClass.border} ${act.colorClass.bg}`}
                        >
                          <div className="flex items-center gap-1 text-[9px] font-black uppercase text-slate-500">
                            <Clock className="w-2.5 h-2.5 text-blue-600" />
                            <span>{act.startTime} - {act.endTime}</span>
                          </div>
                          <span className={`text-xs font-bold block leading-tight ${act.colorClass.text}`}>
                            {act.title}
                          </span>
                          {act.location && (
                            <span className="text-[9px] text-slate-500 block truncate">
                              📍 {act.location}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. VISÃO TIMELINE DIÁRIA (Ou detalhamento do dia selecionado) */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Compromissos do Dia: {selectedDate}
              </h3>
              <p className="text-xs text-slate-500">
                Tudo o que está atribuído e vinculado a {selectedTeacher.name} nesta data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
              {itemsForSelectedDate.length} {itemsForSelectedDate.length === 1 ? 'item agendado' : 'itens agendados'}
            </span>
          </div>
        </div>

        {itemsForSelectedDate.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Nenhum compromisso para este dia</h4>
            <p className="text-xs text-slate-400">
              O professor não possui turmas da grade, tarefas ou eventos vinculados para esta data.
            </p>
            <button
              type="button"
              onClick={() => {
                setModalFormData(prev => ({ ...prev, date: selectedDate }));
                setIsNewModalOpen(true);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Agendar Compromisso Nesta Data</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {itemsForSelectedDate.map((item) => (
              <div
                key={item.id}
                onClick={() => setInspectingItem(item)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 ${item.colorClass.border} bg-white hover:bg-slate-50/60`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 ${item.colorClass.bg}`}>
                    {item.sourceType === 'turma' && <Users className="w-5 h-5 text-blue-700" />}
                    {item.sourceType === 'evento' && <Star className="w-5 h-5 text-purple-700" />}
                    {item.sourceType === 'tarefa' && <CheckSquare className="w-5 h-5 text-emerald-700" />}
                    {item.sourceType === 'compromisso' && <Clock className="w-5 h-5 text-amber-700" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`text-sm font-bold text-slate-900 ${item.completed ? 'line-through text-slate-400' : ''}`}>
                        {item.title}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.colorClass.bg} ${item.colorClass.text}`}>
                        {item.sourceType === 'turma' && 'Grade Regular'}
                        {item.sourceType === 'evento' && 'Evento Especial'}
                        {item.sourceType === 'tarefa' && 'Google Tasks'}
                        {item.sourceType === 'compromisso' && 'Plantão / Extra'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {item.startTime} às {item.endTime} ({item.durationHours}h)
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectingItem(item);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-700 text-xs font-bold border border-slate-200 transition-all"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: NOVO COMPROMISSO NA AGENDA DO PROFESSOR */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Novo Agendamento na Agenda
                </h3>
                <span className="text-xs text-slate-400">
                  Professor: <strong>{selectedTeacher.name}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCommitment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título do Compromisso</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Avaliação Biomecânica / Plantão Extra"
                  value={modalFormData.title}
                  onChange={(e) => setModalFormData({ ...modalFormData, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-bold text-slate-800 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={modalFormData.date}
                    onChange={(e) => setModalFormData({ ...modalFormData, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Atividade</label>
                  <select
                    value={modalFormData.type}
                    onChange={(e) => setModalFormData({ ...modalFormData, type: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-800 bg-white"
                  >
                    <option value="plantao">Plantão de Sala</option>
                    <option value="avaliacao">Avaliação Física</option>
                    <option value="reuniao">Reunião Técnica</option>
                    <option value="substituicao">Substituição</option>
                    <option value="personal">Treino Personal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Horário Início</label>
                  <input
                    type="time"
                    required
                    value={modalFormData.startTime}
                    onChange={(e) => setModalFormData({ ...modalFormData, startTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Horário Fim</label>
                  <input
                    type="time"
                    required
                    value={modalFormData.endTime}
                    onChange={(e) => setModalFormData({ ...modalFormData, endTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Local / Sala</label>
                <input
                  type="text"
                  placeholder="Ex: Sala de Avaliação, Campo 1..."
                  value={modalFormData.location}
                  onChange={(e) => setModalFormData({ ...modalFormData, location: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observações e Orientações</label>
                <textarea
                  rows={2}
                  placeholder="Detalhes ou checklist do compromisso..."
                  value={modalFormData.notes}
                  onChange={(e) => setModalFormData({ ...modalFormData, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-slate-700 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md active:scale-98 cursor-pointer mt-2"
              >
                Salvar na Agenda do Usuário
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETALHES DO ITEM INSPECIONADO */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${inspectingItem.colorClass.bg} ${inspectingItem.colorClass.text}`}>
                {inspectingItem.sourceType.toUpperCase()}
              </span>

              <button
                type="button"
                onClick={() => setInspectingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                {inspectingItem.title}
              </h3>
              <div className="space-y-1 text-slate-600">
                <p><strong>Data:</strong> {inspectingItem.date}</p>
                <p><strong>Horário:</strong> {inspectingItem.startTime} às {inspectingItem.endTime} ({inspectingItem.durationHours}h)</p>
                {inspectingItem.location && <p><strong>Local:</strong> {inspectingItem.location}</p>}
                {inspectingItem.notes && (
                  <p className="mt-2 p-3 rounded-xl bg-slate-50 text-slate-700 border border-slate-200">
                    {inspectingItem.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {inspectingItem.sourceType === 'compromisso' && (
                <button
                  type="button"
                  onClick={() => handleDeleteCommitment(inspectingItem.id, inspectingItem.title)}
                  className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold"
                >
                  Excluir da Agenda
                </button>
              )}

              <button
                type="button"
                onClick={() => setInspectingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold ml-auto"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
