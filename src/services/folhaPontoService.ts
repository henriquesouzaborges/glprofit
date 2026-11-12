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

export const INITIAL_TEACHERS: TeacherProfile[] = [];

export const INITIAL_TURMAS: ProfTurma[] = [];

export const INITIAL_EVENTOS: ProfEventAvulso[] = [];

export const INITIAL_RECORDS: ProfClassRecord[] = [];

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
