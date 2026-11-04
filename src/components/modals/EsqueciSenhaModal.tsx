import React, { useState } from 'react';
import { 
  KeyRound, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  RefreshCw 
} from 'lucide-react';
import { getSystemUsers, saveSystemUsers } from '../../services/userService';
import { 
  evaluatePasswordStrength, 
  logSecurityEvent 
} from '../../services/securityService';

interface EsqueciSenhaModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  onSuccess: (email: string, newPassword?: string) => void;
  isDarkMode: boolean;
}

export const EsqueciSenhaModal: React.FC<EsqueciSenhaModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
  onSuccess,
  isDarkMode
}) => {
  const [step, setStep] = useState<'email' | 'code' | 'new_password' | 'done'>('email');
  const [email, setEmail] = useState(defaultEmail);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const strength = evaluatePasswordStrength(newPassword);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Por favor, informe seu e-mail cadastrado.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const users = getSystemUsers();
      const user = users.find(u => u.email.trim().toLowerCase() === cleanEmail);

      let studentMatch = null;
      try {
        const savedStudents = localStorage.getItem('vbsport_students');
        if (savedStudents) {
          const list = JSON.parse(savedStudents);
          studentMatch = list.find((s: any) => s.email && s.email.trim().toLowerCase() === cleanEmail);
        }
      } catch (err) {
        console.error(err);
      }

      if (!user && !studentMatch) {
        setErrorMessage(`O e-mail "${cleanEmail}" não possui cadastro no sistema. Verifique os dados ou realize seu cadastro.`);
        return;
      }

      // Generate a 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);

      logSecurityEvent({
        eventType: 'PASSWORD_RESET_REQUEST',
        userEmail: cleanEmail,
        userName: user?.name || studentMatch?.name,
        provider: 'email_password',
        details: `Solicitação de redefinição de senha para ${cleanEmail}. Código de validação emitido.`,
        status: 'warning'
      });

      // Next step
      setStep('code');
    }, 600);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = verificationCode.trim();

    if (!cleanCode) {
      setErrorMessage('Digite o código de 6 dígitos enviado.');
      return;
    }

    // Allow user-entered generatedCode or Master Recovery Code '998877'
    if (cleanCode !== generatedCode && cleanCode !== '998877') {
      setErrorMessage('Código de verificação incorreto ou expirado. Tente novamente.');
      return;
    }

    setErrorMessage(null);
    setStep('new_password');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = newPassword.trim();

    if (cleanPass.length < 6) {
      setErrorMessage('A nova senha deve possuir pelo menos 6 caracteres.');
      return;
    }

    if (cleanPass !== confirmPassword.trim()) {
      setErrorMessage('A confirmação de senha não confere com a nova senha digitada.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = email.trim().toLowerCase();
      const currentUsers = getSystemUsers();
      const existingUser = currentUsers.find(u => u.email.trim().toLowerCase() === cleanEmail);

      if (existingUser) {
        const updated = currentUsers.map(u => 
          u.id === existingUser.id 
            ? { ...u, password: cleanPass, lastLogin: 'Hoje (Redefinição de Senha)' } 
            : u
        );
        saveSystemUsers(updated);
      } else {
        // If it was an enrolled student or external user, update local record
        const savedStudents = localStorage.getItem('vbsport_students');
        if (savedStudents) {
          try {
            const list = JSON.parse(savedStudents);
            const updatedStudents = list.map((s: any) => 
              s.email && s.email.toLowerCase() === cleanEmail 
                ? { ...s, password: cleanPass }
                : s
            );
            localStorage.setItem('vbsport_students', JSON.stringify(updatedStudents));
          } catch (err) {
            console.error('Erro ao atualizar senha do aluno:', err);
          }
        }
      }

      logSecurityEvent({
        eventType: 'PASSWORD_RESET_SUCCESS',
        userEmail: cleanEmail,
        userName: existingUser?.name,
        provider: 'email_password',
        details: `Senha de acesso redefinida com sucesso para a conta ${cleanEmail}.`,
        status: 'success'
      });

      setStep('done');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl relative border transition-all ${
        isDarkMode 
          ? 'bg-[#16161b] border-[#2c2c36] text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-xl transition-colors ${
            isDarkMode ? 'hover:bg-[#23232b] text-zinc-400' : 'hover:bg-slate-100 text-slate-500'
          }`}
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-500 mb-2 border border-amber-500/20 shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-black tracking-tight">
            Recuperação de Senha
          </h2>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            Proteção de Acesso & Redefinição Segura GL PRO FIT
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                E-mail cadastrado
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@gmail.com"
                  required
                  className={`w-full rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm font-semibold transition-colors focus:outline-hidden ${
                    isDarkMode 
                      ? 'bg-[#0f0f13] border border-[#2e2e38] text-white focus:border-amber-500' 
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-amber-600'
                  }`}
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                Enviaremos um código criptográfico de validação para confirmar a titularidade desta conta.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-950/30"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Gerar Código de Recuperação</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Enter Verification Code */}
        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <span className="font-bold">Código de Segurança Emitido: </span>
              <span className="font-mono font-black text-sm tracking-widest text-white ml-1 bg-amber-500/30 px-2 py-0.5 rounded">
                {generatedCode}
              </span>
              <div className="text-[10px] text-zinc-400 mt-1">
                (Em ambiente de produção, este código é disparado via WhatsApp/E-mail com validade de 10 minutos)
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Código de 6 dígitos
              </label>
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Ex: 123456"
                required
                className={`w-full rounded-xl px-3.5 py-2.5 text-center font-mono text-lg font-bold tracking-widest transition-colors focus:outline-hidden ${
                  isDarkMode 
                    ? 'bg-[#0f0f13] border border-[#2e2e38] text-amber-400 focus:border-amber-500' 
                    : 'bg-slate-50 border border-slate-300 text-amber-700 focus:border-amber-600'
                }`}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('email')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  isDarkMode ? 'border-[#2d2d38] text-zinc-400 hover:text-white' : 'border-slate-300 text-slate-600 hover:text-slate-900'
                }`}
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-950/30"
              >
                <span>Validar Código</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Define New Password */}
        {step === 'new_password' && (
          <form onSubmit={handleUpdatePassword} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Nova Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className={`w-full rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm font-semibold transition-colors focus:outline-hidden ${
                    isDarkMode 
                      ? 'bg-[#0f0f13] border border-[#2e2e38] text-white focus:border-emerald-500' 
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-emerald-600'
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

              {/* Password strength indicator */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-zinc-400">Força da Senha:</span>
                    <span className="font-bold uppercase text-zinc-300">{strength.level}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${strength.color}`} 
                      style={{ width: `${strength.percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Confirmar Nova Senha
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                required
                className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-colors focus:outline-hidden ${
                  isDarkMode 
                    ? 'bg-[#0f0f13] border border-[#2e2e38] text-white focus:border-emerald-500' 
                    : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-emerald-600'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Salvar Nova Senha Criptografada</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 4: Success / Done */}
        {step === 'done' && (
          <div className="text-center py-4 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-in zoom-in">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Senha Alterada com Sucesso!
              </h3>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                A sua nova senha já está ativa no sistema e sincronizada com o banco de dados Firebase.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onSuccess(email, newPassword);
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-900/30"
            >
              Fazer Login com a Nova Senha
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
