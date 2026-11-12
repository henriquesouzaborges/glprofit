import React, { useState, useMemo, useEffect } from 'react';
import { 
  HardDrive, 
  Download, 
  FileJson, 
  Database, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Dumbbell, 
  Calendar, 
  Package, 
  Receipt, 
  CheckCircle2, 
  Lock, 
  AlertTriangle, 
  Copy, 
  Eye, 
  X, 
  Sparkles,
  Layers,
  Clock,
  ShieldAlert,
  Cloud,
  RefreshCw,
  Server
} from 'lucide-react';
import { 
  GymSettings, 
  Plan, 
  SystemUser, 
  Student, 
  FinancialTransaction, 
  WorkoutPlan, 
  ClassSession, 
  Product, 
  Comanda, 
  PayRecurringCharge, 
  PaymentLink 
} from '../../../types';
import { getSystemUsers } from '../../../services/userService';
import { SYSTEM_VERSION_INFO } from '../../../version';
import { 
  subscribeDatabaseStatus, 
  syncAllSystemDataToCloud, 
  DatabaseStatus 
} from '../../../services/firebaseDbService';
import appletConfig from '../../../../firebase-applet-config.json';

interface BackupManualConfigViewProps {
  currentUser?: SystemUser | null;
  settings: GymSettings;
  plans: Plan[];
  students?: Student[];
  transactions?: FinancialTransaction[];
  workouts?: WorkoutPlan[];
  classes?: ClassSession[];
  products?: Product[];
  comandas?: Comanda[];
  recurringCharges?: PayRecurringCharge[];
  paymentLinks?: PaymentLink[];
  onShowNotification: (msg: string, type?: 'success' | 'info') => void;
}

