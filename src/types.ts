export type StudentStatus = 'ativo' | 'inadimplente' | 'trancado' | 'cancelado';

export interface Student {
  id: string;
  code: string;
  name: string;
  photo: string;
  photoUrl?: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  status: StudentStatus;
  planId: string;
  planName: string;
  plan?: string;
  planPrice: number;
  startDate: string;
  endDate: string;
  dueDate: string;
  lastAccess?: string;
  pendingAmount: number;
  notes?: string;
  consentLgpd?: boolean;
  consentLgpdDate?: string;
  consentLgpdVersion?: string;
  gender?: 'masculino' | 'feminino';
  enrollmentNumber?: string;
}

export type PaymentMethod = 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'boleto';

export type FinanceiroSubTab = 
  | 'receber' 
  | 'pagar' 
  | 'dre' 
  | 'extrato'
  | 'gl_profit_pay';

export interface FinancialTransaction {
  id: string;
  type: 'receita' | 'despesa';
  category: string;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  dueDate?: string;
  status: 'pago' | 'pendente' | 'vencido';
  studentId?: string;
  studentName?: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'mensal' | 'trimestral' | 'semestral' | 'anual' | 'diaria';
  modalities: string[];
  activeStudentsCount: number;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock?: number;
  sku: string;
  image?: string;
}

export interface EnrolledStudent {
  studentId: string;
  studentName: string;
  checkedIn: boolean;
  status?: 'presente' | 'falta' | 'pendente';
  checkInTime?: string;
  checkInSource?: 'manual' | 'professor';
}

export interface ClassSession {
  id: string;
  title: string;
  modality: 'Musculação' | 'CrossFit / Funcional' | 'Spinning' | 'Natação' | 'Muay Thai / Lutas' | 'Pilates';
  instructor: string;
  time: string;
  duration: string;
  dayOfWeek: string;
  capacity: number;
  enrolledStudents: EnrolledStudent[];
  room: string;
}

export type MuscleGroup = 
  | 'Peito' 
  | 'Costas' 
  | 'Pernas' 
  | 'Ombros' 
  | 'Braços' 
  | 'Bíceps' 
  | 'Tríceps' 
  | 'Antebraço' 
  | 'Glúteos' 
  | 'Panturrilhas' 
  | 'Abdômen' 
  | 'Cardio' 
  | 'Funcional' 
  | 'Alongamento'
  | 'Futebol';

export type ExerciseEquipment = 
  | 'Barra' 
  | 'Halteres' 
  | 'Cabos/Polia' 
  | 'Máquina' 
  | 'Peso Corporal' 
  | 'Smith' 
  | 'Kettlebell' 
  | 'Elástico' 
  | 'Aparelho Cárdio' 
  | 'Outro';

export type TrainingMethod = 
  | 'Tradicional' 
  | 'Drop-set' 
  | 'Bi-set' 
  | 'Tri-set' 
  | 'Rest-pause' 
  | 'Pirâmide Crescente' 
  | 'Pirâmide Decrescente' 
  | 'Super-série' 
  | 'GVT (German Volume)' 
  | 'FST-7' 
  | 'Ponto Zero' 
  | 'Isometria' 
  | 'Excêntrica Lenta';

export interface ExerciseItem {
  id: string;
  name: string;
  muscleGroup: MuscleGroup | string;
  sets: number;
  reps: string;
  weightKg?: number;
  restSec: number;
  notes?: string;
  equipment?: ExerciseEquipment | string;
  cadence?: string;
  method?: TrainingMethod | string;
  videoUrl?: string;
  photoUrl?: string;
  targetMuscles?: string[];
  completed?: boolean;
}

export interface WorkoutSplit {
  id?: string;
  name: string; // "Treino A - Peitoral e Tríceps"
  dayOfWeek?: string; // "Segunda-feira"
  exercises: ExerciseItem[];
}

export interface WorkoutPlan {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  objective: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  instructor: string;
  startDate: string;
  validUntil: string;
  splits: WorkoutSplit[];
  notes?: string;
  isTemplate?: boolean;
  frequency?: string; // ex: "3x a 5x por semana"
}

