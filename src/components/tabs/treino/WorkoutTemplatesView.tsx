import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  BookOpen, 
  Dumbbell, 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  ChevronDown, 
  CheckCircle2, 
  User, 
  Calendar,
  X,
  ArrowRight,
  Check,
  Tag,
  SlidersHorizontal
} from 'lucide-react';
import { WorkoutTemplate, WorkoutSplit } from '../../../types';
import { WORKOUT_TEMPLATES } from './exerciseDatabase';
import { 
  getCustomTemplates, 
  saveCustomTemplate, 
  deleteCustomTemplate 
} from './templateStorage';
import WorkoutTemplateEditorModal from './WorkoutTemplateEditorModal';

interface WorkoutTemplatesViewProps {
  onApplyTemplate: (template: WorkoutTemplate) => void;
}

export type TemplateFilterOption = 'all' | 'platform' | 'custom';

export const TEMPLATE_CATEGORIES = [
  'Hipertrofia',
  'Emagrecimento',
  'Força',
  'Funcional',
  'Feminino',
  'Masculino',
  'Reabilitação',
  'Iniciante',
  'Intermediário',
  'Avançado'
] as const;

export const WorkoutTemplatesView: React.FC<WorkoutTemplatesViewProps> = ({
  onApplyTemplate
}) => {
  // State for custom templates stored in localStorage
  const [customTemplates, setCustomTemplates] = useState<WorkoutTemplate[]>(() => getCustomTemplates());
  
  // Filter state requested by user:
  // 'all' = Todas as opções
  // 'platform' = Apenas os templates padrões da plataforma
  // 'custom' = Templates criados por ele (pelo profissional)
  const [filterOption, setFilterOption] = useState<TemplateFilterOption>('all');
  
  // Auxiliary filters
  const [searchQuery, setSearchQuery] = useState('');
  
  // Multi-select categories filter
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [categoryMatchMode, setCategoryMatchMode] = useState<'any' | 'all'>('any');
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<WorkoutTemplate | null>(null);
  const [activePreviewSplit, setActivePreviewSplit] = useState(0);

  // Close category dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sync custom templates from localStorage and custom events
  useEffect(() => {
    const handleUpdate = () => {
      setCustomTemplates(getCustomTemplates());
    };
    window.addEventListener('gl_pro_fit_templates_updated', handleUpdate);
    return () => {
      window.removeEventListener('gl_pro_fit_templates_updated', handleUpdate);
    };
  }, []);

  // Platform templates tagged with isCustom: false
  const platformTemplates: WorkoutTemplate[] = useMemo(() => {
    return WORKOUT_TEMPLATES.map(tpl => ({
      ...tpl,
      isCustom: false,
      author: 'GL PRO FIT (Padrão Oficial)'
    }));
  }, []);

  // Normalization helper for smart category/keyword matching
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

  // Base list for counting available templates in each category
  const baseListForCounts = useMemo(() => {
    if (filterOption === 'all') return [...customTemplates, ...platformTemplates];
    if (filterOption === 'platform') return platformTemplates;
    return customTemplates;
  }, [filterOption, customTemplates, platformTemplates]);

  const getCategoryCount = (cat: string) => {
    return baseListForCounts.filter(tpl => templateMatchesCategory(tpl, cat)).length;
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSelectAllCategories = () => {
    setSelectedCategories([...TEMPLATE_CATEGORIES]);
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
  };

  const filteredDropdownCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return TEMPLATE_CATEGORIES;
    const q = normalize(categorySearchQuery);
    return TEMPLATE_CATEGORIES.filter(cat => normalize(cat).includes(q));
  }, [categorySearchQuery]);

  // Combined list based on filterOption & multi-category selection & search
  const filteredTemplates = useMemo(() => {
    let list: WorkoutTemplate[] = [];

    if (filterOption === 'all') {
      // Todas as opções: modelos do profissional primeiro, seguidos dos padrões da plataforma
      list = [...customTemplates, ...platformTemplates];
    } else if (filterOption === 'platform') {
      // Apenas os templates padrões da plataforma
      list = platformTemplates;
    } else if (filterOption === 'custom') {
      // Apenas os templates criados por ele
      list = customTemplates;
    }

    // Apply multiple category selection
    if (selectedCategories.length > 0) {
      if (categoryMatchMode === 'any') {
        list = list.filter(tpl =>
          selectedCategories.some(cat => templateMatchesCategory(tpl, cat))
        );
      } else {
        list = list.filter(tpl =>
          selectedCategories.every(cat => templateMatchesCategory(tpl, cat))
        );
      }
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(tpl => 
        tpl.title.toLowerCase().includes(q) ||
        tpl.objective.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q) ||
        tpl.splits.some(s => 
          s.name.toLowerCase().includes(q) || 
          s.exercises.some(e => e.name.toLowerCase().includes(q) || e.muscleGroup.toLowerCase().includes(q))
        )
      );
    }

    return list;
  }, [filterOption, customTemplates, platformTemplates, selectedCategories, categoryMatchMode, searchQuery]);

  // Handle saving new or edited custom template
  const handleSaveTemplate = (savedTemplate: WorkoutTemplate) => {
    const updated = saveCustomTemplate(savedTemplate);
    setCustomTemplates(updated);
    setIsEditorModalOpen(false);
    setEditingTemplate(null);
  };

  // Handle delete custom template
  const handleDeleteTemplate = (tpl: WorkoutTemplate) => {
    if (confirm(`Tem certeza que deseja excluir o modelo padrão "${tpl.title}"?`)) {
      const updated = deleteCustomTemplate(tpl.id);
      setCustomTemplates(updated);
      if (previewTemplate?.id === tpl.id) {
        setPreviewTemplate(null);
      }
    }
  };

  // Handle duplicate platform template to custom
  const handleDuplicateToCustom = (tpl: WorkoutTemplate) => {
    const cloned: WorkoutTemplate = {
      ...JSON.parse(JSON.stringify(tpl)),
      id: `tpl-custom-${Date.now()}`,
      title: `${tpl.title} (Personalizado)`,
      isCustom: true,
      author: 'Prof. Gianluca Marinho (CREF 112001-G/SP)',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setEditingTemplate(cloned);
    setIsEditorModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Modelos de Treino Padrão & Templates
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {customTemplates.length + platformTemplates.length} Modelos Disponíveis
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Aplique rotinas completas com periodização estruturada em 1 clique para qualquer aluno, ou crie seus próprios modelos de referência técnica com a sua metodologia exclusiva.
            </p>
          </div>

          {/* Action Button: Criar Meu Próprio Modelo Padrão */}
          <button
            type="button"
            onClick={() => {
              setEditingTemplate(null);
              setIsEditorModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-98 shrink-0"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Criar Meu Modelo Padrão</span>
          </button>
        </div>

        {/* Filter Section: Plataforma vs Criados por Mim vs Todas as Opções */}
        <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Main Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80 overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilterOption('all')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterOption === 'all'
                  ? 'bg-white text-blue-600 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Todas as Opções</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filterOption === 'all' ? 'bg-blue-50 text-blue-700 font-extrabold' : 'bg-slate-200 text-slate-600'
              }`}>
                {customTemplates.length + platformTemplates.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterOption('platform')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterOption === 'platform'
                  ? 'bg-white text-blue-600 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Padrões da Plataforma</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filterOption === 'platform' ? 'bg-blue-50 text-blue-700 font-extrabold' : 'bg-slate-200 text-slate-600'
              }`}>
                {platformTemplates.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilterOption('custom')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterOption === 'custom'
                  ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Criados por Mim</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filterOption === 'custom' ? 'bg-emerald-100 text-emerald-800 font-extrabold' : 'bg-slate-200 text-slate-600'
              }`}>
                {customTemplates.length}
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar modelos ou exercícios..."
              className="w-full rounded-xl pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Multi-Select Dropdown & Active Filter Chips */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
          
          {/* Dropdown Button with Popover */}
          <div className="relative inline-block shrink-0" ref={categoryDropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(prev => !prev)}
              className={`flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedCategories.length > 0
                  ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-xs ring-2 ring-blue-500/10'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2">
                <Filter className={`w-3.5 h-3.5 ${selectedCategories.length > 0 ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>
                  {selectedCategories.length === 0
                    ? 'Filtrar por Categoria (Todas)'
                    : selectedCategories.length === 1
                    ? `Categoria: ${selectedCategories[0]}`
                    : `Categorias Selecionadas (${selectedCategories.length})`}
                </span>
                {selectedCategories.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-blue-600 text-white">
                    {selectedCategories.length}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1 ml-1 text-slate-400">
                {selectedCategories.length > 0 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearCategories();
                    }}
                    className="p-0.5 rounded hover:bg-blue-200/60 text-blue-700 transition-colors cursor-pointer"
                    title="Limpar seleção"
                  >
                    <X className="w-3.5 h-3.5" />
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
              </div>
            </button>

            {/* Dropdown Popover */}
            {isCategoryDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-xl z-40 p-3 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                {/* Popover Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-bold text-xs text-slate-900">Categorias de Treino</span>
                    {selectedCategories.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700">
                        {selectedCategories.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={handleSelectAllCategories}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      Todas
                    </button>
                    <span className="text-slate-200">•</span>
                    <button
                      type="button"
                      onClick={handleClearCategories}
                      className="text-slate-500 hover:text-rose-600 font-semibold"
                    >
                      Limpar
                    </button>
                  </div>
                </div>

                {/* Quick Search inside Dropdown */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={categorySearchQuery}
                    onChange={(e) => setCategorySearchQuery(e.target.value)}
                    placeholder="Buscar categoria..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                  {categorySearchQuery && (
                    <button
                      type="button"
                      onClick={() => setCategorySearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Categories Checkbox List */}
                <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                  {filteredDropdownCategories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    const count = getCategoryCount(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all text-left ${
                          isSelected
                            ? 'bg-blue-50/90 text-blue-900 border border-blue-200/80'
                            : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                              : 'bg-white border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{cat}</span>
                        </div>

                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? 'bg-blue-200/70 text-blue-800'
                            : count > 0 ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-400'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                  {filteredDropdownCategories.length === 0 && (
                    <div className="p-3 text-center text-xs text-slate-400">
                      Nenhuma categoria encontrada.
                    </div>
                  )}
                </div>

                {/* Popover Footer: Mode Switch & Close */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span className="font-semibold">Critério:</span>
                    <button
                      type="button"
                      onClick={() => setCategoryMatchMode(prev => prev === 'any' ? 'all' : 'any')}
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold border transition-colors ${
                        categoryMatchMode === 'any'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-amber-100 text-amber-900 border-amber-200'
                      }`}
                      title={categoryMatchMode === 'any' ? 'Mostra modelos que atendem a qualquer categoria selecionada' : 'Mostra apenas modelos que atendem a todas as categorias selecionadas simultaneamente'}
                    >
                      {categoryMatchMode === 'any' ? 'Qualquer (OU)' : 'Todas (E)'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(false)}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Category Tag Chips */}
          <div className="flex-1 flex items-center gap-1.5 flex-wrap overflow-x-auto text-xs">
            {selectedCategories.length === 0 ? (
              <span className="text-[11px] text-slate-400 italic">
                Exibindo todas as categorias de treino
              </span>
            ) : (
              <>
                <span className="text-[11px] font-bold text-slate-400 mr-0.5 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-blue-600" /> Filtros:
                </span>
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 animate-in fade-in"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className="p-0.5 rounded-full hover:bg-blue-200/70 text-blue-600 hover:text-blue-900"
                      title={`Remover filtro ${cat}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={handleClearCategories}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline ml-1"
                >
                  Limpar seleção ({selectedCategories.length})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            {filterOption === 'custom' ? (
              <Sparkles className="w-8 h-8 text-emerald-500" />
            ) : (
              <BookOpen className="w-8 h-8 text-blue-500" />
            )}
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              {filterOption === 'custom' 
                ? 'Nenhum modelo personalizado encontrado'
                : 'Nenhum modelo de treino encontrado com esses filtros'
              }
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {filterOption === 'custom'
                ? 'Você ainda não possui modelos criados com esse filtro. Comece a criar os seus próprios modelos padrão para aplicar a qualquer aluno com agilidade.'
                : 'Tente alterar os termos de busca ou selecionar outras categorias no filtro suspenso acima.'
              }
            </p>
          </div>

          {filterOption === 'custom' ? (
            <button
              type="button"
              onClick={() => {
                setEditingTemplate(null);
                setIsEditorModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-500 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Meu Primeiro Modelo Padrão</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setFilterOption('all');
                setSelectedCategories([]);
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              Limpar Todos os Filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTemplates.map((tpl) => {
            const isCustom = tpl.isCustom;
            return (
              <div
                key={tpl.id}
                className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between gap-4 shadow-2xs hover:shadow-md ${
                  isCustom 
                    ? 'border-emerald-200/90 hover:border-emerald-400' 
                    : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                <div>
                  {/* Origin Badge & Category Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      {isCustom ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          Criado por Você
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          <ShieldCheck className="w-3 h-3 text-blue-600" />
                          Padrão da Plataforma
                        </span>
                      )}

                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {tpl.category}
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      Nível: <strong className="text-slate-800">{tpl.level}</strong>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 mt-3 leading-snug">
                    {tpl.title}
                  </h3>

                  {/* Author / Date info */}
                  {tpl.author && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                      <User className="w-3 h-3" />
                      <span>{tpl.author}</span>
                      {tpl.createdAt && (
                        <>
                          <span>•</span>
                          <Calendar className="w-3 h-3" />
                          <span>{tpl.createdAt}</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Objective & Description */}
                  <div className="mt-2 text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-slate-800">
                      <strong className="text-blue-700 font-bold">Objetivo: </strong>
                      {tpl.objective}
                    </p>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      {tpl.description}
                    </p>
                  </div>

                  {/* Splits Preview */}
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 text-[11px]">
                        Divisões incluídas ({tpl.splits.length}):
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewTemplate(tpl);
                          setActivePreviewSplit(0);
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ver Exercícios</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {tpl.splits.map((s, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px]"
                        >
                          <span className="font-bold text-slate-800 truncate mr-1">{s.name}</span>
                          <span className="shrink-0 text-slate-500 font-medium bg-white px-1.5 py-0.2 rounded border border-slate-200">
                            {s.exercises.length} ex
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <button
                    type="button"
                    onClick={() => onApplyTemplate(tpl)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Aplicar Este Modelo a um Aluno</span>
                  </button>

                  <div className="flex items-center justify-between gap-2 text-xs">
                    {isCustom ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTemplate(tpl);
                            setIsEditorModalOpen(true);
                          }}
                          className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Editar Modelo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteTemplate(tpl)}
                          className="py-1.5 px-3 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          title="Excluir este modelo"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Excluir</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDuplicateToCustom(tpl)}
                        className="w-full py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        title="Criar uma cópia editável deste modelo padrão para você"
                      >
                        <Copy className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Duplicar como Meu Modelo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Template Editor Modal for Professional Custom Templates */}
      <WorkoutTemplateEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => {
          setIsEditorModalOpen(false);
          setEditingTemplate(null);
        }}
        onSave={handleSaveTemplate}
        initialTemplate={editingTemplate}
      />

      {/* Quick Preview Modal for template splits and exercises */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Preview Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    previewTemplate.isCustom ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                  }`}>
                    {previewTemplate.isCustom ? 'Modelo Personalizado' : 'Modelo da Plataforma'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {previewTemplate.category} • {previewTemplate.level}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {previewTemplate.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split Switcher Tabs */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
              {previewTemplate.splits.map((split, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => setActivePreviewSplit(sIdx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activePreviewSplit === sIdx
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{split.name}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activePreviewSplit === sIdx ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {split.exercises.length}
                  </span>
                </button>
              ))}
            </div>

            {/* Split Exercises Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {previewTemplate.splits[activePreviewSplit] && (
                <div className="space-y-2">
                  <div className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">
                    Exercícios prescritos em {previewTemplate.splits[activePreviewSplit].name}:
                  </div>

                  {previewTemplate.splits[activePreviewSplit].exercises.map((ex, exIdx) => (
                    <div 
                      key={ex.id || exIdx}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {exIdx + 1}. {ex.name}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                          <span className="font-semibold text-blue-700">{ex.muscleGroup}</span>
                          {ex.equipment && <span>• {ex.equipment}</span>}
                          {ex.method && (
                            <span className="font-medium bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">
                              {ex.method}
                            </span>
                          )}
                        </div>
                        {ex.notes && (
                          <div className="text-[11px] text-slate-600 italic">
                            Obs: {ex.notes}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 bg-slate-50 p-2 rounded-lg border border-slate-200 text-center text-xs">
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Séries</div>
                          <div className="font-black text-slate-800">{ex.sets}</div>
                        </div>
                        <div className="w-px h-6 bg-slate-200" />
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Reps</div>
                          <div className="font-black text-slate-800">{ex.reps}</div>
                        </div>
                        <div className="w-px h-6 bg-slate-200" />
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Carga</div>
                          <div className="font-black text-slate-800">{ex.weightKg || 0} kg</div>
                        </div>
                        <div className="w-px h-6 bg-slate-200" />
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">Desc.</div>
                          <div className="font-black text-slate-800">{ex.restSec || 60}s</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100"
              >
                Fechar Visualização
              </button>

              <button
                type="button"
                onClick={() => {
                  onApplyTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Aplicar a um Aluno</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutTemplatesView;
