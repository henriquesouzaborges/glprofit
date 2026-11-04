import { SystemUser, SystemUserRole } from '../types';

export const INITIAL_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'usr-1',
    name: 'Gianluca Marinho',
    email: 'marinho.gianluca@gmail.com',
    role: 'admin',
    phone: '(11) 98765-4321',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    department: 'Diretoria Executiva',
    active: true,
    createdAt: '2026-01-10',
    lastLogin: 'Hoje, 08:15',
    password: 'admin@glprofit',
    permissions: [
      'inicio', 'dashboards', 'alunos', 'professores', 'treinos', 'avaliacoes', 'nutricao', 'bem_estar', 'agenda', 
      'catraca', 'financeiro', 'pay', 'vendas', 'comandas', 'estoque', 
      'crm', 'whatsapp', 'relatorios', 'configuracoes'
    ]
  },
  {
    id: 'usr-2',
    name: 'Recepção Matriz (Turno Diurno)',
    email: 'recepcao@vbsport.com.br',
    role: 'recepcao',
    phone: '(11) 97123-4567',
    department: 'Atendimento & PDV',
    active: true,
    createdAt: '2026-02-01',
    lastLogin: 'Hoje, 07:00',
    password: 'recepcao@123',
    permissions: ['inicio', 'alunos', 'agenda', 'catraca', 'vendas', 'comandas', 'whatsapp', 'configuracoes']
  },
  {
    id: 'usr-3',
    name: 'Prof. Rodrigo Tavares',
    email: 'rodrigo.tavares@vbsport.com.br',
    role: 'treinador',
    phone: '(11) 98222-1144',
    department: 'Musculação & Avaliações',
    active: true,
    createdAt: '2026-03-15',
    lastLogin: 'Ontem, 19:40',
    password: 'treino@123',
    permissions: ['inicio', 'alunos', 'treinos', 'avaliacoes', 'nutricao', 'bem_estar', 'agenda', 'configuracoes']
  },
  {
    id: 'usr-4',
    name: 'Amanda Souza',
    email: 'financeiro@vbsport.com.br',
    role: 'financeiro',
    phone: '(11) 99333-8822',
    department: 'Controladoria & Contas',
    active: true,
    createdAt: '2026-04-10',
    lastLogin: '21/09/2026',
    password: 'financeiro@123',
    permissions: ['inicio', 'alunos', 'financeiro', 'pay', 'vendas', 'comandas', 'estoque', 'relatorios', 'configuracoes']
  }
];

const STORAGE_KEY = 'vbsport_system_users';
const ACTIVE_USER_KEY = 'vbsport_active_user';

export const getSystemUsers = (): SystemUser[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filtrar e purgar usuários falsos/não cadastrados que foram criados automaticamente pelo bug anterior
        const cleaned = parsed.filter(u => {
          const isSpuriousDummy = 
            u.lastLogin === 'Agora' && 
            (u.department === 'Instrutores & Treinadores' || u.department === 'Atendimento & Geral') &&
            u.email !== 'marinho.gianluca@gmail.com' &&
            !u.phone;
          return !isSpuriousDummy;
        });
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
        }
        return cleaned.length > 0 ? cleaned : INITIAL_SYSTEM_USERS;
      }
    }
  } catch (e) {
    console.error('Erro ao ler usuários do sistema:', e);
  }
  // Initialize with defaults if empty
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SYSTEM_USERS));
  return INITIAL_SYSTEM_USERS;
};

export const saveSystemUsers = (users: SystemUser[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    // Sincronizar assincronamente com o banco de dados Firebase Firestore
    import('./firebaseDbService').then(({ syncCollectionToFirestore }) => {
      syncCollectionToFirestore('system_users', users);
    }).catch(err => {
      console.warn('Sync users to firestore skipped:', err);
    });
  } catch (e) {
    console.error('Erro ao salvar usuários do sistema:', e);
  }
};

export const findUserByEmail = (email: string): SystemUser | null => {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();
  const users = getSystemUsers();
  return users.find(u => u.email.trim().toLowerCase() === cleanEmail) || null;
};

export const getActiveSessionUser = (): SystemUser => {
  try {
    const saved = localStorage.getItem(ACTIVE_USER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.email) {
        // Refresh with latest data from getSystemUsers if exists
        const matched = findUserByEmail(parsed.email);
        if (matched) return matched;
        return parsed;
      }
    }
  } catch (e) {
    console.error('Erro ao carregar sessão ativa:', e);
  }
  // Default to Gianluca (Admin)
  return INITIAL_SYSTEM_USERS[0];
};

