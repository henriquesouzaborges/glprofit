import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Settings, 
  Users, 
  DollarSign, 
  Search, 
  Sliders, 
  Lock, 
  Unlock, 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  Activity,
  Layers
} from 'lucide-react';
import { EmpresaCliente, EmpresasClientesSubTab, TabType } from '../../types';
import { formatCurrency, formatDate } from '../../utils';

interface EmpresasClientesTabProps {
  subTab: EmpresasClientesSubTab;
  onSubTabChange: (sub: EmpresasClientesSubTab) => void;
  empresas: EmpresaCliente[];
  onAddEmpresa: (empresa: EmpresaCliente) => void;
  onUpdateEmpresa: (empresa: EmpresaCliente) => void;
  onDeleteEmpresa: (id: string) => void;
}

const ALL_MODULES: { id: TabType; label: string; category: string }[] = [
  { id: 'inicio', label: 'Início & Visão Geral', category: 'Geral' },
  { id: 'dashboards', label: 'Dashboards & BI', category: 'Gestão' },
  { id: 'clientes', label: 'Gestão de Clientes / Alunos', category: 'Operacional' },
  { id: 'professores', label: 'Professores & Folha de Ponto', category: 'Equipe' },
  { id: 'crm', label: 'CRM & Funil de Vendas', category: 'Comercial' },
  { id: 'agenda', label: 'Agenda & Turmas', category: 'Operacional' },
  { id: 'whatsapp', label: 'WhatsApp & Atendimento', category: 'Comercial' },
  { id: 'pay', label: 'GL Profit Pay (Recorrência)', category: 'Financeiro' },
  { id: 'financeiro', label: 'Financeiro & DRE', category: 'Financeiro' },
  { id: 'vendas', label: 'Vendas & PDV', category: 'Financeiro' },
  { id: 'estoque', label: 'Controle de Estoque', category: 'Operacional' },
  { id: 'comandas', label: 'Lanchonete da Empresa', category: 'Operacional' },
  { id: 'treino', label: 'Prescrição de Treinos', category: 'Técnico' },
  { id: 'bem_estar', label: 'Bem-Estar & Prontidão', category: 'Técnico' },
  { id: 'avaliacoes', label: 'Avaliações Físicas', category: 'Técnico' },
  { id: 'nutricao', label: 'Nutrição & Dietas', category: 'Técnico' },
  { id: 'relatorios', label: 'Relatórios Executivos', category: 'Gestão' }
];

export const INITIAL_EMPRESAS_CLIENTES: EmpresaCliente[] = [];

