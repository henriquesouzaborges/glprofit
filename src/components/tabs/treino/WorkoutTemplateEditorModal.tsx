import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Dumbbell, 
  Sparkles, 
  Save, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  BookOpen, 
  Check, 
  AlertCircle,
  Clock,
  Flame,
  Info
} from 'lucide-react';
import { WorkoutTemplate, WorkoutSplit, ExerciseItem, ExerciseCatalogItem } from '../../../types';
import { ExerciseCatalogModal } from './ExerciseCatalogModal';

interface WorkoutTemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: WorkoutTemplate) => void;
  initialTemplate?: WorkoutTemplate | null;
}

const CATEGORIES: WorkoutTemplate['category'][] = [
  'Hipertrofia',
  'Emagrecimento',
  'Força',
  'Feminino',
  'Masculino',
  'Reabilitação',
  'Iniciante',
  'Intermediário',
  'Avançado',
  'Funcional'
];

const LEVELS: WorkoutTemplate['level'][] = [
  'Iniciante',
  'Intermediário',
  'Avançado'
];

const INTENSITY_METHODS = [
  'Tradicional',
  'Drop-set',
  'Bi-set',
  'Tri-set',
  'Super-série',
  'Rest-pause',
  'Ponto Zero',
  'FST-7',
  'Pirâmide Crescente',
  'Pirâmide Decrescente',
  'Isometria',
  'Excêntrico Lento',
  'Circuito'
];

