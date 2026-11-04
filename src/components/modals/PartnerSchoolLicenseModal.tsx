import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Phone, 
  Mail, 
  MessageCircle, 
  Plus, 
  Trash2, 
  Save, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ToggleLeft, 
  ToggleRight,
  ExternalLink
} from 'lucide-react';
import { 
  PartnerSchoolLicense, 
  getPartnerSchoolLicenses, 
  savePartnerSchoolLicenses, 
  calculateContractCountdown, 
  buildRenewalWhatsAppUrl 
} from '../../services/partnerSchoolLicenseService';

interface PartnerSchoolLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewSchoolId: string | null;
  onTogglePreviewSchool: (schoolId: string | null) => void;
}

export const PartnerSchoolLicenseModal: React.FC<PartnerSchoolLicenseModalProps> = ({
  isOpen,
  onClose,
  previewSchoolId,
  onTogglePreviewSchool
}) => {
  const [licenses, setLicenses] = useState<PartnerSchoolLicense[]>(() => getPartnerSchoolLicenses());
  const [editingLicense, setEditingLicense] = useState<PartnerSchoolLicense | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Formulário para nova escola
  const [newSchool, setNewSchool] = useState<Partial<PartnerSchoolLicense>>({
    schoolName: '',
    contactName: '',
    email: '',
    phone: '',
    loginUsername: '',
    planName: 'Licença Gestão Completa (Até 500 alunos)',
    planPrice: 299.00,
    expirationDate: '2026-11-30',
    isWarningBannerActive: true,
    customWarningMessage: 'Evite a suspensão do acesso à catraca e app do aluno.',
    status: 'ativa',
    pixKey: 'marinho.gianluca@gmail.com',
    notes: ''
  });

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleWarning = (id: string) => {
    const updated = licenses.map(lic => {
      if (lic.id === id) {
        const nextState = !lic.isWarningBannerActive;
        return { ...lic, isWarningBannerActive: nextState };
      }
      return lic;
    });
    setLicenses(updated);
    savePartnerSchoolLicenses(updated);
    showToast('Status do aviso de contrato atualizado com sucesso!');
  };

  const handleUpdateExpiration = (id: string, newDate: string) => {
    const updated = licenses.map(lic => {
      if (lic.id === id) {
        return { ...lic, expirationDate: newDate };
      }
      return lic;
    });
    setLicenses(updated);
    savePartnerSchoolLicenses(updated);
    showToast('Data de vencimento salva com sucesso!');
  };

  const handleSaveEdit = () => {
    if (!editingLicense) return;
    const updated = licenses.map(lic => lic.id === editingLicense.id ? editingLicense : lic);
    setLicenses(updated);
    savePartnerSchoolLicenses(updated);
    setEditingLicense(null);
    showToast('Dados da escola parceira atualizados!');
  };

  const handleAddNewSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchool.schoolName || !newSchool.email) {
      alert('Preencha o nome da escola e o e-mail de contato.');
      return;
    }
    const created: PartnerSchoolLicense = {
      id: `lic-${Date.now()}`,
      schoolName: newSchool.schoolName || '',
      contactName: newSchool.contactName || '',
      email: newSchool.email || '',
      phone: newSchool.phone || '',
      loginUsername: newSchool.loginUsername || newSchool.email || '',
      planName: newSchool.planName || 'Licença Gestão Completa',
      planPrice: Number(newSchool.planPrice) || 299,
      expirationDate: newSchool.expirationDate || '2026-11-30',
      isWarningBannerActive: !!newSchool.isWarningBannerActive,
      customWarningMessage: newSchool.customWarningMessage || 'Evite perder os benefícios do sistema.',
      status: (newSchool.status as any) || 'ativa',
      pixKey: newSchool.pixKey || 'marinho.gianluca@gmail.com',
      notes: newSchool.notes || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [created, ...licenses];
    setLicenses(updated);
    savePartnerSchoolLicenses(updated);
    setIsAddingNew(false);
    showToast(`Escola "${created.schoolName}" cadastrada com sucesso!`);
  };

  const handleDeleteLicense = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja remover a escola parceira "${name}"?`)) {
      const updated = licenses.filter(l => l.id !== id);
      setLicenses(updated);
      savePartnerSchoolLicenses(updated);
      if (previewSchoolId === id) {
        onTogglePreviewSchool(null);
      }
      showToast('Escola parceira removida.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header com Identificação Master */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-white">
                Gestão de Licenças & Contratos de Escolas Parceiras
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Configure as datas de renovação e ative o banner de contrato exclusivo para as escolas terceirizadas para as quais você vende o sistema.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informação para o Administrador */}
        <div className="bg-blue-50/80 border-b border-blue-100 px-6 py-3 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Perfil Administrador Master:</strong> O card de contrato e botão de renovar <strong>NUNCA</strong> é exibido para o seu login. Ele só aparece para os perfis das escolas parceiras listadas abaixo.
            </span>
          </div>

          <button
            onClick={() => setIsAddingNew(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Escola Parceira</span>
          </button>
        </div>

        {/* Toast Notificação */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Conteúdo com Scroll */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Modal / Formulário de Cadastro de Nova Escola */}
          {isAddingNew && (
            <form onSubmit={handleAddNewSchool} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Cadastrar Escola Parceira Terceirizada
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nome da Escola / Academia</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Escola de Natação Golfinho"
                    value={newSchool.schoolName}
                    onChange={e => setNewSchool({ ...newSchool, schoolName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nome do Gestor / Responsável</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Prof. Marcos Silva"
                    value={newSchool.contactName}
                    onChange={e => setNewSchool({ ...newSchool, contactName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">E-mail de Contato / Login</label>
                  <input
                    type="email"
                    required
                    placeholder="contato@escola.com.br"
                    value={newSchool.email}
                    onChange={e => setNewSchool({ ...newSchool, email: e.target.value, loginUsername: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={newSchool.phone}
                    onChange={e => setNewSchool({ ...newSchool, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Data de Vencimento do Contrato</label>
                  <input
                    type="date"
                    required
                    value={newSchool.expirationDate}
                    onChange={e => setNewSchool({ ...newSchool, expirationDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Valor da Assinatura / Mês (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSchool.planPrice}
                    onChange={e => setNewSchool({ ...newSchool, planPrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={newSchool.isWarningBannerActive}
                    onChange={e => setNewSchool({ ...newSchool, isWarningBannerActive: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Ativar o card "Seu contrato vence em..." para este perfil</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          )}

          {/* Lista de Escolas Parceiras */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center justify-between">
              <span>Escolas Parceiras Cadastradas ({licenses.length})</span>
              <span className="text-[11px] font-normal text-slate-400">
                Ative ou desative o aviso para cada parceiro individualmente
              </span>
            </h4>

            {licenses.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                Nenhuma escola parceira cadastrada. Clique em "Nova Escola Parceira" para adicionar.
              </div>
            ) : (
              <div className="space-y-3">
                {licenses.map(lic => {
                  const countdown = calculateContractCountdown(lic.expirationDate);
                  const isPreviewing = previewSchoolId === lic.id;

                  return (
                    <div
                      key={lic.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isPreviewing
                          ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30'
                          : lic.isWarningBannerActive 
                          ? 'border-amber-200 bg-amber-50/20' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        
                        {/* Info Principal */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-sm text-slate-900">
                              {lic.schoolName}
                            </span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              countdown.isExpired ? 'bg-red-100 text-red-800' :
                              countdown.isUrgent ? 'bg-amber-100 text-amber-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {countdown.isExpired ? 'Expirada' : `${countdown.days} dias restantes`}
                            </span>
                            {lic.isWarningBannerActive ? (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                                Banner Ativo
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                Banner Oculto
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                            <span>Gestor: <strong>{lic.contactName}</strong></span>
                            <span>•</span>
                            <span>Login: <code className="text-blue-800 font-mono bg-blue-50 px-1.5 py-0.5 rounded">{lic.email}</code></span>
                            <span>•</span>
                            <span>Valor: <strong>R$ {lic.planPrice.toFixed(2).replace('.', ',')}/mês</strong></span>
                          </div>
                        </div>

                        {/* Configuração de Vencimento & Interruptor */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                          
                          {/* Data de Vencimento rápida */}
                          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-500 font-semibold">Vencimento:</span>
                            <input
                              type="date"
                              value={lic.expirationDate}
                              onChange={e => handleUpdateExpiration(lic.id, e.target.value)}
                              className="font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                              title="Alterar data de vencimento desta escola"
                            />
                          </div>

                          {/* Botão de Toggle do Banner */}
                          <button
                            type="button"
                            onClick={() => handleToggleWarning(lic.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                              lic.isWarningBannerActive
                                ? 'bg-red-600 text-white border-red-700 shadow-xs'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            }`}
                            title={lic.isWarningBannerActive ? 'Desativar aviso no login da escola' : 'Ativar aviso no login da escola'}
                          >
                            {lic.isWarningBannerActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            <span>{lic.isWarningBannerActive ? 'Aviso Ativo' : 'Ativar Aviso'}</span>
                          </button>

                          {/* Botão WhatsApp */}
                          <a
                            href={buildRenewalWhatsAppUrl(lic)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-xs cursor-pointer"
                            title="Enviar cobrança / aviso no WhatsApp do gestor"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* Testar Simulação de Visualização */}
                          <button
                            type="button"
                            onClick={() => onTogglePreviewSchool(isPreviewing ? null : lic.id)}
                            className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                              isPreviewing
                                ? 'bg-blue-600 text-white border-blue-700'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                            title={isPreviewing ? 'Encerrar pré-visualização' : 'Simular como esta escola parceira enxerga o Início'}
                          >
                            {isPreviewing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>

                          {/* Excluir */}
                          <button
                            type="button"
                            onClick={() => handleDeleteLicense(lic.id, lic.schoolName)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remover parceiro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Rodapé com Fechamento */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            As alterações têm efeito imediato nos logins correspondentes das escolas parceiras.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            Concluir
          </button>
        </div>

      </div>
    </div>
  );
};
