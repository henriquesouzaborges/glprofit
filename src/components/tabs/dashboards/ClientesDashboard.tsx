import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  AlertTriangle, 
  TrendingUp, 
  MessageCircle, 
  Cake, 
  PieChart, 
  ChevronRight,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { Student } from '../../../types';
import { formatCurrency, sendWhatsAppMessage } from '../../../utils';

interface ClientesDashboardProps {
  students: Student[];
  onNavigateToTab?: (tab: string) => void;
}

export const ClientesDashboard: React.FC<ClientesDashboardProps> = ({ students, onNavigateToTab }) => {
  const [filterPlan, setFilterPlan] = useState<string>('todos');

  const totalRegistered = 202;
  const activeCount = 182;
  const overdueCount = 6;
  const frozenCount = 14;
  const churnRate = 1.8; // % monthly churn

  const plansDistribution = [
    { name: 'Plano Anual Black VIP', count: 128, percent: 63, price: 199.90, color: 'bg-red-600' },
    { name: 'Plano Semestral Fit', count: 46, percent: 23, price: 239.90, color: 'bg-blue-700' },
    { name: 'Plano Mensal Livre', count: 20, percent: 10, price: 279.90, color: 'bg-emerald-600' },
    { name: 'Passaporte Diária', count: 8, percent: 4, price: 45.00, color: 'bg-amber-500' }
  ];

  const atRiskStudents = [
    { name: 'Lucas Gabriel Silveira', plan: 'Plano Semestral Fit', daysAbsent: 19, phone: '(11) 98765-4321', lastWorkout: 'Peito & Tríceps' },
    { name: 'Beatriz Vasconcelos', plan: 'Plano Anual Black VIP', daysAbsent: 17, phone: '(11) 99123-8877', lastWorkout: 'Glúteos & Pernas' },
    { name: 'Fernando Henrique Dias', plan: 'Plano Mensal Livre', daysAbsent: 16, phone: '(11) 97654-3210', lastWorkout: 'Costas & Bíceps' },
    { name: 'Juliana Paes Moraes', plan: 'Plano Anual Black VIP', daysAbsent: 15, phone: '(11) 98222-1100', lastWorkout: 'Funcional Cardio' }
  ];

  const birthdaysThisMonth = [
    { name: 'Gian Luca Marinho', date: '08 de Setembro', plan: 'Plano Anual Black VIP' },
    { name: 'Mariana Castro', date: '14 de Setembro', plan: 'Plano Semestral Fit' },
    { name: 'Rodrigo Faro', date: '21 de Setembro', plan: 'Plano Anual Black VIP' }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Users className="h-5 w-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Dashboard de Clientes & Alunos</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Retenção de alunos, risco de evasão (churn), pirâmide de planos e engajamento
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('clientes')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3.5 py-1.5 transition-colors shadow-xs"
            >
              Ver Lista de Alunos <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Alunos Ativos com Matrícula</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <UserCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {activeCount}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="h-3 w-3" />
            +14 novas matrículas no mês
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Taxa de Churn (Cancelamento)</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {churnRate}%
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-blue-700 font-medium">
            <span>Média nacional de mercado é 6.5%</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Alunos Inadimplentes</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <UserX className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-red-600">
            {overdueCount}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-red-600 font-medium">
            <span>Bloqueados automaticamente na catraca</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Alunos Trancados</span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {frozenCount}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Retorno previsto em até 30 dias</span>
          </div>
        </div>
      </div>

      {/* Plans breakdown & Churn Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Plans Distribution (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Adesão por Tipo de Plano</h3>
              <p className="text-[11px] text-slate-500">Distribuição percentual da carteira</p>
            </div>
            <PieChart className="h-4 w-4 text-blue-700" />
          </div>

          <div className="space-y-3">
            {plansDistribution.map((p) => (
              <div key={p.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{p.name}</span>
                  <span className="font-mono font-bold text-slate-900">{p.count} alunos ({p.percent}%)</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${p.color}`} style={{ width: `${p.percent}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Mensalidade: {formatCurrency(p.price)}</span>
                  <span>Faturamento: {formatCurrency(p.count * p.price)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-xs text-red-900">
            <strong>Fidelização:</strong> O Plano Anual Black VIP com GL Profit Pay representa 63% da receita recorrente da GL PRO FIT.
          </div>
        </div>

        {/* Churn Risk - Absent > 15 days (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Alerta de Evasão (Ausentes &gt; 15 dias)</h3>
              <p className="text-[11px] text-slate-500">Alunos com alto risco de cancelamento por falta de frequência</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
              4 Alunos Críticos
            </span>
          </div>

          <div className="space-y-2.5">
            {atRiskStudents.map((st) => (
              <div key={st.name} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{st.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {st.plan} • Último treino: <strong>{st.lastWorkout}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded-md bg-red-100 text-red-700 font-bold font-mono text-[11px] border border-red-200">
                    {st.daysAbsent} dias sem treinar
                  </span>
                  <button
                    onClick={() => {
                      const studentPhone = students.find(s => s.name === st.name)?.phone || '(11) 99999-9999';
                      sendWhatsAppMessage(studentPhone, `Olá ${st.name}, sentimos sua falta nos treinos da GL PRO FIT! Como podemos te ajudar a retomar sua rotina de treinos?`, st.name);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Resgatar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Birthday and engagement bar */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-semibold">
              <Cake className="h-4 w-4 text-red-600" />
              <span>3 Aniversariantes do Mês com cupom de shake liberado</span>
            </div>
            <button
              onClick={() => {
                const bdayStudent = students[0];
                if (bdayStudent) {
                  sendWhatsAppMessage(bdayStudent.phone, `Parabéns ${bdayStudent.name}! A equipe da GL PRO FIT deseja um feliz aniversário com muita saúde e conquistas! Seu voucher de shake cortesia já está disponível na recepção!`, bdayStudent.name, bdayStudent.id);
                }
              }}
              className="text-blue-700 font-bold hover:underline"
            >
              Ver e Parabenizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