export const WorkoutTemplateEditorModal: React.FC<WorkoutTemplateEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTemplate
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WorkoutTemplate['category']>('Hipertrofia');
  const [level, setLevel] = useState<WorkoutTemplate['level']>('Intermediário');
  const [objective, setObjective] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('Prof. Gianluca Marinho (CREF 112001-G/SP)');
  
  const [splits, setSplits] = useState<WorkoutSplit[]>([]);
  const [activeSplitIndex, setActiveSplitIndex] = useState(0);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize form state when opening or initialTemplate changes
  useEffect(() => {
    if (isOpen) {
      if (initialTemplate) {
        setTitle(initialTemplate.title);
        setCategory(initialTemplate.category);
        setLevel(initialTemplate.level);
        setObjective(initialTemplate.objective);
        setDescription(initialTemplate.description);
        setAuthor(initialTemplate.author || 'Prof. Gianluca Marinho (CREF 112001-G/SP)');
        setSplits(JSON.parse(JSON.stringify(initialTemplate.splits)));
      } else {
        // Fresh new template draft
        setTitle('');
        setCategory('Hipertrofia');
        setLevel('Intermediário');
        setObjective('');
        setDescription('');
        setAuthor('Prof. Gianluca Marinho (CREF 112001-G/SP)');
        setSplits([
          {
            name: 'Treino A - Peitoral e Tríceps',
            exercises: [
              {
                id: `ex-${Date.now()}-1`,
                name: 'Supino Reto com Barra Olímpica',
                muscleGroup: 'Peito',
                sets: 4,
                reps: '8-10',
                weightKg: 70,
                restSec: 90,
                method: 'Tradicional',
                notes: 'Aquecimento piramidal na 1ª série'
              },
              {
                id: `ex-${Date.now()}-2`,
                name: 'Supino Inclinado com Halteres',
                muscleGroup: 'Peito',
                sets: 4,
                reps: '10-12',
                weightKg: 24,
                restSec: 60,
                method: 'Tradicional'
              },
              {
                id: `ex-${Date.now()}-3`,
                name: 'Tríceps Pulley com Corda',
                muscleGroup: 'Braços',
                sets: 4,
                reps: '12-15',
                weightKg: 35,
                restSec: 45,
                method: 'Drop-set'
              }
            ]
          },
          {
            name: 'Treino B - Costas e Bíceps',
            exercises: [
              {
                id: `ex-${Date.now()}-4`,
                name: 'Puxada Frontal Aberta no Pulley',
                muscleGroup: 'Costas',
                sets: 4,
                reps: '10-12',
                weightKg: 60,
                restSec: 60,
                method: 'Tradicional'
              },
              {
                id: `ex-${Date.now()}-5`,
                name: 'Remada Curvada com Barra',
                muscleGroup: 'Costas',
                sets: 4,
                reps: '8-10',
                weightKg: 55,
                restSec: 75,
                method: 'Tradicional'
              }
            ]
          }
        ]);
      }
      setActiveSplitIndex(0);
      setErrorMessage(null);
    }
  }, [isOpen, initialTemplate]);

  if (!isOpen) return null;

  // Split operations
  const handleAddSplit = () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const nextLetter = letters[splits.length] || `Divisão ${splits.length + 1}`;
    const newSplit: WorkoutSplit = {
      name: `Treino ${nextLetter} - Novo Grupamento`,
      exercises: []
    };
    const updated = [...splits, newSplit];
    setSplits(updated);
    setActiveSplitIndex(updated.length - 1);
  };

  const handleRemoveSplit = (idx: number) => {
    if (splits.length <= 1) {
      setErrorMessage('O modelo de treino padrão deve conter pelo menos 1 divisão.');
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

  // Exercise operations
  const handleAddExerciseFromCatalog = (catItem: ExerciseCatalogItem) => {
    const newEx: ExerciseItem = {
      id: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: catItem.name,
      muscleGroup: catItem.muscleGroup,
      sets: 4,
      reps: '10-12',
      weightKg: 20,
      restSec: 60,
      equipment: catItem.equipment,
      method: 'Tradicional',
      notes: catItem.instructions?.[0] ? `Dica: ${catItem.instructions[0].slice(0, 70)}...` : undefined
    };

    const updated = [...splits];
    if (!updated[activeSplitIndex]) {
      updated[activeSplitIndex] = { name: 'Treino A', exercises: [] };
    }
    updated[activeSplitIndex].exercises.push(newEx);
    setSplits(updated);
    setShowCatalogModal(false);
  };

  const handleAddQuickExercise = () => {
    const newEx: ExerciseItem = {
      id: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: 'Novo Exercício Personalizado',
      muscleGroup: 'Peito',
      sets: 3,
      reps: '10-12',
      weightKg: 20,
      restSec: 60,
      method: 'Tradicional'
    };
    const updated = [...splits];
    if (!updated[activeSplitIndex]) {
      updated[activeSplitIndex] = { name: 'Treino A', exercises: [] };
    }
    updated[activeSplitIndex].exercises.push(newEx);
    setSplits(updated);
  };

  const handleUpdateExercise = (exIdx: number, field: keyof ExerciseItem, value: any) => {
    const updated = [...splits];
    const exercises = updated[activeSplitIndex].exercises;
    exercises[exIdx] = {
      ...exercises[exIdx],
      [field]: value
    };
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Por favor, informe o título do modelo padrão.');
      return;
    }
    if (!objective.trim()) {
      setErrorMessage('Por favor, informe o objetivo do modelo.');
      return;
    }
    if (splits.length === 0) {
      setErrorMessage('Adicione ao menos uma divisão de treino.');
      return;
    }
    const hasEmptySplit = splits.some(s => s.exercises.length === 0);
    if (hasEmptySplit) {
      setErrorMessage('Todas as divisões precisam ter pelo menos 1 exercício cadastrado.');
      return;
    }

    const templateToSave: WorkoutTemplate = {
      id: initialTemplate?.id || `tpl-custom-${Date.now()}`,
      title: title.trim(),
      category,
      level,
      objective: objective.trim(),
      description: description.trim() || `Modelo de treino ${category} desenvolvido para nível ${level}.`,
      splits,
      isCustom: true,
      author: author.trim() || 'Prof. Gianluca Marinho',
      createdAt: initialTemplate?.createdAt || new Date().toISOString().slice(0, 10)
    };

    onSave(templateToSave);
  };

  const currentSplit = splits[activeSplitIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  {initialTemplate ? 'Editar Meu Modelo Padrão' : 'Criar Meu Modelo Padrão de Treino'}
                </h3>
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Custom Template
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Defina um protocolo padrão exclusivo para aplicar rapidamente a qualquer aluno com 1 clique
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Card: Dados Gerais do Modelo */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Identificação & Metodologia do Modelo
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {/* Título */}
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome / Título do Modelo *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Hipertrofia ABCD - Densidade & Força (Método GL)"
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-medium focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Categoria *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as WorkoutTemplate['category'])}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-medium focus:border-blue-600 focus:outline-hidden"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Nível */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nível de Experiência *
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as WorkoutTemplate['level'])}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-medium focus:border-blue-600 focus:outline-hidden"
                >
                  {LEVELS.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              {/* Objetivo */}
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Objetivo Principal *
                </label>
                <input
                  type="text"
                  required
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Ex: Ganho expressivo de massa muscular, tonificação e quebra de platô"
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-medium focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              {/* Autor */}
              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">
                  Treinador Responsável / Autor
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nome do treinador e CREF"
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-medium focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              {/* Descrição */}
              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">
                  Descrição & Diretrizes Técnicas
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva a frequência recomendada, aquecimento, cadência, recomendações de recuperação ou particularidades biomecânicas..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-medium focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Card: Divisões de Treino (Splits) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Divisões do Modelo ({splits.length})
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddSplit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Divisão</span>
                </button>
              </div>
            </div>

            {/* Split Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1">
              {splits.map((split, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSplitIndex(idx)}
                  className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeSplitIndex === idx
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{split.name}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeSplitIndex === idx ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {split.exercises.length}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Split Content */}
            {currentSplit && (
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex-1 max-w-md">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Identificação da Divisão
                    </label>
                    <input
                      type="text"
                      value={currentSplit.name}
                      onChange={(e) => handleUpdateSplitName(activeSplitIndex, e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCatalogModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs active:scale-98 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Catálogo (+1.480)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddQuickExercise}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Entrada Rápida</span>
                    </button>
                    {splits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSplit(activeSplitIndex)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Remover esta divisão"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Exercises Table / Cards */}
                {currentSplit.exercises.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl space-y-3">
                    <Dumbbell className="w-8 h-8 mx-auto text-slate-300" />
                    <div>
                      <p className="font-semibold text-slate-600">Nenhum exercício nesta divisão</p>
                      <p className="text-[11px] text-slate-400">Adicione exercícios diretamente do acervo de +1.480 exercícios biomecânicos</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCatalogModal(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs hover:bg-blue-500 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Abrir Catálogo de Exercícios</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="hidden lg:grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                      <div className="col-span-4">Exercício / Grupo</div>
                      <div className="col-span-1 text-center">Séries</div>
                      <div className="col-span-1 text-center">Reps</div>
                      <div className="col-span-1 text-center">Carga (kg)</div>
                      <div className="col-span-1 text-center">Desc (s)</div>
                      <div className="col-span-2">Método</div>
                      <div className="col-span-2 text-right">Ações</div>
                    </div>

                    {currentSplit.exercises.map((ex, exIdx) => (
                      <div
                        key={ex.id || exIdx}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all space-y-2"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center text-xs">
                          {/* Name & Muscle */}
                          <div className="lg:col-span-4 space-y-1">
                            <input
                              type="text"
                              value={ex.name}
                              onChange={(e) => handleUpdateExercise(exIdx, 'name', e.target.value)}
                              className="w-full font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-hidden text-xs py-0.5"
                            />
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                              <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                {ex.muscleGroup}
                              </span>
                              {ex.equipment && <span>• {ex.equipment}</span>}
                            </div>
                          </div>

                          {/* Sets */}
                          <div className="lg:col-span-1 flex items-center justify-between lg:justify-center gap-1">
                            <span className="lg:hidden text-slate-500 text-[11px]">Séries:</span>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={ex.sets}
                              onChange={(e) => handleUpdateExercise(exIdx, 'sets', parseInt(e.target.value) || 1)}
                              className="w-14 text-center rounded border border-slate-300 bg-white py-1 text-xs font-bold text-slate-800"
                            />
                          </div>

                          {/* Reps */}
                          <div className="lg:col-span-1 flex items-center justify-between lg:justify-center gap-1">
                            <span className="lg:hidden text-slate-500 text-[11px]">Reps:</span>
                            <input
                              type="text"
                              value={ex.reps}
                              onChange={(e) => handleUpdateExercise(exIdx, 'reps', e.target.value)}
                              className="w-16 text-center rounded border border-slate-300 bg-white py-1 text-xs font-bold text-slate-800"
                              placeholder="8-10"
                            />
                          </div>

                          {/* Weight */}
                          <div className="lg:col-span-1 flex items-center justify-between lg:justify-center gap-1">
                            <span className="lg:hidden text-slate-500 text-[11px]">Carga:</span>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={ex.weightKg || 0}
                              onChange={(e) => handleUpdateExercise(exIdx, 'weightKg', parseFloat(e.target.value) || 0)}
                              className="w-14 text-center rounded border border-slate-300 bg-white py-1 text-xs font-bold text-slate-800"
                            />
                          </div>

                          {/* Rest */}
                          <div className="lg:col-span-1 flex items-center justify-between lg:justify-center gap-1">
                            <span className="lg:hidden text-slate-500 text-[11px]">Descanso:</span>
                            <input
                              type="number"
                              min="0"
                              step="5"
                              value={ex.restSec || 60}
                              onChange={(e) => handleUpdateExercise(exIdx, 'restSec', parseInt(e.target.value) || 0)}
                              className="w-14 text-center rounded border border-slate-300 bg-white py-1 text-xs font-bold text-slate-800"
                            />
                          </div>

                          {/* Method */}
                          <div className="lg:col-span-2">
                            <select
                              value={ex.method || 'Tradicional'}
                              onChange={(e) => handleUpdateExercise(exIdx, 'method', e.target.value)}
                              className="w-full rounded border border-slate-300 bg-white py-1 px-1.5 text-[11px] font-semibold text-slate-800"
                            >
                              {INTENSITY_METHODS.map(m => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                          </div>

                          {/* Actions */}
                          <div className="lg:col-span-2 flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveExercise(exIdx, 'up')}
                              disabled={exIdx === 0}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                              title="Mover para cima"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveExercise(exIdx, 'down')}
                              disabled={exIdx === currentSplit.exercises.length - 1}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                              title="Mover para baixo"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveExercise(exIdx)}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors"
                              title="Remover exercício"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Optional notes input */}
                        <div className="pt-1 border-t border-slate-200/60">
                          <input
                            type="text"
                            value={ex.notes || ''}
                            onChange={(e) => handleUpdateExercise(exIdx, 'notes', e.target.value)}
                            placeholder="Observações da execução (ex: cadência 3-0-1, pausa de 2s no pico, etc.)..."
                            className="w-full bg-transparent text-[11px] text-slate-600 placeholder:text-slate-400 focus:outline-hidden"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md active:scale-98 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Modelo Padrão</span>
          </button>
        </div>
      </div>

      {/* Catalog Modal Integration */}
      <ExerciseCatalogModal
        isOpen={showCatalogModal}
        onClose={() => setShowCatalogModal(false)}
        onSelectExercise={handleAddExerciseFromCatalog}
        targetSplitName={currentSplit?.name}
      />
    </div>
  );
};

export default WorkoutTemplateEditorModal;
