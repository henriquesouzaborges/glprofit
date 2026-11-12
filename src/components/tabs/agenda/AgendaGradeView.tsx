import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Clock, 
  Users, 
  Plus, 
  CheckCircle2, 
  UserPlus, 
  MapPin, 
  ChevronRight,
  Search,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  Check,
  X,
  Volume2,
  VolumeX,
  AlertCircle,
  Settings
} from 'lucide-react';
import { ClassSession, Student, EnrolledStudent } from '../../../types';
import { getAgendaSettings, updateAgendaSettings, AgendaSettingsConfig } from '../../../services/tabSettingsService';

interface AgendaGradeViewProps {
  classes?: ClassSession[];
  students?: Student[];
  onToggleCheckIn: (classId: string, studentId: string) => void;
  onEnrollStudent: (classId: string, student: Student) => void;
  onAddNewClass: (newClass: ClassSession) => void;
  onSetAttendance?: (classId: string, studentId: string, status: 'presente' | 'falta' | 'pendente') => void;
  onBulkSetAttendance?: (classId: string, status: 'presente' | 'falta' | 'pendente') => void;
  onOpenConfiguracoes?: () => void;
}

export const AgendaGradeView: React.FC<AgendaGradeViewProps> = ({
  classes = [],
  students = [],
  onToggleCheckIn,
  onEnrollStudent,
  onAddNewClass,
  onSetAttendance,
  onBulkSetAttendance,
  onOpenConfiguracoes
}) => {
  const [selectedModality, setSelectedModality] = useState<string>('todas');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes?.[0]?.id || '');
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollStudentId, setEnrollStudentId] = useState('');

  // Agenda Settings from tabSettingsService (modoChamada, etc.)
  const [settings, setSettings] = useState<AgendaSettingsConfig>(() => getAgendaSettings());

  // Listen or refresh settings
  useEffect(() => {
    const refreshSettings = () => {
      setSettings(getAgendaSettings());
    };
    refreshSettings();

    window.addEventListener('vbsport_tab_settings_changed', refreshSettings);
    window.addEventListener('storage', refreshSettings);
    return () => {
      window.removeEventListener('vbsport_tab_settings_changed', refreshSettings);
      window.removeEventListener('storage', refreshSettings);
    };
  }, []);

  // Form State for new class
  const [title, setTitle] = useState('');
  const [modality, setModality] = useState<ClassSession['modality']>('CrossFit / Funcional');
  const [instructor, setInstructor] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60 min');
  const [capacity, setCapacity] = useState(20);
  const [room, setRoom] = useState('Box CrossFit Arena');
  const [dayOfWeek, setDayOfWeek] = useState('Segunda, Quarta, Sexta');

  // Keep selectedClass synchronized with parent classes
  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0] || null;

  const filteredClasses = classes.filter(c => {
    if (selectedModality === 'todas') return true;
    return c.modality === selectedModality;
  });

  // Sound feedback synthesizer using Web Audio API
  const playAudioCue = (type: 'presenca' | 'falta') => {
    if (!settings.feedbackSonoro) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'presenca') {
        // High, cheerful ascending tone (880Hz -> 1320Hz)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else {
        // Soft descending tone for absence (320Hz -> 220Hz)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch {
      // Audio playback fallback
    }
  };

  const handleAttendanceChange = (
    studentId: string, 
    requestedStatus: 'presente' | 'falta'
  ) => {
    if (!selectedClass) return;
    const enrolled = selectedClass.enrolledStudents.find(e => e.studentId === studentId);
    if (!enrolled) return;

    // Check if clicking the same status -> toggle to pendente
    const isAlreadyThisStatus = 
      (requestedStatus === 'presente' && (enrolled.checkedIn || enrolled.status === 'presente')) ||
      (requestedStatus === 'falta' && enrolled.status === 'falta');

    const nextStatus: 'presente' | 'falta' | 'pendente' = isAlreadyThisStatus ? 'pendente' : requestedStatus;

    if (nextStatus === 'presente') {
      playAudioCue('presenca');
    } else if (nextStatus === 'falta') {
      playAudioCue('falta');
    }

    if (onSetAttendance) {
      onSetAttendance(selectedClass.id, studentId, nextStatus);
    } else {
      // Fallback
      onToggleCheckIn(selectedClass.id, studentId);
    }
  };

  const handleBulkAttendance = (status: 'presente' | 'falta' | 'pendente') => {
    if (!selectedClass) return;
    if (status === 'presente') playAudioCue('presenca');
    if (status === 'falta') playAudioCue('falta');

    if (onBulkSetAttendance) {
      onBulkSetAttendance(selectedClass.id, status);
    } else {
      // Fallback: toggle all to checkedIn or not
      selectedClass.enrolledStudents.forEach(e => {
        if (status === 'presente' && !e.checkedIn) {
          onToggleCheckIn(selectedClass.id, e.studentId);
        } else if (status !== 'presente' && e.checkedIn) {
          onToggleCheckIn(selectedClass.id, e.studentId);
        }
      });
    }
  };

  const handleToggleModoChamada = () => {
    const nextMode: 'dedao' | 'tradicional' = settings.modoChamada === 'dedao' ? 'tradicional' : 'dedao';
    const updated = { ...settings, modoChamada: nextMode };
    setSettings(updated);
    updateAgendaSettings({ modoChamada: nextMode });
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !instructor || !time) return;

    const newCls: ClassSession = {
      id: `cls-${Date.now()}`,
      title,
      modality,
      instructor,
      time,
      duration,
      dayOfWeek,
      capacity: Number(capacity),
      room,
      enrolledStudents: []
    };

    onAddNewClass(newCls);
    setShowAddClassModal(false);
    setSelectedClassId(newCls.id);
    setTitle('');
    setInstructor('');
    setTime('');
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !enrollStudentId) return;
    const student = students.find(s => s.id === enrollStudentId);
    if (student) {
      onEnrollStudent(selectedClass.id, student);
      setShowEnrollModal(false);
      setEnrollStudentId('');
    }
  };

  // Metrics for selected class
  const presentCount = selectedClass?.enrolledStudents.filter(
    s => s.checkedIn || s.status === 'presente'
  ).length || 0;
  const absenceCount = selectedClass?.enrolledStudents.filter(
    s => s.status === 'falta'
  ).length || 0;
  const pendingCount = (selectedClass?.enrolledStudents.length || 0) - presentCount - absenceCount;

  return (
    <div className="space-y-6">
      {/* Top action row and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filter Modalities */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            'todas',
            'CrossFit / Funcional',
            'Spinning',
            'Pilates',
            'Muay Thai / Lutas'
          ].map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModality(mod)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                selectedModality === mod
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddClassModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-blue-700 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Nova Turma / Horário
        </button>
      </div>

      {/* Main Grid: Class Cards (left 7 cols) and Attendance Panel (right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Class Cards List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Turmas Ativas na Grade ({filteredClasses.length})
          </div>

          {filteredClasses.map((c) => {
            const isSelected = selectedClass?.id === c.id;
            const occupancy = c.enrolledStudents.length;
            const percent = Math.round((occupancy / c.capacity) * 100);

            return (
              <div
                key={c.id}
                onClick={() => setSelectedClassId(c.id)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/40 shadow-xs ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-600 mb-1">
                      {c.modality}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {c.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Clock className="h-3.5 w-3.5 text-blue-600" />
                        {c.time} ({c.duration})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {c.room}
                      </span>
                    </div>
                  </div>

                  {/* Occupancy Pill */}
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      percent >= 90 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200/60' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    }`}>
                      <Users className="h-3 w-3" />
                      {occupancy} / {c.capacity} vagas
                    </span>
                    <div className="mt-1 text-[11px] text-slate-400">
                      {c.dayOfWeek}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500">
                  <span>Instrutor: <strong className="text-slate-800 font-medium">{c.instructor}</strong></span>
                  <span className="text-blue-600 font-medium flex items-center gap-0.5">
                    Ver Presença & Alunos <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Class Panel (Attendance & Check-in) */}
        <div className="lg:col-span-5">
          {selectedClass ? (
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              {/* Class Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedClass.title}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {selectedClass.time} • {selectedClass.instructor} • {selectedClass.room}
                  </div>
                </div>

                <button
                  onClick={() => setShowEnrollModal(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-colors shrink-0"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Inscrever</span>
                </button>
              </div>

              {/* Attendance Mode Configuration Bar */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      {settings.modoChamada === 'dedao' ? (
                        <>
                          <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                          <span>Modo Sinal de Dedão (👍/👎)</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Modo Tradicional (Check-in)</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleModoChamada}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/80 px-2 py-0.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="Alternar entre sinal de dedão e modo tradicional"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      <span>Alternar Modo</span>
                    </button>

                    {onOpenConfiguracoes && (
                      <button
                        type="button"
                        onClick={onOpenConfiguracoes}
                        className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        title="Abrir configurações detalhadas da Agenda na aba Configurações"
                      >
                        <Settings className="w-3 h-3 text-slate-500" />
                        <span>Configurações</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Attendance Statistics Counter */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-base font-extrabold text-emerald-700">{presentCount}</div>
                  <div className="text-[10px] font-bold uppercase text-emerald-600">Presentes</div>
                </div>
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                  <div className="text-base font-extrabold text-rose-700">{absenceCount}</div>
                  <div className="text-[10px] font-bold uppercase text-rose-600">Faltas</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-base font-extrabold text-slate-700">{pendingCount}</div>
                  <div className="text-[10px] font-bold uppercase text-slate-500">Pendentes</div>
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center justify-between gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Ações Rápidas:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleBulkAttendance('presente')}
                    className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center gap-1 border border-emerald-200 transition-colors"
                    title="Marcar todos como presentes com dedão pra cima"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Todos 👍</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAttendance('falta')}
                    className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold flex items-center gap-1 border border-rose-200 transition-colors"
                    title="Marcar todos com falta"
                  >
                    <ThumbsDown className="w-3 h-3" />
                    <span>Todos 👎</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAttendance('pendente')}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Reiniciar lista para pendente"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Enrolled Students / Call List */}
              <div className="space-y-2 pt-1">
                <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {selectedClass.enrolledStudents.length > 0 ? (
                    selectedClass.enrolledStudents.map((enrolled) => {
                      const isPresente = enrolled.checkedIn || enrolled.status === 'presente';
                      const isFalta = enrolled.status === 'falta';

                      return (
                        <div
                          key={enrolled.studentId}
                          className={`flex items-center justify-between rounded-xl p-3 border transition-all ${
                            isPresente
                              ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                              : isFalta
                              ? 'bg-rose-50/40 border-rose-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {enrolled.studentName}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              {isPresente ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100/70 text-emerald-700">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  <span>Presente ({enrolled.checkInTime || 'Professor'})</span>
                                </span>
                              ) : isFalta ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                                  <X className="w-2.5 h-2.5 stroke-[3]" />
                                  <span>Falta Registrada</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium text-slate-400">
                                  ○ Pendente de Chamada
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Attendance Controls */}
                          {settings.modoChamada === 'dedao' ? (
                            /* SINAL DE DEDÃO (👍 PRESENÇA / 👎 FALTA) */
                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* Botão Dedão para Cima (Presença) */}
                              <button
                                type="button"
                                onClick={() => handleAttendanceChange(enrolled.studentId, 'presente')}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer ${
                                  isPresente
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 ring-2 ring-emerald-400'
                                    : 'bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-300 hover:border-emerald-300'
                                }`}
                                title="Dedão para cima: dar presença para o aluno (👍)"
                              >
                                <ThumbsUp className={`w-3.5 h-3.5 ${isPresente ? 'fill-white stroke-white' : ''}`} />
                                <span className="text-[11px]">{isPresente ? 'Presente' : '👍'}</span>
                              </button>

                              {/* Botão Dedão para Baixo (Falta) */}
                              <button
                                type="button"
                                onClick={() => handleAttendanceChange(enrolled.studentId, 'falta')}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer ${
                                  isFalta
                                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 ring-2 ring-rose-400'
                                    : 'bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-300 hover:border-rose-300'
                                }`}
                                title="Dedão para baixo: marcar falta para o aluno (👎)"
                              >
                                <ThumbsDown className={`w-3.5 h-3.5 ${isFalta ? 'fill-white stroke-white' : ''}`} />
                                <span className="text-[11px]">{isFalta ? 'Falta' : '👎'}</span>
                              </button>
                            </div>
                          ) : (
                            /* MODO TRADICIONAL (BOTÃO DE CHECK-IN) */
                            <button
                              type="button"
                              onClick={() => onToggleCheckIn(selectedClass.id, enrolled.studentId)}
                              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer shadow-2xs ${
                                isPresente
                                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {isPresente ? 'Desfazer' : 'Confirmar Presença'}
                            </button>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                      Nenhum aluno inscrito nesta turma ainda.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400 text-xs shadow-xs">
              Selecione uma turma ao lado para gerenciar a lista de presença e inscrições.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Enroll Student */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Inscrever Aluno em: {selectedClass?.title}
            </h3>

            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selecione o Aluno
                </label>
                <select
                  value={enrollStudentId}
                  onChange={(e) => setEnrollStudentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-hidden"
                  required
                >
                  <option value="">Selecione um aluno da academia...</option>
                  {students.map((std) => (
                    <option key={std.id} value={std.id}>
                      {std.name} ({std.code}) - {std.planName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Confirmar Inscrição
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Class */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Criar Nova Turma / Horário
            </h3>

            <form onSubmit={handleCreateClass} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título da Turma
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Funcional HIIT 18h"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Modalidade
                  </label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="Musculação">Musculação</option>
                    <option value="CrossFit / Funcional">CrossFit / Funcional</option>
                    <option value="Spinning">Spinning</option>
                    <option value="Pilates">Pilates</option>
                    <option value="Muay Thai / Lutas">Muay Thai / Lutas</option>
                    <option value="Natação">Natação</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Instrutor Responsável
                  </label>
                  <input
                    type="text"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="Ex: Prof. Rodrigo Tavares"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Horário (Início - Fim)
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="18:00 - 19:00"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duração
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="60 min"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Capacidade Máxima
                  </label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Espaço / Sala
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Sala 01, Box Funcional..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dias da Semana
                  </label>
                  <input
                    type="text"
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    placeholder="Segunda, Quarta, Sexta"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Salvar Turma na Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
