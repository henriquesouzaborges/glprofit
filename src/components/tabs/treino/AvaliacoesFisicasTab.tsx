import React, { useState, useMemo } from 'react';
import { 
  ClipboardCheck, 
  Plus, 
  Heart, 
  Zap, 
  Activity, 
  Award, 
  User, 
  Check, 
  Trash2,
  Calendar,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Scale,
  FileText,
  Camera,
  Layers,
  ChevronRight,
  MessageCircle,
  Printer,
  Share2,
  X,
  AlertTriangle,
  Info,
  CheckCircle2,
  Search,
  ArrowRight,
  Sliders,
  ShieldCheck,
  Send,
  Eye,
  BarChart3,
  Dumbbell,
  Target
} from 'lucide-react';
import { Student, PhysicalAssessmentData } from '../../../types';

interface AvaliacoesFisicasTabProps {
  students: Student[];
  selectedStudentId?: string;
  onSelectStudentId?: (id: string) => void;
  onExportPdf?: () => void;
}

// Initial Comprehensive Mock Data based on avaliacaofisica.app
export const INITIAL_ASSESSMENTS: PhysicalAssessmentData[] = [
  // GIANLUCA MARINHO - Avaliação 2 (Mais recente - 15/09/2026)
  {
    id: 'av-std1-2',
    studentId: 'std-1',
    studentName: 'Gianluca Marinho',
    date: '2026-09-15',
    evaluator: 'Prof. Gianluca Marinho (CREF 112001-G/SP)',
    objective: 'Hipertrofia Muscular & Definição',
    protocol: 'pollock7',
    protocolName: 'Pollock 7 Dobras (Jackson & Pollock)',
    weightKg: 75.4,
    heightCm: 178,
    age: 28,
    gender: 'masculino',
    bmi: 23.8,
    bmr: 1745,
    skinfolds: {
      peitoral: 7.5,
      axilarMedia: 9.0,
      triceps: 8.5,
      subescapular: 11.0,
      biceps: 4.0,
      abdominal: 13.5,
      suprailiaca: 9.5,
      coxa: 11.5,
      panturrilha: 6.5,
      total: 70.0
    },
    composition: {
      bodyDensity: 1.0682,
      bodyFatPercentage: 13.6,
      fatMassKg: 10.3,
      leanMassKg: 65.1,
      muscleMassKg: 42.8,
      boneMassKg: 11.8,
      residualMassKg: 10.5,
      idealFatPercentage: 12.0,
      idealWeightKg: 74.0,
      classification: 'Atleta'
    },
    perimetry: {
      pescoco: 38.5,
      ombros: 118.0,
      torax: 104.5,
      cintura: 78.5,
      abdomen: 82.0,
      quadril: 99.0,
      bracoDireitoRelaxado: 36.5,
      bracoDireitoContraido: 39.2,
      bracoEsquerdoRelaxado: 36.2,
      bracoEsquerdoContraido: 39.0,
      antebracoDireito: 29.5,
      antebracoEsquerdo: 29.2,
      coxaDireitaProximal: 59.5,
      coxaDireitaMedial: 56.0,
      coxaEsquerdaProximal: 59.2,
      coxaEsquerdaMedial: 55.8,
      panturrilhaDireita: 37.8,
      panturrilhaEsquerda: 37.5,
      rcq: 0.79,
      rcqRisk: 'Baixo'
    },
    anamnesis: {
      parqCleared: true,
      clinicalHistory: 'Sem patologias prévias ou histórico cardíaco.',
      injuries: 'Leve desconforto prévio no ombro direito, atualmente 100% assintomático.',
      medications: 'Nenhum medicamento de uso contínuo.',
      activityLevel: 'Muito Ativo (Musculação 5x/semana + 2x cardio)',
      sleepHours: 7.5,
      waterIntakeLiters: 3.5
    },
    functionalTests: {
      cooperDistanceMeters: 2800,
      vo2Max: 51.3,
      pushups1Min: 44,
      crunches1Min: 48,
      wellsFlexibilityCm: 37.0,
      restingHeartRateBpm: 58,
      bloodPressure: '120/75 mmHg'
    },
    postureNotes: 'Alinhamento postural excelente. Leve elevação de ombro direito sem impacto funcional.',
    generalNotes: 'Evolução notável no último trimestre: ganho de 1.4kg de massa muscular e redução de 1.8% no percentual de gordura corporal.'
  },
  // GIANLUCA MARINHO - Avaliação 1 (Anterior - 10/06/2026)
  {
    id: 'av-std1-1',
    studentId: 'std-1',
    studentName: 'Gianluca Marinho',
    date: '2026-06-10',
    evaluator: 'Prof. Gianluca Marinho (CREF 112001-G/SP)',
    objective: 'Hipertrofia Muscular & Definição',
    protocol: 'pollock7',
    protocolName: 'Pollock 7 Dobras (Jackson & Pollock)',
    weightKg: 75.2,
    heightCm: 178,
    age: 28,
    gender: 'masculino',
    bmi: 23.7,
    bmr: 1720,
    skinfolds: {
      peitoral: 9.0,
      axilarMedia: 10.5,
      triceps: 9.8,
      subescapular: 12.5,
      biceps: 5.0,
      abdominal: 16.0,
      suprailiaca: 11.5,
      coxa: 13.0,
      panturrilha: 7.5,
      total: 79.8
    },
    composition: {
      bodyDensity: 1.0638,
      bodyFatPercentage: 15.4,
      fatMassKg: 11.6,
      leanMassKg: 63.6,
      muscleMassKg: 41.5,
      boneMassKg: 11.7,
      residualMassKg: 10.4,
      idealFatPercentage: 12.0,
      idealWeightKg: 73.5,
      classification: 'Bom'
    },
    perimetry: {
      pescoco: 38.0,
      ombros: 116.5,
      torax: 103.0,
      cintura: 80.5,
      abdomen: 84.5,
      quadril: 99.5,
      bracoDireitoRelaxado: 35.8,
      bracoDireitoContraido: 38.4,
      bracoEsquerdoRelaxado: 35.5,
      bracoEsquerdoContraido: 38.1,
      antebracoDireito: 29.0,
      antebracoEsquerdo: 28.8,
      coxaDireitaProximal: 58.5,
      coxaDireitaMedial: 55.0,
      coxaEsquerdaProximal: 58.2,
      coxaEsquerdaMedial: 54.8,
      panturrilhaDireita: 37.2,
      panturrilhaEsquerda: 37.0,
      rcq: 0.81,
      rcqRisk: 'Baixo'
    },
    anamnesis: {
      parqCleared: true,
      clinicalHistory: 'Sem patologias prévias.',
      injuries: 'Nenhuma lesão ativa.',
      medications: 'Nenhum medicamento contínuo.',
      activityLevel: 'Moderadamente Ativo',
      sleepHours: 7.0,
      waterIntakeLiters: 3.0
    },
    functionalTests: {
      cooperDistanceMeters: 2650,
      vo2Max: 48.0,
      pushups1Min: 38,
      crunches1Min: 42,
      wellsFlexibilityCm: 34.5,
      restingHeartRateBpm: 62,
      bloodPressure: '122/78 mmHg'
    },
    postureNotes: 'Postura harmoniosa.',
    generalNotes: 'Avaliação inicial para início da periodização de hipertrofia.'
  },
  // BEATRIZ NOGUEIRA SILVA - Avaliação Recente (25/08/2026)
  {
    id: 'av-std2-1',
    studentId: 'std-2',
    studentName: 'Beatriz Nogueira Silva',
    date: '2026-08-25',
    evaluator: 'Prof. Gianluca Marinho (CREF 112001-G/SP)',
    objective: 'Emagrecimento Saudável & Tônus Muscular',
    protocol: 'pollock7',
    protocolName: 'Pollock 7 Dobras (Feminino)',
    weightKg: 62.0,
    heightCm: 165,
    age: 26,
    gender: 'feminino',
    bmi: 22.8,
    bmr: 1410,
    skinfolds: {
      peitoral: 12.0,
      axilarMedia: 14.0,
      triceps: 15.5,
      subescapular: 16.0,
      biceps: 8.0,
      abdominal: 19.5,
      suprailiaca: 17.0,
      coxa: 21.0,
      panturrilha: 14.0,
      total: 109.0
    },
    composition: {
      bodyDensity: 1.0505,
      bodyFatPercentage: 21.4,
      fatMassKg: 13.3,
      leanMassKg: 48.7,
      muscleMassKg: 30.5,
      boneMassKg: 9.8,
      residualMassKg: 8.4,
      idealFatPercentage: 19.0,
      idealWeightKg: 60.0,
      classification: 'Excelente'
    },
    perimetry: {
      pescoco: 32.0,
      ombros: 98.0,
      torax: 89.0,
      cintura: 67.5,
      abdomen: 74.0,
      quadril: 98.0,
      bracoDireitoRelaxado: 27.5,
      bracoDireitoContraido: 29.2,
      bracoEsquerdoRelaxado: 27.2,
      bracoEsquerdoContraido: 29.0,
      antebracoDireito: 23.5,
      antebracoEsquerdo: 23.2,
      coxaDireitaProximal: 57.0,
      coxaDireitaMedial: 53.5,
      coxaEsquerdaProximal: 56.8,
      coxaEsquerdaMedial: 53.2,
      panturrilhaDireita: 35.5,
      panturrilhaEsquerda: 35.3,
      rcq: 0.69,
      rcqRisk: 'Baixo'
    },
    anamnesis: {
      parqCleared: true,
      clinicalHistory: 'Sem patologias clínicas.',
      injuries: 'Sem lesões osteomusculares.',
      medications: 'Polivitamínico diário.',
      activityLevel: 'Moderadamente Ativa',
      sleepHours: 7.5,
      waterIntakeLiters: 2.5
    },
    functionalTests: {
      cooperDistanceMeters: 2300,
      vo2Max: 40.1,
      pushups1Min: 28,
      crunches1Min: 38,
      wellsFlexibilityCm: 38.0,
      restingHeartRateBpm: 66,
      bloodPressure: '115/72 mmHg'
    },
    postureNotes: 'Postura equilibrada, bom alinhamento pélvico.',
    generalNotes: 'Aluna com excelente dedicação aos treinos funcionais e musculação.'
  }
];

