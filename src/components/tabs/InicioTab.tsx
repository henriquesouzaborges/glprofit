import React, { useState, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  Bell, 
  HelpCircle, 
  Lightbulb, 
  UserPlus, 
  DollarSign, 
  Check, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  ChevronRight, 
  Gift, 
  MessageCircle, 
  Building2,
  ShieldCheck,
  Eye,
  EyeOff,
  Settings,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Student, AccessLog, SystemUser } from '../../types';
import { hasTabPermission } from '../../services/userService';
import { 
  isMasterAdministrator, 
  getPartnerSchoolLicenses, 
  calculateContractCountdown, 
  getLicenseForUser, 
  PartnerSchoolLicense 
} from '../../services/partnerSchoolLicenseService';
import { PartnerSchoolLicenseModal } from '../modals/PartnerSchoolLicenseModal';

interface InicioTabProps {
  students?: Student[];
  accessLogs?: AccessLog[];
  transactions?: any[];
  onOpenNewStudent?: () => void;
  onOpenQuickSale?: () => void;
  onOpenTurnstile?: () => void;
  onOpenNewOpportunity?: () => void;
  onNavigateToTab?: (tab: string) => void;
  onSelectStudent?: (student: Student) => void;
  currentUser?: SystemUser | null;
}

export const InicioTab: React.FC<InicioTabProps> = ({
  students = [],
  accessLogs = [],
  onOpenNewStudent = () => {},
  onOpenQuickSale = () => {},
  onOpenTurnstile = () => {},
  onOpenNewOpportunity = () => {},
  onNavigateToTab = (_tab: string) => {},
  onSelectStudent = (_student: Student) => {},
  currentUser
}) => {
  const [notificationRead, setNotificationRead] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [previewSchoolId, setPreviewSchoolId] = useState<string | null>(null);

  const isAdmin = isMasterAdministrator(currentUser);
  const greetingName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Gianluca';

  const canAccessCrm = hasTabPermission('crm', currentUser);
  const canAccessAlunos = hasTabPermission('alunos', currentUser);
  const canAccessVendas = hasTabPermission('vendas', currentUser);

  // Dados 100% reais regulados com base na base cadastrada
  const activeStudentsCount = useMemo(() => {
    return students.filter(s => s.status === 'ativo').length;
  }, [students]);

  const overdueStudents = useMemo(() => {
    return students.filter(s => s.status === 'inadimplente');
  }, [students]);

  const lockedStudentsCount = useMemo(() => {
    return students.filter(s => s.status === 'trancado').length;
  }, [students]);

  // Licença ativa para exibição do banner de contrato (apenas para escolas terceirizadas parceiras)
  const licenses = getPartnerSchoolLicenses();
  const previewLicense = previewSchoolId ? licenses.find(l => l.id === previewSchoolId) : null;
  const userLicense = getLicenseForUser(currentUser);
  
  // O banner de contrato NUNCA é exibido para o administrador Gianluca Marinho, 
  // exceto se ele acionar voluntariamente a simulação de pré-visualização de uma escola parceira
  const activeLicenseForBanner: PartnerSchoolLicense | null = previewLicense || (!isAdmin ? userLicense : null);

  const countdown = activeLicenseForBanner 
    ? calculateContractCountdown(activeLicenseForBanner.expirationDate)
    : { days: 0, hours: 0, minutes: 0, formattedDays: '00', formattedHours: '00', formattedMinutes: '00', isExpired: false, isUrgent: false };

  // Notificações operacionais reais
  const realNotifications = useMemo(() => {
    const list: Array<{ id: string; title: string; desc: string; date: string; tag: string; isAlert?: boolean }> = [];

    // Alerta de aluno inadimplente real
    if (overdueStudents.length > 0) {
      const firstOverdue = overdueStudents[0];
      list.push({
        id: 'notif-1',
        title: 'Mensalidade Pendente',
        desc: `${firstOverdue.name} está com mensalidade pendente de R$ ${(firstOverdue.pendingAmount || 169.90).toFixed(2).replace('.', ',')}. Catraca com bloqueio preventivo automático.`,
        date: 'Hoje, 08:30',
        tag: 'Cobrança Financeira',
        isAlert: true
      });
    }

    // Alerta para o Administrador sobre escolas parceiras que vencem em breve
    if (isAdmin) {
      const expiringPartner = licenses.find(l => l.isWarningBannerActive);
      if (expiringPartner) {
        const cd = calculateContractCountdown(expiringPartner.expirationDate);
        list.push({
          id: 'notif-partner',
          title: 'Licença de Escola Parceira a Vencer',
          desc: `O contrato da escola parceira "${expiringPartner.schoolName}" vence em ${cd.days} dias. Aviso de cobrança configurado para o login da escola.`,
          date: 'Ontem, 16:45',
          tag: 'Gestão de Licenças',
          isAlert: cd.isUrgent
        });
      }
    }

    // Aluno aniversariante
    const birthdayStudent = students.find(s => s.birthDate && s.birthDate.includes('-10-') || s.birthDate?.includes('-09-'));
    if (birthdayStudent) {
      list.push({
        id: 'notif-2',
        title: 'Aniversariante do Mês',
        desc: `${birthdayStudent.name} comemora aniversário neste mês! Envie um cupom ou mensagem de parabéns pelo WhatsApp.`,
        date: 'Hoje, 09:15',
        tag: 'Relacionamento & Retenção',
        isAlert: false
      });
    }

    return list;
  }, [overdueStudents, isAdmin, licenses, students]);

  return (
    <div className="space-y-5">
      
      {/* 1. BARRA EXCLUSIVA DO ADMINISTRADOR: GESTÃO DE LICENÇAS DE ESCOLAS PARCEIRAS */}
      {isAdmin && (
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-slate-50 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-2xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-950">
                  Painel do Administrador Master
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  Acesso Ilimitado
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Seu perfil não possui aviso de vencimento. Gerencie as licenças, datas de renovação e avisos das <strong>{licenses.length} escolas parceiras terceirizadas</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {previewSchoolId && (
              <button
                type="button"
                onClick={() => setPreviewSchoolId(null)}
                className="px-3 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-slate-800"
                title="Encerrar pré-visualização de escola parceira"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Encerrar Simulação</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowLicenseModal(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Gerenciar Escolas Parceiras</span>
            </button>
          </div>
        </div>
      )}

      {/* Banner de Aviso quando Simulação está ativa para o administrador */}
      {previewSchoolId && previewLicense && (
        <div className="rounded-xl bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Modo de Simulação Ativo: Visualizando o Início como escola parceira <strong>"{previewLicense.schoolName}"</strong>
          </span>
          <button
            onClick={() => setPreviewSchoolId(null)}
            className="underline hover:opacity-80 cursor-pointer"
          >
            Sair do modo de simulação
          </button>
        </div>
      )}

      {/* 2. BANNER DE VENCIMENTO DE CONTRATO (EXIBIDO APENAS PARA ESCOLAS PARCEIRAS COM AVISO ATIVO) */}
      {activeLicenseForBanner && activeLicenseForBanner.isWarningBannerActive && (
        <div className="rounded-xl border border-red-200 bg-white p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-700">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-red-600" />
              Seu contrato vence em
            </span>
            
            <div className="flex items-center gap-3 font-mono">
              <div className="flex flex-col items-center leading-none">
                <span className="text-base sm:text-lg font-extrabold text-red-600">
                  {countdown.formattedDays}
                </span>
                <span className="text-[10px] text-slate-500 font-sans font-medium">Dias</span>
              </div>
              <div className="flex flex-col items-center leading-none">
                <span className="text-base sm:text-lg font-extrabold text-red-600">
                  {countdown.formattedHours}
                </span>
                <span className="text-[10px] text-slate-500 font-sans font-medium">Horas</span>
              </div>
              <div className="flex flex-col items-center leading-none">
                <span className="text-base sm:text-lg font-extrabold text-red-600">
                  {countdown.formattedMinutes}
                </span>
                <span className="text-[10px] text-slate-500 font-sans font-medium">Minutos</span>
              </div>
            </div>

            <span className="hidden lg:inline text-slate-600 pl-2 border-l border-slate-200 text-xs">
              {activeLicenseForBanner.customWarningMessage || 'Evite a perda dos benefícios e bloqueio da catraca no VB SPORT.'}
            </span>
          </div>

          <button
            onClick={() => setShowRenewModal(true)}
            className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>RENOVAR AGORA</span>
          </button>
        </div>
      )}

      {/* 3. SAUDAÇÃO & AÇÕES RÁPIDAS */}
      <div className="sticky top-0 z-10 -mx-3 -mt-3 sm:-mx-5 sm:-mt-5 md:-mx-6 md:-mt-6 px-3 sm:px-5 md:px-6 py-2.5 bg-slate-100/95 backdrop-blur-xs border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs mb-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Bom dia, {greetingName}.
        </h1>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-bold">
          {canAccessCrm && (
            <button
              onClick={onOpenNewOpportunity}
              className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 transition-colors uppercase tracking-wide hover:underline cursor-pointer"
            >
              <Lightbulb className="h-4 w-4" />
              NOVA OPORTUNIDADE
            </button>
          )}

          {canAccessAlunos && (
            <button
              onClick={onOpenNewStudent}
              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wide hover:underline cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              NOVO CLIENTE
            </button>
          )}

          {canAccessVendas && (
            <button
              onClick={onOpenQuickSale}
              className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-wide hover:underline cursor-pointer"
            >
              <DollarSign className="h-4 w-4" />
              NOVA VENDA
            </button>
          )}
        </div>
      </div>

      {/* 4. GRID PRINCIPAL: CARDS COM NÚMEROS REAIS & NOTIFICAÇÕES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Coluna Esquerda: Estatísticas Reais */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* CLIENTES ATIVOS (NÚMERO REAL REGULADO) */}
          <div 
            onClick={() => onNavigateToTab('clientes')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 transition-colors group"
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1.5">
                CLIENTES ATIVOS
                <span title="Clientes ativos com matrícula e contrato regular">
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                </span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Regular
              </span>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              {/* NÚMERO REAL: Mostra a quantidade real de clientes ativos cadastrados */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {activeStudentsCount}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  de {students.length} matriculados
                </span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>{overdueStudents.length} pendente • {lockedStudentsCount} trancado</span>
              <span className="text-blue-600 font-bold group-hover:underline flex items-center">
                Ver clientes <ChevronRight className="h-3 w-3" />
              </span>
            </div>
          </div>

          {/* NOVOS CLIENTES */}
          <div 
            onClick={() => onNavigateToTab('clientes')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 transition-colors group"
          >
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>BASE DE CLIENTES</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Total
              </span>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <span className="text-3xl font-black text-slate-900">
                {students.length}
              </span>
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>Cadastrados no sistema</span>
              <span className="text-emerald-600 font-bold group-hover:underline flex items-center">
                Ver matrículas <ChevronRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Notificações Reais do Sistema */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  NOTIFICAÇÕES OPERACIONAIS ({realNotifications.length})
                </span>
                <button 
                  onClick={() => onNavigateToTab('relatorios')}
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  Ver relatórios
                </button>
              </div>

              {!notificationRead && realNotifications.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {realNotifications.map(notif => (
                    <div key={notif.id} className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        notif.isAlert ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {notif.isAlert ? <AlertTriangle className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-extrabold text-slate-900">{notif.title}</h5>
                          <span className="text-[10px] text-slate-400 font-mono">{notif.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {notif.desc}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                            {notif.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setNotificationRead(true)}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
                    >
                      Marcar todas como lidas
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-8 text-center py-6 text-slate-400 text-xs">
                  <Check className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                  Todas as notificações principais foram visualizadas.
                </div>
              )}
            </div>

            {/* Status da Catraca com Registros Reais */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Catraca & Catraca Virtual Online ({accessLogs.length} acessos registrados na base)</span>
              </div>
              <button
                onClick={onOpenTurnstile}
                className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Abrir Catraca <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BANNERS INFERIORES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Novidades Banner (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white shadow-xs overflow-hidden relative">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            NOVIDADES VB SPORT
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                SUAS LOCAÇÕES RECORRENTES
              </h2>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Agora você pode automatizar a locação de quadras, estúdios, salas de pilates e armários diretamente pela agenda com cobrança recorrente no cartão!
              </p>
              <button
                onClick={() => onNavigateToTab('agenda')}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition-colors shadow-xs cursor-pointer"
              >
                Conhecer Locações na Agenda
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="hidden sm:block">
              <div className="rounded-lg bg-slate-800/80 border border-slate-700/80 p-3 shadow-lg backdrop-blur-xs text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Agenda de Locação</span>
                  <span className="text-emerald-400 font-bold">R$ 150,00 / hora</span>
                </div>
                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div className="h-full bg-blue-500 w-3/4"></div>
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Quadra Poliesportiva / Box</span>
                  <span>14h - 18h Reservado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indique e Ganhe Banner (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-red-50 p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-blue-900 text-xs font-black tracking-wider">
                <span className="font-mono text-blue-900">VB SPORT</span>
              </div>
              <Gift className="h-5 w-5 text-red-600" />
            </div>

            <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
              INDIQUE E GANHE
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Indique outros donos de academia ou personais e ganhe mensalidades gratuitas e créditos de comissão no GL Profit Pay.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => alert("Link de indicação copiado! Compartilhe com outros gestores esportivos.")}
              className="px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Indicar Academia
            </button>
            <div className="h-8 w-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
              <MessageCircle className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE RENOVAÇÃO DE CONTRATO (QUANDO ACIONADO PELA ESCOLA PARCEIRA) */}
      {showRenewModal && activeLicenseForBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-red-600 border-b border-slate-100 pb-3">
              <ShieldAlert className="h-5 w-5" />
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Renovação de Licença • {activeLicenseForBanner.schoolName}
                </h2>
                <span className="text-[10px] text-slate-400">GL PRO FIT Enterprise Partner</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              A licença de uso do sistema para <strong>{activeLicenseForBanner.schoolName}</strong> está no período de renovação. Garanta a continuidade dos acessos à catraca, app do aluno e financeiro.
            </p>

            <div className="rounded-xl bg-blue-50 p-4 border border-blue-100 text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-800">
                <span>{activeLicenseForBanner.planName}</span>
                <span className="text-blue-900 font-black">
                  R$ {activeLicenseForBanner.planPrice.toFixed(2).replace('.', ',')} / mês
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Chave PIX de Renovação: <strong className="text-slate-800">{activeLicenseForBanner.pixKey || 'marinho.gianluca@gmail.com'}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRenewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Lembrar depois
              </button>
              <button
                onClick={() => {
                  setShowRenewModal(false);
                  alert(`Solicitação de renovação enviada para o administrador Gianluca Marinho! Em breve você receberá a confirmação.`);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Confirmar Renovação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE GESTÃO DE ESCOLAS PARCEIRAS (EXCLUSIVO DO ADMINISTRADOR MASTER) */}
      {isAdmin && (
        <PartnerSchoolLicenseModal
          isOpen={showLicenseModal}
          onClose={() => setShowLicenseModal(false)}
          previewSchoolId={previewSchoolId}
          onTogglePreviewSchool={(id) => {
            setPreviewSchoolId(id);
            setShowLicenseModal(false);
          }}
        />
      )}

    </div>
  );
};
