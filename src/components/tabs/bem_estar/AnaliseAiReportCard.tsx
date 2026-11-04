import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  Share2, 
  Check, 
  Target, 
  ShieldAlert, 
  Lightbulb, 
  Clock, 
  FileText, 
  Activity, 
  Printer,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  AnaliseAiReport, 
  SelectedChartSummary, 
  AnaliseGlobalContext, 
  fetchAnaliseAiReport 
} from '../../../services/analiseAiService';

interface AnaliseAiReportCardProps {
  selectedChartSummaries: SelectedChartSummary[];
  globalContext: AnaliseGlobalContext;
  totalAvailableChartsCount: number;
}

export const AnaliseAiReportCard: React.FC<AnaliseAiReportCardProps> = ({
  selectedChartSummaries,
  globalContext,
  totalAvailableChartsCount
}) => {
  const [report, setReport] = useState<AnaliseAiReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastAnalyzedIds, setLastAnalyzedIds] = useState<string>('');

  const currentSelectionKey = useMemo(() => {
    return selectedChartSummaries.map(c => c.id).sort().join(',');
  }, [selectedChartSummaries]);

  const hasSelectionChanged = useMemo(() => {
    if (!lastAnalyzedIds) return false;
    return lastAnalyzedIds !== currentSelectionKey;
  }, [lastAnalyzedIds, currentSelectionKey]);

  // Função para disparar a geração do relatório
  const handleGenerate = useCallback(async () => {
    if (selectedChartSummaries.length === 0) return;
    setIsLoading(true);
    try {
      const generated = await fetchAnaliseAiReport(selectedChartSummaries, globalContext);
      setReport(generated);
      setLastAnalyzedIds(currentSelectionKey);
    } catch (err) {
      console.error('Erro ao gerar relatório de análise:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChartSummaries, globalContext, currentSelectionKey]);

  // Geração automática inicial ou quando o usuário carrega a página
  useEffect(() => {
    if (!report && selectedChartSummaries.length > 0) {
      handleGenerate();
    }
  }, [handleGenerate, report, selectedChartSummaries.length]);

  // Copiar relatório formatado
  const handleCopyReport = () => {
    if (!report) return;
    const textToCopy = `*GL PRO FIT - LAUDO DE FISIOLOGIA & CONTROLE DE CARGA (IA)*
📅 Data: ${report.generatedAt}
📊 Gráficos Analisados (${report.analyzedChartsCount}): ${report.analyzedChartTitles.join(', ')}
⭐ Score Geral de Adaptação: ${report.score}/100 (${report.statusSummary})

📋 *RESUMO EXECUTIVO:*
${report.executiveSummary}

🔍 *DIAGNÓSTICO DOS INDICADORES:*
${report.diagnostics.map(d => `• ${d.title}: ${d.diagnostic} - ${d.clinicalInterpretation}`).join('\n')}

🎯 *PLANO DE AÇÃO PARA O TREINADOR:*
${report.actionPlan.map(a => `• [${a.priority.toUpperCase()}] ${a.title}: ${a.description} (${a.timeframe})`).join('\n')}

🔮 *SIMULAÇÃO:*
• Se intervir: ${report.decisionSimulation.ifActionTaken}
• Se inerte: ${report.decisionSimulation.ifNoAction}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Compartilhar no WhatsApp
  const handleShareWhatsApp = () => {
    if (!report) return;
    const message = `*Relatório da IA - Análise de Gráficos (${report.analyzedChartsCount} Indicadores)*%0A%0A*Score de Prontidão:* ${report.score}/100 - ${report.statusSummary}%0A%0A*Gráficos:* ${report.analyzedChartTitles.join(', ')}%0A%0A*Diagnóstico:*%0A${encodeURIComponent(report.executiveSummary)}%0A%0A_Gerado via GL PRO FIT Enterprise Suite_`;
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  return (
    <div id="relatorio-ia-analise" className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden space-y-0 animate-in fade-in duration-300">
      
      {/* 1. Header do Card com Gradiente e Selo da IA */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 shadow-2xs backdrop-blur-xs">
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            </span>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              Relatório da IA • Análise dos Gráficos Selecionados
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {report?.model || 'Gemini 3.8 Flash'}
            </span>
          </div>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Laudo fisiológico e diagnóstico de sobrecarga gerado sob demanda estritamente para os gráficos marcados no filtro.
          </p>
        </div>

        {/* Ações do Topo */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || selectedChartSummaries.length === 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
              isLoading 
                ? 'bg-blue-600/50 text-blue-200 cursor-not-allowed'
                : hasSelectionChanged
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black animate-bounce'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
            title="Atualizar laudo com a IA com base nos gráficos selecionados"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Analisando...' : hasSelectionChanged ? 'Atualizar com Gráficos Atuais' : 'Regerar Análise'}</span>
          </button>

          {report && (
            <>
              <button
                type="button"
                onClick={handleCopyReport}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Copiar relatório completo"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                title="Compartilhar resumo via WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. Barra de Status de Escopo (Confirmação Visual dos Gráficos que a IA Está Analisando) */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            Escopo Analisado pela IA:
          </span>
          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
            {selectedChartSummaries.length === totalAvailableChartsCount
              ? `Todos os ${totalAvailableChartsCount} gráficos disponíveis`
              : `${selectedChartSummaries.length} de ${totalAvailableChartsCount} gráfico(s) selecionado(s)`}
          </span>
          {hasSelectionChanged && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              Seleção alterada. Clique em Atualizar para novo laudo.
            </span>
          )}
        </div>

        {/* Chips dos Gráficos Analisados */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 custom-scrollbar">
          {selectedChartSummaries.map(c => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 shrink-0"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
              <span className="truncate max-w-[120px]">{c.title}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3. Corpo Principal do Relatório */}
      <div className="p-5 sm:p-6 space-y-6">
        {isLoading ? (
          <div className="py-16 text-center space-y-4">
            <div className="inline-flex p-4 rounded-3xl bg-blue-50 text-blue-600 border border-blue-100 animate-pulse">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                A Inteligência Artificial está analisando os {selectedChartSummaries.length} gráfico(s) selecionados...
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Processando séries temporais, oscilações de carga, desvios e calculando diagnóstico fisiológico.
              </p>
            </div>
          </div>
        ) : !report ? (
          <div className="py-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Nenhum laudo gerado ainda</h4>
            <p className="text-xs text-slate-500">
              Clique no botão "Gerar Relatório da IA" acima para processar a análise dos gráficos selecionados.
            </p>
            <button
              type="button"
              onClick={handleGenerate}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
            >
              Gerar Relatório Agora
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Bloco 1: Score de Adaptação Biológica & Resumo Executivo */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              {/* Score Circular / Card */}
              <div className={`md:col-span-4 p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${
                report.status === 'otimo'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : report.status === 'moderado'
                  ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                  : report.status === 'alerta'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-rose-50/70 border-rose-200 text-rose-950'
              }`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider opacity-75">
                      Score de Prontidão dos Dados
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      report.status === 'otimo' ? 'bg-emerald-600 text-white' :
                      report.status === 'moderado' ? 'bg-blue-600 text-white' :
                      report.status === 'alerta' ? 'bg-amber-600 text-white' :
                      'bg-rose-600 text-white'
                    }`}>
                      {report.status}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-black">{report.score}</span>
                    <span className="text-xs font-bold opacity-75">/ 100</span>
                  </div>

                  <p className="text-xs font-extrabold mt-1">
                    {report.statusSummary}
                  </p>
                </div>

                <div className="text-[10px] opacity-75 pt-2 border-t border-current/10">
                  Calculado cruzando os {report.analyzedChartsCount} gráfico(s) selecionados com modelos de Foster e Gabbett.
                </div>
              </div>

              {/* Resumo Executivo */}
              <div className="md:col-span-8 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-200/60">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    Parecer Técnico do Fisiologista
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal mt-2.5">
                    {report.executiveSummary}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Gerado em {report.generatedAt}</span>
                </div>
              </div>
            </div>

            {/* Bloco 2: Diagnóstico Detalhado por Gráfico Selecionado */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Diagnóstico Específico por Indicador ({report.diagnostics.length})
                </h4>
                <span className="text-[10px] text-slate-500 font-semibold">
                  Focado estritamente na seleção atual
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.diagnostics.map((diag, idx) => (
                  <div 
                    key={diag.chartId || idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        {diag.title}
                      </h5>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        diag.trend === 'positivo' ? 'bg-emerald-100 text-emerald-800' :
                        diag.trend === 'alerta' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {diag.trend === 'positivo' ? '✓ Favorável' : diag.trend === 'alerta' ? '⚠ Atenção' : '— Estável'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-semibold leading-snug">
                      {diag.diagnostic}
                    </p>

                    <p className="text-[11px] text-slate-500 leading-relaxed font-normal bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <strong>Interpretação:</strong> {diag.clinicalInterpretation}
                    </p>

                    {diag.suggestedAction && (
                      <div className="text-[11px] text-blue-900 font-bold flex items-center gap-1 pt-1">
                        <ChevronRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{diag.suggestedAction}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bloco 3: Constatações Chave & Riscos Imediatos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Pontos Fortes / Constatações */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Principais Constatações da Amostra
                </h4>
                <ul className="space-y-2">
                  {report.keyFindings.map((finding, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Riscos Críticos / Cuidados */}
              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-rose-950 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Riscos Fisiológicos & Alertas de Sobrecarga
                </h4>
                <ul className="space-y-2">
                  {report.criticalRisks.map((risk, idx) => (
                    <li key={idx} className="text-xs text-rose-900 flex items-start gap-2 leading-relaxed font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bloco 4: Plano de Ação para o Treinador / Profissional */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                Plano de Ação e Prescrição Recomendada para o Treinador
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.actionPlan.map((action, idx) => (
                  <div
                    key={action.id || idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          action.priority === 'alta' ? 'bg-rose-100 text-rose-800' :
                          action.priority === 'media' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          Prioridade {action.priority}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{action.timeframe}</span>
                      </div>
                      <h5 className="text-xs font-extrabold text-slate-900 leading-snug">
                        {action.title}
                      </h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                        {action.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{action.expectedOutcome}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloco 5: Simulação Preditiva de Tomada de Decisão */}
            {report.decisionSimulation && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    Simulação Preditiva de Decisão • Próximos 7 a 14 Dias
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {report.decisionSimulation.scenario}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1">
                    <span className="text-[10px] font-black uppercase text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Se a Recomendação for Aplicada:
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      {report.decisionSimulation.ifActionTaken}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] font-black uppercase text-rose-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      Se Nenhuma Mudança for Feita:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {report.decisionSimulation.ifNoAction}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
};