export interface ExerciseCatalogItem {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: ExerciseEquipment;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  primaryMuscle: string;
  secondaryMuscles?: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  instructions: string[];
  tips?: string;
  isCustom?: boolean;
}

export interface WorkoutTemplate {
  id: string;
  title: string;
  category: 'Hipertrofia' | 'Emagrecimento' | 'Força' | 'Feminino' | 'Masculino' | 'Reabilitação' | 'Iniciante' | 'Intermediário' | 'Avançado' | 'Funcional' | string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  objective: string;
  description: string;
  splits: WorkoutSplit[];
  isCustom?: boolean;
  author?: string;
  createdAt?: string;
}

export interface LessonPlanActivity {
  id: string;
  number: number;
  title: string;
  description: string;
  durationMinutes: number;
  materials: string[];
  videoUrl?: string;
  notes?: string;
}

export interface LessonPlan {
  id: string;
  date: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  title: string;
  modality?: string;
  trainingLocation?: string;
  targetType: 'turma' | 'aluno' | 'geral';
  targetName?: string;
  instructor: string;
  mainObjectives: string;
  objectivesReachedStatus: 'atingido' | 'parcial' | 'pendente' | 'nao_atingido';
  objectivesReachedNotes?: string;
  classObservations?: string;
  warmup: {
    description: string;
    durationMinutes: number;
    materials?: string[];
    videoUrl?: string;
  };
  activities: LessonPlanActivity[];
  cooldown?: {
    description: string;
    durationMinutes: number;
  };
  totalDurationMinutes: number;
  status: 'planejado' | 'em_andamento' | 'concluido';
  createdAt: string;
}

export interface ExerciseLoadLog {
  id: string;
  studentId: string;
  exerciseName: string;
  date: string;
  weightKg: number;
  reps: number;
  estimated1RM: number;
  rpe?: number; // Percepção de esforço 1-10
}

export interface PhysicalAssessmentTest {
  id: string;
  studentId: string;
  date: string;
  evaluator: string;
  type: 'neuromuscular' | 'cardiorrespiratorio' | 'flexibilidade';
  testName: string;
  rawResult: string; // ex: "32 repetições" ou "2400 metros" ou "34 cm"
  calculatedMetric?: string; // ex: "VO2 Máx: 42.5 ml/kg/min"
  classification: 'Excelente' | 'Bom' | 'Médio' | 'Fraco' | 'Muito Fraco';
  notes?: string;
}

export interface PhysicalAssessmentData {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  evaluator: string;
  objective: string;
  protocol: 'pollock7' | 'pollock3' | 'guedes' | 'petroski' | 'bioimpedancia';
  protocolName: string;
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'masculino' | 'feminino';
  bmi: number;
  bmr: number;
  skinfolds: {
    peitoral: number;
    axilarMedia: number;
    triceps: number;
    subescapular: number;
    biceps: number;
    abdominal: number;
    suprailiaca: number;
    coxa: number;
    panturrilha: number;
    total: number;
  };
  composition: {
    bodyDensity: number;
    bodyFatPercentage: number;
    fatMassKg: number;
    leanMassKg: number;
    muscleMassKg: number;
    boneMassKg: number;
    residualMassKg: number;
    idealFatPercentage: number;
    idealWeightKg: number;
    classification: 'Atleta' | 'Excelente' | 'Bom' | 'Médio' | 'Elevado' | 'Obesidade' | 'Regular';
  };
  bodyComp?: any;
  perimetry: {
    pescoco?: number;
    ombros?: number;
    torax: number;
    cintura: number;
    abdomen: number;
    quadril: number;
    bracoDireitoRelaxado: number;
    bracoDireitoContraido: number;
    bracoEsquerdoRelaxado: number;
    bracoEsquerdoContraido: number;
    antebracoDireito: number;
    antebracoEsquerdo: number;
    coxaDireitaProximal: number;
    coxaDireitaMedial: number;
    coxaEsquerdaProximal: number;
    coxaEsquerdaMedial: number;
    panturrilhaDireita: number;
    panturrilhaEsquerda: number;
    rcq: number;
    rcqRisk: 'Baixo' | 'Moderado' | 'Alto' | 'Muito Alto';
  };
  anamnesis?: {
    parqCleared: boolean;
    clinicalHistory: string;
    injuries: string;
    medications: string;
    activityLevel: string;
    sleepHours: number;
    waterIntakeLiters: number;
    painEva?: number;
    stressLevel?: number;
    trainingAdherencePct?: number;
    energyLevel?: number;
    [key: string]: any;
  };
  photos?: any;
  functional?: any;
  force?: any;
  jump?: any;
  field?: any;
  customTests?: any[];
  bioimpedance?: any;
  functionalTests?: {
    cooperDistanceMeters?: number;
    vo2Max?: number;
    pushups1Min?: number;
    crunches1Min?: number;
    wellsFlexibilityCm?: number;
    restingHeartRateBpm?: number;
    bloodPressure?: string;
  };
  postureNotes?: string;
  generalNotes?: string;
}

