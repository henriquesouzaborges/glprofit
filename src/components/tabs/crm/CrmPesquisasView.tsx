import React, { useState, useMemo } from 'react';
import { 
  HeartHandshake, 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  Users, 
  CheckCircle2, 
  Award,
  Sparkles
} from 'lucide-react';
import { SatisfactionSurveyResponse, Lead } from '../../../types';
import { sendWhatsAppMessage } from '../../../utils';

interface CrmPesquisasViewProps {
  surveys: SatisfactionSurveyResponse[];
  leads: Lead[];
  onAddSurveyResponse: (response: SatisfactionSurveyResponse) => void;
  onResolveSurvey: (surveyId: string) => void;
}

export const CrmPesquisasView: React.FC<CrmPesquisasViewProps> = ({
  surveys,
  leads,
  onAddSurveyResponse,
  onResolveSurvey
}) => {
  const [filterType, setFilterType] = useState<string>('todos');
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState('');
  const [selectedSurveyType, setSelectedSurveyType] = useState('Pós-Aula Experimental');

  // Stats
  const stats = useMemo(() => {
    const total = surveys.length;
    if (total === 0) return { nps: 0, promotores: 0, neutros: 0, detratores: 0, avgAtendimento: 5, avgEstrutura: 5, avgProf: 5, avgLimpeza: 5 };

    const promotores = surveys.filter(s => s.score >= 9).length;
    const neutros = surveys.filter(s => s.score >= 7 && s.score <= 8).length;
    const detratores = surveys.filter(s => s.score <= 6).length;

    const nps = Math.round(((promotores - detratores) / total) * 100);

    const avgAtendimento = (surveys.reduce((sum, s) => sum + s.categoryRating.atendimento, 0) / total).toFixed(1);
    const avgEstrutura = (surveys.reduce((sum, s) => sum + s.categoryRating.estrutura, 0) / total).toFixed(1);
    const avgProf = (surveys.reduce((sum, s) => sum + s.categoryRating.professor, 0) / total).toFixed(1);
    const avgLimpeza = (surveys.reduce((sum, s) => sum + s.categoryRating.limpeza, 0) / total).toFixed(1);

    return { total, nps, promotores, neutros, detratores, avgAtendimento, avgEstrutura, avgProf, avgLimpeza };
  }, [surveys]);

  const filteredSurveys = filterType === 'todos' 
    ? surveys 
    : surveys.filter(s => s.respondentType === filterType);

  const handleSendSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find(l => l.name === selectedLead);
    if (!lead) return;

    sendWhatsAppMessage(
      lead.phone,
      `Olá ${lead.name}! 🌟 Como foi sua experiência na VB SPORT? Poderia responder nossa rápida pesquisa de 3 perguntas para continuarmos evoluindo? Link: https://vbsport.com.br/feedback/${lead.id}`
    );
    setShowSendModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">NPS Global</span>
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">+{stats.nps}</span>
            <span className="text-2xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Zona de Excelência</span>
          </div>
          <span className="text-2xs text-slate-500 mt-1 block">Meta VB SPORT: &gt; +75</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Avaliação dos Professores</span>
            <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.avgProf} <span className="text-sm font-normal text-slate-400">/ 5.0</span></div>
          <span className="text-2xs text-slate-500">Acolhimento e técnica</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Recepção & Atendimento</span>
            <ThumbsUp className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.avgAtendimento} <span className="text-sm font-normal text-slate-400">/ 5.0</span></div>
          <span className="text-2xs text-slate-500">Agilidade no balcão e WhatsApp</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Estrutura & Limpeza</span>
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.avgLimpeza} <span className="text-sm font-normal text-slate-400">/ 5.0</span></div>
          <span className="text-2xs text-slate-500">Higiene e manutenção Matrix</span>
        </div>
      </div>

      {/* NPS Distribution Bar & Categories Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Distribuição do NPS (Net Promoter Score)
            </h3>
            <span className="text-xs text-slate-500">Total: <strong>{surveys.length} feedbacks</strong></span>
          </div>

          {/* Bar */}
          <div className="h-5 w-full rounded-full overflow-hidden flex bg-slate-100 p-0.5">
            <div 
              style={{ width: `${Math.round((stats.promotores / stats.total) * 100)}%` }} 
              className="bg-emerald-500 h-full rounded-l-full transition-all"
              title={`Promotores: ${stats.promotores}`}
            ></div>
            <div 
              style={{ width: `${Math.round((stats.neutros / stats.total) * 100)}%` }} 
              className="bg-amber-400 h-full transition-all"
              title={`Neutros: ${stats.neutros}`}
            ></div>
            <div 
              style={{ width: `${Math.round((stats.detratores / stats.total) * 100)}%` }} 
              className="bg-red-500 h-full rounded-r-full transition-all"
              title={`Detratores: ${stats.detratores}`}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
              <span className="font-bold text-emerald-800 block text-sm">{stats.promotores} ({Math.round((stats.promotores / stats.total) * 100)}%)</span>
              <span className="text-2xs text-emerald-700 font-medium">Promotores (9-10)</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
              <span className="font-bold text-amber-800 block text-sm">{stats.neutros} ({Math.round((stats.neutros / stats.total) * 100)}%)</span>
              <span className="text-2xs text-amber-700 font-medium">Neutros (7-8)</span>
            </div>
            <div className="p-2 rounded-lg bg-red-50 border border-red-100">
              <span className="font-bold text-red-800 block text-sm">{stats.detratores} ({Math.round((stats.detratores / stats.total) * 100)}%)</span>
              <span className="text-2xs text-red-700 font-medium">Detratores (0-6)</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Médias por Dimensão
          </h3>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Atendimento & Recepção</span>
                <span className="font-bold text-slate-900">{stats.avgAtendimento} / 5.0</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(Number(stats.avgAtendimento) / 5) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Estrutura e Equipamentos</span>
                <span className="font-bold text-slate-900">{stats.avgEstrutura} / 5.0</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-600 rounded-full" style={{ width: `${(Number(stats.avgEstrutura) / 5) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Professores & Instrutores</span>
                <span className="font-bold text-slate-900">{stats.avgProf} / 5.0</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(Number(stats.avgProf) / 5) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1">
                <span>Limpeza e Vestiários</span>
                <span className="font-bold text-slate-900">{stats.avgLimpeza} / 5.0</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: `${(Number(stats.avgLimpeza) / 5) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feed of Responses & Dispatch Button */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Filtrar por:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 px-3 py-1.5 bg-slate-50 text-slate-700 focus:border-blue-500 focus:outline-hidden"
            >
              <option value="todos">Todas as pesquisas ({surveys.length})</option>
              <option value="lead_experimental">Pós-Aula Experimental</option>
              <option value="novo_aluno_30d">Experiência 30 Dias</option>
            </select>
          </div>

          <button
            onClick={() => setShowSendModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Send className="h-3.5 w-3.5" />
            Disparar Pesquisa via WhatsApp
          </button>
        </div>

        {/* Feed List */}
        <div className="space-y-3">
          {filteredSurveys.map((survey) => {
            const isNpsHigh = survey.score >= 9;
            const isNpsMid = survey.score >= 7 && survey.score <= 8;

            return (
              <div
                key={survey.id}
                className="rounded-xl border border-slate-200 p-4 space-y-3 hover:border-blue-300 transition-colors bg-white shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      isNpsHigh 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : isNpsMid 
                        ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {survey.score}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {survey.respondentName}
                        </h4>
                        <span className="text-2xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {survey.surveyTitle}
                        </span>
                      </div>
                      <div className="text-2xs text-slate-500 mt-0.5">
                        <span>{survey.phone}</span> • <span>Recebido: {survey.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {survey.resolved ? (
                      <span className="inline-flex items-center gap-1 text-2xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                        <CheckCircle2 className="h-3 w-3" />
                        Tratado
                      </span>
                    ) : (
                      <button
                        onClick={() => onResolveSurvey(survey.id)}
                        className="text-2xs font-medium text-slate-600 hover:text-blue-600 bg-slate-100 px-2.5 py-1 rounded transition-colors"
                      >
                        Marcar como Tratado
                      </button>
                    )}
                  </div>
                </div>

                {/* Comment */}
                <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-700 leading-relaxed italic border border-slate-100">
                  "{survey.comment}"
                </div>

                {/* Categories & Actions */}
                <div className="flex items-center justify-between text-2xs pt-2 border-t border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-500">Notas específicas:</span>
                    <span className="bg-white border px-1.5 py-0.5 rounded text-slate-700">Atendimento: {survey.categoryRating.atendimento}/5</span>
                    <span className="bg-white border px-1.5 py-0.5 rounded text-slate-700">Estrutura: {survey.categoryRating.estrutura}/5</span>
                    <span className="bg-white border px-1.5 py-0.5 rounded text-slate-700">Professor: {survey.categoryRating.professor}/5</span>
                    <span className="bg-white border px-1.5 py-0.5 rounded text-slate-700">Limpeza: {survey.categoryRating.limpeza}/5</span>
                  </div>

                  <button
                    onClick={() => sendWhatsAppMessage(survey.phone, `Olá ${survey.respondentName}! Agradecemos muito seu feedback sobre a GL PRO FIT! Ficamos felizes em te atender sempre melhor.`, survey.respondentName)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded hover:bg-emerald-100 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Responder no WhatsApp Interno
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Disparar Pesquisa */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-blue-600" />
              Enviar Pesquisa de Satisfação
            </h3>

            <form onSubmit={handleSendSurvey} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Selecione o Lead ou Aluno
                </label>
                <select
                  required
                  value={selectedLead}
                  onChange={(e) => setSelectedLead(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="">Selecione um contato...</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.name}>{l.name} - ({l.phone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Modelo de Pesquisa
                </label>
                <select
                  value={selectedSurveyType}
                  onChange={(e) => setSelectedSurveyType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="Pós-Aula Experimental">Pós-Aula Experimental (Atendimento, Professor, Equipamentos)</option>
                  <option value="Experiência 30 Dias">Primeiros 30 Dias (Adaptação, App VB SPORT, Resultados)</option>
                  <option value="NPS Semestral Geral">NPS Semestral Geral</option>
                </select>
              </div>

              <div className="rounded-lg bg-slate-50 p-2.5 text-2xs text-slate-600 border border-slate-100 space-y-1">
                <span className="font-semibold text-slate-700">Prévia da mensagem:</span>
                <p className="italic">
                  "Olá {'[Nome]'}! 🌟 Como foi sua experiência na VB SPORT? Poderia responder nossa rápida pesquisa de 3 perguntas para continuarmos evoluindo? Link: https://vbsport.com.br/feedback/..."
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Disparar via WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
