import React, { useState, useMemo } from 'react';
import { 
  ClipboardCheck, 
  BarChart3, 
  FileText, 
  Layers, 
  Scale, 
  Activity, 
  Camera, 
  Zap, 
  Dumbbell, 
  Flame, 
  ArrowUpRight, 
  Sliders, 
  User, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Bell, 
  ChevronRight, 
  Info, 
  ShieldCheck, 
  TrendingUp, 
  Printer, 
  Share2, 
  Heart, 
  Calendar, 
  Play, 
  Download, 
  Target, 
  Award,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  Check,
  Search,
  Settings
} from 'lucide-react';
import { Student, AvaliacoesSubTab } from '../../types';
import { AvaliacoesFisicasTab as InternalAvaliacoesFisicasTab } from './treino/AvaliacoesFisicasTab';
import { TreinoPdfReportModal } from './treino/TreinoPdfReportModal';
import { AnamneseView } from './avaliacoes/AnamneseView';
import { DobrasCutaneasView } from './avaliacoes/DobrasCutaneasView';
import { BioimpedanciaView } from './avaliacoes/BioimpedanciaView';
import { PerimetriaView } from './avaliacoes/PerimetriaView';
import { FotosPosturalView } from './avaliacoes/FotosPosturalView';
import { TestesFuncionaisView } from './avaliacoes/TestesFuncionaisView';
import { TestesForcaView } from './avaliacoes/TestesForcaView';
import { TestesSaltoView } from './avaliacoes/TestesSaltoView';
import { TestesCampoView } from './avaliacoes/TestesCampoView';
import { AvaliacoesHubView, DEFAULT_STUDENT_FALLBACK } from './avaliacoes/AvaliacoesHubView';
import { AvaliacoesConfiguracoesHubView } from './avaliacoes/AvaliacoesConfiguracoesHubView';

export const ACTIVE_AVALIACOES_SUBTABS: AvaliacoesSubTab[] = [
  'avaliacoes',
  'configuracoes',
  'anamnese',
  'dobras_cutaneas',
  'bioimpedancia',
  'perimetria',
  'fotos_postural',
  'testes_funcionais',
  'testes_forca',
  'testes_salto',
  'testes_campo',
  'testes_personalizados'
];

interface AvaliacoesFisicasTabProps {
  students: Student[];
  selectedStudentId?: string;
  onSelectStudentId?: (id: string) => void;
  subTab?: AvaliacoesSubTab;
  onSubTabChange?: (subTab: AvaliacoesSubTab) => void;
}

interface SubTabMeta {
  id: AvaliacoesSubTab;
  label: string;
  shortTitle: string;
  icon: React.ElementType;
  category: string;
  tagline: string;
  description: string;
  scientificReference: string;
  highlights: string[];
  kpis: { label: string; value: string; hint: string }[];
  expectedDelivery: string;
}

