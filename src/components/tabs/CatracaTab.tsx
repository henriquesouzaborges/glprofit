import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  Clock, 
  Unlock, 
  Smartphone, 
  Activity,
  Search,
  Wifi,
  Radio,
  ThumbsUp,
  Settings,
  Calendar
} from 'lucide-react';
import { AccessLog, Student, ClassSession } from '../../types';
import { formatDate } from '../../utils';
import { getAgendaSettings } from '../../services/tabSettingsService';

interface CatracaTabProps {
  students: Student[];
  classes?: ClassSession[];
  accessLogs: AccessLog[];
  onRegisterAccess: (log: AccessLog) => void;
  selectedStudentToTest?: Student | null;
  onOpenConfiguracoes?: () => void;
}

export const CatracaTab: React.FC<CatracaTabProps> = ({
  students,
  classes = [],
  accessLogs,
  onRegisterAccess,
  selectedStudentToTest,
  onOpenConfiguracoes
}) => {
  const [inputCode, setInputCode] = useState(selectedStudentToTest ? selectedStudentToTest.code : '');
  const [selectedTurnstile, setSelectedTurnstile] = useState('Catraca Principal (Entrada)');
  const [lastCheckResult, setLastCheckResult] = useState<{
    student: Student | null;
    status: 'liberado' | 'bloqueado';
    reason: string;
    timestamp: string;
  } | null>(null);

  const handleSimulatePass = (studentToUse?: Student) => {
    const student = studentToUse || students.find(
      s => s.code === inputCode || 
           s.cpf.replace(/\D/g, '') === inputCode.replace(/\D/g, '') ||
           s.name.toLowerCase().includes(inputCode.toLowerCase())
    );

    const now = new Date();
    const timeStr = `Hoje às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    if (!student) {
      setLastCheckResult({
        student: null,
        status: 'bloqueado',
        reason: 'Matrícula ou CPF não localizado no banco de dados.',
        timestamp: timeStr
      });
      return;
    }

    // Check student status
    let status: 'liberado' | 'bloqueado' = 'liberado';
    let reason = `Plano Ativo (${student.planName})`;

    if (student.status === 'inadimplente') {
      status = 'bloqueado';
      reason = `Mensalidade em aberto há mais de 3 dias (R$ ${student.pendingAmount.toFixed(2)})`;
    } else if (student.status === 'trancado') {
      status = 'bloqueado';
      reason = 'Matrícula trancada temporariamente.';
    } else if (student.status === 'cancelado') {
      status = 'bloqueado';
      reason = 'Contrato cancelado.';
    }

    const log: AccessLog = {
      id: `log-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentCode: student.code,
      photo: student.photo,
      timestamp: timeStr,
      type: 'entrada',
      status,
      reason,
      turnstile: selectedTurnstile
    };

    onRegisterAccess(log);
    setLastCheckResult({
      student,
      status,
      reason,
      timestamp: timeStr
    });
    setInputCode('');
  };

  const handleManualOverride = () => {
    if (!lastCheckResult?.student) return;
    const now = new Date();
    const timeStr = `Hoje às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const log: AccessLog = {
      id: `log-${Date.now()}`,
      studentId: lastCheckResult.student.id,
      studentName: lastCheckResult.student.name,
      studentCode: lastCheckResult.student.code,
      photo: lastCheckResult.student.photo,
      timestamp: timeStr,
      type: 'entrada',
      status: 'liberado',
      reason: 'Liberação Manual Autorizada pela Recepção',
      turnstile: selectedTurnstile
    };

    onRegisterAccess(log);
    setLastCheckResult(prev => prev ? { ...prev, status: 'liberado', reason: 'Liberação Manual Autorizada pela Recepção' } : null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserCheck className="h-5 w-5 text-blue-600" />
            Terminal de Catraca & Controle de Acesso
          </h1>
          <p className="text-sm text-slate-500">
            Monitoramento em tempo real, integração com torniquetes, biometria e liberação manual
          </p>
        </div>

        {/* Hardware Status */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 border border-emerald-200/60">
            <Radio className="h-4 w-4 text-emerald-600 animate-pulse" />
            Catraca Principal Conectada
          </div>

          <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border ${
            getAgendaSettings().presencaAutomaticaCatraca 
              ? 'bg-blue-50 text-blue-800 border-blue-200' 
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            <ThumbsUp className={`h-3.5 w-3.5 ${getAgendaSettings().presencaAutomaticaCatraca ? 'text-blue-600 fill-blue-600' : 'text-slate-400'}`} />
            <span>Presença na Agenda: {getAgendaSettings().presencaAutomaticaCatraca ? 'Automática Ativa' : 'Manual'}</span>
            {onOpenConfiguracoes && (
              <button
                type="button"
                onClick={onOpenConfiguracoes}
                className="ml-1 text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
                title="Configurar integração Catraca + Agenda"
              >
                (Configurar)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Turnstile Simulator (left) & Live Access Log (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulator Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <QrCode className="h-4 w-4 text-blue-600" />
                Simulador de Passagem / Leitor
              </h2>
              <span className="text-xs text-slate-400">Recepção</span>
            </div>

            {/* Quick Test Student Buttons */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Testar Alunos Rápidos:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {students.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSimulatePass(s)}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 p-2 text-left hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src={s.photo}
                      alt={s.name}
                      className="h-7 w-7 rounded-full object-cover border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-slate-900 truncate">
                        {(s.name || 'Aluno').split(' ')?.[0] || ''} {(s.name || '').split(' ')?.[1] || ''}
                      </div>
                      <div className={`text-[10px] font-medium ${
                        s.status === 'ativo' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {s.status.toUpperCase()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Code / CPF input */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Digitar Código, Matrícula ou CPF
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSimulatePass()}
                  placeholder="Ex: 00104 ou CPF"
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono font-medium text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                />
                <button
                  onClick={() => handleSimulatePass()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Girar Catraca
                </button>
              </div>
            </div>

            {/* Turnstile Select */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Catraca Selecionada
              </label>
              <select
                value={selectedTurnstile}
                onChange={(e) => setSelectedTurnstile(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden"
              >
                <option value="Catraca Principal (Entrada)">Catraca 01 - Principal (Entrada)</option>
                <option value="Catraca 02 - Musculação">Catraca 02 - Acesso Musculação</option>
                <option value="Catraca 03 - Piscina / Lutas">Catraca 03 - Piscina & Lutas</option>
              </select>
            </div>

            {/* Result Visual Screen (Like VB SPORT Reception Display) */}
            {lastCheckResult && (
              <div className={`rounded-xl p-4 text-center border transition-colors ${
                lastCheckResult.status === 'liberado'
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50/70 border-rose-300 text-rose-950'
              }`}>
                {lastCheckResult.student ? (
                  <div className="space-y-2">
                    <img
                      src={lastCheckResult.student.photo}
                      alt={lastCheckResult.student.name}
                      className="mx-auto h-16 w-16 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                    <div className="font-semibold text-sm">
                      {lastCheckResult.student.name}
                    </div>
                    <div className="text-xs font-normal opacity-80">
                      Matrícula: {lastCheckResult.student.code} • {lastCheckResult.student.planName}
                    </div>

                    <div className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold tracking-wider ${
                      lastCheckResult.status === 'liberado'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}>
                      {lastCheckResult.status === 'liberado' ? 'ACESSO LIBERADO' : 'ACESSO BLOQUEADO'}
                    </div>

                    <div className="text-xs font-medium mt-1">
                      {lastCheckResult.reason}
                    </div>

                    {lastCheckResult.status === 'liberado' && getAgendaSettings().presencaAutomaticaCatraca && (
                      (() => {
                        const enrolledInClasses = classes.filter(c => 
                          c.enrolledStudents.some(e => e.studentId === lastCheckResult.student?.id)
                        );
                        if (enrolledInClasses.length === 0) return null;
                        return (
                          <div className="mt-2.5 p-2 rounded-xl bg-emerald-100/90 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs">
                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700 shrink-0" />
                            <span>Presença confirmada na Agenda: {enrolledInClasses.map(c => c.title).join(', ')}</span>
                          </div>
                        );
                      })()
                    )}

                    {lastCheckResult.status === 'bloqueado' && (
                      <button
                        onClick={handleManualOverride}
                        className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 mx-auto transition-colors shadow-xs"
                      >
                        <Unlock className="h-3.5 w-3.5 text-amber-400" />
                        Liberar Manualmente pela Recepção
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="py-4 space-y-1 text-rose-800">
                    <AlertCircle className="mx-auto h-7 w-7 text-rose-600" />
                    <div className="font-semibold text-sm">Aluno não localizado</div>
                    <div className="text-xs">{lastCheckResult.reason}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Live Access Feed (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  Histórico de Passagens (Ao Vivo)
                </h2>
                <p className="text-xs text-slate-500">Últimos registros emitidos pelas catracas</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {accessLogs.length} acessos
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Horário</th>
                    <th className="py-2.5 px-3">Aluno</th>
                    <th className="py-2.5 px-3">Dispositivo / Catraca</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Motivo / Mensagem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accessLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                        {log.studentName} ({log.studentCode})
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {log.turnstile}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          log.status === 'liberado'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        }`}>
                          {log.status === 'liberado' ? 'LIBERADO' : 'BLOQUEADO'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                        {log.reason || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
