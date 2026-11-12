import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  Calendar,
  Clock,
  User,
  Users,
  TrendingUp,
  TrendingDown,
  Moon,
  BatteryCharging,
  Flame,
  Zap,
  Smile,
  HeartPulse,
  Scale,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Filter,
  CheckSquare,
  Square,
  MessageCircle,
  Printer,
  ChevronDown,
  Info,
  CheckCircle2,
  X,
  Send,
  Settings,
  Sliders,
  RotateCcw,
  Search,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  LineChart,
  Sparkles
} from 'lucide-react';
import { Student, WellnessCheckin, CheckinPeriod } from '../../../types';
import { IndividualMetricChart, MetricDataPoint } from './IndividualMetricChart';
import { AnaliseAiReportCard } from './AnaliseAiReportCard';
import { SelectedChartSummary, AnaliseGlobalContext } from '../../../services/analiseAiService';

interface AnaliseViewProps {
  students: Student[];
  checkins: WellnessCheckin[];
  selectedStudentId: string;
  onSelectStudentId: (id: string) => void;
  onNavigateToCheckin: () => void;
  onNavigateToPainMap: () => void;
}

export interface StudentLoadRisk {
  studentId: string;
  studentName: string;
  monotony: number;
  strain: number;
  totalLoad: number;
  meanDailyLoad: number;
  isCriticalMonotony: boolean;
  isCriticalStrain: boolean;
  isCritical: boolean;
  criticalReasons: string[];
}

export interface ChartMetadata {
  id: string;
  label: string;
  shortLabel: string;
  category: string;
  color: string;
}

export const CHART_METADATA_LIST: ChartMetadata[] = [
  { id: 'prontidao', label: 'Prontidão Diária (%)', shortLabel: 'Prontidão (%)', category: 'Bem-Estar', color: '#10b981' },
  { id: 'sono', label: 'Qualidade do Sono (0-10)', shortLabel: 'Qualidade Sono', category: 'Bem-Estar', color: '#6366f1' },
  { id: 'sono_horas', label: 'Horas Dormidas por Noite (h)', shortLabel: 'Horas Sono', category: 'Bem-Estar', color: '#4f46e5' },
  { id: 'despertares', label: 'Despertares Noturnos (qtd)', shortLabel: 'Despertares', category: 'Bem-Estar', color: '#8b5cf6' },
  { id: 'pse', label: 'PSE Fadiga da Sessão (0-10)', shortLabel: 'PSE Fadiga', category: 'Treino', color: '#f59e0b' },
  { id: 'eva', label: 'EVA Dor Muscular Tardia (0-10)', shortLabel: 'EVA Dor', category: 'Dor & Lesão', color: '#ef4444' },
  { id: 'estresse', label: 'Estresse Mental & Cognitivo (0-10)', shortLabel: 'Estresse Mental', category: 'Bem-Estar', color: '#0ea5e9' },
  { id: 'humor', label: 'Humor & Disposição (0-10)', shortLabel: 'Humor & Disposição', category: 'Bem-Estar', color: '#14b8a6' },
  { id: 'psr', label: 'PSR Recuperação Subjetiva (0-10)', shortLabel: 'PSR Recovery', category: 'Recuperação', color: '#3b82f6' },
  { id: 'carga', label: 'Carga Foster da Sessão (UA)', shortLabel: 'Carga Foster (UA)', category: 'Carga', color: '#a855f7' },
  { id: 'duracao', label: 'Duração do Treino (min)', shortLabel: 'Duração Treino', category: 'Treino', color: '#3b82f6' },
  { id: 'hooper', label: 'Índice Hooper Consolidado (pts)', shortLabel: 'Índice Hooper', category: 'Recuperação', color: '#ec4899' },
  { id: 'salto_cmj', label: 'Salto CMJ - Pliometria (cm)', shortLabel: 'Salto CMJ', category: 'Performance', color: '#06b6d4' },
  { id: 'peso', label: 'Balanço Hídrico / Perda de Peso (kg)', shortLabel: 'Balanço Hídrico', category: 'Fisiologia', color: '#64748b' },
  { id: 'peso_atual', label: 'Peso Corporal da Sessão (kg)', shortLabel: 'Peso Atual', category: 'Fisiologia', color: '#0284c7' },
  { id: 'hidratacao', label: 'Hidratação Diária Ingerida (L)', shortLabel: 'Hidratação (L)', category: 'Fisiologia', color: '#0284c7' },
  { id: 'pontos_dor', label: 'Pontos de Dor no Mapa Anatômico', shortLabel: 'Pontos de Dor', category: 'Dor & Lesão', color: '#dc2626' },
  { id: 'acwr', label: 'Razão ACWR (Agudo:Crônico)', shortLabel: 'Razão ACWR', category: 'Carga Científica', color: '#059669' },
  { id: 'strain', label: 'Strain (Estresse Acumulado AU)', shortLabel: 'Strain (AU)', category: 'Carga Científica', color: '#9333ea' },
  { id: 'monotonia', label: 'Índice de Monotonia (Foster)', shortLabel: 'Monotonia', category: 'Carga Científica', color: '#d97706' },
];