export const BackupManualConfigView: React.FC<BackupManualConfigViewProps> = ({
  currentUser,
  settings,
  plans,
  students: propStudents,
  transactions: propTransactions,
  workouts: propWorkouts,
  classes: propClasses,
  products: propProducts,
  comandas: propComandas,
  recurringCharges: propRecurring,
  paymentLinks: propPaymentLinks,
  onShowNotification
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(() => {
    return localStorage.getItem('vbsport_last_backup_time');
  });

  const [dbStatus, setDbStatus] = useState<DatabaseStatus>({
    connected: true,
    syncing: false,
    lastSync: null,
    error: null,
    collectionsCount: {}
  });
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  useEffect(() => {
    const unsub = subscribeDatabaseStatus(setDbStatus);
    return () => unsub();
  }, []);

  const handleSyncAllToCloud = async () => {
    setIsSyncingCloud(true);
    try {
      const res = await syncAllSystemDataToCloud();
      if (res.success) {
        onShowNotification(
          `Sincronização em nuvem concluída! ${res.totalRecords} registros e configurações salvos no Firebase Firestore.`
        );
      } else {
        onShowNotification(`Falha na sincronização: ${res.error || 'Erro desconhecido'}`, 'info');
      }
    } catch (e: any) {
      onShowNotification(`Erro ao sincronizar com nuvem: ${e.message}`, 'info');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  // Gather live in-memory data with fallback to localStorage
  const currentData = useMemo(() => {
    const students: Student[] = propStudents || (() => {
      try {
        const s = localStorage.getItem('vbsport_students');
        return s ? JSON.parse(s) : [];
      } catch { return []; }
    })();

    const transactions: FinancialTransaction[] = propTransactions || (() => {
      try {
        const s = localStorage.getItem('vbsport_transactions');
        return s ? JSON.parse(s) : [];
      } catch { return []; }
    })();

    const workouts: WorkoutPlan[] = propWorkouts || (() => {
      try {
        const s = localStorage.getItem('vbsport_workouts');
        return s ? JSON.parse(s) : [];
      } catch { return []; }
    })();

    const classesList: ClassSession[] = propClasses || (() => {
      try {
        const s = localStorage.getItem('vbsport_classes');
        return s ? JSON.parse(s) : [];
      } catch { return []; }
    })();

    const productsList: Product[] = propProducts || (() => {
      try {
        const s = localStorage.getItem('vbsport_products');
        return s ? JSON.parse(s) : [];
      } catch { return []; }
    })();

    const comandasList: Comanda[] = propComandas || (() => {
      try {
        const s = localStorage.getItem('vbsport_comandas');
        return s ? JSON.parse(s) : [];
      } catch { return []; }
    })();



    const recurringList: PayRecurringCharge[] = propRecurring || (() => {
      try {
        const s = localStorage.getItem('vbsport_recurring');
        return s ? JSON.parse(s) : [];
      } catch { return []; }
    })();

    const paymentLinksList: PaymentLink[] = propPaymentLinks || (() => {
      try {
        const s = localStorage.getItem('vbsport_payment_links');
        return s ? JSON.parse(s) : [];
      } catch { return []; }
    })();

    const usersList: SystemUser[] = getSystemUsers();

    return {
      students,
      transactions,
      workouts,
      plans,
      classes: classesList,
      products: productsList,
      comandas: comandasList,
      recurringCharges: recurringList,
      paymentLinks: paymentLinksList,
      systemUsers: usersList,
      settings
    };
  }, [
    propStudents,
    propTransactions,
    propWorkouts,
    plans,
    propClasses,
    propProducts,
    propComandas,
    propRecurring,
    propPaymentLinks,
    settings
  ]);

  // Construct standardized JSON Backup Object
  const generateBackupPayload = () => {
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('pt-BR');

    return {
      metadata: {
        system: 'GL PRO FIT Enterprise Suite',
        version: SYSTEM_VERSION_INFO.version,
        buildNumber: SYSTEM_VERSION_INFO.buildNumber,
        backupType: 'Manual Admin Snapshot (JSON)',
        exportTimestamp: timestamp,
        exportDateFormatted: formattedDate,
        exportedBy: {
          name: currentUser?.name || 'Administrador',
          email: currentUser?.email || 'admin@glprofit.com.br',
          role: currentUser?.role || 'admin'
        },
        recordsCount: {
          totalAlunos: currentData.students.length,
          totalTransacoes: currentData.transactions.length,
          totalTreinos: currentData.workouts.length,
          totalPlanos: currentData.plans.length,
          totalAulas: currentData.classes.length,
          totalProdutos: currentData.products.length,
          totalComandas: currentData.comandas.length,
          totalUsuarios: currentData.systemUsers.length,
          totalCobrancasRecorrentes: currentData.recurringCharges.length,
          totalLinksPagamento: currentData.paymentLinks.length,
        }
      },
      alunos: currentData.students,
      transacoesFinanceiras: currentData.transactions,
      fichasDeTreino: currentData.workouts,
      planos: currentData.plans,
      aulasEHorarios: currentData.classes,
      produtosEstoque: currentData.products,
      comandasConsumo: currentData.comandas,
      cobrancasRecorrentes: currentData.recurringCharges,
      linksPagamento: currentData.paymentLinks,
      usuariosSistema: currentData.systemUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
        active: u.active,
        createdAt: u.createdAt,
        permissions: u.permissions
      })),
      configuracoesAcademia: currentData.settings
    };
  };

  const handleDownloadBackup = () => {
    if (!isAdmin) {
      onShowNotification('Apenas administradores possuem permissão para exportar dados.', 'info');
      return;
    }

    setIsExporting(true);

    try {
      const payload = generateBackupPayload();
      const jsonString = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const dateStr = new Date().toISOString().slice(0, 10);
      const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }).replace(/:/g, '-');
      const filename = `glprofit_backup_${dateStr}_${timeStr}.json`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const nowFormatted = new Date().toLocaleString('pt-BR');
      setLastBackupTime(nowFormatted);
      localStorage.setItem('vbsport_last_backup_time', nowFormatted);

      onShowNotification(
        `Backup manual exportado com sucesso! Arquivo "${filename}" gerado com ${payload.alunos.length} alunos, ${payload.transacoesFinanceiras.length} transações e ${payload.fichasDeTreino.length} treinos.`
      );
    } catch (err) {
      console.error('Erro ao gerar backup JSON:', err);
      onShowNotification('Ocorreu um erro ao gerar o arquivo de backup.', 'info');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyJson = () => {
    try {
      const payload = generateBackupPayload();
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopied(true);
      onShowNotification('Conteúdo do backup JSON copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Erro ao copiar JSON:', err);
    }
  };

  const totalPrimaryRecords = 
    currentData.students.length + 
    currentData.transactions.length + 
    currentData.workouts.length;

  const totalAllRecords = 
    totalPrimaryRecords + 
    currentData.plans.length + 
    currentData.classes.length + 
    currentData.products.length + 
    currentData.comandas.length + 
    currentData.systemUsers.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <HardDrive className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Backup Manual do Sistema & Exportação JSON
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                  Área do Administrador
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Exporte instantaneamente todos os dados do aplicativo (alunos, transações financeiras, treinos e cadastros) para um arquivo JSON independente.
              </p>
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDownloadBackup}
                disabled={isExporting}
                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>{isExporting ? 'Exportando...' : 'Exportar Backup (.JSON)'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Access Restriction Notice if Not Admin */}
        {!isAdmin && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">Acesso Restrito ao Administrador</h4>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                Apenas usuários com perfil <strong>Administrador</strong> têm permissão para exportar arquivos de backup completos do aplicativo. Entre em contato com a diretoria caso necessite de uma cópia dos dados.
              </p>
            </div>
          </div>
        )}

        {/* Admin Content */}
        {isAdmin && (
          <>
            {/* Cloud Database Integration Banner - Sincronização 100% Automática */}
            <div className="mt-6 rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 p-5 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-indigo-600" />
                      <span>Banco de Dados em Nuvem (Firebase Firestore)</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Sincronização 100% Automática
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    Sincronização contínua e transparente em segundo plano: qualquer cadastro, matrícula, alteração financeira, treino prescrito ou configuração institucional feita no sistema é salva e sincronizada automaticamente na nuvem sem necessidade de ação manual.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                      <Server className="w-3 h-3 text-indigo-500" />
                      DB ID: {appletConfig.firestoreDatabaseId || 'ai-studio-vbsportadm-f4a72c22-1567-475f-a82d-18ccf669ad1b'}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Auto-Sync em Tempo Real
                    </span>
                    {dbStatus.lastSync && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Último evento processado: <strong>{dbStatus.lastSync}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Nuvem Conectada & Ativa</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Statistics Grid */}
            <div className="mt-6">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-600" />
                <span>Dados Prontos para Exportação ({totalAllRecords} registros totais)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[11px] font-semibold">Alunos</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-lg font-black text-slate-900">{currentData.students.length}</div>
                  <div className="text-[10px] text-slate-400">Prontuários & cadastros</div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition-all">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[11px] font-semibold">Transações</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-lg font-black text-slate-900">{currentData.transactions.length}</div>
                  <div className="text-[10px] text-slate-400">Receitas & despesas</div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-purple-300 transition-all">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[11px] font-semibold">Fichas Treino</span>
                    <Dumbbell className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-lg font-black text-slate-900">{currentData.workouts.length}</div>
                  <div className="text-[10px] text-slate-400">Rotinas prescritas</div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-amber-300 transition-all">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[11px] font-semibold">Aulas & Grade</span>
                    <Calendar className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-lg font-black text-slate-900">{currentData.classes.length}</div>
                  <div className="text-[10px] text-slate-400">Turmas coletivas</div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-indigo-300 transition-all">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[11px] font-semibold">Produtos & PDV</span>
                    <Package className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-lg font-black text-slate-900">{currentData.products.length}</div>
                  <div className="text-[10px] text-slate-400">Estoque & comandas</div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[11px] font-semibold">Equipe & Acessos</span>
                    <ShieldCheck className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="text-lg font-black text-slate-900">{currentData.systemUsers.length}</div>
                  <div className="text-[10px] text-slate-400">Membros autorizados</div>
                </div>
              </div>
            </div>

            {/* Action Card with Details */}
            <div className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 to-slate-50 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-blue-600" />
                    Arquivo de Backup Estruturado (.JSON)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Contém cabeçalho com versão ({SYSTEM_VERSION_INFO.version}), carimbo de data/hora, autor do download e as entidades mapeadas.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Pré-visualizar JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copiar Conteúdo</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    disabled={isExporting}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Arquivo JSON</span>
                  </button>
                </div>
              </div>

              {/* Status and Last Backup */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-blue-200/60 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Último backup exportado:</span>
                  <span className="font-bold text-slate-900">
                    {lastBackupTime || 'Nenhum backup baixado nesta sessão'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  Formato: JSON UTF-8 Indentado (2 espaços)
                </div>
              </div>
            </div>

            {/* Recommendations & LGPD Security Notes */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Segurança da Informação e Conformidade (LGPD)</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-500 text-[11px] leading-relaxed pl-1">
                <li>O arquivo de backup gerado é uma cópia estática e <strong>não altera nem exclui</strong> os dados ativos no sistema e no Firebase Firestore.</li>
                <li>Por conter informações de alunos e movimentações financeiras, armazene este arquivo em discos criptografados ou servidores com controle de acesso rigoroso.</li>
                <li>Recomenda-se que a administração realize e arquive um backup manual semanalmente ou antes de grandes alterações operacionais na academia.</li>
              </ul>
            </div>
          </>
        )}
      </div>

      {/* JSON Preview Modal */}
      {isPreviewOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPreviewOpen(false);
          }}
        >
          <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pré-visualização do Backup JSON</h3>
                  <p className="text-[11px] text-slate-500">Instantâneo gerado para download manual</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-slate-950 font-mono text-[11px] text-emerald-400 custom-scrollbar">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(generateBackupPayload(), null, 2)}
              </pre>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
              <span>Total de coleções incluídas: 11 entidades</span>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Fechar Prévia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
