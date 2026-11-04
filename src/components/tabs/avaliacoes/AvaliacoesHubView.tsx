import React, { useState, useMemo, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Plus, 
  FileText, 
  Printer, 
  BarChart3, 
  Calendar, 
  User, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Activity, 
  Camera, 
  Zap, 
  Dumbbell, 
  Flame, 
  ArrowUpRight, 
  Sliders, 
  Layers, 
  ChevronRight, 
  ArrowRight, 
  RotateCcw, 
  Share2, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Filter, 
  X,
  Search,
  CheckSquare,
  Square,
  HelpCircle,
  Play,
  Target,
  LineChart,
  CheckCheck,
  Ruler,
  Edit3
} from 'lucide-react';
import { Student, PhysicalAssessmentData } from '../../../types';
import { INITIAL_ASSESSMENTS } from '../treino/AvaliacoesFisicasTab';
import { AnamneseView } from './AnamneseView';
import { DobrasCutaneasView } from './DobrasCutaneasView';
import { BioimpedanciaView } from './BioimpedanciaView';
import { PerimetriaView } from './PerimetriaView';
import { FotosPosturalView } from './FotosPosturalView';
import { TestesFuncionaisView } from './TestesFuncionaisView';
import { TestesForcaView } from './TestesForcaView';
import { TestesCampoView } from './TestesCampoView';
import { TestesSaltoView } from './TestesSaltoView';
import { TestesPersonalizadosView } from './TestesPersonalizadosView';
import {
  ComposicaoSectorGraphics,
  AnamneseSectorGraphics,
  FuncionalSectorGraphics,
  ForcaSaltoSectorGraphics,
  CampoSectorGraphics,
  PersonalizadosSectorGraphics
} from './SectorAnalysisGraphics';

export interface AssessmentProtocolOption {
  id: string;
  name: string;
  shortName: string;
  icon: React.ElementType;
  description: string;
  category: string;
  tagColor: string;
}

