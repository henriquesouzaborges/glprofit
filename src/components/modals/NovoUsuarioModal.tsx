import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserPlus, 
  Shield, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  CheckSquare, 
  Square,
  Sparkles,
  Building
} from 'lucide-react';
import { SystemUser, SystemUserRole } from '../../types';
import { ALL_SYSTEM_MODULES } from '../../services/userService';

interface NovoUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (newUser: Omit<SystemUser, 'id' | 'createdAt'>) => void;
}

const AVAILABLE_MODULES = ALL_SYSTEM_MODULES;

const DEFAULT_PERMISSIONS_BY_ROLE: Record<SystemUserRole, string[]> = {
  admin: ALL_SYSTEM_MODULES.map(m => m.id),
  gerente: ['inicio', 'dashboards', 'alunos', 'treinos', 'agenda', 'catraca', 'financeiro', 'pay', 'vendas', 'comandas', 'estoque', 'crm', 'whatsapp', 'relatorios'],
  treinador: ['inicio', 'alunos', 'treinos', 'agenda'],
  recepcao: ['inicio', 'alunos', 'agenda', 'catraca', 'vendas', 'comandas', 'whatsapp'],
  financeiro: ['inicio', 'alunos', 'financeiro', 'pay', 'vendas', 'comandas', 'estoque', 'relatorios'],
  aluno: ['inicio', 'treinos', 'agenda'],
};

export const NovoUsuarioModal: React.FC<NovoUsuarioModalProps> = ({
  isOpen,
  onClose,
  onAddUser,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<SystemUserRole>('recepcao');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [department, setDepartment] = useState('Recepção Matriz');
  const [permissions, setPermissions] = useState<string[]>(DEFAULT_PERMISSIONS_BY_ROLE.recepcao);
  const [error, setError] = useState<string | null>(null);

  // Update permissions preset when role changes
  const handleRoleChange = (newRole: SystemUserRole) => {
    setRole(newRole);
    setPermissions(DEFAULT_PERMISSIONS_BY_ROLE[newRole]);

    if (newRole === 'admin') setDepartment('Diretoria / Gestão');
    else if (newRole === 'gerente') setDepartment('Gerência de Operações');
    else if (newRole === 'treinador') setDepartment('Musculação & Aulas');
    else if (newRole === 'recepcao') setDepartment('Recepção Matriz');
    else if (newRole === 'financeiro') setDepartment('Controladoria & Caixa');
  };

  const togglePermission = (moduleId: string) => {
    if (permissions.includes(moduleId)) {
      setPermissions(permissions.filter(p => p !== moduleId));
    } else {
      setPermissions([...permissions, moduleId]);
    }
  };

  const selectAllPermissions = () => {
    setPermissions(AVAILABLE_MODULES.map(m => m.id));
  };

  const clearPermissions = () => {
    setPermissions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Por favor, informe o nome completo do usuário.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    if (!password.trim() || password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    onAddUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      phone: phone.trim() || undefined,
      department: department.trim() || undefined,
      active: true,
      permissions: permissions.length > 0 ? permissions : DEFAULT_PERMISSIONS_BY_ROLE[role],
      password: password.trim(),
    });

    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setRole('recepcao');
    setDepartment('Recepção Matriz');
    setPermissions(DEFAULT_PERMISSIONS_BY_ROLE.recepcao);
    onClose();
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Cadastrar Novo Usuário do Sistema
              </h2>
              <p className="text-xs text-slate-500">
                Defina as credenciais e permissões de acesso para operadores e gestores
              </p>
            </div>
          </div>
          <button
            id="btn-fechar-modal-novo-usuario"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
            title="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 rounded-lg bg-rose-50 border border-rose-200/80 px-3.5 py-2 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nome Completo */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome Completo <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-usuario-nome"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Amanda Silva Castro"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            {/* E-mail */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail de Acesso <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-usuario-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amanda@vbsport.com.br"
                  className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
                />
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            {/* Telefone / WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telefone / WhatsApp
              </label>
              <div className="relative">
                <input
                  id="input-usuario-telefone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
                />
                <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            {/* Perfil de Acesso (Cargo) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Perfil de Acesso (Cargo) <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-usuario-cargo"
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as SystemUserRole)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 bg-white focus:border-blue-500 focus:outline-hidden"
              >
                <option value="admin">Administrador (Acesso Total)</option>
                <option value="gerente">Gerente de Unidade</option>
                <option value="treinador">Treinador / Professor</option>
                <option value="recepcao">Recepção / Atendente PDV</option>
                <option value="financeiro">Financeiro / Controladoria</option>
                <option value="aluno">Aluno Matriculado</option>
              </select>
            </div>

            {/* Departamento / Setor */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Setor / Turno de Trabalho
              </label>
              <div className="relative">
                <input
                  id="input-usuario-departamento"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Ex: Recepção Manhã / Balcão"
                  className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
                />
                <Building className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            {/* Senha Provisória */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Senha Inicial de Acesso <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-usuario-senha"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo de 6 caracteres (ex: VbSport@2026)"
                  className="w-full rounded-lg border border-slate-200 pl-8 pr-10 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
                />
                <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 focus:outline-hidden"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                O usuário poderá trocar esta senha após o primeiro login no sistema.
              </p>
            </div>
          </div>

          {/* Permissões de Acesso por Módulo */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-900">
                  Módulos e Telas com Acesso Permitido
                </span>
                <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                  {permissions.length} de {AVAILABLE_MODULES.length} liberados
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllPermissions}
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-800"
                >
                  Marcar Todos
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={clearPermissions}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-700"
                >
                  Limpar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {AVAILABLE_MODULES.map((mod) => {
                const isChecked = permissions.includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => togglePermission(mod.id)}
                    className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                      isChecked
                        ? 'border-blue-200 bg-blue-50/70 text-blue-900 font-medium'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`h-4 w-4 rounded flex items-center justify-center ${isChecked ? 'bg-blue-600 text-white' : 'border border-slate-300'}`}>
                      {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{mod.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              id="btn-cancelar-cadastro-usuario"
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btn-salvar-novo-usuario"
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs sm:text-sm font-medium text-white hover:bg-blue-700 shadow-xs transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Cadastrar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
