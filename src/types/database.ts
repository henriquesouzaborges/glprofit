/**
 * GL PRO FIT - Tipos de Banco de Dados (Fase 2.1 - Tópico 1)
 * Mapeamento estrito das entidades mantendo 100% de compatibilidade
 * com as interfaces de domínio existentes em src/types.ts.
 */

import { 
  Student, 
  WorkoutPlan, 
  ExerciseCatalogItem, 
  ExerciseLoadLog,
  Plan, 
  WhatsappChat, 
  WhatsappMessage, 
  Lead, 
  FinancialTransaction, 
  Product, 
  Comanda,
  PayRecurringCharge
} from '../types';

// ==========================================
// 1. STUDENTS & REGISTRATION
// ==========================================
export type StudentEntity = Student & {
  createdAt?: string;
  updatedAt?: string;
  syncedWithCloud?: boolean;
};

export type PlanEntity = Plan & {
  createdAt?: string;
  updatedAt?: string;
};

// ==========================================
// 2. WORKOUTS & PRESCRIÇÃO
// ==========================================
export type WorkoutEntity = WorkoutPlan & {
  createdAt?: string;
  updatedAt?: string;
};

export type ExerciseEntity = ExerciseCatalogItem & {
  createdAt?: string;
  updatedAt?: string;
};

export type LoadHistoryRecord = ExerciseLoadLog & {
  createdAt?: string;
};

// ==========================================
// 3. WHATSAPP & CRM KANBAN
// ==========================================
export type WhatsAppChatEntity = WhatsappChat & {
  createdAt?: string;
  updatedAt?: string;
};

export type WhatsAppMessageEntity = WhatsappMessage & {
  createdAt?: string;
};

export type CRMLeadEntity = Lead & {
  createdAt?: string;
  updatedAt?: string;
};

// ==========================================
// 4. FINANCIAL & SUBSCRIPTIONS
// ==========================================
export type FinancialTransactionEntity = FinancialTransaction & {
  createdAt?: string;
  updatedAt?: string;
};

export type SubscriptionEntity = PayRecurringCharge & {
  createdAt?: string;
  updatedAt?: string;
};

// ==========================================
// 5. PRODUCTS & ORDERS (PDV / COMANDAS)
// ==========================================
export type ProductEntity = Product & {
  createdAt?: string;
  updatedAt?: string;
};

export type OrderEntity = Comanda & {
  createdAt?: string;
  updatedAt?: string;
};

// ==========================================
// METADADOS DO BANCO & MIGRATION STATE
// ==========================================
export interface MigrationState {
  isMigrated: boolean;
  migratedAt?: string;
  version: string;
  itemsMigrated: {
    students: number;
    workouts: number;
    chats: number;
    messages: number;
    transactions: number;
    products: number;
  };
}
