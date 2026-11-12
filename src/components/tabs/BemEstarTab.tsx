import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flame,
  Droplets,
  Users,
  Save,
  X,
  Filter,
  Plus,
  Search,
  Settings,
  ChevronDown,
  CheckSquare,
  Square,
  Trash2,
  Edit3,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { Student, WellnessCheckin, PainPoint, BemEstarSubTab, DEFAULT_STUDENT_FALLBACK } from '../../types';
import { CheckinFormView } from './bem_estar/CheckinFormView';
import { AnaliseView } from './bem_estar/AnaliseView';

interface BemEstarTabProps {
  students: Student[];
  activeSubTab?: BemEstarSubTab;
  onSubTabChange?: (subTab: BemEstarSubTab) => void;
  selectedStudentId?: string;
  onSelectStudentId?: (id: string) => void;
}

export const INITIAL_WELLNESS_CHECKINS: WellnessCheckin[] = [];

export interface ElencoGroup {
  id: string;
  name: string;
  category: string;
  color: string;
  description?: string;
  studentIds: string[];
}

export const DEFAULT_ELENCO_GROUPS: ElencoGroup[] = [
  {
    id: 'grp-competicao',
    name: 'Elenco de Competição (Principal)',
    category: 'Competição',
    color: 'blue',
    description: 'Equipe principal de atletas federados para competições e torneios',
    studentIds: []
  },
  {
    id: 'grp-sub20',
    name: 'Categoria Sub-20 (Competição)',
    category: 'Competição',
    color: 'emerald',
    description: 'Elenco de atletas sub-20 em preparação competitiva e transição',
    studentIds: []
  },
  {
    id: 'grp-sub17',
    name: 'Categoria Sub-17 (Base)',
    category: 'Base',
    color: 'amber',
    description: 'Categoria de formação atlética e desenvolvimento motor de base',
    studentIds: []
  },
  {
    id: 'grp-alta-performance',
    name: 'Atletas de Alta Performance',
    category: 'Performance',
    color: 'purple',
    description: 'Atletas sob monitoramento de carga rigoroso com protocolo de prontidão diário',
    studentIds: []
  },
  {
    id: 'grp-personal-vip',
    name: 'Grupo Personal & VIP',
    category: 'Personal',
    color: 'rose',
    description: 'Alunos de atendimento personalizado e acompanhamento individual',
    studentIds: []
  },
  {
    id: 'grp-turma-manha',
    name: 'Turma da Manhã',
    category: 'Horário',
    color: 'sky',
    description: 'Alunos que realizam treinos e check-in no período matutino',
    studentIds: []
  }
];

