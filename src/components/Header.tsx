import React from 'react';
import { Bell } from 'lucide-react';
import { GLProFitLogo } from './GLProFitLogo';

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  adminName?: string;
  onOpenNewStudent?: () => void;
  onOpenQuickSale?: () => void;
  onOpenNewOpportunity?: () => void;
  onSelectStudent?: (student: any) => void;
  students?: any[];
  onLogout?: () => void;
  currentUser?: any;
  onNavigateTab?: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, adminName }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <GLProFitLogo size="sm" theme="light" variant="official" className="h-8 w-auto" />
          <div className="h-6 w-[1px] bg-slate-300 hidden sm:block"></div>
          <div className="px-3 py-1 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-xs font-medium flex items-center gap-1.5" title="Logomarca da empresa cliente">
            <span className="text-[11px] font-bold text-slate-600">logomarca do cliente aqui</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">| Sistema de Gestão Profissional para Performance, Análise e Controle</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => alert("Nenhuma notificação operacional pendente.")}
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Notificações"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div className="h-6 w-[1px] bg-slate-200"></div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-700 font-bold text-sm">
            {adminName ? adminName.charAt(0) : 'G'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-900 leading-none">{adminName || "Gianluca Marinho"}</p>
            <p className="text-xs text-blue-600 font-semibold mt-1">Administrador Master</p>
          </div>
        </div>
      </div>
    </header>
  );
};
