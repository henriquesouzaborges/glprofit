import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  Share2, 
  Printer, 
  User, 
  Calendar, 
  TrendingUp, 
  Award, 
  Zap, 
  Flame, 
  Timer, 
  Gauge, 
  Target,
  Check
} from 'lucide-react';
import { Student } from '../../../types';

interface TestesSaltoViewProps {
  student: Student;
  onSave?: (data: any) => void;
  initialWeightKg?: number;
  initialHeightCm?: number;
}

export const TestesSaltoView: React.FC<TestesSaltoViewProps> = ({ student, onSave, initialWeightKg }) => {
  const STORAGE_KEY = `glprofit_testes_salto_${student?.id || 'default'}`;

  const [evaluationDate, setEvaluationDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [evaluatorName, setEvaluatorName] = useState('Prof. Gianluca Marinho (CREF 112001-G/SP)');
  const [studentWeight, setStudentWeight] = useState<number>(() => initialWeightKg || 75);

  useEffect(() => {
    if (initialWeightKg !== undefined && initialWeightKg > 0) {
      setStudentWeight(initialWeightKg);
    }
  }, [initialWeightKg]);

  // 1. CMJ (Countermovement Jump / Salto com Contramovimento) - 3 tentativas (cm)
  const [cmjT1, setCmjT1] = useState<number>(38.5);
  const [cmjT2, setCmjT2] = useState<number>(41.0);
  const [cmjT3, setCmjT3] = useState<number>(40.2);

  // 2. SJ (Squat Jump / Salto Estático sem contramovimento) - 3 tentativas (cm)
  const [sjT1, setSjT1] = useState<number>(35.0);
  const [sjT2, setSjT2] = useState<number>(36.5);
  const [sjT3, setSjT3] = useState<number>(36.0);

  // 3. DJ (Drop Jump / Salto em Profundidade)
  const [dropBoxHeight, setDropBoxHeight] = useState<number>(30); // altura do caixote em cm
  const [dropJumpHeight, setDropJumpHeight] = useState<number>(37.5); // altura alcançada em cm
  const [contactTimeMs, setContactTimeMs] = useState<number>(210); // tempo de contato em ms

  // 4. Salto Unipodal (Single-Leg CMJ - Direito vs Esquerdo em cm)
  const [unipodalRight, setUnipodalRight] = useState<number>(24.5);
  const [unipodalLeft, setUnipodalLeft] = useState<number>(23.0);

  // 5. Salto Horizontal Parado (Broad Jump em cm)
  const [broadJumpDistance, setBroadJumpDistance] = useState<number>(220);

  // Observações & Prescrição
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Carrega do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.evaluationDate) setEvaluationDate(parsed.evaluationDate);
        if (parsed.evaluatorName) setEvaluatorName(parsed.evaluatorName);
        if (initialWeightKg !== undefined && initialWeightKg > 0) {
          setStudentWeight(initialWeightKg);
        } else if (parsed.studentWeight) {
          setStudentWeight(parsed.studentWeight);
        }
        if (parsed.cmjT1 !== undefined) setCmjT1(parsed.cmjT1);
        if (parsed.cmjT2 !== undefined) setCmjT2(parsed.cmjT2);
        if (parsed.cmjT3 !== undefined) setCmjT3(parsed.cmjT3);
        if (parsed.sjT1 !== undefined) setSjT1(parsed.sjT1);
        if (parsed.sjT2 !== undefined) setSjT2(parsed.sjT2);
        if (parsed.sjT3 !== undefined) setSjT3(parsed.sjT3);
        if (parsed.dropBoxHeight !== undefined) setDropBoxHeight(parsed.dropBoxHeight);
        if (parsed.dropJumpHeight !== undefined) setDropJumpHeight(parsed.dropJumpHeight);
        if (parsed.contactTimeMs !== undefined) setContactTimeMs(parsed.contactTimeMs);
        if (parsed.unipodalRight !== undefined) setUnipodalRight(parsed.unipodalRight);
        if (parsed.unipodalLeft !== undefined) setUnipodalLeft(parsed.unipodalLeft);
        if (parsed.broadJumpDistance !== undefined) setBroadJumpDistance(parsed.broadJumpDistance);
        if (parsed.clinicalNotes) setClinicalNotes(parsed.clinicalNotes);
      }
    } catch {
      // Ignora erro de parse
    }
  }, [STORAGE_KEY]);

  // Cálculos de Melhores Marcas
  const bestCmj = Math.max(cmjT1 || 0, cmjT2 || 0, cmjT3 || 0);
  const avgCmj = ((cmjT1 + cmjT2 + cmjT3) / 3).toFixed(1);

  const bestSj = Math.max(sjT1 || 0, sjT2 || 0, sjT3 || 0);

  // Tempo de Voo estimado do CMJ em ms: tv = 2 * sqrt(2 * h / g) = sqrt(h/122.625) * 1000
  const estimatedFlightTimeMs = bestCmj > 0 ? Math.round(Math.sqrt((8 * bestCmj) / 981) * 1000) : 0;

  // Potência de Pico de Sayers (Watts): P = 60.7 * h (cm) + 45.3 * peso (kg) - 2055
  const peakPowerWatts = bestCmj > 0 && studentWeight > 0 
    ? Math.round(60.7 * bestCmj + 45.3 * studentWeight - 2055) 
    : 0;

  const relativePowerWkg = studentWeight > 0 
    ? (peakPowerWatts / studentWeight).toFixed(1) 
    : '0';

  // Índice de Elasticidade (IE%): ((CMJ - SJ) / SJ) * 100
  const elasticityIndex = bestSj > 0 
    ? Math.round(((bestCmj - bestSj) / bestSj) * 100 * 10) / 10 
    : 0;

  const getElasticityAnalysis = (ie: number) => {
    if (ie > 15) return { text: 'Excelente Aproveitamento Elástico (> 15%)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (ie >= 10) return { text: 'Aproveitamento Elástico Normal (10% a 15%)', color: 'text-blue-700 bg-blue-50 border-blue-300' };
    return { text: 'Déficit no Ciclo Alongamento-Encurtamento (< 10%)', color: 'text-amber-700 bg-amber-50 border-amber-300' };
  };

  const elasticityAnalysis = getElasticityAnalysis(elasticityIndex);

  // Índice de Força Reativa (RSI): Altura do Salto (m) / Tempo de Contato (s)
  const contactTimeSec = contactTimeMs / 1000;
  const jumpHeightM = dropJumpHeight / 100;
  const rsi = contactTimeSec > 0 ? (jumpHeightM / contactTimeSec).toFixed(2) : '0';
  const rsiNum = parseFloat(rsi);

  const getRsiClassification = (val: number) => {
    if (val >= 2.5) return { text: 'RSI de Elite (> 2.5)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (val >= 2.0) return { text: 'RSI Excelente (2.0 a 2.5)', color: 'text-blue-700 bg-blue-50 border-blue-300' };
    if (val >= 1.5) return { text: 'RSI Bom / Moderado (1.5 a 2.0)', color: 'text-slate-700 bg-slate-100 border-slate-300' };
    return { text: 'RSI Baixo (< 1.5) - Tempo de contato longo', color: 'text-rose-700 bg-rose-50 border-rose-300' };
  };

  const rsiClassification = getRsiClassification(rsiNum);

  // Assimetria Unipodal (D vs E)
  const maxUnipodal = Math.max(unipodalRight, unipodalLeft);
  const minUnipodal = Math.min(unipodalRight, unipodalLeft);
  const unipodalDiff = Math.abs(unipodalRight - unipodalLeft);
  const unipodalAsymmetryPct = maxUnipodal > 0 ? ((maxUnipodal - minUnipodal) / maxUnipodal) * 100 : 0;
  const isUnipodalRisk = unipodalAsymmetryPct >= 10;

  // Classificação Normativa CMJ
  const getCmjClassification = (h: number, gender: string) => {
    const isMale = gender === 'masculino';
    if (isMale) {
      if (h >= 50) return { text: 'Excelente / Atleta', color: 'text-emerald-600' };
      if (h >= 40) return { text: 'Acima da Média', color: 'text-blue-600' };
      if (h >= 32) return { text: 'Média Populacional', color: 'text-slate-700' };
      if (h >= 25) return { text: 'Abaixo da Média', color: 'text-amber-600' };
      return { text: 'Fraco', color: 'text-rose-600' };
    } else {
      if (h >= 40) return { text: 'Excelente / Atleta', color: 'text-emerald-600' };
      if (h >= 32) return { text: 'Acima da Média', color: 'text-blue-600' };
      if (h >= 25) return { text: 'Média Populacional', color: 'text-slate-700' };
      if (h >= 20) return { text: 'Abaixo da Média', color: 'text-amber-600' };
      return { text: 'Fraco', color: 'text-rose-600' };
    }
  };

  const cmjClass = getCmjClassification(bestCmj, student.gender || 'masculino');

  // Classificação Salto Horizontal
  const getBroadJumpClass = (d: number, gender: string) => {
    const isMale = gender === 'masculino';
    if (isMale) {
      if (d >= 250) return 'Excelente (Atleta)';
      if (d >= 220) return 'Bom / Acima da Média';
      if (d >= 190) return 'Média';
      return 'Regular / Abaixo da Média';
    } else {
      if (d >= 210) return 'Excelente (Atleta)';
      if (d >= 180) return 'Bom / Acima da Média';
      if (d >= 150) return 'Média';
      return 'Regular / Abaixo da Média';
    }
  };

  const broadClass = getBroadJumpClass(broadJumpDistance, student.gender || 'masculino');

  const handleAppendClinicalNote = (note: string) => {
    setClinicalNotes(prev => {
      if (!prev) return note;
      if (prev.includes(note)) return prev;
      return `${prev}\n• ${note}`;
    });
  };

  const handleSave = () => {
    const payload = {
      studentId: student.id,
      studentName: student.name,
      evaluationDate,
      evaluatorName,
      studentWeight,
      cmj: {
        t1: cmjT1,
        t2: cmjT2,
        t3: cmjT3,
        best: bestCmj,
        avg: avgCmj,
        flightTimeMs: estimatedFlightTimeMs,
        peakPowerWatts,
        relativePowerWkg,
        classification: cmjClass.text
      },
      sj: {
        t1: sjT1,
        t2: sjT2,
        t3: sjT3,
        best: bestSj,
        elasticityIndex,
        elasticityAnalysis: elasticityAnalysis.text
      },
      dropJump: {
        boxHeight: dropBoxHeight,
        jumpHeight: dropJumpHeight,
        contactTimeMs,
        rsi: rsiNum,
        rsiClassification: rsiClassification.text
      },
      unipodal: {
        right: unipodalRight,
        left: unipodalLeft,
        diff: unipodalDiff,
        asymmetryPct: unipodalAsymmetryPct.toFixed(1),
        isRisk: isUnipodalRisk
      },
      broadJump: {
        distance: broadJumpDistance,
        classification: broadClass
      },
      clinicalNotes,
      savedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    if (onSave) onSave(payload);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const formattedDate = evaluationDate.split('-').reverse().join('/');
    let msg = `🚀 *GL PRO FIT • AVALIAÇÃO DE SALTOS & POTÊNCIA MUSCULAR*\n`;
    msg += `👤 *Aluno:* ${student.name} (${student.code})\n`;
    msg += `📅 *Data:* ${formattedDate} | *Avaliador:* ${evaluatorName}\n\n`;
    msg += `🎯 *Salto com Contramovimento (CMJ):* *${bestCmj} cm* (${cmjClass.text})\n`;
    msg += `⚡ *Potência de Pico Sayers:* *${peakPowerWatts} W* (${relativePowerWkg} W/kg)\n`;
    msg += `⏱️ *Tempo de Voo Estimado:* *${estimatedFlightTimeMs} ms*\n`;
    msg += `📊 *Salto Estático (SJ):* *${bestSj} cm*\n`;
    msg += `🔄 *Índice de Elasticidade (CAE):* *${elasticityIndex}%* (${elasticityAnalysis.text})\n`;
    msg += `⚡ *Salto em Profundidade (DJ ${dropBoxHeight}cm):* RSI: *${rsi}* (Contato: ${contactTimeMs}ms)\n`;
    msg += `⚖️ *Assimetria Unipodal D vs E:* D: ${unipodalRight}cm | E: ${unipodalLeft}cm (Dif: ${unipodalAsymmetryPct.toFixed(1)}% ${isUnipodalRisk ? '⚠️ Risco Lesivo' : '✓ Simétrico'})\n`;
    msg += `📏 *Salto Horizontal (Broad Jump):* *${broadJumpDistance} cm* (${broadClass})\n`;
    if (clinicalNotes) {
      msg += `\n📝 *Recomendações Pliométricas:* ${clinicalNotes}`;
    }

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* HEADER DE AÇÕES */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
              Protocolo de Bosco & Pliometria
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              CMJ, Squat Jump, Drop Jump (RSI) e Salto Unipodal
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <ArrowUpRight className="w-6 h-6 text-orange-600" />
            <span>Testes de Salto & Potência Muscular</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Diagnóstico de taxa de desenvolvimento de força (RFD), ciclo de alongamento-encurtamento e potência de <strong>{student.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Imprimir</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Saltos</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Testes de salto e biomarcadores de potência de {student.name} salvos com sucesso!</span>
        </div>
      )}

      {/* METADADOS DA AVALIAÇÃO */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Data da Avaliação de Saltos:
          </label>
          <div className="relative">
            <input
              type="date"
              value={evaluationDate}
              onChange={(e) => setEvaluationDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Avaliador Responsável:
          </label>
          <div className="relative">
            <input
              type="text"
              value={evaluatorName}
              onChange={(e) => setEvaluatorName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Massa Corporal no Teste (kg):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.5"
              value={studentWeight}
              onChange={(e) => setStudentWeight(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="text-xs font-bold text-slate-500">kg</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD PRINCIPAL DE POTÊNCIA: 4 KPIS CIENTÍFICOS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: ALTURA MÁXIMA CMJ */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Melhor Salto (CMJ)</span>
            <ArrowUpRight className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {bestCmj} <span className="text-sm text-slate-400 font-bold">cm</span>
          </div>
          <div className={`text-[11px] font-bold mt-1 ${cmjClass.color}`}>
            {cmjClass.text}
          </div>
        </div>

        {/* KPI 2: POTÊNCIA DE PICO (WATTS) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Potência Sayers</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-2">
            {peakPowerWatts} <span className="text-sm text-slate-400 font-bold">W</span>
          </div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1">
            Potência Relativa: <strong>{relativePowerWkg} W/kg</strong>
          </div>
        </div>

        {/* KPI 3: ÍNDICE DE ELASTICIDADE (IE%) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Índice Elasticidade (CAE)</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-2">
            {elasticityIndex} <span className="text-sm text-slate-400 font-bold">%</span>
          </div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1 truncate" title={elasticityAnalysis.text}>
            {elasticityAnalysis.text}
          </div>
        </div>

        {/* KPI 4: ÍNDICE DE FORÇA REATIVA (RSI) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Índice RSI (Drop Jump)</span>
            <Gauge className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-700 mt-2">
            {rsi} <span className="text-sm text-slate-400 font-bold">RSI</span>
          </div>
          <div className="text-[11px] font-semibold text-slate-500 mt-1 truncate" title={rsiClassification.text}>
            {rsiClassification.text}
          </div>
        </div>
      </div>

      {/* SEÇÃO 1: PROTOCOLOS CMJ & SQUAT JUMP (COMPARATIVO ELASTICIDADE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CMJ */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-orange-600" />
                <span>Salto com Contramovimento (CMJ)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Salto vertical máximo com auxílio elástico do contramovimento
              </p>
            </div>
            <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
              3 Tentativas
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tentativa 1 (cm):</label>
              <input
                type="number"
                step="0.5"
                value={cmjT1}
                onChange={(e) => setCmjT1(parseFloat(e.target.value) || 0)}
                className="w-full p-2 text-sm font-black rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tentativa 2 (cm):</label>
              <input
                type="number"
                step="0.5"
                value={cmjT2}
                onChange={(e) => setCmjT2(parseFloat(e.target.value) || 0)}
                className="w-full p-2 text-sm font-black rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tentativa 3 (cm):</label>
              <input
                type="number"
                step="0.5"
                value={cmjT3}
                onChange={(e) => setCmjT3(parseFloat(e.target.value) || 0)}
                className="w-full p-2 text-sm font-black rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200 flex items-center justify-between text-xs font-bold">
            <span>Melhor Marca: <strong className="text-orange-950 text-sm font-black">{bestCmj} cm</strong> (Média: {avgCmj} cm)</span>
            <span className="text-slate-600 font-semibold flex items-center gap-1">
              <Timer className="w-3.5 h-3.5 text-orange-600" />
              Tempo Voo: {estimatedFlightTimeMs} ms
            </span>
          </div>
        </div>

        {/* SQUAT JUMP (SJ) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span>Salto Estático (Squat Jump - SJ)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Partida estática a 90° de joelho por 2s (elimina a energia elástica)
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              Força Concêntrica
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tentativa 1 (cm):</label>
              <input
                type="number"
                step="0.5"
                value={sjT1}
                onChange={(e) => setSjT1(parseFloat(e.target.value) || 0)}
                className="w-full p-2 text-sm font-black rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tentativa 2 (cm):</label>
              <input
                type="number"
                step="0.5"
                value={sjT2}
                onChange={(e) => setSjT2(parseFloat(e.target.value) || 0)}
                className="w-full p-2 text-sm font-black rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tentativa 3 (cm):</label>
              <input
                type="number"
                step="0.5"
                value={sjT3}
                onChange={(e) => setSjT3(parseFloat(e.target.value) || 0)}
                className="w-full p-2 text-sm font-black rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between text-xs font-bold">
            <span>Melhor Marca SJ: <strong className="text-blue-950 text-sm font-black">{bestSj} cm</strong></span>
            <span className="text-blue-800">
              Índice Elástico: +{elasticityIndex}%
            </span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 2: DROP JUMP (RSI) & SALTO UNIPODAL COM ASSIMETRIA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* DROP JUMP & RSI */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Gauge className="w-4 h-4 text-purple-600" />
                <span>Salto em Profundidade (Drop Jump & RSI)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Aterrissagem rápida e re-salto vertical imediato (Índice de Força Reativa)
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
              Reatividade Pliométrica
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Caixote (cm):</label>
              <select
                value={dropBoxHeight}
                onChange={(e) => setDropBoxHeight(parseInt(e.target.value) || 30)}
                className="w-full p-2 text-xs font-bold rounded-xl border border-slate-300 bg-white"
              >
                <option value={20}>20 cm</option>
                <option value={30}>30 cm (Padrão)</option>
                <option value={40}>40 cm</option>
                <option value={45}>45 cm</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Salto (cm):</label>
              <input
                type="number"
                step="0.5"
                value={dropJumpHeight}
                onChange={(e) => setDropJumpHeight(parseFloat(e.target.value) || 0)}
                className="w-full p-2 text-sm font-black rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Contato (ms):</label>
              <input
                type="number"
                step="5"
                value={contactTimeMs}
                onChange={(e) => setContactTimeMs(parseInt(e.target.value) || 0)}
                className="w-full p-2 text-sm font-black rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between text-xs font-bold">
            <span>RSI Calculado: <strong className="text-purple-950 text-base font-black">{rsi}</strong></span>
            <span className="text-purple-800">{rsiClassification.text}</span>
          </div>
        </div>

        {/* SALTO UNIPODAL (D VS E) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Salto Unipodal & Triagem de Assimetria (Single-Leg CMJ)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Avaliação de dominância e simetria de membros inferiores para prevenção de lesões (LCA)
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Prevenção LCA
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Perna Direita (cm):</label>
              <input
                type="number"
                step="0.5"
                value={unipodalRight}
                onChange={(e) => setUnipodalRight(parseFloat(e.target.value) || 0)}
                className="w-full p-2 text-base font-black rounded-xl border border-slate-300 bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Perna Esquerda (cm):</label>
              <input
                type="number"
                step="0.5"
                value={unipodalLeft}
                onChange={(e) => setUnipodalLeft(parseFloat(e.target.value) || 0)}
                className="w-full p-2 text-base font-black rounded-xl border border-slate-300 bg-white text-slate-900"
              />
            </div>
          </div>

          <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold ${
            isUnipodalRisk
              ? 'bg-rose-50 border-rose-300 text-rose-800'
              : 'bg-emerald-50 border-emerald-300 text-emerald-800'
          }`}>
            <span>Diferença: {unipodalDiff.toFixed(1)} cm ({unipodalAsymmetryPct.toFixed(1)}%)</span>
            <span>{isUnipodalRisk ? '⚠️ Assimetria >= 10% (Alerta Lesivo)' : '✓ Simetria Adequada (< 10%)'}</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: SALTO HORIZONTAL PARADO (BROAD JUMP) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Salto em Distância Parado (Salto Horizontal / Standing Long Jump)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Mede a capacidade de aplicação de força máxima no plano horizontal (vetor ântero-posterior)
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            Força Horizontal
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Distância Atingida (cm):</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={broadJumpDistance}
                onChange={(e) => setBroadJumpDistance(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-base font-black text-slate-900"
              />
              <span className="text-xs font-bold text-slate-500">cm</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Classificação ({student.gender || 'Geral'})
            </span>
            <div className="text-base font-black text-amber-700">
              {broadClass}
            </div>
            <p className="text-[10px] text-slate-500">
              Valores acima de 220cm para homens ou 180cm para mulheres representam excelente potência muscular.
            </p>
          </div>
        </div>
      </div>

      {/* SEÇÃO 4: PRESCRIÇÃO PLIOMÉTRICA & RECOMENDAÇÕES */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
            Diretrizes de Pliometria & Recomendações do Treinador
          </label>
          <span className="text-[10px] text-slate-400">
            Clique nas sugestões para inserir rapidamente
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            'Priorizar exercícios de aterrissagem estável (landing mechanics)',
            'Treinamento pliométrico de baixa intensidade (saltos sobre cones)',
            'Correção de assimetria unipodal com saltos monopodais e búlgaro',
            'Exercícios de reatividade rápida (pular corda e drop jumps baixos)',
            'Fortalecimento excêntrico de quadríceps e isquiotibiais'
          ].map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => handleAppendClinicalNote(sug)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold border border-slate-200 transition-colors cursor-pointer"
            >
              + {sug}
            </button>
          ))}
        </div>

        <textarea
          rows={3}
          value={clinicalNotes}
          onChange={(e) => setClinicalNotes(e.target.value)}
          placeholder="Insira as orientações de intensidade pliométrica, volume semanal de saltos e cuidados mecânicos para este aluno..."
          className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>
  );
};
