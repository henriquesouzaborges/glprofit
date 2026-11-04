import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
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
  Target,
  Flame,
  Check
} from 'lucide-react';
import { Student } from '../../../types';

interface TestesForcaViewProps {
  student: Student;
  onSave?: (data: any) => void;
  initialWeightKg?: number;
  initialHeightCm?: number;
}

interface OneRmItem {
  id: string;
  exercise: string;
  category: string;
  weight: number; // kg
  reps: number; // 1 a 12
  formula: 'brzycki' | 'epley' | 'baechle';
}

export const TestesForcaView: React.FC<TestesForcaViewProps> = ({ student, onSave, initialWeightKg }) => {
  const STORAGE_KEY = `glprofit_testes_forca_${student?.id || 'default'}`;

  const [evaluationDate, setEvaluationDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [evaluatorName, setEvaluatorName] = useState('Prof. Gianluca Marinho (CREF 112001-G/SP)');
  const [studentWeight, setStudentWeight] = useState<number>(() => initialWeightKg || 75);

  useEffect(() => {
    if (initialWeightKg !== undefined && initialWeightKg > 0) {
      setStudentWeight(initialWeightKg);
    }
  }, [initialWeightKg]);

  // Lista de 4 Exercícios Fundamentais para 1RM
  const [oneRmList, setOneRmList] = useState<OneRmItem[]>([
    {
      id: '1rm_supino',
      exercise: 'Supino Reto (Barra)',
      category: 'Membros Superiores (Empurrar)',
      weight: 70,
      reps: 6,
      formula: 'brzycki'
    },
    {
      id: '1rm_agachamento',
      exercise: 'Agachamento Livre / Leg Press 45°',
      category: 'Membros Inferiores (Dominância Joelho)',
      weight: 100,
      reps: 8,
      formula: 'brzycki'
    },
    {
      id: '1rm_terra',
      exercise: 'Levantamento Terra (Deadlift)',
      category: 'Cadeia Posterior (Dominância Quadril)',
      weight: 110,
      reps: 5,
      formula: 'brzycki'
    },
    {
      id: '1rm_puxada',
      exercise: 'Puxada Alta / Barra Fixa',
      category: 'Membros Superiores (Puxar)',
      weight: 65,
      reps: 8,
      formula: 'brzycki'
    }
  ]);

  // Testes de Resistência Muscular Localizada (RML - ACSM)
  const [pushUpReps, setPushUpReps] = useState<number>(28);
  const [sitUpReps, setSitUpReps] = useState<number>(35);
  const [plankSeconds, setPlankSeconds] = useState<number>(75);

  // Dinamometria Manual (Preensão Palmar - kgf)
  const [handgripRight, setHandgripRight] = useState<number>(44);
  const [handgripLeft, setHandgripLeft] = useState<number>(42);

  // Observações e Metas
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
        if (initialWeightKg !== undefined && initialWeightKg > 0) {
          setStudentWeight(initialWeightKg);
        } else if (parsed.studentWeight) {
          setStudentWeight(parsed.studentWeight);
        }
        if (parsed.oneRmList) setOneRmList(parsed.oneRmList);
        if (parsed.pushUpReps !== undefined) setPushUpReps(parsed.pushUpReps);
        if (parsed.sitUpReps !== undefined) setSitUpReps(parsed.sitUpReps);
        if (parsed.plankSeconds !== undefined) setPlankSeconds(parsed.plankSeconds);
        if (parsed.handgripRight !== undefined) setHandgripRight(parsed.handgripRight);
        if (parsed.handgripLeft !== undefined) setHandgripLeft(parsed.handgripLeft);
        if (parsed.clinicalNotes) setClinicalNotes(parsed.clinicalNotes);
      }
    } catch {
      // Ignora erro de parse
    }
  }, [STORAGE_KEY]);

  // Equações de predição de 1RM
  const calculateEstimated1Rm = (weight: number, reps: number, formula: 'brzycki' | 'epley' | 'baechle'): number => {
    if (reps <= 1) return weight;
    if (weight <= 0) return 0;

    let res = 0;
    if (formula === 'brzycki') {
      // Brzycki: 1RM = Carga / (1.0278 - 0.0278 * Reps)
      res = weight / (1.0278 - 0.0278 * reps);
    } else if (formula === 'epley') {
      // Epley: 1RM = Carga * (1 + Reps / 30)
      res = weight * (1 + reps / 30);
    } else {
      // Baechle: 1RM = Carga * (1 + 0.033 * Reps)
      res = weight * (1 + 0.033 * reps);
    }
    return Math.round(res * 10) / 10;
  };

  // Classificação do Teste de Flexão de Braço (Push-ups) ACSM
  const getPushUpClassification = (reps: number, gender: string) => {
    const isMale = gender === 'masculino';
    if (isMale) {
      if (reps >= 36) return { text: 'Excelente', color: 'text-emerald-600', badge: 'Alta Performance' };
      if (reps >= 29) return { text: 'Bom', color: 'text-blue-600', badge: 'Acima da Média' };
      if (reps >= 22) return { text: 'Médio', color: 'text-slate-700', badge: 'Na Média' };
      if (reps >= 17) return { text: 'Regular', color: 'text-amber-600', badge: 'Abaixo da Média' };
      return { text: 'Fraco', color: 'text-rose-600', badge: 'Necessita Atenção' };
    } else {
      if (reps >= 30) return { text: 'Excelente', color: 'text-emerald-600', badge: 'Alta Performance' };
      if (reps >= 23) return { text: 'Bom', color: 'text-blue-600', badge: 'Acima da Média' };
      if (reps >= 15) return { text: 'Médio', color: 'text-slate-700', badge: 'Na Média' };
      if (reps >= 10) return { text: 'Regular', color: 'text-amber-600', badge: 'Abaixo da Média' };
      return { text: 'Fraco', color: 'text-rose-600', badge: 'Necessita Atenção' };
    }
  };

  const pushUpClass = getPushUpClassification(pushUpReps, student.gender || 'masculino');

  // Classificação da Prancha Isométrica
  const getPlankClassification = (sec: number) => {
    if (sec >= 120) return { text: 'Excelente (>= 2 min)', color: 'text-emerald-600' };
    if (sec >= 90) return { text: 'Bom (90 a 120s)', color: 'text-blue-600' };
    if (sec >= 60) return { text: 'Médio (60 a 90s)', color: 'text-slate-700' };
    if (sec >= 30) return { text: 'Regular (30 a 60s)', color: 'text-amber-600' };
    return { text: 'Fraco (< 30s)', color: 'text-rose-600' };
  };

  const plankClass = getPlankClassification(plankSeconds);

  // Assimetria de Preensão Palmar (D vs E)
  const handgripDiff = Math.abs(handgripRight - handgripLeft);
  const handgripDiffPct = handgripRight > 0 ? (handgripDiff / handgripRight) * 100 : 0;

  const handleUpdateOneRm = (id: string, field: 'weight' | 'reps' | 'formula', val: any) => {
    setOneRmList(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
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
      studentWeight,
      oneRmList: oneRmList.map(item => ({
        ...item,
        estimated1Rm: calculateEstimated1Rm(item.weight, item.reps, item.formula),
        relativeStrength: (calculateEstimated1Rm(item.weight, item.reps, item.formula) / (studentWeight || 1)).toFixed(2)
      })),
      rml: {
        pushUpReps,
        pushUpClass,
        sitUpReps,
        plankSeconds,
        plankClass
      },
      handgrip: {
        right: handgripRight,
        left: handgripLeft,
        diffKg: handgripDiff,
        diffPct: handgripDiffPct
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
    let msg = `💪 *GL PRO FIT • AVALIAÇÃO DE FORÇA & 1RM*\n`;
    msg += `👤 *Aluno:* ${student.name} (${student.code})\n`;
    msg += `📅 *Data:* ${formattedDate} | *Avaliador:* ${evaluatorName}\n\n`;
    msg += `🏋️‍♂️ *Cargas Máximas Estimadas (1RM):*\n`;
    oneRmList.forEach(item => {
      const rm = calculateEstimated1Rm(item.weight, item.reps, item.formula);
      const rel = (rm / (studentWeight || 1)).toFixed(2);
      msg += `• ${item.exercise}: *${rm} kg* (${rel}x peso corporal)\n`;
    });
    msg += `\n⚡ *Resistência Muscular (RML):*\n`;
    msg += `• Flexões de Braço: *${pushUpReps} reps* (${pushUpClass.text})\n`;
    msg += `• Abdominais 1 min: *${sitUpReps} reps*\n`;
    msg += `• Prancha Isométrica: *${plankSeconds} seg* (${plankClass.text})\n`;
    msg += `• Preensão Palmar: D: ${handgripRight}kgf | E: ${handgripLeft}kgf\n`;
    if (clinicalNotes) {
      msg += `\n📝 *Conduta de Cargas:* ${clinicalNotes}`;
    }

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* HEADER DE AÇÕES */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Protocolo de Carga Máxima & RML
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">
              1RM Preditivo, Zonas de Treino e Dinamometria
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-blue-600" />
            <span>Testes de Força Muscular & 1RM</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cálculo de repetições máximas e parâmetros para periodização de sobrecarga de <strong>{student.name}</strong>
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
            className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Força</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Testes de força e cálculos de 1RM salvos com sucesso no sistema!</span>
        </div>
      )}

      {/* METADADOS DA AVALIAÇÃO */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Data do Teste de Força:
          </label>
          <div className="relative">
            <input
              type="date"
              value={evaluationDate}
              onChange={(e) => setEvaluationDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Peso Corporal no Teste (kg):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.5"
              value={studentWeight}
              onChange={(e) => setStudentWeight(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <span className="text-xs font-bold text-slate-500">kg</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 1: CALCULADORA DE 1RM PREDITIVO E ZONAS DE CARGA */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-blue-700" />
              <span>Calculadora de 1RM Preditivo (Cargas Máximas)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Insira a carga levantada e repetições executadas até a falha concêntrica para estimar a 1RM
            </p>
          </div>
          <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            Fórmulas: Brzycki / Epley / Baechle
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {oneRmList.map((item) => {
            const estimated1Rm = calculateEstimated1Rm(item.weight, item.reps, item.formula);
            const relativeStrength = studentWeight > 0 ? (estimated1Rm / studentWeight).toFixed(2) : '0';

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{item.exercise}</h4>
                    <span className="text-[10px] text-slate-500">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">1RM Estimada</span>
                    <span className="text-lg font-black text-blue-700">{estimated1Rm} kg</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Carga (kg):</label>
                    <input
                      type="number"
                      value={item.weight}
                      onChange={(e) => handleUpdateOneRm(item.id, 'weight', parseFloat(e.target.value) || 0)}
                      className="w-full p-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Repetições:</label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={item.reps}
                      onChange={(e) => handleUpdateOneRm(item.id, 'reps', parseInt(e.target.value) || 1)}
                      className="w-full p-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Fórmula:</label>
                    <select
                      value={item.formula}
                      onChange={(e) => handleUpdateOneRm(item.id, 'formula', e.target.value)}
                      className="w-full p-1.5 rounded-lg border border-slate-300 bg-white text-[11px] font-semibold text-slate-800"
                    >
                      <option value="brzycki">Brzycki</option>
                      <option value="epley">Epley</option>
                      <option value="baechle">Baechle</option>
                    </select>
                  </div>
                </div>

                {/* Zonas de Treinamento (% de 1RM) */}
                <div className="pt-2 border-t border-slate-200/80">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-semibold">
                    <span>Força Relativa: <strong className="text-slate-900">{relativeStrength}x PC</strong></span>
                    <span>Zonas Percentuais de Sobrecarga</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div className="p-1 rounded bg-white border border-slate-200">
                      <span className="text-[9px] text-slate-400 block">90% (Força)</span>
                      <span className="text-[11px] font-black text-rose-700">{(estimated1Rm * 0.9).toFixed(1)}k</span>
                    </div>
                    <div className="p-1 rounded bg-white border border-slate-200">
                      <span className="text-[9px] text-slate-400 block">80% (Hiper.)</span>
                      <span className="text-[11px] font-black text-blue-700">{(estimated1Rm * 0.8).toFixed(1)}k</span>
                    </div>
                    <div className="p-1 rounded bg-white border border-slate-200">
                      <span className="text-[9px] text-slate-400 block">70% (Volume)</span>
                      <span className="text-[11px] font-black text-emerald-700">{(estimated1Rm * 0.7).toFixed(1)}k</span>
                    </div>
                    <div className="p-1 rounded bg-white border border-slate-200">
                      <span className="text-[9px] text-slate-400 block">60% (Resist.)</span>
                      <span className="text-[11px] font-black text-slate-700">{(estimated1Rm * 0.6).toFixed(1)}k</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO 2: TESTES DE RESISTÊNCIA MUSCULAR LOCALIZADA (RML - ACSM) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-600" />
            <span>Testes de Resistência Muscular Localizada (ACSM)</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Protocolos padronizados de flexão de braço, abdominais e sustentação isométrica de prancha
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* FLEXÃO DE BRAÇO */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">Flexão de Braço (Push-ups)</span>
              <span className={`text-[10px] font-bold ${pushUpClass.color}`}>{pushUpClass.text}</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Número máximo de repetições contínuas sem pausa no solo.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min={0}
                value={pushUpReps}
                onChange={(e) => setPushUpReps(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-base font-black text-slate-900"
              />
              <span className="text-xs font-bold text-slate-500">reps</span>
            </div>
            <div className="text-[10px] font-bold text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
              Padrão ACSM: {pushUpClass.badge}
            </div>
          </div>

          {/* ABDOMINAIS EM 1 MINUTO */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">Abdominais (1 Minuto)</span>
              <span className="text-[10px] font-bold text-blue-600">Teste de Crunch</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Repetições completadas em 60 segundos com mãos nas coxas.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min={0}
                value={sitUpReps}
                onChange={(e) => setSitUpReps(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-base font-black text-slate-900"
              />
              <span className="text-xs font-bold text-slate-500">reps</span>
            </div>
            <div className="text-[10px] font-bold text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
              Força & Resistência de Parede Abdominal
            </div>
          </div>

          {/* PRANCHA ISOMÉTRICA */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">Prancha Isométrica (Core)</span>
              <span className={`text-[10px] font-bold ${plankClass.color}`}>{plankClass.text}</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Tempo de sustentação em prancha ventral antes da quebra postural.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min={0}
                value={plankSeconds}
                onChange={(e) => setPlankSeconds(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-base font-black text-slate-900"
              />
              <span className="text-xs font-bold text-slate-500">seg</span>
            </div>
            <div className="text-[10px] font-bold text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
              Estabilidade lombo-pélvica e antiflexão
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO 3: DINAMOMETRIA MANUAL (PREENSÃO PALMAR) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>Dinamometria Manual (Handgrip - Preensão Palmar em kgf)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Biomarcador clínico de força global, saúde neuromuscular e simetria de membros superiores
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">Dinamômetro Jamar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mão Direita (kgf):</label>
            <input
              type="number"
              step="0.5"
              value={handgripRight}
              onChange={(e) => setHandgripRight(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-base font-black text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mão Esquerda (kgf):</label>
            <input
              type="number"
              step="0.5"
              value={handgripLeft}
              onChange={(e) => setHandgripLeft(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-base font-black text-slate-900"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Assimetria Bilateral</span>
            <div className="text-sm font-black text-slate-900">
              Diferença: {handgripDiff.toFixed(1)} kgf ({handgripDiffPct.toFixed(1)}%)
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {handgripDiffPct > 10 ? '⚠️ Assimetria superior a 10% entre membros' : '✓ Simetria dentro do esperado'}
            </p>
          </div>
        </div>
      </div>

      {/* SEÇÃO 4: PRESCRIÇÃO DE CARGAS & CONDUTA DO TREINADOR */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
            Conduta do Treinador & Diretrizes de Sobrecarga
          </label>
          <span className="text-[10px] text-slate-400">
            Clique nas sugestões para inserir rapidamente
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            'Periodização linear com progressão de 2.5kg a 5kg quinzenal',
            'Manter faixa de 8 a 10 reps (75% a 80% 1RM) para hipertrofia miofibrilar',
            'Priorizar fortalecimento de preensão manual e antebraços',
            'Treinamento complementar de core para sustentação de cargas no agachamento',
            'Reavaliação de 1RM programada para 8 semanas'
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
          placeholder="Insira as diretrizes de cargas máximas, repetições de reserva e metas para a periodização deste aluno..."
          className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
    </div>
  );
};
