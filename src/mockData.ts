import { 
  Student, 
  FinancialTransaction, 
  Plan, 
  Product, 
  ClassSession, 
  WorkoutPlan, 
  AccessLog, 
  Lead, 
  GymSettings,
  Comanda,
  StockMovement,
  Supplier,
  PayRecurringCharge,
  PaymentLink,
  CrmActivity,
  CrmAutomation,
  SatisfactionSurveyResponse,
  CalendarEvent
} from './types';

export const INITIAL_SETTINGS: GymSettings = {
  gymName: "VB SPORT ACADEMIA E CENTRO FITNESS LTDA",
  tradeName: "VB SPORT ADM",
  cnpj: "42.890.123/0001-95",
  phone: "(11) 98765-4321",
  email: "contato@vbsport.com.br",
  address: "Av. Paulista, 1850 - Bela Vista",
  city: "São Paulo",
  state: "SP",
  gracePeriodDays: 3,
  autoBlockOverdue: true,
  pixKey: "financeiro@vbsport.com.br",
  welcomeMessage: "Bem-vindo à VB SPORT! Treine hoje para superar seu eu de amanhã."
};

export const INITIAL_PLANS: Plan[] = [
  {
    id: "plan-1",
    name: "Plano Anual Black VIP",
    price: 119.90,
    billingCycle: "anual",
    modalities: ["Musculação", "Aulas Coletivas", "Spinning", "CrossFit", "Acesso Ilimitado"],
    activeStudentsCount: 182,
    description: "Acesso total a todas as áreas, sem restrição de horário e direito a levar 1 amigo por mês."
  },
  {
    id: "plan-2",
    name: "Plano Semestral Fit",
    price: 139.90,
    billingCycle: "semestral",
    modalities: ["Musculação", "Cardio", "Aulas Coletivas"],
    activeStudentsCount: 94,
    description: "Fidelidade semestral com musculação e todas as aulas de ginástica inclusas."
  },
  {
    id: "plan-3",
    name: "Plano Mensal Livre",
    price: 169.90,
    billingCycle: "mensal",
    modalities: ["Musculação", "Cardio"],
    activeStudentsCount: 56,
    description: "Sem fidelidade contratual, cancelamento a qualquer momento sem taxa."
  },
  {
    id: "plan-4",
    name: "Passaporte Diária / Day-Use",
    price: 35.00,
    billingCycle: "diaria",
    modalities: ["Acesso Geral Diário"],
    activeStudentsCount: 16,
    description: "Acesso válido por 1 dia para visitantes e treinos esporádicos."
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "std-1",
    code: "00104",
    name: "Gianluca Marinho",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    email: "marinho.gianluca@gmail.com",
    phone: "(11) 99123-4567",
    cpf: "348.910.200-15",
    birthDate: "2001-10-09",
    status: "ativo",
    planId: "plan-1",
    planName: "Plano Anual Black VIP",
    planPrice: 119.90,
    startDate: "2024-01-15",
    endDate: "2025-01-15",
    dueDate: "2024-10-15",
    lastAccess: "Hoje às 12:42",
    pendingAmount: 0,
    notes: "Administrador e atleta federado. Foco em força e hipertrofia."
  },
  {
    id: "std-2",
    code: "00105",
    name: "Beatriz Nogueira Silva",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    email: "beatriz.silva@email.com",
    phone: "(11) 98234-5678",
    cpf: "421.890.111-22",
    birthDate: "1997-04-18",
    status: "ativo",
    planId: "plan-1",
    planName: "Plano Anual Black VIP",
    planPrice: 119.90,
    startDate: "2024-02-01",
    endDate: "2025-02-01",
    dueDate: "2024-10-05",
    lastAccess: "Hoje às 08:15",
    pendingAmount: 0,
    notes: "Pratica Spinning e Musculação regular."
  },
  {
    id: "std-3",
    code: "00106",
    name: "Carlos Eduardo Rocha",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    email: "carlos.rocha@empresa.com.br",
    phone: "(11) 97345-6789",
    cpf: "289.445.890-34",
    birthDate: "1989-11-24",
    status: "inadimplente",
    planId: "plan-3",
    planName: "Plano Mensal Livre",
    planPrice: 169.90,
    startDate: "2024-06-10",
    endDate: "2024-09-10",
    dueDate: "2024-09-10",
    lastAccess: "Ontem às 19:30",
    pendingAmount: 169.90,
    notes: "Mensalidade de Setembro pendente. Catraca com bloqueio automático."
  },
  {
    id: "std-4",
    code: "00107",
    name: "Fernanda Albuquerque Costa",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    email: "fe.albuquerque@gmail.com",
    phone: "(11) 96456-7890",
    cpf: "198.334.556-77",
    birthDate: "1994-09-03",
    status: "ativo",
    planId: "plan-2",
    planName: "Plano Semestral Fit",
    planPrice: 139.90,
    startDate: "2024-03-20",
    endDate: "2024-09-20",
    dueDate: "2024-09-20",
    lastAccess: "Hoje às 10:20",
    pendingAmount: 0,
    notes: "Aniversariante do mês! Aluna dedicada de Pilates e Musculação."
  },
  {
    id: "std-5",
    code: "00108",
    name: "Rodrigo Mendonça Lima",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    email: "rodrigo.mendonca@advocacia.com",
    phone: "(11) 95567-8901",
    cpf: "312.667.889-01",
    birthDate: "1985-06-12",
    status: "trancado",
    planId: "plan-1",
    planName: "Plano Anual Black VIP",
    planPrice: 119.90,
    startDate: "2024-01-10",
    endDate: "2025-01-10",
    dueDate: "2024-10-10",
    lastAccess: "28/08/2024",
    pendingAmount: 0,
    notes: "Trancamento médico por 30 dias (cirurgia no joelho). Retorno previsto para outubro."
  },
  {
    id: "std-6",
    code: "00109",
    name: "Juliana Camargo Dias",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    email: "ju.camargo@design.br",
    phone: "(11) 94678-9012",
    cpf: "405.112.987-65",
    birthDate: "1999-02-14",
    status: "ativo",
    planId: "plan-2",
    planName: "Plano Semestral Fit",
    planPrice: 139.90,
    startDate: "2024-04-01",
    endDate: "2024-10-01",
    dueDate: "2024-10-01",
    lastAccess: "Hoje às 07:10",
    pendingAmount: 0,
    notes: "Treina no turno da manhã. Foco em condicionamento e Muay Thai."
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Whey Protein 100% Concentrado 900g (Baunilha)",
    category: "Suplementos",
    price: 129.90,
    costPrice: 78.00,
    stock: 24,
    sku: "SUP-WHEY-01"
  },
  {
    id: "prod-2",
    name: "Creatina Monohidratada 100% Pura 300g",
    category: "Suplementos",
    price: 89.90,
    costPrice: 52.00,
    stock: 38,
    sku: "SUP-CREAT-02"
  },
  {
    id: "prod-3",
    name: "Água Mineral Crystal 500ml sem Gás",
    category: "Bebidas",
    price: 4.50,
    costPrice: 1.20,
    stock: 142,
    sku: "BEB-AGUA-03"
  },
  {
    id: "prod-4",
    name: "Barra de Proteína Crisp Choco Trufado 45g",
    category: "Alimentos",
    price: 12.00,
    costPrice: 6.50,
    stock: 65,
    sku: "SNK-BARRA-04"
  },
  {
    id: "prod-5",
    name: "Coqueteleira VB SPORT Pro 700ml",
    category: "Acessórios",
    price: 29.90,
    costPrice: 11.50,
    stock: 50,
    sku: "ACS-COQ-05"
  },
  {
    id: "prod-6",
    name: "Luvas de Treino Grip Neoprene c/ Munhequeira",
    category: "Acessórios",
    price: 49.90,
    costPrice: 22.00,
    stock: 18,
    sku: "ACS-LUV-06"
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: "tx-1",
    type: "receita",
    category: "Mensalidade",
    description: "Mensalidade Plano Anual Black VIP - Gianluca Marinho",
    amount: 119.90,
    paymentMethod: "pix",
    date: "2024-09-02",
    status: "pago",
    studentId: "std-1",
    studentName: "Gianluca Marinho"
  },
  {
    id: "tx-2",
    type: "receita",
    category: "Mensalidade",
    description: "Mensalidade Plano Anual Black VIP - Beatriz Nogueira",
    amount: 119.90,
    paymentMethod: "cartao_credito",
    date: "2024-09-02",
    status: "pago",
    studentId: "std-2",
    studentName: "Beatriz Nogueira Silva"
  },
  {
    id: "tx-3",
    type: "receita",
    category: "Venda PDV",
    description: "Venda Balcão: Whey Protein + Coqueteleira VB SPORT",
    amount: 159.80,
    paymentMethod: "cartao_debito",
    date: "2024-09-02",
    status: "pago",
    studentName: "Venda Balcão"
  },
  {
    id: "tx-4",
    type: "despesa",
    category: "Manutenção",
    description: "Lubrificação preventiva e calibragem das esteiras Movement",
    amount: 450.00,
    paymentMethod: "pix",
    date: "2024-09-01",
    status: "pago"
  },
  {
    id: "tx-5",
    type: "despesa",
    category: "Utilidades",
    description: "Conta de Energia Elétrica - Enel SP",
    amount: 1890.40,
    paymentMethod: "boleto",
    date: "2024-08-30",
    status: "pago"
  },
  {
    id: "tx-6",
    type: "receita",
    category: "Mensalidade",
    description: "Mensalidade Pendente - Carlos Eduardo Rocha",
    amount: 169.90,
    paymentMethod: "boleto",
    date: "2024-09-10",
    dueDate: "2024-09-10",
    status: "vencido",
    studentId: "std-3",
    studentName: "Carlos Eduardo Rocha"
  }
];

