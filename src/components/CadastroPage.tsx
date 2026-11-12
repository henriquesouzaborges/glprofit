import React, { useState } from 'react';
import { 
  User, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Dumbbell, 
  Lock, 
  Mail, 
  Phone, 
  Calendar, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  HeartHandshake, 
  Baby, 
  Sparkles,
  FileText,
  Sun,
  Moon,
  LogIn
} from 'lucide-react';
import { SystemUser, Student } from '../types';
import { getSystemUsers, saveSystemUsers } from '../services/userService';
import { logSecurityEvent } from '../services/securityService';
import { SegurancaDadosModal } from './modals/SegurancaDadosModal';

interface CadastroPageProps {
  onBackToLogin: () => void;
  onCadastroSuccess?: (data: { user: SystemUser; student?: Student }) => void;
}

export type AccountType = 'aluno' | 'responsavel';

export const CadastroPage: React.FC<CadastroPageProps> = ({ 
  onBackToLogin,
  onCadastroSuccess 
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') || true;
  });

  const [accountType, setAccountType] = useState<AccountType>('aluno');
  const [guardianStep, setGuardianStep] = useState<1 | 2>(1); // Step 1: Responsável, Step 2: Aluno
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedInfo, setCompletedInfo] = useState<{
    user: SystemUser;
    studentName?: string;
    guardianName?: string;
  } | null>(null);

  // Common visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ===== Form States: SOU ALUNO =====
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cpf: '',
    birthDate: '',
    gender: 'nao_informar',
    modality: 'Musculação & Cardio',
    emergencyContact: '',
    acceptTerms: true
  });

  // ===== Form States: SOU O RESPONSÁVEL DO ALUNO =====
  // Etapa 1: Responsável
  const [guardianForm, setGuardianForm] = useState({
    name: '',
    relationship: 'Mãe', // Pai, Mãe, Tutor Legal, Avô/Avó, Outro
    cpf: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    acceptTerms: true
  });

  // Etapa 2: Aluno Dependente
  const [dependentStudentForm, setDependentStudentForm] = useState({
    name: '',
    birthDate: '',
    cpfOrDoc: '',
    modality: 'Natação Infantil',
    medicalNotes: '',
    emergencyContact: '',
    acceptMinorAuth: true
  });

  // Toggle Theme
  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Password Strength Calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Vazia', color: 'bg-zinc-700', percentage: 0 };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score, label: 'Fraca', color: 'bg-rose-500', percentage: 33 };
    if (score <= 4) return { score, label: 'Média', color: 'bg-amber-500', percentage: 66 };
    return { score, label: 'Forte & Segura', color: 'bg-emerald-500', percentage: 100 };
  };

  // Helper to format CPF
  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  // Helper to format Phone
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
    }
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
  };

  // SUBMIT: Sou Aluno
  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!studentForm.name.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }
    if (!studentForm.email.trim() || !studentForm.email.includes('@')) {
      setErrorMessage('Informe um e-mail de acesso válido.');
      return;
    }
    if (studentForm.password.length < 6) {
      setErrorMessage('A senha precisa ter no mínimo 6 caracteres.');
      return;
    }
    if (studentForm.password !== studentForm.confirmPassword) {
      setErrorMessage('As senhas digitadas não conferem.');
      return;
    }
    if (!studentForm.acceptTerms) {
      setErrorMessage('Você deve aceitar a Política de Privacidade e os Termos LGPD.');
      return;
    }

    const currentUsers = getSystemUsers();
    const existing = currentUsers.find(
      u => u.email.trim().toLowerCase() === studentForm.email.trim().toLowerCase()
    );
    if (existing) {
      setErrorMessage(`O e-mail "${studentForm.email}" já está cadastrado no sistema. Faça login com suas credenciais.`);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const studentId = `alu-${Date.now()}`;
      const codeNumber = Math.floor(1000 + Math.random() * 9000);
      const studentCode = `VB-${codeNumber}`;
      const today = new Date().toISOString().slice(0, 10);
      const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

      // Create System User
      const newSystemUser: SystemUser = {
        id: studentId,
        name: studentForm.name.trim(),
        email: studentForm.email.trim().toLowerCase(),
        role: 'aluno',
        phone: studentForm.phone || undefined,
        active: true,
        createdAt: today,
        lastLogin: 'Primeiro acesso',
        department: `Aluno - ${studentForm.modality}`,
        permissions: ['inicio', 'treinos', 'agenda', 'avaliacoes', 'nutricao', 'bem_estar']
      };

      saveSystemUsers([...currentUsers, newSystemUser]);

      // Create Student Record in vbsport_students
      const newStudent: Student = {
        id: studentId,
        code: studentCode,
        name: studentForm.name.trim(),
        email: studentForm.email.trim().toLowerCase(),
        phone: studentForm.phone || '(11) 90000-0000',
        cpf: studentForm.cpf || '000.000.000-00',
        birthDate: studentForm.birthDate || '2000-01-01',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status: 'ativo',
        planId: 'plan-custom',
        planName: studentForm.modality,
        planPrice: 149.90,
        startDate: today,
        endDate: nextMonth,
        dueDate: '10',
        pendingAmount: 0,
        notes: `Cadastrado pelo próprio aluno. Emergência: ${studentForm.emergencyContact || 'Não informado'}.`
      };

      try {
        const savedStudents = localStorage.getItem('vbsport_students');
        const list = savedStudents ? JSON.parse(savedStudents) : [];
        list.unshift(newStudent);
        localStorage.setItem('vbsport_students', JSON.stringify(list));
      } catch (err) {
        console.error('Erro ao salvar aluno:', err);
      }

      // Security Audit Log
      logSecurityEvent({
        eventType: 'REGISTER_SUCCESS',
        userEmail: newSystemUser.email,
        userName: newSystemUser.name,
        provider: 'email_password',
        details: `Novo aluno cadastrado com sucesso. Matrícula: ${studentCode}.`,
        status: 'success'
      });

      setCompletedInfo({
        user: newSystemUser,
        studentName: newSystemUser.name
      });
      setIsCompleted(true);
    }, 700);
  };

  // ADVANCE GUARDIAN STEP 1 -> 2
  const handleAdvanceGuardianStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!guardianForm.name.trim()) {
      setErrorMessage('Informe o nome completo do responsável.');
      return;
    }
    if (!guardianForm.cpf.trim() || guardianForm.cpf.length < 11) {
      setErrorMessage('Informe um CPF válido para o responsável.');
      return;
    }
    if (!guardianForm.phone.trim()) {
      setErrorMessage('Informe o WhatsApp ou telefone do responsável.');
      return;
    }
    if (!guardianForm.email.trim() || !guardianForm.email.includes('@')) {
      setErrorMessage('Informe um e-mail válido para o responsável (será usado para login).');
      return;
    }
    if (guardianForm.password.length < 6) {
      setErrorMessage('A senha precisa ter no mínimo 6 caracteres.');
      return;
    }
    if (guardianForm.password !== guardianForm.confirmPassword) {
      setErrorMessage('As senhas digitadas não conferem.');
      return;
    }
    if (!guardianForm.acceptTerms) {
      setErrorMessage('O responsável deve aceitar a Política de Privacidade e os Termos de Proteção de Dados.');
      return;
    }

    const currentUsers = getSystemUsers();
    const existing = currentUsers.find(
      u => u.email.trim().toLowerCase() === guardianForm.email.trim().toLowerCase()
    );
    if (existing) {
      setErrorMessage(`O e-mail "${guardianForm.email}" já está cadastrado no sistema. Faça login ou use outro e-mail.`);
      return;
    }

    // Advance to Step 2 (Dados do Aluno)
    setGuardianStep(2);
  };

  // SUBMIT: Sou o Responsável do Aluno (Etapa 2 Final)
  const handleRegisterGuardianAndStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!dependentStudentForm.name.trim()) {
      setErrorMessage('Informe o nome completo do aluno dependente.');
      return;
    }
    if (!dependentStudentForm.birthDate) {
      setErrorMessage('Informe a data de nascimento do aluno.');
      return;
    }
    if (!dependentStudentForm.acceptMinorAuth) {
      setErrorMessage('O responsável legal deve assinar e aceitar o Termo de Autorização e LGPD do Menor.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const today = new Date().toISOString().slice(0, 10);
      const guardianId = `resp-${Date.now()}`;
      const studentId = `alu-dep-${Date.now()}`;
      const codeNumber = Math.floor(1000 + Math.random() * 9000);
      const studentCode = `VB-${codeNumber}`;
      const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

      // 1. Create Guardian System User (Account to Login)
      const currentUsers = getSystemUsers();
      const newGuardianUser: SystemUser = {
        id: guardianId,
        name: guardianForm.name.trim(),
        email: guardianForm.email.trim().toLowerCase(),
        role: 'aluno', // Role with access to student view / parental portal
        phone: guardianForm.phone,
        active: true,
        createdAt: today,
        lastLogin: 'Primeiro acesso',
        department: `Responsável Legal (${guardianForm.relationship}) - Aluno: ${dependentStudentForm.name}`,
        permissions: ['inicio', 'treinos', 'agenda', 'avaliacoes', 'nutricao', 'bem_estar']
      };

      saveSystemUsers([...currentUsers, newGuardianUser]);

      // 2. Create Student Record in vbsport_students
      const newStudent: Student = {
        id: studentId,
        code: studentCode,
        name: dependentStudentForm.name.trim(),
        email: guardianForm.email.trim().toLowerCase(), // Contact goes to guardian
        phone: guardianForm.phone,
        cpf: dependentStudentForm.cpfOrDoc || guardianForm.cpf,
        birthDate: dependentStudentForm.birthDate,
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        status: 'ativo',
        planId: 'plan-kids',
        planName: dependentStudentForm.modality,
        planPrice: 159.90,
        startDate: today,
        endDate: nextMonth,
        dueDate: '10',
        pendingAmount: 0,
        notes: `Aluno Menor. RESPONSÁVEL LEGAL: ${guardianForm.name} (${guardianForm.relationship}) - CPF: ${guardianForm.cpf} - Tel: ${guardianForm.phone} - Email: ${guardianForm.email}. Endereço: ${guardianForm.address || 'Não informado'}. Restrições/Saúde: ${dependentStudentForm.medicalNotes || 'Nenhuma restrição relatada'}. Emergência: ${dependentStudentForm.emergencyContact || guardianForm.phone}.`
      };

      try {
        const savedStudents = localStorage.getItem('vbsport_students');
        const list = savedStudents ? JSON.parse(savedStudents) : [];
        list.unshift(newStudent);
        localStorage.setItem('vbsport_students', JSON.stringify(list));
      } catch (err) {
        console.error('Erro ao salvar aluno dependente:', err);
      }

      // Security Audit Log
      logSecurityEvent({
        eventType: 'REGISTER_SUCCESS',
        userEmail: newGuardianUser.email,
        userName: newGuardianUser.name,
        provider: 'email_password',
        details: `Responsável [${guardianForm.name}] e aluno dependente [${dependentStudentForm.name}] cadastrados. Matrícula: ${studentCode}.`,
        status: 'success'
      });

      setCompletedInfo({
        user: newGuardianUser,
        studentName: dependentStudentForm.name,
        guardianName: guardianForm.name
      });
      setIsCompleted(true);
    }, 800);
  };

  const studentPassStrength = getPasswordStrength(studentForm.password);
  const guardianPassStrength = getPasswordStrength(guardianForm.password);

  return (
    <div className={`min-h-screen w-full transition-colors flex flex-col ${
      isDarkMode ? 'bg-[#0a0a0c] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navigation Bar */}
      <header className={`w-full border-b px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md ${
        isDarkMode ? 'bg-[#0d0d10]/90 border-[#1f1f26]' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-md shadow-blue-500/20">
            <div className="w-full h-full bg-[#0d0d10] rounded-[10px] flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                GL PRO FIT
              </span>
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                Novo Cadastro
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Portal Oficial de Matrícula & Acesso
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-colors ${
              isDarkMode 
                ? 'bg-[#141418] border-[#26262e] text-zinc-300 hover:text-white' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
            title="Alternar Modo Escuro / Claro"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Botão Voltar para o Login */}
          <button
            type="button"
            onClick={onBackToLogin}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              isDarkMode 
                ? 'bg-[#15151b] hover:bg-[#1d1d25] border-[#292933] text-zinc-200' 
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-xs'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-blue-400" />
            <span>Voltar ao Login</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-center">
        {isCompleted ? (
          /* SUCCESS SCREEN */
          <div className={`p-6 sm:p-10 rounded-3xl border shadow-2xl text-center max-w-xl mx-auto animate-in zoom-in-95 duration-200 ${
            isDarkMode ? 'bg-[#111116] border-[#24242e]' : 'bg-white border-slate-200'
          }`}>
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center mb-5 shadow-lg shadow-emerald-900/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Cadastro Realizado com Sucesso
            </span>

            <h1 className="text-2xl font-extrabold mt-3 mb-2 tracking-tight">
              {completedInfo?.guardianName 
                ? `Bem-vindo(a), ${completedInfo.guardianName}!` 
                : `Bem-vindo(a), ${completedInfo?.user.name}!`}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
              {completedInfo?.guardianName ? (
                <>
                  Seu perfil de <span className="font-semibold text-white">Responsável Legal</span> e o perfil do aluno <span className="font-semibold text-emerald-400">{completedInfo.studentName}</span> foram criados e ativados no sistema.
                </>
              ) : (
                <>
                  Seu perfil de <span className="font-semibold text-emerald-400">Aluno</span> foi registrado com sucesso. Você já possui credenciais ativas para acessar os treinos e recursos da GL PRO FIT.
                </>
              )}
            </p>

            {/* Credential summary box */}
            <div className={`p-4 rounded-2xl border text-left mb-6 text-xs space-y-2 ${
              isDarkMode ? 'bg-[#16161d] border-[#2c2c38]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-zinc-400">
                <span>E-mail de Login:</span>
                <span className="font-mono font-bold text-white">{completedInfo?.user.email}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Tipo de Acesso:</span>
                <span className="font-semibold text-blue-400">
                  {completedInfo?.guardianName ? 'Responsável + Aluno' : 'Aluno Matriculado'}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Status da Conta:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Ativo & Liberado
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onCadastroSuccess && completedInfo) {
                    onCadastroSuccess({ user: completedInfo.user });
                  } else {
                    onBackToLogin();
                  }
                }}
                className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 active:scale-[0.99]"
              >
                <span>Acessar Painel Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onBackToLogin}
                className={`py-3 px-5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors ${
                  isDarkMode 
                    ? 'border-[#30303b] hover:bg-[#1a1a22] text-zinc-300' 
                    : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Voltar à Tela de Login
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <div className={`rounded-3xl border shadow-2xl overflow-hidden ${
            isDarkMode ? 'bg-[#111116] border-[#22222b]' : 'bg-white border-slate-200'
          }`}>
            {/* Top Banner & Title */}
            <div className={`p-6 sm:p-8 border-b ${
              isDarkMode ? 'border-[#22222b] bg-[#14141a]' : 'border-slate-200 bg-slate-50/70'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Preenchimento de Cadastro
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Criar Nova Conta no GL PRO FIT
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Escolha abaixo se o cadastro é para você mesmo ou se você é o responsável legal pelo aluno.
              </p>

              {/* Selector: Sou Aluno vs Sou o Responsável do Aluno */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {/* Opção 1: Sou Aluno */}
                <button
                  type="button"
                  onClick={() => {
                    setAccountType('aluno');
                    setErrorMessage(null);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex items-start gap-3.5 ${
                    accountType === 'aluno'
                      ? 'border-blue-500 bg-blue-600/10 ring-2 ring-blue-500/30'
                      : isDarkMode
                        ? 'border-[#292934] bg-[#16161d] hover:border-[#383847]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    accountType === 'aluno'
                      ? 'bg-blue-600 text-white'
                      : isDarkMode ? 'bg-[#22222b] text-zinc-400' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${
                        accountType === 'aluno' ? 'text-blue-400' : isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Sou Aluno
                      </span>
                      {accountType === 'aluno' && (
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                      Tenho 18 anos ou mais e vou treinar na academia. Crie seu perfil de acesso direto.
                    </p>
                  </div>
                </button>

                {/* Opção 2: Sou o Responsável do Aluno */}
                <button
                  type="button"
                  onClick={() => {
                    setAccountType('responsavel');
                    setErrorMessage(null);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex items-start gap-3.5 ${
                    accountType === 'responsavel'
                      ? 'border-emerald-500 bg-emerald-600/10 ring-2 ring-emerald-500/30'
                      : isDarkMode
                        ? 'border-[#292934] bg-[#16161d] hover:border-[#383847]'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    accountType === 'responsavel'
                      ? 'bg-emerald-600 text-white'
                      : isDarkMode ? 'bg-[#22222b] text-zinc-400' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${
                        accountType === 'responsavel' ? 'text-emerald-400' : isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        Sou o Responsável do Aluno
                      </span>
                      {accountType === 'responsavel' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                      Pai, mãe ou tutor legal. Criaremos primeiro o seu perfil e, em seguida, o do aluno dependente.
                    </p>
                  </div>
                </button>
              </div>

              {/* Stepper Indicator if Responsável is selected */}
              {accountType === 'responsavel' && (
                <div className="mt-5 pt-4 border-t border-zinc-700/40 flex items-center justify-center gap-3">
                  <div className={`flex items-center gap-2 text-xs font-bold ${
                    guardianStep === 1 ? 'text-emerald-400' : 'text-zinc-400'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold ${
                      guardianStep === 1 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      1
                    </div>
                    <span>1. Perfil do Responsável</span>
                  </div>

                  <div className="w-10 h-0.5 bg-zinc-700"></div>

                  <div className={`flex items-center gap-2 text-xs font-bold ${
                    guardianStep === 2 ? 'text-emerald-400' : 'text-zinc-500'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold ${
                      guardianStep === 2 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                    }`}>
                      2
                    </div>
                    <span>2. Perfil do Aluno</span>
                  </div>
                </div>
              )}
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="m-6 mb-0 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Forms Body */}
            <div className="p-6 sm:p-8">
              {/* FLOW 1: SOU ALUNO */}
              {accountType === 'aluno' && (
                <form onSubmit={handleRegisterStudent} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nome Completo */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={studentForm.name}
                        onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                        placeholder="Ex: Carlos Eduardo de Oliveira"
                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                          isDarkMode
                            ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-blue-500'
                            : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                        }`}
                      />
                    </div>

                    {/* Email de Acesso */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        E-mail de Acesso (Login) *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={studentForm.email}
                          onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                          placeholder="seu.email@exemplo.com"
                          className={`w-full rounded-xl px-3.5 py-2.5 pl-9 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                            isDarkMode
                              ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-blue-500'
                              : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                          }`}
                        />
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      </div>
                    </div>

                    {/* Senha */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Senha de Acesso (mín. 6 dígitos) *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={studentForm.password}
                          onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                          placeholder="••••••••"
                          className={`w-full rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                            isDarkMode
                              ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-blue-500'
                              : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password strength */}
                      {studentForm.password && (
                        <div className="mt-1.5 space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-zinc-400">Segurança da Senha:</span>
                            <span className="font-bold text-zinc-300 uppercase">{studentPassStrength.label}</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${studentPassStrength.color}`}
                              style={{ width: `${studentPassStrength.percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirmar Senha */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Confirmar Senha *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={studentForm.confirmPassword}
                          onChange={(e) => setStudentForm({ ...studentForm, confirmPassword: e.target.value })}
                          placeholder="••••••••"
                          className={`w-full rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                            isDarkMode
                              ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-blue-500'
                              : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* CPF */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        CPF
                      </label>
                      <input
                        type="text"
                        value={studentForm.cpf}
                        onChange={(e) => setStudentForm({ ...studentForm, cpf: formatCPF(e.target.value) })}
                        placeholder="000.000.000-00"
                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                          isDarkMode
                            ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-blue-500'
                            : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                        }`}
                      />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        WhatsApp / Celular
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={studentForm.phone}
                          onChange={(e) => setStudentForm({ ...studentForm, phone: formatPhone(e.target.value) })}
                          placeholder="(11) 99999-0000"
                          className={`w-full rounded-xl px-3.5 py-2.5 pl-9 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                            isDarkMode
                              ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-blue-500'
                              : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                          }`}
                        />
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      </div>
                    </div>

                    {/* Data de Nascimento */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        value={studentForm.birthDate}
                        onChange={(e) => setStudentForm({ ...studentForm, birthDate: e.target.value })}
                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                          isDarkMode
                            ? 'bg-[#15151c] border border-[#2e2e3a] text-white focus:border-blue-500'
                            : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-600'
                        }`}
                      />
                    </div>

                    {/* Modalidade de Interesse */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                        Modalidade Principal de Treino
                      </label>
                      <select
                        value={studentForm.modality}
                        onChange={(e) => setStudentForm({ ...studentForm, modality: e.target.value })}
                        className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                          isDarkMode
                            ? 'bg-[#15151c] border border-[#2e2e3a] text-white focus:border-blue-500'
                            : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-600'
                        }`}
                      >
                        <option value="Musculação & Cardio">Musculação & Cardio</option>
                        <option value="Futevôlei & Areia">Futevôlei & Areia</option>
                        <option value="Natação Adulto">Natação Adulto</option>
                        <option value="Boxe & Artes Marciais">Boxe & Artes Marciais</option>
                        <option value="Cross Training">Cross Training</option>
                        <option value="Pilates & Postural">Pilates & Postural</option>
                        <option value="Plano Completo All-Inclusive">Plano Completo All-Inclusive</option>
                      </select>
                    </div>
                  </div>

                  {/* Contato de Emergência */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                      Contato de Emergência (Nome e Telefone) - Opcional
                    </label>
                    <input
                      type="text"
                      value={studentForm.emergencyContact}
                      onChange={(e) => setStudentForm({ ...studentForm, emergencyContact: e.target.value })}
                      placeholder="Ex: Mariana (Mãe) - (11) 98888-7777"
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                        isDarkMode
                          ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-blue-500'
                          : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                      }`}
                    />
                  </div>

                  {/* LGPD Terms */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-400">
                      <input
                        type="checkbox"
                        checked={studentForm.acceptTerms}
                        onChange={(e) => setStudentForm({ ...studentForm, acceptTerms: e.target.checked })}
                        className="mt-0.5 rounded text-blue-600 focus:ring-0"
                      />
                      <span>
                        Concordo com o tratamento dos meus dados de acordo com a{' '}
                        <button
                          type="button"
                          onClick={() => setIsSecurityModalOpen(true)}
                          className="text-blue-400 underline hover:text-blue-300 font-semibold"
                        >
                          LGPD e Diretrizes de Segurança do GL PRO FIT
                        </button>
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 active:scale-[0.99] disabled:opacity-70"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Finalizar Cadastro de Aluno</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* FLOW 2: SOU O RESPONSÁVEL DO ALUNO */}
              {accountType === 'responsavel' && (
                <>
                  {/* ETAPA 1: DADOS DO RESPONSÁVEL */}
                  {guardianStep === 1 && (
                    <form onSubmit={handleAdvanceGuardianStep1} className="space-y-5">
                      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>
                          <strong>Etapa 1:</strong> Preencha os dados do responsável legal/financeiro. Estes dados serão usados para acessar o portal da academia.
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Nome do Responsável */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                            Nome Completo do Responsável *
                          </label>
                          <input
                            type="text"
                            required
                            value={guardianForm.name}
                            onChange={(e) => setGuardianForm({ ...guardianForm, name: e.target.value })}
                            placeholder="Ex: Fernando de Souza Oliveira"
                            className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                              isDarkMode
                                ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-emerald-500'
                                : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600'
                            }`}
                          />
                        </div>

                        {/* Grau de Parentesco */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                            Grau de Parentesco / Vínculo *
                          </label>
                          <select
                            value={guardianForm.relationship}
                            onChange={(e) => setGuardianForm({ ...guardianForm, relationship: e.target.value })}
                            className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                              isDarkMode
                                ? 'bg-[#15151c] border border-[#2e2e3a] text-white focus:border-emerald-500'
                                : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-emerald-600'
                            }`}
                          >
                            <option value="Mãe">Mãe</option>
                            <option value="Pai">Pai</option>
                            <option value="Tutor Legal">Tutor Legal / Guardião</option>
                            <option value="Avô / Avó">Avô / Avó</option>
                            <option value="Irmão(ã) Maior">Irmão(ã) Maior de Idade</option>
                            <option value="Outro">Outro Responsável Legal</option>
                          </select>
                        </div>

                        {/* CPF do Responsável */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                            CPF do Responsável *
                          </label>
                          <input
                            type="text"
                            required
                            value={guardianForm.cpf}
                            onChange={(e) => setGuardianForm({ ...guardianForm, cpf: formatCPF(e.target.value) })}
                            placeholder="000.000.000-00"
                            className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                              isDarkMode
                                ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-emerald-500'
                                : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600'
                            }`}
                          />
                        </div>

                        {/* WhatsApp / Celular */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                            WhatsApp / Celular do Responsável *
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              required
                              value={guardianForm.phone}
                              onChange={(e) => setGuardianForm({ ...guardianForm, phone: formatPhone(e.target.value) })}
                              placeholder="(11) 99999-0000"
                              className={`w-full rounded-xl px-3.5 py-2.5 pl-9 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                                isDarkMode
                              ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-emerald-500'
                              : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600'
                              }`}
                            />
                            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                          </div>
                        </div>

                        {/* E-mail do Responsável (Login) */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                            E-mail do Responsável (Login de Acesso) *
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              required
                              value={guardianForm.email}
                              onChange={(e) => setGuardianForm({ ...guardianForm, email: e.target.value })}
                              placeholder="responsavel@exemplo.com"
                              className={`w-full rounded-xl px-3.5 py-2.5 pl-9 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                                isDarkMode
                              ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-emerald-500'
                              : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600'
                              }`}
                            />
                            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                          </div>
                        </div>

                        {/* Endereço Residencial */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                            Endereço / Cidade
                          </label>
                          <input
                            type="text"
                            value={guardianForm.address}
                            onChange={(e) => setGuardianForm({ ...guardianForm, address: e.target.value })}
                            placeholder="Rua, Número, Bairro, Cidade"
                            className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                              isDarkMode
                                ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-emerald-500'
                                : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600'
                            }`}
                          />
                        </div>

                        {/* Senha */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                            Senha de Acesso (mín. 6 dígitos) *
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={guardianForm.password}
                              onChange={(e) => setGuardianForm({ ...guardianForm, password: e.target.value })}
                              placeholder="••••••••"
                              className={`w-full rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                                isDarkMode
                              ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-emerald-500'
                              : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>

                          {/* Guardian Password Strength */}
                          {guardianForm.password && (
                            <div className="mt-1.5 space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="text-zinc-400">Segurança da Senha:</span>
                                <span className="font-bold text-zinc-300 uppercase">{guardianPassStrength.label}</span>
                              </div>
                              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${guardianPassStrength.color}`}
                                  style={{ width: `${guardianPassStrength.percentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Confirmar Senha */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                            Confirmar Senha *
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              required
                              value={guardianForm.confirmPassword}
                              onChange={(e) => setGuardianForm({ ...guardianForm, confirmPassword: e.target.value })}
                              placeholder="••••••••"
                              className={`w-full rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                                isDarkMode
                              ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-emerald-500'
                              : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* LGPD Terms */}
                      <div className="pt-2">
                        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-400">
                          <input
                            type="checkbox"
                            checked={guardianForm.acceptTerms}
                            onChange={(e) => setGuardianForm({ ...guardianForm, acceptTerms: e.target.checked })}
                            className="mt-0.5 rounded text-emerald-600 focus:ring-0"
                          />
                          <span>
                            Declaro ser o responsável legal e concordo com a{' '}
                            <button
                              type="button"
                              onClick={() => setIsSecurityModalOpen(true)}
                              className="text-emerald-400 underline hover:text-emerald-300 font-semibold"
                            >
                              Política de Privacidade e LGPD
                            </button>
                          </span>
                        </label>
                      </div>

                      {/* Botão de Avanço para a Etapa 2 */}
                      <div className="pt-3">
                        <button
                          type="submit"
                          className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 active:scale-[0.99]"
                        >
                          <span>Avançar para o Cadastro do Aluno</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ETAPA 2: DADOS DO ALUNO DEPENDENTE */}
                  {guardianStep === 2 && (
                    <form onSubmit={handleRegisterGuardianAndStudent} className="space-y-5">
                      {/* Guardian summary badge */}
                      <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <Baby className="w-4 h-4 shrink-0 text-blue-400" />
                          <span className="truncate">
                            <strong>Etapa 2:</strong> Aluno vinculado ao responsável{' '}
                            <strong className="text-white">{guardianForm.name}</strong> ({guardianForm.relationship}).
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setGuardianStep(1)}
                          className="shrink-0 text-[11px] underline text-blue-300 hover:text-white ml-2"
                        >
                          Editar Responsável
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Nome do Aluno */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                            Nome Completo do Aluno *
                          </label>
                          <input
                            type="text"
                            required
                            value={dependentStudentForm.name}
                            onChange={(e) => setDependentStudentForm({ ...dependentStudentForm, name: e.target.value })}
                            placeholder="Ex: Lucas Henrique de Oliveira"
                            className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                              isDarkMode
                                ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-blue-500'
                                : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                            }`}
                          />
                        </div>

                        {/* Data de Nascimento do Aluno */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                            Data de Nascimento do Aluno *
                          </label>
                          <input
                            type="date"
                            required
                            value={dependentStudentForm.birthDate}
                            onChange={(e) => setDependentStudentForm({ ...dependentStudentForm, birthDate: e.target.value })}
                            className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                              isDarkMode
                                ? 'bg-[#15151c] border border-[#2e2e3a] text-white focus:border-blue-500'
                                : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-600'
                            }`}
                          />
                        </div>

                        {/* CPF ou Certidão de Nascimento do Aluno */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                            CPF ou Documento do Aluno (RG / Certidão)
                          </label>
                          <input
                            type="text"
                            value={dependentStudentForm.cpfOrDoc}
                            onChange={(e) => setDependentStudentForm({ ...dependentStudentForm, cpfOrDoc: e.target.value })}
                            placeholder="Documento de identificação do aluno"
                            className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                              isDarkMode
                                ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-blue-500'
                                : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                            }`}
                          />
                        </div>

                        {/* Modalidade / Categoria */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                            Modalidade / Turma Desejada
                          </label>
                          <select
                            value={dependentStudentForm.modality}
                            onChange={(e) => setDependentStudentForm({ ...dependentStudentForm, modality: e.target.value })}
                            className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                              isDarkMode
                                ? 'bg-[#15151c] border border-[#2e2e3a] text-white focus:border-blue-500'
                                : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-600'
                            }`}
                          >
                            <option value="Natação Infantil & Bebês">Natação Infantil & Bebês</option>
                            <option value="Judô / Jiu-Jitsu Kids">Judô / Jiu-Jitsu Kids</option>
                            <option value="Futevôlei & Areia Juvenil">Futevôlei & Areia Juvenil</option>
                            <option value="Musculação Juvenil (A partir de 14 anos)">Musculação Juvenil (14+ anos)</option>
                            <option value="Balé & Dança Infantil">Balé & Dança Infantil</option>
                            <option value="Funcional Kids & Coordenação">Funcional Kids & Coordenação</option>
                          </select>
                        </div>
                      </div>

                      {/* Informações de Saúde / Observações Médicas */}
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                          Restrições de Saúde, Alergias ou Observações Médicas (Opcional)
                        </label>
                        <textarea
                          rows={2}
                          value={dependentStudentForm.medicalNotes}
                          onChange={(e) => setDependentStudentForm({ ...dependentStudentForm, medicalNotes: e.target.value })}
                          placeholder="Informe se o aluno possui asma, alergias, restrição a exercícios específicos ou toma medicação regular..."
                          className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors focus:outline-hidden resize-none ${
                            isDarkMode
                              ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-blue-500'
                              : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                          }`}
                        />
                      </div>

                      {/* Contato de Emergência Secundário */}
                      <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                          Contato de Emergência Secundário (Além do responsável)
                        </label>
                        <input
                          type="text"
                          value={dependentStudentForm.emergencyContact}
                          onChange={(e) => setDependentStudentForm({ ...dependentStudentForm, emergencyContact: e.target.value })}
                          placeholder="Ex: Avó Vera - (11) 97777-6666"
                          className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm transition-colors focus:outline-hidden ${
                            isDarkMode
                              ? 'bg-[#15151c] border border-[#2e2e3a] text-white placeholder:text-zinc-500 focus:border-blue-500'
                              : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600'
                          }`}
                        />
                      </div>

                      {/* Termo de Autorização de Menor & LGPD */}
                      <div className="pt-2">
                        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-400">
                          <input
                            type="checkbox"
                            checked={dependentStudentForm.acceptMinorAuth}
                            onChange={(e) => setDependentStudentForm({ ...dependentStudentForm, acceptMinorAuth: e.target.checked })}
                            className="mt-0.5 rounded text-emerald-600 focus:ring-0"
                          />
                          <span>
                            Como responsável legal, autorizo a prática esportiva pelo aluno menor de idade e o tratamento dos dados conforme a{' '}
                            <button
                              type="button"
                              onClick={() => setIsSecurityModalOpen(true)}
                              className="text-emerald-400 underline hover:text-emerald-300 font-semibold"
                            >
                              LGPD e Termo de Consentimento
                            </button>
                          </span>
                        </label>
                      </div>

                      {/* Navigation buttons: Voltar / Concluir */}
                      <div className="pt-3 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setGuardianStep(1)}
                          className={`py-3.5 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                            isDarkMode 
                              ? 'border-[#2d2d38] hover:bg-[#1a1a22] text-zinc-300' 
                              : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Voltar ao Responsável</span>
                        </button>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 active:scale-[0.99] disabled:opacity-70"
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Concluir Cadastro (Responsável + Aluno)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>

            {/* Footer with return to login */}
            <div className={`p-4 border-t text-center text-xs ${
              isDarkMode ? 'border-[#202029] bg-[#0f0f14] text-zinc-400' : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}>
              Já possui uma conta ativa?{' '}
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-blue-400 font-bold hover:underline ml-1"
              >
                Fazer login
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Security & LGPD Modal */}
      <SegurancaDadosModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* System Footer */}
      <footer className={`w-full py-4 text-center text-xs ${
        isDarkMode ? 'text-zinc-600' : 'text-slate-400'
      }`}>
        GL PRO FIT Enterprise • Performance, Análise e Controle © 2026
      </footer>
    </div>
  );
};
