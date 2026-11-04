import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Dumbbell, 
  X, 
  Plus, 
  Filter, 
  Check, 
  PlayCircle, 
  Info, 
  Flame, 
  Layers, 
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ExerciseCatalogItem, MuscleGroup, ExerciseEquipment } from '../../../types';
import { EXERCISE_CATALOG } from './exerciseDatabase';

interface ExerciseCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise?: (exercise: ExerciseCatalogItem) => void;
  targetSplitName?: string;
  onAddCustomExercise?: (newEx: ExerciseCatalogItem) => void;
}

const MUSCLE_GROUPS: { id: MuscleGroup | 'Todos'; label: string }[] = [
  { id: 'Todos', label: 'Todos os Grupos' },
  { id: 'Peito', label: 'Peitoral' },
  { id: 'Costas', label: 'Dorsais / Costas' },
  { id: 'Ombros', label: 'Ombros / Deltoides' },
  { id: 'Braços', label: 'Braços (Bíceps/Tríceps)' },
  { id: 'Bíceps', label: 'Bíceps' },
  { id: 'Tríceps', label: 'Tríceps' },
  { id: 'Antebraço', label: 'Antebraço' },
  { id: 'Pernas', label: 'Pernas / Quadríceps' },
  { id: 'Glúteos', label: 'Glúteos' },
  { id: 'Panturrilhas', label: 'Panturrilhas' },
  { id: 'Abdômen', label: 'Abdômen & Core' },
  { id: 'Cardio', label: 'Cárdio & Aeróbico' },
  { id: 'Funcional', label: 'Funcional & Cross' },
  { id: 'Alongamento', label: 'Alongamento & Mobilidade' },
  { id: 'Futebol', label: 'Futebol & Drills Coletivos' }
];

const EQUIPMENTS: { id: ExerciseEquipment | 'Todos'; label: string }[] = [
  { id: 'Todos', label: 'Todos Equipamentos' },
  { id: 'Barra', label: 'Barra Olímpica' },
  { id: 'Halteres', label: 'Halteres' },
  { id: 'Cabos/Polia', label: 'Cabos / Polia' },
  { id: 'Máquina', label: 'Máquinas' },
  { id: 'Peso Corporal', label: 'Peso Corporal / Calistenia' },
  { id: 'Smith', label: 'Smith Machine' },
  { id: 'Kettlebell', label: 'Kettlebell' },
  { id: 'Elástico', label: 'Elásticos / Superband' },
  { id: 'Aparelho Cárdio', label: 'Aparelho Cárdio' },
  { id: 'Outro', label: 'Outros / Acessórios' }
];