export const INITIAL_CLASSES: ClassSession[] = [
  {
    id: "cls-1",
    title: "CrossFit WOD Power",
    modality: "CrossFit / Funcional",
    instructor: "Prof. Marcos Andrade",
    time: "07:00 - 08:00",
    duration: "60 min",
    dayOfWeek: "Segunda, Quarta, Sexta",
    capacity: 20,
    room: "Box CrossFit Arena",
    enrolledStudents: [
      { studentId: "std-1", studentName: "Gianluca Marinho", checkedIn: true },
      { studentId: "std-2", studentName: "Beatriz Nogueira Silva", checkedIn: true },
      { studentId: "std-6", studentName: "Juliana Camargo Dias", checkedIn: false }
    ]
  },
  {
    id: "cls-2",
    title: "Spinning Extreme Ride",
    modality: "Spinning",
    instructor: "Profª Larissa Fontes",
    time: "08:30 - 09:15",
    duration: "45 min",
    dayOfWeek: "Terça e Quinta",
    capacity: 25,
    room: "Studio Bike 01",
    enrolledStudents: [
      { studentId: "std-2", studentName: "Beatriz Nogueira Silva", checkedIn: true },
      { studentId: "std-4", studentName: "Fernanda Albuquerque", checkedIn: true }
    ]
  },
  {
    id: "cls-3",
    title: "Pilates Solo & Core",
    modality: "Pilates",
    instructor: "Profª Amanda Rezende",
    time: "10:00 - 10:50",
    duration: "50 min",
    dayOfWeek: "Segunda, Quarta",
    capacity: 15,
    room: "Sala Zen / Pilates",
    enrolledStudents: [
      { studentId: "std-4", studentName: "Fernanda Albuquerque", checkedIn: false }
    ]
  },
  {
    id: "cls-4",
    title: "Muay Thai Fight Club",
    modality: "Muay Thai / Lutas",
    instructor: "Mestre Thiago 'Tubarão'",
    time: "19:00 - 20:00",
    duration: "60 min",
    dayOfWeek: "Segunda a Sexta",
    capacity: 20,
    room: "Dojo de Artes Marciais",
    enrolledStudents: [
      { studentId: "std-6", studentName: "Juliana Camargo Dias", checkedIn: true }
    ]
  },
  {
    id: "cls-5",
    title: "Funcional HIIT 360",
    modality: "CrossFit / Funcional",
    instructor: "Prof. Marcos Andrade",
    time: "20:15 - 21:00",
    duration: "45 min",
    dayOfWeek: "Terça e Quinta",
    capacity: 22,
    room: "Box CrossFit Arena",
    enrolledStudents: []
  }
];