export const EmpresasClientesTab: React.FC<EmpresasClientesTabProps> = ({
  subTab,
  onSubTabChange,
  empresas,
  onAddEmpresa,
  onUpdateEmpresa,
  onDeleteEmpresa
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<EmpresaCliente | null>(null);
  const [managingModulesEmpresa, setManagingModulesEmpresa] = useState<EmpresaCliente | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Form State for New / Edit Empresa
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    ownerName: '',
    email: '',
    phone: '',
    planName: 'Plano Pro Box',
    monthlyValue: 890.00,
    maxUsers: 25,
    dueDate: new Date().toISOString().slice(0, 10),
    notes: ''
  });

  const handleOpenNew = () => {
    setFormData({
      name: '',
      cnpj: '',
      ownerName: '',
      email: '',
      phone: '',
      planName: 'Plano Pro Box',
      monthlyValue: 890.00,
      maxUsers: 25,
      dueDate: new Date().toISOString().slice(0, 10),
      notes: ''
    });
    setEditingEmpresa(null);
    setShowNewModal(true);
  };

  const handleOpenEdit = (emp: EmpresaCliente) => {
    setEditingEmpresa(emp);
    setFormData({
      name: emp.name,
      cnpj: emp.cnpj,
      ownerName: emp.ownerName,
      email: emp.email,
      phone: emp.phone,
      planName: emp.planName,
      monthlyValue: emp.monthlyValue,
      maxUsers: emp.maxUsers,
      dueDate: emp.dueDate,
      notes: emp.notes || ''
    });
    setShowNewModal(true);
  };

  const handleSaveEmpresa = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmpresa) {
      const updated: EmpresaCliente = {
        ...editingEmpresa,
        name: formData.name,
        cnpj: formData.cnpj,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        planName: formData.planName,
        monthlyValue: Number(formData.monthlyValue) || 0,
        maxUsers: Number(formData.maxUsers) || 10,
        dueDate: formData.dueDate,
        notes: formData.notes
      };
      onUpdateEmpresa(updated);
      showToast(`Empresa "${updated.name}" atualizada com sucesso!`);
    } else {
      const newEmp: EmpresaCliente = {
        id: `emp-${Date.now()}`,
        name: formData.name,
        cnpj: formData.cnpj,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        planName: formData.planName,
        monthlyValue: Number(formData.monthlyValue) || 0,
        status: 'ativo',
        dueDate: formData.dueDate,
        activatedAt: new Date().toISOString().slice(0, 10),
        allowedModules: ['inicio', 'clientes', 'agenda', 'financeiro', 'treino', 'relatorios'],
        maxUsers: Number(formData.maxUsers) || 25,
        notes: formData.notes
      };
      onAddEmpresa(newEmp);
      showToast(`Empresa "${newEmp.name}" cadastrada com sucesso!`);
    }
    setShowNewModal(false);
  };

  const toggleEmpresaStatus = (emp: EmpresaCliente) => {
    const nextStatus = emp.status === 'ativo' ? 'bloqueado' : 'ativo';
    onUpdateEmpresa({ ...emp, status: nextStatus });
    showToast(`Empresa ${emp.name} foi ${nextStatus === 'ativo' ? 'ativada' : 'bloqueada'}.`);
  };

  const toggleModuleForEmpresa = (emp: EmpresaCliente, moduleId: TabType) => {
    const current = emp.allowedModules || [];
    const exists = current.includes(moduleId);
    const updatedModules = exists 
      ? current.filter(m => m !== moduleId)
      : [...current, moduleId];

    const updated: EmpresaCliente = {
      ...emp,
      allowedModules: updatedModules
    };
    onUpdateEmpresa(updated);
    setManagingModulesEmpresa(updated);
  };

  const filteredEmpresas = empresas.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.cnpj.includes(searchTerm) ||
    e.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cálculos do Dashboard B2B SaaS
  const totalEmpresas = empresas.length;
  const empresasAtivas = empresas.filter(e => e.status === 'ativo').length;
  const empresasBloqueadas = empresas.filter(e => e.status === 'bloqueado').length;
  const mrrTotal = empresas.filter(e => e.status === 'ativo').reduce((acc, e) => acc + e.monthlyValue, 0);
  const totalLicencas = empresas.filter(e => e.status === 'ativo').reduce((acc, e) => acc + e.maxUsers, 0);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Toast Notificação */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-slate-900 text-white px-5 py-3 text-xs font-bold shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Cabeçalho da Aba */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="h-6 w-6 text-blue-600" />
            Empresas Clientes (B2B SaaS)
          </h1>
          <p className="text-sm text-slate-500">
            Controle central de contratos, ativações, licenciamento e liberação de funcionalidades por empresa cliente
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Nova Empresa Cliente
          </button>
        </div>
      </div>

      {/* Sub-abas Internas */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'dashboard', label: 'Dashboard de Operação B2B', icon: TrendingUp },
          { id: 'licencas', label: 'Licenças, Acessos & Módulos', icon: Settings }
        ].map(({ id, label, icon: Icon }) => {
          const isActive = subTab === id;
          return (
            <button
              key={id}
              onClick={() => onSubTabChange(id as EmpresasClientesSubTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTEÚDO DA SUB-ABA: DASHBOARD */}
      {subTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Cards de Métricas B2B */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Empresas Clientes</span>
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">{totalEmpresas}</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-600 font-bold">{empresasAtivas} ativas</span>
                <span className="text-slate-300">•</span>
                <span className="text-rose-600 font-bold">{empresasBloqueadas} bloqueadas</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">MRR B2B (Receita Mensal)</span>
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-600">{formatCurrency(mrrTotal)}</div>
              <p className="text-xs text-slate-500">Projeção anual: {formatCurrency(mrrTotal * 12)}</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Licenças Ativas Totais</span>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">{totalLicencas} usuários</div>
              <p className="text-xs text-purple-600 font-semibold">Capacidade total contratada</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Taxa de Renovação</span>
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">
                {totalEmpresas > 0 ? `${Math.round((empresasAtivas / totalEmpresas) * 100)}%` : '0%'}
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                {totalEmpresas > 0 ? 'Baixo churn no trimestre' : 'Nenhum contrato ativo'}
              </p>
            </div>
          </div>

          {/* Resumo de Contratos Ativos */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Visão Geral dos Contratos Ativos</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Empresa Cliente</th>
                    <th className="py-3 px-4">Plano SaaS</th>
                    <th className="py-3 px-4">Valor Mensal</th>
                    <th className="py-3 px-4">Licenças</th>
                    <th className="py-3 px-4">Módulos Liberados</th>
                    <th className="py-3 px-4 text-right">Status do Contrato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {empresas.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">CNPJ: {emp.cnpj} • Resp: {emp.ownerName}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{emp.planName}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">{formatCurrency(emp.monthlyValue)}</td>
                      <td className="py-3 px-4 font-mono">{emp.maxUsers} usuários</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold">
                          {emp.allowedModules?.length || 0} de {ALL_MODULES.length} módulos
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          emp.status === 'ativo'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {emp.status === 'ativo' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA SUB-ABA: LICENÇAS, ACESSOS & MÓDULOS */}
      {subTab === 'licencas' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Barra de Pesquisa */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar por nome da empresa, CNPJ ou responsável..."
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-4 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="text-xs text-slate-500 font-semibold">
              Exibindo {filteredEmpresas.length} de {empresas.length} empresas cadastradas
            </div>
          </div>

          {/* Cards de Empresas Clientes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEmpresas.map((emp) => (
              <div key={emp.id} className="rounded-3xl bg-white border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{emp.name}</h3>
                      <p className="text-xs text-slate-400 font-mono">CNPJ: {emp.cnpj}</p>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                      emp.status === 'ativo'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {emp.status === 'ativo' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      {emp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Responsável</span>
                      <strong className="text-slate-800">{emp.ownerName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Contato</span>
                      <span className="text-slate-700">{emp.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Plano SaaS</span>
                      <strong className="text-blue-700">{emp.planName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Valor / Licenças</span>
                      <strong className="text-emerald-600">{formatCurrency(emp.monthlyValue)} ({emp.maxUsers} usuais)</strong>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 flex items-center justify-between pt-1">
                    <span>Módulos Contratados e Liberados:</span>
                    <strong className="text-blue-700">{emp.allowedModules?.length || 0} de {ALL_MODULES.length} ativados</strong>
                  </div>
                </div>

                {/* Botões de Ação do Card */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => setManagingModulesEmpresa(emp)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 cursor-pointer transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Configurar Módulos & Funcionalidades</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleEmpresaStatus(emp)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        emp.status === 'ativo'
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
                      }`}
                      title={emp.status === 'ativo' ? 'Bloquear Acesso da Empresa' : 'Ativar Acesso da Empresa'}
                    >
                      {emp.status === 'ativo' ? 'Bloquear' : 'Ativar Acesso'}
                    </button>

                    <button
                      onClick={() => handleOpenEdit(emp)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                      title="Editar Dados do Contrato"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: NOVA / EDITAR EMPRESA CLIENTE */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingEmpresa ? 'Editar Contrato de Empresa Cliente' : 'Cadastrar Nova Empresa Cliente'}
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmpresa} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome da Empresa / Academia *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Arena Fitness Club"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CNPJ *</label>
                  <input
                    type="text"
                    required
                    value={formData.cnpj}
                    onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                    placeholder="00.000.000/0001-00"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Responsável / Proprietário *</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                    placeholder="Nome do gestor"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-mail Corporativo *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contato@empresa.com"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Plano SaaS</label>
                  <input
                    type="text"
                    value={formData.planName}
                    onChange={(e) => setFormData(prev => ({ ...prev, planName: e.target.value }))}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Valor Mensal (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.monthlyValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthlyValue: parseFloat(e.target.value) || 0 }))}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Limite de Usuários</label>
                  <input
                    type="number"
                    value={formData.maxUsers}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxUsers: parseInt(e.target.value) || 10 }))}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vencimento da Mensalidade</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm cursor-pointer"
                >
                  {editingEmpresa ? 'Salvar Alterações' : 'Cadastrar Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GESTÃO GRANULAR DE MÓDULOS E FUNCIONALIDADES */}
      {managingModulesEmpresa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 shrink-0">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  <span>Funcionalidades Contratadas: {managingModulesEmpresa.name}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Marque ou desmarque os módulos que aparecerão para esta empresa cliente no sistema
                </p>
              </div>
              <button
                onClick={() => setManagingModulesEmpresa(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-3.5 rounded-2xl text-xs text-blue-900">
                <div>
                  <strong>Controle de Acesso Modular SaaS: </strong>
                  <span>{managingModulesEmpresa.allowedModules?.length || 0} de {ALL_MODULES.length} módulos habilitados.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const all = ALL_MODULES.map(m => m.id);
                      const updated = { ...managingModulesEmpresa, allowedModules: all };
                      onUpdateEmpresa(updated);
                      setManagingModulesEmpresa(updated);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] hover:bg-blue-700 cursor-pointer"
                  >
                    Habilitar Todos
                  </button>
                  <button
                    onClick={() => {
                      const updated = { ...managingModulesEmpresa, allowedModules: ['inicio', 'clientes'] as TabType[] };
                      onUpdateEmpresa(updated);
                      setManagingModulesEmpresa(updated);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-blue-300 text-blue-700 font-bold text-[10px] hover:bg-slate-50 cursor-pointer"
                  >
                    Apenas Básicos
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALL_MODULES.map((mod) => {
                  const isChecked = managingModulesEmpresa.allowedModules?.includes(mod.id);
                  return (
                    <div
                      key={mod.id}
                      onClick={() => toggleModuleForEmpresa(managingModulesEmpresa, mod.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50/50 text-slate-900 shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                          isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <span className="text-xs font-bold block">{mod.label}</span>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">{mod.category}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isChecked ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isChecked ? 'Liberado' : 'Bloqueado'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">As alterações são aplicadas instantaneamente para a empresa.</span>
              <button
                onClick={() => setManagingModulesEmpresa(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer shadow-sm"
              >
                Concluir & Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
