import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, 
  Building2, 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  UserPlus, 
  Search, 
  Trash2, 
  Check, 
  Power, 
  Phone, 
  SlidersHorizontal,
  TrendingUp,
  UserCheck,
  GraduationCap,
  Share2,
  Calendar,
  MessageCircle,
  CircleDollarSign,
  Receipt,
  Dumbbell,
  Salad,
  HeartPulse,
  Package,
  FileText,
  Sparkles,
  Info,
  Clock,
  Layers,
  ArrowRight,
  Bell,
  ClipboardCheck,
  HardDrive,
  Download,
  FileJson,
  Database,
  ThumbsUp,
  ThumbsDown,
  Radio,
  ArrowLeft,
  LayoutGrid,
  ChevronRight,
  X
} from 'lucide-react';
import { 
  GymSettings, 
  Plan, 
  SystemUser, 
  SystemUserRole,
  Student,
  FinancialTransaction,
  WorkoutPlan,
  ClassSession,
  Product,
  Comanda,
  AccessLog,
  PayRecurringCharge,
  PaymentLink
} from '../../types';
import { TabType } from '../Sidebar';
import { NovoUsuarioModal } from '../modals/NovoUsuarioModal';
import { EditarUsuarioModal } from '../modals/EditarUsuarioModal';
import { getSystemUsers, saveSystemUsers, updateSystemUser } from '../../services/userService';
import { NotificacoesConfigView } from './configuracoes/NotificacoesConfigView';
import { BackupManualConfigView } from './configuracoes/BackupManualConfigView';
import { MigracoesConfigView } from './configuracoes/MigracoesConfigView';
import { 
  getTabConfiguration, 
  saveTabConfiguration, 
  resetTabConfiguration, 
  TabConfiguration, 
  TabConfigGroup, 
  TabConfigField,
  DEFAULT_TAB_CONFIGURATIONS
} from '../../services/tabSettingsService';

export type ConfigSubTab = 
  | 'geral'
  | 'notificacoes'
  | 'usuarios'
  | 'migracoes'
  | 'backup'
  | 'dashboards'
  | 'clientes'
  | 'professores'
  | 'crm'
  | 'agenda'
  | 'whatsapp'
  | 'financeiro'
  | 'treino'
  | 'bem_estar'
  | 'avaliacoes'
  | 'pay'
  | 'vendas'
  | 'nutricao'
  | 'catraca'
  | 'estoque'
  | 'relatorios';

interface SubTabItem {
  id: ConfigSubTab;
  label: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  targetTab: TabType;
  subSections?: { id: string; label: string }[];
}

