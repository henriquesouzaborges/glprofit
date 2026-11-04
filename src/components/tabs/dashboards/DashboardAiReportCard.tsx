import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Sliders, 
  Copy, 
  Share2, 
  Check, 
  Target, 
  ShieldAlert, 
  Lightbulb, 
  Clock, 
  FileText, 
  Activity, 
  Save, 
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { Student, AccessLog, FinancialTransaction, Lead, ClassSession, WorkoutPlan } from '../../../types';
import { 
  DashboardAiReport, 
  SubTabGoalsConfig, 
  DEFAULT_GOALS_BY_SUBTAB, 
  SUBTAB_TITLES, 
  loadGoalsConfig, 
  saveGoalsConfig, 
  extractSubTabLiveMetrics, 
  fetchDashboardAiReport 
} from './aiDashboardService';

interface DashboardAiReportCardProps {
  subTab: string;
  students: Student[];
  accessLogs: AccessLog[];
  transactions: FinancialTransaction[];
  leads?: Lead[];
  classes?: ClassSession[];
  workouts?: WorkoutPlan[];
  onNavigateToTab?: (tab: string) => void;
}

export const DashboardAiReportCard: React.FC<DashboardAiReportCardProps> = ({
  subTab,
  students,
  accessLogs,
  transactions,
  leads = [],
  classes = [],
  workouts = [],
  onNavigateToTab
}) => {
  const [goalsConfig, setGoalsConfig] = useState<SubTabGoalsConfig>(() => loadGoalsConfig(subTab));
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [report, setReport] = useState<DashboardAiReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form edit states inside the config drawer
  const [tempNotes, setTempNotes] = useState(goalsConfig.customNotes);
  const [tempFocus, setTempFocus] = useState(goalsConfig.focusMode);
  const [tempGoals, setTempGoals] = useState(goalsConfig.goals);

  // Sync configuration when subTab changes
  useEffect(() => {
    const loaded = loadGoalsConfig(subTab);
    setGoalsConfig(loaded);
    setTempNotes(loaded.customNotes);
    setTempFocus(loaded.focusMode);
    setTempGoals(loaded.goals);
    setIsConfigOpen(false);
  }, [subTab]);

  // Extract live metrics for this subTab
  const liveMetrics = useMemo(() => {
    return extractSubTabLiveMetrics(subTab, {
      students,
      accessLogs,
      transactions,
      leads,
      classes,
      workouts
    });
  }, [subTab, students, accessLogs, transactions, leads, classes, workouts]);

  // Load / Generate AI Report
  const handleGenerateReport = useCallback(async (customConfig?: SubTabGoalsConfig) => {
    setIsLoading(true);
    const activeConfig = customConfig || goalsConfig;
    try {
      const generated = await fetchDashboardAiReport(subTab, liveMetrics, activeConfig);
      setReport(generated);
    } catch (err) {
      console.error('Falha ao gerar relatório:', err);
    } finally {
      setIsLoading(false);
    }
  }, [subTab, liveMetrics, goalsConfig]);

  // Initial generation when subTab changes
  useEffect(() => {
    handleGenerateReport();
  }, [handleGenerateReport]);

  // Save customized goals
  const handleSaveConfig = () => {
    const newConfig: SubTabGoalsConfig = {
      subTab,
      focusMode: tempFocus,
      customNotes: tempNotes,
      goals: tempGoals
    };
    saveGoalsConfig(subTab, newConfig);
    setGoalsConfig(newConfig);
    setIsConfigOpen(false);
    // Re-run AI analysis with updated goals
    handleGenerateReport(newConfig);
  };

  // Reset to system defaults
  const handleResetDefaults = () => {
    const defaults = DEFAULT_GOALS_BY_SUBTAB[subTab] || {
      subTab,
      focusMode: 'equilibrado',
      customNotes: '',
      goals: []
    };
    setTempFocus(defaults.focusMode);
    setTempNotes(defaults.customNotes);
    setTempGoals(defaults.goals);
    saveGoalsConfig(subTab, defaults);
    setGoalsConfig(defaults);
    handleGenerateReport(defaults);
  };

  // Copy report to clipboard
  const handleCopyReport = () => {
    if (!report) return;

    const text = `📊 RELATÓRIO & SUGESTÕES DE IA - ${report.subTabTitle.toUpperCase()}
Data da Análise: ${report.generatedAt} | Modelo: ${report.model}
Saúde Operacional: ${report.healthScore}/100 (${report.statusSummary})

📝 RESUMO EXECUTIVO:
${report.executiveSummary}

🎯 COMPARATIVO DE METAS:
${report.goalsComparison.map(g => `• ${g.goalName}: Atual ${g.currentValue} | Meta ${g.targetValue} (${g.status.toUpperCase()}) - ${g.comment}`).join('\n')}

⭐ PONTOS FORTES:
${report.keyStrengths.map(s => `✓ ${s}`).join('\n')}

⚠️ PONTOS DE ATENÇÃO & RISCOS:
${report.criticalRisks.map(r => `! ${r}`).join('\n')}

💡 SUGESTÕES PRÁTICAS PARA TOMADA DE DECISÃO:
${report.actionableSuggestions.map((a, i) => `${i + 1}. [${a.priority.toUpperCase()}] ${a.title} (${a.timeframe})\n   Impacto: ${a.expectedImpact}\n   Ação: ${a.description}`).join('\n\n')}

🔮 SIMULAÇÃO DE CENÁRIOS:
Cenário: ${report.decisionSimulation.scenario}
• Se agir: ${report.decisionSimulation.ifActionTaken}
• Se inerte: ${report.decisionSimulation.ifNoAction}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Share to WhatsApp
  const handleShareWhatsApp = () => {
    if (!report) return;
    const brief = `*RELATÓRIO E SUGESTÕES DA IA - ${report.subTabTitle.toUpperCase()}*\n` +
      `*Diagnóstico:* ${report.statusSummary} (Score: ${report.healthScore}/100)\n\n` +
      `*Resumo:* ${report.executiveSummary.slice(0, 280)}...\n\n` +
      `*Principais Ações Recomendadas:*\n` +
      report.actionableSuggestions.slice(0, 2).map(a => `• *${a.title}*: ${a.expectedImpact}`).join('\n') +
      `\n\n_Gerado ao vivo pelo GL PRO FIT Suite com ${report.model}_`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(brief)}`;
    window.open(url, '_blank');
  };

  const subTabLabel = SUBTAB_TITLES[subTab] || subTab.toUpperCase();

  return (
    <div className="mt-8 border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden transition-all duration-200">
      {/* Top Banner with AI Glow */}
      <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-5 sm:p-6 text-white overflow-hidden">
        {/* Subtle decorative background elements */}
        <div className="absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -top-12 h-36 w-36 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-200 border border-blue-400/30">
                <Sparkles className="h-3.5 w-3.5 text-blue-300 animate-pulse" />
                Inteligência Artificial Live
              </span>
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-slate-300">
                Sub-aba: {subTabLabel}
              </span>
              {report?.model && (
                <span className="hidden sm:inline-block rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] font-mono text-slate-300 border border-slate-700">
                  {report.model}
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              Relatório & Sugestões Estratégicas
            </h3>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Diagnóstico executivo gerado ao vivo cruzando todos os dados reais da sub-aba com as metas e preferências pré-configuradas para subsidiar decisões imediatas.
            </p>
          </div>

          {/* Action Bar & Health Score Pill */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
            {report && (
              <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3.5 py-2">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Saúde do Setor</div>
                  <div className="text-xs font-bold text-white flex items-center gap-1 justify-end">
                    <span className={`h-2 w-2 rounded-full ${
                      report.healthScore >= 80 ? 'bg-emerald-400' : report.healthScore >= 60 ? 'bg-amber-400' : 'bg-red-400'
                    }`} />
                    {report.healthScore}/100
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                isConfigOpen 
                  ? 'bg-blue-600 text-white border-blue-500 shadow-xs' 
                  : 'bg-white/10 hover:bg-white/15 text-white border-white/15'
              }`}
              title="Ajustar Metas e Preferências desta sub-aba"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Metas & Preferências</span>
            </button>

            <button
              onClick={() => handleGenerateReport()}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-xs transition-all disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Analisando...' : 'Atualizar com IA'}</span>
            </button>

            {report && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopyReport}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-colors"
                  title="Copiar relatório completo"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="p-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white border border-emerald-500/40 transition-colors"
                  title="Compartilhar resumo via WhatsApp"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer: Painel de Metas & Preferências Pré-configuradas */}
      {isConfigOpen && (
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                Configurar Metas e Preferências Pré-configuradas ({subTabLabel})
              </h4>
              <p className="text-xs text-slate-500">
                Ajuste os valores de referência e diretrizes que a IA utilizará para confrontar os dados reais e propor decisões.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restaurar Padrões</span>
              </button>
              <button
                onClick={handleSaveConfig}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Salvar & Reanalisar</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Modo de Foco Estratégico */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Modo de Foco da Análise
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Define a prioridade das recomendações da IA.
              </p>
              <div className="space-y-1.5">
                {[
                  { id: 'equilibrado', label: 'Equilibrado (Recomendado)', desc: 'Crescimento com controle de margem' },
                  { id: 'crescimento', label: 'Crescimento Agressivo', desc: 'Foco em novas vendas e atração' },
                  { id: 'eficiencia_custo', label: 'Eficiência & Redução de Custos', desc: 'Enxugamento de despesas e retenção' },
                ].map((mode) => (
                  <label
                    key={mode.id}
                    className={`flex items-start gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                      tempFocus === mode.id 
                        ? 'border-blue-600 bg-blue-50/60 font-semibold text-blue-900' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="focusMode"
                      value={mode.id}
                      checked={tempFocus === mode.id}
                      onChange={() => setTempFocus(mode.id as any)}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div>{mode.label}</div>
                      <div className="text-[10px] text-slate-500">{mode.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Metas Numéricas Customizáveis */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Metas Operacionais do Setor
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                Personalize os valores esperados para cada métrica-chave desta sub-aba.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tempGoals.map((goal, index) => (
                  <div key={goal.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>{goal.label}</span>
                      <span className="text-[10px] text-slate-500">Unidade: {goal.unit}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={goal.targetValue}
                        onChange={(e) => {
                          const updated = [...tempGoals];
                          updated[index] = { ...goal, targetValue: e.target.value };
                          setTempGoals(updated);
                        }}
                        placeholder="Ex: 35%"
                        className="w-full text-xs font-mono font-semibold px-2.5 py-1 rounded-md border border-slate-300 bg-white focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{goal.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Diretrizes Adicionais do Profissional */}
          <div className="mt-3 bg-white p-3.5 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Diretrizes & Notas Específicas do Profissional para a IA
            </label>
            <input
              type="text"
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}
              placeholder="Ex: Neste trimestre nosso foco prioritário é a recuperação dos alunos da turma da manhã..."
              className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:border-blue-600 text-slate-800"
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Loading Skeleton */}
        {isLoading && !report && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
              <Sparkles className="h-5 w-5 text-blue-600 absolute inset-0 m-auto" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Analisando todos os dados de {subTabLabel}...</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparando indicadores com as metas pré-configuradas e formulando recomendações de decisão.
              </p>
            </div>
          </div>
        )}

        {report && (
          <>
            {/* Executive Summary & Diagnostic Highlight */}
            <div className={`p-4 sm:p-5 rounded-xl border ${
              report.status === 'otimo' 
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' 
                : report.status === 'atencao'
                ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                : 'bg-red-50/60 border-red-200 text-red-950'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-black/5">
                <div className="flex items-center gap-2">
                  {report.status === 'otimo' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                  )}
                  <span className="text-xs font-black uppercase tracking-wider">
                    Diagnóstico Executivo: {report.statusSummary}
                  </span>
                </div>
                <span className="text-[11px] font-medium opacity-75">
                  Atualizado em {report.generatedAt}
                </span>
              </div>

              <p className="text-xs sm:text-sm mt-3 leading-relaxed font-normal text-slate-800">
                {report.executiveSummary}
              </p>
            </div>

            {/* Metas Pré-configuradas vs Realizado */}
            {report.goalsComparison && report.goalsComparison.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-blue-600" />
                    Confronto: Metas Pré-configuradas vs Indicadores Reais
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Modo: <strong className="capitalize">{goalsConfig.focusMode.replace('_', ' ')}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {report.goalsComparison.map((item) => {
                    const isSuccess = item.status === 'atingida';
                    const isWarning = item.status === 'em_risco' || item.status === 'abaixo';

                    return (
                      <div 
                        key={item.goalId || item.goalName} 
                        className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors space-y-2"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-bold text-slate-800 leading-tight">
                            {item.goalName}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            isSuccess 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : isWarning 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between pt-1">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Atual</span>
                            <span className="text-base font-black text-slate-900 font-mono">{item.currentValue}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 block">Meta</span>
                            <span className="text-xs font-bold text-slate-600 font-mono">{item.targetValue}</span>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 leading-tight">
                          <strong className={isSuccess ? 'text-emerald-700' : isWarning ? 'text-amber-700' : 'text-blue-700'}>
                            {item.deviation}:
                          </strong>{' '}
                          {item.comment}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pontos Fortes e Riscos Imediatos (2 Colunas) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Pontos Fortes */}
              <div className="bg-emerald-50/30 border border-emerald-200/80 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Pontos Fortes & Vantagens Competitivas
                </div>
                <ul className="space-y-2">
                  {report.keyStrengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-snug">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Riscos Imediatos */}
              <div className="bg-amber-50/30 border border-amber-200/80 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Riscos Imediatos & Pontos de Atenção
                </div>
                <ul className="space-y-2">
                  {report.criticalRisks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-snug">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sugestões Práticas para Tomada de Decisão */}
            {report.actionableSuggestions && report.actionableSuggestions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-blue-600" />
                    Plano de Ação Recomendado para Decisão do Profissional
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {report.actionableSuggestions.length} ações priorizadas
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {report.actionableSuggestions.map((sug) => {
                    const isHigh = sug.priority === 'alta';
                    const isMedium = sug.priority === 'media';

                    return (
                      <div 
                        key={sug.id || sug.title}
                        className="flex flex-col justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isHigh 
                                ? 'bg-red-100 text-red-800 border border-red-200' 
                                : isMedium 
                                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              Prioridade {sug.priority}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {sug.timeframe}
                            </span>
                          </div>

                          <h5 className="text-xs font-bold text-slate-900 leading-snug">
                            {sug.title}
                          </h5>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {sug.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          <div className="text-[11px] text-slate-700 font-medium">
                            <strong className="text-blue-900">Impacto Estimado:</strong>{' '}
                            {sug.expectedImpact}
                          </div>

                          {sug.targetTab && onNavigateToTab && (
                            <button
                              onClick={() => onNavigateToTab(sug.targetTab!)}
                              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold bg-slate-900 hover:bg-blue-900 text-white transition-colors"
                            >
                              <span>Executar na aba {sug.targetTab.toUpperCase()}</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Simulação de Decisão (Cenário Se Tomar Ação vs Se Não Tomar) */}
            {report.decisionSimulation && (
              <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-blue-300">
                    Simulação Preditiva de Decisão: {report.decisionSimulation.scenario}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 space-y-1">
                    <span className="font-bold text-emerald-300 flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Se o profissional aplicar as ações:
                    </span>
                    <p className="text-emerald-100/90 leading-relaxed">
                      {report.decisionSimulation.ifActionTaken}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/40 space-y-1">
                    <span className="font-bold text-red-300 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Se nenhuma decisão for tomada (inércia):
                    </span>
                    <p className="text-red-100/90 leading-relaxed">
                      {report.decisionSimulation.ifNoAction}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
