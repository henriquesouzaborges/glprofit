import React, { useState } from 'react';
import { 
  Dumbbell, 
  Plus, 
  Search, 
  Printer, 
  ChevronRight, 
  Calendar, 
  CheckCircle2, 
  Flame, 
  Layers,
  User,
  Activity,
  ClipboardCheck,
  Clock,
  Share2,
  BookOpen,
  PlayCircle,
  Copy,
  Edit3,
  Sparkles,
  AlertCircle,
  Eye,
  Filter,
  Maximize2,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { WorkoutPlan, Student, ExerciseItem, WorkoutSplit, TreinoSubTab, SystemUser } from '../../types';
import { formatDate } from '../../utils';
import { WorkoutEditorModal } from './treino/WorkoutEditorModal';
import { ExerciseCatalogModal } from './treino/ExerciseCatalogModal';
import { WorkoutShareModal } from './treino/WorkoutShareModal';
import { WorkoutDetailsModal } from './treino/WorkoutDetailsModal';
import { ExerciseCatalogView } from './treino/ExerciseCatalogView';
import { TreinoDoDiaView } from './treino/TreinoDoDiaView';
import { ControleCargaTab } from './treino/ControleCargaTab';
import { AvaliacoesFisicasTab } from './treino/AvaliacoesFisicasTab';
import { WorkoutTemplatesView } from './treino/WorkoutTemplatesView';
import { PlanoTreinoView } from './treino/PlanoTreinoView';
import { WORKOUT_TEMPLATES, EXERCISE_CATALOG, INITIAL_LOAD_LOGS, INITIAL_PHYSICAL_TESTS } from './treino/exerciseDatabase';
import { TreinoPdfReportModal } from './treino/TreinoPdfReportModal';

interface TreinosTabProps {
  workouts?: WorkoutPlan[];
  students?: Student[];
  onAddWorkout: (workout: WorkoutPlan) => void;
  subTab?: TreinoSubTab;
  onSubTabChange?: (subTab: TreinoSubTab) => void;
  currentUser?: SystemUser | null;
}

export const TreinosTab: React.FC<TreinosTabProps> = ({
  workouts = [],
  students = [],
  onAddWorkout,
  subTab,
  onSubTabChange,
  currentUser
}) => {
  const [localSubTab, setLocalSubTab] = useState<TreinoSubTab>('prescricao');
  const currentSubTab = subTab || localSubTab;

  const handleSubTabChange = (tab: TreinoSubTab) => {
    if (onSubTabChange) {
      onSubTabChange(tab);
    } else {
      setLocalSubTab(tab);
    }
  };

  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(workouts?.[0] || null);
  const [activeSplitIndex, setActiveSplitIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Student & PDF Export State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    if (workouts?.[0]?.studentId) return workouts[0].studentId;
    return students?.[0]?.id || 'std-1';
  });
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Modals
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutPlan | null>(null);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0] || {
    id: 'std-1',
    name: selectedWorkout?.studentName || 'Gianluca Marinho',
    code: 'GL001',
    email: 'aluno@glprofit.com',
    phone: '(11) 98765-4321',
    planName: 'Anual Black VIP',
    status: 'ativo'
  } as Student;

  // Filtering workouts list
  const filteredWorkouts = workouts.filter(w => {
    const q = searchQuery.toLowerCase();
    return (
      w.studentName.toLowerCase().includes(q) ||
      w.title.toLowerCase().includes(q) ||
      w.objective.toLowerCase().includes(q)
    );
  });

  const handleSaveWorkout = (workout: WorkoutPlan) => {
    onAddWorkout(workout);
    setSelectedWorkout(workout);
    setShowEditorModal(false);
    setEditingWorkout(null);
  };

  const handleDuplicateWorkout = (sourceWorkout: WorkoutPlan) => {
    const cloned: WorkoutPlan = {
      ...JSON.parse(JSON.stringify(sourceWorkout)),
      id: `wkt-${Date.now()}`,
      title: `${sourceWorkout.title} (Cópia)`,
      startDate: new Date().toISOString().slice(0, 10),
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    };
    setEditingWorkout(cloned);
    setShowEditorModal(true);
  };

  const handleApplyTemplate = (tpl: any) => {
    const newWorkout: WorkoutPlan = {
      id: `wkt-${Date.now()}`,
      studentId: students[0]?.id || '',
      studentName: students[0]?.name || 'Aluno GL PRO FIT',
      title: tpl.title,
      objective: tpl.objective,
      level: tpl.level,
      instructor: 'Prof. Gianluca Marinho (CREF 112001-G/SP)',
      startDate: new Date().toISOString().slice(0, 10),
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      splits: JSON.parse(JSON.stringify(tpl.splits)),
      notes: tpl.description
    };
    setEditingWorkout(newWorkout);
    setShowEditorModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Views with Smooth Fade-in */}
      <div key={currentSubTab} className="animate-subtab-fade-in space-y-6">
        {/* SUBTAB: PLANO DE TREINO (Baseado na Planilha Oficial) */}
        {currentSubTab === 'plano_treino' && (
          <PlanoTreinoView
            students={students}
            currentUser={currentUser}
          />
        )}

        {/* TAB 1: PRESCRIÇÃO DE TREINOS */}
        {currentSubTab === 'prescricao' && (
        <div className="space-y-6">
          
          {/* Header & Quick Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                  <Dumbbell className="h-6 w-6 text-blue-600" />
                  Prescrição & Fichas de Treino
                </h1>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                  GL PRO FIT
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Periodização personalizada, controle de repetições, métodos avançados e envio instantâneo por WhatsApp
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Quick Student Selector */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
                <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-[11px] text-slate-500 hidden sm:inline">Aluno:</span>
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setSelectedStudentId(newId);
                    const matchingWorkout = workouts.find(w => w.studentId === newId);
                    if (matchingWorkout) {
                      setSelectedWorkout(matchingWorkout);
                    }
                  }}
                  className="bg-transparent font-bold text-slate-800 text-xs focus:outline-hidden cursor-pointer max-w-[140px] truncate"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exportar PDF Button */}
              <button
                type="button"
                onClick={() => setShowPdfModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer"
                title="Exportar documento PDF do treino"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Exportar PDF</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingWorkout(null);
                  setShowEditorModal(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Prescrever Novo Treino</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-semibold">Fichas Ativas</div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {workouts.length}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                100% dos alunos com ficha
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-semibold">Catálogo Biomecânico</div>
              <div className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-1">
                +1.400
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                Exercícios com instrução
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-semibold">Divisões Mais Usadas</div>
              <div className="text-xl sm:text-2xl font-extrabold text-indigo-600 mt-1">
                ABC / ABCD
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                Hipertrofia e Tonificação
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-semibold">Status de Renovação</div>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" />
                <span>Em Dia</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                Vigência média de 60 dias
              </div>
            </div>
          </div>

          {/* Main Grid: Workouts by Student (Left) & Active Sheet (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Workout list by Student (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Fichas dos Alunos ({filteredWorkouts.length})
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar aluno ou ficha..."
                  className="w-full rounded-xl pl-9 pr-3 py-2 bg-white border border-slate-200 text-xs focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              {/* Workouts Cards */}
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {filteredWorkouts.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
                    Nenhuma ficha encontrada.
                  </div>
                ) : (
                  filteredWorkouts.map((w) => {
                    const isSelected = selectedWorkout?.id === w.id;
                    return (
                      <div
                        key={w.id}
                        onClick={() => { setSelectedWorkout(w); setActiveSplitIndex(0); }}
                        className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/30 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {w.studentName}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 shrink-0">
                            {w.level}
                          </span>
                        </div>
                        <div className="mt-1 font-semibold text-xs text-blue-700">
                          {w.title}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500 truncate">
                          {w.objective}
                        </div>
                        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                          <span>Vencimento: {formatDate(w.validUntil)}</span>
                          <span className="font-bold text-slate-600">{w.splits.length} divisões</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Workout Sheet Full Details Preview (8 cols) */}
            <div className="lg:col-span-8">
              {selectedWorkout ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-6">
                  
                  {/* Sheet Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900">
                          {selectedWorkout.title}
                        </h2>
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                          {selectedWorkout.level}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        Aluno: <strong className="text-slate-900 font-bold">{selectedWorkout.studentName}</strong> • {selectedWorkout.objective}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Prescrito por {selectedWorkout.instructor} • Vigência: {formatDate(selectedWorkout.startDate)} até {formatDate(selectedWorkout.validUntil)}
                      </div>
                    </div>

                    {/* Header Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => setShowDetailsModal(true)}
                        className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-100 transition-colors shadow-2xs"
                        title="Expandir ficha completa em janela sobreposta"
                      >
                        <Maximize2 className="h-3.5 w-3.5 text-blue-600" />
                        <span>Expandir Ficha</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowShareModal(true)}
                        className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
                      >
                        <Share2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>WhatsApp / PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingWorkout(selectedWorkout);
                          setShowEditorModal(true);
                        }}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicateWorkout(selectedWorkout)}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                        title="Clonar esta ficha para outro aluno"
                      >
                        <Copy className="h-3.5 w-3.5 text-slate-500" />
                        <span className="hidden sm:inline">Clonar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSubTabChange('treino_do_dia')}
                        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-xs"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        <span>Executar no App</span>
                      </button>
                    </div>
                  </div>

                  {/* Splits Switcher (Treino A / B / C / D...) */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                    {selectedWorkout.splits.map((split, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSplitIndex(idx)}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 ${
                          activeSplitIndex === idx
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>{split.name}</span>
                        <span className="w-5 h-5 rounded-full bg-white/20 text-[10px] flex items-center justify-center">
                          {split.exercises.length}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Current Split Exercises Table */}
                  {selectedWorkout.splits[activeSplitIndex] && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">
                          {selectedWorkout.splits[activeSplitIndex].name}
                        </h3>
                        <span className="text-xs text-slate-400">
                          {selectedWorkout.splits[activeSplitIndex].exercises.length} exercícios prescritos
                        </span>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left text-xs text-slate-600">
                          <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                            <tr>
                              <th className="py-2.5 px-3 min-w-[180px]">Exercício</th>
                              <th className="py-2.5 px-3">Grupo Muscular</th>
                              <th className="py-2.5 px-2 text-center">Séries</th>
                              <th className="py-2.5 px-2 text-center">Repetições</th>
                              <th className="py-2.5 px-2 text-center">Carga (kg)</th>
                              <th className="py-2.5 px-2 text-center">Descanso</th>
                              <th className="py-2.5 px-3">Método</th>
                              <th className="py-2.5 px-3 min-w-[140px]">Observações Técnicas</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-sans">
                            {selectedWorkout.splits[activeSplitIndex].exercises.map((ex, exIdx) => (
                              <tr key={ex.id || exIdx} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-2.5 px-3 font-bold text-slate-900">
                                  {ex.name}
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                                    {ex.muscleGroup}
                                  </span>
                                </td>
                                <td className="py-2.5 px-2 text-center font-bold text-slate-900">
                                  {ex.sets}
                                </td>
                                <td className="py-2.5 px-2 text-center font-medium text-slate-800">
                                  {ex.reps}
                                </td>
                                <td className="py-2.5 px-2 text-center font-bold text-blue-700">
                                  {ex.weightKg ? `${ex.weightKg} kg` : '-'}
                                </td>
                                <td className="py-2.5 px-2 text-center text-slate-500 font-medium">
                                  {ex.restSec}s
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="rounded bg-blue-50 text-blue-800 px-2 py-0.5 text-[10px] font-bold">
                                    {ex.method || 'Tradicional'}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-slate-500 italic text-[11px]">
                                  {ex.notes || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {selectedWorkout.notes && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                      <strong className="font-bold text-slate-800">Orientações do Treinador: </strong>
                      {selectedWorkout.notes}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">
                  Nenhuma ficha de treino selecionada.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CATÁLOGO DE EXERCÍCIOS (+1.400) */}
      {currentSubTab === 'catalogo_exercicios' && (
        <ExerciseCatalogView />
      )}

      {/* TAB 3: MODELOS & TEMPLATES PRONTOS (PADRÕES & PERSONALIZADOS) */}
      {currentSubTab === 'modelos_templates' && (
        <WorkoutTemplatesView onApplyTemplate={handleApplyTemplate} />
      )}

      {/* TAB 4: TREINO DO DIA (MODO ALUNO COM TIMER) */}
      {currentSubTab === 'treino_do_dia' && (
        <TreinoDoDiaView 
          workout={selectedWorkout}
          students={students}
          workouts={workouts}
          onSelectWorkout={(w) => setSelectedWorkout(w)}
          onOpenPrescriptionModal={(s) => {
            if (s) {
              setEditingWorkout({
                id: `wkt-${Date.now()}`,
                studentId: s.id,
                studentName: s.name,
                title: `Treino de ${s.name.split(' ')[0]}`,
                objective: 'Hipertrofia e Condicionamento',
                level: 'Intermediário',
                instructor: 'Prof. Gianluca Marinho (CREF 112001-G/SP)',
                startDate: new Date().toISOString().slice(0, 10),
                validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                splits: []
              } as WorkoutPlan);
            } else {
              setEditingWorkout(null);
            }
            setShowEditorModal(true);
          }}
        />
      )}

      {/* TAB 5: CONTROLE DE CARGA & 1RM */}
      {currentSubTab === 'controle_carga' && (
        <ControleCargaTab 
          students={students} 
          workouts={workouts}
          selectedStudentId={selectedStudentId}
          onSelectStudentId={(id) => setSelectedStudentId(id)}
          onExportPdf={() => setShowPdfModal(true)}
        />
      )}

      {/* TAB 6: AVALIAÇÕES FÍSICAS (Baseado no avaliacaofisica.app) */}
      {currentSubTab === 'testes_fisicos' && (
        <AvaliacoesFisicasTab 
          students={students} 
          selectedStudentId={selectedStudentId}
          onSelectStudentId={(id) => setSelectedStudentId(id)}
          onExportPdf={() => setShowPdfModal(true)}
        />
      )}
      </div>

      {/* Workout Editor Modal */}
      <WorkoutEditorModal
        isOpen={showEditorModal}
        onClose={() => {
          setShowEditorModal(false);
          setEditingWorkout(null);
        }}
        onSave={handleSaveWorkout}
        students={students}
        initialWorkout={editingWorkout}
      />

      {/* Exercise Catalog Modal */}
      <ExerciseCatalogModal
        isOpen={showCatalogModal}
        onClose={() => setShowCatalogModal(false)}
      />

      {/* Share / WhatsApp / Print Modal */}
      {selectedWorkout && (
        <WorkoutShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          workout={selectedWorkout}
          student={students.find(s => s.id === selectedWorkout.studentId)}
        />
      )}

      {/* Workout Full Details Overlay Modal (Expandir) */}
      {selectedWorkout && (
        <WorkoutDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          workout={selectedWorkout}
          student={students.find(s => s.id === selectedWorkout.studentId)}
          onEdit={() => {
            setShowDetailsModal(false);
            setEditingWorkout(selectedWorkout);
            setShowEditorModal(true);
          }}
          onShare={() => {
            setShowDetailsModal(false);
            setShowShareModal(true);
          }}
          onClone={() => {
            setShowDetailsModal(false);
            handleDuplicateWorkout(selectedWorkout);
          }}
          onRun={() => {
            setShowDetailsModal(false);
            handleSubTabChange('treino_do_dia');
          }}
        />
      )}

      {/* Printable PDF Export Modal */}
      {showPdfModal && activeStudent && (
        <TreinoPdfReportModal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          subTab={currentSubTab}
          student={activeStudent}
          workout={selectedWorkout}
          workouts={workouts}
          selectedExerciseName="Supino Reto com Barra Olímpica"
          exerciseLogs={INITIAL_LOAD_LOGS[selectedStudentId] || INITIAL_LOAD_LOGS['std-1'] || []}
          physicalTests={(INITIAL_PHYSICAL_TESTS || []).filter(t => t.studentId === selectedStudentId)}
        />
      )}

    </div>
  );
};