const CONFIG_SUBTABS: SubTabItem[] = [
  {
    id: 'geral',
    label: 'Geral & Academia',
    category: 'Institucional',
    icon: Building2,
    description: 'Dados cadastrais da academia, CNPJ, Chave Pix, contatos e endereço',
    targetTab: 'inicio'
  },
  {
    id: 'notificacoes',
    label: 'Notificações',
    category: 'Alertas & Push',
    icon: Bell,
    description: 'Ativação e desativação de alertas push visuais para eventos do sistema',
    targetTab: 'configuracoes'
  },
  {
    id: 'usuarios',
    label: 'Usuários & Permissões',
    category: 'Acessos',
    icon: Users,
    description: 'Gestão de operadores, instrutores, recepcionistas e controle RBAC',
    targetTab: 'configuracoes'
  },
  {
    id: 'migracoes',
    label: 'Migrações',
    category: 'Inteligência & IA',
    icon: Sparkles,
    description: 'Upload de arquivos (planilhas, PDFs, fotos) com IA Gemini 3.5 Flash e vínculo automático com alunos',
    targetTab: 'configuracoes'
  },
  {
    id: 'backup',
    label: 'Backup & Dados',
    category: 'Segurança',
    icon: HardDrive,
    description: 'Exportação manual de todos os dados do aplicativo (alunos, transações, treinos) em arquivo JSON',
    targetTab: 'configuracoes'
  },
  {
    id: 'dashboards',
    label: 'Dashboards',
    category: 'Gestão',
    icon: TrendingUp,
    description: 'Metas mensais de faturamento, retenção, risco de churn e relatórios executivos',
    targetTab: 'dashboards',
    subSections: [
      { id: 'gerencial', label: 'Visão Gerencial' },
      { id: 'retencao', label: 'Retenção & Churn' }
    ]
  },
  {
    id: 'clientes',
    label: 'Clientes',
    category: 'Operacional',
    icon: UserCheck,
    description: 'Políticas de matrícula, validação de CPF, PAR-Q e carência de atraso',
    targetTab: 'clientes'
  },
  {
    id: 'professores',
    label: 'Professores',
    category: 'Equipe',
    icon: GraduationCap,
    description: 'Folha de ponto, tolerância CLT, banco de horas e escalas de turmas',
    targetTab: 'professores',
    subSections: [
      { id: 'folha_ponto', label: 'Folha de Ponto' },
      { id: 'tarefas', label: 'Tarefas & Checklists' },
      { id: 'agenda', label: 'Agenda & Escalas' }
    ]
  },
  {
    id: 'crm',
    label: 'CRM',
    category: 'Comercial',
    icon: Share2,
    description: 'Gestão de leads, SLA de primeiro contato, rodízio e automações',
    targetTab: 'crm',
    subSections: [
      { id: 'leads', label: 'Funil de Leads' }
    ]
  },
  {
    id: 'agenda',
    label: 'Agenda',
    category: 'Aulas & Eventos',
    icon: Calendar,
    description: 'Duração padrão das aulas, prazos de cancelamento e limites de turmas',
    targetTab: 'agenda',
    subSections: [
      { id: 'calendario', label: 'Grade & Calendário' }
    ]
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    category: 'Comunicação',
    icon: MessageCircle,
    description: 'Robô de atendimento, delay anti-spam e mensagens automáticas (Em breve • Fase 2)',
    targetTab: 'whatsapp'
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    category: 'Controladoria',
    icon: CircleDollarSign,
    description: 'Multas por atraso, juros diários de mora, régua de cobrança e GL Profit Pay',
    targetTab: 'financeiro',
    subSections: [
      { id: 'receber', label: 'Contas a Receber' },
      { id: 'gl_profit_pay', label: 'GL Profit Pay (Recorrência)' }
    ]
  },
  {
    id: 'treino',
    label: 'Treinos',
    category: 'Prescrição',
    icon: Dumbbell,
    description: 'Validade de fichas de treino, cálculo de 1RM e periodização esportiva',
    targetTab: 'treino',
    subSections: [
      { id: 'plano_treino', label: 'Plano de Treino' },
      { id: 'prescricao', label: 'Prescrição & Fichas' }
    ]
  },
  {
    id: 'bem_estar',
    label: 'Bem-Estar',
    category: 'Saúde & Prontidão',
    icon: HeartPulse,
    description: 'Limiares de dor na Escala EVA, pontuação do Índice Hooper e matriz do elenco',
    targetTab: 'bem_estar',
    subSections: [
      { id: 'checkin', label: 'Check-in & Prontidão' },
      { id: 'elenco_hooper', label: 'Matriz do Elenco' }
    ]
  },
  {
    id: 'avaliacoes',
    label: 'Avaliações Físicas',
    category: 'Saúde & Avaliação',
    icon: ClipboardCheck,
    description: 'Protocolos de dobras (Pollock), perimetria, bioimpedância, testes e biometria inicial',
    targetTab: 'avaliacoes',
    subSections: [
      { id: 'avaliacoes', label: 'Protocolos de Avaliação' }
    ]
  },
  {
    id: 'vendas',
    label: 'Vendas & PDV',
    category: 'Comercial',
    icon: Receipt,
    description: 'Políticas de desconto no caixa, comandas e limites de débito por aluno',
    targetTab: 'vendas',
    subSections: [
      { id: 'vendas', label: 'PDV & Balcão' },
      { id: 'comandas', label: 'Comandas & Lanchonete' }
    ]
  },
  {
    id: 'nutricao',
    label: 'Nutrição',
    category: 'Saúde',
    icon: Salad,
    description: 'Fórmulas de Taxa Metabólica Basal (TMB) e metas hídricas diárias',
    targetTab: 'nutricao'
  },
  {
    id: 'catraca',
    label: 'Catraca & Acesso',
    category: 'Portaria',
    icon: ShieldCheck,
    description: 'Tolerância de atraso, bloqueio automático e tempo de abertura do relé',
    targetTab: 'catraca'
  },
  {
    id: 'estoque',
    label: 'Estoque',
    category: 'Materiais',
    icon: Package,
    description: 'Estoque mínimo de alerta para reposição urgente e margens sobre custo',
    targetTab: 'estoque'
  },
  {
    id: 'relatorios',
    label: 'Relatórios',
    category: 'Auditoria',
    icon: FileText,
    description: 'Logotipos nos documentos PDF timbrados e dados fiscais no rodapé',
    targetTab: 'relatorios'
  }
];

