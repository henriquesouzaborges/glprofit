import { GymSettings, Student, WorkoutPlan } from './types';

export const INITIAL_SETTINGS: GymSettings = {
  gymName: "GL PRO FIT",
  tradeName: "GL PRO FIT Academia",
  cnpj: "45.892.104/0001-98",
  phone: "(11) 99999-9999",
  email: "contato@glprofit.com.br",
  address: "Av. Paulista, 1000",
  city: "São Paulo",
  state: "SP",
  gracePeriodDays: 5,
  autoBlockOverdue: true,
  pixKey: "45892104000198",
  welcomeMessage: "Bem-vindo ao GL PRO FIT!"
};

export const INITIAL_STUDENTS: Student[] = [];
export const INITIAL_TEACHERS: any[] = [];
export const INITIAL_CLASSES: any[] = [];
export const INITIAL_TRANSACTIONS: any[] = [];
export const INITIAL_EXERCISES: any[] = [
  { id: "1", name: "Supino Reto com Barra", muscleGroup: "Peitoral", equipment: "Barra", difficulty: "Intermediário", primaryMuscle: "Peitoral Maior", instructions: ["Deite no banco", "Pegue a barra", "Desça até o peito e empurre"] },
  { id: "2", name: "Agachamento Livre", muscleGroup: "Pernas", equipment: "Barra", difficulty: "Avançado", primaryMuscle: "Quadríceps", instructions: ["Posicione a barra nos trapézios", "Agache controladamente", "Retorne à posição inicial"] }
];
export const INITIAL_WORKOUTS: WorkoutPlan[] = [];
export const INITIAL_EVALUATIONS: any[] = [];
export const INITIAL_NOTIFICATIONS: any[] = [];
export const INITIAL_PARTNER_LICENSES: any[] = [];
export const INITIAL_LEADS: any[] = [];
export const INITIAL_AUTOMATIONS: any[] = [];
export const INITIAL_SURVEYS: any[] = [];
export const INITIAL_CALENDAR_EVENTS: any[] = [];
export const INITIAL_PLANS: any[] = [];
export const INITIAL_PRODUCTS: any[] = [];
export const INITIAL_COMANDAS: any[] = [];
export const INITIAL_STOCK_MOVEMENTS: any[] = [];
export const INITIAL_SUPPLIERS: any[] = [];
export const INITIAL_PAY_RECURRING: any[] = [];
export const INITIAL_PAYMENT_LINKS: any[] = [];
export const INITIAL_CRM_ACTIVITIES: any[] = [];
export const INITIAL_CRM_AUTOMATIONS: any[] = [];
export const INITIAL_SATISFACTION_SURVEYS: any[] = [];