export const AvaliacoesFisicasTab: React.FC<AvaliacoesFisicasTabProps> = ({
  students,
  selectedStudentId: propStudentId,
  onSelectStudentId,
  onExportPdf
}) => {
  const [internalStudentId, setInternalStudentId] = useState(propStudentId || students[0]?.id || 'std-1');
  const activeStudentId = propStudentId || internalStudentId;

  // Assessments state
  const [assessments, setAssessments] = useState<PhysicalAssessmentData[]>(INITIAL_ASSESSMENTS);

  // Filter assessments for active student
  const studentAssessments = useMemo(() => {
    return assessments
      .filter(a => a.studentId === activeStudentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [assessments, activeStudentId]);

  // Selected assessment state
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(() => {
    return studentAssessments[0]?.id || '';
  });

  // Keep selected assessment valid when student changes
  const activeAssessment = useMemo(() => {
    const found = studentAssessments.find(a => a.id === selectedAssessmentId);
    return found || studentAssessments[0] || null;
  }, [studentAssessments, selectedAssessmentId]);

  // Previous assessment for delta comparison
  const previousAssessment = useMemo(() => {
    if (!activeAssessment || studentAssessments.length < 2) return null;
    const currentIndex = studentAssessments.findIndex(a => a.id === activeAssessment.id);
    if (currentIndex >= 0 && currentIndex + 1 < studentAssessments.length) {
      return studentAssessments[currentIndex + 1];
    }
    return null;
  }, [studentAssessments, activeAssessment]);

  // Active view tab inside assessment (matching avaliacaofisica.app)
  const [currentModuleTab, setCurrentModuleTab] = useState<
    'composicao' | 'dobras' | 'perimetria' | 'anamnese' | 'funcionais' | 'fotos' | 'evolucao'
  >('composicao');

  // Modals state
  const [showNewAssessmentModal, setShowNewAssessmentModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentStudent = students.find(s => s.id === activeStudentId) || students[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStudentChange = (id: string) => {
    setInternalStudentId(id);
    if (onSelectStudentId) onSelectStudentId(id);
    const newStudentAssessments = assessments.filter(a => a.studentId === id);
    if (newStudentAssessments.length > 0) {
      setSelectedAssessmentId(newStudentAssessments[0].id);
    } else {
      setSelectedAssessmentId('');
    }
  };

  const handleDeleteAssessment = (id: string) => {
    setAssessments(prev => prev.filter(a => a.id !== id));
    setShowDeleteConfirm(false);
    showToast('Avaliação física removida com sucesso.');
  };

  // Helper calculation for delta
  const getDelta = (currentVal: number, prevVal?: number, invertGood: boolean = false) => {
    if (prevVal === undefined || prevVal === null) return null;
    const diff = currentVal - prevVal;
    const isZero = Math.abs(diff) < 0.05;
    if (isZero) return { diff: 0, text: 'Estável', color: 'text-slate-500 bg-slate-100' };

    const isPositive = diff > 0;
    const isGood = invertGood ? !isPositive : isPositive;

    return {
      diff,
      formatted: `${isPositive ? '+' : ''}${diff.toFixed(1)}`,
      isGood,
      color: isGood 
        ? 'text-emerald-700 bg-emerald-100 border-emerald-200' 
        : 'text-amber-800 bg-amber-100 border-amber-200'
    };
  };

  // Form State for New Assessment Modal
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [newEvaluator, setNewEvaluator] = useState('Prof. Gianluca Marinho (CREF 112001-G/SP)');
  const [newObjective, setNewObjective] = useState(activeAssessment?.objective || 'Hipertrofia e Redução de Gordura');
  const [newWeight, setNewWeight] = useState<number>(activeAssessment?.weightKg || 75);
  const [newHeight, setNewHeight] = useState<number>(activeAssessment?.heightCm || 178);
  const [newAge, setNewAge] = useState<number>(activeAssessment?.age || 28);
  const [newGender, setNewGender] = useState<'masculino' | 'feminino'>(activeAssessment?.gender || 'masculino');
  const [newProtocol, setNewProtocol] = useState<'pollock7' | 'pollock3' | 'guedes' | 'petroski' | 'bioimpedancia'>('pollock7');
  
  // New Skinfolds
  const [peitoral, setPeitoral] = useState<number>(activeAssessment?.skinfolds.peitoral || 8);
  const [axilarMedia, setAxilarMedia] = useState<number>(activeAssessment?.skinfolds.axilarMedia || 9);
  const [triceps, setTriceps] = useState<number>(activeAssessment?.skinfolds.triceps || 8);
  const [subescapular, setSubescapular] = useState<number>(activeAssessment?.skinfolds.subescapular || 11);
  const [biceps, setBiceps] = useState<number>(activeAssessment?.skinfolds.biceps || 4);
  const [abdominal, setAbdominal] = useState<number>(activeAssessment?.skinfolds.abdominal || 13);
  const [suprailiaca, setSuprailiaca] = useState<number>(activeAssessment?.skinfolds.suprailiaca || 9);
  const [coxa, setCoxa] = useState<number>(activeAssessment?.skinfolds.coxa || 11);
  const [panturrilha, setPanturrilha] = useState<number>(activeAssessment?.skinfolds.panturrilha || 6);

  // New Perimetry
  const [cintura, setCintura] = useState<number>(activeAssessment?.perimetry.cintura || 78);
  const [abdomen, setAbdomen] = useState<number>(activeAssessment?.perimetry.abdomen || 82);
  const [quadril, setQuadril] = useState<number>(activeAssessment?.perimetry.quadril || 99);
  const [torax, setTorax] = useState<number>(activeAssessment?.perimetry.torax || 104);
  const [bracoDirRelax, setBracoDirRelax] = useState<number>(activeAssessment?.perimetry.bracoDireitoRelaxado || 36);
  const [bracoDirContr, setBracoDirContr] = useState<number>(activeAssessment?.perimetry.bracoDireitoContraido || 39);
  const [bracoEsqRelax, setBracoEsqRelax] = useState<number>(activeAssessment?.perimetry.bracoEsquerdoRelaxado || 36);
  const [bracoEsqContr, setBracoEsqContr] = useState<number>(activeAssessment?.perimetry.bracoEsquerdoContraido || 39);
  const [coxaDirProx, setCoxaDirProx] = useState<number>(activeAssessment?.perimetry.coxaDireitaProximal || 59);
  const [coxaEsqProx, setCoxaEsqProx] = useState<number>(activeAssessment?.perimetry.coxaEsquerdaProximal || 59);

  // Real-time calculation helper for Pollock 7
  const liveSkinfoldsSum = peitoral + axilarMedia + triceps + subescapular + abdominal + suprailiaca + coxa;
  const liveDensity = newGender === 'masculino'
    ? 1.112 - (0.00043499 * liveSkinfoldsSum) + (0.00000055 * (liveSkinfoldsSum ** 2)) - (0.00028826 * newAge)
    : 1.097 - (0.00046971 * liveSkinfoldsSum) + (0.00000056 * (liveSkinfoldsSum ** 2)) - (0.00012828 * newAge);
  const liveFatPercentage = Math.max(4, Math.min(50, Math.round(((4.95 / liveDensity) - 4.5) * 1000) / 10));
  const liveFatMass = Math.round((newWeight * (liveFatPercentage / 100)) * 10) / 10;
  const liveLeanMass = Math.round((newWeight - liveFatMass) * 10) / 10;
  const liveBmi = Math.round((newWeight / ((newHeight / 100) ** 2)) * 10) / 10;
  const liveRcq = quadril > 0 ? Math.round((cintura / quadril) * 100) / 100 : 0.8;

  const handleSaveNewAssessment = (e: React.FormEvent) => {
    e.preventDefault();

    const createdAssessment: PhysicalAssessmentData = {
      id: `av-${activeStudentId}-${Date.now()}`,
      studentId: activeStudentId,
      studentName: currentStudent?.name || 'Aluno',
      date: newDate,
      evaluator: newEvaluator,
      objective: newObjective,
      protocol: newProtocol,
      protocolName: newProtocol === 'pollock7' ? 'Pollock 7 Dobras' : 'Pollock 3 Dobras',
      weightKg: newWeight,
      heightCm: newHeight,
      age: newAge,
      gender: newGender,
      bmi: liveBmi,
      bmr: Math.round(newGender === 'masculino' ? 66.5 + (13.75 * newWeight) + (5.003 * newHeight) - (6.75 * newAge) : 655.1 + (9.563 * newWeight) + (1.850 * newHeight) - (4.676 * newAge)),
      skinfolds: {
        peitoral,
        axilarMedia,
        triceps,
        subescapular,
        biceps,
        abdominal,
        suprailiaca,
        coxa,
        panturrilha,
        total: liveSkinfoldsSum + biceps + panturrilha
      },
      composition: {
        bodyDensity: Math.round(liveDensity * 10000) / 10000,
        bodyFatPercentage: liveFatPercentage,
        fatMassKg: liveFatMass,
        leanMassKg: liveLeanMass,
        muscleMassKg: Math.round(liveLeanMass * 0.65 * 10) / 10,
        boneMassKg: Math.round(newWeight * 0.15 * 10) / 10,
        residualMassKg: Math.round(newWeight * 0.14 * 10) / 10,
        idealFatPercentage: newGender === 'masculino' ? 12.0 : 19.0,
        idealWeightKg: Math.round((liveLeanMass / (1 - (newGender === 'masculino' ? 0.12 : 0.19))) * 10) / 10,
        classification: liveFatPercentage < 14 ? 'Atleta' : liveFatPercentage < 18 ? 'Bom' : 'Médio'
      },
      perimetry: {
        pescoco: 38,
        ombros: 117,
        torax,
        cintura,
        abdomen,
        quadril,
        bracoDireitoRelaxado: bracoDirRelax,
        bracoDireitoContraido: bracoDirContr,
        bracoEsquerdoRelaxado: bracoEsqRelax,
        bracoEsquerdoContraido: bracoEsqContr,
        antebracoDireito: 29,
        antebracoEsquerdo: 29,
        coxaDireitaProximal: coxaDirProx,
        coxaDireitaMedial: Math.round((coxaDirProx - 3) * 10) / 10,
        coxaEsquerdaProximal: coxaEsqProx,
        coxaEsquerdaMedial: Math.round((coxaEsqProx - 3) * 10) / 10,
        panturrilhaDireita: 37.5,
        panturrilhaEsquerda: 37.5,
        rcq: liveRcq,
        rcqRisk: liveRcq < 0.85 ? 'Baixo' : liveRcq < 0.95 ? 'Moderado' : 'Alto'
      },
      anamnesis: {
        parqCleared: true,
        clinicalHistory: 'Sem intercorrências registradas.',
        injuries: 'Nenhuma lesão ativa.',
        medications: 'Nenhum medicamento contínuo.',
        activityLevel: 'Ativo',
        sleepHours: 7.5,
        waterIntakeLiters: 3.0
      },
      functionalTests: {
        cooperDistanceMeters: 2700,
        vo2Max: 49.0,
        pushups1Min: 40,
        crunches1Min: 45,
        wellsFlexibilityCm: 35.0,
        restingHeartRateBpm: 60,
        bloodPressure: '120/80 mmHg'
      },
      postureNotes: 'Alinhamento postural preservado.',
      generalNotes: 'Nova avaliação física concluída com sucesso no sistema.'
    };

    setAssessments([createdAssessment, ...assessments]);
    setSelectedAssessmentId(createdAssessment.id);
    setShowNewAssessmentModal(false);
    showToast('Nova Avaliação Física cadastrada com sucesso!');
  };

  // WhatsApp Message Generator
  const generateWhatsAppMessage = () => {
    if (!activeAssessment || !currentStudent) return '';
    const dateFormatted = new Date(activeAssessment.date + 'T12:00:00').toLocaleDateString('pt-BR');
    
    return `*GL PRO FIT • RELATÓRIO DE AVALIAÇÃO FÍSICA* 📋💪\n\n` +
      `Olá, *${currentStudent.name.split(' ')[0]}*! Sua avaliação física realizada em *${dateFormatted}* com *${activeAssessment.evaluator.split('(')[0].trim()}* já está disponível no sistema:\n\n` +
      `📊 *RESUMO DA SUA COMPOSIÇÃO CORPORAL:*\n` +
      `• *Peso Total:* ${activeAssessment.weightKg} kg\n` +
      `• *% de Gordura:* ${activeAssessment.composition.bodyFatPercentage}% (${activeAssessment.composition.classification})\n` +
      `• *Massa Magra:* ${activeAssessment.composition.leanMassKg} kg\n` +
      `• *Massa Gorda:* ${activeAssessment.composition.fatMassKg} kg\n` +
      `• *IMC:* ${activeAssessment.bmi} kg/m²\n` +
      `• *Relação Cintura-Quadril:* ${activeAssessment.perimetry.rcq} (Risco ${activeAssessment.perimetry.rcqRisk})\n` +
      (activeAssessment.functionalTests?.vo2Max ? `• *VO2 Máx Estimado:* ${activeAssessment.functionalTests.vo2Max} ml/kg/min\n` : '') +
      `\n🎯 *Objetivo:* ${activeAssessment.objective}\n` +
      `💬 *Orientação do Treinador:* ${activeAssessment.generalNotes || 'Continue mantendo a constância nos treinos e na dieta!'}\n\n` +
      `Acesse sua ficha completa com gráficos e fotos no seu aplicativo do aluno! 📲🚀`;
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER CARD (Based on avaliacaofisica.app) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Title & Brand Reference */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <ClipboardCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Avaliações Físicas & Antropometria
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                PRO Suite
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Protocolos de Pollock (7 e 3 dobras), Guedes, Petroski, Bioimpedância e Perimetria Oficial
            </p>
          </div>
        </div>

        {/* Top Actions & Student Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
          
          {/* Student Selector */}
          <div className="relative">
            <select
              value={activeStudentId}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="pl-8 pr-7 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 focus:border-blue-600 focus:outline-hidden cursor-pointer transition-colors"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.status})
                </option>
              ))}
            </select>
            <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* New Assessment Button */}
          <button
            type="button"
            onClick={() => setShowNewAssessmentModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Avaliação</span>
          </button>

          {/* Export PDF Button */}
          <button
            type="button"
            onClick={() => {
              if (onExportPdf) onExportPdf();
              else window.print();
            }}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Exportar Laudo Oficial em PDF"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Exportar PDF</span>
          </button>

          {/* WhatsApp Notify Button */}
          {activeAssessment && (
            <button
              type="button"
              onClick={() => setShowWhatsAppModal(true)}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Notificar Aluno no WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          )}

        </div>
      </div>

      {/* STUDENT CONTEXT & HISTORICAL ASSESSMENTS SELECTION BAR */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          
          {/* Student Profile Overview */}
          <div className="flex items-center gap-3">
            <div className="relative">
              {currentStudent?.photo ? (
                <img 
                  src={currentStudent.photo} 
                  alt={currentStudent.name} 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                  {currentStudent?.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>

            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{currentStudent?.name}</span>
                <span className="text-[11px] font-normal text-slate-500">
                  • {activeAssessment?.age || 28} anos • {activeAssessment?.gender === 'feminino' ? 'Feminino' : 'Masculino'} • {activeAssessment?.heightCm} cm
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>Avaliador: <strong className="text-slate-700">{activeAssessment?.evaluator || 'Prof. Gianluca Marinho'}</strong></span>
                <span>• Objetivo: <strong className="text-blue-700">{activeAssessment?.objective || 'Condicionamento'}</strong></span>
              </div>
            </div>
          </div>

          {/* Assessment Count badge */}
          <div className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 self-start sm:self-auto">
            {studentAssessments.length} {studentAssessments.length === 1 ? 'avaliação realizada' : 'avaliações no histórico'}
          </div>
        </div>

        {/* Date Selector Pills (Matching avaliacaofisica.app timeline) */}
        {studentAssessments.length > 0 ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Histórico:
            </span>
            {studentAssessments.map((a, idx) => {
              const isSelected = a.id === activeAssessment?.id;
              const dateFormatted = new Date(a.date + 'T12:00:00').toLocaleDateString('pt-BR');
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAssessmentId(a.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{dateFormatted}</span>
                  {idx === 0 && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-extrabold ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Mais Recente
                    </span>
                  )}
                  <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    ({a.composition.bodyFatPercentage}% G)
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 text-xs">
            Nenhuma avaliação física cadastrada para este aluno. Clique em "+ Nova Avaliação" acima.
          </div>
        )}
      </div>

      {activeAssessment && (
        <>
          {/* KPI CARDS (Composição Corporal & Indicadores com Delta vs. Avaliação Anterior) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* % Gordura */}
            {(() => {
              const delta = getDelta(
                activeAssessment.composition.bodyFatPercentage, 
                previousAssessment?.composition.bodyFatPercentage, 
                true // decrease is good
              );
              return (
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    % Gordura
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    {activeAssessment.composition.bodyFatPercentage}%
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-blue-700">
                      {activeAssessment.composition.classification}
                    </span>
                    {delta && (
                      <span className={`px-1.5 py-0.5 rounded font-bold border ${delta.color}`}>
                        {delta.formatted}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Massa Magra */}
            {(() => {
              const delta = getDelta(
                activeAssessment.composition.leanMassKg, 
                previousAssessment?.composition.leanMassKg, 
                false // increase is good
              );
              return (
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Massa Magra
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-700">
                    {activeAssessment.composition.leanMassKg} <span className="text-xs font-normal">kg</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Músculo/Ósseo</span>
                    {delta && (
                      <span className={`px-1.5 py-0.5 rounded font-bold border ${delta.color}`}>
                        {delta.formatted} kg
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Massa Gorda */}
            {(() => {
              const delta = getDelta(
                activeAssessment.composition.fatMassKg, 
                previousAssessment?.composition.fatMassKg, 
                true // decrease is good
              );
              return (
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Massa Gorda
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-700">
                    {activeAssessment.composition.fatMassKg} <span className="text-xs font-normal">kg</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Gordura Total</span>
                    {delta && (
                      <span className={`px-1.5 py-0.5 rounded font-bold border ${delta.color}`}>
                        {delta.formatted} kg
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Peso Total & IMC */}
            {(() => {
              const delta = getDelta(
                activeAssessment.weightKg, 
                previousAssessment?.weightKg, 
                false
              );
              return (
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Peso Total & IMC
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    {activeAssessment.weightKg} <span className="text-xs font-normal">kg</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">IMC {activeAssessment.bmi}</span>
                    {delta && (
                      <span className={`px-1.5 py-0.5 rounded font-bold border ${delta.color}`}>
                        {delta.formatted} kg
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Relação Cintura-Quadril (RCQ) */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Relação C/Q (RCQ)
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {activeAssessment.perimetry.rcq}
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold text-emerald-700">
                  Risco {activeAssessment.perimetry.rcqRisk}
                </span>
                <span className="text-slate-400">Cardiovascular</span>
              </div>
            </div>

            {/* Taxa Metabólica Basal (TMB) */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                TMB (Metabolismo)
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {activeAssessment.bmr} <span className="text-xs font-normal">kcal</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500">Harris-Benedict</span>
                <span className="text-blue-600 font-semibold">Gasto basal</span>
              </div>
            </div>

          </div>

          {/* ASSESSMENT INNER MODULE TABS (Exact avaliacaofisica.app submodules) */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
            
            {/* Sub-module Header Buttons */}
            <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 overflow-x-auto custom-scrollbar">
              {[
                { id: 'composicao', label: 'Composição Corporal', icon: Scale },
                { id: 'dobras', label: 'Dobras Cutâneas (9)', icon: Activity },
                { id: 'perimetria', label: 'Perimetria & Medidas', icon: Sliders },
                { id: 'anamnese', label: 'Anamnese & PAR-Q', icon: FileText },
                { id: 'funcionais', label: 'Testes de Capacidade & VO2', icon: Zap },
                { id: 'fotos', label: 'Fotos & Postura', icon: Camera },
                { id: 'evolucao', label: 'Comparativo & Gráficos', icon: BarChart3 }
              ].map(tab => {
                const TabIcon = tab.icon;
                const isActive = currentModuleTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentModuleTab(tab.id as any)}
                    type="button"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: COMPOSIÇÃO CORPORAL & PROTOCOLOS */}
            {currentModuleTab === 'composicao' && (
              <div className="p-4 sm:p-6 space-y-6">
                
                {/* Protocol Info & Formula */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-blue-900 block text-sm">
                      Protocolo Científico: {activeAssessment.protocolName}
                    </span>
                    <span className="text-blue-700">
                      Densidade Corporal Estimada: <strong>{activeAssessment.composition.bodyDensity} g/ml</strong> • Equação de Siri: %G = [(4.95 / D) - 4.5] × 100
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold uppercase text-[10px]">
                    Validação Científica
                  </div>
                </div>

                {/* 4-Component Fractionation Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Fracionamento em 4 Componentes (Massa Total: {activeAssessment.weightKg} kg)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    
                    {/* Massa Muscular */}
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
                      <div className="text-[11px] font-bold text-emerald-800 uppercase">
                        Massa Muscular
                      </div>
                      <div className="text-2xl font-black text-emerald-900">
                        {activeAssessment.composition.muscleMassKg} kg
                      </div>
                      <div className="text-xs text-emerald-700 font-semibold">
                        {Math.round((activeAssessment.composition.muscleMassKg / activeAssessment.weightKg) * 100)}% do peso corporal
                      </div>
                    </div>

                    {/* Massa Gorda */}
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1">
                      <div className="text-[11px] font-bold text-amber-800 uppercase">
                        Massa Adiposa (Gordura)
                      </div>
                      <div className="text-2xl font-black text-amber-900">
                        {activeAssessment.composition.fatMassKg} kg
                      </div>
                      <div className="text-xs text-amber-700 font-semibold">
                        {activeAssessment.composition.bodyFatPercentage}% do peso corporal
                      </div>
                    </div>

                    {/* Massa Óssea */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                      <div className="text-[11px] font-bold text-slate-700 uppercase">
                        Massa Óssea
                      </div>
                      <div className="text-2xl font-black text-slate-900">
                        {activeAssessment.composition.boneMassKg} kg
                      </div>
                      <div className="text-xs text-slate-500 font-semibold">
                        {Math.round((activeAssessment.composition.boneMassKg / activeAssessment.weightKg) * 100)}% do peso corporal
                      </div>
                    </div>

                    {/* Massa Residual */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                      <div className="text-[11px] font-bold text-slate-700 uppercase">
                        Massa Residual (Vísceras/Água)
                      </div>
                      <div className="text-2xl font-black text-slate-900">
                        {activeAssessment.composition.residualMassKg} kg
                      </div>
                      <div className="text-xs text-slate-500 font-semibold">
                        {Math.round((activeAssessment.composition.residualMassKg / activeAssessment.weightKg) * 100)}% do peso corporal
                      </div>
                    </div>

                  </div>
                </div>

                {/* Body Fat Visual Scale */}
                <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Escala Visual de Gordura Corporal ({activeAssessment.gender === 'masculino' ? 'Homens' : 'Mulheres'})</span>
                    <span className="text-blue-700 font-extrabold">Seu Resultado: {activeAssessment.composition.bodyFatPercentage}% ({activeAssessment.composition.classification})</span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex">
                    <div style={{ width: '15%' }} className="bg-sky-400" title="Atleta / Muito Baixo (6-10%)"></div>
                    <div style={{ width: '25%' }} className="bg-emerald-500" title="Excelente / Bom (11-15%)"></div>
                    <div style={{ width: '25%' }} className="bg-lime-400" title="Médio / Adequado (16-20%)"></div>
                    <div style={{ width: '20%' }} className="bg-amber-400" title="Elevado (21-25%)"></div>
                    <div style={{ width: '15%' }} className="bg-rose-500" title="Obesidade (>25%)"></div>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                    <span>Atleta (6-11%)</span>
                    <span>Bom (12-15%)</span>
                    <span>Médio (16-20%)</span>
                    <span>Elevado (21-25%)</span>
                    <span>Obesidade (&gt;25%)</span>
                  </div>
                </div>

                {/* Target & Ideal Weight Projection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <h5 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-blue-600" />
                      Meta & Peso Ideal Sugerido
                    </h5>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      Para atingir a meta recomendada de <strong>{activeAssessment.composition.idealFatPercentage}%</strong> de gordura mantendo a massa magra atual, o peso alvo estimado é de <strong className="text-slate-900 text-sm">{activeAssessment.composition.idealWeightKg} kg</strong> (redução de {(activeAssessment.weightKg - activeAssessment.composition.idealWeightKg).toFixed(1)} kg de gordura).
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <h5 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Parecer Técnico do Avaliador
                    </h5>
                    <div className="text-xs text-slate-600 leading-relaxed italic">
                      "{activeAssessment.generalNotes || 'Aluno em excelente curva de evolução, com excelente resposta metabólica aos estímulos de força.'}"
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: DOBRAS CUTÂNEAS (9 Pontos Anatômicos) */}
            {currentModuleTab === 'dobras' && (
              <div className="p-4 sm:p-6 space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Adipometria das 9 Dobras Cutâneas (em milímetros)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Medição padronizada com adipômetro científico (precisão de 0.1 mm)
                    </p>
                  </div>
                  <div className="text-xs font-bold text-slate-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                    $\sum$ Somatório de Dobras: <span className="text-blue-700 text-sm font-black">{activeAssessment.skinfolds.total} mm</span>
                  </div>
                </div>

                {/* 9 Dobras Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'peitoral', label: 'Peitoral (Tórax)', val: activeAssessment.skinfolds.peitoral, prev: previousAssessment?.skinfolds.peitoral },
                    { key: 'axilarMedia', label: 'Axilar Média', val: activeAssessment.skinfolds.axilarMedia, prev: previousAssessment?.skinfolds.axilarMedia },
                    { key: 'triceps', label: 'Tríceps Braquial', val: activeAssessment.skinfolds.triceps, prev: previousAssessment?.skinfolds.triceps },
                    { key: 'subescapular', label: 'Subescapular', val: activeAssessment.skinfolds.subescapular, prev: previousAssessment?.skinfolds.subescapular },
                    { key: 'biceps', label: 'Bíceps', val: activeAssessment.skinfolds.biceps, prev: previousAssessment?.skinfolds.biceps },
                    { key: 'abdominal', label: 'Abdominal', val: activeAssessment.skinfolds.abdominal, prev: previousAssessment?.skinfolds.abdominal },
                    { key: 'suprailiaca', label: 'Suprailíaca', val: activeAssessment.skinfolds.suprailiaca, prev: previousAssessment?.skinfolds.suprailiaca },
                    { key: 'coxa', label: 'Coxa Medial', val: activeAssessment.skinfolds.coxa, prev: previousAssessment?.skinfolds.coxa },
                    { key: 'panturrilha', label: 'Panturrilha Medial', val: activeAssessment.skinfolds.panturrilha, prev: previousAssessment?.skinfolds.panturrilha }
                  ].map(fold => {
                    const delta = getDelta(fold.val, fold.prev, true);
                    return (
                      <div key={fold.key} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-800">{fold.label}</div>
                          <div className="text-base font-black text-slate-900 mt-0.5">
                            {fold.val.toFixed(1)} <span className="text-xs font-normal text-slate-500">mm</span>
                          </div>
                        </div>
                        {delta && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${delta.color}`}>
                            {delta.formatted} mm
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* TAB 3: PERIMETRIA & MEDIDAS (cm) */}
            {currentModuleTab === 'perimetria' && (
              <div className="p-4 sm:p-6 space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Perimetria e Circunferências Corporais (em centímetros)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Circunferências com fita antropométrica inextensível e análise de simetria lateral
                    </p>
                  </div>
                  <div className="text-xs font-bold text-slate-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    RCQ: <span className="text-emerald-700 text-sm font-black">{activeAssessment.perimetry.rcq}</span> (Risco {activeAssessment.perimetry.rcqRisk})
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Tronco & Região Central */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-blue-600" />
                      Tronco & Região Central
                    </h5>
                    <div className="space-y-2 text-xs">
                      {[
                        { label: 'Tórax / Peitoral', val: activeAssessment.perimetry.torax, prev: previousAssessment?.perimetry.torax },
                        { label: 'Cintura (Menor curvatura)', val: activeAssessment.perimetry.cintura, prev: previousAssessment?.perimetry.cintura },
                        { label: 'Abdômen (Cicatriz umbilical)', val: activeAssessment.perimetry.abdomen, prev: previousAssessment?.perimetry.abdomen },
                        { label: 'Quadril (Maior perímetro glúteo)', val: activeAssessment.perimetry.quadril, prev: previousAssessment?.perimetry.quadril },
                        { label: 'Ombros', val: activeAssessment.perimetry.ombros, prev: previousAssessment?.perimetry.ombros },
                        { label: 'Pescoço', val: activeAssessment.perimetry.pescoco, prev: previousAssessment?.perimetry.pescoco }
                      ].map((item, idx) => {
                        const delta = getDelta(item.val || 0, item.prev, false);
                        return (
                          <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80">
                            <span className="font-medium text-slate-700">{item.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{item.val || '--'} cm</span>
                              {delta && (
                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold border ${delta.color}`}>
                                  {delta.formatted}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Membros Superiores e Inferiores (Simetria D / E) */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Dumbbell className="w-4 h-4 text-indigo-600" />
                      Membros & Simetria Lateral (D vs. E)
                    </h5>
                    <div className="space-y-2 text-xs">
                      {[
                        { 
                          label: 'Braço Contraído', 
                          d: activeAssessment.perimetry.bracoDireitoContraido, 
                          e: activeAssessment.perimetry.bracoEsquerdoContraido 
                        },
                        { 
                          label: 'Braço Relaxado', 
                          d: activeAssessment.perimetry.bracoDireitoRelaxado, 
                          e: activeAssessment.perimetry.bracoEsquerdoRelaxado 
                        },
                        { 
                          label: 'Antebraço', 
                          d: activeAssessment.perimetry.antebracoDireito, 
                          e: activeAssessment.perimetry.antebracoEsquerdo 
                        },
                        { 
                          label: 'Coxa Proximal', 
                          d: activeAssessment.perimetry.coxaDireitaProximal, 
                          e: activeAssessment.perimetry.coxaEsquerdaProximal 
                        },
                        { 
                          label: 'Coxa Medial', 
                          d: activeAssessment.perimetry.coxaDireitaMedial, 
                          e: activeAssessment.perimetry.coxaEsquerdaMedial 
                        },
                        { 
                          label: 'Panturrilha', 
                          d: activeAssessment.perimetry.panturrilhaDireita, 
                          e: activeAssessment.perimetry.panturrilhaEsquerda 
                        }
                      ].map((item, idx) => {
                        const asym = Math.abs(item.d - item.e);
                        return (
                          <div key={idx} className="p-2 rounded-lg bg-white border border-slate-200/80 flex items-center justify-between">
                            <span className="font-medium text-slate-700">{item.label}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-slate-800">
                                <strong>D:</strong> {item.d} cm
                              </span>
                              <span className="text-slate-800">
                                <strong>E:</strong> {item.e} cm
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                asym <= 0.5 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {asym === 0 ? 'Simétrico' : `Dif: ${asym.toFixed(1)}cm`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 4: ANAMNESE & PAR-Q */}
            {currentModuleTab === 'anamnese' && (
              <div className="p-4 sm:p-6 space-y-6">
                
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Anamnese Clínica & Prontidão para Atividade Física (PAR-Q)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Triagem de saúde, histórico médico e hábitos de vida
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    PAR-Q Liberado
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-800 uppercase text-[11px]">
                      Histórico Clínico & Patologias
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {activeAssessment.anamnesis?.clinicalHistory || 'Nenhuma patologia crônica relatada.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-800 uppercase text-[11px]">
                      Lesões e Restrições Osteomusculares
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {activeAssessment.anamnesis?.injuries || 'Sem lesões ativas.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-800 uppercase text-[11px]">
                      Medicamentos em Uso
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {activeAssessment.anamnesis?.medications || 'Nenhum medicamento contínuo.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-800 uppercase text-[11px]">
                      Nível de Atividade Física e Rotina
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {activeAssessment.anamnesis?.activityLevel || 'Praticante regular de atividade física.'} • Sono: {activeAssessment.anamnesis?.sleepHours || 8}h/noite • Hidratação: {activeAssessment.anamnesis?.waterIntakeLiters || 3}L/dia
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: TESTES FUNCIONAIS & VO2 MÁX */}
            {currentModuleTab === 'funcionais' && (
              <div className="p-4 sm:p-6 space-y-6">
                
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Capacidade Cardiorrespiratória & Aptidão Neuromuscular
                    </h4>
                    <p className="text-xs text-slate-500">
                      Protocolos de Cooper (VO2 Máx), força e flexibilidade
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Cooper VO2 */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-700 uppercase flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        VO2 Máximo
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        Excelente
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {activeAssessment.functionalTests?.vo2Max || 51.3} <span className="text-xs font-normal">ml/kg/min</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Teste de Cooper 12 min ({activeAssessment.functionalTests?.cooperDistanceMeters || 2800} metros percorridos)
                    </p>
                  </div>

                  {/* Força Neuromuscular */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 uppercase flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        Força & Resistência
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                        P90
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {activeAssessment.functionalTests?.pushups1Min || 44} <span className="text-xs font-normal">flexões</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Flexões de braço (1 min) + {activeAssessment.functionalTests?.crunches1Min || 48} abdominais (1 min)
                    </p>
                  </div>

                  {/* Flexibilidade */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-700 uppercase flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5" />
                        Flexibilidade
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        Excelente
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {activeAssessment.functionalTests?.wellsFlexibilityCm || 37.0} <span className="text-xs font-normal">cm</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Banco de Wells (Sentar e Alcançar)
                    </p>
                  </div>

                </div>

                {/* Hemodinâmica */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800">Parâmetros Hemodinâmicos em Repouso:</span>
                    <span className="text-slate-600">
                      Pressão Arterial (PA): <strong className="text-slate-900">{activeAssessment.functionalTests?.bloodPressure || '120/80 mmHg'}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-slate-600">
                      Frequência Cardíaca de Repouso: <strong className="text-slate-900">{activeAssessment.functionalTests?.restingHeartRateBpm || 60} bpm</strong>
                    </span>
                  </div>
                  <span className="text-emerald-700 font-bold">Normotenso</span>
                </div>

              </div>
            )}

            {/* TAB 6: FOTOS & POSTURA */}
            {currentModuleTab === 'fotos' && (
              <div className="p-4 sm:p-6 space-y-6">
                
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Registro Fotográfico & Avaliação Postural
                    </h4>
                    <p className="text-xs text-slate-500">
                      4 ângulos oficiais (Frente, Costas, Perfil Direito e Perfil Esquerdo) com régua de simetria
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                    Fotos em conformidade LGPD
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { angle: 'Frente (Anterior)', tag: 'Simetria de Ombros e Pelve' },
                    { angle: 'Costas (Posterior)', tag: 'Alinhamento Escapular' },
                    { angle: 'Perfil Direito', tag: 'Curvaturas Sagitais' },
                    { angle: 'Perfil Esquerdo', tag: 'Equilíbrio Postural' }
                  ].map((photo, i) => (
                    <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex flex-col">
                      <div className="h-44 sm:h-56 bg-slate-200/80 flex items-center justify-center text-slate-400 relative">
                        <Camera className="w-8 h-8 opacity-40" />
                        <div className="absolute inset-0 border border-dashed border-slate-300 pointer-events-none"></div>
                        <span className="absolute bottom-2 text-[10px] text-slate-500 bg-white/80 px-2 py-0.5 rounded font-medium">
                          Foto da Avaliação ({new Date(activeAssessment.date + 'T12:00:00').toLocaleDateString('pt-BR')})
                        </span>
                      </div>
                      <div className="p-3 bg-white text-center">
                        <div className="text-xs font-bold text-slate-800">{photo.angle}</div>
                        <div className="text-[10px] text-slate-500">{photo.tag}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Observações Posturais:</span>
                  <p className="text-slate-600 leading-relaxed">
                    {activeAssessment.postureNotes || 'Alinhamento postural fisiológico preservado. Sem evidência de escoliose ou hiperlordose.'}
                  </p>
                </div>

              </div>
            )}

            {/* TAB 7: COMPARATIVO & EVOLUÇÃO GRÁFICA */}
            {currentModuleTab === 'evolucao' && (
              <div className="p-4 sm:p-6 space-y-6">
                
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Histórico Completo de Avaliações Físicas de {currentStudent?.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Comparativo temporal de métricas antropométricas e composição corporal
                    </p>
                  </div>
                </div>

                {/* Evolution Comparison Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Data</th>
                        <th className="p-3">Peso</th>
                        <th className="p-3">% Gordura</th>
                        <th className="p-3">Massa Magra</th>
                        <th className="p-3">Massa Gorda</th>
                        <th className="p-3">Cintura</th>
                        <th className="p-3">Abdômen</th>
                        <th className="p-3">Braço (D/E)</th>
                        <th className="p-3">Classificação</th>
                        <th className="p-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {studentAssessments.map(av => (
                        <tr 
                          key={av.id}
                          className={`hover:bg-slate-50/80 transition-colors ${av.id === activeAssessment.id ? 'bg-blue-50/40 font-bold' : ''}`}
                        >
                          <td className="p-3 font-semibold text-slate-900">
                            {new Date(av.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-3">{av.weightKg} kg</td>
                          <td className="p-3 text-blue-700 font-extrabold">{av.composition.bodyFatPercentage}%</td>
                          <td className="p-3 text-emerald-700 font-bold">{av.composition.leanMassKg} kg</td>
                          <td className="p-3 text-amber-700 font-medium">{av.composition.fatMassKg} kg</td>
                          <td className="p-3">{av.perimetry.cintura} cm</td>
                          <td className="p-3">{av.perimetry.abdomen} cm</td>
                          <td className="p-3">{av.perimetry.bracoDireitoContraido} / {av.perimetry.bracoEsquerdoContraido} cm</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                              {av.composition.classification}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedAssessmentId(av.id)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline"
                            >
                              Ver Detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </div>
        </>
      )}

      {/* MODAL: NOVA AVALIAÇÃO FÍSICA (Baseado no fluxo do avaliacaofisica.app com cálculo em tempo real) */}
      {showNewAssessmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Nova Avaliação Física Antropométrica
                  </h3>
                  <p className="text-xs text-slate-300">
                    Aluno: <strong>{currentStudent?.name}</strong> • Cálculo em tempo real dos protocolos
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAssessmentModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Calculation Preview Banner */}
            <div className="p-3 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex flex-wrap items-center justify-between gap-3 text-xs shadow-inner">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="font-bold">Resultado Calculado em Tempo Real:</span>
              </div>
              <div className="flex items-center gap-4 font-bold">
                <span>% Gordura: <strong className="text-amber-200 text-sm">{liveFatPercentage}%</strong></span>
                <span>Massa Magra: <strong className="text-emerald-200 text-sm">{liveLeanMass} kg</strong></span>
                <span>Massa Gorda: <strong className="text-rose-200 text-sm">{liveFatMass} kg</strong></span>
                <span>IMC: <strong className="text-white text-sm">{liveBmi}</strong></span>
              </div>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveNewAssessment} className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs">
              
              {/* General Data */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  1. Dados Gerais & Protocolo
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Data da Avaliação</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-900 font-bold focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Avaliador Responsável</label>
                    <input
                      type="text"
                      value={newEvaluator}
                      onChange={(e) => setNewEvaluator(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-900 font-medium focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Protocolo Antropométrico</label>
                    <select
                      value={newProtocol}
                      onChange={(e) => setNewProtocol(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-900 font-bold focus:border-blue-600 focus:outline-hidden"
                    >
                      <option value="pollock7">Pollock 7 Dobras (Recomendado)</option>
                      <option value="pollock3">Pollock 3 Dobras (Rápido)</option>
                      <option value="guedes">Guedes (3 Dobras)</option>
                      <option value="petroski">Petroski (4 Dobras)</option>
                      <option value="bioimpedancia">Bioimpedância Direta</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Peso Atual (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newWeight}
                      onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-900 font-bold focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Altura (cm)</label>
                    <input
                      type="number"
                      value={newHeight}
                      onChange={(e) => setNewHeight(parseInt(e.target.value) || 0)}
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-900 font-bold focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Idade (anos)</label>
                    <input
                      type="number"
                      value={newAge}
                      onChange={(e) => setNewAge(parseInt(e.target.value) || 0)}
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-900 font-bold focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Sexo Biológico</label>
                    <select
                      value={newGender}
                      onChange={(e) => setNewGender(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-900 font-bold focus:border-blue-600 focus:outline-hidden"
                    >
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Skinfolds Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    2. Dobras Cutâneas (em milímetros - mm)
                  </h4>
                  <span className="text-[11px] font-bold text-blue-700">
                    Soma: {liveSkinfoldsSum} mm
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Peitoral (mm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={peitoral}
                      onChange={(e) => setPeitoral(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Axilar Média (mm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={axilarMedia}
                      onChange={(e) => setAxilarMedia(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Tríceps (mm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={triceps}
                      onChange={(e) => setTriceps(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Subescapular (mm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={subescapular}
                      onChange={(e) => setSubescapular(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Bíceps (mm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={biceps}
                      onChange={(e) => setBiceps(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Abdominal (mm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={abdominal}
                      onChange={(e) => setAbdominal(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Suprailíaca (mm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={suprailiaca}
                      onChange={(e) => setSuprailiaca(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Coxa Medial (mm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={coxa}
                      onChange={(e) => setCoxa(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Panturrilha Medial (mm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={panturrilha}
                      onChange={(e) => setPanturrilha(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Perimetry Input */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  3. Perimetria Principal (em centímetros - cm)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Tórax (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={torax}
                      onChange={(e) => setTorax(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Cintura (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={cintura}
                      onChange={(e) => setCintura(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Abdômen (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={abdomen}
                      onChange={(e) => setAbdomen(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Quadril (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={quadril}
                      onChange={(e) => setQuadril(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Braço D Contraído (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={bracoDirContr}
                      onChange={(e) => setBracoDirContr(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Braço E Contraído (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={bracoEsqContr}
                      onChange={(e) => setBracoEsqContr(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Coxa D Proximal (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={coxaDirProx}
                      onChange={(e) => setCoxaDirProx(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-0.5">Coxa E Proximal (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={coxaEsqProx}
                      onChange={(e) => setCoxaEsqProx(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 bg-white text-slate-900 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewAssessmentModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Avaliação Física</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: DISPARO DE AVALIAÇÃO VIA WHATSAPP (Baseado no fluxo do avaliacaofisica.app) */}
      {showWhatsAppModal && activeAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Notificar Aluno no WhatsApp
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="w-8 h-8 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                O resultado resumido da avaliação física será enviado para o WhatsApp de <strong>{currentStudent?.name}</strong> ({currentStudent?.phone || '(11) 98765-4321'}).
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase text-[10px]">
                  Prévia da Mensagem Formatada
                </label>
                <textarea
                  readOnly
                  rows={10}
                  value={generateWhatsAppMessage()}
                  className="w-full rounded-xl border border-slate-300 p-3 bg-slate-50 font-mono text-[11px] text-slate-800 leading-relaxed focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generateWhatsAppMessage());
                    showToast('Mensagem copiada para a área de transferência!');
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                >
                  Copiar Texto
                </button>

                <a
                  href={`https://wa.me/55${(currentStudent?.phone || '11987654321').replace(/\D/g, '')}?text=${encodeURIComponent(generateWhatsAppMessage())}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    setShowWhatsAppModal(false);
                    showToast('Disparo no WhatsApp iniciado com sucesso!');
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar no WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
