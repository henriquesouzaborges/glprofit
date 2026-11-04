import React, { useState, useRef, useEffect } from 'react';
import { 
  Dumbbell, 
  Plus, 
  Trash2, 
  Copy, 
  BookOpen, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  Clock, 
  Layers, 
  User, 
  Calendar, 
  Sparkles, 
  Info, 
  ShieldCheck,
  Filter,
  ChevronDown,
  Tag
} from 'lucide-react';
import { 
  WorkoutPlan, 
  Student, 
  WorkoutSplit, 
  ExerciseItem, 
  TrainingMethod,
  ExerciseCatalogItem,
  WorkoutTemplate
} from '../../../types';
import { WORKOUT_TEMPLATES } from './exerciseDatabase';
import { getCustomTemplates } from './templateStorage';
import { TEMPLATE_CATEGORIES } from './WorkoutTemplatesView';
import { ExerciseCatalogModal } from './ExerciseCatalogModal';

interface WorkoutEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: WorkoutPlan) => void;
  students: Student[];
  initialWorkout?: WorkoutPlan | null;
}

const TRAINING_METHODS: TrainingMethod[] = [
  'Tradicional',
  'Drop-set',
  'Bi-set',
  'Tri-set',
  'Rest-pause',
  'Pirâmide Crescente',
  'Pirâmide Decrescente',
  'Super-série',
  'GVT (German Volume)',
  'FST-7',
  'Ponto Zero',
  'Isometria',
  'Excêntrica Lenta'
];

