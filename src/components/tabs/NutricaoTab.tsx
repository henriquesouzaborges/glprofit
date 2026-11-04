import React, { useState } from 'react';
import { 
  Salad, 
  FileText, 
  Scale, 
  Pill, 
  Droplets, 
  BookOpen, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Bell, 
  User, 
  ChevronRight, 
  ExternalLink, 
  Flame, 
  Heart, 
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Calendar,
  MessageCircle,
  Share2
} from 'lucide-react';
import { Student, NutricaoSubTab, SystemUser } from '../../types';

interface NutricaoTabProps {
  students: Student[];
  activeSubTab: NutricaoSubTab;
  onSubTabChange: (subTab: NutricaoSubTab) => void;
  currentUser?: SystemUser | null;
  selectedStudentId?: string;
  onSelectStudentId?: (id: string) => void;
}

interface SubTabInfo {
  id: NutricaoSubTab;
  label: string;
  shortLabel: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    gradient: string;
    accent: string;
  };
  features: {
    title: string;
    description: string;
    icon: React.ElementType;
  }[];
  mockupStats: {
    label: string;
    value: string;
    detail: string;
  }[];
}

const NUTRICAO_SUBTABS: SubTabInfo[] = [
  {
    id: 'planos_alimentares',
    label: 'Planos Alimentares & Dietas',
    shortLabel: 'Planos & Dietas',
    tagline: 'Prescrição personalizada de dietas, cálculo de macronutrientes e cardápios inteligentes.',
    description: 'Elabore cardápios completos ajustados ao objetivo de cada aluno (hipertrofia, emagrecimento, manutenção ou performance atlética). Calcule metas calóricas, divida macronutrientes por refeição e gere listas de substituições nutricionais automáticas.',
    icon: Salad,
    badge: 'Módulo Principal',
    colorScheme: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
      text: 'text-emerald-950',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      gradient: 'from-emerald-600 to-teal-600',
      accent: 'emerald'
    },
    features: [
      {
        title: 'Cálculo de TMB & GET Automatizado',
        description: 'Fórmulas padrão-ouro (Harris-Benedict, Cunningham e Mifflin-St Jeor) com aplicação de fatores de atividade física do treino.',
        icon: Flame
      },
      {
        title: 'Distribuição Fina de Macronutrientes',
        description: 'Defina gramas por quilo (g/kg) de proteínas, carboidratos e gorduras com cálculo instantâneo de calorias totais e fibras.',
        icon: BarChart3
      },
      {
        title: 'Divisão por Refeições e Horários',
        description: 'Organize Café da Manhã, Almoço, Lanches, Pré-treino, Pós-treino e Jantar com horários recomendados e orientações de preparo.',
        icon: Clock
      },
      {
        title: 'Exportação em PDF & Envio WhatsApp',
        description: 'Envie o cardápio oficial para o WhatsApp do aluno com um clique ou imprima em folha timbrada da academia.',
        icon: Share2
      }
    ],
    mockupStats: [
      { label: 'Meta Calórica Prescrita', value: '2.450 kcal', detail: 'Superávit leve (+300 kcal)' },
      { label: 'Proteína Alvo (g/kg)', value: '2.0 g/kg', detail: '160g totais / dia' },
      { label: 'Refeições Programadas', value: '5 refeições', detail: 'Pré e Pós-treino inclusos' }
    ]
  },
  {
    id: 'anamnese_nutricional',
    label: 'Avaliação & Anamnese',
    shortLabel: 'Anamnese',
    tagline: 'Histórico alimentar clínico, rotina, recordatório 24 horas e intolerâncias.',
    description: 'Conheça a fundo os hábitos, preferências e restrições dos seus alunos. Registre exames bioquímicos, histórico patológico familiar, medicamentos em uso, sinais clínicos de deficiências nutricionais e aversões alimentares.',
    icon: FileText,
    badge: 'Clínico',
    colorScheme: {
      bg: 'bg-blue-50/70',
      border: 'border-blue-200',
      text: 'text-blue-950',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      gradient: 'from-blue-600 to-indigo-600',
      accent: 'blue'
    },
    features: [
      {
        title: 'Recordatório Alimentar de 24h',
        description: 'Registro do consumo alimentar habitual com quantificação aproximada de porções e identificação de horários críticos.',
        icon: Clock
      },
      {
        title: 'Mapeamento de Alergias & Intolerâncias',
        description: 'Filtre glúten, lactose, frutos do mar, oleaginosas e configure alertas visuais automáticos nos cardápios.',
        icon: ShieldCheck
      },
      {
        title: 'Estilo de Vida & Rotina de Sono',
        description: 'Avaliação da qualidade do sono, níveis de estresse, ritmo intestinal (Escala de Bristol) e histórico de hidratação.',
        icon: Heart
      },
      {
        title: 'Exames Bioquímicos e Laboratoriais',
        description: 'Controle de hemograma, perfil lipídico, glicemia de jejum, vitamina D, ferro sérico e marcadores hormonais.',
        icon: FileText
      }
    ],
    mockupStats: [
      { label: 'Alergias / Intolerâncias', value: 'Lactose Leve', detail: 'Sem restrição a glúten' },
      { label: 'Qualidade do Sono', value: '7.5h / noite', detail: 'Ritmo circadiano regular' },
      { label: 'Última Anamnese', value: '15/09/2026', detail: 'Reavaliação em 60 dias' }
    ]
  },
  {
    id: 'composicao_corporal',
    label: 'Composição Corporal & Bioimpedância',
    shortLabel: 'Composição & Bio',
    tagline: 'Acompanhamento de % de gordura, massa magra, dobras cutâneas e bioimpedância.',
    description: 'Monitore a evolução estética e de saúde dos alunos com precisão. Registre dados de balanças de bioimpedância profissional (InBody, Tanita), protocolos de adipometria por dobras cutâneas e perimetria corporal completa.',
    icon: Scale,
    badge: 'Métricas Físicas',
    colorScheme: {
      bg: 'bg-violet-50/70',
      border: 'border-violet-200',
      text: 'text-violet-950',
      badgeBg: 'bg-violet-100',
      badgeText: 'text-violet-800',
      gradient: 'from-violet-600 to-purple-600',
      accent: 'violet'
    },
    features: [
      {
        title: 'Protocolos de Dobras Cutâneas',
        description: 'Cálculo de gordura por Pollock 3 dobras, Pollock 7 dobras, Petroski, Faulkner e Guedes com classificação etária.',
        icon: Scale
      },
      {
        title: 'Importação e Registro de Bioimpedância',
        description: 'Lançamento de massa magra, massa gorda, água corporal total (ACT), gordura visceral e taxa metabólica basal.',
        icon: Zap
      },
      {
        title: 'Perimetria Corporal Completa',
        description: 'Medidas de tórax, cintura, abdômen, quadril, braços contraídos/relaxados, antebraços, coxas e panturrilhas.',
        icon: TrendingUp
      },
      {
        title: 'Fotos Comparativas & Linha do Tempo',
        description: 'Upload de fotos de frente, costas e perfil com régua postural para comparativo visual de evolução lado a lado.',
        icon: Share2
      }
    ],
    mockupStats: [
      { label: 'Percentual de Gordura Atual', value: '14.2%', detail: 'Redução de -2.8% (30 dias)' },
      { label: 'Massa Magra Estimada', value: '68.5 kg', detail: '+1.4 kg de músculo' },
      { label: 'Água Corporal Total', value: '61.8%', detail: 'Excelente nível de hidratação' }
    ]
  },
  {
    id: 'suplementacao',
    label: 'Suplementação & Fitoterapia',
    shortLabel: 'Suplementação',
    tagline: 'Prescrição orientada de suplementos esportivos, doses e horários estratégicos.',
    description: 'Configure protocolos de suplementação esportiva baseados em evidências científicas. Prescreva creatina, proteínas (Whey/Vegana), eletrólitos, cafeína, fitoterápicos e vitaminas com dosagens personalizadas para dias de treino e descanso.',
    icon: Pill,
    badge: 'Performance',
    colorScheme: {
      bg: 'bg-amber-50/70',
      border: 'border-amber-200',
      text: 'text-amber-950',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      gradient: 'from-amber-600 to-orange-600',
      accent: 'amber'
    },
    features: [
      {
        title: 'Protocolos de Suplementação Esportiva',
        description: 'Dosagens estratégicas de creatina monohidratada, whey protein, beta-alanina, cafeína anidra e ômega-3.',
        icon: Pill
      },
      {
        title: 'Cronograma Diário de Consumo',
        description: 'Associação de cada suplemento a um momento específico: ao acordar, 30min pré-treino, pós-treino imediato ou antes de dormir.',
        icon: Clock
      },
      {
        title: 'Ajuste Treino vs. Descanso',
        description: 'Indicação clara de quais suplementos devem ser mantidos ou ajustados nos dias sem atividade física.',
        icon: Calendar
      },
      {
        title: 'Guia de Compra e Marcas Confiáveis',
        description: 'Orientações técnicas sobre selos de pureza (Creapure, Informed Choice, IFOS) para proteção do aluno.',
        icon: ShieldCheck
      }
    ],
    mockupStats: [
      { label: 'Creatina Diária', value: '5g / dia', detail: 'Uso contínuo pós-treino' },
      { label: 'Whey Protein Isolado', value: '30g', detail: 'Pós-treino imediato' },
      { label: 'Ômega 3 Concentrado', value: '2 cápsulas', detail: 'No almoço (EPA/DHA 1000mg)' }
    ]
  },
  {
    id: 'metas_hidratacao',
    label: 'Metas & Hidratação',
    shortLabel: 'Metas & Água',
    tagline: 'Controle de consumo de água, consistência de hábitos e acompanhamento semanal.',
    description: 'Acompanhe a adesão do aluno à rotina saudável. Calcule metas diárias de hidratação baseadas no peso corporal e clima, configure metas semanais de peso e ofereça um checklist simples para registro de hábitos diários.',
    icon: Droplets,
    badge: 'Hábitos & Rotina',
    colorScheme: {
      bg: 'bg-cyan-50/70',
      border: 'border-cyan-200',
      text: 'text-cyan-950',
      badgeBg: 'bg-cyan-100',
      badgeText: 'text-cyan-800',
      gradient: 'from-cyan-600 to-blue-600',
      accent: 'cyan'
    },
    features: [
      {
        title: 'Cálculo de Ingestão Hídrica Diária',
        description: 'Recomendação baseada em 35 a 45 ml por kg de peso corporal, acrescida da reposição por perda de suor no treino.',
        icon: Droplets
      },
      {
        title: 'Checklist de Aderência à Dieta',
        description: 'O aluno ou treinador registra se as refeições prescritas foram seguidas (100%, 80% ou refeição livre).',
        icon: CheckCircle2
      },
      {
        title: 'Média Móvel de Peso Semanal',
        description: 'Gráfico que elimina flutuações pontuais de retenção líquida para mostrar a tendência real de ganho ou perda de peso.',
        icon: TrendingUp
      },
      {
        title: 'Lembretes de Hidratação via WhatsApp',
        description: 'Disparos automáticos programados para incentivar o consumo regular de água ao longo do dia.',
        icon: MessageCircle
      }
    ],
    mockupStats: [
      { label: 'Meta de Água Diária', value: '3.2 Litros', detail: '40ml / kg corporal' },
      { label: 'Índice de Aderência (7d)', value: '92%', detail: 'Meta semanal atingida' },
      { label: 'Variação Semanal', value: '-400g', detail: 'Dentro do planejado' }
    ]
  },
  {
    id: 'tabela_alimentos',
    label: 'Tabela TACO & Alimentos',
    shortLabel: 'Tabela TACO',
    tagline: 'Consulta de dados nutricionais oficiais da Tabela TACO/IBGE e catálogo de alimentos.',
    description: 'Banco de dados nutricional completo com centenas de alimentos cadastrados. Consulte calorias, carboidratos, proteínas, lipídios, fibras, cálcio e ferro em medidas caseiras (colher de sopa, escumadeira, unidade, gramas e ml).',
    icon: BookOpen,
    badge: 'Base Científica',
    colorScheme: {
      bg: 'bg-rose-50/70',
      border: 'border-rose-200',
      text: 'text-rose-950',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800',
      gradient: 'from-rose-600 to-pink-600',
      accent: 'rose'
    },
    features: [
      {
        title: 'Base de Dados TACO / IBGE Integrada',
        description: 'Tabela Brasileira de Composição de Alimentos oficial da UNICAMP com valores laboratoriais validados.',
        icon: BookOpen
      },
      {
        title: 'Tabela de Substituições Inteligentes',
        description: 'Troca equivalente instantânea: substitua batata-doce por arroz integral ou mandioca com equivalência calórica.',
        icon: Zap
      },
      {
        title: 'Medidas Caseiras Padronizadas',
        description: 'Conversão automática de gramas para colheres, conchas, fatias, xícaras e copos para facilitar a rotina do aluno.',
        icon: Clock
      },
      {
        title: 'Cadastro de Alimentos Customizados',
        description: 'Adicione suplementos comerciais, produtos industrializados locais ou preparações caseiras exclusivas da academia.',
        icon: Sparkles
      }
    ],
    mockupStats: [
      { label: 'Alimentos Catalogados', value: '+850 itens', detail: 'Tabela TACO 4ª Edição' },
      { label: 'Grupos Alimentares', value: '12 categorias', detail: 'Carnes, cereais, frutas, etc.' },
      { label: 'Substituições Rápidas', value: '100% calculadas', detail: 'Equivalência macro-a-macro' }
    ]
  }
];

