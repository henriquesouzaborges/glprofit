import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Plus, 
  Dumbbell, 
  Calculator, 
  Check, 
  Award,
  Sparkles,
  Filter,
  ChevronDown,
  Search,
  X,
  RotateCcw,
  FileText,
  MessageCircle,
  Send,
  Smartphone,
  CheckCheck
} from 'lucide-react';
import { Student, WorkoutPlan } from '../../../types';
import { INITIAL_LOAD_LOGS } from './exerciseDatabase';
import { INITIAL_WORKOUTS } from '../../../mockData';
import { TreinoPdfReportModal } from './TreinoPdfReportModal';
import { WhatsAppReminderModal, WhatsAppReminderConfig } from './WhatsAppReminderModal';

interface ControleCargaTabProps {
  students: Student[];
  workouts?: WorkoutPlan[];
  selectedStudentId?: string;
  onSelectStudentId?: (id: string) => void;
  onExportPdf?: () => void;
}

export const ControleCargaTab: React.FC<ControleCargaTabProps> = ({ 
  students,
  workouts = [],
  selectedStudentId: propStudentId,
  onSelectStudentId,
  onExportPdf
}) => {
  // Safe fallback to mock workouts if prop is empty
  const allWorkouts = useMemo(() => {
    return (workouts && workouts.length > 0) ? workouts : INITIAL_WORKOUTS;
  }, [workouts]);

  const [localStudentId, setLocalStudentId] = useState(students[0]?.id || 'std-1');
  const selectedStudentId = propStudentId || localStudentId;
  const [internalPdfModalOpen, setInternalPdfModalOpen] = useState(false);

  const handleStudentChange = (id: string) => {
    setLocalStudentId(id);
    if (onSelectStudentId) onSelectStudentId(id);
  };
  const [logsState, setLogsState] = useState<{ [studentId: string]: any[] }>(INITIAL_LOAD_LOGS);

  // WhatsApp Reminder State
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppConfigs, setWhatsAppConfigs] = useState<{ [studentId: string]: WhatsAppReminderConfig }>({
    'std-1': {
      studentId: 'std-1',
      enabled: true,
      phone: '(11) 98765-4321',
      triggerType: 'on_new_load',
      weeklyDay: 'Segunda-feira',
      weeklyTime: '08:00',
      includePrMetrics: true,
      includeAppLink: true,
      customGreeting: 'Fala'
    }
  });
  const [notifyViaWhatsAppOnSubmit, setNotifyViaWhatsAppOnSubmit] = useState(true);
  const [whatsAppToast, setWhatsAppToast] = useState<{ show: boolean; message: string; phone?: string; text?: string } | null>(null);

  const currentWhatsAppConfig = whatsAppConfigs[selectedStudentId] || {
    studentId: selectedStudentId,
    enabled: true,
    phone: students.find(s => s.id === selectedStudentId)?.phone || '(11) 98765-4321',
    triggerType: 'on_new_load',
    weeklyDay: 'Segunda-feira',
    weeklyTime: '08:00',
    includePrMetrics: true,
    includeAppLink: true,
    customGreeting: 'Fala'
  };

  // Filter Dropdown state
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState('Todos');
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Workouts belonging to selected student
  const studentWorkouts = useMemo(() => {
    return allWorkouts.filter(w => w.studentId === selectedStudentId);
  }, [allWorkouts, selectedStudentId]);

  // Extract all UNIQUE prescribed exercises for this student
  const prescribedExercises = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      muscleGroup: string;
      prescribedWeightKg: number;
      prescribedReps: string;
      prescribedSets: number;
      splitName: string;
      workoutTitle: string;
      notes?: string;
      equipment?: string;
      method?: string;
    }>();

    studentWorkouts.forEach(wkt => {
      wkt.splits.forEach(split => {
        split.exercises.forEach(ex => {
          const key = ex.name.trim();
          if (!map.has(key)) {
            map.set(key, {
              id: ex.id,
              name: ex.name,
              muscleGroup: ex.muscleGroup,
              prescribedWeightKg: ex.weightKg || 0,
              prescribedReps: String(ex.reps || '10'),
              prescribedSets: ex.sets || 3,
              splitName: split.name,
              workoutTitle: wkt.title,
              notes: ex.notes,
              equipment: ex.equipment,
              method: ex.method
            });
          }
        });
      });
    });

    return Array.from(map.values());
  }, [studentWorkouts]);

  // Currently selected exercise state
  const [selectedExercise, setSelectedExercise] = useState<string>(() => {
    return prescribedExercises[0]?.name || 'Supino Reto com Barra Olímpica';
  });

  // Automatically update selectedExercise when student changes or prescribed list changes
  useEffect(() => {
    if (prescribedExercises.length > 0) {
      const exists = prescribedExercises.some(
        e => e.name.toLowerCase() === selectedExercise.toLowerCase()
      );
      if (!exists) {
        setSelectedExercise(prescribedExercises[0].name);
      }
    }
  }, [selectedStudentId, prescribedExercises]);

  const currentPrescribed = useMemo(() => {
    return prescribedExercises.find(
      e => e.name.toLowerCase() === selectedExercise.toLowerCase()
    );
  }, [prescribedExercises, selectedExercise]);

  // 1RM calculation: Epley formula
  const calculate1RM = (weight: number, reps: number) => {
    if (reps <= 1) return weight;
    return Math.round(weight * (1 + 0.0333 * reps) * 10) / 10;
  };

  // Student historical logs for the selected student
  const studentLogs = logsState[selectedStudentId] || [];

  // Logs specifically for the currently selected exercise
  const exerciseLogs = useMemo(() => {
    const existing = studentLogs.filter(
      l => l.exerciseName.toLowerCase() === selectedExercise.toLowerCase()
    );

    if (existing.length > 0) return existing;

    // If no manual load logs exist yet, build initial baseline from prescription
    if (currentPrescribed && currentPrescribed.prescribedWeightKg > 0) {
      const numReps = parseInt(currentPrescribed.prescribedReps) || 10;
      return [{
        id: `prescribed-base-${currentPrescribed.id}`,
        studentId: selectedStudentId,
        exerciseName: currentPrescribed.name,
        date: studentWorkouts[0]?.startDate || new Date().toISOString().slice(0, 10),
        weightKg: currentPrescribed.prescribedWeightKg,
        reps: numReps,
        estimated1RM: calculate1RM(currentPrescribed.prescribedWeightKg, numReps),
        rpe: 8,
        isBaseline: true
      }];
    }

    return [];
  }, [studentLogs, selectedExercise, currentPrescribed, selectedStudentId, studentWorkouts]);

  // Determine latest registered load and reps
  const latestRecordedLoad = useMemo(() => {
    if (exerciseLogs.length > 0) {
      const last = exerciseLogs[exerciseLogs.length - 1];
      const parsedReps = typeof last.reps === 'number' ? last.reps : parseInt(String(last.reps)) || 8;
      return {
        weight: last.weightKg,
        reps: parsedReps,
        date: last.date
      };
    }
    if (currentPrescribed && currentPrescribed.prescribedWeightKg > 0) {
      return {
        weight: currentPrescribed.prescribedWeightKg,
        reps: parseInt(currentPrescribed.prescribedReps) || 10,
        date: studentWorkouts[0]?.startDate || new Date().toISOString().slice(0, 10)
      };
    }
    return {
      weight: 60,
      reps: 8,
      date: new Date().toISOString().slice(0, 10)
    };
  }, [exerciseLogs, currentPrescribed, studentWorkouts]);

  // 1RM Calculator State: responds dynamically to selected exercise!
  const [calcWeight, setCalcWeight] = useState<number>(latestRecordedLoad.weight);
  const [calcReps, setCalcReps] = useState<number>(latestRecordedLoad.reps);

  // Synchronize 1RM Calculator whenever selectedExercise or latestRecordedLoad changes
  useEffect(() => {
    setCalcWeight(latestRecordedLoad.weight);
    setCalcReps(latestRecordedLoad.reps);
  }, [selectedExercise, selectedStudentId, latestRecordedLoad]);

  const calculated1RM = calculate1RM(calcWeight, calcReps);

  // New Log Modal State
  const [showAddLog, setShowAddLog] = useState(false);
  const [newLogExercise, setNewLogExercise] = useState(selectedExercise);
  const [newLogDate, setNewLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [newLogWeight, setNewLogWeight] = useState<number>(latestRecordedLoad.weight);
  const [newLogReps, setNewLogReps] = useState<number>(latestRecordedLoad.reps);
  const [newLogRpe, setNewLogRpe] = useState<number>(8.5);

  // Keep modal in sync with selected exercise when opening
  useEffect(() => {
    if (showAddLog) {
      setNewLogExercise(selectedExercise);
      setNewLogWeight(latestRecordedLoad.weight);
      setNewLogReps(latestRecordedLoad.reps);
    }
  }, [showAddLog, selectedExercise, latestRecordedLoad]);

  const handleAddLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const est1RM = calculate1RM(newLogWeight, newLogReps);
    const newEntry = {
      id: `log-${Date.now()}`,
      studentId: selectedStudentId,
      exerciseName: newLogExercise,
      date: newLogDate,
      weightKg: newLogWeight,
      reps: newLogReps,
      estimated1RM: est1RM,
      rpe: newLogRpe
    };

    setLogsState(prev => ({
      ...prev,
      [selectedStudentId]: [...(prev[selectedStudentId] || []), newEntry]
    }));

    if (newLogExercise !== selectedExercise) {
      setSelectedExercise(newLogExercise);
    }

    // Trigger WhatsApp notification if active
    if (notifyViaWhatsAppOnSubmit && currentWhatsAppConfig?.enabled) {
      const studentFirstName = currentStudent?.name.split(' ')[0] || 'Aluno';
      const cleanPhone = (currentWhatsAppConfig.phone || currentStudent?.phone || '').replace(/\D/g, '');
      const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
      const msg = `Fala, ${studentFirstName}! 🏋️‍♂️ O Prof. Gianluca Marinho acabou de registrar sua nova carga no *${newLogExercise}*: *${newLogWeight} kg* (${newLogReps} reps) com 1RM estimado em *${est1RM} kg*! 💪 Acesse sua ficha completa: https://app.glprofit.com.br/cargas`;

      setWhatsAppToast({
        show: true,
        message: `Lembrete via WhatsApp gerado para ${studentFirstName}!`,
        phone: formattedPhone,
        text: msg
      });
      setTimeout(() => {
        setWhatsAppToast(null);
      }, 8000);
    }

    setShowAddLog(false);
  };

  const currentStudent = students.find(s => s.id === selectedStudentId);

  // KPIs
  const max1RM = exerciseLogs.reduce((max, cur) => Math.max(max, cur.estimated1RM || 0), 0);
  const latestWeight = exerciseLogs.length > 0 ? exerciseLogs[exerciseLogs.length - 1].weightKg : (currentPrescribed?.prescribedWeightKg || 0);
  const initialWeight = exerciseLogs.length > 0 ? exerciseLogs[0].weightKg : (currentPrescribed?.prescribedWeightKg || 0);
  const progressionKg = latestWeight - initialWeight;

  // Filter dropdown items
  const muscleGroups = useMemo(() => {
    const set = new Set<string>();
    prescribedExercises.forEach(e => {
      if (e.muscleGroup) set.add(e.muscleGroup);
    });
    return ['Todos', ...Array.from(set)];
  }, [prescribedExercises]);

  const filteredDropdownExercises = useMemo(() => {
    let list = prescribedExercises;
    if (selectedMuscleFilter !== 'Todos') {
      list = list.filter(e => e.muscleGroup.toLowerCase() === selectedMuscleFilter.toLowerCase());
    }
    if (exerciseSearchQuery.trim()) {
      const q = exerciseSearchQuery.toLowerCase();
      list = list.filter(e => 
        e.name.toLowerCase().includes(q) ||
        e.muscleGroup.toLowerCase().includes(q) ||
        e.splitName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [prescribedExercises, selectedMuscleFilter, exerciseSearchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Top Bar: Title & Student Selector */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Controle de Carga & Sobrecarga Progressiva
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {prescribedExercises.length} exercícios prescritos
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Dados baseados exclusivamente nos exercícios prescritos na ficha de treino do aluno
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
              Aluno Selecionado
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:border-blue-600 focus:outline-hidden"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code || 'GL'})</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowWhatsAppModal(true)}
            className="self-end px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all shrink-0 active:scale-98 cursor-pointer relative"
            title="Configurar Lembrete Automático via WhatsApp para o Aluno"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>Lembrete WhatsApp</span>
            {currentWhatsAppConfig.enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse absolute -top-0.5 -right-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              if (onExportPdf) onExportPdf();
              else setInternalPdfModalOpen(true);
            }}
            className="self-end px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all shrink-0 active:scale-98 cursor-pointer"
            title="Exportar Relatório PDF das Cargas e 1RM do Aluno"
          >
            <FileText className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddLog(true)}
            className="self-end px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all shrink-0 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Carga</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Automation Status Banner */}
      {currentStudent && (
        <div className="p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-emerald-950 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <strong className="font-bold text-emerald-900">Notificação Automática via WhatsApp:</strong>
              <span className="text-emerald-800">
                {currentWhatsAppConfig.enabled 
                  ? `Ativo para ${currentStudent.name.split(' ')[0]} • ${currentWhatsAppConfig.triggerType === 'on_new_load' ? 'Disparo automático ao salvar nova carga' : currentWhatsAppConfig.triggerType === 'pr_only' ? 'Disparo em novos recordes (PR)' : `Lembrete semanal (${currentWhatsAppConfig.weeklyDay} às ${currentWhatsAppConfig.weeklyTime})`}`
                  : `Pausado para ${currentStudent.name.split(' ')[0]}`
                }
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowWhatsAppModal(true)}
            className="self-start sm:self-auto px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-98"
          >
            <span>Configurar Automação</span>
          </button>
        </div>
      )}

      {/* FILTER BUTTON (Requested: replaces top horizontal chips) */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Main Filter Dropdown Button */}
        <div className="relative inline-block" ref={filterDropdownRef}>
          <button
            type="button"
            onClick={() => setIsFilterDropdownOpen(prev => !prev)}
            className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs shadow-xs hover:border-blue-500 transition-all"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filtrar Exercício Prescrito:</span>
              <span className="text-blue-700 font-extrabold max-w-[220px] truncate">
                {selectedExercise || 'Selecione um Exercício'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800">
                {prescribedExercises.length}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
            </div>
          </button>

          {/* Dropdown Popover */}
          {isFilterDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-40 p-3 space-y-3 animate-in fade-in zoom-in-95 duration-150">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xs text-slate-900">
                    Exercícios Prescritos para {currentStudent?.name.split(' ')[0]}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {prescribedExercises.length} exercícios
                </span>
              </div>

              {/* Quick Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={exerciseSearchQuery}
                  onChange={(e) => setExerciseSearchQuery(e.target.value)}
                  placeholder="Buscar exercício por nome ou divisão..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                />
                {exerciseSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setExerciseSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Muscle Group Filter Pills */}
              {muscleGroups.length > 2 && (
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                  {muscleGroups.map(mg => (
                    <button
                      key={mg}
                      type="button"
                      onClick={() => setSelectedMuscleFilter(mg)}
                      className={`px-2 py-0.5 rounded-md font-semibold whitespace-nowrap transition-colors ${
                        selectedMuscleFilter === mg 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {mg}
                    </button>
                  ))}
                </div>
              )}

              {/* Prescribed Exercises List */}
              <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                {filteredDropdownExercises.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Nenhum exercício prescrito encontrado.
                  </div>
                ) : (
                  filteredDropdownExercises.map((ex) => {
                    const isSelected = selectedExercise.toLowerCase() === ex.name.toLowerCase();
                    const logsForEx = studentLogs.filter(
                      l => l.exerciseName.toLowerCase() === ex.name.toLowerCase()
                    );
                    const latestWeightForEx = logsForEx.length > 0 
                      ? logsForEx[logsForEx.length - 1].weightKg 
                      : ex.prescribedWeightKg;

                    return (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => {
                          setSelectedExercise(ex.name);
                          setIsFilterDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                          isSelected 
                            ? 'bg-blue-50 border border-blue-200 text-blue-900' 
                            : 'hover:bg-slate-50 border border-transparent text-slate-700'
                        }`}
                      >
                        <div className="min-w-0 pr-2 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                            <span className="font-bold text-xs truncate">{ex.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="font-semibold text-blue-700">{ex.muscleGroup}</span>
                            <span>•</span>
                            <span className="truncate">{ex.splitName}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-black text-slate-900 block">
                            {latestWeightForEx} kg
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {ex.prescribedSets}x {ex.prescribedReps}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Aluno: <strong>{currentStudent?.name}</strong></span>
                <button
                  type="button"
                  onClick={() => setIsFilterDropdownOpen(false)}
                  className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold"
                >
                  Fechar
                </button>
              </div>

            </div>
          )}
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Escolha um exercício prescrito para visualizar o histórico de carga e 1RM
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Última Carga Registrada</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 flex items-baseline gap-1">
            <span>{latestWeight || currentPrescribed?.prescribedWeightKg || '--'}</span>
            <span className="text-xs text-slate-400 font-bold">kg</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{progressionKg >= 0 ? progressionKg : 0} kg de evolução</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">1RM Estimado Máximo (PR)</div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1 flex items-baseline gap-1">
            <span>{max1RM || calculated1RM || '--'}</span>
            <span className="text-xs text-blue-400 font-bold">kg</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Recorde Pessoal para este exercício</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">Sessões Registradas</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {exerciseLogs.length}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Para {selectedExercise}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-2xs">
          <div className="text-xs font-semibold text-blue-200">Prescrição do Treinador</div>
          <div className="text-lg font-bold mt-1 text-white">
            {currentPrescribed ? `${currentPrescribed.prescribedWeightKg} kg • ${currentPrescribed.prescribedSets}x ${currentPrescribed.prescribedReps}` : 'Em Consolidação'}
          </div>
          <div className="text-[11px] text-blue-300 mt-1 truncate">
            {currentPrescribed?.splitName || 'Divisão Ativa'}
          </div>
        </div>

      </div>

      {/* Main Grid: Progression Chart (Left) + 1RM Calculator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Progression Visualizer (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Curva de Evolução de Carga (kg)
              </h4>
              <p className="text-xs text-slate-500">
                Histórico temporal de progressão para <strong className="text-blue-700">{selectedExercise}</strong>
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              {currentStudent?.name}
            </span>
          </div>

          {exerciseLogs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs space-y-2">
              <Dumbbell className="w-8 h-8 mx-auto text-slate-300" />
              <p>Nenhum registro de carga cadastrado para este exercício ainda.</p>
              <button
                type="button"
                onClick={() => setShowAddLog(true)}
                className="text-blue-600 font-bold hover:underline"
              >
                + Adicionar Primeiro Registro
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Visual Bar Graph */}
              <div className="h-48 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
                {exerciseLogs.map((log, idx) => {
                  const maxChartWeight = 160;
                  const barHeight = Math.min(100, Math.max(18, (log.weightKg / maxChartWeight) * 100));

                  return (
                    <div key={log.id || idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap">
                        {log.weightKg}kg ({log.reps}x)
                      </div>
                      <div 
                        className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-blue-700 to-blue-500 group-hover:from-blue-600 group-hover:to-blue-400 transition-all shadow-xs"
                        style={{ height: `${barHeight}%` }}
                      />
                      <span className="text-[10px] text-slate-500 font-medium truncate w-full text-center">
                        {log.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Table of logs */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Data</th>
                      <th className="p-2.5 text-center">Carga (kg)</th>
                      <th className="p-2.5 text-center">Reps Realizadas</th>
                      <th className="p-2.5 text-center">1RM Estimado</th>
                      <th className="p-2.5 text-center">RPE (Esforço 1-10)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {exerciseLogs.map((log, idx) => (
                      <tr key={log.id || idx} className="hover:bg-slate-50/70">
                        <td className="p-2.5 font-medium text-slate-700 flex items-center gap-1.5">
                          <span>{log.date}</span>
                          {log.isBaseline && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              Prescrição
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-center font-bold text-slate-900">{log.weightKg} kg</td>
                        <td className="p-2.5 text-center text-slate-600">{log.reps} reps</td>
                        <td className="p-2.5 text-center font-bold text-blue-600">{log.estimated1RM} kg</td>
                        <td className="p-2.5 text-center text-slate-500">{log.rpe || '--'} / 10</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 1RM Calculator (4 cols) - (Requested: responds dynamically to selected exercise) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Calculadora de 1RM
              </h4>
            </div>

            <button
              type="button"
              onClick={() => {
                setCalcWeight(latestRecordedLoad.weight);
                setCalcReps(latestRecordedLoad.reps);
              }}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
              title="Restaurar última carga registrada"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar Última</span>
            </button>
          </div>

          {/* Dynamic Sync Banner */}
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] space-y-1">
            <div className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Sincronizado com {selectedExercise}</span>
            </div>
            <p className="text-blue-700 text-[10px]">
              Carregando a última carga registrada: <strong>{latestRecordedLoad.weight} kg</strong> x <strong>{latestRecordedLoad.reps} reps</strong>
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Carga Registrada / Utilizada (kg)
              </label>
              <input
                type="number"
                value={calcWeight}
                onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-800 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Repetições Realizadas (1 a 12)
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={calcReps}
                onChange={(e) => setCalcReps(parseInt(e.target.value) || 1)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-800 focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            {/* Calculated Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-900 text-white text-center space-y-1 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-blue-200">
                1RM Teórico Estimado
              </span>
              <div className="text-3xl font-extrabold text-white font-mono">
                {calculated1RM} <span className="text-sm font-normal text-blue-200">kg</span>
              </div>
              <p className="text-[10px] text-blue-300">
                Carga máxima para 1 repetição com técnica perfeita.
              </p>
            </div>

            {/* Percentiles Table */}
            <div className="pt-2 text-xs space-y-1 border-t border-slate-100">
              <div className="font-semibold text-slate-700 text-[11px] mb-1">Zonas de Treino por % de 1RM:</div>
              <div className="flex justify-between text-slate-600 py-0.5">
                <span>90% (Força Pura 3-5 reps):</span>
                <strong className="text-slate-900">{Math.round(calculated1RM * 0.9)} kg</strong>
              </div>
              <div className="flex justify-between text-slate-600 py-0.5">
                <span>80% (Hipertrofia 8-10 reps):</span>
                <strong className="text-slate-900">{Math.round(calculated1RM * 0.8)} kg</strong>
              </div>
              <div className="flex justify-between text-slate-600 py-0.5">
                <span>70% (Resistência 12-15 reps):</span>
                <strong className="text-slate-900">{Math.round(calculated1RM * 0.7)} kg</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Add Log Modal */}
      {showAddLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Registrar Nova Carga Realizada
              </h4>
              <button
                type="button"
                onClick={() => setShowAddLog(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLogSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Exercício Prescrito
                </label>
                <select
                  value={newLogExercise}
                  onChange={(e) => {
                    const exName = e.target.value;
                    setNewLogExercise(exName);
                    const matchingPrescribed = prescribedExercises.find(ex => ex.name === exName);
                    if (matchingPrescribed) {
                      setNewLogWeight(matchingPrescribed.prescribedWeightKg);
                      setNewLogReps(parseInt(matchingPrescribed.prescribedReps) || 8);
                    }
                  }}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-800 focus:border-blue-600 focus:outline-hidden"
                >
                  {prescribedExercises.map(ex => (
                    <option key={ex.id} value={ex.name}>
                      {ex.name} ({ex.muscleGroup} • {ex.splitName})
                    </option>
                  ))}
                  {!prescribedExercises.some(ex => ex.name === newLogExercise) && (
                    <option value={newLogExercise}>{newLogExercise}</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Carga (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newLogWeight}
                    onChange={(e) => setNewLogWeight(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Repetições</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={newLogReps}
                    onChange={(e) => setNewLogReps(parseInt(e.target.value) || 1)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={newLogDate}
                    onChange={(e) => setNewLogDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">RPE (Esforço 1-10)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="10"
                    value={newLogRpe}
                    onChange={(e) => setNewLogRpe(parseFloat(e.target.value) || 8)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* WhatsApp Notification Checkbox */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-emerald-950">
                      Notificar {currentStudent?.name.split(' ')[0]} no WhatsApp
                    </span>
                    <span className="block text-[10px] text-emerald-700">
                      Prepara mensagem com a nova carga e 1RM estimado
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyViaWhatsAppOnSubmit}
                  onChange={(e) => setNotifyViaWhatsAppOnSubmit(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddLog(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs active:scale-98"
                >
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Reminder Config Modal */}
      {showWhatsAppModal && currentStudent && (
        <WhatsAppReminderModal
          isOpen={showWhatsAppModal}
          onClose={() => setShowWhatsAppModal(false)}
          student={currentStudent}
          selectedExerciseName={selectedExercise}
          latestWeightKg={latestWeight}
          latestReps={typeof exerciseLogs[exerciseLogs.length - 1]?.reps === 'number' ? exerciseLogs[exerciseLogs.length - 1].reps : 8}
          estimated1RM={max1RM || calculated1RM}
          progressionKg={progressionKg}
          currentConfig={currentWhatsAppConfig}
          onSaveConfig={(newConfig) => {
            setWhatsAppConfigs(prev => ({
              ...prev,
              [selectedStudentId]: newConfig
            }));
          }}
        />
      )}

      {/* Floating WhatsApp Toast Notification */}
      {whatsAppToast && whatsAppToast.show && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-emerald-500 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
          </div>
          <div>
            <div className="font-bold text-xs text-white">
              {whatsAppToast.message}
            </div>
            <p className="text-[11px] text-slate-300">
              Clique no botão ao lado para enviar a mensagem formatada agora
            </p>
          </div>
          {whatsAppToast.phone && whatsAppToast.text && (
            <a
              href={`https://api.whatsapp.com/send?phone=${whatsAppToast.phone}&text=${encodeURIComponent(whatsAppToast.text)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Abrir WhatsApp</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => setWhatsAppToast(null)}
            className="text-slate-400 hover:text-white p-1 ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PDF Export Modal */}
      {internalPdfModalOpen && currentStudent && (
        <TreinoPdfReportModal
          isOpen={internalPdfModalOpen}
          onClose={() => setInternalPdfModalOpen(false)}
          subTab="controle_carga"
          student={currentStudent}
          workout={studentWorkouts[0] || null}
          workouts={allWorkouts}
          selectedExerciseName={selectedExercise}
          exerciseLogs={exerciseLogs}
        />
      )}

    </div>
  );
};

export default ControleCargaTab;