export const BemEstarTab: React.FC<BemEstarTabProps> = ({
  students,
  activeSubTab: propSubTab,
  onSubTabChange,
  selectedStudentId: propStudentId,
  onSelectStudentId
}) => {
  const [internalSubTab, setInternalSubTab] = useState<BemEstarSubTab>(propSubTab || 'checkin');
  const rawSubTab = propSubTab || internalSubTab;
  // Sanitiza a subaba ativa para evitar que subabas removidas apareçam
  const currentSubTab: BemEstarSubTab = 
    (rawSubTab === 'checkin' || rawSubTab === 'analise' || rawSubTab === 'elenco_hooper' || rawSubTab === 'ciclo_menstrual')
      ? rawSubTab
      : 'checkin';

  const [internalStudentId, setInternalStudentId] = useState<string>(propStudentId || students[0]?.id || DEFAULT_STUDENT_FALLBACK.id);
  const activeStudentId = propStudentId || internalStudentId;

  const [checkins, setCheckins] = useState<WellnessCheckin[]>(INITIAL_WELLNESS_CHECKINS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // =========================================================================
  // ESTADO DE GRUPOS & CATEGORIAS DO ELENCO (MATRIZ DO ELENCO)
  // =========================================================================
  const [elencoGroups, setElencoGroups] = useState<ElencoGroup[]>(() => {
    try {
      const saved = localStorage.getItem('glfit_elenco_groups');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Erro ao carregar grupos do elenco:', e);
    }
    return DEFAULT_ELENCO_GROUPS;
  });

  const [selectedGroupId, setSelectedGroupId] = useState<string>('todos');
  const [selectedReadinessFilter, setSelectedReadinessFilter] = useState<'todos' | 'otimo' | 'moderado' | 'alerta'>('todos');
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState<'todos' | 'manha' | 'tarde' | 'noite'>('todos');
  const [elencoSearchQuery, setElencoSearchQuery] = useState<string>('');
  const [showGroupFilterDropdown, setShowGroupFilterDropdown] = useState<boolean>(false);
  const [showGroupConfigModal, setShowGroupConfigModal] = useState<boolean>(false);

  // Estados do modal de pré-configuração de novos grupos
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newGroupCategory, setNewGroupCategory] = useState<string>('Competição');
  const [newGroupColor, setNewGroupColor] = useState<string>('blue');
  const [newGroupDescription, setNewGroupDescription] = useState<string>('');
  const [newGroupSelectedStudentIds, setNewGroupSelectedStudentIds] = useState<string[]>([]);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  const activeStudent = useMemo(() => {
    return (students && students.find(s => s.id === activeStudentId)) || (students && students[0]) || DEFAULT_STUDENT_FALLBACK;
  }, [students, activeStudentId]);

  const studentCheckins = useMemo(() => {
    return checkins
      .filter(c => c.studentId === activeStudentId)
      .sort((a, b) => new Date(`${b.date}`).getTime() - new Date(`${a.date}`).getTime());
  }, [checkins, activeStudentId]);

  const latestStudentCheckin = studentCheckins[0] || null;

  const handleSubTabChange = (tab: BemEstarSubTab) => {
    setInternalSubTab(tab);
    onSubTabChange?.(tab);
  };

  const handleStudentSelect = (id: string) => {
    setInternalStudentId(id);
    onSelectStudentId?.(id);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveNewCheckin = (newCheckin: WellnessCheckin) => {
    setCheckins(prev => [newCheckin, ...prev]);
    showToast(`Check-in de ${newCheckin.studentName} salvo com sucesso!`);
    handleSubTabChange('analise');
  };

  // Salvar grupos no localStorage
  const saveElencoGroups = (updatedGroups: ElencoGroup[]) => {
    setElencoGroups(updatedGroups);
    try {
      localStorage.setItem('glfit_elenco_groups', JSON.stringify(updatedGroups));
    } catch (e) {
      console.warn('Erro ao salvar grupos no localStorage:', e);
    }
  };

  // Criar ou atualizar grupo
  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      showToast('Por favor, informe o nome do grupo.');
      return;
    }

    if (editingGroupId) {
      // Editar
      const updated = elencoGroups.map(g => {
        if (g.id === editingGroupId) {
          return {
            ...g,
            name: newGroupName.trim(),
            category: newGroupCategory,
            color: newGroupColor,
            description: newGroupDescription.trim(),
            studentIds: newGroupSelectedStudentIds
          };
        }
        return g;
      });
      saveElencoGroups(updated);
      showToast(`Grupo "${newGroupName}" atualizado com sucesso!`);
    } else {
      // Criar novo
      const newGroup: ElencoGroup = {
        id: `grp-${Date.now()}`,
        name: newGroupName.trim(),
        category: newGroupCategory,
        color: newGroupColor,
        description: newGroupDescription.trim(),
        studentIds: newGroupSelectedStudentIds
      };
      saveElencoGroups([...elencoGroups, newGroup]);
      showToast(`Grupo "${newGroupName}" criado com sucesso!`);
    }

    // Reset form
    setNewGroupName('');
    setNewGroupDescription('');
    setNewGroupSelectedStudentIds([]);
    setEditingGroupId(null);
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    const updated = elencoGroups.filter(g => g.id !== groupId);
    saveElencoGroups(updated);
    if (selectedGroupId === groupId) {
      setSelectedGroupId('todos');
    }
    showToast(`Grupo "${groupName}" removido.`);
  };

  const handleStartEditGroup = (group: ElencoGroup) => {
    setEditingGroupId(group.id);
    setNewGroupName(group.name);
    setNewGroupCategory(group.category);
    setNewGroupColor(group.color);
    setNewGroupDescription(group.description || '');
    setNewGroupSelectedStudentIds(group.studentIds);
  };

  // Obter cores do grupo
  const getBadgeStyle = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'emerald': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'amber': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'purple': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rose': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'sky': return 'bg-sky-100 text-sky-800 border-sky-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Filtragem dos checkins na Matriz do Elenco
  const filteredElencoCheckins = useMemo(() => {
    const activeGroup = elencoGroups.find(g => g.id === selectedGroupId);

    return checkins.filter(chk => {
      // Filtro por grupo selecionado
      if (selectedGroupId !== 'todos' && activeGroup) {
        if (!activeGroup.studentIds.includes(chk.studentId)) return false;
      }

      // Filtro por status de prontidão
      if (selectedReadinessFilter !== 'todos' && chk.readinessStatus !== selectedReadinessFilter) {
        return false;
      }

      // Filtro por período
      if (selectedPeriodFilter !== 'todos' && chk.period !== selectedPeriodFilter) {
        return false;
      }

      // Filtro por busca de texto (aluno)
      if (elencoSearchQuery.trim()) {
        const query = elencoSearchQuery.toLowerCase();
        if (!chk.studentName.toLowerCase().includes(query)) return false;
      }

      return true;
    });
  }, [checkins, selectedGroupId, elencoGroups, selectedReadinessFilter, selectedPeriodFilter, elencoSearchQuery]);

  // Estatísticas do grupo filtrado
  const squadStats = useMemo(() => {
    const count = filteredElencoCheckins.length;
    if (count === 0) {
      return { total: 0, avgScore: 0, otimoCount: 0, moderadoCount: 0, alertaCount: 0 };
    }
    const totalScore = filteredElencoCheckins.reduce((acc, c) => acc + c.readinessScore, 0);
    const avgScore = Math.round(totalScore / count);
    const otimoCount = filteredElencoCheckins.filter(c => c.readinessStatus === 'otimo').length;
    const moderadoCount = filteredElencoCheckins.filter(c => c.readinessStatus === 'moderado').length;
    const alertaCount = filteredElencoCheckins.filter(c => c.readinessStatus === 'alerta').length;

    return { total: count, avgScore, otimoCount, moderadoCount, alertaCount };
  }, [filteredElencoCheckins]);

  const activeSelectedGroup = elencoGroups.find(g => g.id === selectedGroupId);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* SUBTAB 1: CHECK-IN (COM BONECO EM CARD SOBREPOSTO AO CLICAR EM 'EDITAR NO MAPA') */}
      {currentSubTab === 'checkin' && (
        <CheckinFormView
          students={students}
          selectedStudentId={activeStudentId}
          onSelectStudentId={handleStudentSelect}
          onSaveCheckin={handleSaveNewCheckin}
          mappedPainPoints={latestStudentCheckin?.painPoints || []}
        />
      )}

      {/* SUBTAB 2: ANÁLISE (CARDS RÁPIDOS, MULTI-FILTROS EM LISTAS SUSPENSAS COM CHECKBOXES, CALENDÁRIO) */}
      {currentSubTab === 'analise' && (
        <AnaliseView
          students={students}
          checkins={checkins}
          selectedStudentId={activeStudentId}
          onSelectStudentId={handleStudentSelect}
          onNavigateToCheckin={() => handleSubTabChange('checkin')}
          onNavigateToPainMap={() => handleSubTabChange('checkin')}
        />
      )}

      {/* SUBTAB 3: MATRIZ DO ELENCO COM FILTRO DE GRUPO, CATEGORIA E PRÉ-CONFIGURAÇÃO */}
      {currentSubTab === 'elenco_hooper' && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-2xs p-4 sm:p-6 space-y-6 animate-in fade-in">
          
          {/* Cabeçalho & Botão de Filtro de Grupo */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Semáforo de Prontidão • Hoopers & Carga
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  Data: {new Date().toLocaleDateString('pt-BR')}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mt-1">
                <Users className="w-5 h-5 text-blue-700" />
                Matriz de Prontidão do Elenco & Alunos
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Filtre por elencos de competição, categorias de base ou grupos customizados pré-configurados.
              </p>
            </div>

            {/* Controles de Filtro & Configuração */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Botão de Filtro de Grupo com Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowGroupFilterDropdown(prev => !prev)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer shadow-2xs ${
                    selectedGroupId !== 'todos'
                      ? 'bg-blue-700 text-white border-blue-800'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>
                    {selectedGroupId === 'todos'
                      ? 'Filtrar Grupo: Todos os Elencos'
                      : `Grupo: ${activeSelectedGroup?.name || 'Selecionado'}`}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showGroupFilterDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown de Seleção de Grupo */}
                {showGroupFilterDropdown && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowGroupFilterDropdown(false)} />
                    <div className="absolute right-0 mt-1.5 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2.5 z-40 space-y-1 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Selecione o Grupo / Categoria
                      </div>

                      {/* Opção Todos */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGroupId('todos');
                          setShowGroupFilterDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          selectedGroupId === 'todos'
                            ? 'bg-blue-50 text-blue-900 border border-blue-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-500" />
                          <span>Todos os Grupos & Categorias</span>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                          {checkins.length} atletas
                        </span>
                      </button>

                      {/* Lista de Grupos */}
                      <div className="max-h-60 overflow-y-auto space-y-1 pt-1 border-t border-slate-100">
                        {elencoGroups.map(group => {
                          const isSelected = selectedGroupId === group.id;
                          const athleteCount = group.studentIds.length;

                          return (
                            <button
                              key={group.id}
                              type="button"
                              onClick={() => {
                                setSelectedGroupId(group.id);
                                setShowGroupFilterDropdown(false);
                              }}
                              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50 text-blue-950 font-black border border-blue-200'
                                  : 'hover:bg-slate-50 text-slate-800 font-bold'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                  group.color === 'blue' ? 'bg-blue-600' :
                                  group.color === 'emerald' ? 'bg-emerald-600' :
                                  group.color === 'amber' ? 'bg-amber-600' :
                                  group.color === 'purple' ? 'bg-purple-600' :
                                  group.color === 'rose' ? 'bg-rose-600' : 'bg-sky-600'
                                }`} />
                                <div className="truncate text-left">
                                  <div className="truncate">{group.name}</div>
                                  <span className="text-[10px] text-slate-400 block font-normal">
                                    {group.category}
                                  </span>
                                </div>
                              </div>

                              <span className={`text-[10px] px-2 py-0.5 rounded-md border shrink-0 font-bold ${getBadgeStyle(group.color)}`}>
                                {athleteCount} atleta{athleteCount !== 1 ? 's' : ''}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Botão de Pré-configuração no Rodapé do Dropdown */}
                      <div className="pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setShowGroupFilterDropdown(false);
                            setShowGroupConfigModal(true);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-600" />
                          <span>Pré-configurar / Gerenciar Grupos</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Botão Abrir Gerenciador de Grupos */}
              <button
                type="button"
                onClick={() => setShowGroupConfigModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition-colors cursor-pointer shadow-2xs"
                title="Pré-configurar novas categorias, elencos de competição e grupos de atletas"
              >
                <Settings className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Pré-configurar Grupos</span>
              </button>
            </div>
          </div>

          {/* Barra de Filtros Secundários: Status, Período e Busca */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            {/* Filtros de Status (Semáforo) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-500 mr-1">Status:</span>
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'otimo', label: '🟢 Ótimo' },
                { id: 'moderado', label: '🟡 Moderado' },
                { id: 'alerta', label: '🔴 Alerta' }
              ].map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedReadinessFilter(st.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                    selectedReadinessFilter === st.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Busca Rápida de Aluno */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={elencoSearchQuery}
                onChange={(e) => setElencoSearchQuery(e.target.value)}
                placeholder="Buscar atleta no elenco..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Cards Rápidos de Síntese do Grupo Selecionado */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Atletas no Grupo</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">{squadStats.total}</div>
              <span className="text-[10px] text-slate-400">
                {selectedGroupId === 'todos' ? 'Elenco completo' : activeSelectedGroup?.name}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">Prontidão Média</span>
              <div className="text-xl font-black text-blue-900 mt-0.5">{squadStats.avgScore}%</div>
              <span className="text-[10px] text-blue-600 font-semibold">Índice Hooper médio</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Aptos / Ótimo</span>
              <div className="text-xl font-black text-emerald-900 mt-0.5">{squadStats.otimoCount}</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Prontidão elevada</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] font-bold text-rose-700 uppercase block">Atenção & Alerta</span>
              <div className="text-xl font-black text-rose-900 mt-0.5">{squadStats.alertaCount + squadStats.moderadoCount}</div>
              <span className="text-[10px] text-rose-600 font-semibold">Fadiga ou dor relatada</span>
            </div>
          </div>

          {/* Tabela da Matriz do Elenco */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-600 border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="p-3.5">Atleta / Aluno</th>
                  <th className="p-3.5 text-center">Grupo / Categoria</th>
                  <th className="p-3.5 text-center">Período</th>
                  <th className="p-3.5 text-center">Sono</th>
                  <th className="p-3.5 text-center">PSE Fadiga</th>
                  <th className="p-3.5 text-center">EVA Dor</th>
                  <th className="p-3.5 text-center">PSR Recuperação</th>
                  <th className="p-3.5 text-center">Prontidão</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredElencoCheckins.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Users className="w-8 h-8 text-slate-300 mx-auto" />
                        <div className="font-bold text-slate-700">Nenhum atleta encontrado para este filtro</div>
                        <p className="text-xs text-slate-400">
                          Tente redefinir o grupo selecionado ou clique no botão abaixo para adicionar atletas a este grupo.
                        </p>
                        <div className="pt-2 flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedGroupId('todos');
                              setSelectedReadinessFilter('todos');
                              setElencoSearchQuery('');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                          >
                            Limpar Filtros
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowGroupConfigModal(true)}
                            className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold cursor-pointer"
                          >
                            Configurar Grupos
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredElencoCheckins.map(chk => {
                    // Grupos aos quais o aluno pertence
                    const studentGroups = elencoGroups.filter(g => g.studentIds.includes(chk.studentId));

                    return (
                      <tr 
                        key={chk.id} 
                        className={`hover:bg-slate-50/80 transition-colors ${
                          chk.studentId === activeStudentId ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-black flex items-center justify-center text-xs shrink-0">
                              {chk.studentName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{chk.studentName}</div>
                              <div className="text-[10px] text-slate-400">{chk.date}</div>
                            </div>
                          </div>
                        </td>

                        {/* Badges de Grupos e Categorias */}
                        <td className="p-3.5 text-center">
                          {studentGroups.length > 0 ? (
                            <div className="flex flex-wrap gap-1 justify-center">
                              {studentGroups.map(sg => (
                                <span
                                  key={sg.id}
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${getBadgeStyle(sg.color)}`}
                                >
                                  {sg.name.split(' (')[0]}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Sem grupo</span>
                          )}
                        </td>

                        <td className="p-3.5 text-center capitalize font-bold text-slate-700">
                          {chk.period}
                        </td>
                        <td className="p-3.5 text-center font-bold text-indigo-700">
                          {chk.sleepQuality}/10 <span className="text-[10px] text-slate-400">({chk.sleepHours}h)</span>
                        </td>
                        <td className="p-3.5 text-center font-bold text-amber-700">
                          {chk.pse}/10
                        </td>
                        <td className="p-3.5 text-center font-bold text-rose-700">
                          {chk.eva}/10
                        </td>
                        <td className="p-3.5 text-center font-bold text-blue-700">
                          {chk.psr}/10
                        </td>
                        <td className="p-3.5 text-center font-black text-slate-900 text-sm">
                          {chk.readinessScore}%
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            chk.readinessStatus === 'otimo' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            chk.readinessStatus === 'moderado' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            {chk.readinessStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              handleStudentSelect(chk.studentId);
                              handleSubTabChange('analise');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 font-black text-xs cursor-pointer transition-colors"
                          >
                            Ver Análise
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* SUBTAB 4: CICLO MENSTRUAL & PERIODIZAÇÃO FEMININA */}
      {currentSubTab === 'ciclo_menstrual' && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-2xs p-4 sm:p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-rose-500" />
              Monitoramento do Ciclo Menstrual & Periodização Feminina
            </h3>
            <p className="text-xs text-slate-500">
              Alinhamento da periodização de treino com as 4 fases hormonais femininas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-emerald-800 uppercase flex items-center justify-between">
                <span>1. Fase Folicular</span>
                <span className="text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded">Dias 1-13</span>
              </div>
              <div className="text-xs text-slate-800 font-bold">Alta Tolerância à Força</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Estrogênio em alta. Momento excelente para cargas pesadas, hipertrofia e treinos de alta intensidade.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-indigo-800 uppercase flex items-center justify-between">
                <span>2. Fase Ovulatória</span>
                <span className="text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded">Dias 14-16</span>
              </div>
              <div className="text-xs text-slate-800 font-bold">Pico de Força & Atenção Articular</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Pico de estrogênio. Maior força neuromuscular com atenção a frouxidão ligamentar nos joelhos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-amber-800 uppercase flex items-center justify-between">
                <span>3. Fase Lútea</span>
                <span className="text-[10px] bg-amber-100 px-1.5 py-0.5 rounded">Dias 17-28</span>
              </div>
              <div className="text-xs text-slate-800 font-bold">Progesterona & Fadiga Térmica</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Temperatura corporal e fadiga aumentadas. Reforçar hidratação e manter volume moderado.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-rose-800 uppercase flex items-center justify-between">
                <span>4. Menstruação</span>
                <span className="text-[10px] bg-rose-100 px-1.5 py-0.5 rounded">Dias 1-5</span>
              </div>
              <div className="text-xs text-slate-800 font-bold">Conforto & Regulação</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Ajustar a intensidade conforme o bem-estar e alívio de eventuais cólicas pélvicas.
              </p>
            </div>
          </div>

          {latestStudentCheckin?.menstrualData ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
              <div className="text-xs font-bold text-rose-900 uppercase">
                Status Atual de {activeStudent.name}:
              </div>
              <div className="text-xs text-rose-800">
                Fase: <strong>{latestStudentCheckin.menstrualData.cyclePhase}</strong> • Fluxo: <strong>{latestStudentCheckin.menstrualData.flowVolume}</strong> • Sintomas: {latestStudentCheckin.menstrualData.symptoms?.join(', ') || 'Nenhum sintoma severo.'}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              Nenhum dado menstrual preenchido no último check-in de {activeStudent.name}.
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRÉ-CONFIGURAÇÃO / GERENCIAMENTO DE GRUPOS E ELENCOS */}
      {/* ========================================================================= */}
      {showGroupConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in zoom-in-95 my-8">
            
            {/* Cabeçalho */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 inline-block mb-1.5">
                  Pré-configuração de Grupos & Elencos
                </span>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-700" />
                  <span>Gerenciar Elencos, Categorias & Turmas</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Crie novos grupos e vincule os atletas para filtrar rapidamente na Matriz de Prontidão.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowGroupConfigModal(false);
                  setEditingGroupId(null);
                  setNewGroupName('');
                  setNewGroupSelectedStudentIds([]);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Formulário: Criar / Editar Grupo */}
            <form onSubmit={handleSaveGroup} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
              <div className="text-xs font-black text-slate-800 flex items-center justify-between">
                <span>{editingGroupId ? 'Editar Grupo Existente' : 'Cadastrar Novo Grupo / Elenco'}</span>
                {editingGroupId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingGroupId(null);
                      setNewGroupName('');
                      setNewGroupDescription('');
                      setNewGroupSelectedStudentIds([]);
                    }}
                    className="text-[10px] text-blue-700 hover:underline font-bold"
                  >
                    Cancelar Edição
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Nome do Grupo / Elenco</label>
                  <input
                    type="text"
                    required
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Ex: Elenco Sub-15 Competição, Turma Noite..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Categoria</label>
                  <select
                    value={newGroupCategory}
                    onChange={(e) => setNewGroupCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Competição">Competição</option>
                    <option value="Base">Base & Formação</option>
                    <option value="Performance">Alto Rendimento</option>
                    <option value="Personal">Personal & VIP</option>
                    <option value="Horário">Horário / Turno</option>
                    <option value="Customizado">Outros</option>
                  </select>
                </div>
              </div>

              {/* Cor do Selo & Descrição */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Cor do Selo</label>
                  <select
                    value={newGroupColor}
                    onChange={(e) => setNewGroupColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="blue">Azul (Principal)</option>
                    <option value="emerald">Verde (Sub-20)</option>
                    <option value="amber">Âmbar (Sub-17 / Base)</option>
                    <option value="purple">Roxo (Performance)</option>
                    <option value="rose">Rosa (Personal)</option>
                    <option value="sky">Céu (Turnos)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Descrição Breve (Opcional)</label>
                  <input
                    type="text"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="Ex: Atletas escalados para o campeonato regional"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Seleção de Alunos Membros */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700">
                    Selecione os Atletas do Grupo ({newGroupSelectedStudentIds.length} selecionado{newGroupSelectedStudentIds.length !== 1 ? 's' : ''}):
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (newGroupSelectedStudentIds.length === students.length) {
                        setNewGroupSelectedStudentIds([]);
                      } else {
                        setNewGroupSelectedStudentIds(students.map(s => s.id));
                      }
                    }}
                    className="text-[10px] text-blue-700 hover:underline font-bold"
                  >
                    {newGroupSelectedStudentIds.length === students.length ? 'Desmarcar Todos' : 'Marcar Todos'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 bg-white rounded-xl border border-slate-200">
                  {students.map(std => {
                    const isChecked = newGroupSelectedStudentIds.includes(std.id);
                    return (
                      <button
                        key={std.id}
                        type="button"
                        onClick={() => {
                          setNewGroupSelectedStudentIds(prev =>
                            isChecked ? prev.filter(id => id !== std.id) : [...prev, std.id]
                          );
                        }}
                        className={`flex items-center gap-2 p-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                          isChecked ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        )}
                        <span className="truncate">{std.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-black text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingGroupId ? 'Atualizar Grupo' : 'Salvar Novo Grupo'}</span>
                </button>
              </div>
            </form>

            {/* Lista dos Grupos Pré-configurados */}
            <div className="space-y-2">
              <div className="text-xs font-black text-slate-800 flex items-center justify-between">
                <span>Grupos & Categorias Pré-configurados ({elencoGroups.length})</span>
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {elencoGroups.map(grp => (
                  <div
                    key={grp.id}
                    className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-0.5 truncate">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${getBadgeStyle(grp.color)}`}>
                          {grp.category}
                        </span>
                        <h4 className="text-xs font-black text-slate-900 truncate">{grp.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {grp.studentIds.length} atleta(s) cadastrado(s) {grp.description ? `• ${grp.description}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEditGroup(grp)}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                        title="Editar grupo"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteGroup(grp.id, grp.name)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                        title="Remover grupo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowGroupConfigModal(false);
                  setEditingGroupId(null);
                }}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Concluir & Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
