import { SystemUser } from '../types';

export type ProfUserRole = 'teacher' | 'coordinator';

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  role: ProfUserRole;
  hourlyRate: number; // R$ por hora
  phone?: string;
  department?: string;
  avatar?: string;
}

export interface ProfTurma {
  id: string;
  name: string;
  teacherId: string;
  teacherName?: string;
  active: boolean;
  daysOfWeek: number[]; // 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationHours: number;
  category?: string; // "Futebol Sub-9", "Musculação", "Funcional", "Futevôlei"
  location?: string;
}

export interface ProfEventAvulso {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationHours: number;
  teacherId?: string; // Se for para um professor específico ou qualquer um
  teacherName?: string;
  location?: string;
  description?: string;
}

export interface ProfClassRecord {
  id: string;
  teacherId: string;
  turmaId?: string | null;
  eventId?: string | null;
  turmaName: string;
  date: string; // YYYY-MM-DD
  hours: number;
  hourlyRateApplied: number;
  totalValue: number;
  timestamp: string; // ISO string
}

export interface TeacherSummaryStats {
  id: string;
  name: string;
  email: string;
  role: ProfUserRole;
  hourlyRate: number;
  realizedHours: number;
  projectedHours: number;
  totalHours: number;
  realizedValue: number;
  projectedValue: number;
}

export interface MonthOverallStats {
  year: number;
  month: number;
  monthName: string;
  totalRealizedValue: number;
  totalProjectedValue: number;
  totalRealizedHours: number;
  totalProjectedHours: number;
  summaries: TeacherSummaryStats[];
}

const STORAGE_KEYS = {
  TEACHERS: 'vbsport_folha_teachers',
  TURMAS: 'vbsport_folha_turmas',
  EVENTOS: 'vbsport_folha_eventos',
  RECORDS: 'vbsport_folha_records'
};

