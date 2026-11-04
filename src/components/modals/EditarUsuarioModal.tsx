import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  User, 
  Mail, 
  Phone, 
  Building,
  Lock,
  Sparkles
} from 'lucide-react';
import { SystemUser, SystemUserRole } from '../../types';
import { ALL_SYSTEM_MODULES, SystemModuleDefinition } from '../../services/userService';

interface EditarUsuarioModalProps {
  isOpen: boolean;
  user: SystemUser | null;
  onClose: () => void;
  onSaveUser: (updatedUser: SystemUser) => void;
}

export const EditarUsuarioModal: React.FC<EditarUsuarioModalProps> = ({
  isOpen,
  user,
  onClose,
  onSaveUser,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<SystemUserRole>('recepcao');
  const [department, setDepartment] = useState('');
  const [active, setActive] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setRole(user.role || 'recepcao');
      setDepartment(user.department || '');
      setActive(user.active !== undefined ? user.active : true);
      setPermissions(user.permissions || []);
      setError(null);
    }
  }, [user, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const isAdmin = role === 'admin';

  const togglePermission = (modId: string) => {
    if (isAdmin) return; // Admins have all permissions
    setPermissions(prev => 
      prev.includes(modId) 
        ? prev.filter(p => p !== modId) 
        : [...prev, modId]
    );
  };

  const handleSelectAll = () => {
    setPermissions(ALL_SYSTEM_MODULES.map(m => m.id));
  };

  const handleClearAll = () => {
    setPermissions(['inicio']);
  };

  const handleRoleChange = (newRole: SystemUserRole) => {
    setRole(newRole);
    if (newRole === 'admin') {
      setPermissions(ALL_SYSTEM_MODULES.map(m => m.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor informe o nome completo do usuário.');
      return;
    }

    const finalPermissions = isAdmin 
      ? ALL_SYSTEM_MODULES.map(m => m.id)
      : (permissions.length > 0 ? permissions : ['inicio']);

    const updatedUser: SystemUser = {
      ...user,
      name: name.trim(),
      phone: phone.trim() || undefined,
      role,
      department: department.trim() || undefined,
      active,
      permissions: finalPermissions,
    };

    onSaveUser(updatedUser);
    onClose();
  };

  const categories: { key: SystemModuleDefinition['category']; label: string }[] = [
    { key: 'core', label: '1. Módulos Estratégicos & Painéis' },
    { key: 'operacional', label: '2. Operações, Alunos & Atendimento' },
    { key: 'financeiro', label: '3. Financeiro, Vendas & Estoque' },
    { key: 'sistema', label: '4. Administração & Sistema' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Editar Permissões & Dados do Usuário
              </h2>
              <p className="text-xs text-slate-500">
                Controle exatamente quais abas e módulos <span className="font-semibold text-slate-700">{user.email}</span> pode acessar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 rounded-lg bg-rose-50 border border-rose-200/80 px-3.5 py-2 text-xs font-medium text-rose-700 shrink-0">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* User Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do Usuário
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-xs text-slate-900 font-semibold focus:border-blue-500 focus:outline-hidden"
                />
                <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail de Login (Identificador)
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-xs text-slate-500 bg-slate-100 cursor-not-allowed font-mono"
                />
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Perfil de Acesso (Cargo)
              </label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as SystemUserRole)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 bg-white focus:border-blue-500 focus:outline-hidden"
              >
                <option value="admin">Administrador (Acesso Total irrestrito)</option>
                <option value="gerente">Gerente de Unidade</option>
                <option value="treinador">Treinador / Professor</option>
                <option value="recepcao">Recepção / Atendente PDV</option>
                <option value="financeiro">Financeiro / Controladoria</option>
                <option value="aluno">Aluno Matriculado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Setor / Departamento
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Ex: Recepção Matriz"
                  className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
                <Building className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telefone / WhatsApp
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
                <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status da Conta
              </label>
              <button
                type="button"
                onClick={() => setActive(!active)}
                className={`w-full flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  active 
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800' 
                    : 'border-rose-200 bg-rose-50 text-rose-800'
                }`}
              >
                <span>Status de Acesso: {active ? 'ATIVO' : 'BLOQUEADO'}</span>
                <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </button>
            </div>
          </div>

          {/* Permissions Header & Quick Actions */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                  <Lock className="h-3.5 w-3.5 text-blue-600" />
                  Abas & Módulos Autorizados ({isAdmin ? 'Todos (Admin)' : `${permissions.length} de ${ALL_SYSTEM_MODULES.length}`})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Somente as abas marcadas abaixo aparecerão na barra lateral e serão acessíveis por este operador.
                </p>
              </div>

              {!isAdmin && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    Selecionar Todas
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
                  >
                    Limpar
                  </button>
                </div>
              )}
            </div>

            {isAdmin ? (
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-800 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Perfil de Administrador Ativo</p>
                  <p className="text-blue-700 text-[11px] mt-0.5">
                    Como Administrador, este usuário possui permissão total e irrestrita a todos os módulos, catracas, relatórios financeiros e configurações do sistema.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((cat) => {
                  const catModules = ALL_SYSTEM_MODULES.filter(m => m.category === cat.key);
                  return (
                    <div key={cat.key} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                        {cat.label}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {catModules.map((mod) => {
                          const isChecked = permissions.includes(mod.id);
                          return (
                            <label
                              key={mod.id}
                              onClick={() => togglePermission(mod.id)}
                              className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                                isChecked 
                                  ? 'border-blue-300 bg-white text-slate-900 shadow-xs' 
                                  : 'border-slate-200 bg-slate-50/80 text-slate-400 hover:bg-white'
                              }`}
                            >
                              <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border mt-0.5 transition-colors ${
                                isChecked 
                                  ? 'border-blue-600 bg-blue-600 text-white' 
                                  : 'border-slate-300 bg-white'
                              }`}>
                                {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                              </div>
                              <div className="min-w-0">
                                <span className={`font-semibold block leading-tight ${isChecked ? 'text-slate-900' : 'text-slate-500'}`}>
                                  {mod.label}
                                </span>
                                <span className="text-[10px] text-slate-400 line-clamp-1">
                                  {mod.description}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="h-4 w-4" />
              Salvar Permissões
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
