import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home,
  TrendingUp, 
  Users, 
  Share2, 
  Calendar, 
  CreditCard, 
  CircleDollarSign, 
  Package, 
  Receipt, 
  Dumbbell, 
  FileText, 
  UserCheck, 
  Settings, 
  ChevronRight, 
  ChevronDown,
  Briefcase,
  Activity,
  MessageCircle,
  X,
  Sparkles,
  Kanban as KanbanIcon,
  CheckSquare,
  Zap,
  HeartHandshake,
  DollarSign,
  Trophy,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  PanelLeft,
  ClipboardCheck,
  BookOpen,
  PlayCircle,
  Lock,
  LayoutDashboard,
  Headphones,
  Bot,
  MessageSquareCode,
  Link2,
  Tag,
  ArrowDownRight,
  ArrowUpRight,
  FileSpreadsheet,
  Salad,
  Scale,
  Pill,
  Droplets,
  HeartPulse,
  Clock,
  GraduationCap,
  BarChart3,
  Camera,
  Layers,
  Flame,
  Sliders
} from 'lucide-react';
import { DashboardSubTab } from './tabs/DashboardsTab';
import { CrmSubTab, AgendaSubTab, TreinoSubTab, AvaliacoesSubTab, NutricaoSubTab, BemEstarSubTab, WhatsappSubTab, FinanceiroSubTab, ProfessoresSubTab, SystemUser } from '../types';
import { CURRENT_SYSTEM_VERSION } from '../version';
import { hasTabPermission } from '../services/userService';

export type TabType = 
  | 'inicio' 
  | 'dashboards'
  | 'clientes' 
  | 'professores'
  | 'alunos'
  | 'crm' 
  | 'agenda' 
  | 'whatsapp'
  | 'pay' 
  | 'financeiro' 
  | 'vendas'
  | 'estoque' 
  | 'comandas' 
  | 'treino' 
  | 'avaliacoes'
  | 'nutricao' 
  | 'bem_estar'
  | 'relatorios' 
  | 'catraca' 
  | 'configuracoes';

