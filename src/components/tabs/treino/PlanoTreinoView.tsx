import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Calendar, 
  Clock, 
  Dumbbell, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Video, 
  Package, 
  Printer, 
  Share2, 
  Copy, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  ExternalLink, 
  Sparkles, 
  Check, 
  X, 
  Eye, 
  Users, 
  User, 
  Layers, 
  Award,
  Zap,
  Tag,
  ArrowRight,
  Flame,
  Info,
  Settings,
  MapPin,
  Minus
} from 'lucide-react';
import { LessonPlan, LessonPlanActivity, Student, SystemUser, ExerciseCatalogItem } from '../../../types';
import { PlanoTreinoConfigModal, PlanoTreinoSettings, DEFAULT_PLAN_SETTINGS } from './PlanoTreinoConfigModal';
import { PlanoTreinoVideoSelectorModal } from './PlanoTreinoVideoSelectorModal';
import { PlanoTreinoMaterialSelector } from './PlanoTreinoMaterialSelector';
import { PlanoTreinoDurationStepper } from './PlanoTreinoDurationStepper';
import { syncCollectionToFirestore } from '../../../services/firebaseDbService';

interface PlanoTreinoViewProps {
  students?: Student[];
  currentUser?: SystemUser | null;
}

const STORAGE_KEY = 'glprofit_lesson_plans';
const SETTINGS_STORAGE_KEY = 'glprofit_plan_settings';

// Materiais comuns para inserção ágil com 1 clique
const QUICK_MATERIALS = [
  'Colchonetes',
  'Cones Demarcatórios',
  'Halteres',
  'Kettlebells',
  'Mini-bands',
  'Corda Naval',
  'Barra Olímpica',
  'Anilhas',
  'Fita TRX',
  'Medicine Ball',
  'Caixa de Salto (Box)',
  'Step',
  'Escada de Agilidade',
  'Bola Suíça',
  'Elásticos Superband',
  'Rolo de Liberação',
  'Cronômetro'
];

// Sugestões de objetivos frequentes
const QUICK_OBJECTIVES = [
  'Desenvolvimento de Força Muscular e Hipertrofia',
  'Resistência Cardiorrespiratória e Queima Calórica',
  'Coordenação Motora e Agilidade em Deslocamento',
  'Potência Muscular de Membros Inferiores',
  'Mobilidade Articular e Estabilização de Core',
  'Aprimoramento Técnico e Consciência Postural',
  'Treinamento Intervalado de Alta Intensidade (HIIT)'
];

