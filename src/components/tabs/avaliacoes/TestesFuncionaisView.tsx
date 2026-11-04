import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  Share2, 
  Printer, 
  User, 
  Calendar, 
  Clock, 
  Info, 
  ShieldCheck, 
  ShieldAlert, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Student } from '../../../types';

interface TestesFuncionaisViewProps {
  student: Student;
  onSave?: (data: any) => void;
}

interface FmsItem {
  id: string;
  name: string;
  category: 'Mobilidade' | 'Estabilidade' | 'Padrão Motor';
  description: string;
  hasBilateral: boolean;
  scoreRight?: number;
  scoreLeft?: number;
  scoreSingle?: number;
  clearingTest?: boolean | null; // Dor no teste de descarte
  clearingTestName?: string;
  notes?: string;
}

export const TestesFuncionaisView: React.FC<TestesFuncionaisViewProps> = ({ student, onSave }) => {
  const STORAGE_KEY = `glprofit_testes_funcionais_${student?.id || 'default'}`;

  const [evaluationDate, setEvaluationDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [evaluatorName, setEvaluatorName] = useState('Prof. Gianluca Marinho (CREF 112001-G/SP)');

  // Bateria FMS (Functional Movement Screen) oficial de 7 testes
  const DEFAULT_FMS: FmsItem[] = [
    {
      id: 'fms_1',
      name: '1. Agachamento Profundo (Deep Overhead Squat)',
      category: 'Padrão Motor',
      description: 'Avalia mobilidade bilateral e simétrica de quadris, joelhos e tornozelos com estabilidade do core e ombros.',
      hasBilateral: false,
      scoreSingle: 2,
      notes: 'Executa com calcanhares no solo e bastão alinhado.'
    },
    {
      id: 'fms_2',
      name: '2. Passo sobre Obstáculo (Hurdle Step)',
      category: 'Padrão Motor',
      description: 'Avalia mecânica do passo, estabilidade unipodal e mobilidade de flexão/extensão de quadril.',
      hasBilateral: true,
      scoreRight: 2,
      scoreLeft: 2,
      notes: 'Mantém alinhamento tornozelo-joelho-quadril.'
    },
    {
      id: 'fms_3',
      name: '3. Afundo em Linha (In-Line Lunge)',
      category: 'Estabilidade',
      description: 'Avalia desaceleração do tronco, rotação e estabilidade do complexo pélvico-lombar.',
      hasBilateral: true,
      scoreRight: 2,
      scoreLeft: 2,
      notes: 'Bastão em contato com cabeça, coluna e sacro.'
    },
    {
      id: 'fms_4',
      name: '4. Mobilidade de Ombros (Shoulder Mobility)',
      category: 'Mobilidade',
      description: 'Avalia amplitude combinada de rotação interna/adução e rotação externa/abdução glenoumeral e escapulotorácica.',
      hasBilateral: true,
      scoreRight: 3,
      scoreLeft: 2,
      clearingTest: false,
      clearingTestName: 'Teste de Impacto Subacromial (Clearing Test de Ombro)',
      notes: 'Distância punho-punho menor que 1 mão e meia.'
    },
    {
      id: 'fms_5',
      name: '5. Elevação Ativa de Perna Reta (Active Straight-Leg Raise)',
      category: 'Mobilidade',
      description: 'Avalia flexibilidade ativa dos isquiotibiais e gastrocnêmios com estabilidade do quadril contralateral.',
      hasBilateral: true,
      scoreRight: 3,
      scoreLeft: 3,
      notes: 'Perna oposta permanece em extensão neutra no solo.'
    },
    {
      id: 'fms_6',
      name: '6. Estabilidade de Tronco em Flexão (Trunk Stability Push-up)',
      category: 'Estabilidade',
      description: 'Avalia estabilidade reflexa do core no plano sagital durante esforço simétrico de membros superiores.',
      hasBilateral: false,
      scoreSingle: 2,
      clearingTest: false,
      clearingTestName: 'Teste de Extensão da Coluna (Clearing Test Lombar)',
      notes: 'Corpo sobe como bloco único sem extensão lombar.'
    },
    {
      id: 'fms_7',
      name: '7. Estabilidade Rotacional (Rotary Stability)',
      category: 'Estabilidade',
      description: 'Avalia coordenação neuromuscular multiplano e transferência de força pélvica e escapular no padrão quadrúpede.',
      hasBilateral: true,
      scoreRight: 2,
      scoreLeft: 2,
      clearingTest: false,
      clearingTestName: 'Teste de Flexão da Coluna em Prece (Clearing Test Lombar)',
      notes: 'Executa padrão diagonal com controle postural.'
    }
  ];

  const [fmsList, setFmsList] = useState<FmsItem[]>(DEFAULT_FMS);

  // Teste de Sentar e Alcançar (Banco de Wells)
  const [wellsDistance, setWellsDistance] = useState<number>(31.5);

  // Teste de Y-Balance (Equilíbrio Dinâmico em cm)
  const [yBalanceAntR, setYBalanceAntR] = useState<number>(64);
  const [yBalanceAntL, setYBalanceAntL] = useState<number>(63);
  const [yBalancePMR, setYBalancePMR] = useState<number>(85);
  const [yBalancePML, setYBalancePML] = useState<number>(84);
  const [yBalancePLR, setYBalancePLR] = useState<number>(82);
  const [yBalancePLL, setYBalancePLL] = useState<number>(80);

  // Observações Clínicas & Prescrição
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Carrega dados salvos do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.evaluationDate) setEvaluationDate(parsed.evaluationDate);
        if (parsed.evaluatorName) setEvaluatorName(parsed.evaluatorName);
        if (parsed.fmsList) setFmsList(parsed.fmsList);
        if (parsed.wellsDistance !== undefined) setWellsDistance(parsed.wellsDistance);
        if (parsed.yBalanceAntR !== undefined) setYBalanceAntR(parsed.yBalanceAntR);
        if (parsed.yBalanceAntL !== undefined) setYBalanceAntL(parsed.yBalanceAntL);
        if (parsed.yBalancePMR !== undefined) setYBalancePMR(parsed.yBalancePMR);
        if (parsed.yBalancePML !== undefined) setYBalancePML(parsed.yBalancePML);
        if (parsed.yBalancePLR !== undefined) setYBalancePLR(parsed.yBalancePLR);
        if (parsed.yBalancePLL !== undefined) setYBalancePLL(parsed.yBalancePLL);
        if (parsed.clinicalNotes) setClinicalNotes(parsed.clinicalNotes);
      }
    } catch {
      // Ignora erro de parse
    }
  }, [STORAGE_KEY]);

  // Cálculos do FMS: Escore final de cada teste e soma total (0 a 21)
  const calculateTestScore = (item: FmsItem): number => {
    if (item.clearingTest === true) return 0; // Se houver dor no teste de descarte, nota é zero
    if (item.hasBilateral) {
      const r = item.scoreRight ?? 0;
      const l = item.scoreLeft ?? 0;
      return Math.min(r, l);
    }
    return item.scoreSingle ?? 0;
  };

  const totalFmsScore = fmsList.reduce((acc, item) => acc + calculateTestScore(item), 0);

  // Identificação de Assimetrias Bilaterais
  const asymmetries = fmsList.filter(item => 
    item.hasBilateral && 
    (item.scoreRight !== undefined && item.scoreLeft !== undefined) &&
    item.scoreRight !== item.scoreLeft
  );

  // Classificação do FMS
  const getFmsClassification = (score: number) => {
    if (score >= 18) {
      return {
        label: 'Excelente Controle Neuromuscular',
        risk: 'Baixo Risco Lesivo',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
        badge: 'Avançado'
      };
    }
    if (score >= 14) {
      return {
        label: 'Padrão Funcional Médio / Adequado',
        risk: 'Risco Lesivo Moderado',
        color: 'text-blue-700 bg-blue-50 border-blue-300',
        badge: 'Regular'
      };
    }
    return {
      label: 'Déficit Biomecânico Pronunciado',
      risk: 'Alto Risco de Lesão (< 14 pts)',
      color: 'text-rose-700 bg-rose-50 border-rose-300',
      badge: 'Alerta Clínico'
    };
  };

  const fmsClassification = getFmsClassification(totalFmsScore);

  // Classificação do Banco de Wells (Sentar e Alcançar) para adultos
  const getWellsClassification = (val: number, gender: string) => {
    const isMale = gender === 'masculino';
    if (isMale) {
      if (val >= 39) return { text: 'Excelente', color: 'text-emerald-600' };
      if (val >= 34) return { text: 'Acima da Média', color: 'text-blue-600' };
      if (val >= 30) return { text: 'Média', color: 'text-slate-700' };
      if (val >= 25) return { text: 'Abaixo da Média', color: 'text-amber-600' };
      return { text: 'Ruim / Encurtamento', color: 'text-rose-600' };
    } else {
      if (val >= 41) return { text: 'Excelente', color: 'text-emerald-600' };
      if (val >= 37) return { text: 'Acima da Média', color: 'text-blue-600' };
      if (val >= 33) return { text: 'Média', color: 'text-slate-700' };
      if (val >= 28) return { text: 'Abaixo da Média', color: 'text-amber-600' };
      return { text: 'Ruim / Encurtamento', color: 'text-rose-600' };
    }
  };

  const wellsClass = getWellsClassification(wellsDistance, student.gender || 'masculino');

  // Cálculo da assimetria do Y-Balance (diferença anterior > 4cm é preditor de lesão)
  const yAntDiff = Math.abs(yBalanceAntR - yBalanceAntL);
  const isYBalanceRisk = yAntDiff >= 4;

  const handleUpdateFmsScore = (id: string, field: 'scoreRight' | 'scoreLeft' | 'scoreSingle', val: number) => {
    setFmsList(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const handleToggleClearing = (id: string, hasPain: boolean) => {
    setFmsList(prev => prev.map(item => item.id === id ? { ...item, clearingTest: hasPain } : item));
  };

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
      fmsList,
      totalFmsScore,
      fmsClassification,
      asymmetries: asymmetries.map(a => ({ name: a.name, r: a.scoreRight, l: a.scoreLeft })),
      wellsDistance,
      wellsClass,
      yBalance: {
        antR: yBalanceAntR,
        antL: yBalanceAntL,
        pmR: yBalancePMR,
        pmL: yBalancePML,
        plR: yBalancePLR,
        plL: yBalancePLL,
        antDiff: yAntDiff,
        isRisk: isYBalanceRisk
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
    let msg = `⚡ *GL PRO FIT • AVALIAÇÃO FUNCIONAL & MOBILIDADE*\n`;
    msg += `👤 *Aluno:* ${student.name} (${student.code})\n`;
    msg += `📅 *Data:* ${formattedDate} | *Avaliador:* ${evaluatorName}\n\n`;
    msg += `📊 *Escore FMS (Functional Movement Screen):* ${totalFmsScore}/21 pontos\n`;
    msg += `🎯 *Classificação:* ${fmsClassification.label} (${fmsClassification.risk})\n`;
    if (asymmetries.length > 0) {
      msg += `⚠️ *Assimetrias Detectadas:* ${asymmetries.length} testes apresentaram diferença D/E\n`;
    }
    msg += `📏 *Banco de Wells (Flexibilidade Posterior):* ${wellsDistance} cm (${wellsClass.text})\n`;
    msg += `⚖️ *Equilíbrio Dinâmico Y-Balance:* Anterior D: ${yBalanceAntR}cm | E: ${yBalanceAntL}cm (Dif: ${yAntDiff.toFixed(1)}cm)\n`;
    if (clinicalNotes) {
      msg += `\n📝 *Conduta & Recomendações:* ${clinicalNotes}`;
    }

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* HEADER DE AÇÕES */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Protocolo Funcional & FMS
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              Avaliação de Movimento, Mobilidade e Estabilidade
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            <span>Testes Funcionais & Triagem Biomecânica</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mapeamento de assimetrias, risco lesivo e mobilidade articular de <strong>{student.name}</strong>
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
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Testes</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Testes funcionais de {student.name} salvos com sucesso no sistema!</span>
        </div>
      )}

      {/* METADADOS DA AVALIAÇÃO */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Data do Teste Funcional:
          </label>
          <div className="relative">
            <input
              type="date"
              value={evaluationDate}
              onChange={(e) => setEvaluationDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Status do Aluno no Teste:
          </label>
          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>{student.name} ({student.gender || 'Gênero n/d'})</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold uppercase">
              Apto
            </span>
          </div>
        </div>
      </div>

      {/* DASHBOARD FMS: SCORE TOTAL & STATUS DE RISCO */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400 bg-amber-950/60 border border-amber-600/40 px-2.5 py-0.5 rounded-md">
                Escore Geral FMS
              </span>
              <span className="text-xs text-slate-400">• Bateria de 7 Movimentos (0 a 21)</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {totalFmsScore}
              </span>
              <span className="text-slate-400 font-bold text-lg">/ 21 pontos</span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              O corte clínico de 14 pontos prevê maior probabilidade de lesões musculoesqueléticas. Pontuações abaixo de 14 demandam trabalho prioritário de mobilidade e estabilidade postural.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 min-w-48">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-bold block mb-1">
                Classificação Funcional
              </span>
              <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{fmsClassification.label}</span>
              </div>
              <span className="text-[11px] text-amber-300 font-bold block mt-1">
                {fmsClassification.risk}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 min-w-44">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-bold block mb-1">
                Assimetrias Bilaterais
              </span>
              <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                {asymmetries.length > 0 ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span className="text-rose-300">{asymmetries.length} Movimento(s)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Nenhuma Assimetria</span>
                  </>
                )}
              </div>
              <span className="text-[11px] text-slate-300 font-medium block mt-1">
                {asymmetries.length > 0 ? 'Diferença D vs E detectada' : 'Simetria excelente'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 1: BATERIA COMPLETA DE TESTES FMS */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-600" />
              <span>Bateria FMS Oficial (Pontuação de 0 a 3 por Movimento)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              0 = Dor durante o teste | 1 = Incapaz de realizar | 2 = Realiza com compensação | 3 = Realiza perfeitamente
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">7 Padrões Motores</span>
        </div>

        <div className="space-y-3">
          {fmsList.map((item, idx) => {
            const finalScore = calculateTestScore(item);
            const isAsymmetric = item.hasBilateral && item.scoreRight !== item.scoreLeft;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.clearingTest === true
                    ? 'bg-rose-50/70 border-rose-300'
                    : isAsymmetric
                    ? 'bg-amber-50/50 border-amber-300'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-slate-900">
                        {item.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 font-bold text-slate-600">
                        {item.category}
                      </span>
                      {isAsymmetric && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 font-black text-amber-800 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          Assimetria D/E
                        </span>
                      )}
                      {item.clearingTest === true && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-100 border border-rose-300 font-black text-rose-800 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-rose-700" />
                          Dor no Descarte (Nota 0)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  {/* Controles de Pontuação */}
                  <div className="flex items-center gap-3 shrink-0 flex-wrap">
                    {item.hasBilateral ? (
                      <div className="flex items-center gap-2">
                        {/* Lado Direito */}
                        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
                          <span className="text-[11px] font-bold text-slate-500">D:</span>
                          <select
                            value={item.scoreRight ?? 2}
                            onChange={(e) => handleUpdateFmsScore(item.id, 'scoreRight', Number(e.target.value))}
                            className="bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer"
                          >
                            <option value={0}>0 (Dor)</option>
                            <option value={1}>1 (Incapaz)</option>
                            <option value={2}>2 (Compensa)</option>
                            <option value={3}>3 (Perfeito)</option>
                          </select>
                        </div>

                        {/* Lado Esquerdo */}
                        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
                          <span className="text-[11px] font-bold text-slate-500">E:</span>
                          <select
                            value={item.scoreLeft ?? 2}
                            onChange={(e) => handleUpdateFmsScore(item.id, 'scoreLeft', Number(e.target.value))}
                            className="bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer"
                          >
                            <option value={0}>0 (Dor)</option>
                            <option value={1}>1 (Incapaz)</option>
                            <option value={2}>2 (Compensa)</option>
                            <option value={3}>3 (Perfeito)</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-500">Escore:</span>
                        <select
                          value={item.scoreSingle ?? 2}
                          onChange={(e) => handleUpdateFmsScore(item.id, 'scoreSingle', Number(e.target.value))}
                          className="bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer"
                        >
                          <option value={0}>0 (Dor)</option>
                          <option value={1}>1 (Incapaz)</option>
                          <option value={2}>2 (Compensa)</option>
                          <option value={3}>3 (Perfeito)</option>
                        </select>
                      </div>
                    )}

                    {/* Nota Final do Movimento */}
                    <div className="w-12 h-9 rounded-xl bg-amber-500 text-white font-black text-base flex items-center justify-center shadow-xs">
                      {finalScore}
                    </div>
                  </div>
                </div>

                {/* Teste de Descarte (Clearing Test de Dor) se aplicável */}
                {item.clearingTestName && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      {item.clearingTestName}:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleClearing(item.id, false)}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          item.clearingTest === false
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Sem Dor (-)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleClearing(item.id, true)}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          item.clearingTest === true
                            ? 'bg-rose-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Com Dor (+)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO 2: BANCO DE WELLS (SENTAR E ALCANÇAR) & Y-BALANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* BANCO DE WELLS */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Flexibilidade de Isquiotibiais & Lombar (Banco de Wells)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Protocolo clássico de Sentar e Alcançar com fita métrica padronizada (cm)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Distância Atingida (cm):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  value={wellsDistance}
                  onChange={(e) => setWellsDistance(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-base font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-xs font-bold text-slate-500">cm</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Classificação Normativa ({student.gender || 'Geral'})
              </span>
              <div className={`text-base font-black ${wellsClass.color}`}>
                {wellsClass.text}
              </div>
              <p className="text-[10px] text-slate-500">
                Padrão populacional de referência Wells & Dillon.
              </p>
            </div>
          </div>
        </div>

        {/* Y-BALANCE TEST */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <span>Equilíbrio Dinâmico & Controle Neuromuscular (Y-Balance)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Alcance nos 3 eixos cardeais: Anterior, Póstero-Medial e Póstero-Lateral (cm)
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-600 block mb-1">Anterior:</span>
              <div className="space-y-1">
                <input
                  type="number"
                  placeholder="D (cm)"
                  value={yBalanceAntR}
                  onChange={(e) => setYBalanceAntR(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                  title="Anterior Direito"
                />
                <input
                  type="number"
                  placeholder="E (cm)"
                  value={yBalanceAntL}
                  onChange={(e) => setYBalanceAntL(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                  title="Anterior Esquerdo"
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-600 block mb-1">Póstero-Medial:</span>
              <div className="space-y-1">
                <input
                  type="number"
                  placeholder="D (cm)"
                  value={yBalancePMR}
                  onChange={(e) => setYBalancePMR(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                  title="Póstero-Medial Direito"
                />
                <input
                  type="number"
                  placeholder="E (cm)"
                  value={yBalancePML}
                  onChange={(e) => setYBalancePML(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                  title="Póstero-Medial Esquerdo"
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-600 block mb-1">Póstero-Lateral:</span>
              <div className="space-y-1">
                <input
                  type="number"
                  placeholder="D (cm)"
                  value={yBalancePLR}
                  onChange={(e) => setYBalancePLR(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                  title="Póstero-Lateral Direito"
                />
                <input
                  type="number"
                  placeholder="E (cm)"
                  value={yBalancePLL}
                  onChange={(e) => setYBalancePLL(parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                  title="Póstero-Lateral Esquerdo"
                />
              </div>
            </div>
          </div>

          <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
            isYBalanceRisk
              ? 'bg-rose-50 border-rose-300 text-rose-800'
              : 'bg-emerald-50 border-emerald-300 text-emerald-800'
          }`}>
            <span>Diferença Anterior D vs E: {yAntDiff.toFixed(1)} cm</span>
            <span>{isYBalanceRisk ? '⚠️ Assimetria >= 4cm (Risco Lesivo)' : '✓ Simétrico (< 4cm)'}</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: CONDUTA PREVENTIVA E PRESCRIÇÃO CORRETIVA */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
            Conduta Clínica & Exercícios Corretivos Recomendados
          </label>
          <span className="text-[10px] text-slate-400">
            Clique nas sugestões para inserir rapidamente
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            'Alongamento ativo de isquiotibiais e mobilidade de tornozelo',
            'Fortalecimento de glúteo médio para estabilização de quadril',
            'Mobilidade torácica em extensão e rotação com rolo miofascial',
            'Ativação neuromuscular de core com pranchas e bird-dog',
            'Evitar cargas axiais máximas até correção das assimetrias FMS',
            'Liberação miofascial de rotadores internos e peitorais'
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
          placeholder="Prescreva os exercícios corretivos e adaptações necessárias para a periodização de treino deste aluno..."
          className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
    </div>
  );
};
