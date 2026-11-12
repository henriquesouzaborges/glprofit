import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  FileCheck2, 
  History, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Eye, 
  Cpu, 
  UserCheck, 
  Server,
  Download
} from 'lucide-react';
import { 
  getSecurityAuditLogs, 
  SecurityAuditLog 
} from '../../services/securityService';

interface SegurancaDadosModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const SegurancaDadosModal: React.FC<SegurancaDadosModalProps> = ({
  isOpen,
  onClose,
  isDarkMode
}) => {
  const [activeTab, setActiveTab] = useState<'lgpd' | 'logs' | 'encryption'>('lgpd');
  const [logs, setLogs] = useState<SecurityAuditLog[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLogs(getSecurityAuditLogs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 sm:pt-10 md:pt-12 pb-8 p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className={`w-full max-w-2xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl relative border overflow-hidden transition-all ${
        isDarkMode 
          ? 'bg-[#141418] border-[#2c2c36] text-white' 
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="p-5 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Segurança & Proteção de Dados</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LGPD Conforme
                </span>
              </h2>
              <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                Governança, Criptografia e Trilha de Auditoria do GL PRO FIT
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode ? 'hover:bg-[#202028] text-zinc-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-inherit px-5 bg-inherit text-xs font-semibold">
          <button
            onClick={() => setActiveTab('lgpd')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'lgpd'
                ? 'border-blue-500 text-blue-500 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Diretrizes LGPD & Privacidade</span>
          </button>

          <button
            onClick={() => setActiveTab('encryption')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'encryption'
                ? 'border-blue-500 text-blue-500 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Criptografia & Blindagem</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'border-blue-500 text-blue-500 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Trilha de Auditoria ({logs.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 custom-scrollbar text-xs">
          {activeTab === 'lgpd' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <h3 className="font-bold text-sm text-blue-400 mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018)
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  O ecossistema GL PRO FIT foi desenvolvido seguindo as diretrizes de Privacidade por Padrão (Privacy by Design). Os dados de alunos, colaboradores e gestores são protegidos com isolamento multi-tenant, criptografia de ponta a ponta e rígidos controles de permissão.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-inherit bg-blue-500/5">
                  <div className="font-bold text-blue-400 mb-1 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    Princípio da Finalidade & Necessidade
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Apenas os dados estritamente necessários para a execução dos treinos, avaliações físicas e controle financeiro são coletados e processados.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-inherit bg-emerald-500/5">
                  <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Direito de Portabilidade dos Dados
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    A plataforma conta com exportação manual integral em formato JSON na aba Configurações, garantindo que o administrador possa gerar backups integrais sob demanda.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-inherit bg-purple-500/5">
                  <div className="font-bold text-purple-400 mb-1 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" />
                    Controle de Acesso Baseado em Papéis (RBAC)
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    Professores, recepcionistas e administradores possuem perfis estritos de acesso. Dados sensíveis de faturamento são visíveis apenas para perfis autorizados.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-inherit bg-amber-500/5">
                  <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Prevenção contra Ataques de Força Bruta
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    O sistema limita 5 tentativas incorretas consecutivas de senha, acionando bloqueio temporário com contador regressivo e log de alerta de segurança.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'encryption' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-inherit bg-zinc-900/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    Criptografia em Trânsito (Data in Transit)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    TLS 1.3 / HTTPS
                  </span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Todas as requisições entre o navegador e o Firebase Firestore são transmitidas com cifras de alta segurança TLS 1.3 com criptografia assimétrica de 2048-bit.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-inherit bg-zinc-900/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    Criptografia em Repouso (Data at Rest)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    AES-256 Bit
                  </span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  O banco de dados provisionado na nuvem (Firestore) criptografa automaticamente todos os documentos, logs e tabelas com o padrão militar Advanced Encryption Standard de 256 bits antes de gravar no disco.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-inherit bg-zinc-900/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-purple-400" />
                    Regras de Segurança de Nuvem Ativas
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    firestore.rules ativas
                  </span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  As regras de segurança (firestore.rules) foram compiladas e implantadas no projeto, validando schemas, IDs e restrições de permissão do backend.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-inherit bg-zinc-900/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    WebAuthn / FIDO2 (Biometria no Hardware)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    W3C Standard / Passkeys
                  </span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  A autenticação biométrica utiliza a API nativa de Web Authentication (WebAuthn). Os pares de chaves pública/privada são gerados e mantidos no enclave seguro do hardware do usuário (Secure Enclave / TPM / Android Keystore), garantindo imunidade a ataques de interceptação e phishing.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-[11px] mb-1">
                <span>Registros Recentes de Eventos de Segurança:</span>
                <span>Armazenados localmente & Firebase Audit</span>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  Nenhum evento crítico registrado nesta sessão.
                </div>
              ) : (
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div 
                      key={log.id}
                      className={`p-2.5 rounded-xl border flex items-start justify-between gap-3 ${
                        log.status === 'danger'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : log.status === 'warning'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : isDarkMode ? 'bg-[#18181f] border-[#2b2b36]' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase ${
                            log.status === 'danger' ? 'bg-rose-500 text-white' :
                            log.status === 'warning' ? 'bg-amber-500 text-black' : 'bg-blue-600 text-white'
                          }`}>
                            {log.eventType}
                          </span>
                          <span className="text-xs font-bold text-white truncate">
                            {log.userEmail}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                          {log.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-inherit flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>GL PRO FIT • Segurança & Governança Corporativa</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
