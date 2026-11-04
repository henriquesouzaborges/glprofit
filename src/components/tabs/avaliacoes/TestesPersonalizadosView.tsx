import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Activity, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Save, 
  Share2, 
  Printer, 
  User, 
  Calendar, 
  Award, 
  Zap, 
  Flame, 
  Timer, 
  Target, 
  Filter, 
  Copy, 
  HelpCircle,
  Dumbbell,
  Compass,
  Trophy,
  ArrowRight,
  Check,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Student } from '../../../types';

interface TestesPersonalizadosViewProps {
  student: Student;
  onSave?: (data: any) => void;
}

export type MetricType = 'seconds' | 'reps' | 'meters' | 'cm' | 'kg' | 'watts' | 'scale';

export interface NormativeLevel {
  label: string;
  min: number;
  max: number;
  badgeColor: string; // Tailwind class
}

export interface CustomTestDefinition {
  id: string;
  name: string;
  modality: 'Lutas' | 'CrossFit' | 'Natação' | 'Basquete/Vôlei' | 'Corrida' | 'Personalizado';
  metricType: MetricType;
  unit: string;
  higherIsBetter: boolean;
  attemptsCount: number;
  summaryType: 'best' | 'average';
  instructions: string;
  equipment: string;
  normativeLevels: NormativeLevel[];
  isBuiltIn?: boolean;
}

export interface StudentTestRecord {
  testId: string;
  attempts: number[];
  bestOrAvgValue: number;
  classification: string;
  notes: string;
}