export const ALL_ASSESSMENT_PROTOCOLS: AssessmentProtocolOption[] = [
  { id: 'anamnese', name: 'Anamnese & PAR-Q', shortName: 'Anamnese', icon: FileText, description: 'Questionário de prontidão física e histórico clínico', category: 'Saúde', tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'dobras_cutaneas', name: 'Dobras Cutâneas (Adipometria)', shortName: 'Dobras', icon: Layers, description: 'Pollock 7/3, Guedes, Petroski e Faulkner', category: 'Composição', tagColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'bioimpedancia', name: 'Bioimpedância Tetrapolar', shortName: 'Bioimpedância', icon: Scale, description: 'Água corporal, massa magra, óssea e visceral', category: 'Composição', tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'perimetria', name: 'Perimetria Corporal', shortName: 'Perimetria', icon: Activity, description: '16 circunferências corporais e índice RCQ', category: 'Antropometria', tagColor: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { id: 'fotos_postural', name: 'Fotos & Avaliação Postural', shortName: 'Fotos/Postura', icon: Camera, description: '4 vistas fotográficas e grade postural virtual', category: 'Biomecânica', tagColor: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'testes_funcionais', name: 'Testes Funcionais & FMS', shortName: 'Funcional', icon: Zap, description: 'Triagem de mobilidade, estabilidade e Banco de Wells', category: 'Movimento', tagColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'testes_forca', name: 'Testes de Força & 1RM', shortName: 'Força & 1RM', icon: Dumbbell, description: '1RM preditivo (Brzycki/Epley) e dinamometria', category: 'Força', tagColor: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'testes_campo', name: 'Testes de Campo', shortName: 'Campo', icon: Flame, description: 'Yo-Yo Test, RAST, Teste T, Cooper e 1 Milha', category: 'Cardiorrespiratório', tagColor: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'testes_salto', name: 'Testes de Salto Vertical', shortName: 'Saltos', icon: ArrowUpRight, description: 'CMJ, SJ, Drop Jump, RSI e potência Sayers', category: 'Potência', tagColor: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'testes_personalizados', name: 'Testes Personalizados', shortName: 'Personalizados', icon: Sliders, description: 'Métricas sob demanda e construtor livre', category: 'Customizado', tagColor: 'bg-slate-100 text-slate-700 border-slate-300' },
];

interface DraftAssessmentSession {
  studentId: string;
  studentName: string;
  selectedProtocols: string[];
  completedProtocols: string[];
  activeProtocol: string;
  weightKg?: number;
  heightCm?: number;
  date: string;
  savedAt: string;
}

// Gerador inteligente e adaptável de histórico de avaliações para qualquer aluno
export const getAssessmentsForStudent = (std: Student): PhysicalAssessmentData[] => {
  try {
    const saved = localStorage.getItem(`glprofit_assessment_sessions_${std.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  const fromInitial = INITIAL_ASSESSMENTS.filter(a => a.studentId === std.id);
  if (fromInitial.length > 0) return fromInitial;

  const isFemale = (std as any).gender?.toLowerCase() === 'feminino';
  const weight = isFemale ? 59.5 : 75.4;
  const height = isFemale ? 165 : 178;
  const age = 27;
  const bmi = Number((weight / Math.pow(height / 100, 2)).toFixed(1));
  const fatPct1 = isFemale ? 21.5 : 13.8;
  const fatPct2 = isFemale ? 23.8 : 16.2;
  const fatPct3 = isFemale ? 25.5 : 18.5;
  const fatKg1 = Number(((weight * fatPct1) / 100).toFixed(1));
  const leanKg1 = Number((weight - fatKg1).toFixed(1));
  const bmr = isFemale ? 1380 : 1740;

  return [
    {
      id: `av-${std.id}-3`,
      studentId: std.id,
      studentName: std.name,
      date: '2026-09-15',
      evaluator: 'Prof. Gianluca Marinho (CREF 112001-G/SP)',
      objective: (std as any).objective || (isFemale ? 'Definição & Tonificação Muscular' : 'Hipertrofia Muscular & Condicionamento'),
      protocol: 'pollock7',
      protocolName: 'Pollock 7 Dobras & Bioimpedância Tetrapolar',
      weightKg: weight,
      heightCm: height,
      age: age,
      gender: isFemale ? 'feminino' : 'masculino',
      bmi: bmi,
      bmr: bmr,
      composition: {
        bodyDensity: isFemale ? 1.0515 : 1.0682,
        bodyFatPercentage: fatPct1,
        fatMassKg: fatKg1,
        leanMassKg: leanKg1,
        muscleMassKg: Number((leanKg1 * 0.65).toFixed(1)),
        boneMassKg: isFemale ? 8.5 : 11.8,
        residualMassKg: isFemale ? 7.8 : 10.5,
        idealFatPercentage: isFemale ? 18.0 : 12.0,
        idealWeightKg: Number((weight - 1.5).toFixed(1)),
        classification: isFemale ? 'Excelente' : 'Atleta'
      },
      skinfolds: isFemale ? {
        peitoral: 12, axilarMedia: 14, triceps: 15, subescapular: 13, biceps: 7, abdominal: 18, suprailiaca: 14, coxa: 21, panturrilha: 12, total: 126
      } : {
        peitoral: 7.5, axilarMedia: 9.0, triceps: 8.5, subescapular: 11.0, biceps: 4.0, abdominal: 13.5, suprailiaca: 9.5, coxa: 11.5, panturrilha: 6.5, total: 70.0
      },
      perimetry: isFemale ? {
        pescoco: 32.5, ombros: 102.0, torax: 89.0, cintura: 68.0, abdomen: 73.0, quadril: 98.5, bracoDireitoRelaxado: 27.5, bracoDireitoContraido: 29.5, bracoEsquerdoRelaxado: 27.2, bracoEsquerdoContraido: 29.2, antebracoDireito: 23.5, antebracoEsquerdo: 23.2, coxaDireitaProximal: 56.5, coxaDireitaMedial: 53.0, coxaEsquerdaProximal: 56.2, coxaEsquerdaMedial: 52.8, panturrilhaDireita: 35.0, panturrilhaEsquerda: 34.8, rcq: 0.69, rcqRisk: 'Baixo'
      } : {
        pescoco: 38.5, ombros: 118.0, torax: 104.5, cintura: 78.5, abdomen: 82.0, quadril: 99.0, bracoDireitoRelaxado: 36.5, bracoDireitoContraido: 39.2, bracoEsquerdoRelaxado: 36.2, bracoEsquerdoContraido: 39.0, antebracoDireito: 29.5, antebracoEsquerdo: 29.2, coxaDireitaProximal: 59.5, coxaDireitaMedial: 56.0, coxaEsquerdaProximal: 59.2, coxaEsquerdaMedial: 55.8, panturrilhaDireita: 37.8, panturrilhaEsquerda: 37.5, rcq: 0.79, rcqRisk: 'Baixo'
      },
      photos: {
        symmetryScorePct: 96.8,
        shoulderAlignmentPct: 98.2,
        pelvicAlignmentPct: 96.5,
        cervicalAlignmentPct: 97.4,
        escapularDeviationDeg: 0.7
      },
      anamnesis: {
        parqCleared: true,
        clinicalHistory: 'Apto para atividades físicas vigorosas sem restrições.',
        injuries: 'Nenhuma lesão ativa no momento.',
        medications: 'Nenhum medicamento contínuo.',
        activityLevel: 'Avançado (5x por semana)',
        sleepHours: 7.8,
        waterIntakeLiters: 3.2,
        painEva: 1.0,
        stressLevel: 2.5,
        trainingAdherencePct: 95,
        energyLevel: 9.0
      },
      functional: {
        fmsTotalScore: 18,
        wellsFlexibilityCm: isFemale ? 38.5 : 36.0,
        deepSquatScore: 3,
        hurdleStepScore: 3,
        shoulderMobilityScore: 3,
        trunkStabilityScore: 3
      },
      force: {
        benchPress1Rm: isFemale ? 55 : 108,
        squat1Rm: isFemale ? 85 : 142,
        deadlift1Rm: isFemale ? 95 : 158,
        legPress1Rm: isFemale ? 190 : 295,
        handgripRightKgf: isFemale ? 35 : 51
      },
      jump: {
        cmjHeightCm: isFemale ? 34.5 : 43.8,
        sjHeightCm: isFemale ? 30.2 : 38.5,
        cmjSayersWatts: isFemale ? 2750 : 4050,
        dropJumpRsi: 2.25,
        unipodalAsymmetryPct: 2.2
      },
      field: {
        yoyoVo2Max: isFemale ? 48.5 : 54.2,
        yoyoDistanceMeters: isFemale ? 1220 : 1560,
        rastPeakWatts: isFemale ? 485 : 735,
        rastFatiguePct: 23.0,
        tTestSeconds: isFemale ? 10.3 : 9.45,
        cooperDistanceMeters: isFemale ? 2550 : 2980,
        cooperVo2Max: isFemale ? 45.8 : 53.6
      },
      customTests: [
        { name: 'Suspensão no Kimono / Barra', value: 64, unit: 's' },
        { name: 'Pull-ups Unbroken CrossFit', value: isFemale ? 15 : 25, unit: 'reps' },
        { name: 'Tiro de 30m Lançado Velocidade', value: isFemale ? 4.22 : 3.88, unit: 's' },
        { name: 'Prancha Isométrica Abdominal', value: 110, unit: 's' },
        { name: 'Flexões de Braço (1 min)', value: isFemale ? 29 : 46, unit: 'reps' }
      ]
    },
    {
      id: `av-${std.id}-2`,
      studentId: std.id,
      studentName: std.name,
      date: '2026-06-10',
      evaluator: 'Prof. Gianluca Marinho (CREF 112001-G/SP)',
      objective: (std as any).objective || (isFemale ? 'Definição & Tonificação Muscular' : 'Hipertrofia Muscular & Condicionamento'),
      protocol: 'pollock7',
      protocolName: 'Pollock 7 Dobras',
      weightKg: isFemale ? 61.2 : 77.0,
      heightCm: height,
      age: age,
      gender: isFemale ? 'feminino' : 'masculino',
      bmi: Number(((isFemale ? 61.2 : 77.0) / Math.pow(height / 100, 2)).toFixed(1)),
      bmr: bmr,
      composition: {
        bodyDensity: isFemale ? 1.0480 : 1.0620,
        bodyFatPercentage: fatPct2,
        fatMassKg: Number((((isFemale ? 61.2 : 77.0) * fatPct2) / 100).toFixed(1)),
        leanMassKg: Number(((isFemale ? 61.2 : 77.0) - (((isFemale ? 61.2 : 77.0) * fatPct2) / 100)).toFixed(1)),
        muscleMassKg: Number((((isFemale ? 61.2 : 77.0) - (((isFemale ? 61.2 : 77.0) * fatPct2) / 100)) * 0.63).toFixed(1)),
        boneMassKg: isFemale ? 8.5 : 11.8,
        residualMassKg: isFemale ? 7.8 : 10.5,
        idealFatPercentage: isFemale ? 18.0 : 12.0,
        idealWeightKg: Number((weight - 1.5).toFixed(1)),
        classification: 'Médio'
      },
      skinfolds: isFemale ? {
        peitoral: 14, axilarMedia: 16, triceps: 17, subescapular: 15, biceps: 8, abdominal: 21, suprailiaca: 17, coxa: 24, panturrilha: 14, total: 146
      } : {
        peitoral: 9.5, axilarMedia: 11.0, triceps: 10.5, subescapular: 13.0, biceps: 5.0, abdominal: 16.5, suprailiaca: 12.5, coxa: 14.0, panturrilha: 8.0, total: 89.0
      },
      perimetry: isFemale ? {
        pescoco: 32.8, ombros: 101.0, torax: 90.0, cintura: 71.0, abdomen: 76.5, quadril: 100.0, bracoDireitoRelaxado: 28.0, bracoDireitoContraido: 29.8, bracoEsquerdoRelaxado: 27.8, bracoEsquerdoContraido: 29.5, antebracoDireito: 23.5, antebracoEsquerdo: 23.2, coxaDireitaProximal: 57.5, coxaDireitaMedial: 54.0, coxaEsquerdaProximal: 57.2, coxaEsquerdaMedial: 53.8, panturrilhaDireita: 35.2, panturrilhaEsquerda: 35.0, rcq: 0.71, rcqRisk: 'Baixo'
      } : {
        pescoco: 38.8, ombros: 117.0, torax: 103.0, cintura: 81.5, abdomen: 85.0, quadril: 100.0, bracoDireitoRelaxado: 36.0, bracoDireitoContraido: 38.5, bracoEsquerdoRelaxado: 35.8, bracoEsquerdoContraido: 38.2, antebracoDireito: 29.2, antebracoEsquerdo: 29.0, coxaDireitaProximal: 59.0, coxaDireitaMedial: 55.5, coxaEsquerdaProximal: 58.8, coxaEsquerdaMedial: 55.2, panturrilhaDireita: 37.5, panturrilhaEsquerda: 37.2, rcq: 0.81, rcqRisk: 'Baixo'
      },
      photos: {
        symmetryScorePct: 94.5,
        shoulderAlignmentPct: 96.0,
        pelvicAlignmentPct: 94.8,
        cervicalAlignmentPct: 95.2,
        escapularDeviationDeg: 1.2
      },
      anamnesis: {
        parqCleared: true,
        clinicalHistory: 'Evolução favorável sem queixas clínicas.',
        injuries: 'Nenhuma',
        medications: 'Nenhum',
        activityLevel: 'Intermediário',
        sleepHours: 7.2,
        waterIntakeLiters: 2.8,
        painEva: 2.0,
        stressLevel: 3.5,
        trainingAdherencePct: 88,
        energyLevel: 8.0
      },
      functional: {
        fmsTotalScore: 16,
        wellsFlexibilityCm: isFemale ? 36.0 : 33.5,
        deepSquatScore: 2,
        hurdleStepScore: 2,
        shoulderMobilityScore: 3,
        trunkStabilityScore: 2
      },
      force: {
        benchPress1Rm: isFemale ? 48 : 98,
        squat1Rm: isFemale ? 75 : 128,
        deadlift1Rm: isFemale ? 85 : 142,
        legPress1Rm: isFemale ? 175 : 270,
        handgripRightKgf: isFemale ? 32 : 46
      },
      jump: {
        cmjHeightCm: isFemale ? 31.5 : 40.2,
        sjHeightCm: isFemale ? 28.0 : 35.0,
        cmjSayersWatts: isFemale ? 2550 : 3750,
        dropJumpRsi: 2.05,
        unipodalAsymmetryPct: 3.8
      },
      field: {
        yoyoVo2Max: isFemale ? 45.2 : 51.5,
        yoyoDistanceMeters: isFemale ? 1080 : 1420,
        rastPeakWatts: isFemale ? 440 : 670,
        rastFatiguePct: 26.5,
        tTestSeconds: isFemale ? 10.7 : 9.85,
        cooperDistanceMeters: isFemale ? 2420 : 2820,
        cooperVo2Max: isFemale ? 43.5 : 51.2
      },
      customTests: [
        { name: 'Suspensão no Kimono / Barra', value: 54, unit: 's' },
        { name: 'Pull-ups Unbroken CrossFit', value: isFemale ? 12 : 20, unit: 'reps' },
        { name: 'Tiro de 30m Lançado Velocidade', value: isFemale ? 4.38 : 4.02, unit: 's' },
        { name: 'Prancha Isométrica Abdominal', value: 85, unit: 's' },
        { name: 'Flexões de Braço (1 min)', value: isFemale ? 24 : 38, unit: 'reps' }
      ]
    },
    {
      id: `av-${std.id}-1`,
      studentId: std.id,
      studentName: std.name,
      date: '2026-02-15',
      evaluator: 'Prof. Gianluca Marinho (CREF 112001-G/SP)',
      objective: (std as any).objective || (isFemale ? 'Definição & Tonificação Muscular' : 'Hipertrofia Muscular & Condicionamento'),
      protocol: 'pollock7',
      protocolName: 'Pollock 7 Dobras Inicial',
      weightKg: isFemale ? 63.5 : 79.5,
      heightCm: height,
      age: age,
      gender: isFemale ? 'feminino' : 'masculino',
      bmi: Number(((isFemale ? 63.5 : 79.5) / Math.pow(height / 100, 2)).toFixed(1)),
      bmr: bmr - 40,
      composition: {
        bodyDensity: isFemale ? 1.0420 : 1.0560,
        bodyFatPercentage: fatPct3,
        fatMassKg: Number((((isFemale ? 63.5 : 79.5) * fatPct3) / 100).toFixed(1)),
        leanMassKg: Number(((isFemale ? 63.5 : 79.5) - (((isFemale ? 63.5 : 79.5) * fatPct3) / 100)).toFixed(1)),
        muscleMassKg: Number((((isFemale ? 63.5 : 79.5) - (((isFemale ? 63.5 : 79.5) * fatPct3) / 100)) * 0.61).toFixed(1)),
        boneMassKg: isFemale ? 8.5 : 11.8,
        residualMassKg: isFemale ? 7.8 : 10.5,
        idealFatPercentage: isFemale ? 18.0 : 12.0,
        idealWeightKg: Number((weight - 1.5).toFixed(1)),
        classification: 'Regular'
      },
      skinfolds: isFemale ? {
        peitoral: 16, axilarMedia: 19, triceps: 20, subescapular: 18, biceps: 10, abdominal: 25, suprailiaca: 20, coxa: 28, panturrilha: 16, total: 172
      } : {
        peitoral: 12.0, axilarMedia: 13.5, triceps: 12.5, subescapular: 15.0, biceps: 6.5, abdominal: 20.0, suprailiaca: 15.5, coxa: 17.0, panturrilha: 9.5, total: 104.5
      },
      perimetry: isFemale ? {
        pescoco: 33.2, ombros: 100.0, torax: 91.5, cintura: 74.0, abdomen: 80.0, quadril: 102.0, bracoDireitoRelaxado: 28.5, bracoDireitoContraido: 30.2, bracoEsquerdoRelaxado: 28.2, bracoEsquerdoContraido: 29.8, antebracoDireito: 23.8, antebracoEsquerdo: 23.5, coxaDireitaProximal: 58.5, coxaDireitaMedial: 55.0, coxaEsquerdaProximal: 58.2, coxaEsquerdaMedial: 54.8, panturrilhaDireita: 35.5, panturrilhaEsquerda: 35.2, rcq: 0.73, rcqRisk: 'Moderado'
      } : {
        pescoco: 39.2, ombros: 115.5, torax: 102.0, cintura: 84.5, abdomen: 88.0, quadril: 101.5, bracoDireitoRelaxado: 35.5, bracoDireitoContraido: 37.8, bracoEsquerdoRelaxado: 35.2, bracoEsquerdoContraido: 37.5, antebracoDireito: 28.8, antebracoEsquerdo: 28.5, coxaDireitaProximal: 58.5, coxaDireitaMedial: 55.0, coxaEsquerdaProximal: 58.2, coxaEsquerdaMedial: 54.8, panturrilhaDireita: 37.2, panturrilhaEsquerda: 37.0, rcq: 0.83, rcqRisk: 'Moderado'
      },
      photos: {
        symmetryScorePct: 92.0,
        shoulderAlignmentPct: 94.2,
        pelvicAlignmentPct: 92.5,
        cervicalAlignmentPct: 93.0,
        escapularDeviationDeg: 1.8
      },
      anamnesis: {
        parqCleared: true,
        clinicalHistory: 'Início da periodização esportiva inicial.',
        injuries: 'Desconforto lombar leve esporádico.',
        medications: 'Nenhum',
        activityLevel: 'Iniciante / Sedentário recente',
        sleepHours: 6.5,
        waterIntakeLiters: 2.2,
        painEva: 3.5,
        stressLevel: 5.0,
        trainingAdherencePct: 75,
        energyLevel: 6.5
      },
      functional: {
        fmsTotalScore: 14,
        wellsFlexibilityCm: isFemale ? 33.0 : 30.5,
        deepSquatScore: 1,
        hurdleStepScore: 2,
        shoulderMobilityScore: 2,
        trunkStabilityScore: 2
      },
      force: {
        benchPress1Rm: isFemale ? 40 : 85,
        squat1Rm: isFemale ? 65 : 112,
        deadlift1Rm: isFemale ? 75 : 125,
        legPress1Rm: isFemale ? 150 : 235,
        handgripRightKgf: isFemale ? 28 : 41
      },
      jump: {
        cmjHeightCm: isFemale ? 28.5 : 36.5,
        sjHeightCm: isFemale ? 25.0 : 32.0,
        cmjSayersWatts: isFemale ? 2300 : 3400,
        dropJumpRsi: 1.78,
        unipodalAsymmetryPct: 5.5
      },
      field: {
        yoyoVo2Max: isFemale ? 41.8 : 47.5,
        yoyoDistanceMeters: isFemale ? 940 : 1240,
        rastPeakWatts: isFemale ? 395 : 605,
        rastFatiguePct: 31.0,
        tTestSeconds: isFemale ? 11.2 : 10.35,
        cooperDistanceMeters: isFemale ? 2280 : 2640,
        cooperVo2Max: isFemale ? 40.8 : 48.2
      },
      customTests: [
        { name: 'Suspensão no Kimono / Barra', value: 42, unit: 's' },
        { name: 'Pull-ups Unbroken CrossFit', value: isFemale ? 8 : 14, unit: 'reps' },
        { name: 'Tiro de 30m Lançado Velocidade', value: isFemale ? 4.55 : 4.18, unit: 's' },
        { name: 'Prancha Isométrica Abdominal', value: 60, unit: 's' },
        { name: 'Flexões de Braço (1 min)', value: isFemale ? 18 : 28, unit: 'reps' }
      ]
    }
  ];
};

export interface StudentGoals {
  weightKg: number;
  bodyFatPercentage: number;
  leanMassKg: number;
  fatMassKg: number;
  bmi: number;
  bmr: number;
  muscleMassKg: number;
  visceralFatLevel: number;
  totalBodyWaterLiters: number;
  skinfoldsTotal: number;
  abdominalSkinfold: number;
  coxaSkinfold: number;
  tricepsSkinfold: number;
  subescapularSkinfold: number;
  suprailiacaSkinfold: number;
  peitoralSkinfold: number;
  axilarMediaSkinfold: number;
  panturrilhaSkinfold: number;
  cintura: number;
  abdomen: number;
  quadril: number;
  rcq: number;
  bracoContraido: number;
  coxaMedial: number;
  panturrilha: number;
  torax: number;
  benchPress1Rm: number;
  squat1Rm: number;
  legPress1Rm: number;
  deadlift1Rm: number;
  handgripKgf: number;
  yoyoVo2Max: number;
  yoyoDistanceMeters: number;
  rastPeakWatts: number;
  tTestSeconds: number;
  cooperDistanceMeters: number;
  oneMileVo2Max: number;
  cmjHeightCm: number;
  cmjSayersWatts: number;
  sjHeightCm: number;
  elasticityIndexPct: number;
  dropJumpRsi: number;
  fmsTotalScore: number;
  wellsFlexibilityCm: number;
  // Fotos & Postura
  postureSymmetryPct: number;
  shoulderAlignmentPct: number;
  pelvicAlignmentPct: number;
  cervicalAlignmentPct: number;
  escapularDeviationDeg: number;
  // Anamnese
  painEva: number;
  sleepHours: number;
  stressLevel: number;
  waterIntakeLiters: number;
  trainingAdherencePct: number;
  energyLevel: number;
  // Funcional adicionais
  deepSquatScore: number;
  hurdleStepScore: number;
  inlineLungeScore: number;
  shoulderMobilityScore: number;
  activeStraightLegScore: number;
  trunkStabilityScore: number;
  // Força & Salto adicionais
  unipodalAsymmetryPct: number;
  // Campo adicionais
  rastFatiguePct: number;
  // Testes personalizados
  suspensaoKimonoSeconds: number;
  pullupsCrossfitReps: number;
  tiro30mSeconds: number;
  pranchaAbdominalSeconds: number;
  flexaoBracoReps: number;
}

export const getStudentObjectives = (std: Student, latest?: PhysicalAssessmentData): StudentGoals => {
  const isFemale = (std as any).gender?.toLowerCase() === 'feminino';
  const idealWeight = latest?.composition?.idealWeightKg || (isFemale ? 58.0 : 72.0);
  const idealFat = latest?.composition?.idealFatPercentage || (isFemale ? 18.0 : 12.0);
  const idealLean = Number((idealWeight * (1 - idealFat / 100)).toFixed(1));
  const idealFatMass = Number((idealWeight * (idealFat / 100)).toFixed(1));
  const idealHeight = latest?.heightCm || (isFemale ? 165 : 178);
  const idealBmi = Number((idealWeight / Math.pow(idealHeight / 100, 2)).toFixed(1));

  return {
    weightKg: idealWeight,
    bodyFatPercentage: idealFat,
    leanMassKg: idealLean,
    fatMassKg: idealFatMass,
    bmi: idealBmi,
    bmr: isFemale ? 1420 : 1800,
    muscleMassKg: Number((idealLean * 0.62).toFixed(1)),
    visceralFatLevel: 3,
    totalBodyWaterLiters: Number((idealWeight * (isFemale ? 0.58 : 0.63)).toFixed(1)),
    skinfoldsTotal: isFemale ? 85.0 : 55.0,
    abdominalSkinfold: isFemale ? 14.0 : 10.0,
    coxaSkinfold: isFemale ? 16.0 : 9.0,
    tricepsSkinfold: isFemale ? 11.0 : 7.0,
    subescapularSkinfold: isFemale ? 11.0 : 9.0,
    suprailiacaSkinfold: isFemale ? 12.0 : 8.0,
    peitoralSkinfold: isFemale ? 8.0 : 6.0,
    axilarMediaSkinfold: isFemale ? 10.0 : 7.5,
    panturrilhaSkinfold: isFemale ? 9.0 : 6.0,
    cintura: isFemale ? 66.0 : 76.0,
    abdomen: isFemale ? 70.0 : 80.0,
    quadril: isFemale ? 96.0 : 98.0,
    rcq: isFemale ? 0.69 : 0.78,
    bracoContraido: isFemale ? 31.0 : 40.0,
    coxaMedial: isFemale ? 56.0 : 58.0,
    panturrilha: isFemale ? 35.0 : 38.0,
    torax: isFemale ? 90.0 : 106.0,
    benchPress1Rm: isFemale ? 55 : 110,
    squat1Rm: isFemale ? 85 : 145,
    legPress1Rm: isFemale ? 190 : 300,
    deadlift1Rm: isFemale ? 95 : 160,
    handgripKgf: isFemale ? 35 : 52,
    yoyoVo2Max: isFemale ? 48.0 : 55.0,
    yoyoDistanceMeters: isFemale ? 1200 : 1600,
    rastPeakWatts: isFemale ? 480 : 750,
    tTestSeconds: isFemale ? 10.5 : 9.4,
    cooperDistanceMeters: isFemale ? 2500 : 3000,
    oneMileVo2Max: isFemale ? 45.0 : 52.0,
    cmjHeightCm: isFemale ? 35.0 : 45.0,
    cmjSayersWatts: isFemale ? 2800 : 4100,
    sjHeightCm: isFemale ? 30.0 : 40.0,
    elasticityIndexPct: 14.0,
    dropJumpRsi: 2.30,
    fmsTotalScore: 18,
    wellsFlexibilityCm: isFemale ? 38.0 : 36.0,
    // Fotos & Postura
    postureSymmetryPct: 96.0,
    shoulderAlignmentPct: 98.0,
    pelvicAlignmentPct: 96.0,
    cervicalAlignmentPct: 97.0,
    escapularDeviationDeg: 0.8,
    // Anamnese
    painEva: 1.0,
    sleepHours: 8.0,
    stressLevel: 2.5,
    waterIntakeLiters: isFemale ? 2.8 : 3.5,
    trainingAdherencePct: 95.0,
    energyLevel: 9.0,
    // Funcional
    deepSquatScore: 3.0,
    hurdleStepScore: 3.0,
    inlineLungeScore: 3.0,
    shoulderMobilityScore: 3.0,
    activeStraightLegScore: 3.0,
    trunkStabilityScore: 3.0,
    // Força & Salto
    unipodalAsymmetryPct: 3.0,
    // Campo
    rastFatiguePct: 22.0,
    // Personalizados
    suspensaoKimonoSeconds: 65,
    pullupsCrossfitReps: isFemale ? 15 : 26,
    tiro30mSeconds: isFemale ? 4.25 : 3.85,
    pranchaAbdominalSeconds: 120,
    flexaoBracoReps: isFemale ? 30 : 48
  };
};

export interface MetricConfig {
  id: string;
  name: string;
  unit: string;
  category: string;
  desiredDirection: 'lower' | 'higher';
  decimals?: number;
  color: string;
  getValue: (a: PhysicalAssessmentData) => number;
  getTarget: (goals: StudentGoals) => number;
}

export const METRIC_CATEGORIES = [
  { id: 'todas', label: 'Todos os Setores', shortLabel: 'Geral', color: '#2563eb', bgClass: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'Composição corporal', label: 'Composição corporal', shortLabel: 'Composição', color: '#0284c7', bgClass: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'fotos', label: 'fotos', shortLabel: 'Fotos & Postura', color: '#d946ef', bgClass: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
  { id: 'Anamnese', label: 'Anamnese', shortLabel: 'Anamnese', color: '#8b5cf6', bgClass: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'testes funcionais', label: 'testes funcionais', shortLabel: 'Funcional', color: '#059669', bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'testes de força e salto', label: 'testes de força e salto', shortLabel: 'Força & Salto', color: '#ea580c', bgClass: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'testes de campo', label: 'testes de campo', shortLabel: 'Campo & Cardio', color: '#4f46e5', bgClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'testes personalizados', label: 'testes personalizados', shortLabel: 'Personalizados', color: '#d97706', bgClass: 'bg-amber-50 text-amber-700 border-amber-200' },
];

export const METRICS_CONFIG: MetricConfig[] = [
  // 1. SETOR: Composição corporal
  { id: 'weight', name: 'Peso Corporal Total', unit: 'kg', category: 'Composição corporal', desiredDirection: 'lower', decimals: 1, color: '#2563eb', getValue: a => a.weightKg, getTarget: g => g.weightKg },
  { id: 'fatPct', name: '% Gordura Corporal', unit: '%', category: 'Composição corporal', desiredDirection: 'lower', decimals: 1, color: '#06b6d4', getValue: a => a.composition?.bodyFatPercentage || 14.2, getTarget: g => g.bodyFatPercentage },
  { id: 'leanMass', name: 'Massa Magra', unit: 'kg', category: 'Composição corporal', desiredDirection: 'higher', decimals: 1, color: '#059669', getValue: a => a.composition?.leanMassKg || 63.8, getTarget: g => g.leanMassKg },
  { id: 'fatMass', name: 'Massa Gorda', unit: 'kg', category: 'Composição corporal', desiredDirection: 'lower', decimals: 1, color: '#e11d48', getValue: a => a.composition?.fatMassKg || 10.2, getTarget: g => g.fatMassKg },
  { id: 'bmi', name: 'Índice de Massa Corporal (IMC)', unit: 'kg/m²', category: 'Composição corporal', desiredDirection: 'lower', decimals: 1, color: '#6366f1', getValue: a => a.bmi || 23.4, getTarget: g => g.bmi },
  { id: 'bmr', name: 'Taxa Metabólica Basal (TMB)', unit: 'kcal', category: 'Composição corporal', desiredDirection: 'higher', decimals: 0, color: '#8b5cf6', getValue: a => a.bmr || 1730, getTarget: g => g.bmr },
  { id: 'water', name: 'Água Corporal Total', unit: 'L', category: 'Composição corporal', desiredDirection: 'higher', decimals: 1, color: '#0284c7', getValue: a => (a as any).bioimpedance?.totalBodyWaterLiters || 46.5, getTarget: g => g.totalBodyWaterLiters },
  { id: 'visceral', name: 'Gordura Visceral', unit: 'Nível', category: 'Composição corporal', desiredDirection: 'lower', decimals: 0, color: '#d97706', getValue: a => (a as any).bioimpedance?.visceralFatLevel || 4, getTarget: g => g.visceralFatLevel },
  { id: 'skinfoldsTotal', name: 'Soma de 9 Dobras (Σ)', unit: 'mm', category: 'Composição corporal', desiredDirection: 'lower', decimals: 1, color: '#2563eb', getValue: a => a.skinfolds?.total || 72, getTarget: g => g.skinfoldsTotal },
  { id: 'skinfoldAbdominal', name: 'Dobra Abdominal', unit: 'mm', category: 'Composição corporal', desiredDirection: 'lower', decimals: 1, color: '#0891b2', getValue: a => a.skinfolds?.abdominal || 14, getTarget: g => g.abdominalSkinfold },
  { id: 'skinfoldCoxa', name: 'Dobra Coxa Medial', unit: 'mm', category: 'Composição corporal', desiredDirection: 'lower', decimals: 1, color: '#0d9488', getValue: a => a.skinfolds?.coxa || 12, getTarget: g => g.coxaSkinfold },
  { id: 'skinfoldTriceps', name: 'Dobra Tríceps', unit: 'mm', category: 'Composição corporal', desiredDirection: 'lower', decimals: 1, color: '#3b82f6', getValue: a => a.skinfolds?.triceps || 9, getTarget: g => g.tricepsSkinfold },
  { id: 'cintura', name: 'Circunferência da Cintura', unit: 'cm', category: 'Composição corporal', desiredDirection: 'lower', decimals: 1, color: '#f43f5e', getValue: a => a.perimetry?.cintura || 79.0, getTarget: g => g.cintura },
  { id: 'abdomen', name: 'Circunferência Abdominal', unit: 'cm', category: 'Composição corporal', desiredDirection: 'lower', decimals: 1, color: '#ea580c', getValue: a => a.perimetry?.abdomen || 83.0, getTarget: g => g.abdomen },
  { id: 'quadril', name: 'Circunferência do Quadril', unit: 'cm', category: 'Composição corporal', desiredDirection: 'lower', decimals: 1, color: '#a855f7', getValue: a => a.perimetry?.quadril || 99.0, getTarget: g => g.quadril },
  { id: 'rcq', name: 'Relação Cintura-Quadril (RCQ)', unit: '', category: 'Composição corporal', desiredDirection: 'lower', decimals: 2, color: '#dc2626', getValue: a => a.perimetry?.rcq || 0.80, getTarget: g => g.rcq },
  { id: 'bracoContr', name: 'Braço Direito Contraído', unit: 'cm', category: 'Composição corporal', desiredDirection: 'higher', decimals: 1, color: '#10b981', getValue: a => a.perimetry?.bracoDireitoContraido || 38.5, getTarget: g => g.bracoContraido },
  { id: 'coxaMedial', name: 'Coxa Direita Medial', unit: 'cm', category: 'Composição corporal', desiredDirection: 'higher', decimals: 1, color: '#059669', getValue: a => a.perimetry?.coxaDireitaMedial || 56.5, getTarget: g => g.coxaMedial },

  // 2. SETOR: fotos (Análise Fotográfica & Postural)
  { id: 'postureSymmetry', name: 'Índice de Simetria Postural', unit: '%', category: 'fotos', desiredDirection: 'higher', decimals: 1, color: '#d946ef', getValue: a => (a as any).photos?.symmetryScorePct || ((a.composition?.bodyFatPercentage ? 96 - (a.composition.bodyFatPercentage > 18 ? 4 : 1) : 95)), getTarget: g => g.postureSymmetryPct },
  { id: 'shoulderAlign', name: 'Alinhamento dos Ombros', unit: '%', category: 'fotos', desiredDirection: 'higher', decimals: 1, color: '#ec4899', getValue: a => (a as any).photos?.shoulderAlignmentPct || 97.5, getTarget: g => g.shoulderAlignmentPct },
  { id: 'pelvicAlign', name: 'Alinhamento Pélvico / Quadril', unit: '%', category: 'fotos', desiredDirection: 'higher', decimals: 1, color: '#a855f7', getValue: a => (a as any).photos?.pelvicAlignmentPct || 96.2, getTarget: g => g.pelvicAlignmentPct },
  { id: 'cervicalAlign', name: 'Alinhamento Cervical / Cabeça', unit: '%', category: 'fotos', desiredDirection: 'higher', decimals: 1, color: '#8b5cf6', getValue: a => (a as any).photos?.cervicalAlignmentPct || 96.8, getTarget: g => g.cervicalAlignmentPct },
  { id: 'escapularDev', name: 'Desvio Escapular Lateral', unit: '°', category: 'fotos', desiredDirection: 'lower', decimals: 1, color: '#f43f5e', getValue: a => (a as any).photos?.escapularDeviationDeg || 0.9, getTarget: g => g.escapularDeviationDeg },

  // 3. SETOR: Anamnese (Prontidão, Hábitos e Sintomas)
  { id: 'painEva', name: 'Nível de Dor / Desconforto (EVA)', unit: 'pts', category: 'Anamnese', desiredDirection: 'lower', decimals: 1, color: '#ef4444', getValue: a => (a as any).anamnesis?.painEva !== undefined ? (a as any).anamnesis.painEva : (a.weightKg > 80 ? 2 : 1), getTarget: g => g.painEva },
  { id: 'sleepHours', name: 'Horas de Sono por Noite', unit: 'h', category: 'Anamnese', desiredDirection: 'higher', decimals: 1, color: '#6366f1', getValue: a => a.anamnesis?.sleepHours || 7.5, getTarget: g => g.sleepHours },
  { id: 'stressLevel', name: 'Nível de Estresse Percebido', unit: 'pts', category: 'Anamnese', desiredDirection: 'lower', decimals: 1, color: '#f59e0b', getValue: a => (a as any).anamnesis?.stressLevel || 3.5, getTarget: g => g.stressLevel },
  { id: 'waterIntake', name: 'Ingestão Hídrica Diária', unit: 'L', category: 'Anamnese', desiredDirection: 'higher', decimals: 1, color: '#0284c7', getValue: a => a.anamnesis?.waterIntakeLiters || 3.0, getTarget: g => g.waterIntakeLiters },
  { id: 'trainingAdh', name: 'Adesão ao Treino Prescrito', unit: '%', category: 'Anamnese', desiredDirection: 'higher', decimals: 0, color: '#10b981', getValue: a => (a as any).anamnesis?.trainingAdherencePct || 92, getTarget: g => g.trainingAdherencePct },
  { id: 'energyLevel', name: 'Nível de Disposição & Energia', unit: 'pts', category: 'Anamnese', desiredDirection: 'higher', decimals: 1, color: '#8b5cf6', getValue: a => (a as any).anamnesis?.energyLevel || 8.5, getTarget: g => g.energyLevel },

  // 4. SETOR: testes funcionais (FMS & Mobilidade)
  { id: 'fmsScore', name: 'Score Total FMS', unit: 'pts', category: 'testes funcionais', desiredDirection: 'higher', decimals: 0, color: '#059669', getValue: a => (a as any).functional?.fmsTotalScore || 17, getTarget: g => g.fmsTotalScore },
  { id: 'wells', name: 'Flexibilidade Banco de Wells', unit: 'cm', category: 'testes funcionais', desiredDirection: 'higher', decimals: 1, color: '#0d9488', getValue: a => (a as any).functional?.wellsFlexibilityCm || 34.0, getTarget: g => g.wellsFlexibilityCm },
  { id: 'deepSquat', name: 'Agachamento Profundo FMS', unit: 'pts', category: 'testes funcionais', desiredDirection: 'higher', decimals: 0, color: '#65a30d', getValue: a => (a as any).functional?.deepSquatScore || 3, getTarget: g => g.deepSquatScore },
  { id: 'hurdleStep', name: 'Passo sobre a Barreira FMS', unit: 'pts', category: 'testes funcionais', desiredDirection: 'higher', decimals: 0, color: '#10b981', getValue: a => (a as any).functional?.hurdleStepScore || 2, getTarget: g => g.hurdleStepScore },
  { id: 'shoulderMob', name: 'Mobilidade de Ombro FMS', unit: 'pts', category: 'testes funcionais', desiredDirection: 'higher', decimals: 0, color: '#0284c7', getValue: a => (a as any).functional?.shoulderMobilityScore || 3, getTarget: g => g.shoulderMobilityScore },
  { id: 'trunkStab', name: 'Estabilidade de Tronco FMS', unit: 'pts', category: 'testes funcionais', desiredDirection: 'higher', decimals: 0, color: '#65a30d', getValue: a => (a as any).functional?.trunkStabilityScore || 3, getTarget: g => g.trunkStabilityScore },

  // 5. SETOR: testes de força e salto (1RM & Pliometria Bosco)
  { id: 'benchPress', name: 'Supino Reto (1RM)', unit: 'kg', category: 'testes de força e salto', desiredDirection: 'higher', decimals: 0, color: '#ea580c', getValue: a => (a as any).force?.benchPress1Rm || 105, getTarget: g => g.benchPress1Rm },
  { id: 'squat', name: 'Agachamento Livre (1RM)', unit: 'kg', category: 'testes de força e salto', desiredDirection: 'higher', decimals: 0, color: '#dc2626', getValue: a => (a as any).force?.squat1Rm || 135, getTarget: g => g.squat1Rm },
  { id: 'deadlift', name: 'Levantamento Terra (1RM)', unit: 'kg', category: 'testes de força e salto', desiredDirection: 'higher', decimals: 0, color: '#b91c1c', getValue: a => (a as any).force?.deadlift1Rm || 150, getTarget: g => g.deadlift1Rm },
  { id: 'legPress', name: 'Leg Press 45° (1RM)', unit: 'kg', category: 'testes de força e salto', desiredDirection: 'higher', decimals: 0, color: '#f97316', getValue: a => (a as any).force?.legPress1Rm || 280, getTarget: g => g.legPress1Rm },
  { id: 'jamar', name: 'Dinamometria Jamar Direita', unit: 'kgf', category: 'testes de força e salto', desiredDirection: 'higher', decimals: 0, color: '#d97706', getValue: a => (a as any).force?.handgripRightKgf || 48, getTarget: g => g.handgripKgf },
  { id: 'cmjHeight', name: 'Salto Vertical CMJ', unit: 'cm', category: 'testes de força e salto', desiredDirection: 'higher', decimals: 1, color: '#8b5cf6', getValue: a => (a as any).jump?.cmjHeightCm || 42.5, getTarget: g => g.cmjHeightCm },
  { id: 'sjHeight', name: 'Squat Jump (SJ)', unit: 'cm', category: 'testes de força e salto', desiredDirection: 'higher', decimals: 1, color: '#7c3aed', getValue: a => (a as any).jump?.sjHeightCm || 37.0, getTarget: g => g.sjHeightCm },
  { id: 'cmjWatts', name: 'Potência Sayers CMJ', unit: 'W', category: 'testes de força e salto', desiredDirection: 'higher', decimals: 0, color: '#ea580c', getValue: a => (a as any).jump?.cmjSayersWatts || 3890, getTarget: g => g.cmjSayersWatts },
  { id: 'dropJump', name: 'Drop Jump (Índice RSI)', unit: '', category: 'testes de força e salto', desiredDirection: 'higher', decimals: 2, color: '#ec4899', getValue: a => (a as any).jump?.dropJumpRsi || 2.15, getTarget: g => g.dropJumpRsi },
  { id: 'jumpAsymm', name: 'Assimetria Salto Unipodal', unit: '%', category: 'testes de força e salto', desiredDirection: 'lower', decimals: 1, color: '#ef4444', getValue: a => (a as any).jump?.unipodalAsymmetryPct || 2.5, getTarget: g => g.unipodalAsymmetryPct },

  // 6. SETOR: testes de campo (VO2máx, Yo-Yo, RAST, Agilidade & Cooper)
  { id: 'yoyoVo2', name: 'VO2máx Yo-Yo IR1', unit: 'ml/kg/min', category: 'testes de campo', desiredDirection: 'higher', decimals: 1, color: '#2563eb', getValue: a => (a as any).field?.yoyoVo2Max || 52.8, getTarget: g => g.yoyoVo2Max },
  { id: 'yoyoDist', name: 'Distância Yo-Yo IR1', unit: 'm', category: 'testes de campo', desiredDirection: 'higher', decimals: 0, color: '#4f46e5', getValue: a => (a as any).field?.yoyoDistanceMeters || 1480, getTarget: g => g.yoyoDistanceMeters },
  { id: 'rastWatts', name: 'Potência Pico RAST', unit: 'W', category: 'testes de campo', desiredDirection: 'higher', decimals: 0, color: '#7c3aed', getValue: a => (a as any).field?.rastPeakWatts || 685, getTarget: g => g.rastPeakWatts },
  { id: 'rastFatigue', name: 'Índice de Fadiga RAST', unit: '%', category: 'testes de campo', desiredDirection: 'lower', decimals: 1, color: '#dc2626', getValue: a => (a as any).field?.rastFatiguePct || 26.5, getTarget: g => g.rastFatiguePct },
  { id: 'tTest', name: 'Teste T Agilidade', unit: 's', category: 'testes de campo', desiredDirection: 'lower', decimals: 2, color: '#0891b2', getValue: a => (a as any).field?.tTestSeconds || 9.72, getTarget: g => g.tTestSeconds },
  { id: 'cooper', name: 'Teste de Cooper 12min', unit: 'm', category: 'testes de campo', desiredDirection: 'higher', decimals: 0, color: '#0284c7', getValue: a => (a as any).field?.cooperDistanceMeters || 2850, getTarget: g => g.cooperDistanceMeters },
  { id: 'cooperVo2', name: 'VO2máx Cooper Estimado', unit: 'ml/kg/min', category: 'testes de campo', desiredDirection: 'higher', decimals: 1, color: '#3b82f6', getValue: a => (a as any).field?.cooperVo2Max || 52.3, getTarget: g => g.oneMileVo2Max },

  // 7. SETOR: testes personalizados (Testes Customizados Específicos)
  { id: 'customKimono', name: 'Suspensão no Kimono / Barra', unit: 's', category: 'testes personalizados', desiredDirection: 'higher', decimals: 0, color: '#d97706', getValue: a => ((a as any).customTests?.[0]?.value ? Number((a as any).customTests[0].value) : 62), getTarget: g => g.suspensaoKimonoSeconds },
  { id: 'customPullups', name: 'Pull-ups Unbroken CrossFit', unit: 'reps', category: 'testes personalizados', desiredDirection: 'higher', decimals: 0, color: '#8b5cf6', getValue: a => ((a as any).customTests?.[1]?.value ? Number((a as any).customTests[1].value) : 24), getTarget: g => g.pullupsCrossfitReps },
  { id: 'customSprint30', name: 'Tiro de 30m Lançado Velocidade', unit: 's', category: 'testes personalizados', desiredDirection: 'lower', decimals: 2, color: '#ef4444', getValue: a => ((a as any).customTests?.[2]?.value ? Number((a as any).customTests[2].value) : 3.92), getTarget: g => g.tiro30mSeconds },
  { id: 'customPlank', name: 'Prancha Isométrica Abdominal', unit: 's', category: 'testes personalizados', desiredDirection: 'higher', decimals: 0, color: '#059669', getValue: a => ((a as any).customTests?.[3]?.value ? Number((a as any).customTests[3].value) : 95), getTarget: g => g.pranchaAbdominalSeconds },
  { id: 'customPushups', name: 'Flexões de Braço (1 min)', unit: 'reps', category: 'testes personalizados', desiredDirection: 'higher', decimals: 0, color: '#2563eb', getValue: a => ((a as any).customTests?.[4]?.value ? Number((a as any).customTests[4].value) : 42), getTarget: g => g.flexaoBracoReps }
];

export const MetricLineChartCard: React.FC<{
  id: string;
  name: string;
  unit: string;
  category: string;
  desiredDirection: 'lower' | 'higher';
  decimals?: number;
  color?: string;
  points: { date: string; value: number }[];
  targetGoal: number;
}> = ({
  id,
  name,
  unit,
  category,
  desiredDirection,
  decimals = 1,
  color = '#2563eb',
  points,
  targetGoal
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const p0 = points[0]?.value ?? 0;
  const pLast = points[points.length - 1]?.value ?? 0;
  const delta = pLast - p0;
  const distanceToGoal = pLast - targetGoal;
  const isGoalReached = desiredDirection === 'lower' ? pLast <= targetGoal : pLast >= targetGoal;
  const isProgressing = desiredDirection === 'lower' ? delta < 0 : delta > 0;

  const svgWidth = 320;
  const svgHeight = 130;
  const padLeft = 24;
  const padRight = 24;
  const padTop = 22;
  const padBottom = 22;
  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const allVals = [...points.map(p => p.value), targetGoal];
  const minV = Math.min(...allVals);
  const maxV = Math.max(...allVals);
  const diffV = maxV - minV || (maxV * 0.1 || 1);
  const yMin = Math.max(0, minV - diffV * 0.25);
  const yMax = maxV + diffV * 0.25;
  const yRange = yMax - yMin || 1;

  const getY = (v: number) => padTop + chartH - ((v - yMin) / yRange) * chartH;
  const getX = (i: number) => points.length <= 1 ? padLeft + chartW / 2 : padLeft + (i / (points.length - 1)) * chartW;

  const yTarget = getY(targetGoal);
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.value)}`).join(' ');
  const areaPath = points.length > 1
    ? `${linePath} L ${getX(points.length - 1)} ${padTop + chartH} L ${getX(0)} ${padTop + chartH} Z`
    : '';

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-3 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span 
            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            {category}
          </span>
          <span className="text-[10px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 shadow-2xs">
            <Target className="w-3 h-3 text-amber-600" />
            <span>Meta: {targetGoal}{unit ? ` ${unit}` : ''}</span>
          </span>
        </div>
        <h4 className="text-xs font-black text-slate-900 truncate" title={name}>
          {name}
        </h4>
      </div>

      <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
        <div>
          <span className="text-[9px] text-slate-400 font-bold block uppercase">Inicial</span>
          <strong className="text-slate-700 font-black">{p0.toFixed(decimals)}{unit ? ` ${unit}` : ''}</strong>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 font-bold block uppercase">Atual</span>
          <strong className="font-black" style={{ color }}>{pLast.toFixed(decimals)}{unit ? ` ${unit}` : ''}</strong>
        </div>
        <div>
          <span className="text-[9px] text-slate-400 font-bold block uppercase">Variação (Δ)</span>
          <strong className={`font-black flex items-center gap-0.5 ${
            delta === 0 ? 'text-slate-600' : isProgressing ? 'text-emerald-700' : 'text-rose-600'
          }`}>
            {delta > 0 ? `+${delta.toFixed(decimals)}` : delta.toFixed(decimals)}
            {delta !== 0 && (
              isProgressing ? <TrendingDown className="w-3 h-3 inline" /> : <TrendingUp className="w-3 h-3 inline" />
            )}
          </strong>
        </div>
      </div>

      {/* Gráfico SVG com Hover Tooltip Interativo */}
      <div className="relative w-full bg-gradient-to-b from-slate-50/50 to-white rounded-xl border border-slate-100/80 p-1">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-28 overflow-visible">
          <defs>
            <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Linhas de grade sutis */}
          <line x1={padLeft} y1={padTop} x2={svgWidth - padRight} y2={padTop} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={padLeft} y1={padTop + chartH / 2} x2={svgWidth - padRight} y2={padTop + chartH / 2} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={padLeft} y1={padTop + chartH} x2={svgWidth - padRight} y2={padTop + chartH} stroke="#e2e8f0" strokeWidth="1" />

          {/* Área preenchida sob a curva */}
          {areaPath && (
            <path d={areaPath} fill={`url(#grad-${id})`} />
          )}

          {/* Linha Base do Objetivo Cadastrado (amarela/âmbar tracejada com badge) */}
          <line
            x1={padLeft}
            y1={yTarget}
            x2={svgWidth - padRight}
            y2={yTarget}
            stroke="#f59e0b"
            strokeWidth="1.8"
            strokeDasharray="4 3"
          />
          <g transform={`translate(${svgWidth - padRight - 72}, ${Math.max(2, yTarget - 13)})`}>
            <rect width="72" height="13" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="0.8" />
            <text x="36" y="9.5" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#92400e">
              Meta: {targetGoal}{unit ? ` ${unit}` : ''}
            </text>
          </g>

          {/* Linha de Evolução Conectando Avaliações */}
          {points.length > 1 && (
            <path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Pontos de cada avaliação com interação hover */}
          {points.map((p, i) => {
            const cx = getX(i);
            const cy = getY(p.value);
            const isHovered = hoveredIdx === i;

            return (
              <g 
                key={i} 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Linha vertical de foco no hover */}
                {isHovered && (
                  <line 
                    x1={cx} 
                    y1={padTop} 
                    x2={cx} 
                    y2={padTop + chartH} 
                    stroke={color} 
                    strokeWidth="1" 
                    strokeDasharray="2 2" 
                    opacity="0.6"
                  />
                )}

                {/* Nó do Ponto */}
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={isHovered ? 6 : 4} 
                  fill={color} 
                  stroke="#ffffff" 
                  strokeWidth={isHovered ? 2.5 : 2} 
                />

                {/* Valor fixo acima do ponto */}
                <text
                  x={cx}
                  y={Math.max(12, cy - 7)}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="900"
                  fill="#0f172a"
                >
                  {p.value.toFixed(decimals)}{unit ? ` ${unit}` : ''}
                </text>

                {/* Data no rodapé */}
                <text
                  x={cx}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="bold"
                  fill={isHovered ? color : '#64748b'}
                >
                  {p.date}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip flutuante ao passar o cursor sobre os pontos */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <div 
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-lg pointer-events-none z-10 flex items-center gap-2 animate-in fade-in zoom-in-95"
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <div>
              <span className="font-bold text-slate-300">{points[hoveredIdx].date}: </span>
              <strong className="font-black text-white">{points[hoveredIdx].value.toFixed(decimals)}{unit ? ` ${unit}` : ''}</strong>
              <span className="text-amber-300 ml-1.5 font-semibold">(Meta: {targetGoal}{unit})</span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
        <span className="text-slate-400 font-semibold">Status do Objetivo:</span>
        {isGoalReached ? (
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>✓ Objetivo Alcançado!</span>
          </span>
        ) : (
          <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Faltam {Math.abs(distanceToGoal).toFixed(decimals)}{unit ? ` ${unit}` : ''} para a meta
          </span>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// VISUALIZADOR ESPECIALIZADO DO SETOR: FOTOS POSTURAIS & SIMETRIA
// =========================================================================
export const PhotosSectorViewer: React.FC<{
  assessments: PhysicalAssessmentData[];
  student: Student;
}> = ({
  assessments,
  student
}) => {
  const [activeAngle, setActiveAngle] = useState<'anterior' | 'posterior' | 'lateral_direita' | 'lateral_esquerda'>('anterior');
  const [showPlumLine, setShowPlumLine] = useState<boolean>(true);
  const [photoMode, setPhotoMode] = useState<'lado_a_lado' | 'antes_depois'>('lado_a_lado');

  const angles = [
    { id: 'anterior', label: 'Anterior (Frente)' },
    { id: 'posterior', label: 'Posterior (Costas)' },
    { id: 'lateral_direita', label: 'Lateral Direita' },
    { id: 'lateral_esquerda', label: 'Lateral Esquerda' },
  ];

  const firstAv = assessments[0];
  const lastAv = assessments[assessments.length - 1];

  return (
    <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-fuchsia-50 text-fuchsia-700 px-2 py-0.5 rounded-full border border-fuchsia-200 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-fuchsia-600" />
              <span>Setor: Análise Fotográfica & Postura</span>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">
              Evolução e Simetria Biomecânica
            </span>
          </div>
          <h4 className="text-base font-black text-slate-900 mt-1">
            Comparativo Fotográfico com Linhas de Alinhamento Postural
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPlumLine(!showPlumLine)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              showPlumLine 
                ? 'bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-300 shadow-2xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-fuchsia-600" />
            <span>{showPlumLine ? 'Grade de Alinhamento Ativa' : 'Grade Oculta'}</span>
          </button>
        </div>
      </div>

      {/* Seletor de Ângulos */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {angles.map(a => (
          <button
            key={a.id}
            type="button"
            onClick={() => setActiveAngle(a.id as any)}
            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
              activeAngle === a.id
                ? 'bg-fuchsia-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Painel Comparativo das Fotos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Foto Inicial */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700">Avaliação Inicial</span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {formatDateDisplay(firstAv?.date)}
            </span>
          </div>
          
          <div className="relative aspect-[3/4] bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 rounded-xl overflow-hidden flex items-center justify-center border border-slate-300 shadow-inner">
            {/* Silhueta Anatômica Representativa */}
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-500">
              <Camera className="w-12 h-12 text-slate-400 stroke-[1.5]" />
              <div className="text-xs font-black text-slate-700 uppercase">
                {activeAngle.replace('_', ' ')}
              </div>
              <p className="text-[10px] text-slate-500 max-w-[200px]">
                Registro fotográfico de {formatDateDisplay(firstAv?.date)} cadastrado no protocolo
              </p>
            </div>

            {/* Grade de Alinhamento Postural / Fio de Prumo SVG Sobreposta */}
            {showPlumLine && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Linha Central (Fio de Prumo) */}
                <line x1="50" y1="5" x2="50" y2="95" stroke="#ec4899" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
                {/* Linha Bi-acromial (Ombros) */}
                <line x1="15" y1="28" x2="85" y2="28" stroke="#06b6d4" strokeWidth="0.8" />
                {/* Linha Bi-ilíaca (Quadril) */}
                <line x1="20" y1="52" x2="80" y2="52" stroke="#06b6d4" strokeWidth="0.8" />
                {/* Linha Patelar (Joelhos) */}
                <line x1="25" y1="74" x2="75" y2="74" stroke="#06b6d4" strokeWidth="0.8" />
              </svg>
            )}
          </div>
        </div>

        {/* Foto Recente */}
        <div className="p-4 rounded-2xl bg-fuchsia-50/40 border border-fuchsia-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-fuchsia-950">Avaliação Mais Recente</span>
            <span className="text-[11px] font-bold text-fuchsia-800 bg-fuchsia-100 px-2 py-0.5 rounded border border-fuchsia-300">
              {formatDateDisplay(lastAv?.date)}
            </span>
          </div>
          
          <div className="relative aspect-[3/4] bg-gradient-to-b from-fuchsia-100/50 via-slate-50 to-fuchsia-100/50 rounded-xl overflow-hidden flex items-center justify-center border border-fuchsia-300 shadow-inner">
            {/* Silhueta Anatômica Representativa */}
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-500">
              <Camera className="w-12 h-12 text-fuchsia-500 stroke-[1.5]" />
              <div className="text-xs font-black text-fuchsia-900 uppercase">
                {activeAngle.replace('_', ' ')}
              </div>
              <p className="text-[10px] text-fuchsia-800 max-w-[200px]">
                Registro fotográfico de {formatDateDisplay(lastAv?.date)} com evolução postural
              </p>
            </div>

            {/* Grade de Alinhamento Postural / Fio de Prumo SVG Sobreposta */}
            {showPlumLine && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="50" y1="5" x2="50" y2="95" stroke="#ec4899" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
                <line x1="15" y1="28" x2="85" y2="28" stroke="#06b6d4" strokeWidth="0.8" />
                <line x1="20" y1="52" x2="80" y2="52" stroke="#06b6d4" strokeWidth="0.8" />
                <line x1="25" y1="74" x2="75" y2="74" stroke="#06b6d4" strokeWidth="0.8" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  return dateStr;
};

export const parseDateToTime = (d: string) => {
  if (!d) return 0;
  if (d.includes('-')) {
    return new Date(d).getTime() || 0;
  }
  const parts = d.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day).getTime();
  }
  return new Date(d).getTime() || 0;
};

interface AvaliacoesHubViewProps {
  students: Student[];
  student: Student;
  onSelectStudentId?: (id: string) => void;
  onNavigateToConfig?: (protocolId?: string) => void;
}

export const AvaliacoesHubView: React.FC<AvaliacoesHubViewProps> = ({
  students,
  student: initialStudent,
  onSelectStudentId,
  onNavigateToConfig
}) => {
  // Aluno atualmente selecionado para operações
  const [selectedStudent, setSelectedStudent] = useState<Student>(initialStudent || students[0]);

  // Sincroniza se a prop mudar
  useEffect(() => {
    if (initialStudent) {
      setSelectedStudent(initialStudent);
    }
  }, [initialStudent]);

  const handleStudentChange = (newStudentId: string) => {
    const found = students.find(s => s.id === newStudentId);
    if (found) {
      setSelectedStudent(found);
      setAnalysisStudentId(found.id);
      setPdfStudentId(found.id);
      setIsAnalysisExecuted(false);
      const list = getAssessmentsForStudent(found);
      setStudentAssessments(list);
      setAnalysisSelectedIds(list.map(a => a.id));
      setSingleConsultationId(list[0]?.id || null);
      if (onSelectStudentId) onSelectStudentId(found.id);
    }
  };

  const STORAGE_KEY_SESSIONS = `glprofit_assessment_sessions_${selectedStudent.id}`;
  const STORAGE_KEY_DRAFT = `glprofit_draft_assessment_${selectedStudent.id}`;

  // Modos de visualização da tela principal
  // 'dashboard' = Tela inicial com botões, gráficos e histórico (SEM SELEÇÃO DE ALUNO NO TOPO)
  // 'select_protocols' = Passo 1 de Nova Avaliação (selecionar aluno + quais avaliações realizar)
  // 'session_filling' = Modo de preenchimento ativo com cards quadrados no topo e tela central
  // 'analyze_view' = Modo de análise (com seletor de aluno, consulta de 1 avaliação ou comparativo de múltiplas)
  const [viewMode, setViewMode] = useState<'dashboard' | 'select_protocols' | 'session_filling' | 'analyze_view'>('dashboard');

  // Protocolos selecionados para a Nova Avaliação
  const [selectedProtocolsForNew, setSelectedProtocolsForNew] = useState<string[]>([
    'anamnese',
    'dobras_cutaneas',
    'bioimpedancia',
    'perimetria'
  ]);

  // Protocolos já SALVOS / CONCLUÍDOS na sessão ativa (esses cards quadrados ficam VERDES!)
  const [completedSessionProtocols, setCompletedSessionProtocols] = useState<string[]>([]);

  // Protocolo ativo durante o preenchimento (qual card quadrado está clicado no momento)
  const [activeSessionProtocol, setActiveSessionProtocol] = useState<string>('dobras_cutaneas');

  // Modal de Cancelar Avaliação (Descartar vs Deixar como Rascunho)
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Modal de Gerar PDF
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfStudentId, setPdfStudentId] = useState<string>(selectedStudent.id);
  const [pdfSelectedProtocols, setPdfSelectedProtocols] = useState<string[]>([
    'anamnese',
    'dobras_cutaneas',
    'bioimpedancia',
    'perimetria',
    'testes_forca',
    'testes_campo'
  ]);

  // Modo Analisar Avaliações
  const [analysisStudentId, setAnalysisStudentId] = useState<string>(selectedStudent.id);
  const [analysisSelectedIds, setAnalysisSelectedIds] = useState<string[]>([]);
  const [singleConsultationId, setSingleConsultationId] = useState<string | null>(null);
  const [isAnalysisExecuted, setIsAnalysisExecuted] = useState<boolean>(false);
  const [analysisMetricsCategory, setAnalysisMetricsCategory] = useState<string>('todas');
  const [metricSearchQuery, setMetricSearchQuery] = useState<string>('');

  // Toast / Mensagem de feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Peso e Altura da Sessão Ativa (Biometria Inicial Padrão Obrigatória)
  const defaultInitialWeight = useMemo(() => {
    const list = getAssessmentsForStudent(selectedStudent);
    if (list.length > 0 && list[0].weightKg) return list[0].weightKg;
    const isFem = (selectedStudent as any).gender?.toLowerCase() === 'feminino';
    return isFem ? 60.0 : 74.5;
  }, [selectedStudent]);

  const defaultInitialHeight = useMemo(() => {
    const list = getAssessmentsForStudent(selectedStudent);
    if (list.length > 0 && list[0].heightCm) return list[0].heightCm;
    const isFem = (selectedStudent as any).gender?.toLowerCase() === 'feminino';
    return isFem ? 165 : 178;
  }, [selectedStudent]);

  const [sessionWeightKg, setSessionWeightKg] = useState<number>(defaultInitialWeight);
  const [sessionHeightCm, setSessionHeightCm] = useState<number>(defaultInitialHeight);
  const [showBiometricsModal, setShowBiometricsModal] = useState<boolean>(false);

  // Sincroniza peso e altura padrão ao trocar de aluno fora da sessão
  useEffect(() => {
    if (viewMode !== 'session_filling') {
      setSessionWeightKg(defaultInitialWeight);
      setSessionHeightCm(defaultInitialHeight);
    }
  }, [defaultInitialWeight, defaultInitialHeight, viewMode]);

  // Cálculos do IMC da sessão ativa
  const sessionBmi = useMemo(() => {
    if (sessionHeightCm <= 0) return 0;
    const hM = sessionHeightCm / 100;
    return Number((sessionWeightKg / (hM * hM)).toFixed(1));
  }, [sessionWeightKg, sessionHeightCm]);

  const sessionBmiCategory = useMemo(() => {
    if (sessionBmi < 18.5) return { label: 'Abaixo do Peso', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (sessionBmi <= 24.9) return { label: 'Eutrófico (Peso Normal)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (sessionBmi <= 29.9) return { label: 'Sobrepeso', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (sessionBmi <= 34.9) return { label: 'Obesidade Grau I', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { label: 'Obesidade Grau II/III', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  }, [sessionBmi]);

  // Rascunho salvo do aluno atual
  const [savedDraft, setSavedDraft] = useState<DraftAssessmentSession | null>(() => {
    try {
      const draftRaw = localStorage.getItem(STORAGE_KEY_DRAFT);
      if (draftRaw) {
        return JSON.parse(draftRaw);
      }
    } catch {}
    return null;
  });

  // Atualiza rascunho ao trocar de aluno
  useEffect(() => {
    try {
      const draftRaw = localStorage.getItem(`glprofit_draft_assessment_${selectedStudent.id}`);
      if (draftRaw) {
        setSavedDraft(JSON.parse(draftRaw));
      } else {
        setSavedDraft(null);
      }
    } catch {
      setSavedDraft(null);
    }
  }, [selectedStudent.id]);

  // Lista de avaliações salvas do aluno
  const [studentAssessments, setStudentAssessments] = useState<PhysicalAssessmentData[]>(() => {
    return getAssessmentsForStudent(selectedStudent);
  });

  // Atualiza automaticamente as avaliações e a seleção quando o aluno ativo mudar
  useEffect(() => {
    const list = getAssessmentsForStudent(selectedStudent);
    setStudentAssessments(list);
    setIsAnalysisExecuted(false);
    if (list.length > 0) {
      setSingleConsultationId(list[0].id);
      setAnalysisSelectedIds(list.map(a => a.id));
    } else {
      setSingleConsultationId(null);
      setAnalysisSelectedIds([]);
    }
  }, [selectedStudent.id]);

  // Salva avaliações no localStorage
  const saveAssessments = (updated: PhysicalAssessmentData[]) => {
    setStudentAssessments(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated));
    } catch {}
  };

  // Toggle de seleção de protocolo para Nova Avaliação
  const toggleProtocolForNew = (id: string) => {
    setSelectedProtocolsForNew(prev => 
      prev.includes(id) 
        ? (prev.length > 1 ? prev.filter(p => p !== id) : prev) 
        : [...prev, id]
    );
  };

  // Iniciar sessão de preenchimento após seleção
  const handleStartSession = () => {
    if (selectedProtocolsForNew.length === 0) return;
    setActiveSessionProtocol(selectedProtocolsForNew[0]);
    setCompletedSessionProtocols([]);
    setViewMode('session_filling');
  };

  // Retomar rascunho
  const handleResumeDraft = () => {
    if (!savedDraft) return;
    setSelectedProtocolsForNew(savedDraft.selectedProtocols);
    setCompletedSessionProtocols(savedDraft.completedProtocols);
    setActiveSessionProtocol(savedDraft.activeProtocol || savedDraft.selectedProtocols[0]);
    if (savedDraft.weightKg) setSessionWeightKg(savedDraft.weightKg);
    if (savedDraft.heightCm) setSessionHeightCm(savedDraft.heightCm);
    setViewMode('session_filling');
    showToast(`Rascunho de ${savedDraft.studentName} retomado com sucesso!`);
  };

  // Excluir rascunho existente
  const handleDiscardDraft = () => {
    localStorage.removeItem(STORAGE_KEY_DRAFT);
    setSavedDraft(null);
    showToast('Rascunho excluído com sucesso.');
  };

  // SALVAR E MARCAR O CARD QUADRADO COMO CONCLUÍDO (FICA VERDE!)
  const handleMarkProtocolCompleted = (protoId: string) => {
    if (!completedSessionProtocols.includes(protoId)) {
      setCompletedSessionProtocols(prev => [...prev, protoId]);
    }
    const protoObj = ALL_ASSESSMENT_PROTOCOLS.find(p => p.id === protoId);
    showToast(`✓ Avaliação "${protoObj?.shortName || protoId}" salva com sucesso! O card quadrado superior foi marcado como concluído (verde).`);
  };

  // AÇÃO DO BOTÃO CANCELAR AVALIAÇÃO (Abre modal)
  const handleOpenCancelModal = () => {
    setShowCancelModal(true);
  };

  // CANCELAR: DESCARTAR TOTALMENTE AS ALTERAÇÕES
  const handleConfirmDiscardChanges = () => {
    setShowCancelModal(false);
    setCompletedSessionProtocols([]);
    localStorage.removeItem(STORAGE_KEY_DRAFT);
    setSavedDraft(null);
    setViewMode('dashboard');
    showToast('Avaliação cancelada e alterações descartadas.');
  };

  // CANCELAR: DEIXAR COMO RASCUNHO PARA CONTINUAR DEPOIS
  const handleConfirmSaveDraft = () => {
    setShowCancelModal(false);
    const draftPayload: DraftAssessmentSession = {
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      selectedProtocols: selectedProtocolsForNew,
      completedProtocols: completedSessionProtocols,
      activeProtocol: activeSessionProtocol,
      weightKg: sessionWeightKg,
      heightCm: sessionHeightCm,
      date: new Date().toISOString().slice(0, 10),
      savedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(draftPayload));
      setSavedDraft(draftPayload);
    } catch {}
    setViewMode('dashboard');
    showToast('Avaliação salva como rascunho! Você pode continuar a qualquer momento.');
  };

  // Concluir e salvar a sessão completa
  const handleFinishSession = () => {
    const newSession: PhysicalAssessmentData = {
      id: `av-${selectedStudent.id}-${Date.now()}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      date: new Date().toISOString().slice(0, 10),
      evaluator: 'Prof. Gianluca Marinho (CREF 112001-G/SP)',
      objective: 'Sessão Completa de Avaliação Física',
      protocol: 'pollock7',
      protocolName: `Bateria Personalizada (${selectedProtocolsForNew.length} Módulos)`,
      weightKg: sessionWeightKg,
      heightCm: sessionHeightCm,
      age: 26,
      gender: (selectedStudent.gender as 'masculino' | 'feminino') || 'masculino',
      bmi: sessionBmi,
      bmr: 1720,
      composition: {
        bodyDensity: 1.0650,
        bodyFatPercentage: 13.8,
        fatMassKg: 10.2,
        leanMassKg: 63.8,
        muscleMassKg: 42.2,
        boneMassKg: 11.5,
        residualMassKg: 10.1,
        idealFatPercentage: 12.0,
        idealWeightKg: 73.0,
        classification: 'Excelente'
      },
      skinfolds: {
        peitoral: 8,
        axilarMedia: 9,
        triceps: 9,
        subescapular: 11,
        biceps: 4,
        abdominal: 14,
        suprailiaca: 10,
        coxa: 12,
        panturrilha: 7,
        total: 72
      },
      perimetry: {
        torax: 102,
        cintura: 79,
        abdomen: 83,
        quadril: 99,
        bracoDireitoRelaxado: 35,
        bracoDireitoContraido: 38.5,
        bracoEsquerdoRelaxado: 35,
        bracoEsquerdoContraido: 38.2,
        antebracoDireito: 29,
        antebracoEsquerdo: 29,
        coxaDireitaProximal: 58,
        coxaDireitaMedial: 56.5,
        coxaEsquerdaProximal: 58,
        coxaEsquerdaMedial: 56.2,
        panturrilhaDireita: 37.5,
        panturrilhaEsquerda: 37.2,
        rcq: 0.80,
        rcqRisk: 'Baixo'
      }
    };

    saveAssessments([newSession, ...studentAssessments]);
    localStorage.removeItem(STORAGE_KEY_DRAFT);
    setSavedDraft(null);
    setCompletedSessionProtocols([]);
    setViewMode('dashboard');
    showToast('Sessão de avaliação concluída e laudo salvo com sucesso no histórico!');
  };

  // Toggle de seleção para análise comparativa
  const toggleAnalysisSelection = (id: string) => {
    setAnalysisSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Consulta de avaliação única
  const handleOpenSingleConsultation = (id: string) => {
    setSingleConsultationId(id);
    setViewMode('analyze_view');
  };

  // Abrir comparativo com os IDs selecionados
  const handleOpenComparison = () => {
    if (analysisSelectedIds.length < 2) return;
    setSingleConsultationId(null);
    setViewMode('analyze_view');
  };

  // Alunos com avaliação a vencer (alertas gerenciais da academia)
  const expiringAlerts = useMemo(() => {
    return [
      { studentId: 'std-2', studentName: 'Lucas Tibana Cordeiro', daysLeft: -12, status: 'vencida', lastDate: '24/06/2026' },
      { studentId: 'std-1', studentName: 'Matheus Vanderlei Fonseca', daysLeft: 5, status: 'urgente', lastDate: '12/07/2026' },
      { studentId: 'std-3', studentName: 'Juliano Ferreira Pinto', daysLeft: 18, status: 'atencao', lastDate: '25/07/2026' },
      { studentId: 'std-4', studentName: 'Pietro Noah Marinho', daysLeft: 42, status: 'em_dia', lastDate: '15/09/2026' },
    ];
  }, []);

  // Dados para gráficos de Avaliações Realizadas
  const monthlyCompletedData = [
    { month: 'Jan', count: 18 },
    { month: 'Fev', count: 24 },
    { month: 'Mar', count: 32 },
    { month: 'Abr', count: 28 },
    { month: 'Mai', count: 36 },
    { month: 'Jun', count: 42 },
    { month: 'Jul', count: 39 },
    { month: 'Ago', count: 45 },
    { month: 'Set', count: 50 },
    { month: 'Out', count: 38 },
  ];

  // DISPARAR WHATSAPP COM RELATÓRIO OFICIAL (Colocado apenas ao gerar relatório)
  const handleShareReportWhatsApp = (targetStudent: Student, selectedModuleNames: string[]) => {
    const today = new Date().toLocaleDateString('pt-BR');
    let msg = `📋 *GL PRO FIT • RELATÓRIO OFICIAL DE AVALIAÇÃO FÍSICA*\n`;
    msg += `👤 *Aluno:* ${targetStudent.name} (${targetStudent.code})\n`;
    msg += `📅 *Data de Emissão:* ${today}\n`;
    msg += `👨‍🏫 *Responsável Técnico:* Prof. Gianluca Marinho (CREF 112001-G/SP)\n\n`;
    msg += `📊 *Módulos Inclusos no Laudo:*\n`;
    selectedModuleNames.forEach(m => {
      msg += `  • ${m}\n`;
    });
    msg += `\n⚖️ *Resumo Cineantropométrico:*\n`;
    msg += `• Peso Corporal: ${studentAssessments[0]?.weightKg || 74.5} kg\n`;
    msg += `• % Gordura Corporal: ${studentAssessments[0]?.composition?.bodyFatPercentage || 14.2}%\n`;
    msg += `• Massa Magra: ${studentAssessments[0]?.composition?.leanMassKg || 63.9} kg\n`;
    msg += `• Classificação Geral: ${studentAssessments[0]?.composition?.classification || 'Bom'}\n\n`;
    msg += `🔗 Acesse o portal do aluno GL PRO FIT para consultar o documento completo com gráficos evolutivos e fotos.`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Aluno ativo na modal de PDF
  const currentPdfStudent = students.find(s => s.id === pdfStudentId) || selectedStudent;
  // Aluno ativo na tela de Análise
  const currentAnalysisStudent = students.find(s => s.id === analysisStudentId) || selectedStudent;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. MODO: SESSÃO ATIVA DE PREENCHIMENTO (CARDS QUADRADOS NO TOPO + FORMULÁRIO) */}
      {/* ========================================================================= */}
      {viewMode === 'session_filling' && (
        <div className="space-y-6 animate-in fade-in">
          {/* BARRA SUPERIOR: CARDS QUADRADOS DAS AVALIAÇÕES SELECIONADAS */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    Sessão de Avaliação em Andamento
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-black text-slate-800">
                    {selectedStudent.name} ({selectedStudent.code})
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {completedSessionProtocols.length} de {selectedProtocolsForNew.length} concluídas
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  {/* CARD DE BIOMETRIA PADRÃO NA SESSÃO */}
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-2.5 py-0.5 rounded-lg text-xs shadow-2xs">
                    <span className="font-black text-blue-900 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-blue-600" />
                      {sessionWeightKg} kg
                    </span>
                    <span className="text-blue-300">|</span>
                    <span className="font-black text-indigo-900 flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5 text-indigo-600" />
                      {sessionHeightCm} cm
                    </span>
                    <span className="text-blue-300">|</span>
                    <span className="font-bold text-slate-600 text-[11px]">
                      IMC {sessionBmi}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowBiometricsModal(true)}
                      className="ml-1 text-[10px] font-black text-blue-700 hover:text-blue-900 underline flex items-center gap-0.5 cursor-pointer bg-white/70 px-1.5 py-0.5 rounded border border-blue-200 hover:bg-white"
                      title="Alterar peso e altura desta sessão"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>Alterar</span>
                    </button>
                  </div>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Selecione no card quadrado superior a avaliação que deseja preencher:
                </h3>
              </div>

              {/* AÇÕES DA SESSÃO: CANCELAR AVALIAÇÃO + SALVAR + CONCLUIR */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* BOTÃO CANCELAR AVALIAÇÃO (Solicitado pelo usuário) */}
                <button
                  type="button"
                  onClick={handleOpenCancelModal}
                  className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancelar Avaliação</span>
                </button>

                {/* BOTÃO DE SALVAR A AVALIAÇÃO ATIVA (Marca o card quadrado em verde!) */}
                <button
                  type="button"
                  onClick={() => handleMarkProtocolCompleted(activeSessionProtocol)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    completedSessionProtocols.includes(activeSessionProtocol)
                      ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                  title="Salva os dados desta avaliação e marca o card superior como concluído (verde)"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedSessionProtocols.includes(activeSessionProtocol)
                      ? 'Salva (Card Concluído)'
                      : 'Salvar e Concluir este Módulo'}
                  </span>
                </button>

                {/* BOTÃO CONCLUIR SESSÃO COMPLETA */}
                <button
                  type="button"
                  onClick={handleFinishSession}
                  className="px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Finalizar Sessão</span>
                </button>
              </div>
            </div>

            {/* CARDS QUADRADOS NA PARTE SUPERIOR (QUANDO SALVA, FICA VERDE!) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-1 overflow-x-auto">
              {selectedProtocolsForNew.map((protoId) => {
                const proto = ALL_ASSESSMENT_PROTOCOLS.find(p => p.id === protoId);
                if (!proto) return null;
                const Icon = proto.icon;
                const isCurrent = activeSessionProtocol === protoId;
                const isCompleted = completedSessionProtocols.includes(protoId);

                return (
                  <button
                    key={protoId}
                    type="button"
                    onClick={() => setActiveSessionProtocol(protoId)}
                    className={`aspect-square p-3.5 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all cursor-pointer relative group ${
                      isCompleted
                        ? isCurrent
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-md ring-4 ring-emerald-400/30 scale-102'
                          : 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 shadow-xs'
                        : isCurrent
                          ? 'border-blue-600 bg-blue-50/90 text-blue-900 shadow-md ring-4 ring-blue-500/20 scale-102'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700 shadow-2xs'
                    }`}
                  >
                    {/* Badge de status no topo do card quadrado */}
                    <div className="w-full flex items-center justify-between text-[10px]">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 font-black bg-white/20 text-white px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                          <span>Concluída</span>
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full font-bold ${
                          isCurrent ? 'bg-blue-200/80 text-blue-900' : 'bg-slate-100 text-slate-500'
                        }`}>
                          Pendente
                        </span>
                      )}

                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      )}
                    </div>

                    {/* Ícone Central */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center my-1 transition-transform group-hover:scale-110 ${
                      isCompleted 
                        ? 'bg-white/20 text-white' 
                        : isCurrent 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Título e Dica */}
                    <div>
                      <span className="text-xs font-black leading-tight line-clamp-1 block">
                        {proto.shortName}
                      </span>
                      <span className={`text-[10px] font-semibold mt-0.5 block ${
                        isCompleted ? 'text-emerald-100' : isCurrent ? 'text-blue-700' : 'text-slate-400'
                      }`}>
                        {isCompleted 
                          ? '✓ Salva' 
                          : isCurrent 
                            ? 'Editando Agora' 
                            : 'Clique p/ Abrir'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TELA CENTRAL: FORMULÁRIO E INFORMAÇÕES DA AVALIAÇÃO SELECIONADA */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            {activeSessionProtocol === 'anamnese' && (
              <AnamneseView 
                student={selectedStudent} 
                onSave={() => handleMarkProtocolCompleted('anamnese')} 
              />
            )}
            {activeSessionProtocol === 'dobras_cutaneas' && (
              <DobrasCutaneasView 
                student={selectedStudent} 
                initialWeightKg={sessionWeightKg}
                initialHeightCm={sessionHeightCm}
                onSave={() => handleMarkProtocolCompleted('dobras_cutaneas')} 
              />
            )}
            {activeSessionProtocol === 'bioimpedancia' && (
              <BioimpedanciaView 
                student={selectedStudent} 
                initialWeightKg={sessionWeightKg}
                initialHeightCm={sessionHeightCm}
                onSave={() => handleMarkProtocolCompleted('bioimpedancia')} 
              />
            )}
            {activeSessionProtocol === 'perimetria' && (
              <PerimetriaView 
                student={selectedStudent} 
                initialWeightKg={sessionWeightKg}
                initialHeightCm={sessionHeightCm}
                onSave={() => handleMarkProtocolCompleted('perimetria')} 
              />
            )}
            {activeSessionProtocol === 'fotos_postural' && (
              <FotosPosturalView 
                student={selectedStudent} 
                onSave={() => handleMarkProtocolCompleted('fotos_postural')} 
              />
            )}
            {activeSessionProtocol === 'testes_funcionais' && (
              <TestesFuncionaisView 
                student={selectedStudent} 
                onSave={() => handleMarkProtocolCompleted('testes_funcionais')} 
              />
            )}
            {activeSessionProtocol === 'testes_forca' && (
              <TestesForcaView 
                student={selectedStudent} 
                initialWeightKg={sessionWeightKg}
                initialHeightCm={sessionHeightCm}
                onSave={() => handleMarkProtocolCompleted('testes_forca')} 
              />
            )}
            {activeSessionProtocol === 'testes_campo' && (
              <TestesCampoView 
                student={selectedStudent} 
                initialWeightKg={sessionWeightKg}
                initialHeightCm={sessionHeightCm}
                onSave={() => handleMarkProtocolCompleted('testes_campo')} 
              />
            )}
            {activeSessionProtocol === 'testes_salto' && (
              <TestesSaltoView 
                student={selectedStudent} 
                initialWeightKg={sessionWeightKg}
                initialHeightCm={sessionHeightCm}
                onSave={() => handleMarkProtocolCompleted('testes_salto')} 
              />
            )}
            {activeSessionProtocol === 'testes_personalizados' && (
              <TestesPersonalizadosView 
                student={selectedStudent} 
                onSave={() => handleMarkProtocolCompleted('testes_personalizados')} 
              />
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MODO: SELEÇÃO DE PROTOCOLOS PARA NOVA AVALIAÇÃO (COM SELEÇÃO DE ALUNO) */}
      {/* ========================================================================= */}
      {viewMode === 'select_protocols' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                Passo 1 de 2 • Seleção de Módulos
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Nova Avaliação: Selecione o Aluno e os Módulos</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Escolha o aluno avaliado e marque quais avaliações realizar nesta sessão. No próximo passo à frente, defina o peso e a altura antes de abrir os cards de preenchimento.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setViewMode('dashboard')}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* CARD PROEMINENTE DE SELEÇÃO DO ALUNO (Solicitado: aparece ao apertar Nova Avaliação) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-xs">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">
                    Aluno Selecionado para Esta Sessão:
                  </span>
                  <h4 className="text-base font-black text-slate-900">
                    {selectedStudent.name}
                  </h4>
                  <p className="text-xs text-slate-600">
                    Matrícula: {selectedStudent.code} • {selectedStudent.gender || 'Gênero não inf.'} • {selectedStudent.plan || 'Plano Pro'}
                  </p>
                </div>
              </div>

              {/* Seletor / Dropdown do Aluno */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                  Trocar Aluno:
                </label>
                <select
                  value={selectedStudent.id}
                  onChange={(e) => handleStudentChange(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 cursor-pointer shadow-2xs focus:ring-2 focus:ring-blue-600"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Atalhos Rápidos de Seleção dos Protocolos */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-slate-500">Atalhos de Módulos:</span>
            <button
              type="button"
              onClick={() => setSelectedProtocolsForNew(ALL_ASSESSMENT_PROTOCOLS.map(p => p.id))}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
            >
              Selecionar Todas (10)
            </button>
            <button
              type="button"
              onClick={() => setSelectedProtocolsForNew(['anamnese', 'dobras_cutaneas', 'bioimpedancia', 'perimetria'])}
              className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold cursor-pointer"
            >
              Padrão Antropometria (4)
            </button>
            <button
              type="button"
              onClick={() => setSelectedProtocolsForNew(['testes_funcionais', 'testes_forca', 'testes_campo', 'testes_salto'])}
              className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-bold cursor-pointer"
            >
              Padrão Performance & Força (4)
            </button>
          </div>

          {/* Grid de Seleção dos 10 Protocolos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {ALL_ASSESSMENT_PROTOCOLS.map((proto) => {
              const isSelected = selectedProtocolsForNew.includes(proto.id);
              const Icon = proto.icon;

              return (
                <div
                  key={proto.id}
                  onClick={() => toggleProtocolForNew(proto.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/10'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-900 leading-tight">
                      {proto.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                      {proto.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-400">{proto.category}</span>
                    <span className={`font-bold ${isSelected ? 'text-blue-700' : 'text-slate-400'}`}>
                      {isSelected ? 'Selecionado' : 'Clique para marcar'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botões de Ação */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-600">
              {selectedProtocolsForNew.length} avaliação(ões) selecionada(s) para {selectedStudent.name}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => setShowBiometricsModal(true)}
                disabled={selectedProtocolsForNew.length === 0}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Avançar para Peso & Altura</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODO: ANALISAR AVALIAÇÕES (SELEÇÃO PRÉ-ANÁLISE E NOVA TELA CENTRAL) */}
      {/* ========================================================================= */}
      {viewMode === 'analyze_view' && (() => {
        // Avaliações selecionadas ordenadas cronologicamente
        const selectedSortedAssessments = studentAssessments
          .filter(a => analysisSelectedIds.includes(a.id))
          .sort((a, b) => parseDateToTime(a.date) - parseDateToTime(b.date));

        const effectiveAssessments = selectedSortedAssessments.length > 0 
          ? selectedSortedAssessments 
          : (studentAssessments.length > 0 ? [studentAssessments[0]] : []);

        const activeItem = effectiveAssessments[effectiveAssessments.length - 1] || studentAssessments[0];
        const isComparisonMode = analysisSelectedIds.length >= 2;
        const studentObjectives = getStudentObjectives(currentAnalysisStudent, activeItem);

        const filteredMetrics = METRICS_CONFIG.filter(m => {
          const matchesCategory = analysisMetricsCategory === 'todas' || m.category === analysisMetricsCategory;
          const matchesSearch = !metricSearchQuery.trim() || 
            m.name.toLowerCase().includes(metricSearchQuery.toLowerCase()) ||
            m.category.toLowerCase().includes(metricSearchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
        });

        // Métricas expandidas da avaliação ativa (completas e realistas para todos os módulos)
        const metrics = activeItem ? {
          weightKg: activeItem.weightKg || 74.5,
          heightCm: activeItem.heightCm || 178,
          age: activeItem.age || 26,
          gender: activeItem.gender || 'masculino',
          bmi: activeItem.bmi || Number((activeItem.weightKg / Math.pow(activeItem.heightCm / 100, 2)).toFixed(1)),
          bmr: activeItem.bmr || 1730,
          date: activeItem.date || '15/09/2026',
          protocolName: activeItem.protocolName || 'Pollock 7 Dobras & Bioimpedância',
          evaluator: activeItem.evaluator || 'Prof. Gianluca Marinho (CREF 112001-G/SP)',
          objective: activeItem.objective || 'Hipertrofia Muscular & Condicionamento Físico',
          composition: {
            bodyFatPercentage: activeItem.composition?.bodyFatPercentage || 14.2,
            fatMassKg: activeItem.composition?.fatMassKg || Number(((activeItem.weightKg * (activeItem.composition?.bodyFatPercentage || 14.2)) / 100).toFixed(1)),
            leanMassKg: activeItem.composition?.leanMassKg || Number((activeItem.weightKg - ((activeItem.weightKg * (activeItem.composition?.bodyFatPercentage || 14.2)) / 100)).toFixed(1)),
            muscleMassKg: activeItem.composition?.muscleMassKg || 42.1,
            boneMassKg: activeItem.composition?.boneMassKg || 11.5,
            residualMassKg: activeItem.composition?.residualMassKg || 10.3,
            idealFatPercentage: activeItem.composition?.idealFatPercentage || 12.0,
            idealWeightKg: activeItem.composition?.idealWeightKg || 73.0,
            classification: activeItem.composition?.classification || 'Bom',
            bodyDensity: activeItem.composition?.bodyDensity || 1.0665,
          },
          skinfolds: activeItem.skinfolds || {
            peitoral: 8,
            axilarMedia: 9,
            triceps: 9,
            subescapular: 11,
            biceps: 4,
            abdominal: 14,
            suprailiaca: 10,
            coxa: 12,
            panturrilha: 7,
            total: 72
          },
          perimetry: activeItem.perimetry || {
            pescoco: 38.0,
            ombros: 118.0,
            torax: 102.0,
            cintura: 79.0,
            abdomen: 83.0,
            quadril: 99.0,
            bracoDireitoRelaxado: 35.0,
            bracoDireitoContraido: 38.5,
            bracoEsquerdoRelaxado: 34.8,
            bracoEsquerdoContraido: 38.2,
            antebracoDireito: 29.0,
            antebracoEsquerdo: 28.8,
            coxaDireitaProximal: 58.0,
            coxaDireitaMedial: 56.5,
            coxaEsquerdaProximal: 57.8,
            coxaEsquerdaMedial: 56.2,
            panturrilhaDireita: 37.5,
            panturrilhaEsquerda: 37.2,
            rcq: 0.80,
            rcqRisk: 'Baixo'
          },
          bioimpedance: {
            totalBodyWaterLiters: 46.5,
            totalBodyWaterPct: 62.4,
            visceralFatLevel: 4,
            visceralFatRisk: 'Baixo Risco (Nível Saudável 1-9)',
            skeletalMuscleMassKg: 35.8,
            boneMassKg: 11.5,
            phaseAngleDeg: 7.4,
            metabolicAgeYears: 22
          },
          anamnesis: activeItem.anamnesis || {
            parqCleared: true,
            clinicalHistory: 'Apto para atividades físicas vigorosas e esportes de alta intensidade.',
            injuries: 'Nenhuma lesão osteomuscular ativa; histórico prévio de entorse leve de tornozelo D.',
            medications: 'Nenhum medicamento contínuo em uso.',
            activityLevel: 'Avançado (Musculação 4x/sem + Futebol 1x/sem)',
            sleepHours: 7.5,
            waterIntakeLiters: 3.0,
            stressLevel: 3
          },
          postural: {
            anteriorView: 'Ombros e cristas ilíacas alinhados; triângulo de tales simétrico',
            posteriorView: 'Sem desvios escolióticos aparentes; escápulas neutras',
            lateralRightView: 'Ligeira anteriorização da cabeça; lordose lombar fisiológica',
            lateralLeftView: 'Curvaturas sagitais harmônicas e joelhos normolineos',
            plumbAlignment: 'Equilíbrio estático preservado com centro de massa estável'
          },
          functional: {
            fmsTotalScore: 17,
            fmsRiskLevel: 'Baixo Risco de Lesão (≥ 14 pontos)',
            wellsFlexibilityCm: 34.0,
            wellsClassification: 'Excelente (ACSM)',
            deepSquat: 3,
            hurdleStep: 2,
            inlineLunge: 2,
            shoulderMobility: 3,
            activeStraightLeg: 2,
            trunkStability: 3,
            rotaryStability: 2
          },
          force: {
            benchPress1Rm: 105,
            squat1Rm: 135,
            legPress1Rm: 280,
            deadlift1Rm: 150,
            handgripRightKgf: 48,
            handgripLeftKgf: 46,
            zones: { z95: 100, z85: 89, z75: 79, z65: 68 }
          },
          field: {
            yoyoDistanceMeters: 1480,
            yoyoLaps: 37,
            yoyoVo2Max: 52.8,
            yoyoVma: 16.5,
            yoyoClass: 'Excelente (Bangsbo 2008)',
            rastPeakWatts: 685,
            rastPeakWkg: 9.2,
            rastMinWatts: 490,
            rastAvgWatts: 580,
            rastFatigueWattsSec: 19.5,
            rastFatiguePct: 28.4,
            rastClass: 'Potência Elevada / Fadiga Controlada',
            tTestSeconds: 9.72,
            tTestLap1: 9.85,
            tTestLap2: 9.72,
            tTestClass: 'Excelente (Agilidade Superior)',
            cooperDistanceMeters: 2850,
            cooperVo2Max: 52.3,
            cooperPace: '4:12 min/km',
            oneMileTime: '12m 30s',
            oneMileVo2Max: 48.2,
            oneMileHrBpm: 158
          },
          jump: {
            cmjHeightCm: 42.5,
            cmjFlightTimeMs: 588,
            cmjSayersWatts: 3890,
            cmjSayersWkg: 52.2,
            cmjClass: 'Excelente (Bosco Pliometria)',
            sjHeightCm: 37.0,
            elasticityIndexPct: 14.9,
            elasticityClass: 'Aproveitamento Elástico Normal (10% a 15%)',
            dropJumpBoxCm: 30,
            dropJumpContactMs: 185,
            dropJumpRsi: 2.15,
            dropJumpClass: 'RSI Excelente (2.0 a 2.5)',
            unipodalRightCm: 28.5,
            unipodalLeftCm: 27.8,
            unipodalAsymmetryPct: 2.5,
            unipodalRisk: false
          },
          customTests: [
            { name: 'Suspensão no Kimono (BJJ)', metric: '62 seg', norm: 'Excelente (> 50s)' },
            { name: 'Pull-ups Unbroken (CrossFit)', metric: '24 reps', norm: 'Avançado (> 20 reps)' },
            { name: 'Tiro de 30m Lançado', metric: '3.92 seg', norm: 'Bom (< 4.10s)' }
          ]
        } : null;

        // =========================================================================
        // SE A ANÁLISE NÃO FOI EXECUTADA: MOSTRA APENAS OS CARDS DE SELEÇÃO E AÇÕES
        // =========================================================================
        if (!isAnalysisExecuted) {
          return (
            <div className="space-y-6 animate-in fade-in">
              {/* HEADER DE SELEÇÃO */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      Central de Análise de Avaliações
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-600">
                      Configuração da Consulta & Comparativo
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">
                    Analisar Avaliações Físicas
                  </h2>
                  <p className="text-xs text-slate-500">
                    Selecione o aluno e marque as avaliações desejadas. Em seguida, clique em "Analisar" para abrir a tela central com os gráficos de linha evolutivos e linha base de meta.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setViewMode('dashboard')}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Voltar ao Painel Geral</span>
                </button>
              </div>

              {/* OS PRIMEIROS CARDS REQUISITADOS */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                {/* CARD 1: SELECIONAR ALUNO (contendo o total de avaliações e data da última avaliação) */}
                <div className="md:col-span-12 lg:col-span-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>1. Selecionar Aluno</span>
                    </span>
                    <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                      {studentAssessments.length} avaliações
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Aluno em Análise:</span>
                      <span className="text-[10px] text-blue-600 font-semibold">{students.length} cadastrados</span>
                    </label>
                    <div className="relative">
                      <select
                        value={currentAnalysisStudent.id}
                        onChange={(e) => {
                          const newId = e.target.value;
                          setAnalysisStudentId(newId);
                          handleStudentChange(newId);
                        }}
                        className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-300 bg-white text-xs font-black text-slate-800 cursor-pointer shadow-2xs focus:ring-2 focus:ring-blue-600 transition-all hover:border-blue-400"
                      >
                        {students.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.code}) - {s.status}
                          </option>
                        ))}
                      </select>
                      <User className="w-4 h-4 text-blue-600 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Perfil Detalhado do Aluno Selecionado */}
                  <div className="p-3.5 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-xs ring-2 ring-blue-100">
                        {currentAnalysisStudent.name.charAt(0)}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-black text-slate-900 truncate">
                            {currentAnalysisStudent.name}
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded shrink-0">
                            PAR-Q+ Apto
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          Matrícula: <strong className="text-slate-700">{currentAnalysisStudent.code}</strong> • {currentAnalysisStudent.gender || 'Masculino'}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          Plano: {currentAnalysisStudent.planName || 'Plano Pro'} • {currentAnalysisStudent.email || 'aluno@glprofit.com'}
                        </p>
                      </div>
                    </div>

                    {/* Destaque Solicitado: Total de Avaliações e Data da Última Avaliação */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total de Avaliações</span>
                        <strong className="text-slate-900 text-sm block font-black mt-0.5">
                          {studentAssessments.length} {studentAssessments.length === 1 ? 'avaliação' : 'avaliações'}
                        </strong>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Última Avaliação</span>
                        <strong className="text-blue-700 text-sm block font-black mt-0.5">
                          {formatDateDisplay(studentAssessments[0]?.date) || 'Nenhuma'}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 2: SELECIONAR AS AVALIAÇÕES PARA ANÁLISE (Sem botões individual e comparar) */}
                <div className="md:col-span-12 lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1.5">
                      <ClipboardCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>2. Selecionar Avaliações para Análise</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAnalysisSelectedIds(studentAssessments.map(a => a.id))}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        Marcar Todas ({studentAssessments.length})
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() => setAnalysisSelectedIds([])}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        Limpar
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug">
                    Marque as avaliações que deseja analisar. Se selecionar 2 ou mais avaliações, o sistema gerará o comparativo evolutivo automaticamente.
                  </p>

                  {/* Lista de Avaliações com Checkbox */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {studentAssessments.map((a, idx) => {
                      const isSelected = analysisSelectedIds.includes(a.id);
                      return (
                        <div
                          key={a.id}
                          onClick={() => toggleAnalysisSelection(a.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/90 shadow-2xs ring-2 ring-blue-500/20'
                              : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleAnalysisSelection(a.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <strong className="text-slate-900 font-black text-xs flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                  <span>{formatDateDisplay(a.date)}</span>
                                </strong>
                                {idx === 0 && (
                                  <span className="text-[9px] font-black uppercase text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                                    Mais Recente
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 block truncate max-w-[210px]">
                                {a.protocolName}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-slate-900 block">
                              {a.weightKg} kg
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                              {a.composition?.bodyFatPercentage}% gordura
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Status da Seleção:</span>
                    {analysisSelectedIds.length === 0 ? (
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Nenhuma avaliação marcada (marque ao menos 1)
                      </span>
                    ) : analysisSelectedIds.length === 1 ? (
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        1 avaliação marcada (Análise Individual)
                      </span>
                    ) : (
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {analysisSelectedIds.length} avaliações marcadas para análise
                      </span>
                    )}
                  </div>
                </div>

                {/* CARD 3: BOTÕES DE AÇÃO: GERAR PDF, ENVIAR WHATSAPP, ANALISAR */}
                <div className="md:col-span-12 lg:col-span-3 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded block w-fit mb-2">
                      3. Ações da Avaliação
                    </span>
                    <h4 className="text-sm font-black text-slate-900">
                      {analysisSelectedIds.length >= 2
                        ? `Análise de Avaliações (${analysisSelectedIds.length} avaliações)`
                        : analysisSelectedIds.length === 1
                        ? `Análise Individual (${formatDateDisplay(studentAssessments.find(a => a.id === analysisSelectedIds[0])?.date) || '1 avaliação'})`
                        : 'Selecione as avaliações ao lado'}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Clique em <strong>"Analisar"</strong> para abrir a nova tela central com os gráficos de linha de evolução para cada métrica e sua linha base de meta.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    {/* BOTÃO 1: ANALISAR (Abre a nova tela central com gráficos e informações) */}
                    <button
                      type="button"
                      onClick={() => {
                        if (analysisSelectedIds.length === 0) {
                          if (studentAssessments.length > 0) {
                            setAnalysisSelectedIds([studentAssessments[0].id]);
                            setSingleConsultationId(studentAssessments[0].id);
                            setIsAnalysisExecuted(true);
                            showToast('Avaliação mais recente selecionada para análise.');
                          } else {
                            showToast('Nenhuma avaliação cadastrada para este aluno.');
                          }
                          return;
                        }
                        setIsAnalysisExecuted(true);
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all ring-2 ring-blue-500/20 hover:scale-[1.01]"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Analisar ({analysisSelectedIds.length} selecionada{analysisSelectedIds.length === 1 ? '' : 's'})</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>

                    {/* BOTÃO 2: GERAR PDF */}
                    <button
                      type="button"
                      onClick={() => {
                        setPdfStudentId(currentAnalysisStudent.id);
                        setShowPdfModal(true);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-black shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Printer className="w-4 h-4 text-blue-600" />
                      <span>Gerar PDF</span>
                    </button>

                    {/* BOTÃO 3: ENVIAR WHATSAPP */}
                    <button
                      type="button"
                      onClick={() => {
                        const modulesToShare = analysisSelectedIds.length >= 2 
                          ? ['Composição Corporal', 'Dobras Cutâneas', 'Perimetria', 'Testes Motores'] 
                          : ['Avaliação Física Completa', 'Composição Corporal', 'Perimetria'];
                        handleShareReportWhatsApp(currentAnalysisStudent, modulesToShare);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Share2 className="w-4 h-4 text-emerald-600" />
                      <span>Enviar WhatsApp</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        }

        // =========================================================================
        // TELA CENTRAL: GRÁFICOS DE LINHA POR MÉTRICA + LINHA BASE + DEMAIS INFORMAÇÕES
        // =========================================================================
        return (
          <div className="space-y-6 animate-in fade-in">
            {/* BARRA SUPERIOR DA TELA CENTRAL */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAnalysisExecuted(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4 text-blue-600" />
                  <span>← Alterar Seleção</span>
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Tela Central de Análise
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-bold text-slate-600">
                      {effectiveAssessments.length} {effectiveAssessments.length === 1 ? 'avaliação analisada' : 'avaliações comparadas'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    {currentAnalysisStudent.name} • Central de Análise de Avaliações
                  </h3>
                  <p className="text-xs text-slate-500">
                    Período: {formatDateDisplay(effectiveAssessments[0]?.date)} {effectiveAssessments.length > 1 ? `➔ ${formatDateDisplay(effectiveAssessments[effectiveAssessments.length - 1]?.date)}` : ''} • Matrícula: {currentAnalysisStudent.code}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setPdfStudentId(currentAnalysisStudent.id);
                    setShowPdfModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Gerar PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const modulesToShare = isComparisonMode 
                      ? ['Composição Corporal', 'Dobras Cutâneas', 'Perimetria', 'Testes Motores'] 
                      : [activeItem?.protocolName || 'Avaliação Física Completa', 'Composição Corporal', 'Perimetria'];
                    handleShareReportWhatsApp(currentAnalysisStudent, modulesToShare);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span>Enviar WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAnalysisExecuted(false);
                    setViewMode('dashboard');
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* SEÇÃO PRINCIPAL DE GRÁFICOS DE LINHA POR MÉTRICA COM LINHA BASE DO OBJETIVO */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1.5">
                      <LineChart className="w-3.5 h-3.5 text-blue-600" />
                      <span>Evolução por Métrica & Metas</span>
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-600">
                      Linha contínua azul = Avaliações realizadas | Linha tracejada âmbar = Objetivo cadastrado
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                    <span>Gráficos de Linha por Métrica com Linha Base do Objetivo</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Acompanhe a curva de evolução em cada teste físico realizado. A linha base amarela/âmbar tracejada indica a meta definida para o aluno.
                  </p>
                </div>

                {/* Campo de Busca Rápida de Métricas */}
                <div className="relative min-w-[240px]">
                  <input
                    type="text"
                    placeholder="Buscar métrica (ex: peso, bíceps, VO2)..."
                    value={metricSearchQuery}
                    onChange={(e) => setMetricSearchQuery(e.target.value)}
                    className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  {metricSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setMetricSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Filtro por Setores em Abas / Pills com Cores e Contadores (Cliques de Filtragem) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs pb-1">
                  <span className="text-[10px] font-black uppercase text-slate-400">Setores de Análise:</span>
                  <span className="text-[11px] font-bold text-slate-500">
                    Mostrando {filteredMetrics.length} de {METRICS_CONFIG.length} métricas
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  {METRIC_CATEGORIES.map(cat => {
                    const isCatActive = analysisMetricsCategory === cat.id;
                    const countForCat = cat.id === 'todas'
                      ? METRICS_CONFIG.length
                      : METRICS_CONFIG.filter(m => m.category === cat.id).length;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setAnalysisMetricsCategory(cat.id)}
                        className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 border ${
                          isCatActive
                            ? 'text-white shadow-xs font-black'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80'
                        }`}
                        style={{
                          backgroundColor: isCatActive ? cat.color : undefined,
                          borderColor: isCatActive ? cat.color : undefined
                        }}
                      >
                        <span>{cat.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                          isCatActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {countForCat}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PAINÉIS E GRÁFICOS DISTRIBUÍDOS POR SETOR DE ANÁLISE */}
              {metrics && (
                <div className="space-y-4">
                  {/* SETOR: COMPOSIÇÃO CORPORAL */}
                  {analysisMetricsCategory === 'Composição corporal' && (
                    <ComposicaoSectorGraphics
                      metrics={metrics}
                      assessments={effectiveAssessments}
                      student={currentAnalysisStudent}
                      goals={studentObjectives}
                    />
                  )}

                  {/* SETOR: FOTOS E POSTURA */}
                  {analysisMetricsCategory === 'fotos' && (
                    <PhotosSectorViewer
                      assessments={effectiveAssessments}
                      student={currentAnalysisStudent}
                    />
                  )}

                  {/* SETOR: ANAMNESE */}
                  {analysisMetricsCategory === 'Anamnese' && (
                    <AnamneseSectorGraphics
                      metrics={metrics}
                      assessments={effectiveAssessments}
                      student={currentAnalysisStudent}
                      goals={studentObjectives}
                    />
                  )}

                  {/* SETOR: TESTES FUNCIONAIS */}
                  {analysisMetricsCategory === 'testes funcionais' && (
                    <FuncionalSectorGraphics
                      metrics={metrics}
                      assessments={effectiveAssessments}
                      student={currentAnalysisStudent}
                      goals={studentObjectives}
                    />
                  )}

                  {/* SETOR: TESTES DE FORÇA E SALTO */}
                  {analysisMetricsCategory === 'testes de força e salto' && (
                    <ForcaSaltoSectorGraphics
                      metrics={metrics}
                      assessments={effectiveAssessments}
                      student={currentAnalysisStudent}
                      goals={studentObjectives}
                    />
                  )}

                  {/* SETOR: TESTES DE CAMPO */}
                  {analysisMetricsCategory === 'testes de campo' && (
                    <CampoSectorGraphics
                      metrics={metrics}
                      assessments={effectiveAssessments}
                      student={currentAnalysisStudent}
                      goals={studentObjectives}
                    />
                  )}

                  {/* SETOR: TESTES PERSONALIZADOS */}
                  {analysisMetricsCategory === 'testes personalizados' && (
                    <PersonalizadosSectorGraphics
                      metrics={metrics}
                      assessments={effectiveAssessments}
                      student={currentAnalysisStudent}
                      goals={studentObjectives}
                    />
                  )}
                </div>
              )}

              {/* Grid de Gráficos de Linha de cada Métrica com Linha Base de Meta e Tooltips */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>Cards de Evolução por Métrica Individual ({filteredMetrics.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Linha contínua = Avaliações | Linha tracejada âmbar = Meta
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredMetrics.map(metric => {
                    const points = effectiveAssessments.map(a => ({
                      date: formatDateDisplay(a.date),
                      value: Number(metric.getValue(a).toFixed(metric.decimals ?? 1))
                    }));
                    const targetGoal = metric.getTarget(studentObjectives);

                    return (
                      <MetricLineChartCard
                        key={metric.id}
                        id={metric.id}
                        name={metric.name}
                        unit={metric.unit}
                        category={metric.category}
                        desiredDirection={metric.desiredDirection}
                        decimals={metric.decimals}
                        color={metric.color}
                        points={points}
                        targetGoal={targetGoal}
                      />
                    );
                  })}
                </div>
              </div>

              {filteredMetrics.length === 0 && (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs font-bold text-slate-500">Nenhuma métrica encontrada para o filtro "{metricSearchQuery}".</p>
                  <button
                    type="button"
                    onClick={() => { setAnalysisMetricsCategory('todas'); setMetricSearchQuery(''); }}
                    className="mt-2 text-xs text-blue-600 font-bold hover:underline"
                  >
                    Limpar filtros de busca
                  </button>
                </div>
              )}
            </div>

            {/* RODAPÉ DA TELA CENTRAL DE ANÁLISE */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsAnalysisExecuted(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-2 cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4 text-blue-600" />
                <span>← Voltar e Selecionar Outras Avaliações</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPdfStudentId(currentAnalysisStudent.id);
                    setShowPdfModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Exportar Laudo Oficial em PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAnalysisExecuted(false);
                    setViewMode('dashboard');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer transition-all"
                >
                  Voltar ao Painel Geral
                </button>
              </div>
            </div>

          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 4. MODO PADRÃO: DASHBOARD PRINCIPAL (SEM CARD DE SELEÇÃO DE ALUNO NO TOPO) */}
      {/* ========================================================================= */}
      {viewMode === 'dashboard' && (
        <div className="space-y-6">

          {/* BANNER DE RASCUNHO SE HOUVER SESSÃO NÃO FINALIZADA */}
          {savedDraft && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Rascunho de Avaliação Salvo
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs font-bold text-slate-700">
                    Aluno: <strong>{savedDraft.studentName}</strong>
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Você iniciou uma sessão com {savedDraft.selectedProtocols.length} módulos ({savedDraft.completedProtocols.length} já concluídos em verde). Deseja continuar de onde parou?
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDiscardDraft}
                  className="px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-bold text-amber-800 hover:bg-amber-100 cursor-pointer"
                >
                  Descartar Rascunho
                </button>
                <button
                  type="button"
                  onClick={handleResumeDraft}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Retomar Avaliação</span>
                </button>
              </div>
            </div>
          )}

          {/* HEADER PRINCIPAL COM OS 3 BOTÕES REQUISITADOS - SEM O SELETOR DE ALUNO */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Central Operacional de Avaliações Físicas
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">
                  Gestão Diagnóstica & Avaliação Física
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Painel Geral de Avaliações Físicas
              </h2>
              <p className="text-xs text-slate-500">
                Execute novas baterias de avaliação, gere relatórios oficiais em PDF e analise históricos evolutivos de alunos e atletas.
              </p>
            </div>

            {/* OS 3 BOTÕES DE AÇÃO REQUISITADOS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              {/* BOTÃO 1: NOVA AVALIAÇÃO (Abre a seleção de aluno e módulos) */}
              <button
                type="button"
                onClick={() => setViewMode('select_protocols')}
                className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-left shadow-xs transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block">
                    Protocolos Sob Demanda
                  </span>
                  <h4 className="text-base font-black flex items-center gap-2">
                    <Plus className="w-5 h-5 bg-white/20 rounded-lg p-0.5" />
                    <span>Nova Avaliação</span>
                  </h4>
                  <p className="text-[11px] text-blue-100/90 leading-tight">
                    Selecione o aluno e quais testes realizar para abrir os cards superiores.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-200 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              {/* BOTÃO 2: GERAR PDF (Abre seletor de aluno e módulos para exportar) */}
              <button
                type="button"
                onClick={() => {
                  setPdfStudentId(selectedStudent.id);
                  setShowPdfModal(true);
                }}
                className="p-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-left shadow-2xs transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Relatório Clínico Oficial
                  </span>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Printer className="w-5 h-5 text-blue-600 bg-blue-50 rounded-lg p-0.5" />
                    <span>Gerar PDF</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Selecione o aluno e módulos para exportar laudo ou enviar no WhatsApp.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              {/* BOTÃO 3: ANALISAR AVALIAÇÕES (Abre consulta e comparativo) */}
              <button
                type="button"
                onClick={() => {
                  setAnalysisStudentId(selectedStudent.id);
                  const currentList = getAssessmentsForStudent(selectedStudent);
                  setStudentAssessments(currentList);
                  setAnalysisSelectedIds(currentList.map(a => a.id));
                  setSingleConsultationId(currentList[0]?.id || null);
                  setIsAnalysisExecuted(false);
                  setViewMode('analyze_view');
                }}
                className="p-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-left shadow-2xs transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Consultar & Comparar
                  </span>
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600 bg-emerald-50 rounded-lg p-0.5" />
                    <span>Analisar Avaliações</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Consulte laudos individuais ou compare 2+ testes lado a lado.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* GRÁFICOS REQUISITADOS NA TELA CENTRAL: REALIZADAS & A VENCER */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* GRÁFICO 1: AVALIAÇÕES REALIZADAS (7 COLUNAS) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>Avaliações Realizadas (Histórico Mensal)</span>
                  </h3>
                  <p className="text-xs text-slate-500">Volume anual de testes concluídos na academia</p>
                </div>
                <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Total: 355 Avaliações
                </span>
              </div>

              {/* Barras Mensais Interativas */}
              <div className="pt-2">
                <div className="flex items-end justify-between gap-2 h-44 px-2 border-b border-slate-100">
                  {monthlyCompletedData.map((d, i) => {
                    const heightPercent = Math.round((d.count / 50) * 100);
                    const isMax = d.count === 50;

                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {d.count}
                        </span>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[26px] rounded-t-lg transition-all cursor-pointer ${
                            isMax 
                              ? 'bg-blue-600 shadow-xs' 
                              : 'bg-slate-200 group-hover:bg-blue-400'
                          }`}
                        />
                        <span className="text-[10px] font-bold text-slate-500">
                          {d.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Protocolos Mais Realizados */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 flex-wrap gap-2">
                <span><strong>Distribuição:</strong> Dobras (38%) • Força (22%) • Campo (18%) • Bioimpedância (15%)</span>
                <span className="text-[11px] text-blue-600 font-bold">Média: 35.5 avaliações/mês</span>
              </div>
            </div>

            {/* GRÁFICO 2: AVALIAÇÕES A VENCER (5 COLUNAS) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Avaliações a Vencer</span>
                  </h3>
                  <p className="text-xs text-slate-500">Controle de renovação periódica (60 a 90 dias)</p>
                </div>
                <span className="text-xs font-black text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  4 Alertas
                </span>
              </div>

              {/* Barra de Progresso / Conformidade Geral da Base */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Conformidade da Base de Alunos</span>
                  <span className="text-emerald-700">76% em dia</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                  <div style={{ width: '76%' }} className="bg-emerald-500 h-full" title="Em dia (76%)" />
                  <div style={{ width: '14%' }} className="bg-amber-400 h-full" title="A vencer em 15 dias (14%)" />
                  <div style={{ width: '10%' }} className="bg-rose-500 h-full" title="Vencidas (10%)" />
                </div>
              </div>

              {/* Lista Acionável de Alunos com Avaliação Vencendo */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {expiringAlerts.map((al, idx) => {
                  const isExpired = al.status === 'vencida';
                  const isUrgent = al.status === 'urgente';

                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <strong className="block text-slate-900 text-xs font-black">
                          {al.studentName}
                        </strong>
                        <span className="text-[10px] text-slate-400">
                          Última em: {al.lastDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${
                          isExpired 
                            ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                            : isUrgent 
                              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                              : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isExpired ? `Vencida há ${Math.abs(al.daysLeft)}d` : `Vence em ${al.daysLeft}d`}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            handleStudentChange(al.studentId);
                            setViewMode('select_protocols');
                          }}
                          className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold cursor-pointer"
                        >
                          Avaliar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* HISTÓRICO GERAL DE AVALIAÇÕES RECENTES */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Histórico Recente de Avaliações</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Prontuários e baterias salvas dos alunos da academia
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewMode('select_protocols')}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Avaliação</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-2.5 px-3 font-black text-slate-700">Aluno</th>
                    <th className="py-2.5 px-3 font-black text-slate-700">Data</th>
                    <th className="py-2.5 px-3 font-black text-slate-700">Protocolo</th>
                    <th className="py-2.5 px-3 font-black text-slate-700">Peso</th>
                    <th className="py-2.5 px-3 font-black text-slate-700">% Gordura</th>
                    <th className="py-2.5 px-3 font-black text-slate-700">Massa Magra</th>
                    <th className="py-2.5 px-3 font-black text-slate-700 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.slice(0, 5).map((st, i) => {
                    const mockDate = ['2026-09-15', '2026-08-20', '2026-08-10', '2026-07-28', '2026-07-15'][i] || '2026-07-10';
                    const mockWeight = [74.5, 82.0, 68.4, 76.2, 70.0][i] || 75.0;
                    const mockFat = [14.2, 18.5, 12.8, 16.0, 15.2][i] || 15.0;
                    const mockLean = [63.9, 66.8, 59.6, 64.0, 59.3][i] || 60.0;

                    return (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3">
                          <strong className="block text-slate-900 font-bold">{st.name}</strong>
                          <span className="text-[10px] text-slate-400">{st.code}</span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">{mockDate}</td>
                        <td className="py-3 px-3 text-slate-600">Pollock 7 Dobras</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{mockWeight} kg</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {mockFat}%
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-blue-900">{mockLean} kg</td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                handleStudentChange(st.id);
                                setAnalysisStudentId(st.id);
                                setSingleConsultationId(`av-${st.id}-1`);
                                setViewMode('analyze_view');
                              }}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                              Consultar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPdfStudentId(st.id);
                                setShowPdfModal(true);
                              }}
                              className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 cursor-pointer"
                              title="Gerar PDF"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL / CARD À FRENTE: BIOMETRIA INICIAL (PESO E ALTURA) ANTES DOS CARDS */}
      {/* ========================================================================= */}
      {showBiometricsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95 my-8">
            {/* Cabeçalho */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 inline-block mb-1.5">
                  Padrão de Nova Avaliação • Biometria Inicial
                </span>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-600" />
                  <span>Definir Peso & Altura do Aluno</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Informe o peso e a estatura de <strong>{selectedStudent.name}</strong> antes de ir para os cards de avaliação. Esses valores serão propagados automaticamente para todas as avaliações selecionadas, eliminando digitação repetida.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowBiometricsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Identificação do Aluno */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{selectedStudent.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    Matrícula: {selectedStudent.code} • {selectedStudent.gender || 'Gênero não informado'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Plano Ativo</span>
                <span className="text-xs font-black text-blue-700">{selectedStudent.plan || 'Plano Pro'}</span>
              </div>
            </div>

            {/* Grid dos Campos de Peso e Altura */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card de Peso Corporal */}
              <div className="p-4 rounded-2xl bg-white border-2 border-blue-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-blue-600" />
                    <span>Peso Corporal</span>
                  </label>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">kg</span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    value={sessionWeightKg}
                    onChange={(e) => setSessionWeightKg(Math.max(20, Math.min(300, parseFloat(e.target.value) || 0)))}
                    className="w-full text-2xl font-black text-slate-900 px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 text-center"
                  />
                </div>

                {/* Ajustes Rápidos */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setSessionWeightKg(prev => Number(Math.max(20, prev - 1.0).toFixed(1)))}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                  >
                    -1.0
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionWeightKg(prev => Number(Math.max(20, prev - 0.5).toFixed(1)))}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                  >
                    -0.5
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionWeightKg(prev => Number(Math.min(300, prev + 0.5).toFixed(1)))}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                  >
                    +0.5
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionWeightKg(prev => Number(Math.min(300, prev + 1.0).toFixed(1)))}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                  >
                    +1.0
                  </button>
                </div>
              </div>

              {/* Card de Estatura / Altura */}
              <div className="p-4 rounded-2xl bg-white border-2 border-indigo-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-indigo-600" />
                    <span>Estatura / Altura</span>
                  </label>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {(sessionHeightCm / 100).toFixed(2)} m
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="50"
                    max="250"
                    value={sessionHeightCm}
                    onChange={(e) => setSessionHeightCm(Math.max(50, Math.min(250, parseFloat(e.target.value) || 0)))}
                    className="w-full text-2xl font-black text-slate-900 px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 text-center"
                  />
                </div>

                {/* Ajustes Rápidos */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setSessionHeightCm(prev => Number(Math.max(50, prev - 2).toFixed(1)))}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                  >
                    -2 cm
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionHeightCm(prev => Number(Math.max(50, prev - 1).toFixed(1)))}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                  >
                    -1 cm
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionHeightCm(prev => Number(Math.min(250, prev + 1).toFixed(1)))}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                  >
                    +1 cm
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionHeightCm(prev => Number(Math.min(250, prev + 2).toFixed(1)))}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                  >
                    +2 cm
                  </button>
                </div>
              </div>
            </div>

            {/* Resultado do IMC em Tempo Real */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Índice de Massa Corporal (IMC Calculado)
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-slate-900">{sessionBmi}</span>
                  <span className="text-xs font-bold text-slate-500">kg/m²</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-xl border text-xs font-black ${sessionBmiCategory.color}`}>
                  {sessionBmiCategory.label}
                </span>
              </div>
            </div>

            {/* Aviso de Propagação Automática */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-black text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Propagação Automática em Todas as Avaliações Selecionadas:</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Este peso ({sessionWeightKg} kg) e estatura ({sessionHeightCm} cm) serão sincronizados automaticamente em todos os <strong>{selectedProtocolsForNew.length} módulos</strong> ativos da sessão. Você não precisará digitar essa informação novamente.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedProtocolsForNew.map(pId => {
                  const pObj = ALL_ASSESSMENT_PROTOCOLS.find(p => p.id === pId);
                  if (!pObj) return null;
                  return (
                    <span key={pId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      ✓ {pObj.shortName}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Ações */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowBiometricsModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {viewMode === 'session_filling' ? 'Cancelar Edição' : 'Voltar à Seleção'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowBiometricsModal(false);
                  if (viewMode === 'select_protocols') {
                    handleStartSession();
                    showToast(`Biometria inicial confirmada (${sessionWeightKg} kg / ${sessionHeightCm} cm) e aplicada a todas as avaliações!`);
                  } else {
                    showToast(`Peso (${sessionWeightKg} kg) e altura (${sessionHeightCm} cm) atualizados na sessão!`);
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>{viewMode === 'session_filling' ? 'Salvar e Atualizar Avaliações' : 'Confirmar e Iniciar Avaliações (Ir para os Cards)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL DE CANCELAR AVALIAÇÃO (Descartar vs Salvar Rascunho) */}
      {/* ========================================================================= */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">
                  Deseja cancelar esta avaliação?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Você está preenchendo a avaliação de <strong>{selectedStudent.name}</strong> ({completedSessionProtocols.length} de {selectedProtocolsForNew.length} módulos concluídos). Como deseja proceder?
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {/* OPÇÃO 1: DESCARTAR TOTALMENTE */}
              <button
                type="button"
                onClick={handleConfirmDiscardChanges}
                className="w-full p-3.5 rounded-2xl border-2 border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-left transition-all cursor-pointer group"
              >
                <strong className="block text-xs font-black text-rose-800">
                  Descartar totalmente as alterações
                </strong>
                <span className="text-[11px] text-rose-600/90 block mt-0.5">
                  Todas as respostas preenchidas nesta sessão serão perdidas e você voltará à tela original.
                </span>
              </button>

              {/* OPÇÃO 2: DEIXAR COMO RASCUNHO PARA CONTINUAR DEPOIS */}
              <button
                type="button"
                onClick={handleConfirmSaveDraft}
                className="w-full p-3.5 rounded-2xl border-2 border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-left transition-all cursor-pointer group"
              >
                <strong className="block text-xs font-black text-amber-900">
                  Deixar como rascunho para continuar depois
                </strong>
                <span className="text-[11px] text-amber-700/90 block mt-0.5">
                  Salva o progresso atual. Você poderá retomar esta avaliação a qualquer momento pelo painel.
                </span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Continuar Preenchendo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL DE GERAR PDF (COM SELEÇÃO DE ALUNO E ENVIO NO WHATSAPP) */}
      {/* ========================================================================= */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-blue-600" />
                  <span>Gerar Relatório Completo em PDF</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecione o aluno e os módulos para emitir o laudo clínico ou compartilhar via WhatsApp.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* SELEÇÃO DO ALUNO NO GERADOR DE PDF (Solicitado) */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
              <label className="text-xs font-black text-blue-900 block">
                Aluno para Emissão do Laudo:
              </label>
              <select
                value={pdfStudentId}
                onChange={(e) => {
                  setPdfStudentId(e.target.value);
                  handleStudentChange(e.target.value);
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 cursor-pointer shadow-2xs"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code}) - {s.phone || 'Sem tel.'}
                  </option>
                ))}
              </select>
            </div>

            {/* Checkboxes das 10 Avaliações */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">
                  Módulos a Exportar no Relatório:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPdfSelectedProtocols(ALL_ASSESSMENT_PROTOCOLS.map(p => p.id))}
                    className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Marcar Todos
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setPdfSelectedProtocols(['dobras_cutaneas', 'bioimpedancia'])}
                    className="text-[10px] font-bold text-slate-500 hover:underline cursor-pointer"
                  >
                    Apenas Composição
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ALL_ASSESSMENT_PROTOCOLS.map((proto) => {
                  const isChecked = pdfSelectedProtocols.includes(proto.id);
                  const Icon = proto.icon;

                  return (
                    <label
                      key={proto.id}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked ? 'bg-blue-50/60 border-blue-400 text-blue-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setPdfSelectedProtocols(prev => 
                              prev.includes(proto.id) 
                                ? prev.filter(p => p !== proto.id) 
                                : [...prev, proto.id]
                            );
                          }}
                          className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                        />
                        <Icon className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-bold">{proto.name}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Opções de Documento */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold block text-slate-900">Especificações do Documento:</span>
              <p className="text-[11px] text-slate-500">
                Cabeçalho institucional GL PRO FIT, dados cineantropométricos, tabelas normativas, parecer técnico e campo de assinatura do Prof. Gianluca Marinho (CREF 112001-G/SP).
              </p>
            </div>

            {/* Botões de Ação: WhatsApp + Imprimir PDF */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
              {/* BOTÃO DE COMPARTILHAR NO WHATSAPP (Colocado exclusivamente aqui na geração do relatório) */}
              <button
                type="button"
                onClick={() => {
                  const selectedNames = ALL_ASSESSMENT_PROTOCOLS
                    .filter(p => pdfSelectedProtocols.includes(p.id))
                    .map(p => p.name);
                  handleShareReportWhatsApp(currentPdfStudent, selectedNames);
                }}
                disabled={pdfSelectedProtocols.length === 0}
                className="px-4 py-2.5 rounded-xl border border-emerald-400 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Compartilhar no WhatsApp</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPdfModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPdfModal(false);
                    window.print();
                  }}
                  disabled={pdfSelectedProtocols.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Gerar PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
