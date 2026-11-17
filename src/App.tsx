import React, { useState, useEffect, lazy, Suspense } from 'react';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, User as FirebaseUser } from 'firebase/auth';
import { where } from 'firebase/firestore';
import { 
  INITIAL_SETTINGS, 
  INITIAL_PLANS, 
  INITIAL_STUDENTS, 
  INITIAL_PRODUCTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_CLASSES, 
  INITIAL_WORKOUTS, 
  INITIAL_LEADS,
  INITIAL_COMANDAS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_SUPPLIERS,
  INITIAL_PAY_RECURRING,
  INITIAL_PAYMENT_LINKS,
  INITIAL_CRM_ACTIVITIES,
  INITIAL_CRM_AUTOMATIONS,
  INITIAL_SATISFACTION_SURVEYS,
  INITIAL_CALENDAR_EVENTS
} from './mockData';
import { 
  Student, 
  StudentStatus, 
  FinancialTransaction, 
  Plan, 
  Product, 
  ClassSession, 
  WorkoutPlan, 
  Lead, 
  LeadStage, 
  GymSettings,
  Comanda,
  ComandaItem,
  StockMovement,
  Supplier,
  PayRecurringCharge,
  PaymentLink,
  PaymentMethod,
  CrmSubTab,
  CrmActivity,
  CrmAutomation,
  SatisfactionSurveyResponse,
  CalendarEvent,
  AgendaSubTab,
  TreinoSubTab,
  AvaliacoesSubTab,
  NutricaoSubTab,
  BemEstarSubTab,
  WhatsappSubTab,
  FinanceiroSubTab,
  ProfessoresSubTab,
  SystemUser,
  SystemUserRole,
  EmpresaCliente,
  EmpresasClientesSubTab,
  CompanyStudentLink,
  TabType
} from './types';
import { 
  getActiveSessionUser, 
  setActiveSessionUser, 
  findUserByEmail,
  hasTabPermission,
  getFirstAllowedTab,
  getModuleName,
  getSystemUsers,
  saveSystemUsers
} from './services/userService';
import {
  getStoredCompanyStudentLinks,
  isCompanyScopedUser,
  reconcileEmpresasWithLinks,
  resolveActiveEmpresaForUser,
  recordCompanyStudentLink,
  saveCompanyStudentLinksToStorage,
  sanitizeGymSettings,
  resolveRegisteredMainCompanyName
} from './services/studentInviteService';
import { Lock, ShieldAlert, SlidersHorizontal, AlertTriangle } from 'lucide-react';
import { Header } from './components/Header';
import { TopNav } from './components/TopNav';
import type { DashboardSubTab } from './components/tabs/DashboardsTab';
import type { WhatsappTargetChat } from './components/tabs/whatsapp/WhatsappTab';
import type { ConfigSubTab } from './components/tabs/ConfiguracoesTab';
import { EmpresasClientesTab, INITIAL_EMPRESAS_CLIENTES } from './components/tabs/EmpresasClientesTab';
import { NovoAlunoModal } from './components/modals/NovoAlunoModal';
import { TabConfigModal } from './components/modals/TabConfigModal';
import { getActiveSubTabInfo, getAgendaSettings } from './services/tabSettingsService';

// Lazy-loaded Tabs para ganho de performance e otimização de bundle inicial
const InicioTab = lazy(() => import('./components/tabs/InicioTab').then(m => ({ default: m.InicioTab })));
const DashboardsTab = lazy(() => import('./components/tabs/DashboardsTab').then(m => ({ default: m.DashboardsTab })));
const AlunosTab = lazy(() => import('./components/tabs/AlunosTab').then(m => ({ default: m.AlunosTab })));
const ProfessoresTab = lazy(() => import('./components/tabs/ProfessoresTab').then(m => ({ default: m.ProfessoresTab })));
const CrmTab = lazy(() => import('./components/tabs/CrmTab').then(m => ({ default: m.CrmTab })));
const AgendaTab = lazy(() => import('./components/tabs/AgendaTab').then(m => ({ default: m.AgendaTab })));
const WhatsappTab = lazy(() => import('./components/tabs/whatsapp/WhatsappTab').then(m => ({ default: m.WhatsappTab })));
const VbSportPayTab = lazy(() => import('./components/tabs/VbSportPayTab').then(m => ({ default: m.VbSportPayTab })));
const FinanceiroTab = lazy(() => import('./components/tabs/FinanceiroTab').then(m => ({ default: m.FinanceiroTab })));
const EstoqueTab = lazy(() => import('./components/tabs/EstoqueTab').then(m => ({ default: m.EstoqueTab })));
const ComandasTab = lazy(() => import('./components/tabs/ComandasTab').then(m => ({ default: m.ComandasTab })));
const TreinosTab = lazy(() => import('./components/tabs/TreinosTab').then(m => ({ default: m.TreinosTab })));
const AvaliacoesFisicasTab = lazy(() => import('./components/tabs/AvaliacoesFisicasTab').then(m => ({ default: m.AvaliacoesFisicasTab })));
const NutricaoTab = lazy(() => import('./components/tabs/NutricaoTab').then(m => ({ default: m.NutricaoTab })));
const BemEstarTab = lazy(() => import('./components/tabs/BemEstarTab').then(m => ({ default: m.BemEstarTab })));
const RelatoriosTab = lazy(() => import('./components/tabs/RelatoriosTab').then(m => ({ default: m.RelatoriosTab })));
const ConfiguracoesTab = lazy(() => import('./components/tabs/ConfiguracoesTab').then(m => ({ default: m.ConfiguracoesTab })));
const VendasTab = lazy(() => import('./components/tabs/VendasTab').then(m => ({ default: m.VendasTab })));
import { LoginPage } from './components/LoginPage';
import { CadastroPage } from './components/CadastroPage';
import { Footer } from './components/Footer';
import { PushNotificationContainer } from './components/notifications/PushNotificationContainer';
import { dispatchPushNotification } from './services/notificationService';
import { 
  auth,
  initializeDatabase, 
  subscribeToFirestoreCollection, 
  syncCollectionToFirestore,
  saveDocToFirestore,
  deleteDocFromFirestore,
  subscribeDatabaseStatus,
  DatabaseStatus
} from './services/firebaseDbService';