export type BemEstarSubTab = 
  | 'checkin' 
  | 'analise' 
  | 'elenco_hooper' 
  | 'ciclo_menstrual';

export interface PainPoint {
  id: string;
  region: string;
  bodySide: 'anterior' | 'posterior';
  painScale: number; // 0 a 10 EVA
  painType: 'muscular' | 'articular' | 'tendinea' | 'neural' | 'trauma';
  category?: 'musculo' | 'articulacao';
  notes?: string;
}

export type CheckinPeriod = 'manha' | 'tarde' | 'noite';

export interface WellnessCheckin {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  period: CheckinPeriod; // Manhã, Tarde, Noite
  time?: string;
  sleepQuality: number; // 0 a 10
  sleepHours: number;
  sleepDisruptions?: number;
  pse: number; // 0 a 10 (Percepção Subjetiva de Esforço / Nível de Fadiga)
  eva: number; // 0 a 10 (Escala Visual Analógica de Dor Muscular)
  stressLevel: number; // 0 a 10
  moodState: number; // 0 a 10
  psr: number; // 0 a 10 (Percepção Subjetiva de Recuperação)
  trainingDurationMinutes?: number; // Tempo de treino em minutos
  weightPre?: number; // Peso pré-exercício (kg)
  weightPost?: number; // Peso pós-exercício (kg)
  jumpCmjPre?: number; // Salto CMJ pré-exercício (cm)
  jumpCmjPost?: number; // Salto CMJ pós-exercício (cm)
  hooperIndex: number; // Índice de Hooper adaptado (0 a 40)
  readinessScore: number; // 0 a 100%
  readinessStatus: 'otimo' | 'moderado' | 'alerta';
  painPoints: PainPoint[];
  menstrualData?: {
    isApplicable: boolean;
    cyclePhase?: 'folicular' | 'ovulatoria' | 'lutea' | 'menstrual';
    symptoms?: string[];
    flowVolume?: 'leve' | 'moderado' | 'intenso';
  };
  hydrationLiters?: number;
  notes?: string;
  coachAlertSent?: boolean;
}

export type LeadStage = 'novo' | 'agendado' | 'compareceu' | 'negociacao' | 'matriculado' | 'perdido';

export type CrmSubTab = 'leads' | 'kambam' | 'atividades' | 'automacoes' | 'pesquisas';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  interest: string;
  stage: LeadStage;
  notes: string;
  createdAt: string;
  lastContact: string;
  valueExpected?: number;
  source?: string;
  assignedTo?: string;
  scheduledDate?: string;
}

export interface CrmActivity {
  id: string;
  leadId?: string;
  leadName: string;
  leadPhone?: string;
  type: 'ligacao' | 'whatsapp' | 'aula_experimental' | 'visita' | 'followup' | 'proposta';
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: 'pendente' | 'concluida' | 'atrasada';
  assignedTo: string;
  createdAt: string;
}

export interface CrmAutomation {
  id: string;
  name: string;
  trigger: string;
  channel: 'whatsapp' | 'email' | 'tarefa';
  delay: string;
  active: boolean;
  dispatchedCount: number;
  openRate: string;
  conversionRate: string;
  messageTemplate: string;
  targetStage: LeadStage;
}