export const INITIAL_WORKOUTS: WorkoutPlan[] = [
  {
    id: "wkt-1",
    studentId: "std-1",
    studentName: "Gianluca Marinho",
    title: "Periodização Avançada - Força & Hipertrofia",
    objective: "Hipertrofia Miofibrilar e Força Máxima",
    level: "Avançado",
    instructor: "Prof. Roberto Mendes (CREF 089123-G/SP)",
    startDate: "2024-08-01",
    validUntil: "2024-11-01",
    splits: [
      {
        name: "Treino A - Peitoral e Tríceps",
        exercises: [
          { id: "ex-1", name: "Supino Reto com Barra Olímpica", muscleGroup: "Peito", sets: 4, reps: "8-10", weightKg: 85, restSec: 90, notes: "Cadência 3-0-1-0. Amplitude total." },
          { id: "ex-2", name: "Supino Inclinado com Halteres", muscleGroup: "Peito", sets: 4, reps: "10-12", weightKg: 30, restSec: 60, notes: "Banco a 30 graus." },
          { id: "ex-3", name: "Crossover Polia Média", muscleGroup: "Peito", sets: 3, reps: "12-15", weightKg: 25, restSec: 45, notes: "Pico de contração 2 segundos." },
          { id: "ex-4", name: "Tríceps Testa com Barra W", muscleGroup: "Braços", sets: 4, reps: "10-12", weightKg: 32, restSec: 60, notes: "Cotovelos fechados." },
          { id: "ex-5", name: "Tríceps Corda na Polia Alta", muscleGroup: "Braços", sets: 3, reps: "12-15", weightKg: 40, restSec: 45, notes: "Abertura no final do movimento." }
        ]
      },
      {
        name: "Treino B - Dorsais e Bíceps",
        exercises: [
          { id: "ex-6", name: "Puxada Alta Pronada no Pulley", muscleGroup: "Costas", sets: 4, reps: "10-12", weightKg: 70, restSec: 60, notes: "Foco no grande dorsal." },
          { id: "ex-7", name: "Remada Curvada com Barra", muscleGroup: "Costas", sets: 4, reps: "8-10", weightKg: 65, restSec: 75, notes: "Tronco firme a 45 graus." },
          { id: "ex-8", name: "Remada Baixa Triângulo", muscleGroup: "Costas", sets: 3, reps: "12", weightKg: 60, restSec: 45 },
          { id: "ex-9", name: "Rosca Direta com Barra W", muscleGroup: "Braços", sets: 4, reps: "10-12", weightKg: 28, restSec: 60 },
          { id: "ex-10", name: "Rosca Martelo Alternada c/ Halteres", muscleGroup: "Braços", sets: 3, reps: "12", weightKg: 16, restSec: 45 }
        ]
      },
      {
        name: "Treino C - Membros Inferiores e Ombros",
        exercises: [
          { id: "ex-11", name: "Agachamento Livre com Barra", muscleGroup: "Pernas", sets: 4, reps: "8-10", weightKg: 100, restSec: 120, notes: "Descer até paralelo, core ativado." },
          { id: "ex-12", name: "Leg Press 45 Graus", muscleGroup: "Pernas", sets: 4, reps: "10-12", weightKg: 220, restSec: 90 },
          { id: "ex-13", name: "Cadeira Extensora", muscleGroup: "Pernas", sets: 3, reps: "15", weightKg: 55, restSec: 45, notes: "Drop set na última série." },
          { id: "ex-14", name: "Desenvolvimento Militar com Halteres", muscleGroup: "Ombros", sets: 4, reps: "10", weightKg: 22, restSec: 60 },
          { id: "ex-15", name: "Elevação Lateral na Polia", muscleGroup: "Ombros", sets: 4, reps: "12-15", weightKg: 10, restSec: 45 }
        ]
      }
    ]
  },
  {
    id: "wkt-2",
    studentId: "std-2",
    studentName: "Beatriz Nogueira Silva",
    title: "Definição Muscular & Glúteos",
    objective: "Tonificação Muscular e Resistência",
    level: "Intermediário",
    instructor: "Profª Amanda Rezende",
    startDate: "2024-07-15",
    validUntil: "2024-10-15",
    splits: [
      {
        name: "Treino A - Inferiores (Ênfase Glúteos/Posterior)",
        exercises: [
          { id: "ex-21", name: "Elevação Pélvica com Barra", muscleGroup: "Pernas", sets: 4, reps: "12-15", weightKg: 70, restSec: 60, notes: "Pico de contração de 3 seg no topo." },
          { id: "ex-22", name: "Stiff com Halteres", muscleGroup: "Pernas", sets: 4, reps: "12", weightKg: 18, restSec: 60 },
          { id: "ex-23", name: "Cadeira Abdutora (Tronco Inclinado)", muscleGroup: "Pernas", sets: 4, reps: "15-20", weightKg: 45, restSec: 45 }
        ]
      },
      {
        name: "Treino B - Superiores e Abdômen",
        exercises: [
          { id: "ex-24", name: "Puxador Frente Aberto", muscleGroup: "Costas", sets: 3, reps: "12", weightKg: 35, restSec: 45 },
          { id: "ex-25", name: "Supino Reto com Halteres", muscleGroup: "Peito", sets: 3, reps: "12", weightKg: 12, restSec: 45 },
          { id: "ex-26", name: "Prancha Isométrica", muscleGroup: "Abdômen", sets: 3, reps: "45 seg", restSec: 30 }
        ]
      }
    ]
  }
];

export const INITIAL_ACCESS_LOGS: AccessLog[] = [
  {
    id: "log-1",
    studentId: "std-1",
    studentName: "Gianluca Marinho",
    studentCode: "00104",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    timestamp: "Hoje às 12:42",
    type: "entrada",
    status: "liberado",
    reason: "Plano Ativo (Anual Black VIP)",
    turnstile: "Catraca Principal (Entrada)"
  },
  {
    id: "log-2",
    studentId: "std-4",
    studentName: "Fernanda Albuquerque Costa",
    studentCode: "00107",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    timestamp: "Hoje às 10:20",
    type: "entrada",
    status: "liberado",
    reason: "Plano Ativo (Semestral Fit)",
    turnstile: "Catraca 02 - Musculação"
  },
  {
    id: "log-3",
    studentId: "std-3",
    studentName: "Carlos Eduardo Rocha",
    studentCode: "00106",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    timestamp: "Ontem às 19:30",
    type: "entrada",
    status: "bloqueado",
    reason: "Mensalidade Vencida há 3 dias (R$ 169,90)",
    turnstile: "Catraca Principal (Entrada)"
  },
  {
    id: "log-4",
    studentId: "std-2",
    studentName: "Beatriz Nogueira Silva",
    studentCode: "00105",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    timestamp: "Hoje às 08:15",
    type: "entrada",
    status: "liberado",
    reason: "Plano Ativo (Anual Black VIP)",
    turnstile: "Catraca Principal (Entrada)"
  },
  {
    id: "log-5",
    studentId: "std-6",
    studentName: "Juliana Camargo Dias",
    studentCode: "00109",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    timestamp: "Hoje às 07:10",
    type: "entrada",
    status: "liberado",
    reason: "Plano Ativo (Semestral Fit)",
    turnstile: "Catraca 02 - Musculação"
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Mariana Siqueira Castro",
    phone: "(11) 99887-1122",
    email: "mariana.castro@gmail.com",
    interest: "CrossFit e Perda de Peso",
    stage: "novo",
    notes: "Entrou em contato pelo Instagram querendo saber horários de CrossFit.",
    createdAt: "Hoje às 09:20",
    lastContact: "Hoje às 09:25",
    valueExpected: 139.90,
    source: "Instagram Ads",
    assignedTo: "Gianluca M."
  },
  {
    id: "lead-2",
    name: "Lucas Vasconcelos",
    phone: "(11) 98776-2233",
    email: "lucas.vasc@outlook.com",
    interest: "Musculação e Hipertrofia",
    stage: "agendado",
    notes: "Aula experimental agendada para amanhã às 18:00 com Prof. Marcos.",
    createdAt: "Ontem às 16:40",
    lastContact: "Hoje às 10:00",
    valueExpected: 119.90,
    source: "Google Pesquisa",
    assignedTo: "Ana Beatriz",
    scheduledDate: "Amanhã, 18:00"
  },
  {
    id: "lead-3",
    name: "Patrícia Barreto Mendes",
    phone: "(11) 97665-3344",
    email: "patricia.mendes@uol.com.br",
    interest: "Spinning e Pilates",
    stage: "compareceu",
    notes: "Fez a aula experimental de Spinning hoje de manhã e adorou a energia.",
    createdAt: "01/09/2024",
    lastContact: "Hoje às 11:30",
    valueExpected: 139.90,
    source: "Indicação de Aluno",
    assignedTo: "Gianluca M."
  },
  {
    id: "lead-4",
    name: "Gustavo Paiva",
    phone: "(11) 96554-4455",
    email: "gustavo.paiva@tech.io",
    interest: "Plano Anual Black VIP",
    stage: "negociacao",
    notes: "Pediu isenção da taxa de matrícula para fechar o plano anual.",
    createdAt: "30/08/2024",
    lastContact: "Hoje às 13:10",
    valueExpected: 119.90,
    source: "Fachada / Passante",
    assignedTo: "Ana Beatriz"
  },
  {
    id: "lead-5",
    name: "Thiago Brandão",
    phone: "(11) 95443-5566",
    email: "thiago.b@gmail.com",
    interest: "Musculação Noturna",
    stage: "matriculado",
    notes: "Fechou Plano Semestral na recepção! Já começou hoje.",
    createdAt: "29/08/2024",
    lastContact: "Hoje às 12:00",
    valueExpected: 139.90,
    source: "Instagram Ads",
    assignedTo: "Gianluca M."
  },
  {
    id: "lead-6",
    name: "Camila Guimarães Rocha",
    phone: "(11) 94332-8899",
    email: "camila.rocha@adv.br",
    interest: "Pilates e Funcional",
    stage: "novo",
    notes: "Lead veio via campanha do Facebook. Quer treinar no horário do almoço.",
    createdAt: "Hoje às 11:05",
    lastContact: "Hoje às 11:15",
    valueExpected: 149.90,
    source: "Facebook Ads",
    assignedTo: "Ana Beatriz"
  },
  {
    id: "lead-7",
    name: "Felipe Andrade Costa",
    phone: "(11) 93221-7766",
    email: "felipe.costa@empresa.com",
    interest: "Musculação e Condicionamento",
    stage: "agendado",
    notes: "Amigo do aluno Gianluca. Agendou aula de musculação para hoje 19:30.",
    createdAt: "Ontem às 14:10",
    lastContact: "Hoje às 08:30",
    valueExpected: 119.90,
    source: "Indicação de Aluno",
    assignedTo: "Gianluca M.",
    scheduledDate: "Hoje, 19:30"
  },
  {
    id: "lead-8",
    name: "Renata Albuquerque",
    phone: "(11) 92110-6655",
    email: "renata.albu@gmail.com",
    interest: "Muay Thai Feminino",
    stage: "compareceu",
    notes: "Adorou a aula com o mestre Rodolfo. Quer trazer a irmã junto.",
    createdAt: "28/08/2024",
    lastContact: "Hoje às 14:00",
    valueExpected: 159.90,
    source: "Google Pesquisa",
    assignedTo: "Ana Beatriz"
  }
];

