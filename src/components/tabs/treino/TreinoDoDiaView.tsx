import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  Dumbbell, 
  Flame, 
  Info, 
  Trophy, 
  ChevronRight,
  Sparkles,
  Volume2,
  User,
  Users,
  UserCheck,
  Search,
  X,
  ChevronDown,
  Check,
  Plus,
  Calendar,
  Layers,
  Activity,
  AlertCircle
} from 'lucide-react';
import { WorkoutPlan, ExerciseItem, Student } from '../../../types';
import { INITIAL_STUDENTS, INITIAL_WORKOUTS } from '../../../mockData';

interface TreinoDoDiaViewProps {
  workout?: WorkoutPlan | null;
  students?: Student[];
  workouts?: WorkoutPlan[];
  onSelectWorkout?: (workout: WorkoutPlan) => void;
  onOpenPrescriptionModal?: (student?: Student) => void;
}

export const TreinoDoDiaView: React.FC<TreinoDoDiaViewProps> = ({ 
  workout: propWorkout,
  students: propStudents = [],
  workouts: propWorkouts = [],
  onSelectWorkout,
  onOpenPrescriptionModal
}) => {
  // Safe fallbacks to sample data if empty
  const allStudents = useMemo(() => {
    return (propStudents && propStudents.length > 0) ? propStudents : INITIAL_STUDENTS;
  }, [propStudents]);

  const allWorkouts = useMemo(() => {
    return (propWorkouts && propWorkouts.length > 0) ? propWorkouts : INITIAL_WORKOUTS;
  }, [propWorkouts]);

  // Active workout state
  const [activeWorkout, setActiveWorkout] = useState<WorkoutPlan | null>(() => {
    if (propWorkout) return propWorkout;
    return allWorkouts[0] || null;
  });

  // Keep in sync with incoming prop
  useEffect(() => {
    if (propWorkout) {
      setActiveWorkout(propWorkout);
    }
  }, [propWorkout]);

  // Student selection modal & filters
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [filterWithWorkoutOnly, setFilterWithWorkoutOnly] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Active split and tracking state
  const [selectedSplitIdx, setSelectedSplitIdx] = useState(0);
  const [completedSets, setCompletedSets] = useState<{ [exId: string]: number }>({});
  const [exerciseLoads, setExerciseLoads] = useState<{ [exId: string]: number }>({});
  const [activeExerciseInfo, setActiveExerciseInfo] = useState<ExerciseItem | null>(null);

  // Timer State
  const [timerDuration, setTimerDuration] = useState(60); // seconds
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<any>(null);

  // Workout Completion State
  const [isWorkoutCompleted, setIsWorkoutCompleted] = useState(false);

  const activeSplit = activeWorkout?.splits[selectedSplitIdx] || activeWorkout?.splits[0];

  // Sound beep using Web Audio API
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      // Audio might be blocked if no user gesture yet
    }
  };

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const handleStartTimer = (seconds: number) => {
    setTimerDuration(seconds);
    setTimeLeft(seconds);
    setIsTimerRunning(true);
  };

  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(timerDuration);
  };

  const handleIncrementSet = (ex: ExerciseItem) => {
    const current = completedSets[ex.id] || 0;
    const nextVal = current >= ex.sets ? 0 : current + 1;
    setCompletedSets(prev => ({ ...prev, [ex.id]: nextVal }));

    // If a set was just completed, trigger rest timer
    if (nextVal > 0 && nextVal <= ex.sets) {
      handleStartTimer(ex.restSec || 60);
    }
  };

  const handleFinishWorkout = () => {
    setIsWorkoutCompleted(true);
    playBeep();
  };

  // Handle selecting a student's workout from modal
  const handleSelectStudentWorkout = (student: Student, chosenWorkout: WorkoutPlan) => {
    setActiveWorkout(chosenWorkout);
    if (onSelectWorkout) {
      onSelectWorkout(chosenWorkout);
    }
    setSelectedSplitIdx(0);
    setCompletedSets({});
    setExerciseLoads({});
    setIsWorkoutCompleted(false);
    setIsTimerRunning(false);
    setTimeLeft(chosenWorkout.splits[0]?.exercises[0]?.restSec || 60);
    setIsStudentModalOpen(false);
    
    setFeedbackToast(`Aluno "${student.name}" selecionado! Ficha "${chosenWorkout.title}" carregada para hoje.`);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4500);
  };

  // Filtered students in selector modal
  const filteredStudents = useMemo(() => {
    let list = allStudents;

    if (filterWithWorkoutOnly) {
      list = list.filter(s => allWorkouts.some(w => w.studentId === s.id));
    }

    if (studentSearchQuery.trim()) {
      const q = studentSearchQuery.toLowerCase();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) ||
        (s.code && s.code.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.planName && s.planName.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allStudents, allWorkouts, studentSearchQuery, filterWithWorkoutOnly]);

  const timerProgressPercent = Math.max(0, Math.min(100, (timeLeft / (timerDuration || 1)) * 100));

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback Notification */}
      {feedbackToast && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{feedbackToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackToast(null)}
            className="text-blue-500 hover:text-blue-800 p-0.5 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner / Student Context & Action Button */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-lg space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Current Student & Workout Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500 text-white uppercase tracking-wider">
                Treino do Dia
              </span>
              
              {activeWorkout ? (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-blue-100 text-xs font-bold border border-white/15">
                  <User className="w-3.5 h-3.5 text-blue-300" />
                  <span>Aluno: {activeWorkout.studentName}</span>
                </div>
              ) : (
                <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Nenhum aluno ativo selecionado
                </span>
              )}
            </div>

            {activeWorkout ? (
              <>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {activeWorkout.title}
                </h2>
                <p className="text-xs text-slate-300">
                  Objetivo: <strong className="text-white">{activeWorkout.objective}</strong> • Nível: {activeWorkout.level}
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-300">
                Selecione um aluno cadastrado para carregar a rotina de hoje e executar o treino com cronômetro.
              </p>
            )}
          </div>

          {/* Action Button: SELECIONAR ALUNO (Requested feature) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setStudentSearchQuery('');
                setIsStudentModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs shadow-md hover:shadow-lg transition-all active:scale-98"
            >
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>{activeWorkout ? 'Trocar / Selecionar Aluno' : 'Selecionar Aluno'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

        </div>

        {/* Splits Selector Buttons (if workout loaded) */}
        {activeWorkout && activeWorkout.splits?.length > 0 && (
          <div className="pt-3 border-t border-white/10 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-blue-200 mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-400" /> Divisão:
            </span>
            {activeWorkout.splits.map((split, sIdx) => {
              const active = selectedSplitIdx === sIdx;
              return (
                <button
                  key={sIdx}
                  onClick={() => {
                    setSelectedSplitIdx(sIdx);
                    setIsWorkoutCompleted(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    active 
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/50' 
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  <span>{split.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-blue-700 text-white' : 'bg-black/20 text-slate-300'}`}>
                    {split.exercises?.length || 0} ex
                  </span>
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* Main Content Area */}
      {!activeWorkout ? (
        /* Empty State when no workout is selected */
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Nenhum Aluno Selecionado para o Treino do Dia
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Clique no botão abaixo para selecionar qual aluno irá treinar agora. O sistema carregará a ficha ativa, divisões de séries, descanso sonoro e acompanhamento de cargas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStudentSearchQuery('');
              setIsStudentModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-500 transition-all active:scale-98"
          >
            <UserCheck className="w-4 h-4" />
            <span>Selecionar Aluno Agora</span>
          </button>
        </div>
      ) : (
        /* Active Workout Tracker & Timer Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Exercises & Sets Tracker (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-blue-600" />
                Exercícios do {activeSplit?.name}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {activeSplit?.exercises?.length || 0} exercícios prescritos
              </span>
            </div>

            {/* Exercise Cards */}
            <div className="space-y-3">
              {activeSplit?.exercises?.map((ex, exIdx) => {
                const setsDone = completedSets[ex.id] || 0;
                const isAllDone = setsDone >= ex.sets;

                return (
                  <div
                    key={ex.id || exIdx}
                    className={`p-4 rounded-xl border transition-all ${
                      isAllDone
                        ? 'border-emerald-300 bg-emerald-50/40'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {exIdx + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900">
                              {ex.name}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-50 text-blue-700">
                              {ex.muscleGroup}
                            </span>
                            {ex.method && ex.method !== 'Tradicional' && (
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800">
                                {ex.method}
                              </span>
                            )}
                          </div>

                          {/* Prescribed details */}
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                            <span><strong>{ex.sets}</strong> séries</span>
                            <span>•</span>
                            <span><strong>{ex.reps}</strong> reps</span>
                            <span>•</span>
                            <span>Carga: <strong>{exerciseLoads[ex.id] || ex.weightKg || '--'} kg</strong></span>
                            <span>•</span>
                            <span>Descanso: <strong>{ex.restSec}s</strong></span>
                          </div>

                          {ex.notes && (
                            <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                              <strong>Dica do Treinador:</strong> {ex.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveExerciseInfo(ex)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shrink-0"
                        title="Ver detalhes de biomecânica"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Interactive Sets Checklist */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: ex.sets }).map((_, sIdx) => {
                          const isSetDone = sIdx < setsDone;
                          return (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => {
                                setCompletedSets(prev => ({ ...prev, [ex.id]: sIdx + 1 }));
                                handleStartTimer(ex.restSec || 60);
                              }}
                              className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                                isSetDone
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {isSetDone ? <CheckCircle className="w-4 h-4" /> : `${sIdx + 1}`}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder={`${ex.weightKg || 'Carga'} kg`}
                          value={exerciseLoads[ex.id] || ''}
                          onChange={(e) => setExerciseLoads({ ...exerciseLoads, [ex.id]: parseFloat(e.target.value) || 0 })}
                          className="w-20 rounded-lg border border-slate-300 p-1.5 text-xs text-center font-bold text-blue-700 focus:border-blue-600 focus:outline-hidden"
                        />

                        <button
                          type="button"
                          onClick={() => handleIncrementSet(ex)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                            isAllDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-600 hover:bg-blue-500 text-white'
                          }`}
                        >
                          {isAllDone ? 'Concluído' : '+ Feita'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Finish workout button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleFinishWorkout}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Trophy className="w-5 h-5" />
                <span>Concluir Treino de Hoje</span>
              </button>
            </div>

            {isWorkoutCompleted && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-1 animate-in fade-in slide-in-from-top-2">
                <div className="font-bold flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Parabéns! Treino Finalizado com Sucesso!
                </div>
                <p className="text-xs text-emerald-700">
                  Os registros de carga e as repetições realizadas foram registradas para a ficha de {activeWorkout.studentName}.
                </p>
              </div>
            )}

          </div>

          {/* Right Column: Rest Timer & Biomechanics Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Rest Timer Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-md text-center space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Cronômetro de Descanso
                </span>
                <Volume2 className="w-4 h-4 text-slate-400" title="Alerta sonoro habilitado" />
              </div>

              {/* Circular / Progress visualizer */}
              <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="stroke-slate-100"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="stroke-blue-600 transition-all duration-300"
                    strokeWidth="8"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * timerProgressPercent) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                    {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                    {isTimerRunning ? 'Descansando...' : 'Pausado'}
                  </span>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleTimer}
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-all ${
                    isTimerRunning ? 'bg-amber-500 hover:bg-amber-400' : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTimerRunning ? 'Pausar' : 'Iniciar'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetTimer}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Preset Times */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {[30, 45, 60, 90, 120].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => handleStartTimer(sec)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      timerDuration === sec 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Biomechanical Guide Card */}
            {activeExerciseInfo ? (
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {activeExerciseInfo.muscleGroup}
                  </span>
                  <button 
                    onClick={() => setActiveExerciseInfo(null)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Fechar
                  </button>
                </div>

                <h4 className="text-sm font-bold text-slate-900">
                  {activeExerciseInfo.name}
                </h4>

                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Equipamento:</strong> {activeExerciseInfo.equipment || 'Livre'}</div>
                  <div><strong>Cadência recomendada:</strong> {activeExerciseInfo.cadence || '2-0-2-0'}</div>
                  {activeExerciseInfo.notes && (
                    <div className="p-2 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[11px] mt-2">
                      {activeExerciseInfo.notes}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-md space-y-3">
                <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-4 h-4" />
                  Dica de Performance
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A sobrecarga progressiva é o motor primordial da hipertrofia. Registre as cargas realizadas em cada série para acompanhar a evolução na aba "Controle de Carga".
                </p>
              </div>
            )}

          </div>

        </div>
      )}

      {/* STUDENT SELECTION MODAL (Requested) */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Selecionar Aluno para o Treino do Dia
                  </h3>
                  <p className="text-xs text-blue-200">
                    Selecione o aluno para carregar sua ficha de exercícios, acionar o cronômetro e registrar cargas
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Controls / Search & Filters */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  placeholder="Buscar aluno por nome, matrícula, plano ou e-mail..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:border-blue-600 focus:outline-hidden"
                  autoFocus
                />
                {studentSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setStudentSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter toggle: apenas com treinos */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterWithWorkoutOnly(!filterWithWorkoutOnly)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    filterWithWorkoutOnly
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {filterWithWorkoutOnly ? '✓ Com Treino Prescrito' : 'Apenas com Ficha'}
                </button>
              </div>
            </div>

            {/* Modal Students List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <User className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="font-semibold text-slate-600">Nenhum aluno encontrado com esses critérios.</p>
                  <p className="text-[11px] text-slate-400">Tente buscar por outro termo ou desmarque o filtro.</p>
                </div>
              ) : (
                filteredStudents.map((student) => {
                  const studentWorkouts = allWorkouts.filter(w => w.studentId === student.id);
                  const isCurrentActive = activeWorkout?.studentId === student.id;

                  return (
                    <div
                      key={student.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isCurrentActive
                          ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Student Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        {student.photo ? (
                          <img
                            src={student.photo}
                            alt={student.name}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center shrink-0 border border-blue-200">
                            {student.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-900 truncate">
                              {student.name}
                            </span>
                            {isCurrentActive && (
                              <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-blue-600 text-white flex items-center gap-1">
                                <Check className="w-3 h-3" /> Em Execução
                              </span>
                            )}
                            <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                              student.status === 'ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {student.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                            <span>Matrícula: <strong className="text-slate-700">{student.code || 'GL'}</strong></span>
                            {student.planName && (
                              <>
                                <span>•</span>
                                <span>Plano: {student.planName}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Workouts & Selection Actions */}
                      <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        {studentWorkouts.length === 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-semibold">
                              Sem treino cadastrado
                            </span>
                            {onOpenPrescriptionModal && (
                              <button
                                type="button"
                                onClick={() => {
                                  setIsStudentModalOpen(false);
                                  onOpenPrescriptionModal(student);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Prescrever</span>
                              </button>
                            )}
                          </div>
                        ) : studentWorkouts.length === 1 ? (
                          <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                              <div className="text-xs font-bold text-slate-800">
                                {studentWorkouts[0].title}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {studentWorkouts[0].splits.length} divisões • {studentWorkouts[0].level}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleSelectStudentWorkout(student, studentWorkouts[0])}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                                isCurrentActive
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                  : 'bg-blue-600 hover:bg-blue-500 text-white'
                              }`}
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>{isCurrentActive ? 'Recarregar Treino' : 'Selecionar Aluno'}</span>
                            </button>
                          </div>
                        ) : (
                          /* Student has multiple workouts */
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-slate-400 font-semibold block text-right">
                              {studentWorkouts.length} fichas disponíveis:
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {studentWorkouts.map((wkt) => (
                                <button
                                  key={wkt.id}
                                  type="button"
                                  onClick={() => handleSelectStudentWorkout(student, wkt)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                                    activeWorkout?.id === wkt.id
                                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                                  }`}
                                  title={`${wkt.title} (${wkt.splits.length} divisões)`}
                                >
                                  <span>{wkt.title}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Total de alunos disponíveis: <strong className="text-slate-800">{allStudents.length}</strong>
              </span>

              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100"
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

export default TreinoDoDiaView;