export interface SatisfactionSurveyResponse {
  id: string;
  respondentName: string;
  respondentType: 'lead_experimental' | 'novo_aluno_30d' | 'aluno_ativo';
  phone: string;
  surveyTitle: string;
  score: number; // 0 to 10
  categoryRating: {
    atendimento: number;
    estrutura: number;
    professor: number;
    limpeza: number;
  };
  comment: string;
  date: string;
  sentiment: 'positivo' | 'neutro' | 'negativo';
  resolved?: boolean;
}

export interface GymSettings {
  gymName: string;
  tradeName: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  gracePeriodDays: number;
  autoBlockOverdue: boolean;
  pixKey: string;
  welcomeMessage: string;
}

export type SystemUserRole = 'admin' | 'gerente' | 'treinador' | 'recepcao' | 'financeiro' | 'aluno';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: SystemUserRole;
  phone?: string;
  avatar?: string;
  department?: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
  permissions: string[];
  mustChangePassword?: boolean;
  password?: string;
}

export interface ComandaItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addedAt: string;
}

export interface Comanda {
  id: string;
  number: number;
  studentId?: string;
  studentName: string;
  studentCode?: string;
  status: 'aberta' | 'fechada' | 'cancelada';
  openedAt: string;
  closedAt?: string;
  items: ComandaItem[];
  total: number;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'entrada' | 'saida' | 'ajuste';
  quantity: number;
  date: string;
  reason: string;
  responsible: string;
  costUnit?: number;
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  contactPerson: string;
  category: string;
}

export interface PayRecurringCharge {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  frequency: 'mensal' | 'trimestral' | 'anual';
  cardNumberMasked: string;
  cardBrand: 'visa' | 'mastercard' | 'elo' | 'amex';
  nextChargeDate: string;
  status: 'ativa' | 'pausada' | 'falha' | 'cancelada';
  lastChargeStatus?: 'sucesso' | 'recusado' | 'pendente';
}

export interface PaymentLink {
  id: string;
  title: string;
  amount: number;
  url: string;
  planOrProductName: string;
  expiresAt: string;
  status: 'ativo' | 'pago' | 'expirado';
  clicksCount: number;
}

export type ProfessoresSubTab = 'folha_ponto' | 'tarefas' | 'agenda';

export type AgendaSubTab = 'calendario' | 'grade' | 'locacoes' | 'jogos' | 'eventos';

export type TreinoSubTab = 
  | 'plano_treino'
  | 'prescricao' 
  | 'catalogo_exercicios' 
  | 'modelos_templates' 
  | 'treino_do_dia' 
  | 'controle_carga' 
  | 'testes_fisicos';

export type AvaliacoesSubTab = 
  | 'avaliacoes' 
  | 'configuracoes'
  | 'comparativo_graficos' 
  | 'anamnese' 
  | 'dobras_cutaneas' 
  | 'bioimpedancia' 
  | 'perimetria' 
  | 'fotos_postural' 
  | 'testes_funcionais' 
  | 'testes_forca' 
  | 'testes_campo' 
  | 'testes_salto' 
  | 'testes_personalizados';

export type NutricaoSubTab = 
  | 'planos_alimentares' 
  | 'anamnese_nutricional' 
  | 'composicao_corporal' 
  | 'suplementacao' 
  | 'metas_hidratacao' 
  | 'tabela_alimentos';

export type CalendarEventCategory = 'grade_turma' | 'locacao' | 'evento_jogo' | 'evento_diverso';

export interface CalendarEvent {
  id: string;
  title: string;
  category: CalendarEventCategory;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string; // "Box CrossFit Arena", "Campo Society 1", "Quadra de Areia Beach Tennis", "Sala Pilates", etc.
  instructorOrHost?: string;
  contactPhone?: string;
  capacity?: number;
  enrolledOrConfirmedCount?: number;
  price?: number;
  paymentStatus?: 'pago' | 'pendente' | 'cortesia' | 'incluso';
  description?: string;
  status: 'confirmado' | 'em_andamento' | 'cancelado' | 'finalizado';
  tag?: string;
  extraDetails?: {
    renterName?: string;
    renterDocument?: string;
    depositPaid?: boolean;
    sport?: string;
    teamsCount?: number;
    matchType?: string;
    prizes?: string;
    eventType?: string;
    speaker?: string;
    certificate?: boolean;
    modality?: string;
  };
}

