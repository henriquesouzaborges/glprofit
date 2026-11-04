import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  MessageSquare, 
  FileText, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Phone,
  Mail,
  Download,
  MoreVertical
} from 'lucide-react';
import { Student, StudentStatus } from '../../types';
import { formatCurrency, formatDate, sendWhatsAppMessage } from '../../utils';

interface AlunosTabProps {
  students: Student[];
  onOpenNewStudent: () => void;
  onSelectStudent: (student: Student) => void;
  onTestTurnstile: (student: Student) => void;
}

export const AlunosTab: React.FC<AlunosTabProps> = ({
  students,
  onOpenNewStudent,
  onSelectStudent,
  onTestTurnstile
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.cpf.includes(search) ||
      student.code.includes(search) ||
      student.phone.includes(search);

    if (statusFilter === 'todos') return matchesSearch;
    return matchesSearch && student.status === statusFilter;
  });

  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case 'ativo':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Ativo
          </span>
        );
      case 'inadimplente':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200/60 px-2.5 py-0.5 text-xs font-medium text-rose-700">
            <AlertCircle className="h-3 w-3 text-rose-600" />
            Inadimplente
          </span>
        );
      case 'trancado':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            <Clock className="h-3 w-3 text-amber-600" />
            Trancado
          </span>
        );
      case 'cancelado':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="h-5 w-5 text-blue-600" />
            Gestão de Alunos
          </h1>
          <p className="text-sm text-slate-500">
            Cadastros, contratos, situação cadastral e fichas técnicas ({students.length} alunos cadastrados)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const csvData = students.map(s => `${s.code},${s.name},${s.cpf},${s.phone},${s.planName},${s.status}`).join('\n');
              const blob = new Blob([`Matrícula,Nome,CPF,Telefone,Plano,Status\n${csvData}`], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `alunos-vbsport-${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
            }}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="h-4 w-4 text-slate-400" />
            Exportar CSV
          </button>
          <button
            onClick={onOpenNewStudent}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Cadastrar Novo Aluno
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, CPF, código ou celular..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-colors"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'todos', label: `Todos (${students.length})` },
            { id: 'ativo', label: `Ativos (${students.filter(s => s.status === 'ativo').length})` },
            { id: 'inadimplente', label: `Inadimplentes (${students.filter(s => s.status === 'inadimplente').length})` },
            { id: 'trancado', label: `Trancados (${students.filter(s => s.status === 'trancado').length})` }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setStatusFilter(pill.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === pill.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Students Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Aluno</th>
                <th className="py-3 px-4">Contato</th>
                <th className="py-3 px-4">Plano Contratado</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4">Situação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.photo}
                          alt={student.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-xs"
                        />
                        <div>
                          <div 
                            onClick={() => onSelectStudent(student)}
                            className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer"
                          >
                            {student.name}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            Cód: {student.code} • CPF: {student.cpf}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4">
                      <div className="text-xs text-slate-700 font-medium flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {student.phone}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-[180px] flex items-center gap-1">
                        <Mail className="h-3 w-3 text-slate-400" />
                        {student.email}
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 text-xs">
                        {student.planName}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {formatCurrency(student.planPrice)} / mês
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="py-3 px-4">
                      <div className="text-xs font-medium text-slate-800">
                        {formatDate(student.dueDate)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Último acesso: {student.lastAccess || 'Sem registro'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {getStatusBadge(student.status)}
                      {student.pendingAmount > 0 && (
                        <div className="text-[11px] font-medium text-rose-600 mt-1">
                          Pendente: {formatCurrency(student.pendingAmount)}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            const message = student.status === 'inadimplente'
                              ? `Olá ${student.name}, tudo bem? Notamos que sua mensalidade de ${formatCurrency(student.pendingAmount)} na GL PRO FIT está em aberto. Podemos enviar a chave PIX para regularização?`
                              : `Olá ${student.name}, passando para desejar ótimos treinos na GL PRO FIT! Conte conosco para o que precisar.`;
                            sendWhatsAppMessage(student.phone, message, student.name, student.id);
                          }}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
                          title="Abrir Contato no WhatsApp Interno"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => onTestTurnstile(student)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                          title="Testar Passagem na Catraca"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => onSelectStudent(student)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                        >
                          <FileText className="h-3.5 w-3.5 text-slate-400" />
                          Ficha
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Nenhum aluno encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