export const INITIAL_COMANDAS: Comanda[] = [
  {
    id: "cmd-1",
    number: 101,
    studentId: "std-1",
    studentName: "Gianluca Marinho",
    studentCode: "00104",
    status: "aberta",
    openedAt: "Hoje às 12:45",
    items: [
      {
        id: "ci-1",
        productId: "prod-3",
        productName: "Água Mineral Crystal 500ml sem Gás",
        quantity: 2,
        unitPrice: 4.50,
        totalPrice: 9.00,
        addedAt: "12:45"
      },
      {
        id: "ci-2",
        productId: "prod-4",
        productName: "Barra de Proteína Crisp Choco Trufado 45g",
        quantity: 1,
        unitPrice: 12.00,
        totalPrice: 12.00,
        addedAt: "13:10"
      }
    ],
    total: 21.00,
    notes: "Consumo pós-treino musculação"
  },
  {
    id: "cmd-2",
    number: 102,
    studentId: "std-2",
    studentName: "Beatriz Nogueira Silva",
    studentCode: "00105",
    status: "aberta",
    openedAt: "Hoje às 08:30",
    items: [
      {
        id: "ci-3",
        productId: "prod-4",
        productName: "Barra de Proteína Crisp Choco Trufado 45g",
        quantity: 2,
        unitPrice: 12.00,
        totalPrice: 24.00,
        addedAt: "08:30"
      }
    ],
    total: 24.00,
    notes: "Comanda recepção"
  },
  {
    id: "cmd-3",
    number: 103,
    studentName: "Visitante / Convidado Diurno",
    status: "aberta",
    openedAt: "Hoje às 11:20",
    items: [
      {
        id: "ci-4",
        productId: "prod-3",
        productName: "Água Mineral Crystal 500ml sem Gás",
        quantity: 1,
        unitPrice: 4.50,
        totalPrice: 4.50,
        addedAt: "11:20"
      },
      {
        id: "ci-5",
        productId: "prod-5",
        productName: "Coqueteleira VB SPORT Pro 700ml",
        quantity: 1,
        unitPrice: 29.90,
        totalPrice: 29.90,
        addedAt: "11:25"
      }
    ],
    total: 34.40
  },
  {
    id: "cmd-4",
    number: 99,
    studentId: "std-6",
    studentName: "Juliana Camargo Dias",
    studentCode: "00109",
    status: "fechada",
    openedAt: "Hoje às 07:15",
    closedAt: "Hoje às 08:00",
    items: [
      {
        id: "ci-6",
        productId: "prod-3",
        productName: "Água Mineral Crystal 500ml sem Gás",
        quantity: 1,
        unitPrice: 4.50,
        totalPrice: 4.50,
        addedAt: "07:15"
      }
    ],
    total: 4.50,
    paymentMethod: "pix"
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: "sm-1",
    productId: "prod-1",
    productName: "Whey Protein 100% Concentrado 900g (Baunilha)",
    type: "entrada",
    quantity: 30,
    date: "01/09/2024 10:30",
    reason: "Compra Fornecedor Suplementos BR (NF 45892)",
    responsible: "Gianluca Marinho",
    costUnit: 78.00
  },
  {
    id: "sm-2",
    productId: "prod-3",
    productName: "Água Mineral Crystal 500ml sem Gás",
    type: "entrada",
    quantity: 200,
    date: "28/08/2024 14:00",
    reason: "Reposição Bebidas Distribuidora Cristal (NF 1198)",
    responsible: "Recepção Matriz",
    costUnit: 1.20
  },
  {
    id: "sm-3",
    productId: "prod-2",
    productName: "Creatina Monohidratada 100% Pura 300g",
    type: "saida",
    quantity: 2,
    date: "02/09/2024 17:40",
    reason: "Venda Balcão PDV #1042",
    responsible: "Recepção Matriz"
  },
  {
    id: "sm-4",
    productId: "prod-6",
    productName: "Luvas de Treino Grip Neoprene c/ Munhequeira",
    type: "ajuste",
    quantity: -1,
    date: "30/08/2024 19:15",
    reason: "Avaria no zíper de embalagem / Amostra Mostruário",
    responsible: "Gianluca Marinho"
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: "sup-1",
    name: "Max Titanium / Suplementos BR Distribuidora",
    cnpj: "18.234.567/0001-44",
    phone: "(11) 3234-8800",
    email: "comercial@suplementosbr.com.br",
    contactPerson: "Carlos Eduardo",
    category: "Suplementos e Proteínas"
  },
  {
    id: "sup-2",
    name: "Distribuidora Cristal Águas e Isotônicos",
    cnpj: "09.112.334/0001-88",
    phone: "(11) 2990-1122",
    email: "pedidos@cristalaguas.com.br",
    contactPerson: "Mariana Souza",
    category: "Bebidas e Alimentos"
  },
  {
    id: "sup-3",
    name: "Iron Grip Vestuário e Acessórios Fitness",
    cnpj: "31.554.890/0001-12",
    phone: "(11) 98877-4433",
    email: "contato@irongrip.com.br",
    contactPerson: "Renato Lacerda",
    category: "Acessórios e Vestuário"
  }
];