export type WhatsappSubTab = 
  | 'atendimento' 
  | 'kanban' 
  | 'disparos' 
  | 'chatbot' 
  | 'contatos' 
  | 'respostas_rapidas' 
  | 'etiquetas'
  | 'conexoes';

export interface WhatsappEtiqueta {
  id: string;
  name: string;
  color: string;
  textColor?: string;
  bgColor?: string;
  description?: string;
  createdAt?: string;
}

export interface WhatsappMessage {
  id: string;
  chatId: string;
  sender: 'cliente' | 'atendente' | 'bot';
  senderName?: string;
  text: string;
  timestamp: string;
  status: 'enviando' | 'enviado' | 'entregue' | 'lido';
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'document' | 'button';
  audioDuration?: string;
}

export interface WhatsappChat {
  id: string;
  contactName: string;
  contactPhone: string;
  contactPhoto?: string;
  studentId?: string;
  leadId?: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  status: 'aguardando' | 'atendimento' | 'finalizado';
  queue: 'geral' | 'comercial' | 'recepcao' | 'financeiro';
  assignedTo?: string;
  tags: string[];
  notes?: string;
  pipelineStage?: 'novos' | 'experimental' | 'proposta' | 'fechamento' | 'posvenda';
  studentPlan?: string;
  pendingAmount?: number;
}

export interface WhatsappCampaign {
  id: string;
  name: string;
  targetAudience: string;
  message: string;
  status: 'ativa' | 'concluida' | 'agendada' | 'pausada';
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  repliedCount: number;
  createdAt: string;
  scheduledDate?: string;
  antiBanDelaySeconds: number;
}

export interface WhatsappQuickReply {
  id: string;
  shortcut: string;
  title: string;
  message: string;
  category: string;
}

export interface WhatsappConnectionInfo {
  status: 'conectado' | 'desconectado' | 'qrcode';
  companyName: string;
  companyId: string;
  phone: string;
  batteryLevel: number;
  isCharging: boolean;
  signalQuality: string;
  qrCodeValue?: string;
  webhookUrl: string;
  apiToken: string;
  provider: string;
  connectedAt: string;
}

export interface WhatsappChatbotFlow {
  id: string;
  name: string;
  active: boolean;
  triggerKeyword: string;
  stepsCount: number;
  responseType: 'menu' | 'ia_prompt' | 'transfer';
  description: string;
}

export type EmpresasClientesSubTab = 'dashboard' | 'licencas';

export interface EmpresaCliente {
  id: string;
  name: string;
  cnpj: string;
  ownerName: string;
  email: string;
  phone: string;
  planName: string;
  monthlyValue: number;
  status: 'ativo' | 'bloqueado' | 'pendente';
  dueDate: string;
  activatedAt: string;
  allowedModules: TabType[];
  maxUsers: number;
  notes?: string;
}

export type TabType = 
  | 'inicio' 
  | 'dashboards' 
  | 'clientes' 
  | 'professores' 
  | 'crm' 
  | 'agenda' 
  | 'treino' 
  | 'avaliacoes' 
  | 'nutricao' 
  | 'bem_estar' 
  | 'whatsapp' 
  | 'pay' 
  | 'financeiro' 
  | 'vendas' 
  | 'estoque' 
  | 'comandas' 
  | 'relatorios' 
  | 'empresas_clientes'
  | 'configuracoes';

export const DEFAULT_STUDENT_FALLBACK: Student = {
  id: 'std-fallback',
  code: '001',
  name: 'Aluno Exemplo',
  photo: '',
  email: 'aluno@exemplo.com',
  phone: '(11) 99999-9999',
  cpf: '000.000.000-00',
  birthDate: '1995-01-01',
  status: 'ativo',
  planId: 'p1',
  planName: 'Plano Musculação',
  planPrice: 120,
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  dueDate: '2026-12-10',
  pendingAmount: 0
};


