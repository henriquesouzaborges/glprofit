import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Dumbbell, 
  Plus, 
  Info, 
  Flame, 
  Layers, 
  PlayCircle,
  ExternalLink,
  Sparkles,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ExerciseCatalogItem, MuscleGroup, ExerciseEquipment } from '../../../types';
import { EXERCISE_CATALOG } from './exerciseDatabase';

interface ExerciseCatalogViewProps {
  onSelectExercise?: (exercise: ExerciseCatalogItem) => void;
  onAddCustomExercise?: (newEx: ExerciseCatalogItem) => void;
  targetSplitName?: string;
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
  { id: 'Futebol', label: 'FUTEBOL (Drills & Coletivo)' }
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

export const ExerciseCatalogView: React.FC<ExerciseCatalogViewProps> = ({
  onSelectExercise,
  onAddCustomExercise,
  targetSplitName
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'Todos'>('Todos');
  const [selectedEquipment, setSelectedEquipment] = useState<ExerciseEquipment | 'Todos'>('Todos');
  const [previewExercise, setPreviewExercise] = useState<ExerciseCatalogItem | null>(() => EXERCISE_CATALOG[0] || null);

  // New custom exercise state
  const [showNewCustomForm, setShowNewCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState<MuscleGroup>('Peito');
  const [customEquipment, setCustomEquipment] = useState<ExerciseEquipment>('Halteres');
  const [customDifficulty, setCustomDifficulty] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Intermediário');
  const [customInstructions, setCustomInstructions] = useState('');
  const [customVideoUrl, setCustomVideoUrl] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 40;

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedMuscle, selectedEquipment]);

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

  return (
    <div className="space-y-4">
      {/* Top Banner / Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                Catálogo de Exercícios & Biomecânica
              </h2>
              <span className="text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2.5 py-0.5 rounded-full">
                +1.400 Exercícios
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Consulta completa com biomecânica, anatomia, postura correta e demonstração técnica
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewCustomForm(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Exercício Personalizado</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden flex flex-col min-h-[640px]">
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
                placeholder="Pesquisar por exercício, grupo muscular ou biomecânica (ex: supino, rosca, agachamento)..."
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
                className="w-full sm:w-auto rounded-xl px-3.5 py-2.5 bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-blue-500 shadow-2xs"
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
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
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
          
          {/* Exercises List (7 cols) */}
          <div className="lg:col-span-7 p-4 space-y-2 border-r border-slate-200 overflow-y-auto max-h-[620px]">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>
                Exibindo {filteredExercises.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredExercises.length)} de {filteredExercises.length.toLocaleString('pt-BR')} exercícios
              </span>
              <span className="text-[11px] text-slate-400">Clique para inspecionar execução anatômica</span>
            </div>

            {filteredExercises.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs space-y-2">
                <Dumbbell className="w-9 h-9 mx-auto text-slate-300" />
                <p className="font-medium">Nenhum exercício encontrado com esses filtros.</p>
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
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Muscle Tag Icon */}
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
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
          <div className="lg:col-span-5 flex flex-col bg-slate-50/70 p-5 overflow-y-auto max-h-[620px]">
            {previewExercise ? (
              <div className="space-y-4">
                {/* Header preview */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {previewExercise.muscleGroup}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      Equipamento: <strong className="text-slate-800">{previewExercise.equipment}</strong>
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {previewExercise.name}
                  </h4>

                  <div className="text-xs text-slate-600">
                    <div className="font-semibold text-slate-700">Músculo Primário:</div>
                    <div className="text-blue-700 font-bold">{previewExercise.primaryMuscle}</div>
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
                    <div className="mt-3 p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
                      <strong className="font-bold">Dica Biomecânica do Treinador: </strong>
                      {previewExercise.tips}
                    </div>
                  )}
                </div>

                {/* Video / Animation demo visual box */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-md text-center space-y-2">
                  <PlayCircle className="w-10 h-10 text-blue-400 mx-auto" />
                  <div className="text-xs font-bold">Demonstração Anatômica em Vídeo / 3D</div>
                  <p className="text-[11px] text-slate-300">
                    O aluno assiste ao vídeo de execução com cadência ideal diretamente no aplicativo do aluno.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs">
                Selecione um exercício ao lado para visualizar os detalhes anatômicos e biomecânicos.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Custom Exercise */}
      {showNewCustomForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Cadastrar Novo Exercício Personalizado
              </h3>
              <button 
                onClick={() => setShowNewCustomForm(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
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
                  placeholder="Ex: Elevação Pélvica Unilateral no Banco"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Grupo Muscular
                  </label>
                  <select
                    value={customMuscle}
                    onChange={(e) => setCustomMuscle(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-hidden"
                  >
                    {MUSCLE_GROUPS.filter(m => m.id !== 'Todos').map(mg => (
                      <option key={mg.id} value={mg.id}>{mg.label}</option>
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
  );
};
