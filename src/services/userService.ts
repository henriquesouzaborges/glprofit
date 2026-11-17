import { SystemUser, SystemUserRole } from '../types';

export const INITIAL_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'admin-master-01',
    name: 'GL PRO FIT ADM',
    email: 'glprofit.adm@gmail.com',
    role: 'admin',
    phone: '(61)992095123',
    department: 'Diretoria Executiva & Master',
    active: true,
    createdAt: '2026-11-01',
    lastLogin: '2026-11-16',
    mustChangePassword: false,
    permissions: ['all']
  }
];

const STORAGE_KEY = 'vbsport_system_users';
const ACTIVE_USER_KEY = 'vbsport_active_user';
const AUTH_USER_KEY = 'vbsport_auth_user';
const USERS_CLEANUP_FLAG = 'glprofit_users_clean_v2610';
const MASTER_SESSION_MIGRATION_FLAG = 'glprofit_master_session_v2611';

const LEGACY_MOCK_USER_IDS = new Set(['usr-1', 'usr-2', 'usr-3', 'usr-4', 'usr-5', 'usr-6']);

export const isLegacyMasterOrOldAdmin = (u: any): boolean => {
  if (!u || !u.email) return true;
  const cleanEmail = String(u.email).trim().toLowerCase();
  if (cleanEmail === 'marinho.gianluca@gmail.com') return true;
  if (u.id === 'usr-1') return true;
  if (
    u.role === 'admin' &&
    cleanEmail !== 'glprofit.adm@gmail.com' &&
    String(u.name || '').toLowerCase().includes('gianluca')
  ) {
    return true;
  }
  return false;
};

const isLegacyFictitiousUser = (u: any): boolean => {
  if (!u || !u.email) return true;
  const cleanEmail = String(u.email).trim().toLowerCase();
  if (cleanEmail === 'glprofit.adm@gmail.com' || u.id === 'admin-master-01') return false;
  if (isLegacyMasterOrOldAdmin(u)) return true;
  if (u.id && LEGACY_MOCK_USER_IDS.has(String(u.id))) return true;
  if (cleanEmail.endsWith('@vbsport.com.br') || cleanEmail.endsWith('@glprofit.com')) return true;
  if (
    u.lastLogin === 'Agora' &&
    (u.department === 'Instrutores & Treinadores' || u.department === 'Atendimento & Geral') &&
    !u.phone
  ) {
    return true;
  }
  return false;
};

const syncActiveSessionOnMigration = (): void => {
  if (typeof window === 'undefined') return;
  try {
    const rawActive = localStorage.getItem(ACTIVE_USER_KEY);
    let shouldResetActive = !rawActive;
    if (rawActive) {
      const parsedActive = JSON.parse(rawActive);
      if (isLegacyFictitiousUser(parsedActive) || isLegacyMasterOrOldAdmin(parsedActive)) {
        shouldResetActive = true;
      }
    }
    if (shouldResetActive) {
      const master = INITIAL_SYSTEM_USERS[0];
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(master));
      localStorage.setItem(
        AUTH_USER_KEY,
        JSON.stringify({ name: master.name, email: master.email, role: master.role })
      );
    }
    localStorage.setItem(MASTER_SESSION_MIGRATION_FLAG, 'true');
  } catch {
    const master = INITIAL_SYSTEM_USERS[0];
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(master));
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify({ name: master.name, email: master.email, role: master.role })
    );
    localStorage.setItem(MASTER_SESSION_MIGRATION_FLAG, 'true');
  }
};

