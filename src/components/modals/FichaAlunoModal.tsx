import React, { useState } from 'react';
import { 
  X, 
  User, 
  MessageSquare, 
  UserCheck, 
  CreditCard, 
  Dumbbell, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { Student, StudentStatus, FinancialTransaction, WorkoutPlan, AccessLog } from '../../types';
import { formatCurrency, formatDate, sendWhatsAppMessage } from '../../utils';

interface FichaAlunoModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  transactions: FinancialTransaction[];
  workouts: WorkoutPlan[];
  accessLogs: AccessLog[];
  onUpdateStudentStatus: (studentId: string, status: StudentStatus) => void;
  onTestTurnstile: (student: Student) => void;
  onSettleStudentPayment: (studentId: string) => void;
}

export const FichaAlunoModal: React.FC<FichaAlunoModalProps> = ({
  student,
  isOpen,
  onClose,
  transactions,
  workouts,
  accessLogs,
  onUpdateStudentStatus,
  onTestTurnstile,
  onSettleStudentPayment
}) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'financeiro' | 'treinos' | 'acessos'>('geral');

  if (!isOpen || !student) return null;

  const studentTransactions = transactions.filter(t => t.studentId === student.id || t.studentName === student.name);
  const studentWorkouts = workouts.filter(w => w.studentId === student.id || w.studentName === student.name);
  const studentAccessLogs = accessLogs.filter(a => a.studentId === student.id || a.studentName === student.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header Profile */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-4">
            <img
              src={student.photo}
              alt={student.name}
              className="h-16 w-16 rounded-full object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {student.name}
                </h2>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  student.status === 'ativo' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                    : student.status === 'inadimplente'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                      : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                }`}>
                  {student.status.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">
                Matrícula: <strong className="font-semibold text-slate-700">{student.code}</strong> • CPF: {student.cpf}
              </div>
              <div className="text-xs text-blue-700 font-medium mt-0.5">
                {student.planName} ({formatCurrency(student.planPrice)} / mês)
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <button
            onClick={() => {
              const text = student.status === 'inadimplente'
                ? `Olá ${student.name}! Passando para informar sobre sua mensalidade pendente na GL PRO FIT. Chave PIX: financeiro@glprofit.com.br`
                : `Olá ${student.name}! Como estão seus treinos na GL PRO FIT? Conte conosco sempre!`;
              sendWhatsAppMessage(student.phone, text, student.name, student.id);
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            WhatsApp
          </button>

          <button
            onClick={() => {
              onTestTurnstile(student);
              onClose();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors shadow-xs"
          >
            <UserCheck className="h-3.5 w-3.5" />
            Testar Catraca
          </button>

          {/* Change status selector */}
          <div className="ml-auto flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Alterar Situação:</span>
            <select
              value={student.status}
              onChange={(e) => onUpdateStudentStatus(student.id, e.target.value as StudentStatus)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
            >
              <option value="ativo">Ativo</option>
              <option value="inadimplente">Inadimplente</option>
              <option value="trancado">Trancado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Sub-tabs inside Modal */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('geral')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'geral' ? 'border-blue-600 text-blue-700 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Dados Cadastrais
          </button>
          <button
            onClick={() => setActiveTab('financeiro')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'financeiro' ? 'border-blue-600 text-blue-700 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Histórico Financeiro ({studentTransactions.length})
          </button>
          <button
            onClick={() => setActiveTab('treinos')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'treinos' ? 'border-blue-600 text-blue-700 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Fichas de Treino ({studentWorkouts.length})
          </button>
          <button
            onClick={() => setActiveTab('acessos')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'acessos' ? 'border-blue-600 text-blue-700 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Acessos Catraca ({studentAccessLogs.length})
          </button>
        </div>

        {/* Tab 1: Geral */}
        {activeTab === 'geral' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-slate-400 font-normal">Telefone / WhatsApp</span>
                <div className="font-semibold text-slate-800">{student.phone}</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-normal">E-mail</span>
                <div className="font-semibold text-slate-800">{student.email}</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-normal">Data de Nascimento</span>
                <div className="font-semibold text-slate-800">{formatDate(student.birthDate)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-normal">Próximo Vencimento</span>
                <div className="font-semibold text-slate-800">{formatDate(student.dueDate)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-normal">Início do Contrato</span>
                <div className="font-semibold text-slate-800">{formatDate(student.startDate)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-normal">Término Previsto</span>
                <div className="font-semibold text-slate-800">{formatDate(student.endDate)}</div>
              </div>
            </div>

            {student.notes && (
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                <span className="font-semibold text-slate-700 block mb-1">Anotações / Restrições:</span>
                <p className="text-slate-600 leading-relaxed">{student.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Financeiro */}
        {activeTab === 'financeiro' && (
          <div className="space-y-3">
            {student.pendingAmount > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>Mensalidade Pendente: <strong>{formatCurrency(student.pendingAmount)}</strong></span>
                </div>
                <button
                  onClick={() => onSettleStudentPayment(student.id)}
                  className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-medium text-white hover:bg-rose-700 transition-colors shadow-xs"
                >
                  Dar Baixa / Regularizar
                </button>
              </div>
            )}

            <div className="divide-y divide-slate-100 text-xs">
              {studentTransactions.length > 0 ? (
                studentTransactions.map((tx) => (
                  <div key={tx.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{tx.description}</div>
                      <div className="text-[11px] text-slate-400">
                        {formatDate(tx.date)} • {tx.paymentMethod.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">{formatCurrency(tx.amount)}</div>
                      <span className="text-[10px] font-medium text-emerald-600">Liquidado</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  Nenhuma movimentação anterior encontrada para este aluno.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Treinos */}
        {activeTab === 'treinos' && (
          <div className="space-y-3">
            {studentWorkouts.length > 0 ? (
              studentWorkouts.map((w) => (
                <div key={w.id} className="rounded-lg border border-slate-200 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">{w.title}</span>
                    <span className="rounded-md bg-blue-50 text-blue-700 text-[10px] font-medium px-2 py-0.5">
                      {w.level}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Objetivo: <strong className="text-slate-700 font-medium">{w.objective}</strong>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {w.splits.map(s => s.name).join(' • ')}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                Nenhum treino prescrito até o momento. Acesse a aba "Treinos" para criar a ficha.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Acessos */}
        {activeTab === 'acessos' && (
          <div className="space-y-2">
            {studentAccessLogs.length > 0 ? (
              studentAccessLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                  <div>
                    <div className="font-medium text-slate-800">{log.turnstile}</div>
                    <div className="text-[11px] text-slate-400">{log.timestamp}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    log.status === 'liberado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                  }`}>
                    {log.status.toUpperCase()}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                Nenhum registro de passagem na catraca para este aluno hoje.
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            Fechar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
