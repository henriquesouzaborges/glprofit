import React, { useState } from 'react';
import {
  HeartPulse,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Send,
  MessageCircle,
  Moon,
  BatteryCharging,
  Smile,
  Zap,
  Flame,
  Scale,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  X
} from 'lucide-react';
import { Student, WellnessCheckin } from '../../../types';

interface ProntidaoViewProps {
  students: Student[];
  selectedStudentId: string;
  onSelectStudentId: (id: string) => void;
  latestCheckin: WellnessCheckin | null;
  onNavigateToCheckin: () => void;
  onNavigateToPainMap: () => void;
}

export const ProntidaoView: React.FC<ProntidaoViewProps> = ({
  students,
  selectedStudentId,
  onSelectStudentId,
  latestCheckin,
  onNavigateToCheckin,
  onNavigateToPainMap
}) => {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const generateWhatsAppMessage = (chk: WellnessCheckin) => {
    const periodLabel = chk.period === 'manha' ? 'Manhã' : chk.period === 'tarde' ? 'Tarde' : 'Noite';
    const dateFormatted = new Date(`${chk.date}T12:00:00`).toLocaleDateString('pt-BR');

    return `*GL PRO FIT • MONITORAMENTO DE BEM-ESTAR & PRONTIDÃO* 📋🩺\n\n` +
      `Olá, *${chk.studentName.split(' ')[0]}*! Seu check-in de prontidão de hoje (*${dateFormatted}* - ${periodLabel}) foi avaliado:\n\n` +
      `📊 *PRONTIDÃO DO DIA:* ${chk.readinessScore}% - ${
        chk.readinessStatus === 'otimo' ? '🟢 ÓTIMO (Carga Total Liberada)' :
        chk.readinessStatus === 'moderado' ? '🟡 MODERADO (Ajuste Preventivo de Volume)' :
        '🔴 ALERTA (Risco de Sobrecarga / Regenerativo)'
      }\n` +
      `• *Qualidade do Sono:* ${chk.sleepQuality}/10 (${chk.sleepHours}h dormidas)\n` +
      `• *PSE (Fadiga):* ${chk.pse}/10\n` +
      `• *EVA (Dor Muscular):* ${chk.eva}/10\n` +
      `• *Nível de Estresse:* ${chk.stressLevel}/10\n` +
      `• *PSR (Recuperação):* ${chk.psr}/10\n` +
      `• *Índice de Hooper:* ${chk.hooperIndex} pts\n` +
      (chk.weightPre && chk.weightPost ? `• *Peso Pré/Pós:* ${chk.weightPre}kg ➔ ${chk.weightPost}kg (Perda: ${(chk.weightPre - chk.weightPost).toFixed(2)}kg)\n` : '') +
      (chk.jumpCmjPre && chk.jumpCmjPost ? `• *Salto CMJ:* ${chk.jumpCmjPre}cm ➔ ${chk.jumpCmjPost}cm (Δ: ${(chk.jumpCmjPost - chk.jumpCmjPre).toFixed(1)}cm)\n` : '') +
      (chk.painPoints.length > 0 
        ? `\n⚠️ *Pontos de Atenção (EVA):* ${chk.painPoints.map(p => `${p.region} (${p.painScale}/10 - ${p.painType})`).join(', ')}\n` 
        : `\n✅ *Sem dores agudas relatadas.*\n`) +
      `\n💡 *Conduta do Treinador:* ${
        chk.readinessStatus === 'otimo'
          ? 'Você está em excelente estado! Liberado para intensidade máxima e busca de recordes.'
          : chk.readinessStatus === 'moderado'
          ? 'Atenção ao volume total. Realize aquecimento prolongado e preserve 2 repetições de reserva.'
          : 'Sobrecarga detectada. Priorize liberação miofascial, mobilidade e redução de 30% na carga.'
      }\n\n` +
      `Acompanhe seu histórico completo no app! 💪📲`;
  };

  return (
    <div className="space-y-6">
      
      {/* Student Context Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 text-white font-black flex items-center justify-center text-sm shadow-sm">
            {activeStudent.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm sm:text-base">{activeStudent.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {activeStudent.planName}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Último check-in: <strong>{latestCheckin ? `${latestCheckin.date} (${latestCheckin.period.toUpperCase()})` : 'Nenhum registro ainda'}</strong>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Student Selector */}
          <div className="relative">
            <select
              value={selectedStudentId}
              onChange={(e) => onSelectStudentId(e.target.value)}
              className="pl-8 pr-7 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-800 cursor-pointer"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {latestCheckin && (
            <button
              type="button"
              onClick={() => setShowWhatsAppModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Feedback WhatsApp</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNavigateToCheckin}
            className="px-3.5 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Novo Check-in</span>
          </button>
        </div>
      </div>

      {latestCheckin ? (
        <div className="space-y-6">
          
          {/* Top Readiness Score Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-5">
              <div className={`w-24 h-24 rounded-3xl flex flex-col items-center justify-center font-black text-white shadow-lg ${
                latestCheckin.readinessStatus === 'otimo' ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/20' :
                latestCheckin.readinessStatus === 'moderado' ? 'bg-gradient-to-tr from-amber-500 to-yellow-600 shadow-amber-500/20' :
                'bg-gradient-to-tr from-rose-600 to-red-700 shadow-rose-500/20'
              }`}>
                <span className="text-3xl leading-none">{latestCheckin.readinessScore}%</span>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 mt-1">Prontidão</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    latestCheckin.readinessStatus === 'otimo' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    latestCheckin.readinessStatus === 'moderado' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {latestCheckin.readinessStatus === 'otimo' ? '🟢 Prontidão Alta (Carga Liberada)' :
                     latestCheckin.readinessStatus === 'moderado' ? '🟡 Atenção / Carga Moderada' :
                     '🔴 Alerta de Sobrecarga'}
                  </span>
                  <span className="text-xs text-slate-400">
                    Sessão: {latestCheckin.date} ({latestCheckin.period === 'manha' ? 'Manhã' : latestCheckin.period === 'tarde' ? 'Tarde' : 'Noite'})
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {latestCheckin.readinessStatus === 'otimo' && 'Atleta apto para intensidade máxima'}
                  {latestCheckin.readinessStatus === 'moderado' && 'Recuperação parcial - controlar volume'}
                  {latestCheckin.readinessStatus === 'alerta' && 'Sinais evidentes de sobretreinamento'}
                </h3>
                <p className="text-xs text-slate-500">
                  Índice de Hooper: <strong>{latestCheckin.hooperIndex} pts</strong> • Duração da Sessão: <strong>{latestCheckin.trainingDurationMinutes || 60} min</strong>
                </p>
              </div>
            </div>

            {/* Quick action button to pain map */}
            {latestCheckin.painPoints.length > 0 && (
              <button
                type="button"
                onClick={onNavigateToPainMap}
                className="w-full md:w-auto p-3 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer flex items-center justify-between md:justify-start gap-3"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-600" />
                  <div className="text-left">
                    <div className="text-xs font-bold text-rose-900">{latestCheckin.painPoints.length} Ponto(s) de Dor Ativo(s)</div>
                    <div className="text-[10px] text-rose-700">Ver no Mapa Anatômico</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-500" />
              </button>
            )}

          </div>

          {/* 6 Key 0-10 Scales Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* Sono */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1"><Moon className="w-3.5 h-3.5 text-indigo-600" /> Sono</span>
                <span className="text-[10px] text-slate-400">{latestCheckin.sleepHours}h</span>
              </div>
              <div className="text-2xl font-black text-slate-900">{latestCheckin.sleepQuality} <span className="text-xs text-slate-400">/ 10</span></div>
              <div className="text-[10px] text-slate-500">Qualidade Noturna</div>
            </div>

            {/* PSE */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1"><BatteryCharging className="w-3.5 h-3.5 text-amber-500" /> PSE</span>
                <span className="text-[10px] text-slate-400">Fadiga</span>
              </div>
              <div className="text-2xl font-black text-slate-900">{latestCheckin.pse} <span className="text-xs text-slate-400">/ 10</span></div>
              <div className="text-[10px] text-slate-500">Percepção de Esforço</div>
            </div>

            {/* EVA */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-rose-500" /> EVA</span>
                <span className="text-[10px] text-slate-400">Dor</span>
              </div>
              <div className="text-2xl font-black text-slate-900">{latestCheckin.eva} <span className="text-xs text-slate-400">/ 10</span></div>
              <div className="text-[10px] text-slate-500">Dor Muscular Tardia</div>
            </div>

            {/* Estresse */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-sky-500" /> Estresse</span>
                <span className="text-[10px] text-slate-400">Mental</span>
              </div>
              <div className="text-2xl font-black text-slate-900">{latestCheckin.stressLevel} <span className="text-xs text-slate-400">/ 10</span></div>
              <div className="text-[10px] text-slate-500">Tensão e Pressão</div>
            </div>

            {/* Humor */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1"><Smile className="w-3.5 h-3.5 text-emerald-500" /> Humor</span>
                <span className="text-[10px] text-slate-400">Ânimo</span>
              </div>
              <div className="text-2xl font-black text-slate-900">{latestCheckin.moodState} <span className="text-xs text-slate-400">/ 10</span></div>
              <div className="text-[10px] text-slate-500">Disposição Diária</div>
            </div>

            {/* PSR */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1"><HeartPulse className="w-3.5 h-3.5 text-blue-600" /> PSR</span>
                <span className="text-[10px] text-slate-400">Repouso</span>
              </div>
              <div className="text-2xl font-black text-slate-900">{latestCheckin.psr} <span className="text-xs text-slate-400">/ 10</span></div>
              <div className="text-[10px] text-slate-500">Recuperação Subjetiva</div>
            </div>

          </div>

          {/* Physiological Metrics: Peso Pré/Pós and CMJ Pré/Pós */}
          {(latestCheckin.weightPre || latestCheckin.jumpCmjPre) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Desidratação / Peso */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-purple-600" />
                    Balanço Hídrico (Peso Pré vs. Pós)
                  </span>
                  {latestCheckin.weightPre && latestCheckin.weightPost && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      Delta: {(latestCheckin.weightPre - latestCheckin.weightPost).toFixed(2)} kg
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Peso Pré-Treino</span>
                    <span className="text-sm font-bold text-slate-900">{latestCheckin.weightPre} kg</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Peso Pós-Treino</span>
                    <span className="text-sm font-bold text-slate-900">{latestCheckin.weightPost} kg</span>
                  </div>
                </div>
              </div>

              {/* Salto Vertical CMJ */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Potência Neuromuscular (Salto CMJ Pré vs. Pós)
                  </span>
                  {latestCheckin.jumpCmjPre && latestCheckin.jumpCmjPost && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Variação: {(latestCheckin.jumpCmjPost - latestCheckin.jumpCmjPre).toFixed(1)} cm
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">CMJ Pré-Treino</span>
                    <span className="text-sm font-bold text-slate-900">{latestCheckin.jumpCmjPre} cm</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">CMJ Pós-Treino</span>
                    <span className="text-sm font-bold text-slate-900">{latestCheckin.jumpCmjPost} cm</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Prescription & Conduct Banner */}
          <div className={`p-5 rounded-2xl border ${
            latestCheckin.readinessStatus === 'otimo' ? 'bg-emerald-50 border-emerald-200' :
            latestCheckin.readinessStatus === 'moderado' ? 'bg-amber-50 border-amber-200' :
            'bg-rose-50 border-rose-200'
          }`}>
            <div className="flex items-start gap-3.5">
              <div className={`p-2.5 rounded-xl text-white shrink-0 ${
                latestCheckin.readinessStatus === 'otimo' ? 'bg-emerald-600' :
                latestCheckin.readinessStatus === 'moderado' ? 'bg-amber-600' : 'bg-rose-600'
              }`}>
                {latestCheckin.readinessStatus === 'otimo' ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">
                  {latestCheckin.readinessStatus === 'otimo' && 'Conduta Recomendada: Carga Total Liberada'}
                  {latestCheckin.readinessStatus === 'moderado' && 'Conduta Recomendada: Redução Preventiva de Volume (-15%)'}
                  {latestCheckin.readinessStatus === 'alerta' && 'Conduta Recomendada: Sessão Regenerativa / Mobilidade'}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {latestCheckin.readinessStatus === 'otimo' && 
                    'O atleta está completamente recuperado com excelentes índices de sono e baixo estresse. Mantenha os estímulos principais de hipertrofia e força.'}
                  {latestCheckin.readinessStatus === 'moderado' && 
                    'Recuperação parcial. Evite exercícios que causem impacto excessivo nas articulações com queixas e mantenha repetições na reserva.'}
                  {latestCheckin.readinessStatus === 'alerta' && 
                    'Alta sobrecarga fisiológica acumulada. Recomenda-se liberação miofascial, treinamento cardiorrespiratório de baixa intensidade ou descanso ativo.'}
                </p>
                {latestCheckin.notes && (
                  <div className="text-xs text-slate-600 pt-1 italic font-medium">
                    "{latestCheckin.notes}"
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
          <HeartPulse className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">
            Nenhum check-in registrado para {activeStudent.name}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Abra a aba "Check-in" para preencher o questionário diário deste aluno.
          </p>
          <button
            type="button"
            onClick={onNavigateToCheckin}
            className="px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Ir para o Formulário de Check-in</span>
          </button>
        </div>
      )}

      {/* MODAL: DISPARO WHATSAPP */}
      {showWhatsAppModal && latestCheckin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Enviar Prontidão no WhatsApp
                  </h4>
                  <p className="text-xs text-slate-500">Destinatário: {activeStudent.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview text message */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {generateWhatsAppMessage(latestCheckin)}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Telefone: {activeStudent.phone || '(11) 98765-4321'}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWhatsAppModal(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Fechar
                </button>
                <a
                  href={`https://api.whatsapp.com/send?phone=55${(activeStudent.phone || '11987654321').replace(/\D/g, '')}&text=${encodeURIComponent(generateWhatsAppMessage(latestCheckin))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowWhatsAppModal(false)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Disparar Mensagem</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