const SUBTABS_CONFIG: SubTabMeta[] = [
  {
    id: 'avaliacoes',
    label: 'Avaliações',
    shortTitle: 'Avaliação Física Geral',
    icon: ClipboardCheck,
    category: 'Gestão de Laudos',
    tagline: 'Histórico, laudos e protocolos de avaliação física',
    description: 'Centralização de todas as avaliações físicas dos alunos com seleção de protocolos científicos, metas corporais, geração de laudo oficial em PDF e envio automático via WhatsApp.',
    scientificReference: 'Protocolos de Pollock (7 e 3 dobras), Petroski, Guedes e Bioimpedância Médica.',
    highlights: [
      'Histórico longitudinal completo por aluno com comparativos de evolução',
      'Seleção rápida do avaliador técnico responsável com CREF automático',
      'Exportação de laudo oficial para impressão e download em PDF em alta resolução',
      'Disparo direto do resumo de resultados para o WhatsApp do aluno com 1 clique'
    ],
    kpis: [
      { label: 'Protocolos Ativos', value: '5 Métodos', hint: 'Pollock 7/3, Guedes, Petroski, Bio' },
      { label: 'Tempo Médio de Preenchimento', value: '4.5 min', hint: 'Interface ágil e intuitiva' },
      { label: 'Laudo Formatado', value: '100% PDF', hint: 'Pronto para impressão clínica' }
    ],
    expectedDelivery: 'Q4 2026 • Em fase de testes beta'
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    shortTitle: 'Configurações de Avaliações',
    icon: Settings,
    category: 'Gestão de Protocolos',
    tagline: 'Configuração individual dos 10 módulos de avaliação física',
    description: 'Centralize a configuração de protocolos, tabelas normativas e preenchimento de cada uma das avaliações: Anamnese, Dobras, Bioimpedância, Perimetria, Fotos e Postural, Testes Funcionais, Força, Campo, Salto e Personalizados.',
    scientificReference: 'Diretrizes científicas completas de cineantropometria e fisiologia do exercício.',
    highlights: [
      'Acesse e configure cada avaliação em sua respectiva aba',
      'Definição de protocolos científicos de adipometria e testes motores',
      'Construtor de baterias específicas e templates por modalidade'
    ],
    kpis: [
      { label: 'Módulos Suportados', value: '10 Módulos', hint: 'Anamnese a Testes Personalizados' },
      { label: 'Configuração', value: '100% Editável', hint: 'Critérios flexíveis' },
      { label: 'Exportação', value: 'Integrada', hint: 'WhatsApp e Impressão PDF' }
    ],
    expectedDelivery: 'Ativo'
  },
  {
    id: 'anamnese',
    label: 'Anamnese',
    shortTitle: 'Anamnese & PAR-Q',
    icon: FileText,
    category: 'Triagem & Saúde',
    tagline: 'Questionário de prontidão física (PAR-Q) e histórico clínico',
    description: 'Triagem abrangente de saúde, histórico patológico, cirurgias prévias, lesões osteomusculares ativas, uso de medicamentos contínuos e hábitos diários.',
    scientificReference: 'Physical Activity Readiness Questionnaire (PAR-Q+) & Colégio Americano de Medicina do Esporte (ACSM).',
    highlights: [
      'Questionário PAR-Q+ digital com validação automática de aptidão cardiovascular',
      'Mapeamento anatômico de dores e desconfortos com escala visual analógica (EVA)',
      'Registro detalhado de cirurgias, fraturas, hérnias e limitações biomecânicas',
      'Alertas automáticos no painel do treinador ao prescrever exercícios contraindicados'
    ],
    kpis: [
      { label: 'Perguntas PAR-Q+', value: '7 Obrigatórias', hint: 'Padrão ACSM Internacional' },
      { label: 'Triagem de Risco', value: '3 Níveis', hint: 'Baixo, Moderado e Alto Risco' },
      { label: 'Validade do Laudo', value: '12 Meses', hint: 'Renovação anual recomendada' }
    ],
    expectedDelivery: 'Q4 2026 • Em desenvolvimento'
  },
  {
    id: 'dobras_cutaneas',
    label: 'Dobras Cutâneas',
    shortTitle: 'Adipometria & Dobras',
    icon: Layers,
    category: 'Composição Corporal',
    tagline: 'Medição de dobras cutâneas com adipômetro e equações preditivas',
    description: 'Registro de dobras cutâneas (tríceps, subescapular, bíceps, axilar média, peitoral, suprailíaca, abdominal, coxa e panturrilha) com cálculo instantâneo de densidade corporal e % de gordura.',
    scientificReference: 'Jackson, Pollock & Ward (1980), Petroski (1995), Guedes (1994) e Faulkner (1968).',
    highlights: [
      'Entrada guiada de 3, 4, 7 ou 9 dobras cutâneas com fotos ilustrativas do ponto anatômico',
      'Cálculo automático de densidade corporal (Siri, Brozek) e somatório de dobras (Σ Dobras)',
      'Identificação de discrepâncias ou erro técnico de medição entre tentativas',
      'Classificação do percentual de gordura estratificada por sexo e faixa etária'
    ],
    kpis: [
      { label: 'Dobras Anatômicas', value: '9 Pontos', hint: 'Tríceps, Abdomen, Coxa, etc.' },
      { label: 'Equações Integradas', value: 'Pollock/Guedes', hint: 'Fórmulas validadas' },
      { label: 'Tolerância de Medição', value: '±1.0 mm', hint: 'Repetibilidade recomendada' }
    ],
    expectedDelivery: 'Q4 2026 • Em desenvolvimento'
  },
  {
    id: 'bioimpedancia',
    label: 'Bioimpedância',
    shortTitle: 'Bioimpedância Segmentar',
    icon: Scale,
    category: 'Composição Corporal',
    tagline: 'Análise de bioimpedância elétrica tetrapolar e octapolar',
    description: 'Registro e importação de laudos de bioimpedância elétrica com cálculo segmentar de massa magra nos 4 membros e tronco, taxa metabólica basal e gordura visceral.',
    scientificReference: 'Bioelectrical Impedance Analysis (BIA) multifrequencial e ângulo de fase celular.',
    highlights: [
      'Nível de gordura visceral (escala de 1 a 20) com estratificação de risco metabólico',
      'Água corporal total fracionada em água intracelular (AIC) e extracelular (AEC)',
      'Ângulo de fase celular para avaliação de integridade e vitalidade celular',
      'Idade metabólica estimada comparada com a idade cronológica do aluno'
    ],
    kpis: [
      { label: 'Frequências Suportadas', value: '5 a 250 kHz', hint: 'Multifrequencial octapolar' },
      { label: 'Segmentos Corporais', value: '5 Zonas', hint: 'Tronco, Braços D/E, Pernas D/E' },
      { label: 'Gordura Visceral', value: 'Nível 1 - 20', hint: 'Risco cardiovascular' }
    ],
    expectedDelivery: 'Q4 2026 • Em desenvolvimento'
  },
  {
    id: 'perimetria',
    label: 'Perimetria',
    shortTitle: 'Circunferências & RCQ',
    icon: Activity,
    category: 'Antropometria',
    tagline: 'Perimetria corporal completa e Relação Cintura-Quadril (RCQ)',
    description: 'Medição precisa de circunferências corporais (pescoço, tórax, cintura, abdômen, quadril, braços, antebraços, coxas e panturrilhas) com cálculo do índice RCQ.',
    scientificReference: 'Normas ISAK (International Society for the Advancement of Kinanthropometry) e OMS.',
    highlights: [
      'Medições de braços e pernas em repouso e em contração máxima',
      'Cálculo automatizado da Relação Cintura-Quadril (RCQ) com classificação OMS',
      'Detecção visual de assimetrias bilaterais superiores a 1.0 cm',
      'Histórico de ganho ou perda de medidas por segmento muscular'
    ],
    kpis: [
      { label: 'Perímetros Mapeados', value: '16 Medidas', hint: 'Relaxado, contraído, proximal' },
      { label: 'Padrão Antropométrico', value: 'ISAK Padrão', hint: 'Fita metálica antropométrica' },
      { label: 'Índice RCQ', value: 'Automático', hint: 'Classificação de risco da OMS' }
    ],
    expectedDelivery: 'Q4 2026 • Em desenvolvimento'
  },
  {
    id: 'fotos_postural',
    label: 'Fotos e Postural',
    shortTitle: 'Fotogrametria & Postura',
    icon: Camera,
    category: 'Biomecânica Postural',
    tagline: 'Avaliação postural computadorizada e fotos comparativas antes/depois',
    description: 'Registro fotográfico padronizado nas 4 vistas com grade postural virtual (fio de prumo), identificação de escoliose, cifose, hiperlordose e slider comparativo.',
    scientificReference: 'Método SAPO (Software de Avaliação Postural) e fotogrametria computadorizada.',
    highlights: [
      'Visualização com quadrícula milimetrada e linha de gravidade sobreposta',
      '4 ângulos padronizados: vista anterior, posterior, lateral direita e lateral esquerda',
      'Comparativo lado a lado e ferramenta slider interativo "Antes & Depois"',
      'Exportação das fotos com proteção e marca d’água da academia'
    ],
    kpis: [
      { label: 'Vistas Fotográficas', value: '4 Ângulos', hint: 'Anterior, Posterior e Laterais' },
      { label: 'Grade Postural', value: 'Fio de Prumo', hint: 'Quadrícula virtual milimetrada' },
      { label: 'Slider Comparativo', value: 'Interativo', hint: 'Transição suave antes/depois' }
    ],
    expectedDelivery: 'Q4 2026 • Em desenvolvimento'
  },
  {
    id: 'testes_funcionais',
    label: 'Testes Funcionais',
    shortTitle: 'Mobilidade & FMS',
    icon: Zap,
    category: 'Movimento Humano',
    tagline: 'Testes de mobilidade, estabilidade e triagem funcional (FMS)',
    description: 'Avaliação de padrões fundamentais de movimento, amplitude articular, flexibilidade no Banco de Wells e identificação de compensações biomecânicas.',
    scientificReference: 'Functional Movement Screen (FMS, Gray Cook) e Teste de Sentar e Alcançar (Wells & Dillon).',
    highlights: [
      'Teste do Banco de Wells (Sentar e Alcançar) com tabela normativa por idade e sexo',
      'Triagem de agachamento profundo (Overhead Deep Squat) e estabilidade rotacional',
      'Mobilidade de tornozelo (Weight-bearing lunge test) e amplitude glenoumeral',
      'Pontuação global de risco de lesão com recomendações de exercícios corretivos'
    ],
    kpis: [
      { label: 'Testes da Bateria', value: '7 Padrões', hint: 'FMS e Banco de Wells' },
      { label: 'Escala de Pontuação', value: '0 a 3 Pontos', hint: 'Pontuação máxima 21 pontos' },
      { label: 'Índice de Flexibilidade', value: 'Wells em cm', hint: 'Classificação por tabela' }
    ],
    expectedDelivery: 'Q4 2026 • Em desenvolvimento'
  },
  {
    id: 'testes_forca',
    label: 'Testes de Força',
    shortTitle: 'Força Máxima & 1RM',
    icon: Dumbbell,
    category: 'Capacidade Neuromuscular',
    tagline: 'Estimativa de 1RM, dinamometria manual e testes de resistência muscular',
    description: 'Protocolos de teste de força máxima (fórmulas de Brzycki, Epley, Lombardi), dinamometria manual (Jamar), teste de flexão de braço e barra fixa em 1 minuto.',
    scientificReference: 'Equações de predição de 1RM (Brzycki, Epley) e testes do Colégio Americano de Medicina do Esporte.',
    highlights: [
      'Calculadora de 1RM para Supino Reto, Agachamento Livre, Leg Press e Levantamento Terra',
      'Dinamometria de preensão manual bilateral para avaliação de força isométrica',
      'Teste de flexão de braço (1 min) e teste de flexão abdominal para resistência muscular',
      'Integração direta com o módulo de prescrição de treinos e controle de carga'
    ],
    kpis: [
      { label: 'Equações de 1RM', value: '4 Modelos', hint: 'Brzycki, Epley, Lombardi, O’Conner' },
      { label: 'Dinamometria', value: 'Kg/Força', hint: 'Preensão palmar bilateral' },
      { label: 'Zonas de Intensidade', value: '50% a 95%', hint: 'Tabela de cargas percentuais' }
    ],
    expectedDelivery: 'Q4 2026 • Em desenvolvimento'
  },
  {
    id: 'testes_campo',
    label: 'Testes de Campo',
    shortTitle: 'Capacidade Aeróbia & VO2',
    icon: Flame,
    category: 'Capacidade Cardiorrespiratória',
    tagline: 'Teste de Cooper 12 min, Yo-Yo Test, Shuttle Run e cálculo de VO2 Máx',
    description: 'Protocolos práticos de campo para determinação de consumo máximo de oxigênio (VO2 máx), potência aeróbia e faixas ideais de frequência cardíaca para treinos.',
    scientificReference: 'Teste de Cooper (1968), Yo-Yo Intermittent Recovery Test (Bangsbo) e Léger & Boucher.',
    highlights: [
      'Teste de Cooper (12 minutos) com cálculo automático de VO2 Máx estimado (ml/kg/min)',
      'Yo-Yo Intermittent Recovery Test (Níveis 1 e 2) com metrônomo sonoro integrado',
      'Cálculo de frequência cardíaca máxima (FCmáx) e zonas de treino aeróbio (Z1 a Z5)',
      'Estratificação da capacidade cardiorrespiratória de acordo com tabelas normativas'
    ],
    kpis: [
      { label: 'Métrica Principal', value: 'VO2 Máx', hint: 'ml/kg/minuto' },
      { label: 'Zonas Cardíacas', value: '5 Zonas', hint: 'Recuperação a Limiar Anaeróbio' },
      { label: 'Áudio Bip', value: 'Integrado', hint: 'Metrônomo para Shuttle Run' }
    ],
    expectedDelivery: 'Q4 2026 • Em desenvolvimento'
  },
  {
    id: 'testes_salto',
    label: 'Testes de Salto',
    shortTitle: 'Potência & Salto Vertical',
    icon: ArrowUpRight,
    category: 'Potência Neuromuscular',
    tagline: 'Plataforma de salto (CMJ, SJ, DJ), tempo de voo e potência de membros inferiores',
    description: 'Avaliação de potência muscular, taxa de desenvolvimento de força (RFD), tempo de contato, tempo de voo e Índice de Força Reativa (RSI) em saltos verticais.',
    scientificReference: 'Protocolos de Carmelo Bosco (1983) e plataformas de contato eletrônicas.',
    highlights: [
      'Countermovement Jump (CMJ) com e sem auxílio dos braços',
      'Squat Jump (SJ) para avaliação pura de força concêntrica sem ciclo alongamento-encurtamento',
      'Drop Jump (DJ) com cálculo do Índice de Força Reativa (RSI = altura do salto / tempo de contato)',
      'Estimativa de potência mecânica em Watts pela fórmula de Sayers e Harman'
    ],
    kpis: [
      { label: 'Altura do Salto', value: 'Em cm', hint: 'Precisão milimétrica estimada' },
      { label: 'Potência Gerada', value: 'Watts (W)', hint: 'Fórmulas de Sayers / Harman' },
      { label: 'Índice Reativo (RSI)', value: 'Ratio', hint: 'Eficiência elástica muscular' }
    ],
    expectedDelivery: 'Q4 2026 • Em desenvolvimento'
  },
  {
    id: 'testes_personalizados',
    label: 'Testes Personalizados',
    shortTitle: 'Testes Customizados',
    icon: Sliders,
    category: 'Métricas Sob Demanda',
    tagline: 'Crie seus próprios protocolos, testes de modalidades específicas e critérios',
    description: 'Construtor flexível de baterias de testes físicos sob medida para qualquer esporte (lutas, natação, futebol, crossfit, corrida) com parâmetros e pontuações customizadas.',
    scientificReference: 'Configuração flexível de variáveis dependentes e independentes.',
    highlights: [
      'Crie testes com métricas personalizadas: tempo (segundos), repetições, distância (metros) ou carga',
      'Definição de tabelas de classificação customizadas (Excelente, Bom, Médio, Fraco)',
      'Fórmulas matemáticas customizadas para somatório ou média ponderada de scores',
      'Biblioteca compartilhável entre treinadores e unidades da academia'
    ],
    kpis: [
      { label: 'Métricas Suportadas', value: 'Livres', hint: 'Segundos, Reps, Kg, Metros, Watts' },
      { label: 'Critérios Normativos', value: '100% Editável', hint: 'Configure faixas etárias e sexo' },
      { label: 'Modelos Prontos', value: 'Biblioteca', hint: 'Templates para diversos esportes' }
    ],
    expectedDelivery: 'Q4 2026 • Em desenvolvimento'
  }
];