export const getSubTabColors = (id: ConfigSubTab) => {
  switch (id) {
    case 'notificacoes':
      return {
        iconBg: 'bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white',
        border: 'border-purple-200/90 hover:border-purple-500 hover:ring-2 hover:ring-purple-500/20',
        badgeBg: 'bg-purple-100 text-purple-800',
        badge: 'PUSH'
      };
    case 'migracoes':
      return {
        iconBg: 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white',
        border: 'border-emerald-300 hover:border-emerald-500 ring-1 ring-emerald-500/30 hover:ring-2 hover:ring-emerald-500/30',
        badgeBg: 'bg-emerald-600 text-white',
        badge: 'IA GEMINI 3.5'
      };
    case 'usuarios':
      return {
        iconBg: 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white',
        border: 'border-indigo-200/90 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500/20',
        badgeBg: 'bg-indigo-100 text-indigo-800',
        badge: 'EQUIPE'
      };
    case 'geral':
      return {
        iconBg: 'bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white',
        border: 'border-blue-200/90 hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20',
        badgeBg: 'bg-blue-100 text-blue-800',
        badge: 'ACADEMIA'
      };
    case 'backup':
      return {
        iconBg: 'bg-slate-100 text-slate-700 group-hover:bg-slate-800 group-hover:text-white',
        border: 'border-slate-200/90 hover:border-slate-500 hover:ring-2 hover:ring-slate-500/20',
        badgeBg: 'bg-slate-100 text-slate-700',
        badge: 'JSON'
      };
    case 'catraca':
      return {
        iconBg: 'bg-cyan-100 text-cyan-700 group-hover:bg-cyan-600 group-hover:text-white',
        border: 'border-cyan-200/90 hover:border-cyan-500 hover:ring-2 hover:ring-cyan-500/20',
        badgeBg: 'bg-cyan-100 text-cyan-800',
        badge: 'PORTARIA'
      };
    case 'financeiro':
      return {
        iconBg: 'bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white',
        border: 'border-amber-200/90 hover:border-amber-500 hover:ring-2 hover:ring-amber-500/20',
        badgeBg: 'bg-amber-100 text-amber-800',
        badge: 'FINANÇAS'
      };
    case 'agenda':
      return {
        iconBg: 'bg-teal-100 text-teal-700 group-hover:bg-teal-600 group-hover:text-white',
        border: 'border-teal-200/90 hover:border-teal-500 hover:ring-2 hover:ring-teal-500/20',
        badgeBg: 'bg-teal-100 text-teal-800',
        badge: 'GRADE'
      };
    case 'treino':
      return {
        iconBg: 'bg-orange-100 text-orange-700 group-hover:bg-orange-600 group-hover:text-white',
        border: 'border-orange-200/90 hover:border-orange-500 hover:ring-2 hover:ring-orange-500/20',
        badgeBg: 'bg-orange-100 text-orange-800',
        badge: 'FICHAS'
      };
    case 'avaliacoes':
      return {
        iconBg: 'bg-lime-100 text-lime-700 group-hover:bg-lime-600 group-hover:text-white',
        border: 'border-lime-200/90 hover:border-lime-500 hover:ring-2 hover:ring-lime-500/20',
        badgeBg: 'bg-lime-100 text-lime-800',
        badge: 'LAUDOS'
      };
    case 'nutricao':
      return {
        iconBg: 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white',
        border: 'border-emerald-200/90 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/20',
        badgeBg: 'bg-emerald-100 text-emerald-800',
        badge: 'DIETAS'
      };
    case 'dashboards':
      return {
        iconBg: 'bg-sky-100 text-sky-700 group-hover:bg-sky-600 group-hover:text-white',
        border: 'border-sky-200/90 hover:border-sky-500 hover:ring-2 hover:ring-sky-500/20',
        badgeBg: 'bg-sky-100 text-sky-800',
        badge: 'BI'
      };
    case 'clientes':
      return {
        iconBg: 'bg-teal-100 text-teal-700 group-hover:bg-teal-600 group-hover:text-white',
        border: 'border-teal-200/90 hover:border-teal-500 hover:ring-2 hover:ring-teal-500/20',
        badgeBg: 'bg-teal-100 text-teal-800',
        badge: 'ALUNOS'
      };
    case 'professores':
      return {
        iconBg: 'bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white',
        border: 'border-blue-200/90 hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20',
        badgeBg: 'bg-blue-100 text-blue-800',
        badge: 'EQUIPE'
      };
    case 'crm':
      return {
        iconBg: 'bg-violet-100 text-violet-700 group-hover:bg-violet-600 group-hover:text-white',
        border: 'border-violet-200/90 hover:border-violet-500 hover:ring-2 hover:ring-violet-500/20',
        badgeBg: 'bg-violet-100 text-violet-800',
        badge: 'LEADS'
      };
    case 'whatsapp':
      return {
        iconBg: 'bg-green-100 text-green-700 group-hover:bg-green-600 group-hover:text-white',
        border: 'border-green-200/90 hover:border-green-500 hover:ring-2 hover:ring-green-500/20',
        badgeBg: 'bg-green-100 text-green-800',
        badge: 'ROBÔ'
      };
    case 'bem_estar':
      return {
        iconBg: 'bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white',
        border: 'border-rose-200/90 hover:border-rose-500 hover:ring-2 hover:ring-rose-500/20',
        badgeBg: 'bg-rose-100 text-rose-800',
        badge: 'HOOPER'
      };
    case 'vendas':
      return {
        iconBg: 'bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white',
        border: 'border-amber-200/90 hover:border-amber-500 hover:ring-2 hover:ring-amber-500/20',
        badgeBg: 'bg-amber-100 text-amber-800',
        badge: 'PDV'
      };
    case 'estoque':
      return {
        iconBg: 'bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white',
        border: 'border-amber-200/90 hover:border-amber-500 hover:ring-2 hover:ring-amber-500/20',
        badgeBg: 'bg-amber-100 text-amber-800',
        badge: 'ESTOQUE'
      };
    case 'relatorios':
      return {
        iconBg: 'bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white',
        border: 'border-slate-200/90 hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20',
        badgeBg: 'bg-slate-100 text-slate-700',
        badge: 'RELATÓRIOS'
      };
    default:
      return {
        iconBg: 'bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white',
        border: 'border-slate-200/90 hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20',
        badgeBg: 'bg-slate-100 text-slate-700',
        badge: undefined
      };
  }
};

