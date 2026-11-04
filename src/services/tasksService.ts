export type TaskPriority = 'alta' | 'media' | 'baixa';
export type TaskCategory = 'geral' | 'rotina' | 'manutencao' | 'aula' | 'avaliacao' | 'administrativo';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface GoogleTask {
  id: string;
  assignedUserId: string; // ID of the teacher/user whose column this belongs to
  assignedUserName: string;
  creatorUserId: string;
  creatorUserName: string;
  title: string;
  notes?: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: TaskPriority;
  category: TaskCategory;
  starred?: boolean;
  completed: boolean;
  completedAt?: string;
  subtasks?: SubTask[];
  createdAt: string;
}

export interface TaskUserColumn {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
}

export const TASK_COLUMNS: TaskUserColumn[] = [
  {
    id: 'prof-4', // Gianluca
    name: 'Gianluca Marinho',
    role: 'Coordenador Geral',
    department: 'Diretoria & Coordenação',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'prof-1', // Rodrigo
    name: 'Prof. Rodrigo Tavares',
    role: 'Treinador / Instrutor',
    department: 'Musculação & Avaliações',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'prof-2', // Carlos
    name: 'Prof. Carlos Eduardo',
    role: 'Treinador / Instrutor',
    department: 'Escola de Futebol & Base',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'prof-3', // Juliana
    name: 'Profª Juliana Martins',
    role: 'Treinadora / Instrutora',
    department: 'Treinamento Funcional',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
  }
];

const STORAGE_KEY = 'vbsport_google_tasks';