export const NutricaoTab: React.FC<NutricaoTabProps> = ({
  students,
  activeSubTab,
  onSubTabChange,
  currentUser,
  selectedStudentId,
  onSelectStudentId
}) => {
  const [internalStudentId, setInternalStudentId] = useState<string>(() => {
    return selectedStudentId || (students.length > 0 ? students[0].id : '');
  });
  const [notifiedEmails, setNotifiedEmails] = useState<Record<string, boolean>>({});
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const currentStudent = students.find(s => s.id === (selectedStudentId || internalStudentId)) || students[0];

  const currentSubTabInfo = NUTRICAO_SUBTABS.find(s => s.id === activeSubTab) || NUTRICAO_SUBTABS[0];

  const handleStudentChange = (id: string) => {
    setInternalStudentId(id);
    if (onSelectStudentId) {
      onSelectStudentId(id);
    }
  };

  const handleNotifyMe = () => {
    setNotifiedEmails(prev => ({ ...prev, [activeSubTab]: true }));
    setShowNotificationToast(true);
    setTimeout(() => {
      setShowNotificationToast(false);
    }, 4000);
  };

  const IconComponent = currentSubTabInfo.icon;

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Toast Alert for Interest Confirmation */}
      {showNotificationToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Interesse registrado com sucesso!</div>
            <div className="text-[11px] text-slate-300">
              Você será avisado no lançamento oficial do módulo <strong>{currentSubTabInfo.label}</strong>.
            </div>
          </div>
        </div>
      )}

      {/* STUDENT CONTEXT & PROFILE SELECTOR BAR */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
              {currentSubTabInfo.label}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold border border-amber-200">
              {currentSubTabInfo.badge}
            </span>
          </div>

          {/* Quick Context: Student Selector */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
                Aluno Ativo:
              </span>
              <div className="relative">
                <select
                  value={currentStudent?.id || ''}
                  onChange={(e) => handleStudentChange(e.target.value)}
                  className="pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer transition-colors"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.status})
                    </option>
                  ))}
                </select>
                <User className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Inactive Export Button with Hint */}
            <div className="relative group">
              <button
                type="button"
                disabled
                className="opacity-60 cursor-not-allowed px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs font-semibold flex items-center gap-1.5"
                title="Relatório PDF estará disponível no lançamento oficial"
              >
                <FileText className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">PDF Nutrição</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN "EM BREVE" SHOWCASE BANNER FOR ACTIVE SUBTAB */}
      <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/60 p-6 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Top Coming Soon Pills */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-800 text-white shadow-xs tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Em Breve
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              <Clock className="h-3.5 w-3.5" />
              Em Desenvolvimento Ativo
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              Sub-aba: {currentSubTabInfo.label}
            </span>
          </div>

          {/* Sub-tab Hero Title & Tagline */}
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <div className={`h-16 w-16 sm:h-20 sm:w-20 rounded-2xl flex items-center justify-center bg-gradient-to-tr ${currentSubTabInfo.colorScheme.gradient} text-white shadow-lg shadow-blue-500/10`}>
                <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 stroke-[2.2]" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {currentSubTabInfo.label}
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              {currentSubTabInfo.tagline}
            </p>
          </div>

          {/* Detailed explanation box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-left max-w-2xl mx-auto">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Sobre este módulo em desenvolvimento:
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentSubTabInfo.description}
            </p>
            {currentStudent && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Aluno vinculado para testes: <strong className="text-slate-800">{currentStudent.name}</strong></span>
                <span className="text-emerald-700 font-semibold">Pronto para integração</span>
              </div>
            )}
          </div>

          {/* Interactive Call to Action / Interest registration */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              type="button"
              onClick={handleNotifyMe}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                notifiedEmails[activeSubTab]
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-blue-800 hover:bg-blue-900 text-white shadow-blue-900/10'
              }`}
            >
              {notifiedEmails[activeSubTab] ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Notificação Cadastrada!
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" />
                  Quero ser notificado no lançamento
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-500">
              Ou explore as outras 5 sub-abas de nutrição acima
            </span>
          </div>

        </div>
      </div>

      {/* WHAT YOU WILL BE ABLE TO REGISTER (Sub-tab Specific Capabilities) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              O que você poderá registrar nesta tela:
            </h2>
            <p className="text-xs text-slate-500">
              Recursos planejados especificamente para a sub-aba <strong>{currentSubTabInfo.label}</strong>
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
            4 funcionalidades centrais
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {currentSubTabInfo.features.map((feat, idx) => {
            const FeatIcon = feat.icon;
            return (
              <div 
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-3">
                    <FeatIcon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                    {feat.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-blue-700">
                  <span>Status do Recurso:</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-100">
                    Em breve
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE MOCKUP PREVIEW CARD (Demonstrates the future UX) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
              Prévia do Layout de Registro ({currentSubTabInfo.shortLabel})
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            Protótipo visual interativo • {currentStudent ? currentStudent.name : 'Aluno selecionado'}
          </span>
        </div>

        {/* Mock KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {currentSubTabInfo.mockupStats.map((st, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] text-slate-500 font-medium">{st.label}</div>
              <div className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">{st.value}</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {st.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Mock Interface Placeholder */}
        <div className="p-6 sm:p-8 rounded-xl bg-slate-50/70 border border-dashed border-slate-300 text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-white text-slate-400 border border-slate-200 flex items-center justify-center shadow-2xs">
            <IconComponent className="h-6 w-6" />
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-800">
            Painel Central de {currentSubTabInfo.label}
          </div>
          <p className="text-[11px] text-slate-500 max-w-md mx-auto">
            A interface completa de formulários, gráficos e tabelas de {currentSubTabInfo.shortLabel.toLowerCase()} para o aluno <strong>{currentStudent ? currentStudent.name : 'selecionado'}</strong> estará disponível aqui.
          </p>
          <div className="pt-2">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
              Disponível em breve no GL PRO FIT
            </span>
          </div>
        </div>

      </div>

      {/* QUICK SWITCHER FOOTER BETWEEN NUTRITION SUBTABS */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-slate-600 text-center sm:text-left">
          Navegue pelas demais áreas do módulo de <strong>Nutrição</strong>:
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {NUTRICAO_SUBTABS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onSubTabChange(sub.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                sub.id === activeSubTab
                  ? 'bg-blue-800 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {sub.shortLabel}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
