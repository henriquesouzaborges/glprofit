import React from 'react';
import { Bell } from 'lucide-react';
import { SYSTEM_VERSION_INFO } from '../version';
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
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <GLProFitLogo size="sm" theme="dark" variant="official" className="h-8 w-auto" />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
            {SYSTEM_VERSION_INFO.version}
          </span>
          <span className="text-xs text-slate-400">| Sistema de Gestão Profissional para Academias</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => alert("Nenhuma notificação operacional pendente.")}
          className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Notificações"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div className="h-6 w-[1px] bg-slate-800"></div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-sm">
            {adminName ? adminName.charAt(0) : 'G'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-white leading-none">{adminName || "Gianluca Marinho"}</p>
            <p className="text-xs text-emerald-400 mt-1">Administrador Master</p>
          </div>
        </div>
      </div>
    </header>
  );
};
