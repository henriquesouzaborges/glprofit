import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Share2, 
  Calendar, 
  MessageCircle, 
  CircleDollarSign, 
  Dumbbell, 
  HeartPulse, 
  ClipboardCheck, 
  Package, 
  Coffee, 
  Salad, 
  FileText, 
  Settings, 
  Building2,
  ChevronDown,
  ChevronUp,
  Zap, 
  CheckSquare, 
  FileSpreadsheet, 
  PlayCircle, 
  Activity, 
  BookOpen, 
  Tag, 
  Link2, 
  Bot, 
  Headphones, 
  MessageSquareCode, 
  Kanban as KanbanIcon, 
  Clock, 
  ArrowDownRight, 
  ArrowUpRight, 
  Receipt, 
  CreditCard, 
  Trophy, 
  Sparkles, 
  DollarSign, 
  Briefcase, 
  HeartHandshake, 
  Pill, 
  Scale, 
  Droplets
} from 'lucide-react';
import type { TabType } from '../types';
import { DashboardSubTab } from './tabs/DashboardsTab';
import { 
  CrmSubTab, 
  AgendaSubTab, 
  TreinoSubTab, 
  AvaliacoesSubTab, 
  NutricaoSubTab, 
  BemEstarSubTab, 
  WhatsappSubTab, 
  FinanceiroSubTab, 
  ProfessoresSubTab, 
  EmpresasClientesSubTab,
  SystemUser 
} from '../types';
import { hasTabPermission } from '../services/userService';

export interface TopNavProps {
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
  empresasClientesSubTab?: EmpresasClientesSubTab;
  onEmpresasClientesSubTabChange?: (subTab: EmpresasClientesSubTab) => void;
  overdueCount: number;
  leadsCount?: number;
  currentUser?: SystemUser | null;
}