export default function App() {
  // Purge legacy mock data from browser localStorage on initial boot for v2.5.3 clean slate
  if (typeof window !== 'undefined' && localStorage.getItem('glprofit_clean_slate_v253') !== 'true') {
    const keysToRemove = [
      'vbsport_students', 'vbsport_transactions', 'vbsport_workouts',
      'vbsport_classes', 'vbsport_leads', 'vbsport_products',
      'vbsport_comandas', 'vbsport_stock_movements', 'vbsport_suppliers',
      'vbsport_pay_recurring', 'vbsport_payment_links', 'vbsport_crm_activities',
      'vbsport_surveys', 'vbsport_calendar_events', 'vbsport_empresas_clientes',
      'vbsport_whatsapp_chats', 'vbsport_whatsapp_campaigns', 'vbsport_whatsapp_config',
      'vbsport_folha_teachers', 'vbsport_folha_turmas', 'vbsport_folha_eventos',
      'vbsport_folha_records', 'vbsport_load_logs', 'vbsport_physical_tests',
      'vbsport_partner_school_licenses', 'glfit_elenco_groups', 'glfit_users_v2'
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));
    localStorage.setItem('glprofit_clean_slate_v253', 'true');
  }

  const [currentUser, setCurrentUser] = useState<SystemUser>(() => getActiveSessionUser());
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>({
    connected: false,
    syncing: false,
    lastSync: null,
    error: null,
    collectionsCount: {}
  });

  // Navigation State - defaults to first allowed tab for current active user
  const [currentTab, setCurrentTab] = useState<TabType>(() => {
    const active = getActiveSessionUser();
    return (hasTabPermission('inicio', active) ? 'inicio' : getFirstAllowedTab(active)) as TabType;
  });
  const [dashboardSubTab, setDashboardSubTab] = useState<DashboardSubTab>('gerencial');
  const [professoresSubTab, setProfessoresSubTab] = useState<ProfessoresSubTab>('folha_ponto');
  const [crmSubTab, setCrmSubTab] = useState<CrmSubTab>('leads');
  const [agendaSubTab, setAgendaSubTab] = useState<AgendaSubTab>('calendario');
  const [treinoSubTab, setTreinoSubTab] = useState<TreinoSubTab>('prescricao');
  const [avaliacoesSubTab, setAvaliacoesSubTab] = useState<AvaliacoesSubTab>('avaliacoes');
  const [nutricaoSubTab, setNutricaoSubTab] = useState<NutricaoSubTab>('planos_alimentares');
  const [bemEstarSubTab, setBemEstarSubTab] = useState<BemEstarSubTab>('checkin');
  const [whatsappSubTab, setWhatsappSubTab] = useState<WhatsappSubTab>('atendimento');
  const [financeiroSubTab, setFinanceiroSubTab] = useState<FinanceiroSubTab>('receber');
  const [empresasClientesSubTab, setEmpresasClientesSubTab] = useState<EmpresasClientesSubTab>('dashboard');
  const [configuracoesSubTab, setConfiguracoesSubTab] = useState<ConfigSubTab>('geral');

  const [empresasClientes, setEmpresasClientes] = useState<EmpresaCliente[]>(() => {
    const saved = localStorage.getItem('vbsport_empresas_clientes');
    return saved ? JSON.parse(saved) : INITIAL_EMPRESAS_CLIENTES;
  });
  const [companyStudentLinks, setCompanyStudentLinks] = useState<CompanyStudentLink[]>(() =>
    getStoredCompanyStudentLinks()
  );

  // Auth State (defaults to false on fresh start to show requested login page immediately)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('vbsport_auth_session');
    return saved ? JSON.parse(saved) : false;
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(() => auth?.currentUser || null);

  useEffect(() => {
    const refreshActiveUser = () => {
      const fresh = getActiveSessionUser();
      setCurrentUser(fresh);
    };
    refreshActiveUser();
    window.addEventListener('glprofit_active_user_updated', refreshActiveUser);
    window.addEventListener('glprofit_system_users_updated', refreshActiveUser);
    return () => {
      window.removeEventListener('glprofit_active_user_updated', refreshActiveUser);
      window.removeEventListener('glprofit_system_users_updated', refreshActiveUser);
    };
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser?.email?.trim().toLowerCase() === 'marinho.gianluca@gmail.com') {
        signOut(auth).catch(() => {});
        localStorage.removeItem('vbsport_auth_session');
        setActiveSessionUser(null);
        setCurrentUser(getActiveSessionUser());
        setFirebaseUser(null);
        setIsAuthenticated(false);
        return;
      }
      setFirebaseUser(fbUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    localStorage.setItem('vbsport_empresas_clientes', JSON.stringify(empresasClientes));
    if (isAuthenticated && firebaseUser && currentUser?.role === 'admin') {
      syncCollectionToFirestore('empresas_clientes', empresasClientes);
    }
  }, [empresasClientes, isAuthenticated, firebaseUser, currentUser?.role]);

  const handleAddEmpresa = async (emp: EmpresaCliente) => {
    setEmpresasClientes(prev => [emp, ...prev]);

    // Provisiona usuário operador da empresa cliente para login direto no próprio perfil B2B
    const cleanEmpEmail = (emp.email || '').trim().toLowerCase();
    if (cleanEmpEmail) {
      const existingUsers = getSystemUsers();
      if (!existingUsers.some(u => u.email.trim().toLowerCase() === cleanEmpEmail)) {
        const companyOperatorUser: SystemUser = {
          id: `emp-usr-${emp.id}`,
          name: emp.ownerName?.trim() || emp.name,
          email: cleanEmpEmail,
          role: 'gerente',
          department: emp.name,
          phone: emp.phone,
          active: emp.status === 'ativo',
          createdAt: new Date().toISOString().slice(0, 10),
          permissions: emp.allowedModules && emp.allowedModules.length > 0
            ? emp.allowedModules
            : ['inicio', 'clientes', 'agenda', 'treino', 'financeiro'],
          empresaId: emp.id,
          empresaName: emp.name
        };
        saveSystemUsers([...existingUsers, companyOperatorUser]);
        if (firebaseUser) {
          saveDocToFirestore('system_users', companyOperatorUser).catch(() => {});
        }
      }
    }

    try {
      await saveDocToFirestore('empresas_clientes', emp);
      showToast(`Empresa "${emp.name}" cadastrada com sucesso!`);
    } catch (err) {
      showToast('Erro ao salvar empresa no Firestore.');
    }
  };

  const handleUpdateEmpresa = async (emp: EmpresaCliente) => {
    setEmpresasClientes(prev => prev.map(e => e.id === emp.id ? emp : e));

    // Atualiza vínculo/permissões dos usuários associados à empresa cliente
    const cleanEmpEmail = (emp.email || '').trim().toLowerCase();
    const existingUsers = getSystemUsers();
    let userUpdated = false;
    const nextUsers = existingUsers.map(u => {
      if (u.empresaId === emp.id || (cleanEmpEmail && u.email.trim().toLowerCase() === cleanEmpEmail)) {
        userUpdated = true;
        return {
          ...u,
          active: emp.status === 'ativo',
          permissions: emp.allowedModules && emp.allowedModules.length > 0 ? emp.allowedModules : u.permissions,
          empresaId: emp.id,
          empresaName: emp.name
        };
      }
      return u;
    });
    if (userUpdated) {
      saveSystemUsers(nextUsers);
    }

    try {
      await saveDocToFirestore('empresas_clientes', emp);
      showToast(`Empresa "${emp.name}" atualizada.`);
    } catch (err) {
      showToast('Erro ao atualizar empresa no Firestore.');
    }
  };

  const handleDeleteEmpresa = async (id: string) => {
    setEmpresasClientes(prev => prev.filter(e => e.id !== id));
    try {
      await deleteDocFromFirestore('empresas_clientes', id);
      showToast('Empresa removida.');
    } catch (err) {
      showToast('Erro ao remover empresa no Firestore.');
    }
  };
  const [isTabConfigModalOpen, setIsTabConfigModalOpen] = useState(false);

  const isCadastroQueryActive = () => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') || params.get('page') || params.get('action');
    return (
      view === 'cadastro' ||
      view === 'register' ||
      window.location.hash === '#cadastro' ||
      window.location.hash === '#register'
    );
  };

  const [forceCadastroRoute, setForceCadastroRoute] = useState<boolean>(() => isCadastroQueryActive());

  const [authView, setAuthView] = useState<'login' | 'cadastro'>(() =>
    isCadastroQueryActive() ? 'cadastro' : 'login'
  );

  useEffect(() => {
    const handleUrlChange = () => {
      const isCad = isCadastroQueryActive();
      setForceCadastroRoute(isCad);
      setAuthView(isCad ? 'cadastro' : 'login');
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleOpenCadastroPreview = (url: string) => {
    try {
      const parsed = new URL(url, window.location.origin);
      window.history.pushState({}, '', `${parsed.pathname}${parsed.search}`);
    } catch {
      // ignore invalid URL parse fallback
    }
    setForceCadastroRoute(true);
    setAuthView('cadastro');
  };

  const [authRole, setAuthRole] = useState<'treinador' | 'aluno'>(() => {
    const active = getActiveSessionUser();
    if (active.role === 'aluno') return 'aluno';
    return 'treinador';
  });

  const handleNavigateTab = (tab: TabType) => {
    if (!hasTabPermission(tab, currentUser)) {
      showToast(`Acesso restrito: Você não tem permissão para acessar o módulo "${getModuleName(tab)}".`);
      return;
    }
    if (tab === 'pay') {
      setFinanceiroSubTab('gl_profit_pay');
      if (hasTabPermission('financeiro', currentUser)) {
        setCurrentTab('financeiro');
        return;
      }
    }
    setCurrentTab(tab);
  };

  const currentSubTabInfo = getActiveSubTabInfo(currentTab, {
    dashboardSubTab,
    professoresSubTab,
    crmSubTab,
    agendaSubTab,
    treinoSubTab,
    avaliacoesSubTab,
    nutricaoSubTab,
    bemEstarSubTab,
    whatsappSubTab,
    financeiroSubTab
  });

  const handleLoginSuccess = (data: { 
    email: string; 
    role: SystemUserRole; 
    provider: string; 
    name?: string;
    user?: SystemUser;
  }) => {
    const cleanEmail = (data.email || '').trim().toLowerCase();
    if (cleanEmail === 'marinho.gianluca@gmail.com') {
      signOut(auth).catch(() => {});
      localStorage.removeItem('vbsport_auth_session');
      setIsAuthenticated(false);
      showToast('Acesso desativado para marinho.gianluca@gmail.com. Utilize glprofit.adm@gmail.com.');
      return;
    }

    let resolvedUser = data.user;
    if (!resolvedUser) {
      resolvedUser = findUserByEmail(data.email) || undefined;
    }

    if (!resolvedUser) {
      try {
        const savedStudents = localStorage.getItem('vbsport_students');
        if (savedStudents) {
          const studentsList = JSON.parse(savedStudents);
          const matchedStudent = studentsList.find((s: any) => s.email && s.email.trim().toLowerCase() === data.email.trim().toLowerCase());
          if (matchedStudent) {
            resolvedUser = {
              id: matchedStudent.id,
              name: matchedStudent.name,
              email: matchedStudent.email,
              role: 'aluno',
              active: matchedStudent.status === 'ativo',
              createdAt: matchedStudent.startDate || matchedStudent.joinDate || '2026-01-01',
              department: 'Aluno Matriculado',
              avatar: matchedStudent.photo,
              permissions: ['treino', 'agenda', 'pay']
            };
          }
        }
      } catch (err) {
        console.error('Erro ao verificar alunos na sessão:', err);
      }
    }

    if (!resolvedUser) {
      showToast('Acesso negado: Conta não encontrada ou não cadastrada no sistema.');
      setIsAuthenticated(false);
      return;
    }

    // Verificar se a empresa associada ao usuário está bloqueada
    const matchedEmpresa = empresasClientes.find(e => 
      e.email?.toLowerCase() === data.email.toLowerCase() || 
      (resolvedUser?.name && e.name.toLowerCase().includes(resolvedUser.name.toLowerCase()))
    );
    if (matchedEmpresa && matchedEmpresa.status === 'bloqueado') {
      showToast(`Acesso Suspenso: A empresa "${matchedEmpresa.name}" está com o contrato bloqueado pelo administrador B2B.`);
      setIsAuthenticated(false);
      return;
    }

    setActiveSessionUser(resolvedUser);
    setCurrentUser(resolvedUser);
    setIsAuthenticated(true);
    const mappedRole = resolvedUser.role === 'aluno' ? 'aluno' : 'treinador';
    setAuthRole(mappedRole);
    localStorage.setItem('vbsport_auth_session', JSON.stringify(true));
    localStorage.setItem('vbsport_auth_role', mappedRole);

    // Redirect to allowed tab if current tab is restricted for this user
    const targetTab = hasTabPermission(currentTab, resolvedUser) 
      ? currentTab 
      : (getFirstAllowedTab(resolvedUser) as TabType);
    setCurrentTab(targetTab);

    showToast(`Bem-vindo, ${resolvedUser.name}! Login autenticado como [${resolvedUser.role.toUpperCase()}].`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vbsport_auth_session');
    signOut(auth).catch(() => {});
    showToast('Você saiu da sua conta.');
  };

  // Persistence States
  const [settings, setSettings] = useState<GymSettings>(() => {
    const saved = localStorage.getItem('vbsport_settings');
    if (!saved) return INITIAL_SETTINGS;
    try {
      return sanitizeGymSettings(JSON.parse(saved));
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [plans, setPlans] = useState<Plan[]>(() => {
    const saved = localStorage.getItem('vbsport_plans');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('vbsport_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vbsport_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('vbsport_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [classes, setClasses] = useState<ClassSession[]>(() => {
    const saved = localStorage.getItem('vbsport_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [workouts, setWorkouts] = useState<WorkoutPlan[]>(() => {
    const saved = localStorage.getItem('vbsport_workouts');
    return saved ? JSON.parse(saved) : INITIAL_WORKOUTS;
  });


  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('vbsport_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [comandas, setComandas] = useState<Comanda[]>(() => {
    const saved = localStorage.getItem('vbsport_comandas');
    return saved ? JSON.parse(saved) : INITIAL_COMANDAS;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('vbsport_stock_movements');
    return saved ? JSON.parse(saved) : INITIAL_STOCK_MOVEMENTS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('vbsport_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [recurringCharges, setRecurringCharges] = useState<PayRecurringCharge[]>(() => {
    const saved = localStorage.getItem('vbsport_recurring');
    return saved ? JSON.parse(saved) : INITIAL_PAY_RECURRING;
  });

  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>(() => {
    const saved = localStorage.getItem('vbsport_payment_links');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_LINKS;
  });

  const [crmActivities, setCrmActivities] = useState<CrmActivity[]>(() => {
    const saved = localStorage.getItem('vbsport_crm_activities');
    return saved ? JSON.parse(saved) : INITIAL_CRM_ACTIVITIES;
  });

  const [crmAutomations, setCrmAutomations] = useState<CrmAutomation[]>(() => {
    const saved = localStorage.getItem('vbsport_crm_automations');
    return saved ? JSON.parse(saved) : INITIAL_CRM_AUTOMATIONS;
  });

  const [satisfactionSurveys, setSatisfactionSurveys] = useState<SatisfactionSurveyResponse[]>(() => {
    const saved = localStorage.getItem('vbsport_crm_surveys');
    return saved ? JSON.parse(saved) : INITIAL_SATISFACTION_SURVEYS;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('vbsport_calendar_events');
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  });

  // Modal States
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [selectedStudentForSheet, setSelectedStudentForSheet] = useState<Student | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [whatsappTarget, setWhatsappTarget] = useState<WhatsappTargetChat | null>(null);

  // Listen for internal WhatsApp requests from buttons across the system
  useEffect(() => {
    const handleOpenInternalWhatsApp = (e: Event) => {
      const customEvent = e as CustomEvent<{
        phone: string;
        text?: string;
        contactName?: string;
        studentId?: string;
      }>;
      if (customEvent.detail && (customEvent.detail.phone || customEvent.detail.contactName)) {
        setWhatsappTarget({
          ...customEvent.detail,
          timestamp: Date.now()
        });
        setCurrentTab('whatsapp');
        setSelectedStudentForSheet(null);
        setIsNewStudentModalOpen(false);
        const contactIdentifier = customEvent.detail.contactName 
          ? `${customEvent.detail.contactName} (${customEvent.detail.phone})`
          : customEvent.detail.phone;
        setToastMessage(`Direcionando para o WhatsApp interno: ${contactIdentifier}`);
        setTimeout(() => setToastMessage(null), 3500);
      }
    };

    window.addEventListener('gl_pro_fit_open_whatsapp', handleOpenInternalWhatsApp);
    return () => {
      window.removeEventListener('gl_pro_fit_open_whatsapp', handleOpenInternalWhatsApp);
    };
  }, []);

  // Sincronização em Tempo Real com Banco de Dados Firebase Firestore (Política Zero-Mock)
  useEffect(() => {
    initializeDatabase();
    const unsubDbStatus = subscribeDatabaseStatus((st) => setDbStatus(st));
    return () => {
      unsubDbStatus();
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !firebaseUser) return;

    const isStudentUser = currentUser?.role === 'aluno';
    const isAdminOrGerente = currentUser?.role === 'admin' || currentUser?.role === 'gerente';
    const activeCompany = resolveActiveEmpresaForUser(
      currentUser,
      empresasClientes,
      resolveRegisteredMainCompanyName(settings)
    );
    const scopedCompany = isCompanyScopedUser(currentUser, empresasClientes);

    const unsubs: Array<() => void> = [];

    unsubs.push(
      subscribeToFirestoreCollection('system_settings', (data) => {
        if (data && data.length > 0) {
          const general = data.find((d: any) => d.id === 'general');
          if (general) {
            setSettings(prev => sanitizeGymSettings({ ...prev, ...general }));
          }
        }
      })
    );
    unsubs.push(subscribeToFirestoreCollection('plans', (data) => setPlans(data)));
    unsubs.push(subscribeToFirestoreCollection('classes', (data) => setClasses(data)));

    // Multi-tenant & RBAC enforced Firestore list queries
    if (isStudentUser) {
      unsubs.push(
        subscribeToFirestoreCollection(
          'students',
          (data) => setStudents(data),
          undefined,
          undefined,
          [where('registeredUserId', '==', firebaseUser.uid)]
        )
      );
      unsubs.push(
        subscribeToFirestoreCollection<CompanyStudentLink>(
          'company_student_links',
          (links) => {
            setCompanyStudentLinks(links);
            saveCompanyStudentLinksToStorage(links);
          },
          undefined,
          undefined,
          [where('userId', '==', firebaseUser.uid)]
        )
      );
    } else {
      const studentConstraints = scopedCompany
        ? [where('companyId', '==', activeCompany.id)]
        : undefined;
      unsubs.push(
        subscribeToFirestoreCollection('students', (data) => setStudents(data), undefined, undefined, studentConstraints)
      );
      unsubs.push(
        subscribeToFirestoreCollection<CompanyStudentLink>(
          'company_student_links',
          (links) => {
            setCompanyStudentLinks(links);
            saveCompanyStudentLinksToStorage(links);
          },
          undefined,
          undefined,
          studentConstraints
        )
      );

      if (currentUser?.role === 'admin' || currentUser?.role === 'gerente' || currentUser?.role === 'treinador') {
        unsubs.push(subscribeToFirestoreCollection('workouts', (data) => setWorkouts(data)));
      }
      if (currentUser?.role === 'admin' || currentUser?.role === 'gerente' || currentUser?.role === 'financeiro') {
        unsubs.push(subscribeToFirestoreCollection('financial_transactions', (data) => setTransactions(data)));
        unsubs.push(subscribeToFirestoreCollection('stock_movements', (data) => setStockMovements(data)));
        unsubs.push(subscribeToFirestoreCollection('suppliers', (data) => setSuppliers(data)));
        unsubs.push(subscribeToFirestoreCollection('recurring_charges', (data) => setRecurringCharges(data)));
        unsubs.push(subscribeToFirestoreCollection('payment_links', (data) => setPaymentLinks(data)));
      }
      if (currentUser?.role === 'admin' || currentUser?.role === 'gerente' || currentUser?.role === 'recepcao') {
        unsubs.push(subscribeToFirestoreCollection('leads', (data) => setLeads(data)));
        unsubs.push(subscribeToFirestoreCollection('crm_activities', (data) => setCrmActivities(data)));
        unsubs.push(subscribeToFirestoreCollection('satisfaction_surveys', (data) => setSatisfactionSurveys(data)));
      }
      if (currentUser?.role === 'admin' || currentUser?.role === 'gerente' || currentUser?.role === 'financeiro' || currentUser?.role === 'recepcao') {
        unsubs.push(subscribeToFirestoreCollection('comandas', (data) => setComandas(data)));
        unsubs.push(subscribeToFirestoreCollection('products', (data) => setProducts(data)));
      }
      if (isAdminOrGerente) {
        unsubs.push(subscribeToFirestoreCollection('crm_automations', (data) => setCrmAutomations(data)));
      }
      if (currentUser?.role === 'admin' || currentUser?.role === 'gerente' || currentUser?.role === 'treinador' || currentUser?.role === 'recepcao') {
        unsubs.push(subscribeToFirestoreCollection('calendar_events', (data) => setCalendarEvents(data)));
      }
      if (currentUser?.role !== 'aluno') {
        const empresaConstraints = scopedCompany
          ? [where('id', '==', activeCompany.id)]
          : undefined;
        unsubs.push(
          subscribeToFirestoreCollection('empresas_clientes', (data) => setEmpresasClientes(data), undefined, undefined, empresaConstraints)
        );
      }
    }

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [isAuthenticated, firebaseUser, currentUser?.id, currentUser?.role, currentUser?.companyId, currentUser?.empresaId]);

  // Reconcilia automaticamente alunos vinculados por link em EmpresasClientes
  useEffect(() => {
    if (!companyStudentLinks || companyStudentLinks.length === 0) return;
    setEmpresasClientes(prev => reconcileEmpresasWithLinks(prev, companyStudentLinks));
  }, [companyStudentLinks]);

  // Sincroniza em tempo real quando um aluno se cadastra via link no mesmo navegador
  useEffect(() => {
    const handleLinkUpdate = () => {
      setCompanyStudentLinks(getStoredCompanyStudentLinks());
    };
    const handleStudentRegistered = (e: Event) => {
      const detail = (e as CustomEvent<{ user: SystemUser; student: Student }>).detail;
      if (detail?.student) {
        setStudents(prev => [
          detail.student,
          ...prev.filter(s => s.id !== detail.student.id)
        ]);
      }
      setCompanyStudentLinks(getStoredCompanyStudentLinks());
    };
    window.addEventListener('glprofit_company_links_updated', handleLinkUpdate);
    window.addEventListener('glprofit_student_registered_via_link', handleStudentRegistered);
    return () => {
      window.removeEventListener('glprofit_company_links_updated', handleLinkUpdate);
      window.removeEventListener('glprofit_student_registered_via_link', handleStudentRegistered);
    };
  }, []);

  // Sync to LocalStorage and Firebase Firestore Cloud Database (apenas com sessão autenticada e papel autorizado)
  useEffect(() => {
    localStorage.setItem('vbsport_settings', JSON.stringify(settings));
    if (isAuthenticated && firebaseUser && currentUser?.role === 'admin') {
      syncCollectionToFirestore('system_settings', [{ id: 'general', ...settings }]);
    }
  }, [settings, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_plans', JSON.stringify(plans));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente', 'financeiro'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('plans', plans);
    }
  }, [plans, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_students', JSON.stringify(students));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente', 'recepcao', 'treinador'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('students', students);
    }
  }, [students, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_transactions', JSON.stringify(transactions));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente', 'financeiro'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('financial_transactions', transactions);
    }
  }, [transactions, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_classes', JSON.stringify(classes));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente', 'treinador', 'recepcao'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('classes', classes);
    }
  }, [classes, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_workouts', JSON.stringify(workouts));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente', 'treinador'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('workouts', workouts);
    }
  }, [workouts, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_leads', JSON.stringify(leads));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente', 'recepcao'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('leads', leads);
    }
  }, [leads, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_products', JSON.stringify(products));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente', 'financeiro'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('products', products);
    }
  }, [products, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_comandas', JSON.stringify(comandas));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente', 'financeiro', 'recepcao'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('comandas', comandas);
    }
  }, [comandas, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_stock_movements', JSON.stringify(stockMovements));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente', 'financeiro'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('stock_movements', stockMovements);
    }
  }, [stockMovements, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_suppliers', JSON.stringify(suppliers));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente', 'financeiro'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('suppliers', suppliers);
    }
  }, [suppliers, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_recurring', JSON.stringify(recurringCharges));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente', 'financeiro'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('recurring_charges', recurringCharges);
    }
  }, [recurringCharges, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_payment_links', JSON.stringify(paymentLinks));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente', 'financeiro'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('payment_links', paymentLinks);
    }
  }, [paymentLinks, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_crm_activities', JSON.stringify(crmActivities));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente', 'recepcao'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('crm_activities', crmActivities);
    }
  }, [crmActivities, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_crm_automations', JSON.stringify(crmAutomations));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('crm_automations', crmAutomations);
    }
  }, [crmAutomations, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_crm_surveys', JSON.stringify(satisfactionSurveys));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente', 'recepcao'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('satisfaction_surveys', satisfactionSurveys);
    }
  }, [satisfactionSurveys, isAuthenticated, firebaseUser, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('vbsport_calendar_events', JSON.stringify(calendarEvents));
    if (isAuthenticated && firebaseUser && ['admin', 'gerente', 'treinador', 'recepcao'].includes(currentUser?.role || '')) {
      syncCollectionToFirestore('calendar_events', calendarEvents);
    }
  }, [calendarEvents, isAuthenticated, firebaseUser, currentUser?.role]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calendar Handlers
  const handleAddCalendarEvent = (event: CalendarEvent) => {
    setCalendarEvents(prev => [event, ...prev]);
    showToast(`Agendamento "${event.title}" salvo com sucesso!`);
  };

  const handleUpdateCalendarEventStatus = (eventId: string, newStatus: CalendarEvent['status']) => {
    setCalendarEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
    showToast('Status do agendamento atualizado!');
  };

  const handleDeleteCalendarEvent = (eventId: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== eventId));
    showToast('Agendamento removido.');
  };

  // Student Handlers
  const mainCompanyDisplayName = resolveRegisteredMainCompanyName(settings);

  const handleAddStudent = (newStudent: Student, firstTx?: FinancialTransaction) => {
    const activeEmp = resolveActiveEmpresaForUser(currentUser, empresasClientes, mainCompanyDisplayName);
    const resolvedCompanyId = newStudent.companyId || newStudent.empresaId || activeEmp.id;
    const enrichedStudent: Student = {
      ...newStudent,
      companyId: resolvedCompanyId,
      empresaId: resolvedCompanyId,
      empresaName: newStudent.empresaName || activeEmp.name,
      registeredUserId: newStudent.registeredUserId || newStudent.id,
      registrationSource: newStudent.registrationSource || 'manual'
    };

    setStudents(prev => [enrichedStudent, ...prev]);
    if (firstTx) {
      setTransactions(prev => [firstTx, ...prev]);
    }

    if (enrichedStudent.empresaId && enrichedStudent.email) {
      recordCompanyStudentLink({
        empresaId: enrichedStudent.empresaId,
        empresaName: enrichedStudent.empresaName || activeEmp.name,
        userId: enrichedStudent.registeredUserId || enrichedStudent.id,
        studentId: enrichedStudent.id,
        email: enrichedStudent.email,
        studentName: enrichedStudent.name,
        invitedByUserId: currentUser?.id,
        invitedByEmail: currentUser?.email
      }).catch(() => {});
    }

    showToast(`Cliente ${enrichedStudent.name} cadastrado com sucesso!`);
    dispatchPushNotification({
      title: 'Novo Aluno Matriculado',
      message: `${enrichedStudent.name} matriculado no plano ${enrichedStudent.planName}.`,
      type: 'success',
      module: 'alunos',
      eventType: 'novo_aluno',
      linkTab: 'clientes',
      actionLabel: 'Ver Aluno'
    });
  };

  const handleUpdateStudentStatus = (studentId: string, status: StudentStatus) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          status,
          pendingAmount: status === 'ativo' ? 0 : s.pendingAmount
        };
      }
      return s;
    }));
    if (selectedStudentForSheet && selectedStudentForSheet.id === studentId) {
      setSelectedStudentForSheet(prev => prev ? { ...prev, status } : null);
    }
    showToast(`Situação atualizada para: ${status.toUpperCase()}`);
  };

  const handleSettlePayment = (transactionId: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        if (t.studentId) {
          setStudents(studs => studs.map(s => s.id === t.studentId ? { ...s, status: 'ativo', pendingAmount: 0 } : s));
        }
        return { ...t, status: 'pago' };
      }
      return t;
    }));
    showToast('Fatura liquidada com sucesso!');
  };

  const handleSettleStudentPayment = (studentId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, status: 'ativo', pendingAmount: 0 };
      }
      return s;
    }));
    setTransactions(prev => prev.map(t => {
      if (t.studentId === studentId && (t.status === 'vencido' || t.status === 'pendente')) {
        return { ...t, status: 'pago' };
      }
      return t;
    }));
    if (selectedStudentForSheet && selectedStudentForSheet.id === studentId) {
      setSelectedStudentForSheet(prev => prev ? { ...prev, status: 'ativo', pendingAmount: 0 } : null);
    }
    showToast('Mensalidade quitada! Cliente regularizado com sucesso.');
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    if (selectedStudentForSheet && selectedStudentForSheet.id === updatedStudent.id) {
      setSelectedStudentForSheet(updatedStudent);
    }
    showToast(`Cadastro de ${updatedStudent.name} atualizado com sucesso!`);
  };

  const handleAddSaleTransaction = (tx: FinancialTransaction, updatedStudent?: Student) => {
    setTransactions(prev => [tx, ...prev]);
    if (updatedStudent) {
      setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
      if (selectedStudentForSheet && selectedStudentForSheet.id === updatedStudent.id) {
        setSelectedStudentForSheet(updatedStudent);
      }
    }
    showToast(`Venda registrada com sucesso! ${tx.description}`);
  };

  const handleCompleteSale = (tx: FinancialTransaction) => {
    setTransactions(prev => [tx, ...prev]);
    showToast(`Venda de R$ ${tx.amount.toFixed(2)} concluída com sucesso!`);
    dispatchPushNotification({
      title: 'Venda Concluída no PDV',
      message: `${tx.description} no valor de R$ ${tx.amount.toFixed(2)} registrada.`,
      type: 'success',
      module: 'vendas',
      eventType: 'venda_pdv',
      linkTab: 'vendas',
      actionLabel: 'Ver Vendas'
    });
  };

  const handleToggleClassCheckIn = (classId: string, studentId: string) => {
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          enrolledStudents: c.enrolledStudents.map(e => {
            if (e.studentId === studentId) {
              const nextChecked = !e.checkedIn;
              return { 
                ...e, 
                checkedIn: nextChecked,
                status: nextChecked ? 'presente' : 'pendente',
                checkInSource: nextChecked ? 'manual' : undefined
              };
            }
            return e;
          })
        };
      }
      return c;
    }));
    showToast('Presença atualizada na turma!');
  };

  const handleSetClassAttendance = (
    classId: string, 
    studentId: string, 
    status: 'presente' | 'falta' | 'pendente'
  ) => {
    const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          enrolledStudents: c.enrolledStudents.map(e => {
            if (e.studentId === studentId) {
              const isPresente = status === 'presente';
              return {
                ...e,
                checkedIn: isPresente,
                status,
                checkInTime: isPresente ? (e.checkInTime || timeStr) : undefined,
                checkInSource: isPresente ? (e.checkInSource || 'professor') : undefined
              };
            }
            return e;
          })
        };
      }
      return c;
    }));

    if (status === 'presente') {
      showToast('Presença confirmada pelo professor (👍)!');
    } else if (status === 'falta') {
      showToast('Falta registrada pelo professor (👎)!');
    } else {
      showToast('Status da chamada redefinido.');
    }
  };

  const handleBulkSetClassAttendance = (classId: string, status: 'presente' | 'falta' | 'pendente') => {
    const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          enrolledStudents: c.enrolledStudents.map(e => ({
            ...e,
            checkedIn: status === 'presente',
            status,
            checkInTime: status === 'presente' ? timeStr : undefined,
            checkInSource: status === 'presente' ? 'professor' : undefined
          }))
        };
      }
      return c;
    }));

    if (status === 'presente') {
      showToast('Todos os alunos marcados como presentes (👍)!');
    } else if (status === 'falta') {
      showToast('Falta em lote registrada para a turma (👎).');
    } else {
      showToast('Chamada da turma reiniciada.');
    }
  };

  const handleEnrollStudentInClass = (classId: string, student: Student) => {
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        if (c.enrolledStudents.some(e => e.studentId === student.id)) return c;
        return {
          ...c,
          enrolledStudents: [...c.enrolledStudents, { studentId: student.id, studentName: student.name, checkedIn: false, status: 'pendente' }]
        };
      }
      return c;
    }));
    showToast(`Cliente ${student.name} inscrito na turma!`);
  };



  const handleUpdateLeadStage = (leadId: string, newStage: LeadStage) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage, lastContact: 'Hoje' } : l));
    showToast(`Lead movido para ${newStage.toUpperCase()}`);
  };

  const handleConvertLeadToStudent = (lead: Lead) => {
    const activeEmp = resolveActiveEmpresaForUser(currentUser, empresasClientes, mainCompanyDisplayName);
    const newStudent: Student = {
      id: `std-conv-${Date.now()}`,
      code: `${Math.floor(10000 + Math.random() * 89999)}`,
      name: lead.name,
      photo: '',
      email: lead.email || '',
      phone: lead.phone || '',
      cpf: '',
      birthDate: '',
      status: 'ativo',
      planId: plans?.[0]?.id || '',
      planName: plans?.[0]?.name || 'Sem Plano Definido',
      planPrice: plans?.[0]?.price || 0,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      pendingAmount: 0,
      consentLgpd: true,
      consentLgpdDate: new Date().toISOString(),
      consentLgpdVersion: '2026.1',
      companyId: activeEmp.id,
      empresaId: activeEmp.id,
      empresaName: activeEmp.name,
      notes: `Convertido a partir de lead CRM (${lead.interest})`
    };

    setStudents(prev => [newStudent, ...prev]);
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, stage: 'matriculado' } : l));
    showToast(`Lead ${lead.name} convertido em Cliente com sucesso!`);
  };

  // Comandas Handlers
  const handleOpenComanda = (newComanda: Comanda) => {
    setComandas(prev => [newComanda, ...prev]);
    showToast(`Comanda #${newComanda.number} aberta para ${newComanda.studentName}!`);
  };

  const handleAddItemToComanda = (comandaId: string, item: ComandaItem) => {
    setComandas(prev => prev.map(c => {
      if (c.id === comandaId) {
        return {
          ...c,
          items: [...c.items, item],
          total: c.total + item.totalPrice
        };
      }
      return c;
    }));

    // Deduct from stock
    setProducts(prev => prev.map(p => {
      if (p.id === item.productId) {
        return { ...p, stock: Math.max(0, p.stock - item.quantity) };
      }
      return p;
    }));

    showToast(`Item ${item.productName} adicionado à comanda!`);
  };

  const handleCloseComanda = (comandaId: string, paymentMethod: PaymentMethod, sendToInvoice?: boolean) => {
    const cmd = comandas.find(c => c.id === comandaId);
    if (!cmd) return;

    setComandas(prev => prev.map(c => {
      if (c.id === comandaId) {
        return {
          ...c,
          status: 'fechada',
          paymentMethod,
          closedAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return c;
    }));

    if (sendToInvoice && cmd.studentId) {
      // Add debt to student
      setStudents(prev => prev.map(s => {
        if (s.id === cmd.studentId) {
          return { ...s, pendingAmount: s.pendingAmount + cmd.total };
        }
        return s;
      }));
      showToast(`Comanda #${cmd.number} fechada e lançada na fatura do cliente!`);
    } else {
      // Create paid transaction
      const newTx: FinancialTransaction = {
        id: `tx-cmd-${Date.now()}`,
        description: `Consumo Comanda #${cmd.number} - ${cmd.studentName}`,
        amount: cmd.total,
        type: 'receita',
        category: 'venda_produtos',
        paymentMethod,
        date: new Date().toISOString().slice(0, 10),
        status: 'pago',
        studentId: cmd.studentId,
        studentName: cmd.studentName
      };
      setTransactions(prev => [newTx, ...prev]);
      showToast(`Comanda #${cmd.number} recebida com sucesso via ${paymentMethod.toUpperCase()}!`);
    }
  };

  // Estoque Handlers
  const handleAddProduct = (prod: Product) => {
    setProducts(prev => [prod, ...prev]);
    showToast(`Produto ${prod.name} cadastrado!`);
  };

  const handleAddStockMovement = (mov: StockMovement) => {
    setStockMovements(prev => [mov, ...prev]);
    showToast(`Movimentação de estoque registrada!`);
  };

  const handleUpdateProductStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
  };

  // GL Profit Pay Handlers
  const handleCancelRecurring = (chargeId: string) => {
    setRecurringCharges(prev => prev.map(c => c.id === chargeId ? { ...c, status: 'cancelada' } : c));
    showToast('Cobrança recorrente cancelada!');
  };

  const handleRetryRecurring = (chargeId: string) => {
    setRecurringCharges(prev => prev.map(c => c.id === chargeId ? { ...c, status: 'ativa', lastChargeStatus: 'sucesso' } : c));
    showToast('Tentativa de cobrança reenviada com sucesso!');
  };

  const handleCreatePaymentLink = (newLink: PaymentLink) => {
    setPaymentLinks(prev => [newLink, ...prev]);
    showToast('Link de pagamento criado com sucesso!');
  };

  const handleResetToDemo = () => {
    localStorage.clear();
    setSettings(INITIAL_SETTINGS);
    setPlans(INITIAL_PLANS);
    setStudents(INITIAL_STUDENTS);
    setProducts(INITIAL_PRODUCTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setClasses(INITIAL_CLASSES);
    setWorkouts(INITIAL_WORKOUTS);
    setLeads(INITIAL_LEADS);
    setComandas(INITIAL_COMANDAS);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setSuppliers(INITIAL_SUPPLIERS);
    setRecurringCharges(INITIAL_PAY_RECURRING);
    setPaymentLinks(INITIAL_PAYMENT_LINKS);
    setCrmActivities(INITIAL_CRM_ACTIVITIES);
    setCrmAutomations(INITIAL_CRM_AUTOMATIONS);
    setSatisfactionSurveys(INITIAL_SATISFACTION_SURVEYS);
    showToast('Dados restaurados para o padrão de demonstração.');
  };

  const overdueCount = students.filter(s => s.status === 'inadimplente').length;

  if (forceCadastroRoute || !isAuthenticated) {
    return (
      <>
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-medium text-white shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            {toastMessage}
          </div>
        )}
        {(forceCadastroRoute || authView === 'cadastro') ? (
          <CadastroPage
            empresasClientes={empresasClientes}
            plans={plans}
            gymName={mainCompanyDisplayName}
            onBackToLogin={() => {
              setForceCadastroRoute(false);
              setAuthView('login');
              try {
                window.history.replaceState({}, '', window.location.pathname);
              } catch (e) {
                console.warn(e);
              }
            }}
            onCadastroSuccess={(data) => {
              if (data.student) {
                setStudents(prev => [
                  data.student!,
                  ...prev.filter(s => s.id !== data.student!.id)
                ]);
              }
              setCompanyStudentLinks(getStoredCompanyStudentLinks());
              setForceCadastroRoute(false);
              try {
                window.history.replaceState({}, '', window.location.pathname);
              } catch (e) {
                console.warn(e);
              }
              handleLoginSuccess({
                email: data.user.email,
                role: data.user.role,
                provider: 'cadastro',
                name: data.user.name,
                user: data.user
              });
            }}
          />
        ) : (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onOpenCadastro={() => setAuthView('cadastro')}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900 antialiased selection:bg-blue-800 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-medium text-white shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          {toastMessage}
        </div>
      )}

      {/* Main Content Area - Coluna central com cabeçalho fixo, navegação superior e rolagem isolada */}
      <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden">
        {/* Floating Real-Time Push Notification Container */}
        <PushNotificationContainer onNavigateTab={(tab) => handleNavigateTab(tab)} />

        {/* Header - Barra Superior Fixa com Atalhos (Não desaparece ao rolar) */}
        <Header
          onOpenNewStudent={() => setIsNewStudentModalOpen(true)}
          onOpenQuickSale={() => handleNavigateTab('vendas')}
          onOpenNewOpportunity={() => {
            setCrmSubTab('leads');
            handleNavigateTab('crm');
          }}
          onSelectStudent={(student) => setSelectedStudentForSheet(student)}
          students={students}
          onLogout={handleLogout}
          currentUser={currentUser}
          onNavigateTab={(tab) => handleNavigateTab(tab)}
        />

        {/* TopNav - Menu Superior em Pílulas com Sub-abas Retráteis (Design Clean) */}
        <TopNav
          currentTab={currentTab}
          onTabChange={(tab) => handleNavigateTab(tab)}
          dashboardSubTab={dashboardSubTab}
          onDashboardSubTabChange={(sub) => {
            setDashboardSubTab(sub);
            handleNavigateTab('dashboards');
          }}
          professoresSubTab={professoresSubTab}
          onProfessoresSubTabChange={(sub) => {
            setProfessoresSubTab(sub);
            handleNavigateTab('professores');
          }}
          crmSubTab={crmSubTab}
          onCrmSubTabChange={(sub) => {
            setCrmSubTab(sub);
            handleNavigateTab('crm');
          }}
          agendaSubTab={agendaSubTab}
          onAgendaSubTabChange={(sub) => {
            setAgendaSubTab(sub);
            handleNavigateTab('agenda');
          }}
          treinoSubTab={treinoSubTab}
          onTreinoSubTabChange={(sub) => {
            setTreinoSubTab(sub);
            handleNavigateTab('treino');
          }}
          avaliacoesSubTab={avaliacoesSubTab}
          onAvaliacoesSubTabChange={(sub) => {
            setAvaliacoesSubTab(sub);
            handleNavigateTab('avaliacoes');
          }}
          nutricaoSubTab={nutricaoSubTab}
          onNutricaoSubTabChange={(sub) => {
            setNutricaoSubTab(sub);
            handleNavigateTab('nutricao');
          }}
          bemEstarSubTab={bemEstarSubTab}
          onBemEstarSubTabChange={(sub) => {
            setBemEstarSubTab(sub);
            handleNavigateTab('bem_estar');
          }}
          whatsappSubTab={whatsappSubTab}
          onWhatsappSubTabChange={(sub) => {
            setWhatsappSubTab(sub);
            handleNavigateTab('whatsapp');
          }}
          financeiroSubTab={financeiroSubTab}
          onFinanceiroSubTabChange={(sub) => {
            setFinanceiroSubTab(sub);
            handleNavigateTab('financeiro');
          }}
          empresasClientesSubTab={empresasClientesSubTab}
          onEmpresasClientesSubTabChange={(sub) => {
            setEmpresasClientesSubTab(sub);
            handleNavigateTab('empresas_clientes');
          }}
          overdueCount={overdueCount}
          leadsCount={leads.length}
          currentUser={currentUser}
        />

        {/* Scroll Container Isolado da Página Central */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-main-scrollbar flex flex-col">
          {/* Tab Router Content (Largura Total 100%) */}
          <main className="flex-1 p-3 sm:p-5 md:p-6 w-full min-w-0">
          {dbStatus.error && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <strong className="font-bold">Falha de Conexão com Firebase Firestore:</strong>{' '}
                  <span>{dbStatus.error}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                {!firebaseUser && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const provider = new GoogleAuthProvider();
                        provider.setCustomParameters({ prompt: 'select_account' });
                        await signInWithPopup(auth, provider);
                        initializeDatabase();
                      } catch {
                        showToast('Faça login com seu e-mail e senha Firebase ou Conta Google autorizada.');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold cursor-pointer"
                  >
                    Autenticar Firebase
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => initializeDatabase()}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer"
                >
                  Tentar Reconectar
                </button>
              </div>
            </div>
          )}
          {!hasTabPermission(currentTab, currentUser) ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6 sm:p-10 text-center max-w-xl mx-auto my-8 sm:my-14 shadow-xs animate-in fade-in duration-200">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 shadow-inner mb-4">
                <Lock className="h-7 w-7 stroke-[2.2]" />
              </div>
              <span className="inline-block rounded-full bg-amber-200/80 px-3 py-1 text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-2">
                Acesso Restrito
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Módulo Não Autorizado pelo Administrador
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                O usuário <strong className="text-slate-900">{currentUser?.name}</strong> (<span className="font-mono text-xs text-slate-500">{currentUser?.email}</span>) não possui permissão para acessar a aba <strong className="text-slate-900">"{getModuleName(currentTab)}"</strong>.
              </p>
              <div className="mt-4 p-3.5 rounded-xl bg-white border border-amber-200/80 text-xs text-slate-600 text-left">
                <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  Regra de Acesso Ativa ({currentUser?.role?.toUpperCase()}):
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  O administrador configurou o acesso restrito a módulos para esta conta. Se você precisa utilizar esta ferramenta no dia a dia, solicite a liberação no painel de Configurações.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    const firstAllowed = getFirstAllowedTab(currentUser) as TabType;
                    setCurrentTab(firstAllowed);
                  }}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
                >
                  Ir para meu módulo liberado ({getModuleName(getFirstAllowedTab(currentUser))})
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Trocar de Usuário
                </button>
              </div>
            </div>
          ) : (
            <div key={currentTab} className="animate-tab-fade-in">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-[300px] text-slate-500 font-medium text-xs">
                    Carregando módulo…
                  </div>
                }
              >
                {/* Tab 1: Início (Home view from screenshot) */}
              {currentTab === 'inicio' && (
                <InicioTab
                  students={students}
                  transactions={transactions}
                  onNavigateToTab={(tab) => handleNavigateTab(tab as TabType)}
                  onOpenNewStudent={() => setIsNewStudentModalOpen(true)}
                  onOpenQuickSale={() => handleNavigateTab('vendas')}
                  onOpenNewOpportunity={() => {
                    setCrmSubTab('leads');
                    handleNavigateTab('crm');
                  }}
                  onSelectStudent={(student) => setSelectedStudentForSheet(student)}
                  currentUser={currentUser}
                />
              )}

          {/* Tab 2: Dashboards (BI, gráficos, retenção e financeiro com sub-abas) */}
          {currentTab === 'dashboards' && (
            <DashboardsTab
              students={students}
              transactions={transactions}
              leads={leads}
              classes={classes}
              workouts={workouts}
              subTab={dashboardSubTab}
              onSubTabChange={(sub) => setDashboardSubTab(sub)}
              onNavigateToTab={(tab) => setCurrentTab(tab as TabType)}
            />
          )}

          {/* Tab 3: Clientes (Lista e Gestão de Alunos com Ficha Central 360°) */}
          {(currentTab === 'clientes' || (currentTab as string) === 'alunos') && (
            <AlunosTab
              students={students}
              plans={plans}
              products={products}
              onOpenNewStudent={() => setIsNewStudentModalOpen(true)}
              transactions={transactions}
              workouts={workouts}
              onUpdateStudentStatus={handleUpdateStudentStatus}
              onSettleStudentPayment={handleSettleStudentPayment}
              onNavigateToTab={(tab) => setCurrentTab(tab as TabType)}
              onUpdateStudent={handleUpdateStudent}
              onAddSaleTransaction={handleAddSaleTransaction}
              currentUser={currentUser}
              empresasClientes={empresasClientes}
              gymName={mainCompanyDisplayName}
              onOpenCadastroPreview={handleOpenCadastroPreview}
            />
          )}

          {/* Tab: Professores (Folha de ponto, Tarefas, Agenda) */}
          {currentTab === 'professores' && (
            <ProfessoresTab
              subTab={professoresSubTab}
              onSubTabChange={(sub) => setProfessoresSubTab(sub)}
              currentUser={currentUser}
            />
          )}

          {/* Tab 4: CRM (Leads, Kambam, Atividades, Automações, Pesquisas de Satisfação) */}
          {currentTab === 'crm' && (
            <CrmTab
              leads={leads}
              onUpdateLeadStage={handleUpdateLeadStage}
              onAddLead={(lead) => {
                setLeads(prev => [lead, ...prev]);
                showToast('Novo lead adicionado ao funil!');
              }}
              onConvertLeadToStudent={handleConvertLeadToStudent}
              subTab={crmSubTab}
              onSubTabChange={(sub) => setCrmSubTab(sub)}
              activities={crmActivities}
              onToggleActivityStatus={(id) => {
                setCrmActivities(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'concluida' ? 'pendente' : 'concluida' } : a));
                showToast('Status da atividade atualizado!');
              }}
              onAddActivity={(act) => {
                setCrmActivities(prev => [act, ...prev]);
                showToast('Nova atividade comercial agendada!');
              }}
              onDeleteActivity={(id) => {
                setCrmActivities(prev => prev.filter(a => a.id !== id));
                showToast('Atividade removida.');
              }}
              automations={crmAutomations}
              onToggleAutomation={(id) => {
                setCrmAutomations(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
                showToast('Status da automação atualizado!');
              }}
              onTestAutomation={(auto) => {
                showToast(`Disparo simulado com sucesso: "${auto.name}" enviado via WhatsApp!`);
              }}
              onAddAutomation={(auto) => {
                setCrmAutomations(prev => [auto, ...prev]);
                showToast('Nova automação ativada!');
              }}
              surveys={satisfactionSurveys}
              onAddSurveyResponse={(resp) => {
                setSatisfactionSurveys(prev => [resp, ...prev]);
                showToast('Pesquisa registrada com sucesso!');
              }}
              onResolveSurvey={(id) => {
                setSatisfactionSurveys(prev => prev.map(s => s.id === id ? { ...s, resolved: true } : s));
                showToast('Feedback marcado como tratado!');
              }}
            />
          )}

          {/* Tab 5: Agenda (Grade de Horários, Calendário, Locações, Jogos, Eventos) */}
          {currentTab === 'agenda' && (
            <AgendaTab
              classes={classes}
              students={students}
              calendarEvents={calendarEvents}
              subTab={agendaSubTab}
              onSubTabChange={(sub) => setAgendaSubTab(sub)}
              onToggleCheckIn={handleToggleClassCheckIn}
              onSetAttendance={handleSetClassAttendance}
              onBulkSetAttendance={handleBulkSetClassAttendance}
              onEnrollStudent={handleEnrollStudentInClass}
              onOpenConfiguracoes={() => {
                setConfiguracoesSubTab('agenda');
                setCurrentTab('configuracoes');
              }}
              onAddNewClass={(newCls) => {
                setClasses(prev => [newCls, ...prev]);
                // Automatically create a calendar event for this class
                const todayStr = new Date().toISOString().split('T')[0];
                const timeParts = newCls.time.split('-').map(t => t.trim());
                const newCalEvent: CalendarEvent = {
                  id: `evt-${newCls.id}-${Date.now()}`,
                  title: newCls.title,
                  category: 'grade_turma',
                  date: todayStr,
                  startTime: timeParts[0] || '08:00',
                  endTime: timeParts[1] || '09:00',
                  location: newCls.room,
                  instructorOrHost: newCls.instructor,
                  capacity: newCls.capacity,
                  enrolledOrConfirmedCount: newCls.enrolledStudents.length,
                  status: 'confirmado',
                  tag: newCls.modality,
                  description: `Aula de ${newCls.modality} com ${newCls.instructor}. Dias: ${newCls.dayOfWeek}.`
                };
                setCalendarEvents(prev => [newCalEvent, ...prev]);
                showToast('Nova turma adicionada à grade e ao calendário!');
              }}
              onAddCalendarEvent={handleAddCalendarEvent}
              onUpdateCalendarEventStatus={handleUpdateCalendarEventStatus}
              onDeleteCalendarEvent={handleDeleteCalendarEvent}
            />
          )}

          {/* Tab: WhatsApp Multi-Atendimento */}
          {currentTab === 'whatsapp' && (
            <WhatsappTab
              students={students}
              leads={leads}
              targetChat={whatsappTarget}
              onClearTargetChat={() => setWhatsappTarget(null)}
              activeSubTab={whatsappSubTab}
              onNavigateSubTab={(sub) => setWhatsappSubTab(sub)}
            />
          )}

          {/* Tab: Financeiro (Contas a Receber, Pagar, Planos e Serviços, DRE, Extrato e GL Profit Pay via TopNav) */}
          {(currentTab === 'financeiro' || currentTab === 'pay') && (
            <FinanceiroTab
              transactions={transactions}
              students={students}
              onAddTransaction={(tx) => {
                setTransactions(prev => [tx, ...prev]);
                showToast('Movimentação adicionada ao caixa!');
              }}
              onSettlePayment={handleSettlePayment}
              activeSubTab={currentTab === 'pay' ? 'gl_profit_pay' : financeiroSubTab}
              onNavigateSubTab={(sub) => {
                setFinanceiroSubTab(sub);
                if (currentTab === 'pay') {
                  setCurrentTab('financeiro');
                }
              }}
              recurringCharges={recurringCharges}
              paymentLinks={paymentLinks}
              onCancelRecurring={handleCancelRecurring}
              onRetryRecurring={handleRetryRecurring}
              onCreatePaymentLink={handleCreatePaymentLink}
              onAddPaymentLink={handleCreatePaymentLink}
              onAddRecurringCharge={(charge) => {
                setRecurringCharges(prev => [charge, ...prev]);
                showToast('Cobrança recorrente cadastrada com sucesso!');
              }}
              plans={plans}
              onAddPlan={(plan) => {
                setPlans(prev => [plan, ...prev]);
                saveDocToFirestore('plans', plan);
                showToast(`Plano "${plan.name}" criado com sucesso!`);
              }}
              onUpdatePlan={(updated) => {
                setPlans(prev => prev.map(p => p.id === updated.id ? updated : p));
                saveDocToFirestore('plans', updated);
                showToast(`Plano "${updated.name}" atualizado!`);
              }}
              onDeletePlan={(id) => {
                setPlans(prev => prev.filter(p => p.id !== id));
                deleteDocFromFirestore('plans', id);
                showToast('Plano excluído com sucesso!');
              }}
            />
          )}

          {/* Tab 8: Estoque (Inventário, Entrada de Mercadorias e Fornecedores) */}
          {currentTab === 'estoque' && (
            <EstoqueTab
              products={products}
              stockMovements={stockMovements}
              suppliers={suppliers}
              onAddProduct={handleAddProduct}
              onAddStockMovement={handleAddStockMovement}
              onUpdateProductStock={handleUpdateProductStock}
            />
          )}

          {/* Tab 9: Comandas (Consumo Lanchonete / Balcão e Fechamento) */}
          {currentTab === 'comandas' && (
            <ComandasTab
              comandas={comandas}
              products={products}
              students={students}
              onOpenComanda={handleOpenComanda}
              onAddItemToComanda={handleAddItemToComanda}
              onCloseComanda={handleCloseComanda}
            />
          )}

          {/* Tab 10: Treino (Fichas de Treino, Exercícios e Séries) */}
          {(currentTab === 'treino' || (currentTab as string) === 'treinos') && (
            <TreinosTab
              workouts={workouts}
              students={students}
              subTab={treinoSubTab}
              onSubTabChange={(sub) => setTreinoSubTab(sub)}
              currentUser={currentUser}
              onAddWorkout={(w) => {
                setWorkouts(prev => [w, ...prev]);
                showToast('Ficha de treino prescrita com sucesso!');
              }}
            />
          )}

          {/* Tab: Avaliações Físicas (Anamnese, Protocolos Pollock 7/3, Guedes, Bioimpedância e Evolução) */}
          {currentTab === 'avaliacoes' && (
            <AvaliacoesFisicasTab
              students={students}
              subTab={avaliacoesSubTab}
              onSubTabChange={(sub) => setAvaliacoesSubTab(sub)}
            />
          )}

          {/* Tab: Nutrição (Planos Alimentares, Anamnese, Composição, Suplementação, Metas e TACO) */}
          {currentTab === 'nutricao' && (
            <NutricaoTab
              students={students}
              activeSubTab={nutricaoSubTab}
              onSubTabChange={(sub) => setNutricaoSubTab(sub)}
              currentUser={currentUser}
            />
          )}

          {/* Tab: Questionário de Bem-Estar (Monitoramento Diário: Sono, PSE, EVA, Estresse, Prontidão e Mapa de Dor) */}
          {currentTab === 'bem_estar' && (
            <BemEstarTab
              students={students}
              activeSubTab={bemEstarSubTab}
              onSubTabChange={(sub) => setBemEstarSubTab(sub)}
            />
          )}

          {/* Tab 11: Relatórios (DRE, Inadimplência, Evasão e Vendas) */}
          {currentTab === 'relatorios' && (
            <RelatoriosTab
              students={students}
              transactions={transactions}
            />
          )}


          {/* Tab: Empresas Clientes (B2B SaaS) */}
          {currentTab === 'empresas_clientes' && (
            <EmpresasClientesTab
              subTab={empresasClientesSubTab}
              onSubTabChange={setEmpresasClientesSubTab}
              empresas={empresasClientes}
              onAddEmpresa={handleAddEmpresa}
              onUpdateEmpresa={handleUpdateEmpresa}
              onDeleteEmpresa={handleDeleteEmpresa}
              students={students}
              plans={plans}
              currentUser={currentUser}
              onOpenCadastroPreview={handleOpenCadastroPreview}
            />
          )}

          {/* Tab 13: Configurações do Sistema */}
          {currentTab === 'configuracoes' && (
            <ConfiguracoesTab
              settings={settings}
              plans={plans}
              students={students}
              transactions={transactions}
              workouts={workouts}
              classes={classes}
              products={products}
              comandas={comandas}
              recurringCharges={recurringCharges}
              paymentLinks={paymentLinks}
              onSaveSettings={(newSettings) => {
                setSettings(newSettings);
                showToast('Configurações salvas com sucesso!');
              }}
              onResetToDemo={handleResetToDemo}
              currentUser={currentUser}
              onUpdateCurrentUser={(updated) => setCurrentUser(updated)}
              initialSubTab={configuracoesSubTab}
              empresasClientes={empresasClientes}
              onImportStudents={(imported) => {
                setStudents(prev => {
                  const updated = [...prev];
                  imported.forEach(item => {
                    const cleanCpf = (item.cpf || '').replace(/\D/g, '');
                    const cleanEmail = (item.email || '').toLowerCase().trim();
                    const cleanName = item.name.toLowerCase().trim();
                    
                    const existingIdx = updated.findIndex(s => 
                      (cleanCpf && cleanCpf.length >= 7 && s.cpf.replace(/\D/g, '') === cleanCpf) ||
                      (cleanEmail && cleanEmail.includes('@') && s.email.toLowerCase().trim() === cleanEmail) ||
                      (s.name.toLowerCase().trim() === cleanName)
                    );

                    if (existingIdx >= 0) {
                      updated[existingIdx] = {
                        ...updated[existingIdx],
                        ...item,
                        id: updated[existingIdx].id,
                        code: updated[existingIdx].code
                      };
                    } else {
                      updated.unshift(item);
                    }
                  });
                  return updated;
                });
                showToast(`${imported.length} cliente(s) importado(s)/sincronizado(s) com sucesso!`);
                dispatchPushNotification({
                  title: 'Migração de Clientes Concluída',
                  message: `${imported.length} cadastro(s) de alunos foram importados com IA no sistema.`,
                  type: 'success',
                  module: 'alunos',
                  eventType: 'novo_aluno',
                  linkTab: 'clientes',
                  actionLabel: 'Ver Alunos'
                });
              }}
              onImportTransactions={(imported) => {
                setTransactions(prev => [...imported, ...prev]);
                showToast(`${imported.length} lançamento(s) financeiro(s) importado(s)!`);
                dispatchPushNotification({
                  title: 'Migração Financeira Concluída',
                  message: `${imported.length} transação(ões) financeira(s) foram migradas com sucesso.`,
                  type: 'success',
                  module: 'financeiro',
                  eventType: 'pagamento_recebido',
                  linkTab: 'financeiro',
                  actionLabel: 'Ver Financeiro'
                });
              }}
              onImportWorkouts={(imported) => {
                setWorkouts(prev => [...imported, ...prev]);
                showToast(`${imported.length} ficha(s) de treino importada(s)!`);
                dispatchPushNotification({
                  title: 'Fichas de Treino Migradas',
                  message: `${imported.length} treino(s) foram estruturados e vinculados aos alunos.`,
                  type: 'success',
                  module: 'treino',
                  linkTab: 'treino',
                  actionLabel: 'Ver Treinos'
                });
              }}
            />
          )}

          {/* Fallback Vendas */}
          {currentTab === 'vendas' && (
            <VendasTab
              plans={plans}
              products={products}
              students={students}
              onCompleteSale={handleCompleteSale}
            />
          )}
              </Suspense>
            </div>
          )}
        </main>

        {/* System Version & Status Footer */}
        <Footer />
        </div>
      </div>

      {/* Modals */}
      <NovoAlunoModal
        isOpen={isNewStudentModalOpen}
        onClose={() => setIsNewStudentModalOpen(false)}
        plans={plans}
        onAddStudent={handleAddStudent}
      />


      {/* Modal de Configurações Rápidas da Aba / Sub-Aba Ativa */}
      <TabConfigModal
        isOpen={isTabConfigModalOpen}
        onClose={() => setIsTabConfigModalOpen(false)}
        currentTab={currentTab}
        currentSubTab={currentSubTabInfo.subTabKey}
        onNavigateToGeneralSettings={() => {
          setIsTabConfigModalOpen(false);
          const mappedSub: ConfigSubTab = 
            currentTab === 'inicio' ? 'geral' :
            currentTab === 'clientes' ? 'clientes' :
            (currentTab as ConfigSubTab);
          setConfiguracoesSubTab(mappedSub || 'geral');
          handleNavigateTab('configuracoes');
        }}
        onToast={showToast}
      />
    </div>
  );
}
