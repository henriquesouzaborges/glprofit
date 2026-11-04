import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MessageSquare, 
  Phone, 
  Mail, 
  UserCheck, 
  DollarSign, 
  Download,
  Calendar,
  Share2
} from 'lucide-react';
import { Lead, LeadStage } from '../../../types';
import { formatCurrency, sendWhatsAppMessage } from '../../../utils';

interface CrmLeadsViewProps {
  leads: Lead[];
  onUpdateLeadStage: (leadId: string, newStage: LeadStage) => void;
  onAddLead: (lead: Lead) => void;
  onConvertLeadToStudent: (lead: Lead) => void;
  onOpenNewLeadModal: () => void;
  onOpenActivityModalForLead?: (lead: Lead) => void;
}

export const CrmLeadsView: React.FC<CrmLeadsViewProps> = ({
  leads,
  onUpdateLeadStage,
  onConvertLeadToStudent,
  onOpenNewLeadModal,
  onOpenActivityModalForLead
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('todos');
  const [selectedSource, setSelectedSource] = useState<string>('todas');

  // KPI Calculations
  const stats = useMemo(() => {
    const total = leads.length;
    const novos = leads.filter(l => l.stage === 'novo').length;
    const negociacao = leads.filter(l => l.stage === 'negociacao').length;
    const matriculados = leads.filter(l => l.stage === 'matriculado').length;
    const conversionRate = total > 0 ? ((matriculados / total) * 100).toFixed(1) : '0';
    const totalPipelineValue = leads.reduce((acc, l) => acc + (l.valueExpected || 119.90), 0);

    return { total, novos, negociacao, matriculados, conversionRate, totalPipelineValue };
  }, [leads]);

  // Unique sources
  const sources = useMemo(() => {
    const set = new Set<string>();
    leads.forEach(l => {
      if (l.source) set.add(l.source);
    });
    return Array.from(set);
  }, [leads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.interest.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStage = selectedStage === 'todos' || lead.stage === selectedStage;
      const matchSource = selectedSource === 'todas' || lead.source === selectedSource;

      return matchSearch && matchStage && matchSource;
    });
  }, [leads, searchTerm, selectedStage, selectedSource]);

  const getStageBadge = (stage: LeadStage) => {
    switch (stage) {
      case 'novo':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">Novo Lead</span>;
      case 'agendado':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">Aula Agendada</span>;
      case 'compareceu':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">Compareceu</span>;
      case 'negociacao':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-cyan-100 text-cyan-800 border border-cyan-200">Em Negociação</span>;
      case 'matriculado':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Matriculado</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-slate-100 text-slate-800">{stage}</span>;
    }
  };

  const handleExportCSV = () => {
    const headers = ["Nome", "Telefone", "E-mail", "Origem", "Interesse", "Estágio", "Valor Esperado", "Data Cadastro"];
    const rows = filteredLeads.map(l => [
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.source || 'Não especificado'}"`,
      `"${l.interest}"`,
      `"${l.stage}"`,
      `"${l.valueExpected || 119.90}"`,
      `"${l.createdAt}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_vbsport_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Total de Leads</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{stats.total}</div>
          <span className="text-2xs text-slate-500">Base comercial ativa</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Novos Leads</span>
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
          </div>
          <div className="text-xl font-bold text-blue-600">{stats.novos}</div>
          <span className="text-2xs text-slate-500">Aguardando 1º contato</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Em Negociação</span>
            <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
          </div>
          <div className="text-xl font-bold text-cyan-700">{stats.negociacao}</div>
          <span className="text-2xs text-slate-500">Propostas ativas</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Matrículas Fechadas</span>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-600">{stats.matriculados}</div>
          <span className="text-2xs font-semibold text-emerald-700">{stats.conversionRate}% conversão</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Pipeline Estimado</span>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">{formatCurrency(stats.totalPipelineValue)}</div>
          <span className="text-2xs text-slate-500">Potencial recorrente</span>
        </div>
      </div>

      {/* Action Bar & Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, telefone, e-mail ou modalidade de interesse..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:outline-hidden bg-slate-50/50"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Exportar dados para planilha"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              Exportar CSV
            </button>

            <button
              onClick={onOpenNewLeadModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="h-4 w-4" />
              Novo Lead
            </button>
          </div>
        </div>

        {/* Filter Badges / Dropdowns */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100 flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Etapa:</span>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-hidden"
            >
              <option value="todos">Todas as etapas ({leads.length})</option>
              <option value="novo">Novo Lead</option>
              <option value="agendado">Aula Agendada</option>
              <option value="compareceu">Compareceu</option>
              <option value="negociacao">Em Negociação</option>
              <option value="matriculado">Matriculado</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Origem do Lead:</span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-hidden"
            >
              <option value="todas">Todos os canais</option>
              {sources.map(src => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedStage !== 'todos' || selectedSource !== 'todas') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStage('todos');
                setSelectedSource('todas');
              }}
              className="text-2xs text-blue-600 hover:underline ml-auto font-medium"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider text-2xs">
                <th className="py-3 px-4">Lead / Contato</th>
                <th className="py-3 px-4">Interesse & Origem</th>
                <th className="py-3 px-4">Etapa do Funil</th>
                <th className="py-3 px-4">Valor Estimado</th>
                <th className="py-3 px-4">Cadastro & Contato</th>
                <th className="py-3 px-4">Consultor</th>
                <th className="py-3 px-4 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    <p className="text-sm font-medium">Nenhum lead encontrado com os filtros atuais.</p>
                    <p className="text-xs text-slate-400 mt-1">Tente ajustar a busca ou cadastre um novo lead.</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Nome & Contato */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {(lead.name || 'Lead').split(' ').filter(Boolean).map(n => n?.[0] || '').slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{lead.name}</div>
                          <div className="text-2xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span>{lead.phone}</span>
                            {lead.email && <span>• {lead.email}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Interesse & Origem */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{lead.interest}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          <Share2 className="h-2.5 w-2.5 text-slate-400" />
                          {lead.source || 'Direto'}
                        </span>
                      </div>
                    </td>

                    {/* Etapa */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {getStageBadge(lead.stage)}
                        <select
                          value={lead.stage}
                          onChange={(e) => onUpdateLeadStage(lead.id, e.target.value as LeadStage)}
                          className="text-2xs border border-slate-200 rounded px-1 py-0.5 bg-white text-slate-600 focus:outline-hidden"
                          title="Mudar etapa"
                        >
                          <option value="novo">Novo Lead</option>
                          <option value="agendado">Aula Agendada</option>
                          <option value="compareceu">Compareceu</option>
                          <option value="negociacao">Em Negociação</option>
                          <option value="matriculado">Matriculado</option>
                        </select>
                      </div>
                    </td>

                    {/* Valor Estimado */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(lead.valueExpected || 119.90)}
                      </span>
                      <span className="text-2xs text-slate-400 block">/mês recorrente</span>
                    </td>

                    {/* Cadastro & Último Contato */}
                    <td className="py-3 px-4 text-2xs text-slate-500">
                      <div>Criado: <span className="font-medium text-slate-700">{lead.createdAt}</span></div>
                      <div>Contato: <span className="font-medium text-slate-700">{lead.lastContact}</span></div>
                    </td>

                    {/* Consultor */}
                    <td className="py-3 px-4 text-2xs">
                      <span className="font-medium text-slate-700">{lead.assignedTo || 'Recepção VB'}</span>
                    </td>

                    {/* Ações */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp */}
                        <button
                          onClick={() => sendWhatsAppMessage(lead.phone, `Olá ${lead.name}! Sou da equipe GL PRO FIT. Como posso te ajudar hoje com seu plano de ${lead.interest}?`, lead.name)}
                          className="h-7 w-7 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                          title="Conversar no WhatsApp Interno"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                        </button>

                        {/* Ligar */}
                        <a
                          href={`tel:${lead.phone.replace(/\D/g, '')}`}
                          className="h-7 w-7 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center transition-colors"
                          title="Fazer ligação"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>

                        {/* Agendar Atividade */}
                        {onOpenActivityModalForLead && (
                          <button
                            onClick={() => onOpenActivityModalForLead(lead)}
                            className="h-7 w-7 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center justify-center transition-colors"
                            title="Agendar Atividade / Follow-up"
                          >
                            <Calendar className="h-3.5 w-3.5" />
                          </button>
                        )}

                        {/* Matricular */}
                        {lead.stage !== 'matriculado' ? (
                          <button
                            onClick={() => onConvertLeadToStudent(lead)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-2xs transition-colors shadow-2xs"
                            title="Converter para Aluno Matriculado"
                          >
                            <UserCheck className="h-3 w-3" />
                            Matricular
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-2xs text-emerald-700 font-medium px-2 py-0.5 bg-emerald-50 rounded">
                            Matriculado ✓
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-2xs text-slate-500">
          <span>Exibindo <strong>{filteredLeads.length}</strong> de <strong>{leads.length}</strong> leads cadastrados</span>
          <span>Integração de leads via WhatsApp, Facebook/Instagram Ads & Landing Page ativa</span>
        </div>
      </div>
    </div>
  );
};