export const INITIAL_LESSON_PLANS: LessonPlan[] = [
  {
    id: 'lp-01',
    date: '2025-10-01',
    level: 'Intermediário',
    title: 'Treino Funcional Intermediário - Potência & Agilidade',
    modality: 'Treinamento Funcional',
    targetType: 'turma',
    targetName: 'Turma Intermediária Geral (01/10/2025)',
    instructor: 'Prof. Gianluca Marinho (CREF 112001-G/SP)',
    mainObjectives: 'Desenvolvimento de capacidade aeróbia, potência de membros inferiores, ativação e estabilização de core, agilidade motora.',
    objectivesReachedStatus: 'atingido',
    objectivesReachedNotes: '90% dos alunos completaram as 3 atividades dentro dos tempos estipulados com excelente postura.',
    classObservations: 'Turma com ótimo engajamento. Na Atividade 02, alguns alunos precisaram de ajuste na pegada do kettlebell; realizado feedback individual.',
    warmup: {
      description: 'Mobilidade articular de tornozelo, quadril e coluna torácica + Ativação de glúteos com mini-band + Saltitos dinâmicos com elevação progressiva de FC.',
      durationMinutes: 10,
      materials: ['Mini-bands', 'Colchonetes', 'Cones pequenos'],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    activities: [
      {
        id: 'act-1',
        number: 1,
        title: 'ATIVIDADE 01',
        description: 'Circuito de Força & Estabilidade:\n• 4 passagens de 40s trabalho / 20s descanso\n• Exercício A: Agachamento Goblet com Kettlebell\n• Exercício B: Flexão de braço com toque no ombro\n• Exercício C: Prancha lateral dinâmica bilateral',
        durationMinutes: 15,
        materials: ['Kettlebells (12kg e 16kg)', 'Colchonetes', 'Cronômetro'],
        videoUrl: 'https://www.youtube.com/watch?v=sample1',
        notes: 'Focar na cadência controlada e alinhamento neutro da coluna.'
      },
      {
        id: 'act-2',
        number: 2,
        title: 'ATIVIDADE 02',
        description: 'Potência & Agilidade em Escada / Cones:\n• Drill de agilidade em zigue-zague com desaceleração rápida\n• 4 séries de 6 tiros de 10 metros com recuperação ativa\n• Saltos verticais pliométricos sobre mini-barreiras',
        durationMinutes: 15,
        materials: ['Escada de agilidade', 'Cones demarcatórios', 'Mini-barreiras de salto'],
        videoUrl: 'https://www.youtube.com/watch?v=sample2',
        notes: 'Enfatizar aterrissagem suave e contato com antepé.'
      },
      {
        id: 'act-3',
        number: 3,
        title: 'ATIVIDADE 03',
        description: 'Desafio Metabólico Final (AMRAP 10 Minutos):\n• 10 Kettlebell Swings\n• 12 Mountain Climbers\n• 10 Burpees adaptados\n• 30s de Prancha isométrica',
        durationMinutes: 15,
        materials: ['Kettlebells 14kg', 'Colchonetes', 'Corda naval'],
        videoUrl: 'https://www.youtube.com/watch?v=sample3',
        notes: 'Manter controle da respiração e ritmo contínuo.'
      }
    ],
    cooldown: {
      description: 'Volta à calma com descompressão lombar no colchonete, respiração diafragmática 4-7-8 e alongamento passivo suave de posteriores.',
      durationMinutes: 5
    },
    totalDurationMinutes: 55,
    status: 'concluido',
    createdAt: '2025-10-01'
  },
  {
    id: 'lp-02',
    date: '2026-10-04',
    level: 'Iniciante',
    title: 'Adaptação Anatômica & Fundamentos de Força',
    modality: 'Musculação / Funcional',
    targetType: 'aluno',
    targetName: 'Beatriz Nogueira Silva',
    instructor: 'Prof. Gianluca Marinho (CREF 112001-G/SP)',
    mainObjectives: 'Aprendizagem motora dos padrões fundamentais (agachar, empurrar e puxar), controle neuromuscular e postura segura.',
    objectivesReachedStatus: 'atingido',
    objectivesReachedNotes: 'Aluna conseguiu executar com excelência a postura sem queixa de dores.',
    classObservations: 'Excelente assimilação biomecânica. Liberada para progressão de carga leve na próxima semana.',
    warmup: {
      description: 'Liberação miofascial com rolo nos glúteos e panturrilhas + Mobilidade de quadril + Ponte de glúteos unilateral.',
      durationMinutes: 8,
      materials: ['Rolo de liberação', 'Colchonetes']
    },
    activities: [
      {
        id: 'act-21',
        number: 1,
        title: 'ATIVIDADE 01',
        description: 'Padronização do Box Squat (Agachamento na Caixa):\n• 3 séries de 10 a 12 repetições\n• Foco no controle excêntrico e apoio firme dos calcanhares',
        durationMinutes: 15,
        materials: ['Box de salto 40cm', 'Halter 6kg'],
        videoUrl: 'https://www.youtube.com/watch?v=boxsquat'
      },
      {
        id: 'act-22',
        number: 2,
        title: 'ATIVIDADE 02',
        description: 'Padrão de Empurrar no Solo (Floor Press com Halteres):\n• 3 séries de 10 reps com cadência 2-0-2\n• Estabilização escapular no chão',
        durationMinutes: 15,
        materials: ['Pares de Halteres 5kg', 'Colchonete'],
        videoUrl: 'https://www.youtube.com/watch?v=floorpress'
      },
      {
        id: 'act-23',
        number: 3,
        title: 'ATIVIDADE 03',
        description: 'Core & Estabilidade Anti-rotacional:\n• Deadbug com bola suíça + Prancha frontal com joelhos apoiados\n• 3 passagens de 30 segundos cada',
        durationMinutes: 12,
        materials: ['Bola Suíça 55cm', 'Colchonete'],
        videoUrl: 'https://www.youtube.com/watch?v=deadbug'
      }
    ],
    cooldown: {
      description: 'Alongamento estático suave e feedback verbal pós-treino.',
      durationMinutes: 5
    },
    totalDurationMinutes: 50,
    status: 'planejado',
    createdAt: '2026-10-04'
  }
];

export const PlanoTreinoView: React.FC<PlanoTreinoViewProps> = ({
  students = [],
  currentUser
}) => {
  // Estado principal dos planos de treino
  const [plans, setPlans] = useState<LessonPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_LESSON_PLANS;
    } catch {
      return INITIAL_LESSON_PLANS;
    }
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string>(() => {
    return plans[0]?.id || 'lp-01';
  });
  const [viewingPlanId, setViewingPlanId] = useState<string | null>(null);

  // Filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'todos' | 'Iniciante' | 'Intermediário' | 'Avançado'>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'planejado' | 'em_andamento' | 'concluido'>('todos');

  // Modais
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [isTimerModeOpen, setIsTimerModeOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [videoSelectorTarget, setVideoSelectorTarget] = useState<{
    isOpen: boolean;
    activityIndex: number; // -1 for warmup, >= 0 for activities
    title: string;
  }>({ isOpen: false, activityIndex: -1, title: '' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Configurações persistentes de Materiais, Objetivos, Locais, Modalidades e Turmas Alvo
  const [settings, setSettings] = useState<PlanoTreinoSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PLAN_SETTINGS;
    } catch {
      return DEFAULT_PLAN_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Formulário de edição/criação
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);

  // Timer interativo da aula
  const [activeTimerActivityIndex, setActiveTimerActivityIndex] = useState<number>(-1); // -1: warmup, 0+: activities, -2: cooldown
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    syncCollectionToFirestore('lesson_plans', plans);
  }, [plans]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedPlan = useMemo(() => {
    if (!viewingPlanId) return null;
    return plans.find(p => p.id === viewingPlanId) || null;
  }, [plans, viewingPlanId]);

  // Planos filtrados
  const filteredPlans = useMemo(() => {
    return plans.filter(p => {
      const matchesSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mainObjectives.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.date.includes(searchTerm) ||
        (p.targetName && p.targetName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLevel = levelFilter === 'todos' || p.level === levelFilter;
      const matchesStatus = statusFilter === 'todos' || p.status === statusFilter;
      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [plans, searchTerm, levelFilter, statusFilter]);

  // Manipulação do Timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            showToast('Tempo da atividade finalizado!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  // Inicializa criação de novo plano com base no modelo da planilha
  const handleOpenCreateModal = (preset?: 'planilha' | 'vazio') => {
    const defaultInstructor = currentUser?.name 
      ? `Prof. ${currentUser.name}` 
      : 'Prof. Gianluca Marinho (CREF 112001-G/SP)';

    const todayStr = new Date().toISOString().slice(0, 10);

    if (preset === 'planilha') {
      const templatePlan: LessonPlan = {
        id: `lp-${Date.now()}`,
        date: todayStr,
        level: 'Intermediário',
        title: 'Plano de Aula & Treino Intermediário (Modelo Planilha)',
        modality: 'Treinamento Funcional / Musculação',
        targetType: 'turma',
        targetName: 'Turma Intermediária Geral',
        instructor: defaultInstructor,
        mainObjectives: 'Desenvolvimento de capacidade aeróbia, potência neuromuscular, força e estabilização de core.',
        objectivesReachedStatus: 'pendente',
        objectivesReachedNotes: '',
        classObservations: '',
        warmup: {
          description: 'Aquecimento dinâmico: mobilidade articular de tornozelo, quadril e coluna + ativação com mini-bands e elevação gradual de FC.',
          durationMinutes: 10,
          materials: ['Colchonetes', 'Mini-bands', 'Cones'],
          videoUrl: ''
        },
        activities: [
          {
            id: `act-${Date.now()}-1`,
            number: 1,
            title: 'ATIVIDADE 01',
            description: 'Circuito de Força & Estabilidade (4 passagens de 40s x 20s):\n• Exercício A: Agachamento Goblet\n• Exercício B: Flexão de braço com toque no ombro\n• Exercício C: Prancha dinâmica',
            durationMinutes: 15,
            materials: ['Kettlebells', 'Colchonetes'],
            videoUrl: '',
            notes: ''
          },
          {
            id: `act-${Date.now()}-2`,
            number: 2,
            title: 'ATIVIDADE 02',
            description: 'Potência & Agilidade em Escada / Cones:\n• Drills de agilidade e desaceleração\n• Tiros curtos com mudança de direção\n• Saltos pliométricos controlados',
            durationMinutes: 15,
            materials: ['Escada de agilidade', 'Cones'],
            videoUrl: '',
            notes: ''
          },
          {
            id: `act-${Date.now()}-3`,
            number: 3,
            title: 'ATIVIDADE 03',
            description: 'Desafio Metabólico Final (AMRAP 10-12 Minutos):\n• Kettlebell Swings\n• Mountain Climbers\n• Burpees adaptados\n• Isometria de core',
            durationMinutes: 15,
            materials: ['Kettlebells', 'Colchonetes'],
            videoUrl: '',
            notes: ''
          }
        ],
        cooldown: {
          description: 'Volta à calma, descompressão articular e respiração guiada.',
          durationMinutes: 5
        },
        totalDurationMinutes: 55,
        status: 'planejado',
        createdAt: todayStr
      };
      setEditingPlan(templatePlan);
    } else {
      const emptyPlan: LessonPlan = {
        id: `lp-${Date.now()}`,
        date: todayStr,
        level: 'Intermediário',
        title: 'Novo Plano de Treino',
        modality: 'Geral',
        targetType: 'geral',
        targetName: 'Turma Geral',
        instructor: defaultInstructor,
        mainObjectives: '',
        objectivesReachedStatus: 'pendente',
        objectivesReachedNotes: '',
        classObservations: '',
        warmup: {
          description: '',
          durationMinutes: 10,
          materials: [],
          videoUrl: ''
        },
        activities: [
          {
            id: `act-${Date.now()}-1`,
            number: 1,
            title: 'ATIVIDADE 01',
            description: '',
            durationMinutes: 15,
            materials: [],
            videoUrl: '',
            notes: ''
          },
          {
            id: `act-${Date.now()}-2`,
            number: 2,
            title: 'ATIVIDADE 02',
            description: '',
            durationMinutes: 15,
            materials: [],
            videoUrl: '',
            notes: ''
          },
          {
            id: `act-${Date.now()}-3`,
            number: 3,
            title: 'ATIVIDADE 03',
            description: '',
            durationMinutes: 15,
            materials: [],
            videoUrl: '',
            notes: ''
          }
        ],
        cooldown: {
          description: 'Volta à calma e alongamento.',
          durationMinutes: 5
        },
        totalDurationMinutes: 55,
        status: 'planejado',
        createdAt: todayStr
      };
      setEditingPlan(emptyPlan);
    }
    setIsEditorOpen(true);
  };

  const handleEditPlan = (plan: LessonPlan) => {
    setEditingPlan(JSON.parse(JSON.stringify(plan)));
    setIsEditorOpen(true);
  };

  const handleDuplicatePlan = (plan: LessonPlan) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const duplicated: LessonPlan = {
      ...JSON.parse(JSON.stringify(plan)),
      id: `lp-${Date.now()}`,
      title: `${plan.title} (Cópia)`,
      date: todayStr,
      status: 'planejado',
      objectivesReachedStatus: 'pendente',
      objectivesReachedNotes: '',
      classObservations: '',
      createdAt: todayStr
    };
    setPlans(prev => [duplicated, ...prev]);
    setSelectedPlanId(duplicated.id);
    showToast('Plano de treino duplicado com sucesso!');
  };

  const handleDeletePlan = (planId: string) => {
    if (plans.length <= 1) {
      showToast('O sistema precisa manter pelo menos um plano de treino cadastrado.');
      return;
    }
    setPlans(prev => prev.filter(p => p.id !== planId));
    if (viewingPlanId === planId) {
      setViewingPlanId(null);
    }
    if (selectedPlanId === planId) {
      const remaining = plans.filter(p => p.id !== planId);
      setSelectedPlanId(remaining[0]?.id || '');
    }
    showToast('Plano de treino removido com sucesso.');
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;
    if (!editingPlan.title.trim()) {
      showToast('Por favor, informe o título do plano de treino.');
      return;
    }

    // Calcula tempo total
    const warmupTime = Number(editingPlan.warmup?.durationMinutes) || 0;
    const activitiesTime = (editingPlan.activities || []).reduce((acc, a) => acc + (Number(a.durationMinutes) || 0), 0);
    const cooldownTime = Number(editingPlan.cooldown?.durationMinutes) || 0;
    const computedTotal = warmupTime + activitiesTime + cooldownTime;

    const finalizedPlan: LessonPlan = {
      ...editingPlan,
      totalDurationMinutes: computedTotal
    };

    setPlans(prev => {
      const index = prev.findIndex(p => p.id === finalizedPlan.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = finalizedPlan;
        return copy;
      }
      return [finalizedPlan, ...prev];
    });

    setSelectedPlanId(finalizedPlan.id);
    setViewingPlanId(finalizedPlan.id);
    setIsEditorOpen(false);
    setEditingPlan(null);
    showToast('Plano de treino salvo com sucesso!');
  };

  // Salva feedback rápido pós-aula
  const handleSaveQuickFeedback = (
    planId: string, 
    status: 'atingido' | 'parcial' | 'pendente' | 'nao_atingido', 
    observations: string
  ) => {
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          objectivesReachedStatus: status,
          classObservations: observations,
          status: status === 'atingido' || status === 'parcial' ? 'concluido' : p.status
        };
      }
      return p;
    }));
    setIsFeedbackModalOpen(false);
    showToast('Feedback e observações da aula registrados com sucesso!');
  };

  // Disparo para o WhatsApp
  const handleShareWhatsApp = (plan: LessonPlan) => {
    const formattedDate = plan.date ? plan.date.split('-').reverse().join('/') : '';
    
    let text = `📋 *GL PRO FIT • PLANO DE TREINO & AULA*\n`;
    text += `📅 *Data:* ${formattedDate} | *Nível:* ${plan.level.toUpperCase()}\n`;
    text += `🎯 *Objetivos:* ${plan.mainObjectives || 'Não informado'}\n\n`;
    
    text += `🔥 *AQUECIMENTO (${plan.warmup.durationMinutes} min):*\n`;
    text += `${plan.warmup.description}\n`;
    if (plan.warmup.materials?.length) {
      text += `📦 *Material:* ${plan.warmup.materials.join(', ')}\n`;
    }
    text += `\n`;

    plan.activities.forEach((act, idx) => {
      text += `⚡ *ATIVIDADE 0${idx + 1} (${act.durationMinutes} min):*\n`;
      text += `${act.description}\n`;
      if (act.materials?.length) {
        text += `📦 *Material:* ${act.materials.join(', ')}\n`;
      }
      if (act.videoUrl) {
        text += `🎥 *Vídeo:* ${act.videoUrl}\n`;
      }
      text += `\n`;
    });

    if (plan.cooldown?.description) {
      text += `🧘 *VOLTA À CALMA (${plan.cooldown.durationMinutes} min):*\n`;
      text += `${plan.cooldown.description}\n\n`;
    }

    text += `⏱️ *Tempo Total Estimado:* ${plan.totalDurationMinutes} minutos\n`;
    text += `👨‍🏫 *Professor Responsável:* ${plan.instructor}`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handlePrintPlan = () => {
    window.print();
  };

  // Anexar vídeo selecionado do Catálogo de Exercícios
  const handleSelectVideo = (exercise: ExerciseCatalogItem) => {
    const chosenVideoUrl = exercise.videoUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name)}`;

    if (editingPlan) {
      if (videoSelectorTarget.activityIndex === -1) {
        setEditingPlan({
          ...editingPlan,
          warmup: {
            ...editingPlan.warmup,
            videoUrl: chosenVideoUrl
          }
        });
      } else if (videoSelectorTarget.activityIndex >= 0 && editingPlan.activities[videoSelectorTarget.activityIndex]) {
        const updated = [...editingPlan.activities];
        updated[videoSelectorTarget.activityIndex] = {
          ...updated[videoSelectorTarget.activityIndex],
          videoUrl: chosenVideoUrl
        };
        setEditingPlan({
          ...editingPlan,
          activities: updated
        });
      }
    } else if (selectedPlan) {
      if (videoSelectorTarget.activityIndex === -1) {
        const updatedPlan: LessonPlan = {
          ...selectedPlan,
          warmup: { ...selectedPlan.warmup, videoUrl: chosenVideoUrl }
        };
        setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
      } else if (videoSelectorTarget.activityIndex >= 0 && selectedPlan.activities[videoSelectorTarget.activityIndex]) {
        const updatedActs = [...selectedPlan.activities];
        updatedActs[videoSelectorTarget.activityIndex] = {
          ...updatedActs[videoSelectorTarget.activityIndex],
          videoUrl: chosenVideoUrl
        };
        const updatedPlan: LessonPlan = {
          ...selectedPlan,
          activities: updatedActs
        };
        setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
      }
    }

    showToast(`Vídeo de "${exercise.name}" anexado com sucesso ao plano!`);
    setVideoSelectorTarget({ isOpen: false, activityIndex: -1, title: '' });
  };

  return (
    <div className="space-y-6">
      {/* Toast flutuante */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          {toastMessage}
        </div>
      )}

      {/* CABEÇALHO DO MÓDULO & AÇÕES RÁPIDAS */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Plano de Aula & Treino Estruturado
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
              Crie, gerencie e consulte os planos de aula com objetivos, tempo exato, materiais necessários, vídeos explicativos de cada atividade e observações pós-treino.
            </p>
          </div>

          {/* Botões de Ação do Professor */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleOpenCreateModal('planilha')}
              className="px-4 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              title="Criar novo plano pré-preenchido com o modelo da planilha de exemplo"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Plano de Treino</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenCreateModal('vazio')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Iniciar um plano do zero"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Em Branco</span>
            </button>

            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Configurar opções de: Materiais, Objetivos, Local de Treino, Modalidade e Turma Alvo"
            >
              <Settings className="w-4 h-4 text-blue-700" />
              <span>Configurações</span>
            </button>

            {selectedPlan && (
              <>
                <button
                  type="button"
                  onClick={handlePrintPlan}
                  className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Imprimir plano de treino formatado para prancheta física"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span className="hidden sm:inline">Imprimir / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShareWhatsApp(selectedPlan)}
                  className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Compartilhar resumo completo no WhatsApp da turma ou aluno"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* BARRA DE FILTROS & SELETOR DE PLANOS CADASTRADOS */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Input de Busca */}
            <div className="relative min-w-56 flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por data, nível, objetivo ou turma..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Filtro de Nível */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 font-medium text-[11px] mr-1 hidden sm:inline">Nível:</span>
              {(['todos', 'Iniciante', 'Intermediário', 'Avançado'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    levelFilter === lvl
                      ? 'bg-blue-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lvl === 'todos' ? 'Todos' : lvl}
                </button>
              ))}
            </div>

            {/* Filtro de Status */}
            <div className="flex items-center gap-1 text-xs ml-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 cursor-pointer"
              >
                <option value="todos">Status: Todos</option>
                <option value="planejado">Planejado</option>
                <option value="concluido">Concluído</option>
                <option value="em_andamento">Em Andamento</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* LISTA RÁPIDA DE PLANOS SALVOS (CARDS HORIZONTAIS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPlans.map((plan) => {
          const isSelected = plan.id === selectedPlanId;
          const isViewing = viewingPlanId === plan.id;
          const formattedDate = plan.date ? plan.date.split('-').reverse().join('/') : '';
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between gap-3 ${
                isViewing
                  ? 'bg-white border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                  : isSelected
                    ? 'bg-white border-blue-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-2xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-blue-900 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-700" />
                    {formattedDate}
                  </span>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    plan.level === 'Avançado'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : plan.level === 'Intermediário'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {plan.level}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
                  {plan.title}
                </h4>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {plan.mainObjectives || 'Sem objetivos descritos.'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{plan.totalDurationMinutes || 55} min</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] font-normal text-slate-500">
                      {plan.activities?.length || 3} Atividades
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPlan(plan);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
                      title="Editar Plano"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicatePlan(plan);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
                      title="Duplicar Plano"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlan(plan.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Excluir Plano"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Botão Ver Treino */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (viewingPlanId === plan.id) {
                      setViewingPlanId(null);
                    } else {
                      setViewingPlanId(plan.id);
                      setSelectedPlanId(plan.id);
                      setTimeout(() => {
                        const el = document.getElementById('ficha-treino-detalhes');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }
                  }}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-98 ${
                    isViewing
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isViewing ? 'Ocultar Treino' : 'Ver Treino'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* VISUALIZAÇÃO PRINCIPAL DO PLANO SELECIONADO (ESTILO PLANILHA OFICIAL) */}
      {/* ========================================================================= */}
      {selectedPlan && (
        <div id="ficha-treino-detalhes" className="rounded-2xl bg-white border border-slate-300 shadow-sm overflow-hidden print:border-none print:shadow-none animate-in fade-in duration-200">
          
          {/* BARRA DE FECHAR / CONTROLE NO TOPO DA FICHA */}
          <div className="bg-slate-950 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
              <Eye className="w-4 h-4 text-blue-400" />
              <span>Ficha Completa Preenchida: <strong className="text-white">{selectedPlan.title}</strong></span>
            </div>

            <button
              type="button"
              onClick={() => setViewingPlanId(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
              title="Fechar visualização da ficha"
            >
              <X className="w-3.5 h-3.5" />
              <span>Fechar Ficha</span>
            </button>
          </div>

          {/* TOPO DA PLANILHA (DATA, NÍVEL E CONTROLES DE SESSÃO) */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                    Plano de Treino & Aula
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-300">
                    {selectedPlan.modality || 'Treinamento Físico'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {selectedPlan.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Responsável: <strong>{selectedPlan.instructor}</strong> • Turma Alvo: <strong>{selectedPlan.targetName || 'Turma Coletiva'}</strong>
                  {selectedPlan.trainingLocation && (
                    <> • Local: <strong>{selectedPlan.trainingLocation}</strong></>
                  )}
                </p>
              </div>

              {/* Data e Nível em Destaque Conforme a Planilha */}
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-center">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Data</span>
                  <span className="text-sm sm:text-base font-black text-white">
                    {selectedPlan.date ? selectedPlan.date.split('-').reverse().join('/') : '01/10/2025'}
                  </span>
                </div>

                <div className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-center shadow-xs">
                  <span className="block text-[9px] text-slate-900 uppercase tracking-widest font-black">Classificação</span>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                    NÍVEL - {selectedPlan.level.toUpperCase()}
                  </span>
                </div>

                {/* Botão de Feedback Rápido */}
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Registrar se os objetivos foram atingidos e observações da aula"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Feedback da Aula</span>
                </button>
              </div>
            </div>
          </div>

          {/* BLOCO DA PLANILHA: OBJETIVOS PRINCIPAIS, OBJETIVOS ATINGIDOS E OBSERVAÇÕES */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-b border-slate-200 bg-slate-50/60">
            
            {/* Coluna 1: OBJETIVOS PRINCIPAIS */}
            <div className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  OBJETIVOS PRINCIPAIS
                </h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-slate-200 min-h-24 shadow-2xs">
                {selectedPlan.mainObjectives || 'Nenhum objetivo principal cadastrado.'}
              </p>
            </div>

            {/* Coluna 2: OBJETIVOS ATINGIDOS */}
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    OBJETIVOS ATINGIDOS?
                  </h4>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                  selectedPlan.objectivesReachedStatus === 'atingido'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : selectedPlan.objectivesReachedStatus === 'parcial'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : selectedPlan.objectivesReachedStatus === 'nao_atingido'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-slate-200 text-slate-700'
                }`}>
                  {selectedPlan.objectivesReachedStatus === 'atingido' ? '✓ Sim / Totalmente' :
                   selectedPlan.objectivesReachedStatus === 'parcial' ? '⚠ Parcialmente' :
                   selectedPlan.objectivesReachedStatus === 'nao_atingido' ? '✕ Não Atingido' : 'Pendente de Avaliação'}
                </span>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-slate-200 min-h-24 shadow-2xs space-y-2">
                <p>
                  {selectedPlan.objectivesReachedNotes || (
                    selectedPlan.objectivesReachedStatus === 'atingido'
                      ? 'Objetivos pedagógicos e fisiológicos cumpridos com sucesso durante a sessão.'
                      : 'Aguardando encerramento da aula para preenchimento de status.'
                  )}
                </p>
              </div>
            </div>

            {/* Coluna 3: ALGUMA OBSERVAÇÃO DA AULA? */}
            <div className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  ALGUMA OBSERVAÇÃO DA AULA?
                </h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-slate-200 min-h-24 shadow-2xs">
                {selectedPlan.classObservations || 'Nenhuma observação ou intercorrência registrada pelo treinador.'}
              </p>
            </div>
          </div>

          {/* SEÇÃO DA PLANILHA: QUAIS SERÃO AS ATIVIDADES? */}
          <div className="p-5 sm:p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase">
                  QUAIS SERÃO AS ATIVIDADES?
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <Clock className="w-4 h-4 text-blue-700" />
                <span>Tempo Total da Sessão: <strong className="text-slate-900">{selectedPlan.totalDurationMinutes || 55} minutos</strong></span>
              </div>
            </div>

            {/* BLOCO DE AQUECIMENTO CONFORME PLANILHA */}
            <div className="rounded-2xl bg-amber-50/70 border border-amber-200/90 p-4 sm:p-5 space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h4 className="text-sm font-black text-amber-950 uppercase tracking-wider">
                    AQUECIMENTO:
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-lg">
                    TEMPO: {selectedPlan.warmup.durationMinutes} MINUTOS
                  </span>

                  {selectedPlan.warmup.videoUrl ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveVideoUrl(selectedPlan.warmup.videoUrl || null);
                          setIsVideoModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5 text-amber-700" />
                        <span>Vídeo Demo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoSelectorTarget({
                          isOpen: true,
                          activityIndex: -1,
                          title: 'Aquecimento'
                        })}
                        className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold transition-colors cursor-pointer"
                        title="Trocar vídeo a partir do Catálogo de Exercícios"
                      >
                        Trocar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setVideoSelectorTarget({
                        isOpen: true,
                        activityIndex: -1,
                        title: 'Aquecimento'
                      })}
                      className="px-2.5 py-1 rounded-lg bg-amber-100/80 hover:bg-amber-200 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Selecionar vídeo do catálogo de exercícios"
                    >
                      <Video className="w-3.5 h-3.5 text-amber-700" />
                      <span>+ Anexar Vídeo do Catálogo</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                {selectedPlan.warmup.description || 'Aquecimento articular e ativação neuromuscular geral.'}
              </p>

              {/* Materiais do Aquecimento */}
              {selectedPlan.warmup.materials && selectedPlan.warmup.materials.length > 0 && (
                <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-extrabold text-amber-900 uppercase text-[11px]">Material:</span>
                  {selectedPlan.warmup.materials.map((mat, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-slate-700 text-xs font-semibold shadow-2xs">
                      {mat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* AS 3 ATIVIDADES PRINCIPAIS (EM 3 COLUNAS IDÊNTICAS À PLANILHA) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedPlan.activities.map((activity, index) => {
                return (
                  <div
                    key={activity.id || index}
                    className="rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all p-4 sm:p-5 flex flex-col justify-between shadow-2xs space-y-4 group"
                  >
                    <div className="space-y-3">
                      {/* Título da Atividade */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <span className="text-xs font-black text-blue-900 bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          {activity.title || `ATIVIDADE 0${index + 1}`}
                        </span>

                        <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-md">
                          TEMPO: {activity.durationMinutes} MIN
                        </span>
                      </div>

                      {/* Descrição dos Exercícios da Atividade */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                          Descrição / Exercícios
                        </span>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-line bg-slate-50/70 p-3 rounded-xl border border-slate-100 min-h-28">
                          {activity.description || 'Exercícios não detalhados.'}
                        </p>
                      </div>

                      {/* Materiais Utilizados */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                          <Package className="w-3 h-3 text-slate-500" />
                          <span>MATERIAL:</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5 min-h-8">
                          {activity.materials && activity.materials.length > 0 ? (
                            activity.materials.map((mat, mIdx) => (
                              <span 
                                key={mIdx} 
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200"
                              >
                                {mat}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">Nenhum material listado</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rodapé da Atividade: Vídeos e Ações */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {activity.videoUrl ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveVideoUrl(activity.videoUrl || null);
                                setIsVideoModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Assistir vídeo de demonstração"
                            >
                              <Video className="w-3.5 h-3.5 text-blue-700" />
                              <span>VÍDEO ATIVIDADE 0{index + 1}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setVideoSelectorTarget({
                                isOpen: true,
                                activityIndex: index,
                                title: activity.title || `Atividade 0${index + 1}`
                              })}
                              className="px-2 py-1 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-slate-100 text-[11px] font-bold transition-colors cursor-pointer"
                              title="Trocar vídeo selecionando do catálogo de exercícios"
                            >
                              Trocar
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setVideoSelectorTarget({
                              isOpen: true,
                              activityIndex: index,
                              title: activity.title || `Atividade 0${index + 1}`
                            })}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-800 text-slate-600 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Selecionar vídeo do catálogo de exercícios"
                          >
                            <Video className="w-3.5 h-3.5 text-blue-600" />
                            <span>+ Anexar Vídeo do Catálogo</span>
                          </button>
                        )}
                      </div>

                      {/* Botão de Timer para esta atividade */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTimerActivityIndex(index);
                          setTimerSecondsLeft((activity.durationMinutes || 15) * 60);
                          setIsTimerRunning(true);
                          setIsTimerModeOpen(true);
                        }}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition-colors cursor-pointer"
                        title="Iniciar cronômetro desta atividade"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* VOLTA À CALMA (SE HOUVER) */}
            {selectedPlan.cooldown && selectedPlan.cooldown.description && (
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    VOLTA À CALMA / DESAQUECIMENTO:
                  </h4>
                  <span className="text-xs font-bold text-slate-600">
                    TEMPO: {selectedPlan.cooldown.durationMinutes || 5} MIN
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedPlan.cooldown.description}
                </p>
              </div>
            )}
          </div>

          {/* RODAPÉ INFORMATIVO DA PRANCHETA */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span>GL PRO FIT • Módulo de Periodização e Aulas</span>
              <span>•</span>
              <span>Protocolo Oficial do Professor</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewingPlanId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer shadow-2xs flex items-center gap-1 transition-colors"
                title="Fechar visualização da ficha"
              >
                <X className="w-3.5 h-3.5" />
                <span>Fechar Ficha</span>
              </button>

              <button
                type="button"
                onClick={() => handleEditPlan(selectedPlan)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer shadow-2xs"
              >
                Editar Informações
              </button>

              <button
                type="button"
                onClick={() => handleDuplicatePlan(selectedPlan)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer shadow-2xs"
              >
                Duplicar Aula
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DO EDITOR / CRIADOR RÁPIDO DO PLANO (PRÁTICO E ÁGIL) */}
      {/* ========================================================================= */}
      {isEditorOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Topo do Modal */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingPlan.id ? 'Editar Plano de Treino' : 'Novo Plano de Treino'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Preenchimento prático com atalhos para materiais, vídeos e tempos
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Conteúdo Rolável do Formulário */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-main-scrollbar">
              
              {/* 1. METADADOS: DATA, NÍVEL, TÍTULO E PROFESSOR */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-700" />
                  <span>Identificação da Aula / Treino</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Data da Aula (dd/mm/aaaa) *
                    </label>
                    <input
                      type="date"
                      value={editingPlan.date}
                      onChange={(e) => setEditingPlan({ ...editingPlan, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nível de Dificuldade *
                    </label>
                    <select
                      value={editingPlan.level}
                      onChange={(e) => setEditingPlan({ ...editingPlan, level: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Iniciante">Iniciante</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado">Avançado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Modalidade (Grupo)
                    </label>
                    <select
                      value={editingPlan.modality || settings.modalities[0] || ''}
                      onChange={(e) => setEditingPlan({ ...editingPlan, modality: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {settings.modalities.map((m, idx) => (
                        <option key={idx} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Local de Treino
                    </label>
                    <select
                      value={editingPlan.trainingLocation || settings.locations[0] || ''}
                      onChange={(e) => setEditingPlan({ ...editingPlan, trainingLocation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {settings.locations.map((loc, idx) => (
                        <option key={idx} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Título do Treino / Aula *
                    </label>
                    <input
                      type="text"
                      value={editingPlan.title}
                      onChange={(e) => setEditingPlan({ ...editingPlan, title: e.target.value })}
                      placeholder="Ex: Treino Coletivo de Futebol & Finalizações"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Turma Alvo (Atividades Exclusivas em Grupo) *
                    </label>
                    <select
                      value={editingPlan.targetName || settings.targetGroups[0] || ''}
                      onChange={(e) => setEditingPlan({ ...editingPlan, targetName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {settings.targetGroups.map((tg, idx) => (
                        <option key={idx} value={tg}>{tg}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. OBJETIVOS PRINCIPAIS & SUGESTÕES ÁGEIS */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    OBJETIVOS PRINCIPAIS DA AULA *
                  </label>
                  <span className="text-[11px] text-slate-400">Clique nas sugestões cadastradas para adicionar rápido</span>
                </div>

                <textarea
                  rows={3}
                  value={editingPlan.mainObjectives}
                  onChange={(e) => setEditingPlan({ ...editingPlan, mainObjectives: e.target.value })}
                  placeholder="Descreva os objetivos principais que serão trabalhados..."
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                {/* Chips de Objetivos Pré-Cadastrados */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {settings.objectives.map((obj, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => {
                        const current = editingPlan.mainObjectives ? `${editingPlan.mainObjectives}, ` : '';
                        setEditingPlan({ ...editingPlan, mainObjectives: `${current}${obj}` });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200 transition-colors cursor-pointer"
                    >
                      + {obj}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. AQUECIMENTO */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>AQUECIMENTO (Descrição, Tempo e Vídeo)</span>
                  </span>

                  <PlanoTreinoDurationStepper
                    value={editingPlan.warmup.durationMinutes}
                    onChange={(val) => setEditingPlan({
                      ...editingPlan,
                      warmup: { ...editingPlan.warmup, durationMinutes: val }
                    })}
                    label="TEMPO:"
                  />
                </div>

                <textarea
                  rows={2}
                  value={editingPlan.warmup.description}
                  onChange={(e) => setEditingPlan({
                    ...editingPlan,
                    warmup: { ...editingPlan.warmup, description: e.target.value }
                  })}
                  placeholder="Descreva os exercícios de aquecimento, mobilidade e ativação..."
                  className="w-full p-3 rounded-xl border border-amber-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PlanoTreinoMaterialSelector
                    selectedMaterials={editingPlan.warmup.materials || []}
                    availableMaterials={settings.materials}
                    onChange={(mats) => setEditingPlan({
                      ...editingPlan,
                      warmup: { ...editingPlan.warmup, materials: mats }
                    })}
                    label="MATERIAL DO AQUECIMENTO (Selecione):"
                    onOpenSettings={() => setIsConfigModalOpen(true)}
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        VÍDEO DO AQUECIMENTO:
                      </label>
                      <button
                        type="button"
                        onClick={() => setVideoSelectorTarget({
                          isOpen: true,
                          activityIndex: -1,
                          title: 'Aquecimento'
                        })}
                        className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5 text-blue-600" />
                        <span>Buscar no Catálogo</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={editingPlan.warmup.videoUrl || ''}
                      onChange={(e) => setEditingPlan({
                        ...editingPlan,
                        warmup: { ...editingPlan.warmup, videoUrl: e.target.value }
                      })}
                      placeholder="Cole o link ou clique em Buscar no Catálogo..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* 4. AS ATIVIDADES PRINCIPAIS (ATIVIDADE 01, 02, 03...) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-blue-700" />
                    <span>ATIVIDADES PRINCIPAIS DA AULA</span>
                  </h4>

                  <button
                    type="button"
                    onClick={() => {
                      const newNumber = (editingPlan.activities?.length || 0) + 1;
                      const newAct: LessonPlanActivity = {
                        id: `act-${Date.now()}`,
                        number: newNumber,
                        title: `ATIVIDADE 0${newNumber}`,
                        description: '',
                        durationMinutes: 15,
                        materials: [],
                        videoUrl: '',
                        notes: ''
                      };
                      setEditingPlan({
                        ...editingPlan,
                        activities: [...editingPlan.activities, newAct]
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Atividade</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {editingPlan.activities.map((act, index) => (
                    <div
                      key={act.id || index}
                      className="p-5 rounded-2xl bg-white border border-slate-300 shadow-2xs space-y-3 relative"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={act.title}
                            onChange={(e) => {
                              const updated = [...editingPlan.activities];
                              updated[index].title = e.target.value;
                              setEditingPlan({ ...editingPlan, activities: updated });
                            }}
                            className="font-black text-xs text-blue-900 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md uppercase"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <PlanoTreinoDurationStepper
                            value={act.durationMinutes}
                            onChange={(val) => {
                              const updated = [...editingPlan.activities];
                              updated[index].durationMinutes = val;
                              setEditingPlan({ ...editingPlan, activities: updated });
                            }}
                            label="TEMPO:"
                          />

                          {editingPlan.activities.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = editingPlan.activities.filter((_, i) => i !== index);
                                setEditingPlan({ ...editingPlan, activities: updated });
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Remover esta atividade"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Descrição da Atividade */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Descrição Detalhada / Exercícios da Atividade
                        </label>
                        <textarea
                          rows={3}
                          value={act.description}
                          onChange={(e) => {
                            const updated = [...editingPlan.activities];
                            updated[index].description = e.target.value;
                            setEditingPlan({ ...editingPlan, activities: updated });
                          }}
                          placeholder="Descreva as séries, repetições, regras, circuitos ou dinâmicas..."
                          className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>

                      {/* Materiais e Vídeo */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <PlanoTreinoMaterialSelector
                          selectedMaterials={act.materials || []}
                          availableMaterials={settings.materials}
                          onChange={(mats) => {
                            const updated = [...editingPlan.activities];
                            updated[index].materials = mats;
                            setEditingPlan({ ...editingPlan, activities: updated });
                          }}
                          label={`MATERIAL DA ${act.title || `ATIVIDADE 0${index + 1}`} (Selecione):`}
                          onOpenSettings={() => setIsConfigModalOpen(true)}
                        />

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-slate-700">
                              VÍDEO DA {act.title || `ATIVIDADE 0${index + 1}`}:
                            </label>
                            <button
                              type="button"
                              onClick={() => setVideoSelectorTarget({
                                isOpen: true,
                                activityIndex: index,
                                title: act.title || `Atividade 0${index + 1}`
                              })}
                              className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                            >
                              <Video className="w-3.5 h-3.5 text-blue-600" />
                              <span>Buscar no Catálogo</span>
                            </button>
                          </div>
                          <input
                            type="text"
                            value={act.videoUrl || ''}
                            onChange={(e) => {
                              const updated = [...editingPlan.activities];
                              updated[index].videoUrl = e.target.value;
                              setEditingPlan({ ...editingPlan, activities: updated });
                            }}
                            placeholder="Cole o link ou clique em Buscar no Catálogo..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. VOLTA À CALMA */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    VOLTA À CALMA / DESAQUECIMENTO
                  </span>
                  <PlanoTreinoDurationStepper
                    value={editingPlan.cooldown?.durationMinutes || 5}
                    onChange={(val) => setEditingPlan({
                      ...editingPlan,
                      cooldown: {
                        description: editingPlan.cooldown?.description || '',
                        durationMinutes: val
                      }
                    })}
                    label="TEMPO:"
                  />
                </div>

                <input
                  type="text"
                  value={editingPlan.cooldown?.description || ''}
                  onChange={(e) => setEditingPlan({
                    ...editingPlan,
                    cooldown: {
                      durationMinutes: editingPlan.cooldown?.durationMinutes || 5,
                      description: e.target.value
                    }
                  })}
                  placeholder="Ex: Alongamento passivo, liberação miofascial e respiração..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Rodapé do Modal com Resumo de Tempo e Botão Salvar */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Clock className="w-4 h-4 text-blue-700" />
                <span>
                  Tempo Total Calculado: {' '}
                  <strong className="text-blue-900 text-sm">
                    {(Number(editingPlan.warmup?.durationMinutes) || 0) +
                     (editingPlan.activities || []).reduce((acc, a) => acc + (Number(a.durationMinutes) || 0), 0) +
                     (Number(editingPlan.cooldown?.durationMinutes) || 0)} min
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSavePlan}
                  className="px-5 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Salvar Plano de Treino
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE FEEDBACK RÁPIDO PÓS-AULA */}
      {/* ========================================================================= */}
      {isFeedbackModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Feedback da Aula • {selectedPlan.title}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsFeedbackModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-800 mb-2">
                  OBJETIVOS ATINGIDOS?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'atingido', label: '✓ Sim / Totalmente', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
                      { id: 'parcial', label: '⚠ Parcialmente', color: 'bg-amber-50 text-amber-800 border-amber-300' },
                      { id: 'nao_atingido', label: '✕ Não Atingido', color: 'bg-red-50 text-red-800 border-red-300' },
                      { id: 'pendente', label: '⏳ Pendente', color: 'bg-slate-50 text-slate-800 border-slate-300' }
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSaveQuickFeedback(
                        selectedPlan.id, 
                        opt.id, 
                        selectedPlan.classObservations || ''
                      )}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        selectedPlan.objectivesReachedStatus === opt.id
                          ? `${opt.color} ring-2 ring-blue-500`
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-800 mb-1">
                  ALGUMA OBSERVAÇÃO DA AULA?
                </label>
                <textarea
                  rows={4}
                  defaultValue={selectedPlan.classObservations || ''}
                  id="classObservationsInput"
                  placeholder="Registre impressões dos alunos, adaptações feitas, dificuldades ou recomendações para a próxima aula..."
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('classObservationsInput') as HTMLTextAreaElement;
                    handleSaveQuickFeedback(
                      selectedPlan.id,
                      selectedPlan.objectivesReachedStatus,
                      el ? el.value : ''
                    );
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Salvar Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE VÍDEO DEMONSTRATIVO */}
      {/* ========================================================================= */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-400" />
                <span>Vídeo Demonstrativo da Atividade</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="aspect-video bg-slate-900 rounded-2xl flex items-center justify-center text-white p-6 relative overflow-hidden">
                <div className="text-center space-y-3 z-10">
                  <div className="w-14 h-14 rounded-full bg-blue-600/90 text-white flex items-center justify-center mx-auto shadow-lg animate-pulse">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-300">Link do Vídeo da Atividade:</p>
                    <p className="text-sm font-semibold text-white break-all">{activeVideoUrl}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Pressione o botão para abrir em tela cheia no player externo
                </span>

                <a
                  href={activeVideoUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir Vídeo Original</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO TIMER DE AULA (MODO APRESENTAÇÃO / TABLET / QUADRA) */}
      {/* ========================================================================= */}
      {isTimerModeOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white p-4 sm:p-8">
          <div className="w-full max-w-4xl space-y-6 text-center">
            
            {/* Topo do Timer */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="text-left">
                <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                  MODO AULA AO VIVO • {selectedPlan.level.toUpperCase()}
                </span>
                <h2 className="text-xl font-black text-white">{selectedPlan.title}</h2>
              </div>

              <button
                type="button"
                onClick={() => setIsTimerModeOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
              >
                Sair do Modo Aula
              </button>
            </div>

            {/* Atividade Atual */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <span className="inline-block text-xs font-black px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 uppercase">
                {activeTimerActivityIndex === -1 ? 'AQUECIMENTO' :
                 activeTimerActivityIndex === -2 ? 'VOLTA À CALMA' :
                 selectedPlan.activities[activeTimerActivityIndex]?.title || 'ATIVIDADE'}
              </span>

              {/* Display do Relógio Gigante */}
              <div className="text-7xl sm:text-9xl font-black tracking-tight font-mono text-emerald-400">
                {String(Math.floor(timerSecondsLeft / 60)).padStart(2, '0')}:
                {String(timerSecondsLeft % 60).padStart(2, '0')}
              </div>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                {activeTimerActivityIndex === -1 ? selectedPlan.warmup.description :
                 activeTimerActivityIndex === -2 ? selectedPlan.cooldown?.description :
                 selectedPlan.activities[activeTimerActivityIndex]?.description}
              </p>

              {/* Controles do Timer */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-lg transition-transform active:scale-95 ${
                    isTimerRunning
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  <span>{isTimerRunning ? 'Pausar' : 'Iniciar Tempo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    const dur = activeTimerActivityIndex === -1
                      ? selectedPlan.warmup.durationMinutes
                      : activeTimerActivityIndex === -2
                        ? selectedPlan.cooldown?.durationMinutes || 5
                        : selectedPlan.activities[activeTimerActivityIndex]?.durationMinutes || 15;
                    setTimerSecondsLeft(dur * 60);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  title="Reiniciar tempo da atividade"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Atalhos para Próxima Atividade */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTimerActivityIndex(-1);
                  setTimerSecondsLeft(selectedPlan.warmup.durationMinutes * 60);
                  setIsTimerRunning(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                  activeTimerActivityIndex === -1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Aquecimento
              </button>

              {selectedPlan.activities.map((act, i) => (
                <button
                  key={act.id || i}
                  type="button"
                  onClick={() => {
                    setActiveTimerActivityIndex(i);
                    setTimerSecondsLeft(act.durationMinutes * 60);
                    setIsTimerRunning(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    activeTimerActivityIndex === i ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {act.title}
                </button>
              ))}

              {selectedPlan.cooldown && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTimerActivityIndex(-2);
                    setTimerSecondsLeft((selectedPlan.cooldown?.durationMinutes || 5) * 60);
                    setIsTimerRunning(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    activeTimerActivityIndex === -2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Volta à Calma
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE CONFIGURAÇÕES (MATERIAIS, OBJETIVOS, LOCAL, MODALIDADE, TURMA) */}
      {/* ========================================================================= */}
      {isConfigModalOpen && (
        <PlanoTreinoConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          settings={settings}
          onSaveSettings={(newSettings) => {
            setSettings(newSettings);
            showToast('Configurações do plano atualizadas com sucesso!');
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL DE SELEÇÃO DE VÍDEOS A PARTIR DO CATÁLOGO DE EXERCÍCIOS */}
      {/* ========================================================================= */}
      {videoSelectorTarget.isOpen && (
        <PlanoTreinoVideoSelectorModal
          isOpen={videoSelectorTarget.isOpen}
          onClose={() => setVideoSelectorTarget({ isOpen: false, activityIndex: -1, title: '' })}
          targetActivityTitle={videoSelectorTarget.title}
          onSelectVideo={handleSelectVideo}
        />
      )}
    </div>
  );
};
