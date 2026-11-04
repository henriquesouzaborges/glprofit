import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  Scan, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ShieldCheck, 
  Sparkles,
  Lock,
  Cpu,
  KeyRound,
  RefreshCw,
  Check
} from 'lucide-react';
import { SystemUser } from '../../types';
import { 
  checkWebAuthnCapabilities, 
  authenticateWithWebAuthn, 
  registerWebAuthnCredential, 
  getStoredWebAuthnCredentials,
  WebAuthnCapability,
  StoredWebAuthnCredential
} from '../../services/webAuthnService';
import { logSecurityEvent } from '../../services/securityService';

interface BiometricAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser?: SystemUser | null;
  availableUsers: SystemUser[];
  onSuccess: (user: SystemUser) => void;
  isDarkMode: boolean;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  availableUsers,
  onSuccess,
  isDarkMode
}) => {
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(targetUser || (availableUsers.length > 0 ? availableUsers[0] : null));
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [method, setMethod] = useState<'fingerprint' | 'face'>('fingerprint');
  const [capabilities, setCapabilities] = useState<WebAuthnCapability | null>(null);
  const [hasCredential, setHasCredential] = useState<boolean>(false);
  const [statusDetail, setStatusDetail] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  // Carrega capacidades do WebAuthn no dispositivo
  useEffect(() => {
    let isMounted = true;
    checkWebAuthnCapabilities().then(cap => {
      if (isMounted) {
        setCapabilities(cap);
        if (cap.recommendedMethod) {
          setMethod(cap.recommendedMethod);
        }
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Atualiza usuário selecionado e verifica se já possui credencial WebAuthn
  useEffect(() => {
    if (targetUser) {
      setSelectedUser(targetUser);
    } else if (availableUsers.length > 0 && !selectedUser) {
      setSelectedUser(availableUsers[0]);
    }
  }, [targetUser, availableUsers]);

  useEffect(() => {
    if (selectedUser) {
      const stored = getStoredWebAuthnCredentials();
      const exists = stored.some(c => c.userEmail.toLowerCase() === selectedUser.email.toLowerCase());
      setHasCredential(exists);
    }
  }, [selectedUser, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setScanState('idle');
      setErrorMessage(null);
      setStatusDetail('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Executa autenticação via WebAuthn
  const handleStartScan = async () => {
    if (!selectedUser) {
      setErrorMessage('Selecione um usuário para autenticação biométrica.');
      return;
    }

    if (!selectedUser.active) {
      setErrorMessage(`O usuário "${selectedUser.name}" está inativo no sistema.`);
      return;
    }

    setScanState('scanning');
    setErrorMessage(null);
    setStatusDetail('Solicitando autorização ao sensor biométrico do dispositivo (WebAuthn)...');

    try {
      // 1. Tenta autenticação real com a API WebAuthn
      const result = await authenticateWithWebAuthn(selectedUser);

      if (result.success) {
        setStatusDetail('Chave criptográfica FIDO2 verificada com sucesso!');
        setScanState('success');

        setTimeout(() => {
          onSuccess(selectedUser);
          onClose();
        }, 800);
      } else {
        setScanState('error');
        setErrorMessage(result.error || 'Falha na autenticação biométrica. Tente novamente.');
      }
    } catch (err: any) {
      console.error('Erro na chamada biométrica:', err);
      setScanState('error');
      setErrorMessage('Erro ao comunicar com o leitor biométrico do sistema operacional.');
    }
  };

  // Cadastrar nova biometria / Passkey para o usuário
  const handleRegisterBiometric = async () => {
    if (!selectedUser) return;

    setIsRegistering(true);
    setScanState('scanning');
    setErrorMessage(null);
    setStatusDetail('Registrando nova credencial biométrica FIDO2 / WebAuthn no dispositivo...');

    try {
      const reg = await registerWebAuthnCredential({
        id: selectedUser.id,
        name: selectedUser.name,
        email: selectedUser.email
      });

      if (reg.success) {
        setHasCredential(true);
        setStatusDetail('Biometria registrada e vinculada com sucesso no hardware!');
        setScanState('success');

        setTimeout(() => {
          onSuccess(selectedUser);
          onClose();
        }, 800);
      } else {
        setScanState('error');
        setErrorMessage(reg.error || 'Não foi possível registrar a biometria neste dispositivo.');
      }
    } catch (err) {
      console.error('Erro ao registrar biometria:', err);
      setScanState('error');
      setErrorMessage('Erro ao comunicar com o hardware.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl relative border transition-all ${
        isDarkMode 
          ? 'bg-[#15151a] border-[#2c2c36] text-white' 
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

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 text-blue-500 mb-2 border border-blue-500/20 shadow-inner">
            <Fingerprint className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black tracking-tight">
            Autenticação Biométrica WebAuthn
          </h2>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            Touch ID • Face ID • Windows Hello • FIDO2 Passkeys
          </p>

          {/* Device Capability Badge */}
          <div className="mt-2.5 flex items-center justify-center gap-2">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
              capabilities?.hasPlatformAuthenticator || capabilities?.isSupported
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              <Cpu className="w-3 h-3" />
              <span>
                {capabilities?.hasPlatformAuthenticator 
                  ? `Sensor Biométrico Ativo (${capabilities.detectedPlatform})`
                  : 'API WebAuthn Pronta / Simulação FIDO2'}
              </span>
            </div>
            {hasCredential && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <Check className="w-2.5 h-2.5" />
                <span>Passkey Ativa</span>
              </div>
            )}
          </div>
        </div>

        {/* User Picker */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Conta para Acesso Biométrico
          </label>
          <select
            value={selectedUser?.id || ''}
            onChange={(e) => {
              const u = availableUsers.find(item => item.id === e.target.value);
              setSelectedUser(u || null);
              setScanState('idle');
              setErrorMessage(null);
            }}
            disabled={scanState === 'scanning' || scanState === 'success'}
            className={`w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-colors focus:outline-hidden ${
              isDarkMode 
                ? 'bg-[#0f0f13] border border-[#2e2e38] text-white focus:border-blue-500' 
                : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-blue-600'
            }`}
          >
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.email} ({u.role.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Method Toggle: Impressão Digital vs Face ID */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => { setMethod('fingerprint'); setScanState('idle'); }}
            disabled={scanState === 'scanning'}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
              method === 'fingerprint'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/30'
                : isDarkMode 
                  ? 'bg-[#1c1c22] border-[#2d2d38] text-zinc-400 hover:text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>Digital / Touch ID</span>
          </button>

          <button
            type="button"
            onClick={() => { setMethod('face'); setScanState('idle'); }}
            disabled={scanState === 'scanning'}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
              method === 'face'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/30'
                : isDarkMode 
                  ? 'bg-[#1c1c22] border-[#2d2d38] text-zinc-400 hover:text-white' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scan className="w-4 h-4" />
            <span>Face ID / Facial</span>
          </button>
        </div>

        {/* Interactive Biometric Sensor Touchpad Area */}
        <div className="flex flex-col items-center justify-center py-3 mb-3">
          <div 
            onClick={scanState === 'idle' ? handleStartScan : undefined}
            className={`relative w-28 h-28 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
              scanState === 'idle'
                ? isDarkMode
                  ? 'bg-[#1e1e26] border-2 border-blue-500/50 hover:border-blue-400 hover:scale-105 shadow-lg shadow-blue-950/40'
                  : 'bg-blue-50 border-2 border-blue-400 hover:border-blue-500 hover:scale-105 shadow-md shadow-blue-200/50'
                : scanState === 'scanning'
                  ? 'bg-blue-600/20 border-2 border-blue-400 animate-pulse scale-105 shadow-xl shadow-blue-500/30'
                  : scanState === 'success'
                    ? 'bg-emerald-500/20 border-2 border-emerald-400 scale-105 shadow-xl shadow-emerald-500/30'
                    : 'bg-rose-500/20 border-2 border-rose-400'
            }`}
            title="Toque no sensor para acionar o WebAuthn"
          >
            {/* Pulsing ring during scan */}
            {scanState === 'scanning' && (
              <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-60"></div>
            )}

            {scanState === 'idle' && (
              method === 'fingerprint' ? (
                <Fingerprint className="w-14 h-14 text-blue-500 animate-pulse" />
              ) : (
                <Scan className="w-14 h-14 text-blue-500 animate-pulse" />
              )
            )}

            {scanState === 'scanning' && (
              <div className="flex flex-col items-center justify-center">
                {method === 'fingerprint' ? (
                  <Fingerprint className="w-14 h-14 text-blue-400 animate-pulse" />
                ) : (
                  <Scan className="w-14 h-14 text-blue-400 animate-pulse" />
                )}
                <span className="absolute text-[10px] font-black uppercase text-blue-300 tracking-wider bottom-2">
                  Lendo...
                </span>
              </div>
            )}

            {scanState === 'success' && (
              <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-in zoom-in-75 duration-300" />
            )}

            {scanState === 'error' && (
              <AlertCircle className="w-14 h-14 text-rose-400 animate-in zoom-in-75" />
            )}
          </div>

          <div className="text-center mt-3 max-w-xs">
            {scanState === 'idle' && (
              <p className="text-xs font-semibold text-blue-400">
                Toque no sensor acima para autenticar com a biometria do dispositivo
              </p>
            )}
            {scanState === 'scanning' && (
              <div className="space-y-1">
                <p className="text-xs font-bold text-blue-300 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Validando desafio WebAuthn...</span>
                </p>
                {statusDetail && (
                  <p className="text-[11px] text-zinc-400 leading-tight">
                    {statusDetail}
                  </p>
                )}
              </div>
            )}
            {scanState === 'success' && (
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Biometria confirmada! Acessando sistema...</span>
                </p>
                {statusDetail && (
                  <p className="text-[10px] text-zinc-400">
                    {statusDetail}
                  </p>
                )}
              </div>
            )}
            {scanState === 'error' && (
              <div className="space-y-1">
                <p className="text-xs font-bold text-rose-400">
                  {errorMessage || 'Falha na leitura biométrica.'}
                </p>
                <button
                  type="button"
                  onClick={() => { setScanState('idle'); setErrorMessage(null); }}
                  className="text-[11px] text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Tentar novamente</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {scanState === 'idle' && (
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={handleStartScan}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Autenticar via WebAuthn do Dispositivo</span>
              </button>

              <button
                type="button"
                onClick={handleRegisterBiometric}
                disabled={isRegistering}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  isDarkMode 
                    ? 'bg-[#1c1c24] hover:bg-[#252530] text-zinc-300 border-[#2d2d38]' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
                title="Cadastrar chave biométrica deste dispositivo para esta conta"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                <span>{hasCredential ? 'Recadastrar Passkey no Hardware' : 'Cadastrar Biometria neste Dispositivo'}</span>
              </button>
            </div>
          )}

          {/* Security Notice */}
          <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/15 flex items-start gap-2.5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              A API de Web Authentication (WebAuthn/FIDO2) protege sua chave privada no Secure Enclave / TPM do seu dispositivo. Sua biometria nunca sai do aparelho.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