export const INITIAL_TASKS: GoogleTask[] = [
  // Gianluca Marinho
  {
    id: 'task-1',
    assignedUserId: 'prof-4',
    assignedUserName: 'Gianluca Marinho',
    creatorUserId: 'prof-4',
    creatorUserName: 'Gianluca Marinho',
    title: 'Revisão do fechamento da folha de pagamento de Setembro',
    notes: 'Conferir total de horas registradas com os relatórios de turmas e eventos da semana.',
    dueDate: '2026-09-30',
    dueTime: '17:00',
    priority: 'alta',
    category: 'administrativo',
    starred: true,
    completed: false,
    subtasks: [
      { id: 'sub-1', title: 'Conferir diário de presença dos professores', completed: true },
      { id: 'sub-2', title: 'Validar horas extras do torneio de futebol', completed: false }
    ],
    createdAt: '2026-09-28T09:00:00Z'
  },
  {
    id: 'task-2',
    assignedUserId: 'prof-4',
    assignedUserName: 'Gianluca Marinho',
    creatorUserId: 'prof-4',
    creatorUserName: 'Gianluca Marinho',
    title: 'Aprovar compra de novos cones e coletes para o futebol',
    notes: 'Orçamento recebido da Penalty e Topper para renovação do estoque de treino.',
    dueDate: '2026-10-02',
    priority: 'media',
    category: 'manutencao',
    starred: false,
    completed: true,
    completedAt: '2026-09-29T14:30:00Z',
    createdAt: '2026-09-27T11:00:00Z'
  },

  // Rodrigo Tavares
  {
    id: 'task-3',
    assignedUserId: 'prof-1',
    assignedUserName: 'Prof. Rodrigo Tavares',
    creatorUserId: 'prof-4',
    creatorUserName: 'Gianluca Marinho',
    title: 'Lubrificar cabos de aço dos crossovers e pulley da Sala 1',
    notes: 'Alunos relataram leve atrito no puxador alto no horário da manhã.',
    dueDate: '2026-09-30',
    dueTime: '12:00',
    priority: 'alta',
    category: 'manutencao',
    starred: true,
    completed: false,
    createdAt: '2026-09-29T08:15:00Z'
  },
  {
    id: 'task-4',
    assignedUserId: 'prof-1',
    assignedUserName: 'Prof. Rodrigo Tavares',
    creatorUserId: 'prof-1',
    creatorUserName: 'Prof. Rodrigo Tavares',
    title: 'Atualizar fichas de treino que vencem esta semana (8 alunos)',
    notes: 'Focar na nova periodização com protocolo de hipertrofia e deload.',
    dueDate: '2026-10-01',
    priority: 'media',
    category: 'rotina',
    starred: false,
    completed: false,
    createdAt: '2026-09-29T10:00:00Z'
  },
  {
    id: 'task-5',
    assignedUserId: 'prof-1',
    assignedUserName: 'Prof. Rodrigo Tavares',
    creatorUserId: 'prof-1',
    creatorUserName: 'Prof. Rodrigo Tavares',
    title: 'Calibração da balança de bioimpedância InBody',
    notes: 'Verificar pilhas e eletrodos de contato antes da bateria de testes.',
    dueDate: '2026-09-28',
    priority: 'baixa',
    category: 'avaliacao',
    starred: false,
    completed: true,
    completedAt: '2026-09-28T16:00:00Z',
    createdAt: '2026-09-28T09:30:00Z'
  },

  // Carlos Eduardo
  {
    id: 'task-6',
    assignedUserId: 'prof-2',
    assignedUserName: 'Prof. Carlos Eduardo',
    creatorUserId: 'prof-4',
    creatorUserName: 'Gianluca Marinho',
    title: 'Separar material e bolas calibradas para a Copa Sub-11',
    notes: 'Preparar 15 bolas Penalty Campo/Society e jogo de coletes verde e azul.',
    dueDate: '2026-10-03',
    dueTime: '08:00',
    priority: 'alta',
    category: 'aula',
    starred: true,
    completed: false,
    subtasks: [
      { id: 'sub-3', title: 'Calibrar bolas em 10 libras', completed: false },
      { id: 'sub-4', title: 'Separar prancheta tática e cronômetro', completed: false }
    ],
    createdAt: '2026-09-29T15:00:00Z'
  },
  {
    id: 'task-7',
    assignedUserId: 'prof-2',
    assignedUserName: 'Prof. Carlos Eduardo',
    creatorUserId: 'prof-2',
    creatorUserName: 'Prof. Carlos Eduardo',
    title: 'Preencher súmula e lista de presença do amistoso de ontem',
    notes: 'Entregar para a recepção lançar no sistema.',
    dueDate: '2026-09-30',
    priority: 'media',
    category: 'administrativo',
    starred: false,
    completed: false,
    createdAt: '2026-09-29T18:00:00Z'
  },

  // Juliana Martins
  {
    id: 'task-8',
    assignedUserId: 'prof-3',
    assignedUserName: 'Profª Juliana Martins',
    creatorUserId: 'prof-3',
    creatorUserName: 'Profª Juliana Martins',
    title: 'Montar circuito e estações para o Aulão de Primavera',
    notes: 'Definir 6 estações: kettlebell, corda naval, wall ball, box jump, trenó e burpee.',
    dueDate: '2026-09-30',
    dueTime: '18:30',
    priority: 'alta',
    category: 'aula',
    starred: true,
    completed: false,
    createdAt: '2026-09-28T14:00:00Z'
  },
  {
    id: 'task-9',
    assignedUserId: 'prof-3',
    assignedUserName: 'Profª Juliana Martins',
    creatorUserId: 'prof-4',
    creatorUserName: 'Gianluca Marinho',
    title: 'Higienização geral dos colchonetes e halteres emborrachados',
    notes: 'Passar álcool 70% e organizar os suportes no final do expediente.',
    dueDate: '2026-10-01',
    priority: 'media',
    category: 'manutencao',
    starred: false,
    completed: false,
    createdAt: '2026-09-29T12:00:00Z'
  },
  {
    id: 'task-10',
    assignedUserId: 'prof-3',
    assignedUserName: 'Profª Juliana Martins',
    creatorUserId: 'prof-3',
    creatorUserName: 'Profª Juliana Martins',
    title: 'Criar playlist motivacional de treino no Spotify',
    notes: 'Músicas na faixa de 128 a 135 BPM para ritmo de alta intensidade.',
    dueDate: '2026-09-26',
    priority: 'baixa',
    category: 'rotina',
    starred: false,
    completed: true,
    completedAt: '2026-09-26T17:45:00Z',
    createdAt: '2026-09-25T11:00:00Z'
  }
];

export function getStoredTasks(): GoogleTask[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveStoredTasks(tasks: GoogleTask[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    import('./firebaseDbService').then(({ syncCollectionToFirestore }) => {
      syncCollectionToFirestore('team_tasks', tasks);
    }).catch(err => {
      console.warn('Sync tasks to firestore skipped:', err);
    });
  } catch (e) {
    console.error('Error saving tasks:', e);
  }
}

export const CATEGORY_LABELS: Record<TaskCategory, { label: string; bg: string; text: string }> = {
  geral: { label: 'Geral', bg: 'bg-slate-100', text: 'text-slate-700' },
  rotina: { label: 'Rotina', bg: 'bg-blue-50', text: 'text-blue-700' },
  manutencao: { label: 'Manutenção', bg: 'bg-amber-50', text: 'text-amber-700' },
  aula: { label: 'Aula / Treino', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  avaliacao: { label: 'Avaliação', bg: 'bg-purple-50', text: 'text-purple-700' },
  administrativo: { label: 'Administrativo', bg: 'bg-indigo-50', text: 'text-indigo-700' }
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; border: string }> = {
  alta: { label: 'Prioridade Alta', color: 'text-rose-600', border: 'border-l-rose-500' },
  media: { label: 'Prioridade Média', color: 'text-amber-600', border: 'border-l-amber-500' },
  baixa: { label: 'Prioridade Normal', color: 'text-blue-600', border: 'border-l-blue-400' }
};
