import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Activity, 
  Zap, 
  Timer, 
  TrendingUp, 
  CheckCircle2, 
  Save, 
  Share2, 
  Printer, 
  User, 
  Calendar, 
  Gauge, 
  Target, 
  AlertTriangle,
  RotateCcw,
  Footprints,
  Compass,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  FileSpreadsheet,
  Check,
  ChevronRight,
  ShieldCheck,
  Info
} from 'lucide-react';
import { Student } from '../../../types';

interface TestesCampoViewProps {
  student: Student;
  onSave?: (data: any) => void;
  initialWeightKg?: number;
  initialHeightCm?: number;
}

type FieldTestTab = 'yoyo' | 'rast' | 'teste_t' | 'cooper' | 'milha';

// Atletas de referência extraídos diretamente da Planilha Oficial Google Sheets
const SPREADSHEET_EXAMPLES = [
  {
    name: 'Matheus Vanderlei Fonseca',
    year: 2014,
    modality: 'FUTSAL' as const,
    weight: 42,
    yoyo: { voltas: 8, metros: 320, obs: 'O atleta teve dificuldades para manter o ritmo logo após a quarta volta; Transpiração leve;' },
    rast: { distance: 20, sprints: [4.78, 5.15, 5.20, 5.22, 5.22, 5.31], obs: 'O teste foi reduzido para 20m para adequação; Marcha equilibrada nos primeiros 4 sprints.' },
    testeT: { v1: 12.90, v2: 26.88, obs: 'Maior dificuldade na primeira aceleração do teste; Mudança de direção a melhorar;' }
  },
  {
    name: 'Lucas Tibana Cordeiro de Castro',
    year: 2012,
    modality: 'FUTSAL' as const,
    weight: 48,
    yoyo: { voltas: 8.5, metros: 340, obs: 'Movimentos desequilibrados por conta do cansaço a partir da quarta volta;' },
    rast: { distance: 20, sprints: [5.16, 4.91, 5.00, 5.46, 5.47, 5.65], obs: 'Corrida com tronco curvado e declinado; Visão voltada para baixo.' },
    testeT: { v1: 12.77, v2: 26.62, obs: 'Boa transição lateral nos cones intermediários; desaceleração controlada.' }
  },
  {
    name: 'Juliano Ferreira Pinto',
    year: 2010,
    modality: 'CAMPO' as const,
    weight: 62,
    yoyo: { voltas: 28, metros: 1120, obs: 'Excelente tolerância ao lactato; ritmo estável até o estágio 16.' },
    rast: { distance: 35, sprints: [3.69, 3.59, 3.81, 3.84, 3.85, 3.84], obs: 'Alta potência explosiva; excelente manutenção de velocidade em 35m.' },
    testeT: { v1: 11.52, v2: 23.62, obs: 'Excelente agilidade com giro baixo de quadril e toque firme no cone.' }
  },
  {
    name: 'Pietro Noah Paiva de Carvalho',
    year: 2015,
    modality: 'FUTSAL' as const,
    weight: 38,
    yoyo: { voltas: 32, metros: 1280, obs: 'Destacada capacidade cardiorrespiratória e resistência aeróbia na categoria.' },
    rast: { distance: 20, sprints: [4.45, 4.52, 4.60, 4.68, 4.70, 4.82], obs: 'Velocidade de partida excelente.' },
    testeT: { v1: 11.20, v2: 22.90, obs: 'Ótima troca de direção e base estável.' }
  }
];

