import React from 'react';
import { 
  Users, 
  DollarSign, 
  AlertCircle, 
  UserCheck, 
  TrendingUp, 
  Cake, 
  MessageSquare, 
  Plus, 
  ArrowUpRight, 
  ShoppingBag, 
  Calendar, 
  ShieldCheck, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { Student, AccessLog } from '../../types';
import { formatCurrency, sendWhatsAppMessage } from '../../utils';

interface DashboardTabProps {
  students: Student[];
  accessLogs: AccessLog[];
  onOpenNewStudent: () => void;
  onOpenQuickSale: () => void;
  onOpenTurnstile: () => void;
  onNavigateToTab: (tab: any) => void;
  onSelectStudent: (student: Student) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  students,
  accessLogs,
  onOpenNewStudent,
  onOpenQuickSale,
  onOpenTurnstile,
  onNavigateToTab,
  onSelectStudent
}) => {
  const activeStudents = students.filter(s => s.status === 'ativo').length;
  const overdueStudents = students.filter(s => s.status === 'inadimplente');
  const lockedStudents = students.filter(s => s.status === 'trancado').length;

  const totalMonthlyBilling = students.reduce((acc, s) => {
    if (s.status === 'ativo') return acc + s.planPrice;
    return acc;
  }, 0) + 48200; // Realistic base volume for VB Sport

  const birthdays = [
    { name: 'Fernanda Albuquerque Costa', date: '03/09', phone: '(11) 96456-7890', plan: 'Plano Semestral Fit' },
    { name: 'Gabriel Santana', date: '08/09', phone: '(11) 97788-9900', plan: 'Plano Anual Black VIP' },
    { name: 'Gianluca Marinho', date: '09/10', phone: '(11) 99123-4567', plan: 'Plano Anual Black VIP' }
  ];

  const peakHours = [
    { hour: '06:00', percent: 45 },
    { hour: '07:00', percent: 85 },
    { hour: '08:00', percent: 70 },
    { hour: '12:00', percent: 60 },
    { hour: '17:00', percent: 80 },
    { hour: '18:00', percent: 98, isPeak: true },
    { hour: '19:00', percent: 92 },
    { hour: '20:00', percent: 65 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl bg-white p-6 border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Olá, Gianluca Marinho
            </h1>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              VB SPORT ADM
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Painel operacional da Unidade Matriz. Catraca online, 184 acessos registrados hoje.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenNewStudent}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo Aluno
          </button>
          <button
            onClick={onOpenQuickSale}
            className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <ShoppingBag className="h-4 w-4 text-slate-500" />
            Venda Balcão (PDV)
          </button>
          <button
            onClick={onOpenTurnstile}
            className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <UserCheck className="h-4 w-4 text-slate-500" />
            Catraca
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Students */}
        <div 
          onClick={() => onNavigateToTab('alunos')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Alunos Ativos
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{activeStudents + 342}</span>
            <span className="flex items-center text-xs font-medium text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> +14 no mês
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{lockedStudents} trancados</span>
            <span className="text-blue-600 font-medium flex items-center group-hover:underline">
              Ver lista <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div 
          onClick={() => onNavigateToTab('financeiro')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Faturamento Previsto
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{formatCurrency(totalMonthlyBilling)}</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>92% já liquidado</span>
            <span className="text-blue-600 font-medium flex items-center group-hover:underline">
              Financeiro <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* Overdue / Delinquency */}
        <div 
          onClick={() => onNavigateToTab('financeiro')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-rose-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Inadimplência
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition-colors">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{overdueStudents.length}</span>
            <span className="text-xs font-medium text-rose-600">
              (R$ {overdueStudents.reduce((acc, s) => acc + s.pendingAmount, 0).toFixed(2)})
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Bloqueio na catraca ativo</span>
            <span className="text-rose-600 font-medium flex items-center group-hover:underline">
              Cobranças <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* Turnstile Access Today */}
        <div 
          onClick={() => onNavigateToTab('catraca')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Acessos Hoje (Catraca)
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">184</span>
            <span className="text-xs font-medium text-emerald-600">
              98.9% autorizados
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Pico previsto às 18:00</span>
            <span className="text-blue-600 font-medium flex items-center group-hover:underline">
              Monitor ao vivo <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Real-time Access Log & Peak Hours + Birthdays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Turnstile Feed */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Acessos em Tempo Real (Catraca)
              </h2>
              <p className="text-xs text-slate-500">Últimas passagens registradas na entrada da academia</p>
            </div>
            <button
              onClick={() => onNavigateToTab('catraca')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Abrir Monitor <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {accessLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between py-3 hover:bg-slate-50 rounded-lg px-2 transition-colors">
                <div className="flex items-center gap-3">
                  <img
                    src={log.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={log.studentName}
                    className="h-9 w-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {log.studentName}
                    </div>
                    <div className="text-xs text-slate-500">
                      Matrícula {log.studentCode} • {log.turnstile}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    log.status === 'liberado'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                  }`}>
                    {log.status === 'liberado' ? 'LIBERADO' : 'BLOQUEADO'}
                  </span>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    {log.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Peak Hours visualizer */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Fluxo Estimado por Horário (Hoje)
            </h3>
            <div className="grid grid-cols-8 gap-2 items-end h-24">
              {peakHours.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <div 
                    style={{ height: `${item.percent}%` }}
                    className={`w-full rounded-t-sm transition-all ${
                      item.isPeak 
                        ? 'bg-rose-500' 
                        : item.percent > 75 
                          ? 'bg-blue-600' 
                          : 'bg-slate-200'
                    }`}
                    title={`${item.hour}: ${item.percent}% de lotação`}
                  />
                  <span className={`text-[10px] ${item.isPeak ? 'font-semibold text-rose-600' : 'text-slate-500'}`}>
                    {item.hour}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Birthdays & Quick Actions */}
        <div className="space-y-6">
          {/* Birthdays Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Cake className="h-4 w-4 text-slate-600" />
                Aniversariantes
              </h2>
              <span className="text-xs font-medium text-slate-400">Setembro</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {birthdays.map((b, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 border border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{b.name}</div>
                    <div className="text-[11px] text-slate-500">Dia {b.date} • {b.plan}</div>
                  </div>
                  <button
                    onClick={() => sendWhatsAppMessage(b.phone, `Olá ${b.name}! A equipe da GL PRO FIT deseja um feliz aniversário! Parabéns por sua dedicação nos treinos!`, b.name)}
                    className="flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
                    title="Parabenizar no WhatsApp Interno"
                  >
                    <MessageSquare className="h-3 w-3 text-emerald-600" />
                    Parabenizar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tasks / Alerts */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              Tarefas da Recepção
            </h2>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-slate-50 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="line-through text-slate-400">Conferir abertura do caixa da manhã</span>
              </label>
              <label className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-slate-50 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-slate-700 font-medium">Contatar alunos inadimplentes (Carlos E.)</span>
              </label>
              <label className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-slate-50 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-slate-700 font-medium">Confirmar lista de presença para o CrossFit 19h</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
