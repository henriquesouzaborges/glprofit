import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Dumbbell, 
  Plus, 
  Info, 
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { ExerciseCatalogItem, MuscleGroup, ExerciseEquipment } from '../../../types';
import { EXERCISE_CATALOG } from './exerciseDatabase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  subscribeToFirestoreCollection,
  saveDocToFirestore,
  deleteDocFromFirestore
} from '../../../services/firebaseDbService';

type PersistedExerciseItem = ExerciseCatalogItem & { isDeleted?: boolean };

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
  onAddCustomExercise
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'Todos'>('Todos');
  const [selectedEquipment, setSelectedEquipment] = useState<ExerciseEquipment | 'Todos'>('Todos');
  const [cloudOverrides, setCloudOverrides] = useState<PersistedExerciseItem[]>(() => {
    try {
      const saved = localStorage.getItem('glprofit_exercises_catalog');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [catalogSyncError, setCatalogSyncError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    let unsubCol: (() => void) | null = null;
    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (unsubCol) {
        unsubCol();
        unsubCol = null;
      }
      if (!fbUser) return;
      unsubCol = subscribeToFirestoreCollection<PersistedExerciseItem>(
        'exercises_catalog',
        (data) => {
          setCloudOverrides(data);
          setCatalogSyncError(null);
          try {
            localStorage.setItem('glprofit_exercises_catalog', JSON.stringify(data));
          } catch {
            // ignore storage quota
          }
        },
        undefined,
        (err) => setCatalogSyncError(err instanceof Error ? err.message : String(err))
      );
    });
    return () => {
      unsubAuth();
      if (unsubCol) unsubCol();
    };
  }, []);

  const mergedCatalog = useMemo<ExerciseCatalogItem[]>(() => {
    const overrideMap = new Map<string, PersistedExerciseItem>();
    cloudOverrides.forEach(item => overrideMap.set(item.id, item));

    const baseIds = new Set(EXERCISE_CATALOG.map(item => item.id));
    const customItems = cloudOverrides.filter(item => !baseIds.has(item.id) && !item.isDeleted);

    const resolvedBase: ExerciseCatalogItem[] = [];
    for (const base of EXERCISE_CATALOG) {
      const ov = overrideMap.get(base.id);
      if (ov) {
        if (!ov.isDeleted) {
          resolvedBase.push(ov);
        }
      } else {
        resolvedBase.push(base);
      }
    }

    return [...customItems, ...resolvedBase];
  }, [cloudOverrides]);

  const [previewExercise, setPreviewExercise] = useState<ExerciseCatalogItem | null>(() => mergedCatalog[0] || null);

  useEffect(() => {
    if (!previewExercise && mergedCatalog.length > 0) {
      setPreviewExercise(mergedCatalog[0]);
    } else if (previewExercise) {
      const updated = mergedCatalog.find(ex => ex.id === previewExercise.id);
      if (!updated) {
        setPreviewExercise(mergedCatalog[0] || null);
      } else if (updated !== previewExercise) {
        setPreviewExercise(updated);
      }
    }
  }, [mergedCatalog, previewExercise]);

  // New custom exercise state
  const [showNewCustomForm, setShowNewCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState<MuscleGroup>('Peito');
  const [customEquipment, setCustomEquipment] = useState<ExerciseEquipment>('Halteres');
  const [customDifficulty, setCustomDifficulty] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Intermediário');
  const [customInstructions, setCustomInstructions] = useState('');
  const [customVideoUrl, setCustomVideoUrl] = useState('');

  // Edit exercise state
  const [editingExercise, setEditingExercise] = useState<ExerciseCatalogItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editMuscle, setEditMuscle] = useState<MuscleGroup>('Peito');
  const [editEquipment, setEditEquipment] = useState<ExerciseEquipment>('Halteres');
  const [editDifficulty, setEditDifficulty] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Intermediário');
  const [editInstructions, setEditInstructions] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 40;

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedMuscle, selectedEquipment]);

  const filteredExercises = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return mergedCatalog.filter(ex => {
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
  }, [mergedCatalog, searchTerm, selectedMuscle, selectedEquipment]);

  const totalPages = Math.max(1, Math.ceil(filteredExercises.length / ITEMS_PER_PAGE));
  const paginatedExercises = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExercises.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredExercises, currentPage]);

  const persistOverrideLocally = (updater: (prev: PersistedExerciseItem[]) => PersistedExerciseItem[]) => {
    setCloudOverrides(prev => {
      const next = updater(prev);
      try {
        localStorage.setItem('glprofit_exercises_catalog', JSON.stringify(next));
      } catch {
        // ignore storage quota
      }
      return next;
    });
  };

  const handleSaveCustom = async (e: React.FormEvent) => {
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
    persistOverrideLocally(prev => [newEx, ...prev.filter(item => item.id !== newEx.id)]);
    setShowNewCustomForm(false);
    setCustomName('');
    setCustomInstructions('');
    setCustomVideoUrl('');
    setPreviewExercise(newEx);

    try {
      await saveDocToFirestore('exercises_catalog', newEx);
      setCatalogSyncError(null);
      showToast(`Exercício "${newEx.name}" salvo no Firestore!`);
    } catch (err: any) {
      setCatalogSyncError(err?.message || 'Erro ao salvar exercício no Firestore.');
    }
  };

  const handleSaveEditExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExercise || !editName.trim()) return;

    const updatedEx: ExerciseCatalogItem = {
      ...editingExercise,
      name: editName.trim(),
      muscleGroup: editMuscle,
      equipment: editEquipment,
      difficulty: editDifficulty,
      primaryMuscle: editMuscle,
      instructions: editInstructions ? editInstructions.split('\n').filter(Boolean) : editingExercise.instructions,
      videoUrl: editVideoUrl.trim() || undefined
    };

    persistOverrideLocally(prev => [updatedEx, ...prev.filter(item => item.id !== updatedEx.id)]);
    setShowEditModal(false);
    setEditingExercise(null);
    setPreviewExercise(updatedEx);

    try {
      await saveDocToFirestore('exercises_catalog', updatedEx);
      setCatalogSyncError(null);
      showToast(`Exercício "${updatedEx.name}" atualizado no banco de dados!`);
    } catch (err: any) {
      setCatalogSyncError(err?.message || 'Erro ao atualizar exercício no Firestore.');
    }
  };

  const handleDeleteExercise = async (ex: ExerciseCatalogItem) => {
    setConfirmDeleteId(null);
    if (ex.isCustom) {
      persistOverrideLocally(prev => prev.filter(item => item.id !== ex.id));
      try {
        await deleteDocFromFirestore('exercises_catalog', ex.id);
        setCatalogSyncError(null);
        showToast(`Exercício "${ex.name}" excluído do banco de dados.`);
      } catch (err: any) {
        setCatalogSyncError(err?.message || 'Erro ao excluir exercício no Firestore.');
      }
    } else {
      const tombstone: PersistedExerciseItem = { ...ex, isDeleted: true };
      persistOverrideLocally(prev => [tombstone, ...prev.filter(item => item.id !== ex.id)]);
      try {
        await saveDocToFirestore('exercises_catalog', tombstone);
        setCatalogSyncError(null);
        showToast(`Exercício "${ex.name}" removido do catálogo.`);
      } catch (err: any) {
        setCatalogSyncError(err?.message || 'Erro ao remover exercício no Firestore.');
      }
    }
  };

  return (
    <div className="space-y-4">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-slate-900 text-white px-5 py-3 text-xs font-bold shadow-2xl border border-slate-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {catalogSyncError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span><strong>Falha de sincronização no Catálogo:</strong> {typeof catalogSyncError === 'string' ? catalogSyncError : String(catalogSyncError)}</span>
        </div>
      )}

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
                {mergedCatalog.length.toLocaleString('pt-BR')} Exercícios
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
                        {confirmDeleteId === ex.id ? (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1"
                          >
                            <button
                              type="button"
                              onClick={() => handleDeleteExercise(ex)}
                              className="text-[10px] font-bold text-rose-700 hover:underline cursor-pointer px-1"
                            >
                              Confirmar
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer px-1"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewExercise(ex);
                                setEditingExercise(ex);
                                setEditName(ex.name);
                                setEditMuscle(ex.muscleGroup as any);
                                setEditEquipment(ex.equipment as any);
                                setEditDifficulty(ex.difficulty);
                                setEditInstructions(ex.instructions.join('\n'));
                                setEditVideoUrl(ex.videoUrl || '');
                                setShowEditModal(true);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                              title="Editar Exercício"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                              <span className="hidden sm:inline text-[11px]">Editar</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDeleteId(ex.id);
                              }}
                              className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center shadow-2xs cursor-pointer"
                              title="Excluir Exercício"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {onSelectExercise && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectExercise(ex);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
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

      {/* Modal Custom Exercise (New) */}
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

      {/* Modal Edit Exercise (Specific Exercise Configuration) */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Configurar / Editar Exercício: <span className="text-blue-600">{editingExercise?.name}</span>
              </h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditExercise} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome do Exercício *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-hidden font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Grupo Muscular
                  </label>
                  <select
                    value={editMuscle}
                    onChange={(e) => setEditMuscle(e.target.value as any)}
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
                    value={editEquipment}
                    onChange={(e) => setEditEquipment(e.target.value as any)}
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
                  Link do Vídeo / YouTube
                </label>
                <input
                  type="url"
                  value={editVideoUrl}
                  onChange={(e) => setEditVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Instruções de Execução (uma por linha)
                </label>
                <textarea
                  rows={4}
                  value={editInstructions}
                  onChange={(e) => setEditInstructions(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs"
                >
                  Salvar Alterações do Exercício
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