export const getSystemUsers = (): SystemUser[] => {
  try {
    if (
      typeof window !== 'undefined' &&
      (localStorage.getItem(USERS_CLEANUP_FLAG) !== 'true' ||
        localStorage.getItem(MASTER_SESSION_MIGRATION_FLAG) !== 'true')
    ) {
      const savedRaw = localStorage.getItem(STORAGE_KEY);
      let preservedValidUsers: SystemUser[] = [];
      if (savedRaw) {
        try {
          const parsedExisting = JSON.parse(savedRaw);
          if (Array.isArray(parsedExisting)) {
            preservedValidUsers = parsedExisting.filter(
              u => !isLegacyFictitiousUser(u) && !isLegacyMasterOrOldAdmin(u) && u?.email?.trim().toLowerCase() !== 'glprofit.adm@gmail.com'
            );
          }
        } catch {
          preservedValidUsers = [];
        }
      }
      const nextUsers = [INITIAL_SYSTEM_USERS[0], ...preservedValidUsers];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUsers));
      syncActiveSessionOnMigration();
      localStorage.setItem(USERS_CLEANUP_FLAG, 'true');
      return nextUsers;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = parsed
          .filter(u => !isLegacyFictitiousUser(u) && !isLegacyMasterOrOldAdmin(u))
          .map(u => {
            const cleanEmail = u.email.trim().toLowerCase();
            if (cleanEmail === 'glprofit.adm@gmail.com' || u.id === 'admin-master-01') {
              return {
                ...INITIAL_SYSTEM_USERS[0],
                lastLogin: u.lastLogin || INITIAL_SYSTEM_USERS[0].lastLogin,
                avatar: u.avatar
              };
            }
            return u;
          });

        const map = new Map<string, SystemUser>();
        cleaned.forEach(u => {
          if (u && u.email) {
            map.set(u.email.trim().toLowerCase(), u);
          }
        });
        if (!map.has('glprofit.adm@gmail.com')) {
          map.set('glprofit.adm@gmail.com', INITIAL_SYSTEM_USERS[0]);
        }
        const deduped = Array.from(map.values());
        return deduped.length > 0 ? deduped : INITIAL_SYSTEM_USERS;
      }
    }
  } catch (e) {
    console.error('Erro ao ler usuários do sistema:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SYSTEM_USERS));
  return INITIAL_SYSTEM_USERS;
};

export const saveSystemUsers = (users: SystemUser[]): void => {
  try {
    const sanitizedUsers = users
      .filter(u => !isLegacyMasterOrOldAdmin(u))
      .map(({ password: _ignoredPassword, ...rest }) => rest as SystemUser);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedUsers));
    // Sincronizar assincronamente com o banco de dados Firebase Firestore apenas quando autenticado no Firebase Auth
    import('./firebaseDbService').then(({ syncCollectionToFirestore, auth }) => {
      if (auth?.currentUser && sanitizedUsers.length > 0) {
        syncCollectionToFirestore('system_users', sanitizedUsers);
      }
    }).catch(err => {
      console.warn('Sync users to firestore skipped:', err);
    });
  } catch (e) {
    console.error('Erro ao salvar usuários do sistema:', e);
  }
};

export const deleteSystemUser = async (userId: string): Promise<void> => {
  try {
    const current = getSystemUsers();
    const updated = current.filter(u => u.id !== userId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('glprofit_system_users_updated', { detail: updated }));
    }
    const { deleteDocFromFirestore, auth } = await import('./firebaseDbService');
    if (auth?.currentUser) {
      await deleteDocFromFirestore('system_users', userId);
    }
  } catch (e) {
    console.error('Erro ao excluir usuário do sistema:', e);
  }
};

export const findUserByEmail = (email: string): SystemUser | null => {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === 'marinho.gianluca@gmail.com') return null;
  const users = getSystemUsers();
  return users.find(u => u.email.trim().toLowerCase() === cleanEmail) || null;
};

export const getActiveSessionUser = (): SystemUser => {
  try {
    // Garantir que migrações de usuários e sessão já foram aplicadas antes de ler a sessão ativa
    getSystemUsers();

    const saved = localStorage.getItem(ACTIVE_USER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.email) {
        if (isLegacyMasterOrOldAdmin(parsed) || isLegacyFictitiousUser(parsed)) {
          setActiveSessionUser(INITIAL_SYSTEM_USERS[0]);
          return INITIAL_SYSTEM_USERS[0];
        }
        const matched = findUserByEmail(parsed.email);
        if (matched) {
          return matched;
        }
        if (parsed.role === 'aluno') {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.error('Erro ao carregar sessão ativa:', e);
  }
  setActiveSessionUser(INITIAL_SYSTEM_USERS[0]);
  return INITIAL_SYSTEM_USERS[0];
};

export const setActiveSessionUser = (user: SystemUser | null): void => {
  try {
    if (user && isLegacyMasterOrOldAdmin(user)) {
      user = INITIAL_SYSTEM_USERS[0];
    }
    if (user) {
      const { password: _ignoredPassword, ...cleanUser } = user as SystemUser;
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(cleanUser));
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify({
        name: cleanUser.name,
        email: cleanUser.email,
        role: cleanUser.role
      }));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glprofit_active_user_updated', { detail: cleanUser }));
      }
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('glprofit_active_user_updated', { detail: null }));
      }
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
  { id: 'empresas_clientes', label: 'Empresas Clientes (B2B SaaS)', description: 'Gestão de contratos, licenciamento e liberação de módulos por cliente', category: 'core' },
  { id: 'crm', label: 'CRM & Funil de Vendas', description: 'Gestão de leads, follow-up e oportunidades', category: 'operacional' },
  { id: 'whatsapp', label: 'WhatsApp Multi-Atendimento', description: 'Multi-atendimento, disparo de mensagens e avisos (Em breve • Fase 2)', category: 'operacional' },
  { id: 'financeiro', label: 'Financeiro, Caixa & DRE', description: 'Contas a pagar/receber, conciliação e DRE', category: 'financeiro' },
  { id: 'pay', label: 'GL Profit Pay (Recorrência & Links)', description: 'Sub-aba do Financeiro: cobrança recorrente no cartão, PIX e links de pagamento', category: 'financeiro' },
  { id: 'treinos', label: 'Treinos & Fichas de Alunos', description: 'Prescrição de fichas, exercícios e divisões A/B/C', category: 'operacional' },
  { id: 'bem_estar', label: 'Questionário de Bem-Estar', description: 'Monitoramento diário de sono, PSE, EVA, estresse, prontidão e matriz do elenco', category: 'operacional' },
  { id: 'avaliacoes', label: 'Avaliações Físicas', description: 'Protocolos de dobras (Pollock), perimetria, bioimpedância, testes e biometria inicial', category: 'operacional' },
  { id: 'vendas', label: 'Vendas & PDV Balcão', description: 'Venda rápida de planos, produtos e serviços', category: 'financeiro' },
  { id: 'comandas', label: 'Lanchonete', description: 'Controle da lanchonete da empresa, pedidos de alunos e consumos', category: 'financeiro' },
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
  // Admin role or wildcard permission has unrestricted access to all modules and configurations
  const perms = user.permissions || [];
  if (user.role === 'admin' || perms.includes('all')) return true;
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
    case 'empresas_clientes':
      return perms.includes('empresas_clientes');
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
    'empresas_clientes',
    'configuracoes'
  ];

  for (const tab of tabsInDisplayOrder) {
    if (hasTabPermission(tab, user)) {
      return tab;
    }
  }

  return 'inicio';
};

