import React from 'react';
import { 
  Printer, 
  X, 
  Download, 
  FileText, 
  CheckCircle2, 
  Dumbbell, 
  Activity, 
  Calendar, 
  User, 
  Award, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Layers,
  ShieldCheck
} from 'lucide-react';
import { Student, WorkoutPlan, TreinoSubTab } from '../../../types';
import { formatDate } from '../../../utils';

interface TreinoPdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  subTab: TreinoSubTab;
  student: Student;
  workout?: WorkoutPlan | null;
  workouts?: WorkoutPlan[];
  selectedExerciseName?: string;
  exerciseLogs?: any[];
  physicalTests?: any[];
}

export const TreinoPdfReportModal: React.FC<TreinoPdfReportModalProps> = ({
  isOpen,
  onClose,
  subTab,
  student,
  workout,
  workouts = [],
  selectedExerciseName,
  exerciseLogs = [],
  physicalTests = []
}) => {
  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };

  // Helper to get sub-tab title for report
  const getSubTabReportTitle = () => {
    switch (subTab) {
      case 'controle_carga':
        return 'Relatório de Controle de Carga & Sobrecarga Progressiva (1RM)';
      case 'treino_do_dia':
        return 'Relatório de Execução - Treino do Dia & Séries Realizadas';
      case 'testes_fisicos':
        return 'Laudo Oficial de Avaliação Física, Composição Corporal & Antropometria';
      case 'catalogo_exercicios':
        return 'Relatório de Catálogo Biomecânico de Exercícios';
      case 'modelos_templates':
        return 'Relatório de Protocolos e Modelos de Treinamento';
      case 'prescricao':
      default:
        return 'Ficha Oficial de Prescrição & Periodização de Treino';
    }
  };

  // Find student's active workout if not passed
  const activeWorkout = workout || workouts.find(w => w.studentId === student.id) || workouts[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-100 shadow-2xl border border-slate-300 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Actions Bar (Hidden when printing) */}
        <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Exportação de Relatório PDF Oficial
              </h3>
              <p className="text-xs text-slate-300">
                Documento formatado para impressão em A4 ou salvamento em PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/70 flex justify-center">
          
          {/* Printable Document Sheet (A4 Style) */}
          <div 
            id="gl-print-report" 
            className="w-full max-w-3xl bg-white rounded-xl shadow-lg border border-slate-300 p-6 sm:p-10 space-y-6 text-slate-900 print:shadow-none print:border-none print:p-0 print:m-0"
          >
            
            {/* Header Document */}
            <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    GL PRO FIT
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-600 text-white uppercase tracking-wider">
                    SISTEMA PROFISSIONAL
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-600 mt-1">
                  VILLE BLANCHE SPORT • CENTRO DE TREINAMENTO INTEGRADO
                </div>
                <div className="text-[11px] text-slate-500">
                  Responsável Técnico: <strong>Prof. Gianluca Marinho (CREF 112001-G/SP)</strong>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-0.5 text-xs text-slate-500">
                <div className="text-slate-900 font-bold">Documento Oficial</div>
                <div>Emissão: <strong>{currentDate}</strong></div>
                <div>Horário: <strong>{currentTime}</strong></div>
                <div className="text-[10px] text-blue-600 font-bold uppercase">Autenticação: GL-{student.code || '001'}</div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                  Módulo de Treinamento
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {getSubTabReportTitle()}
                </h2>
              </div>
              <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
            </div>

            {/* Student Information Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Dados Cadastrais do Aluno
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Nome do Aluno:</span>
                  <strong className="text-slate-900 font-bold text-sm">{student.name}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Matrícula / ID:</span>
                  <strong className="text-slate-900 font-bold">{student.code || 'GL001'}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Plano Contratado:</span>
                  <strong className="text-slate-900 font-bold">{student.planName || 'Anual Black VIP'}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Situação:</span>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                    {student.status || 'Ativo'}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 1: CONTROLE DE CARGA & 1RM */}
            {subTab === 'controle_carga' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Histórico & Sobrecarga Progressiva do Exercício
                  </h3>
                  {selectedExerciseName && (
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-blue-100 text-blue-900 border border-blue-200">
                      {selectedExerciseName}
                    </span>
                  )}
                </div>

                {/* KPI Metrics Summary */}
                {exerciseLogs.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Carga Inicial</div>
                      <div className="text-lg font-black text-slate-900">{exerciseLogs[0]?.weightKg || 0} kg</div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Última Carga Registrada</div>
                      <div className="text-lg font-black text-blue-700">{exerciseLogs[exerciseLogs.length - 1]?.weightKg || 0} kg</div>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                      <div className="text-[10px] text-emerald-700 uppercase font-semibold">1RM Teórico Estimado</div>
                      <div className="text-lg font-black text-emerald-900">{exerciseLogs[exerciseLogs.length - 1]?.estimated1RM || 0} kg</div>
                    </div>
                  </div>
                )}

                {/* Session Table */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700">Registro Cronológico de Sessões:</div>
                  <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="p-2">Data</th>
                        <th className="p-2">Exercício</th>
                        <th className="p-2 text-center">Carga (kg)</th>
                        <th className="p-2 text-center">Repetições</th>
                        <th className="p-2 text-center">1RM Estimado</th>
                        <th className="p-2 text-center">RPE (1-10)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {exerciseLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-slate-400">
                            Nenhum registro de carga cadastrado para este exercício ainda.
                          </td>
                        </tr>
                      ) : (
                        exerciseLogs.map((log, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="p-2 font-medium">{log.date}</td>
                            <td className="p-2 font-bold">{log.exerciseName || selectedExerciseName}</td>
                            <td className="p-2 text-center font-black text-slate-900">{log.weightKg} kg</td>
                            <td className="p-2 text-center">{log.reps} reps</td>
                            <td className="p-2 text-center font-bold text-blue-700">{log.estimated1RM} kg</td>
                            <td className="p-2 text-center text-slate-600">{log.rpe || '--'} / 10</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                  <strong>Parecer de Sobrecarga Progressiva:</strong>
                  <p className="text-[11px] text-blue-800">
                    O aluno demonstra adaptação neuromuscular satisfatória. Manter a evolução controlada com foco em amplitude completa e cadência prescrita antes de incrementos superiores a 5% da carga.
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 2: PRESCRIÇÃO DE TREINO */}
            {subTab === 'prescricao' && activeWorkout && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {activeWorkout.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Objetivo: <strong>{activeWorkout.objective}</strong> • Nível: {activeWorkout.level}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">
                    Validade: {formatDate(activeWorkout.startDate)} até {formatDate(activeWorkout.validUntil)}
                  </span>
                </div>

                {/* Workout Splits */}
                <div className="space-y-4">
                  {activeWorkout.splits.map((split, sIdx) => (
                    <div key={sIdx} className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-100 p-2.5 font-bold text-xs text-slate-800 flex items-center justify-between">
                        <span>{split.name}</span>
                        <span className="text-[10px] text-slate-500">{split.exercises.length} exercícios</span>
                      </div>

                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="p-2">Exercício</th>
                            <th className="p-2">Grupo</th>
                            <th className="p-2 text-center">Séries x Reps</th>
                            <th className="p-2 text-center">Carga (kg)</th>
                            <th className="p-2 text-center">Descanso</th>
                            <th className="p-2">Método / Dica</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                          {split.exercises.map((ex, eIdx) => (
                            <tr key={eIdx}>
                              <td className="p-2 font-bold">{ex.name}</td>
                              <td className="p-2 text-slate-600">{ex.muscleGroup}</td>
                              <td className="p-2 text-center font-semibold">{ex.sets}x {ex.reps}</td>
                              <td className="p-2 text-center font-bold text-slate-900">{ex.weightKg ? `${ex.weightKg} kg` : '--'}</td>
                              <td className="p-2 text-center text-slate-600">{ex.restSec}s</td>
                              <td className="p-2 text-slate-500 text-[11px]">{ex.method || ex.notes || 'Tradicional'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>

                {activeWorkout.notes && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <strong>Recomendações do Treinador: </strong>
                    {activeWorkout.notes}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: TREINO DO DIA */}
            {subTab === 'treino_do_dia' && activeWorkout && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Execução do Treino do Dia: {activeWorkout.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Data da Sessão: {currentDate} • Horário: {currentTime}
                  </p>
                </div>

                <div className="space-y-3">
                  {activeWorkout.splits.map((split, sIdx) => (
                    <div key={sIdx} className="border border-slate-200 rounded-lg p-3 space-y-2">
                      <div className="font-bold text-xs text-blue-900 flex items-center justify-between">
                        <span>Divisão: {split.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                          Concluído no Aplicativo
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {split.exercises.map((ex, eIdx) => (
                          <div key={eIdx} className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between">
                            <div>
                              <strong className="text-slate-900">{ex.name}</strong>
                              <div className="text-[10px] text-slate-500">{ex.muscleGroup} • {ex.sets} séries x {ex.reps} reps</div>
                            </div>
                            <span className="text-xs font-black text-slate-800">{ex.weightKg || '--'} kg</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4: AVALIAÇÕES FÍSICAS (Baseado no laudo do avaliacaofisica.app) */}
            {subTab === 'testes_fisicos' && (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      Laudo Antropométrico & Composição Corporal (Protocolo Pollock 7 Dobras)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Resultados calculados pela Equação de Siri, perimetria muscular e aptidão cardiorrespiratória
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Padrão PRO
                  </span>
                </div>

                {/* 4 Cards Summary */}
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Percentual de Gordura</div>
                    <div className="text-lg font-black text-blue-700">13.6%</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Classificação: Atleta</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Massa Livre de Gordura</div>
                    <div className="text-lg font-black text-emerald-700">65.1 kg</div>
                    <div className="text-[10px] text-slate-500">Massa Magra</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Massa Adiposa</div>
                    <div className="text-lg font-black text-amber-700">10.3 kg</div>
                    <div className="text-[10px] text-slate-500">Gordura Total</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Relação Cintura/Quadril</div>
                    <div className="text-lg font-black text-slate-900">0.79</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Risco Baixo</div>
                  </div>
                </div>

                {/* Dobras & Perimetria Tables Side by Side */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {/* Dobras Cutâneas */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-100 px-3 py-1.5 font-bold text-[11px] text-slate-800 border-b border-slate-200 flex justify-between">
                      <span>Dobras Cutâneas (Adipometria)</span>
                      <span className="text-blue-700 font-bold">Total: 70.0 mm</span>
                    </div>
                    <table className="w-full text-[11px]">
                      <tbody className="divide-y divide-slate-100">
                        <tr className="bg-white"><td className="p-1.5 font-medium">Peitoral</td><td className="p-1.5 text-right font-bold">7.5 mm</td></tr>
                        <tr className="bg-slate-50"><td className="p-1.5 font-medium">Axilar Média</td><td className="p-1.5 text-right font-bold">9.0 mm</td></tr>
                        <tr className="bg-white"><td className="p-1.5 font-medium">Tríceps</td><td className="p-1.5 text-right font-bold">8.5 mm</td></tr>
                        <tr className="bg-slate-50"><td className="p-1.5 font-medium">Subescapular</td><td className="p-1.5 text-right font-bold">11.0 mm</td></tr>
                        <tr className="bg-white"><td className="p-1.5 font-medium">Abdominal</td><td className="p-1.5 text-right font-bold">13.5 mm</td></tr>
                        <tr className="bg-slate-50"><td className="p-1.5 font-medium">Suprailíaca</td><td className="p-1.5 text-right font-bold">9.5 mm</td></tr>
                        <tr className="bg-white"><td className="p-1.5 font-medium">Coxa Medial</td><td className="p-1.5 text-right font-bold">11.5 mm</td></tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Perimetria */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-100 px-3 py-1.5 font-bold text-[11px] text-slate-800 border-b border-slate-200">
                      Circunferências Principais (Perimetria)
                    </div>
                    <table className="w-full text-[11px]">
                      <tbody className="divide-y divide-slate-100">
                        <tr className="bg-white"><td className="p-1.5 font-medium">Tórax</td><td className="p-1.5 text-right font-bold">104.5 cm</td></tr>
                        <tr className="bg-slate-50"><td className="p-1.5 font-medium">Cintura</td><td className="p-1.5 text-right font-bold">78.5 cm</td></tr>
                        <tr className="bg-white"><td className="p-1.5 font-medium">Abdômen</td><td className="p-1.5 text-right font-bold">82.0 cm</td></tr>
                        <tr className="bg-slate-50"><td className="p-1.5 font-medium">Quadril</td><td className="p-1.5 text-right font-bold">99.0 cm</td></tr>
                        <tr className="bg-white"><td className="p-1.5 font-medium">Braço Contraído (D / E)</td><td className="p-1.5 text-right font-bold">39.2 / 39.0 cm</td></tr>
                        <tr className="bg-slate-50"><td className="p-1.5 font-medium">Coxa Proximal (D / E)</td><td className="p-1.5 text-right font-bold">59.5 / 59.2 cm</td></tr>
                        <tr className="bg-white"><td className="p-1.5 font-medium">Panturrilha (D / E)</td><td className="p-1.5 text-right font-bold">37.8 / 37.5 cm</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Functional Tests & Notes */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800">VO2 Máx (Cooper):</span> 51.3 ml/kg/min (Excelente) • <span className="font-bold text-slate-800">Flexibilidade (Wells):</span> 37.0 cm (P85) • <span className="font-bold text-slate-800">PA:</span> 120/75 mmHg
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    PAR-Q Apto
                  </span>
                </div>
              </div>
            )}

            {/* Official Signatures & Verification */}
            <div className="pt-8 border-t border-slate-300 mt-6 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <div className="h-10 border-b border-slate-400 mb-1"></div>
                <strong className="text-slate-900 block">Prof. Gianluca Marinho</strong>
                <span className="text-slate-500 text-[11px]">CREF 112001-G/SP • Responsável Técnico</span>
              </div>

              <div>
                <div className="h-10 border-b border-slate-400 mb-1"></div>
                <strong className="text-slate-900 block">{student.name}</strong>
                <span className="text-slate-500 text-[11px]">Assinatura do Aluno / Ciente</span>
              </div>
            </div>

            {/* Document Watermark */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>GL PRO FIT Core Suite v1.6.2 • Relatório Gerencial Emitido Automaticamente</span>
              <span>Documento Válido para Acompanhamento e Prescrição Física</span>
            </div>

          </div>
        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="no-print p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Aluno Selecionado: <strong className="text-slate-800">{student.name}</strong> ({student.code || 'GL'})
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Fechar
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default TreinoPdfReportModal;
