import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Share2, 
  Briefcase, 
  Activity, 
  Users, 
  CircleDollarSign, 
  Calendar, 
  Dumbbell, 
  MessageCircle,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Student, FinancialTransaction, Lead, ClassSession, WorkoutPlan } from '../../types';
import { CrmDashboard } from './dashboards/CrmDashboard';
import { GerencialDashboard } from './dashboards/GerencialDashboard';
import { ClientesDashboard } from './dashboards/ClientesDashboard';
import { FinanceiroDashboard } from './dashboards/FinanceiroDashboard';
import { AgendaDashboard } from './dashboards/AgendaDashboard';
import { TreinoDashboard } from './dashboards/TreinoDashboard';
import { WhatsappDashboard } from './dashboards/WhatsappDashboard';
import { DashboardAiReportCard } from './dashboards/DashboardAiReportCard';

export type DashboardSubTab = 
  | 'crm' 
  | 'gerencial' 
  | 'clientes' 
  | 'financeiro' 
  | 'agenda' 
  | 'treino' 
  | 'whatsapp';

interface DashboardsTabProps {
  students: Student[];
  transactions: FinancialTransaction[];
  leads?: Lead[];
  classes?: ClassSession[];
  workouts?: WorkoutPlan[];
  subTab?: DashboardSubTab;
  onSubTabChange?: (subTab: DashboardSubTab) => void;
  onNavigateToTab: (tab: string) => void;
}

export const DashboardsTab: React.FC<DashboardsTabProps> = ({
  students,
  transactions,
  leads = [],
  classes = [],
  workouts = [],
  subTab,
  onSubTabChange,
  onNavigateToTab
}) => {
  const [internalSubTab, setInternalSubTab] = useState<DashboardSubTab>('gerencial');

  // Keep state in sync if external subTab changes
  useEffect(() => {
    if (subTab) {
      setInternalSubTab(subTab);
    }
  }, [subTab]);

  const currentSubTab = subTab || internalSubTab;

  const handleTabSelect = (tabId: DashboardSubTab) => {
    setInternalSubTab(tabId);
    if (onSubTabChange) {
      onSubTabChange(tabId);
    }
  };

  const tabsConfig = [
    { id: 'crm' as DashboardSubTab, label: 'CRM', icon: Share2, badge: 'Funil' },
    { id: 'gerencial' as DashboardSubTab, label: 'Gerencial', icon: Briefcase, badge: 'DRE' },
    { id: 'clientes' as DashboardSubTab, label: 'Clientes', icon: Users, badge: 'Retenção' },
    { id: 'financeiro' as DashboardSubTab, label: 'Financeiro', icon: CircleDollarSign, badge: 'Caixa' },
    { id: 'agenda' as DashboardSubTab, label: 'Agenda', icon: Calendar, badge: 'Aulas' },
    { id: 'treino' as DashboardSubTab, label: 'Treino', icon: Dumbbell, badge: 'Fichas' },
    { id: 'whatsapp' as DashboardSubTab, label: 'WhatsApp', icon: MessageCircle, badge: 'Robô' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-900 text-white font-bold text-xs shadow-xs border border-blue-950">
              BI
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">
              Dashboards & Business Intelligence
            </h1>
            <span className="hidden sm:inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-900 border border-blue-200">
              VB SPORT ADM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Métricas estratégicas segmentadas por áreas de operação da academia
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>Dados em tempo real sincronizados</span>
        </div>
      </div>

      {/* Sub-dashboard View Render */}
      <div key={currentSubTab} className="pt-1 animate-subtab-fade-in space-y-6">
        {currentSubTab === 'crm' && (
          <CrmDashboard 
            leads={leads} 
            onNavigateToTab={onNavigateToTab} 
          />
        )}

        {currentSubTab === 'gerencial' && (
          <GerencialDashboard 
            students={students}
            transactions={transactions}
            onNavigateToTab={onNavigateToTab} 
          />
        )}

        {currentSubTab === 'clientes' && (
          <ClientesDashboard 
            students={students} 
            onNavigateToTab={onNavigateToTab} 
          />
        )}

        {currentSubTab === 'financeiro' && (
          <FinanceiroDashboard 
            transactions={transactions} 
            onNavigateToTab={onNavigateToTab} 
          />
        )}

        {currentSubTab === 'agenda' && (
          <AgendaDashboard 
            classes={classes}
            onNavigateToTab={onNavigateToTab} 
          />
        )}

        {currentSubTab === 'treino' && (
          <TreinoDashboard 
            workouts={workouts}
            students={students}
            onNavigateToTab={onNavigateToTab} 
          />
        )}

        {currentSubTab === 'whatsapp' && (
          <WhatsappDashboard 
            leads={leads}
            students={students}
            onNavigateToTab={onNavigateToTab} 
          />
        )}

        {/* Card de "Relatório e sugestões" com Inteligência Artificial ao vivo ao final de cada sub-aba */}
        <DashboardAiReportCard
          subTab={currentSubTab}
          students={students}
          transactions={transactions}
          leads={leads}
          classes={classes}
          workouts={workouts}
          onNavigateToTab={onNavigateToTab}
        />
      </div>
    </div>
  );
};