export const INITIAL_PAY_RECURRING: PayRecurringCharge[] = [
  {
    id: "rc-1",
    studentId: "std-1",
    studentName: "Gianluca Marinho",
    amount: 119.90,
    frequency: "mensal",
    cardNumberMasked: "•••• 4242",
    cardBrand: "mastercard",
    nextChargeDate: "15/10/2024",
    status: "ativa",
    lastChargeStatus: "sucesso"
  },
  {
    id: "rc-2",
    studentId: "std-2",
    studentName: "Beatriz Nogueira Silva",
    amount: 119.90,
    frequency: "mensal",
    cardNumberMasked: "•••• 8821",
    cardBrand: "visa",
    nextChargeDate: "05/10/2024",
    status: "ativa",
    lastChargeStatus: "sucesso"
  },
  {
    id: "rc-3",
    studentId: "std-4",
    studentName: "Mariana Vasconcellos Rios",
    amount: 169.90,
    frequency: "mensal",
    cardNumberMasked: "•••• 1920",
    cardBrand: "elo",
    nextChargeDate: "20/09/2024",
    status: "falha",
    lastChargeStatus: "recusado"
  },
  {
    id: "rc-4",
    studentId: "std-6",
    studentName: "Juliana Camargo Dias",
    amount: 139.90,
    frequency: "mensal",
    cardNumberMasked: "•••• 7731",
    cardBrand: "visa",
    nextChargeDate: "01/10/2024",
    status: "ativa",
    lastChargeStatus: "sucesso"
  }
];

export const INITIAL_PAYMENT_LINKS: PaymentLink[] = [
  {
    id: "pl-1",
    title: "Matrícula Plano Anual Black VIP + Isenção Taxa",
    amount: 119.90,
    url: "https://pay.vbsport.com.br/anual-black-vip",
    planOrProductName: "Plano Anual Black VIP",
    expiresAt: "10/09/2024",
    status: "ativo",
    clicksCount: 28
  },
  {
    id: "pl-2",
    title: "Promoção de Verão - Semestral Fit c/ Coqueteleira Brinde",
    amount: 139.90,
    url: "https://pay.vbsport.com.br/promo-semestral-fit",
    planOrProductName: "Plano Semestral Fit",
    expiresAt: "15/09/2024",
    status: "ativo",
    clicksCount: 64
  },
  {
    id: "pl-3",
    title: "Passaporte Diária / Day-Use Sábado Livre",
    amount: 35.00,
    url: "https://pay.vbsport.com.br/dayuse-fds",
    planOrProductName: "Passaporte Diária / Day-Use",
    expiresAt: "30/09/2024",
    status: "ativo",
    clicksCount: 19
  }
];

export const INITIAL_CRM_ACTIVITIES: CrmActivity[] = [
  {
    id: "act-1",
    leadId: "lead-2",
    leadName: "Lucas Vasconcelos",
    leadPhone: "(11) 98776-2233",
    type: "aula_experimental",
    title: "Acompanhar Aula Experimental de Musculação",
    description: "Apresentar o salão de musculação, armários e apresentar o Prof. Marcos às 18:00.",
    dueDate: "Amanhã",
    dueTime: "17:45",
    status: "pendente",
    assignedTo: "Ana Beatriz",
    createdAt: "Ontem às 16:40"
  },
  {
    id: "act-2",
    leadId: "lead-4",
    leadName: "Gustavo Paiva",
    leadPhone: "(11) 96554-4455",
    type: "proposta",
    title: "Enviar Proposta com Isenção de Matrícula",
    description: "Enviar link de pagamento do Plano Anual Black VIP com cupom de isenção de matrícula até 18h.",
    dueDate: "Hoje",
    dueTime: "16:00",
    status: "pendente",
    assignedTo: "Ana Beatriz",
    createdAt: "Hoje às 13:15"
  },
  {
    id: "act-3",
    leadId: "lead-1",
    leadName: "Mariana Siqueira Castro",
    leadPhone: "(11) 99887-1122",
    type: "whatsapp",
    title: "Primeiro Contato WhatsApp (Instagram Lead)",
    description: "Enviar grade de horários de CrossFit e convidar para aula experimental no sábado.",
    dueDate: "Hoje",
    dueTime: "10:00",
    status: "concluida",
    assignedTo: "Gianluca M.",
    createdAt: "Hoje às 09:20"
  },
  {
    id: "act-4",
    leadId: "lead-3",
    leadName: "Patrícia Barreto Mendes",
    leadPhone: "(11) 97665-3344",
    type: "followup",
    title: "Follow-up Pós-Aula de Spinning",
    description: "Perguntar sobre a experiência com o professor e apresentar condições do Plano Semestral.",
    dueDate: "Hoje",
    dueTime: "15:30",
    status: "pendente",
    assignedTo: "Gianluca M.",
    createdAt: "Hoje às 11:35"
  },
  {
    id: "act-5",
    leadId: "lead-6",
    leadName: "Camila Guimarães Rocha",
    leadPhone: "(11) 94332-8899",
    type: "ligacao",
    title: "Ligar para Explicar Horários de Pilates",
    description: "Lead prefere contato por telefone no intervalo do almoço (12h às 13h).",
    dueDate: "Hoje",
    dueTime: "12:30",
    status: "concluida",
    assignedTo: "Ana Beatriz",
    createdAt: "Hoje às 11:10"
  },
  {
    id: "act-6",
    leadId: "lead-8",
    leadName: "Renata Albuquerque",
    leadPhone: "(11) 92110-6655",
    type: "proposta",
    title: "Montar Proposta Combo Irmãs Muay Thai",
    description: "Oferecer 10% de desconto para ela e para a irmã no plano semestral.",
    dueDate: "Ontem",
    dueTime: "17:00",
    status: "atrasada",
    assignedTo: "Ana Beatriz",
    createdAt: "28/08/2024"
  }
];

export const INITIAL_CRM_AUTOMATIONS: CrmAutomation[] = [
  {
    id: "auto-1",
    name: "Boas-Vindas & Agendamento Imediato (Lead Novo)",
    trigger: "Lead cadastrado no sistema (Instagram, Google ou Site)",
    channel: "whatsapp",
    delay: "Imediato (1 minuto)",
    active: true,
    dispatchedCount: 184,
    openRate: "98.5%",
    conversionRate: "42.3%",
    targetStage: "novo",
    messageTemplate: "Olá, {{nome}}! 🏋️ Aqui é da equipe VB SPORT. Vimos seu interesse em {{interesse}}! Quer agendar uma aula experimental 100% gratuita para conhecer nossa estrutura e professores? Responda 'SIM' para escolher seu melhor dia!"
  },
  {
    id: "auto-2",
    name: "Lembrete de Aula Experimental (2h Antes)",
    trigger: "2 horas antes do horário da aula experimental agendada",
    channel: "whatsapp",
    delay: "2 horas antes",
    active: true,
    dispatchedCount: 96,
    openRate: "99.1%",
    conversionRate: "88.5%",
    targetStage: "agendado",
    messageTemplate: "Oi {{nome}}! Seu treino experimental na VB SPORT é hoje às {{horario}}! Traga garrafinha de água e tênis confortável. Nosso endereço: Av. Paulista, 1850. Estamos te esperando na recepção! 💪"
  },
  {
    id: "auto-3",
    name: "Follow-up & Oferta Pós-Aula Experimental",
    trigger: "3 horas após o lead comparecer à aula experimental",
    channel: "whatsapp",
    delay: "3 horas após",
    active: true,
    dispatchedCount: 72,
    openRate: "97.2%",
    conversionRate: "54.1%",
    targetStage: "compareceu",
    messageTemplate: "Oi {{nome}}, como foi sua aula de {{interesse}} hoje na VB SPORT? Esperamos que tenha sentido a energia da nossa comunidade! Liberamos uma condição especial com matrícula ZERO se fechar seu plano até amanhã. Quer ver os valores?"
  },
  {
    id: "auto-4",
    name: "Resgate de Proposta em Negociação",
    trigger: "48 horas em negociação sem fechamento",
    channel: "whatsapp",
    delay: "48 horas",
    active: true,
    dispatchedCount: 45,
    openRate: "94.0%",
    conversionRate: "28.9%",
    targetStage: "negociacao",
    messageTemplate: "Olá {{nome}}! Apenas passando para avisar que a vaga reservada para você no plano {{interesse}} vence hoje. Podemos confirmar sua matrícula e liberar seu acesso biométrico na catraca agora mesmo?"
  },
  {
    id: "auto-5",
    name: "Boas-Vindas ao Novo Aluno & Acesso App VB SPORT",
    trigger: "Lead alterado para estágio 'Matriculado'",
    channel: "whatsapp",
    delay: "Imediato",
    active: true,
    dispatchedCount: 112,
    openRate: "100%",
    conversionRate: "98.2%",
    targetStage: "matriculado",
    messageTemplate: "🎉 Parabéns {{nome}}! Você agora é oficialmente atleta VB SPORT! Baixe o app VB SPORT para ver seus treinos, agendar aulas e liberar a catraca com seu celular. Seu login é seu e-mail!"
  },
  {
    id: "auto-6",
    name: "Alerta de Tarefa: Lead Frio sem Contato",
    trigger: "Lead parado na etapa 'Novo' há mais de 48 horas",
    channel: "tarefa",
    delay: "48 horas sem resposta",
    active: false,
    dispatchedCount: 23,
    openRate: "91.3%",
    conversionRate: "17.4%",
    targetStage: "novo",
    messageTemplate: "[TAREFA AUTOMÁTICA] Lead {{nome}} sem resposta há 48h. Realizar tentativa de contato telefônico."
  }
];

