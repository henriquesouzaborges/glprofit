import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, User, LogOut } from 'lucide-react';
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

export const Header: React.FC<HeaderProps> = ({ 
  setActiveTab, 
  adminName, 
  onLogout, 
  currentUser,
  onNavigateTab 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifNotice, setShowNotifNotice] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditProfile = () => {
    setShowDropdown(false);
    if (onNavigateTab) {
      onNavigateTab('configuracoes');
    } else if (setActiveTab) {
      setActiveTab('configuracoes');
    }
  };

  const handleUserLogout = () => {
    setShowDropdown(false);
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  const displayName = currentUser?.name || adminName || "GL PRO FIT ADM";
  const displayRole = currentUser?.role === 'admin' ? 'Administrador Master' : (currentUser?.role ? currentUser.role.toUpperCase() : 'Administrador Master');
  const displayEmail = currentUser?.email || 'glprofit.adm@gmail.com';

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
        <div className="relative">
          <button 
            type="button"
            onClick={() => {
              setShowNotifNotice(prev => !prev);
              setTimeout(() => setShowNotifNotice(false), 3000);
            }}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Notificações"
          >
            <Bell className="w-5 h-5" />
          </button>
          {showNotifNotice && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 text-white px-3.5 py-2.5 text-xs font-medium shadow-xl border border-slate-700 z-50">
              Nenhuma notificação operacional pendente.
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-slate-200"></div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-700 font-bold text-sm">
              {displayName.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-900 leading-none">{displayName}</p>
              <p className="text-xs text-blue-600 font-semibold mt-1">{displayRole}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate">{displayEmail}</p>
              </div>

              <button
                onClick={handleEditProfile}
                className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>Editar Cadastro</span>
              </button>

              <button
                onClick={handleUserLogout}
                className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer transition-colors border-t border-slate-100 mt-1"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Sair (Logout)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
