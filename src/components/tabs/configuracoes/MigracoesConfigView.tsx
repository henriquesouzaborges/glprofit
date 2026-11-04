import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  ClipboardCheck, 
  Salad, 
  Dumbbell, 
  CircleDollarSign, 
  ArrowRight, 
  RotateCcw, 
  FileSpreadsheet, 
  FileImage, 
  Check, 
  X, 
  Search, 
  UserPlus, 
  HelpCircle,
  Eye,
  Info,
  Clock,
  Layers,
  ChevronDown,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Student, Plan, FinancialTransaction, WorkoutPlan, SystemUser } from '../../../types';
import { 
  MigrationCategory, 
  MIGRATION_CATEGORIES, 
  processFileWithGemini,
  saveImportedEvaluation,
  saveImportedDietPlan
} from '../../../services/migrationService';
import { logSecurityEvent } from '../../../services/securityService';

interface MigracoesConfigViewProps {
  students: Student[];
  plans: Plan[];
  currentUser?: SystemUser | null;
  onImportStudents?: (imported: Student[]) => void;
  onImportTransactions?: (imported: FinancialTransaction[]) => void;
  onImportWorkouts?: (imported: WorkoutPlan[]) => void;
  onShowNotification?: (message: string, type?: 'success' | 'info') => void;
}