// Bateria de Modelos Prontos por Modalidade Esportiva
const DEFAULT_TEST_TEMPLATES: CustomTestDefinition[] = [
  // 1. LUTAS (BJJ / Judô)
  {
    id: 'bjj_kimono_hang',
    name: 'Suspensão na Barra com Pegada de Kimono',
    modality: 'Lutas',
    metricType: 'seconds',
    unit: 's',
    higherIsBetter: true,
    attemptsCount: 2,
    summaryType: 'best',
    instructions: 'Atleta sustenta o peso corporal em suspensão isométrica segurando dois panos de kimono enrolados na barra fixa até a falha.',
    equipment: 'Barra fixa, 2 mangas/faixas de kimono e cronômetro.',
    isBuiltIn: true,
    normativeLevels: [
      { label: 'Excelente', min: 60, max: 999, badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
      { label: 'Bom', min: 45, max: 59.9, badgeColor: 'bg-blue-50 text-blue-800 border-blue-300' },
      { label: 'Médio', min: 30, max: 44.9, badgeColor: 'bg-amber-50 text-amber-800 border-amber-300' },
      { label: 'Fraco', min: 0, max: 29.9, badgeColor: 'bg-rose-50 text-rose-800 border-rose-300' },
    ]
  },
  {
    id: 'bjj_dynamic_plank',
    name: 'Prancha Dinâmica do Core (Giro Lateral)',
    modality: 'Lutas',
    metricType: 'reps',
    unit: 'reps',
    higherIsBetter: true,
    attemptsCount: 2,
    summaryType: 'best',
    instructions: '1 minuto de prancha com rotação alternada de tronco e toque dorsal. Mede estabilidade rotacional e força do core.',
    equipment: 'Tatame ou colchonete e cronômetro de 60s.',
    isBuiltIn: true,
    normativeLevels: [
      { label: 'Excelente', min: 35, max: 999, badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
      { label: 'Bom', min: 28, max: 34.9, badgeColor: 'bg-blue-50 text-blue-800 border-blue-300' },
      { label: 'Médio', min: 20, max: 27.9, badgeColor: 'bg-amber-50 text-amber-800 border-amber-300' },
      { label: 'Fraco', min: 0, max: 19.9, badgeColor: 'bg-rose-50 text-rose-800 border-rose-300' },
    ]
  },

  // 2. CROSSFIT / FUNCIONAL
  {
    id: 'cf_pullups_unbroken',
    name: 'Máximo de Barra Fixa Unbroken (Pull-ups)',
    modality: 'CrossFit',
    metricType: 'reps',
    unit: 'reps',
    higherIsBetter: true,
    attemptsCount: 2,
    summaryType: 'best',
    instructions: 'Máximo número de repetições consecutivas de barra fixa (kipping ou strict) sem soltar a barra.',
    equipment: 'Barra fixa e magnésio.',
    isBuiltIn: true,
    normativeLevels: [
      { label: 'Excelente', min: 30, max: 999, badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
      { label: 'Bom', min: 20, max: 29.9, badgeColor: 'bg-blue-50 text-blue-800 border-blue-300' },
      { label: 'Médio', min: 12, max: 19.9, badgeColor: 'bg-amber-50 text-amber-800 border-amber-300' },
      { label: 'Fraco', min: 0, max: 11.9, badgeColor: 'bg-rose-50 text-rose-800 border-rose-300' },
    ]
  },
  {
    id: 'cf_rower_500m',
    name: 'Remo Ergômetro 500m All-Out',
    modality: 'CrossFit',
    metricType: 'seconds',
    unit: 's',
    higherIsBetter: false,
    attemptsCount: 1,
    summaryType: 'best',
    instructions: 'Tiro de 500 metros no remo ergômetro (Concept2) na máxima potência. Registra o tempo total em segundos.',
    equipment: 'Remo ergômetro Concept2 ajustado no damper 5.',
    isBuiltIn: true,
    normativeLevels: [
      { label: 'Excelente', min: 0, max: 90, badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300' }, // < 1:30
      { label: 'Bom', min: 90.1, max: 100, badgeColor: 'bg-blue-50 text-blue-800 border-blue-300' }, // 1:30 a 1:40
      { label: 'Médio', min: 100.1, max: 115, badgeColor: 'bg-amber-50 text-amber-800 border-amber-300' }, // 1:40 a 1:55
      { label: 'Fraco', min: 115.1, max: 999, badgeColor: 'bg-rose-50 text-rose-800 border-rose-300' }, // > 1:55
    ]
  },
  {
    id: 'cf_burpee_box_jump',
    name: 'Burpee Box Jump Over (3 Minutos)',
    modality: 'CrossFit',
    metricType: 'reps',
    unit: 'reps',
    higherIsBetter: true,
    attemptsCount: 1,
    summaryType: 'best',
    instructions: 'Máximo de burpees com salto por cima da caixa (caixote de 60cm/50cm) em 3 minutos contínuos.',
    equipment: 'Caixote pliométrico e cronômetro.',
    isBuiltIn: true,
    normativeLevels: [
      { label: 'Excelente', min: 45, max: 999, badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
      { label: 'Bom', min: 36, max: 44.9, badgeColor: 'bg-blue-50 text-blue-800 border-blue-300' },
      { label: 'Médio', min: 28, max: 35.9, badgeColor: 'bg-amber-50 text-amber-800 border-amber-300' },
      { label: 'Fraco', min: 0, max: 27.9, badgeColor: 'bg-rose-50 text-rose-800 border-rose-300' },
    ]
  },

  // 3. NATAÇÃO
  {
    id: 'nat_critical_speed_css',
    name: 'Velocidade Crítica de Nado (CSS 400m/200m)',
    modality: 'Natação',
    metricType: 'seconds',
    unit: 's',
    higherIsBetter: false,
    attemptsCount: 1,
    summaryType: 'best',
    instructions: 'Tempo para cobrir 400m em ritmo máximo de nado crawl. Determina o limiar anaeróbio aquático.',
    equipment: 'Piscina semiolímpica (25m) ou olímpica (50m) e cronômetro.',
    isBuiltIn: true,
    normativeLevels: [
      { label: 'Excelente', min: 0, max: 270, badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300' }, // < 4:30
      { label: 'Bom', min: 270.1, max: 320, badgeColor: 'bg-blue-50 text-blue-800 border-blue-300' }, // 4:30 a 5:20
      { label: 'Médio', min: 320.1, max: 390, badgeColor: 'bg-amber-50 text-amber-800 border-amber-300' }, // 5:20 a 6:30
      { label: 'Fraco', min: 390.1, max: 999, badgeColor: 'bg-rose-50 text-rose-800 border-rose-300' },
    ]
  },
  {
    id: 'nat_underwater_apnea',
    name: 'Nado Submerso em Apneia Dinâmica',
    modality: 'Natação',
    metricType: 'meters',
    unit: 'm',
    higherIsBetter: true,
    attemptsCount: 2,
    summaryType: 'best',
    instructions: 'Distância em metros percorrida submerso com pernada de golfinho sem respirar, após inspiração profunda.',
    equipment: 'Piscina e fita métrica/marcas de borda.',
    isBuiltIn: true,
    normativeLevels: [
      { label: 'Excelente', min: 35, max: 999, badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
      { label: 'Bom', min: 25, max: 34.9, badgeColor: 'bg-blue-50 text-blue-800 border-blue-300' },
      { label: 'Médio', min: 18, max: 24.9, badgeColor: 'bg-amber-50 text-amber-800 border-amber-300' },
      { label: 'Fraco', min: 0, max: 17.9, badgeColor: 'bg-rose-50 text-rose-800 border-rose-300' },
    ]
  },

  // 4. BASQUETE / VÔLEI
  {
    id: 'bv_spike_jump',
    name: 'Alcance de Salto de Ataque (Spike Jump Reach)',
    modality: 'Basquete/Vôlei',
    metricType: 'cm',
    unit: 'cm',
    higherIsBetter: true,
    attemptsCount: 3,
    summaryType: 'best',
    instructions: 'Com corrida de aproximação de 2 ou 3 passos, o atleta salta verticalmente e toca a altura máxima no Vertec.',
    equipment: 'Aparelho Vertec ou fita métrica graduada na parede.',
    isBuiltIn: true,
    normativeLevels: [
      { label: 'Excelente', min: 320, max: 999, badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
      { label: 'Bom', min: 300, max: 319.9, badgeColor: 'bg-blue-50 text-blue-800 border-blue-300' },
      { label: 'Médio', min: 280, max: 299.9, badgeColor: 'bg-amber-50 text-amber-800 border-amber-300' },
      { label: 'Fraco', min: 0, max: 279.9, badgeColor: 'bg-rose-50 text-rose-800 border-rose-300' },
    ]
  },
  {
    id: 'bv_lane_agility',
    name: 'Lane Agility Drill (Agilidade no Garrafão NBA)',
    modality: 'Basquete/Vôlei',
    metricType: 'seconds',
    unit: 's',
    higherIsBetter: false,
    attemptsCount: 2,
    summaryType: 'best',
    instructions: 'Circuito no garrafão oficial de basquete: corrida frontal, deslocamento lateral, recuo de costas e lateral de volta.',
    equipment: 'Garrafão de basquete (4 cones) e cronômetro eletrônico.',
    isBuiltIn: true,
    normativeLevels: [
      { label: 'Excelente', min: 0, max: 11.0, badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
      { label: 'Bom', min: 11.01, max: 11.8, badgeColor: 'bg-blue-50 text-blue-800 border-blue-300' },
      { label: 'Médio', min: 11.81, max: 12.8, badgeColor: 'bg-amber-50 text-amber-800 border-amber-300' },
      { label: 'Fraco', min: 12.81, max: 999, badgeColor: 'bg-rose-50 text-rose-800 border-rose-300' },
    ]
  },

  // 5. CORRIDA / ATLETISMO
  {
    id: 'cor_sprint_30m',
    name: 'Velocidade Pura: Tiro de 30m Lançado',
    modality: 'Corrida',
    metricType: 'seconds',
    unit: 's',
    higherIsBetter: false,
    attemptsCount: 3,
    summaryType: 'best',
    instructions: 'Sprint máximo de 30 metros com 10 metros de aceleração prévia (fotocélula ou cronômetro manual no disparo).',
    equipment: 'Pista reta, cones e cronômetro de precisão.',
    isBuiltIn: true,
    normativeLevels: [
      { label: 'Excelente', min: 0, max: 3.8, badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
      { label: 'Bom', min: 3.81, max: 4.1, badgeColor: 'bg-blue-50 text-blue-800 border-blue-300' },
      { label: 'Médio', min: 4.11, max: 4.5, badgeColor: 'bg-amber-50 text-amber-800 border-amber-300' },
      { label: 'Fraco', min: 4.51, max: 999, badgeColor: 'bg-rose-50 text-rose-800 border-rose-300' },
    ]
  }
];

export const TestesPersonalizadosView: React.FC<TestesPersonalizadosViewProps> = ({ student, onSave }) => {
  const STORAGE_KEY_LIB = 'glprofit_custom_tests_library';
  const STORAGE_KEY_RECORDS = `glprofit_custom_tests_records_${student?.id || 'default'}`;

  // Lista de Testes Disponíveis (Templates Padrão + Criados pelo Treinador)
  const [testsLibrary, setTestsLibrary] = useState<CustomTestDefinition[]>(() => {
    try {
      const savedLib = localStorage.getItem(STORAGE_KEY_LIB);
      if (savedLib) {
        const parsed = JSON.parse(savedLib);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_TEST_TEMPLATES;
  });

  // Metadados da Sessão
  const [evaluationDate, setEvaluationDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [evaluatorName, setEvaluatorName] = useState('Prof. Gianluca Marinho (CREF 112001-G/SP)');
  const [selectedModalityFilter, setSelectedModalityFilter] = useState<string>('Todas');

  // Resultados dos Testes do Aluno (chaveados por testId)
  const [studentRecords, setStudentRecords] = useState<Record<string, StudentTestRecord>>({});
  const [activeTestId, setActiveTestId] = useState<string>(DEFAULT_TEST_TEMPLATES[0].id);

  // Modal Construtor de Novo Teste
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestModality, setNewTestModality] = useState<'Lutas' | 'CrossFit' | 'Natação' | 'Basquete/Vôlei' | 'Corrida' | 'Personalizado'>('Personalizado');
  const [newTestMetricType, setNewTestMetricType] = useState<MetricType>('reps');
  const [newTestUnit, setNewTestUnit] = useState('reps');
  const [newTestHigherBetter, setNewTestHigherBetter] = useState(true);
  const [newTestAttempts, setNewTestAttempts] = useState(2);
  const [newTestSummaryType, setNewTestSummaryType] = useState<'best' | 'average'>('best');
  const [newTestInstructions, setNewTestInstructions] = useState('');
  const [newTestEquipment, setNewTestEquipment] = useState('');
  const [newTestLevels, setNewTestLevels] = useState<NormativeLevel[]>([
    { label: 'Excelente', min: 40, max: 999, badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    { label: 'Bom', min: 30, max: 39.9, badgeColor: 'bg-blue-50 text-blue-800 border-blue-300' },
    { label: 'Médio', min: 20, max: 29.9, badgeColor: 'bg-amber-50 text-amber-800 border-amber-300' },
    { label: 'Fraco', min: 0, max: 19.9, badgeColor: 'bg-rose-50 text-rose-800 border-rose-300' },
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [generalObservations, setGeneralObservations] = useState('');

  // Carrega registros salvos do aluno
  useEffect(() => {
    try {
      const savedRec = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (savedRec) {
        const parsed = JSON.parse(savedRec);
        if (parsed.records) setStudentRecords(parsed.records);
        if (parsed.evaluationDate) setEvaluationDate(parsed.evaluationDate);
        if (parsed.evaluatorName) setEvaluatorName(parsed.evaluatorName);
        if (parsed.generalObservations) setGeneralObservations(parsed.generalObservations);
      }
    } catch {}
  }, [STORAGE_KEY_RECORDS]);

  // Salva biblioteca no localStorage quando houver novos testes
  const persistLibrary = (updatedLib: CustomTestDefinition[]) => {
    setTestsLibrary(updatedLib);
    try {
      localStorage.setItem(STORAGE_KEY_LIB, JSON.stringify(updatedLib));
    } catch {}
  };

  // Teste atualmente selecionado para aplicação
  const activeTest = testsLibrary.find(t => t.id === activeTestId) || testsLibrary[0];

  // Registro atual do aluno no teste ativo
  const currentRecord: StudentTestRecord = studentRecords[activeTest?.id] || {
    testId: activeTest?.id || '',
    attempts: Array(activeTest?.attemptsCount || 2).fill(0),
    bestOrAvgValue: 0,
    classification: 'Pendente',
    notes: ''
  };

  // Filtra biblioteca por modalidade
  const filteredTests = testsLibrary.filter(t => {
    if (selectedModalityFilter === 'Todas') return true;
    return t.modality === selectedModalityFilter;
  });

  // Função para classificar o resultado
  const calculateClassification = (val: number, test: CustomTestDefinition): { label: string; badgeColor: string } => {
    if (val <= 0 && test.metricType !== 'seconds') {
      return { label: 'Não avaliado', badgeColor: 'bg-slate-100 text-slate-500 border-slate-200' };
    }
    for (const level of test.normativeLevels) {
      if (val >= level.min && val <= level.max) {
        return { label: level.label, badgeColor: level.badgeColor };
      }
    }
    return { label: 'Regular', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' };
  };

  // Atualiza tentativa do teste ativo
  const handleUpdateAttempt = (attemptIndex: number, val: number) => {
    if (!activeTest) return;
    const newAttempts = [...(currentRecord.attempts || Array(activeTest.attemptsCount).fill(0))];
    newAttempts[attemptIndex] = val;

    // Calcula melhor marca ou média
    const validAttempts = newAttempts.filter(v => v > 0);
    let bestOrAvg = 0;
    if (validAttempts.length > 0) {
      if (activeTest.summaryType === 'best') {
        bestOrAvg = activeTest.higherIsBetter 
          ? Math.max(...validAttempts) 
          : Math.min(...validAttempts);
      } else {
        bestOrAvg = parseFloat((validAttempts.reduce((a, b) => a + b, 0) / validAttempts.length).toFixed(2));
      }
    }

    const classification = calculateClassification(bestOrAvg, activeTest).label;

    setStudentRecords(prev => ({
      ...prev,
      [activeTest.id]: {
        ...currentRecord,
        testId: activeTest.id,
        attempts: newAttempts,
        bestOrAvgValue: bestOrAvg,
        classification,
      }
    }));
  };

  // Atualiza observação do teste ativo
  const handleUpdateNotes = (notes: string) => {
    if (!activeTest) return;
    setStudentRecords(prev => ({
      ...prev,
      [activeTest.id]: {
        ...currentRecord,
        testId: activeTest.id,
        notes
      }
    }));
  };

  // Salva toda a bateria no LocalStorage
  const handleSaveAll = () => {
    const payload = {
      studentId: student.id,
      studentName: student.name,
      evaluationDate,
      evaluatorName,
      records: studentRecords,
      generalObservations,
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(payload));
      if (onSave) onSave(payload);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {}
  };

  // Criar novo teste customizado
  const handleCreateTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim()) return;

    const newTest: CustomTestDefinition = {
      id: `custom_${Date.now()}`,
      name: newTestName.trim(),
      modality: newTestModality,
      metricType: newTestMetricType,
      unit: newTestUnit,
      higherIsBetter: newTestHigherBetter,
      attemptsCount: newTestAttempts,
      summaryType: newTestSummaryType,
      instructions: newTestInstructions,
      equipment: newTestEquipment,
      normativeLevels: newTestLevels,
      isBuiltIn: false
    };

    const updated = [newTest, ...testsLibrary];
    persistLibrary(updated);
    setActiveTestId(newTest.id);
    setShowCreateModal(false);

    // Reseta form
    setNewTestName('');
    setNewTestInstructions('');
    setNewTestEquipment('');
  };

  // Excluir teste personalizado (apenas não built-in)
  const handleDeleteCustomTest = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Deseja excluir este teste da sua biblioteca?')) return;
    const updated = testsLibrary.filter(t => t.id !== id);
    persistLibrary(updated);
    if (activeTestId === id) {
      setActiveTestId(updated[0]?.id || '');
    }
  };

  // Exportar para WhatsApp formatado
  const handleShareWhatsApp = () => {
    const formattedDate = evaluationDate.split('-').reverse().join('/');
    let msg = `🏆 *GL PRO FIT • BATERIA DE TESTES PERSONALIZADOS*\n`;
    msg += `👤 *Atleta:* ${student.name} (${student.code})\n`;
    msg += `📅 *Data:* ${formattedDate}\n`;
    msg += `👨‍🏫 *Avaliador:* ${evaluatorName}\n\n`;

    const evaluatedTests = testsLibrary.filter(t => {
      const rec = studentRecords[t.id];
      return rec && rec.bestOrAvgValue > 0;
    });

    if (evaluatedTests.length === 0) {
      msg += `Nenhum teste personalizado preenchido ainda.\n`;
    } else {
      msg += `🎯 *RESULTADOS OBTIDOS:*\n\n`;
      evaluatedTests.forEach((t, i) => {
        const rec = studentRecords[t.id];
        const classObj = calculateClassification(rec.bestOrAvgValue, t);
        msg += `${i + 1}. *${t.name}* (${t.modality})\n`;
        msg += `   • Marca: *${rec.bestOrAvgValue} ${t.unit}* (${t.summaryType === 'best' ? 'Melhor Tentativa' : 'Média'})\n`;
        msg += `   • Classificação: *${classObj.label}*\n`;
        if (rec.notes) msg += `   • Obs: ${rec.notes}\n`;
        msg += `\n`;
      });
    }

    if (generalObservations) {
      msg += `📝 *Diretrizes do Treinador:*\n${generalObservations}\n\n`;
    }

    msg += `✅ *GL PRO FIT Enterprise Suite*`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* HEADER DE AÇÕES */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              Métricas Sob Demanda & Modalidades Específicas
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">
              Lutas (BJJ/Judô), CrossFit, Natação, Basquete, Vôlei e Construtor Próprio
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-blue-600" />
            <span>Baterias de Testes Físicos Personalizados</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prescrição e testagem com protocolos customizados para <strong>{student.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Teste</span>
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
            onClick={handleSaveAll}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Bateria</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Bateria de testes personalizados e laudo esportivo salvos com sucesso!</span>
        </div>
      )}

      {/* METADADOS DA AVALIAÇÃO */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Data da Aplicação:</label>
          <div className="relative">
            <input
              type="date"
              value={evaluationDate}
              onChange={(e) => setEvaluationDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Avaliador Responsável:</label>
          <div className="relative">
            <input
              type="text"
              value={evaluatorName}
              onChange={(e) => setEvaluatorName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Filtrar por Modalidade:</label>
          <div className="relative">
            <select
              value={selectedModalityFilter}
              onChange={(e) => setSelectedModalityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todas">🏆 Todas as Modalidades ({testsLibrary.length})</option>
              <option value="Lutas">🥋 Lutas / BJJ & Judô</option>
              <option value="CrossFit">🏋️ CrossFit & Funcional</option>
              <option value="Natação">🏊‍♂️ Natação & Aquáticos</option>
              <option value="Basquete/Vôlei">🏀 Basquete & Vôlei</option>
              <option value="Corrida">🏃 Corrida & Velocidade</option>
              <option value="Personalizado">✨ Criados pelo Treinador</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRID PRINCIPAL: LISTA LATERAL DE TESTES + PAINEL DE PREENCHIMENTO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUNA ESQUERDA: LISTA DE TESTES (4 COLUNAS) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-700 tracking-wide">
              Biblioteca de Testes ({filteredTests.length})
            </span>
            <span className="text-[10px] text-slate-400">
              Selecione para preencher
            </span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredTests.map((test) => {
              const isSelected = activeTestId === test.id;
              const record = studentRecords[test.id];
              const isFilled = record && record.bestOrAvgValue > 0;
              const classObj = isFilled ? calculateClassification(record.bestOrAvgValue, test) : null;

              return (
                <div
                  key={test.id}
                  onClick={() => setActiveTestId(test.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {test.modality}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {test.unit}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                        {test.name}
                      </h4>
                    </div>

                    {!test.isBuiltIn && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCustomTest(test.id, e)}
                        className="text-slate-300 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Excluir teste customizado"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Status de preenchimento */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    {isFilled ? (
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-slate-900">{record.bestOrAvgValue} {test.unit}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-black ${classObj?.badgeColor}`}>
                          {classObj?.label}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-medium">Pendente de preenchimento</span>
                    )}
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {test.attemptsCount} {test.attemptsCount > 1 ? 'tentativas' : 'tentativa'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUNA DIREITA: PAINEL DE TESTAGEM DO TESTE SELECIONADO (8 COLUNAS) */}
        <div className="lg:col-span-8 space-y-5">
          {activeTest ? (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-6">
              {/* Cabeçalho do Teste Ativo */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800">
                      {activeTest.modality}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      Métrica: <strong>{activeTest.unit}</strong> • {activeTest.summaryType === 'best' ? 'Melhor Marca' : 'Média das Tentativas'}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {activeTest.higherIsBetter ? '▲ Maior valor é melhor' : '▼ Menor tempo é melhor'}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mt-2">
                  {activeTest.name}
                </h3>

                {/* Instruções e Equipamentos */}
                <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                  <div>
                    <strong className="text-slate-900">Protocolo & Execução:</strong> {activeTest.instructions}
                  </div>
                  {activeTest.equipment && (
                    <div className="text-slate-500 text-[11px]">
                      <strong>Equipamentos:</strong> {activeTest.equipment}
                    </div>
                  )}
                </div>
              </div>

              {/* Tabela de Critérios Normativos */}
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-2">
                  Tabela Normativa & Classificação:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {activeTest.normativeLevels.map((lvl, idx) => (
                    <div key={idx} className={`p-2.5 rounded-xl border text-center ${lvl.badgeColor}`}>
                      <strong className="block text-xs font-black">{lvl.label}</strong>
                      <span className="text-[11px] font-medium block mt-0.5">
                        {lvl.max >= 999 
                          ? `≥ ${lvl.min} ${activeTest.unit}` 
                          : lvl.min <= 0 
                            ? `≤ ${lvl.max} ${activeTest.unit}` 
                            : `${lvl.min} a ${lvl.max} ${activeTest.unit}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registro de Tentativas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Registro de Tentativas do Aluno:
                  </label>
                  <span className="text-xs font-bold text-blue-700">
                    {activeTest.summaryType === 'best' ? 'Melhor Marca' : 'Média'}: {currentRecord.bestOrAvgValue || 0} {activeTest.unit}
                  </span>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-${Math.min(activeTest.attemptsCount, 4)} gap-3`}>
                  {Array.from({ length: activeTest.attemptsCount }).map((_, idx) => {
                    const val = currentRecord.attempts?.[idx] || 0;
                    return (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">
                          Tentativa {idx + 1}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            step="0.1"
                            value={val === 0 ? '' : val}
                            onChange={(e) => handleUpdateAttempt(idx, parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white text-base font-black text-slate-900 focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-xs font-bold text-slate-400">{activeTest.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card de Resultado Instantâneo */}
              {currentRecord.bestOrAvgValue > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-300 uppercase block">Resultado Final</span>
                    <div className="text-2xl font-black text-white">
                      {currentRecord.bestOrAvgValue} <span className="text-sm font-normal text-blue-200">{activeTest.unit}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-blue-300 uppercase block">Classificação Obtida</span>
                    <span className="inline-block mt-0.5 px-3 py-1 rounded-lg text-xs font-black bg-white/20 text-white border border-white/20">
                      {calculateClassification(currentRecord.bestOrAvgValue, activeTest).label}
                    </span>
                  </div>
                </div>
              )}

              {/* Observações do Teste */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observações Técnicas do Teste ({activeTest.name}):
                </label>
                <input
                  type="text"
                  value={currentRecord.notes || ''}
                  onChange={(e) => handleUpdateNotes(e.target.value)}
                  placeholder="Ex: Excelente pegada bilateral; quebra de postura aos 45 segundos; boa cadência..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              Selecione um teste na coluna ao lado para iniciar a avaliação.
            </div>
          )}
        </div>
      </div>

      {/* PARECER GERAL DO TREINADOR */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
          Diretrizes Gerais do Treinador & Recomendações da Bateria
        </label>
        <textarea
          rows={3}
          value={generalObservations}
          onChange={(e) => setGeneralObservations(e.target.value)}
          placeholder="Insira as recomendações para as próximas semanas de treino com base nos testes personalizados aplicados..."
          className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* MODAL CONSTRUTOR DE NOVO TESTE */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <span>Criar Novo Teste Personalizado</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure o nome, modalidade, métrica e critérios de avaliação sob medida
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Teste:</label>
                <input
                  type="text"
                  required
                  value={newTestName}
                  onChange={(e) => setNewTestName(e.target.value)}
                  placeholder="Ex: Teste de Pliometria no Caixote, Teste de Potência de Chute..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Modalidade / Esporte:</label>
                  <select
                    value={newTestModality}
                    onChange={(e) => setNewTestModality(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                  >
                    <option value="Personalizado">Personalizado</option>
                    <option value="Lutas">Lutas / BJJ & Judô</option>
                    <option value="CrossFit">CrossFit & Funcional</option>
                    <option value="Natação">Natação</option>
                    <option value="Basquete/Vôlei">Basquete / Vôlei</option>
                    <option value="Corrida">Corrida & Atletismo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Métrica de Medição:</label>
                  <select
                    value={newTestMetricType}
                    onChange={(e) => {
                      const type = e.target.value as MetricType;
                      setNewTestMetricType(type);
                      if (type === 'seconds') setNewTestUnit('s');
                      else if (type === 'reps') setNewTestUnit('reps');
                      else if (type === 'meters') setNewTestUnit('m');
                      else if (type === 'cm') setNewTestUnit('cm');
                      else if (type === 'kg') setNewTestUnit('kg');
                      else if (type === 'watts') setNewTestUnit('W');
                      else if (type === 'scale') setNewTestUnit('pts');
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                  >
                    <option value="reps">Repetições (reps)</option>
                    <option value="seconds">Tempo em Segundos (s)</option>
                    <option value="meters">Distância em Metros (m)</option>
                    <option value="cm">Altura/Alcance em Centímetros (cm)</option>
                    <option value="kg">Carga / Peso em Quilos (kg)</option>
                    <option value="watts">Potência em Watts (W)</option>
                    <option value="scale">Escala de Pontos (1 a 10)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tentativas (1 a 5):</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={newTestAttempts}
                    onChange={(e) => setNewTestAttempts(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Critério de Cálculo:</label>
                  <select
                    value={newTestSummaryType}
                    onChange={(e) => setNewTestSummaryType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    <option value="best">Melhor Tentativa</option>
                    <option value="average">Média das Tentativas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sentido de Melhora:</label>
                  <select
                    value={newTestHigherBetter ? 'true' : 'false'}
                    onChange={(e) => setNewTestHigherBetter(e.target.value === 'true')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    <option value="true">▲ Maior é melhor</option>
                    <option value="false">▼ Menor é melhor (Tempo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instruções de Execução:</label>
                <textarea
                  rows={2}
                  value={newTestInstructions}
                  onChange={(e) => setNewTestInstructions(e.target.value)}
                  placeholder="Descreva o passo a passo de como o atleta deve realizar o teste..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Equipamentos Necessários:</label>
                <input
                  type="text"
                  value={newTestEquipment}
                  onChange={(e) => setNewTestEquipment(e.target.value)}
                  placeholder="Ex: Cronômetro, barra, colchonete, fita métrica..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              {/* Botões do Modal */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Salvar na Biblioteca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