export const TestesCampoView: React.FC<TestesCampoViewProps> = ({ 
  student, 
  onSave,
  initialWeightKg,
  initialHeightCm 
}) => {
  const STORAGE_KEY = `glprofit_testes_campo_${student?.id || 'default'}`;

  const [activeTab, setActiveTab] = useState<FieldTestTab>('yoyo');
  const [evaluationDate, setEvaluationDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [evaluatorName, setEvaluatorName] = useState('Prof. Gianluca Marinho (CREF 112001-G/SP)');
  const [modality, setModality] = useState<'CAMPO' | 'FUTSAL' | 'FUTEBOL'>('CAMPO');
  const [athleteCategory, setAthleteCategory] = useState<'BASE' | 'ADULTO'>('BASE');
  const [studentWeight, setStudentWeight] = useState<number>(() => {
    return initialWeightKg || 68;
  });

  useEffect(() => {
    if (initialWeightKg !== undefined && initialWeightKg > 0) {
      setStudentWeight(initialWeightKg);
    }
  }, [initialWeightKg]);
  const [studentAge, setStudentAge] = useState<number>(() => {
    if (student.birthDate) {
      const birth = new Date(student.birthDate);
      const diff = Date.now() - birth.getTime();
      const ageDate = new Date(diff);
      return Math.abs(ageDate.getUTCFullYear() - 1970) || 20;
    }
    return 19;
  });

  // ==========================================
  // 1. TESTE YO-YO (Resistência Intermitente)
  // ==========================================
  const [yoyoVoltas, setYoyoVoltas] = useState<number>(20);
  const [yoyoMetros, setYoyoMetros] = useState<number>(800);
  const [yoyoEstagio, setYoyoEstagio] = useState<string>('Nível 15.2');
  const [yoyoObs, setYoyoObs] = useState<string>(
    'O atleta manteve boa cadência inicial; ligeira perda de estabilidade nas curvas após a 15ª volta; transpiração moderada.'
  );

  // ==========================================
  // 2. TESTE RAST (Potência Anaeróbia 6xSprints)
  // ==========================================
  const [rastDistance, setRastDistance] = useState<35 | 20>(35); // 35m oficial ou 20m reduzido (conforme planilha)
  const [rastSprints, setRastSprints] = useState<number[]>([4.12, 4.18, 4.25, 4.31, 4.38, 4.45]);
  const [rastObs, setRastObs] = useState<string>(
    'Marcha reta e equilibrada nos primeiros 4 sprints; melhora na aceleração do primeiro trecho; boa desaceleração.'
  );

  // ==========================================
  // 3. TESTE T (Agilidade e Mudança de Direção)
  // ==========================================
  const [testeTVolta1, setTesteTVolta1] = useState<number>(10.15);
  const [testeTVolta2, setTesteTVolta2] = useState<number>(20.80);
  const [testeTObs, setTesteTObs] = useState<string>(
    'O atleta realizou movimentos equilibrados; boa troca de pés no cone esquerdo; centro de gravidade bem rebaixado.'
  );

  // ==========================================
  // 4. TESTE DE COOPER (12 Minutos)
  // ==========================================
  const [cooperMeters, setCooperMeters] = useState<number>(2550);
  const [cooperObs, setCooperObs] = useState<string>('Ritmo constante de prova; sprint final nos últimos 90 segundos.');

  // ==========================================
  // 5. TESTE DE 1 MILHA (Rockport / ACSM 1609m)
  // ==========================================
  const [mileMode, setMileMode] = useState<'walk' | 'run'>('walk');
  const [mileMinutes, setMileMinutes] = useState<number>(13);
  const [mileSeconds, setMileSeconds] = useState<number>(25);
  const [mileHeartRate, setMileHeartRate] = useState<number>(152); // BPM final
  const [mileObs, setMileObs] = useState<string>('Passada ampla e ritmada, excelente recuperação cardiovascular.');

  // Observações Gerais & Conduta
  const [generalNotes, setGeneralNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Metrônomo Sonoro Simulado com Web Audio API
  const [isPlayingMetronome, setIsPlayingMetronome] = useState(false);
  const [beepInterval, setBeepInterval] = useState<any>(null);

  // Sincroniza metros do Yo-yo ao alterar voltas
  const handleUpdateYoyoVoltas = (val: number) => {
    setYoyoVoltas(val);
    setYoyoMetros(Math.round(val * 40));
  };

  const handleUpdateYoyoMetros = (val: number) => {
    setYoyoMetros(val);
    setYoyoVoltas(Math.round((val / 40) * 10) / 10);
  };

  // Carrega do LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.evaluationDate) setEvaluationDate(parsed.evaluationDate);
        if (parsed.evaluatorName) setEvaluatorName(parsed.evaluatorName);
        if (parsed.modality) setModality(parsed.modality);
        if (parsed.athleteCategory) setAthleteCategory(parsed.athleteCategory);
        if (initialWeightKg !== undefined && initialWeightKg > 0) {
          setStudentWeight(initialWeightKg);
        } else if (parsed.studentWeight) {
          setStudentWeight(parsed.studentWeight);
        }
        if (parsed.studentAge) setStudentAge(parsed.studentAge);
        if (parsed.yoyoVoltas !== undefined) setYoyoVoltas(parsed.yoyoVoltas);
        if (parsed.yoyoMetros !== undefined) setYoyoMetros(parsed.yoyoMetros);
        if (parsed.yoyoEstagio) setYoyoEstagio(parsed.yoyoEstagio);
        if (parsed.yoyoObs) setYoyoObs(parsed.yoyoObs);
        if (parsed.rastDistance !== undefined) setRastDistance(parsed.rastDistance);
        if (parsed.rastSprints) setRastSprints(parsed.rastSprints);
        if (parsed.rastObs) setRastObs(parsed.rastObs);
        if (parsed.testeTVolta1 !== undefined) setTesteTVolta1(parsed.testeTVolta1);
        if (parsed.testeTVolta2 !== undefined) setTesteTVolta2(parsed.testeTVolta2);
        if (parsed.testeTObs) setTesteTObs(parsed.testeTObs);
        if (parsed.cooperMeters !== undefined) setCooperMeters(parsed.cooperMeters);
        if (parsed.cooperObs) setCooperObs(parsed.cooperObs);
        if (parsed.mileMode) setMileMode(parsed.mileMode);
        if (parsed.mileMinutes !== undefined) setMileMinutes(parsed.mileMinutes);
        if (parsed.mileSeconds !== undefined) setMileSeconds(parsed.mileSeconds);
        if (parsed.mileHeartRate !== undefined) setMileHeartRate(parsed.mileHeartRate);
        if (parsed.mileObs) setMileObs(parsed.mileObs);
        if (parsed.generalNotes) setGeneralNotes(parsed.generalNotes);
      }
    } catch {
      // Ignora erro
    }
  }, [STORAGE_KEY]);

  // Limpa o metrônomo ao desmontar
  useEffect(() => {
    return () => {
      if (beepInterval) clearInterval(beepInterval);
    };
  }, [beepInterval]);

  const playBeepSound = (freq = 880, duration = 0.15) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Áudio silenciado ou não permitido pelo navegador
    }
  };

  const toggleMetronome = () => {
    if (isPlayingMetronome) {
      if (beepInterval) clearInterval(beepInterval);
      setIsPlayingMetronome(false);
    } else {
      setIsPlayingMetronome(true);
      playBeepSound(1046, 0.25);
      const interval = setInterval(() => {
        playBeepSound(880, 0.15);
      }, 2500);
      setBeepInterval(interval);
    }
  };

  // Carrega exemplo da planilha oficial
  const handleLoadSpreadsheetExample = (exampleIndex: number) => {
    const ex = SPREADSHEET_EXAMPLES[exampleIndex];
    if (!ex) return;
    setModality(ex.modality);
    setStudentWeight(ex.weight);
    setYoyoVoltas(ex.yoyo.voltas);
    setYoyoMetros(ex.yoyo.metros);
    setYoyoObs(ex.yoyo.obs);
    setRastDistance(ex.rast.distance as 35 | 20);
    setRastSprints([...ex.rast.sprints]);
    setRastObs(ex.rast.obs);
    setTesteTVolta1(ex.testeT.v1);
    setTesteTVolta2(ex.testeT.v2);
    setTesteTObs(ex.testeT.obs);
    setGeneralNotes(`Atleta de exemplo sincronizado da Planilha Oficial: ${ex.name} (Ano: ${ex.year}, Modalidade: ${ex.modality})`);
  };

  // ==========================================
  // CÁLCULOS CIENTÍFICOS DOS TESTES
  // ==========================================

  // 1. YO-YO:
  // Classificação da planilha:
  // - Categoria Base (Dashboard): Ruim < 500m, Média 500 a 800m, Bom > 800m
  // - Categoria Adulto/Geral (Aba Yoyo): Ruim < 1200m, Média 1200 a 1500m, Bom > 1500m
  const getYoyoClassification = (m: number, cat: 'BASE' | 'ADULTO') => {
    if (cat === 'BASE') {
      if (m >= 800) return { text: 'BOM / EXCELENTE (> 800m)', status: 'BOM', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
      if (m >= 500) return { text: 'MÉDIA (500 a 800m)', status: 'MÉDIA', color: 'text-blue-700 bg-blue-50 border-blue-300' };
      return { text: 'ABAIXO DA MÉDIA / RUIM (< 500m)', status: 'RUIM', color: 'text-rose-700 bg-rose-50 border-rose-300' };
    } else {
      if (m >= 1500) return { text: 'BOM / EXCELENTE (> 1500m)', status: 'BOM', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
      if (m >= 1200) return { text: 'MÉDIA (1200 a 1500m)', status: 'MÉDIA', color: 'text-blue-700 bg-blue-50 border-blue-300' };
      return { text: 'RUIM (< 1200m)', status: 'RUIM', color: 'text-rose-700 bg-rose-50 border-rose-300' };
    }
  };
  const yoyoClass = getYoyoClassification(yoyoMetros, athleteCategory);
  // VO2máx Bangsbo (2008): VO2máx = Distância (m) * 0.0084 + 36.4
  const yoyoVo2 = (yoyoMetros * 0.0084 + 36.4).toFixed(1);
  const yoyoVma = (10 + (yoyoVoltas * 0.25)).toFixed(1); // Velocidade máxima estimada km/h

  // 2. RAST:
  // Média dos 6 sprints
  const rastAvgTime = rastSprints.length > 0 
    ? (rastSprints.reduce((a, b) => a + b, 0) / rastSprints.length).toFixed(2) 
    : '0';
  const rastBestTime = Math.min(...rastSprints);
  const rastWorstTime = Math.max(...rastSprints);

  // Classificação da média conforme planilha:
  // - 35m: Bom < 3.5s, Média 3.5 a 4.0s, Ruim > 4.0s
  // - 20m: Bom < 4.5s, Média 4.5 a 5.0s, Ruim > 5.0s
  const getRastClassification = (avg: number, dist: number) => {
    if (dist === 20) {
      if (avg < 4.5) return { text: 'BOM (< 4.5s)', status: 'BOM', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
      if (avg <= 5.0) return { text: 'MÉDIA (4.5s a 5.0s)', status: 'MÉDIA', color: 'text-blue-700 bg-blue-50 border-blue-300' };
      return { text: 'RUIM (> 5.0s)', status: 'RUIM', color: 'text-rose-700 bg-rose-50 border-rose-300' };
    } else {
      if (avg < 3.5) return { text: 'BOM (< 3.5s)', status: 'BOM', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
      if (avg <= 4.0) return { text: 'MÉDIA (3.5s a 4.0s)', status: 'MÉDIA', color: 'text-blue-700 bg-blue-50 border-blue-300' };
      return { text: 'RUIM (> 4.0s)', status: 'RUIM', color: 'text-rose-700 bg-rose-50 border-rose-300' };
    }
  };
  const rastClass = getRastClassification(parseFloat(rastAvgTime), rastDistance);

  // Potência de cada sprint em Watts: Potência = (Massa * Distância²) / t³
  const rastPowersWatts = rastSprints.map(t => {
    if (t <= 0) return 0;
    const distSq = rastDistance * rastDistance;
    return Math.round((studentWeight * distSq) / Math.pow(t, 3));
  });

  const maxPowerWatts = Math.max(...rastPowersWatts);
  const minPowerWatts = Math.min(...rastPowersWatts);
  const avgPowerWatts = Math.round(rastPowersWatts.reduce((a, b) => a + b, 0) / (rastPowersWatts.length || 1));
  const maxPowerRelWkg = studentWeight > 0 ? (maxPowerWatts / studentWeight).toFixed(1) : '0';

  // Índice de Fadiga RAST: (Potência Máx - Potência Mín) / Tempo Total (W/s)
  const rastTotalTime = rastSprints.reduce((a, b) => a + b, 0);
  const fatigueIndexWs = rastTotalTime > 0 ? ((maxPowerWatts - minPowerWatts) / rastTotalTime).toFixed(1) : '0';
  const fatigueIndexPct = maxPowerWatts > 0 ? (((maxPowerWatts - minPowerWatts) / maxPowerWatts) * 100).toFixed(1) : '0';

  // 3. TESTE T:
  // Conforme planilha:
  // 1ª Volta: Bom < 8s (ou < 9s no Dashboard), Média 8 a 10s (9 a 10s), Ruim > 10s
  // 2ª Volta: Bom < 17s, Média 17 a 20s, Ruim > 20s
  const getTesteTClass = (v1: number, v2: number) => {
    let t1Text = v1 < 9 ? 'BOM (< 9s)' : v1 <= 10 ? 'MÉDIA (9 a 10s)' : 'RUIM (> 10s)';
    let t1Status = v1 < 9 ? 'BOM' : v1 <= 10 ? 'MÉDIA' : 'RUIM';
    let t2Text = v2 < 17 ? 'BOM (< 17s)' : v2 <= 20 ? 'MÉDIA (17 a 20s)' : 'RUIM (> 20s)';
    let t2Status = v2 < 17 ? 'BOM' : v2 <= 20 ? 'MÉDIA' : 'RUIM';
    return { v1: t1Text, v1Status: t1Status, v2: t2Text, v2Status: t2Status };
  };
  const testeTClass = getTesteTClass(testeTVolta1, testeTVolta2);

  // 4. TESTE DE COOPER:
  // VO2máx = (Distância - 504.9) / 44.73
  const cooperVo2 = cooperMeters > 504.9 
    ? (((cooperMeters - 504.9) / 44.73)).toFixed(1) 
    : '0';
  const cooperPace = cooperMeters > 0 
    ? (12 / (cooperMeters / 1000)).toFixed(2) 
    : '0';
  const cooperSpeedKmH = cooperMeters > 0 ? ((cooperMeters / 12) * 60 / 1000).toFixed(1) : '0';

  const getCooperClassification = (m: number) => {
    if (m >= 2800) return { text: 'Excelente (> 2800m)', status: 'EXCELENTE', color: 'text-emerald-700 bg-emerald-50' };
    if (m >= 2400) return { text: 'Bom (2400 a 2800m)', status: 'BOM', color: 'text-blue-700 bg-blue-50' };
    if (m >= 2000) return { text: 'Médio (2000 a 2400m)', status: 'MÉDIO', color: 'text-amber-700 bg-amber-50' };
    return { text: 'Abaixo da Média (< 2000m)', status: 'RUIM', color: 'text-rose-700 bg-rose-50' };
  };
  const cooperClass = getCooperClassification(cooperMeters);

  // 5. TESTE DE 1 MILHA (ROCKPORT):
  // VO2máx = 132.853 - (0.0769 * Peso_lb) - (0.3877 * Idade) + (6.315 * Sexo) - (3.2649 * Tempo_min) - (0.1565 * FC)
  const totalMileMinutes = mileMinutes + (mileSeconds / 60);
  const weightLbs = studentWeight * 2.20462;
  const isMaleFactor = 1; // 1 para masculino
  const rockportVo2 = totalMileMinutes > 0 && mileHeartRate > 0
    ? (132.853 - (0.0769 * weightLbs) - (0.3877 * studentAge) + (6.315 * isMaleFactor) - (3.2649 * totalMileMinutes) - (0.1565 * mileHeartRate)).toFixed(1)
    : '0';

  // Frequência Cardíaca Máxima estimada por Tanaka (208 - 0.7 * idade)
  const estimatedFcMax = Math.round(208 - 0.7 * studentAge);

  const handleUpdateRastSprint = (idx: number, val: number) => {
    setRastSprints(prev => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleAppendClinicalNote = (note: string) => {
    setGeneralNotes(prev => {
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
      modality,
      athleteCategory,
      studentWeight,
      studentAge,
      yoyo: {
        voltas: yoyoVoltas,
        metros: yoyoMetros,
        estagio: yoyoEstagio,
        vo2max: yoyoVo2,
        vmaKmH: yoyoVma,
        classificacao: yoyoClass.text,
        status: yoyoClass.status,
        obs: yoyoObs
      },
      rast: {
        distance: rastDistance,
        sprints: rastSprints,
        powersWatts: rastPowersWatts,
        avgTime: rastAvgTime,
        bestTime: rastBestTime,
        worstTime: rastWorstTime,
        maxPowerWatts,
        maxPowerRelWkg,
        minPowerWatts,
        avgPowerWatts,
        fatigueIndexWs,
        fatigueIndexPct,
        classificacao: rastClass.text,
        status: rastClass.status,
        obs: rastObs
      },
      testeT: {
        volta1: testeTVolta1,
        volta2: testeTVolta2,
        classificacaoV1: testeTClass.v1,
        statusV1: testeTClass.v1Status,
        classificacaoV2: testeTClass.v2,
        obs: testeTObs
      },
      cooper: {
        meters: cooperMeters,
        vo2max: cooperVo2,
        pace: cooperPace,
        speedKmH: cooperSpeedKmH,
        classificacao: cooperClass.text,
        obs: cooperObs
      },
      mile: {
        mode: mileMode,
        minutes: mileMinutes,
        seconds: mileSeconds,
        heartRate: mileHeartRate,
        vo2max: rockportVo2,
        obs: mileObs
      },
      generalNotes,
      savedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    if (onSave) onSave(payload);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const formattedDate = evaluationDate.split('-').reverse().join('/');
    let msg = `⚽ *GL PRO FIT • RELATÓRIO OFICIAL DE TESTES DE CAMPO*\n`;
    msg += `👤 *Atleta:* ${student.name} (${student.code})\n`;
    msg += `📅 *Data:* ${formattedDate} | *Modalidade:* ${modality} (${athleteCategory})\n`;
    msg += `⚖️ *Peso:* ${studentWeight} kg | 🎂 *Idade:* ${studentAge} anos\n`;
    msg += `👨‍🏫 *Avaliador:* ${evaluatorName}\n\n`;

    msg += `📊 *--- PAINEL DOS 3 PILARES (PLANILHA OFICIAL) ---*\n`;
    msg += `1️⃣ *RESISTÊNCIA (Yo-Yo):* ${yoyoMetros}m (${yoyoVoltas} voltas) -> *Nível: ${yoyoClass.status}*\n`;
    msg += `   • VO2máx: ${yoyoVo2} ml/kg/min | VMA: ${yoyoVma} km/h\n`;
    msg += `2️⃣ *POTÊNCIA (RAST ${rastDistance}m):* Média ${rastAvgTime}s -> *Nível: ${rastClass.status}*\n`;
    msg += `   • Potência Pico: ${maxPowerWatts}W (${maxPowerRelWkg} W/kg) | Fadiga: ${fatigueIndexWs} W/s (${fatigueIndexPct}%)\n`;
    msg += `3️⃣ *AGILIDADE (Teste T):* Volta 1: ${testeTVolta1}s -> *Nível: ${testeTClass.v1Status}*\n`;
    msg += `   • Volta 2 / Total: ${testeTVolta2}s\n\n`;

    msg += `🏃‍♂️ *--- CAPACIDADE AERÓBIA COMPLEMENTAR ---*\n`;
    msg += `⏱️ *Teste de Cooper (12m):* ${cooperMeters}m (VO2: ${cooperVo2} ml/kg/min | Pace: ${cooperPace} min/km)\n`;
    msg += `🚶‍♂️ *Teste 1 Milha Rockport:* ${mileMinutes}m${mileSeconds}s (FC: ${mileHeartRate} bpm | VO2: ${rockportVo2})\n\n`;

    if (generalNotes) {
      msg += `📝 *PARECER TÉCNICO & PRESCRIÇÃO:* \n${generalNotes}\n\n`;
    }
    msg += `✅ *GL PRO FIT Enterprise Suite*`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* HEADER DE AÇÕES E INTEGRAÇÃO COM PLANILHA */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Planilha Oficial Integrada (Google Sheets)
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">
              Resistência (Yo-Yo) • Potência (RAST) • Agilidade (Teste T) • Cooper • 1 Milha
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Footprints className="w-6 h-6 text-emerald-600" />
            <span>Testes de Campo & Avaliação Esportiva</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Módulo completo de campo para futebol e futsal do atleta <strong>{student.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Preset da Planilha */}
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value !== '') {
                  handleLoadSpreadsheetExample(parseInt(e.target.value));
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 font-bold text-xs cursor-pointer shadow-2xs transition-colors"
            >
              <option value="" disabled>Carregar Exemplo da Planilha...</option>
              {SPREADSHEET_EXAMPLES.map((ex, idx) => (
                <option key={idx} value={idx}>
                  {ex.name} ({ex.modality} - {ex.year})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={toggleMetronome}
            className={`px-3.5 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPlayingMetronome 
                ? 'bg-amber-500 border-amber-600 text-white animate-pulse' 
                : 'border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}
            title="Metrônomo sonoro para controle de cadência de campo"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlayingMetronome ? 'Bip Ativo' : 'Áudio Bip'}</span>
          </button>

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
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Testes</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Testes de campo e laudo de performance salvos com sucesso no perfil do aluno!</span>
        </div>
      )}

      {/* METADADOS DO ATLETA E DA AVALIAÇÃO */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Data do Teste:</label>
          <div className="relative">
            <input
              type="date"
              value={evaluationDate}
              onChange={(e) => setEvaluationDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Avaliador / Treinador:</label>
          <div className="relative">
            <input
              type="text"
              value={evaluatorName}
              onChange={(e) => setEvaluatorName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Modalidade do Aluno:</label>
          <select
            value={modality}
            onChange={(e) => setModality(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="CAMPO">⚽ FUTEBOL DE CAMPO</option>
            <option value="FUTSAL">⚡ FUTSAL</option>
            <option value="FUTEBOL">🏃 FUTEBOL GERAL</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Padrão Normativo / Escala:</label>
          <select
            value={athleteCategory}
            onChange={(e) => setAthleteCategory(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="BASE">👦 Categoria de Base (Tabela Planilha)</option>
            <option value="ADULTO">👨 Adulto / Rendimento Profissional</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Massa Corporal (kg):</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.5"
              value={studentWeight}
              onChange={(e) => setStudentWeight(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-xs font-bold text-slate-500">kg</span>
          </div>
        </div>
      </div>

      {/* SELETOR INTERNO DE TESTES DE CAMPO */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: 'yoyo' as FieldTestTab, label: 'Teste Yo-Yo', icon: Flame, badge: 'Resistência' },
          { id: 'rast' as FieldTestTab, label: 'Teste RAST (6x35m)', icon: Zap, badge: 'Potência' },
          { id: 'teste_t' as FieldTestTab, label: 'Teste T', icon: Compass, badge: 'Agilidade' },
          { id: 'cooper' as FieldTestTab, label: 'Teste Cooper (12m)', icon: Timer, badge: 'Aeróbio' },
          { id: 'milha' as FieldTestTab, label: 'Teste 1 Milha', icon: Footprints, badge: 'Cardio' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* ABA: TESTE YO-YO (RESISTÊNCIA INTERMITENTE) */}
      {/* ========================================================================= */}
      {activeTab === 'yoyo' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-600" />
                <span>Teste Yo-Yo de Recuperação Intermitente (Yo-Yo IR1)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Ida e volta de 20m (40m por volta) com 10 segundos de recuperação ativa entre cada repetição.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMetronome}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  isPlayingMetronome ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingMetronome ? 'Parar Bip' : 'Iniciar Bip Sonoro'}</span>
              </button>
            </div>
          </div>

          {/* CARD ÚNICO PARA PREENCHER AS VOLTAS REALIZADAS OU OS METROS PERCORRIDOS */}
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                Registro de Desempenho Yo-Yo IR1
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Sincronização instantânea: 1 volta = 40 metros
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Voltas Realizadas:</label>
                <input
                  type="number"
                  step="0.5"
                  value={yoyoVoltas}
                  onChange={(e) => handleUpdateYoyoVoltas(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-base font-black text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Ex: 8, 15, 24.5, 32 voltas</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Metros Percorridos (m):</label>
                <input
                  type="number"
                  step="20"
                  value={yoyoMetros}
                  onChange={(e) => handleUpdateYoyoMetros(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-base font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">= Voltas × 40 metros</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">VO2máx Estimado (Bangsbo):</label>
                <div className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-base font-black text-slate-900">
                  {yoyoVo2} <span className="text-xs font-bold text-slate-500">ml/kg/min</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Metros × 0.0084 + 36.4</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Velocidade Final (VMA):</label>
                <div className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-base font-black text-slate-900">
                  {yoyoVma} <span className="text-xs font-bold text-slate-500">km/h</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Estágio correspondente</span>
              </div>
            </div>
          </div>

          {/* MENSAGEM DE CLASSIFICAÇÃO TÉCNICA */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold ${yoyoClass.color}`}>
            <span>Classificação Técnica: <strong>{yoyoClass.text}</strong></span>
            <span className="text-[11px] font-normal text-slate-600">
              Escala da Planilha ({athleteCategory === 'BASE' ? 'Base: <500m Ruim, 500-800m Médio, >800m Bom' : 'Adulto: <1200m Ruim, >1500m Bom'})
            </span>
          </div>

          {/* ESPAÇO DE OBSERVAÇÕES CLÍNICAS E BIOMECÂNICAS */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Observações Clínicas & Biomecânicas do Yo-Yo:
            </label>
            <input
              type="text"
              value={yoyoObs}
              onChange={(e) => setYoyoObs(e.target.value)}
              placeholder="Ex: O atleta teve dificuldades para manter o ritmo logo após a quarta volta; Transpiração leve..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: TESTE RAST (6 X SPRINT - POTÊNCIA ANAERÓBIA) */}
      {/* ========================================================================= */}
      {activeTab === 'rast' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Teste RAST (Running-based Anaerobic Sprint Test)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                6 sprints máximos com 10 segundos de recuperação passiva entre cada corrida.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Distância:</span>
              <button
                type="button"
                onClick={() => setRastDistance(35)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                  rastDistance === 35 
                    ? 'bg-amber-600 text-white shadow-2xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                35 metros (Oficial)
              </button>
              <button
                type="button"
                onClick={() => setRastDistance(20)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                  rastDistance === 20 
                    ? 'bg-amber-600 text-white shadow-2xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                20 metros (Reduzido / Futsal)
              </button>
            </div>
          </div>

          {/* Grid dos 6 Sprints com Tempo e Potência em Watts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Tempos Registrados (em segundos) e Potência Mecânica (Watts):
              </label>
              <span className="text-[10px] text-slate-400">
                Fórmula de Potência: (Peso × Distância²) ÷ Tempo³
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {rastSprints.map((time, idx) => {
                const pWatts = rastPowersWatts[idx] || 0;
                const pRel = studentWeight > 0 ? (pWatts / studentWeight).toFixed(1) : '0';
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Sprint {idx + 1}</span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {pRel} W/kg
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.01"
                        value={time}
                        onChange={(e) => handleUpdateRastSprint(idx, parseFloat(e.target.value) || 0)}
                        className="w-full p-2 rounded-lg border border-slate-300 bg-white text-base font-black text-slate-900 focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="text-xs font-bold text-slate-400">s</span>
                    </div>

                    <div className="text-xs font-black text-amber-950 text-right">
                      {pWatts} Watts
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Métricas Principais Calculadas */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Tempo Médio dos Sprints</span>
              <span className="text-2xl font-black text-amber-950">{rastAvgTime} s</span>
              <span className="text-[10px] text-amber-700 block mt-0.5">
                Melhor: {rastBestTime}s | Pior: {rastWorstTime}s
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Potência Máxima (Pico)</span>
              <span className="text-2xl font-black text-emerald-950">{maxPowerWatts} W</span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">
                Potência Relativa: <strong>{maxPowerRelWkg} W/kg</strong>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-bold text-blue-800 uppercase block">Potência Média</span>
              <span className="text-2xl font-black text-blue-950">{avgPowerWatts} W</span>
              <span className="text-[10px] text-blue-700 block mt-0.5">
                Potência Mínima: {minPowerWatts} W
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] font-bold text-rose-800 uppercase block">Índice de Fadiga (IF)</span>
              <span className="text-2xl font-black text-rose-950">{fatigueIndexWs} W/s</span>
              <span className="text-[10px] text-rose-700 block mt-0.5">
                Queda de rendimento: <strong>{fatigueIndexPct}%</strong>
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold ${rastClass.color}`}>
            <span>Classificação do Tempo Médio: <strong>{rastClass.text}</strong></span>
            <span className="text-[11px] font-normal text-slate-600">
              Critério: {rastDistance === 35 ? '<3.5s Bom | 3.5-4s Médio | >4s Ruim' : '<4.5s Bom | 4.5-5s Médio | >5s Ruim'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Observações Técnicas do RAST:
            </label>
            <input
              type="text"
              value={rastObs}
              onChange={(e) => setRastObs(e.target.value)}
              placeholder="Ex: Marcha reta e equilibrada; melhora na aceleração do primeiro trecho..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA: TESTE T (AGILIDADE E MUDANÇA DE DIREÇÃO) */}
      {/* ========================================================================= */}
      {activeTab === 'teste_t' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Teste T de Agilidade & Mudança Rápida de Direção</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Percurso em T com 4 cones: aceleração frontal (9.14m), deslocamento lateral esquerdo (4.57m), lateral direito (9.14m), lateral esquerdo (4.57m) e recuo de costas (9.14m).
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <span className="text-emerald-700 font-black">1ª Volta: &lt;9s Bom</span> | 
              <span className="text-blue-700">9-10s Média</span> | 
              <span className="text-rose-700">&gt;10s Ruim</span>
            </div>
          </div>

          {/* Diagrama Esquemático do Percurso em T */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white space-y-3">
            <span className="text-xs font-black uppercase text-blue-300 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              Esquema Biomecânico do Circuito em 'T'
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                <strong className="block text-emerald-300 text-sm">Cone A ➔ B</strong>
                <span className="text-[10px] text-slate-300">Corrida Frontal (9.14m)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                <strong className="block text-blue-300 text-sm">Cone B ➔ C</strong>
                <span className="text-[10px] text-slate-300">Lateral Esquerda (4.57m)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                <strong className="block text-amber-300 text-sm">Cone C ➔ D</strong>
                <span className="text-[10px] text-slate-300">Lateral Direita (9.14m)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/10 border border-white/10">
                <strong className="block text-rose-300 text-sm">Cone D ➔ B ➔ A</strong>
                <span className="text-[10px] text-slate-300">Volta Centro & Costas (9.14m)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Tempo 1ª Volta / Tentativa Principal (s):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={testeTVolta1}
                  onChange={(e) => setTesteTVolta1(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-base font-black text-blue-900 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-slate-500">seg</span>
              </div>
              <div className="text-[11px] font-bold text-blue-800 bg-blue-50 p-2 rounded-lg border border-blue-200">
                Classificação 1ª Volta: <strong>{testeTClass.v1}</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Tempo 2ª Volta / Acumulado (s):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={testeTVolta2}
                  onChange={(e) => setTesteTVolta2(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-base font-black text-blue-900 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-slate-500">seg</span>
              </div>
              <div className="text-[11px] font-bold text-blue-800 bg-blue-50 p-2 rounded-lg border border-blue-200">
                Classificação 2ª Volta: <strong>{testeTClass.v2}</strong>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Observações Técnicas do Teste T (Mudança de Direção):
            </label>
            <input
              type="text"
              value={testeTObs}
              onChange={(e) => setTesteTObs(e.target.value)}
              placeholder="Ex: O atleta realizou movimentos equilibrados; Maior dificuldade na primeira aceleração..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 5: TESTE DE COOPER (12 MINUTOS DE CORRIDA CONTÍNUA) */}
      {/* ========================================================================= */}
      {activeTab === 'cooper' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Timer className="w-4 h-4 text-rose-600" />
                <span>Teste de Cooper (12 Minutos de Corrida Contínua)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Determinação da potência aeróbia e do consumo máximo de oxigênio (VO2máx) em esforço contínuo.
              </p>
            </div>
            <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
              Protocolo Cooper (1968)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Distância Percorrida:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="50"
                  value={cooperMeters}
                  onChange={(e) => setCooperMeters(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-base font-black text-rose-700 focus:ring-2 focus:ring-rose-500"
                />
                <span className="text-xs font-bold text-slate-500">m</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Metros nos 12 minutos</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">VO2máx Estimado:</label>
              <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-black text-slate-900">
                {cooperVo2} <span className="text-xs font-bold text-slate-500">ml/kg/min</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Fórmula: (Metros - 504.9) ÷ 44.73</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pace Médio de Corrida:</label>
              <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-black text-slate-900">
                {cooperPace} <span className="text-xs font-bold text-slate-500">min/km</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Ritmo por quilômetro</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Velocidade Média:</label>
              <div className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-base font-black text-slate-900">
                {cooperSpeedKmH} <span className="text-xs font-bold text-slate-500">km/h</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Em 12 minutos</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-rose-950">
            <span>Classificação Oficial de Cooper: <strong>{cooperClass.text}</strong></span>
            <span>Distância Registrada: {cooperMeters} metros ({student.gender || 'Masculino'})</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Observações do Teste de Cooper:
            </label>
            <input
              type="text"
              value={cooperObs}
              onChange={(e) => setCooperObs(e.target.value)}
              placeholder="Ex: Ritmo homogêneo de prova; sprint final nos últimos 90 segundos..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 6: TESTE DE 1 MILHA (ROCKPORT 1609 METROS) */}
      {/* ========================================================================= */}
      {activeTab === 'milha' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5 animate-in fade-in">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Footprints className="w-4 h-4 text-purple-600" />
                <span>Teste de 1 Milha de Rockport (1609 Metros)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Caminhada rápida em esteira ou pista de 1 milha com registro do tempo e FC final imediata.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMileMode('walk')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  mileMode === 'walk' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Caminhada (Rockport)
              </button>
              <button
                type="button"
                onClick={() => setMileMode('run')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  mileMode === 'run' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Corrida (ACSM Run)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tempo: Minutos</label>
              <input
                type="number"
                min={4}
                max={30}
                value={mileMinutes}
                onChange={(e) => setMileMinutes(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-base font-black text-slate-900 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tempo: Segundos</label>
              <input
                type="number"
                min={0}
                max={59}
                value={mileSeconds}
                onChange={(e) => setMileSeconds(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-base font-black text-slate-900 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">FC Final (BPM):</label>
              <input
                type="number"
                min={60}
                max={220}
                value={mileHeartRate}
                onChange={(e) => setMileHeartRate(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-base font-black text-purple-700 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">VO2máx Rockport:</label>
              <div className="px-3 py-2.5 rounded-xl bg-purple-50 border border-purple-200 text-base font-black text-purple-900">
                {rockportVo2} <span className="text-xs font-bold text-slate-500">ml/kg/min</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 text-xs font-semibold text-purple-900 flex items-center justify-between">
            <span>
              Tempo Total: <strong>{mileMinutes} min {mileSeconds} seg</strong> ({totalMileMinutes.toFixed(2)} min decimais)
            </span>
            <span>
              Fórmula Kline et al.: Conversão {studentWeight}kg ➔ {weightLbs.toFixed(1)} lbs
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Observações do Teste de 1 Milha:
            </label>
            <input
              type="text"
              value={mileObs}
              onChange={(e) => setMileObs(e.target.value)}
              placeholder="Ex: Passada firme, respiração controlada, boa recuperação imediata..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      )}

      {/* SEÇÃO CONSOLIDADA DE CONDUTA E RECOMENDAÇÕES */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
            Parecer do Treinador & Diretrizes de Campo (Planilha Técnica)
          </label>
          <span className="text-[10px] text-slate-400">
            Clique nas sugestões para inserir rapidamente
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            'Priorizar treinos intervalados de alta intensidade (HIIT) para melhora do Yo-Yo',
            'Treinamento de sprints repetidos com foco em tolerância ao lactato (RAST)',
            'Drills específicos de desaceleração e mudança de direção para o Teste T',
            'Volume aeróbico contínuo na zona 2 para consolidação do VO2máx de Cooper',
            'O atleta teve dificuldades para manter o ritmo logo após a quarta volta',
            'Movimentos desequilibrados por conta do cansaço a partir da quarta volta',
            'Reavaliação de campo programada para 60 dias'
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
          value={generalNotes}
          onChange={(e) => setGeneralNotes(e.target.value)}
          placeholder="Insira as diretrizes para a comissão técnica, metas de tempo e ajustes na periodização de campo..."
          className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
    </div>
  );
};
