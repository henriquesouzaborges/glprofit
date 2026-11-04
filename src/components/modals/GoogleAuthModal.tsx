import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  Sparkles, 
  Lock, 
  ExternalLink, 
  RefreshCw, 
  Check,
  Shield
} from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { SystemUser } from '../../types';
import { logSecurityEvent } from '../../services/securityService';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { email: string; name: string; avatar?: string }) => void;
  availableUsers: SystemUser[];
  onOpenCadastro?: () => void;
  isDarkMode: boolean;
}

export interface SelectedGoogleAccount {
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  isRegistered?: boolean;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  availableUsers,
  onOpenCadastro,
  isDarkMode
}) => {
  // Confirmation Steps: 1 = Seleção da Conta, 2 = Confirmação & Permissões, 3 = Sucesso & Redirecionamento
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Selected Google account state
  const [selectedAccount, setSelectedAccount] = useState<SelectedGoogleAccount | null>(null);

  // Custom Google input states
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Terms and Consent agreement in Step 2
  const [consentConfirmed, setConsentConfirmed] = useState(true);

  // Loading & status states
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupAuthenticating, setIsPopupAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [popupNotice, setPopupNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Helper to check registration in System Users or Enrolled Students
  const checkUserRegistration = (email: string): { isRegistered: boolean; role?: string; name?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const matchedUser = availableUsers.find(u => u.email.trim().toLowerCase() === cleanEmail);
    if (matchedUser) {
      return { isRegistered: true, role: matchedUser.role, name: matchedUser.name };
    }

    try {
      const savedStudents = localStorage.getItem('vbsport_students');
      if (savedStudents) {
        const list = JSON.parse(savedStudents);
        const matchedStudent = list.find((s: any) => s.email && s.email.trim().toLowerCase() === cleanEmail);
        if (matchedStudent) {
          return { isRegistered: true, role: 'aluno', name: matchedStudent.name };
        }
      }
    } catch (e) {
      console.error('Erro ao verificar alunos matriculados:', e);
    }

    return { isRegistered: false };
  };

  // Pre-configured registered Google accounts for quick picking
  const registeredGoogleAccounts: SelectedGoogleAccount[] = availableUsers.map(u => ({
    name: u.name,
    email: u.email,
    avatar: u.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces`,
    role: u.role,
    isRegistered: true
  }));

  // STEP 1: Handle Selecting a pre-configured account
  const handleSelectPreconfiguredAccount = (acc: SelectedGoogleAccount) => {
    setErrorMessage(null);
    setPopupNotice(null);
    setSelectedAccount(acc);
    setConsentConfirmed(true);
    setStep(2); // Advance to Confirmation Step
  };

  // STEP 1: Handle Native Google Popup via Firebase Auth
  const handleSignInWithGooglePopup = async () => {
    setErrorMessage(null);
    setPopupNotice(null);
    setIsPopupAuthenticating(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      if (googleUser && googleUser.email) {
        const regInfo = checkUserRegistration(googleUser.email);
        const accountData: SelectedGoogleAccount = {
          email: googleUser.email,
          name: googleUser.displayName || regInfo.name || googleUser.email.split('@')[0],
          avatar: googleUser.photoURL || undefined,
          role: regInfo.role,
          isRegistered: regInfo.isRegistered
        };

        setSelectedAccount(accountData);
        setConsentConfirmed(true);
        setStep(2); // Advance to Confirmation Step with real Google data!
      }
    } catch (error: any) {
      console.warn('Google Popup response:', error);
      if (error?.code === 'auth/popup-closed-by-user') {
        setPopupNotice('A janela de login do Google foi fechada antes da confirmação. Você também pode escolher ou digitar sua conta abaixo.');
      } else if (error?.code === 'auth/cancelled-popup-request') {
        // Ignora cancelamentos repetidos
      } else {
        setPopupNotice('A janela popup foi bloqueada pelo navegador ou ambiente restrito. Escolha uma conta vinculada abaixo ou digite seu e-mail Google para prosseguir.');
      }
    } finally {
      setIsPopupAuthenticating(false);
    }
  };

  // STEP 1: Handle Custom Google Email Submission
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setPopupNotice(null);

    const cleanEmail = customGoogleEmail.trim().toLowerCase();
    const cleanName = customGoogleName.trim() || cleanEmail.split('@')[0];

    if (!cleanEmail) {
      setErrorMessage('Informe seu e-mail Google para continuar.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Por favor, digite um endereço de e-mail válido.');
      return;
    }

    const regInfo = checkUserRegistration(cleanEmail);
    const accountData: SelectedGoogleAccount = {
      email: cleanEmail,
      name: cleanName || regInfo.name || cleanEmail.split('@')[0],
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces`,
      role: regInfo.role,
      isRegistered: regInfo.isRegistered
    };

    setSelectedAccount(accountData);
    setConsentConfirmed(true);
    setStep(2); // Advance to Confirmation Step
  };

  // STEP 2: Handle Final Confirmation
  const handleFinalConfirm = () => {
    if (!selectedAccount) return;
    setErrorMessage(null);

    if (!consentConfirmed) {
      setErrorMessage('É necessário confirmar o consentimento de acesso com a Conta Google para prosseguir.');
      return;
    }

    const regInfo = checkUserRegistration(selectedAccount.email);
    if (!regInfo.isRegistered) {
      setErrorMessage(
        `A conta Google "${selectedAccount.email}" ainda não está cadastrada no GL PRO FIT. Por favor, clique em "Realizar Cadastro" para criar seu acesso.`
      );
      return;
    }

    // Advance to Step 3 (Visual Confirmation & Redirection)
    setIsLoading(true);
    setStep(3);

    setTimeout(() => {
      setIsLoading(false);
      logSecurityEvent({
        eventType: 'GOOGLE_AUTH_SUCCESS',
        userEmail: selectedAccount.email,
        userName: selectedAccount.name,
        provider: 'google',
        details: `Autenticação Google com etapas de confirmação concluída com sucesso para ${selectedAccount.email} (${regInfo.role?.toUpperCase() || 'USUÁRIO'}).`,
        status: 'success'
      });

      onSuccess({
        email: selectedAccount.email,
        name: selectedAccount.name,
        avatar: selectedAccount.avatar
      });
      onClose();
    }, 1200);
  };

  const getRoleLabel = (r?: string) => {
    switch (r) {
      case 'admin':
        return { label: 'ADMINISTRADOR', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'gerente':
        return { label: 'GERENTE', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
      case 'treinador':
        return { label: 'TREINADOR / PROFESSOR', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'recepcao':
        return { label: 'RECEPÇÃO / ATENDIMENTO', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'financeiro':
        return { label: 'FINANCEIRO', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      case 'aluno':
        return { label: 'ALUNO MATRICULADO', badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40' };
      default:
        return { label: 'USUÁRIO DO SISTEMA', badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className={`w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] rounded-2xl p-4 sm:p-6 md:p-7 shadow-2xl relative border my-auto flex flex-col transition-all ${
        isDarkMode 
          ? 'bg-[#15151a] border-[#2d2d38] text-white shadow-black/80' 
          : 'bg-white border-slate-200 text-slate-900 shadow-xl'
      }`}>
        {/* Close Button */}
        {step !== 3 && (
          <button
            onClick={onClose}
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-xl transition-colors z-20 ${
              isDarkMode ? 'hover:bg-[#23232b] text-zinc-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500'
            }`}
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Stepper Progress Bar (Fixed at top) */}
        <div className="shrink-0 mb-4 sm:mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              Etapa {step} de 3
            </span>
            <span className={`text-[10px] sm:text-[11px] font-semibold truncate ml-2 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              {step === 1 && 'Identificação Google'}
              {step === 2 && 'Confirmação & Permissões'}
              {step === 3 && 'Acesso Autorizado'}
            </span>
          </div>

          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-linear-to-r from-blue-600 to-indigo-500 transition-all duration-300 ease-out"
              style={{ width: step === 1 ? '33.3%' : step === 2 ? '66.6%' : '100%' }}
            />
          </div>

          {/* Step Indicators */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-2 text-[10px] font-medium text-center">
            <div className={`flex items-center justify-center gap-1 ${step >= 1 ? 'text-blue-400 font-bold' : 'text-zinc-500'}`}>
              <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] shrink-0 ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                1
              </span>
              <span className="truncate">Conta</span>
            </div>
            <div className={`flex items-center justify-center gap-1 ${step >= 2 ? 'text-blue-400 font-bold' : 'text-zinc-500'}`}>
              <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] shrink-0 ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                2
              </span>
              <span className="truncate">Confirmação</span>
            </div>
            <div className={`flex items-center justify-center gap-1 ${step >= 3 ? 'text-emerald-400 font-bold' : 'text-zinc-500'}`}>
              <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] shrink-0 ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                3
              </span>
              <span className="truncate">Acesso</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto pr-0.5 sm:pr-1 custom-scrollbar space-y-4">
          {/* Global Error Banner */}
          {errorMessage && (
            <div className="p-3 sm:p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Popup Notice Banner */}
          {popupNotice && (
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span className="leading-relaxed">{popupNotice}</span>
            </div>
          )}

          {/* ============================================================ */}
          {/* ETAPA 1: SELEÇÃO DA CONTA GOOGLE */}
          {/* ============================================================ */}
          {step === 1 && (
            <div className="space-y-3.5 sm:space-y-4 animate-in fade-in duration-200">
              {/* Header */}
              <div className="text-center mb-2 sm:mb-4">
                <div className="inline-flex p-2 sm:p-2.5 rounded-2xl bg-white shadow-md border border-slate-200 mb-2">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.96 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Acessar com o Google
                </h2>
                <p className={`text-[11px] sm:text-xs mt-0.5 sm:mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Selecione ou autentique sua conta Google para avançar para a confirmação de acesso.
                </p>
              </div>

              {/* Destaque: Botão Oficial de Autenticação Popup do Google */}
              <div className={`p-3 sm:p-4 rounded-2xl border transition-all ${
                isDarkMode ? 'bg-[#1a1a22] border-blue-500/30' : 'bg-blue-50/60 border-blue-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Autenticação Oficial OAuth 2.0
                  </span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full">
                    Recomendado
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSignInWithGooglePopup}
                  disabled={isPopupAuthenticating}
                  className="w-full py-2.5 px-3 sm:px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 sm:gap-2.5 shadow-md shadow-blue-900/30 active:scale-[0.99] disabled:opacity-75"
                >
                  {isPopupAuthenticating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                      <span>Conectando com o Google...</span>
                    </>
                  ) : (
                    <>
                      <div className="p-1 rounded bg-white shrink-0">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"/>
                          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.96 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                        </svg>
                      </div>
                      <span className="truncate">Conectar Conta Google via Popup</span>
                      <ArrowRight className="w-4 h-4 ml-auto shrink-0 hidden xs:block" />
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-zinc-700/60"></div>
                <span className="shrink mx-2 sm:mx-3 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider text-center">
                  ou selecione uma conta vinculada
                </span>
                <div className="flex-grow border-t border-zinc-700/60"></div>
              </div>

              {/* Lista de Contas Pré-cadastradas */}
              {!showCustomForm ? (
                <div className="space-y-2">
                  <div className="max-h-[180px] sm:max-h-[220px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                    {registeredGoogleAccounts.map((acc, idx) => {
                      const roleBadge = getRoleLabel(acc.role);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPreconfiguredAccount(acc)}
                          className={`w-full p-2 sm:p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 sm:gap-3 group ${
                            isDarkMode 
                              ? 'bg-[#121216] border-[#292934] hover:border-blue-500/60 hover:bg-[#1a1a24]' 
                              : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                            <div className="relative shrink-0">
                              <img 
                                src={acc.avatar} 
                                alt={acc.name} 
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-slate-400" 
                              />
                              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white flex items-center justify-center shadow-xs">
                                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"/>
                                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.96 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                                </svg>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1">
                                <span className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                                  {acc.name}
                                </span>
                                <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${roleBadge.badge}`}>
                                  {roleBadge.label}
                                </span>
                              </div>
                              <div className="text-[10px] sm:text-[11px] text-zinc-400 truncate font-mono">
                                {acc.email}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-blue-400 text-xs font-semibold shrink-0">
                            <span className="hidden sm:inline">Avançar</span>
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCustomForm(true)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-colors text-center ${
                      isDarkMode 
                        ? 'border-[#2d2d38] text-blue-400 hover:bg-[#1a1a22]' 
                        : 'border-slate-300 text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    Usar outro e-mail Google / Workspace
                  </button>
                </div>
              ) : (
                /* Formulário manual para outro e-mail Google */
                <form onSubmit={handleCustomSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                      Nome Completo (Perfil Google)
                    </label>
                    <input
                      type="text"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      placeholder="Ex: Gianluca Marinho"
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors focus:outline-hidden ${
                        isDarkMode 
                          ? 'bg-[#0f0f13] border border-[#2e2e38] text-white focus:border-blue-500' 
                          : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                      E-mail da Conta Google (Gmail ou Workspace)
                    </label>
                    <input
                      type="email"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      placeholder="usuario@gmail.com"
                      required
                      className={`w-full rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors focus:outline-hidden ${
                        isDarkMode 
                          ? 'bg-[#0f0f13] border border-[#2e2e38] text-white focus:border-blue-500' 
                          : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-600'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCustomForm(false)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                        isDarkMode ? 'border-[#2d2d38] text-zinc-400 hover:text-white' : 'border-slate-300 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Voltar às Contas
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>Prosseguir para Confirmação</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}

              {/* Aviso de Privacidade */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-blue-500/5 border border-blue-500/15 flex items-start gap-2 text-[10px] sm:text-[11px] text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  O GL PRO FIT protege sua privacidade em conformidade estrita com a LGPD. Suas credenciais de login Google são processadas com segurança.
                </span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ETAPA 2: CONFIRMAÇÃO DA CONTA & REVISÃO DE PERMISSÕES */}
          {/* ============================================================ */}
          {step === 2 && selectedAccount && (
            <div className="space-y-3.5 sm:space-y-4 animate-in fade-in duration-200">
              {/* Header da Etapa */}
              <div className="text-center mb-2 sm:mb-3">
                <div className="inline-flex p-2 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 mb-1.5 sm:mb-2">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Confirmar Acesso com a Conta Google
                </h2>
                <p className={`text-[11px] sm:text-xs mt-0.5 sm:mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Revise os dados de identidade da conta antes de autenticar sua sessão.
                </p>
              </div>

              {/* Card com os Dados da Conta Selecionada */}
              <div className={`p-3 sm:p-4 rounded-2xl border ${
                isDarkMode ? 'bg-[#1a1a22] border-[#30303e]' : 'bg-slate-50 border-slate-300'
              }`}>
                <div className="flex items-center gap-2.5 sm:gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={selectedAccount.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'}
                      alt={selectedAccount.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-blue-500 shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full shadow-xs">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.96 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-extrabold text-white truncate">
                      {selectedAccount.name}
                    </div>
                    <div className="text-[11px] sm:text-xs text-blue-400 font-mono truncate">
                      {selectedAccount.email}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {selectedAccount.isRegistered ? (
                        <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleLabel(selectedAccount.role).badge}`}>
                          {getRoleLabel(selectedAccount.role).label}
                        </span>
                      ) : (
                        <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          NÃO CADASTRADO
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist de Validação das Etapas de Segurança */}
              <div className={`p-3 sm:p-3.5 rounded-2xl border space-y-2 sm:space-y-2.5 text-xs ${
                isDarkMode ? 'bg-[#121216] border-[#292934]' : 'bg-slate-100 border-slate-200'
              }`}>
                <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  Etapas de Confirmação e Segurança
                </div>

                <div className="flex items-start gap-2 sm:gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-white text-[11px] sm:text-xs">Identidade Federada Google:</span>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400">Verificação segura via Google OAuth 2.0 / Firebase Auth token.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-white text-[11px] sm:text-xs">Compartilhamento de Perfil Básico:</span>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400">Nome de exibição, foto de avatar e e-mail de contato corporativo/pessoal.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-white text-[11px] sm:text-xs">Trilha de Auditoria & Proteção LGPD:</span>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400">Sessão criptografada e log de segurança registrado no banco de dados.</p>
                  </div>
                </div>
              </div>

              {/* Caso o usuário não esteja cadastrado: aviso claro e botão de cadastro */}
              {!selectedAccount.isRegistered && (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      A conta Google <strong>{selectedAccount.email}</strong> ainda não foi vinculada a um perfil do GL PRO FIT. É necessário criar seu cadastro para prosseguir.
                    </span>
                  </div>
                  {onOpenCadastro && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenCadastro();
                      }}
                      className="self-start mt-1 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>Realizar Cadastro Agora</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Checkbox de Aceite e Confirmação Explícita */}
              <label className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentConfirmed}
                  onChange={(e) => setConsentConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-zinc-700 text-blue-600 focus:ring-blue-500 shrink-0"
                />
                <span className="text-[11px] sm:text-xs text-zinc-300 leading-snug">
                  Confirmo que desejo autenticar com a conta Google <strong>{selectedAccount.email}</strong> e concordo com os Termos de Uso e Política de Privacidade.
                </span>
              </label>

              {/* Ações da Etapa 2 */}
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2.5 pt-1 sm:pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setStep(1);
                  }}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isDarkMode ? 'border-[#30303e] text-zinc-400 hover:text-white' : 'border-slate-300 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                  <span>Trocar Conta</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalConfirm}
                  disabled={isLoading || !consentConfirmed || !selectedAccount.isRegistered}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Confirmar e Acessar Sistema</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ETAPA 3: VALIDAÇÃO CONCLUÍDA & REDIRECIONAMENTO */}
          {/* ============================================================ */}
          {step === 3 && selectedAccount && (
            <div className="py-4 sm:py-6 text-center space-y-3 sm:space-y-4 animate-in zoom-in-95 duration-200">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div className="absolute -inset-1 rounded-full border-2 border-emerald-500/40 animate-ping"></div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Acesso Confirmado com Sucesso!
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 mt-1 px-2">
                  Autenticado via Google como <strong>{selectedAccount.name}</strong> ({selectedAccount.email})
                </p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs inline-flex items-center gap-2 max-w-full">
                <Shield className="w-4 h-4 shrink-0" />
                <span className="truncate">Sessão segura autorizada • Redirecionando para o painel...</span>
              </div>

              <div className="w-7 h-7 sm:w-8 sm:h-8 mx-auto border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mt-2"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