export const AvaliacoesFisicasTab: React.FC<AvaliacoesFisicasTabProps> = ({
  students,
  selectedStudentId: propStudentId,
  onSelectStudentId,
  subTab: propSubTab,
  onSubTabChange
}) => {
  const [internalStudentId, setInternalStudentId] = useState(propStudentId || students[0]?.id || 'std-1');
  const [localSubTab, setLocalSubTab] = useState<AvaliacoesSubTab>('avaliacoes');
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [notifiedTabs, setNotifiedTabs] = useState<Record<string, boolean>>({});
  const [requestedBetaTabs, setRequestedBetaTabs] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeStudentId = propStudentId || internalStudentId;
  const currentSubTab = propSubTab || localSubTab;

  const currentStudent = useMemo(() => {
    return students.find(s => s.id === activeStudentId) || students[0] || null;
  }, [students, activeStudentId]);

  const activeMeta = useMemo(() => {
    return SUBTABS_CONFIG.find(s => s.id === currentSubTab) || SUBTABS_CONFIG[0];
  }, [currentSubTab]);

  const handleSubTabClick = (tabId: AvaliacoesSubTab) => {
    if (onSubTabChange) {
      onSubTabChange(tabId);
    } else {
      setLocalSubTab(tabId);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleNotify = (tabId: string) => {
    const isNow = !notifiedTabs[tabId];
    setNotifiedTabs(prev => ({ ...prev, [tabId]: isNow }));
    if (isNow) {
      showToast(`Você receberá um alerta quando a sub-aba "${activeMeta.label}" for disponibilizada!`);
    } else {
      showToast('Notificação cancelada com sucesso.');
    }
  };

  const handleRequestBeta = (tabId: string) => {
    setRequestedBetaTabs(prev => ({ ...prev, [tabId]: true }));
    showToast(`Solicitação para o programa Beta de "${activeMeta.label}" enviada à equipe técnica!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          {toastMessage}
        </div>
      )}

      {/* RENDERIZAÇÃO DA SUB-ABA AVALIAÇÕES (HUB PRINCIPAL DE AVALIAÇÕES) */}
      {currentSubTab === 'avaliacoes' && (
        <AvaliacoesHubView
          students={students}
          student={currentStudent || students[0] || DEFAULT_STUDENT_FALLBACK}
          onSelectStudentId={(id) => {
            setInternalStudentId(id);
            if (onSelectStudentId) onSelectStudentId(id);
          }}
          onNavigateToConfig={() => handleSubTabClick('configuracoes')}
        />
      )}

      {/* RENDERIZAÇÃO DA SUB-ABA CONFIGURAÇÕES (CENTRAL COM OS 10 MÓDULOS) */}
      {currentSubTab === 'configuracoes' && (
        <AvaliacoesConfiguracoesHubView student={currentStudent || students[0] || DEFAULT_STUDENT_FALLBACK} />
      )}

      {/* SUPORTE CASO ACESSE DIRETAMENTE PELO IDENTIFICADOR DE UMA DAS 10 AVALIAÇÕES */}
      {[
        'anamnese',
        'dobras_cutaneas',
        'bioimpedancia',
        'perimetria',
        'fotos_postural',
        'testes_funcionais',
        'testes_forca',
        'testes_salto',
        'testes_campo',
        'testes_personalizados'
      ].includes(currentSubTab) && currentStudent && (
        <AvaliacoesConfiguracoesHubView student={currentStudent} initialTab={currentSubTab as any} />
      )}

      {/* CASO CONTRÁRIO (SUB-ABAS RESTANTES), EXIBE O STATUS 'EM BREVE' CONFORME SOLICITADO */}
      {!ACTIVE_AVALIACOES_SUBTABS.includes(currentSubTab) && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
          {/* Top Header Card */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative">
          <div className="max-w-3xl space-y-4 relative z-10">
            {/* Badges Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider">
                <activeMeta.icon className="w-3.5 h-3.5 text-blue-300" />
                <span>Avaliações Físicas • {activeMeta.category}</span>
              </div>

              {/* Status Em Breve Pulsante */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Em breve</span>
              </div>

              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Previsão: {activeMeta.expectedDelivery}
              </span>
            </div>

            {/* Title & Tagline */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                {activeMeta.label}
              </h2>
              <p className="text-sm sm:text-base text-blue-100/90 font-medium mt-1">
                {activeMeta.tagline}
              </p>
            </div>

            {/* Detailed Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
              {activeMeta.description}
            </p>

            {/* Scientific Citation */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 text-slate-200 text-xs font-medium border border-white/10 backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Base Científica:</strong> {activeMeta.scientificReference}</span>
            </div>
          </div>

          {/* Action Callouts */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleToggleNotify(activeMeta.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                notifiedTabs[activeMeta.id]
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}
            >
              {notifiedTabs[activeMeta.id] ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Notificação Ativada</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span>Notificar quando disponível</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleRequestBeta(activeMeta.id)}
              disabled={requestedBetaTabs[activeMeta.id]}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                requestedBetaTabs[activeMeta.id]
                  ? 'bg-blue-900/50 border-blue-400/40 text-blue-200 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white shadow-xs'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {requestedBetaTabs[activeMeta.id] ? 'Acesso Beta Solicitado' : 'Solicitar Acesso Beta'}
              </span>
            </button>

            {/* Special Action: Simulator Preview for Avaliações */}
            {activeMeta.id === 'avaliacoes' && (
              <button
                type="button"
                onClick={() => setShowSimulatorModal(true)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-blue-300" />
                <span>Abrir Simulador de Avaliação</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ml-auto"
            >
              <Download className="w-4 h-4 text-slate-300" />
              <span>Modelo de Ficha (PDF)</span>
            </button>
          </div>
        </div>

        {/* METRICS & PARAMETERS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/70 border-b border-slate-200">
          {activeMeta.kpis.map((kpi, idx) => (
            <div key={idx} className="p-5 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {kpi.label}
              </span>
              <div className="text-xl font-black text-slate-900">
                {kpi.value}
              </div>
              <p className="text-xs text-slate-500">
                {kpi.hint}
              </p>
            </div>
          ))}
        </div>

        {/* PREVIEW CONTENT & PLANNED FUNCTIONALITIES */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Funcionalidades em Implementação para {activeMeta.label}</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Recursos planejados seguindo as diretrizes técnicas do GL PRO FIT para esta sub-aba:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activeMeta.highlights.map((item, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 transition-colors flex items-start gap-3 shadow-2xs group"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                    {item}
                  </p>
                  <span className="inline-block text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.2 rounded">
                    Módulo em preparação
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Feature Simulator Card */}
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200 inline-block">
                  Simulação Prévia do Módulo
                </span>
                <h5 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Experimente o motor de cálculo e avaliação
                </h5>
                <p className="text-xs text-slate-600 max-w-xl">
                  Você pode visualizar a interface de avaliação integrada para acompanhar como os laudos serão calculados e emitidos para <strong>{currentStudent?.name}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSimulatorModal(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Testar Simulador Interativo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* FULL ASSESSMENT ENGINE MODAL (FOR TESTING & BETA PREVIEW) */}
      {showSimulatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Simulador do Módulo: {activeMeta.label}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aluno ativo: <strong>{currentStudent?.name}</strong> • Modo de demonstração antecipada
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSimulatorModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content - Embedded Operational Assessment System */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-main-scrollbar">
              <InternalAvaliacoesFisicasTab
                students={students}
                selectedStudentId={activeStudentId}
                onSelectStudentId={(id) => {
                  setInternalStudentId(id);
                  if (onSelectStudentId) onSelectStudentId(id);
                }}
                onExportPdf={() => setShowPdfModal(true)}
              />
            </div>
          </div>
        </div>
      )}

      {/* PDF REPORT EXPORT MODAL */}
      {showPdfModal && (
        <TreinoPdfReportModal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          subTab="prescricao"
          student={students.find(s => s.id === activeStudentId) || students[0]}
          workouts={[]}
        />
      )}
    </div>
  );
};