export const TopNav: React.FC<TopNavProps> = ({
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
  empresasClientesSubTab = 'dashboard',
  onEmpresasClientesSubTabChange,
  overdueCount,
  leadsCount = 0,
  currentUser
}) => {
  // Estado local para recolher/expandir a linha de sub-abas (por padrão expandido = false no collapsed)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const activeTabRef = useRef<HTMLButtonElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto centralizar a aba ativa na barra com rolagem horizontal
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [currentTab]);

  // Sub-abas exatamente como no Sidebar
  const avaliacoesSubTabs = [
    { id: 'avaliacoes', label: 'Avaliações', icon: ClipboardCheck },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const professoresSubTabs = [
    { id: 'folha_ponto', label: 'Folha de Ponto', icon: Clock },
    { id: 'tarefas', label: 'Tarefas', icon: CheckSquare },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
  ];

  const bemEstarSubTabs = [
    { id: 'checkin', label: 'Check-in', icon: ClipboardCheck },
    { id: 'analise', label: 'Análise', icon: TrendingUp },
    { id: 'elenco_hooper', label: 'Matriz do Elenco', icon: Users },
    { id: 'ciclo_menstrual', label: 'Ciclo Menstrual', icon: Droplets },
  ];

  const nutricaoSubTabs = [
    { id: 'planos_alimentares', label: 'Planos Alimentares & Dietas', icon: Salad, badge: 'Em breve' },
    { id: 'anamnese_nutricional', label: 'Avaliação & Anamnese', icon: FileText, badge: 'Em breve' },
    { id: 'composicao_corporal', label: 'Composição & Bioimpedância', icon: Scale, badge: 'Em breve' },
    { id: 'suplementacao', label: 'Suplementação & Fitoterapia', icon: Pill, badge: 'Em breve' },
    { id: 'metas_hidratacao', label: 'Metas & Hidratação', icon: Droplets, badge: 'Em breve' },
    { id: 'tabela_alimentos', label: 'Tabela TACO & Alimentos', icon: BookOpen, badge: 'Em breve' },
  ];

  const financeiroSubTabs = [
    { id: 'receber', label: 'Contas a Receber e Inadimplência', icon: ArrowDownRight, badge: overdueCount > 0 ? `${overdueCount}` : undefined },
    { id: 'pagar', label: 'Contas a Pagar', icon: ArrowUpRight },
    { id: 'dre', label: 'DRE Gerencial', icon: FileSpreadsheet },
    { id: 'extrato', label: 'Extrato Completo', icon: Receipt },
    { id: 'gl_profit_pay', label: 'GL Profit Pay (Recorrência)', icon: CreditCard, badge: 'Recorrente' },
  ];

  const whatsappSubTabs = [
    { id: 'atendimento', label: 'Atendimento', icon: Headphones, badge: 'Em breve' },
    { id: 'kanban', label: 'Kanban', icon: KanbanIcon },
    { id: 'disparos', label: 'Disparos', icon: Zap },
    { id: 'chatbot', label: 'Chatbot', icon: Bot },
    { id: 'contatos', label: 'Contatos', icon: Users },
    { id: 'respostas_rapidas', label: 'Respostas Rápidas', icon: MessageSquareCode },
    { id: 'etiquetas', label: 'Etiquetas', icon: Tag },
    { id: 'conexoes', label: 'Conexão', icon: Link2 },
  ];

  const treinoSubTabs = [
    { id: 'plano_treino', label: 'Plano de Treino', icon: FileSpreadsheet, badge: 'Novo' },
    { id: 'prescricao', label: 'Prescrição de Treinos', icon: Dumbbell },
    { id: 'catalogo_exercicios', label: 'Catálogo de Exercícios (+1.400)', icon: Dumbbell },
    { id: 'modelos_templates', label: 'Modelos & Templates', icon: BookOpen },
    { id: 'treino_do_dia', label: 'Treino do Dia (Modo Aluno)', icon: PlayCircle },
    { id: 'controle_carga', label: 'Controle de Carga & 1RM', icon: Activity },
  ];

  const agendaSubTabs = [
    { id: 'calendario', label: 'Calendário', icon: Calendar },
    { id: 'grade', label: 'Grade de Turmas', icon: Dumbbell },
    { id: 'locacoes', label: 'Locações', icon: DollarSign },
    { id: 'jogos', label: 'Eventos de Jogos', icon: Trophy },
    { id: 'eventos', label: 'Eventos Diversos', icon: Sparkles },
  ];

  const crmSubTabs = [
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'kambam', label: 'Kambam', icon: KanbanIcon },
    { id: 'atividades', label: 'Atividades', icon: CheckSquare },
    { id: 'automacoes', label: 'Automações', icon: Zap },
    { id: 'pesquisas', label: 'Pesquisas de Satisfação', icon: HeartHandshake },
  ];

  const empresasClientesSubTabs = [
    { id: 'dashboard', label: 'Dashboard de Operação', icon: TrendingUp },
    { id: 'licencas', label: 'Licenças, Acessos & Módulos', icon: Settings },
  ];

  const dashboardSubTabs = [
    { id: 'crm', label: 'CRM & Funil', icon: Share2 },
    { id: 'gerencial', label: 'Gerencial (DRE)', icon: Briefcase },
    { id: 'clientes', label: 'Clientes & Retenção', icon: Users },
    { id: 'financeiro', label: 'Financeiro', icon: CircleDollarSign },
    { id: 'agenda', label: 'Agenda & Aulas', icon: Calendar },
    { id: 'treino', label: 'Treino & Prescrição', icon: Dumbbell },
    { id: 'whatsapp', label: 'WhatsApp Robô', icon: MessageCircle },
  ];

  // Mapeamento dos grupos de sub-abas por aba
  const groups: Partial<Record<TabType, { subs: any[]; current: string; onChange?: (id: any) => void }>> = {
    dashboards: { subs: dashboardSubTabs, current: dashboardSubTab, onChange: onDashboardSubTabChange },
    professores: { subs: professoresSubTabs, current: professoresSubTab, onChange: onProfessoresSubTabChange },
    crm: { subs: crmSubTabs, current: crmSubTab, onChange: onCrmSubTabChange },
    agenda: { subs: agendaSubTabs, current: agendaSubTab, onChange: onAgendaSubTabChange },
    whatsapp: { subs: whatsappSubTabs, current: whatsappSubTab, onChange: onWhatsappSubTabChange },
    financeiro: { subs: financeiroSubTabs, current: financeiroSubTab, onChange: onFinanceiroSubTabChange },
    treino: { subs: treinoSubTabs, current: treinoSubTab, onChange: onTreinoSubTabChange },
    bem_estar: { subs: bemEstarSubTabs, current: bemEstarSubTab, onChange: onBemEstarSubTabChange },
    avaliacoes: { subs: avaliacoesSubTabs, current: avaliacoesSubTab, onChange: onAvaliacoesSubTabChange },
    nutricao: { subs: nutricaoSubTabs, current: nutricaoSubTab, onChange: onNutricaoSubTabChange },
    empresas_clientes: { subs: empresasClientesSubTabs, current: empresasClientesSubTab, onChange: onEmpresasClientesSubTabChange }
  };

  // Lista de abas principais
  const items: { 
    id: TabType; 
    label: string; 
    icon: React.ComponentType<{ className?: string }>; 
    hasChevron: boolean; 
    badge?: string | null;
    badgeColor?: 'red' | 'yellow' | 'green' | 'blue';
  }[] = [
    { id: 'inicio', label: 'Início', icon: Home, hasChevron: false },
    { id: 'dashboards', label: 'Dashboards', icon: TrendingUp, hasChevron: true },
    { id: 'clientes', label: 'Clientes', icon: Users, hasChevron: false },
    { id: 'professores', label: 'Professores', icon: GraduationCap, hasChevron: true },
    { id: 'crm', label: 'CRM', icon: Share2, hasChevron: true, badge: leadsCount && leadsCount > 0 ? `${leadsCount} leads` : null, badgeColor: 'blue' },
    { id: 'agenda', label: 'Agenda', icon: Calendar, hasChevron: true, badge: 'Hoje', badgeColor: 'green' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, hasChevron: true, badge: 'Em breve', badgeColor: 'yellow' },
    { id: 'financeiro', label: 'Financeiro', icon: CircleDollarSign, hasChevron: true, badge: overdueCount > 0 ? `${overdueCount}` : null, badgeColor: 'red' },
    { id: 'treino', label: 'Treino', icon: Dumbbell, hasChevron: true },
    { id: 'bem_estar', label: 'Bem-Estar', icon: HeartPulse, hasChevron: true },
    { id: 'avaliacoes', label: 'Avaliações Físicas', icon: ClipboardCheck, hasChevron: true },
    { id: 'estoque', label: 'Estoque', icon: Package, hasChevron: false },
    { id: 'comandas', label: 'Lanchonete', icon: Coffee, hasChevron: false, badge: 'Aberta', badgeColor: 'green' },
    { id: 'nutricao', label: 'Nutrição', icon: Salad, hasChevron: true, badge: 'Em breve', badgeColor: 'yellow' },
    { id: 'relatorios', label: 'Relatórios', icon: FileText, hasChevron: false },
    { id: 'empresas_clientes', label: 'Empresas Clientes', icon: Building2, hasChevron: true },
    { id: 'configuracoes', label: 'Configurações', icon: Settings, hasChevron: false }
  ];

  // Filtra itens com base nas permissões de usuário (RBAC)
  const visibleItems = items.filter(item => hasTabPermission(item.id, currentUser));

  // Sub-aba ativa do módulo selecionado atualmente
  const activeGroup = groups[currentTab];
  const isCurrentSubCollapsed = !!collapsed[currentTab];

  // Handler de clique na seta do chevron
  const handleChevronClick = (e: React.MouseEvent, tabId: TabType) => {
    e.stopPropagation();
    if (currentTab === tabId) {
      // Aba já ativa: alterna recolher/expandir
      setCollapsed(prev => ({
        ...prev,
        [tabId]: !prev[tabId]
      }));
    } else {
      // Aba inativa: navega para a aba e garante que esteja expandida
      setCollapsed(prev => ({
        ...prev,
        [tabId]: false
      }));
      onTabChange(tabId);
    }
  };

  return (
    <nav 
      aria-label="Navegação Principal" 
      className="sticky top-14 sm:top-16 z-20 w-full bg-white border-b border-slate-200 shadow-2xs select-none"
    >
      {/* LINHA 1: Pílulas das Abas Principais com Rolagem Horizontal Suave */}
      <div className="flex items-center justify-between px-3 sm:px-5 gap-3 h-12">
        <div 
          ref={scrollContainerRef}
          role="tablist"
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-1 min-w-0 py-1"
        >
          {visibleItems.map(item => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            const hasSub = item.hasChevron && !!groups[item.id];
            const isSubCollapsed = !!collapsed[item.id];

            return (
              <div
                key={item.id}
                className="inline-flex items-center shrink-0"
              >
                <button
                  ref={isActive ? activeTabRef : null}
                  role="tab"
                  aria-selected={isActive}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onTabChange(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>

                  {/* Badges de Destaque Semântico */}
                  {item.badge && (
                    <span className={`inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-black leading-tight ${
                      item.badgeColor === 'red'
                        ? (isActive ? 'bg-rose-500 text-white' : 'bg-rose-600 text-white shadow-2xs')
                        : item.badgeColor === 'yellow'
                          ? (isActive ? 'bg-amber-400 text-amber-950' : 'bg-amber-100 text-amber-800')
                          : item.badgeColor === 'green'
                            ? (isActive ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800')
                            : (isActive ? 'bg-blue-400 text-blue-950' : 'bg-blue-100 text-blue-800')
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {/* Seta de Recolher / Expandir Sub-abas dentro da pílula */}
                  {hasSub && (
                    <span
                      role="button"
                      aria-label={`${isSubCollapsed ? 'Expandir' : 'Recolher'} sub-abas de ${item.label}`}
                      aria-expanded={isActive && !isSubCollapsed}
                      onClick={(e) => handleChevronClick(e, item.id)}
                      className={`ml-0.5 p-0.5 rounded-full hover:bg-black/10 transition-transform ${
                        isActive ? 'text-white/90' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {isActive && !isSubCollapsed ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>


      </div>

      {/* LINHA 2: Sub-abas Dinâmicas com Transição de Recolhimento */}
      {activeGroup && activeGroup.subs.length > 0 && (
        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out border-t border-slate-100 bg-slate-50/80 ${
            isCurrentSubCollapsed ? 'grid-rows-[0fr] opacity-0 pointer-events-none' : 'grid-rows-[1fr] opacity-100'
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 sm:px-5 py-2 overflow-x-auto no-scrollbar scroll-smooth">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 mr-1 shrink-0">
                Sub-abas:
              </span>
              {activeGroup.subs.map((sub: any) => {
                const isSubActive = activeGroup.current === sub.id;
                const SubIcon = sub.icon;

                return (
                  <button
                    key={sub.id}
                    onClick={() => activeGroup.onChange?.(sub.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                      isSubActive
                        ? 'bg-white text-blue-700 shadow-xs border border-blue-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    {SubIcon && (
                      <SubIcon className={`h-3 w-3 shrink-0 ${isSubActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    )}
                    <span>{sub.label}</span>

                    {/* Badge numérica ou informativa na sub-aba */}
                    {sub.badge && (
                      <span className={`inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        sub.badge === 'Recorrente'
                          ? 'bg-blue-100 text-blue-800'
                          : sub.badge === 'Novo'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.badge === 'Em breve'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-500 text-white' // Contagem de inadimplentes
                      }`}>
                        {sub.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