export const setActiveSessionUser = (user: SystemUser | null): void => {
  try {
    if (user) {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
      localStorage.setItem('vbsport_auth_user', JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.role
      }));
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
      localStorage.removeItem('vbsport_auth_user');
    }
  } catch (e) {
    console.error('Erro ao salvar sessão ativa:', e);
  }
};

export interface SystemModuleDefinition {
  id: string;
  label: string;
  description: string;
  category: 'core' | 'operacional' | 'financeiro' | 'sistema';
}

export const ALL_SYSTEM_MODULES: SystemModuleDefinition[] = [
  { id: 'inicio', label: 'Painel Inicial (Visão Geral)', description: 'Visão geral, indicadores do dia e atalhos', category: 'core' },
  { id: 'dashboards', label: 'Dashboards & Indicadores BI', description: 'Gráficos gerenciais, retenção e ticket médio', category: 'core' },
  { id: 'alunos', label: 'Alunos & Matrículas', description: 'Cadastro, matrículas, faturas e ficha do aluno', category: 'operacional' },
  { id: 'professores', label: 'Professores & Colaboradores', description: 'Folha de ponto, tarefas e agenda da equipe técnica', category: 'operacional' },
  { id: 'agenda', label: 'Agenda, Turmas & Locações', description: 'Grade horária, check-in e reserva de quadras', category: 'operacional' },
  { id: 'catraca', label: 'Catraca & Controle de Acesso', description: 'Controle biométrico/facial e liberação em tempo real', category: 'operacional' },
  { id: 'crm', label: 'CRM & Funil de Vendas', description: 'Gestão de leads, follow-up e oportunidades', category: 'operacional' },
  { id: 'whatsapp', label: 'WhatsApp Multi-Atendimento', description: 'Multi-atendimento, disparo de mensagens e avisos (Em breve • Fase 2)', category: 'operacional' },
  { id: 'financeiro', label: 'Financeiro, Caixa & DRE', description: 'Contas a pagar/receber, conciliação e DRE', category: 'financeiro' },
  { id: 'pay', label: 'GL Profit Pay (Recorrência & Links)', description: 'Sub-aba do Financeiro: cobrança recorrente no cartão, PIX e links de pagamento', category: 'financeiro' },
  { id: 'treinos', label: 'Treinos & Fichas de Alunos', description: 'Prescrição de fichas, exercícios e divisões A/B/C', category: 'operacional' },
  { id: 'bem_estar', label: 'Questionário de Bem-Estar', description: 'Monitoramento diário de sono, PSE, EVA, estresse, prontidão e matriz do elenco', category: 'operacional' },
  { id: 'avaliacoes', label: 'Avaliações Físicas', description: 'Protocolos de dobras (Pollock), perimetria, bioimpedância, testes e biometria inicial', category: 'operacional' },
  { id: 'vendas', label: 'Vendas & PDV Balcão', description: 'Venda rápida de planos, produtos e serviços', category: 'financeiro' },
  { id: 'comandas', label: 'Comandas & Lanchonete', description: 'Consumo por comanda com débito em conta', category: 'financeiro' },
  { id: 'estoque', label: 'Estoque & Produtos', description: 'Inventário, movimentações e alerta de estoque baixo', category: 'financeiro' },
  { id: 'nutricao', label: 'Nutrição & Dietas', description: 'Planos alimentares, cálculo de macros, suplementação e bioimpedância', category: 'operacional' },
  { id: 'relatorios', label: 'Relatórios & Exportações', description: 'Exportação em Excel/PDF de faturamento e frequência', category: 'sistema' },
  { id: 'configuracoes', label: 'Configurações da Unidade', description: 'Parâmetros da academia, usuários e permissões', category: 'sistema' }
];

export const getModuleName = (tabId: string): string => {
  const normalized = tabId.toLowerCase().trim();
  if (normalized === 'clientes') return 'Alunos & Clientes';
  if (normalized === 'professores') return 'Professores';
  if (normalized === 'treino') return 'Treinos & Fichas';
  if (normalized === 'avaliacoes' || normalized === 'avaliacoes_fisicas') return 'Avaliações Físicas';
  if (normalized === 'nutricao') return 'Nutrição & Dietas';
  if (normalized === 'bem_estar') return 'Questionário de Bem-Estar';
  const found = ALL_SYSTEM_MODULES.find(m => m.id === normalized);
  return found ? found.label : tabId.toUpperCase();
};