export const INITIAL_TEACHERS: TeacherProfile[] = [
  {
    id: 'prof-1',
    name: 'Prof. Rodrigo Tavares',
    email: 'rodrigo.tavares@vbsport.com.br',
    role: 'teacher',
    hourlyRate: 65,
    phone: '(11) 98222-1144',
    department: 'Musculação & Avaliações',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'prof-2',
    name: 'Prof. Carlos Eduardo Santos',
    email: 'carlos.santos@vbsport.com.br',
    role: 'teacher',
    hourlyRate: 60,
    phone: '(11) 97111-9988',
    department: 'Escola de Futebol & Base',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'prof-3',
    name: 'Profª Juliana Martins',
    email: 'juliana.martins@vbsport.com.br',
    role: 'teacher',
    hourlyRate: 70,
    phone: '(11) 96444-2233',
    department: 'Treinamento Funcional & Performance',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'prof-4',
    name: 'Gianluca Marinho',
    email: 'marinho.gianluca@gmail.com',
    role: 'coordinator',
    hourlyRate: 85,
    phone: '(11) 98765-4321',
    department: 'Coordenação Geral Esportiva',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_TURMAS: ProfTurma[] = [
  {
    id: 'turma-1',
    name: 'Futebol Sub-9 • Turma Manhã',
    teacherId: 'prof-2',
    teacherName: 'Prof. Carlos Eduardo Santos',
    active: true,
    daysOfWeek: [1, 3, 5], // Seg, Qua, Sex
    startTime: '08:30',
    endTime: '10:00',
    durationHours: 1.5,
    category: 'Futebol Infantil',
    location: 'Campo Society 1'
  },
  {
    id: 'turma-2',
    name: 'Futebol Sub-11 & Sub-13 • Turma Tarde',
    teacherId: 'prof-2',
    teacherName: 'Prof. Carlos Eduardo Santos',
    active: true,
    daysOfWeek: [2, 4], // Ter, Qui
    startTime: '15:00',
    endTime: '16:30',
    durationHours: 1.5,
    category: 'Futebol de Base',
    location: 'Campo Society 1'
  },
  {
    id: 'turma-3',
    name: 'Musculação & Hipertrofia • Sala 1',
    teacherId: 'prof-1',
    teacherName: 'Prof. Rodrigo Tavares',
    active: true,
    daysOfWeek: [1, 2, 3, 4, 5], // Seg a Sex
    startTime: '07:00',
    endTime: '10:00',
    durationHours: 3.0,
    category: 'Musculação',
    location: 'Salão Principal Musculação'
  },
  {
    id: 'turma-4',
    name: 'Cross Training & Funcional Intenso',
    teacherId: 'prof-3',
    teacherName: 'Profª Juliana Martins',
    active: true,
    daysOfWeek: [1, 3, 5], // Seg, Qua, Sex
    startTime: '18:00',
    endTime: '19:30',
    durationHours: 1.5,
    category: 'Funcional',
    location: 'Box CrossFit Arena'
  },
  {
    id: 'turma-5',
    name: 'Escola de Goleiros & Fundamentos',
    teacherId: 'prof-2',
    teacherName: 'Prof. Carlos Eduardo Santos',
    active: true,
    daysOfWeek: [6], // Sábado
    startTime: '09:00',
    endTime: '11:00',
    durationHours: 2.0,
    category: 'Especializada',
    location: 'Campo Society 2'
  },
  {
    id: 'turma-6',
    name: 'Avaliações Biomecânicas e Plantão',
    teacherId: 'prof-1',
    teacherName: 'Prof. Rodrigo Tavares',
    active: true,
    daysOfWeek: [2, 4], // Ter, Qui
    startTime: '14:00',
    endTime: '17:00',
    durationHours: 3.0,
    category: 'Avaliação',
    location: 'Sala de Fisiologia e Avaliação'
  }
];

export const INITIAL_EVENTOS: ProfEventAvulso[] = [
  {
    id: 'event-1',
    name: 'Torneio Inter-Turmas Ville Blanche Sport',
    date: '2026-09-28',
    startTime: '08:00',
    endTime: '13:00',
    durationHours: 5.0,
    teacherId: 'prof-2',
    teacherName: 'Prof. Carlos Eduardo Santos',
    location: 'Campo Society 1 & 2',
    description: 'Etapa eliminatória do torneio de futebol infantil'
  },
  {
    id: 'event-2',
    name: 'Aulão Especial Beneficente de Primavera',
    date: '2026-09-30',
    startTime: '19:00',
    endTime: '21:00',
    durationHours: 2.0,
    teacherId: 'prof-3',
    teacherName: 'Profª Juliana Martins',
    location: 'Quadra Externa Poliesportiva',
    description: 'Aulão funcional com arrecadação de alimentos'
  }
];

// Pre-fill some realistic records for September 2026
export const INITIAL_RECORDS: ProfClassRecord[] = [
  {
    id: 'rec-1',
    teacherId: 'prof-2',
    turmaId: 'turma-1',
    turmaName: 'Futebol Sub-9 • Turma Manhã',
    date: '2026-09-21',
    hours: 1.5,
    hourlyRateApplied: 60,
    totalValue: 90,
    timestamp: '2026-09-21T10:05:00.000Z'
  },
  {
    id: 'rec-2',
    teacherId: 'prof-1',
    turmaId: 'turma-3',
    turmaName: 'Musculação & Hipertrofia • Sala 1',
    date: '2026-09-21',
    hours: 3.0,
    hourlyRateApplied: 65,
    totalValue: 195,
    timestamp: '2026-09-21T10:02:00.000Z'
  },
  {
    id: 'rec-3',
    teacherId: 'prof-3',
    turmaId: 'turma-4',
    turmaName: 'Cross Training & Funcional Intenso',
    date: '2026-09-21',
    hours: 1.5,
    hourlyRateApplied: 70,
    totalValue: 105,
    timestamp: '2026-09-21T19:35:00.000Z'
  },
  {
    id: 'rec-4',
    teacherId: 'prof-2',
    turmaId: 'turma-2',
    turmaName: 'Futebol Sub-11 & Sub-13 • Turma Tarde',
    date: '2026-09-22',
    hours: 1.5,
    hourlyRateApplied: 60,
    totalValue: 90,
    timestamp: '2026-09-22T16:32:00.000Z'
  },
  {
    id: 'rec-5',
    teacherId: 'prof-1',
    turmaId: 'turma-3',
    turmaName: 'Musculação & Hipertrofia • Sala 1',
    date: '2026-09-22',
    hours: 3.0,
    hourlyRateApplied: 65,
    totalValue: 195,
    timestamp: '2026-09-22T10:01:00.000Z'
  },
  {
    id: 'rec-6',
    teacherId: 'prof-2',
    turmaId: 'turma-1',
    turmaName: 'Futebol Sub-9 • Turma Manhã',
    date: '2026-09-23',
    hours: 1.5,
    hourlyRateApplied: 60,
    totalValue: 90,
    timestamp: '2026-09-23T10:04:00.000Z'
  },
  {
    id: 'rec-7',
    teacherId: 'prof-3',
    turmaId: 'turma-4',
    turmaName: 'Cross Training & Funcional Intenso',
    date: '2026-09-23',
    hours: 1.5,
    hourlyRateApplied: 70,
    totalValue: 105,
    timestamp: '2026-09-23T19:31:00.000Z'
  },
  {
    id: 'rec-8',
    teacherId: 'prof-2',
    turmaId: 'turma-2',
    turmaName: 'Futebol Sub-11 & Sub-13 • Turma Tarde',
    date: '2026-09-24',
    hours: 1.5,
    hourlyRateApplied: 60,
    totalValue: 90,
    timestamp: '2026-09-24T16:35:00.000Z'
  },
  {
    id: 'rec-9',
    teacherId: 'prof-1',
    turmaId: 'turma-3',
    turmaName: 'Musculação & Hipertrofia • Sala 1',
    date: '2026-09-24',
    hours: 3.0,
    hourlyRateApplied: 65,
    totalValue: 195,
    timestamp: '2026-09-24T10:00:00.000Z'
  },
  {
    id: 'rec-10',
    teacherId: 'prof-2',
    eventId: 'event-1',
    turmaName: 'Torneio Inter-Turmas Ville Blanche Sport',
    date: '2026-09-28',
    hours: 5.0,
    hourlyRateApplied: 60,
    totalValue: 300,
    timestamp: '2026-09-28T13:10:00.000Z'
  },
  {
    id: 'rec-11',
    teacherId: 'prof-1',
    turmaId: 'turma-3',
    turmaName: 'Musculação & Hipertrofia • Sala 1',
    date: '2026-09-28',
    hours: 3.0,
    hourlyRateApplied: 65,
    totalValue: 195,
    timestamp: '2026-09-28T10:05:00.000Z'
  },
  {
    id: 'rec-12',
    teacherId: 'prof-1',
    turmaId: 'turma-3',
    turmaName: 'Musculação & Hipertrofia • Sala 1',
    date: '2026-09-29',
    hours: 3.0,
    hourlyRateApplied: 65,
    totalValue: 195,
    timestamp: '2026-09-29T10:03:00.000Z'
  },
  {
    id: 'rec-13',
    teacherId: 'prof-2',
    turmaId: 'turma-2',
    turmaName: 'Futebol Sub-11 & Sub-13 • Turma Tarde',
    date: '2026-09-29',
    hours: 1.5,
    hourlyRateApplied: 60,
    totalValue: 90,
    timestamp: '2026-09-29T16:31:00.000Z'
  },
  {
    id: 'rec-14',
    teacherId: 'prof-3',
    eventId: 'event-2',
    turmaName: 'Aulão Especial Beneficente de Primavera',
    date: '2026-09-30',
    hours: 2.0,
    hourlyRateApplied: 70,
    totalValue: 140,
    timestamp: '2026-09-30T21:05:00.000Z'
  }
];

// Helper to compute duration in hours from "08:00" and "09:30"
export function calculateDurationHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 1;
  try {
    const [h1, m1] = startTime.split(':').map(Number);
    const [h2, m2] = endTime.split(':').map(Number);
    const diff = (h2 + m2 / 60) - (h1 + m1 / 60);
    return diff > 0 ? parseFloat(diff.toFixed(2)) : 1;
  } catch {
    return 1;
  }
}

// Data persistence helpers
export function getFolhaTeachers(): TeacherProfile[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  } catch {
    return INITIAL_TEACHERS;
  }
}

