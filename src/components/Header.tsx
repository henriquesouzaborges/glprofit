import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  ChevronDown, 
  Menu, 
  AlertTriangle,
  LogOut,
  UserPlus,
  DollarSign,
  UserCheck,
  BookOpen,
  Headphones,
  Keyboard,
  ExternalLink,
  Info,
  CheckCircle2,
  Trash2,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  ArrowRight,
  Shield,
  Settings
} from 'lucide-react';
import { Student, SystemUser, TabType } from '../types';
import { hasTabPermission } from '../services/userService';
import { SYSTEM_VERSION_INFO } from '../version';
import { 
  PushNotification, 
  getStoredNotifications, 
  saveStoredNotifications, 
  dispatchPushNotification,
  formatTimeAgo,
  isPushSoundEnabled,
  setPushSoundEnabled,
  requestBrowserNotificationPermission
} from '../services/notificationService';

interface HeaderProps {
  onOpenNewStudent?: () => void;
  onOpenQuickSale?: () => void;
  onOpenTurnstile?: () => void;
  onOpenNewOpportunity?: () => void;
  onSelectStudent: (student: Student) => void;
  students: Student[];
  onToggleMobileSidebar: () => void;
  isSidebarCollapsed?: boolean;
  onToggleCollapseSidebar?: () => void;
  onLogout?: () => void;
  currentUser?: SystemUser | null;
  onNavigateTab?: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewStudent,
  onOpenQuickSale,
  onOpenTurnstile,
  onSelectStudent,
  students,
  onToggleMobileSidebar,
  onLogout,
  currentUser,
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Push Notifications State
  const [notifications, setNotifications] = useState<PushNotification[]>(() => getStoredNotifications());
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => isPushSoundEnabled());

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sync notifications on custom events
  useEffect(() => {
    const handleUpdate = () => {
      setNotifications(getStoredNotifications());
    };

    window.addEventListener('vbsport_notifications_updated', handleUpdate);
    window.addEventListener('vbsport_push_notification_event', handleUpdate);
    return () => {
      window.removeEventListener('vbsport_notifications_updated', handleUpdate);
      window.removeEventListener('vbsport_push_notification_event', handleUpdate);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    const next = notifications.map(n => ({ ...n, read: true }));
    setNotifications(next);
    saveStoredNotifications(next);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    saveStoredNotifications([]);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    setPushSoundEnabled(next);
  };

  const handleTestNotification = () => {
    dispatchPushNotification({
      title: 'Alerta Push de Demonstração',
      message: 'Sistema de alertas push funcionando com sucesso com som de chime e notificação visual!',
      type: 'success',
      module: 'sistema',
      linkTab: 'inicio',
      actionLabel: 'Ver Início'
    });
  };

  const handleNotificationClick = (item: PushNotification) => {
    // Mark as read
    const next = notifications.map(n => n.id === item.id ? { ...n, read: true } : n);
    setNotifications(next);
    saveStoredNotifications(next);

    setShowNotifications(false);
    if (item.linkTab && onNavigateTab) {
      onNavigateTab(item.linkTab);
    }
  };

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setShowSearchResults(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setShowNotifications(false);
      }
      if (helpRef.current && !helpRef.current.contains(target)) {
        setShowHelp(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = currentUser?.name || 'Gian Luca Marinho Silva';
  const displayEmail = currentUser?.email || 'marinho.gianluca@gmail.com';
  const displayDepartment = currentUser?.department || 'VILLE BLANCHE SPORT';
  const displayRoleLabel = currentUser?.role ? currentUser.role.toUpperCase() : 'ADMIN';
  const userInitials = displayName
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'GL';

  const filteredStudents = searchQuery.trim() === '' 
    ? [] 
    : students.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.cpf.includes(searchQuery) ||
        s.code.includes(searchQuery) ||
        s.phone.includes(searchQuery)
      ).slice(0, 5);

  const displayedNotifications = notifFilter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between bg-[#102a43] text-white px-3 sm:px-5 shadow-sm border-b border-blue-900">
      {/* Esquerda: Botão Menu Mobile (essencial para telas pequenas) e Barra de Pesquisa */}
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
        <button
          onClick={onToggleMobileSidebar}
          className="rounded-lg p-1.5 text-white/90 hover:bg-white/10 md:hidden focus:outline-hidden cursor-pointer"
          title="Abrir Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Barra de Pesquisa */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md lg:max-w-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-200" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Pesquisar clientes e leads..."
              className="w-full rounded-lg border border-blue-400/30 bg-blue-950/50 py-1.5 sm:py-2 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-blue-200/70 transition-colors focus:bg-blue-950/80 focus:border-white focus:outline-hidden"
            />
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchQuery.trim() !== '' && (
            <div className="absolute left-0 top-full mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-800 shadow-xl z-50">
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Resultados Encontrados ({filteredStudents.length})
              </div>
              {filteredStudents.length > 0 ? (
                <div className="mt-1 space-y-1">
                  {filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => {
                        onSelectStudent(student);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <img
                        src={student.photo}
                        alt={student.name}
                        className="h-8 w-8 rounded-full object-cover border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {student.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          Matrícula: {student.code} • {student.planName}
                        </div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        student.status === 'ativo' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {student.status.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-slate-500">
                  Nenhum resultado com "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Direita: Notificações, Ajuda e Perfil */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">

        {/* 1. Ícone de Notificações com Alertas Push */}
        <div ref={notificationsRef} className="relative">
          <button
            onClick={() => {
              setShowNotifications(prev => !prev);
              setShowHelp(false);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            title="Central de Alertas Push"
          >
            <Bell className="h-4 sm:h-5 w-4 sm:w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 sm:h-4.5 sm:w-4.5 items-center justify-center rounded-full bg-red-600 text-[9px] sm:text-[10px] font-black text-white ring-2 ring-[#102a43] animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 text-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Alertas Push & Notificações
                  </span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black text-red-700">
                      {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="text-[10px] font-bold text-blue-700 hover:text-blue-800 hover:underline px-1 py-0.5"
                    >
                      Ler todas
                    </button>
                  )}
                </div>
              </div>

              {/* Filters & Tools Bar */}
              <div className="flex items-center justify-between gap-1 pt-2 pb-1.5 border-b border-slate-100 text-[11px]">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setNotifFilter('all')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                      notifFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    Todas ({notifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotifFilter('unread')}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                      notifFilter === 'unread' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    Não lidas ({unreadCount})
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className={`p-1 rounded-md transition-colors ${
                      soundEnabled ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={soundEnabled ? 'Som de chime ativado' : 'Som de chime desativado'}
                  >
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleClearNotifications}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Limpar histórico"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto custom-scrollbar text-xs">
                {displayedNotifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Nenhuma notificação {notifFilter === 'unread' ? 'não lida' : 'no momento'}.
                  </div>
                ) : (
                  displayedNotifications.map((notif) => {
                    let borderClass = 'border-slate-200';
                    let bgClass = notif.read ? 'bg-white' : 'bg-blue-50/40 border-l-4 border-l-blue-600';
                    let icon = <Bell className="w-4 h-4 text-blue-600" />;

                    if (notif.type === 'success') {
                      icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
                    } else if (notif.type === 'warning' || notif.type === 'alert') {
                      icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
                    }

                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-2.5 rounded-xl border ${borderClass} ${bgClass} hover:border-blue-400 transition-all cursor-pointer space-y-1 relative group`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 shrink-0">
                            {icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-slate-900 truncate block">
                                {notif.title}
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {formatTimeAgo(notif.timestamp)}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug line-clamp-2 mt-0.5">
                              {notif.message}
                            </p>
                          </div>
                        </div>

                        {notif.linkTab && (
                          <div className="flex items-center justify-between pt-1 text-[10px] text-blue-700 font-bold">
                            <span className="uppercase text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                              {notif.module}
                            </span>
                            <span className="flex items-center gap-0.5 group-hover:underline">
                              <span>{notif.actionLabel || 'Ver registro'}</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Actions Footer */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleTestNotification}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Testar Alerta Push</span>
                </button>

                <button
                  type="button"
                  onClick={() => requestBrowserNotificationPermission()}
                  className="text-[10px] text-slate-500 hover:text-slate-800 font-medium hover:underline"
                >
                  Permitir no Navegador
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Ícone de Interrogação (Ajuda e Suporte) */}
        <div ref={helpRef} className="relative">
          <button
            onClick={() => {
              setShowHelp(prev => !prev);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            title="Ajuda e Suporte"
          >
            <HelpCircle className="h-4 sm:h-5 w-4 sm:w-5" />
          </button>

          {showHelp && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 text-slate-800 shadow-xl z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Central de Ajuda</h4>
                  <p className="text-[10px] text-slate-400">VB SPORT & Suporte Técnico</p>
                </div>
              </div>

              <div className="mt-2 space-y-1.5">
                <div className="rounded-lg p-2 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-200">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                    <div>
                      <span className="font-medium text-slate-800 block text-[11px]">Base de Conhecimento</span>
                      <span className="text-[10px] text-slate-400">Manuais e tutoriais passo a passo</span>
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </div>

                <div className="rounded-lg p-2 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-200">
                  <div className="flex items-center gap-2">
                    <Headphones className="h-3.5 w-3.5 text-emerald-600" />
                    <div>
                      <span className="font-medium text-slate-800 block text-[11px]">Suporte Técnico</span>
                      <span className="text-[10px] text-slate-400">Atendimento e chamados</span>
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </div>

                <div className="rounded-lg p-2 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-200">
                  <div className="flex items-center gap-2">
                    <Keyboard className="h-3.5 w-3.5 text-purple-600" />
                    <div>
                      <span className="font-medium text-slate-800 block text-[11px]">Atalhos de Teclado</span>
                      <span className="text-[10px] text-slate-400">Agilidade no balcão e PDV</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1 rounded">Ctrl+K</span>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Sistema GL PRO FIT
                </span>
                <span className="font-semibold text-slate-600">{SYSTEM_VERSION_INFO.version}</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Identificação do Perfil */}
        <div ref={userMenuRef} className="relative pl-1">
          <button
            onClick={() => {
              setShowUserMenu(prev => !prev);
              setShowNotifications(false);
              setShowHelp(false);
            }}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-white/10 transition-colors text-left cursor-pointer"
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover border-2 border-red-500 shadow-xs"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white text-[#102a43] font-black text-xs flex items-center justify-center shadow-xs border-2 border-red-500">
                {userInitials}
              </div>
            )}
            <div className="hidden lg:block leading-tight max-w-[170px]">
              <div className="text-xs font-bold text-white truncate" title={displayName}>
                {displayName}
              </div>
              <div className="text-[10px] text-blue-200 truncate uppercase font-semibold flex items-center gap-1">
                <span>{displayDepartment}</span>
                <span className="rounded bg-blue-800/80 px-1 text-[9px] text-blue-100">
                  {displayRoleLabel}
                </span>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-white/80 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 text-slate-800 shadow-xl z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 border-b border-slate-100">
                <div className="font-bold text-slate-900 truncate" title={displayName}>{displayName}</div>
                <div className="text-slate-400 text-[11px] truncate font-mono">{displayEmail}</div>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="rounded bg-blue-50 border border-blue-200 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                    {displayRoleLabel}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">
                    {displayDepartment}
                  </span>
                </div>
              </div>
              <div className="py-1">
                {onOpenNewStudent && hasTabPermission('alunos', currentUser) && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenNewStudent();
                    }}
                    className="flex w-full items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-slate-700 cursor-pointer"
                  >
                    <UserPlus className="h-3.5 w-3.5 text-blue-600" />
                    Novo Cliente
                  </button>
                )}
                {onOpenQuickSale && hasTabPermission('vendas', currentUser) && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenQuickSale();
                    }}
                    className="flex w-full items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-slate-700 cursor-pointer"
                  >
                    <DollarSign className="h-3.5 w-3.5 text-red-600" />
                    Nova Venda (PDV)
                  </button>
                )}
                {onOpenTurnstile && hasTabPermission('catraca', currentUser) && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenTurnstile();
                    }}
                    className="flex w-full items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-slate-700 cursor-pointer"
                  >
                    <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                    Abrir Catraca
                  </button>
                )}
                {hasTabPermission('configuracoes', currentUser) && onNavigateTab && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigateTab('configuracoes');
                    }}
                    className="flex w-full items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-slate-700 cursor-pointer"
                  >
                    <Settings className="h-3.5 w-3.5 text-slate-600" />
                    Configurações do Sistema
                  </button>
                )}
                {onLogout && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="flex w-full items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-red-50 text-red-700 border-t border-slate-100 mt-1 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5 text-red-600" />
                    Sair da Conta (Ir para Login)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
