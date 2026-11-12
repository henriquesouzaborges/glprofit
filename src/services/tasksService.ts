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
    id: 'prof-admin',
    name: 'Gianluca Marinho',
    role: 'Administrador Master',
    department: 'Direção Geral',
    avatar: ''
  }
];

const STORAGE_KEY = 'vbsport_google_tasks';

export const INITIAL_TASKS: GoogleTask[] = [];

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

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bg: string; border: string }> = {
  alta: { label: 'Alta', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  media: { label: 'Média', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  baixa: { label: 'Baixa', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
};