export function saveFolhaTeachers(teachers: TeacherProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    import('./firebaseDbService').then(({ syncCollectionToFirestore }) => {
      syncCollectionToFirestore('folha_teachers', teachers);
    }).catch(err => {
      console.warn('Sync folha teachers to firestore skipped:', err);
    });
  } catch (e) {
    console.error('Error saving folha teachers:', e);
  }
}

export function getFolhaTurmas(): ProfTurma[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.TURMAS);
    return saved ? JSON.parse(saved) : INITIAL_TURMAS;
  } catch {
    return INITIAL_TURMAS;
  }
}

export function saveFolhaTurmas(turmas: ProfTurma[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TURMAS, JSON.stringify(turmas));
    import('./firebaseDbService').then(({ syncCollectionToFirestore }) => {
      syncCollectionToFirestore('folha_turmas', turmas);
    }).catch(err => {
      console.warn('Sync folha turmas to firestore skipped:', err);
    });
  } catch (e) {
    console.error('Error saving folha turmas:', e);
  }
}

export function getFolhaEventos(): ProfEventAvulso[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTOS);
    return saved ? JSON.parse(saved) : INITIAL_EVENTOS;
  } catch {
    return INITIAL_EVENTOS;
  }
}

export function saveFolhaEventos(eventos: ProfEventAvulso[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTOS, JSON.stringify(eventos));
  } catch (e) {
    console.error('Error saving folha eventos:', e);
  }
}