export const MigracoesConfigView: React.FC<MigracoesConfigViewProps> = ({
  students,
  plans,
  currentUser,
  onImportStudents,
  onImportTransactions,
  onImportWorkouts,
  onShowNotification
}) => {
  // 1. Categoria escolhida antes do upload
  const [selectedCategory, setSelectedCategory] = useState<MigrationCategory | null>(null);

  // 2. Arquivo selecionado
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3. Estado de processamento com IA
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [processError, setProcessError] = useState<string | null>(null);
  const [usedModel, setUsedModel] = useState<string>('Gemini 3.5 Flash');

  // 4. Dados reconhecidos para revisão
  const [extractedItems, setExtractedItems] = useState<any[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);

  // 5. Sucesso / Conclusão
  const [importSummary, setImportSummary] = useState<{
    count: number;
    category: MigrationCategory;
    timestamp: string;
  } | null>(null);

  // Manipulador de seleção de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setProcessError(null);

    // Gerar preview se for imagem
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setProcessError(null);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleResetFlow = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setIsProcessing(false);
    setIsReviewing(false);
    setExtractedItems([]);
    setProcessError(null);
    setImportSummary(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Executa o reconhecimento com IA Gemini
  const handleProcessFile = async () => {
    if (!selectedFile || !selectedCategory) return;

    setIsProcessing(true);
    setProcessError(null);
    setProcessStep('Enviando arquivo para a API de Reconhecimento Inteligente...');

    try {
      setProcessStep('Analisando documento com o modelo Gemini 3.5 Flash...');
      const result = await processFileWithGemini({
        file: selectedFile,
        migrationType: selectedCategory,
        students
      });

      if (!result.items || result.items.length === 0) {
        throw new Error('Nenhum registro estruturado foi identificado no documento. Verifique se o arquivo contém informações legíveis.');
      }

      setUsedModel(result.model);
      setExtractedItems(result.items);
      setIsReviewing(true);
      setIsProcessing(false);

      if (onShowNotification) {
        onShowNotification(`Sucesso! ${result.items.length} registro(s) identificado(s) pelo Gemini.`, 'success');
      }
    } catch (err: any) {
      console.error('Erro na migração:', err);
      setIsProcessing(false);
      setProcessError(err.message || 'Falha ao processar arquivo com inteligência artificial.');
    }
  };

  // Alterna seleção individual de item para importação
  const handleToggleItemSelection = (index: number) => {
    setExtractedItems(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, selected: !item.selected };
      }
      return item;
    }));
  };

  // Alterna seleção de todos os itens
  const handleToggleAllItems = (select: boolean) => {
    setExtractedItems(prev => prev.map(item => ({ ...item, selected: select })));
  };

  // Ajusta manualmente o aluno vinculado a um item extraído
  const handleUpdateItemStudentLink = (itemIndex: number, studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setExtractedItems(prev => prev.map((item, idx) => {
      if (idx === itemIndex) {
        return {
          ...item,
          matchedStudentId: student ? student.id : undefined,
          matchedStudentName: student ? student.name : undefined
        };
      }
      return item;
    }));
  };

  // Efetua a importação final no sistema
  const handleConfirmImport = () => {
    if (!selectedCategory) return;

    const selectedList = extractedItems.filter(i => i.selected);
    if (selectedList.length === 0) {
      if (onShowNotification) {
        onShowNotification('Selecione pelo menos um registro para importar.', 'info');
      }
      return;
    }

    try {
      if (selectedCategory === 'clientes') {
        const newStudents: Student[] = selectedList.map((item, idx) => {
          const matched = students.find(s => s.id === item.matchedStudentId);
          return {
            id: matched?.id || `std-mig-${Date.now()}-${idx}`,
            code: matched?.code || `00${Math.floor(100 + Math.random() * 899)}`,
            name: item.name || 'Aluno Importado',
            photo: matched?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            email: item.email || `${(item.name || 'aluno').toLowerCase().replace(/\s+/g, '.')}@email.com`,
            phone: item.phone || '(00) 00000-0000',
            cpf: item.cpf || '000.000.000-00',
            birthDate: item.birthDate || '1998-05-20',
            status: item.status || 'ativo',
            planId: plans?.[0]?.id || 'plan-1',
            planName: item.planName || plans?.[0]?.name || 'Plano Mensal',
            planPrice: item.planPrice || plans?.[0]?.price || 120,
            startDate: item.startDate || new Date().toISOString().slice(0, 10),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            dueDate: item.dueDate || 'Dia 10',
            pendingAmount: item.pendingAmount || 0,
            notes: item.notes ? `[Importado via Migração IA]: ${item.notes}` : '[Importado via Migração IA]'
          };
        });

        if (onImportStudents) {
          onImportStudents(newStudents);
        }
      } else if (selectedCategory === 'avaliacao_fisica') {
        selectedList.forEach(item => {
          const targetStudentId = item.matchedStudentId || students[0]?.id || 'std-1';
          saveImportedEvaluation(targetStudentId, item);
        });
      } else if (selectedCategory === 'plano_alimentar') {
        selectedList.forEach(item => {
          const targetStudentId = item.matchedStudentId || students[0]?.id || 'std-1';
          saveImportedDietPlan(targetStudentId, item);
        });
      } else if (selectedCategory === 'treinos') {
        const newWorkouts: WorkoutPlan[] = selectedList.map((item, idx) => {
          return {
            id: `wkt-mig-${Date.now()}-${idx}`,
            title: item.title || 'Treino Importado com IA',
            studentId: item.matchedStudentId || students[0]?.id || 'std-1',
            studentName: item.matchedStudentName || item.studentName || students[0]?.name || 'Aluno',
            instructor: item.instructor || currentUser?.name || 'Professor',
            goal: item.goal || 'Hipertrofia',
            level: (item.level as any) || 'Intermediário',
            frequency: item.frequency || 'ABC (3x por semana)',
            startDate: new Date().toISOString().slice(0, 10),
            validUntil: item.validUntil || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            active: true,
            divisions: (item.divisions || []).map((div: any) => ({
              letter: div.letter || 'A',
              name: div.name || 'Treino A',
              targetMuscles: div.targetMuscles || ['Geral'],
              exercises: (div.exercises || []).map((ex: any, exIdx: number) => ({
                id: `ex-mig-${Date.now()}-${exIdx}`,
                name: ex.name || 'Exercício',
                muscleGroup: ex.muscleGroup || 'Peito',
                sets: Number(ex.sets) || 3,
                reps: String(ex.reps || '10 a 12'),
                weightKg: Number(ex.weightKg) || 10,
                restSec: Number(ex.restSec) || 60,
                equipment: ex.equipment || 'Máquina',
                method: ex.method || 'Tradicional',
                notes: ex.notes || ''
              }))
            })),
            notes: item.generalNotes || 'Ficha migrada automaticamente via IA Gemini'
          };
        });

        if (onImportWorkouts) {
          onImportWorkouts(newWorkouts);
        }
      } else if (selectedCategory === 'financeiro') {
        const newTransactions: FinancialTransaction[] = selectedList.map((item, idx) => {
          const matched = students.find(s => s.id === item.matchedStudentId);
          return {
            id: `tx-mig-${Date.now()}-${idx}`,
            type: item.type === 'despesa' ? 'despesa' : 'receita',
            category: item.category || 'Mensalidade',
            description: item.description || 'Lançamento Migrado',
            amount: Number(item.amount) || 0,
            paymentMethod: (item.paymentMethod as any) || 'pix',
            date: item.date || new Date().toISOString().slice(0, 10),
            dueDate: item.dueDate || item.date || new Date().toISOString().slice(0, 10),
            status: item.status || 'pago',
            studentId: matched?.id || item.matchedStudentId,
            studentName: matched?.name || item.studentName
          };
        });

        if (onImportTransactions) {
          onImportTransactions(newTransactions);
        }
      }

      // Registra evento no Log de Auditoria de Segurança
      logSecurityEvent({
        eventType: 'MIGRATION_IMPORT',
        userEmail: currentUser?.email || 'admin@glprofit.com',
        userName: currentUser?.name || 'Administrador',
        provider: 'system',
        details: `Importação de ${selectedList.length} registro(s) do módulo "${selectedCategory}" a partir do arquivo "${selectedFile?.name}". Reconhecido pelo modelo ${usedModel}.`,
        status: 'success'
      });

      setImportSummary({
        count: selectedList.length,
        category: selectedCategory,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
      setIsReviewing(false);

      if (onShowNotification) {
        onShowNotification(`Importação concluída! ${selectedList.length} registro(s) inserido(s) com sucesso no sistema.`, 'success');
      }
    } catch (e: any) {
      console.error('Erro ao confirmar importação:', e);
      if (onShowNotification) {
        onShowNotification(`Erro ao gravar dados: ${e.message}`, 'info');
      }
    }
  };

  const selectedCount = extractedItems.filter(i => i.selected).length;

  return (
    <div className="space-y-6">
      {/* Header do Módulo de Migrações */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Migrações & Importação com IA Gemini 3.5 Flash
                </h2>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Reconhecimento Multimodal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Envie planilhas, PDFs ou fotos de fichas físicas. A IA extrai e vincula automaticamente os dados aos clientes cadastrados.
              </p>
            </div>
          </div>

          {(selectedCategory || selectedFile || isReviewing || importSummary) && (
            <button
              type="button"
              onClick={handleResetFlow}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Nova Migração</span>
            </button>
          )}
        </div>
      </div>

      {/* FEEDBACK DE SUCESSO PÓS-IMPORTAÇÃO */}
      {importSummary && (
        <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black">
                Migração Concluída com Sucesso!
              </h3>
              <p className="text-xs text-emerald-100">
                {importSummary.count} registro(s) do módulo <strong>{selectedCategory?.toUpperCase()}</strong> foram vinculados e salvos no sistema às {importSummary.timestamp}.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleResetFlow}
              className="px-4 py-2 rounded-xl bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer"
            >
              Realizar Outra Importação
            </button>
          </div>
        </div>
      )}

      {/* PASSO 1: ESCOLHA DA OPÇÃO DE MIGRAÇÃO (ANTES DO UPLOAD) */}
      {!isReviewing && !importSummary && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                Selecione o Tipo de Dado a Migrar
              </span>
              <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                O que você deseja importar para o sistema hoje?
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {MIGRATION_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              
              let IconComp = UserCheck;
              if (cat.id === 'avaliacao_fisica') IconComp = ClipboardCheck;
              if (cat.id === 'plano_alimentar') IconComp = Salad;
              if (cat.id === 'treinos') IconComp = Dumbbell;
              if (cat.id === 'financeiro') IconComp = CircleDollarSign;

              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    // se já tinha arquivo mas trocou de categoria, limpa
                    setProcessError(null);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between space-y-3 relative overflow-hidden ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-transform ${
                      isSelected ? 'bg-blue-600 text-white scale-105' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {cat.badge}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 mt-0.5">
                      {cat.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-3">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                    {cat.supportedFormats.slice(0, 3).map(fmt => (
                      <span key={fmt} className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PASSO 2: UPLOAD DO ARQUIVO (SÓ HABILITA QUANDO A OPÇÃO ESTIVER ESCOLHIDA) */}
      {!isReviewing && !importSummary && (
        <div className={`space-y-4 transition-opacity ${selectedCategory ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                Upload do Arquivo (Planilha, PDF ou Fotos)
              </span>
              <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                {selectedCategory ? (
                  <span>
                    Importando para: <strong className="text-blue-700">{MIGRATION_CATEGORIES.find(c => c.id === selectedCategory)?.title}</strong>
                  </span>
                ) : (
                  'Escolha uma opção de migração acima para liberar o upload'
                )}
              </h3>
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer bg-white ${
              selectedFile 
                ? 'border-blue-500 bg-blue-50/20' 
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv,.pdf,.jpg,.jpeg,.png,.webp,.txt"
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-3 max-w-md mx-auto">
                {filePreviewUrl ? (
                  <div className="relative inline-block mx-auto rounded-2xl overflow-hidden border-2 border-white shadow-md max-h-48">
                    <img src={filePreviewUrl} alt="Preview" className="max-h-48 object-contain" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                    {selectedFile.name.endsWith('.pdf') ? (
                      <FileText className="w-8 h-8" />
                    ) : selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx') ? (
                      <FileSpreadsheet className="w-8 h-8" />
                    ) : (
                      <FileImage className="w-8 h-8" />
                    )}
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {selectedFile.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Documento'}
                  </p>
                </div>

                <p className="text-xs text-blue-600 font-bold underline">
                  Clique ou arraste outro arquivo para trocar
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Arraste o arquivo aqui ou clique para selecionar
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Formatos aceitos: Planilhas (<strong>.xlsx, .csv</strong>), Documentos (<strong>.pdf</strong>) e Fotos de fichas (<strong>.jpg, .png, .webp</strong>)
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Reconhecimento ótico e semântico com Gemini 3.5 Flash</span>
                </div>
              </div>
            )}
          </div>

          {/* Erro de Processamento */}
          {processError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>Erro no processamento:</strong> {processError}
              </div>
            </div>
          )}

          {/* Botão de Ação: Processar com Gemini */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={!selectedCategory || !selectedFile || isProcessing}
              onClick={handleProcessFile}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer ${
                !selectedCategory || !selectedFile || isProcessing
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{processStep || 'Processando com Gemini 3.5 Flash...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Reconhecer Conteúdo e Migrar com Gemini 3.5 Flash</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* PASSO 3: TELA DE REVISÃO E VÍNCULO AO CLIENTE */}
      {isReviewing && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Header da Revisão */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                <h3 className="text-base font-bold text-slate-900">
                  Revisão dos Dados Reconhecidos
                </h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {extractedItems.length} {extractedItems.length === 1 ? 'item encontrado' : 'itens encontrados'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Revise os dados abaixo. Itens com clientes cadastrados foram <strong>vinculados automaticamente</strong>. Você pode alterar o vínculo ou desmarcar itens indesejados.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleAllItems(true)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Marcar Todos
              </button>
              <button
                type="button"
                onClick={() => handleToggleAllItems(false)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Desmarcar Todos
              </button>
              <button
                type="button"
                onClick={handleResetFlow}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Lista de Itens Reconhecidos */}
          <div className="space-y-3">
            {extractedItems.map((item, idx) => {
              const isLinked = Boolean(item.matchedStudentId);

              return (
                <div
                  key={item.id || idx}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    item.selected
                      ? 'bg-white border-slate-300 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => handleToggleItemSelection(idx)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />

                    <div className="flex-1 space-y-3 min-w-0">
                      {/* Top Bar do Item: Vínculo com Cliente */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-slate-900">
                            #{idx + 1} {item.name || item.studentName || item.title || item.description}
                          </span>

                          {/* Badge de Vínculo com Cliente */}
                          {isLinked ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Vinculado a: <strong>{item.matchedStudentName}</strong></span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              <span>Novo / Sem vínculo automático</span>
                            </span>
                          )}
                        </div>

                        {/* Dropdown para alterar ou forçar vínculo com aluno */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-400 font-semibold text-[11px]">Vincular a:</span>
                          <select
                            value={item.matchedStudentId || ''}
                            onChange={(e) => handleUpdateItemStudentLink(idx, e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-hidden cursor-pointer max-w-xs"
                          >
                            <option value="">(Nenhum / Criar novo)</option>
                            {students.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.code} - {s.cpf || 'Sem CPF'})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Renderização específica por tipo */}
                      {selectedCategory === 'clientes' && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">CPF</span>
                            <span className="font-semibold text-slate-800">{item.cpf || 'Não informado'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Telefone</span>
                            <span className="font-semibold text-slate-800">{item.phone || 'Não informado'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">E-mail</span>
                            <span className="font-semibold text-slate-800 truncate block">{item.email || 'Não informado'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Plano Sugerido</span>
                            <span className="font-semibold text-blue-700">{item.planName || 'Mensal'} (R$ {item.planPrice || 120})</span>
                          </div>
                        </div>
                      )}

                      {selectedCategory === 'avaliacao_fisica' && (
                        <div className="space-y-2 text-xs">
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Data</span>
                              <span className="font-semibold text-slate-800">{item.date || 'Hoje'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Peso / Altura</span>
                              <span className="font-semibold text-slate-800">{item.weightKg ? `${item.weightKg} kg` : '-'} / {item.heightCm ? `${item.heightCm} cm` : '-'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">% Gordura</span>
                              <span className="font-bold text-emerald-700">{item.bodyFatPercent ? `${item.bodyFatPercent}%` : '-'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Massa Magra</span>
                              <span className="font-semibold text-slate-800">{item.muscleMassKg ? `${item.muscleMassKg} kg` : '-'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Protocolo</span>
                              <span className="font-semibold text-slate-700 truncate block">{item.protocol || 'Pollock / Bioimpedância'}</span>
                            </div>
                          </div>

                          {item.observations && (
                            <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                              "{item.observations}"
                            </p>
                          )}
                        </div>
                      )}

                      {selectedCategory === 'plano_alimentar' && (
                        <div className="space-y-2 text-xs">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Objetivo</span>
                              <span className="font-bold text-amber-700">{item.goal || 'Hipertrofia / Performance'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Calorias Diárias</span>
                              <span className="font-bold text-slate-800">{item.dailyCalories || 2200} kcal</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Proteína / Carbo / Gordura</span>
                              <span className="font-semibold text-slate-700">{item.proteinGrams || 150}g / {item.carbGrams || 250}g / {item.fatGrams || 60}g</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Refeições</span>
                              <span className="font-semibold text-slate-800">{item.meals?.length || 0} refeições discriminadas</span>
                            </div>
                          </div>

                          {item.meals && item.meals.length > 0 && (
                            <div className="bg-slate-50 p-2.5 rounded-xl space-y-1">
                              <span className="text-[10px] font-bold uppercase text-slate-400 block">Exemplo de Refeições:</span>
                              <div className="flex flex-wrap gap-2">
                                {item.meals.slice(0, 4).map((m: any, mIdx: number) => (
                                  <span key={mIdx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
                                    {m.name} {m.time ? `(${m.time})` : ''}: {m.items?.map((it: any) => it.food).join(', ') || 'Alimentos'}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {selectedCategory === 'treinos' && (
                        <div className="space-y-2 text-xs">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Título</span>
                              <span className="font-bold text-purple-700">{item.title}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Objetivo / Nível</span>
                              <span className="font-semibold text-slate-800">{item.goal || 'Hipertrofia'} • {item.level || 'Intermediário'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Frequência</span>
                              <span className="font-semibold text-slate-800">{item.frequency || 'ABC'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Divisões / Fichas</span>
                              <span className="font-semibold text-slate-800">{item.divisions?.length || 1} divisões</span>
                            </div>
                          </div>

                          {item.divisions && item.divisions.length > 0 && (
                            <div className="bg-slate-50 p-2.5 rounded-xl space-y-1.5">
                              {item.divisions.map((div: any, dIdx: number) => (
                                <div key={dIdx} className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                  <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-[10px]">
                                    {div.letter || 'A'}
                                  </span>
                                  <span className="font-bold text-slate-800">{div.name}:</span>
                                  <span className="text-slate-600">
                                    {div.exercises?.length || 0} exercícios ({div.exercises?.slice(0, 3).map((e: any) => e.name).join(', ') || ''}...)
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {selectedCategory === 'financeiro' && (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Tipo</span>
                            <span className={`font-bold uppercase ${item.type === 'despesa' ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {item.type}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Categoria</span>
                            <span className="font-semibold text-slate-800">{item.category || 'Mensalidade'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Valor</span>
                            <span className="font-bold text-slate-900">R$ {Number(item.amount || 0).toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Data / Vencimento</span>
                            <span className="font-semibold text-slate-800">{item.date || 'Hoje'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                            <span className="font-semibold text-slate-700 capitalize">{item.status || 'pago'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Barra de Ação Inferior da Revisão */}
          <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl flex items-center justify-between gap-4">
            <div className="text-xs">
              <span className="text-slate-500">Pronto para importar:</span>{' '}
              <strong className="text-slate-900">{selectedCount} de {extractedItems.length} registros</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetFlow}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Voltar / Cancelar
              </button>

              <button
                type="button"
                disabled={selectedCount === 0}
                onClick={handleConfirmImport}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer ${
                  selectedCount === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirmar e Importar no Sistema ({selectedCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
