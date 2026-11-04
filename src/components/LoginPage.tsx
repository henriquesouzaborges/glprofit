import React, { useState, useEffect } from 'react';
import { 
  Check, 
  UserCircle2, 
  ArrowRight, 
  Sun, 
  Moon, 
  ShieldCheck, 
  AlertCircle, 
  KeyRound, 
  Users, 
  Eye, 
  EyeOff,
  UserPlus,
  Fingerprint,
  Lock,
  Scan,
  Shield,
  HelpCircle,
  FileCheck2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { GLProFitLogo } from './GLProFitLogo';
import { SystemUser, SystemUserRole } from '../types';
import { getSystemUsers, saveSystemUsers, setActiveSessionUser } from '../services/userService';
import { 
  checkLoginLockout, 
  recordFailedLoginAttempt, 
  clearFailedAttempts, 
  logSecurityEvent,
  evaluatePasswordStrength
} from '../services/securityService';
import { BiometricAuthModal } from './modals/BiometricAuthModal';
import { EsqueciSenhaModal } from './modals/EsqueciSenhaModal';
import { GoogleAuthModal } from './modals/GoogleAuthModal';
import { SegurancaDadosModal } from './modals/SegurancaDadosModal';
import { checkWebAuthnCapabilities, WebAuthnCapability } from '../services/webAuthnService';

interface LoginPageProps {
  onLoginSuccess: (data: { 
    email: string; 
    role: SystemUserRole; 
    provider: string; 
    name?: string;
    user?: SystemUser;
  }) => void;
  onBypass?: () => void;
  onOpenCadastro?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBypass, onOpenCadastro }) => {
  const [role, setRole] = useState<SystemUserRole>('treinador');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  
  // Modals & Biometrics
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [selectedBiometricUser, setSelectedBiometricUser] = useState<SystemUser | null>(null);
  const [webAuthnCapabilities, setWebAuthnCapabilities] = useState<WebAuthnCapability | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  // Dynamic list of system users available
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);

  useEffect(() => {
    const loadedUsers = getSystemUsers();
    setSystemUsers(loadedUsers);
    checkWebAuthnCapabilities().then(setWebAuthnCapabilities);
  }, []);

  const passwordStrength = evaluatePasswordStrength(password);

  const handleSelectQuickUser = (user: SystemUser) => {
    setEmail(user.email);
    setRole(user.role);
    if (user.password) {
      setPassword(user.password);
    } else {
      setPassword('admin@glprofit');
    }
    setErrorMessage(null);
    setSuccessToast(`Conta selecionada: ${user.name} (${user.role.toUpperCase()})`);
  };

  const handleDirectAccessUser = (user: SystemUser) => {
    if (!user.active) {
      setErrorMessage(`O usuário "${user.name}" está inativo no sistema.`);
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      clearFailedAttempts(user.email);
      // Update last login
      const updated = systemUsers.map(u => 
        u.id === user.id ? { ...u, lastLogin: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) } : u
      );
      saveSystemUsers(updated);
      setActiveSessionUser(user);

      logSecurityEvent({
        eventType: 'LOGIN_SUCCESS',
        userEmail: user.email,
        userName: user.name,
        provider: 'direct',
        details: `Acesso direto concedido para ${user.name}.`,
        status: 'success'
      });

      onLoginSuccess({
        email: user.email,
        role: user.role,
        provider: 'direct',
        name: user.name,
        user: user
      });
    }, 350);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanEmail) {
      setErrorMessage('Por favor, informe seu e-mail cadastrado.');
      return;
    }

    if (!password) {
      setErrorMessage('Por favor, digite sua senha de acesso.');
      return;
    }

    // 1. Check for Rate Limit Lockout (Brute Force Protection)
    const lockout = checkLoginLockout(cleanEmail);
    if (lockout.isLocked) {
      setErrorMessage(`Conta temporariamente bloqueada por segurança. Aguarde ${lockout.remainingSeconds}s antes de tentar novamente.`);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    
    setTimeout(() => {
      setIsLoading(false);
      const currentUsers = getSystemUsers();
      const matchedUser = currentUsers.find(u => u.email.trim().toLowerCase() === cleanEmail);

      // 1. Matched in System Users (admin, recepcao, treinador, gerente, financeiro, aluno cadastrado, etc.)
      if (matchedUser) {
        if (!matchedUser.active) {
          setErrorMessage(`O acesso para "${matchedUser.name}" (${matchedUser.email}) está desativado no sistema. Contate a administração.`);
          return;
        }

        // Validação estrita de senha do usuário cadastrado
        const cleanPass = password.trim();
        const expectedPass = matchedUser.password || (matchedUser.email === 'marinho.gianluca@gmail.com' ? 'admin@glprofit' : '');

        if (!expectedPass || cleanPass !== expectedPass) {
          const attemptResult = recordFailedLoginAttempt(cleanEmail);
          logSecurityEvent({
            eventType: 'LOGIN_FAILED',
            userEmail: cleanEmail,
            userName: matchedUser.name,
            provider: 'email_password',
            details: `Tentativa de login com senha incorreta para a conta ${matchedUser.email}.`,
            status: 'danger'
          });
          if (attemptResult.isLocked) {
            setErrorMessage(`Limite de tentativas excedido! Conta temporariamente bloqueada por ${attemptResult.remainingSeconds}s.`);
          } else {
            setErrorMessage(`Senha incorreta para esta conta. Restam ${attemptResult.attemptsLeft} tentativa(s) antes do bloqueio temporário.`);
          }
          return;
        }

        // Login Bem-sucedido
        clearFailedAttempts(cleanEmail);

        const updated = currentUsers.map(u => 
          u.id === matchedUser.id 
            ? { 
                ...u, 
                lastLogin: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                password: cleanPass
              } 
            : u
        );
        saveSystemUsers(updated);
        setActiveSessionUser({ ...matchedUser, password: cleanPass });

        logSecurityEvent({
          eventType: 'LOGIN_SUCCESS',
          userEmail: matchedUser.email,
          userName: matchedUser.name,
          provider: 'email_password',
          details: `Autenticação por e-mail e senha bem-sucedida para ${matchedUser.name}.`,
          status: 'success'
        });

        onLoginSuccess({
          email: matchedUser.email,
          role: matchedUser.role,
          provider: 'email',
          name: matchedUser.name,
          user: matchedUser
        });
        return;
      }

      // 2. Matched as an enrolled student in vbsport_students
      try {
        const savedStudents = localStorage.getItem('vbsport_students');
        if (savedStudents) {
          const studentsList = JSON.parse(savedStudents);
          const matchedStudent = studentsList.find((s: any) => s.email && s.email.trim().toLowerCase() === cleanEmail);
          
          if (matchedStudent) {
            if (matchedStudent.status === 'cancelado') {
              setErrorMessage(`A matrícula de "${matchedStudent.name}" está inativa ou cancelada. Contate a recepção.`);
              return;
            }

            const cleanPass = password.trim();
            const rawCpf = (matchedStudent.cpf || '').replace(/\D/g, '');
            const studentCode = (matchedStudent.code || '').trim();
            const studentStoredPass = (matchedStudent.password || '').trim();

            const isPassValid = 
              (studentStoredPass && cleanPass === studentStoredPass) ||
              (rawCpf && cleanPass === rawCpf) ||
              (matchedStudent.cpf && cleanPass === matchedStudent.cpf.trim()) ||
              (studentCode && cleanPass === studentCode);

            if (!isPassValid) {
              const attemptResult = recordFailedLoginAttempt(cleanEmail);
              logSecurityEvent({
                eventType: 'LOGIN_FAILED',
                userEmail: cleanEmail,
                userName: matchedStudent.name,
                provider: 'email_password',
                details: `Tentativa de login de aluno com credencial inválida para ${matchedStudent.name}.`,
                status: 'danger'
              });

              if (attemptResult.isLocked) {
                setErrorMessage(`Limite de tentativas excedido! Conta temporariamente bloqueada por ${attemptResult.remainingSeconds}s.`);
              } else {
                setErrorMessage(`Senha incorreta. Alunos matriculados devem utilizar sua senha cadastrada ou CPF (apenas dígitos). Restam ${attemptResult.attemptsLeft} tentativa(s).`);
              }
              return;
            }

            clearFailedAttempts(cleanEmail);

            const studentUser: SystemUser = {
              id: matchedStudent.id,
              name: matchedStudent.name,
              email: matchedStudent.email,
              role: 'aluno',
              active: matchedStudent.status === 'ativo',
              createdAt: matchedStudent.startDate || matchedStudent.joinDate || '2026-01-01',
              department: 'Aluno Matriculado',
              avatar: matchedStudent.photo,
              password: cleanPass,
              permissions: ['inicio', 'treinos', 'agenda', 'pay']
            };

            // Cadastra no rol de SystemUsers para integridade do sistema
            saveSystemUsers([...currentUsers, studentUser]);
            setActiveSessionUser(studentUser);

            logSecurityEvent({
              eventType: 'LOGIN_SUCCESS',
              userEmail: matchedStudent.email,
              userName: matchedStudent.name,
              provider: 'email_password',
              details: `Aluno autenticado com sucesso: ${matchedStudent.name}.`,
              status: 'success'
            });

            onLoginSuccess({
              email: matchedStudent.email,
              role: 'aluno',
              provider: 'email',
              name: matchedStudent.name,
              user: studentUser
            });
            return;
          }
        }
      } catch (err) {
        console.error('Erro ao verificar alunos matriculados:', err);
      }

      // 3. Usuário NÃO cadastrado no sistema -> BLOQUEAR ACESSO!
      const attemptResult = recordFailedLoginAttempt(cleanEmail);
      logSecurityEvent({
        eventType: 'LOGIN_FAILED',
        userEmail: cleanEmail,
        provider: 'email_password',
        details: `Tentativa de login rejeitada: usuário não cadastrado (${cleanEmail}).`,
        status: 'danger'
      });

      if (attemptResult.isLocked) {
        setErrorMessage(`Limite de tentativas excedido! Acesso temporariamente bloqueado por ${attemptResult.remainingSeconds}s.`);
      } else {
        setErrorMessage(`Usuário não cadastrado. O e-mail "${cleanEmail}" não possui cadastro no sistema. Clique em "Realizar Cadastro" abaixo para criar sua conta.`);
      }
      return;
    }, 450);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanName) {
      setErrorMessage('Preencha seu nome completo e e-mail para cadastrar.');
      return;
    }

    if (!cleanPass || cleanPass.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (cleanPass !== confirmPassword.trim()) {
      setErrorMessage('A confirmação de senha não confere com a senha digitada.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('É necessário concordar com a Política de Privacidade e Proteção de Dados (LGPD).');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const currentUsers = getSystemUsers();
      
      // Check if user already exists
      const existing = currentUsers.find(u => u.email.trim().toLowerCase() === cleanEmail);
      if (existing) {
        setErrorMessage(`O e-mail "${cleanEmail}" já está cadastrado para "${existing.name}". Clique em "Entrar na Conta".`);
        return;
      }

      const newUser: SystemUser = {
        id: `usr-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        role: role,
        phone: phone.trim() || undefined,
        password: cleanPass,
        active: true,
        createdAt: new Date().toISOString().slice(0, 10),
        lastLogin: 'Agora (Novo Cadastro)',
        department: role === 'admin' ? 'Diretoria' : (role === 'gerente' ? 'Gerência' : (role === 'treinador' ? 'Musculação/Aulas' : 'Atendimento')),
        permissions: role === 'admin' 
          ? ['inicio', 'dashboards', 'alunos', 'treinos', 'agenda', 'catraca', 'financeiro', 'vendas', 'comandas', 'estoque', 'crm', 'whatsapp', 'relatorios', 'configuracoes']
          : ['inicio', 'alunos', 'agenda']
      };

      const updatedUsers = [newUser, ...currentUsers];
      saveSystemUsers(updatedUsers);
      setActiveSessionUser(newUser);

      logSecurityEvent({
        eventType: 'REGISTER_SUCCESS',
        userEmail: newUser.email,
        userName: newUser.name,
        provider: 'email_password',
        details: `Novo cadastro criado com perfil ${newUser.role.toUpperCase()} e termos LGPD aceitos.`,
        status: 'success'
      });

      setSuccessToast(`Cadastro de ${cleanName} criado com sucesso!`);
      onLoginSuccess({
        email: newUser.email,
        role: newUser.role,
        provider: 'register',
        name: newUser.name,
        user: newUser
      });
    }, 500);
  };

  const handleBiometricSuccess = (user: SystemUser) => {
    setSuccessToast(`Autenticado por biometria como ${user.name}!`);
    setActiveSessionUser(user);
    onLoginSuccess({
      email: user.email,
      role: user.role,
      provider: 'biometrics',
      name: user.name,
      user: user
    });
  };

  const handleGoogleSuccess = (data: { email: string; name: string; avatar?: string }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const currentUsers = getSystemUsers();
    const matched = currentUsers.find(u => u.email.trim().toLowerCase() === cleanEmail);

    let matchedStudentUser: SystemUser | null = null;
    try {
      const savedStudents = localStorage.getItem('vbsport_students');
      if (savedStudents) {
        const studentsList = JSON.parse(savedStudents);
        const matchedStudent = studentsList.find((s: any) => s.email && s.email.trim().toLowerCase() === cleanEmail);
        if (matchedStudent) {
          matchedStudentUser = {
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
    } catch (e) {
      console.error('Erro ao verificar alunos matriculados:', e);
    }

    const resolvedUser = matched || matchedStudentUser;

    if (!resolvedUser) {
      logSecurityEvent({
        eventType: 'LOGIN_FAILED',
        userEmail: cleanEmail,
        userName: data.name,
        provider: 'google',
        details: `Tentativa de login Google rejeitada: conta ${cleanEmail} não cadastrada no sistema.`,
        status: 'danger'
      });
      setErrorMessage(`A conta Google "${cleanEmail}" não está cadastrada no sistema. Por favor, clique em "Realizar Cadastro" antes de entrar.`);
      return;
    }

    if (!resolvedUser.active) {
      setErrorMessage(`O acesso para "${resolvedUser.name}" está inativo no sistema. Contate a administração.`);
      return;
    }

    setActiveSessionUser(resolvedUser);
    setSuccessToast(`Conectado via Google como ${resolvedUser.name}!`);

    logSecurityEvent({
      eventType: 'GOOGLE_AUTH_SUCCESS',
      userEmail: resolvedUser.email,
      userName: resolvedUser.name,
      provider: 'google',
      details: `Login via Google Workspace aprovado para conta cadastrada: ${resolvedUser.name}.`,
      status: 'success'
    });

    onLoginSuccess({
      email: resolvedUser.email,
      role: resolvedUser.role,
      provider: 'google',
      name: resolvedUser.name,
      user: resolvedUser
    });
  };

  const getRoleBadge = (r: SystemUserRole) => {
    switch (r) {
      case 'admin':
        return { label: 'ADMINISTRADOR', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'gerente':
        return { label: 'GERENTE', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'treinador':
        return { label: 'TREINADOR', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'recepcao':
        return { label: 'RECEPÇÃO / PDV', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'financeiro':
        return { label: 'FINANCEIRO', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'aluno':
        return { label: 'ALUNO', bg: 'bg-teal-500/20 text-teal-300 border-teal-500/30' };
      default:
        return { label: 'USUÁRIO', bg: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
    }
  };

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'bg-[#0e0e11] text-white' : 'bg-slate-50 text-slate-900'} flex flex-col justify-between relative overflow-hidden font-sans transition-colors duration-200 selection:bg-blue-600 selection:text-white`}>
      {/* Top Bar / Theme Switcher in top right */}
      <header className="w-full px-6 py-4 flex items-center justify-between z-20">
        <div className="w-10"></div>

        {/* Center: GL PRO FIT Brand Logo */}
        <div className="flex flex-col items-center justify-center pt-3 sm:pt-6">
          <div className="w-full max-w-[340px] sm:max-w-[420px] px-2 flex justify-center">
            <GLProFitLogo 
              theme={isDarkMode ? 'dark' : 'light'} 
              size="lg" 
              showSubtitle={true}
            />
          </div>
        </div>

        {/* Top Right: Theme Switcher */}
        <div className="w-10 flex justify-end">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-md transition-all flex items-center justify-center focus:outline-hidden ${
              isDarkMode ? 'bg-white hover:bg-slate-100 text-slate-800' : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
            title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-slate-100 fill-slate-100" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 z-10">
        <div className={`w-full max-w-[460px] rounded-2xl p-6 sm:p-8 shadow-2xl transition-all ${
          isDarkMode 
            ? 'bg-[#18181c] border border-[#2a2a30]' 
            : 'bg-white border border-slate-200 shadow-xl'
        }`}>
          {/* Card Header */}
          <div className="text-center mb-5">
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              GL <span className="text-blue-600">PRO FIT</span>
            </h1>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Performance • Análise • Controle de Acessos
            </p>
          </div>

          {/* Error / Success Notifications */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successToast && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successToast}</span>
            </div>
          )}

          {/* Formulário de Acesso Direto */}
          <form onSubmit={handleEmailLogin} className="space-y-3.5">
            {/* Input: Email */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                E-mail do Usuário
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail (ex: seuemail@gmail.com)"
                  required
                  className={`w-full rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                    isDarkMode
                      ? 'bg-[#121215] border border-[#33333a] text-white placeholder:text-zinc-500 focus:border-blue-500'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                  }`}
                />
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                  isDarkMode ? 'text-zinc-400' : 'text-slate-400'
                }`}>
                  <UserCircle2 className="w-4 h-4 stroke-[1.8]" />
                </div>
              </div>
            </div>

            {/* Input: Senha & Forgot Password Button */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-slate-400">
                  Senha de Acesso
                </label>
                {/* Botão: Esqueci minha senha */}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setIsForgotPasswordOpen(true);
                  }}
                  className="text-[11px] font-semibold text-amber-500 hover:text-amber-400 hover:underline transition-colors flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Esqueci minha senha</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                    isDarkMode
                      ? 'bg-[#121215] border border-[#33333a] text-white placeholder:text-zinc-500 focus:border-blue-500'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Buttons Stack */}
            <div className="space-y-2.5 pt-1">
              {/* Botão Principal: Entrar com o E-mail e Senha */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 active:scale-[0.99] disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Entrar com E-mail e Senha</span>
                  </>
                )}
              </button>

              {/* Botão Dedicado (LOGO ABAIXO): Realizar Cadastro -> Redireciona para nova guia */}
              <a
                href="?view=cadastro"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  try {
                    const newUrl = `${window.location.origin}${window.location.pathname}?view=cadastro`;
                    const opened = window.open(newUrl, '_blank');
                    if (!opened && onOpenCadastro) {
                      e.preventDefault();
                      onOpenCadastro();
                    }
                  } catch {
                    if (onOpenCadastro) {
                      e.preventDefault();
                      onOpenCadastro();
                    }
                  }
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 border shadow-xs active:scale-[0.99] text-center ${
                  isDarkMode
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:border-emerald-500/70'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                }`}
                title="Abre a tela de cadastro em uma nova guia para Aluno ou Responsável"
              >
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Realizar Cadastro</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-0.5" />
              </a>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-zinc-700/50"></div>
                <span className="shrink mx-3 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                  ou acesse com
                </span>
                <div className="flex-grow border-t border-zinc-700/50"></div>
              </div>

              {/* Dual Alternate Login: Google OR Biometria */}
              <div className="grid grid-cols-2 gap-2">
                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  disabled={isLoading}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border shadow-xs active:scale-[0.98] ${
                    isDarkMode 
                      ? 'bg-[#121215] hover:bg-[#1c1c24] text-slate-200 border-[#2f2f38] hover:border-blue-500/50' 
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs hover:border-blue-400'
                  }`}
                  title="Acessar com a Conta Google (Fluxo com Etapas de Confirmação)"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  <span className="truncate">Acessar com Google</span>
                </button>

                {/* Biometric Login Button */}
                <button
                  type="button"
                  onClick={() => {
                    const matched = systemUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
                    setSelectedBiometricUser(matched || null);
                    setIsBiometricModalOpen(true);
                  }}
                  disabled={isLoading}
                  className="py-2 px-3 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/40 text-blue-400 hover:text-blue-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                  title="Autenticação biométrica via Web Authentication API (Touch ID, Face ID, Windows Hello)"
                >
                  <Fingerprint className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Biometria WebAuthn</span>
                </button>
              </div>
            </div>
          </form>

          {/* LGPD & Security Link in card footer */}
          <div className="mt-4 pt-2.5 border-t border-zinc-800/60 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsSecurityModalOpen(true)}
              className="text-[11px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Segurança & Proteção de Dados • LGPD</span>
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <BiometricAuthModal
        isOpen={isBiometricModalOpen}
        onClose={() => {
          setIsBiometricModalOpen(false);
          setSelectedBiometricUser(null);
        }}
        targetUser={selectedBiometricUser || systemUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase())}
        availableUsers={systemUsers}
        onSuccess={handleBiometricSuccess}
        isDarkMode={isDarkMode}
      />

      <EsqueciSenhaModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        defaultEmail={email}
        onSuccess={(recoveredEmail, newPass) => {
          setEmail(recoveredEmail);
          if (newPass) setPassword(newPass);
          setSuccessToast('Senha atualizada com sucesso! Você já pode entrar.');
        }}
        isDarkMode={isDarkMode}
      />

      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        availableUsers={systemUsers}
        onSuccess={handleGoogleSuccess}
        onOpenCadastro={onOpenCadastro}
        isDarkMode={isDarkMode}
      />

      <SegurancaDadosModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Footer */}
      <footer className={`w-full py-4 text-center text-xs z-10 ${
        isDarkMode ? 'text-zinc-500' : 'text-slate-400'
      }`}>
        GL PRO FIT • Performance • Análise • Controle © 2026
      </footer>
    </div>
  );
};
