import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Link2,
  Copy,
  Check,
  Building2,
  Send,
  Mail,
  MessageSquare,
  UserPlus,
  Clock,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import {
  EmpresaCliente,
  Plan,
  StudentRegistrationInvite,
  SystemUser
} from '../../types';
import {
  buildStudentRegistrationUrl,
  createStudentRegistrationInvite,
  getStoredStudentInvites,
  isCompanyScopedUser,
  isLegacyPlaceholderCompanyName,
  MATRIX_UNIT_COMPANY_ID,
  resolveActiveEmpresaForUser
} from '../../services/studentInviteService';
import { where } from 'firebase/firestore';
import { subscribeToFirestoreCollection, auth } from '../../services/firebaseDbService';

interface EnviarLinkCadastroModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: SystemUser | null;
  empresasClientes?: EmpresaCliente[];
  plans?: Plan[];
  gymName?: string;
  preselectedEmpresaId?: string;
  onOpenCadastroPreview?: (url: string) => void;
}

export const EnviarLinkCadastroModal: React.FC<EnviarLinkCadastroModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  empresasClientes = [],
  plans = [],
  gymName,
  preselectedEmpresaId,
  onOpenCadastroPreview
}) => {
  const companyLocked = isCompanyScopedUser(currentUser, empresasClientes);
  const resolvedContext = useMemo(
    () => resolveActiveEmpresaForUser(currentUser, empresasClientes, gymName),
    [currentUser, empresasClientes, gymName]
  );

  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>(
    preselectedEmpresaId || resolvedContext.id
  );
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');

  const [generatedInvite, setGeneratedInvite] = useState<StudentRegistrationInvite | null>(null);
  const [copied, setCopied] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [invitesHistory, setInvitesHistory] = useState<StudentRegistrationInvite[]>(() =>
    getStoredStudentInvites()
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedEmpresaId(preselectedEmpresaId || resolvedContext.id);
      setGeneratedInvite(null);
      setCopied(false);
      setStatusFeedback(null);
      setInvitesHistory(getStoredStudentInvites());
    }
  }, [isOpen, preselectedEmpresaId, resolvedContext.id]);

  useEffect(() => {
    if (!isOpen || !auth?.currentUser) return;
    const constraints = companyLocked && resolvedContext.id
      ? [where('companyId', '==', resolvedContext.id)]
      : undefined;
    const unsub = subscribeToFirestoreCollection<StudentRegistrationInvite>(
      'student_invites',
      (remote) => {
        if (remote && remote.length > 0) {
          setInvitesHistory(prev => {
            const map = new Map<string, StudentRegistrationInvite>();
            [...remote, ...prev].forEach(inv => {
              if (inv?.id) map.set(inv.id, inv);
            });
            return Array.from(map.values()).sort((a, b) =>
              (b.createdAt || '').localeCompare(a.createdAt || '')
            );
          });
        }
      },
      undefined,
      undefined,
      constraints
    );
    return () => unsub();
  }, [isOpen, companyLocked, resolvedContext.id]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const safeMainCompanyName =
    gymName && gymName.trim() && !isLegacyPlaceholderCompanyName(gymName)
      ? gymName.trim()
      : 'GL PRO FIT';

  const activeCompany = useMemo(() => {
    if (companyLocked) return resolvedContext;
    if (selectedEmpresaId === MATRIX_UNIT_COMPANY_ID) {
      return {
        id: MATRIX_UNIT_COMPANY_ID,
        name: safeMainCompanyName,
        email: currentUser?.email,
        isMatrix: true as const
      };
    }
    const found = empresasClientes.find(e => e.id === selectedEmpresaId);
    if (found) {
      return {
        id: found.id,
        name: found.name,
        email: found.email,
        logoUrl: found.logoUrl,
        isMatrix: false as const,
        empresaRecord: found
      };
    }
    return resolvedContext;
  }, [companyLocked, resolvedContext, selectedEmpresaId, empresasClientes, gymName, currentUser]);

  const companyInvites = useMemo(() => {
    return invitesHistory
      .filter(inv => inv.empresaId === activeCompany.id)
      .slice(0, 6);
  }, [invitesHistory, activeCompany.id]);

  if (!isOpen) return null;

  const handleGenerateInvite = async (e?: React.FormEvent): Promise<StudentRegistrationInvite> => {
    if (e) e.preventDefault();
    const inviteId = `inv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const chosenPlan = plans.find(p => p.id === selectedPlanId);

    const registrationUrl = buildStudentRegistrationUrl({
      inviteId,
      empresaId: activeCompany.id,
      empresaName: activeCompany.name,
      invitedByUserId: currentUser?.id,
      studentName: studentName.trim() || undefined,
      studentEmail: studentEmail.trim().toLowerCase() || undefined
    });

    const newInvite: StudentRegistrationInvite = {
      id: inviteId,
      empresaId: activeCompany.id,
      empresaName: activeCompany.name,
      empresaEmail: activeCompany.email,
      empresaLogoUrl: activeCompany.logoUrl,
      invitedByUserId: currentUser?.id || 'admin-master-01',
      invitedByName: currentUser?.name || 'Administrador',
      invitedByEmail: currentUser?.email || 'glprofit.adm@gmail.com',
      studentName: studentName.trim() || undefined,
      studentEmail: studentEmail.trim().toLowerCase() || undefined,
      studentPhone: studentPhone.trim() || undefined,
      suggestedPlanId: chosenPlan?.id,
      suggestedPlanName: chosenPlan?.name,
      registrationUrl,
      status: 'pendente',
      createdAt: new Date().toISOString()
    };

    await createStudentRegistrationInvite(newInvite);
    setGeneratedInvite(newInvite);
    setInvitesHistory(prev => [newInvite, ...prev.filter(i => i.id !== newInvite.id)]);
    setCopied(false);
    setStatusFeedback(`Link gerado e vinculado à empresa "${activeCompany.name}".`);
    return newInvite;
  };

  const handleCopyLink = async (urlToCopy?: string) => {
    let invite = generatedInvite;
    if (!urlToCopy && !invite) {
      invite = await handleGenerateInvite();
    }
    const targetUrl = urlToCopy || invite?.registrationUrl || '';
    if (!targetUrl) return;
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setStatusFeedback('Link de cadastro copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setStatusFeedback('Selecione e copie o link exibido abaixo.');
    }
  };

  const handleSendWhatsApp = async () => {
    const invite = generatedInvite || (await handleGenerateInvite());
    const greetingName = studentName.trim() ? ` ${studentName.trim()}` : '';
    const message = `Olá${greetingName}! 👋\n\nA *${activeCompany.name}* convida você para concluir seu cadastro de aluno no portal GL PRO FIT.\n\nAcesse o link exclusivo abaixo para criar sua conta e vincular sua matrícula automaticamente à nossa empresa:\n${invite.registrationUrl}`;

    if (studentPhone.trim()) {
      window.dispatchEvent(
        new CustomEvent('gl_pro_fit_open_whatsapp', {
          detail: {
            phone: studentPhone.trim(),
            text: message,
            contactName: studentName.trim() || 'Novo Aluno'
          }
        })
      );
      onClose();
    } else {
      try {
        await navigator.clipboard.writeText(message);
        setStatusFeedback('Convite com mensagem formatada copiado! Cole no WhatsApp do aluno.');
      } catch {
        setStatusFeedback('Link pronto! Informe o WhatsApp ou copie o link acima.');
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-6 sm:pt-10 md:pt-12 pb-8 p-3 sm:p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden mb-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Enviar Link de Cadastro para o Aluno
              </h2>
              <p className="text-xs text-slate-500">
                Ao concluir o cadastro pelo link, o e-mail e o ID do aluno são vinculados automaticamente à empresa remetente.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleGenerateInvite} className="p-6 space-y-5">
          {/* Empresa Vinculada Banner */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Empresa Responsável pelo Vínculo</span>
              </div>
              <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                {companyLocked ? 'Perfil da Empresa' : 'Vínculo Automático'}
              </span>
            </div>

            {companyLocked || empresasClientes.length === 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between rounded-lg bg-white border border-blue-200/80 px-3.5 py-2.5">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{activeCompany.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      ID: {activeCompany.id} {activeCompany.email ? `• ${activeCompany.email}` : ''}
                    </div>
                  </div>
                  <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
                </div>
                {!companyLocked && (
                  <p className="text-[11px] text-blue-700">
                    Vínculo atribuído à empresa cadastrada em <strong>Configurações → Geral</strong>. Empresas B2B cadastradas em <strong>Empresas Clientes</strong> também aparecem aqui para seleção.
                  </p>
                )}
              </div>
            ) : (
              <div>
                <select
                  value={selectedEmpresaId}
                  onChange={(e) => {
                    setSelectedEmpresaId(e.target.value);
                    setGeneratedInvite(null);
                  }}
                  className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                >
                  <option value={MATRIX_UNIT_COMPANY_ID}>
                    {safeMainCompanyName} — Unidade Principal
                  </option>
                  {empresasClientes.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} (CNPJ: {emp.cnpj})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-blue-700 mt-1.5">
                  Todo aluno que preencher o cadastro por este link terá seu e-mail e User ID vinculados automaticamente a <strong>{activeCompany.name}</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Pre-fill fields (optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do Aluno (opcional)
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Pré-preencher nome no link"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail do Aluno (opcional)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="aluno@exemplo.com"
                  className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
                />
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp do Aluno (opcional)
              </label>
              <input
                type="tel"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="(11) 99999-0000"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Plano Sugerido (opcional)
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-white focus:border-blue-500 focus:outline-hidden"
              >
                <option value="">O aluno escolhe na matrícula</option>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generated Link Box */}
          {generatedInvite && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Link Exclusivo Gerado ({activeCompany.name})
                </span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {generatedInvite.id}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedInvite.registrationUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="flex-1 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-[11px] font-mono text-slate-700 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleCopyLink(generatedInvite.registrationUrl)}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white transition-colors shrink-0 cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {onOpenCadastroPreview && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-emerald-800">
                    Deseja testar o formulário que o aluno verá?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCadastroPreview(generatedInvite.registrationUrl);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Abrir Tela de Cadastro</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {statusFeedback && (
            <div className="rounded-lg bg-slate-900 text-white px-3.5 py-2 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{statusFeedback}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            >
              <Link2 className="h-4 w-4" />
              <span>{generatedInvite ? 'Gerar Novo Link' : 'Gerar Link de Cadastro'}</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyLink()}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
                <span>Copiar Link</span>
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Enviar por WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Recent Invites History for this Company */}
          {companyInvites.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Links Recentes — {activeCompany.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  {companyInvites.filter(i => i.status === 'concluido').length} concluído(s)
                </span>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {companyInvites.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 py-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 truncate flex items-center gap-1.5">
                        <UserPlus className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{inv.registeredEmail || inv.studentName || inv.studentEmail || 'Link aberto (qualquer aluno)'}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {inv.status === 'concluido' && inv.registeredUserId
                          ? `UID vinculado: ${inv.registeredUserId}`
                          : `Criado em ${new Date(inv.createdAt).toLocaleDateString('pt-BR')}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          inv.status === 'concluido'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {inv.status === 'concluido' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {inv.status === 'concluido' ? 'Vinculado' : 'Aguardando'}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(inv.registrationUrl)}
                        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:text-blue-600 cursor-pointer"
                        title="Copiar este link"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