// Iniciar assinatura em tempo real de usuários com o Firestore apenas após autenticação Firebase (restrito a Admin/Gerente)
if (typeof window !== 'undefined') {
  Promise.all([
    import('firebase/auth'),
    import('firebase/firestore'),
    import('./firebaseDbService')
  ]).then(([{ onAuthStateChanged }, { doc, getDoc, where }, { db, subscribeToFirestoreCollection, deleteDocFromFirestore, auth }]) => {
    let unsubUsers: (() => void) | null = null;
    onAuthStateChanged(auth, async (fbUser) => {
      if (unsubUsers) {
        unsubUsers();
        unsubUsers = null;
      }
      if (!fbUser) return;

      const cleanEmail = (fbUser.email || '').trim().toLowerCase();
      let resolvedRole: SystemUserRole | undefined;
      let resolvedCompanyId: string | undefined;

      if (cleanEmail === 'glprofit.adm@gmail.com') {
        resolvedRole = 'admin';
        resolvedCompanyId = 'matriz-gl-pro-fit';
      } else {
        try {
          const userSnap = await getDoc(doc(db, 'users', fbUser.uid));
          if (userSnap.exists()) {
            const d = userSnap.data() as any;
            resolvedRole = d?.role;
            resolvedCompanyId = d?.companyId || d?.empresaId;
          } else {
            const sysSnap = await getDoc(doc(db, 'system_users', fbUser.uid));
            if (sysSnap.exists()) {
              const d = sysSnap.data() as any;
              resolvedRole = d?.role;
              resolvedCompanyId = d?.companyId || d?.empresaId;
            }
          }
        } catch {
          // Fallback para sessão local ativa caso ainda esteja sincronizando
        }
        if (!resolvedRole) {
          const localActive = getActiveSessionUser();
          if (localActive?.email?.trim().toLowerCase() === cleanEmail) {
            resolvedRole = localActive.role;
            resolvedCompanyId = localActive.companyId || localActive.empresaId;
          }
        }
      }

      if (resolvedRole !== 'admin' && resolvedRole !== 'gerente') {
        return;
      }

      const constraints =
        resolvedRole === 'gerente' && resolvedCompanyId && resolvedCompanyId !== 'matriz-gl-pro-fit'
          ? [where('companyId', '==', resolvedCompanyId)]
          : undefined;

      unsubUsers = subscribeToFirestoreCollection(
        'system_users',
        (remoteUsers: SystemUser[]) => {
          try {
            if (!remoteUsers || remoteUsers.length === 0) return;

            // Expurgar automaticamente documentos fictícios legados que ainda estejam no Firestore
            const legacyRemote = remoteUsers.filter(u => isLegacyFictitiousUser(u));
            legacyRemote.forEach(legacy => {
              if (legacy?.id) {
                deleteDocFromFirestore('system_users', legacy.id).catch(() => {});
              }
            });

            const validRemote = remoteUsers.filter(u => !isLegacyFictitiousUser(u));
            const mergedMap = new Map<string, SystemUser>();
            mergedMap.set('glprofit.adm@gmail.com', INITIAL_SYSTEM_USERS[0]);
            validRemote.forEach(u => {
              const uEmail = u.email.trim().toLowerCase();
              if (uEmail === 'glprofit.adm@gmail.com') {
                mergedMap.set(uEmail, {
                  ...INITIAL_SYSTEM_USERS[0],
                  lastLogin: u.lastLogin || INITIAL_SYSTEM_USERS[0].lastLogin,
                  avatar: u.avatar
                });
              } else {
                mergedMap.set(uEmail, u);
              }
            });
            const mergedList = Array.from(mergedMap.values());
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedList));
            window.dispatchEvent(new CustomEvent('glprofit_system_users_updated', { detail: mergedList }));
          } catch (err) {
            console.warn('Erro ao sincronizar usuários remotos:', err);
          }
        },
        undefined,
        undefined,
        constraints
      );
    });
  }).catch(() => {});
}