interface SidebarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  dashboardSubTab?: DashboardSubTab;
  onDashboardSubTabChange?: (subTab: DashboardSubTab) => void;
  professoresSubTab?: ProfessoresSubTab;
  onProfessoresSubTabChange?: (subTab: ProfessoresSubTab) => void;
  crmSubTab?: CrmSubTab;
  onCrmSubTabChange?: (subTab: CrmSubTab) => void;
  agendaSubTab?: AgendaSubTab;
  onAgendaSubTabChange?: (subTab: AgendaSubTab) => void;
  treinoSubTab?: TreinoSubTab;
  onTreinoSubTabChange?: (subTab: TreinoSubTab) => void;
  avaliacoesSubTab?: AvaliacoesSubTab;
  onAvaliacoesSubTabChange?: (subTab: AvaliacoesSubTab) => void;
  nutricaoSubTab?: NutricaoSubTab;
  onNutricaoSubTabChange?: (subTab: NutricaoSubTab) => void;
  bemEstarSubTab?: BemEstarSubTab;
  onBemEstarSubTabChange?: (subTab: BemEstarSubTab) => void;
  whatsappSubTab?: WhatsappSubTab;
  onWhatsappSubTabChange?: (subTab: WhatsappSubTab) => void;
  financeiroSubTab?: FinanceiroSubTab;
  onFinanceiroSubTabChange?: (subTab: FinanceiroSubTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  overdueCount: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  currentUser?: SystemUser | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  dashboardSubTab = 'gerencial',
  onDashboardSubTabChange,
  professoresSubTab = 'folha_ponto',
  onProfessoresSubTabChange,
  crmSubTab = 'leads',
  onCrmSubTabChange,
  agendaSubTab = 'calendario',
  onAgendaSubTabChange,
  treinoSubTab = 'prescricao',
  onTreinoSubTabChange,
  avaliacoesSubTab = 'avaliacoes',
  onAvaliacoesSubTabChange,
  nutricaoSubTab = 'planos_alimentares',
  onNutricaoSubTabChange,
  bemEstarSubTab = 'checkin',
  onBemEstarSubTabChange,
  whatsappSubTab = 'dashboard',
  onWhatsappSubTabChange,
  financeiroSubTab = 'receber',
  onFinanceiroSubTabChange,
  isOpenMobile,
  onCloseMobile,
  overdueCount,
  isCollapsed = false,
  onToggleCollapse,
  currentUser
}) => {
  const displayName = currentUser?.name || 'Gian Luca Marinho Silva';
  const displayDepartment = currentUser?.department || 'VILLE BLANCHE SPORT';
  const displayRole = currentUser?.role ? currentUser.role.toUpperCase() : 'ADMIN';
  const userInitials = displayName
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'GL';
  const [dashboardsOpen, setDashboardsOpen] = useState(() => currentTab === 'dashboards');
  const [professoresOpen, setProfessoresOpen] = useState(() => currentTab === 'professores');
  const [crmOpen, setCrmOpen] = useState(() => currentTab === 'crm');
  const [agendaOpen, setAgendaOpen] = useState(() => currentTab === 'agenda');
  const [treinoOpen, setTreinoOpen] = useState(() => currentTab === 'treino');
  const [avaliacoesOpen, setAvaliacoesOpen] = useState(() => currentTab === 'avaliacoes');
  const [nutricaoOpen, setNutricaoOpen] = useState(() => currentTab === 'nutricao');
  const [bemEstarOpen, setBemEstarOpen] = useState(() => currentTab === 'bem_estar');
  const [whatsappOpen, setWhatsappOpen] = useState(() => currentTab === 'whatsapp');
  const [financeiroOpen, setFinanceiroOpen] = useState(() => currentTab === 'financeiro');

  // Mantém a sub-aba aberta quando a aba correspondente for ativada (ex: atalhos ou busca)
  useEffect(() => {
    if (currentTab === 'dashboards') setDashboardsOpen(true);
    else if (currentTab === 'professores') setProfessoresOpen(true);
    else if (currentTab === 'crm') setCrmOpen(true);
    else if (currentTab === 'agenda') setAgendaOpen(true);
    else if (currentTab === 'treino') setTreinoOpen(true);
    else if (currentTab === 'avaliacoes') setAvaliacoesOpen(true);
    else if (currentTab === 'nutricao') setNutricaoOpen(true);
    else if (currentTab === 'bem_estar') setBemEstarOpen(true);
    else if (currentTab === 'whatsapp') setWhatsappOpen(true);
    else if (currentTab === 'financeiro') setFinanceiroOpen(true);
  }, [currentTab]);

  const avaliacoesSubTabsConfig: { id: AvaliacoesSubTab; label: string; icon: any; badge?: string }[] = [
    { id: 'avaliacoes', label: 'Avaliações', icon: ClipboardCheck },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const professoresSubTabsConfig: { id: ProfessoresSubTab; label: string; icon: any; badge?: string }[] = [
    { id: 'folha_ponto', label: 'Folha de Ponto', icon: Clock },
    { id: 'tarefas', label: 'Tarefas', icon: CheckSquare },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
  ];

  const bemEstarSubTabsConfig: { id: BemEstarSubTab; label: string; icon: any; badge?: string }[] = [
    { id: 'checkin', label: 'Check-in', icon: ClipboardCheck },
    { id: 'analise', label: 'Análise', icon: TrendingUp },
    { id: 'elenco_hooper', label: 'Matriz do Elenco', icon: Users },
    { id: 'ciclo_menstrual', label: 'Ciclo Menstrual', icon: Droplets },
  ];

  const nutricaoSubTabsConfig: { id: NutricaoSubTab; label: string; icon: any; badge?: string }[] = [
    { id: 'planos_alimentares', label: 'Planos Alimentares & Dietas', icon: Salad, badge: 'Em breve' },
    { id: 'anamnese_nutricional', label: 'Avaliação & Anamnese', icon: FileText, badge: 'Em breve' },
    { id: 'composicao_corporal', label: 'Composição & Bioimpedância', icon: Scale, badge: 'Em breve' },
    { id: 'suplementacao', label: 'Suplementação & Fitoterapia', icon: Pill, badge: 'Em breve' },
    { id: 'metas_hidratacao', label: 'Metas & Hidratação', icon: Droplets, badge: 'Em breve' },
    { id: 'tabela_alimentos', label: 'Tabela TACO & Alimentos', icon: BookOpen, badge: 'Em breve' },
  ];

  const financeiroSubTabsConfig: { id: FinanceiroSubTab; label: string; icon: any; badge?: string }[] = [
    { id: 'receber', label: 'Contas a Receber e Inadimplência', icon: ArrowDownRight, badge: overdueCount > 0 ? `${overdueCount}` : undefined },
    { id: 'pagar', label: 'Contas a Pagar', icon: ArrowUpRight },
    { id: 'dre', label: 'DRE Gerencial', icon: FileSpreadsheet },
    { id: 'extrato', label: 'Extrato Completo', icon: Receipt },
    { id: 'gl_profit_pay', label: 'GL Profit Pay (Recorrência)', icon: CreditCard, badge: 'Recorrente' },
  ];

  const whatsappSubTabsConfig: { id: WhatsappSubTab; label: string; icon: any; badge?: string }[] = [
    { id: 'atendimento', label: 'Atendimento', icon: Headphones, badge: 'Em breve' },
    { id: 'kanban', label: 'Kanban', icon: KanbanIcon },
    { id: 'disparos', label: 'Disparos', icon: Zap },
    { id: 'chatbot', label: 'Chatbot', icon: Bot },
    { id: 'contatos', label: 'Contatos', icon: Users },
    { id: 'respostas_rapidas', label: 'Respostas Rápidas', icon: MessageSquareCode },
    { id: 'etiquetas', label: 'Etiquetas', icon: Tag },
    { id: 'conexoes', label: 'Conexão', icon: Link2 },
  ];

  const treinoSubTabsConfig: { id: TreinoSubTab; label: string; icon: any; badge?: string }[] = [
    { id: 'plano_treino', label: 'Plano de Treino', icon: FileSpreadsheet, badge: 'Novo' },
    { id: 'prescricao', label: 'Prescrição de Treinos', icon: Dumbbell },
    { id: 'catalogo_exercicios', label: 'Catálogo de Exercícios (+1.400)', icon: Dumbbell },
    { id: 'modelos_templates', label: 'Modelos & Templates', icon: BookOpen },
    { id: 'treino_do_dia', label: 'Treino do Dia (Modo Aluno)', icon: PlayCircle },
    { id: 'controle_carga', label: 'Controle de Carga & 1RM', icon: Activity },
  ];

  const agendaSubTabsConfig: { id: AgendaSubTab; label: string; icon: any }[] = [
    { id: 'calendario', label: 'Calendário', icon: Calendar },
    { id: 'grade', label: 'Grade de Turmas', icon: Dumbbell },
    { id: 'locacoes', label: 'Locações', icon: DollarSign },
    { id: 'jogos', label: 'Eventos de Jogos', icon: Trophy },
    { id: 'eventos', label: 'Eventos Diversos', icon: Sparkles },
  ];

  const crmSubTabsConfig: { id: CrmSubTab; label: string; icon: any }[] = [
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'kambam', label: 'Kambam', icon: KanbanIcon },
    { id: 'atividades', label: 'Atividades', icon: CheckSquare },
    { id: 'automacoes', label: 'Automações', icon: Zap },
    { id: 'pesquisas', label: 'Pesquisas de Satisfação', icon: HeartHandshake },
  ];

  const dashboardSubTabsConfig: { id: DashboardSubTab; label: string; icon: any }[] = [
    { id: 'crm', label: 'CRM & Funil', icon: Share2 },
    { id: 'gerencial', label: 'Gerencial (DRE)', icon: Briefcase },
    { id: 'operacional', label: 'Operacional', icon: Activity },
    { id: 'clientes', label: 'Clientes & Retenção', icon: Users },
    { id: 'financeiro', label: 'Financeiro', icon: CircleDollarSign },
    { id: 'agenda', label: 'Agenda & Aulas', icon: Calendar },
    { id: 'treino', label: 'Treino & Prescrição', icon: Dumbbell },
    { id: 'whatsapp', label: 'WhatsApp Robô', icon: MessageCircle },
  ];
  const menuItems = [
    { 
      id: 'inicio' as TabType, 
      label: 'Início', 
      icon: Home, 
      hasChevron: false,
      badge: null 
    },
    { 
      id: 'dashboards' as TabType, 
      label: 'Dashboards', 
      icon: TrendingUp, 
      hasChevron: true,
      badge: null 
    },
    { 
      id: 'clientes' as TabType, 
      label: 'Clientes', 
      icon: Users, 
      hasChevron: false,
      badge: null 
    },
    { 
      id: 'professores' as TabType, 
      label: 'Professores', 
      icon: GraduationCap, 
      hasChevron: true,
      badge: null 
    },
    { 
      id: 'crm' as TabType, 
      label: 'CRM', 
      icon: Share2, 
      hasChevron: true,
      badge: '5 leads' 
    },
    { 
      id: 'agenda' as TabType, 
      label: 'Agenda', 
      icon: Calendar, 
      hasChevron: true,
      badge: 'Hoje' 
    },
    { 
      id: 'whatsapp' as TabType, 
      label: 'WhatsApp', 
      icon: MessageCircle, 
      hasChevron: true,
      badge: 'Em breve' 
    },
    { 
      id: 'financeiro' as TabType, 
      label: 'Financeiro', 
      icon: CircleDollarSign, 
      hasChevron: true,
      badge: null
    },
    { 
      id: 'treino' as TabType, 
      label: 'Treino', 
      icon: Dumbbell, 
      hasChevron: true,
      badge: null 
    },
    { 
      id: 'bem_estar' as TabType, 
      label: 'Bem-Estar', 
      icon: HeartPulse, 
      hasChevron: true,
      badge: null 
    },
    { 
      id: 'avaliacoes' as TabType, 
      label: 'Avaliações Físicas', 
      icon: ClipboardCheck, 
      hasChevron: true,
      badge: null 
    },
    { 
      id: 'estoque' as TabType, 
      label: 'Estoque', 
      icon: Package, 
      hasChevron: true,
      badge: null 
    },
    { 
      id: 'comandas' as TabType, 
      label: 'Comandas', 
      icon: Receipt, 
      hasChevron: false,
      badge: 'Abertas' 
    },
    { 
      id: 'nutricao' as TabType, 
      label: 'Nutrição', 
      icon: Salad, 
      hasChevron: true,
      badge: 'Em breve' 
    },
    { 
      id: 'relatorios' as TabType, 
      label: 'Relatórios', 
      icon: FileText, 
      hasChevron: false,
      badge: null 
    },
    { 
      id: 'configuracoes' as TabType, 
      label: 'Configurações', 
      icon: Settings, 
      hasChevron: false,
      badge: null 
    }
  ];

  const visibleMenuItems = useMemo(() => {
    return menuItems.filter(item => hasTabPermission(item.id, currentUser));
  }, [menuItems, currentUser]);

  const canAccessCatraca = hasTabPermission('catraca', currentUser);
  const canAccessConfiguracoes = hasTabPermission('configuracoes', currentUser);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container - Altura total com rolagem isolada */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col h-screen max-h-screen bg-white border-r border-slate-200 text-slate-700 transition-all duration-300 ease-in-out md:static md:translate-x-0 shadow-xs shrink-0 select-none relative ${
        isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full'
      } ${isCollapsed ? 'md:w-[70px]' : 'md:w-60'}`}>
        
        {/* Edge Toggle Pill (Desktop Only) */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex absolute -right-3 top-20 z-50 h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-300 text-slate-600 shadow-md hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 transition-all cursor-pointer"
            title={isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        )}

        {/* Brand Header - Fixo no topo do menu lateral */}
        <div className={`shrink-0 flex h-14 sm:h-16 items-center border-b border-slate-100 transition-all bg-white ${
          isCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'
        }`}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-800 text-white font-black text-sm shadow-xs border border-blue-900">
                  VB
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 font-extrabold text-sm tracking-tight text-slate-900">
                    <span>VB SPORT</span>
                    <span className="text-[10px] font-bold text-red-600 px-1.5 py-0.2 bg-red-50 border border-red-200/70 rounded">ESCOLA</span>
                  </div>
                  <div className="text-[10px] font-medium text-slate-400 truncate">
                    VB SPORT • VILLE BLANCHE
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {onToggleCollapse && (
                  <button
                    onClick={onToggleCollapse}
                    className="hidden md:flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    title="Recolher barra lateral"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={onCloseMobile}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:hidden"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="relative group flex items-center justify-center">
              <button
                onClick={onToggleCollapse}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-800 text-white font-black text-sm shadow-xs border border-blue-900 hover:scale-105 transition-transform"
                title="Expandir barra lateral"
              >
                VB
              </button>
              {/* Flyout tooltip on collapsed logo */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                <div className="bg-slate-900 text-white text-xs font-bold px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap border border-slate-700 flex items-center gap-1.5">
                  <span>VB SPORT ESCOLA</span>
                  <span className="text-[10px] text-blue-400 font-normal">(Clique para expandir)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation List - Rolagem independente dos menus laterais */}
        <nav className={`flex-1 py-3 space-y-1 overflow-y-auto custom-sidebar-scrollbar ${
          isCollapsed ? 'px-2 overflow-x-hidden md:overflow-visible' : 'px-2'
        }`}>
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isDashboards = item.id === 'dashboards';
            const isProfessores = item.id === 'professores';
            const isCrm = item.id === 'crm';
            const isAgenda = item.id === 'agenda';
            const isTreino = item.id === 'treino';
            const isAvaliacoes = item.id === 'avaliacoes';
            const isNutricao = item.id === 'nutricao';
            const isBemEstar = item.id === 'bem_estar';
            const isWhatsapp = item.id === 'whatsapp';
            const isFinanceiro = item.id === 'financeiro';

            const hasSubTabs = isDashboards || isProfessores || isCrm || isAgenda || isTreino || isAvaliacoes || isNutricao || isBemEstar || isWhatsapp || isFinanceiro;
            const isSubOpen = isDashboards ? dashboardsOpen : isProfessores ? professoresOpen : isCrm ? crmOpen : isAgenda ? agendaOpen : isTreino ? treinoOpen : isAvaliacoes ? avaliacoesOpen : isNutricao ? nutricaoOpen : isBemEstar ? bemEstarOpen : isWhatsapp ? whatsappOpen : isFinanceiro ? financeiroOpen : false;

            if (isCollapsed) {
              return (
                <div key={item.id} className="relative group flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (hasSubTabs) {
                        if (onToggleCollapse) {
                          onToggleCollapse();
                        }
                        if (isDashboards) setDashboardsOpen(true);
                        else if (isProfessores) setProfessoresOpen(true);
                        else if (isCrm) setCrmOpen(true);
                        else if (isAgenda) setAgendaOpen(true);
                        else if (isTreino) setTreinoOpen(true);
                        else if (isAvaliacoes) setAvaliacoesOpen(true);
                        else if (isNutricao) setNutricaoOpen(true);
                        else if (isBemEstar) setBemEstarOpen(true);
                        else if (isWhatsapp) setWhatsappOpen(true);
                        else if (isFinanceiro) setFinanceiroOpen(true);
                      } else {
                        onTabChange(item.id);
                      }
                    }}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-800 text-white shadow-xs font-bold'
                        : isSubOpen
                          ? 'bg-blue-100 text-blue-900 font-semibold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {/* Badge notification dot */}
                    {item.badge && (
                      item.id === 'financeiro' && overdueCount > 0 ? (
                        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-white text-[9px] font-bold border-2 border-white shadow-2xs">
                          {overdueCount}
                        </span>
                      ) : (
                        <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-emerald-500 border border-white" />
                      )
                    )}
                  </button>

                  {/* Floating Flyout Menu on Hover (Collapsed State) */}
                  <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col z-50 pointer-events-auto">
                    <div className="min-w-44 rounded-xl bg-slate-900 text-white p-2.5 shadow-2xl border border-slate-700 text-xs animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-slate-800">
                        <span className="font-bold text-slate-100">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                            item.id === 'financeiro' && overdueCount > 0
                              ? 'bg-red-500 text-white'
                              : 'bg-blue-600 text-white'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Sub-tabs inside flyout */}
                      {isDashboards && (
                        <div className="space-y-0.5">
                          {dashboardSubTabsConfig.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onTabChange('dashboards');
                                onDashboardSubTabChange?.(sub.id);
                              }}
                              className={`flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-[11px] transition-colors ${
                                currentTab === 'dashboards' && dashboardSubTab === sub.id
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <sub.icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{sub.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {isProfessores && (
                        <div className="space-y-0.5">
                          {professoresSubTabsConfig.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onTabChange('professores');
                                onProfessoresSubTabChange?.(sub.id);
                              }}
                              className={`flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-[11px] transition-colors ${
                                currentTab === 'professores' && professoresSubTab === sub.id
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <sub.icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{sub.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {isCrm && (
                        <div className="space-y-0.5">
                          {crmSubTabsConfig.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onTabChange('crm');
                                onCrmSubTabChange?.(sub.id);
                              }}
                              className={`flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-[11px] transition-colors ${
                                currentTab === 'crm' && crmSubTab === sub.id
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <sub.icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{sub.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {isAgenda && (
                        <div className="space-y-0.5">
                          {agendaSubTabsConfig.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onTabChange('agenda');
                                onAgendaSubTabChange?.(sub.id);
                              }}
                              className={`flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-[11px] transition-colors ${
                                currentTab === 'agenda' && agendaSubTab === sub.id
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <sub.icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{sub.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {isTreino && (
                        <div className="space-y-0.5">
                          {treinoSubTabsConfig.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onTabChange('treino');
                                onTreinoSubTabChange?.(sub.id);
                              }}
                              className={`flex w-full items-center justify-between gap-2 px-2 py-1.5 rounded-md text-[11px] transition-colors ${
                                currentTab === 'treino' && treinoSubTab === sub.id
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <sub.icon className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{sub.label}</span>
                              </div>
                              {sub.badge && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/30 text-blue-200 font-semibold shrink-0">
                                  {sub.badge}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {isAvaliacoes && (
                        <div className="space-y-0.5">
                          {avaliacoesSubTabsConfig.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onTabChange('avaliacoes');
                                onAvaliacoesSubTabChange?.(sub.id);
                              }}
                              className={`flex w-full items-center justify-between gap-2 px-2 py-1.5 rounded-md text-[11px] transition-colors ${
                                currentTab === 'avaliacoes' && avaliacoesSubTab === sub.id
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <sub.icon className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{sub.label}</span>
                              </div>
                              {sub.badge && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-200 font-semibold shrink-0">
                                  {sub.badge}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {isNutricao && (
                        <div className="space-y-0.5">
                          {nutricaoSubTabsConfig.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onTabChange('nutricao');
                                onNutricaoSubTabChange?.(sub.id);
                              }}
                              className={`flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-[11px] transition-colors ${
                                currentTab === 'nutricao' && nutricaoSubTab === sub.id
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <sub.icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{sub.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {isBemEstar && (
                        <div className="space-y-0.5">
                          {bemEstarSubTabsConfig.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onTabChange('bem_estar');
                                onBemEstarSubTabChange?.(sub.id);
                              }}
                              className={`flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-[11px] transition-colors ${
                                currentTab === 'bem_estar' && bemEstarSubTab === sub.id
                                  ? 'bg-emerald-600 text-white font-bold'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <sub.icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{sub.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {isWhatsapp && (
                        <div className="space-y-0.5">
                          {whatsappSubTabsConfig.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onTabChange('whatsapp');
                                onWhatsappSubTabChange?.(sub.id);
                              }}
                              className={`flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-[11px] transition-colors ${
                                currentTab === 'whatsapp' && whatsappSubTab === sub.id
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <sub.icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{sub.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {isFinanceiro && (
                        <div className="space-y-0.5">
                          {financeiroSubTabsConfig.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onTabChange('financeiro');
                                onFinanceiroSubTabChange?.(sub.id);
                              }}
                              className={`flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-[11px] transition-colors ${
                                currentTab === 'financeiro' && financeiroSubTab === sub.id
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <sub.icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{sub.label}</span>
                              {sub.badge && (
                                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-semibold">
                                  {sub.badge}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <React.Fragment key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (isDashboards) {
                      setDashboardsOpen(prev => !prev);
                    } else if (isProfessores) {
                      setProfessoresOpen(prev => !prev);
                    } else if (isCrm) {
                      setCrmOpen(prev => !prev);
                    } else if (isAgenda) {
                      setAgendaOpen(prev => !prev);
                    } else if (isTreino) {
                      setTreinoOpen(prev => !prev);
                    } else if (isAvaliacoes) {
                      setAvaliacoesOpen(prev => !prev);
                    } else if (isNutricao) {
                      setNutricaoOpen(prev => !prev);
                    } else if (isBemEstar) {
                      setBemEstarOpen(prev => !prev);
                    } else if (isWhatsapp) {
                      setWhatsappOpen(prev => !prev);
                    } else if (isFinanceiro) {
                      setFinanceiroOpen(prev => !prev);
                    } else {
                      onTabChange(item.id);
                      onCloseMobile();
                    }
                  }}
                  className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-blue-50 text-blue-950 font-bold border-l-3 border-blue-700 shadow-2xs' 
                      : isSubOpen
                        ? 'bg-slate-100/90 text-slate-800 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-blue-700' : isSubOpen ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                        item.id === 'financeiro' && overdueCount > 0
                          ? 'bg-red-100 text-red-700 font-bold border border-red-200'
                          : isActive
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isDashboards ? (
                      <ChevronDown className={`h-3 w-3 transition-transform ${
                        dashboardsOpen ? 'rotate-180 text-blue-700' : 'text-slate-400'
                      }`} />
                    ) : isProfessores ? (
                      <ChevronDown className={`h-3 w-3 transition-transform ${
                        professoresOpen ? 'rotate-180 text-blue-700' : 'text-slate-400'
                      }`} />
                    ) : isCrm ? (
                      <ChevronDown className={`h-3 w-3 transition-transform ${
                        crmOpen ? 'rotate-180 text-blue-700' : 'text-slate-400'
                      }`} />
                    ) : isAgenda ? (
                      <ChevronDown className={`h-3 w-3 transition-transform ${
                        agendaOpen ? 'rotate-180 text-blue-700' : 'text-slate-400'
                      }`} />
                    ) : isTreino ? (
                      <ChevronDown className={`h-3 w-3 transition-transform ${
                        treinoOpen ? 'rotate-180 text-blue-700' : 'text-slate-400'
                      }`} />
                    ) : isAvaliacoes ? (
                      <ChevronDown className={`h-3 w-3 transition-transform ${
                        avaliacoesOpen ? 'rotate-180 text-blue-700' : 'text-slate-400'
                      }`} />
                    ) : isNutricao ? (
                      <ChevronDown className={`h-3 w-3 transition-transform ${
                        nutricaoOpen ? 'rotate-180 text-blue-700' : 'text-slate-400'
                      }`} />
                    ) : isBemEstar ? (
                      <ChevronDown className={`h-3 w-3 transition-transform ${
                        bemEstarOpen ? 'rotate-180 text-emerald-700' : 'text-slate-400'
                      }`} />
                    ) : isWhatsapp ? (
                      <ChevronDown className={`h-3 w-3 transition-transform ${
                        whatsappOpen ? 'rotate-180 text-blue-700' : 'text-slate-400'
                      }`} />
                    ) : isFinanceiro ? (
                      <ChevronDown className={`h-3 w-3 transition-transform ${
                        financeiroOpen ? 'rotate-180 text-blue-700' : 'text-slate-400'
                      }`} />
                    ) : item.hasChevron ? (
                      <ChevronRight className={`h-3 w-3 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-500'
                      }`} />
                    ) : null}
                  </div>
                </button>

                {/* Sub-items for Dashboards */}
                {isDashboards && dashboardsOpen && (
                  <div className="ml-3 pl-3 border-l border-slate-200 space-y-0.5 my-1">
                    {dashboardSubTabsConfig.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentTab === 'dashboards' && dashboardSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            onTabChange('dashboards');
                            if (onDashboardSubTabChange) {
                              onDashboardSubTabChange(sub.id);
                            }
                            onCloseMobile();
                          }}
                          className={`flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-blue-800 text-white font-bold shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <SubIcon className={`h-3.5 w-3.5 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sub-items for Professores */}
                {isProfessores && professoresOpen && (
                  <div className="ml-3 pl-3 border-l border-slate-200 space-y-0.5 my-1">
                    {professoresSubTabsConfig.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentTab === 'professores' && professoresSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            onTabChange('professores');
                            if (onProfessoresSubTabChange) {
                              onProfessoresSubTabChange(sub.id);
                            }
                            onCloseMobile();
                          }}
                          className={`flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-blue-800 text-white font-bold shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <SubIcon className={`h-3.5 w-3.5 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{sub.label}</span>
                          {sub.badge && (
                            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold">
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sub-items for CRM */}
                {isCrm && crmOpen && (
                  <div className="ml-3 pl-3 border-l border-slate-200 space-y-0.5 my-1">
                    {crmSubTabsConfig.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentTab === 'crm' && crmSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            onTabChange('crm');
                            if (onCrmSubTabChange) {
                              onCrmSubTabChange(sub.id);
                            }
                            onCloseMobile();
                          }}
                          className={`flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-blue-800 text-white font-bold shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <SubIcon className={`h-3.5 w-3.5 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sub-items for Agenda */}
                {isAgenda && agendaOpen && (
                  <div className="ml-3 pl-3 border-l border-slate-200 space-y-0.5 my-1">
                    {agendaSubTabsConfig.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentTab === 'agenda' && agendaSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            onTabChange('agenda');
                            if (onAgendaSubTabChange) {
                              onAgendaSubTabChange(sub.id);
                            }
                            onCloseMobile();
                          }}
                          className={`flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-blue-800 text-white font-bold shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <SubIcon className={`h-3.5 w-3.5 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sub-items for Treino */}
                {isTreino && treinoOpen && (
                  <div className="ml-3 pl-3 border-l border-slate-200 space-y-0.5 my-1">
                    {treinoSubTabsConfig.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentTab === 'treino' && treinoSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            onTabChange('treino');
                            if (onTreinoSubTabChange) {
                              onTreinoSubTabChange(sub.id);
                            }
                            onCloseMobile();
                          }}
                          className={`flex w-full items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-blue-800 text-white font-bold shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <SubIcon className={`h-3.5 w-3.5 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{sub.label}</span>
                          </div>
                          {sub.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold shrink-0">
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sub-items for Avaliações Físicas */}
                {isAvaliacoes && avaliacoesOpen && (
                  <div className="ml-3 pl-3 border-l border-slate-200 space-y-0.5 my-1">
                    {avaliacoesSubTabsConfig.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentTab === 'avaliacoes' && avaliacoesSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            onTabChange('avaliacoes');
                            if (onAvaliacoesSubTabChange) {
                              onAvaliacoesSubTabChange(sub.id);
                            }
                            onCloseMobile();
                          }}
                          className={`flex w-full items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-blue-800 text-white font-bold shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <SubIcon className={`h-3.5 w-3.5 shrink-0 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{sub.label}</span>
                          </div>
                          {sub.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold shrink-0">
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sub-items for Nutrição */}
                {isNutricao && nutricaoOpen && (
                  <div className="ml-3 pl-3 border-l border-slate-200 space-y-0.5 my-1">
                    {nutricaoSubTabsConfig.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentTab === 'nutricao' && nutricaoSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            onTabChange('nutricao');
                            if (onNutricaoSubTabChange) {
                              onNutricaoSubTabChange(sub.id);
                            }
                            onCloseMobile();
                          }}
                          className={`flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-blue-800 text-white font-bold shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <SubIcon className={`h-3.5 w-3.5 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{sub.label}</span>
                          {sub.badge && (
                            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sub-items for Bem-Estar */}
                {isBemEstar && bemEstarOpen && (
                  <div className="ml-3 pl-3 border-l border-slate-200 space-y-0.5 my-1">
                    {bemEstarSubTabsConfig.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentTab === 'bem_estar' && bemEstarSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            onTabChange('bem_estar');
                            if (onBemEstarSubTabChange) {
                              onBemEstarSubTabChange(sub.id);
                            }
                            onCloseMobile();
                          }}
                          className={`flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-emerald-700 text-white font-bold shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <SubIcon className={`h-3.5 w-3.5 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{sub.label}</span>
                          {sub.badge && (
                            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sub-items for WhatsApp */}
                {isWhatsapp && whatsappOpen && (
                  <div className="ml-3 pl-3 border-l border-slate-200 space-y-0.5 my-1">
                    {whatsappSubTabsConfig.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentTab === 'whatsapp' && whatsappSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            onTabChange('whatsapp');
                            if (onWhatsappSubTabChange) {
                              onWhatsappSubTabChange(sub.id);
                            }
                            onCloseMobile();
                          }}
                          className={`flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-blue-800 text-white font-bold shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <SubIcon className={`h-3.5 w-3.5 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{sub.label}</span>
                          {sub.badge && (
                            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Sub-items for Financeiro */}
                {isFinanceiro && financeiroOpen && (
                  <div className="ml-3 pl-3 border-l border-slate-200 space-y-0.5 my-1">
                    {financeiroSubTabsConfig.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = currentTab === 'financeiro' && financeiroSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            onTabChange('financeiro');
                            if (onFinanceiroSubTabChange) {
                              onFinanceiroSubTabChange(sub.id);
                            }
                            onCloseMobile();
                          }}
                          className={`flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-blue-800 text-white font-bold shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <SubIcon className={`h-3.5 w-3.5 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{sub.label}</span>
                          {sub.badge && (
                            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold border border-red-200">
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* Empty state if no modules permitted */}
          {visibleMenuItems.length === 0 && !canAccessCatraca && !canAccessConfiguracoes && (
            <div className="p-4 my-4 text-center rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs">
              <Lock className="h-5 w-5 mx-auto mb-1.5 text-slate-400" />
              <p className="font-semibold text-slate-700">Acesso Restrito</p>
              <p className="mt-1 text-[11px] text-slate-400">Nenhum módulo liberado para este usuário. Solicite liberação ao administrador.</p>
            </div>
          )}

          {/* Quick Access Tools at bottom of menu (Catraca Ao Vivo) */}
          {canAccessCatraca && (
            <div className="pt-3 mt-2 border-t border-slate-100 space-y-1">
              {!isCollapsed && (
                <div className="px-2 pb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Ferramentas Rápidas
                </div>
              )}
              
              {/* Catraca */}
              {isCollapsed ? (
                <div className="relative group flex justify-center">
                  <button
                    onClick={() => onTabChange('catraca')}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                      currentTab === 'catraca' ? 'bg-blue-800 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <UserCheck className="h-4 w-4 text-emerald-600" />
                  </button>
                  <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                    <div className="bg-slate-900 text-white text-xs font-bold px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap border border-slate-700 flex items-center gap-2">
                      <span>Catraca & Acesso</span>
                      <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-semibold">Ao vivo</span>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onTabChange('catraca');
                    onCloseMobile();
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    currentTab === 'catraca' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Catraca & Acesso</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">Ao vivo</span>
                </button>
              )}
            </div>
          )}
        </nav>

        {/* Footer User Info & Collapse Toggle - Fixo na base da barra lateral */}
        <div className="shrink-0 border-t border-slate-100 p-2.5 bg-white">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-red-500 shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs border-2 border-red-500">
                    {userInitials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate" title={displayName}>
                    {displayName}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate uppercase font-semibold flex items-center gap-1">
                    <span>{displayDepartment}</span>
                    <span className="rounded bg-blue-50 text-blue-700 px-1 text-[9px] font-bold border border-blue-200">
                      {displayRole}
                    </span>
                  </div>
                  <div className="text-[9px] text-emerald-700 font-mono font-bold flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    {CURRENT_SYSTEM_VERSION}
                  </div>
                </div>
              </div>

              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="hidden md:flex mt-2 w-full items-center justify-center gap-2 rounded-lg py-1.5 px-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-blue-900 border border-slate-200 transition-colors cursor-pointer"
                  title="Recolher barra lateral"
                >
                  <PanelLeftClose className="h-3.5 w-3.5 text-slate-400" />
                  <span>Recolher Menu</span>
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-red-500 shadow-xs cursor-pointer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs border-2 border-red-500 cursor-pointer">
                    {userInitials}
                  </div>
                )}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                  <div className="bg-slate-900 text-white text-xs font-bold px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap border border-slate-700">
                    {displayName} ({displayRole} - {displayDepartment})
                  </div>
                </div>
              </div>

              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-800 border border-slate-200 transition-colors cursor-pointer"
                  title="Expandir barra lateral"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