export const WorkoutEditorModal: React.FC<WorkoutEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  students,
  initialWorkout
}) => {
  const [studentId, setStudentId] = useState(initialWorkout?.studentId || (students[0]?.id || ''));
  const [title, setTitle] = useState(initialWorkout?.title || 'Hipertrofia ABC - Periodização 1');
  const [objective, setObjective] = useState(initialWorkout?.objective || 'Hipertrofia e Definição Muscular');
  const [level, setLevel] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>(initialWorkout?.level || 'Intermediário');
  const [instructor, setInstructor] = useState(initialWorkout?.instructor || 'Prof. Gianluca Marinho (CREF 112001-G/SP)');
  const [startDate, setStartDate] = useState(initialWorkout?.startDate || new Date().toISOString().slice(0, 10));
  const [validUntil, setValidUntil] = useState(
    initialWorkout?.validUntil || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState(initialWorkout?.notes || '');

  // Splits State
  const [splits, setSplits] = useState<WorkoutSplit[]>(() => {
    if (initialWorkout?.splits?.length) {
      return JSON.parse(JSON.stringify(initialWorkout.splits));
    }
    // Default initial template
    return [
      {
        name: 'Treino A - Peitoral e Tríceps',
        exercises: [
          { id: `ex-${Date.now()}-1`, name: 'Supino Reto com Barra Olímpica', muscleGroup: 'Peito', sets: 4, reps: '8-10', weightKg: 70, restSec: 90, method: 'Tradicional', notes: 'Cadência controlada' },
          { id: `ex-${Date.now()}-2`, name: 'Supino Inclinado com Halteres', muscleGroup: 'Peito', sets: 4, reps: '10-12', weightKg: 24, restSec: 60, method: 'Tradicional' },
          { id: `ex-${Date.now()}-3`, name: 'Tríceps Pulley com Corda', muscleGroup: 'Braços', sets: 4, reps: '12-15', weightKg: 35, restSec: 45, method: 'Drop-set' }
        ]
      },
      {
        name: 'Treino B - Costas e Bíceps',
        exercises: [
          { id: `ex-${Date.now()}-4`, name: 'Puxada Frontal Aberta no Pulley', muscleGroup: 'Costas', sets: 4, reps: '10-12', weightKg: 60, restSec: 60, method: 'Tradicional' },
          { id: `ex-${Date.now()}-5`, name: 'Remada Curvada com Barra', muscleGroup: 'Costas', sets: 4, reps: '8-10', weightKg: 55, restSec: 75, method: 'Tradicional' },
          { id: `ex-${Date.now()}-6`, name: 'Rosca Direta com Barra W', muscleGroup: 'Braços', sets: 3, reps: '10-12', weightKg: 22, restSec: 60, method: 'Tradicional' }
        ]
      },
      {
        name: 'Treino C - Membros Inferiores & Abdômen',
        exercises: [
          { id: `ex-${Date.now()}-7`, name: 'Agachamento Livre com Barra', muscleGroup: 'Pernas', sets: 4, reps: '8-10', weightKg: 80, restSec: 90, method: 'Tradicional' },
          { id: `ex-${Date.now()}-8`, name: 'Leg Press 45° Articulado', muscleGroup: 'Pernas', sets: 4, reps: '12', weightKg: 180, restSec: 60, method: 'Tradicional' },
          { id: `ex-${Date.now()}-9`, name: 'Abdominal Supra na Prancha', muscleGroup: 'Abdômen', sets: 3, reps: '20', restSec: 30, method: 'Tradicional' }
        ]
      }
    ];
  });

  const [activeSplitIndex, setActiveSplitIndex] = useState(0);
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [pickerFilter, setPickerFilter] = useState<'all' | 'platform' | 'custom'>('all');
  const [pickerSelectedCategories, setPickerSelectedCategories] = useState<string[]>([]);
  const [isPickerCategoryDropdownOpen, setIsPickerCategoryDropdownOpen] = useState(false);
  const pickerCategoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerCategoryDropdownRef.current && !pickerCategoryDropdownRef.current.contains(event.target as Node)) {
        setIsPickerCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const normalize = (text?: string) =>
    (text || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const templateMatchesCategory = (tpl: WorkoutTemplate, cat: string) => {
    const normCat = normalize(cat);
    const tplCat = normalize(tpl.category);
    const tplLevel = normalize(tpl.level);
    const tplTitle = normalize(tpl.title);
    const tplObj = normalize(tpl.objective);
    const tplDesc = normalize(tpl.description);

    return (
      tplCat === normCat ||
      tplLevel === normCat ||
      tplCat.includes(normCat) ||
      tplTitle.includes(normCat) ||
      tplObj.includes(normCat) ||
      tplDesc.includes(normCat)
    );
  };

  const customTemplatesList = getCustomTemplates();
  const availableTemplates: WorkoutTemplate[] = (() => {
    const platform = WORKOUT_TEMPLATES.map(t => ({ ...t, isCustom: false }));
    let list: WorkoutTemplate[] = [];
    if (pickerFilter === 'platform') list = platform;
    else if (pickerFilter === 'custom') list = customTemplatesList;
    else list = [...customTemplatesList, ...platform];

    if (pickerSelectedCategories.length > 0) {
      list = list.filter(tpl =>
        pickerSelectedCategories.some(cat => templateMatchesCategory(tpl, cat))
      );
    }
    return list;
  })();

  // Split management
  const handleAddSplit = () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const nextLetter = letters[splits.length] || `Série ${splits.length + 1}`;
    const newSplit: WorkoutSplit = {
      name: `Treino ${nextLetter} - Novo Grupo`,
      exercises: []
    };
    setSplits([...splits, newSplit]);
    setActiveSplitIndex(splits.length);
  };

  const handleRemoveSplit = (idx: number) => {
    if (splits.length <= 1) {
      alert('A ficha de treino deve conter no mínimo 1 divisão.');
      return;
    }
    const updated = splits.filter((_, i) => i !== idx);
    setSplits(updated);
    setActiveSplitIndex(Math.max(0, idx - 1));
  };

  const handleUpdateSplitName = (idx: number, newName: string) => {
    const updated = [...splits];
    updated[idx].name = newName;
    setSplits(updated);
  };

  // Exercise management in active split
  const handleAddExerciseFromCatalog = (catItem: ExerciseCatalogItem) => {
    const newEx: ExerciseItem = {
      id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: catItem.name,
      muscleGroup: catItem.muscleGroup,
      sets: 3,
      reps: '10-12',
      weightKg: 20,
      restSec: 60,
      equipment: catItem.equipment,
      method: 'Tradicional',
      notes: catItem.tips || ''
    };

    const updated = [...splits];
    if (!updated[activeSplitIndex]) return;
    updated[activeSplitIndex].exercises.push(newEx);
    setSplits(updated);
    setCatalogModalOpen(false);
  };

  const handleUpdateExercise = (exIdx: number, field: keyof ExerciseItem, value: any) => {
    const updated = [...splits];
    const currentEx = updated[activeSplitIndex].exercises[exIdx];
    if (!currentEx) return;

    (currentEx as any)[field] = value;
    setSplits(updated);
  };

  const handleRemoveExercise = (exIdx: number) => {
    const updated = [...splits];
    updated[activeSplitIndex].exercises = updated[activeSplitIndex].exercises.filter((_, i) => i !== exIdx);
    setSplits(updated);
  };

  const handleMoveExercise = (exIdx: number, direction: 'up' | 'down') => {
    const updated = [...splits];
    const exercises = updated[activeSplitIndex].exercises;
    const targetIdx = direction === 'up' ? exIdx - 1 : exIdx + 1;

    if (targetIdx < 0 || targetIdx >= exercises.length) return;

    const temp = exercises[exIdx];
    exercises[exIdx] = exercises[targetIdx];
    exercises[targetIdx] = temp;
    setSplits(updated);
  };

  // Load standard template
  const handleApplyTemplate = (tpl: any) => {
    if (splits.some(s => s.exercises.length > 0)) {
      if (!confirm(`Deseja substituir as divisões atuais pelo modelo "${tpl.title}"?`)) {
        return;
      }
    }
    setTitle(tpl.title);
    setObjective(tpl.objective);
    setLevel(tpl.level);
    setSplits(JSON.parse(JSON.stringify(tpl.splits)));
    setActiveSplitIndex(0);
    setShowTemplatePicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) {
      alert('Por favor, selecione um aluno.');
      return;
    }
    if (!title.trim()) {
      alert('Por favor, informe o nome do treino.');
      return;
    }

    const studentObj = students.find(s => s.id === studentId);
    const newWorkout: WorkoutPlan = {
      id: initialWorkout?.id || `wkt-${Date.now()}`,
      studentId,
      studentName: studentObj?.name || 'Aluno GL PRO FIT',
      title: title.trim(),
      objective: objective.trim(),
      level,
      instructor: instructor.trim(),
      startDate,
      validUntil,
      splits,
      notes: notes.trim()
    };

    onSave(newWorkout);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  {initialWorkout ? 'Editar Ficha de Treino' : 'Prescrever Nova Ficha de Treino'}
                </h3>
                <span className="text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  Módulo Avaliação Física PRO
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Divisões dinâmicas, séries, repetições, métodos avançados e catálogo com +1.400 exercícios
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTemplatePicker(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-xs transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modelos Prontos</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* General Workout Settings Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              Dados Gerais da Prescrição
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Aluno */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Aluno *
                </label>
                <select
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-medium focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="">Selecione o Aluno</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code || 'GL'})</option>
                  ))}
                </select>
              </div>

              {/* Nome do Treino */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Título do Treino *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Treino ABC - Hipertrofia Fase 1"
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              {/* Objetivo */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Objetivo Principal
                </label>
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Ex: Hipertrofia / Queima de Gordura"
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              {/* Nível */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nível de Treinamento
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-medium focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="Iniciante">Iniciante (Adaptação)</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado (Alta Performance)</option>
                </select>
              </div>

              {/* Validade Início */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Data de Início
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              {/* Validade Término */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Validade da Ficha (Renovação)
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              {/* Prescritor */}
              <div className="lg:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Treinador Responsável / CREF
                </label>
                <input
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Splits Tabs Navigator */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-800">
                  Divisões de Treino ({splits.length})
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddSplit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Nova Divisão</span>
                </button>
              </div>
            </div>

            {/* Tabs for Splits */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
              {splits.map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setActiveSplitIndex(idx)}
                  className={`px-4 py-2 rounded-t-lg text-xs font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                    activeSplitIndex === idx
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{s.name}</span>
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-[10px] flex items-center justify-center text-slate-700">
                    {s.exercises.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Split Content & Exercises Table */}
          {splits[activeSplitIndex] && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
              {/* Split Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Nome / Descrição da Divisão
                  </label>
                  <input
                    type="text"
                    value={splits[activeSplitIndex].name}
                    onChange={(e) => handleUpdateSplitName(activeSplitIndex, e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setCatalogModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar do Catálogo (+1.400)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveSplit(activeSplitIndex)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    title="Remover esta divisão"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Exercises List / Table */}
              {splits[activeSplitIndex].exercises.length === 0 ? (
                <div className="py-10 text-center text-slate-400 space-y-2 border-2 border-dashed border-slate-200 rounded-xl">
                  <Dumbbell className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-medium">
                    Nenhum exercício adicionado nesta divisão ainda.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCatalogModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                  >
                    Abrir Catálogo de Exercícios
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 w-10 text-center">#</th>
                        <th className="py-2.5 px-3 min-w-[200px]">Exercício</th>
                        <th className="py-2.5 px-2 w-20 text-center">Séries</th>
                        <th className="py-2.5 px-2 w-24 text-center">Repetições</th>
                        <th className="py-2.5 px-2 w-24 text-center">Carga (kg)</th>
                        <th className="py-2.5 px-2 w-24 text-center">Descanso</th>
                        <th className="py-2.5 px-3 min-w-[150px]">Método</th>
                        <th className="py-2.5 px-3 min-w-[150px]">Observações Técnicas</th>
                        <th className="py-2.5 px-2 w-20 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {splits[activeSplitIndex].exercises.map((ex, exIdx) => (
                        <tr key={ex.id || exIdx} className="hover:bg-slate-50/70 transition-colors">
                          {/* Order index with up/down controls */}
                          <td className="py-2 px-2 text-center text-slate-400">
                            <div className="flex flex-col items-center gap-0.5">
                              <button
                                type="button"
                                disabled={exIdx === 0}
                                onClick={() => handleMoveExercise(exIdx, 'up')}
                                className="p-0.5 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <span className="font-bold text-[10px] text-slate-600">{exIdx + 1}</span>
                              <button
                                type="button"
                                disabled={exIdx === splits[activeSplitIndex].exercises.length - 1}
                                onClick={() => handleMoveExercise(exIdx, 'down')}
                                className="p-0.5 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </td>

                          {/* Name & Muscle */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={ex.name}
                              onChange={(e) => handleUpdateExercise(exIdx, 'name', e.target.value)}
                              className="w-full font-bold text-xs text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-hidden py-0.5"
                            />
                            <div className="text-[10px] font-semibold text-blue-700">
                              {ex.muscleGroup}
                            </div>
                          </td>

                          {/* Sets */}
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min={1}
                              max={20}
                              value={ex.sets}
                              onChange={(e) => handleUpdateExercise(exIdx, 'sets', parseInt(e.target.value) || 1)}
                              className="w-14 text-center rounded border border-slate-300 p-1 text-xs font-bold text-slate-800 focus:border-blue-600 focus:outline-hidden"
                            />
                          </td>

                          {/* Reps */}
                          <td className="py-2 px-2 text-center">
                            <input
                              type="text"
                              value={ex.reps}
                              onChange={(e) => handleUpdateExercise(exIdx, 'reps', e.target.value)}
                              placeholder="10-12"
                              className="w-18 text-center rounded border border-slate-300 p-1 text-xs font-medium text-slate-800 focus:border-blue-600 focus:outline-hidden"
                            />
                          </td>

                          {/* Weight (kg) */}
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              value={ex.weightKg || 0}
                              onChange={(e) => handleUpdateExercise(exIdx, 'weightKg', parseFloat(e.target.value) || 0)}
                              className="w-16 text-center rounded border border-slate-300 p-1 text-xs font-bold text-blue-700 focus:border-blue-600 focus:outline-hidden"
                            />
                          </td>

                          {/* Rest (sec) */}
                          <td className="py-2 px-2 text-center">
                            <select
                              value={ex.restSec}
                              onChange={(e) => handleUpdateExercise(exIdx, 'restSec', parseInt(e.target.value))}
                              className="w-20 rounded border border-slate-300 p-1 text-xs text-slate-700 focus:border-blue-600 focus:outline-hidden"
                            >
                              <option value={30}>30s</option>
                              <option value={45}>45s</option>
                              <option value={60}>60s</option>
                              <option value={75}>75s</option>
                              <option value={90}>90s</option>
                              <option value={120}>120s</option>
                              <option value={180}>180s</option>
                            </select>
                          </td>

                          {/* Method */}
                          <td className="py-2 px-3">
                            <select
                              value={ex.method || 'Tradicional'}
                              onChange={(e) => handleUpdateExercise(exIdx, 'method', e.target.value)}
                              className="w-full rounded border border-slate-300 p-1 text-xs text-slate-700 focus:border-blue-600 focus:outline-hidden"
                            >
                              {TRAINING_METHODS.map(m => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                          </td>

                          {/* Notes */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={ex.notes || ''}
                              onChange={(e) => handleUpdateExercise(exIdx, 'notes', e.target.value)}
                              placeholder="Cadência, pico de contração..."
                              className="w-full rounded border border-slate-300 p-1 text-xs text-slate-600 placeholder:text-slate-400 focus:border-blue-600 focus:outline-hidden"
                            />
                          </td>

                          {/* Actions */}
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveExercise(exIdx)}
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Remover exercício"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* General Notes for Student */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Orientações Gerais do Treinador para o Aluno
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Aquecer 10 minutos na esteira antes de iniciar. Manter hidratação de 500ml durante o treino. Treinar até a falha concêntrica nas últimas séries."
              className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-blue-600 focus:outline-hidden"
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md active:scale-98 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Salvar e Disponibilizar Ficha no App</span>
            </button>
          </div>
        </form>

        {/* Template Picker Sub-Modal */}
        {showTemplatePicker && (
          <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Biblioteca de Modelos Prontos de Treino (Templates)
                </h4>
                <button
                  type="button"
                  onClick={() => setShowTemplatePicker(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setPickerFilter('all')}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold transition-all text-center ${
                    pickerFilter === 'all'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todas ({customTemplatesList.length + WORKOUT_TEMPLATES.length})
                </button>

                <button
                  type="button"
                  onClick={() => setPickerFilter('platform')}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold transition-all text-center ${
                    pickerFilter === 'platform'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Plataforma ({WORKOUT_TEMPLATES.length})
                </button>

                <button
                  type="button"
                  onClick={() => setPickerFilter('custom')}
                  className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold transition-all text-center ${
                    pickerFilter === 'custom'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Criados por Mim ({customTemplatesList.length})
                </button>
              </div>

              {/* Category Filter Multi-Select Dropdown in Picker */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1 border-t border-slate-100">
                <div className="relative inline-block" ref={pickerCategoryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsPickerCategoryDropdownOpen(prev => !prev)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      pickerSelectedCategories.length > 0
                        ? 'bg-blue-50 border-blue-300 text-blue-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      {pickerSelectedCategories.length === 0
                        ? 'Filtrar por Categoria (Todas)'
                        : `Categorias (${pickerSelectedCategories.length})`}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isPickerCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isPickerCategoryDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-64 rounded-xl bg-white border border-slate-200 shadow-xl z-50 p-2.5 space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 text-[11px]">
                        <span className="font-bold text-slate-800">Categorias</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPickerSelectedCategories([...TEMPLATE_CATEGORIES])}
                            className="text-blue-600 hover:underline font-bold"
                          >
                            Todas
                          </button>
                          <button
                            type="button"
                            onClick={() => setPickerSelectedCategories([])}
                            className="text-slate-400 hover:text-rose-600 font-semibold"
                          >
                            Limpar
                          </button>
                        </div>
                      </div>

                      <div className="max-h-52 overflow-y-auto space-y-1">
                        {TEMPLATE_CATEGORIES.map(cat => {
                          const isSelected = pickerSelectedCategories.includes(cat);
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setPickerSelectedCategories(prev => 
                                  prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                                );
                              }}
                              className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs font-semibold text-left transition-colors ${
                                isSelected ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                                  isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                                }`}>
                                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </div>
                                <span>{cat}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-1.5 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsPickerCategoryDropdownOpen(false)}
                          className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold text-[11px]"
                        >
                          Concluir
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Category Chips */}
                {pickerSelectedCategories.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    {pickerSelectedCategories.map(cat => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200"
                      >
                        <span>{cat}</span>
                        <button
                          type="button"
                          onClick={() => setPickerSelectedCategories(prev => prev.filter(c => c !== cat))}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPickerSelectedCategories([])}
                      className="text-[11px] text-rose-600 hover:underline font-bold"
                    >
                      Limpar
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {availableTemplates.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Nenhum modelo encontrado nesta categoria de filtro.
                  </div>
                ) : (
                  availableTemplates.map(tpl => (
                    <div
                      key={tpl.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        tpl.isCustom ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-400' : 'border-slate-200 bg-white hover:border-blue-600'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {tpl.isCustom ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              Criado por Você
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-blue-600" />
                              Plataforma
                            </span>
                          )}
                          <span className="font-bold text-sm text-slate-900">{tpl.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            {tpl.category}
                          </span>
                          <span className="text-[10px] font-medium text-slate-500">
                            {tpl.level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{tpl.description}</p>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {tpl.splits.length} divisões musculares
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplyTemplate(tpl)}
                        className="shrink-0 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                      >
                        Aplicar Modelo
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Exercise Catalog Modal */}
        <ExerciseCatalogModal
          isOpen={catalogModalOpen}
          onClose={() => setCatalogModalOpen(false)}
          onSelectExercise={handleAddExerciseFromCatalog}
          targetSplitName={splits[activeSplitIndex]?.name}
        />

      </div>
    </div>
  );
};
