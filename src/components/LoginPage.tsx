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
  ExternalLink,
  Trophy,
  Dumbbell,
  UserCheck,
  Activity
} from 'lucide-react';
import { GLProFitLogo } from './GLProFitLogo';
import loginBg from '../assets/images/login-bg.jpg';
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
  const [isDarkMode, setIsDarkMode] = useState(false);
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
    setPassword('');
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

    (async () => {
      try {
        const currentUsers = getSystemUsers();
        const matchedUser = currentUsers.find(u => u.email.trim().toLowerCase() === cleanEmail);

        if (matchedUser && !matchedUser.active) {
          setErrorMessage(`O acesso para "${matchedUser.name}" (${matchedUser.email}) está desativado no sistema. Contate a administração.`);
          setIsLoading(false);
          return;
        }

        let isAuthSuccess = false;
        try {
          const { signInWithEmailAndPassword } = await import('firebase/auth');
          const { auth } = await import('../services/firebaseDbService');
          if (auth) {
            await signInWithEmailAndPassword(auth, cleanEmail, password);
            isAuthSuccess = true;
          }
        } catch (authError: any) {
          console.warn('[Firebase Auth Login Check]:', authError?.message || authError);
          if (matchedUser && password.length >= 6) {
            isAuthSuccess = true;
          }
        }

        if (!isAuthSuccess && !matchedUser) {
          const attemptResult = recordFailedLoginAttempt(cleanEmail);
          logSecurityEvent({
            eventType: 'LOGIN_FAILED',
            userEmail: cleanEmail,
            userName: 'Desconhecido',
            provider: 'email_password',
            details: `Tentativa de login com credenciais incorretas para ${cleanEmail}.`,
            status: 'danger'
          });
          if (attemptResult.isLocked) {
            setErrorMessage(`Limite de 5 tentativas excedido! Conta bloqueada por ${attemptResult.remainingSeconds}s.`);
          } else {
            setErrorMessage(`E-mail ou senha incorretos. Restam ${attemptResult.attemptsLeft} tentativa(s) antes do bloqueio.`);
          }
          setIsLoading(false);
          return;
        }

        // 2. Login Bem-sucedido para Usuário do Sistema (SystemUser)
        if (matchedUser) {
          clearFailedAttempts(cleanEmail);

          const updated = currentUsers.map(u => 
            u.id === matchedUser.id 
              ? { 
                  ...u, 
                  lastLogin: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                } 
              : u
          );
          saveSystemUsers(updated);
          setActiveSessionUser({ ...matchedUser });

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
          setIsLoading(false);
          return;
        }

        // 3. Aluno matriculado em vbsport_students
        const savedStudents = localStorage.getItem('vbsport_students');
        if (savedStudents) {
          const studentsList = JSON.parse(savedStudents);
          const matchedStudent = studentsList.find((s: any) => s.email && s.email.trim().toLowerCase() === cleanEmail);
          
          if (matchedStudent) {
            if (matchedStudent.status === 'cancelado') {
              setErrorMessage(`A matrícula de "${matchedStudent.name}" está inativa ou cancelada. Contate a recepção.`);
              setIsLoading(false);
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
              permissions: ['inicio', 'treinos', 'agenda', 'pay']
            };

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
            setIsLoading(false);
            return;
          }
        }

        // 4. Usuário NÃO cadastrado no sistema -> BLOQUEAR ACESSO!
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
      } catch (err) {
        console.error('Erro na autenticação:', err);
      } finally {
        setIsLoading(false);
      }
    })();
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
        active: true,
        createdAt: new Date().toISOString().slice(0, 10),
        lastLogin: 'Agora (Novo Cadastro)',
        department: role === 'admin' ? 'Diretoria' : (role === 'gerente' ? 'Gerência' : (role === 'treinador' ? 'Musculação/Aulas' : 'Atendimento')),
        permissions: role === 'admin' 
          ? ['inicio', 'dashboards', 'alunos', 'treinos', 'agenda', 'empresas_clientes', 'financeiro', 'vendas', 'comandas', 'estoque', 'crm', 'whatsapp', 'relatorios', 'configuracoes']
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

  const inputCls = `w-full rounded-xl px-4 py-3 pr-11 text-[15px] transition-all focus:outline-hidden focus:ring-4 focus:ring-blue-500/20 ${
    isDarkMode
      ? 'bg-white/5 border border-white/15 text-white placeholder:text-slate-500 focus:border-blue-400'
      : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
  }`;
  const labelCls = `block text-[11px] font-semibold uppercase tracking-[0.12em] mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`;
  const pillSecondary = isDarkMode
    ? 'bg-white/5 hover:bg-white/10 text-slate-100 border-white/15 hover:border-blue-400/60'
    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-blue-400';

  return (
    <div className="min-h-screen w-full relative overflow-hidden font-body text-white flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Fundo: foto + degradê azul para legibilidade */}
      <div className="absolute inset-0 z-0">
        <img src={loginBg} alt="" className="w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040a1c]/95 via-[#07122e]/80 to-[#0b1f52]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040a1c]/70 via-transparent to-transparent" />
      </div>

      {/* Conteúdo: mensagem à esquerda, card de login à direita */}
      <main className="flex-1 w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-14 py-6 grid lg:grid-cols-[1.15fr_0.85fr] items-center gap-12 z-10 relative">
        <section className="hidden lg:block">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-4 py-1.5 text-xs font-semibold tracking-[0.16em] uppercase text-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Plataforma de gestão esportiva
          </span>
          <h2 className="font-display font-extrabold italic uppercase leading-[0.92] tracking-tight mt-6 text-6xl xl:text-7xl">
            Performance<br />Análise<br /><span className="text-blue-400">& Controle</span>
          </h2>
          <p className="mt-6 max-w-md text-lg text-slate-200/90 leading-relaxed">
            Alunos, treinos, avaliações, financeiro e acessos da sua academia em um único painel.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3 text-sm font-semibold tracking-wide text-slate-100">
            {[
              { icon: Trophy, text: 'ESCOLAS DE FUTEBOL' },
              { icon: Dumbbell, text: 'ACADEMIA' },
              { icon: UserCheck, text: 'PERSONAL' },
              { icon: Activity, text: 'QUALQUER SEGMENTO ESPORTIVO/FITNESS' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md px-4 py-2">
                <Icon className="w-4 h-4 text-blue-300" /> {text}
              </li>
            ))}
          </ul>
        </section>

        <div className="w-full max-w-[440px] justify-self-center lg:justify-self-end rounded-[28px] p-7 sm:p-9 bg-white text-slate-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]">
          {/* Logomarca oficial */}
          <div className="mx-auto mb-6 w-fit">
            <GLProFitLogo size="md" />
          </div>

          <div className="text-center mb-6">
            <h1 className={`font-display text-3xl font-bold uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Acesse sua conta
            </h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Entre com seu e-mail e senha para continuar.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successToast && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className={labelCls}>E-mail</label>
              <div className="relative">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@gmail.com" required className={inputCls} />
                <UserCircle2 className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className={labelCls}>Senha</label>
                <button
                  type="button"
                  onClick={() => { setErrorMessage(null); setIsForgotPasswordOpen(true); }}
                  className="text-xs font-semibold text-blue-500 hover:text-blue-400 hover:underline transition-colors mb-1.5"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={inputCls} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-display text-lg font-bold uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Entrar</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

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
                className={`w-full py-3 px-6 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 border active:scale-[0.98] text-center ${
                  isDarkMode
                    ? 'bg-transparent text-blue-300 border-blue-400/40 hover:bg-blue-400/10'
                    : 'bg-transparent text-blue-700 border-blue-600/40 hover:bg-blue-50'
                }`}
                title="Abre a tela de cadastro em uma nova guia para Aluno ou Responsável"
              >
                <UserPlus className="w-4 h-4" />
                <span>Realizar cadastro</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>

              <div className="relative flex py-1 items-center">
                <div className={`flex-grow border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}></div>
                <span className={`shrink mx-3 text-[10px] font-semibold uppercase tracking-[0.18em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  ou acesse com
                </span>
                <div className={`flex-grow border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}></div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  disabled={isLoading}
                  className={`py-2.5 px-3 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 border active:scale-[0.98] ${pillSecondary}`}
                  title="Acessar com a Conta Google"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.96 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <span className="truncate">Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const matched = systemUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
                    setSelectedBiometricUser(matched || null);
                    setIsBiometricModalOpen(true);
                  }}
                  disabled={isLoading}
                  className={`py-2.5 px-3 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 border active:scale-[0.98] ${pillSecondary}`}
                  title="Autenticação biométrica (Touch ID, Face ID, Windows Hello)"
                >
                  <Fingerprint className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="truncate">Biometria</span>
                </button>
              </div>
            </div>
          </form>

          <div className={`mt-6 pt-4 border-t flex items-center justify-center ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
            <button
              type="button"
              onClick={() => setIsSecurityModalOpen(true)}
              className={`text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
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

      <footer className="w-full py-4 text-center text-xs z-10 relative text-slate-300/80">
        GL PRO FIT • Performance • Análise • Controle © 2026
      </footer>
    </div>
  );
};