export const ExerciseCatalogModal: React.FC<ExerciseCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
  targetSplitName,
  onAddCustomExercise
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'Todos'>('Todos');
  const [selectedEquipment, setSelectedEquipment] = useState<ExerciseEquipment | 'Todos'>('Todos');
  const [previewExercise, setPreviewExercise] = useState<ExerciseCatalogItem | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 40;

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedMuscle, selectedEquipment]);

  // New custom exercise state
  const [showNewCustomForm, setShowNewCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState<MuscleGroup>('Peito');
  const [customEquipment, setCustomEquipment] = useState<ExerciseEquipment>('Halteres');
  const [customDifficulty, setCustomDifficulty] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Intermediário');
  const [customInstructions, setCustomInstructions] = useState('');
  const [customVideoUrl, setCustomVideoUrl] = useState('');

  const filteredExercises = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return EXERCISE_CATALOG.filter(ex => {
      const matchSearch = term === '' ||
        ex.name.toLowerCase().includes(term) ||
        ex.primaryMuscle.toLowerCase().includes(term) ||
        ex.muscleGroup.toLowerCase().includes(term) ||
        (ex.secondaryMuscles && ex.secondaryMuscles.some(sm => sm.toLowerCase().includes(term))) ||
        (ex.equipment && ex.equipment.toLowerCase().includes(term));

      const matchMuscle = selectedMuscle === 'Todos' ? true :
        selectedMuscle === 'Braços' ? ['Braços', 'Bíceps', 'Tríceps', 'Antebraço'].includes(ex.muscleGroup) :
        selectedMuscle === 'Pernas' ? ['Pernas', 'Glúteos', 'Panturrilhas'].includes(ex.muscleGroup) :
        ex.muscleGroup === selectedMuscle;

      const matchEquip = selectedEquipment === 'Todos' ? true : ex.equipment === selectedEquipment;

      return matchSearch && matchMuscle && matchEquip;
    });
  }, [searchTerm, selectedMuscle, selectedEquipment]);

  const totalPages = Math.max(1, Math.ceil(filteredExercises.length / ITEMS_PER_PAGE));
  const paginatedExercises = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExercises.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredExercises, currentPage]);

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newEx: ExerciseCatalogItem = {
      id: `custom-ex-${Date.now()}`,
      name: customName.trim(),
      muscleGroup: customMuscle,
      equipment: customEquipment,
      difficulty: customDifficulty,
      primaryMuscle: customMuscle,
      instructions: customInstructions ? customInstructions.split('\n').filter(Boolean) : ['Executar com cadência controlada e respiração fluida.'],
      videoUrl: customVideoUrl.trim() || undefined,
      isCustom: true
    };

    if (onAddCustomExercise) {
      onAddCustomExercise(newEx);
    }
    EXERCISE_CATALOG.unshift(newEx);
    setShowNewCustomForm(false);
    setCustomName('');
    setCustomInstructions('');
    setCustomVideoUrl('');
    setPreviewExercise(newEx);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  Catálogo de Exercícios & Biomecânica
                </h3>
                <span className="text-[10px] font-bold bg-blue-500/30 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  +1.400 Exercícios
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {targetSplitName ? `Adicionando ao: ${targetSplitName}` : 'Guia visual com execução anatômica, vídeos e orientações'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNewCustomForm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Novo Exercício Personalizado</span>
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

        {/* Filters and Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por exercício, músculo (ex: supino, rosca, agachamento)..."
                className="w-full rounded-xl pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Equipment Filter */}
            <div className="w-full sm:w-auto shrink-0">
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value as any)}
                className="w-full sm:w-auto rounded-xl px-3 py-2.5 bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              >
                {EQUIPMENTS.map(eq => (
                  <option key={eq.id} value={eq.id}>{eq.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Muscle Group Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {MUSCLE_GROUPS.map(mg => {
              const active = selectedMuscle === mg.id;
              return (
                <button
                  key={mg.id}
                  onClick={() => setSelectedMuscle(mg.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/80'
                  }`}
                >
                  {mg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body: Grid of Exercises + Detail Sidebar */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
          
          {/* Exercises List (7 cols or full) */}
          <div className="lg:col-span-7 overflow-y-auto p-4 space-y-2 border-r border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>
                Exibindo {filteredExercises.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredExercises.length)} de {filteredExercises.length.toLocaleString('pt-BR')} exercícios
              </span>
              <span className="text-[11px] text-slate-400">Clique para ver execução anatômica</span>
            </div>

            {filteredExercises.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                <Dumbbell className="w-8 h-8 mx-auto text-slate-300" />
                <p>Nenhum exercício encontrado com esses filtros.</p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedMuscle('Todos'); setSelectedEquipment('Todos'); }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {paginatedExercises.map(ex => {
                  const isSelected = previewExercise?.id === ex.id;
                  return (
                    <div
                      key={ex.id}
                      onClick={() => setPreviewExercise(ex)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Muscle Group Tag Icon */}
                        <div className="w-10 h-10 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center font-black text-xs shrink-0">
                          {ex.muscleGroup.slice(0, 3).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {ex.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 flex-wrap">
                            <span className="font-semibold text-blue-700">{ex.muscleGroup}</span>
                            <span>•</span>
                            <span className="text-slate-600">{ex.equipment}</span>
                            <span>•</span>
                            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600 font-medium">
                              {ex.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {onSelectExercise && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectExercise(ex);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Adicionar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pt-3 pb-1 flex items-center justify-between text-xs text-slate-600 border-t border-slate-200 mt-3">
                    <div className="text-[11px]">
                      Página <span className="font-bold text-slate-900">{currentPage}</span> de <span className="font-bold text-slate-900">{totalPages}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold text-slate-700 shadow-2xs"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Anterior</span>
                      </button>

                      <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-semibold text-slate-700 shadow-2xs"
                      >
                        <span>Próxima</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Exercise Preview Details (5 cols) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col bg-slate-50/60 overflow-y-auto p-5">
            {previewExercise ? (
              <div className="space-y-4">
                {/* Header preview */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {previewExercise.muscleGroup}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      Equipamento: <strong>{previewExercise.equipment}</strong>
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {previewExercise.name}
                  </h4>

                  <div className="text-xs text-slate-600">
                    <div className="font-semibold text-slate-700">Músculo Primário:</div>
                    <div className="text-blue-700 font-medium">{previewExercise.primaryMuscle}</div>
                  </div>

                  {previewExercise.secondaryMuscles && (
                    <div className="text-xs text-slate-600 pt-1">
                      <div className="font-semibold text-slate-700">Músculos Secundários / Sinergistas:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {previewExercise.secondaryMuscles.map((m, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Biomechanical Instructions */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-600" />
                    Instruções Passo a Passo
                  </h5>
                  <ol className="space-y-1.5 text-xs text-slate-600 list-decimal list-inside">
                    {previewExercise.instructions.map((step, idx) => (
                      <li key={idx} className="leading-relaxed pl-1">
                        <span className="text-slate-800">{step}</span>
                      </li>
                    ))}
                  </ol>

                  {previewExercise.tips && (
                    <div className="mt-3 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
                      <strong className="font-bold">Dica Biomecânica: </strong>
                      {previewExercise.tips}
                    </div>
                  )}
                </div>

                {/* Video / Animation demo placeholder */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-md text-center space-y-2">
                  <PlayCircle className="w-8 h-8 text-blue-400 mx-auto" />
                  <div className="text-xs font-bold">Demonstração Visual do Exercício</div>
                  <p className="text-[11px] text-slate-300">
                    O aluno visualiza a animação de execução 3D diretamente no aplicativo do aluno.
                  </p>
                  {previewExercise.videoUrl && (
                    <a
                      href={previewExercise.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-300 underline pt-1"
                    >
                      <span>Abrir vídeo externo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Action button */}
                {onSelectExercise && (
                  <button
                    type="button"
                    onClick={() => onSelectExercise(previewExercise)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar "{previewExercise.name}" à Ficha</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                <Dumbbell className="w-10 h-10 text-slate-300 stroke-1" />
                <p className="text-xs font-medium">
                  Selecione qualquer exercício ao lado para visualizar a ficha técnica e biomecânica completa.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Catálogo sincronizado com a base Avaliação Física PRO</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            Fechar
          </button>
        </div>

        {/* Sub-Modal: Add Custom Exercise */}
        {showNewCustomForm && (
          <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  Cadastrar Exercício Personalizado
                </h4>
                <button
                  type="button"
                  onClick={() => setShowNewCustomForm(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCustom} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nome do Exercício *
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Ex: Agachamento Búlgaro com Halteres"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Grupo Muscular
                    </label>
                    <select
                      value={customMuscle}
                      onChange={(e) => setCustomMuscle(e.target.value as any)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-hidden"
                    >
                      {MUSCLE_GROUPS.filter(m => m.id !== 'Todos').map(m => (
                        <option key={m.id} value={m.id}>{m.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Equipamento
                    </label>
                    <select
                      value={customEquipment}
                      onChange={(e) => setCustomEquipment(e.target.value as any)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-hidden"
                    >
                      {EQUIPMENTS.filter(e => e.id !== 'Todos').map(eq => (
                        <option key={eq.id} value={eq.id}>{eq.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Link do Vídeo / YouTube (Opcional)
                  </label>
                  <input
                    type="url"
                    value={customVideoUrl}
                    onChange={(e) => setCustomVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Instruções de Execução / Dicas
                  </label>
                  <textarea
                    rows={3}
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="Descreva a postura, trajetória e respiração..."
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowNewCustomForm(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs"
                  >
                    Salvar no Catálogo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
