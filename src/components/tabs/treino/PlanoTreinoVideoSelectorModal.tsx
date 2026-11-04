import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Video, 
  ExternalLink, 
  Check, 
  Dumbbell, 
  X, 
  Sparkles, 
  PlayCircle 
} from 'lucide-react';
import { ExerciseCatalogItem, MuscleGroup } from '../../../types';
import { EXERCISE_CATALOG } from './exerciseDatabase';

interface PlanoTreinoVideoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetActivityTitle: string;
  onSelectVideo: (exercise: ExerciseCatalogItem) => void;
}

const CATEGORIES_LIST: { id: MuscleGroup | 'Todos'; label: string }[] = [
  { id: 'Todos', label: 'Todos os Exercícios' },
  { id: 'Futebol', label: '⚽ FUTEBOL' },
  { id: 'Funcional', label: 'Funcional & Cross' },
  { id: 'Cardio', label: 'Cárdio & Agilidade' },
  { id: 'Pernas', label: 'Pernas / Membros Inferiores' },
  { id: 'Peito', label: 'Peitoral' },
  { id: 'Costas', label: 'Dorsais' },
  { id: 'Ombros', label: 'Ombros' },
  { id: 'Abdômen', label: 'Core & Abdômen' },
  { id: 'Alongamento', label: 'Mobilidade & Volta à Calma' }
];

export const PlanoTreinoVideoSelectorModal: React.FC<PlanoTreinoVideoSelectorModalProps> = ({
  isOpen,
  onClose,
  targetActivityTitle,
  onSelectVideo
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MuscleGroup | 'Todos'>('Todos');

  // Filtra exercícios que possuem videoUrl ou podem ser demonstrados
  const filteredExercises = useMemo(() => {
    return EXERCISE_CATALOG.filter(ex => {
      const matchesSearch = 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.primaryMuscle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.equipment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || ex.muscleGroup === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Catálogo de Exercícios & Vídeos
              </h3>
              <p className="text-xs text-slate-300">
                Selecione um exercício cadastrado para anexar o vídeo a: <strong>{targetActivityTitle}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar exercício por nome, músculo principal ou equipamento..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-sidebar-scrollbar">
            {CATEGORIES_LIST.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-blue-800 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Exercises List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5 custom-main-scrollbar">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Nenhum exercício encontrado com esses filtros.
            </div>
          ) : (
            filteredExercises.map((ex) => {
              const video = ex.videoUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name)}`;
              return (
                <div
                  key={ex.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                        {ex.name}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                        {ex.muscleGroup}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {ex.equipment}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {ex.instructions?.[0] || ex.primaryMuscle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Abrir prévia do vídeo em nova aba do navegador"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ver Vídeo</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectVideo({
                          ...ex,
                          videoUrl: video
                        });
                        onClose();
                      }}
                      className="px-4 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Anexar ao Plano</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Exercícios com links sincronizados do Catálogo</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
