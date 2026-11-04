import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Dumbbell, 
  DollarSign, 
  Trophy, 
  Sparkles,
  Layers
} from 'lucide-react';
import { ClassSession, Student, CalendarEvent, AgendaSubTab } from '../../types';
import { AgendaCalendarioView } from './agenda/AgendaCalendarioView';
import { AgendaGradeView } from './agenda/AgendaGradeView';
import { AgendaLocacoesView } from './agenda/AgendaLocacoesView';
import { AgendaJogosView } from './agenda/AgendaJogosView';
import { AgendaEventosView } from './agenda/AgendaEventosView';

interface AgendaTabProps {
  classes: ClassSession[];
  students: Student[];
  calendarEvents: CalendarEvent[];
  subTab?: AgendaSubTab;
  onSubTabChange?: (subTab: AgendaSubTab) => void;
  onToggleCheckIn: (classId: string, studentId: string) => void;
  onSetAttendance?: (classId: string, studentId: string, status: 'presente' | 'falta' | 'pendente') => void;
  onBulkSetAttendance?: (classId: string, status: 'presente' | 'falta' | 'pendente') => void;
  onEnrollStudent: (classId: string, student: Student) => void;
  onAddNewClass: (newClass: ClassSession) => void;
  onAddCalendarEvent: (event: CalendarEvent) => void;
  onUpdateCalendarEventStatus: (eventId: string, newStatus: CalendarEvent['status']) => void;
  onDeleteCalendarEvent: (eventId: string) => void;
  onOpenConfiguracoes?: () => void;
}

export const AgendaTab: React.FC<AgendaTabProps> = ({
  classes,
  students,
  calendarEvents,
  subTab: externalSubTab,
  onSubTabChange,
  onToggleCheckIn,
  onSetAttendance,
  onBulkSetAttendance,
  onEnrollStudent,
  onAddNewClass,
  onAddCalendarEvent,
  onUpdateCalendarEventStatus,
  onDeleteCalendarEvent,
  onOpenConfiguracoes
}) => {
  const [internalSubTab, setInternalSubTab] = useState<AgendaSubTab>('calendario');
  const activeSubTab = externalSubTab || internalSubTab;

  const handleSubTabClick = (tab: AgendaSubTab) => {
    if (onSubTabChange) {
      onSubTabChange(tab);
    } else {
      setInternalSubTab(tab);
    }
  };

  const subTabsConfig: {
    id: AgendaSubTab;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }[] = [
    {
      id: 'calendario',
      label: 'Calendário',
      description: 'Grade, Locações, Jogos & Diversos',
      icon: CalendarIcon,
      badge: calendarEvents.length
    },
    {
      id: 'grade',
      label: 'Grade de Turmas',
      description: 'Aulas coletivas & Check-in',
      icon: Dumbbell,
      badge: classes.length
    },
    {
      id: 'locacoes',
      label: 'Locações',
      description: 'Quadras, Campos & Salas',
      icon: DollarSign,
      badge: calendarEvents.filter(e => e.category === 'locacao').length
    },
    {
      id: 'jogos',
      label: 'Eventos de Jogos',
      description: 'Torneios & Campeonatos',
      icon: Trophy,
      badge: calendarEvents.filter(e => e.category === 'evento_jogo').length
    },
    {
      id: 'eventos',
      label: 'Eventos Diversos',
      description: 'Workshops & Aulões',
      icon: Sparkles,
      badge: calendarEvents.filter(e => e.category === 'evento_diverso').length
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            Agenda & Calendário Geral
          </h1>
          <p className="text-sm text-slate-500">
            Gestão integrada de horários de turmas, locação de quadras/campos, campeonatos esportivos e eventos diversos
          </p>
        </div>
      </div>

      {/* Sub-tab Content Rendering */}
      <div key={activeSubTab} className="animate-subtab-fade-in">
        {activeSubTab === 'calendario' && (
          <AgendaCalendarioView
            events={calendarEvents}
            onAddEvent={onAddCalendarEvent}
            onUpdateEventStatus={onUpdateCalendarEventStatus}
            onDeleteEvent={onDeleteCalendarEvent}
          />
        )}

        {activeSubTab === 'grade' && (
          <AgendaGradeView
            classes={classes}
            students={students}
            onToggleCheckIn={onToggleCheckIn}
            onSetAttendance={onSetAttendance}
            onBulkSetAttendance={onBulkSetAttendance}
            onEnrollStudent={onEnrollStudent}
            onAddNewClass={onAddNewClass}
            onOpenConfiguracoes={onOpenConfiguracoes}
          />
        )}

        {activeSubTab === 'locacoes' && (
          <AgendaLocacoesView
            events={calendarEvents}
            onAddEvent={onAddCalendarEvent}
            onUpdateEventStatus={onUpdateCalendarEventStatus}
            onOpenAddModalWithCategory={() => {
              handleSubTabClick('calendario');
            }}
          />
        )}

        {activeSubTab === 'jogos' && (
          <AgendaJogosView
            events={calendarEvents}
            onAddEvent={onAddCalendarEvent}
            onUpdateEventStatus={onUpdateCalendarEventStatus}
            onOpenAddModalWithCategory={() => {
              handleSubTabClick('calendario');
            }}
          />
        )}

        {activeSubTab === 'eventos' && (
          <AgendaEventosView
            events={calendarEvents}
            onAddEvent={onAddCalendarEvent}
            onUpdateEventStatus={onUpdateCalendarEventStatus}
            onOpenAddModalWithCategory={() => {
              handleSubTabClick('calendario');
            }}
          />
        )}
      </div>
    </div>
  );
};