interface ConfiguracoesTabProps {
  settings: GymSettings;
  plans: Plan[];
  onSaveSettings: (newSettings: GymSettings) => void;
  onResetToDemo: () => void;
  currentUser?: SystemUser | null;
  onUpdateCurrentUser?: (user: SystemUser) => void;
  initialSubTab?: ConfigSubTab;
  students?: Student[];
  transactions?: FinancialTransaction[];
  workouts?: WorkoutPlan[];
  classes?: ClassSession[];
  products?: Product[];
  comandas?: Comanda[];
  accessLogs?: AccessLog[];
  recurringCharges?: PayRecurringCharge[];
  paymentLinks?: PaymentLink[];
  onImportStudents?: (imported: Student[]) => void;
  onImportTransactions?: (imported: FinancialTransaction[]) => void;
  onImportWorkouts?: (imported: WorkoutPlan[]) => void;
}

export const ConfiguracoesTab: React.FC<ConfiguracoesTabProps> = ({
  settings,
  plans,
  onSaveSettings,
  onResetToDemo,
  currentUser,
  onUpdateCurrentUser,
  initialSubTab = 'geral',
  students,
  transactions,
  workouts,
  classes,
  products,
  comandas,
  accessLogs,
  recurringCharges,
  paymentLinks,
  onImportStudents,
  onImportTransactions,
  onImportWorkouts
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ConfigSubTab>(initialSubTab);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isViewingModule, setIsViewingModule] = useState<boolean>(() => {
    return !!initialSubTab && initialSubTab !== 'geral';
  });
  
  // Gym Settings Form State
  const [formData, setFormData] = useState<GymSettings>({ ...settings });
  
  // Tab Configurations State (from tabSettingsService)
  const [currentConfig, setCurrentConfig] = useState<TabConfiguration | null>(null);
  
  // Feedback Messages
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);
  
  // System Users State
  const [users, setUsers] = useState<SystemUser[]>(() => getSystemUsers());
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isNovoUsuarioModalOpen, setIsNovoUsuarioModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<SystemUser | null>(null);

  useEffect(() => {
    saveSystemUsers(users);
  }, [users]);

  // Keep formData in sync if settings prop changes externally
  useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  // Synchronize activeSubTab if initialSubTab prop changes
  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
      const subItem = CONFIG_SUBTABS.find(s => s.id === initialSubTab);
      setActiveSectionId(subItem?.subSections?.[0]?.id || '');
      if (initialSubTab !== 'geral') {
        setIsViewingModule(true);
      }
    }
  }, [initialSubTab]);

  // Escape key returns to modules grid
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isViewingModule) {
        setIsViewingModule(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isViewingModule]);

  const handleSelectModule = (subId: ConfigSubTab) => {
    setActiveSubTab(subId);
    const subItem = CONFIG_SUBTABS.find(s => s.id === subId);
    setActiveSectionId(subItem?.subSections?.[0]?.id || '');
    setIsViewingModule(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGrid = () => {
    setIsViewingModule(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredSubTabs = useMemo(() => {
    if (!searchFilter.trim()) return CONFIG_SUBTABS;
    const q = searchFilter.toLowerCase();
    return CONFIG_SUBTABS.filter(sub => {
      return (
        sub.label.toLowerCase().includes(q) ||
        sub.description.toLowerCase().includes(q) ||
        sub.category.toLowerCase().includes(q) ||
        (sub.subSections && sub.subSections.some(sec => sec.label.toLowerCase().includes(q)))
      );
    });
  }, [searchFilter]);

  const activeSubTabItem = useMemo(() => {
    return CONFIG_SUBTABS.find(t => t.id === activeSubTab) || CONFIG_SUBTABS[0];
  }, [activeSubTab]);

  // Load configuration for the selected sub-tab
  useEffect(() => {
    const subSection = activeSectionId || (activeSubTabItem.subSections?.[0]?.id);
    const targetTab = activeSubTabItem.targetTab;
    
    // For general/usuarios/backup/migracoes/notificacoes, handled by dedicated forms
    if (activeSubTab === 'geral' || activeSubTab === 'usuarios' || activeSubTab === 'backup' || activeSubTab === 'migracoes' || activeSubTab === 'notificacoes') {
      setCurrentConfig(null);
      return;
    }

    if (activeSubTab === 'vendas' && subSection === 'comandas') {
      setCurrentConfig(getTabConfiguration('comandas'));
      return;
    }

    const cfg = getTabConfiguration(targetTab, subSection);
    setCurrentConfig(cfg);
  }, [activeSubTab, activeSectionId, activeSubTabItem]);

  const showNotification = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers for Gym Identity Form
  const handleSaveGymSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    showNotification('Dados da Academia (VB SPORT ADM) salvos com sucesso!');
  };

  // Handlers for Tab Settings Config Fields
  const handleFieldChange = (groupId: string, fieldId: string, newValue: any) => {
    if (!currentConfig) return;
    
    const updatedGroups = currentConfig.groups.map(group => {
      if (group.id !== groupId) return group;
      return {
        ...group,
        fields: group.fields.map(field => {
          if (field.id !== fieldId) return field;
          return { ...field, value: newValue };
        })
      };
    });

    const updatedConfig = { ...currentConfig, groups: updatedGroups };
    setCurrentConfig(updatedConfig);

    // Sync with catraca formData if editing catraca rules
    if (activeSubTab === 'catraca') {
      if (fieldId === 'tempo_rele_segundos') {
        // saved in config
      }
    }
  };

  const handleSaveCurrentModuleConfig = () => {
    if (!currentConfig) return;
    saveTabConfiguration(currentConfig);

    // If on catraca, also save turnstile settings
    if (activeSubTab === 'catraca') {
      onSaveSettings(formData);
    }

    showNotification(`Configurações de "${activeSubTabItem.label}" salvas com sucesso!`);
  };

  const handleResetCurrentModuleConfig = () => {
    const subSection = activeSectionId || (activeSubTabItem.subSections?.[0]?.id);
    const targetTab = activeSubTab === 'vendas' && subSection === 'comandas' ? 'comandas' : activeSubTabItem.targetTab;
    const restored = resetTabConfiguration(targetTab, subSection);
    setCurrentConfig(restored);
    showNotification(`Valores originais de "${activeSubTabItem.label}" restaurados.`, 'info');
  };

  // User Management Handlers
  const handleAddUser = (newUserData: Omit<SystemUser, 'id' | 'createdAt'>) => {
    const newUser: SystemUser = {
      ...newUserData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      lastLogin: 'Nunca acessou'
    };
    setUsers(prev => [newUser, ...prev]);
    showNotification(`Usuário "${newUser.name}" cadastrado com sucesso!`);
  };

  const handleSaveEditedUser = (updatedUser: SystemUser) => {
    updateSystemUser(updatedUser.id, updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (onUpdateCurrentUser && currentUser && (currentUser.id === updatedUser.id || currentUser.email.toLowerCase() === updatedUser.email.toLowerCase())) {
      onUpdateCurrentUser(updatedUser);
    }
    showNotification(`Permissões de "${updatedUser.name}" atualizadas!`);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = !u.active;
        showNotification(`Status de "${u.name}" alterado para ${nextStatus ? 'Ativo' : 'Inativo'}.`, 'info');
        return { ...u, active: nextStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Deseja realmente remover o acesso do usuário "${userName}"?`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      showNotification(`Usuário "${userName}" removido do sistema.`, 'info');
    }
  };

  const filteredUsers = users.filter(u => {
    if (!userSearchTerm.trim()) return true;
    const q = userSearchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.department && u.department.toLowerCase().includes(q))
    );
  });

  const getRoleBadge = (role: SystemUserRole) => {
    switch (role) {
      case 'admin':
        return { label: 'ADMINISTRADOR', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'gerente':
        return { label: 'GERENTE', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'treinador':
        return { label: 'TREINADOR / PROFESSOR', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'recepcao':
        return { label: 'RECEPÇÃO / PDV', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'financeiro':
        return { label: 'FINANCEIRO', bg: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      default:
        return { label: 'OPERADOR', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  // Filtered configurations for search box
  const filteredGroups = useMemo(() => {
    if (!currentConfig) return [];
    if (!searchFilter.trim()) return currentConfig.groups;

    const term = searchFilter.toLowerCase();
    return currentConfig.groups
      .map(group => {
        const matchesGroup = group.title.toLowerCase().includes(term) || group.description.toLowerCase().includes(term);
        const matchedFields = group.fields.filter(
          f => f.label.toLowerCase().includes(term) || f.description.toLowerCase().includes(term)
        );

        if (matchesGroup) return group;
        if (matchedFields.length > 0) return { ...group, fields: matchedFields };
        return null;
      })
      .filter((g): g is TabConfigGroup => g !== null);
  }, [currentConfig, searchFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {!isViewingModule ? (
        <>
          {/* Main Settings Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-black shadow-inner">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Central de Configurações
                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                      {CONFIG_SUBTABS.length} Módulos
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Controle integral de parâmetros, regras de negócios, tolerâncias e permissões de todas as abas
                  </p>
                </div>
              </div>
            </div>

            {/* Global Search across square blocks */}
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Buscar nos módulos..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-hidden transition-all shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* GRID EXCLUSIVO DE BLOCOS QUADRADOS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4.5">
            {filteredSubTabs.map((sub) => {
              const Icon = sub.icon;
              const colors = getSubTabColors(sub.id);
              const isLastActive = activeSubTab === sub.id;

              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleSelectModule(sub.id)}
                  className={`aspect-square p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between items-center text-center group relative overflow-hidden bg-white shadow-2xs hover:shadow-xl hover:-translate-y-1 text-left ${
                    isLastActive 
                      ? 'border-blue-500 ring-2 ring-blue-500/20 bg-gradient-to-b from-blue-50/40 via-white to-white' 
                      : colors.border
                  }`}
                >
                  {/* Top: Category Tag + Badge */}
                  <div className="w-full flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 truncate max-w-[70%]">
                      {sub.category}
                    </span>
                    {colors.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${colors.badgeBg}`}>
                        {colors.badge}
                      </span>
                    )}
                  </div>

                  {/* Center: Icon and Title */}
                  <div className="my-auto flex flex-col items-center">
                    <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-xs ${colors.iconBg}`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                    </div>
                    <h3 className="mt-2 text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                      {sub.label}
                    </h3>
                  </div>

                  {/* Bottom: Action CTA */}
                  <div className="w-full flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors pt-1 border-t border-slate-100">
                    <span>{isLastActive ? 'Ativo' : 'Configurar'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-slate-400 group-hover:text-blue-600" />
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        /* TELA PRINCIPAL DO MÓDULO SELECIONADO (ATUALIZA A TELA PRINCIPAL INTEIRA, SEM CARD SOBREPOSTO) */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header da Tela do Módulo com Botões de Voltar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleBackToGrid}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all hover:-translate-x-0.5 cursor-pointer active:scale-98"
                title="Voltar para a grade de configurações (Esc)"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar aos Módulos</span>
              </button>
              
              <div className="h-6 w-px bg-slate-200 hidden sm:block" />
              
              <div className="flex items-center gap-2.5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold shadow-xs ${getSubTabColors(activeSubTab).iconBg}`}>
                  <activeSubTabItem.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      {activeSubTabItem.label}
                    </h2>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {activeSubTabItem.category}
                    </span>
                    {getSubTabColors(activeSubTab).badge && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${getSubTabColors(activeSubTab).badgeBg}`}>
                        {getSubTabColors(activeSubTab).badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {activeSubTabItem.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleBackToGrid}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer text-xs font-bold shadow-2xs"
                title="Voltar para a grade de configurações (Esc)"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            </div>
          </div>

          {/* Sub-divisões se o módulo possuir */}
          {activeSubTabItem.subSections && activeSubTabItem.subSections.length > 1 && (
            <div className="flex items-center gap-2 p-2 bg-slate-100/90 rounded-2xl border border-slate-200 overflow-x-auto custom-scrollbar">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-2 shrink-0">
                Divisões:
              </span>
              {activeSubTabItem.subSections.map(sec => {
                const isSecActive = (activeSectionId || activeSubTabItem.subSections![0].id) === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isSecActive ? 'bg-blue-600 text-white shadow-2xs' : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200/80'
                    }`}
                  >
                    {sec.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Conteúdo Central do Módulo */}
          <div className="space-y-6">

      {/* 1. GERAL & ACADEMIA */}
      {activeSubTab === 'geral' && (
        <form onSubmit={handleSaveGymSettings} className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Dados Cadastrais da Academia (VB SPORT ADM)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Informações institucionais emitidas em contratos, recibos e canais de cobrança
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome Fantasia (Exibição no Sistema)
                </label>
                <input
                  type="text"
                  value={formData.tradeName}
                  onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Razão Social Completa
                </label>
                <input
                  type="text"
                  value={formData.gymName}
                  onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  CNPJ
                </label>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chave PIX Oficial (Recebimentos)
                </label>
                <input
                  type="text"
                  value={formData.pixKey}
                  onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Telefone / WhatsApp Comercial
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Endereço da Unidade
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Card de Acesso Rápido ao Backup Manual (Para Administradores) */}
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/30 to-slate-50 p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0 shadow-xs">
                  <HardDrive className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Backup Manual do Aplicativo (Arquivo JSON)
                    </h3>
                    <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Exportação
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Permite aos administradores gerar e baixar um arquivo JSON com todos os dados da academia (alunos, transações, treinos e cadastros).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveSubTab('backup')}
                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Central de Backup JSON</span>
              </button>
            </div>
          </div>

          {/* Action Buttons for Geral */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onResetToDemo}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            >
              <RotateCcw className="h-4 w-4 text-slate-500" />
              Restaurar Dados Padrão (Demo)
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Salvar Dados da Academia
            </button>
          </div>
        </form>
      )}

      {/* 2. NOTIFICAÇÕES & ALERTAS PUSH */}
      {activeSubTab === 'notificacoes' && (
        <NotificacoesConfigView />
      )}

      {/* 3. USUÁRIOS & PERMISSÕES */}
      {activeSubTab === 'usuarios' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    Controle de Acessos & Usuários Autorizados
                  </h2>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold">
                    {users.filter(u => u.active).length} ativos
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Gerencie operadores, professores, recepcionistas e defina quais abas cada um pode acessar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  placeholder="Buscar usuário..."
                  className="w-40 sm:w-48 rounded-xl border border-slate-200 pl-7 pr-2.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
                />
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>

              <button
                type="button"
                onClick={() => setIsNovoUsuarioModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <UserPlus className="h-4 w-4" />
                <span>Novo Usuário</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Nenhum usuário encontrado para "{userSearchTerm}".
              </div>
            ) : (
              filteredUsers.map((u) => {
                const badge = getRoleBadge(u.role);
                const isCurrentSession = currentUser 
                  ? (u.id === currentUser.id || u.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase())
                  : u.email.trim().toLowerCase() === 'marinho.gianluca@gmail.com';

                return (
                  <div key={u.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl px-2 transition-colors">
                    <div className="flex items-start sm:items-center gap-3">
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                          {u.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">
                            {u.name}
                          </span>
                          <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${badge.bg}`}>
                            {badge.label}
                          </span>
                          {isCurrentSession && (
                            <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 font-bold text-[10px]">
                              Sessão Atual
                            </span>
                          )}
                          <span className={`rounded-full px-2 py-0.5 font-bold text-[10px] ${u.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                            {u.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs text-slate-500">
                          <span className="font-mono text-slate-600">{u.email}</span>
                          {u.phone && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <Phone className="h-3 w-3" />
                              {u.phone}
                            </span>
                          )}
                          {u.department && (
                            <span className="text-slate-400">
                              • {u.department}
                            </span>
                          )}
                          <span className="text-blue-700 font-semibold">
                            • {u.permissions?.length || 0} módulos liberados
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUserToEdit(u);
                          setIsEditarModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50/70 px-2.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                        title="Editar permissões modulares do usuário"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        <span>Editar Permissões</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors border ${
                          u.active 
                            ? 'border-slate-200 text-slate-600 hover:bg-slate-100' 
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                        title={u.active ? 'Desativar acesso temporariamente' : 'Ativar acesso'}
                      >
                        <Power className="h-3.5 w-3.5" />
                        <span>{u.active ? 'Desativar' : 'Ativar'}</span>
                      </button>

                      {!isCurrentSession && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Excluir usuário"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 3. CATRACA: Dedicated core controls + dynamic hardware rules */}
      {activeSubTab === 'catraca' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Políticas de Bloqueio Automático na Catraca
                </h2>
                <p className="text-xs text-slate-500">
                  Regras financeiras para liberação de giro e bloqueio de inadimplentes
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dias de Tolerância de Atraso (Carência)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={formData.gracePeriodDays}
                  onChange={(e) => setFormData({ ...formData, gracePeriodDays: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Alunos com mensalidade vencida há mais dias do que este limite terão o giro bloqueado.
                </p>
              </div>

              <div className="flex items-center pt-2 md:pt-6">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-50 border border-slate-200 w-full hover:bg-blue-50/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.autoBlockOverdue}
                    onChange={(e) => setFormData({ ...formData, autoBlockOverdue: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Bloqueio Automático Ativado
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Gira a catraca somente para alunos adimplentes ou com liberação manual expressa da recepção.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MIGRAÇÕES & IMPORTAÇÃO DE ARQUIVOS (IA GEMINI 3.5 FLASH) */}
      {activeSubTab === 'migracoes' && (
        <MigracoesConfigView
          students={students || []}
          plans={plans || []}
          currentUser={currentUser}
          onImportStudents={onImportStudents}
          onImportTransactions={onImportTransactions}
          onImportWorkouts={onImportWorkouts}
          onShowNotification={showNotification}
        />
      )}

      {/* 5. BACKUP MANUAL & EXPORTAÇÃO JSON (ÁREA DO ADMINISTRADOR) */}
      {activeSubTab === 'backup' && (
        <BackupManualConfigView
          currentUser={currentUser}
          settings={settings}
          plans={plans}
          students={students}
          transactions={transactions}
          workouts={workouts}
          classes={classes}
          products={products}
          comandas={comandas}
          accessLogs={accessLogs}
          recurringCharges={recurringCharges}
          paymentLinks={paymentLinks}
          onShowNotification={showNotification}
        />
      )}

      {/* DYNAMIC CONFIGURATION GROUPS (FOR ALL MODULES) */}
      {currentConfig && (
        <div className="space-y-6">
          {/* Header of Active Tab Module */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
                <activeSubTabItem.icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {currentConfig.title}
                </h2>
                <p className="text-xs text-slate-500">
                  {currentConfig.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={handleResetCurrentModuleConfig}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Restaurar valores de fábrica deste módulo"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Restaurar Padrões</span>
              </button>

              <button
                type="button"
                onClick={handleSaveCurrentModuleConfig}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer"
                title="Salvar alterações deste módulo"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>

          {/* Groups list */}
          {filteredGroups.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-xs">
              Nenhum parâmetro encontrado para o filtro "{searchFilter}".
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.id} className="rounded-2xl bg-white border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>{group.title}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {group.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-1">
                  {group.fields.map((field) => (
                    <div 
                      key={field.id}
                      className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5 min-w-0">
                          <label className="text-xs font-bold text-slate-800 block">
                            {field.label}
                          </label>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {field.description}
                          </p>
                        </div>

                        {/* TOGGLE INPUT */}
                        {field.type === 'toggle' && (
                          <button
                            type="button"
                            onClick={() => handleFieldChange(group.id, field.id, !field.value)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                              field.value ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                field.value ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Preview interativo para Presença Automática via Catraca */}
                      {field.id === 'presenca_automatica_catraca' && (
                        <div className={`mt-2 p-3 rounded-xl border text-xs transition-all ${
                          field.value 
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 ring-1 ring-emerald-500/20' 
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}>
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1.5">
                              <Radio className={`w-3.5 h-3.5 ${field.value ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
                              <span>{field.value ? 'Sincronização Automática Ativa' : 'Sincronização Desativada'}</span>
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              field.value ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                            }`}>
                              {field.value ? 'AUTOMÁTICO' : 'MANUAL'}
                            </span>
                          </div>
                          <p className="mt-1.5 text-[11px] opacity-90 leading-relaxed">
                            {field.value 
                              ? 'Ao ter a entrada autorizada na catraca, o aluno recebe presença imediata com status "Presente (Catraca)" na turma agendada, sem necessidade de marcação manual do professor.'
                              : 'A catraca registrará apenas o acesso físico na portaria. O professor deverá efetuar a chamada manualmente na Agenda (usando o sinal de dedão 👍/👎 ou o botão tradicional).'}
                          </p>
                        </div>
                      )}

                      {/* NUMBER INPUT */}
                      {field.type === 'number' && (
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="number"
                            value={field.value}
                            onChange={(e) => handleFieldChange(group.id, field.id, Number(e.target.value))}
                            className="w-32 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                          />
                          {field.unit && (
                            <span className="text-xs font-semibold text-slate-500 bg-slate-200/60 px-2 py-1 rounded-md">
                              {field.unit}
                            </span>
                          )}
                        </div>
                      )}

                      {/* SELECT INPUT */}
                      {field.type === 'select' && (
                        <div className="pt-1 space-y-2">
                          <select
                            value={field.value}
                            onChange={(e) => handleFieldChange(group.id, field.id, e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden cursor-pointer"
                          >
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>

                          {/* Preview Interativo para Modo de Chamada da Turma */}
                          {field.id === 'modo_chamada_professor' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleFieldChange(group.id, field.id, 'dedao')}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  field.value === 'dedao'
                                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/30'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                                    <span>Sinal de Dedão</span>
                                  </span>
                                  {field.value === 'dedao' && (
                                    <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                                      Ativo
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-2">
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1">
                                    <ThumbsUp className="w-2.5 h-2.5 fill-white" /> Presença
                                  </span>
                                  <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1">
                                    <ThumbsDown className="w-2.5 h-2.5 fill-white" /> Falta
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">
                                  Professor avalia com dedão pra cima (presença) ou pra baixo (falta).
                                </p>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleFieldChange(group.id, field.id, 'tradicional')}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  field.value === 'tradicional'
                                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/30'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Tradicional</span>
                                  </span>
                                  {field.value === 'tradicional' && (
                                    <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                                      Ativo
                                    </span>
                                  )}
                                </div>
                                <div className="mt-2">
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold inline-block">
                                    Confirmar Presença
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">
                                  Botão clássico de check-in para marcar presença na turma.
                                </p>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* TEXT INPUT */}
                      {field.type === 'text' && (
                        <div className="pt-1">
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => handleFieldChange(group.id, field.id, e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500">
              Módulo ativo: <strong className="text-slate-800">{activeSubTabItem.label}</strong>
            </span>

            <button
              type="button"
              onClick={handleSaveCurrentModuleConfig}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações de {activeSubTabItem.label}</span>
            </button>
          </div>
        </div>
      )}

          </div>

          {/* Rodapé da Tela do Módulo com Botão de Voltar aos Módulos */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs mt-6">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="hidden sm:inline">Configurações sincronizadas em tempo real com o sistema GL PRO FIT.</span>
              <span className="sm:hidden">Sincronizado em tempo real.</span>
            </div>
            
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleBackToGrid}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 shadow-2xs transition-all active:scale-98 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar aos Módulos</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals for User Management */}
      <NovoUsuarioModal
        isOpen={isNovoUsuarioModalOpen}
        onClose={() => setIsNovoUsuarioModalOpen(false)}
        onAddUser={handleAddUser}
      />

      <EditarUsuarioModal
        isOpen={isEditarModalOpen}
        user={selectedUserToEdit}
        onClose={() => {
          setIsEditarModalOpen(false);
          setSelectedUserToEdit(null);
        }}
        onSaveUser={handleSaveEditedUser}
      />
    </div>
  );
};