export const INITIAL_SATISFACTION_SURVEYS: SatisfactionSurveyResponse[] = [
  {
    id: "surv-1",
    respondentName: "Patrícia Barreto Mendes",
    respondentType: "lead_experimental",
    phone: "(11) 97665-3344",
    surveyTitle: "Pesquisa Pós-Aula Experimental",
    score: 10,
    categoryRating: {
      atendimento: 5,
      estrutura: 5,
      professor: 5,
      limpeza: 5
    },
    comment: "A aula de Spinning com a professora Amanda foi sensacional! A recepção foi muito acolhedora e as bikes são super modernas.",
    date: "Hoje às 11:45",
    sentiment: "positivo",
    resolved: true
  },
  {
    id: "surv-2",
    respondentName: "Felipe Andrade Costa",
    respondentType: "lead_experimental",
    phone: "(11) 93221-7766",
    surveyTitle: "Pesquisa Pós-Aula Experimental",
    score: 9,
    categoryRating: {
      atendimento: 5,
      estrutura: 4,
      professor: 5,
      limpeza: 5
    },
    comment: "Gostei muito dos equipamentos de musculação biomecânica. Achei o vestiário um pouco concorrido no horário das 19h, mas no geral nota 10.",
    date: "Ontem às 20:30",
    sentiment: "positivo",
    resolved: true
  },
  {
    id: "surv-3",
    respondentName: "Juliana Camargo Dias",
    respondentType: "novo_aluno_30d",
    phone: "(11) 94400-5313",
    surveyTitle: "Experiência dos Primeiros 30 Dias",
    score: 10,
    categoryRating: {
      atendimento: 5,
      estrutura: 5,
      professor: 5,
      limpeza: 5
    },
    comment: "Melhor academia que já treinei em SP. O app VB SPORT facilita muito ver a ficha de treino e os professores no salão estão sempre atentos.",
    date: "01/09/2024",
    sentiment: "positivo",
    resolved: true
  },
  {
    id: "surv-4",
    respondentName: "Renata Albuquerque",
    respondentType: "lead_experimental",
    phone: "(11) 92110-6655",
    surveyTitle: "Pesquisa Pós-Aula Experimental",
    score: 8,
    categoryRating: {
      atendimento: 4,
      estrutura: 4,
      professor: 5,
      limpeza: 4
    },
    comment: "Professor de Muay Thai excelente! Apenas sugiro ter mais vagas no estacionamento conveniado.",
    date: "29/08/2024",
    sentiment: "positivo",
    resolved: true
  },
  {
    id: "surv-5",
    respondentName: "Carlos Eduardo Nogueira",
    respondentType: "novo_aluno_30d",
    phone: "(11) 91234-5678",
    surveyTitle: "Experiência dos Primeiros 30 Dias",
    score: 6,
    categoryRating: {
      atendimento: 4,
      estrutura: 3,
      professor: 4,
      limpeza: 4
    },
    comment: "Horário das 18h tem fila em duas esteiras. Academia podia colocar mais 2 esteiras Matrix.",
    date: "26/08/2024",
    sentiment: "neutro",
    resolved: false
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  // --- GRADE DE HORÁRIO / TURMAS ---
  {
    id: "cal-evt-1",
    title: "CrossFit WOD Power",
    category: "grade_turma",
    date: "2026-09-03",
    startTime: "07:00",
    endTime: "08:00",
    location: "Box CrossFit Arena",
    instructorOrHost: "Prof. Marcos Andrade",
    capacity: 20,
    enrolledOrConfirmedCount: 18,
    status: "confirmado",
    tag: "Turma Regular",
    description: "Treino do dia com aquecimento dinâmico, força e condicionamento metabólico de alta intensidade.",
    extraDetails: {
      modality: "CrossFit / Funcional"
    }
  },
  {
    id: "cal-evt-2",
    title: "Spinning Extreme Ride",
    category: "grade_turma",
    date: "2026-09-03",
    startTime: "08:30",
    endTime: "09:15",
    location: "Sala de Ciclismo Indoor",
    instructorOrHost: "Profª Larissa Fontes",
    capacity: 15,
    enrolledOrConfirmedCount: 15,
    status: "confirmado",
    tag: "Lotado",
    description: "Ciclismo indoor com subidas virtuais e intervalos de alta queima calórica com trilha sonora eletrônica.",
    extraDetails: {
      modality: "Spinning"
    }
  },
  {
    id: "cal-evt-3",
    title: "Pilates Solo & Postura",
    category: "grade_turma",
    date: "2026-09-03",
    startTime: "10:00",
    endTime: "11:00",
    location: "Studio Pilates",
    instructorOrHost: "Profª Camila Rocha",
    capacity: 12,
    enrolledOrConfirmedCount: 9,
    status: "confirmado",
    tag: "Turma Regular",
    description: "Trabalho de flexibilidade, fortalecimento de core e reeducação postural biomecânica.",
    extraDetails: {
      modality: "Pilates"
    }
  },
  {
    id: "cal-evt-4",
    title: "Muay Thai Sparring & Técnica",
    category: "grade_turma",
    date: "2026-09-03",
    startTime: "19:00",
    endTime: "20:00",
    location: "Tatame Arena Lutas",
    instructorOrHost: "Prof. Ricardo Silva (Kru)",
    capacity: 18,
    enrolledOrConfirmedCount: 14,
    status: "confirmado",
    tag: "Turma Noturna",
    description: "Fundamentos de socos, chutes, joelhadas e manoplas técnicas para condicionamento e defesa.",
    extraDetails: {
      modality: "Muay Thai / Lutas"
    }
  },
  {
    id: "cal-evt-5",
    title: "CrossFit Endurance & Ginástica",
    category: "grade_turma",
    date: "2026-09-04",
    startTime: "07:00",
    endTime: "08:00",
    location: "Box CrossFit Arena",
    instructorOrHost: "Prof. Marcos Andrade",
    capacity: 20,
    enrolledOrConfirmedCount: 16,
    status: "confirmado",
    tag: "Turma Regular",
    description: "Ênfase em movimentos ginásticos de barra fixa e cardio de longa duração.",
    extraDetails: {
      modality: "CrossFit / Funcional"
    }
  },
  {
    id: "cal-evt-6",
    title: "Funcional HIIT Cardio",
    category: "grade_turma",
    date: "2026-09-04",
    startTime: "18:00",
    endTime: "19:00",
    location: "Sala Multiuso",
    instructorOrHost: "Prof. Diego Santos",
    capacity: 20,
    enrolledOrConfirmedCount: 13,
    status: "confirmado",
    tag: "Turma Regular",
    description: "Circuito aeróbico com corda naval, kettlebell e trenó de empurrar.",
    extraDetails: {
      modality: "CrossFit / Funcional"
    }
  },
  {
    id: "cal-evt-7",
    title: "Spinning Sunset Beat",
    category: "grade_turma",
    date: "2026-09-07",
    startTime: "18:30",
    endTime: "19:15",
    location: "Sala de Ciclismo Indoor",
    instructorOrHost: "Profª Larissa Fontes",
    capacity: 15,
    enrolledOrConfirmedCount: 12,
    status: "confirmado",
    tag: "Turma Regular",
    extraDetails: {
      modality: "Spinning"
    }
  },
  {
    id: "cal-evt-8",
    title: "Pilates Solo Avançado",
    category: "grade_turma",
    date: "2026-09-08",
    startTime: "09:00",
    endTime: "10:00",
    location: "Studio Pilates",
    instructorOrHost: "Profª Camila Rocha",
    capacity: 12,
    enrolledOrConfirmedCount: 10,
    status: "confirmado",
    tag: "Turma Regular",
    extraDetails: {
      modality: "Pilates"
    }
  },

  // --- LOCAÇÕES ---
  {
    id: "cal-evt-loc-1",
    title: "Locação: Pelada dos Amigos do Bairro",
    category: "locacao",
    date: "2026-09-03",
    startTime: "20:30",
    endTime: "22:00",
    location: "Campo Society 1 (Grama Sintética)",
    instructorOrHost: "Roberto Martins",
    contactPhone: "(11) 98765-1122",
    price: 220.00,
    paymentStatus: "pago",
    capacity: 16,
    enrolledOrConfirmedCount: 14,
    status: "confirmado",
    tag: "Grama Sintética",
    description: "Aluguel semanal de campo society com bolas oficiais e coletes inclusos.",
    extraDetails: {
      renterName: "Roberto Martins",
      renterDocument: "298.411.002-33",
      depositPaid: true
    }
  },
  {
    id: "cal-evt-loc-2",
    title: "Locação: Beach Tennis Grupo Sexta",
    category: "locacao",
    date: "2026-09-04",
    startTime: "18:00",
    endTime: "19:30",
    location: "Quadra de Beach Tennis 1 (Areia)",
    instructorOrHost: "Luciana Prado",
    contactPhone: "(11) 97654-9988",
    price: 140.00,
    paymentStatus: "pago",
    capacity: 8,
    enrolledOrConfirmedCount: 6,
    status: "confirmado",
    tag: "Quadra Areia",
    description: "Aluguel da quadra de areia com rede e iluminação noturna LED.",
    extraDetails: {
      renterName: "Luciana Prado",
      renterDocument: "341.980.551-77",
      depositPaid: true
    }
  },
  {
    id: "cal-evt-loc-3",
    title: "Locação: Ensaio Grupo Dança & Ritmos",
    category: "locacao",
    date: "2026-09-05",
    startTime: "09:00",
    endTime: "11:00",
    location: "Sala Multiuso / Espelhos",
    instructorOrHost: "Profª Helena Reis",
    contactPhone: "(11) 99123-4567",
    price: 160.00,
    paymentStatus: "pago",
    capacity: 25,
    enrolledOrConfirmedCount: 18,
    status: "confirmado",
    tag: "Sala Multiuso",
    description: "Locação privativa com sistema de som Bluetooth e espelhos panorâmicos.",
    extraDetails: {
      renterName: "Helena Reis",
      depositPaid: true
    }
  },
  {
    id: "cal-evt-loc-4",
    title: "Locação: Racha Society Fim de Tarde",
    category: "locacao",
    date: "2026-09-05",
    startTime: "16:00",
    endTime: "18:00",
    location: "Campo Society 1 (Grama Sintética)",
    instructorOrHost: "Thiago Mendes",
    contactPhone: "(11) 98111-2233",
    price: 280.00,
    paymentStatus: "pendente",
    capacity: 18,
    enrolledOrConfirmedCount: 14,
    status: "confirmado",
    tag: "Pendente Pagto",
    description: "Locação de 2 horas de campo society. 50% de sinal pago, restante a quitar no balcão.",
    extraDetails: {
      renterName: "Thiago Mendes",
      depositPaid: false
    }
  },
  {
    id: "cal-evt-loc-5",
    title: "Locação: Treino Futevôlei Duplas Master",
    category: "locacao",
    date: "2026-09-08",
    startTime: "19:00",
    endTime: "20:30",
    location: "Quadra de Areia 2",
    instructorOrHost: "Marcelo Dantas",
    contactPhone: "(11) 99876-5432",
    price: 150.00,
    paymentStatus: "pago",
    capacity: 8,
    enrolledOrConfirmedCount: 4,
    status: "confirmado",
    tag: "Quadra Areia",
    description: "Treino fechado para preparação para o torneio regional.",
    extraDetails: {
      renterName: "Marcelo Dantas",
      depositPaid: true
    }
  },
  {
    id: "cal-evt-loc-6",
    title: "Locação: Pelada dos Bancários",
    category: "locacao",
    date: "2026-09-10",
    startTime: "21:00",
    endTime: "22:30",
    location: "Campo Society 1 (Grama Sintética)",
    instructorOrHost: "Carlos Viana",
    contactPhone: "(11) 98222-3344",
    price: 220.00,
    paymentStatus: "pago",
    capacity: 16,
    enrolledOrConfirmedCount: 14,
    status: "confirmado",
    tag: "Grama Sintética",
    description: "Aluguel quinzenal recorrente.",
    extraDetails: {
      renterName: "Carlos Viana",
      depositPaid: true
    }
  },
  {
    id: "cal-evt-loc-7",
    title: "Locação: Gravação Comercial Fitness & Fotos",
    category: "locacao",
    date: "2026-09-13",
    startTime: "13:00",
    endTime: "16:00",
    location: "Box CrossFit Arena",
    instructorOrHost: "Agência FitMedia (Produtora)",
    contactPhone: "(11) 97000-8811",
    price: 450.00,
    paymentStatus: "pago",
    capacity: 12,
    enrolledOrConfirmedCount: 8,
    status: "confirmado",
    tag: "Audiovisual",
    description: "Locação de domingo à tarde para fotos institucionais de marca de vestuário.",
    extraDetails: {
      renterName: "Agência FitMedia",
      depositPaid: true
    }
  },

  // --- EVENTOS DE JOGOS & CAMPEONATOS ---
  {
    id: "cal-evt-game-1",
    title: "Copa VB Society Noturno - 3ª Rodada",
    category: "evento_jogo",
    date: "2026-09-09",
    startTime: "19:30",
    endTime: "22:30",
    location: "Campo Society 1",
    instructorOrHost: "Coordenação de Esportes VB",
    contactPhone: "(11) 98765-4321",
    price: 60.00,
    paymentStatus: "pago",
    capacity: 60,
    enrolledOrConfirmedCount: 52,
    status: "confirmado",
    tag: "Campeonato",
    description: "Jogos da 3ª fase da Copa Inter-Sócios com arbitragem oficial da federação e súmula digital.",
    extraDetails: {
      sport: "Futebol Society",
      teamsCount: 8,
      matchType: "copa",
      prizes: "Troféu Campeão, Medalhas e Vale Chope R$ 500 no Lounge"
    }
  },
  {
    id: "cal-evt-game-2",
    title: "1º Torneio Open VB SPORT de Beach Tennis",
    category: "evento_jogo",
    date: "2026-09-12",
    startTime: "08:00",
    endTime: "18:00",
    location: "Quadras de Areia 1 e 2",
    instructorOrHost: "Profª Juliana & Comitê de Areia",
    contactPhone: "(11) 98456-7890",
    price: 80.00,
    paymentStatus: "pago",
    capacity: 64,
    enrolledOrConfirmedCount: 56,
    status: "confirmado",
    tag: "Torneio Aberto",
    description: "Torneio oficial nas categorias Mista Open, Masculino B/C e Feminino B/C. Mesa de frutas, hidratação e troféus.",
    extraDetails: {
      sport: "Beach Tennis",
      teamsCount: 28,
      matchType: "torneio",
      prizes: "R$ 2.500 em premiação total + Raquetes e Brindes de Patrocinadores"
    }
  },
  {
    id: "cal-evt-game-3",
    title: "Desafio Cross Games VB SPORT 2026",
    category: "evento_jogo",
    date: "2026-09-19",
    startTime: "08:30",
    endTime: "14:30",
    location: "Box CrossFit Arena + Circuito Externo",
    instructorOrHost: "Head Coach Marcos & Equipe",
    contactPhone: "(11) 98765-4321",
    price: 50.00,
    paymentStatus: "pago",
    capacity: 48,
    enrolledOrConfirmedCount: 42,
    status: "confirmado",
    tag: "Competição Interna",
    description: "Competição por duplas (Scale e RX) com 4 WODs desafiadores, cronometragem eletrônica e DJ ao vivo.",
    extraDetails: {
      sport: "CrossFit & LPO",
      teamsCount: 21,
      matchType: "campeonato_interno",
      prizes: "Troféus, kits de suplementos Whey/Creatina e mensalidades grátis"
    }
  },
  {
    id: "cal-evt-game-4",
    title: "Torneio Relâmpago 'Rei da Praia' de Futevôlei",
    category: "evento_jogo",
    date: "2026-09-27",
    startTime: "09:00",
    endTime: "15:00",
    location: "Quadras de Areia 1 e 2",
    instructorOrHost: "Prof. Léo Futevôlei",
    contactPhone: "(11) 97123-0099",
    price: 40.00,
    paymentStatus: "pago",
    capacity: 24,
    enrolledOrConfirmedCount: 20,
    status: "confirmado",
    tag: "Futevôlei",
    description: "Formato dinâmico 'King of the Beach' onde cada atleta soma pontos individuais rodando parceiros.",
    extraDetails: {
      sport: "Futevôlei",
      teamsCount: 16,
      matchType: "torneio",
      prizes: "Troféu Rei da Praia + Bola Mikasa FT-5 oficial"
    }
  },

  // --- EVENTOS DIVERSOS ---
  {
    id: "cal-evt-misc-1",
    title: "Workshop: Nutrição Esportiva & Performance",
    category: "evento_diverso",
    date: "2026-09-05",
    startTime: "10:00",
    endTime: "12:30",
    location: "Auditório / Sala de Cursos",
    instructorOrHost: "Dra. Mariana Duarte (Nutricionista)",
    contactPhone: "(11) 96543-2109",
    price: 0,
    paymentStatus: "incluso",
    capacity: 35,
    enrolledOrConfirmedCount: 32,
    status: "confirmado",
    tag: "Workshop Gratuito",
    description: "Palestra sobre timing de nutrientes, creatina, proteína e hidratação. Degustação de shakes e café funcional.",
    extraDetails: {
      eventType: "workshop",
      speaker: "Dra. Mariana Duarte - CRN-3 48123",
      certificate: true
    }
  },
  {
    id: "cal-evt-misc-2",
    title: "Aulão Especial Solidário de Spinning & DJ",
    category: "evento_diverso",
    date: "2026-09-11",
    startTime: "19:00",
    endTime: "20:30",
    location: "Sala de Ciclismo Indoor + Lounge",
    instructorOrHost: "Profª Larissa Fontes & DJ Convidado",
    contactPhone: "(11) 98765-4321",
    price: 0,
    paymentStatus: "cortesia",
    capacity: 25,
    enrolledOrConfirmedCount: 25,
    status: "confirmado",
    tag: "Aulão Solidário",
    description: "Pedal com iluminação de balada e DJ. Entrada simbólica: 2kg de alimentos para instituição local.",
    extraDetails: {
      eventType: "aulao_especial",
      speaker: "Larissa Fontes e DJ Bruno Tech",
      certificate: false
    }
  },
  {
    id: "cal-evt-misc-3",
    title: "Festa da Primavera & Confraternização VB",
    category: "evento_diverso",
    date: "2026-09-20",
    startTime: "12:00",
    endTime: "17:00",
    location: "Área Gourmet & Lounge Externo",
    instructorOrHost: "Diretoria VB SPORT",
    contactPhone: "(11) 98765-4321",
    price: 35.00,
    paymentStatus: "pago",
    capacity: 120,
    enrolledOrConfirmedCount: 88,
    status: "confirmado",
    tag: "Social / Confraternização",
    description: "Almoço integrador de alunos, familiares e equipe com música ao vivo, espetinhos e espaço kids.",
    extraDetails: {
      eventType: "confraternizacao",
      speaker: "Equipe VB SPORT",
      certificate: false
    }
  },
  {
    id: "cal-evt-misc-4",
    title: "Clínica Técnica de LPO (Levantamento Olímpico)",
    category: "evento_diverso",
    date: "2026-09-26",
    startTime: "09:00",
    endTime: "13:00",
    location: "Box CrossFit Arena",
    instructorOrHost: "Coach Rodrigo Peixoto (Camp. Brasileiro)",
    contactPhone: "(11) 98999-7766",
    price: 120.00,
    paymentStatus: "pago",
    capacity: 20,
    enrolledOrConfirmedCount: 17,
    status: "confirmado",
    tag: "Clínica Especializada",
    description: "Aperfeiçoamento dos movimentos de Snatch, Clean & Jerk, correção biomecânica em vídeo e mobilidade específica.",
    extraDetails: {
      eventType: "clinica",
      speaker: "Rodrigo Peixoto - Atleta & Treinador CBLP",
      certificate: true
    }
  }
];

