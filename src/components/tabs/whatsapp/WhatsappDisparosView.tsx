import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Send,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  Eye,
  MessageSquare,
  Sparkles,
  Sliders,
  CheckCheck
} from 'lucide-react';
import { WhatsappCampaign } from '../../../types';

interface WhatsappDisparosViewProps {
  campaigns: WhatsappCampaign[];
  onCreateCampaign: (campaign: WhatsappCampaign) => void;
  onTriggerCampaign: (campaignId: string) => void;
}

export const WhatsappDisparosView: React.FC<WhatsappDisparosViewProps> = ({
  campaigns,
  onCreateCampaign,
  onTriggerCampaign
}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [audience, setAudience] = useState('Alunos Inadimplentes com mensalidade vencida');
  const [messageText, setMessageText] = useState(
    'Olá {{nome}}! Sentimos sua falta nos treinos da VB SPORT. Preparamos uma condição especial para sua volta: 1 avaliação física com bioimpedância grátis! Responda SIM para agendar.'
  );
  const [delaySec, setDelaySec] = useState(25);
  const [testNumber, setTestNumber] = useState('+55 (11) 98765-4321');

  const handleAddVariable = (variable: string) => {
    setMessageText(prev => prev + ' ' + variable);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !messageText.trim()) return;

    const newCamp: WhatsappCampaign = {
      id: `camp-${Date.now()}`,
      name: name.trim(),
      targetAudience: audience,
      message: messageText.trim(),
      status: 'ativa',
      totalRecipients: audience.includes('Inadimplentes') ? 38 : audience.includes('Inativos') ? 75 : 120,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      repliedCount: 0,
      createdAt: 'Hoje',
      antiBanDelaySeconds: delaySec
    };

    onCreateCampaign(newCamp);
    setShowModal(false);
    setName('');
  };

  return (
    <div className="space-y-5">
      {/* Header & Anti-ban explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Disparador em Massa & Campanhas (Broadcast)</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-3 w-3" /> Sistema Anti-Bloqueio Ativo
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Envie comunicados, avisos de vencimento, resgate de alunos e promoções com intervalo inteligente.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          Nova Campanha de Disparo
        </button>
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-900 leading-relaxed">
        <ShieldCheck className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <strong>Proteção do Número VB SPORT:</strong> O disparador inteligente utiliza tecnologia de rotação e delay randômico (intervalo de 15 a 45 segundos entre disparos), garantindo 100% de conformidade com as diretrizes da Meta e prevenindo bloqueios do WhatsApp comercial.
        </div>
      </div>

      {/* Campaigns Cards List */}
      <div className="space-y-3">
        {campaigns.map((camp) => {
          const sentPct = camp.totalRecipients > 0 ? Math.round((camp.sentCount / camp.totalRecipients) * 100) : 0;
          const readPct = camp.sentCount > 0 ? Math.round((camp.readCount / camp.sentCount) * 100) : 0;

          return (
            <div
              key={camp.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900">{camp.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      camp.status === 'ativa'
                        ? 'bg-emerald-100 text-emerald-800'
                        : camp.status === 'concluida'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {camp.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>Público: <strong>{camp.targetAudience}</strong></span>
                    <span>•</span>
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Delay Anti-Ban: <strong>{camp.antiBanDelaySeconds}s</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {camp.sentCount < camp.totalRecipients ? (
                    <button
                      onClick={() => onTriggerCampaign(camp.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-colors"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      Disparar Agora
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Disparado 100%
                    </span>
                  )}
                </div>
              </div>

              {/* Message preview snippet */}
              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                "{camp.message}"
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Total Destinatários</span>
                  <span className="font-bold text-slate-900">{camp.totalRecipients} contatos</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Enviadas & Entregues</span>
                  <span className="font-bold text-blue-700">{camp.sentCount} ({sentPct}%)</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Lidas pelo Aluno</span>
                  <span className="font-bold text-emerald-700">{camp.readCount} ({readPct}%)</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="text-[10px] text-slate-400 block">Respostas Geradas</span>
                  <span className="font-bold text-purple-700">{camp.repliedCount} respostas</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: New Campaign */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Criar Campanha de Disparo em Massa</h3>
            <p className="text-xs text-slate-500 mb-4">Configure o público e a mensagem para envio automático</p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome da Campanha *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Campanha Black VIP - Resgate de Inadimplentes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Público-Alvo Segmentado</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="Alunos Inadimplentes com mensalidade vencida">Alunos Inadimplentes (Débito em aberto)</option>
                  <option value="Alunos Inativos sem treinar há mais de 15 dias">Alunos Inativos (Sem frequência &gt; 15 dias)</option>
                  <option value="Todos os Alunos Ativos">Todos os Alunos Ativos (Comunicados gerais)</option>
                  <option value="Leads que fizeram aula experimental e não matricularam">Leads de Aula Experimental (Follow-up de Vendas)</option>
                  <option value="Aniversariantes do Mês">Aniversariantes do Mês (Parabéns e cortesia)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Mensagem do WhatsApp *</label>
                  <span className="text-[11px] text-slate-400">Variáveis dinâmicas:</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => handleAddVariable('{{nome}}')}
                    className="rounded bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] font-mono text-slate-700"
                  >
                    + {'{{nome}}'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddVariable('{{plano}}')}
                    className="rounded bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] font-mono text-slate-700"
                  >
                    + {'{{plano}}'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddVariable('{{link_pay}}')}
                    className="rounded bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] font-mono text-slate-700"
                  >
                    + {'{{link_pay}}'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddVariable('{{chave_pix}}')}
                    className="rounded bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] font-mono text-slate-700"
                  >
                    + {'{{chave_pix}}'}
                  </button>
                </div>

                <textarea
                  rows={4}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Delay Anti-ban */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-slate-500" />
                    Intervalo Anti-Ban (Delay entre envios)
                  </label>
                  <span className="font-bold text-blue-700">{delaySec} segundos</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={delaySec}
                  onChange={(e) => setDelaySec(Number(e.target.value))}
                  className="w-full accent-blue-700"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Recomendado: 20s a 35s para números comerciais consolidados.
                </p>
              </div>

              {/* Preview bubble */}
              <div className="p-3 bg-[#efeae2]/40 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Pré-visualização no celular do aluno
                </span>
                <div className="bg-white p-3 rounded-lg shadow-2xs border border-slate-200 text-xs text-slate-900 whitespace-pre-line max-w-sm">
                  {messageText.replace('{{nome}}', 'Carlos').replace('{{plano}}', 'Plano Black VIP').replace('{{link_pay}}', 'https://pay.vbsport.com.br/fatura-1234')}
                  <div className="flex justify-end gap-1 text-[10px] text-slate-400 mt-1">
                    <span>11:45</span>
                    <CheckCheck className="h-3.5 w-3.5 text-sky-500" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-500 shadow-xs"
                >
                  Salvar & Agendar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
