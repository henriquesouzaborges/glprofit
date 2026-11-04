import React, { useState, useEffect } from 'react';
import { 
  INITIAL_SETTINGS, 
  INITIAL_PLANS, 
  INITIAL_STUDENTS, 
  INITIAL_PRODUCTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_CLASSES, 
  INITIAL_WORKOUTS, 
  INITIAL_ACCESS_LOGS, 
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
  AccessLog, 
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
  SystemUserRole
} from './types';
import { 
  getActiveSessionUser, 
  setActiveSessionUser, 
  findUserByEmail,
  hasTabPermission,
  getFirstAllowedTab,
  getModuleName
} from './services/userService';
import { Lock, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { InicioTab } from './components/tabs/InicioTab';
import { DashboardsTab, DashboardSubTab } from './components/tabs/DashboardsTab';
import { AlunosTab } from './components/tabs/AlunosTab';
import { ProfessoresTab } from './components/tabs/ProfessoresTab';
import { CrmTab } from './components/tabs/CrmTab';
import { AgendaTab } from './components/tabs/AgendaTab';
import { WhatsappTab, WhatsappTargetChat } from './components/tabs/whatsapp/WhatsappTab';
import { VbSportPayTab } from './components/tabs/VbSportPayTab';
import { FinanceiroTab } from './components/tabs/FinanceiroTab';
import { EstoqueTab } from './components/tabs/EstoqueTab';
import { ComandasTab } from './components/tabs/ComandasTab';
import { TreinosTab } from './components/tabs/TreinosTab';
import { AvaliacoesFisicasTab } from './components/tabs/AvaliacoesFisicasTab';
import { NutricaoTab } from './components/tabs/NutricaoTab';
import { BemEstarTab } from './components/tabs/BemEstarTab';
import { RelatoriosTab } from './components/tabs/RelatoriosTab';
import { CatracaTab } from './components/tabs/CatracaTab';
import { ConfiguracoesTab, ConfigSubTab } from './components/tabs/ConfiguracoesTab';
import { VendasTab } from './components/tabs/VendasTab';
import { NovoAlunoModal } from './components/modals/NovoAlunoModal';
import { FichaAlunoModal } from './components/modals/FichaAlunoModal';
import { TabConfigModal } from './components/modals/TabConfigModal';
import { getActiveSubTabInfo, getAgendaSettings } from './services/tabSettingsService';
import { LoginPage } from './components/LoginPage';
import { CadastroPage } from './components/CadastroPage';
import { Footer } from './components/Footer';
import { PushNotificationContainer } from './components/notifications/PushNotificationContainer';
import { dispatchPushNotification } from './services/notificationService';
import { 
  initializeDatabase, 
  subscribeToFirestoreCollection, 
  syncCollectionToFirestore 
} from './services/firebaseDbService';

export default function App() {
  const [currentUser, setCurrentUser] = useState<SystemUser>(() => getActiveSessionUser());

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
  const [configuracoesSubTab, setConfiguracoesSubTab] = useState<ConfigSubTab>('geral');
  const [isTabConfigModalOpen, setIsTabConfigModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('vbsport_sidebar_collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Auth State (defaults to false on fresh start to show requested login page immediately)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('vbsport_auth_session');
    return saved ? JSON.parse(saved) : false;
  });

  const [authView, setAuthView] = useState<'login' | 'cadastro'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view') || params.get('page') || params.get('action');
      if (view === 'cadastro' || view === 'register') return 'cadastro';
      if (window.location.hash === '#cadastro' || window.location.hash === '#register') return 'cadastro';
    }
    return 'login';
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view') || params.get('page') || params.get('action');
      if (view === 'cadastro' || view === 'register' || window.location.hash === '#cadastro' || window.location.hash === '#register') {
        setAuthView('cadastro');
      } else {
        setAuthView('login');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

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
    showToast('Você saiu da sua conta.');
  };

  useEffect(() => {
    localStorage.setItem('vbsport_sidebar_collapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Persistence States
  const [settings, setSettings] = useState<GymSettings>(() => {
    const saved = localStorage.getItem('vbsport_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
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

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(() => {
    const saved = localStorage.getItem('vbsport_access_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACCESS_LOGS;
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
  const [studentToTestInTurnstile, setStudentToTestInTurnstile] = useState<Student | null>(null);
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
        setStudentToTestInTurnstile(null);
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

  // Sincronização em Tempo Real com Banco de Dados Firebase Firestore
  useEffect(() => {
    initializeDatabase();

    const unsubSettings = subscribeToFirestoreCollection('system_settings', (data) => {
      if (data && data.length > 0) {
        const general = data.find((d: any) => d.id === 'general') || data[0];
        setSettings(prev => ({ ...prev, ...general }));
      }
    });
    const unsubPlans = subscribeToFirestoreCollection('plans', (data) => setPlans(data), INITIAL_PLANS);
    const unsubStudents = subscribeToFirestoreCollection('students', (data) => setStudents(data), INITIAL_STUDENTS);
    const unsubTx = subscribeToFirestoreCollection('financial_transactions', (data) => setTransactions(data), INITIAL_TRANSACTIONS);
    const unsubClasses = subscribeToFirestoreCollection('classes', (data) => setClasses(data), INITIAL_CLASSES);
    const unsubWorkouts = subscribeToFirestoreCollection('workouts', (data) => setWorkouts(data), INITIAL_WORKOUTS);
    const unsubLogs = subscribeToFirestoreCollection('access_logs', (data) => setAccessLogs(data), INITIAL_ACCESS_LOGS);
    const unsubLeads = subscribeToFirestoreCollection('leads', (data) => setLeads(data), INITIAL_LEADS);
    const unsubProducts = subscribeToFirestoreCollection('products', (data) => setProducts(data), INITIAL_PRODUCTS);
    const unsubComandas = subscribeToFirestoreCollection('comandas', (data) => setComandas(data), INITIAL_COMANDAS);
    const unsubStock = subscribeToFirestoreCollection('stock_movements', (data) => setStockMovements(data), INITIAL_STOCK_MOVEMENTS);
    const unsubSuppliers = subscribeToFirestoreCollection('suppliers', (data) => setSuppliers(data), INITIAL_SUPPLIERS);
    const unsubRecurring = subscribeToFirestoreCollection('recurring_charges', (data) => setRecurringCharges(data), INITIAL_PAY_RECURRING);
    const unsubLinks = subscribeToFirestoreCollection('payment_links', (data) => setPaymentLinks(data), INITIAL_PAYMENT_LINKS);
    const unsubCrmActivities = subscribeToFirestoreCollection('crm_activities', (data) => setCrmActivities(data), INITIAL_CRM_ACTIVITIES);
    const unsubAutomations = subscribeToFirestoreCollection('crm_automations', (data) => setCrmAutomations(data), INITIAL_CRM_AUTOMATIONS);
    const unsubSurveys = subscribeToFirestoreCollection('satisfaction_surveys', (data) => setSatisfactionSurveys(data), INITIAL_SATISFACTION_SURVEYS);
    const unsubCalendar = subscribeToFirestoreCollection('calendar_events', (data) => setCalendarEvents(data), INITIAL_CALENDAR_EVENTS);

    return () => {
      unsubSettings();
      unsubPlans();
      unsubStudents();
      unsubTx();
      unsubClasses();
      unsubWorkouts();
      unsubLogs();
      unsubLeads();
      unsubProducts();
      unsubComandas();
      unsubStock();
      unsubSuppliers();
      unsubRecurring();
      unsubLinks();
      unsubCrmActivities();
      unsubAutomations();
      unsubSurveys();
      unsubCalendar();
    };
  }, []);

  // Sync to LocalStorage and Firebase Firestore Cloud Database
  useEffect(() => {
    localStorage.setItem('vbsport_settings', JSON.stringify(settings));
    syncCollectionToFirestore('system_settings', [{ id: 'general', ...settings }]);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('vbsport_plans', JSON.stringify(plans));
    syncCollectionToFirestore('plans', plans);
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('vbsport_students', JSON.stringify(students));
    syncCollectionToFirestore('students', students);
  }, [students]);

  useEffect(() => {
    localStorage.setItem('vbsport_transactions', JSON.stringify(transactions));
    syncCollectionToFirestore('financial_transactions', transactions);
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('vbsport_classes', JSON.stringify(classes));
    syncCollectionToFirestore('classes', classes);
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('vbsport_workouts', JSON.stringify(workouts));
    syncCollectionToFirestore('workouts', workouts);
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('vbsport_access_logs', JSON.stringify(accessLogs));
    syncCollectionToFirestore('access_logs', accessLogs);
  }, [accessLogs]);

  useEffect(() => {
    localStorage.setItem('vbsport_leads', JSON.stringify(leads));
    syncCollectionToFirestore('leads', leads);
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('vbsport_products', JSON.stringify(products));
    syncCollectionToFirestore('products', products);
  }, [products]);

  useEffect(() => {
    localStorage.setItem('vbsport_comandas', JSON.stringify(comandas));
    syncCollectionToFirestore('comandas', comandas);
  }, [comandas]);

  useEffect(() => {
    localStorage.setItem('vbsport_stock_movements', JSON.stringify(stockMovements));
    syncCollectionToFirestore('stock_movements', stockMovements);
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem('vbsport_suppliers', JSON.stringify(suppliers));
    syncCollectionToFirestore('suppliers', suppliers);
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('vbsport_recurring', JSON.stringify(recurringCharges));
    syncCollectionToFirestore('recurring_charges', recurringCharges);
  }, [recurringCharges]);

  useEffect(() => {
    localStorage.setItem('vbsport_payment_links', JSON.stringify(paymentLinks));
    syncCollectionToFirestore('payment_links', paymentLinks);
  }, [paymentLinks]);

  useEffect(() => {
    localStorage.setItem('vbsport_crm_activities', JSON.stringify(crmActivities));
    syncCollectionToFirestore('crm_activities', crmActivities);
  }, [crmActivities]);

  useEffect(() => {
    localStorage.setItem('vbsport_crm_automations', JSON.stringify(crmAutomations));
    syncCollectionToFirestore('crm_automations', crmAutomations);
  }, [crmAutomations]);

  useEffect(() => {
    localStorage.setItem('vbsport_crm_surveys', JSON.stringify(satisfactionSurveys));
    syncCollectionToFirestore('satisfaction_surveys', satisfactionSurveys);
  }, [satisfactionSurveys]);

  useEffect(() => {
    localStorage.setItem('vbsport_calendar_events', JSON.stringify(calendarEvents));
    syncCollectionToFirestore('calendar_events', calendarEvents);
  }, [calendarEvents]);

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
  const handleAddStudent = (newStudent: Student, firstTx?: FinancialTransaction) => {
    setStudents(prev => [newStudent, ...prev]);
    if (firstTx) {
      setTransactions(prev => [firstTx, ...prev]);
    }
    showToast(`Cliente ${newStudent.name} cadastrado com sucesso!`);
    dispatchPushNotification({
      title: 'Novo Aluno Matriculado',
      message: `${newStudent.name} matriculado no plano ${newStudent.planName}.`,
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
    showToast('Mensalidade quitada! Cliente regularizado e liberado na catraca.');
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

  const handleRegisterAccess = (log: AccessLog) => {
    setAccessLogs(prev => [log, ...prev]);
    setStudents(prev => prev.map(s => {
      if (s.id === log.studentId) {
        return { ...s, lastAccess: log.timestamp };
      }
      return s;
    }));

    // Integração Catraca -> Presença Automática na Agenda
    const agendaSettings = getAgendaSettings();
    if (log.status === 'liberado' && log.type === 'entrada' && agendaSettings.presencaAutomaticaCatraca) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      let autoMarkedClassTitle: string | null = null;

      setClasses(prev => prev.map(c => {
        const isEnrolled = c.enrolledStudents.some(e => e.studentId === log.studentId);
        if (!isEnrolled) return c;

        if (!autoMarkedClassTitle) {
          autoMarkedClassTitle = c.title;
        }

        return {
          ...c,
          enrolledStudents: c.enrolledStudents.map(e => {
            if (e.studentId === log.studentId) {
              return {
                ...e,
                checkedIn: true,
                status: 'presente',
                checkInTime: timeStr,
                checkInSource: 'catraca'
              };
            }
            return e;
          })
        };
      }));

      if (autoMarkedClassTitle && agendaSettings.notificarPresencaCatraca) {
        showToast(`Presença de ${log.studentName} confirmada na aula "${autoMarkedClassTitle}" via Catraca!`);
        dispatchPushNotification({
          title: 'Presença Automática via Catraca',
          message: `${log.studentName} teve sua presença confirmada na aula "${autoMarkedClassTitle}" ao liberar a catraca.`,
          type: 'success',
          module: 'agenda',
          eventType: 'catraca_presenca_auto',
          linkTab: 'agenda',
          actionLabel: 'Ver Grade'
        });
      }
    }

    showToast(log.status === 'liberado' ? 'Acesso Liberado!' : 'Acesso Bloqueado pela Catraca!');
    dispatchPushNotification({
      title: log.status === 'liberado' ? 'Catraca: Entrada Liberada' : 'Catraca: Entrada Bloqueada',
      message: `${log.studentName} - ${log.reason || (log.status === 'liberado' ? 'Acesso autorizado' : 'Acesso bloqueado')}.`,
      type: log.status === 'liberado' ? 'success' : 'error',
      module: 'catraca',
      eventType: log.status === 'liberado' ? 'catraca_liberada' : 'catraca_bloqueada',
      linkTab: 'catraca',
      actionLabel: 'Ver Catraca'
    });
  };

  const handleUpdateLeadStage = (leadId: string, newStage: LeadStage) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage, lastContact: 'Hoje' } : l));
    showToast(`Lead movido para ${newStage.toUpperCase()}`);
  };

  const handleConvertLeadToStudent = (lead: Lead) => {
    const newStudent: Student = {
      id: `std-conv-${Date.now()}`,
      code: `00${Math.floor(100 + Math.random() * 899)}`,
      name: lead.name,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      email: lead.email || `${lead.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: lead.phone,
      cpf: '000.000.000-00',
      birthDate: '1998-05-20',
      status: 'ativo',
      planId: plans?.[0]?.id || 'plan-1',
      planName: plans?.[0]?.name || 'Plano Mensal',
      planPrice: plans?.[0]?.price || 120,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      pendingAmount: 0,
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
    setAccessLogs(INITIAL_ACCESS_LOGS);
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

  if (!isAuthenticated) {
    return (
      <>
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-medium text-white shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            {toastMessage}
          </div>
        )}
        {authView === 'cadastro' ? (
          <CadastroPage
            onBackToLogin={() => {
              setAuthView('login');
              try {
                window.history.replaceState({}, '', window.location.pathname);
              } catch (e) {
                console.warn(e);
              }
            }}
            onCadastroSuccess={(data) => {
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

      {/* Sidebar - Matching screenshot tabs com rolagem isolada */}
      <Sidebar
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
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        overdueCount={overdueCount}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        currentUser={currentUser}
      />

      {/* Main Content Area - Coluna central com cabeçalho fixo e rolagem isolada */}
      <div className="flex-1 flex flex-col min-w-0 h-screen max-h-screen overflow-hidden">
        {/* Floating Real-Time Push Notification Container */}
        <PushNotificationContainer onNavigateTab={(tab) => handleNavigateTab(tab)} />

        {/* Header - Barra Superior Fixa com Atalhos (Não desaparece ao rolar) */}
        <Header
          onOpenNewStudent={() => setIsNewStudentModalOpen(true)}
          onOpenQuickSale={() => handleNavigateTab('vendas')}
          onOpenTurnstile={() => handleNavigateTab('catraca')}
          onOpenNewOpportunity={() => {
            setCrmSubTab('leads');
            handleNavigateTab('crm');
          }}
          onSelectStudent={(student) => setSelectedStudentForSheet(student)}
          students={students}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleCollapseSidebar={() => setIsSidebarCollapsed(prev => !prev)}
          onLogout={handleLogout}
          currentUser={currentUser}
          onNavigateTab={(tab) => handleNavigateTab(tab)}
        />

        {/* Scroll Container Isolado da Página Central */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-main-scrollbar flex flex-col">
          {/* Tab Router Content */}
          <main className="flex-1 p-3 sm:p-5 md:p-6 max-w-7xl w-full mx-auto">
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
              {/* Tab 1: Início (Home view from screenshot) */}
              {currentTab === 'inicio' && (
                <InicioTab
                  students={students}
                  accessLogs={accessLogs}
                  transactions={transactions}
                  onNavigateToTab={(tab) => handleNavigateTab(tab as TabType)}
                  onOpenNewStudent={() => setIsNewStudentModalOpen(true)}
                  onOpenQuickSale={() => handleNavigateTab('vendas')}
                  onOpenTurnstile={() => handleNavigateTab('catraca')}
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
              accessLogs={accessLogs}
              leads={leads}
              classes={classes}
              workouts={workouts}
              subTab={dashboardSubTab}
              onSubTabChange={(sub) => setDashboardSubTab(sub)}
              onNavigateToTab={(tab) => setCurrentTab(tab as TabType)}
            />
          )}

          {/* Tab 3: Clientes (Lista e Gestão de Alunos) */}
          {(currentTab === 'clientes' || (currentTab as string) === 'alunos') && (
            <AlunosTab
              students={students}
              onOpenNewStudent={() => setIsNewStudentModalOpen(true)}
              onSelectStudent={(student) => setSelectedStudentForSheet(student)}
              onTestTurnstile={(student) => {
                setStudentToTestInTurnstile(student);
                setCurrentTab('catraca');
              }}
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

          {/* Tab: Financeiro (Contas a Receber, Pagar, DRE, Extrato e GL Profit Pay como sub-aba) */}
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
              accessLogs={accessLogs}
            />
          )}

          {/* Tab 12: Catraca (Simulador e Monitoramento em Tempo Real) */}
          {currentTab === 'catraca' && (
            <CatracaTab
              students={students}
              classes={classes}
              accessLogs={accessLogs}
              onRegisterAccess={handleRegisterAccess}
              selectedStudentToTest={studentToTestInTurnstile}
              onOpenConfiguracoes={() => {
                setConfiguracoesSubTab('catraca');
                setCurrentTab('configuracoes');
              }}
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
              accessLogs={accessLogs}
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

      <FichaAlunoModal
        student={selectedStudentForSheet}
        isOpen={!!selectedStudentForSheet}
        onClose={() => setSelectedStudentForSheet(null)}
        transactions={transactions}
        workouts={workouts}
        accessLogs={accessLogs}
        onUpdateStudentStatus={handleUpdateStudentStatus}
        onTestTurnstile={(student) => {
          setStudentToTestInTurnstile(student);
          setCurrentTab('catraca');
        }}
        onSettleStudentPayment={handleSettleStudentPayment}
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
            currentTab === 'alunos' ? 'clientes' :
            (currentTab as ConfigSubTab);
          setConfiguracoesSubTab(mappedSub || 'geral');
          handleNavigateTab('configuracoes');
        }}
        onToast={showToast}
      />
    </div>
  );
}