export const AnaliseView: React.FC<AnaliseViewProps> = ({
  students,
  checkins,
  selectedStudentId,
  onSelectStudentId,
  onNavigateToCheckin,
  onNavigateToPainMap
}) => {
  // Multi-select filters state
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([selectedStudentId]);
  const [selectedPeriods, setSelectedPeriods] = useState<CheckinPeriod[]>(['manha', 'tarde', 'noite']);
  const [dateRangeFilter, setDateRangeFilter] = useState<'7d' | '14d' | '28d' | 'todos' | 'custom'>('14d');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [showStudentDropdown, setShowStudentDropdown] = useState<boolean>(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState<boolean>(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState<boolean>(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState<string>('');
  
  // Chart Selection and Filter State
  const [selectedChartIds, setSelectedChartIds] = useState<string[]>(() => CHART_METADATA_LIST.map(c => c.id));
  const [showChartDropdown, setShowChartDropdown] = useState<boolean>(false);
  const [chartSearchTerm, setChartSearchTerm] = useState<string>('');
  const [selectedExpandedChartId, setSelectedExpandedChartId] = useState<string | null>(null);
  const [globalChartType, setGlobalChartType] = useState<'line' | 'bar'>('line');
  const [chartTypeOverrides, setChartTypeOverrides] = useState<Record<string, 'line' | 'bar'>>({});
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [modalCheckinTarget, setModalCheckinTarget] = useState<WellnessCheckin | null>(null);
  const [showCriticalStudentsModal, setShowCriticalStudentsModal] = useState(false);

  // Critical Alert Settings State (Configurable Thresholds)
  const [criticalMonotonyThreshold, setCriticalMonotonyThreshold] = useState<number>(() => {
    const saved = localStorage.getItem('glfit_critical_monotony');
    return saved ? parseFloat(saved) : 2.0;
  });

  const [criticalStrainThreshold, setCriticalStrainThreshold] = useState<number>(() => {
    const saved = localStorage.getItem('glfit_critical_strain');
    return saved ? parseInt(saved, 10) : 6000;
  });

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempMonotonyThreshold, setTempMonotonyThreshold] = useState<number>(criticalMonotonyThreshold);
  const [tempStrainThreshold, setTempStrainThreshold] = useState<number>(criticalStrainThreshold);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Sync temp values when opening settings modal
  useEffect(() => {
    if (showSettingsModal) {
      setTempMonotonyThreshold(criticalMonotonyThreshold);
      setTempStrainThreshold(criticalStrainThreshold);
    }
  }, [showSettingsModal, criticalMonotonyThreshold, criticalStrainThreshold]);

  // Save settings handler
  const handleSaveSettings = () => {
    setCriticalMonotonyThreshold(tempMonotonyThreshold);
    setCriticalStrainThreshold(tempStrainThreshold);
    localStorage.setItem('glfit_critical_monotony', tempMonotonyThreshold.toString());
    localStorage.setItem('glfit_critical_strain', tempStrainThreshold.toString());
    setShowSettingsModal(false);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  const handleResetSettings = () => {
    setTempMonotonyThreshold(2.0);
    setTempStrainThreshold(6000);
  };

  // Toggle student selection
  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(sId => sId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAllStudents = () => {
    setSelectedStudentIds(students.map(s => s.id));
  };

  // Toggle period selection
  const handleTogglePeriod = (period: CheckinPeriod) => {
    setSelectedPeriods(prev => {
      if (prev.includes(period)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(p => p !== period);
      } else {
        return [...prev, period];
      }
    });
  };

  // 1. Calculate Individual Risk for All Students (to flag Monotony & Strain in red)
  const studentRiskMap = useMemo<Map<string, StudentLoadRisk>>(() => {
    const map = new Map<string, StudentLoadRisk>();

    students.forEach(std => {
      const stdCheckins = checkins.filter(c => c.studentId === std.id);
      if (stdCheckins.length === 0) return;

      const loads = stdCheckins.map(c => c.pse * (c.trainingDurationMinutes || 60));
      const totalLoad = loads.reduce((a, b) => a + b, 0);
      const count = loads.length;
      const mean = Math.round(totalLoad / count);

      const variance = loads.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / count;
      const stdDev = Math.sqrt(variance) || 1;
      const monotony = Number((mean / stdDev).toFixed(2));
      const strain = Math.round(totalLoad * monotony);

      const isCriticalMonotony = monotony >= criticalMonotonyThreshold;
      const isCriticalStrain = strain >= criticalStrainThreshold;
      const isCritical = isCriticalMonotony || isCriticalStrain;
      const criticalReasons: string[] = [];

      if (isCriticalMonotony) {
        criticalReasons.push(`Monotonia: ${monotony} (≥ ${criticalMonotonyThreshold.toFixed(1)})`);
      }
      if (isCriticalStrain) {
        criticalReasons.push(`Strain: ${strain.toLocaleString('pt-BR')} AU (≥ ${criticalStrainThreshold.toLocaleString('pt-BR')} AU)`);
      }

      map.set(std.id, {
        studentId: std.id,
        studentName: std.name,
        monotony,
        strain,
        totalLoad,
        meanDailyLoad: mean,
        isCriticalMonotony,
        isCriticalStrain,
        isCritical,
        criticalReasons
      });
    });

    return map;
  }, [students, checkins, criticalMonotonyThreshold, criticalStrainThreshold]);

  // List of students with critical risk
  const criticalStudents = useMemo<StudentLoadRisk[]>(() => {
    const list: StudentLoadRisk[] = [];
    studentRiskMap.forEach((risk) => {
      if (risk.isCritical) {
        list.push(risk);
      }
    });
    return list;
  }, [studentRiskMap]);

  // Filtered checkins
  const filteredCheckins = useMemo(() => {
    return checkins.filter(chk => {
      // Student filter
      if (!selectedStudentIds.includes(chk.studentId)) return false;
      // Period filter
      if (!selectedPeriods.includes(chk.period)) return false;
      // Date filter
      if (dateRangeFilter === '7d' || dateRangeFilter === '14d' || dateRangeFilter === '28d') {
        const days = dateRangeFilter === '7d' ? 7 : dateRangeFilter === '14d' ? 14 : 28;
        const maxCheckinDate = checkins.reduce((max, c) => (c.date > max ? c.date : max), '2026-09-28');
        const refDate = new Date(`${maxCheckinDate}T12:00:00`);
        const checkinDate = new Date(`${chk.date}T12:00:00`);
        const diffDays = Math.round((refDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > days || diffDays < 0) return false;
      } else if (dateRangeFilter === 'custom' || customStartDate || customEndDate) {
        if (customStartDate && chk.date < customStartDate) return false;
        if (customEndDate && chk.date > customEndDate) return false;
      }
      return true;
    }).sort((a, b) => new Date(`${b.date}T${b.time || '12:00'}`).getTime() - new Date(`${a.date}T${a.time || '12:00'}`).getTime());
  }, [checkins, selectedStudentIds, selectedPeriods, dateRangeFilter, customStartDate, customEndDate]);

  // Latest checkin for quick response cards
  const latestCheckin = filteredCheckins[0] || checkins.find(c => c.studentId === selectedStudentId) || checkins[0] || null;

  // Science calculations for current filtered view (ACWR, Monotonia, Strain, Recovery)
  const trainingMetrics = useMemo(() => {
    const sessionLoads = filteredCheckins.map(c => ({
      date: c.date,
      load: c.pse * (c.trainingDurationMinutes || 60),
      recovery: c.psr,
      studentId: c.studentId,
      studentName: c.studentName
    }));

    const totalLoad = sessionLoads.reduce((acc, curr) => acc + curr.load, 0);
    const count = sessionLoads.length || 1;
    const meanDailyLoad = Math.round(totalLoad / count);

    const variance = sessionLoads.reduce((acc, curr) => acc + Math.pow(curr.load - meanDailyLoad, 2), 0) / count;
    const stdDev = Math.sqrt(variance) || 1;

    const monotony = Number((meanDailyLoad / stdDev).toFixed(2));
    const strain = Math.round(totalLoad * monotony);

    const acuteLoads = sessionLoads.slice(0, 7);
    const acuteSum = acuteLoads.reduce((acc, curr) => acc + curr.load, 0);
    const acuteWorkload = acuteLoads.length > 0 ? Math.round(acuteSum / acuteLoads.length) : meanDailyLoad;

    const chronicWorkload = Math.max(100, Math.round(meanDailyLoad * 0.95));
    const acwr = Number((acuteWorkload / chronicWorkload).toFixed(2));

    const acwrStatus: 'subtreinamento' | 'otimo' | 'atencao' | 'perigo' = 
      acwr < 0.8 ? 'subtreinamento' :
      acwr <= 1.3 ? 'otimo' :
      acwr <= 1.5 ? 'atencao' : 'perigo';

    const avgRecovery = Number((filteredCheckins.reduce((acc, c) => acc + c.psr, 0) / count).toFixed(1));

    // Check if current filtered group exceeds critical thresholds
    const isMonotonyCritical = monotony >= criticalMonotonyThreshold;
    const isStrainCritical = strain >= criticalStrainThreshold;

    return {
      sessionLoads,
      totalLoad,
      meanDailyLoad,
      monotony,
      strain,
      acuteWorkload,
      chronicWorkload,
      acwr,
      acwrStatus,
      avgRecovery,
      isMonotonyCritical,
      isStrainCritical
    };
  }, [filteredCheckins, criticalMonotonyThreshold, criticalStrainThreshold]);

  // Chronological checkins sorted from earliest to latest for time-series charts
  const chronologicalCheckins = useMemo(() => {
    return [...filteredCheckins].sort((a, b) => 
      new Date(`${a.date}T${a.time || '12:00'}`).getTime() - new Date(`${b.date}T${b.time || '12:00'}`).getTime()
    );
  }, [filteredCheckins]);

  const getChartType = (id: string): 'line' | 'bar' => {
    return chartTypeOverrides[id] || globalChartType;
  };

  const handleToggleChartType = (id: string) => {
    setChartTypeOverrides(prev => {
      const current = prev[id] || globalChartType;
      return {
        ...prev,
        [id]: current === 'line' ? 'bar' : 'line'
      };
    });
  };

  const allChartOrder = useMemo(() => CHART_METADATA_LIST.map(c => c.id), []);

  const handleToggleChart = (id: string) => {
    setSelectedChartIds(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Mantém pelo menos um gráfico selecionado
        return prev.filter(cId => cId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAllCharts = () => {
    setSelectedChartIds(allChartOrder);
    setSelectedExpandedChartId(null);
  };

  const handleClearCharts = () => {
    setSelectedChartIds(['prontidao']);
    setSelectedExpandedChartId(null);
  };

  const handleNavigateChart = (direction: 'prev' | 'next') => {
    if (!selectedExpandedChartId) return;
    const currentList = selectedChartIds.length > 0 ? selectedChartIds : allChartOrder;
    const currentIndex = currentList.indexOf(selectedExpandedChartId);
    if (currentIndex === -1) {
      setSelectedExpandedChartId(currentList[0] || 'prontidao');
      return;
    }
    const nextIndex = direction === 'next'
      ? (currentIndex + 1) % currentList.length
      : (currentIndex - 1 + currentList.length) % currentList.length;
    setSelectedExpandedChartId(currentList[nextIndex]);
  };

  // 12 Individual Questionnaire Metric Definitions
  const individualMetricConfigs = useMemo(() => {
    return [
      {
        id: 'prontidao',
        title: 'Prontidão Diária (Readiness Score)',
        subtitle: 'Índice integrado de aptidão e tolerância biológica a cargas',
        unit: '%',
        color: '#059669',
        accentBg: 'bg-emerald-50 text-emerald-800',
        minScale: 0,
        maxScale: 100,
        idealZone: { min: 80, max: 100, label: 'Zona Ótima (≥80%)' },
        dangerZone: { min: 0, max: 59, label: 'Alerta Vermelho (<60%)' },
        isInverse: false,
        clinicalNotes: 'Readiness avalia o equilíbrio autonômico e neuromuscular. Escore ≥ 80% indica plena capacidade para sessões de alta intensidade neuromuscular.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.readinessScore,
          notes: c.notes
        }))
      },
      {
        id: 'sono',
        title: 'Qualidade do Sono & Horas Dormidas',
        subtitle: 'Avaliação subjetiva da qualidade (0-10) e duração do sono',
        unit: '0-10',
        color: '#4f46e5',
        accentBg: 'bg-indigo-50 text-indigo-800',
        minScale: 0,
        maxScale: 10,
        idealZone: { min: 7, max: 10, label: 'Sono Reparador (≥7)' },
        dangerZone: { min: 0, max: 4, label: 'Déficit de Sono (≤4)' },
        isInverse: false,
        clinicalNotes: 'O sono profundo e o sono REM restauram a excitabilidade das placas motoras e regulam o GH. Sono deficiente reduz a força máxima em até 12%.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.sleepQuality,
          secondaryValue: c.sleepHours,
          secondaryLabel: 'Horas',
          notes: `${c.sleepHours}h dormidas, ${c.sleepDisruptions || 0} despertares`
        }))
      },
      {
        id: 'pse',
        title: 'PSE - Percepção Subjetiva de Esforço (Fadiga)',
        subtitle: 'Nível de fadiga e desgaste físico percebido (Escala CR-10 de Borg)',
        unit: '0-10',
        color: '#d97706',
        accentBg: 'bg-amber-50 text-amber-800',
        minScale: 0,
        maxScale: 10,
        idealZone: { min: 2, max: 5, label: 'Fadiga Adequada (2-5)' },
        dangerZone: { min: 8, max: 10, label: 'Fadiga Crítica (≥8)' },
        isInverse: true,
        clinicalNotes: 'Fadiga percebida sustentada em níveis altos (PSE ≥ 8) sem descanso proporcional aumenta exponencialmente o risco de lesão muscular.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.pse,
          notes: c.notes
        }))
      },
      {
        id: 'eva',
        title: 'EVA - Dor Muscular & Articular',
        subtitle: 'Escala Visual Analógica de Dor Muscular Tardia (DOMS) ou dor localizada',
        unit: '0-10',
        color: '#e11d48',
        accentBg: 'bg-rose-50 text-rose-800',
        minScale: 0,
        maxScale: 10,
        idealZone: { min: 0, max: 3, label: 'Sem Dor Significativa (0-3)' },
        dangerZone: { min: 6, max: 10, label: 'Dor Aguda / Risco (≥6)' },
        isInverse: true,
        clinicalNotes: 'Dores musculares tardias são fisiológicas até EVA 4-5. Pontuações ≥ 6 em articulações ou tendões contraindicam a sobrecarga mecânica na região.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.eva,
          notes: c.painPoints?.map(p => `${p.region} (${p.painScale}/10)`).join(', ') || c.notes
        }))
      },
      {
        id: 'estresse',
        title: 'Nível de Estresse Mental & Cognitivo',
        subtitle: 'Pressões da rotina, trabalho, estudos e cansaço mental diário',
        unit: '0-10',
        color: '#0284c7',
        accentBg: 'bg-sky-50 text-sky-800',
        minScale: 0,
        maxScale: 10,
        idealZone: { min: 0, max: 3, label: 'Baixo Estresse (0-3)' },
        dangerZone: { min: 7, max: 10, label: 'Estresse Crítico (≥7)' },
        isInverse: true,
        clinicalNotes: 'O estresse psicológico mobiliza recursos energéticos similares ao esforço físico, reduzindo a imunidade e atrasando a recomposição de glicogênio.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.stressLevel,
          notes: c.notes
        }))
      },
      {
        id: 'humor',
        title: 'Estado de Humor & Disposição',
        subtitle: 'Entusiasmo, motivação e estado emocional pré-sessão',
        unit: '0-10',
        color: '#10b981',
        accentBg: 'bg-emerald-50 text-emerald-800',
        minScale: 0,
        maxScale: 10,
        idealZone: { min: 7, max: 10, label: 'Alta Disposição (≥7)' },
        dangerZone: { min: 0, max: 4, label: 'Baixa Disposição (≤4)' },
        isInverse: false,
        clinicalNotes: 'A disposição e o humor são termômetros fidedignos de prontidão mental. Dias com humor baixo exigem estratégias de engajamento lúdico ou treinos mais curtos.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.moodState,
          notes: c.notes
        }))
      },
      {
        id: 'psr',
        title: 'PSR - Percepção de Recuperação',
        subtitle: 'Capacidade de regeneração e resposta adaptativa percebida',
        unit: '0-10',
        color: '#2563eb',
        accentBg: 'bg-blue-50 text-blue-800',
        minScale: 0,
        maxScale: 10,
        idealZone: { min: 7, max: 10, label: 'Totalmente Recuperado (≥7)' },
        dangerZone: { min: 0, max: 4, label: 'Recuperação Insuficiente (≤4)' },
        isInverse: false,
        clinicalNotes: 'A escala PSR avalia a prontidão celular. PSR ≥ 8 viabiliza treinos de potência e hipertrofia com cargas máximas.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.psr,
          notes: c.notes
        }))
      },
      {
        id: 'carga',
        title: 'Carga da Sessão (Foster Load = PSE × Duração)',
        subtitle: 'Volume interno de treino em Unidades Arbitrárias (UA)',
        unit: 'UA',
        color: '#7c3aed',
        accentBg: 'bg-purple-50 text-purple-800',
        minScale: 0,
        maxScale: 1000,
        idealZone: { min: 250, max: 600, label: 'Faixa Recomendada (250-600 UA)' },
        dangerZone: { min: 750, max: 1200, label: 'Sobrecarga Severa (≥750 UA)' },
        isInverse: false,
        clinicalNotes: 'O método da Carga da Sessão (Foster, 2001) integra duração e intensidade. Picos isolados acima de 800 UA necessitam de compensação regenerativa no dia seguinte.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.pse * (c.trainingDurationMinutes || 60),
          secondaryValue: c.trainingDurationMinutes || 60,
          secondaryLabel: 'Duração (min)',
          notes: `${c.trainingDurationMinutes || 60} min a PSE ${c.pse}`
        }))
      },
      {
        id: 'hooper',
        title: 'Índice de Hooper (Soma de Bem-Estar)',
        subtitle: 'Soma dos 4 pilares: Sono + Fadiga + Dor Muscular + Estresse (4 a 28)',
        unit: 'pts',
        color: '#c026d3',
        accentBg: 'bg-fuchsia-50 text-fuchsia-800',
        minScale: 4,
        maxScale: 35,
        idealZone: { min: 4, max: 14, label: 'Excelente Bem-Estar (≤14)' },
        dangerZone: { min: 22, max: 35, label: 'Risco de Estafa (≥22)' },
        isInverse: true,
        clinicalNotes: 'O índice de Hooper sintetiza a homeostase global do aluno. Valores acima de 22 alertam para redução de volume em até 30%.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.hooperIndex,
          notes: `Sono: ${c.sleepQuality}, Fadiga: ${c.pse}, Dor: ${c.eva}, Estresse: ${c.stressLevel}`
        }))
      },
      {
        id: 'salto_cmj',
        title: 'Salto Vertical CMJ (Fadiga Neuromuscular)',
        subtitle: 'Altura do salto contramovimento pré vs pós-treino (cm)',
        unit: 'cm',
        color: '#0d9488',
        accentBg: 'bg-teal-50 text-teal-800',
        minScale: 20,
        maxScale: 50,
        idealZone: { min: 38, max: 50, label: 'Potência Preservada (≥38cm)' },
        dangerZone: { min: 20, max: 32, label: 'Fadiga de Fibras Rápidas (<33cm)' },
        isInverse: false,
        clinicalNotes: 'A diminuição da altura do salto reflete a inibição autogênica de fuso muscular e fadiga periférica nas fibras de contração rápida.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.jumpCmjPost || c.jumpCmjPre || 38,
          secondaryValue: c.jumpCmjPre,
          secondaryLabel: 'Pré',
          notes: c.jumpCmjPre && c.jumpCmjPost ? `Pré: ${c.jumpCmjPre}cm | Pós: ${c.jumpCmjPost}cm (Diferença: ${(c.jumpCmjPost - c.jumpCmjPre).toFixed(1)}cm)` : undefined
        }))
      },
      {
        id: 'peso',
        title: 'Variação de Peso Corporal & Perda Hídrica',
        subtitle: 'Diferença entre peso pré e pós-sessão de treino (kg de desidratação)',
        unit: 'kg',
        color: '#ea580c',
        accentBg: 'bg-orange-50 text-orange-800',
        minScale: 0,
        maxScale: 2.5,
        idealZone: { min: 0, max: 0.8, label: 'Perda Moderada (≤0.8kg)' },
        dangerZone: { min: 1.5, max: 3.0, label: 'Desidratação Severa (≥1.5kg)' },
        isInverse: true,
        clinicalNotes: 'Perdas hídricas superiores a 1.5kg exigem reidratação imediata com água e eletrólitos na proporção de 150% do peso perdido.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.weightPre && c.weightPost ? Number(Math.max(0, c.weightPre - c.weightPost).toFixed(2)) : 0.6,
          secondaryValue: c.weightPost || c.weightPre,
          secondaryLabel: 'Peso Atual',
          notes: c.weightPre && c.weightPost ? `Pré: ${c.weightPre}kg | Pós: ${c.weightPost}kg` : undefined
        }))
      },
      {
        id: 'hidratacao',
        title: 'Hidratação Diária Relatada',
        subtitle: 'Volume de água ingerido diariamente (Litros)',
        unit: 'L',
        color: '#0284c7',
        accentBg: 'bg-sky-50 text-sky-800',
        minScale: 0,
        maxScale: 5.0,
        idealZone: { min: 2.5, max: 5.0, label: 'Hidratação Adequada (≥2.5L)' },
        dangerZone: { min: 0, max: 1.5, label: 'Baixa Ingestão (≤1.5L)' },
        isInverse: false,
        clinicalNotes: 'A hidratação otimiza o volume plasmático e previne a sobrecarga térmica e cardiovascular durante o treino.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.hydrationLiters || 2.8,
          notes: `${c.hydrationLiters || 2.8} litros relatados`
        }))
      },
      {
        id: 'sono_horas',
        title: 'Horas Dormidas por Noite',
        subtitle: 'Duração absoluta do sono reparador em horas',
        unit: 'horas',
        color: '#6366f1',
        accentBg: 'bg-indigo-50 text-indigo-800',
        minScale: 4,
        maxScale: 12,
        idealZone: { min: 7.5, max: 10, label: 'Ideal (≥7.5h)' },
        dangerZone: { min: 4, max: 6, label: 'Sono Insuficiente (≤6h)' },
        isInverse: false,
        clinicalNotes: 'A privação de sono crônica (≤6h) compromete a síntese de proteínas musculares, aumenta os níveis de cortisol e dobra o risco de lesões musculoesqueléticas.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.sleepHours || 7,
          notes: `${c.sleepHours || 7}h dormidas, ${c.sleepDisruptions || 0} despertares`
        }))
      },
      {
        id: 'despertares',
        title: 'Despertares Noturnos (Fragmentação do Sono)',
        subtitle: 'Quantidade de vezes que o aluno acordou durante a noite',
        unit: 'vezes',
        color: '#8b5cf6',
        accentBg: 'bg-purple-50 text-purple-800',
        minScale: 0,
        maxScale: 6,
        idealZone: { min: 0, max: 1, label: 'Sono Contínuo (0-1)' },
        dangerZone: { min: 3, max: 6, label: 'Sono Fragmentado (≥3)' },
        isInverse: true,
        clinicalNotes: 'Múltiplos despertares impedem a transição adequada para as fases de ondas lentas (N3) e sono REM, atrasando a liberação pulsátil de GH.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.sleepDisruptions || 0,
          notes: `${c.sleepDisruptions || 0} despertares noturnos relatados`
        }))
      },
      {
        id: 'duracao',
        title: 'Duração da Sessão de Treino',
        subtitle: 'Tempo total dedicado ao treino em minutos',
        unit: 'min',
        color: '#0ea5e9',
        accentBg: 'bg-sky-50 text-sky-800',
        minScale: 20,
        maxScale: 120,
        idealZone: { min: 45, max: 75, label: 'Volume Otimizado (45-75 min)' },
        dangerZone: { min: 90, max: 120, label: 'Sessão Excessivamente Longa (≥90 min)' },
        isInverse: false,
        clinicalNotes: 'Sessões com mais de 75-90 minutos de alta intensidade aumentam o desgaste articular e o catabolismo muscular.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.trainingDurationMinutes || 60,
          notes: `${c.trainingDurationMinutes || 60} minutos de treino`
        }))
      },
      {
        id: 'peso_atual',
        title: 'Peso Corporal Pós-Treino',
        subtitle: 'Massa corporal aferida após a conclusão da sessão de treino (kg)',
        unit: 'kg',
        color: '#f97316',
        accentBg: 'bg-orange-50 text-orange-800',
        minScale: 50,
        maxScale: 100,
        isInverse: false,
        clinicalNotes: 'O monitoramento longitudinal de peso corporal identifica flutuações hídricas agudas e tendências crônicas de composição corporal.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.weightPost || c.weightPre || 75.0,
          notes: `Peso: ${c.weightPost || c.weightPre || 75.0} kg`
        }))
      },
      {
        id: 'pontos_dor',
        title: 'Pontos de Dor Mapeados no Boneco Anatômico',
        subtitle: 'Total de regiões corporais com dor muscular tardia ou articular registradas',
        unit: 'regiões',
        color: '#dc2626',
        accentBg: 'bg-rose-50 text-rose-800',
        minScale: 0,
        maxScale: 6,
        idealZone: { min: 0, max: 1, label: 'Livre de Dores (0-1)' },
        dangerZone: { min: 3, max: 8, label: 'Múltiplas Dores (≥3 regiões)' },
        isInverse: true,
        clinicalNotes: 'A presença concomitante de dor em 3 ou mais regiões do corpo sinaliza sobrecarga sistêmica ou recuperação mecânica inadequada.',
        dataPoints: chronologicalCheckins.map(c => ({
          date: c.date,
          formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
          period: c.period,
          studentName: c.studentName,
          value: c.painPoints?.length || 0,
          notes: c.painPoints?.map(p => `${p.region} (${p.painScale}/10)`).join(', ') || 'Nenhum ponto de dor'
        }))
      },
      {
        id: 'acwr',
        title: 'Índice ACWR (Razão Carga Aguda : Carga Crônica)',
        subtitle: 'Equilíbrio entre a carga dos últimos 7 dias e a média crônica do período',
        unit: 'razão',
        color: '#2563eb',
        accentBg: 'bg-blue-50 text-blue-800',
        minScale: 0.5,
        maxScale: 2.0,
        idealZone: { min: 0.8, max: 1.3, label: 'Sweet Spot (0.8 - 1.3)' },
        dangerZone: { min: 1.5, max: 2.2, label: 'Danger Zone (>1.5)' },
        isInverse: false,
        clinicalNotes: 'Gabbett (2016): ACWR entre 0.8 e 1.3 reduz o risco de lesões para menos de 5%. Índices acima de 1.5 quadruplicam o risco de lesões de tecidos moles.',
        dataPoints: chronologicalCheckins.map((c, idx) => {
          const sliceLoads = chronologicalCheckins.slice(0, idx + 1).map(x => x.pse * (x.trainingDurationMinutes || 60));
          const totalSlice = sliceLoads.reduce((a, b) => a + b, 0);
          const meanSlice = totalSlice / sliceLoads.length;
          const acuteSlice = sliceLoads.slice(-7);
          const acuteMean = acuteSlice.reduce((a, b) => a + b, 0) / acuteSlice.length;
          const chronicMean = Math.max(100, meanSlice * 0.95);
          const ratio = Number((acuteMean / chronicMean).toFixed(2));
          return {
            date: c.date,
            formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
            period: c.period,
            studentName: c.studentName,
            value: ratio,
            notes: `ACWR: ${ratio} • Carga Aguda: ${Math.round(acuteMean)} UA`
          };
        })
      },
      {
        id: 'strain',
        title: 'Strain de Foster (Estresse Acumulado)',
        subtitle: 'Volume total de carga multiplicado pela monotonia de treinamento',
        unit: 'AU',
        color: '#9333ea',
        accentBg: 'bg-purple-50 text-purple-800',
        minScale: 1000,
        maxScale: 8000,
        idealZone: { min: 2000, max: 4500, label: 'Faixa Segura (<5000 AU)' },
        dangerZone: { min: 6000, max: 10000, label: 'Estresse Crítico (≥6000 AU)' },
        isInverse: true,
        clinicalNotes: 'Strain acima de 6000 AU sem descanso correspondente correlaciona-se com quadros de síndrome de overtraining.',
        dataPoints: chronologicalCheckins.map((c, idx) => {
          const sliceLoads = chronologicalCheckins.slice(0, idx + 1).map(x => x.pse * (x.trainingDurationMinutes || 60));
          const totalSlice = sliceLoads.reduce((a, b) => a + b, 0);
          const meanSlice = totalSlice / sliceLoads.length;
          const varianceSlice = sliceLoads.reduce((a, b) => a + Math.pow(b - meanSlice, 2), 0) / sliceLoads.length;
          const stdDevSlice = Math.sqrt(varianceSlice) || 1;
          const monotonySlice = Number((meanSlice / stdDevSlice).toFixed(2));
          const strainVal = Math.round(totalSlice * monotonySlice);
          return {
            date: c.date,
            formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
            period: c.period,
            studentName: c.studentName,
            value: strainVal,
            notes: `Strain: ${strainVal} AU • Monotonia: ${monotonySlice}`
          };
        })
      },
      {
        id: 'monotonia',
        title: 'Índice de Monotonia de Treinamento',
        subtitle: 'Razão entre a carga média diária e o desvio-padrão (Foster, 1998)',
        unit: 'índice',
        color: '#f59e0b',
        accentBg: 'bg-amber-50 text-amber-800',
        minScale: 0.8,
        maxScale: 3.0,
        idealZone: { min: 0.8, max: 1.5, label: 'Excelente Ondulação (<1.5)' },
        dangerZone: { min: 2.0, max: 3.5, label: 'Monótono / Risco (≥2.0)' },
        isInverse: true,
        clinicalNotes: 'Monotonia acima de 2.0 indica repetição de estímulos sem dias regenerativos, aumentando o risco de estagnação e estresse crônico.',
        dataPoints: chronologicalCheckins.map((c, idx) => {
          const sliceLoads = chronologicalCheckins.slice(0, idx + 1).map(x => x.pse * (x.trainingDurationMinutes || 60));
          const totalSlice = sliceLoads.reduce((a, b) => a + b, 0);
          const meanSlice = totalSlice / sliceLoads.length;
          const varianceSlice = sliceLoads.reduce((a, b) => a + Math.pow(b - meanSlice, 2), 0) / sliceLoads.length;
          const stdDevSlice = Math.sqrt(varianceSlice) || 1;
          const monotonyVal = Number((meanSlice / stdDevSlice).toFixed(2));
          return {
            date: c.date,
            formattedDate: c.date.split('-').reverse().slice(0, 2).join('/'),
            period: c.period,
            studentName: c.studentName,
            value: monotonyVal,
            notes: `Monotonia: ${monotonyVal} • Média: ${Math.round(meanSlice)} UA`
          };
        })
      }
    ];
  }, [chronologicalCheckins]);

  // Prepara os dados consolidados estritamente dos gráficos selecionados para consumo da IA
  const selectedChartSummaries = useMemo<SelectedChartSummary[]>(() => {
    return individualMetricConfigs
      .filter(m => selectedChartIds.includes(m.id))
      .map(metric => {
        const values = metric.dataPoints.map(p => p.value);
        const count = values.length;
        const latestPoint = count > 0 ? metric.dataPoints[count - 1] : null;
        const firstPoint = count > 0 ? metric.dataPoints[0] : null;

        const currentVal = latestPoint ? latestPoint.value : 0;
        const initialVal = firstPoint ? firstPoint.value : 0;
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = count > 0 ? Number((sum / count).toFixed(1)) : 0;
        const maxVal = count > 0 ? Math.max(...values) : 0;
        const minVal = count > 0 ? Math.min(...values) : 0;
        const diff = currentVal - initialVal;
        const pctChange = initialVal !== 0 ? Math.round((diff / initialVal) * 100) : (diff > 0 ? 100 : 0);

        const isInverse = !!metric.isInverse;
        const isFavorable = isInverse ? diff < 0 : diff > 0;
        const status: 'otimo' | 'atencao' | 'alerta' = Math.abs(pctChange) < 5 ? 'otimo' : isFavorable ? 'otimo' : 'alerta';

        const meta = CHART_METADATA_LIST.find(c => c.id === metric.id);

        return {
          id: metric.id,
          title: metric.title,
          subtitle: metric.subtitle,
          unit: metric.unit,
          color: metric.color,
          category: meta?.category || 'Questionário',
          pointsCount: count,
          initialValue: initialVal,
          currentValue: currentVal,
          diff,
          pctChange,
          avg,
          min: minVal,
          max: maxVal,
          isInverse,
          status,
          recentValues: metric.dataPoints.slice(-5).map(p => ({
            date: p.date,
            period: p.period,
            studentName: p.studentName,
            value: p.value
          }))
        };
      });
  }, [individualMetricConfigs, selectedChartIds]);

  // Contexto global filtrado para alimentar o laudo da IA
  const analiseGlobalContext = useMemo<AnaliseGlobalContext>(() => {
    const periodLabel = dateRangeFilter === '7d' ? 'Últimos 7 dias' :
      dateRangeFilter === '14d' ? 'Últimos 14 dias' :
      dateRangeFilter === '28d' ? 'Últimos 28 dias' :
      dateRangeFilter === 'todos' ? 'Todo o Período' :
      customStartDate && customEndDate ? `${customStartDate} até ${customEndDate}` : 'Intervalo Personalizado';

    return {
      studentsCount: selectedStudentIds.length,
      studentsNames: students.filter(s => selectedStudentIds.includes(s.id)).map(s => s.name),
      periodLabel,
      totalCheckins: chronologicalCheckins.length,
      criticalStudentsCount: criticalStudents.length,
      monotony: trainingMetrics.monotony,
      strain: trainingMetrics.strain,
      acwr: trainingMetrics.acwr
    };
  }, [selectedStudentIds, students, dateRangeFilter, customStartDate, customEndDate, chronologicalCheckins.length, criticalStudents.length, trainingMetrics]);

  // Generate WhatsApp Message
  const generateWhatsAppMessage = (chk: WellnessCheckin) => {
    const periodLabel = chk.period === 'manha' ? 'Manhã' : chk.period === 'tarde' ? 'Tarde' : 'Noite';
    const dateFormatted = new Date(`${chk.date}T12:00:00`).toLocaleDateString('pt-BR');
    const sessionLoad = chk.pse * (chk.trainingDurationMinutes || 60);

    const studentRisk = studentRiskMap.get(chk.studentId);
    const isCritical = studentRisk?.isCritical;

    return `*GL PRO FIT • ANÁLISE DE PRONTIDÃO & CARGA* 📋🩺\n\n` +
      `Olá, *${chk.studentName.split(' ')[0]}*! Confira sua análise de resposta do treino de *${dateFormatted}* (${periodLabel}):\n\n` +
      `📊 *STATUS GERAL:* ${chk.readinessScore}% - ${
        chk.readinessStatus === 'otimo' ? '🟢 ÓTIMO' :
        chk.readinessStatus === 'moderado' ? '🟡 MODERADO' : '🔴 ALERTA'
      }\n` +
      `• *Qualidade do Sono:* ${chk.sleepQuality}/10 (${chk.sleepHours}h)\n` +
      `• *PSE (Fadiga):* ${chk.pse}/10\n` +
      `• *EVA (Dor Muscular):* ${chk.eva}/10\n` +
      `• *PSR (Recovery):* ${chk.psr}/10\n` +
      `• *Duração do Treino:* ${chk.trainingDurationMinutes || 60} min (Carga: ${sessionLoad} AU)\n` +
      `• *Índice ACWR:* ${trainingMetrics.acwr} (${trainingMetrics.acwrStatus.toUpperCase()})\n` +
      (studentRisk ? `• *Monotonia:* ${studentRisk.monotony} ${studentRisk.isCriticalMonotony ? '🚨 (CRÍTICO)' : ''}\n` : '') +
      (studentRisk ? `• *Strain Acumulado:* ${studentRisk.strain.toLocaleString('pt-BR')} AU ${studentRisk.isCriticalStrain ? '🚨 (CRÍTICO)' : ''}\n` : '') +
      (chk.weightPre && chk.weightPost ? `• *Balanço Hídrico:* Perda de ${(chk.weightPre - chk.weightPost).toFixed(2)} kg\n` : '') +
      (chk.jumpCmjPre && chk.jumpCmjPost ? `• *Salto CMJ:* Delta de ${(chk.jumpCmjPost - chk.jumpCmjPre).toFixed(1)} cm\n` : '') +
      (isCritical 
        ? `\n⚠️ *ALERTA CRÍTICO DE CARGA:* Seus índices de ${studentRisk?.criticalReasons.join(' e ')} ultrapassaram os níveis de segurança estabelecidos. Recomenda-se sessão regenerativa e descanso imediato.\n` 
        : `\n💡 *Recomendação:* Continue respeitando os intervalos de recuperação e hidratação adequada.\n`) +
      `\nAcompanhe seus gráficos no app! 📲💪`;
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {settingsSavedToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-emerald-900 text-white px-4 py-3 shadow-2xl border border-emerald-700 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">Limiares críticos de Monotonia e Strain atualizados com sucesso!</span>
        </div>
      )}

      {/* 1. TOP HEADER & FILTERS BAR */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-700" />
              Painel de Análise Científica & Comparativo
            </h3>
            <p className="text-xs text-slate-500">
              Filtros múltiplos por aluno, período e data com cálculo de ACWR, Strain, Recovery e Monotonia.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Botão de Configuração de Limiares Críticos */}
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Ajustar valores críticos de Monotonia e Strain"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span>Configurar Níveis Críticos</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToCheckin}
              className="px-3.5 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>+ Novo Check-in</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Imprimir Relatório</span>
            </button>
          </div>
        </div>

        {/* 2. ALERTA CRÍTICO DE SOBRECARGA */}
        {criticalStudents.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-500 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3.5">
              {/* A placa pulando com a animação da placa pulando */}
              <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0 shadow-xs animate-bounce flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black uppercase tracking-wider text-rose-950">
                  Alerta crítico de sobrecarga
                </h4>
                <p className="text-xs font-bold text-rose-700">
                  {criticalStudents.length} {criticalStudents.length === 1 ? 'aluno acima dos limites configurados' : 'alunos acima dos limites configurados'}
                </p>
              </div>
            </div>

            {/* Botão de Ver Alunos */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowCriticalStudentsModal(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer whitespace-nowrap text-center transition-all flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Ver Alunos</span>
              </button>
            </div>
          </div>
        )}

        {/* MULTI-SELECT FILTERS (LISTAS SUSPENSAS COM CAIXAS DE SELEÇÃO & CALENDÁRIO) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
          
          {/* 1. Alunos Filter (Lista suspensa acionada por botão com seta e caixas de seleção) */}
          <div className="md:col-span-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Filtrar Alunos
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {selectedStudentIds.length} de {students.length} selecionado(s)
              </span>
            </div>

            {/* Trigger Button com Seta */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowStudentDropdown(prev => !prev);
                  setShowPeriodDropdown(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer bg-white ${
                  showStudentDropdown
                    ? 'border-blue-600 ring-2 ring-blue-100 text-blue-900 shadow-sm'
                    : 'border-slate-300 hover:border-slate-400 text-slate-800 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="truncate">
                    {selectedStudentIds.length === students.length
                      ? 'Todos os alunos selecionados'
                      : selectedStudentIds.length === 1
                      ? students.find(s => s.id === selectedStudentIds[0])?.name || '1 aluno selecionado'
                      : `${selectedStudentIds.length} alunos selecionados`}
                  </span>
                  {selectedStudentIds.some(id => studentRiskMap.get(id)?.isCritical) && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-600 text-white shrink-0">
                      🚨 Alerta
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${showStudentDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Lista Suspensa (Dropdown) com Caixas de Seleção */}
              {showStudentDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowStudentDropdown(false)} />
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 space-y-2.5 animate-in fade-in zoom-in-95">
                    {/* Campo de Busca Rápida */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={studentSearchTerm}
                        onChange={(e) => setStudentSearchTerm(e.target.value)}
                        placeholder="Buscar aluno na lista..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        autoFocus
                      />
                    </div>

                    {/* Atalhos Rápidos */}
                    <div className="flex items-center justify-between text-[11px] pt-0.5 px-0.5 border-b border-slate-100 pb-2">
                      <button
                        type="button"
                        onClick={handleSelectAllStudents}
                        className="text-blue-700 hover:underline font-bold cursor-pointer"
                      >
                        Selecionar Todos ({students.length})
                      </button>
                      {criticalStudents.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedStudentIds(criticalStudents.map(c => c.studentId))}
                          className="text-rose-600 hover:underline font-bold cursor-pointer"
                        >
                          Apenas em Alerta ({criticalStudents.length})
                        </button>
                      )}
                    </div>

                    {/* Lista com Checkboxes */}
                    <div className="max-h-56 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                      {students
                        .filter(std => !studentSearchTerm || std.name.toLowerCase().includes(studentSearchTerm.toLowerCase()))
                        .map(std => {
                          const isSelected = selectedStudentIds.includes(std.id);
                          const risk = studentRiskMap.get(std.id);
                          const isCritical = risk?.isCritical;

                          return (
                            <button
                              key={std.id}
                              type="button"
                              onClick={() => handleToggleStudent(std.id)}
                              className={`flex items-center justify-between gap-2 w-full p-2 rounded-xl text-xs transition-colors cursor-pointer border ${
                                isCritical
                                  ? isSelected
                                    ? 'bg-rose-50/90 text-rose-950 border-rose-400 font-bold'
                                    : 'bg-white text-rose-900 border-rose-200 hover:bg-rose-50/50'
                                  : isSelected
                                  ? 'bg-blue-50/80 text-blue-950 border-blue-300 font-bold'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {isSelected ? (
                                  <CheckSquare className={`w-4 h-4 shrink-0 ${isCritical ? 'text-rose-600' : 'text-blue-700'}`} />
                                ) : (
                                  <Square className={`w-4 h-4 shrink-0 ${isCritical ? 'text-rose-400' : 'text-slate-300'}`} />
                                )}
                                <span className="truncate">{std.name}</span>
                              </div>

                              {isCritical && (
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-rose-600 text-white shrink-0">
                                  CRÍTICO
                                </span>
                              )}
                            </button>
                          );
                        })}
                    </div>

                    {/* Rodapé da Lista Suspensa */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold">
                        {selectedStudentIds.length} selecionado(s)
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowStudentDropdown(false)}
                        className="px-3 py-1 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                      >
                        Concluir
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 2. Período Filter (Lista suspensa acionada por botão com seta e caixas de seleção) */}
          <div className="md:col-span-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Período do Treino
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {selectedPeriods.length} de 3
              </span>
            </div>

            {/* Trigger Button com Seta */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowPeriodDropdown(prev => !prev);
                  setShowStudentDropdown(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer bg-white ${
                  showPeriodDropdown
                    ? 'border-amber-500 ring-2 ring-amber-100 text-amber-950 shadow-sm'
                    : 'border-slate-300 hover:border-slate-400 text-slate-800 shadow-2xs'
                }`}
              >
                <span className="truncate">
                  {selectedPeriods.length === 3
                    ? 'Todos os Períodos (3)'
                    : selectedPeriods.map(p => p === 'manha' ? 'Manhã' : p === 'tarde' ? 'Tarde' : 'Noite').join(', ')}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${showPeriodDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Lista Suspensa (Dropdown) com Caixas de Seleção */}
              {showPeriodDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowPeriodDropdown(false)} />
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 space-y-2.5 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-100">
                      <span className="font-bold text-slate-500">Selecione os períodos:</span>
                      <button
                        type="button"
                        onClick={() => setSelectedPeriods(['manha', 'tarde', 'noite'])}
                        className="text-amber-700 hover:underline font-bold cursor-pointer text-[10px]"
                      >
                        Todos (3)
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {(['manha', 'tarde', 'noite'] as const).map(p => {
                        const isSelected = selectedPeriods.includes(p);
                        const label = p === 'manha' ? 'Manhã' : p === 'tarde' ? 'Tarde' : 'Noite';
                        const emoji = p === 'manha' ? '🌅' : p === 'tarde' ? '☀️' : '🌙';
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => handleTogglePeriod(p)}
                            className={`flex items-center gap-2 w-full p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                              isSelected
                                ? 'bg-amber-50 text-amber-950 border-amber-300 font-bold'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-amber-700 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300 shrink-0" />
                            )}
                            <span>{emoji} {label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowPeriodDropdown(false)}
                        className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
                      >
                        Concluir
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 3. Data Filter (Intervalos pré-definidos + Botão de Calendário Início e Fim) */}
          <div className="md:col-span-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Intervalo de Data
              </span>
              {dateRangeFilter === 'custom' && customStartDate && customEndDate && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Filtro Ativo
                </span>
              )}
            </div>

            {/* Grid com os 4 botões já existentes */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: '7d', label: '7 Dias' },
                { id: '14d', label: '14 Dias' },
                { id: '28d', label: '28 Dias (Mês)' },
                { id: 'todos', label: 'Histórico Total' }
              ].map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setDateRangeFilter(d.id as any);
                    setShowCustomDateModal(false);
                  }}
                  className={`p-2 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer text-center ${
                    dateRangeFilter === d.id
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Botão para colocar dia de início e dia final dentro de um calendário */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setDateRangeFilter('custom');
                  setShowCustomDateModal(prev => !prev);
                }}
                className={`w-full p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  dateRangeFilter === 'custom'
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                    : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="truncate">
                  {dateRangeFilter === 'custom' && customStartDate && customEndDate
                    ? `${customStartDate.split('-').reverse().slice(0, 2).join('/')} até ${customEndDate.split('-').reverse().slice(0, 2).join('/')}`
                    : 'Selecionar Início & Fim (Calendário)'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCustomDateModal ? 'rotate-180' : ''}`} />
              </button>

              {/* Seletor de Calendário Início e Fim */}
              {showCustomDateModal && (
                <div className="mt-2 p-3 rounded-xl bg-white border border-emerald-200 shadow-sm space-y-2 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Dia de Início:</label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => {
                          setCustomStartDate(e.target.value);
                          setDateRangeFilter('custom');
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Dia de Término:</label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => {
                          setCustomEndDate(e.target.value);
                          setDateRangeFilter('custom');
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomStartDate('');
                        setCustomEndDate('');
                        setDateRangeFilter('14d');
                        setShowCustomDateModal(false);
                      }}
                      className="text-slate-500 hover:text-slate-700 font-bold cursor-pointer"
                    >
                      Limpar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomDateModal(false)}
                      className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold cursor-pointer"
                    >
                      Aplicar Intervalo
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 3. CARDS DE ANÁLISE RÁPIDA (ÚLTIMA RESPOSTA ENVIADA) */}
      {latestCheckin ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-700" />
              Cards de Análise Rápida (Última Resposta: {latestCheckin.studentName} • {latestCheckin.date} - {latestCheckin.period.toUpperCase()})
            </h4>
            <button
              type="button"
              onClick={() => {
                setModalCheckinTarget(latestCheckin);
                setShowWhatsAppModal(true);
              }}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Encaminhar no WhatsApp</span>
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            
            {/* Prontidão */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Prontidão</span>
              <div className="text-xl font-black text-slate-900">{latestCheckin.readinessScore}%</div>
              <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md ${
                latestCheckin.readinessStatus === 'otimo' ? 'bg-emerald-100 text-emerald-800' :
                latestCheckin.readinessStatus === 'moderado' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {latestCheckin.readinessStatus}
              </span>
            </div>

            {/* Sono */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Sono (0-10)</span>
              <div className="text-xl font-black text-indigo-700">{latestCheckin.sleepQuality}</div>
              <span className="text-[10px] text-slate-500 font-semibold">{latestCheckin.sleepHours}h dormidas</span>
            </div>

            {/* PSE */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">PSE (0-10)</span>
              <div className="text-xl font-black text-amber-700">{latestCheckin.pse}</div>
              <span className="text-[10px] text-slate-500 font-semibold">Fadiga</span>
            </div>

            {/* EVA */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">EVA (0-10)</span>
              <div className="text-xl font-black text-rose-700">{latestCheckin.eva}</div>
              <span className="text-[10px] text-slate-500 font-semibold">Dor Muscular</span>
            </div>

            {/* Estresse */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Estresse</span>
              <div className="text-xl font-black text-sky-700">{latestCheckin.stressLevel}</div>
              <span className="text-[10px] text-slate-500 font-semibold">Mental (0-10)</span>
            </div>

            {/* Recovery / PSR */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">PSR (Recovery)</span>
              <div className="text-xl font-black text-blue-700">{latestCheckin.psr}</div>
              <span className="text-[10px] text-slate-500 font-semibold">Escala 0-10</span>
            </div>

            {/* Carga da Sessão */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Carga Sessão</span>
              <div className="text-xl font-black text-purple-700">{latestCheckin.pse * (latestCheckin.trainingDurationMinutes || 60)}</div>
              <span className="text-[10px] text-slate-500 font-semibold">{latestCheckin.trainingDurationMinutes || 60} min (AU)</span>
            </div>

            {/* Salto CMJ / Peso */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">CMJ / Peso</span>
              <div className="text-sm font-black text-slate-900">
                {latestCheckin.jumpCmjPre && latestCheckin.jumpCmjPost 
                  ? `${(latestCheckin.jumpCmjPost - latestCheckin.jumpCmjPre).toFixed(1)} cm` 
                  : '--'}
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">
                {latestCheckin.weightPre && latestCheckin.weightPost 
                  ? `-${(latestCheckin.weightPre - latestCheckin.weightPost).toFixed(2)} kg` 
                  : 'Fisiologia'}
              </span>
            </div>

          </div>
        </div>
      ) : null}

      {/* 4. SCIENTIFIC METRICS OVERVIEW STRIP (COM DESTAQUE EM VERMELHO SE CRÍTICO) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* ACWR CARD */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Índice ACWR</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
              trainingMetrics.acwrStatus === 'otimo' ? 'bg-emerald-100 text-emerald-800' :
              trainingMetrics.acwrStatus === 'atencao' ? 'bg-amber-100 text-amber-800' :
              trainingMetrics.acwrStatus === 'subtreinamento' ? 'bg-blue-100 text-blue-800' :
              'bg-rose-100 text-rose-800'
            }`}>
              {trainingMetrics.acwrStatus === 'otimo' ? 'Sweet Spot' : trainingMetrics.acwrStatus}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{trainingMetrics.acwr}</span>
            <span className="text-xs text-slate-400 font-bold">Razão Agudo:Crônico</span>
          </div>

          <div className="space-y-1">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
              <div className="bg-blue-400 h-full w-[25%]" title="Sub-treino (<0.8)"></div>
              <div className="bg-emerald-500 h-full w-[35%]" title="Sweet spot (0.8 - 1.3)"></div>
              <div className="bg-amber-400 h-full w-[15%]" title="Atenção (1.3 - 1.5)"></div>
              <div className="bg-rose-500 h-full w-[25%]" title="Danger zone (>1.5)"></div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
              <span>0.8</span>
              <span className="text-emerald-700 font-bold">1.3 (Ideal)</span>
              <span>1.5</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            {trainingMetrics.acwr <= 1.3 && trainingMetrics.acwr >= 0.8
              ? 'Carga em faixa ótima. Alta adaptação e mínimo risco de lesão.'
              : trainingMetrics.acwr > 1.5
              ? 'Alerta crítico: Carga aguda aumentou rápido demais (>1.5).'
              : 'Faixa de atenção no controle da progressão de carga.'}
          </p>
        </div>

        {/* STRAIN CARD (DESTAQUE VERMELHO SE ACIMA DO LIMIAR CRÍTICO) */}
        <div className={`p-4 rounded-2xl shadow-2xs space-y-2 transition-all ${
          trainingMetrics.isStrainCritical
            ? 'bg-rose-50 border-2 border-rose-500 text-rose-950 ring-2 ring-rose-500/20'
            : 'bg-white border border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              trainingMetrics.isStrainCritical ? 'text-rose-800' : 'text-slate-500'
            }`}>
              Strain (Estresse Acumulado)
            </span>
            {trainingMetrics.isStrainCritical ? (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                CRÍTICO (≥ {criticalStrainThreshold.toLocaleString('pt-BR')})
              </span>
            ) : (
              <Zap className="w-4 h-4 text-purple-600" />
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black ${
              trainingMetrics.isStrainCritical ? 'text-rose-600' : 'text-purple-900'
            }`}>
              {trainingMetrics.strain.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs text-slate-400 font-bold">AU</span>
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
            <span>Carga Total: <strong>{trainingMetrics.totalLoad} AU</strong></span>
            <span>Monotonia: <strong>{trainingMetrics.monotony}</strong></span>
          </div>

          <p className={`text-[10px] leading-tight ${
            trainingMetrics.isStrainCritical ? 'text-rose-800 font-semibold' : 'text-slate-500'
          }`}>
            {trainingMetrics.isStrainCritical
              ? `🚨 ATENÇÃO: Nível de estresse acumulado (${trainingMetrics.strain} AU) ultrapassou o limiar de segurança (${criticalStrainThreshold.toLocaleString('pt-BR')} AU). Risco de sobretreinamento.`
              : `Fórmula de Foster (Carga × Monotonia). Limiar configurado: ${criticalStrainThreshold.toLocaleString('pt-BR')} AU.`}
          </p>
        </div>

        {/* MONOTONIA CARD (DESTAQUE VERMELHO SE ACIMA DO LIMIAR CRÍTICO) */}
        <div className={`p-4 rounded-2xl shadow-2xs space-y-2 transition-all ${
          trainingMetrics.isMonotonyCritical
            ? 'bg-rose-50 border-2 border-rose-500 text-rose-950 ring-2 ring-rose-500/20'
            : 'bg-white border border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              trainingMetrics.isMonotonyCritical ? 'text-rose-800' : 'text-slate-500'
            }`}>
              Índice de Monotonia
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              trainingMetrics.isMonotonyCritical
                ? 'bg-rose-600 text-white animate-pulse flex items-center gap-1'
                : trainingMetrics.monotony < 1.5
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {trainingMetrics.isMonotonyCritical ? (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  CRÍTICO (≥ {criticalMonotonyThreshold.toFixed(1)})
                </>
              ) : trainingMetrics.monotony < 1.5 ? (
                'Excelente Ondulação'
              ) : (
                'Moderado'
              )}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black ${
              trainingMetrics.isMonotonyCritical ? 'text-rose-600' : 'text-slate-900'
            }`}>
              {trainingMetrics.monotony}
            </span>
            <span className="text-xs text-slate-400 font-bold">Média / Desvio Padrão</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                trainingMetrics.isMonotonyCritical ? 'bg-rose-600' :
                trainingMetrics.monotony < 1.5 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, (trainingMetrics.monotony / 2.5) * 100)}%` }}
            />
          </div>

          <p className={`text-[10px] leading-tight ${
            trainingMetrics.isMonotonyCritical ? 'text-rose-800 font-semibold' : 'text-slate-500'
          }`}>
            {trainingMetrics.isMonotonyCritical
              ? `🚨 ALERTA: Monotonia em ${trainingMetrics.monotony} (limiar crítico: ${criticalMonotonyThreshold.toFixed(1)}). Falta de dias leves/recuperativos.`
              : `Mede a variação de carga entre os dias. Limiar configurado: ${criticalMonotonyThreshold.toFixed(1)}.`}
          </p>
        </div>

        {/* RECOVERY (PSR) CARD */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Índice de Recovery</span>
            <HeartPulse className="w-4 h-4 text-blue-600" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-800">{trainingMetrics.avgRecovery}</span>
            <span className="text-xs text-slate-400 font-bold">Média Escala 0-10</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full"
              style={{ width: `${(trainingMetrics.avgRecovery / 10) * 100}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-500 leading-tight">
            Percepção Subjetiva de Recuperação (PSR) média dos check-ins filtrados.
          </p>
        </div>

      </div>

      {/* 5. SEÇÃO DE GRÁFICOS INDIVIDUAIS & CONTROLE DE CARGA */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-5">
        
        {/* Header e Controles Globais de Gráficos */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-xl bg-blue-100 text-blue-800 font-bold">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h4 className="text-base font-extrabold text-slate-900">
                Gráficos de Bem-Estar, Questionário & Controle Fisiológico
              </h4>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                {chronologicalCheckins.length} registros no período
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Acompanhamento temporal diário de prontidão, sono, PSE, dor muscular, estresse, carga e índices de Foster. Clique em qualquer gráfico para ampliar individualmente.
            </p>
          </div>

          {/* APENAS OS BOTÕES "Todos os Gráficos" e "Filtrar Gráficos" */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Primeiro Botão: Todos os Gráficos */}
            <button
              type="button"
              onClick={() => {
                setSelectedExpandedChartId(null);
                handleSelectAllCharts();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                selectedChartIds.length === allChartOrder.length && !selectedExpandedChartId
                  ? 'bg-blue-600 text-white border-blue-700 shadow-2xs font-extrabold'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title="Exibir todos os 20 gráficos disponíveis na grade de 2 por linha"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Todos os Gráficos</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                selectedChartIds.length === allChartOrder.length && !selectedExpandedChartId
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {allChartOrder.length}
              </span>
            </button>

            {/* 2. Botão de Filtro com Lista Suspensa (Dropdown) de Caixas de Seleção */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowChartDropdown(prev => !prev)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  showChartDropdown || (selectedChartIds.length < allChartOrder.length)
                    ? 'bg-blue-50 text-blue-950 border-blue-300 ring-2 ring-blue-500/10 shadow-2xs font-black'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 shadow-2xs'
                }`}
                title="Abrir lista suspensa de caixas de seleção para escolher quais gráficos visualizar"
              >
                <Filter className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Filtrar Gráficos</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-bold">
                  {selectedChartIds.length === allChartOrder.length ? 'Todos (20)' : `${selectedChartIds.length} selecionado(s)`}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${showChartDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Lista Suspensa (Dropdown) com Caixas de Seleção */}
              {showChartDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowChartDropdown(false)} />
                  <div className="absolute right-0 sm:left-0 top-full mt-2 z-40 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3.5 space-y-3 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <h5 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                          Selecione os Gráficos
                        </h5>
                        <p className="text-[10px] text-slate-500">Marque as caixas de seleção dos gráficos que quer ver</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowChartDropdown(false)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Busca Rápida de Métricas */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Buscar por nome ou categoria..."
                        value={chartSearchTerm}
                        onChange={(e) => setChartSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Ações Rápidas de Seleção */}
                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      <button
                        type="button"
                        onClick={handleSelectAllCharts}
                        className="text-blue-700 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                      >
                        Marcar Todos ({allChartOrder.length})
                      </button>
                      <button
                        type="button"
                        onClick={handleClearCharts}
                        className="text-slate-500 hover:text-slate-700 font-semibold hover:underline cursor-pointer"
                      >
                        Apenas 1 (Prontidão)
                      </button>
                    </div>

                    {/* Lista com Caixas de Seleção */}
                    <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {CHART_METADATA_LIST
                        .filter(c => 
                          c.label.toLowerCase().includes(chartSearchTerm.toLowerCase()) ||
                          c.category.toLowerCase().includes(chartSearchTerm.toLowerCase())
                        )
                        .map(c => {
                          const isChecked = selectedChartIds.includes(c.id);
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => handleToggleChart(c.id)}
                              className={`flex items-center gap-2.5 w-full p-2 rounded-xl text-left text-xs transition-colors cursor-pointer border ${
                                isChecked
                                  ? 'bg-blue-50/80 text-blue-950 border-blue-200 font-bold'
                                  : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                              }`}
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300 shrink-0" />
                              )}
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: c.color }}
                              />
                              <div className="flex-1 truncate">
                                <span className="block truncate">{c.label}</span>
                                <span className="block text-[9px] text-slate-400 font-medium uppercase">{c.category}</span>
                              </div>
                            </button>
                          );
                        })}
                    </div>

                    {/* Rodapé da Lista Suspensa */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">
                        <strong>{selectedChartIds.length}</strong> de {allChartOrder.length} selecionados
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowChartDropdown(false)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-xs"
                      >
                        Concluir
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ================= GRADE DE GRÁFICOS (INDIVIDUAL AMPLIADO OU 2 POR LINHA) ================= */}
        <div className="space-y-4">
          {individualMetricConfigs.filter(m => selectedChartIds.includes(m.id)).length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <Filter className="w-8 h-8 text-slate-400 mx-auto" />
              <h5 className="text-sm font-bold text-slate-700">Nenhum gráfico selecionado no filtro</h5>
              <p className="text-xs text-slate-500">
                Clique no botão "Filtrar Gráficos" para marcar quais gráficos deseja ver ou clique em "Todos os Gráficos".
              </p>
              <button
                type="button"
                onClick={handleSelectAllCharts}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer hover:bg-blue-700 shadow-xs"
              >
                Exibir Todos os Gráficos
              </button>
            </div>
          ) : selectedExpandedChartId ? (
            /* 1. MODO AMPLIADO INDIVIDUAL (AO SELECIONAR UM GRÁFICO ESPECÍFICO, AMPLIA O SEU TAMANHO) */
            <div className="w-full">
              {individualMetricConfigs
                .filter(m => m.id === selectedExpandedChartId)
                .map(metric => (
                  <div key={metric.id} id={`chart-container-${metric.id}`} className="w-full">
                    <IndividualMetricChart
                      id={metric.id}
                      title={metric.title}
                      subtitle={metric.subtitle}
                      unit={metric.unit}
                      color={metric.color}
                      accentBg={metric.accentBg}
                      dataPoints={metric.dataPoints}
                      minScale={metric.minScale}
                      maxScale={metric.maxScale}
                      idealZone={metric.idealZone}
                      dangerZone={metric.dangerZone}
                      isInverse={metric.isInverse}
                      clinicalNotes={metric.clinicalNotes}
                      chartType={getChartType(metric.id)}
                      onToggleChartType={() => handleToggleChartType(metric.id)}
                      isExpanded={true}
                      onToggleExpand={() => setSelectedExpandedChartId(null)}
                      onNavigatePrevious={() => handleNavigateChart('prev')}
                      onNavigateNext={() => handleNavigateChart('next')}
                      showNavigationControls={false}
                    />
                  </div>
                ))}
            </div>
          ) : individualMetricConfigs.filter(m => selectedChartIds.includes(m.id)).length === 1 ? (
            /* 2. APENAS UM GRÁFICO SELECIONADO: AMPLIA AUTOMATICAMENTE PARA MELHOR VISUALIZAÇÃO */
            <div className="w-full">
              {individualMetricConfigs
                .filter(m => selectedChartIds.includes(m.id))
                .map(metric => (
                  <div key={metric.id} id={`chart-container-${metric.id}`} className="w-full">
                    <IndividualMetricChart
                      id={metric.id}
                      title={metric.title}
                      subtitle={metric.subtitle}
                      unit={metric.unit}
                      color={metric.color}
                      accentBg={metric.accentBg}
                      dataPoints={metric.dataPoints}
                      minScale={metric.minScale}
                      maxScale={metric.maxScale}
                      idealZone={metric.idealZone}
                      dangerZone={metric.dangerZone}
                      isInverse={metric.isInverse}
                      clinicalNotes={metric.clinicalNotes}
                      chartType={getChartType(metric.id)}
                      onToggleChartType={() => handleToggleChartType(metric.id)}
                      isExpanded={true}
                      onToggleExpand={() => setSelectedExpandedChartId(null)}
                      onNavigatePrevious={() => handleNavigateChart('prev')}
                      onNavigateNext={() => handleNavigateChart('next')}
                      showNavigationControls={false}
                    />
                  </div>
                ))}
            </div>
          ) : (
            /* 3. MAIS DE UM GRÁFICO SELECIONADO: REDUZ O TAMANHO E SEPARA A TELA EM DOIS EM DOIS GRÁFICOS (2 POR LINHA) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {individualMetricConfigs
                .filter(metric => selectedChartIds.includes(metric.id))
                .map(metric => (
                  <div
                    key={metric.id}
                    id={`chart-container-${metric.id}`}
                    onClick={() => {
                      setSelectedExpandedChartId(metric.id);
                      setTimeout(() => {
                        document.getElementById(`chart-container-${metric.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                      }, 80);
                    }}
                    className="col-span-1 cursor-pointer hover:shadow-md transition-all duration-200"
                  >
                    <IndividualMetricChart
                      id={metric.id}
                      title={metric.title}
                      subtitle={metric.subtitle}
                      unit={metric.unit}
                      color={metric.color}
                      accentBg={metric.accentBg}
                      dataPoints={metric.dataPoints}
                      minScale={metric.minScale}
                      maxScale={metric.maxScale}
                      idealZone={metric.idealZone}
                      dangerZone={metric.dangerZone}
                      isInverse={metric.isInverse}
                      clinicalNotes={metric.clinicalNotes}
                      chartType={getChartType(metric.id)}
                      onToggleChartType={() => handleToggleChartType(metric.id)}
                      isExpanded={false}
                      onToggleExpand={() => {
                        setSelectedExpandedChartId(metric.id);
                        setTimeout(() => {
                          document.getElementById(`chart-container-${metric.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 80);
                      }}
                      onNavigatePrevious={() => handleNavigateChart('prev')}
                      onNavigateNext={() => handleNavigateChart('next')}
                      showNavigationControls={false}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>

      {/* 6. RELATÓRIO DA IA AO FINAL DO ÚLTIMO GRÁFICO (NO FINAL DA PÁGINA) */}
      <AnaliseAiReportCard
        selectedChartSummaries={selectedChartSummaries}
        globalContext={analiseGlobalContext}
        totalAvailableChartsCount={allChartOrder.length}
      />

      {/* MODAL: CONFIGURAÇÃO DE NÍVEIS CRÍTICOS (THRESHOLDS) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-6 sm:pt-10 md:pt-12 pb-8 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Configuração de Níveis Críticos de Alerta
                  </h4>
                  <p className="text-xs text-slate-500">Defina os limiares para disparo do destaque visual em vermelho</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Monotonia Threshold */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Nível Crítico de Monotonia</span>
                    <span className="text-[10px] text-slate-500">(Padrão: 2.0)</span>
                  </label>
                  <span className="text-sm font-black text-rose-600">≥ {tempMonotonyThreshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="3.0"
                  step="0.05"
                  value={tempMonotonyThreshold}
                  onChange={(e) => setTempMonotonyThreshold(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>1.2 (Mais rigoroso)</span>
                  <span className="text-slate-700 font-bold">2.0 (Foster)</span>
                  <span>3.0 (Mais tolerante)</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                  Valores acima de 2.0 indicam treinos muito similares dia após dia, sem alternância de dias pesados e regenerativos, o que multiplica o estresse biológico.
                </p>
              </div>

              {/* Strain Threshold */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Nível Crítico de Strain (Estresse Acumulado)</span>
                    <span className="text-[10px] text-slate-500">(Padrão: 6.000 AU)</span>
                  </label>
                  <span className="text-sm font-black text-rose-600">≥ {tempStrainThreshold.toLocaleString('pt-BR')} AU</span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="10000"
                  step="250"
                  value={tempStrainThreshold}
                  onChange={(e) => setTempStrainThreshold(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>3.000 AU</span>
                  <span className="text-slate-700 font-bold">6.000 AU (Foster)</span>
                  <span>10.000 AU</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                  Strain = Carga Semanal × Monotonia. Valores acima de 6.000 AU predizem com precisão quadros de fadiga extrema, imunossupressão e lesões por sobrecarga.
                </p>
              </div>

            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={handleResetSettings}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Padrão Científico</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Salvar Limiares
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: DISPARO WHATSAPP PARA O CHECK-IN ALVO */}
      {showWhatsAppModal && modalCheckinTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-6 sm:pt-10 md:pt-12 pb-8 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Enviar Análise Completa via WhatsApp
                  </h4>
                  <p className="text-xs text-slate-500">Destinatário: {modalCheckinTarget.studentName}</p>
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

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {generateWhatsAppMessage(modalCheckinTarget)}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <a
                href={`https://api.whatsapp.com/send?phone=5511987654321&text=${encodeURIComponent(generateWhatsAppMessage(modalCheckinTarget))}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowWhatsAppModal(false)}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Disparar Agora</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ALUNOS COM SOBRECARGA CRÍTICA (ACIONADO PELO BOTÃO 'VER ALUNOS') */}
      {showCriticalStudentsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-6 sm:pt-10 md:pt-12 pb-8 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-rose-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-rose-950">
                    Alunos em Alerta Crítico ({criticalStudents.length})
                  </h4>
                  <p className="text-xs text-slate-500">
                    Limiares ativos: Monotonia ≥ {criticalMonotonyThreshold.toFixed(1)} • Strain ≥ {criticalStrainThreshold.toLocaleString('pt-BR')} AU
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCriticalStudentsModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {criticalStudents.map(cs => {
                const studentCheckin = checkins.find(c => c.studentId === cs.studentId);
                return (
                  <div
                    key={cs.studentId}
                    className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{cs.studentName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white animate-pulse">
                          Crítico
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span>Monotonia: <strong className={cs.isCriticalMonotony ? 'text-rose-600 font-black' : 'text-slate-800'}>{cs.monotony}</strong></span>
                        <span>•</span>
                        <span>Strain: <strong className={cs.isCriticalStrain ? 'text-rose-600 font-black' : 'text-slate-800'}>{cs.strain.toLocaleString('pt-BR')} AU</strong></span>
                        <span>•</span>
                        <span>Carga Total: <strong>{cs.totalLoad} AU</strong></span>
                      </div>
                      <div className="text-[11px] font-semibold text-rose-700">
                        {cs.criticalReasons.join(' | ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {studentCheckin && (
                        <button
                          type="button"
                          onClick={() => {
                            setModalCheckinTarget(studentCheckin);
                            setShowWhatsAppModal(true);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Avisar</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudentIds([cs.studentId]);
                          setShowCriticalStudentsModal(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs cursor-pointer shadow-2xs"
                      >
                        Filtrar Aluno
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedStudentIds(criticalStudents.map(c => c.studentId));
                  setShowCriticalStudentsModal(false);
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Filtrar Todos os {criticalStudents.length} em Alerta
              </button>
              <button
                type="button"
                onClick={() => setShowCriticalStudentsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