export function getFolhaRecords(): ProfClassRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  } catch {
    return INITIAL_RECORDS;
  }
}

export function saveFolhaRecords(records: ProfClassRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    import('./firebaseDbService').then(({ syncCollectionToFirestore }) => {
      syncCollectionToFirestore('folha_ponto', records);
      syncCollectionToFirestore('folha_records', records);
    }).catch(err => {
      console.warn('Sync folha ponto to firestore skipped:', err);
    });
  } catch (e) {
    console.error('Error saving folha records:', e);
  }
}

// Iniciar assinaturas em tempo real do Folha de Ponto com Firestore
if (typeof window !== 'undefined') {
  import('./firebaseDbService').then(({ subscribeToFirestoreCollection }) => {
    subscribeToFirestoreCollection('folha_teachers', (remote: TeacherProfile[]) => {
      if (remote && remote.length > 0) {
        localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(remote));
      }
    }, INITIAL_TEACHERS);

    subscribeToFirestoreCollection('folha_turmas', (remote: ProfTurma[]) => {
      if (remote && remote.length > 0) {
        localStorage.setItem(STORAGE_KEYS.TURMAS, JSON.stringify(remote));
      }
    }, INITIAL_TURMAS);

    subscribeToFirestoreCollection('folha_records', (remote: ProfClassRecord[]) => {
      if (remote && remote.length > 0) {
        localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(remote));
      }
    }, INITIAL_RECORDS);
  }).catch(() => {});
}

// Calculate projected hours remaining in a month from a reference date
export function calculateProjectedHours(
  turmas: ProfTurma[],
  year: number,
  month: number, // 0-indexed (0 = Jan, 8 = Setembro)
  fromDay: number // e.g. today's day of month + 1
): number {
  let total = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = fromDay; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const dayOfWeek = dateObj.getDay();

    turmas.forEach(turma => {
      if (!turma.active) return;
      if (turma.daysOfWeek.includes(dayOfWeek)) {
        total += turma.durationHours || calculateDurationHours(turma.startTime, turma.endTime);
      }
    });
  }

  return parseFloat(total.toFixed(1));
}

// Month name in Portuguese
export const MONTH_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const DAYS_NAMES_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const DAYS_NAMES_FULL = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