export const updateSystemUser = (userId: string, updates: Partial<SystemUser>): SystemUser | null => {
  const users = getSystemUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return null;

  const updatedUser: SystemUser = {
    ...users[index],
    ...updates
  };
  users[index] = updatedUser;
  saveSystemUsers(users);

  // If this is active user, update active session as well
  const activeUser = getActiveSessionUser();
  if (activeUser && (activeUser.id === userId || activeUser.email.toLowerCase() === updatedUser.email.toLowerCase())) {
    setActiveSessionUser(updatedUser);
  }

  return updatedUser;
};

/**
 * Checks whether a user is authorized to access a given tab/module.
 * Administrators always have full access.
 * If user has specific permissions configured, only those matching tabs will return true.
 */
export const hasTabPermission = (tabId: string, user?: SystemUser | null): boolean => {
  if (!user) return true;
  // Admin role has unrestricted access to all modules and configurations
  if (user.role === 'admin') return true;

  const perms = user.permissions || [];
  if (perms.length === 0) return false;

  const normalized = tabId.toLowerCase().trim();

  switch (normalized) {
    case 'inicio':
      return perms.includes('inicio');
    case 'dashboards':
      return perms.includes('dashboards');
    case 'clientes':
    case 'alunos':
      return perms.includes('clientes') || perms.includes('alunos');
    case 'professores':
      return perms.includes('professores') || perms.includes('treinos') || perms.includes('treinador');
    case 'treino':
    case 'treinos':
      return perms.includes('treino') || perms.includes('treinos');
    case 'avaliacoes':
    case 'avaliacoes_fisicas':
      return perms.includes('avaliacoes') || perms.includes('treino') || perms.includes('treinos');
    case 'nutricao':
      return perms.includes('nutricao') || perms.includes('treino') || perms.includes('treinos');
    case 'bem_estar':
      return perms.includes('bem_estar') || perms.includes('treino') || perms.includes('treinos');
    case 'agenda':
      return perms.includes('agenda');
    case 'catraca':
      return perms.includes('catraca');
    case 'financeiro':
      return perms.includes('financeiro');
    case 'pay':
      return perms.includes('pay') || perms.includes('financeiro');
    case 'vendas':
      return perms.includes('vendas') || perms.includes('financeiro');
    case 'comandas':
      return perms.includes('comandas');
    case 'estoque':
      return perms.includes('estoque');
    case 'crm':
      return perms.includes('crm');
    case 'whatsapp':
      return perms.includes('whatsapp');
    case 'relatorios':
      return perms.includes('relatorios');
    case 'configuracoes':
      return user.role !== 'aluno' || perms.includes('configuracoes');
    default:
      return perms.includes(normalized);
  }
};

/**
 * Returns the first tab in standard display order that the given user has permission to access.
 */
export const getFirstAllowedTab = (user?: SystemUser | null): string => {
  const tabsInDisplayOrder = [
    'inicio',
    'dashboards',
    'clientes',
    'professores',
    'crm',
    'agenda',
    'whatsapp',
    'pay',
    'financeiro',
    'estoque',
    'comandas',
    'treino',
    'avaliacoes',
    'nutricao',
    'bem_estar',
    'relatorios',
    'catraca',
    'configuracoes'
  ];

  for (const tab of tabsInDisplayOrder) {
    if (hasTabPermission(tab, user)) {
      return tab;
    }
  }

  return 'inicio';
};

// Iniciar assinatura em tempo real de usuários com o Firestore
if (typeof window !== 'undefined') {
  import('./firebaseDbService').then(({ subscribeToFirestoreCollection }) => {
    subscribeToFirestoreCollection('system_users', (remoteUsers: SystemUser[]) => {
      try {
        if (!remoteUsers || remoteUsers.length === 0) return;
        const current = getSystemUsers();
        // Merge without losing local registered entries if any
        const mergedMap = new Map<string, SystemUser>();
        current.forEach(u => mergedMap.set(u.email.toLowerCase(), u));
        remoteUsers.forEach(u => mergedMap.set(u.email.toLowerCase(), u));
        const mergedList = Array.from(mergedMap.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedList));
      } catch (err) {
        console.warn('Erro ao sincronizar usuários remotos:', err);
      }
    }, INITIAL_SYSTEM_USERS);
  }).catch(() => {});
}

